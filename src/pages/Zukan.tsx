// src/pages/Zukan.tsx
import { useState } from "react";
import { useItems } from "../hooks/useItems.ts";
import ZukanCard from "../components/ZukanCard.tsx";
import TagChip from "../components/TagChip.tsx";

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

function Zukan() {
  // 共通フックから図鑑のデータ（collections）と状態を受け取る
  const { collections, loading, error } = useItems();
  const [selTag, setSelTag] = useState<string | null>(null);

  // aiTags から # を除いてフィルター用タグを生成
  const allTags = [
    ...new Set(
      collections.flatMap((c) =>
        (c.aiTags ?? []).map((t) => t.replace(/^#/, ""))
      )
    ),
  ];

  const displayed = selTag
    ? collections.filter((c) =>
        c.aiTags?.some((t) => t.replace(/^#/, "") === selTag)
      )
    : collections;

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
          📖 図鑑
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
          {displayed.length} 件
        </div>
      </div>

      {/* ── エラー表示 ── */}
      {error && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#FEE2E2",
            color: "#991B1B",
            borderRadius: "8px",
            marginBottom: "16px",
            fontSize: "13px",
            fontFamily: fonts.sans,
          }}
        >
          {error}
        </div>
      )}

      {/* ── ローディング ── */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: colors.subtext,
            fontSize: "13px",
            fontFamily: fonts.sans,
            fontStyle: "italic",
          }}
        >
          図鑑を開いています...
        </div>
      ) : !error && displayed.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: colors.subtext,
            fontSize: "13px",
            fontFamily: fonts.sans,
            fontStyle: "italic",
          }}
        >
          このタグの図鑑はまだありません
        </div>
      ) : !error && (
        /* ── カードグリッド ── */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {displayed.map((item) => (
            <ZukanCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  );
}

export default Zukan;