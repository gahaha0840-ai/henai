import { useState, useRef, useCallback } from "react";

const colors = {
  bg: "#F8F6F0",
  text: "#3D3328",
  subtext: "#A39B8B",
  accent: "#A68A61",
  border: "#E6E0D4",
  card: "#FCFAEF",
};

const fonts = {
  serif: '"Noto Serif JP", "Hiragino Mincho ProN", serif',
  sans: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif',
  mono: '"SF Mono", "Courier New", monospace',
};

type RecordType = "フォト" | "図鑑";

// ── フォト用の型 ──
interface UploadedImage {
  id: number;
  url: string;
  file: File;
}

// ── 図鑑用の型 ──
interface CoverData {
  title: string;
  imageUrl: string | null;
}
interface PageData {
  id: number;
  imageUrl: string | null;
  text: string;
}
type ZukanFileTarget = { kind: "cover" } | { kind: "page"; id: number };

export default function Record() {
  const [recordType, setRecordType] = useState<RecordType>("フォト");

  return (
    <div style={{ fontFamily: fonts.sans, color: colors.text }}>
      {/* ── ページヘッダー ── */}
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            fontFamily: fonts.serif,
            fontSize: "26px",
            fontWeight: "bold",
            color: colors.text,
            letterSpacing: "0.05em",
            marginBottom: "16px",
          }}
        >
          ✏️ 記録
        </h1>

        {/* タイプ切り替え */}
        <div
          style={{
            display: "inline-flex",
            borderRadius: "10px",
            border: `1px solid ${colors.border}`,
            background: colors.card,
            padding: "4px",
            gap: "4px",
          }}
        >
          {(["フォト", "図鑑"] as RecordType[]).map((type) => (
            <button
              key={type}
              onClick={() => setRecordType(type)}
              style={{
                padding: "7px 28px",
                borderRadius: "7px",
                border: "none",
                background: recordType === type ? colors.accent : "transparent",
                color: recordType === type ? "#fff" : colors.subtext,
                fontSize: "13px",
                fontFamily: fonts.sans,
                fontWeight: recordType === type ? "bold" : "normal",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {type === "フォト" ? "🖼️ フォト" : "📖 図鑑"}
            </button>
          ))}
        </div>
      </div>

      {/* ── 各エディター ── */}
      {recordType === "フォト" ? <PhotoEditor /> : <ZukanEditor />}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// フォトエディター
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function PhotoEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [selectedImg, setSelectedImg] = useState<UploadedImage | null>(null);
  const [aiTags] = useState([
    "#自作",
    "#ガジェット",
    "#記録",
    "#こだわり",
    "#デザイン",
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(0);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages: UploadedImage[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({
        id: ++idRef.current,
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

  const removeImage = (id: number) => {
    setImages((prev) => {
      const next = prev.filter((img) => img.id !== id);
      if (selectedImg?.id === id) setSelectedImg(next[0] ?? null);
      return next;
    });
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr minmax(240px,320px)",
        gap: "24px",
        alignItems: "start",
      }}
    >
      {/* 左カラム */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Field label="タイトル">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトルを入力"
            style={inputStyle}
          />
        </Field>

        <Field label="画像">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={onDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            style={{
              minHeight: "220px",
              borderRadius: "12px",
              padding: "20px",
              border: `1.5px dashed ${isDragging ? colors.accent : colors.border}`,
              background: isDragging ? "rgba(166,138,97,0.05)" : colors.card,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.15s",
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
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(90px,1fr))",
                  gap: "10px",
                  width: "100%",
                }}
              >
                {images.map((img) => (
                  <div
                    key={img.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImg(img);
                    }}
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
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(img.id);
                      }}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "rgba(0,0,0,0.5)",
                        border: "none",
                        color: "#fff",
                        fontSize: "11px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div
                  style={{
                    aspectRatio: "1",
                    borderRadius: "8px",
                    border: `1.5px dashed ${colors.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: colors.subtext,
                    fontSize: "22px",
                  }}
                >
                  +
                </div>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            //multiple <-画像を複数選択できるようにする場合はこの属性を有効にしてください
            style={{ display: "none" }}
            onChange={(e) => addFiles(e.target.files)}
          />
        </Field>

        <Field label="内容">
          <div style={{ position: "relative" }}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="内容テキストを入力"
              rows={6}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }}
            />
            <button
              onClick={() => {
                console.log({ title, content, images });
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
              }}
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
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {saved ? "保存済み ✓" : "保存"}
            </button>
          </div>
        </Field>
      </div>

      {/* 右カラム */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Field label="プレビュー" badge>
          <div
            style={{
              borderRadius: "12px",
              border: `1px solid ${colors.border}`,
              background: colors.card,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "16/9",
                background: colors.border,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
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
            {images.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: "2px",
                  padding: "2px",
                  background: colors.border,
                }}
              >
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
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            <div style={{ padding: "10px 12px 14px" }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  fontFamily: fonts.serif,
                  color: colors.text,
                  minHeight: "18px",
                  opacity: title ? 1 : 0.3,
                }}
              >
                {title || "タイトル"}
              </div>
              {content && (
                <div
                  style={{
                    fontSize: "11px",
                    color: colors.subtext,
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {content}
                </div>
              )}
            </div>
          </div>
        </Field>

        <Field label="AIタグ" badge>
          <div
            style={{
              borderRadius: "12px",
              border: `1px solid ${colors.border}`,
              background: colors.card,
              padding: "14px",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              minHeight: "60px",
            }}
          >
            {aiTags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "11px",
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  background: "rgba(166,138,97,0.12)",
                  color: colors.accent,
                  border: "1px solid rgba(166,138,97,0.25)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </Field>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 図鑑エディター
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ZukanEditor() {
  const [cover, setCover] = useState<CoverData>({ title: "", imageUrl: null });
  const [pages, setPages] = useState<PageData[]>([
    { id: 1, imageUrl: null, text: "" },
  ]);
  const [spread, setSpread] = useState(0);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingTarget = useRef<ZukanFileTarget | null>(null);
  const idRef = useRef(2);

  const totalSpreads = Math.ceil((pages.length + 1) / 2);
  const leftPage = spread === 0 ? null : (pages[spread * 2 - 2] ?? null);
  const rightPage = spread === 0 ? pages[0] : (pages[spread * 2 - 1] ?? null);

  const openFilePicker = (target: ZukanFileTarget) => {
    pendingTarget.current = target;
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingTarget.current) return;
    const url = URL.createObjectURL(file);
    const t = pendingTarget.current;
    if (t.kind === "cover") setCover((c) => ({ ...c, imageUrl: url }));
    else
      setPages((ps) =>
        ps.map((p) => (p.id === t.id ? { ...p, imageUrl: url } : p)),
      );
    e.target.value = "";
  };

  const addPage = () =>
    setPages((ps) => [
      ...ps,
      { id: idRef.current++, imageUrl: null, text: "" },
    ]);

  const removePage = (id: number) => {
    setPages((ps) => {
      const next = ps.filter((p) => p.id !== id);
      return next.length === 0
        ? [{ id: idRef.current++, imageUrl: null, text: "" }]
        : next;
    });
    setSpread((s) => Math.max(0, s - 1));
  };

  const updateText = (id: number, text: string) =>
    setPages((ps) => ps.map((p) => (p.id === id ? { ...p, text } : p)));

  return (
    <div>
      {/* 保存ボタン */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "16px",
        }}
      >
        <button
          onClick={() => {
            console.log({ cover, pages });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          style={{
            padding: "8px 24px",
            borderRadius: "8px",
            border: `1px solid ${colors.accent}`,
            background: saved ? colors.accent : "transparent",
            color: saved ? "#fff" : colors.accent,
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {saved ? "保存済み ✓" : "保存する"}
        </button>
      </div>

      {/* 見開きエディター */}
      <div
        style={{
          background: "#2a1f14",
          borderRadius: "16px",
          padding: "28px",
          marginBottom: "20px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            maxWidth: "800px",
            margin: "0 auto",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          {/* 左ページ */}
          <div
            style={{
              background: "#fdfaf3",
              borderRight: "2px solid #e8e0d0",
              minHeight: "440px",
            }}
          >
            {spread === 0 ? (
              <CoverPage
                cover={cover}
                onTitleChange={(t) => setCover((c) => ({ ...c, title: t }))}
                onImageClick={() => openFilePicker({ kind: "cover" })}
              />
            ) : leftPage ? (
              <ContentPage
                page={leftPage}
                onImageClick={() =>
                  openFilePicker({ kind: "page", id: leftPage.id })
                }
                onTextChange={(t) => updateText(leftPage.id, t)}
                onRemove={() => removePage(leftPage.id)}
              />
            ) : (
              <EmptyPage />
            )}
          </div>

          {/* 右ページ */}
          <div style={{ background: "#faf6ef", minHeight: "440px" }}>
            {rightPage ? (
              <ContentPage
                page={rightPage}
                onImageClick={() =>
                  openFilePicker({ kind: "page", id: rightPage.id })
                }
                onTextChange={(t) => updateText(rightPage.id, t)}
                onRemove={() => removePage(rightPage.id)}
              />
            ) : (
              <EmptyPage onAdd={addPage} />
            )}
          </div>
        </div>

        {/* ページ送り */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          <NavBtn
            disabled={spread === 0}
            onClick={() => setSpread((s) => s - 1)}
          >
            ‹
          </NavBtn>
          <span
            style={{
              color: "rgba(255,253,245,0.5)",
              fontSize: "12px",
              minWidth: "100px",
              textAlign: "center",
            }}
          >
            {spread === 0 ? "表紙" : `${spread * 2} — ${spread * 2 + 1} p`} /{" "}
            {pages.length} p
          </span>
          <NavBtn
            disabled={spread >= totalSpreads - 1}
            onClick={() => setSpread((s) => s + 1)}
          >
            ›
          </NavBtn>
          <button
            onClick={addPage}
            style={{
              padding: "5px 14px",
              borderRadius: "6px",
              border: "1px solid rgba(255,253,245,0.2)",
              background: "transparent",
              color: "rgba(255,253,245,0.4)",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            + ページ追加
          </button>
        </div>
      </div>

      {/* サムネイル一覧 */}
      <div
        style={{ fontSize: "11px", color: colors.subtext, marginBottom: "8px" }}
      >
        ページ一覧
      </div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          paddingBottom: "8px",
        }}
      >
        <Thumb
          label="表紙"
          imageUrl={cover.imageUrl}
          active={spread === 0}
          onClick={() => setSpread(0)}
        />
        {pages.map((p, i) => (
          <Thumb
            key={p.id}
            label={`p${i + 1}`}
            imageUrl={p.imageUrl}
            active={spread === Math.ceil((i + 1) / 2)}
            onClick={() => setSpread(Math.ceil((i + 1) / 2))}
          />
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={onFileChange}
      />
    </div>
  );
}

// ── 表紙 ──
function CoverPage({
  cover,
  onTitleChange,
  onImageClick,
}: {
  cover: CoverData;
  onTitleChange: (t: string) => void;
  onImageClick: () => void;
}) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        onClick={onImageClick}
        style={{
          flex: 1,
          background: colors.border,
          minHeight: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        {cover.imageUrl ? (
          <img
            src={cover.imageUrl}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <ImgPlaceholder label="表紙の写真を追加" />
        )}
      </div>
      <div style={{ padding: "14px 18px", borderTop: "1px solid #e8e0d0" }}>
        <input
          value={cover.title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="図鑑のタイトル"
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: fonts.serif,
            fontSize: "17px",
            fontWeight: "bold",
            color: colors.text,
            textAlign: "center",
            boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
}

// ── コンテンツページ ──
function ContentPage({
  page,
  onImageClick,
  onTextChange,
  onRemove,
}: {
  page: PageData;
  onImageClick: () => void;
  onTextChange: (t: string) => void;
  onRemove: () => void;
}) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <button
        onClick={onRemove}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          zIndex: 2,
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          border: `1px solid ${colors.border}`,
          background: colors.card,
          color: colors.subtext,
          fontSize: "12px",
          cursor: "pointer",
        }}
      >
        ×
      </button>
      <div
        onClick={onImageClick}
        style={{
          height: "260px",
          background: colors.border,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        {page.imageUrl ? (
          <img
            src={page.imageUrl}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <ImgPlaceholder label="写真を追加" />
        )}
      </div>
      <textarea
        value={page.text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="このページの記録を書く…"
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          background: "transparent",
          resize: "none",
          fontFamily: fonts.serif,
          fontSize: "13px",
          color: colors.text,
          lineHeight: 1.8,
          padding: "14px 18px",
        }}
      />
    </div>
  );
}

// ── 空ページ ──
function EmptyPage({ onAdd }: { onAdd?: () => void }) {
  return (
    <div
      style={{
        height: "440px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "12px",
        opacity: 0.35,
      }}
    >
      <span style={{ fontSize: "28px" }}>📄</span>
      {onAdd && (
        <button
          onClick={onAdd}
          style={{
            padding: "6px 16px",
            borderRadius: "6px",
            border: `1px solid ${colors.border}`,
            background: "transparent",
            color: colors.subtext,
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          + ページを追加
        </button>
      )}
    </div>
  );
}

// ── 共通小コンポーネント ──
function ImgPlaceholder({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        opacity: 0.4,
      }}
    >
      <span style={{ fontSize: "26px" }}>🖼️</span>
      <span style={{ fontSize: "11px", color: colors.subtext }}>{label}</span>
    </div>
  );
}

function NavBtn({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        border: "1px solid rgba(255,253,245,0.2)",
        background: "transparent",
        color: disabled ? "rgba(255,253,245,0.2)" : "rgba(255,253,245,0.7)",
        fontSize: "18px",
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

function Thumb({
  label,
  imageUrl,
  active,
  onClick,
}: {
  label: string;
  imageUrl: string | null;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{ flexShrink: 0, width: "68px", cursor: "pointer" }}
    >
      <div
        style={{
          width: "68px",
          height: "50px",
          borderRadius: "4px",
          overflow: "hidden",
          border: `2px solid ${active ? colors.accent : colors.border}`,
          background: colors.border,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "border-color 0.15s",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: "16px", opacity: 0.3 }}>📄</span>
        )}
      </div>
      <div
        style={{
          fontSize: "9px",
          color: active ? colors.accent : colors.subtext,
          textAlign: "center",
          marginTop: "4px",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function Field({
  label,
  badge,
  children,
}: {
  label: string;
  badge?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      {badge ? (
        <div
          style={{
            display: "inline-block",
            padding: "4px 14px",
            borderRadius: "6px",
            border: `1px solid ${colors.accent}`,
            color: colors.accent,
            fontSize: "12px",
            marginBottom: "10px",
          }}
        >
          {label}
        </div>
      ) : (
        <label
          style={{
            display: "block",
            fontSize: "11px",
            color: colors.subtext,
            marginBottom: "6px",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  border: `1px solid ${colors.border}`,
  background: colors.card,
  fontSize: "13px",
  fontFamily: fonts.sans,
  color: colors.text,
  outline: "none",
  boxSizing: "border-box",
};
