// src/components/Layout.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  // ── レイアウト定数 ──
  const LEFT_FULL  = 220;
  const LEFT_MINI  = 72;
  const RIGHT_WIDTH = 280;

  // ── ブレークポイント ──
  // 1300px 未満 → 左をアイコン化
  // 1000px 未満 → 左アイコン化 ＋ 右を閉じる
  const BREAK_COLLAPSE_LEFT  = 1300;
  const BREAK_CLOSE_RIGHT    = 1000;

  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightOpen,     setIsRightOpen]     = useState(true);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setIsLeftCollapsed(w < BREAK_COLLAPSE_LEFT);
      setIsRightOpen(w >= BREAK_CLOSE_RIGHT);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ── 配色 ──
  const colors = {
    bg:      '#F8F6F0',
    text:    '#3D3328',
    subtext: '#A39B8B',
    accent:  '#A68A61',
    border:  '#E6E0D4',
    card:    '#FCFAEF',
  };

  const fonts = {
    serif: '"Noto Serif JP", "Hiragino Mincho ProN", serif',
    sans:  '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif',
  };

  // ── ナビゲーション定義 ──
  const navItems = [
    { path: '/',            label: 'ホーム', icon: '🏠' },
    { path: '/photos',      label: 'フォト', icon: '🖼️' },
    { path: '/zukan',       label: '図鑑',   icon: '📖' },
    { path: '/observation', label: '観測',   icon: '🔭' },
    { path: '/record', label: '記録する', icon: '✏️' },
  ];

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      backgroundColor: colors.bg,
      color: colors.text,
      fontFamily: fonts.sans,
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* ── 1. 左サイドバー ── */}
      <aside style={{
        width: isLeftCollapsed ? `${LEFT_MINI}px` : `${LEFT_FULL}px`,
        borderRight: `1px solid ${colors.border}`,
        padding: '20px 8px',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        backgroundColor: colors.bg,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 40,
      }}>
        {/* ロゴ */}
        <Link to="/" style={{
          display: 'flex',
          justifyContent: isLeftCollapsed ? 'center' : 'flex-start',
          alignItems: 'center',
          marginBottom: '40px',
          padding: '0 12px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textDecoration: 'none',
          color: 'inherit',
        }}>
          {isLeftCollapsed ? (
            // アイコン化時はロゴ文字の代わりに絵文字だけ表示
            <span style={{ fontSize: '22px' }}>📚</span>
          ) : (
            <span style={{
              fontWeight: 'bold',
              fontSize: '20px',
              letterSpacing: '0.1em',
              fontFamily: fonts.serif,
            }}>
              偏愛図鑑
            </span>
          )}
        </Link>

        {/* メニューリスト */}
        <nav style={{ flex: 1, padding: '0 4px' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={item.label}
                style={{
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
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontSize: '22px', flexShrink: 0 }}>{item.icon}</span>
                {!isLeftCollapsed && (
                  <span style={{ fontWeight: '500' }}>{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ── 2. 中央メインコンテンツ ── */}
      <main style={{
        flex: 1,
        minWidth: 0,
        overflowY: 'auto',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
      }}>
        <div style={{
          padding: '40px clamp(20px, 5vw, 60px)',
          maxWidth: '1000px',
          margin: '0 auto',
        }}>
          {children}
        </div>
      </main>

      {/* ── 右サイドバー復活ボタン（閉じているときのみ表示） ── */}
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

      {/* ── 3. 右サイドバー ── */}
      <aside style={{
        width: isRightOpen ? `${RIGHT_WIDTH}px` : '0px',
        borderLeft: isRightOpen ? `1px solid ${colors.border}` : 'none',
        backgroundColor: 'rgba(248, 246, 240, 0.8)',
        flexShrink: 0,
        overflow: 'hidden',
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
              color: colors.subtext, fontSize: '20px',
            }}
          >
            ▶
          </button>

          {/* コンテンツエリア */}
          <div style={{ padding: '70px 24px 24px' }}>
            <section style={{ marginBottom: '40px' }}>
              <h4 style={{ color: colors.subtext, marginBottom: '20px', fontSize: '13px' }}>
                自分の傾向
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '12px', padding: '6px 14px', backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: '999px' }}>
                  #キーボード
                </span>
                <span style={{ fontSize: '12px', padding: '6px 14px', backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: '999px' }}>
                  #3Dプリンタ
                </span>
              </div>
            </section>

            <section>
              <h4 style={{ color: colors.subtext, marginBottom: '16px', fontSize: '13px' }}>
                AIによるサジェスト
              </h4>
              <div style={{
                fontSize: '12px', color: colors.subtext,
                backgroundColor: 'white', padding: '16px',
                borderRadius: '12px', border: `1px solid ${colors.border}`,
                lineHeight: '1.6',
              }}>
                「自作キーボード」に興味があるなら、次は真鍮プレートの加工やQMKファームウェアのカスタマイズに挑戦してみるのはいかがでしょうか？
              </div>
            </section>
          </div>
        </div>
      </aside>

    </div>
  );
};

export default Layout;