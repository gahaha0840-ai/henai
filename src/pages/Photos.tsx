// src/pages/Photos.tsx
import { useState } from "react";
import { useItems } from "../hooks/useItems.ts";
import PhotoCard from "../components/PhotoCard.tsx";
import TagChip from "../components/TagChip.tsx"; // 共通のTagChipをインポート

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
  // 共通フックからデータ（photos）と状態を受け取る
  const { photos, loading, error } = useItems();
  const [selTag, setSelTag] = useState<string | null>(null);

  // tagsの抽出
  const allTags = [...new Set(photos.flatMap((i) => i.tags ?? []))];
  const displayed = selTag
    ? photos.filter((i) => i.tags?.includes(selTag))
    : photos;

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
        {/* ローディング */}
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "rgba(255,253,245,0.7)",
              fontSize: "13px",
              fontFamily: fonts.sans,
            }}
          >
            写真を準備中...
          </div>
        ) : !error && displayed.length === 0 ? (
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
        ) : !error && (
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
                // idが文字列(UUID)になっても安全なように、配列のインデックス(i)をベースに計算
                rotation={ROTATIONS[i % ROTATIONS.length]}
                pinColor={PIN_COLORS[i % PIN_COLORS.length]}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}