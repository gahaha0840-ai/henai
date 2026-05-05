// src/pages/Observation.tsx
import { useState, useMemo } from "react";
import { useItems } from "../hooks/useItems.ts";
import TagChip from "../components/TagChip.tsx";
import { PhotoMaterial } from "../types/index.ts";

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
  mono:  '"SF Mono", "Courier New", monospace',
};

export default function Observation() {
  const { photos, loading, error } = useItems();
  const [selTag, setSelTag] = useState<string | null>(null);

  // 全タグの抽出（aiTagsとユーザー追加のtagsを統合し、#を外して重複をなくす）
  const allTags = useMemo(() => {
    const combinedTags = photos.flatMap((p) => 
      [...(p.aiTags || []), ...(p.tags || [])].map(t => t.replace(/^#/, ""))
    );
    return [...new Set(combinedTags)];
  }, [photos]);

  // 選択されたタグで絞り込み
  const displayed = useMemo(() => {
    if (!selTag) return photos;
    return photos.filter((p) => {
      const itemTags = [...(p.aiTags || []), ...(p.tags || [])].map(t => t.replace(/^#/, ""));
      return itemTags.includes(selTag);
    });
  }, [photos, selTag]);

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
              <ObservationCard item={item} onTagClick={setSelTag} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 観測台帳専用のテキストなしカード ──
function ObservationCard({ item, onTagClick }: { item: PhotoMaterial, onTagClick: (t: string) => void }) {
  const [hovered, setHovered] = useState(false);
  
  // AIタグとユーザー追加タグを統合
  const itemTags = [...new Set([...(item.aiTags || []), ...(item.tags || [])].map(t => t.replace(/^#/, "")))];

  return (
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#FFFDF5",
        borderRadius: "12px",
        overflow: "hidden",
        border: `1px solid ${colors.line}`,
        boxShadow: hovered ? "0 8px 24px rgba(139, 94, 60, 0.12)" : "0 4px 12px rgba(139, 94, 60, 0.06)",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 画像エリア */}
      <div style={{ 
        aspectRatio: "4/3", 
        overflow: "hidden", 
        background: "#EAE6DB", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        {(item.img ?? item.imageUrl) ? (
          <img 
            src={item.img ?? item.imageUrl} 
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover", 
              transition: "transform 0.5s ease", 
              transform: hovered ? "scale(1.05)" : "scale(1)" 
            }} 
            alt="" 
          />
        ) : (
          <span style={{ fontSize: 40 }}>📷</span>
        )}
      </div>

      {/* タグと日付のエリア（タイトルやメモは非表示） */}
      <div style={{ padding: "16px" }}>
        {itemTags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
            {itemTags.map(t => (
              <span 
                key={t}
                onClick={(e) => { e.stopPropagation(); onTagClick(t); }}
                style={{
                  fontSize: "10px",
                  padding: "4px 8px",
                  borderRadius: "999px",
                  background: "rgba(139, 94, 60, 0.08)",
                  color: colors.accent,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(139, 94, 60, 0.15)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(139, 94, 60, 0.08)"}
              >
                #{t}
              </span>
            ))}
          </div>
        )}
        <div style={{ fontSize: "10px", color: colors.subtext, fontFamily: fonts.mono, textAlign: "right" }}>
          {item.date ?? ""}
        </div>
      </div>
    </div>
  );
}