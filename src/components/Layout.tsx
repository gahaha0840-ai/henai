import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";

const NAV = [
  { label: "マイ図鑑", to: "/" },
  { label: "写真", to: "/photos" },
  { label: "観測", to: "/obs" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      {/* ナビゲーションバー */}
      <nav style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              textDecoration: "none",
              fontWeight: location.pathname === item.to ? "bold" : "normal",
              color: location.pathname === item.to ? "blue" : "black",
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* ここに各ページの中身（Home.tsxなど）が表示される */}
      <main>{children}</main>
    </div>
  );
}
