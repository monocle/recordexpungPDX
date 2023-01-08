import React, { useState } from "react";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import InvalidInputs from "../InvalidInputs";
import oeciLogIn from "../../service/oeci";
import { hasOeciToken } from "../../service/cookie-service";
import SVG from "../SVG";
import useSetTitle from "../../hooks/useSetTitle";
import useFormInput from "../../hooks/useFormInput";

function GenericErrorMessage() {
  return (
    <>
      We're experiencing technical difficulties, please contact{" "}
      <a
        className="link underline hover-blue"
        href="mailto:help@recordsponge.com"
      >
        help@recordsponge.com
      </a>
    </>
  );
}

export default function OeciLogin() {
  useSetTitle("Log In");

  const navigate = useNavigate();
  const { userId, isUserIdValid, userIdProps } = useFormInput("userId");
  const { password, isPasswordValid, passwordProps } = useFormInput("password");
  const [errorMessages, setErrorMessages] = useState<string[] | JSX.Element[]>(
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    const errorMessages =
      !isUserIdValid || !isPasswordValid ? ["All fields are required."] : [];

    setErrorMessages(errorMessages);
    e.preventDefault();

    if (isUserIdValid && isPasswordValid) {
      oeciLogIn(userId, password)
        .then((response: any) => {
          if (hasOeciToken()) {
            navigate("/record-search");
          }
        })
        .catch((error: any) => {
          const status = (error as AxiosError).response?.status ?? 0;
          const errorMessage =
            status === 401 || status === 404 ? (
              error.response.data.message
            ) : (
              <GenericErrorMessage />
            );

          setErrorMessages([errorMessage]);
        });
    }
  };

  return (
    <main className="flex-l f6 f5-l">
      <div className="w-50-l bg-navy pt5 pb5 pb7-l ph4 pr5-l">
        <div className="mw6 center mr0-l ml-auto-l">
          <section className="ph3-l ph5-l">
            <h1 className="visually-hidden">
              Log in to OECI to search records
            </h1>
            <div className="white">
              <form
                onSubmit={handleSubmit}
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
                    Log in to OECI to search and analyse criminal records for
                    expungement.
                  </p>
                  <div className="mt4">
                    <label htmlFor="userId" className="db mb1 fw6">
                      User ID
                    </label>
                    <input
                      {...userIdProps}
                      autoComplete="username"
                      className="w-100 mb4 pa3 br2 b--black-20"
                      required
                    />
                  </div>
                  <label htmlFor="password" className="db mb1 fw6">
                    Password
                  </label>
                  <input
                    {...passwordProps}
                    autoComplete="current-password"
                    className="w-100 mb4 pa3 br2 b--black-20"
                    required
                  />
                  <button
                    className="bg-blue white bg-animate hover-bg-dark-blue fw6 db w-100 br2 pv3 ph4 tc"
                    type="submit"
                  >
                    Log in to OECI
                  </button>
                </fieldset>
                <InvalidInputs
                  conditions={[errorMessages.length > 0]}
                  contents={errorMessages}
                />
                <p className="lh-copy moon-gray mt5">
                  The{" "}
                  <a
                    className="link hover-light-blue bb"
                    href="https://publicaccess.courts.oregon.gov/PublicAccessLogin/Login.aspx"
                  >
                    eCourt site
                  </a>{" "}
                  is offline during the 4th weekend of each month between 6 PM
                  PST on Friday until noon on Sunday. During this time, record
                  search will not&nbsp;function.
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
  );
}
