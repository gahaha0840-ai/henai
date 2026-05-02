import { useState, useRef, useCallback, useEffect } from "react";

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
};

type RecordType = "フォト" | "図鑑";

// ── 図鑑用の型 ──
type PageLayout = "photo-text" | "text-only" | "photo-only";
interface CoverData {
  title: string;
  imageUrl: string | null;
}
interface PageData {
  id: number;
  layout: PageLayout;
  imageUrl: string | null;
  imgX: number;
  imgY: number;
  imgScale: number; // 画像位置・拡大率
  text: string;
}
type ZukanTarget = { kind: "cover" } | { kind: "page"; id: number };

function makePage(id: number): PageData {
  return {
    id,
    layout: "photo-text",
    imageUrl: null,
    imgX: 0,
    imgY: 0,
    imgScale: 1,
    text: "",
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Record（切り替え親）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function Record() {
  const [recordType, setRecordType] = useState<RecordType>("フォト");
  return (
    <div style={{ fontFamily: fonts.sans, color: colors.text }}>
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            fontFamily: fonts.serif,
            fontSize: "26px",
            fontWeight: "bold",
            letterSpacing: "0.05em",
            marginBottom: "16px",
          }}
        >
          ✏️ 記録
        </h1>
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
      {recordType === "フォト" ? <PhotoEditor /> : <ZukanEditor />}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// フォトエディター（1枚のみ）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function PhotoEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageUrl(URL.createObjectURL(file));
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    loadFile(e.dataTransfer.files[0]);
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr minmax(240px,300px)",
        gap: "24px",
        alignItems: "start",
      }}
    >
      {/* 左 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Field label="タイトル">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトルを入力"
            style={inputStyle}
          />
        </Field>

        <Field label="画像（1枚）">
          <div
            onClick={() => !imageUrl && fileRef.current?.click()}
            onDrop={onDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            style={{
              height: "260px",
              borderRadius: "12px",
              border: `1.5px dashed ${isDragging ? colors.accent : colors.border}`,
              background: isDragging ? "rgba(166,138,97,0.05)" : colors.card,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: imageUrl ? "default" : "pointer",
              overflow: "hidden",
              position: "relative",
              transition: "all 0.15s",
            }}
          >
            {imageUrl ? (
              <>
                <img
                  src={imageUrl}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageUrl(null);
                  }}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.5)",
                    border: "none",
                    color: "#fff",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  opacity: 0.45,
                }}
              >
                <span style={{ fontSize: "36px" }}>🖼️</span>
                <span style={{ fontSize: "13px", color: colors.subtext }}>
                  画像を追加（1枚）
                </span>
                <span style={{ fontSize: "11px", color: colors.border }}>
                  クリックまたはドラッグ
                </span>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => loadFile(e.target.files?.[0])}
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

      {/* 右：プレビュー */}
      <div>
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
                aspectRatio: "4/3",
                background: colors.border,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: "28px", opacity: 0.3 }}>🖼️</span>
              )}
            </div>
            <div style={{ padding: "10px 12px 14px" }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  fontFamily: fonts.serif,
                  color: colors.text,
                  opacity: title ? 1 : 0.3,
                  marginBottom: "4px",
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
                    WebkitLineClamp: 3,
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
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 図鑑エディター
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ZukanEditor() {
  const [cover, setCover] = useState<CoverData>({ title: "", imageUrl: null });
  const [pages, setPages] = useState<PageData[]>([makePage(1)]);
  const [spread, setSpread] = useState(0);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const targetRef = useRef<ZukanTarget | null>(null);
  const idRef = useRef(2);

  const totalSpreads = Math.ceil((pages.length + 1) / 2);
  const leftPage = spread === 0 ? null : (pages[spread * 2 - 2] ?? null);
  const rightPage =
    spread === 0 ? (pages[0] ?? null) : (pages[spread * 2 - 1] ?? null);

  const openFile = (t: ZukanTarget) => {
    targetRef.current = t;
    fileRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetRef.current) return;
    const url = URL.createObjectURL(file);
    const t = targetRef.current;
    if (t.kind === "cover") setCover((c) => ({ ...c, imageUrl: url }));
    else
      setPages((ps) =>
        ps.map((p) =>
          p.id === t.id
            ? { ...p, imageUrl: url, imgX: 0, imgY: 0, imgScale: 1 }
            : p,
        ),
      );
    e.target.value = "";
  };

  const updatePage = (id: number, patch: Partial<PageData>) =>
    setPages((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const addPage = () => {
    setPages((ps) => [...ps, makePage(idRef.current++)]);
  };

  const removePage = (id: number) => {
    setPages((ps) => {
      const next = ps.filter((p) => p.id !== id);
      return next.length === 0 ? [makePage(idRef.current++)] : next;
    });
    setSpread((s) => Math.max(0, s - 1));
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "16px",
        }}
      >
        <button
          onClick={() => {
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

      {/* 見開き */}
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
              minHeight: "460px",
            }}
          >
            {spread === 0 ? (
              <CoverPage
                cover={cover}
                onTitleChange={(t) => setCover((c) => ({ ...c, title: t }))}
                onImageClick={() => openFile({ kind: "cover" })}
              />
            ) : leftPage ? (
              <ContentPage
                page={leftPage}
                onImageClick={() => openFile({ kind: "page", id: leftPage.id })}
                onUpdate={(patch) => updatePage(leftPage.id, patch)}
                onRemove={() => removePage(leftPage.id)}
              />
            ) : (
              <EmptySlot />
            )}
          </div>

          {/* 右ページ */}
          <div style={{ background: "#faf6ef", minHeight: "460px" }}>
            {rightPage ? (
              <ContentPage
                page={rightPage}
                onImageClick={() =>
                  openFile({ kind: "page", id: rightPage.id })
                }
                onUpdate={(patch) => updatePage(rightPage.id, patch)}
                onRemove={() => removePage(rightPage.id)}
              />
            ) : (
              <EmptySlot onAdd={addPage} />
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
              color: "rgba(255,253,245,0.45)",
              fontSize: "12px",
              minWidth: "110px",
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

      {/* サムネイル */}
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
        ref={fileRef}
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
          minHeight: "340px",
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

// ── コンテンツページ（レイアウト切替 + 画像操作） ──
function ContentPage({
  page,
  onImageClick,
  onUpdate,
  onRemove,
}: {
  page: PageData;
  onImageClick: () => void;
  onUpdate: (patch: Partial<PageData>) => void;
  onRemove: () => void;
}) {
  // ドラッグ状態
  const dragStart = useRef<{
    mx: number;
    my: number;
    ox: number;
    oy: number;
  } | null>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragStart.current = {
      mx: e.clientX,
      my: e.clientY,
      ox: page.imgX,
      oy: page.imgY,
    };
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragStart.current) return;
      onUpdate({
        imgX: dragStart.current.ox + (e.clientX - dragStart.current.mx),
        imgY: dragStart.current.oy + (e.clientY - dragStart.current.my),
      });
    };
    const onUp = () => {
      dragStart.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [page.imgX, page.imgY]);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const next = Math.min(3, Math.max(0.5, page.imgScale - e.deltaY * 0.001));
    onUpdate({ imgScale: next });
  };

  const layouts: { value: PageLayout; label: string }[] = [
    { value: "photo-text", label: "📷＋📝" },
    { value: "photo-only", label: "📷のみ" },
    { value: "text-only", label: "📝のみ" },
  ];

  const showPhoto = page.layout !== "text-only";
  const showText = page.layout !== "photo-only";

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* ツールバー */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 10px",
          borderBottom: "1px solid #e8e0d0",
          background: "#fdfaf3",
          flexShrink: 0,
        }}
      >
        {layouts.map((l) => (
          <button
            key={l.value}
            onClick={() => onUpdate({ layout: l.value })}
            style={{
              fontSize: "10px",
              padding: "3px 8px",
              borderRadius: "4px",
              border: `1px solid ${page.layout === l.value ? colors.accent : colors.border}`,
              background:
                page.layout === l.value
                  ? "rgba(166,138,97,0.1)"
                  : "transparent",
              color: page.layout === l.value ? colors.accent : colors.subtext,
              cursor: "pointer",
            }}
          >
            {l.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={onRemove}
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            border: `1px solid ${colors.border}`,
            background: "transparent",
            color: colors.subtext,
            fontSize: "11px",
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      {/* 写真エリア */}
      {showPhoto && (
        <div
          onWheel={onWheel}
          style={{
            height: showText ? "240px" : "100%",
            flexShrink: 0,
            background: colors.border,
            overflow: "hidden",
            position: "relative",
            cursor: page.imageUrl ? "grab" : "pointer",
          }}
        >
          {page.imageUrl ? (
            <>
              <div
                onMouseDown={onMouseDown}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                }}
              >
                <img
                  src={page.imageUrl}
                  alt=""
                  style={{
                    transform: `translate(${page.imgX}px, ${page.imgY}px) scale(${page.imgScale})`,
                    maxWidth: "none",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    pointerEvents: "none",
                    transformOrigin: "center center",
                  }}
                />
              </div>
              {/* 操作ヒント */}
              <div
                style={{
                  position: "absolute",
                  bottom: "6px",
                  right: "8px",
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.6)",
                  background: "rgba(0,0,0,0.3)",
                  padding: "2px 7px",
                  borderRadius: "4px",
                }}
              >
                ドラッグで移動・スクロールで拡縮
              </div>
              {/* 画像入れ替えボタン */}
              <button
                onClick={onImageClick}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  fontSize: "10px",
                  padding: "3px 10px",
                  borderRadius: "4px",
                  background: "rgba(0,0,0,0.45)",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                入れ替え
              </button>
            </>
          ) : (
            <div
              onClick={onImageClick}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ImgPlaceholder label="写真を追加" />
            </div>
          )}
        </div>
      )}

      {/* テキストエリア */}
      {showText && (
        <textarea
          value={page.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
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
      )}
    </div>
  );
}

// ── 空スロット ──
function EmptySlot({ onAdd }: { onAdd?: () => void }) {
  return (
    <div
      style={{
        height: "460px",
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

// ── 共通 ──
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
