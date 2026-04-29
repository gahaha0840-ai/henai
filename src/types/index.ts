// src/types/index.ts

/**
 * ユーザープロフィール情報
 * ※アプリの性質上、フォロワー数などの「他者との比較」になる項目は絶対に持たせない
 */
export interface UserProfile {
  /** ユーザーの一意のID (SupabaseのAuth UIDを想定) */
  id: string;
  
  /** 画面に表示されるユーザー名 */
  name: string;
  
  /** * AIから定期的に付与される称号 
   * 例: "空間の探求者", "レトロの収集家", "深夜の活版印刷職人"
   * アプリの没入感を高めるためのゲーム的な要素
   */
  title: string;
  
  /** * ユーザーの偏愛傾向（右サイドバー等で表示する統計データ）
   * AIが過去の投稿や観測履歴から自動で分析・更新する
   */
  stats: {
    /** 傾向を表すタグ名 (例: "#キーボード", "#3Dプリンタ") */
    tag: string;
    /** 偏愛度合いを示すスコア (例: 0〜100の数値、または頻度) */
    score: number;     
  }[];
}

/**
 * 作品の投稿形式（表現方法）
 * 画面の描画（UI）を切り替えるための重要なフラグ
 * - single: 一枚絵（シンプルに1枚の画像を表示）
 * - booklet: 冊子（Embla Carousel等を使って横スワイプで読ませる）
 * - corkboard: コルクボード（複数の画像やテキストを自由な位置に配置）
 */
export type WorkType = 'single' | 'booklet' | 'corkboard';

/**
 * 作品（図鑑のメインコンテンツ）のデータ構造
 * ※「いいね数」「閲覧数」「コメント」といった他者評価の項目は存在しない
 */
export interface Work {
  /** 作品の一意のID (UUIDを想定) */
  id: string;
  
  /** * 投稿者のID (UserProfileのidと紐づく) 
   * ※仕様として、観測フィード上では投稿者名を非表示（匿名）にする場合もある
   */
  authorId: string;    
  
  /** 作品のタイトル */
  title: string;
  
  /** 投稿形式（一枚絵か、冊子か、コルクボードか） */
  type: WorkType;
  
  /** * 一覧画面（観測フィードのMasonry等）で表示するための軽量化されたサムネイル画像のURL 
   * (Supabase StorageのPublic URL等を想定)
   */
  thumbnailUrl: string;
  
  /** * 詳細画面で表示するオリジナル画像のURL配列
   * - singleの場合は1枚のみ
   * - booklet/corkboardの場合は複数枚のURLが入る
   */
  imageUrls: string[]; 
  
  /** * 画像投稿時にAIが自動解析して付与したタグの配列
   * (例: ["#レトロ", "#木目", "#静寂"])
   * 観測機能でのランダム表示やタグ検索のフックとして使用される
   */
  aiTags: string[];
  
  /** 作成日時 (ISO 8601形式の文字列。例: "2026-04-29T14:25:00Z") */
  createdAt: string;
}

/**
 * Myフォト（編集前の素材データ）のデータ構造
 * ユーザーが日常で集めた画像や、作品を作るために一時保存しているパーツ
 */
export interface PhotoMaterial {
  /** 素材の一意のID */
  id: string;
  
  /** 保存したユーザーのID */
  userId: string;
  
  /** 保存された画像のURL (Supabase Storage) */
  imageUrl: string;
  
  /** * 素材に対してもAIが自動でタグ付けを行い、
   * 後で「#キーボード」の素材だけを絞り込んで編集画面に呼び出せるようにする
   */
  aiTags: string[];
  
  /** 保存日時 */
  createdAt: string;
}