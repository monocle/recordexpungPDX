import os
from dataclasses import dataclass, replace
from os import path
from pathlib import Path
from tempfile import mkdtemp
from typing import List, Dict, Tuple, Optional, Union
from zipfile import ZipFile
from collections import UserDict

from expungeservice.models.case import Case
from expungeservice.models.charge import Charge, EditStatus
from expungeservice.models.charge_types.contempt_of_court import ContemptOfCourt
from expungeservice.models.charge_types.felony_class_b import FelonyClassB
from expungeservice.models.charge_types.felony_class_c import FelonyClassC
from expungeservice.models.charge_types.marijuana_eligible import MarijuanaViolation, MarijuanaEligible
from expungeservice.models.charge_types.misdemeanor_class_a import MisdemeanorClassA
from expungeservice.models.charge_types.misdemeanor_class_bc import MisdemeanorClassBC
from expungeservice.models.charge_types.reduced_to_violation import ReducedToViolation
from expungeservice.models.charge_types.violation import Violation
from expungeservice.models.record_summary import RecordSummary
from expungeservice.pdf.markdown_to_pdf import MarkdownToPDF

from pdfrw import PdfReader, PdfWriter, PdfDict, PdfObject, PdfName, PdfString


class FormFilling:
    OREGON_ARREST_PDF_NAME = "oregon_with_arrest_order.pdf"
    OREGON_CONVICTION_PDF_NAME = "oregon_with_conviction_order.pdf"
    MULTNOMAH_ARREST_PDF_NAME = "multnomah_arrest.pdf"
    MULTNOMAH_CONVICTION_PDF_NAME = "multnomah_conviction.pdf"
    OSP_PDF_NAME = "OSP_Form.pdf"
    DEFAULT_PDF_NAME = "oregon.pdf"

    @staticmethod
    def build_zip(record_summary: RecordSummary, user_information: Dict[str, str]) -> Tuple[str, str]:
        temp_dir = mkdtemp()
        zip_dir = mkdtemp()
        zip_name = "expungement_packet.zip"
        zip_path = path.join(zip_dir, zip_name)
        zipfile = ZipFile(zip_path, "w")
        sid = FormFilling._unify_sids(record_summary)
        for case in record_summary.record.cases:
            case_without_deleted_charges = replace(
                case, charges=tuple(c for c in case.charges if c.edit_status != EditStatus.DELETE)
            )

            pdf_with_warnings = FormFilling._build_pdf_for_case(case_without_deleted_charges, user_information, sid)
            if pdf_with_warnings:
                pdf, base_file_name, warnings = pdf_with_warnings
                file_name = f"{case_without_deleted_charges.summary.name}_{case_without_deleted_charges.summary.case_number}_{base_file_name}"
                file_path = path.join(temp_dir, file_name)
                writer = PdfWriter()
                writer.addpages(pdf.pages)
                FormFilling._add_warnings(writer, warnings)
                trailer = writer.trailer
                trailer.Root.AcroForm = pdf.Root.AcroForm
                writer.write(file_path, trailer=trailer)
                zipfile.write(file_path, file_name)

        # Add OSP form
        osp_path = path.join(Path(__file__).parent, "files", FormFilling.OSP_PDF_NAME)
        pdf = PDF(osp_path, user_information, {"full_path": True})
        pdf.update_annotations()
        pdf = pdf._pdf

        file_path = path.join(temp_dir, FormFilling.OSP_PDF_NAME)
        writer = PdfWriter()
        writer.addpages(pdf.pages)
        trailer = writer.trailer
        trailer.Root.AcroForm = pdf.Root.AcroForm
        writer.write(file_path, trailer=trailer)
        zipfile.write(file_path, FormFilling.OSP_PDF_NAME)
        zipfile.close()
        return zip_path, zip_name

    @staticmethod
    def _unify_sids(record_summary: RecordSummary) -> str:
        """
        We just take the first non-empty SID for now.
        """
        for case in record_summary.record.cases:
            if case.summary.sid:
                return case.summary.sid
        return ""

    @staticmethod
    def _add_warnings(writer: PdfWriter, warnings: List[str]):
        if warnings:
            text = "# Warnings from RecordSponge  \n"
            text += "Do not submit this page to the District Attorney's office.  \n \n"
            for warning in warnings:
                text += f"\* {warning}  \n"
            blank_pdf_bytes = MarkdownToPDF.to_pdf("Addendum", text)
            blank_pdf = PdfReader(fdata=blank_pdf_bytes)
            writer.addpages(blank_pdf.pages)

    @staticmethod
    def _build_pdf_for_case(
        case: Case, user_information: Dict[str, str], sid: str
    ) -> Optional[Tuple[PdfReader, str, List[str]]]:
        eligible_charges, ineligible_charges = Case.partition_by_eligibility(case.charges)
        in_part = ", ".join([charge.ambiguous_charge_id.split("-")[-1] for charge in eligible_charges])
        case_number_with_comments = (
            f"{case.summary.case_number} (charge {in_part} only)" if ineligible_charges else case.summary.case_number
        )
        if eligible_charges and case.summary.balance_due_in_cents == 0:
            file_name, pdf, warnings  = FormFilling._build_pdf_for_eligible_case(
                case, eligible_charges, user_information, case_number_with_comments, sid
            )
            if ineligible_charges:
                warnings.insert(
                    0,
                    "This form will attempt to expunge a case in part. This is relatively rare, and thus these forms should be reviewed particularly carefully.",
                )
            return pdf, file_name, warnings
        else:
            return None

    @classmethod
    def _build_pdf_for_eligible_case(
        cls,
        case: Case,
        eligible_charges: List[Charge],
        user_information: Dict[str, str],
        case_number_with_comments: str,
        sid: str,
    ) -> Tuple[PdfReader, str, List[str]]:
        charges = case.charges
        charge_names = [charge.name.title() for charge in charges]
        arrest_dates_all = list(set([charge.date.strftime("%b %-d, %Y") for charge in charges]))
        dismissals, convictions = Case.categorize_charges(eligible_charges)
        dismissed_names = [charge.name.title() for charge in dismissals]
        dismissed_arrest_dates = list(set([charge.date.strftime("%b %-d, %Y") for charge in dismissals]))
        dismissed_dates = list(set([charge.disposition.date.strftime("%b %-d, %Y") for charge in dismissals]))
        conviction_names = [charge.name.title() for charge in convictions]
        conviction_dates = list(set([charge.disposition.date.strftime("%b %-d, %Y") for charge in convictions]))
        has_conviction = len(convictions) > 0
        has_dismissals = len(dismissals) > 0
        has_no_complaint = any([charge.no_complaint() for charge in dismissals])
        has_contempt_of_court = any([isinstance(charge.charge_type, ContemptOfCourt) for charge in eligible_charges])

        has_class_b_felony = any([isinstance(charge.charge_type, FelonyClassB) for charge in convictions])
        has_class_c_felony = any(
            [
                isinstance(charge.charge_type, FelonyClassC) or charge.charge_type.severity_level == "Felony Class C"
                for charge in convictions
            ]
        )
        has_class_a_misdemeanor = any(
            [
                isinstance(charge.charge_type, MisdemeanorClassA)
                or charge.charge_type.severity_level == "Misdemeanor Class A"
                for charge in convictions
            ]
        )
        has_class_bc_misdemeanor = any([isinstance(charge.charge_type, MisdemeanorClassBC) for charge in convictions])
        has_violation_or_contempt_of_court = any(
            [
                isinstance(charge.charge_type, Violation)
                or isinstance(charge.charge_type, ReducedToViolation)
                or isinstance(charge.charge_type, ContemptOfCourt)
                or isinstance(charge.charge_type, MarijuanaViolation)
                for charge in convictions
            ]
        )
        has_probation_revoked = any([charge.probation_revoked for charge in convictions])

        da_address = FormFilling._build_da_address(case.summary.location)

        form_data_dict = {
            **user_information,
            "county": case.summary.location,
            "case_number": case_number_with_comments,
            "case_name": case.summary.name,
            "da_number": case.summary.district_attorney_number,
            "sid": sid,
            "has_conviction": has_conviction,
            "has_no_complaint": has_no_complaint,
            "has_dismissed": has_dismissals,
            "has_contempt_of_court": has_contempt_of_court,
            "conviction_dates": "; ".join(conviction_dates),
            "has_class_b_felony": has_class_b_felony,
            "has_class_c_felony": has_class_c_felony,
            "has_class_a_misdemeanor": has_class_a_misdemeanor,
            "has_class_bc_misdemeanor": has_class_bc_misdemeanor,
            "has_violation_or_contempt_of_court": has_violation_or_contempt_of_court,
            "has_probation_revoked": has_probation_revoked,
            "dismissed_arrest_dates": "; ".join(dismissed_arrest_dates),
            "arresting_agency": "",
            "da_address": da_address,
            "arrest_dates_all": "; ".join(arrest_dates_all),
            "charges_all": "; ".join(charge_names),
            "conviction_charges": "; ".join(conviction_names),
            "dismissed_charges": "; ".join(dismissed_names),
            "dismissed_dates": "; ".join(dismissed_dates),
        }
        pdf_path = FormFilling._build_pdf_path(case, convictions)
        file_name = FormFilling._build_base_file_name(case, convictions)
        return (file_name, *PDF.fill_form_values(pdf_path, form_data_dict))

    @staticmethod
    def _build_da_address(location: str) -> str:
        ADDRESSES = {
            "baker": "Baker County Courthouse - 1995 Third Street, Suite 320 - Baker City, OR 97814",
            "benton": "District Attorney's Office - 120 NW 4th St. - Corvallis, OR 97330",
            "clackamas": "807 Main Street - Oregon City, OR 97045",
            "clatsop": "Clatsop County District Attorney’s Office - PO Box 149 - Astoria, OR 97103",
            "columbia": "230 Strand St. - Columbia County Courthouse Annex - St. Helens, OR 97051",
            "coos": "Coos County District Attorney's Office - 250 N. Baxter - Coquille, Oregon 97423",
            "crook": "District Attorney - 300 NE 3rd St, Rm. 34 - Prineville, OR 97754",
            "curry": "District Attorney - 94235 Moore Street, #232 - Gold Beach, OR 97444",
            "deschutes": "District Attorney - 1164 NW Bond St. - Bend, OR 97703",
            "douglas": "District Attorney - 1036 SE Douglas Avenue - Justice Building, Room 204 - Roseburg, OR 97470",
            "gilliam": "District Attorney - 221 S. Oregon St - PO Box 636 - Condon, OR 97823",
            "grant": "District Attorney - 201 South Humbolt Street - Canyon City, Oregon, 97820",
            "harney": "District Attorney - 450 N Buena Vista Ave - Burns, OR 97720",
            "hood_river": "District Attorney - 309 State Street  - Hood River, OR 97031",
            "jackson": "District Attorney - 815 W. 10th Street - Medford, Oregon 97501",
            "jefferson": "District Attorney - 129 SW E Street, Suite 102 - Madras, Oregon 97741",
            "josephine": "District Attorney - 500 NW 6th St #16 - Grants Pass, OR 97526",
            "klamath": "District Attorney - 305 Main Street - Klamath Falls, OR 97601",
            "lake": "District Attorney - 513 Center St, Lakeview, OR 97630",
            "lane": "District Attorney - 125 E 8th Ave - Eugene, OR 97401",
            "lincoln": "District Attorney - 225 W Olive St # 100 - Newport, OR 97365",
            "linn": "District Attorney - PO Box 100 - Albany, Oregon 97321",
            "malheur": "District Attorney - 251 B St. West #6 - Vale, OR 97918",
            "marion": "District Attorney - PO Box 14500 - Salem, OR 97309",
            "morrow": "District Attorney - P.O. Box 664 - Heppner, OR  97836",
            "multnomah": "Multnomah County Central Courthouse - 1200 S.W. 1st Avenue, Suite 5200 - Portland, Oregon 97204",
            "polk": "District Attorney - 850 Main Street - Dallas, OR 97338",
            "sherman": "District Attorney - P.O. Box 393 - Moro, OR 97039",
            "tillamook": "District Attorney - 201 Laurel Ave - Tillamook, OR 97141",
            "umatilla": "District Attorney - 216 SE Court Ave #3 - Pendleton, OR 97801",
            "union": "District Attorney - 1104 K Ave - La Grande, OR 97850",
            "wallowa": "District Attorney - 101 S. River Street, Rm. 201 - Enterprise, OR 97828",
            "wasco": "District Attorney - 511 Washington St #304 - The Dalles, OR 97058",
            "washington": "District Attorney - 150 N First Avenue, Suite 300 - Hillsboro, OR 97124-3002",
            "wheeler": "District Attorney - P.O. Box 512 - Fossil, OR 97830",
            "yamhill": "District Attorney - 535 NE 5th St #117 - McMinnville, OR 97128",
        }
        cleaned_location = location.replace(" ", "_").lower()
        return ADDRESSES.get(cleaned_location, "")

    @staticmethod
    def _build_pdf_path(case: Case, convictions: List[Charge] = None) -> str:
        location = case.summary.location.lower()
        file_name = "oregon.pdf"

        # Douglas and Umatilla counties explicitly want the "Order" part of the old forms too.
        if location in ["douglas", "umatilla"]:
            if convictions:
                file_name = FormFilling.OREGON_CONVICTION_PDF_NAME
            else:
                file_name = FormFilling.OREGON_ARREST_PDF_NAME
        elif location == "multnomah":
            if convictions:
                file_name = FormFilling.MULTNOMAH_CONVICTION_PDF_NAME
            else:
                file_name = FormFilling.MULTNOMAH_ARREST_PDF_NAME

        return path.join(Path(__file__).parent, "files", file_name)

    @staticmethod
    def _build_base_file_name(case: Case, convictions: List[Charge]) -> str:
        location = case.summary.location.lower()

        # Douglas and Umatilla counties explicitly want the "Order" part of the old forms too.
        if location in ["douglas", "umatilla"]:
            if convictions:
                return location + "_with_conviction_order.pdf"
            else:
                return location + "_with_arrest_order.pdf"
        else:
            return location + ".pdf"
        


