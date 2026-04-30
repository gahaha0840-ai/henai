// src/components/Layout.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  // --- スタイル定義（Tailwindの代わり） ---
  const colors = {
    bg: "#F8F6F0", // 背景（紙のオフホワイト）
    text: "#3D3328", // メインテキスト（ダークブラウン）
    subtext: "#A39B8B", // サブテキスト
    accent: "#A68A61", // アクセント（ゴールド）
    border: "#E6E0D4", // 枠線
    card: "#FCFAEF", // カード背景
  };

  const fonts = {
    serif: '"Noto Serif JP", "Hiragino Mincho ProN", serif',
    sans: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif',
  };

  // --- アクティブなリンクのスタイルを判定 ---
  const getLinkStyle = (path: string) => {
    const isActive = location.pathname === path;
    return {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      width: "100%",
      padding: "8px 16px",
      borderRadius: "8px",
      textDecoration: "none",
      fontWeight: isActive ? "bold" : "normal",
      color: isActive ? colors.accent : colors.subtext,
      backgroundColor: isActive ? "rgba(230, 224, 212, 0.2)" : "transparent",
      transition: "all 0.2s",
    };
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: colors.bg,
        color: colors.text,
        fontFamily: fonts.sans,
        overflow: "hidden",
      }}
    >
      {/* 1. 左サイドバー（ナビゲーション） */}
      <aside
        style={{
          width: "200px",
          borderRight: `1px solid ${colors.border}`,
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexShrink: 0,
          backgroundColor: colors.bg,
          zIndex: 10,
        }}
      >
        <div>
          <Link
            to="/"
            style={{
              display: "block",
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "40px",
              letterSpacing: "0.1em",
              fontFamily: fonts.serif,
              color: colors.text,
              textDecoration: "none",
            }}
          >
            偏愛図鑑
          </Link>

          <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Link to="/" style={getLinkStyle("/")}>
              <span style={{ fontSize: "20px" }}>🏠</span>
              <span>ホーム</span>
            </Link>

            <Link to="/photos" style={getLinkStyle("/photos")}>
              <span style={{ fontSize: "20px" }}>🖼️</span>
              <span>Myフォト</span>
            </Link>

            <Link to="/obs" style={getLinkStyle("/obs")}>
              <span style={{ fontSize: "20px" }}>🔭</span>
              <span>観測</span>
            </Link>
          </nav>
        </div>

        {/* プロフィールエリア */}
        <div
          style={{
            borderTop: `1px solid ${colors.border}`,
            paddingTop: "24px",
            marginTop: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
              padding: "0 8px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: colors.border,
                borderRadius: "50%",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(to top right, rgba(166,138,97,0.2), #E6E0D4)",
                }}
              ></div>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", minWidth: 0 }}
            >
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                ユーザー名
              </span>
              <span style={{ fontSize: "10px", color: colors.subtext }}>
                称号: 空間の探求者
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. 中央メインコンテンツ */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          position: "relative",
          scrollBehavior: "smooth",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
        }}
      >
        <div
          style={{
            padding: "32px 48px",
            maxWidth: "1024px",
            margin: "0 auto",
            minHeight: "100%",
          }}
        >
          {/* App.tsxのRoutesの中身がここに表示されます */}
          {children}
        </div>
      </main>

      {/* 3. 右サイドバー（統計・活動記録） */}
      <aside
        style={{
          width: "250px",
          borderLeft: `1px solid ${colors.border}`,
          padding: "24px",
          backgroundColor: "rgba(248, 246, 240, 0.5)",
          flexShrink: 0,
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <section>
            <h2
              style={{
                fontWeight: "bold",
                marginBottom: "16px",
                fontSize: "14px",
                letterSpacing: "0.05em",
                color: colors.subtext,
                textTransform: "uppercase",
              }}
            >
              自分の傾向
            </h2>
            <div
              style={{
                padding: "20px",
                backgroundColor: colors.card,
                borderRadius: "16px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                border: `1px solid ${colors.border}`,
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    padding: "4px 12px",
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: "9999px",
                  }}
                >
                  #キーボード
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    padding: "4px 12px",
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: "9999px",
                  }}
                >
                  #3Dプリンタ
                </span>
              </div>
            </div>
          </section>

          <section>
            <h2
              style={{
                fontWeight: "bold",
                marginBottom: "16px",
                fontSize: "14px",
                letterSpacing: "0.05em",
                color: colors.subtext,
                textTransform: "uppercase",
              }}
            >
              最近の通知
            </h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div
                style={{
                  fontSize: "12px",
                  padding: "12px",
                  backgroundColor: "rgba(255,255,255,0.5)",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                  color: colors.subtext,
                  fontStyle: "italic",
                }}
              >
                「誰かがあなたの図鑑をめくりました」
              </div>
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
};

export default Layout;
