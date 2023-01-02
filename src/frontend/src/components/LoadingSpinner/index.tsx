import React from "react";

export default function LoadingSpinner({
  inputString,
}: {
  inputString: string;
}) {
  return (
    <p className="bg-white shadow mv4 pa4 br3 fw6 tc">
      <span className="spinner mr2"></span>Loading {inputString}...
    </p>
  );
}
