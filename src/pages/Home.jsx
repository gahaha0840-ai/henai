import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ItemCard from "../components/ItemCard";

export default function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then(setItems);
  }, []);

  return (
    <Layout>
      <h2>マイ図鑑</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 10,
        }}
      >
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </Layout>
  );
}
