import { useState } from "react";
import { HashLink as Link } from "react-router-hash-link";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "../../vendor/@reach/disclosure";

import currentPartners from "./currentPartners";

export interface Partner {
  details: string[][];
  name: string;
  area: string;
  instructions: string;
  contacts: string[];
  website: string;
}

function PartnerElement({
  partner,
  idx,
  activeIdx,
  handleChange,
}: {
  partner: Partner;
  idx: number;
  activeIdx: number;
  handleChange: (idx: number) => void;
}) {
  return (
    <li className="bt bw2 b--lightest-blue1">
      <Disclosure
        open={idx === activeIdx}
        id={idx}
        onChange={() => handleChange(idx)}
      >
        <DisclosureButton className="flex-ns w-100 relative navy hover-blue pv3 ph3">
          <span className="w-70 db pr3 mb2 mb0-ns">{partner.name}</span>
          <span className="w-30 pr3">{partner.area}</span>
          <span className="absolute top-0 right-0 pt3 ph3">
            {idx === activeIdx ? (
              <span aria-hidden="true" className="fas fa-angle-up"></span>
            ) : (
              <span aria-hidden="true" className="fas fa-angle-down"></span>
            )}
          </span>
        </DisclosureButton>
        <DisclosurePanel>
          <div className="bl bw2 f5 b--blue pv3 ph3 mb3 ml3">
            <ul className="list mb2">
              {partner.details.map((detail, idx2) => (
                <li key={idx2} className="flex-ns mb3">
                  <span className="w10rem db fw6 mr3">{detail[0]}</span>
                  <span>{detail[1]}</span>
                </li>
              ))}
            </ul>
            <p className="mw6 lh-copy mb3">
              The majority of court fees are subject to waiver for
              income-qualified individuals who complete the waiver form.{" "}
              <Link className="link hover-blue bb" to="/manual#filepaperwork">
                Learn More
              </Link>
            </p>
            <hr className="bt b--black-05 mb3" />
            <p className="fw6 mb3">{partner.instructions}</p>
            <ul className="list mb3">
              {partner.contacts.map((contact, idx3) => (
                <li key={idx3} className="mb3">
                  {contact}
                </li>
              ))}
            </ul>
            <a href={partner.website} className="link hover-blue bb">
              {partner.website}
            </a>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </li>
  );
}

export default function PartnerTable({ partners = currentPartners }) {
  // Only one Disclosure should be opened at a particular time.
  // activeIdx === -1 means that all Disclosures are closed
  const [activeIdx, setActiveIdx] = useState(-1);

  const toggleDiscolsure = (newIdx: number) => {
    setActiveIdx(newIdx === activeIdx ? -1 : newIdx);
  };

  return (
    <div className="ba bw3 br3 b--lightest-blue1 bg-white mb4">
      <div className="flex items-center justify-between">
        <h3 className="f3 fw9 pv4 ph3">Partners</h3>
        <svg
          className="mr3"
          style={{ width: "55px", height: "40px" }}
          aria-hidden="true"
          viewBox="0 0 110 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.56 78.42L1.88 68.04l4.68-15.85L8.58 27.7 12.48.82h7.3l6.14 3 1.59 8.74 8.81 1.77 7.86-1.77 7.85 1.77 3.78-3.54h8.03l4.98-2.23 7.44-1.8h25.76l6.56 5.8-3.77 12.87-5.72 11.1 4.19 3.09-1.26 6.43v32.37H6.56z"
            fill="#D0E1F7"
          />
          <circle cx="26.76" cy="21.05" r="2.76" fill="#2B75D2" />
          <circle cx="33.67" cy="24.51" r="2.76" fill="#2B75D2" />
          <circle cx="79.67" cy="16.51" r="2.76" fill="#2B75D2" />
          <circle cx="28.14" cy="30.04" r="2.76" fill="#2B75D2" />
          <circle cx="35.05" cy="65.29" r="2.76" fill="#2B75D2" />
          <circle cx="19.85" cy="44.55" r="2.76" fill="#2B75D2" />
          <circle cx="55.79" cy="44.55" r="2.76" fill="#2B75D2" />
        </svg>
      </div>
      <ul className="list">
        {partners.map((partner, index) => (
          <PartnerElement
            partner={partner}
            key={index}
            idx={index}
            activeIdx={activeIdx}
            handleChange={toggleDiscolsure}
          />
        ))}
      </ul>
    </div>
  );
}
