// src/pages/Account.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// カラーパレットとフォント設定（Layout.tsxと共通）
const colors = {
  bg:      '#F8F6F0',
  text:    '#3D3328',
  subtext: '#A39B8B',
  accent:  '#A68A61',
  border:  '#E6E0D4',
  card:    '#FCFAEF',
  btnText: '#FFFFFF',
};

const fonts = {
  serif: '"Noto Serif JP", "Hiragino Mincho ProN", serif',
  sans:  '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif',
};

const Account = () => {
  // ── 状態管理（モックデータ） ──
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'NAME',
    imageUrl: '', // 初期状態は空（アイコン表示）
  });
  
  const [editForm, setEditForm] = useState(profileData);

  // フォロー中ユーザーのモックデータ
  const followingUsers = [
    { id: '1', name: 'ユーザーA', imageUrl: '' },
    { id: '2', name: 'ユーザーB', imageUrl: '' },
    { id: '3', name: 'ユーザーC', imageUrl: '' },
  ];

  // ── ハンドラー ──
  const handleEditToggle = () => {
    if (isEditing) {
      // 保存処理（実際はここでAPIを叩く）
      setProfileData(editForm);
    } else {
      // 編集開始時に現在のデータをフォームにセット
      setEditForm(profileData);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
      // 実際はファイル選択ダイアログを開き、プレビューを表示する処理
      // ここでは簡易的にプロンプトでURLを入力させる
      const url = prompt("画像URLを入力してください（クリアする場合はキャンセルまたは空欄）", editForm.imageUrl);
      if (url !== null) {
          setEditForm(prev => ({ ...prev, imageUrl: url }));
      }
  };


  return (
    <div style={{ fontFamily: fonts.sans, color: colors.text }}>
      <h2 style={{ fontFamily: fonts.serif, borderBottom: `1px solid ${colors.accent}`, paddingBottom: '8px', marginBottom: '32px' }}>
        アカウント
      </h2>

      {/* ── プロフィールセクション ── */}
      <section style={{
        backgroundColor: colors.card,
        padding: '32px',
        borderRadius: '16px',
        border: `1px solid ${colors.border}`,
        marginBottom: '40px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px' }}>
          
          {/* 画像表示・編集領域 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div 
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: colors.border,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: isEditing ? 'pointer' : 'default',
              }}
              onClick={isEditing ? handleImageClick : undefined}
            >
              {(isEditing ? editForm.imageUrl : profileData.imageUrl) ? (
                <img 
                  src={isEditing ? editForm.imageUrl : profileData.imageUrl} 
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <span style={{ fontSize: '48px', color: colors.subtext }}>👤</span>
              )}
              
              {/* 編集モード時のオーバーレイ */}
              {isEditing && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  変更
                </div>
              )}
            </div>
          </div>

          {/* 名前・編集ボタン領域 */}
          <div style={{ flex: 1, paddingTop: '12px' }}>
            {isEditing ? (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', color: colors.subtext, marginBottom: '8px' }}>
                  名前
                </label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    maxWidth: '300px',
                    padding: '8px 12px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
                    outline: 'none',
                    fontFamily: fonts.sans,
                  }}
                />
              </div>
            ) : (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '24px', margin: 0 }}>{profileData.name}</h3>
              </div>
            )}

            <button
              onClick={handleEditToggle}
              style={{
                padding: '8px 24px',
                backgroundColor: isEditing ? colors.accent : 'transparent',
                color: isEditing ? colors.btnText : colors.accent,
                border: `1px solid ${colors.accent}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s',
              }}
            >
              {isEditing ? '保存する' : 'プロフィールを編集'}
            </button>
            {isEditing && (
              <button
                 onClick={() => { setIsEditing(false); setEditForm(profileData); }}
                 style={{
                   marginLeft: '12px',
                   padding: '8px 24px',
                   backgroundColor: 'transparent',
                   color: colors.subtext,
                   border: `1px solid ${colors.border}`,
                   borderRadius: '8px',
                   cursor: 'pointer',
                 }}
              >
                キャンセル
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── フォローセクション ── */}
      <section>
        <h3 style={{ fontSize: '18px', marginBottom: '16px', color: colors.text }}>
        フォロー中 <span style={{ fontSize: '14px', color: colors.subtext }}>({followingUsers.length})</span>
        </h3>
  
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {followingUsers.map(user => (
            <div 
                key={user.id}
                style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: colors.card,
                borderRadius: '12px',
                border: `1px solid ${colors.border}`,
                }}
      >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    backgroundColor: colors.border, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                    }}>
                    {user.imageUrl ? (
                        <img src={user.imageUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                        <span style={{ fontSize: '20px', color: colors.subtext }}>👤</span>
                    )}
                </div>
                <span style={{ fontWeight: 'bold' }}>{user.name}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
            {/* ── 追加：図鑑を見るボタン ── */}
            <Link to={`/user/${user.id}`} style={{ textDecoration: 'none' }}>
                <button style={{
                    padding: '6px 16px',
                    backgroundColor: colors.accent,
                    color: colors.btnText,
                    border: 'none',
                    borderRadius: '999px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'opacity 0.2s',
                    }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                    図鑑を見る 📖
                </button>
            </Link>

            <button style={{
                padding: '6px 16px',
                backgroundColor: 'transparent',
                color: colors.subtext,
                border: `1px solid ${colors.border}`,
                borderRadius: '999px',
                fontSize: '14px',
                cursor: 'pointer',
                }}>
                フォロー中
            </button>
            </div>
        </div>
        ))}
      </div>
      </section>

    </div>
  );
};

export default Account;