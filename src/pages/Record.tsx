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

export default function Record() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
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
        maxWidth: 600,
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      {/* ── ヘッダー ── */}
      <div style={{ marginBottom: 40 }}>
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

      {/* ── メインカード (画像が上、タイトルが下) ── */}
      <div
        style={{
          background: C.card,
          borderRadius: 20,
          overflow: "hidden",
          border: `1px solid ${C.border}`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        {/* 上部：画像エリア */}
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
            height: 320,
            position: "relative",
            background: drag ? "rgba(166,138,97,.06)" : "#EAE6DB",
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
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
            <div style={{ textAlign: "center", opacity: 0.5 }}>
              <span style={{ fontSize: 40 }}>🖼️</span>
              <p style={{ fontSize: 12, marginTop: 8, color: C.sub }}>
                画像を追加
              </p>
            </div>
          )}
        </div>

        {/* 下部：タイトル入力 */}
        <div style={{ padding: "20px 24px" }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトル"
            style={{
              width: "100%",
              border: "none",
              background: "transparent",
              fontSize: 20,
              fontFamily: F.serif,
              color: title ? C.text : "#C4BEB3",
              outline: "none",
              padding: 0,
            }}
          />
        </div>
      </div>

      <input
        ref={ref}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => load(e.target.files?.[0])}
      />

      {/* 保存ボタンなどのアクション */}
      <div
        style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}
      >
        <button
          style={{
            padding: "10px 32px",
            borderRadius: 12,
            border: `1px solid ${C.accent}`,
            background: "transparent",
            color: C.accent,
            fontSize: 14,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          保存する
        </button>
      </div>
    </div>
  );
}

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
