// src/types/index.ts

/**
 * ユーザープロフィール情報
 */
export interface UserProfile {
  /** ユーザーの一意のID (Supabase Auth UID等) */
  id: string;
  /** 画面に表示されるユーザー名 */
  name: string;
  /** AIから付与される称号 (例: "真鍮の蒐集家") */
  title: string;
  /** ユーザーの偏愛傾向統計 */
  stats: {
    tag: string;
    score: number;
  }[];
}

/**
 * フォト (PhotoMaterial)
 * 日常の断片。コレクションを作るための「素材」としてのデータ
 */
export interface PhotoMaterial {
  id: string | number; // DB移行後は string(UUID) になるため
  userId?: string;
  title: string;
  memo?: string;
  tags: string[];
  aiTags?: string[];
  imageUrl?: string;
  img?: string; // ローカルJSON用
  emoji?: string;
  bg?: string;
  loc?: string;
  date?: string; // YYYY/MM/DD
  createdAt?: string; // ISO 8601
}

/**
 * コレクション (Collection)
 * フォトを昇華させ、こだわりを言語化した「図鑑の1ページ」
 */
export interface Collection {
  /** コレクションの一意のID */
  id: string | number;
  /** 作成者のユーザーID */
  authorId: string;
  /** コレクションのタイトル */
  title: string;
  /** 一覧に表示するサムネイルURL */
  thumbnailUrl: string;
  /** こだわりを記した内容・説明文 */
  content: string;
  /** 構成する写真たちのURL配列 (複数枚可) */
  imageUrls: string[];
  /** AIが分析したこのコレクションの属性タグ */
  aiTags: string[];
  /** 作成日時 (ISO 8601) */
  createdAt: string;
}

/**
 * UI表示用の型定義（任意）
 */
export type ViewMode = "grid" | "list";

// 既存の types/index.ts に以下を追記

/**
 * 図鑑として保存したコルクボードの条件スナップショット
 */
export interface BoardCondition {
  tags: string[]; // 絞り込みタグ（複数可）
  dateFrom: string; // YYYY/MM/DD（空文字なら制限なし）
  dateTo: string;
  maxCount: number;
  sizeIdx: number;
  corkColor: string;
}

/**
 * 保存済み図鑑ボード
 */
export interface SavedBoard {
  id: string;
  title: string;
  condition: BoardCondition;
  /** カードの手動オフセット { photoId: {dx, dy} } */
  offsets: Record<string | number, { dx: number; dy: number }>;
  createdAt: string; // ISO 8601
}
