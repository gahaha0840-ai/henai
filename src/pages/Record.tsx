import { useState, useRef } from "react";

const C = {
  bg: "#F8F6F0",
  text: "#3D3328",
  sub: "#A39B8B",
  accent: "#A68A61",
  border: "#E6E0D4",
  card: "#FCFAEF",
};

const F = {
  serif: '"Noto Serif JP","Hiragino Mincho ProN",serif',
  sans: '"Noto Sans JP","Hiragino Kaku Gothic ProN",sans-serif',
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// メインコンポーネント (フォト記録のみ)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function Record() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [saved, setSaved] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const load = (f?: File) => {
    if (!f?.type.startsWith("image/")) return;
    setUrl(URL.createObjectURL(f));
  };

  return (
    <div
      style={{
        fontFamily: F.sans,
        color: C.text,
        maxWidth: 900,
        margin: "0 auto",
        padding: "20px",
      }}
    >
      {/* ── ヘッダー ── */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: F.serif,
            fontSize: 26,
            fontWeight: "bold",
            letterSpacing: "0.05em",
            marginBottom: 8,
          }}
        >
          ✏️ 記録
        </h1>
        <p style={{ fontSize: 14, color: C.sub, letterSpacing: "0.02em" }}>
          こだわりを写真と言葉で記録しよう。
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: 32,
          alignItems: "start",
        }}
      >
        {/* ── 入力エリア ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <FormField label="タイトル">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タイトルを入力"
              style={iStyle}
            />
          </FormField>

          <FormField label="画像（1枚）">
            <div
              onClick={() => !url && ref.current?.click()}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                load(e.dataTransfer.files[0]);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              style={{
                height: 300,
                borderRadius: 12,
                overflow: "hidden",
                position: "relative",
                border: `1.5px dashed ${drag ? C.accent : C.border}`,
                background: drag ? "rgba(166,138,97,.06)" : C.card,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: url ? "default" : "pointer",
                transition: "all .15s",
              }}
            >
              {url ? (
                <>
                  <img
                    src={url}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    alt=""
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUrl(null);
                    }}
                    style={closeBtnStyle}
                  >
                    ×
                  </button>
                </>
              ) : (
                <Placeholder
                  icon="🖼️"
                  label="画像を追加（1枚）"
                  hint="クリックまたはドラッグ"
                />
              )}
            </div>
            <input
              ref={ref}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => load(e.target.files?.[0])}
            />
          </FormField>

          <FormField label="内容">
            <div style={{ position: "relative" }}>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="内容テキストを入力"
                rows={8}
                style={{ ...iStyle, resize: "vertical", lineHeight: 1.7 }}
              />
              <button
                onClick={() => {
                  setSaved(true);
                  setTimeout(() => setSaved(false), 2000);
                }}
                style={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  padding: "8px 24px",
                  borderRadius: 8,
                  border: `1px solid ${C.accent}`,
                  background: saved ? C.accent : "transparent",
                  color: saved ? "#fff" : C.accent,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all .2s",
                }}
              >
                {saved ? "保存済み ✓" : "保存する"}
              </button>
            </div>
          </FormField>
        </div>

        {/* ── プレビュー ── */}
        <div style={{ position: "sticky", top: 20 }}>
          <BadgeLabel>プレビュー</BadgeLabel>
          <div
            style={{
              borderRadius: 16,
              border: `1px solid ${C.border}`,
              background: C.card,
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                aspectRatio: "4/3",
                background: "#EAE6DB",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {url ? (
                <img
                  src={url}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  alt=""
                />
              ) : (
                <span style={{ fontSize: 32, opacity: 0.3 }}>🖼️</span>
              )}
            </div>
            <div style={{ padding: "16px 20px" }}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  fontFamily: F.serif,
                  color: title ? C.text : "#C4BEB3",
                  marginBottom: 8,
                }}
              >
                {title || "タイトル"}
              </div>
              {body && (
                <div
                  style={{
                    fontSize: 13,
                    color: C.sub,
                    lineHeight: 1.6,
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {body}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 共通小コンポーネント ──────────────
function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 12,
          color: C.sub,
          fontWeight: "bold",
          marginBottom: 8,
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function BadgeLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "inline-block",
        padding: "4px 16px",
        borderRadius: 8,
        border: `1px solid ${C.accent}`,
        color: C.accent,
        fontSize: 13,
        marginBottom: 12,
        fontWeight: "bold",
      }}
    >
      {children}
    </div>
  );
}

function Placeholder({
  icon,
  label,
  hint,
}: {
  icon: string;
  label: string;
  hint?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        opacity: 0.45,
      }}
    >
      <span style={{ fontSize: 36 }}>{icon}</span>
      <span style={{ fontSize: 13, color: C.sub, fontWeight: "bold" }}>
        {label}
      </span>
      {hint && <span style={{ fontSize: 11, color: C.sub }}>{hint}</span>}
    </div>
  );
}

// ── スタイル ────────────────────────
const iStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 10,
  border: `1px solid ${C.border}`,
  background: C.card,
  fontSize: 14,
  fontFamily: F.sans,
  color: C.text,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const closeBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: 12,
  right: 12,
  width: 32,
  height: 32,
  borderRadius: "50%",
  background: "rgba(0,0,0,0.5)",
  border: "none",
  color: "#fff",
  fontSize: 18,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
