// src/pages/Zukan.tsx
import { useEffect, useState } from "react";
import { Collection } from "../types/index.ts";
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

// 📝 【開発用設定】true にするとAPIから取得、false にするとダミーデータを使用
const USE_REAL_API = false;

const DUMMY_COLLECTIONS: Collection[] = [
  {
    id: "c1",
    authorId: "u1",
    title: "Corne v4 スイッチホルダー",
    thumbnailUrl: "https://placehold.co/600x400/E6E0D4/3D3328?text=Corne+v4",
    content: "Bambu Lab A1 miniとFreeCADで設計したオリジナルパーツ。試行錯誤の末に寸法がピッタリ合った瞬間の快感は異常。キーボード沼はまだまだ深い。",
    imageUrls: ["https://placehold.co/600x400/E6E0D4/3D3328?text=Corne+v4"],
    aiTags: ["#3Dプリンタ", "#自作キーボード", "#設計"],
    createdAt: "2026-04-28T10:00:00Z",
  },
  {
    id: "c2",
    authorId: "u1",
    title: "星空撮影の記録",
    thumbnailUrl: "https://placehold.co/600x400/1A1A24/E6E0D4?text=Night+Sky",
    content: "Canon G9 Xを使って深夜に撮影。コンパクト機でもマニュアル設定でここまで綺麗に星空が撮れることに感動している。次はレンズヒーターを導入したい。",
    imageUrls: ["https://placehold.co/600x400/1A1A24/E6E0D4?text=Night+Sky"],
    aiTags: ["#写真", "#夜景", "#カメラ"],
    createdAt: "2026-04-25T02:30:00Z",
  },
  {
    id: "c3",
    authorId: "u1",
    title: "VR UI プロトタイピング",
    thumbnailUrl: "https://placehold.co/600x400/A68A61/FCFAEF?text=Figma+UI",
    content: "HMDのトラッキングデータを活かした新しい操作感をFigmaで検証中。視線と手の動きの連動が鍵になりそう。空間UIの正解を探す日々。",
    imageUrls: ["https://placehold.co/600x400/A68A61/FCFAEF?text=Figma+UI"],
    aiTags: ["#UIUX", "#VR", "#Figma"],
    createdAt: "2026-04-15T18:20:00Z",
  },
  {
    id: "c4",
    authorId: "u1",
    title: "3Dプリントの試作記録",
    thumbnailUrl: "https://placehold.co/600x400/2E3440/D8DEE9?text=3D+Print",
    content: "フィラメントの種類によって仕上がりが全然違う。PLAとPETGの使い分けをようやく理解してきた。次はTPUに挑戦したい。",
    imageUrls: ["https://placehold.co/600x400/2E3440/D8DEE9?text=3D+Print"],
    aiTags: ["#3Dプリンタ", "#造形", "#試作"],
    createdAt: "2026-04-10T14:00:00Z",
  },
];

function Zukan() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selTag, setSelTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (USE_REAL_API) {
          const res = await fetch("http://localhost:8000/api/collections");
          if (!res.ok) throw new Error("サーバーからのデータ取得に失敗しました");
          setCollections(await res.json());
        } else {
          await new Promise((resolve) => setTimeout(resolve, 600));
          setCollections(DUMMY_COLLECTIONS);
        }
      } catch (err) {
        console.error("データの取得に失敗しました", err);
        setError("データを読み込めませんでした。");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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
      {isLoading ? (
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