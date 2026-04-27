import React from 'react';

// children には「観測」「編集」などの各ページの中身が入ります
export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // 画面全体：先ほど設定した「紙のオフホワイト(theme-bg)」と「焦げ茶テキスト(theme-text)」を適用
    <div className="flex h-screen bg-theme-bg text-theme-text font-sans overflow-hidden">
      
      {/* 1. 左サイドバー（固定ナビゲーション） */}
      <aside className="w-64 border-r border-theme-border p-6 flex flex-col justify-between shrink-0 bg-theme-bg z-10">
        <div>
          {/* タイトルは「図鑑」っぽさを出すために font-serif（明朝体）を指定 */}
          <h1 className="text-3xl font-bold mb-12 tracking-widest font-serif text-theme-text">
            偏愛図鑑
          </h1>
          <nav className="space-y-6">
            <button className="flex items-center gap-3 w-full text-left font-medium text-lg text-theme-subtext hover:text-theme-accent transition-colors">
              <span>📘</span> My図鑑
            </button>
            <button className="flex items-center gap-3 w-full text-left font-medium text-lg text-theme-subtext hover:text-theme-accent transition-colors">
              <span>🖼️</span> Myフォト
            </button>
            {/* アクティブなタブ（今回は「観測」を想定）はアクセントカラー（ゴールド）に */}
            <button className="flex items-center gap-3 w-full text-left font-medium text-lg text-theme-accent">
              <span>🔭</span> 観測
            </button>
            <button className="flex items-center gap-3 w-full text-left font-medium text-lg text-theme-subtext hover:text-theme-accent transition-colors">
              <span>✂️</span> 編集
            </button>
          </nav>
        </div>
        
        {/* プロフィール・称号エリア */}
        <div className="border-t border-theme-border pt-6 mt-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-theme-border rounded-full flex-shrink-0"></div>
            <span className="font-bold truncate">ユーザー名</span>
          </div>
          <span className="inline-block text-xs px-3 py-1.5 bg-theme-border/30 border border-theme-border rounded-md text-theme-subtext">
            称号: 空間の探求者
          </span>
        </div>
      </aside>

      {/* 2. 中央メインコンテンツ（ここだけスクロール可能） */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth">
        <div className="p-10 max-w-5xl mx-auto min-h-full">
          {/* ここに各画面のコンポーネントが流し込まれます */}
          {children}
        </div>
      </main>

      {/* 3. 右サイドバー（活動記録・タグ・サジェスト等） */}
      {/* 画面が小さい時（ノートPC等）は隠れるように hidden lg:block を設定 */}
      <aside className="w-80 border-l border-theme-border p-6 bg-theme-bg/50 shrink-0 overflow-y-auto hidden lg:block z-10">
        <h2 className="font-bold mb-6 text-lg border-b border-theme-border pb-2">活動記録</h2>
        <div className="space-y-6">
          
          {/* 偏愛傾向（タグ）ウィジェット */}
          <div className="p-5 bg-theme-card rounded-xl shadow-sm border border-theme-border">
            <p className="text-sm text-theme-subtext mb-3">偏愛傾向</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-3 py-1 bg-theme-bg border border-theme-border rounded-full text-theme-text">#レトロ</span>
              <span className="text-xs px-3 py-1 bg-theme-bg border border-theme-border rounded-full text-theme-text">#建築</span>
              <span className="text-xs px-3 py-1 bg-theme-bg border border-theme-border rounded-full text-theme-text">#活版印刷</span>
            </div>
          </div>

          {/* 今後追加できるエリア（例：AIサジェストなど） */}
          <div className="p-5 bg-theme-card rounded-xl shadow-sm border border-theme-border opacity-70">
            <p className="text-sm text-theme-subtext mb-2">AI サジェスト</p>
            <p className="text-xs text-theme-subtext">あなたにおすすめの観測対象がここに表示されます。</p>
          </div>

        </div>
      </aside>

    </div>
  );
};
