import os
from tempfile import mkdtemp
from zipfile import ZipFile
from typing import Dict, List
from pathlib import Path
import pickle
from datetime import datetime

import pytest
from unittest.mock import patch, Mock
from pdfrw import PdfString
from dacite import from_dict

from expungeservice.expunger import Expunger
from expungeservice.form_filling import FormFilling, PDF, UserInfo, CaseResults
from expungeservice.record_merger import RecordMerger
from expungeservice.record_summarizer import RecordSummarizer
from expungeservice.models.case import Case
from expungeservice.models.charge import Charge
from expungeservice.models.charge_types.contempt_of_court import ContemptOfCourt
from expungeservice.models.charge_types.felony_class_b import FelonyClassB
from expungeservice.models.charge_types.felony_class_c import FelonyClassC
from expungeservice.models.charge_types.marijuana_eligible import MarijuanaViolation
from expungeservice.models.charge_types.misdemeanor_class_a import MisdemeanorClassA
from expungeservice.models.charge_types.misdemeanor_class_bc import MisdemeanorClassBC
from expungeservice.models.charge_types.reduced_to_violation import ReducedToViolation
from expungeservice.models.charge_types.violation import Violation
from expungeservice.models.expungement_result import ChargeEligibilityStatus
from expungeservice.util import DateWithFuture

from tests.factories.crawler_factory import CrawlerFactory
from tests.factories.charge_factory import ChargeFactory
from tests.fixtures.case_details import CaseDetails
from tests.fixtures.john_doe import JohnDoe
from tests.integration.form_filling_data import (
    oregon_john_common_pdf_fields,
    multnomah_arrest_john_common_pdf_fields,
    multnomah_conviction_john_common_pdf_fields,
    oregon_arrest_john_common_pdf_fields,
    oregon_conviction_john_common_pdf_fields,
)


def test_normal_conviction_uses_multnomah_conviction_form():
    record = CrawlerFactory.create(JohnDoe.SINGLE_CASE_RECORD, {"CASEJD1": CaseDetails.CASEJD74})
    expunger_result = Expunger.run(record)
    merged_record = RecordMerger.merge([record], [expunger_result], [])
    record_summary = RecordSummarizer.summarize(merged_record, {})
    user_information = {
        "full_name": "",
        "date_of_birth": "",
        "phone_number": "",
        "mailing_address": "",
        "city": "",
        "state": "",
        "zip_code": "",
    }
    zip_path, zip_name = FormFilling.build_zip(record_summary, user_information)
    temp_dir = mkdtemp()
    with ZipFile(zip_path, "r") as zip_ref:
        zip_ref.extractall(temp_dir)
        for _root, _dir, files in os.walk(temp_dir):
            assert len(files) == 1


#########################################


class TestJohnCommonIntegration:
    filename = "oregon.pdf"
    BASE_DIR = os.path.join(Path(__file__).parent.parent, "expungeservice", "files")
    expected_form_values = oregon_john_common_pdf_fields

    @patch("expungeservice.form_filling.FormFilling._get_file_name_for_case")
    @patch("expungeservice.form_filling.PdfWriter", autospec=True)
    @patch("expungeservice.form_filling.ZipFile")
    @patch("expungeservice.form_filling.mkdtemp")
    def test_form_fields_are_filled(self, mock_mkdtemp, MockZipFile, MockPdfWriter, mock_get_file_name_for_case):
        mock_mkdtemp.return_value = "foo"
        mock_get_file_name_for_case.return_value = self.filename

        user_information = {
            "full_name": "John FullName Common",
            "date_of_birth": "11/22/1999",
            "mailing_address": "12345 NE Test Suite Drive #123",
            "phone_number": "555-555-1234",
            "city": "Portland",
            "state": "OR",
            "zip_code": "97222",
        }
        # The pickle file was generated by setting the system date to 3/2/23 and using:
        # alias = {"first_name": "john", "middle_name": "", "last_name": "common", "birth_date": ""}
        # record_summary = Demo._build_record_summary([alias], {}, {}, Search._build_today("1/2/2023"))
        pickle_file = os.path.join(Path(__file__).parent, "fixtures", "john_common_record_summary.pickle")
        with open(pickle_file, "rb") as file:
            record_summary = pickle.load(file)

        FormFilling.build_zip(record_summary, user_information)

        addpages_call_args_list = MockPdfWriter.return_value.addpages.call_args_list
        for i, args_list in enumerate(addpages_call_args_list):
            document_id = "document_" + str(i)
            args, kwargs = args_list
            pages = args[0]
            for idx, page in enumerate(pages):
                for annotation in page.Annots or []:
                    assert self.expected_form_values[document_id][idx][annotation.T] == annotation.V, annotation.T

        write_call_args_list = MockPdfWriter.return_value.write.call_args_list
        file_paths = [write_call_args_list[i][0][0] for i, _ in enumerate(write_call_args_list)]
        expected_file_paths = [
            "foo/COMMON NAME_200000_benton.pdf",
            "foo/COMMON NAME_110000_baker.pdf",
            "foo/COMMON A NAME_120000_baker.pdf",
            "foo/OSP_Form.pdf",
        ]
        assert set(file_paths) == set(expected_file_paths)


