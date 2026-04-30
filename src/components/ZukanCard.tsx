// src/components/ZukanCard.tsx
import React from 'react';

export interface ZukanData {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  date: string;
}

const ZukanCard = ({ item }: { item: ZukanData }) => {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid #E0DCD3',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* 写真エリア（枠いっぱいまで広げる） */}
      <div style={{ width: '100%', aspectRatio: '4 / 3', overflow: 'hidden' }}>
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>

      {/* テキストエリア */}
      <div style={{ padding: '16px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 'bold', color: '#111' }}>
          {item.title}
        </h3>
        <p style={{ margin: '0 0 24px 0', fontSize: '16px', color: '#888' }}>
          {item.description}
        </p>
        
        {/* 日付（右下寄せ） */}
        <div style={{ textAlign: 'right', fontSize: '16px', color: '#111' }}>
          {item.date}
        </div>
      </div>

    </div>
  );
};

export default ZukanCard;