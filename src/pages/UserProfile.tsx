// src/pages/UserProfile.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PhotoMaterial, Collection, UserProfile as UserProfileType } from "../types/index.ts";
import ZukanCard from "../components/ZukanCard.tsx";
import PhotoCard from "../components/PhotoCard.tsx";
import TagChip from "../components/TagChip.tsx";

const colors = {
  bg:      "#F8F6F0",
  text:    "#3D3328",
  subtext: "#A39B8B",
  accent:  "#A68A61",
  border:  "#E6E0D4",
};

const fonts = {
  serif: '"Noto Serif JP", "Hiragino Mincho ProN", serif',
  sans:  '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif',
};

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  
  // 状態管理
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [photos, setPhotos] = useState<PhotoMaterial[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selTag, setSelTag] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/data.json");
        if (!res.ok) throw new Error(`データの取得に失敗しました (${res.status})`);
        
        const allData = await res.json();

        // 1. ユーザー情報の抽出 (実際はAPIから取得する想定)
        // ここでは userId を元にモックデータを生成
        setUserProfile({
          id: userId || "unknown",
          name: userId === "1" ? "ユーザーA" : `収集家 ${userId}`,
          title: "真鍮の蒐集家",
          stats: [
            { tag: "キーボード", score: 85 },
            { tag: "3Dプリント", score: 60 }
          ]
        });

        // 2. 投稿データのフィルタリング
        // PhotoMaterial (userIdでフィルタ)
        const filteredPhotos = (allData.photos || []).filter(
          (p: PhotoMaterial) => p.userId === userId
        );
        // Collection (authorIdでフィルタ)
        const filteredCollections = (allData.collections || []).filter(
          (c: Collection) => c.authorId === userId
        );

        setPhotos(filteredPhotos);
        setCollections(filteredCollections);

      } catch (err) {
        console.error(err);
        setError("ユーザーデータの読み込みに失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    if (userId) loadUserData();
  }, [userId]);

  // タグ一覧の抽出 (フォトと図鑑の両方から収集)
  const allTags = [...new Set([
    ...photos.flatMap((p) => p.tags ?? []),
    ...collections.flatMap((c) => c.aiTags ?? [])
  ])];

  // フィルタリングされた表示データ
  const displayedCollections = selTag
    ? collections.filter((c) => c.aiTags?.includes(selTag))
    : collections;

  const displayedPhotos = selTag
    ? photos.filter((p) => p.tags?.includes(selTag))
    : photos;

  if (loading) return <div style={{ color: colors.subtext, padding: "40px" }}>読み込み中...</div>;
  if (error || !userProfile) return <div style={{ color: "#991b1b", padding: "40px" }}>{error}</div>;

  return (
    <>
      {/* ── ユーザーヘッダー ── */}
      <header style={{ 
        display: "flex", alignItems: "center", gap: "32px", 
        marginBottom: "48px", paddingBottom: "32px", borderBottom: `1px solid ${colors.border}` 
      }}>
        <div style={{ 
          width: "100px", height: "100px", borderRadius: "50%", backgroundColor: colors.border,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" 
        }}>👤</div>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "4px" }}>
            <h2 style={{ fontSize: "28px", margin: 0, fontFamily: fonts.serif }}>{userProfile.name}</h2>
            <span style={{ fontSize: "14px", color: colors.accent, fontWeight: "bold" }}>{userProfile.title}</span>
          </div>
          <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
            {userProfile.stats.map(s => (
              <div key={s.tag} style={{ fontSize: "12px", color: colors.subtext }}>
                {s.tag} <span style={{ color: colors.text, fontWeight: "bold" }}>{s.score}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── タグフィルター (Observation.tsx 由来) ── */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", color: colors.subtext, marginBottom: "10px", fontWeight: "bold" }}>
          タグで絞り込む
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <TagChip label="すべて" active={selTag === null} onClick={() => setSelTag(null)} />
          {allTags.map((t) => (
            <TagChip key={t} label={t} active={selTag === t} onClick={() => setSelTag(selTag === t ? null : t)} />
          ))}
        </div>
      </div>

      {/* ── コンテンツエリア ── */}
      <section style={{ marginBottom: "48px" }}>
        <h3 style={{ fontFamily: fonts.serif, fontSize: "20px", marginBottom: "20px" }}>図鑑</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
          {displayedCollections.map((item) => (
            <ZukanCard key={item.id} item={item} />
          ))}
        </div>
        {displayedCollections.length === 0 && <p style={{ color: colors.subtext, fontSize: "13px" }}>図鑑の記録はありません</p>}
      </section>

      <section>
        <h3 style={{ fontFamily: fonts.serif, fontSize: "20px", marginBottom: "20px" }}>フォト</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
          {displayedPhotos.map((item) => (
            <PhotoCard key={item.id} item={item} />
          ))}
        </div>
        {displayedPhotos.length === 0 && <p style={{ color: colors.subtext, fontSize: "13px" }}>フォトの記録はありません</p>}
      </section>
    </>
  );
}