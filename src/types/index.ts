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
  /** フォトの一意のID */
  id: number;              // string → number に統一（Photos.tsxがnumberで扱うため）
  /** 所有者のユーザーID */
  userId?: string;
  /** 写真のURL（任意：絵文字フォールバックあり） */
  imageUrl?: string;
  /** レガシーデータ用画像URLエイリアス */
  img?: string;
  /** タイトル */
  title: string;
  /** タグ（ユーザー付与） */
  tags: string[];
  /** AIによって自動付与された解析タグ */
  aiTags?: string[];
  /** 絵文字フォールバック表示 */
  emoji?: string;
  /** 画像未設定時の背景色 */
  bg?: string;
  /** メモ・コメント */
  memo?: string;
  /** 撮影場所 */
  loc?: string;
  /** 撮影・保存日時 (ISO 8601 or YYYY-MM-DD) */
  createdAt?: string;
  /** 表示用の整形済み日付 */
  date?: string;
}

/**
 * コレクション (Collection)
 * フォトを昇華させ、こだわりを言語化した「図鑑の1ページ」
 */
export interface Collection {
  /** コレクションの一意のID */
  id: string;
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
export type ViewMode = 'grid' | 'list';