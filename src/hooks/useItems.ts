import { useState, useEffect } from 'react';
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
        // 【重要】将来データベース(Supabase等)に移行する際は、ここをAPIコールに書き換えるだけ
        const res = await fetch("/data.json");
        if (!res.ok) throw new Error("データの取得に失敗しました");
        
        const data = await res.json();
        setPhotos(data.photos || []);
        setCollections(data.collections || []);
      } catch (err) {
        console.error(err);
        setError("データの読み込みに失敗しました。");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { photos, collections, loading, error };
};