class TestJohnCommonArrestIntegration(TestJohnCommonIntegration):
    filename = "oregon_with_arrest_order.pdf"
    expected_form_values = oregon_arrest_john_common_pdf_fields


class TestJohnCommonConvictionIntegration(TestJohnCommonIntegration):
    filename = "oregon_with_conviction_order.pdf"
    expected_form_values = oregon_conviction_john_common_pdf_fields


class TestJohnCommonMultnomahArrestIntegration(TestJohnCommonIntegration):
    filename = "multnomah_arrest.pdf"
    expected_form_values = multnomah_arrest_john_common_pdf_fields


class TestJohnCommonMultnomahConvictionIntegration(TestJohnCommonIntegration):
    filename = "multnomah_conviction.pdf"
    expected_form_values = multnomah_conviction_john_common_pdf_fields


#########################################


class TestPDFFileNameAndDownloadPath:
    dir_path = os.path.join(Path(__file__).parent.parent, "expungeservice", "files")

    def mock_case_results(self, county, has_convictions):
        mock_case_results = Mock()
        mock_case_results.county = county
        mock_case_results.case_name = "case_name"
        mock_case_results.case_number = "case_number"
        mock_case_results.has_conviction = has_convictions
        return mock_case_results

    def assert_correct_pdf_file_name(self, county: str, expected_file_name: str, has_convictions: bool = True):
        res = self.mock_case_results(county, has_convictions)
        file_name = FormFilling._get_file_name_for_case(res)

        assert file_name == expected_file_name

    def assert_correct_file_path(self, county: str, expected_file_name: str, has_convictions: bool):
        res = self.mock_case_results(county, has_convictions)
        file_name, file_path = FormFilling._build_download_file_path("dir", res)

        assert file_name == "case_name_case_number_" + expected_file_name
        assert file_path == "dir/case_name_case_number_" + expected_file_name

    def test_correct_pdf_path_is_built(self):
        self.assert_correct_pdf_file_name("Douglas", FormFilling.OREGON_ARREST_PDF_NAME, has_convictions=False)
        self.assert_correct_pdf_file_name("Douglas", FormFilling.OREGON_CONVICTION_PDF_NAME, has_convictions=True)

        self.assert_correct_pdf_file_name("Umatilla", FormFilling.OREGON_ARREST_PDF_NAME, has_convictions=False)
        self.assert_correct_pdf_file_name("Umatilla", FormFilling.OREGON_CONVICTION_PDF_NAME, has_convictions=True)

        self.assert_correct_pdf_file_name("Multnomah", FormFilling.MULTNOMAH_ARREST_PDF_NAME, has_convictions=False)
        self.assert_correct_pdf_file_name("Multnomah", FormFilling.MULTNOMAH_CONVICTION_PDF_NAME, has_convictions=True)

        self.assert_correct_pdf_file_name("unknown", FormFilling.DEFAULT_PDF_NAME, has_convictions=False)
        self.assert_correct_pdf_file_name("unknown", FormFilling.DEFAULT_PDF_NAME, has_convictions=True)

    def test_correct_file_path_is_built(self):
        self.assert_correct_file_path("Douglas", "douglas_with_arrest_order.pdf", has_convictions=False)
        self.assert_correct_file_path("Douglas", "douglas_with_conviction_order.pdf", has_convictions=True)

        self.assert_correct_file_path("Umatilla", "umatilla_with_arrest_order.pdf", has_convictions=False)
        self.assert_correct_file_path("Umatilla", "umatilla_with_conviction_order.pdf", has_convictions=True)

        self.assert_correct_file_path("Other", "other.pdf", has_convictions=False)
        self.assert_correct_file_path("Other", "other.pdf", has_convictions=True)


