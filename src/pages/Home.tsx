// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { PhotoMaterial, Collection } from '../types/index.ts';
import PhotoCard from '../components/PhotoCard.tsx';
import ZukanCard from '../components/ZukanCard.tsx';

const Home = () => {
  const colors = {
    text: '#3D3328',
    subtext: '#A39B8B',
    accent: '#A68A61',
    border: '#E6E0D4',
    card: '#FCFAEF',
  };

  const [photos, setPhotos] = useState<PhotoMaterial[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 📝 【開発用設定】ここを true にするとAPIから取得、false にするとダミーデータを使います
  const USE_REAL_API = false; 

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (USE_REAL_API) {
          // ==========================================
          // 🚀 本番モード：APIからデータを取得する処理
          // ==========================================
          const [photosResponse, collectionsResponse] = await Promise.all([
            fetch('http://localhost:8000/api/photos'), 
            fetch('http://localhost:8000/api/collections') // URLはバックエンドに合わせて調整してください
          ]);

          if (!photosResponse.ok || !collectionsResponse.ok) {
            throw new Error('サーバーからのデータ取得に失敗しました');
          }

          const photosData: PhotoMaterial[] = await photosResponse.json();
          const collectionsData: Collection[] = await collectionsResponse.json();

          setPhotos(photosData);
          setCollections(collectionsData);

        } else {
          // ==========================================
          // 🛠️ 開発モード：ダミーデータを使用する処理
          // ==========================================
          const dummyPhotos: PhotoMaterial[] = [
            { id: "p1", userId: "u1", imageUrl: "https://placehold.co/600x600/1A1A24/E6E0D4?text=Night+Sky", title: "夜空", aiTags: ["#星空", "#静寂"], createdAt: "2026-04-28T23:15:00Z" },
            { id: "p2", userId: "u1", imageUrl: "https://placehold.co/600x600/E6E0D4/3D3328?text=Corne+v4", title: "自作キーボード", aiTags: ["#ガジェット", "#自作"], createdAt: "2026-04-25T14:30:00Z" },
            { id: "p3", userId: "u1", imageUrl: "https://placehold.co/600x600/A68A61/FCFAEF?text=VR+HMD", title: "HMDテスト", aiTags: ["#VR", "#プロトタイプ"], createdAt: "2026-04-22T10:00:00Z" },
            { id: "p4", userId: "u1", imageUrl: "https://placehold.co/600x600/2E3440/D8DEE9?text=3D+Print", title: "3Dプリント", aiTags: ["#造形", "#試作"], createdAt: "2026-04-20T16:45:00Z" },
          ];

          const dummyCollections: Collection[] = [
            { 
              id: "c1", 
              authorId: "u1", 
              title: "Corne v4 スイッチホルダー", 
              thumbnailUrl: "https://placehold.co/600x400/E6E0D4/3D3328?text=Corne+v4",
              content: "Bambu Lab A1 miniとFreeCADで設計したオリジナルパーツ。試行錯誤の末に寸法がピッタリ合った瞬間の快感は異常。キーボード沼はまだまだ深い。", 
              imageUrls: ["https://placehold.co/600x400/E6E0D4/3D3328?text=Corne+v4"],
              aiTags: ["#3Dプリンタ", "#自作キーボード", "#設計"],
              createdAt: "2026-04-28T10:00:00Z" 
            },
            { 
              id: "c2", 
              authorId: "u1", 
              title: "星空撮影の記録", 
              thumbnailUrl: "https://placehold.co/600x400/1A1A24/E6E0D4?text=Night+Sky",
              content: "Canon G9 Xを使って深夜に撮影。コンパクト機でもマニュアル設定でここまで綺麗に星空が撮れることに感動している。次はレンズヒーターを導入したい。", 
              imageUrls: ["https://placehold.co/600x400/1A1A24/E6E0D4?text=Night+Sky"],
              aiTags: ["#写真", "#夜景", "#カメラ"],
              createdAt: "2026-04-25T02:30:00Z" 
            },
            { 
              id: "c3", 
              authorId: "u1", 
              title: "VR UI プロトタイピング", 
              thumbnailUrl: "https://placehold.co/600x400/A68A61/FCFAEF?text=Figma+UI",
              content: "HMDのトラッキングデータを活かした新しい操作感をFigmaで検証中。視線と手の動きの連動が鍵になりそう。空間UIの正解を探す日々。", 
              imageUrls: ["https://placehold.co/600x400/A68A61/FCFAEF?text=Figma+UI"],
              aiTags: ["#UIUX", "#VR", "#Figma"],
              createdAt: "2026-04-15T18:20:00Z" 
            },
          ];

          // ネットワークの遅延を擬似的に再現（0.8秒待つ）
          await new Promise(resolve => setTimeout(resolve, 800));
          
          setPhotos(dummyPhotos);
          setCollections(dummyCollections);
        }

      } catch (err) {
        console.error("データの取得に失敗しました", err);
        setError("データを読み込めませんでした。サーバーが起動しているか確認してください。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [USE_REAL_API]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      
      {/* エラー時の表示 */}
      {error && (
        <div style={{ padding: '16px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {/* ローディング中の表示 */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: colors.subtext }}>
          キャビネットを開いています...
        </div>
      ) : !error && (
        <>
          {/* --- 上段：最近のフォト --- */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: colors.text }}>
                最近のフォト
              </h2>
              <span style={{ fontSize: '12px', color: colors.subtext, cursor: 'pointer' }}>
                すべて見る ＞
              </span>
            </div>
            
            {photos.length === 0 ? (
              <p style={{ color: colors.subtext, fontSize: '14px' }}>まだ写真がありません。</p>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '24px',
                paddingTop: '12px' 
              }}>
                {photos.slice(0, 4).map(photo => (
                  <PhotoCard key={photo.id} photo={photo} />
                ))}
              </div>
            )}
          </section>

          <div style={{ height: '1px', backgroundColor: colors.border, width: '100%' }} />

          {/* --- 下段：最近の図鑑（コレクション） --- */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: colors.text }}>
                最近の図鑑
              </h2>
              <span style={{ fontSize: '12px', color: colors.subtext, cursor: 'pointer' }}>
                すべて見る ＞
              </span>
            </div>
            
            {collections.length === 0 ? (
              <p style={{ color: colors.subtext, fontSize: '14px' }}>まだコレクションがありません。</p>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                gap: '24px' 
              }}>
                {collections.map(item => (
                  <ZukanCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
      
    </div>
  );
};

export default Home;