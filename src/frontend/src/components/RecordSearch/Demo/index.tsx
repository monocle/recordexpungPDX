import React, { useEffect } from "react";
import RecordSearch from "../../RecordSearch";
import { useAppDispatch } from "../../../redux/hooks";
import { startDemo } from "../../../redux/search/actions";

export default function Demo() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(startDemo());
  });

  return <RecordSearch />;
}
