import React from "react";
import { Navigate, Routes, Route } from "react-router-dom";

import Footer from "../Footer";
import Header from "../Header";
import RecordSearch from "../RecordSearch";
import Demo from "../Demo";
import OeciLogin from "../OeciLogin";
import Landing from "../Landing";
import Manual from "../Manual";
import Rules from "../Rules";
import Faq from "../Faq";
import Appendix from "../Appendix";
import PrivacyPolicy from "../PrivacyPolicy";
import FillForms from "../FillForms";
import PartnerInterest from "../PartnerInterest";
import AccessibilityStatement from "../AccessibilityStatement";
import About from "../About";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/oeci" element={<OeciLogin />} />

        <Route path="/record-search" element={<RecordSearch />} />

        <Route path="/demo-record-search" element={<Demo />} />

        <Route path="/manual" element={<Manual />} />

        <Route path="/rules" element={<Rules />} />

        <Route path="/faq" element={<Faq />} />

        <Route path="/appendix" element={<Appendix />} />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route path="/fill-expungement-forms" element={<FillForms />} />

        <Route path="/partner-interest" element={<PartnerInterest />} />

        <Route
          path="/accessibility-statement"
          element={<AccessibilityStatement />}
        />

        <Route path="/about" element={<About />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