#########################################


def assert_pdf_values(pdf: PDF, expected: Dict[str, str], opts=None):
    annotation_dict = pdf.get_annotation_dict()

    if opts is None:
        opts = {}

    if not opts.get("paren_values"):
        opts["paren_values"] = False

    if not opts.get("constant_fields"):
        opts["constant_fields"] = {}

    def encoded_value(value: str):
        if value != PDF.BUTTON_ON and not opts.get("paren_values"):
            return PdfString.encode(value)
        return value

    for key, _value in expected.items():
        value = encoded_value(_value)
        assert annotation_dict[key].V == value, key

    # Ensure other fields are not set.
    if opts and opts.get("assert_other_fields_empty"):
        for key in set(annotation_dict) - set(expected):
            value = annotation_dict[key].V
            if annotation_dict[key].FT == PDF.TEXT_TYPE:
                assert value is None, key
            if annotation_dict[key].FT == PDF.BUTTON_TYPE:
                assert value != PDF.BUTTON_ON, key


#########################################


class TestBuildOSPPDF:
    def test_user_info_is_placed_in_osp_form(self):
        user_data = {
            "full_name": "foo bar",
            "date_of_birth": "1/2/1999",
            "mailing_address": "1234 NE Dev St. #12",
            "city": "Portland",
            "state": "OR",
            "zip_code": "97111",
            "phone_number": "555-555-1234",
        }
        expected_values = {
            "(Full Name)": "(foo bar)",
            "(Date of Birth)": "(1/2/1999)",
            "(Phone Number)": "(555-555-1234)",
            "(Mailing Address)": "(1234 NE Dev St. #12)",
            "(City)": "(Portland)",
            "(State)": "(OR)",
            "(Zip Code)": "(97111)",
        }
        user_info = from_dict(data_class=UserInfo, data=user_data)
        pdf = FormFilling._build_pdf(user_info, validate_initial_pdf_state=True)
        assert_pdf_values(pdf, expected_values, {"assert_other_fields_empty": True, "paren_values": True})


