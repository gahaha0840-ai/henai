import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import PostModal from "./PostModal";
import RightPanel from "./RightPanel";
import { FONT } from "../constants";

const NAV = [
  { l: "マイ図鑑", i: "⊞", to: "/" },
  { l: "写真", i: "🖼", to: "/photos" },
  { l: "図鑑", i: "📚", to: "/zukan" },
  { l: "観測", i: "👁", to: "/obs" },
];

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const [showPost, setShowPost] = useState(false);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "130px 1fr 160px",
        minHeight: "100vh",
        fontFamily: FONT,
        background: "#f2ede4",
      }}
    >
      {/* ── SIDEBAR ── */}
      <div
        style={{
          background: "#1c1710",
          padding: "18px 0 14px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#c8a060",
            letterSpacing: ".06em",
            padding: "0 14px 14px",
            borderBottom: "0.5px solid #2a2418",
          }}
        >
          偏愛図鑑
          <div style={{ fontSize: 8, color: "#4a3e2e", marginTop: 1 }}>
            personal archive
          </div>
        </div>

        <nav style={{ padding: "12px 0", flex: 1 }}>
          {NAV.map(({ l, i, to }) => (
            <Link key={l} to={to} style={{ textDecoration: "none" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 14px",
                  fontSize: 11,
                  color: pathname === to ? "#c8a060" : "#6a5c48",
                  background: pathname === to ? "#241e14" : "transparent",
                  borderLeft: `2px solid ${pathname === to ? "#c8a060" : "transparent"}`,
                  cursor: "pointer",
                }}
              >
                <span>{i}</span>
                {l}
              </div>
            </Link>
          ))}
          <div
            onClick={() => setShowPost(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 14px",
              fontSize: 11,
              color: "#6a5c48",
              cursor: "pointer",
              marginTop: 8,
              borderTop: "0.5px solid #2a2418",
            }}
          >
            <span>✎</span>記録する
          </div>
        </nav>

        {/* avatar */}
        <div
          style={{ padding: "12px 14px 0", borderTop: "0.5px solid #2a2418" }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#3a2e1e",
              border: "1.5px solid #c8a060",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 600,
              color: "#c8a060",
              marginBottom: 6,
            }}
          >
            K
          </div>
          <div style={{ fontSize: 10, color: "#c8b090", fontWeight: 500 }}>
            kei
          </div>
          <div style={{ fontSize: 8, color: "#4a3e2e", marginTop: 1 }}>
            @kei_archive
          </div>
          <div
            style={{
              fontSize: 8,
              color: "#5a4e3a",
              lineHeight: 1.5,
              marginTop: 5,
            }}
          >
            朽ちていくものの中に時間を見る。
          </div>
          <div
            style={{
              marginTop: 6,
              display: "inline-block",
              fontSize: 7,
              padding: "2px 6px",
              borderRadius: 3,
              background: "#2a1e10",
              border: "0.5px solid #c8a060",
              color: "#c8a060",
            }}
          >
            朽廃の収集者 Lv.3
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ padding: "16px 14px", overflowY: "auto" }}>{children}</div>

      {/* ── RIGHT ── */}
      <RightPanel />

      {showPost && <PostModal onClose={() => setShowPost(false)} />}
    </div>
  );
}
