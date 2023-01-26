import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { startDemo } from "../../redux/search/actions";
import useSetupPage from "../../hooks/useSetupPage";
import { RecordData } from "../RecordSearch/Record/types";
import DemoInfo from "./DemoInfo";
import SearchPanel from "../RecordSearch/SearchPanel";
import Status from "../RecordSearch/Status";
import Record from "../RecordSearch/Record";
import Assumptions from "../RecordSearch/Assumptions";
// import johnCommonRecord from "../../data/demo/johnCommon";
// import multipleCharges from "../../data/demo/multipleCharges";
// import blankRecord from "../../data/blankRecord";

interface Props {
  record?: RecordData;
}

export default function Demo({ record }: Props) {
  const dispatch = useAppDispatch();
  let record_ = useAppSelector((state) => state.search.record);

  if (record) {
    record_ = record;
  }
  // record = multipleCharges;
  // record = johnCommonRecord;
  // record = blankRecord;

  useSetupPage("Demo");

  useEffect(() => {
    dispatch(startDemo());
  });

  return (
    <main className="mw8 center f6 f5-l ph2">
      <DemoInfo />
      <SearchPanel />
      <Status record={record_} />
      <Record record={record_} />
      <Assumptions />
    </main>
  );
}
