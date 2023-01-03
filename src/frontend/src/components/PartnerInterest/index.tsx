import React, { useState } from "react";
import InvalidInputs from "../InvalidInputs";
import { HashLink as Link } from "react-router-hash-link";
import useEmail from "../../hooks/useEmail";
import useSetTitle from "../../hooks/useSetTitle";

const mailchimpEnpoint =
  "https://recordsponge.us10.list-manage.com/subscribe/post?u=8aa8348c6b5b43cde29949c59&amp;id=17b2f23a63";

export default function PartnerInterest({
  subscribeEndpoint = mailchimpEnpoint,
}) {
  const emailErrorMessage = "A valid email address is required";
  const [email, isValidEmail, setEmail] = useEmail();
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const handlEmailChange = (e: React.BaseSyntheticEvent) => {
    setEmail(e.target.value);
  };

  const handleEmailInputFocus = () => {
    setFormErrors([]);
  };

  const handleEmailInputBlur = () => {
    if (!isValidEmail) {
      setFormErrors([emailErrorMessage]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (!isValidEmail) {
      e.preventDefault();
      setFormErrors([emailErrorMessage]);
    } else {
      setFormErrors([]);
    }
  };

  useSetTitle("Partner with us");

  return (
    <div className="f6 f5-ns f4-l navy bg-lightest-blue1">
      <main className="mw7 center ph4 ph5-ns pt5 pb6">
        <section className="lh-copy mb5">
          <h1 className="mw6-l f3 f2-l fw9 lh-solid pr4-l ma0 mb4">
            Provide expungement help with RecordSponge
          </h1>
          <p className="mb4">
            RecordSponge is made for organizations to become expungement service
            providers. We provide both the software and supervision by volunteer
            attorneys – organizations provide the clients and, to a large
            extent, the expungement service.
          </p>
          <p className="mb4">
            We are therefore looking to partner with organizations who have
            contact with many people with criminal records. If you would like to
            learn more about partnering please get in contact below.
          </p>
          <p className="mb2">
            You will need an Oregon eCourt Case Information (OECI) account to
            search for criminal records with RecordSponge, otherwise there is no
            additional charge.
          </p>
          <p className="mb4">
            <a
              className="link hover-dark-blue bb"
              href="https://www.courts.oregon.gov/services/online/Pages/ojcin-signup.aspx"
            >
              You can purchase a subscription here
            </a>
            .
          </p>
          <p className="mb2">
            No OECI account yet? The demo version has all the same features
            besides the ability to search the OECI database. There are examples
            provided or you can even enter records manually.
          </p>
          <p className="mb4">
            <Link
              className="fw7 dark-blue link hover-navy nowrap"
              to="/demo-record-search"
              onClick={() => window.scrollTo(0, 0)}
            >
              Check out the demo version
              <span className="fas fa-arrow-right pl1"></span>
            </Link>
          </p>
        </section>

        <section>
          <div className="" id="mc_embed_signup">
            {/* This section is based on Mailchimp's generated Embed html*/}
            <form
              action={subscribeEndpoint}
              method="post"
              id="mc-embedded-subscribe-form"
              name="mc-embedded-subscribe-form"
              className=""
              target="_blank"
              noValidate
            >
              <div
                className="bg-white shadow br3 pb5 mb3"
                id="mc_embed_signup_scroll"
              >
                <span className="db center bb bw3 b--blue mb4"></span>
                <h2 className="visually-hidden">Subscribe</h2>
                <p className="fw7 ph4 ph5-ns mh3-l mb3">
                  We ask anyone using the software to be in touch so that we can
                  better maintain, scale, and improve our work and community.
                </p>
                <p className="ph4 ph5-ns mh3-l mb4 mb5-l">
                  Please complete this contact form even if you already have an
                  OECI account.
                </p>

                <div className="ph4 ph5-ns ph6-l">
                  <div className="mb3 mc-field-group">
                    <label className="db fw6 mb1" htmlFor="mce-EMAIL">
                      Email Address (required)
                    </label>
                    <input
                      type="email"
                      value={email}
                      name="EMAIL"
                      className="w-100 b--black-20 br2 pa3 required email"
                      id="mce-EMAIL"
                      onChange={handlEmailChange}
                      onFocus={handleEmailInputFocus}
                      onBlur={handleEmailInputBlur}
                    />
                  </div>
                  <div className="mb3 mc-field-group">
                    <label className="db fw6 mb1" htmlFor="mce-NAME">
                      Name
                    </label>
                    <input
                      type="text"
                      name="NAME"
                      className="w-100 b--black-20 br2 pa3"
                      id="mce-NAME"
                    />
                  </div>
                  <div className="mb2 mc-field-group">
                    <label className="db fw6 mb1" htmlFor="mce-ORG">
                      Organization
                    </label>
                    <input
                      type="text"
                      name="ORG"
                      className="w-100 b--black-20 br2 pa3"
                      id="mce-ORG"
                    />
                  </div>
                  <div className="checkbox mb4 mc-field-group input-group">
                    <input
                      type="checkbox"
                      value="1"
                      name="group[19029][1]"
                      id="mce-group[19029]-19029-0"
                    />
                    <label className="fw6" htmlFor="mce-group[19029]-19029-0">
                      I'm interested in a demonstration of the software!
                    </label>
                  </div>
                  <div id="mce-responses" className="clear">
                    <div
                      className="response visually-hidden"
                      id="mce-error-response"
                    ></div>
                    <div
                      className="response visually-hidden"
                      id="mce-success-response"
                    ></div>
                  </div>
                  {/*This div captures bot signups, according to Mailchimp.*/}
                  <div className="clear">
                    <input
                      type="submit"
                      value="Subscribe"
                      name="subscribe"
                      id="mc-embedded-subscribe"
                      className="w-100 pointer bg-blue white bg-animate hover-bg-dark-blue bn fw6 br2 pv3 ph4"
                      onClick={handleSubmit}
                    />
                  </div>
                  <InvalidInputs
                    conditions={[formErrors.length > 0]}
                    contents={formErrors}
                  />
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
