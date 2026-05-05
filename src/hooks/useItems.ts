import { useState, useEffect, useCallback } from 'react';
import { PhotoMaterial, Collection } from '../types/index.ts';

export const useItems = () => {
  const [photos, setPhotos] = useState<PhotoMaterial[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. 常に最新の data.json を読み込む
        const res = await fetch(`/data.json?t=${new Date().getTime()}`);
        if (!res.ok) throw new Error("データの取得に失敗しました");
        const data = await res.json();
        const basePhotos: PhotoMaterial[] = data.photos || [];
        const baseCollections: Collection[] = data.collections || [];

        // 2. 画面から新しく「追加」された写真だけを取得
        const addedPhotos: PhotoMaterial[] = JSON.parse(localStorage.getItem('my_added_photos') || '[]');
        
        // 3. 画面で「編集（テキスト追加など）」された差分データを取得
        const editedPhotos: Record<string, Partial<PhotoMaterial>> = JSON.parse(localStorage.getItem('my_edited_photos') || '{}');

        // 4. ベース(data.json) と 追加分 を合体させ、さらに編集内容を上書き(マージ)する
        const allPhotos = [...addedPhotos, ...basePhotos].map(photo => {
          if (editedPhotos[photo.id]) {
            return { ...photo, ...editedPhotos[photo.id] };
          }
          return photo;
        });

        setPhotos(allPhotos);
        setCollections(baseCollections);
        
      } catch (err) {
        console.error(err);
        setError("データの読み込みに失敗しました。");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 📸 写真を追加する関数
  const addPhoto = useCallback((newPhoto: PhotoMaterial) => {
    setPhotos(prev => [newPhoto, ...prev]); // 画面をすぐ更新
    
    // LocalStorageの「追加分リスト」だけに保存
    const addedPhotos = JSON.parse(localStorage.getItem('my_added_photos') || '[]');
    localStorage.setItem('my_added_photos', JSON.stringify([newPhoto, ...addedPhotos]));
  }, []);

  // ✏️ 写真のテキスト等を更新する関数
  const updatePhoto = useCallback((id: string | number, patch: Partial<PhotoMaterial>) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p)); // 画面をすぐ更新
    
    // LocalStorageの「編集分リスト」に差分だけを保存
    const editedPhotos = JSON.parse(localStorage.getItem('my_edited_photos') || '{}');
    editedPhotos[id] = { ...(editedPhotos[id] || {}), ...patch };
    localStorage.setItem('my_edited_photos', JSON.stringify(editedPhotos));
  }, []);

  return { photos, collections, loading, error, addPhoto, updatePhoto };
};