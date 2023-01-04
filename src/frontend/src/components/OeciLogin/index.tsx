import React from "react";
import InvalidInputs from "../InvalidInputs";
import oeciLogIn from "../../service/oeci";
import { Link } from "react-router-dom";
import SVG from "../SVG";

interface State {
  userId: string;
  password: string;
  missingUserId: boolean;
  missingPassword: boolean;
  expectedFailure: boolean;
  expectedFailureMessage: string;
  invalidResponse: boolean;
  missingInputs: boolean;
}

class OeciLogin extends React.Component<State> {
  componentDidMount() {
    document.title = "Log In - RecordSponge";
  }

  state: State = {
    userId: "",
    password: "",
    missingUserId: false,
    missingPassword: false,
    expectedFailure: false,
    expectedFailureMessage: "",
    invalidResponse: false,
    missingInputs: false,
  };

  handleChange = (e: React.BaseSyntheticEvent) => {
    // See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/26635 for why we're
    // using the "any" type.
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // validate form
    this.setState(
      {
        missingUserId: this.state.userId.trim().length === 0,
        missingPassword: this.state.password.trim().length === 0,
        missingInputs:
          this.state.userId.trim().length === 0 ||
          this.state.password.trim().length === 0,
      },
      () => {
        if (this.state.missingInputs === false) {
          oeciLogIn(this.state.userId, this.state.password).catch(
            (error: any) => {
              error.response.status === 401 || error.response.status === 404
                ? // error: 40x
                  this.setState({
                    expectedFailure: true,
                    expectedFailureMessage: error.response.data.message,
                  })
                : // error: technical difficulties
                  this.setState({ invalidResponse: true });
            }
          );
        }
      }
    );
  };

  public render() {
    return (
      <>
        <main className="flex-l f6 f5-l">
          <div className="w-50-l bg-navy pt5 pb5 pb7-l ph4 pr5-l">
            <div className="mw6 center mr0-l ml-auto-l">
              <section className="ph3-l ph5-l">
                <h1 className="visually-hidden">
                  Log in to OECI to search records
                </h1>
                <div className="white">
                  <form
                    onSubmit={this.handleSubmit}
                    noValidate
                    className="oeci-login-form"
                    id="OeciLoginForm"
                    aria-label="OECI Login Form"
                  >
                    <SVG
                      name="oeciLogo"
                      className="db center mb3"
                      width="50"
                      height="50"
                      viewBox="0 0 66 66"
                    />

                    <fieldset>
                      <legend className="f4 fw6 db center tc pb3">
                        Oregon eCourt Case Information
                      </legend>
                      <p className="tc mb4">
                        Log in to OECI to search and analyse criminal records
                        for expungement.
                      </p>
                      <div className="mt4">
                        <label htmlFor="userId" className="db mb1 fw6">
                          User ID
                        </label>
                        <input
                          id="userId"
                          name="oecilogin"
                          type="text"
                          autoComplete="username"
                          className="w-100 mb4 pa3 br2 b--black-20"
                          required
                          aria-describedby={
                            this.state.missingUserId ? "inputs_msg" : undefined
                          }
                          aria-invalid={this.state.missingUserId}
                          onChange={this.handleChange}
                        />
                      </div>
                      <label htmlFor="password" className="db mb1 fw6">
                        Password
                      </label>
                      <input
                        id="password"
                        name="oecilogin"
                        type="password"
                        autoComplete="current-password"
                        className="w-100 mb4 pa3 br2 b--black-20"
                        required
                        aria-describedby={
                          this.state.missingPassword ? "inputs_msg" : undefined
                        }
                        aria-invalid={this.state.missingPassword}
                        onChange={this.handleChange}
                      />
                      <button
                        className="bg-blue white bg-animate hover-bg-dark-blue fw6 db w-100 br2 pv3 ph4 tc"
                        type="submit"
                      >
                        Log in to OECI
                      </button>
                    </fieldset>
                    <InvalidInputs
                      conditions={[
                        this.state.missingInputs,
                        this.state.invalidResponse,
                        this.state.expectedFailure,
                      ]}
                      contents={[
                        <span>All fields are required.</span>,
                        <>
                          We're experiencing technical difficulties, please
                          contact{" "}
                          <a
                            className="link underline hover-blue"
                            href="mailto:help@recordsponge.com"
                          >
                            help@recordsponge.com
                          </a>
                        </>,
                        <span>{this.state.expectedFailureMessage}</span>,
                      ]}
                    />
                    <p className="lh-copy moon-gray mt5">
                      The{" "}
                      <a
                        className="link hover-light-blue bb"
                        href="https://publicaccess.courts.oregon.gov/PublicAccessLogin/Login.aspx"
                      >
                        eCourt site
                      </a>{" "}
                      is offline during the 4th weekend of each month between 6
                      PM PST on Friday until noon on Sunday. During this time,
                      record search will not&nbsp;function.
                    </p>
                  </form>
                </div>
              </section>
            </div>
          </div>
          <div className="w-50-l pt4 pt5-l pb5 ph4 ph6-l">
            <div className="mw6">
              <section className="lh-copy">
                <span className="db w3 bb bw2 b--blue pt3 mt2 mb2"></span>
                <h2 className="f4 fw9 mb4">New here?</h2>
                <p className="mb4">
                  <Link
                    to="/partner-interest"
                    className="link hover-dark-blue bb"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    Learn more about providing expungement help
                  </Link>
                  .
                </p>
                <p className="mb4">
                  <Link
                    to="/demo-record-search"
                    className="link hover-dark-blue bb"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    {" "}
                    Check out the demo version
                  </Link>
                  .
                </p>
                <p className="mb1">
                  We ask anyone using the software to be in touch so that we can
                  better maintain, scale, and improve our work and community.
                </p>
                <p className="mb4">
                  <Link
                    to="/partner-interest"
                    className="link hover-dark-blue bb"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    Please complete this contact form if you haven’t already
                  </Link>
                  .
                </p>
              </section>
            </div>
          </div>
        </main>
      </>
    );
  }
}

export default OeciLogin;
