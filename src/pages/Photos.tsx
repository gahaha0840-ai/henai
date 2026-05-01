// src/pages/Photos.tsx
import { useEffect, useState } from "react";
import { PhotoMaterial } from "../types/index.ts";
import PhotoCard from "../components/PhotoCard.tsx";

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
};

const PIN_COLORS = ["#c0392b", "#e67e22", "#27ae60", "#2980b9", "#8e44ad"];
const ROTATIONS = [-3.5, -2, -1, 1.5, 2.5, -2.5, 3, -1.5, 0.5, -3];

export default function Photos() {
  const [items, setItems] = useState<PhotoMaterial[]>([]);
  const [selTag, setSelTag] = useState<string | null>(null);

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
      {/* ── ヘッダー ── */}
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

        {/* タグフィルター */}
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
              <PhotoCard
                key={item.id}
                item={item}
                rotation={ROTATIONS[(item.id + i) % ROTATIONS.length]}
                pinColor={PIN_COLORS[(item.id + i) % PIN_COLORS.length]}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ── タグチップ ──
// ※ TagChip を src/components/TagChip.tsx に切り出す場合はこのブロックを削除し
//    import TagChip from "../components/TagChip"; を追加してください
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