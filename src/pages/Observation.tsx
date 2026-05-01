// src/pages/Observation.tsx
import { useEffect, useState } from "react";
import { PhotoMaterial } from "../types/index.ts";
import ItemCard from "../components/ItemCard.tsx";
import TagChip from "../components/TagChip.tsx";

const colors = {
  bg: "#F8F6F0",
  text: "#3D3328",
  subtext: "#A39B8B",
};

const fonts = {
  serif: '"Noto Serif JP", "Hiragino Mincho ProN", serif',
  sans: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif',
};

export default function Observation() {
  const [items, setItems] = useState<PhotoMaterial[]>([]);
  const [selTag, setSelTag] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const res = await fetch("/data.json");
        if (!res.ok) {
          throw new Error(`データの取得に失敗しました (${res.status})`);
        }
        const data: PhotoMaterial[] = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
        setError("データの読み込みに失敗しました。再読み込みしてください。");
      }
    };

    loadItems();
  }, []);

  const allTags = [...new Set(items.flatMap((i) => i.tags ?? []))];
  const displayed = selTag
    ? items.filter((i) => i.tags?.includes(selTag))
    : items;

  return (
    <>
      {/* ── ページヘッダー ── */}
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

      {/* ── タグフィルター ── */}
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
            fontSize="12px"
            padding="5px 14px"
          />
          {allTags.map((t) => (
            <TagChip
              key={t}
              label={t}
              active={selTag === t}
              onClick={() => setSelTag(selTag === t ? null : t)}
              fontSize="12px"
              padding="5px 14px"
            />
          ))}
        </div>
      </div>

      {/* ── エラー表示 ── */}
      {error ? (
        <div
          style={{
            padding: "16px",
            borderRadius: "12px",
            background: "#ffecec",
            color: "#991b1b",
            marginBottom: "24px",
          }}
        >
          {error}
        </div>
      ) : null}

      {/* ── 件数表示 ── */}
      <div
        style={{
          fontSize: "12px",
          color: colors.subtext,
          marginBottom: "20px",
        }}
      >
        {selTag ? `「${selTag}」` : "すべて"} — {displayed.length} 件
      </div>

      {/* ── カードグリッド ── */}
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
            gap: "28px",
            padding: "12px",
          }}
        >
          {displayed.map((item) => (
            <ItemCard key={item.id} item={item} onTagClick={setSelTag} />
          ))}
        </div>
      )}
    </>
  );
}