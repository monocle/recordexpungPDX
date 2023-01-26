import React from "react";
import { convertCaseNumberIntoLinks, capitalize } from "./util";
import { TypeEligibilityData, TimeEligibilityData } from "./types";

type EligibilityKind = "type" | "time";

interface EligibilityReasonsProps {
  kind: EligibilityKind;
  eligibility: TypeEligibilityData | TimeEligibilityData;
}

function Reason({
  reason,
  isFirst,
  kind,
}: {
  reason: string;
  isFirst: boolean;
  kind: EligibilityKind;
}) {
  return (
    <div className={isFirst ? "" : "bt b--light-gray pt2 mt2"}>
      <span className="fw7">{isFirst ? `${capitalize(kind)}: ` : "OR "}</span>
      {convertCaseNumberIntoLinks(reason)}
    </div>
  );
}

const typeStatusMap = new Map([
  ["eligible", { icon: "circle", color: "gray" }],
  ["ineligible", { icon: "times-circle", color: "red" }],
  ["needs more analysis", { icon: "question-circle", color: "purple" }],
]);

const timeStatusMap = new Map([
  ["eligible", { icon: "check-circle", color: "green" }],
]);

export default function Reasons({
  kind,
  eligibility,
}: EligibilityReasonsProps) {
  const { status, reason: reasonString } = eligibility;
  const isEligibleNow = kind === "time" && status === "Eligible";
  const reasons = reasonString.split("OR");
  const statusMap = kind === "time" ? timeStatusMap : typeStatusMap;
  let props = statusMap.get(status.toLowerCase());

  if (!props) {
    if (kind === "type") {
      return <>Unknown type eligibility</>;
    }

    props = {
      icon: "clock",
      color: "dark-blue",
    };
  }

  return (
    <div className={"relative mb3 connect connect-" + kind}>
      <i
        aria-hidden="true"
        className={`absolute fas fa-${props.icon} ${props.color} bg-white outline-2-white z-1`}
      ></i>
      <div className="ml3 pl1">
        {isEligibleNow ? (
          <>
            <span className="fw7">Time:</span> Eligible Now
          </>
        ) : (
          reasons.map((reason: string, index: number) => {
            return (
              <Reason
                key={reason}
                reason={reason}
                isFirst={index === 0}
                kind={kind}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
