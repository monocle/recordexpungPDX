import React, { useEffect } from "react";
import SearchPanel from "./SearchPanel";
import Record from "./Record";
import Status from "./Status";
import DemoInfo from "./Demo/DemoInfo";
import { hasOeciToken } from "../../service/cookie-service";
import { HashLink as Link } from "react-router-hash-link";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import useSetTitle from "../../hooks/useSetTitle";

export default function RecordSearch() {
  const navigate = useNavigate();
  const record = useAppSelector((state) => state.search.record);
  const demo = useAppSelector((state) => state.search.demo);

  useSetTitle("Search Records");

  useEffect(() => {
    if (!demo || !hasOeciToken()) {
      navigate("/oeci");
    }
  }, [demo, navigate]);

  return (
    <>
      <main className="mw8 center f6 f5-l ph2">
        {demo && <DemoInfo />}
        <SearchPanel />
        <Status record={record} />
        <Record record={record} />
        <div className="bg-white shadow mb6 pa4 br3">
          <h2 className="fw6 mb3">Assumptions</h2>
          <p className="mb3">
            We are only able to access your public Oregon records.
          </p>
          <p className="mb2">
            Your analysis may be different if you have had cases which were:
          </p>
          <ul className="lh-copy pl4 mw6 mb3">
            <li className="mb2">Previously expunged</li>
            <li className="mb2">
              From States besides Oregon within the last ten years
            </li>
            <li className="mb2">
              From Federal Court within the last ten years
            </li>
            <li className="mb2">
              From local District Courts, e.g. Medford Municipal Court (not
              Jackson County Circuit Court) from within the last ten years
            </li>
          </ul>
          <p>
            <Link
              className="link hover-blue underline"
              to="/manual#assumption1"
            >
              Learn more in the Manual
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
