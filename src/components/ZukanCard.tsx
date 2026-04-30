// src/components/ZukanCard.tsx
import React from 'react';
import { Collection } from '../types/index.ts';

interface ZukanCardProps {
  item: Collection;
}

const ZukanCard: React.FC<ZukanCardProps> = ({ item }) => {
  // 日付を「YYYY.MM.DD」の形式に変換
  const formattedDate = new Date(item.createdAt)
    .toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })
    .replace(/\//g, '.');

  return (
    <div style={{
      backgroundColor: '#FCFAEF',
      border: '1px solid #E6E0D4',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
      transition: 'box-shadow 0.2s',
      cursor: 'pointer'
    }}
    onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.05)'}
    onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)'}
    >
      {/* サムネイルエリア (16:9) */}
      <div style={{ aspectRatio: '16 / 9', overflow: 'hidden', backgroundColor: '#E6E0D4' }}>
        <img 
          src={item.thumbnailUrl} 
          alt={item.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>

      {/* コンテンツエリア */}
      <div style={{ padding: '16px' }}>
        {/* 日付 */}
        <div style={{ fontSize: '12px', color: '#A39B8B', marginBottom: '6px' }}>
          {formattedDate}
        </div>
        
        {/* タイトル */}
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          color: '#3D3328',
          margin: '0 0 8px 0'
        }}>
          {item.title}
        </h3>
        
        {/* 内容（2行で切り捨て） */}
        <p style={{ 
          fontSize: '14px', 
          color: '#3D3328', 
          lineHeight: '1.6',
          margin: '0 0 12px 0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {item.content}
        </p>
        
        {/* AIタグ (最大3つまで表示) */}
        {item.aiTags && item.aiTags.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {item.aiTags.slice(0, 3).map(tag => (
              <span 
                key={tag} 
                style={{ 
                  fontSize: '11px', 
                  color: '#A68A61',
                  backgroundColor: 'rgba(166, 138, 97, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ZukanCard;