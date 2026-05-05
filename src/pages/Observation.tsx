// src/pages/Observation.tsx
import { useState } from "react";
import { useItems } from "../hooks/useItems.ts";
import ItemCard from "../components/ItemCard.tsx";
import TagChip from "../components/TagChip.tsx";

const F = {
  serif: '"Noto Serif JP","Hiragino Mincho ProN",serif',
  sans: '"Noto Sans JP","Hiragino Kaku Gothic ProN",sans-serif',
  mono: '"SF Mono","Courier New",monospace',
};
const C = {
  text: "#3D3328",
  sub: "#A39B8B",
  accent: "#A68A61",
  border: "#E6E0D4",
  bg: "#F8F6F0",
  card: "#FCFAEF",
};

const fonts = {
  serif: '"Noto Serif JP", "Hiragino Mincho ProN", serif',
  sans: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif',
};

export default function Observation() {
  // 1. useItemsから必要なデータだけを受け取る（useEffectでの取得はもう不要です！）
  const { photos, loading, error } = useItems();
  const [boards, setBoards] = useState<SavedBoard[]>([]);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 99999));
  const [selTag, setSelTag] = useState<string | null>(null);

  // 全タグの抽出
  const allTags = [...new Set(photos.flatMap((i) => i.tags ?? []))];
  const displayed = selTag
    ? photos.filter((i) => i.tags?.includes(selTag))
    : photos;

  // ローディングとエラーの表示
  if (loading)
    return (
      <div style={{ color: "#A39B8B", padding: "40px" }}>
        観測データを展開中...
      </div>
    );
  if (error)
    return <div style={{ color: "#991B1B", padding: "40px" }}>{error}</div>;

  return (
    <>
      {/* ヘッダー */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: F.serif,
                fontSize: 24,
                fontWeight: "bold",
                color: C.text,
                letterSpacing: "0.05em",
                marginBottom: 4,
              }}
            >
              🔭 観測
            </h1>
            <p style={{ fontSize: 12, color: C.sub }}>
              写真と図鑑がランダムに流れてきます。シャッフルで新しい出会いを。
            </p>
          </div>
          <button
            onClick={reshuffle}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: C.bg,
              color: C.sub,
              fontSize: 12,
              cursor: "pointer",
              fontFamily: F.sans,
              transition: "all .15s",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 14 }}>🔀</span> シャッフル
          </button>
        </div>

        {/* フィルター行 */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* 種別フィルター */}
          <div
            style={{
              display: "flex",
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              overflow: "hidden",
              background: C.card,
              flexShrink: 0,
            }}
          >
            {(["all", "photo", "board"] as const).map((v, i) => {
              const labels = {
                all: "すべて",
                photo: "📷 フォト",
                board: "📌 図鑑",
              };
              return (
                <button
                  key={v}
                  onClick={() => setFilter(v)}
                  style={{
                    padding: "5px 14px",
                    border: "none",
                    borderRight: i < 2 ? `1px solid ${C.border}` : "none",
                    background: filter === v ? C.accent : C.card,
                    color: filter === v ? "#fff" : C.sub,
                    fontSize: 11,
                    cursor: "pointer",
                    fontFamily: F.sans,
                    transition: "all .15s",
                  }}
                >
                  {labels[v]}
                </button>
              );
            })}
          </div>

          {/* タグフィルター（横スクロール） */}
          <div
            style={{
              display: "flex",
              gap: 6,
              overflowX: "auto",
              paddingBottom: 2,
              flex: 1,
              minWidth: 0,
            }}
          >
            <TagChip
              label="すべて"
              active={selTag === null}
              onClick={() => setSelTag(null)}
            />
            {allTags.map((t) => (
              <TagChip
                key={t}
                label={`#${t}`}
                active={selTag === t}
                onClick={() => setSelTag(selTag === t ? null : t)}
              />
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: 16,
            background: "#FEE2E2",
            color: "#991B1B",
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: C.sub,
            fontSize: 13,
            fontStyle: "italic",
          }}
        >
          観測中...
        </div>
      ) : feed.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: C.sub }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔭</div>
          <div style={{ fontSize: 13, fontStyle: "italic" }}>
            条件に合う記録がありません
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
            gap: "40px",
          }}
        >
          {displayed.map((item, index) => (
            <div
              key={item.id}
              style={{
                position: "relative",
                // わずかにランダムな傾きを付与
                transform: `rotate(${((index % 4) - 1.5) * 0.8}deg)`,
              }}
            >
              <ItemCard item={item} onTagClick={setSelTag} />
            </div>
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
        flexShrink: 0,
        fontSize: 11,
        padding: "4px 13px",
        borderRadius: 9999,
        border: `1px solid ${active ? C.accent : C.border}`,
        background: active ? C.accent : C.bg,
        color: active ? "#fff" : C.sub,
        cursor: "pointer",
        fontFamily: F.sans,
        transition: "all .15s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}
