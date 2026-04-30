import { useEffect, useState } from "react";
import { Item } from "../types";

const colors = {
  text: "#3D3328",
  subtext: "#A39B8B",
  accent: "#A68A61",
  border: "#E6E0D4",
  bg: "#F8F6F0",
};

const fonts = {
  serif: '"Noto Serif JP", "Hiragino Mincho ProN", serif',
  sans: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif',
  mono: '"SF Mono", "Courier New", monospace',
};

const PIN_COLORS = ["#c0392b", "#e67e22", "#27ae60", "#2980b9", "#8e44ad"];
const ROTATIONS = [-3.5, -2, -1, 1.5, 2.5, -2.5, 3, -1.5, 0.5, -3];

export default function Photos() {
  const [items, setItems] = useState<Item[]>([]);
  const [selTag, setSelTag] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightbox = lightboxIndex !== null ? displayed[lightboxIndex] : null;

  const goPrev = () =>
    setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i));
  const goNext = () =>
    setLightboxIndex((i) =>
      i !== null && i < displayed.length - 1 ? i + 1 : i,
    );

  useEffect(() => {
    fetch("/data.json")
      .then((r) => r.json())
      .then(setItems);
  }, []);

  const allTags = [...new Set(items.flatMap((i) => i.tags ?? []))];
  const displayed = selTag
    ? items.filter((i) => i.tags?.includes(selTag))
    : items;

  return (
    <>
      {/* ── コルクボード外のヘッダー ── */}
      <div style={{ padding: "0 0 20px 0" }}>
        <h1
          style={{
            fontFamily: fonts.serif,
            fontSize: "26px",
            fontWeight: "bold",
            color: colors.text,
            letterSpacing: "0.05em",
            marginBottom: "16px",
          }}
        >
          🖼️ Myフォト
        </h1>

        {/* タグ検索 */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              color: colors.subtext,
              fontFamily: fonts.sans,
              marginRight: 4,
            }}
          >
            タグ
          </span>
          <TagChip
            label="すべて"
            active={selTag === null}
            onClick={() => setSelTag(null)}
          />
          {allTags.map((t) => (
            <TagChip
              key={t}
              label={t}
              active={selTag === t}
              onClick={() => setSelTag(selTag === t ? null : t)}
            />
          ))}
        </div>

        <div
          style={{
            fontSize: "11px",
            color: colors.subtext,
            fontFamily: fonts.sans,
            marginTop: "10px",
          }}
        >
          {displayed.length} 枚
        </div>
      </div>

      {/* ── コルクボード ── */}
      <div
        style={{
          background: "#B8864E",
          backgroundImage: [
            "repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(0,0,0,0.03) 10px,rgba(0,0,0,0.03) 11px)",
            "repeating-linear-gradient(-45deg,transparent,transparent 10px,rgba(0,0,0,0.02) 10px,rgba(0,0,0,0.02) 11px)",
          ].join(", "),
          borderRadius: "12px",
          padding: "32px 28px 40px",
        }}
      >
        {displayed.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "rgba(255,253,245,0.5)",
              fontSize: "13px",
              fontFamily: fonts.sans,
              fontStyle: "italic",
            }}
          >
            このタグの記録はまだありません
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))",
              gap: "32px 24px",
              alignItems: "start",
            }}
          >
            {displayed.map((item, i) => (
              <PhotoPin
                key={item.id}
                item={item}
                rotation={ROTATIONS[(item.id + i) % ROTATIONS.length]}
                pinColor={PIN_COLORS[(item.id + i) % PIN_COLORS.length]}
                onClick={() => setLightbox(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── ライトボックス ── */}
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
              maxWidth: 440,
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              cursor: "default",
            }}
          >
            <div
              style={{
                width: "100%",
                maxHeight: 300,
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
                  style={{ width: "100%", maxHeight: 300, objectFit: "cover" }}
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

// ── タグチップ ──
function TagChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: "11px",
        padding: "4px 13px",
        borderRadius: "9999px",
        border: `1px solid ${active ? colors.accent : colors.border}`,
        background: active ? colors.accent : colors.bg,
        color: active ? "#fff" : colors.subtext,
        cursor: "pointer",
        fontFamily: fonts.sans,
        transition: "all 0.15s",
      }}
    >
      {active && "# "}
      {label}
    </button>
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
          ? "rotate(0deg) translateY(-6px) scale(1.04)"
          : `rotate(${rotation}deg)`,
        transition: "transform 0.2s ease, filter 0.2s ease",
        filter: `drop-shadow(${
          hovered
            ? "3px 8px 16px rgba(0,0,0,0.4)"
            : "2px 4px 8px rgba(0,0,0,0.25)"
        })`,
        cursor: "zoom-in",
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

      {/* ポラロイド */}
      <div style={{ background: "#FFFDF5", borderRadius: 2 }}>
        <div
          style={{
            width: "100%",
            height: 120,
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
              style={{ width: "100%", height: 120, objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: 38 }}>{item.emoji}</span>
          )}
        </div>
        <div style={{ padding: "7px 10px 10px" }}>
          <div
            style={{
              fontSize: 9,
              fontWeight: "bold",
              color: "#3a2e22",
              fontFamily: fonts.serif,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item.title}
          </div>
          {item.date && (
            <div
              style={{
                fontSize: 8,
                color: "#b8a890",
                fontFamily: fonts.mono,
                marginTop: 2,
              }}
            >
              {item.date}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
