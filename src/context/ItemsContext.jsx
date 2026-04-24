import { createContext, useContext, useEffect, useState } from "react";

const ItemsContext = createContext(null);

export function ItemsProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/data.json")
      .then((r) => r.json())
      .then(setItems);
  }, []);

  const addItem = (item) => setItems((prev) => [item, ...prev]);

  return (
    <ItemsContext.Provider value={{ items, addItem }}>
      {children}
    </ItemsContext.Provider>
  );
}

export const useItems = () => useContext(ItemsContext);
