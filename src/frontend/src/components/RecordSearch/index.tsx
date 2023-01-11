import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hasOeciToken } from "../../service/cookie-service";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { stop as stopDemo } from "../../redux/demoSlice";
import useSetTitle from "../../hooks/useSetTitle";
import SearchPanel from "./SearchPanel";
import Status from "./Status";
import Record from "./Record";
import Assumptions from "./Assumptions";

export default function RecordSearch() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const record = useAppSelector((state) => state.search.record);
  const [, setTitle] = useSetTitle("Log In");
  const [isLoggedIn] = useState(hasOeciToken());

  dispatch(stopDemo());

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/oeci", { replace: true });
    } else {
      setTitle("Record Search");
    }
  }, [isLoggedIn, navigate, setTitle]);

  return isLoggedIn ? (
    <main className="mw8 center f6 f5-l ph2">
      <SearchPanel />
      <Status record={record} />
      <Record record={record} />
      <Assumptions />
    </main>
  ) : (
    <></>
  );
}