# https://westhealth.github.io/exploring-fillable-forms-with-pdfrw.html
# https://akdux.com/python/2020/10/31/python-fill-pdf-files/
# https://stackoverflow.com/questions/60082481/how-to-edit-checkboxes-and-save-changes-in-an-editable-pdf-using-the-python-pdfr
#
# Test in: Chrome, Firefox, Safari, Apple Preview and Acrobat Reader.
# When testing generated PDFs, testing must include using the browser to open and view the PDFs.
# Chrome and Firefox seem to have similar behavior while Safari and Apple Preview behvave similarly.
# For example, Apple will show a checked AcroForm checkbox field when an annotation's AP has been set to "".
# while Chrome and Firefox won't.
#
# Note: when printing pdfrw objects to screen during debugginp, not all attributes are displayed. Stream objects
# can have many more nested properties.
class AcroFormMapper(UserDict):
    def __init__(self, form_data: Dict[str, str] = None, definition="oregon"):
        super().__init__()

        self.form_data = form_data or {}
        self.data = getattr(self, definition)
        self.ignored_keys: Dict[str, None] = {}

    def __getitem__(self, key: str) -> str:
        value = super().__getitem__(key)

        if value == "" or isinstance(value, bool):
            return value

        if callable(value):
            return value(self.form_data) or ""

        form_data_value = self.form_data.get(value)
        if form_data_value:
            return form_data_value

        return ""

    def __missing__(self, key: str) -> str:
        self.ignored_keys[key] = True
        return ""

    # Process to create the map:
    # 1. Open the ODJ criminal set aside PDF in Acrobat.
    # 2. Click on "Prepare Form". This will add all of the form's fields and
    #    make them available via Root.AcroForm.Fields in the PDF encoding.
    # 3. Adjust any fields as necessary, ex. move "(Address)" up to the
    #    correct line. Sometimes a AcroForm.Field is created, but no annotation
    #    is assocated with it, ex "undefined" field that has no label. In this
    #    case, delete the filed and create a new text field via the 
    #    "Add a new text field" button. Also, if there are fields with the same
    #    names, then they wont' get annotations and would need to be renamed.
    # 4. Save this as a new PDF.
    # 5. Add to expungeservice/files/ folder.
    #
    # Maps the names of the PDF fields (pdf.Root.AcroForm.Fields or page.Annots)
    # to `form_data_dict` keys used for other forms.
    # The order is what comes out of Root.AcroForm.Fields.
    # Commented fields are those we are not filling in.
    oregon = {
        "(FOR THE COUNTY OF)": "county",
        "(Plaintiff)": lambda _: "State of Oregon",
        "(Case No)": "case_number",
        "(Defendant)": "case_name",
        "(DOB)": "date_of_birth",
        "(SID)": "sid",
        # "(Fingerprint number FPN  if known)"
        "(record of arrest with no charges filed)": "has_no_complaint",
        "(record of arrest with charges filed and the associated check all that apply)": lambda form: not form.get("has_no_complaint"),
        "(conviction)": "has_conviction",
        "(record of citation or charge that was dismissedacquitted)": "has_dismissed",
        "(contempt of court finding)": "has_contempt_of_court",
        # "(finding of Guilty Except for Insanity GEI)"
        # "(provided in ORS 137223)"
        "(I am not currently charged with a crime)": True,
        "(The arrest or citation I want to set aside is not for a charge of Driving Under the Influence of)": True,
        "(Date of conviction contempt finding or judgment of GEI)": "conviction_dates",
        # "(PSRB)"
        "(ORS 137225 does not prohibit a setaside of this conviction see Instructions)": "has_conviction",
        "(Felony  Class B and)": "has_class_b_felony",
        "(Felony  Class C and)": "has_class_c_felony",
        "(Misdemeanor  Class A and)": "has_class_a_misdemeanor",
        "(Misdemeanor  Class B or C and)": "has_class_bc_misdemeanor",
        "(Violation or Contempt of Court and)": "has_violation_or_contempt_of_court",
        "(7 years have passed since the later of the convictionjudgment or release date and)": "has_class_b_felony",
        "(I have not been convicted of any other offense or found guilty except for insanity in)": "has_class_b_felony",
        "(5 years have passed since the later of the convictionjudgment or release date and)": "has_class_c_felony",
        "(I have not been convicted of any other offense or found guilty except for insanity in_2)": "has_class_c_felony",
        "(3 years have passed since the later of the convictionjudgment or release date and)": "has_class_a_misdemeanor",
        "(I have not been convicted of any other offense or found guilty except for insanity in_3)": "has_class_a_misdemeanor",
        "(1 year has passed since the later of the convictionfindingjudgment or release)": "has_class_bc_misdemeanor",
        "(I have not been convicted of any other offense or found guilty except for insanity)": "has_class_bc_misdemeanor",
        "(1 year has passed since the later of the convictionfindingjudgment or release_2)": "has_violation_or_contempt_of_court",
        "(I have not been convicted of any other offense or found guilty except for insanity_2)": "has_violation_or_contempt_of_court",
        "(I have fully completed complied with or performed all terms of the sentence of the court)": "has_conviction",
        "(I was sentenced to probation in this case and)": "has_probation_revoked",
        # "(My probation WAS NOT revoked)"
        "(My probation WAS revoked and 3 years have passed since the date of revocation)": "has_probation_revoked",
        "(Date of arrest)": "arrest_dates_all",
        # "(If no arrest date date of citation booking or incident)": # NEW FIELD
        "(Arresting Agency)": "arresting_agency",
        "(no accusatory instrument was filed and at least 60 days have passed since the)": "has_no_complaint",
        "(an accusatory instrument was filed and I was acquitted or the case was dismissed)": "has_dismissed",
        "(have sent)": True,
        # "(will send a copy of my fingerprints to the Department of State Police)"
        # "(Date)"
        # "(Signature)"
        "(Name typed or printed)": "full_name",
        "(Address)": lambda form: ",    ".join(
            form.get(attr)
            for attr in ("mailing_address", "city", "state", "zip_code", "phone_number")
            if form.get(attr)
        ),
        # "(States mail a true and complete copy of this Motion to Set Aside and Declaration in Support to)"
        # "(delivered or)"
        # "(placed in the United)"
        # "(the District Attorney at address 1)":
        "(the District Attorney at address 2)": "da_address",  # use this line since it is longer
        # "(the District Attorney at address 3)"
        # "(Date_2)"
        # "(Signature_2)"
        "(Name typed or printed_2)": "full_name",

        # The following fields are additional fields from oregon_with_conviction_order.pdf.
        "(County)": "county",
        "(Case Number)": "case_number",
        "(Case Name)": "case_name",
        "(Arrest Dates All)": "arrest_dates_all",
        "(Charges All)": "charges_all",
        # "(Arresting Agency)": "arresting_agency",
        "(Conviction Dates)": "conviction_dates",
        "(Conviction Charges)": "conviction_charges",

        # The following fields are additional fields from oregon_with_arrest_order.pdf.
        "(Dismissed Arrest Dates)": "dismissed_arrest_dates",
        "(Dismissed Charges)": "dismissed_charges",
        "(Dismissed Dates)": "dismissed_dates",
    }
    # Multnomah and OSP
    other = {
        "(Case Name)": "case_name",
        "(Case Number)": "case_number",
        "(DA Number)": "da_number",
        "(Full Name)": "full_name",
        "(Date of Birth)": "date_of_birth",
        "(Mailing Address)": "mailing_address",
        "(Phone Number)": "phone_number",
        "(City)": "city",
        "(State)": "state",
        "(Zip Code)": "zip_code",
        "(Arresting Agency)": "arresting_agency",
        "(Dismissed Arrest Dates)": "dismissed_arrest_dates",
        "(Dismissed Charges)": "dismissed_charges",
        "(I Full Name)": lambda form: form.get("full_name"),

        "(Arrest Dates All)": "arrest_dates_all",
        "(Conviction Dates)": "conviction_dates",
        "(Conviction Charges)": "conviction_charges",
    }


