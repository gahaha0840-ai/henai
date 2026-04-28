import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";

const NAV = [
  { label: "マイ図鑑", to: "/" },
  { label: "写真", to: "/photos" },
  { label: "観測", to: "/obs" },
];
type Props = { children: ReactNode };

export default function Layout({ children }: Props) {
  const { pathname } = useLocation();

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f2ede4",
        fontFamily: "-apple-system,'Hiragino Sans',sans-serif",
      }}
    >
      <div
        style={{
          width: 160,
          background: "#1c1710",
          padding: "20px 0",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: "0 16px 16px",
            borderBottom: "0.5px solid #2a2418",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 500, color: "#c8a060" }}>
            偏愛図鑑
          </div>
          <div style={{ fontSize: 9, color: "#4a3e2e", marginTop: 2 }}>
            personal archive
          </div>
        </div>

        <nav style={{ padding: "12px 0" }}>
          {NAV.map(({ label, to }) => (
            <Link key={to} to={to} style={{ textDecoration: "none" }}>
              <div
                style={{
                  padding: "10px 16px",
                  fontSize: 12,
                  color: pathname === to ? "#c8a060" : "#6a5c48",
                  background: pathname === to ? "#241e14" : "transparent",
                  borderLeft: `2px solid ${pathname === to ? "#c8a060" : "transparent"}`,
                }}
              >
                {label}
              </div>
            </Link>
          ))}
        </nav>
      </div>

      <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>{children}</div>
    </div>
  );
}
