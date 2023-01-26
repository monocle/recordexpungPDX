import React from "react";

export function convertCaseNumberIntoLinks(eligibilityString: string) {
  const elements = eligibilityString.split(/(\[.*?\])/g);
  return elements.map((element: string, index: number) => {
    if (element.match(/^\[.*\]$/)) {
      const caseNumber = element.slice(1, -1);
      return (
        <a className="underline" href={"#" + caseNumber} key={caseNumber}>
          {caseNumber}
        </a>
      );
    } else {
      return element;
    }
  });
}

export function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
