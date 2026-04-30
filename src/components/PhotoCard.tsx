// src/components/PhotoCard.tsx
import React from 'react';
import { PhotoMaterial } from '../types/index.ts';

interface PhotoCardProps {
  photo: PhotoMaterial;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo }) => {
  return (
    <div style={{ width: '100%', cursor: 'pointer' }}>
      {/* 写真エリア (正方形) */}
      <div style={{
        aspectRatio: '1 / 1',
        overflow: 'hidden',
        borderRadius: '8px',
        backgroundColor: '#E6E0D4', // 画像読み込み前のプレースホルダー色
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <img 
          src={photo.imageUrl} 
          alt={photo.title}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }} 
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>

      {/* タイトル */}
      <p style={{ 
        marginTop: '8px', 
        fontSize: '14px', 
        fontWeight: 'bold',
        color: '#3D3328',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {photo.title}
      </p>
    </div>
  );
};

export default PhotoCard;