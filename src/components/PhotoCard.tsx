// src/components/PhotoCard.tsx
import React from 'react';

export interface PhotoData {
  id: number;
  imageUrl: string;
  title: string;
  location: string;
}

const PhotoCard = ({ photo }: { photo: PhotoData }) => {
  return (
    <div style={{
      position: 'relative',
      backgroundColor: '#FFFFFF',
      // 白いフチの部分（上・左右は狭め、下はテキスト用に広め）
      padding: '16px 16px 24px 16px', 
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '12px' // 上のピンのための余白
    }}>
      
      {/* 上部中央のグレーのピン */}
      <div style={{
        position: 'absolute',
        top: '-10px', 
        width: '20px',
        height: '20px',
        backgroundColor: '#C0C0C0',
        borderRadius: '50%',
        boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1)'
      }} />

      {/* 写真エリア */}
      <div style={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden', marginBottom: '16px' }}>
        <img 
          src={photo.imageUrl} 
          alt={photo.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>

      {/* テキストエリア */}
      <h3 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'normal', color: '#111', letterSpacing: '0.05em' }}>
        {photo.title}
      </h3>
      <p style={{ margin: 0, fontSize: '16px', color: '#555' }}>
        {photo.location}
      </p>

    </div>
  );
};

export default PhotoCard;