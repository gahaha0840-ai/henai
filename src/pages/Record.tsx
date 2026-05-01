// src/pages/Record.tsx
import { useState, useRef, useCallback } from "react";

const colors = {
  bg:      "#F8F6F0",
  text:    "#3D3328",
  subtext: "#A39B8B",
  accent:  "#A68A61",
  border:  "#E6E0D4",
  card:    "#FCFAEF",
};

const fonts = {
  serif: '"Noto Serif JP", "Hiragino Mincho ProN", serif',
  sans:  '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif',
  mono:  '"SF Mono", "Courier New", monospace',
};

type RecordType = "表紙" | "ページ" | "フォト";

interface UploadedImage {
  id: number;
  url: string;
  file: File;
}

export default function Record() {
  const [recordType, setRecordType]   = useState<RecordType>("表紙");
  const [title, setTitle]             = useState("");
  const [content, setContent]         = useState("");
  const [images, setImages]           = useState<UploadedImage[]>([]);
  const [selectedImg, setSelectedImg] = useState<UploadedImage | null>(null);
  const [aiTags]                      = useState<string[]>(["#自作", "#ガジェット", "#記録", "#こだわり", "#デザイン"]);
  const [isDragging, setIsDragging]   = useState(false);
  const [saved, setSaved]             = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const idRef        = useRef(0);

  // ── ファイル追加処理 ──
  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages: UploadedImage[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({
        id:  ++idRef.current,
        url: URL.createObjectURL(file),
        file,
      }));
    setImages((prev) => [...prev, ...newImages]);
    if (!selectedImg && newImages.length > 0) setSelectedImg(newImages[0]);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const removeImage = (id: number) => {
    setImages((prev) => {
      const next = prev.filter((img) => img.id !== id);
      if (selectedImg?.id === id) setSelectedImg(next[0] ?? null);
      return next;
    });
  };

  const handleSave = () => {
    // 保存処理（本番ではAPIへPOST）
    console.log({ recordType, title, content, images });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ fontFamily: fonts.sans, color: colors.text }}>

      {/* ── ページヘッダー ── */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{
          fontFamily: fonts.serif,
          fontSize: "26px",
          fontWeight: "bold",
          color: colors.text,
          letterSpacing: "0.05em",
          marginBottom: "6px",
        }}>
          ✏️ 記録
        </h1>
        <p style={{ fontSize: "13px", color: colors.subtext, lineHeight: 1.6 }}>
          こだわりを写真と言葉で記録しよう。
        </p>
      </div>

      {/* ── 作成タイプ選択 ── */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
        {(["表紙", "ページ", "フォト"] as RecordType[]).map((type) => (
          <button
            key={type}
            onClick={() => setRecordType(type)}
            style={{
              padding: "8px 28px",
              borderRadius: "8px",
              border: `1px solid ${recordType === type ? colors.accent : colors.border}`,
              background: recordType === type ? colors.accent : colors.card,
              color: recordType === type ? "#fff" : colors.subtext,
              fontSize: "13px",
              fontFamily: fonts.sans,
              fontWeight: recordType === type ? "bold" : "normal",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* ── 2カラムレイアウト ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr minmax(240px, 320px)",
        gap: "24px",
        alignItems: "start",
      }}>

        {/* ── 左カラム ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* タイトル入力 */}
          <div>
            <label style={{
              display: "block",
              fontSize: "11px",
              color: colors.subtext,
              marginBottom: "6px",
              letterSpacing: "0.05em",
            }}>
              タイトル
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タイトルを入力"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: `1px solid ${colors.border}`,
                background: colors.card,
                fontSize: "14px",
                fontFamily: fonts.sans,
                color: colors.text,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* 画像アップロードエリア */}
          <div>
            <label style={{
              display: "block",
              fontSize: "11px",
              color: colors.subtext,
              marginBottom: "6px",
              letterSpacing: "0.05em",
            }}>
              画像
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              style={{
                minHeight: "220px",
                border: `1.5px dashed ${isDragging ? colors.accent : colors.border}`,
                borderRadius: "12px",
                background: isDragging ? "rgba(166,138,97,0.05)" : colors.card,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.15s",
                padding: "20px",
                gap: "12px",
              }}
            >
              {images.length === 0 ? (
                <>
                  <span style={{ fontSize: "32px", opacity: 0.4 }}>🖼️</span>
                  <span style={{ fontSize: "13px", color: colors.subtext }}>
                    ここに画像をアップロード
                  </span>
                  <span style={{ fontSize: "11px", color: colors.border }}>
                    クリックまたはドラッグ＆ドロップ
                  </span>
                </>
              ) : (
                // サムネイルグリッド
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
                  gap: "10px",
                  width: "100%",
                }}>
                  {images.map((img) => (
                    <div
                      key={img.id}
                      onClick={(e) => { e.stopPropagation(); setSelectedImg(img); }}
                      style={{
                        position: "relative",
                        aspectRatio: "1",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: `2px solid ${selectedImg?.id === img.id ? colors.accent : "transparent"}`,
                        cursor: "pointer",
                        transition: "border-color 0.15s",
                      }}
                    >
                      <img
                        src={img.url}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      {/* 削除ボタン */}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                        style={{
                          position: "absolute", top: "4px", right: "4px",
                          width: "20px", height: "20px",
                          borderRadius: "50%",
                          background: "rgba(0,0,0,0.5)",
                          border: "none", color: "#fff",
                          fontSize: "11px", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          lineHeight: 1,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {/* 追加ボタン */}
                  <div style={{
                    aspectRatio: "1",
                    borderRadius: "8px",
                    border: `1.5px dashed ${colors.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: colors.subtext, fontSize: "22px", cursor: "pointer",
                  }}>
                    +
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>

          {/* 内容テキスト入力 */}
          <div>
            <label style={{
              display: "block",
              fontSize: "11px",
              color: colors.subtext,
              marginBottom: "6px",
              letterSpacing: "0.05em",
            }}>
              内容
            </label>
            <div style={{ position: "relative" }}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="内容テキストを入力"
                rows={6}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border: `1px solid ${colors.border}`,
                  background: colors.card,
                  fontSize: "13px",
                  fontFamily: fonts.sans,
                  color: colors.text,
                  resize: "vertical",
                  outline: "none",
                  lineHeight: 1.7,
                  boxSizing: "border-box",
                }}
              />
              {/* 保存ボタン */}
              <button
                onClick={handleSave}
                style={{
                  position: "absolute",
                  bottom: "12px",
                  right: "12px",
                  padding: "6px 18px",
                  borderRadius: "6px",
                  border: `1px solid ${colors.accent}`,
                  background: saved ? colors.accent : "transparent",
                  color: saved ? "#fff" : colors.accent,
                  fontSize: "12px",
                  fontFamily: fonts.sans,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {saved ? "保存済み ✓" : "保存"}
              </button>
            </div>
          </div>
        </div>

        {/* ── 右カラム ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* プレビュー */}
          <div>
            <div style={{
              display: "inline-block",
              padding: "4px 14px",
              borderRadius: "6px",
              border: `1px solid ${colors.accent}`,
              color: colors.accent,
              fontSize: "12px",
              fontFamily: fonts.sans,
              marginBottom: "10px",
            }}>
              プレビュー
            </div>
            <div style={{
              borderRadius: "12px",
              border: `1px solid ${colors.border}`,
              background: colors.card,
              overflow: "hidden",
            }}>
              {/* メイン画像 */}
              <div style={{
                width: "100%",
                aspectRatio: "16/9",
                background: colors.border,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}>
                {selectedImg ? (
                  <img
                    src={selectedImg.url}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ fontSize: "28px", opacity: 0.3 }}>🖼️</span>
                )}
              </div>

              {/* サムネイル横並び */}
              {images.length > 0 && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "2px",
                  padding: "2px",
                  background: colors.border,
                }}>
                  {images.slice(0, 3).map((img) => (
                    <div
                      key={img.id}
                      onClick={() => setSelectedImg(img)}
                      style={{
                        aspectRatio: "1",
                        overflow: "hidden",
                        cursor: "pointer",
                        opacity: selectedImg?.id === img.id ? 1 : 0.6,
                        transition: "opacity 0.15s",
                      }}
                    >
                      <img
                        src={img.url}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* タイトルプレビュー */}
              <div style={{ padding: "10px 12px 14px" }}>
                <div style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  fontFamily: fonts.serif,
                  color: colors.text,
                  marginBottom: title ? "4px" : 0,
                  minHeight: "18px",
                  opacity: title ? 1 : 0.3,
                }}>
                  {title || "タイトル"}
                </div>
                {content && (
                  <div style={{
                    fontSize: "11px",
                    color: colors.subtext,
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>
                    {content}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AIタグ */}
          <div>
            <div style={{
              display: "inline-block",
              padding: "4px 14px",
              borderRadius: "6px",
              border: `1px solid ${colors.accent}`,
              color: colors.accent,
              fontSize: "12px",
              fontFamily: fonts.sans,
              marginBottom: "10px",
            }}>
              AIタグ
            </div>
            <div style={{
              borderRadius: "12px",
              border: `1px solid ${colors.border}`,
              background: colors.card,
              padding: "14px",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              minHeight: "60px",
            }}>
              {aiTags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "11px",
                    padding: "4px 12px",
                    borderRadius: "9999px",
                    background: "rgba(166,138,97,0.12)",
                    color: colors.accent,
                    fontFamily: fonts.sans,
                    border: `1px solid rgba(166,138,97,0.25)`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 記録タイプバッジ */}
          <div style={{
            padding: "12px 14px",
            borderRadius: "10px",
            border: `1px solid ${colors.border}`,
            background: colors.card,
            fontSize: "12px",
            color: colors.subtext,
            fontFamily: fonts.sans,
          }}>
            <span style={{ color: colors.subtext }}>作成タイプ：</span>
            <span style={{
              marginLeft: "8px",
              color: colors.accent,
              fontWeight: "bold",
            }}>
              {recordType}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}