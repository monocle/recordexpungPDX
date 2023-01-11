import React from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { start as startDemo } from "../../redux/demoSlice";
import { RecordData } from "../RecordSearch/Record/types";
import useSetTitle from "../../hooks/useSetTitle";
import DemoInfo from "./DemoInfo";
import SearchPanel from "../RecordSearch/SearchPanel";
import Status from "../RecordSearch/Status";
import Record from "../RecordSearch/Record";
import Assumptions from "../RecordSearch/Assumptions";

// Can use this for dev
// import demoRecord from "./demoRecord";

export default function Demo({ record }: { record?: RecordData }) {
  let record_ = useAppSelector((state) => state.search.record);
  record = record ?? record_;

  useSetTitle("Demo");
  useAppDispatch()(startDemo());

  return (
    <main className="mw8 center f6 f5-l ph2">
      <DemoInfo />
      <SearchPanel />
      <Status record={record} />
      <Record record={record} />
      <Assumptions />
    </main>
  );
}