class TestBuildOregonPDF:
    user_data = {
        "full_name": "foo bar",
        "date_of_birth": "1/2/1999",
        "mailing_address": "1234 NE Dev St. #12",
        "city": "Portland",
        "state": "OR",
        "zip_code": "97111",
        "phone_number": "555-555-1234",
    }
    expected_base_values = {
        # county
        "(FOR THE COUNTY OF)": "(Washington)",
        # constant
        "(Plaintiff)": "(State of Oregon)",
        # case_name
        "(Defendant)": "(Case Name 0)",
        # date_of_birth
        "(DOB)": "(1/2/1999)",
        # sid
        "(SID)": "(sid0)",
        # True
        "(I am not currently charged with a crime)": "/On",
        "(The arrest or citation I want to set aside is not for a charge of Driving Under the Influence of)": "/On",
        # arrest_dates
        "(Date of arrest)": "(Feb 3, 2020)",
        # True
        "(have sent)": "/On",
        # full_name
        "(Name typed or printed)": "(foo bar)",
        # mailing_address, city, state, zip_code, phone_number
        "(Address)": "(1234 NE Dev St. #12,    Portland,    OR,    97111,    555-555-1234)",
        # da_address
        "(the District Attorney at address 2)": "(District Attorney - 150 N First Avenue, Suite 300 - Hillsboro, OR 97124-3002)",
        # full_name
        "(Name typed or printed_2)": "(foo bar)",
    }
    expected_conviction_values = {
        # case_number_with_comments
        "(Case No)": "(base case number)",
        # not has_no_complaint
        "(record of arrest with charges filed and the associated check all that apply)": "/On",
        # conviction_dates
        "(Date of conviction contempt finding or judgment of GEI)": "(Dec 3, 1999)",
        # has_conviction
        "(conviction)": "/On",
        "(ORS 137225 does not prohibit a setaside of this conviction see Instructions)": "/On",
        "(I have fully completed complied with or performed all terms of the sentence of the court)": "/On",
    }
    expected_violation_values = {
        # has_violation_or_contempt_of_court
        "(Violation or Contempt of Court and)": "/On",
        "(1 year has passed since the later of the convictionfindingjudgment or release_2)": "/On",
        "(I have not been convicted of any other offense or found guilty except for insanity_2)": "/On",
    }

    @pytest.fixture
    def user_info(self):
        return from_dict(data_class=UserInfo, data=self.user_data)

    @pytest.fixture
    def charge(self) -> Charge:
        charge = Mock(spec=Charge)
        charge.date = DateWithFuture.fromdatetime(datetime(2020, 2, 3))
        charge.name = "a bad thing"
        charge.edit_status = "not delete"
        return charge

    @pytest.fixture
    def conviction_charge(self, charge) -> Charge:
        charge.expungement_result.charge_eligibility.status = ChargeEligibilityStatus.ELIGIBLE_NOW
        charge.charge_type = FelonyClassB()
        charge.disposition = Mock()
        charge.disposition.date = DateWithFuture.fromdatetime(datetime(1999, 12, 3))
        charge.convicted.return_value = True
        charge.dismissed.return_value = False
        charge.probation_revoked = False
        return charge

    @pytest.fixture
    def case(self, charge) -> Case:
        case = Mock(spec=Case)
        case.summary = Mock(autospec=True)
        case.summary.balance_due_in_cents = 0
        case.summary.location = "Washington"
        case.summary.name = "Case Name 0"
        case.summary.district_attorney_number = "DA num 0"
        case.summary.case_number = "base case number"
        case.charges = [charge]
        return case

    @pytest.fixture
    def pdf(self, case, user_info):
        def factory(charges: List[Charge]) -> PDF:
            case.charges = charges
            case_results = CaseResults.build(case, user_info, sid="sid0")
            return FormFilling._build_pdf(case_results, validate_initial_pdf_state=True)

        return factory

    def assert_pdf_values(self, pdf: PDF, new_expected_values):
        all_expected_values = {**self.expected_base_values, **new_expected_values}
        assert_pdf_values(pdf, all_expected_values, {"assert_other_fields_empty": True, "paren_values": True})

    ############# tests #############

    def test_oregon_base_case(self, case, user_info):
        new_expected_values = {
            # case_number_with_comments
            "(Case No)": "(base case number \\(charge  only\\))",
            # not has_no_complaint
            "(record of arrest with charges filed and the associated check all that apply)": "/On",
        }
        case_results = CaseResults.build(case, user_info, sid="sid0")
        pdf = FormFilling._build_pdf(case_results)
        self.assert_pdf_values(pdf, new_expected_values)

    def test_has_no_complaint_has_dismissed(self, charge: Charge, pdf: PDF):
        new_expected_values = {
            # has_no_complaint
            "(record of arrest with no charges filed)": "/On",
            "(no accusatory instrument was filed and at least 60 days have passed since the)": "/On",
            # has_dismissed
            "(an accusatory instrument was filed and I was acquitted or the case was dismissed)": "/On",
            "(record of citation or charge that was dismissedacquitted)": "/On",
            # case_number_with_comments
            "(Case No)": "(base case number)",
        }
        charge.expungement_result.charge_eligibility.status = ChargeEligibilityStatus.ELIGIBLE_NOW
        charge.charge_type = Mock()
        charge.disposition = Mock()
        self.assert_pdf_values(pdf([charge]), new_expected_values)

    ##### conviction #####

    def test_has_probation_revoked(self, conviction_charge: Charge, pdf: PDF):
        new_expected_values = {
            "(I was sentenced to probation in this case and)": "/On",
            "(My probation WAS revoked and 3 years have passed since the date of revocation)": "/On",
        }
        conviction_charge.charge_type = Mock()
        conviction_charge.probation_revoked = True
        self.assert_pdf_values(pdf([conviction_charge]), {**self.expected_conviction_values, **new_expected_values})

    def test_has_class_b_felony(self, conviction_charge: Charge, pdf: PDF):
        new_expected_values = {
            "(Felony  Class B and)": "/On",
            "(7 years have passed since the later of the convictionjudgment or release date and)": "/On",
            "(I have not been convicted of any other offense or found guilty except for insanity in)": "/On",
        }
        conviction_charge.charge_type = FelonyClassB()
        self.assert_pdf_values(pdf([conviction_charge]), {**self.expected_conviction_values, **new_expected_values})

    def test_has_class_c_felony(self, conviction_charge: Charge, pdf: PDF):
        new_expected_values = {
            "(Felony  Class C and)": "/On",
            "(5 years have passed since the later of the convictionjudgment or release date and)": "/On",
            "(I have not been convicted of any other offense or found guilty except for insanity in_2)": "/On",
        }
        conviction_charge.charge_type = FelonyClassC()
        self.assert_pdf_values(pdf([conviction_charge]), {**self.expected_conviction_values, **new_expected_values})

    def test_has_class_a_misdeanor(self, conviction_charge: Charge, pdf: PDF):
        new_expected_values = {
            "(Misdemeanor  Class A and)": "/On",
            "(3 years have passed since the later of the convictionjudgment or release date and)": "/On",
            "(I have not been convicted of any other offense or found guilty except for insanity in_3)": "/On",
        }
        conviction_charge.charge_type = MisdemeanorClassA()
        self.assert_pdf_values(pdf([conviction_charge]), {**self.expected_conviction_values, **new_expected_values})

    def test_has_class_bc_misdeanor(self, conviction_charge: Charge, pdf: PDF):
        new_expected_values = {
            "(Misdemeanor  Class B or C and)": "/On",
            "(1 year has passed since the later of the convictionfindingjudgment or release)": "/On",
            "(I have not been convicted of any other offense or found guilty except for insanity)": "/On",
        }
        conviction_charge.charge_type = MisdemeanorClassBC()
        self.assert_pdf_values(pdf([conviction_charge]), {**self.expected_conviction_values, **new_expected_values})

    def test_has_violation(self, conviction_charge: Charge, pdf: PDF):
        for charge_type in [Violation, ReducedToViolation, MarijuanaViolation]:
            conviction_charge.charge_type = charge_type()
            self.assert_pdf_values(
                pdf([conviction_charge]), {**self.expected_conviction_values, **self.expected_violation_values}
            )

    def test_has_contempt_of_court(self, conviction_charge: Charge, pdf: PDF):
        new_expected_values = {
            "(contempt of court finding)": "/On",
        }
        conviction_charge.charge_type = ContemptOfCourt()
        all_expected_values = {
            **self.expected_conviction_values,
            **self.expected_violation_values,
            **new_expected_values,
        }
        self.assert_pdf_values(pdf([conviction_charge]), all_expected_values)

    ##### charge.charge_type.severity_level #####

    def test_has_felony_class_c_severity_level(self, conviction_charge: Charge, pdf: PDF):
        new_expected_values = {
            "(Felony  Class C and)": "/On",
            "(5 years have passed since the later of the convictionjudgment or release date and)": "/On",
            "(I have not been convicted of any other offense or found guilty except for insanity in_2)": "/On",
        }
        conviction_charge.charge_type = Mock()
        conviction_charge.charge_type.severity_level = "Felony Class C"
        self.assert_pdf_values(pdf([conviction_charge]), {**self.expected_conviction_values, **new_expected_values})

    def test_has_misdemeanor_class_a_severity_level(self, conviction_charge: Charge, pdf: PDF):
        new_expected_values = {
            "(Misdemeanor  Class A and)": "/On",
            "(3 years have passed since the later of the convictionjudgment or release date and)": "/On",
            "(I have not been convicted of any other offense or found guilty except for insanity in_3)": "/On",
        }
        conviction_charge.charge_type = Mock()
        conviction_charge.charge_type.severity_level = "Misdemeanor Class A"
        self.assert_pdf_values(pdf([conviction_charge]), {**self.expected_conviction_values, **new_expected_values})

        # for k, v in pdf.get_field_dict().items():
        #     print(f'"{k}": "{v}",')


# TODO test multiple case.charges generate joined values
