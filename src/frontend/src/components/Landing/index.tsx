import React from "react";
import PartnerTable from "../PartnerTable";
import { Link } from "react-router-dom";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "../../vendor/@reach/disclosure";
import useSetTitle from "../../hooks/useSetTitle";
import SVG from "../SVG";

export default function Landing() {
  useSetTitle("Home");

  return (
    <main className="f5 f4-ns navy bg-white">
      <div className="overflow-x-hidden relative">
        <div className="flex justify-center mb5">
          <div className="flex justify-center items-center w-100 shadow bg-blue white pv3 ph4">
            <i className="fas fa-award f2 light-blue" aria-hidden="true"></i>
            <p className="fw6 ml3">
              <a
                href="https://www.osbar.org/osbevents"
                className="underline-hover"
              >
                Winner of the 2020 Oregon State Bar Technology & Innovation
                Award
              </a>
            </p>
          </div>
        </div>

        <div className="mw8 center ph4 pb5 ">
          <div className="flex-l mt5">
            <h1 className="f3 f2-ns fw9 w-60-l mr2-l mt0 mb3">
              Making Record <br />
              Expungement Affordable
            </h1>
            <p className="f5 w-40-l lh-title mw6">
              <span className="db w4 bb bw2 b--blue pt3 mt2 mb2"></span>
              RecordSponge is software that helps community organizations
              quickly analyze an individual’s criminal history to determine if
              they qualify to have their records expunged.
            </p>
          </div>
        </div>

        <div className="bg-navy pv6">
          <div className="mw7 center">
            <div className="mh4">
              <h2 className="white tc f3 f2-ns fw9 mb3">
                Are you looking to clear your record?
              </h2>
              <p className="white tc center mw6 mb4">
                Select a partner below near you. They can provide your analysis
                and help you file for expungement.
              </p>
            </div>
            <PartnerTable />

            <Disclosure>
              <div className="bg-white br3 bl bw3 b--red pa4 mb6">
                <DisclosureButton>
                  <span className="navy fw7 hover-dark-blue">
                    Emergency Update: Protests Against Police Violence
                    <span className="nowrap fw4 hover-dark-blue pl3">
                      Learn More
                    </span>
                  </span>
                </DisclosureButton>
                <DisclosurePanel>
                  <p className="lh-copy pt3">
                    Due to ongoing events our partner Qiu-Qiu Law is making all
                    expungement help free to any protesters arrested during this
                    fight. Anyone can register directly to{" "}
                    <a
                      href="https://www.qiu-qiulaw.com/register"
                      className="link hover-dark-blue bb"
                    >
                      see if you qualify for expungement here
                    </a>{" "}
                    and a lawyer will return your inquiry within 48 hours.
                  </p>
                  <p className="lh-copy pt3">
                    For other communication (to learn more, help out, etc.) you
                    can also contact:
                  </p>
                  <ul className="ml4 mt2">
                    <li className="mb2">
                      Michael Zhang, expungement attorney at Qiu-Qiu Law:{" "}
                      <span className="nowrap">michael@qiu-qiulaw.com</span>
                    </li>
                    <li>
                      Jordan Witte, project manager at Code for PDX:{" "}
                      <span className="nowrap">
                        jordan.witte@codeforpdx.org
                      </span>
                    </li>
                  </ul>
                </DisclosurePanel>
              </div>
            </Disclosure>

            <span className="db w4 center bb bw2 b--blue mb3"></span>
            <p className="tc fw7 white mw7 mh4">
              Over 5,600 analyses delivered as of January 2022
            </p>
          </div>
        </div>

        <div className="bg-lightest-blue1 pv6">
          <div className="mw7 center">
            <div className="mh4">
              <h2 className="tc f3 f2-ns fw9 mb3">
                Are you interested in providing expungement help with this tool?
              </h2>
              <p className="tc center mw6 mb3">
                We’re looking to partner with organizations who have contact
                with many people who have criminal records.
              </p>
              <div className="tc mb6">
                <Link
                  className="inline-flex items-center f3-ns blue hover-dark-blue fw7"
                  to="/partner-interest"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <span>Learn more about partnering</span>
                  <span
                    className="fas fa-arrow-right lh-solid pt1 pl2"
                    aria-hidden="true"
                  ></span>
                </Link>
              </div>

              <h2 className="mw6 center tc f3 f2-ns fw9 mb3">
                Your complete toolkit to expunge records
              </h2>

              <ul className="feature-list center list mb6">
                <li className="flex pv3">
                  <span>
                    <span className="diamond dib rotate-45 br4 bg-white pa3">
                      <span
                        className="fas fa-search f4 rotate-315 blue"
                        aria-hidden="true"
                      ></span>
                    </span>
                  </span>
                  <span className="fw5 pt2 pt1-ns pl3">
                    Search the OECI database for records
                  </span>
                </li>

                <li className="flex pv3">
                  <span>
                    <span className="diamond dib rotate-45 br4 bg-white pa3">
                      <span
                        className="fas fa-pen f4 rotate-315 blue"
                        aria-hidden="true"
                      ></span>
                    </span>
                  </span>
                  <span className="fw5 pt2 pt1-ns pl3">
                    Edit or enter records manually
                  </span>
                </li>

                <li className="flex pv3">
                  <span>
                    <span className="diamond dib rotate-45 br4 bg-white pa3">
                      <span
                        className="fas fa-check f3 rotate-315 blue"
                        aria-hidden="true"
                      ></span>
                    </span>
                  </span>
                  <span className="fw5 pt2 pt1-ns pl3">
                    Get Instant eligibility results
                  </span>
                </li>

                <li className="flex pv3">
                  <span>
                    <span className="diamond dib rotate-45 br4 bg-white pa3">
                      <span
                        className="fas fa-bolt f3 rotate-315 blue pl1"
                        aria-hidden="true"
                      ></span>
                    </span>
                  </span>
                  <span className="fw5 pt2 pt1-ns pl3">
                    Automatically generate paperwork
                  </span>
                </li>

                <li className="flex pv3">
                  <span>
                    <span className="diamond dib rotate-45 br4 bg-white pa3">
                      <span
                        className="fas fa-compass f3 rotate-315 blue"
                        aria-hidden="true"
                      ></span>
                    </span>
                  </span>
                  <span className="fw5 pt2 pt1-ns pl3">
                    Guidance on how to file for expungement
                  </span>
                </li>
              </ul>

              <blockquote>
                <div className="center tc f3 mb1">
                  <span
                    className="fas fa-quote-left blue"
                    aria-hidden="true"
                  ></span>
                </div>
                <p className="mw7 lh-copy tc center mb3">
                  Having performed expungement analysis both with and without
                  the assistance of RecordSponge, I know that this program
                  vastly decreases the time needed to perform expungement
                  analysis, and vastly increases the number of people we can
                  assist with expungements.
                </p>
                <footer className="mw7 tc center fw6 f5-ns mb5">
                  Leni Tupper, Portland Community College CLEAR Clinic
                </footer>
              </blockquote>

              <blockquote>
                <div className="center tc f3 mb1">
                  <span
                    className="fas fa-quote-left blue"
                    aria-hidden="true"
                  ></span>
                </div>
                <p className="mw7 lh-copy tc center mb3">
                  RecordSponge levels the playing field. It has been inspiring
                  to see people fully return to our community as their records
                  are expunged – Michael and his team have a heart for people, a
                  knowledge of the system, and a solution that works in
                  RecordSponge.
                </p>
                <footer className="mw7 tc center fw6 f5-ns mb5">
                  Eric Guyer, Jackson County Community Justice Director
                </footer>
              </blockquote>

              <blockquote>
                <div className="center tc f3 mb1">
                  <span
                    className="fas fa-quote-left blue"
                    aria-hidden="true"
                  ></span>
                </div>
                <p className="mw6 lh-copy tc center mb3">
                  I love that I can just pull my phone out and tell someone
                  whether they can get their record expunged.
                </p>
                <footer className="mw7 tc center fw6 f5-ns mb5">
                  Sarah Kolb, Signs of Hope
                </footer>
              </blockquote>
            </div>
          </div>
        </div>

        <div className="mw8 flex-l center ph4 pv6">
          <div className="w-50-l mb5">
            <h2 className="f3 f2-ns fw9 mb3">Who We Are</h2>
            <p className="lh-copy mb3">
              <a
                className="link bb hover-dark-blue"
                href="http://www.codeforpdx.org"
              >
                Code for PDX
              </a>{" "}
              and{" "}
              <a
                className="link bb hover-dark-blue"
                href="https://www.qiu-qiulaw.com"
              >
                Qiu-Qiu Law
              </a>{" "}
              have developed and continue to improve analytical software to help
              expungement providers quickly determine which items on an
              applicant's record are eligible for expungement.
            </p>
            <p className="lh-copy mb3">
              The goal of this project is to make expungement available to all
              Oregonians, regardless of their ability to pay. It further seeks
              to provide these services in the communities that need them the
              most.
            </p>
            <Link
              className="inline-flex items-center blue hover-dark-blue fw7"
              to="/about"
              onClick={() => window.scrollTo(0, 0)}
            >
              <span>More about us</span>
              <span
                className="fas fa-arrow-right lh-solid pt1 pl2"
                aria-hidden="true"
              ></span>
            </Link>
          </div>
          <div className="w-50-l tc pa5-l pa3 mb5 ml4-l">
            <SVG
              name="whoWeAreLogos"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 257 243"
              className="who-we-are-logos"
            />
          </div>
        </div>

        <div className="bg-lightest-blue1 pv6">
          <div className="ph4">
            <div className="mw7 center">
              <h3 className="f3 f2-ns fw9 mb3">Expungement in Oregon</h3>
              <p className="lh-copy mb5">
                For many folks who have had run-ins with the criminal justice
                system, punishment doesn't end with the end of their sentence. A
                criminal conviction or arrest can follow a person around for the
                rest of their life, well past the period of incarceration,
                probation, and financial penalty. This prevents them from
                accessing education, employment, housing, and services which
                might otherwise help them integrate back into society.
              </p>
            </div>
            <div className="mw9 center tc mb5">
              <img
                className="wipe-illustrations"
                alt=""
                src="/img/wipe-illustrations-v3.jpg"
              />
            </div>
            <div className="mw7 center">
              <p className="lh-copy mb4">
                The State of Oregon provides a way for people to seal certain
                items from their records (effectively removing them), but the
                rules for determining which items are eligible are complex and
                prone to error when applying them by hand. As a result,
                expungement analysis is expensive in Portland - ranging from
                $1,000 to $3,000 when performed by private attorneys.
              </p>
              <p className="lh-copy mb5">
                And so we created RecordSponge to greatly increase access to
                expungement by automating the legal analysis. We are seeking
                more partners to administer RecordSponge.
              </p>
              <div className="mb6">
                <Link
                  className="inline-flex items-center f3-ns blue hover-dark-blue fw7"
                  to="/partner-interest"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <span>Learn more about partnering</span>
                  <span
                    className="fas fa-arrow-right lh-solid pt1 pl2"
                    aria-hidden="true"
                  ></span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <footer className="f5 pt6 pb5">
          <div className="flex-l mw8 center ph4">
            <p className="mw6 lh-copy mr3-l mb4">
              RecordSponge Oregon is a nonprofit service delivered by{" "}
              <a
                className="link bb hover-dark-blue"
                href="http://www.codeforpdx.org"
              >
                Code&nbsp;for&nbsp;PDX
              </a>{" "}
              in collaboration with{" "}
              <a
                className="link bb hover-dark-blue"
                href="https://www.qiu-qiulaw.com"
              >
                Qiu-Qiu Law
              </a>
              .
            </p>
            <p className="mw6 lh-copy mb4">
              The service is intended to be accompanied by legal advice.
              <br />
              The service is not standalone legal advice.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
