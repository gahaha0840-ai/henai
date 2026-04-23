import React from "react";
export default function ItemCard({ item }) {
  return (
    <div
      style={{
        background: "#faf6ef",
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid #ddd",
      }}
    >
      <div
        style={{
          height: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 30,
        }}
      >
        {item.emoji}
      </div>

      <div style={{ padding: 10 }}>
        <div style={{ fontWeight: "bold" }}>{item.title}</div>
        <div style={{ fontSize: 12 }}>{item.memo}</div>

        <div style={{ marginTop: 6 }}>
          {item.tags.map((t) => (
            <span
              key={t}
              style={{
                fontSize: 10,
                marginRight: 4,
                background: "#eee",
                padding: "2px 6px",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <button style={{ marginTop: 8 }}>この断片を記録に残す</button>
      </div>
    </div>
  );
}
