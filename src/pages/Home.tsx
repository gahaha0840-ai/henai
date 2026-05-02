// src/pages/Home.tsx
import { useState, useEffect } from "react";
import { PhotoMaterial, Collection } from "../types/index.ts";
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

// 📝 【開発用設定】true にするとAPIから取得、false にするとダミーデータを使用
const USE_REAL_API = false;

export default function Home() {
  const [photos, setPhotos] = useState<PhotoMaterial[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (USE_REAL_API) {
          // 🚀 本番モード
          const [photosRes, collectionsRes] = await Promise.all([
            fetch("http://localhost:8000/api/photos"),
            fetch("http://localhost:8000/api/collections"),
          ]);
          if (!photosRes.ok || !collectionsRes.ok) {
            throw new Error("サーバーからのデータ取得に失敗しました");
          }
          setPhotos(await photosRes.json());
          setCollections(await collectionsRes.json());
        } else {
          // 🛠️ 開発モード：ネットワーク遅延を擬似的に再現
          const res = await fetch("/data.json");
          const data = await res.json();
          setPhotos(data.photos || []);
          setCollections(data.collections || []);
        }
      } catch (err) {
        console.error("データの取得に失敗しました", err);
        setError("データを読み込めませんでした。サーバーが起動しているか確認してください。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);   // USE_REAL_API は定数なので依存配列から除外

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
      {isLoading ? (
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