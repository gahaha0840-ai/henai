/**
 * ユーザープロフィール
 * 称号（AI生成）や偏愛傾向（統計情報）を含む
 */
export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  title: string;       // AIから付与された称号 (例: "空間の探求者")
  stats: {             // 偏愛傾向（右サイドバーの統計で使用）
    tag: string;
    score: number;     // 頻度や熱中度を数値化
  }[];
}

/**
 * 作品の投稿形式
 */
export type WorkType = 'single' | 'booklet' | 'corkboard';

/**
 * 作品（図鑑のメインコンテンツ）
 * 他者評価（いいね等）の項目を持たないのが最大の特徴
 */
export interface Work {
  id: string;
  authorId: string;    // 投稿者ID（表示は「匿名」や非表示制御）
  title: string;
  type: WorkType;
  thumbnailUrl: string;
  imageUrls: string[]; // 冊子やコルクボードの場合は複数枚
  description?: string;
  aiTags: string[];    // AIによって自動付与されたタグ
  isPublic: boolean;   // 公開・非公開設定
  createdAt: string;
}

/**
 * Myフォト / 素材
 * 編集前の画像や切り取ったパーツのデータ
 */
export interface PhotoMaterial {
  id: string;
  userId: string;
  imageUrl: string;
  category?: string;   // ユーザーまたはAIによる分類
  aiTags: string[];
  createdAt: string;
}

/**
 * 活動記録（右サイドバー用）
 */
export interface ActivityLog {
  id: string;
  userId: string;
  type: 'post' | 'collect' | 'title_update';
  content: string;
  timestamp: string;
}

/**
 * 通知（匿名リアクション用）
 * 「誰かがあなたの作品を見ました」という抽象的な通知
 */
export interface AnonymousNotification {
  id: string;
  targetWorkId: string;
  message: string;     // 具体的な数字ではなく「めくられた」等の表現
  isRead: boolean;
  createdAt: string;
}
