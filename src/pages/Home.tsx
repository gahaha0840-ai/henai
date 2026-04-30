// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import PhotoCard, { PhotoData } from '../components/PhotoCard.tsx';
import ZukanCard, { ZukanData } from '../components/ZukanCard.tsx';

const Home = () => {
  const colors = {
    text: '#3D3328',
    subtext: '#A39B8B',
    accent: '#A68A61',
    border: '#E6E0D4',
    card: '#FCFAEF',
  };

  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [zukanItems, setZukanItems] = useState<ZukanData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 📝 【開発用設定】ここを true にするとAPIから取得、false にするとダミーデータを使います
  // APIが完成したら、ここを true に書き換えるだけで本番環境に切り替わります！
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
          const [photosResponse, zukanResponse] = await Promise.all([
            fetch('http://localhost:8000/api/photos'), // ← PythonのURLに合わせて後で修正
            fetch('http://localhost:8000/api/zukan')   // ← 同上
          ]);

          if (!photosResponse.ok || !zukanResponse.ok) {
            throw new Error('サーバーからのデータ取得に失敗しました');
          }

          const photosData: PhotoData[] = await photosResponse.json();
          const zukanData: ZukanData[] = await zukanResponse.json();

          setPhotos(photosData);
          setZukanItems(zukanData);

        } else {
          // ==========================================
          // 🛠️ 開発モード：ダミーデータを使用する処理
          // ==========================================
          const dummyPhotos: PhotoData[] = [
            { id: 1, imageUrl: "https://placehold.co/600x600/1A1A24/E6E0D4?text=Night+Sky", title: "夜空", location: "長野県 茅野市" },
            { id: 2, imageUrl: "https://placehold.co/600x600/E6E0D4/3D3328?text=Corne+v4", title: "自作キーボード", location: "自室デスク" },
            { id: 3, imageUrl: "https://placehold.co/600x600/A68A61/FCFAEF?text=VR+HMD", title: "HMDテスト", location: "研究室" },
            { id: 4, imageUrl: "https://placehold.co/600x600/2E3440/D8DEE9?text=3D+Print", title: "3Dプリント", location: "作業部屋" },
            { id: 5, imageUrl: "https://placehold.co/600x600/7B8B6F/FCFAEF?text=Landscape", title: "風景", location: "散歩道" },
          ];

          const dummyZukan: ZukanData[] = [
            { 
              id: 1, 
              title: "Corne v4 スイッチホルダー", 
              description: "Bambu Lab A1 miniとFreeCADで設計したオリジナルパーツ。試行錯誤の末に寸法がピッタリ合った瞬間の快感は異常。", 
              date: "2026.04.28", 
              imageUrl: "https://placehold.co/600x400/E6E0D4/3D3328?text=Corne+v4" 
            },
            { 
              id: 2, 
              title: "星空撮影テスト", 
              description: "Canon G9 Xを使って深夜に撮影。コンパクト機でもマニュアル設定でここまで綺麗に星空が撮れることに感動している。", 
              date: "2026.04.25", 
              imageUrl: "https://placehold.co/600x400/1A1A24/E6E0D4?text=Night+Sky" 
            },
            { 
              id: 3, 
              title: "偏愛図鑑 バックエンドAPI", 
              description: "ハッカソン用にPythonで構築中のAPI。ニッチな趣味や作りかけのプロジェクトを共有できるプラットフォームの心臓部。", 
              date: "2026.04.20", 
              imageUrl: "https://placehold.co/600x400/2E3440/D8DEE9?text=Python+API" 
            },
            { 
              id: 4, 
              title: "VR UI プロトタイプ", 
              description: "HMDのトラッキングデータを活かした新しい操作感をFigmaで検証中。視線と手の動きの連動が鍵になりそう。", 
              date: "2026.04.15", 
              imageUrl: "https://placehold.co/600x400/A68A61/FCFAEF?text=Figma+UI" 
            },
          ];

          // ネットワークの遅延を擬似的に再現（0.8秒待つ）
          await new Promise(resolve => setTimeout(resolve, 800));
          
          setPhotos(dummyPhotos);
          setZukanItems(dummyZukan);
        }

      } catch (err) {
        console.error("データの取得に失敗しました", err);
        setError("データを読み込めませんでした。サーバーが起動しているか確認してください。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [USE_REAL_API]); // USE_REAL_APIの値が変わったら再実行する

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      
      {/* ページタイトルエリア */}
      {/* <div>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          display: 'inline-block',
          borderBottom: `3px solid ${colors.accent}`,
          paddingBottom: '4px'
        }}>
          マイ偏愛キャビネット
        </h1>
        <p style={{ color: colors.subtext, fontSize: '14px', marginTop: '8px' }}>
          切り取った瞬間と、集めたこだわりの標本たち。
        </p>
      </div> */}

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
          {/* --- 上段：Myフォト（最新の4件を一列に表示） --- */}
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

          {/* --- 下段：図鑑カード（グリッド表示） --- */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: colors.text }}>
                最近の図鑑
              </h2>
              <span style={{ fontSize: '12px', color: colors.subtext, cursor: 'pointer' }}>
                すべて見る ＞
              </span>
            </div>
            
            {zukanItems.length === 0 ? (
              <p style={{ color: colors.subtext, fontSize: '14px' }}>まだコレクションがありません。</p>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                gap: '24px' 
              }}>
                {zukanItems.map(item => (
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