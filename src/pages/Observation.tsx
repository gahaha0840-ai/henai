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

//状態
export default function Observation() {
  const [items, setItems] = useState<Item[]>([]);
  const [selTag, setSelTag] = useState<string | null>(null);
  //データの読み込み
  useEffect(() => {
    fetch("/data.json")
      .then((r) => r.json())
      .then(setItems);
  }, []);
  //タグの抽出と表示アイテムの絞り込み
  const allTags = [...new Set(items.flatMap((i) => i.tags ?? []))];
  const displayed = selTag
    ? items.filter((i) => i.tags?.includes(selTag))
    : items;

  return (
    <>
      {/* ページヘッダー */}
      <div style={{ marginBottom: "32px" }}>
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
          🔭 観測
        </h1>
        <p style={{ fontSize: "13px", color: colors.subtext, lineHeight: 1.6 }}>
          タグから世界を観測する。気になる断片を手がかりに、好きを深掘りしよう。
        </p>
      </div>

      {/* タグフィルター */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: colors.subtext,
            marginBottom: "10px",
            fontWeight: "bold",
          }}
        >
          タグで絞り込む
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
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
      </div>

      {/* 件数表示 */}
      <div
        style={{
          fontSize: "12px",
          color: colors.subtext,
          marginBottom: "20px",
        }}
      >
        {selTag ? `「${selTag}」` : "すべて"} — {displayed.length} 件
      </div>

      {/* カードグリッド */}
      {displayed.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: colors.subtext,
            fontSize: "13px",
            fontStyle: "italic",
          }}
        >
          このタグの記録はまだありません
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {displayed.map((item) => (
            <ObsCard key={item.id} item={item} onTagClick={setSelTag} />
          ))}
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
        fontSize: "12px",
        padding: "5px 14px",
        borderRadius: "9999px",
        border: `1px solid ${active ? colors.accent : colors.border}`,
        background: active ? colors.accent : colors.bg,
        color: active ? "#fff" : colors.subtext,
        cursor: "pointer",
        fontFamily: fonts.sans,
        transition: "all 0.15s",
      }}
    >
      {active ? "# " : ""}
      {label}
    </button>
  );
}

// ── 観測カード ──
function ObsCard({
  item,
  onTagClick,
}: {
  item: Item;
  onTagClick: (tag: string) => void;
}) {
  return (
    <div
      style={{
        background: colors.card,
        borderRadius: "12px",
        overflow: "hidden",
        border: `1px solid ${colors.border}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.15s",
      }}
    >
      {/* 画像 or 絵文字 */}
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
            marginBottom: "5px",
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
              lineHeight: 1.6,
              marginBottom: "10px",
            }}
          >
            {item.memo}
          </div>
        )}

        {/* タグ（クリックで絞り込み） */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "5px",
            marginBottom: "8px",
          }}
        >
          {item.tags.map((t) => (
            <button
              key={t}
              onClick={() => onTagClick(t)}
              style={{
                fontSize: "10px",
                padding: "2px 9px",
                borderRadius: "9999px",
                border: `1px solid ${colors.border}`,
                background: colors.bg,
                color: colors.subtext,
                cursor: "pointer",
                fontFamily: fonts.sans,
              }}
            >
              #{t}
            </button>
          ))}
        </div>

        {/* 場所・日付 */}
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
