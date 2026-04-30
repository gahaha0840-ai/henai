// src/components/Layout.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  // --- レイアウトの設計図（定数） ---
  const LEFT_FULL = 220;    // 左サイドバーの通常幅
  const LEFT_MINI = 72;     // 左サイドバーのアイコン表示時の幅
  const RIGHT_WIDTH = 280;  // 右サイドバーの幅
  const CENTER_MIN_SAFE = 500; // 中央がこれ以下になるときに自動でサイドバーを閉じる判定基準

  // --- サイドバーの表示状態管理 ---
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false); // 左サイドバーの「縮小」状態
  const [isRightOpen, setIsRightOpen] = useState(true);          // 右サイドバーの「表示/非表示」状態

  // --- レスポンシブ挙動（画面サイズに応じて自動で開閉） ---
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      // 1. 1000px未満なら：右を完全に閉じ、左もアイコン化する
      if (w < 1000) {
        setIsRightOpen(false);
        setIsLeftCollapsed(true);
      } 
      // 2. 1300px未満なら：左だけをアイコン化する（中央の広さを優先）
      else if (w < 1300) {
        setIsLeftCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // 初回読み込み時にも判定を実行
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- 配色設定 ---
  const colors = {
    bg: '#F8F6F0',       // 紙のようなオフホワイト
    text: '#3D3328',     // ダークブラウン
    subtext: '#A39B8B',  // 控えめなグレー
    accent: '#A68A61',   // アクセントのゴールド
    border: '#E6E0D4',   // 境界線
    card: '#FCFAEF',     // カードの背景色
  };

  // --- フォント設定（ゴシック体メイン） ---
  const fonts = {
    serif: '"Noto Serif JP", "Hiragino Mincho ProN", serif',
    sans: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif',
  };

  // --- ナビゲーションメニューの定義 ---
  const navItems = [
    { path: '/', label: 'ホーム', icon: '🏠' },
    { path: '/photos', label: 'フォト', icon: '🖼️' },
    { path: '/encyclopedia', label: '図鑑', icon: '📚' },
    { path: '/observation', label: '観測', icon: '🔭' },
  ];

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      backgroundColor: colors.bg,
      color: colors.text,
      fontFamily: fonts.sans,
      overflow: 'hidden',    // 全体の横スクロールを禁止
      position: 'relative',
    }}>
      
      {/* 1. 左サイドバー（ナビゲーション） */}
      <aside style={{
        width: isLeftCollapsed ? `${LEFT_MINI}px` : `${LEFT_FULL}px`,
        borderRight: `1px solid ${colors.border}`,
        padding: '20px 8px',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,       // メイン部分に押されても潰れないように固定
        backgroundColor: colors.bg,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // 開閉アニメーション
        zIndex: 40,
      }}>
        {/* ロゴと開閉トグルボタン */}
        <div style={{ 
          display: 'flex', 
          justifyContent: isLeftCollapsed ? 'center' : 'space-between', 
          alignItems: 'center',
          marginBottom: '40px',
          padding: '0 12px'
        }}>
          {!isLeftCollapsed && (
            <span style={{ fontWeight: 'bold', fontSize: '20px', letterSpacing: '0.1em', fontFamily: fonts.serif }}>
              偏愛図鑑
            </span>
          )}
          <button 
            onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
            style={{
              background: 'none', border: `1px solid ${colors.border}`, borderRadius: '8px',
              cursor: 'pointer', color: colors.subtext, padding: '4px 8px', fontSize: '12px',
            }}
          >
            {isLeftCollapsed ? '▶' : '◀'}
          </button>
        </div>

        {/* メニューリスト */}
        <nav style={{ flex: 1, padding: '0 4px' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isLeftCollapsed ? 'center' : 'flex-start',
                gap: isLeftCollapsed ? '0' : '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                textDecoration: 'none',
                color: isActive ? colors.accent : colors.subtext,
                backgroundColor: isActive ? 'rgba(166, 138, 97, 0.1)' : 'transparent',
                transition: 'all 0.2s ease',
                marginBottom: '8px',
              }} title={item.label}>
                <span style={{ fontSize: '22px' }}>{item.icon}</span>
                {!isLeftCollapsed && <span style={{ fontWeight: '500' }}>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 2. 中央メインコンテンツ（スクロール可能エリア） */}
      <main style={{
        flex: 1,
        minWidth: 0,         // 子要素がつぶれないようにするためのFlex設定
        overflowY: 'auto',   // 縦スクロールを有効に
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
      }}>
        <div style={{ padding: '40px clamp(20px, 5vw, 60px)', maxWidth: '1000px', margin: '0 auto' }}>
          {children}
        </div>
      </main>

      {/* --- 右側復活ボタン（右サイドバーが閉じているときに絶対配置で表示） --- */}
      {!isRightOpen && (
        <button 
          onClick={() => setIsRightOpen(true)}
          style={{
            position: 'absolute', top: '20px', right: '20px', zIndex: 100,
            background: colors.card, border: `1px solid ${colors.border}`,
            borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)', color: colors.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
          }}
        >
          ◀
        </button>
      )}

      {/* 3. 右サイドバー（統計情報やAIサジェスト） */}
      <aside style={{
        width: isRightOpen ? `${RIGHT_WIDTH}px` : '0px',
        borderLeft: isRightOpen ? `1px solid ${colors.border}` : 'none',
        backgroundColor: 'rgba(248, 246, 240, 0.8)',
        flexShrink: 0,
        overflow: 'hidden',  // 閉じている最中に中身がはみ出さないようにする
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 20,
      }}>
        <div style={{ minWidth: `${RIGHT_WIDTH}px`, height: '100%', position: 'relative' }}>
          {/* 閉じるボタン */}
          <button 
            onClick={() => setIsRightOpen(false)}
            style={{
              position: 'absolute', top: '20px', left: '16px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: colors.subtext, fontSize: '20px'
            }}
          >
            ▶
          </button>

          {/* コンテンツエリア */}
          <div style={{ padding: '70px 24px 24px' }}>
            <section style={{ marginBottom: '40px' }}>
              <h4 style={{ color: colors.subtext, marginBottom: '20px', fontSize: '13px' }}>自分の傾向</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '12px', padding: '6px 14px', backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: '999px' }}>#キーボード</span>
                <span style={{ fontSize: '12px', padding: '6px 14px', backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: '999px' }}>#3Dプリンタ</span>
              </div>
            </section>
            
            <section>
              <h4 style={{ color: colors.subtext, marginBottom: '16px', fontSize: '13px' }}>AIによるサジェスト</h4>
              <div style={{ fontSize: '12px', color: colors.subtext, backgroundColor: 'white', padding: '16px', borderRadius: '12px', border: `1px solid ${colors.border}`, lineHeight: '1.6' }}>
                「自作キーボード」に興味があるなら、次は**真鍮プレートの加工**や**QMKファームウェア**のカスタマイズに挑戦してみるのはいかがでしょうか？
              </div>
            </section>
          </div>
        </div>
      </aside>

    </div>
  );
};

export default Layout;