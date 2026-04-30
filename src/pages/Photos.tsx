import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Item } from "../types";

const colors = {
  bg: "#F8F6F0",
  text: "#3D3328",
  subtext: "#A39B8B",
  accent: "#A68A61",
  border: "#E6E0D4",
  card: "#FCFAEF",
};

const fonts = {
  serif: '"Noto Serif JP", "Hiragino Mincho ProN", serif',
  sans: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif',
};

const COLLECTIONS = [
  "すべて",
  "錆と腐",
  "苔・植物",
  "窓と光",
  "石",
  "雨と水",
  "木と板",
  "影",
];

type ViewMode = "grid" | "cork";

export default function Photos() {
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState("すべて");
  const [view, setView] = useState<ViewMode>("grid");

  useEffect(() => {
    fetch("/data.json")
      .then((r) => r.json())
      .then(setItems);
  }, []);

  const displayed =
    filter === "すべて" ? items : items.filter((i) => i.collection === filter);

  return (
    <>
      {/* ページヘッダー */}
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            fontFamily: fonts.serif,
            color: colors.text,
            marginBottom: "8px",
            letterSpacing: "0.05em",
          }}
        >
          🖼️ Myフォト
        </h1>
        <p style={{ fontSize: "13px", color: colors.subtext, lineHeight: 1.6 }}>
          集めた断片たち。コレクションで整理しよう。
        </p>
      </div>

      {/* ツールバー：フィルター + 表示切り替え */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        {/* コレクションフィルター */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {COLLECTIONS.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                fontSize: "12px",
                padding: "5px 14px",
                borderRadius: "9999px",
                border: `1px solid ${filter === c ? colors.accent : colors.border}`,
                background: filter === c ? colors.accent : colors.bg,
                color: filter === c ? "#fff" : colors.subtext,
                cursor: "pointer",
                fontFamily: fonts.sans,
                transition: "all 0.15s",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* グリッド / コルク 切り替え */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            flexShrink: 0,
            background: colors.border,
            borderRadius: "8px",
            padding: "3px",
          }}
        >
          {(["grid", "cork"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                fontSize: "11px",
                padding: "5px 12px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontFamily: fonts.sans,
                background: view === v ? colors.card : "transparent",
                color: view === v ? colors.text : colors.subtext,
                boxShadow: view === v ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s",
              }}
            >
              {v === "grid" ? "⊞ グリッド" : "📌 コルク"}
            </button>
          ))}
        </div>
      </div>

      {/* 件数 */}
      <div
        style={{
          fontSize: "12px",
          color: colors.subtext,
          marginBottom: "16px",
        }}
      >
        {filter === "すべて" ? "すべて" : `「${filter}」`} — {displayed.length}{" "}
        件
      </div>

      {/* 空状態 */}
      {displayed.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: colors.subtext,
            fontSize: "13px",
            fontStyle: "italic",
          }}
        >
          このコレクションにはまだ記録がありません
        </div>
      )}

      {/* グリッドビュー */}
      {view === "grid" && displayed.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {displayed.map((item) => (
            <PhotoCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* コルクビュー */}
      {view === "cork" && displayed.length > 0 && (
        <CorkBoard items={displayed} />
      )}
    </>
  );
}

// ── グリッド用カード ──
function PhotoCard({ item }: { item: Item }) {
  return (
    <div
      style={{
        background: colors.card,
        borderRadius: "12px",
        overflow: "hidden",
        border: `1px solid ${colors.border}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          height: 130,
          background: item.bg ?? "#E6E0D4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {item.img ? (
          <img
            src={item.img}
            alt={item.title}
            style={{ width: "100%", height: 130, objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: 44 }}>{item.emoji}</span>
        )}
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div
          style={{
            fontWeight: "bold",
            fontSize: "13px",
            color: colors.text,
            marginBottom: "4px",
            fontFamily: fonts.serif,
          }}
        >
          {item.title}
        </div>
        {item.memo && (
          <div
            style={{
              fontSize: "11px",
              color: colors.subtext,
              lineHeight: 1.5,
              marginBottom: "8px",
            }}
          >
            {item.memo}
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "5px",
            marginBottom: "8px",
          }}
        >
          {item.tags.map((t) => (
            <span
              key={t}
              style={{
                fontSize: "10px",
                padding: "2px 8px",
                borderRadius: "9999px",
                border: `1px solid ${colors.border}`,
                background: colors.bg,
                color: colors.subtext,
              }}
            >
              # {t}
            </span>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
            color: colors.subtext,
          }}
        >
          {item.loc && <span>📍 {item.loc}</span>}
          {item.date && <span>{item.date}</span>}
        </div>
      </div>
    </div>
  );
}

// ── コルクボード ──
const PIN_COLORS = ["#c04030", "#e8a020", "#3a9040", "#304860", "#5a3060"];
const ROTATIONS = [-2.5, 1.2, -1, 2, -1.5, 0.8, -2, 1.5];

function CorkBoard({ items }: { items: Item[] }) {
  return (
    <div
      style={{
        background: "#C8A06A",
        borderRadius: "12px",
        padding: "24px",
        backgroundImage:
          "repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(0,0,0,0.02) 10px,rgba(0,0,0,0.02) 11px)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "20px",
        }}
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            style={{
              transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg)`,
              filter: "drop-shadow(2px 4px 8px rgba(0,0,0,0.25))",
            }}
          >
            {/* ピン */}
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: PIN_COLORS[i % PIN_COLORS.length],
                margin: "0 auto -5px",
                position: "relative",
                zIndex: 2,
                boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
              }}
            />
            <div
              style={{
                background: "#FFFDF5",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: 90,
                  background: item.bg ?? "#E6E0D4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {item.img ? (
                  <img
                    src={item.img}
                    alt={item.title}
                    style={{ width: "100%", height: 90, objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ fontSize: 32 }}>{item.emoji}</span>
                )}
              </div>
              <div style={{ padding: "6px 8px 8px" }}>
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: "bold",
                    color: "#3a2e22",
                    lineHeight: 1.3,
                    marginBottom: 2,
                  }}
                >
                  {item.title}
                </div>
                {item.loc && (
                  <div style={{ fontSize: 8, color: "#9a8878" }}>
                    📍{item.loc}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
