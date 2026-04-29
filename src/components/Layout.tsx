import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  // 現在のパスに応じてアクティブなスタイルを返す関数
  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'text-theme-accent bg-theme-border/20 font-bold' 
        : 'text-theme-subtext hover:text-theme-text hover:bg-theme-border/10'
    }`;
  };

  return (
    <div className="flex h-screen bg-theme-bg text-theme-text font-sans overflow-hidden">
      
      {/* 1. 左サイドバー（ナビゲーション） */}
      <aside className="w-64 border-r border-theme-border p-6 flex flex-col justify-between shrink-0 bg-theme-bg z-10">
        <div>
          <Link to="/" className="block text-3xl font-bold mb-10 tracking-widest font-serif text-theme-text hover:opacity-80">
            偏愛図鑑
          </Link>
          
          <nav className="space-y-2">
            <Link to="/" className={getLinkClass('/')}>
              <span className="text-xl">🏠</span> 
              <span>ホーム</span>
            </Link>
            
            {/* 今後の拡張用（My図鑑） */}
            <Link to="/zukan" className={getLinkClass('/zukan')}>
              <span className="text-xl">📘</span> 
              <span>My図鑑</span>
            </Link>
            
            <Link to="/photos" className={getLinkClass('/photos')}>
              <span className="text-xl">🖼️</span> 
              <span>Myフォト</span>
            </Link>
            
            <Link to="/obs" className={getLinkClass('/obs')}>
              <span className="text-xl">🔭</span> 
              <span>観測</span>
            </Link>

            {/* 今後の拡張用（編集） */}
            <Link to="/editor" className={getLinkClass('/editor')}>
              <span className="text-xl">✂️</span> 
              <span>編集</span>
            </Link>
          </nav>
        </div>
        
        {/* プロフィールエリア */}
        <div className="border-t border-theme-border pt-6 mt-6">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 bg-theme-border rounded-full shrink-0 overflow-hidden">
              {/* プロフィール画像があればここに <img> */}
              <div className="w-full h-full bg-gradient-to-tr from-theme-accent/20 to-theme-border"></div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold truncate text-sm">ユーザー名</span>
              <span className="text-[10px] text-theme-subtext">称号: 空間の探求者</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. 中央メインコンテンツ */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth bg-white/30">
        <div className="p-8 lg:p-12 max-w-5xl mx-auto min-h-full">
          {/* App.tsxのRoutesの中身がここに表示されます */}
          {children}
        </div>
      </main>

      {/* 3. 右サイドバー（統計・活動記録） */}
      <aside className="w-80 border-l border-theme-border p-6 bg-theme-bg/50 shrink-0 overflow-y-auto hidden xl:block">
        <div className="space-y-8">
          <section>
            <h2 className="font-bold mb-4 text-sm tracking-wider text-theme-subtext uppercase">自分の傾向</h2>
            <div className="p-5 bg-theme-card rounded-2xl shadow-sm border border-theme-border">
              <div className="flex flex-wrap gap-2">
                {/* ダミーのタグ */}
                <span className="text-xs px-3 py-1 bg-theme-bg border border-theme-border rounded-full shadow-sm">#キーボード</span>
                <span className="text-xs px-3 py-1 bg-theme-bg border border-theme-border rounded-full shadow-sm">#3Dプリンタ</span>
                <span className="text-xs px-3 py-1 bg-theme-bg border border-theme-border rounded-full shadow-sm">#VR/AR</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bold mb-4 text-sm tracking-wider text-theme-subtext uppercase">最近の通知</h2>
            <div className="space-y-3">
              <div className="text-xs p-3 bg-white/50 border border-theme-border rounded-lg text-theme-subtext italic">
                「誰かがあなたの図鑑をめくりました」
              </div>
            </div>
          </section>
        </div>
      </aside>

    </div>
  );
};

export default Layout;