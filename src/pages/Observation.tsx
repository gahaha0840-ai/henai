// src/pages/Observation.tsx
import { useState } from "react";
import { useItems } from "../hooks/useItems.ts";
import ItemCard from "../components/ItemCard.tsx";
import TagChip from "../components/TagChip.tsx";

const colors = {
  bg:      "#F8F6F0",
  text:    "#2A241E", 
  subtext: "#5D544D", 
  accent:  "#8B5E3C", 
  line:    "rgba(139, 94, 60, 0.12)",
};

const fonts = {
  serif: '"Noto Serif JP", "Hiragino Mincho ProN", serif',
  sans:  '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif',
};

export default function Observation() {
  // 1. useItemsから必要なデータだけを受け取る（useEffectでの取得はもう不要です！）
  const { photos, loading, error } = useItems();
  const [selTag, setSelTag] = useState<string | null>(null);

  // 全タグの抽出
  const allTags = [...new Set(photos.flatMap((i) => i.tags ?? []))];
  const displayed = selTag ? photos.filter((i) => i.tags?.includes(selTag)) : photos;

  // ローディングとエラーの表示
  if (loading) return <div style={{ color: "#A39B8B", padding: "40px" }}>観測データを展開中...</div>;
  if (error) return <div style={{ color: "#991B1B", padding: "40px" }}>{error}</div>;

  return (
    <div style={{
      position: "relative",
      minHeight: "100%",
      backgroundColor: colors.bg,
      color: colors.text,
      // 方眼の背景
      backgroundImage: `linear-gradient(${colors.line} 1px, transparent 1px), linear-gradient(90deg, ${colors.line} 1px, transparent 1px)`,
      backgroundSize: "32px 32px",
      margin: "-40px -60px",
      padding: "40px 60px",
    }}>
      
      {/* ── ヘッダー ── */}
      <header style={{ marginBottom: "48px" }}>
        <div style={{ 
          display: "inline-block",
          borderLeft: `5px solid ${colors.accent}`,
          paddingLeft: "20px",
          marginBottom: "12px"
        }}>
          <h1 style={{
            fontSize: "30px",
            fontWeight: "bold",
            fontFamily: fonts.serif,
            margin: 0,
            letterSpacing: "0.15em",
          }}>
            🔭 観測台帳
          </h1>
        </div>
        <p style={{ 
          fontSize: "14px", 
          color: colors.subtext, 
          lineHeight: 1.8, 
          maxWidth: "600px",
          fontFamily: fonts.sans,
        }}>
          誰かの日常に紛れ込んだ「好き」の断片を、並列に観測し、新しい関心の座標を見つけるための場所です。
        </p>
      </header>

      {/* ── タグフィルター ── */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{ 
          fontSize: "12px", 
          color: colors.accent, 
          marginBottom: "10px",
          fontWeight: "bold",
        }}>
          分類 / 索引
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <TagChip
            label="すべて表示"
            active={selTag === null}
            onClick={() => setSelTag(null)}
            fontSize="12px"
          />
          {allTags.map((t) => (
            <TagChip
              key={t}
              label={`#${t}`}
              active={selTag === t}
              onClick={() => setSelTag(selTag === t ? null : t)}
              fontSize="12px"
            />
          ))}
        </div>
      </div>

      {/* ── ステータスバー ── */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: `1px solid ${colors.line}`,
        paddingBottom: "8px",
        marginBottom: "32px",
        fontSize: "12px",
        color: colors.accent
      }}>
        <span>観測対象: {selTag ? `「${selTag}」` : "すべて"}</span>
        <span>標本数: {displayed.length.toString().padStart(3, '0')} 件</span>
      </div>

      {/* ── カードグリッド ── */}
      {displayed.length === 0 ? (
        <div style={{ textAlign: "center", padding: "100px 0", color: colors.subtext, fontFamily: fonts.serif }}>
          該当する記録が見つかりませんでした。
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
          gap: "40px",
        }}>
          {displayed.map((item, index) => (
            <div 
              key={item.id} 
              style={{ 
                position: "relative",
                // わずかにランダムな傾きを付与
                transform: `rotate(${(index % 4 - 1.5) * 0.8}deg)`,
              }}
            >
              <ItemCard item={item} onTagClick={setSelTag} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}