import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext({ data: null, error: null });

export function DataProvider({ children }) {
  const [state, setState] = useState({ data: null, error: null });

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/results.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setState({ data, error: null }))
      .catch((e) => setState({ data: null, error: e.message }));
  }, []);

  return <DataContext.Provider value={state}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext);
