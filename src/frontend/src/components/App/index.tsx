import React from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import history from "../../service/history";

import Footer from "../Footer";
import Header from "../Header";
import RecordSearch from "../RecordSearch";
import Demo from "../RecordSearch/Demo";
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
    <Router history={history}>
      <Header />
      <Switch>
        <Route exact path="/">
          <Landing />
        </Route>

        <Route path="/oeci">
          <OeciLogin
            userId=""
            password=""
            missingUserId={false}
            missingPassword={false}
            expectedFailure={false}
            expectedFailureMessage=""
            invalidResponse={false}
            missingInputs={false}
          />
        </Route>

        <Route path="/record-search">
          <RecordSearch />
        </Route>

        <Route path="/demo-record-search">
          <Demo />
        </Route>

        <Route path="/manual">
          <Manual />
        </Route>

        <Route path="/rules">
          <Rules />
        </Route>

        <Route path="/faq">
          <Faq />
        </Route>

        <Route path="/appendix">
          <Appendix />
        </Route>

        <Route path="/privacy-policy">
          <PrivacyPolicy />
        </Route>

        <Route path="/fill-expungement-forms">
          <FillForms />
        </Route>

        <Route path="/partner-interest">
          <PartnerInterest email="" invalidEmail={true} />
        </Route>

        <Route path="/accessibility-statement">
          <AccessibilityStatement />
        </Route>

        <Route path="/about">
          <About />
        </Route>

        <Route render={() => <Redirect to="/" />} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
