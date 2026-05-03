// src/pages/Home.tsx
import { useItems } from "../hooks/useItems.ts";
import PhotoCard from "../components/PhotoCard.tsx";
import ZukanCard from "../components/ZukanCard.tsx";

const colors = {
  text: "#3D3328",
  subtext: "#A39B8B",
  accent: "#A68A61",
  border: "#E6E0D4",
  card: "#FCFAEF",
};

const fonts = {
  serif: '"Noto Serif JP", "Hiragino Mincho ProN", serif',
};

export default function Home() {
  // 共通フック「useItems」からデータと状態を受け取るだけ！
  const { photos, collections, loading, error } = useItems();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>

      {/* ── エラー表示 ── */}
      {error && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#FEE2E2",
            color: "#991B1B",
            borderRadius: "8px",
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
            padding: "40px",
            color: colors.subtext,
          }}
        >
          キャビネットを開いています...
        </div>
      ) : !error && (
        <>
          {/* ── 最近のフォト ── */}
          <section>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: "16px",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  fontFamily: fonts.serif,
                  margin: 0,
                  color: colors.text,
                }}
              >
                最近のフォト
              </h2>
              <span style={{ fontSize: "12px", color: colors.subtext, cursor: "pointer" }}>
                すべて見る ＞
              </span>
            </div>

            {photos.length === 0 ? (
              <p style={{ color: colors.subtext, fontSize: "14px" }}>
                まだ写真がありません。
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "24px",
                  paddingTop: "12px",
                }}
              >
                {/* rotation / pinColor を渡さない → フラットカードモードで表示 */}
                {photos.slice(0, 4).map((photo) => (
                  <PhotoCard key={photo.id} item={photo} />
                ))}
              </div>
            )}
          </section>

          <div
            style={{ height: "1px", backgroundColor: colors.border, width: "100%" }}
          />

          {/* ── 最近の図鑑 ── */}
          <section>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  fontFamily: fonts.serif,
                  margin: 0,
                  color: colors.text,
                }}
              >
                最近の図鑑
              </h2>
              <span style={{ fontSize: "12px", color: colors.subtext, cursor: "pointer" }}>
                すべて見る ＞
              </span>
            </div>

            {collections.length === 0 ? (
              <p style={{ color: colors.subtext, fontSize: "14px" }}>
                まだコレクションがありません。
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "24px",
                }}
              >
                {collections.map((item) => (
                  <ZukanCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>
        </>
      )}

    </div>
  );
}