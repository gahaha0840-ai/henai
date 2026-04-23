import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* sidebar */}
      <div
        style={{
          width: 160,
          background: "#1c1710",
          color: "#c8a060",
          padding: 20,
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <div>偏愛図鑑</div>
          <div style={{ fontSize: 10, opacity: 0.6 }}>
            世界の断片を観測する場所
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link to="/">マイ図鑑</Link>
          <Link to="/zukan">図鑑</Link>
          <Link to="/obs">観測</Link>
        </nav>
      </div>

      {/* main */}
      <div style={{ flex: 1, padding: 20 }}>{children}</div>
    </div>
  );
}
