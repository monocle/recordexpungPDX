import React, { useState, useEffect } from "react";
import { hasOeciToken } from "../../service/cookie-service";
import { useAppSelector } from "../../redux/hooks";
import useSetTitle from "../../hooks/useSetTitle";
import SearchPanel from "./SearchPanel";
import Status from "./Status";
import Record from "./Record";
import Assumptions from "./Assumptions";
import OeciLogin from "../OeciLogin";

export default function RecordSearch() {
  const record = useAppSelector((state) => state.search.record);
  const [shouldDisplay, setShouldDisplay] = useState(false);
  const [, setTitle] = useSetTitle("Log In");

  useEffect(() => {
    if (hasOeciToken()) {
      setShouldDisplay(true);
      setTitle("Record Search");
    }
  }, [setTitle]);

  return (
    <>
      {shouldDisplay && (
        <main className="mw8 center f6 f5-l ph2">
          <SearchPanel />
          <Status record={record} />
          <Record record={record} />
          <Assumptions />
        </main>
      )}
      {!shouldDisplay && <OeciLogin />}
    </>
  );
}
