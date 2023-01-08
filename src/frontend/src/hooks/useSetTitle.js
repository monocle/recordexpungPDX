import { useState, useEffect } from "react";

export default function useSetTitle(pageName) {
  const [title, setTitle] = useState(pageName);

  useEffect(() => {
    document.title = title + " - RecordSponge";
  }, [title]);

  return [title, setTitle];
}
