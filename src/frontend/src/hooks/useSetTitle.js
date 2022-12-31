import { useEffect } from "react";

export default function useSetTitle(pageName) {
  useEffect(() => {
    document.title = pageName + " - RecordSponge";
  }, [pageName]);
}
