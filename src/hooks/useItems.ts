// src/hooks/useItems.ts
//データの取得ロジックを共通化するカスタムフック
import { useState, useEffect } from 'react';
import { PhotoMaterial, Collection } from '../types/index.ts';

export const useItems = () => {
  const [photos, setPhotos] = useState<PhotoMaterial[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 現在はローカルJSONを参照
        const res = await fetch("/data.json");
        const data = await res.json();
        
        // データの持ち方を photos と collections に整理
        setPhotos(data.photos || []);
        setCollections(data.collections || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return { photos, collections, loading };
};