class PDF:
    BUTTON_TYPE = "/Btn"
    TEXT_TYPE = "/Tx"
    FONT_FAMILY = "TimesNewRoman"
    FONT_SIZE = "10"
    FONT_SIZE_SMALL = "6"
    BASE_DIR = path.join(Path(__file__).parent, "files")

    @staticmethod
    def fill_form_values(pdf_path: str, form_data: Dict[str, str]):
        pdf = PDF(pdf_path, form_data, {"full_path": True})
        pdf.update_annotations()
        return pdf._pdf, pdf.warnings     

    def __init__(self, base_filename: str, form_data: Dict[str, str] = None,  opts=None):
        default_opts = {"full_path": False, "assert_blank_pdf": False, "field_width_factors": {"(Date of arrest)": 3}}
        full_opts = {**default_opts, **(opts or {})}
        full_path = base_filename if full_opts.get("full_path") else self.get_filepath(base_filename)

        self._pdf = PdfReader(full_path)
        self.warnings: List[str] = []
        self.annotations = [annot for page in self._pdf.pages for annot in page.Annots or []]
        self.fields = {field.T: field for field in self._pdf.Root.AcroForm.Fields}
        self.field_width_factors = full_opts.get("field_width_factors")
        self.form_data = form_data or {}

        definition = "oregon" if "oregon" in full_path else "other"
        self.mapper = AcroFormMapper(self.form_data, definition)

        if full_opts.get("assert_blank_pdf"):
            self._assert_blank_pdf()

    # Need to update both the V and AS fields of a Btn and they should be the same.
    # The value to use is found in annotation.AP.N.keys() and not
    # necessarily "/Yes". If a new form has been made, make sure to check
    # which value to use here.
    def set_checkbox_on(self, annotation):
        assert PdfName("On") in annotation.AP.N.keys()
        annotation.V = PdfName("On")
        annotation.AS = PdfName("On")

    def set_text_value(self, annotation, text):
        new_value = PdfString.encode(text)
        annotation.V = new_value
        self.set_font(annotation)
        annotation.update(PdfDict(AP=""))

    def adjust_field_width(self, annotation, factor: float = None):
        width_factor = self.field_width_factors.get(annotation.T)
        if width_factor is None:
            return

        x1, x2 = float(annotation.Rect[0]), float(annotation.Rect[2])
        annotation.Rect[2] = x1 + (x2 - x1) * width_factor

    def set_font(self, annotation):
        x1, x2 = float(annotation.Rect[0]), float(annotation.Rect[2])
        max_chars = (x2 - x1) * 0.3125  # Times New Roman size 10
        num_chars = len(annotation.V) - 2  # minus parens
        font_size = self.FONT_SIZE

        if num_chars > max_chars:
            font_size = self.FONT_SIZE_SMALL
            message = f'The font size of "{annotation.V[1:-1]}" was shrunk to fit the bounding box of "{annotation.T[1:-1]}". An addendum might be required if it still doesn\'t fit.'
            self.warnings.append(message)

        annotation.DA = PdfString.encode(f"/{self.FONT_FAMILY} {font_size} Tf 0 g")

    def update_annotations(self, form_data: Dict[str, str] = None, definition="oregon") -> AcroFormMapper:
        if form_data:
            self.mapper = AcroFormMapper(form_data, definition)

        for annotation in self.annotations:
            new_value = self.mapper.get(annotation.T)

            if annotation.FT == self.BUTTON_TYPE and new_value:
                self.set_checkbox_on(annotation)

            if annotation.FT == self.TEXT_TYPE and new_value != "":
                self.adjust_field_width(annotation)
                self.set_text_value(annotation, new_value)
                self.set_font(annotation)

        self._pdf.Root.AcroForm.update(PdfDict(NeedAppearances=PdfObject("true")))
        return self.mapper

    def write(self, base_filename: str):
        writer = PdfWriter()
        writer.write(self.get_filepath(base_filename), self._pdf)

    def get_filepath(self, base_filename: str):
        return path.join(self.BASE_DIR, base_filename + ".pdf")

    def get_annotation_dict(self):
        return {anot.T: anot.V for anot in self.annotations}

    def get_field_dict(self):
        return {field.T: field.V for field in self._pdf.Root.AcroForm.Fields}

    def _assert_blank_pdf(self):
        not_blank_message = lambda elem: f"[PDF] PDF not blank: {elem.T} - {elem.V}"

        for field in self._pdf.Root.AcroForm.Fields:
            assert field.V is None, not_blank_message(field)

        for annotation in self.annotations:
            assert annotation.V is None, not_blank_message(annotation)
