import { useAppSelector } from "../../redux/hooks";
import useSetTitle from "../../hooks/useSetTitle";
import DemoInfo from "./DemoInfo";
import SearchPanel from "../RecordSearch/SearchPanel";
import Status from "../RecordSearch/Status";
import Record from "../RecordSearch/Record";
import Assumptions from "../RecordSearch/Assumptions";

export default function Demo() {
  const record = useAppSelector((state) => state.search.record);

  useSetTitle("Demo");

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
