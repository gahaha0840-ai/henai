import { useEffect, useState } from "react";
import { Item } from "../types";

const colors = {
  text: "#3D3328",
  subtext: "#A39B8B",
  accent: "#A68A61",
  border: "#E6E0D4",
};

const fonts = {
  serif: '"Noto Serif JP", "Hiragino Mincho ProN", serif',
  sans: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif',
  mono: '"SF Mono", "Courier New", monospace',
};

const PIN_COLORS = [
  "#c0392b",
  "#e67e22",
  "#27ae60",
  "#2980b9",
  "#8e44ad",
  "#c0392b",
];
const ROTATIONS = [-3.5, -2, -1, 1.5, 2.5, -2.5, 3, -1.5, 0.5, -3];

// 日付ごとにグループ化
function groupByDate(items: Item[]): Record<string, Item[]> {
  return items.reduce(
    (acc, item) => {
      const key = item.date ?? "日付なし";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, Item[]>,
  );
}

export default function Photos() {
  const [items, setItems] = useState<Item[]>([]);
  const [lightbox, setLightbox] = useState<Item | null>(null);

  useEffect(() => {
    fetch("/data.json")
      .then((r) => r.json())
      .then(setItems);
  }, []);

  const grouped = groupByDate(items);
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <>
      {/* コルクボード全体 */}
      <div
        style={{
          minHeight: "100vh",
          background: "#B8864E",
          backgroundImage: [
            "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 11px)",
            "repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(0,0,0,0.02) 10px, rgba(0,0,0,0.02) 11px)",
          ].join(", "),
          padding: "32px 40px",
          position: "relative",
        }}
      >
        {/* タイトル */}
        <div style={{ marginBottom: "36px" }}>
          <h1
            style={{
              fontFamily: fonts.serif,
              fontSize: "22px",
              color: "#FFFDF5",
              letterSpacing: "0.08em",
              textShadow: "0 1px 3px rgba(0,0,0,0.3)",
              margin: 0,
            }}
          >
            📌 Myフォト
          </h1>
          <p
            style={{
              fontSize: "11px",
              color: "rgba(255,253,245,0.6)",
              marginTop: 4,
              fontFamily: fonts.sans,
            }}
          >
            {items.length} 枚の記録
          </p>
        </div>

        {/* 日付グループ */}
        {sortedDates.map((date) => (
          <div key={date} style={{ marginBottom: "48px" }}>
            {/* 付箋風日付ラベル */}
            <div
              style={{
                display: "inline-block",
                background: "#FFF9C4",
                color: "#5a4a30",
                fontFamily: fonts.mono,
                fontSize: "12px",
                fontWeight: "bold",
                padding: "6px 16px 8px",
                borderRadius: "2px",
                marginBottom: "20px",
                boxShadow: "2px 3px 8px rgba(0,0,0,0.2)",
                transform: "rotate(-1deg)",
                position: "relative",
                letterSpacing: "0.05em",
              }}
            >
              {/* 付箋の折り目 */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 0,
                  height: 0,
                  borderStyle: "solid",
                  borderWidth: "0 0 10px 10px",
                  borderColor: "transparent transparent #e8e098 transparent",
                }}
              />
              {date}
            </div>

            {/* 写真グリッド */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "28px",
                padding: "8px 4px",
              }}
            >
              {grouped[date].map((item, i) => (
                <PhotoPin
                  key={item.id}
                  item={item}
                  rotation={ROTATIONS[(item.id + i) % ROTATIONS.length]}
                  pinColor={PIN_COLORS[(item.id + i) % PIN_COLORS.length]}
                  onClick={() => setLightbox(item)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ライトボックス */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#FFFDF5",
              borderRadius: 4,
              padding: "16px 16px 20px",
              maxWidth: 460,
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              cursor: "default",
            }}
          >
            <div
              style={{
                width: "100%",
                maxHeight: 320,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: lightbox.bg ?? "#E6E0D4",
                marginBottom: 14,
              }}
            >
              {lightbox.img ? (
                <img
                  src={lightbox.img}
                  alt={lightbox.title}
                  style={{ width: "100%", maxHeight: 320, objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: 72 }}>{lightbox.emoji}</span>
              )}
            </div>
            <div
              style={{
                fontFamily: fonts.serif,
                fontSize: 15,
                fontWeight: "bold",
                color: colors.text,
                marginBottom: 6,
              }}
            >
              {lightbox.title}
            </div>
            {lightbox.memo && (
              <div
                style={{
                  fontSize: 12,
                  color: colors.subtext,
                  lineHeight: 1.6,
                  marginBottom: 10,
                }}
              >
                {lightbox.memo}
              </div>
            )}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 5,
                marginBottom: 10,
              }}
            >
              {lightbox.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 10,
                    padding: "2px 9px",
                    borderRadius: 9999,
                    border: `1px solid ${colors.border}`,
                    color: colors.subtext,
                    fontFamily: fonts.sans,
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
                fontSize: 10,
                color: colors.subtext,
              }}
            >
              {lightbox.loc && <span>📍 {lightbox.loc}</span>}
              {lightbox.date && (
                <span style={{ fontFamily: fonts.mono }}>{lightbox.date}</span>
              )}
            </div>
            <button
              onClick={() => setLightbox(null)}
              style={{
                marginTop: 16,
                width: "100%",
                padding: "8px",
                background: "transparent",
                border: `1px solid ${colors.border}`,
                borderRadius: 6,
                color: colors.subtext,
                fontSize: 12,
                cursor: "pointer",
                fontFamily: fonts.sans,
              }}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── ピン留め写真カード ──
function PhotoPin({
  item,
  rotation,
  pinColor,
  onClick,
}: {
  item: Item;
  rotation: number;
  pinColor: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered
          ? "rotate(0deg) translateY(-6px) scale(1.03)"
          : `rotate(${rotation}deg)`,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        filter: `drop-shadow(${hovered ? "3px 8px 16px rgba(0,0,0,0.35)" : "2px 4px 8px rgba(0,0,0,0.25)"})`,
        cursor: "zoom-in",
        position: "relative",
      }}
    >
      {/* ピン */}
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: pinColor,
          border: "2px solid rgba(0,0,0,0.2)",
          margin: "0 auto -6px",
          position: "relative",
          zIndex: 2,
          boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
        }}
      />

      {/* ポラロイド風カード */}
      <div
        style={{
          background: "#FFFDF5",
          borderRadius: 2,
          overflow: "hidden",
          paddingBottom: 8,
        }}
      >
        <div
          style={{
            width: "100%",
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
            <span style={{ fontSize: 40 }}>{item.emoji}</span>
          )}
        </div>

        {/* タイトル */}
        <div style={{ padding: "8px 10px 2px" }}>
          <div
            style={{
              fontSize: 9,
              fontWeight: "bold",
              color: "#3a2e22",
              lineHeight: 1.3,
              fontFamily: fonts.serif,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.title}
          </div>
          {item.loc && (
            <div
              style={{
                fontSize: 8,
                color: "#9a8878",
                marginTop: 2,
                fontFamily: fonts.sans,
              }}
            >
              📍 {item.loc}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
