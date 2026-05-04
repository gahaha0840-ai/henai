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
  const [saved, setSaved] = useState(false); // 保存状態の管理
  const ref = useRef<HTMLInputElement>(null);

  const load = (f?: File) => {
    if (!f?.type.startsWith("image/")) return;
    setUrl(URL.createObjectURL(f));
  };

  // 保存処理
  const handleSave = () => {
    // ここに保存ロジックを追加可能
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      style={{
        fontFamily: F.sans,
        color: C.text,
        maxWidth: 500,
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      {/* ── ヘッダー ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 32,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: F.serif,
              fontSize: 24,
              fontWeight: "bold",
              letterSpacing: "0.05em",
              marginBottom: 4,
            }}
          >
            ✏️ 記録
          </h1>
          <p style={{ fontSize: 12, color: C.sub, fontFamily: F.sans }}>
            こだわりを写真と言葉で記録しよう。
          </p>
        </div>

        {/* 保存ボタン (Zukanの仕様を適用) */}
        <button
          onClick={handleSave}
          style={{
            padding: "8px 18px",
            borderRadius: 8,
            border: `1px solid ${C.accent}`,
            background: saved ? C.accent : "transparent",
            color: saved ? "#fff" : C.accent,
            fontSize: 12,
            cursor: "pointer",
            transition: "all .2s",
            fontFamily: F.sans,
            fontWeight: "bold",
          }}
        >
          {saved ? "保存済み ✓" : "保存する"}
        </button>
      </div>

      {/* ── メインカード ── */}
      <div
        style={{
          background: C.card,
          borderRadius: 20,
          overflow: "hidden",
          border: `1px solid ${C.border}`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
        }}
      >
        {/* 画像エリア (上) */}
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
            aspectRatio: "4/3",
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
            <div style={{ textAlign: "center", opacity: 0.4 }}>
              <span style={{ fontSize: 40 }}>📷</span>
              <p style={{ fontSize: 11, marginTop: 8, fontWeight: "bold" }}>
                クリックで画像を追加
              </p>
            </div>
          )}
        </div>

        {/* タイトル入力エリア (下) */}
        <div style={{ padding: "20px 24px" }}>
          <label
            style={{
              fontSize: 10,
              color: C.sub,
              fontWeight: "bold",
              letterSpacing: "0.1em",
              display: "block",
              marginBottom: 8,
            }}
          >
            TITLE
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ひとこと"
            style={{
              width: "100%",
              border: "none",
              background: "transparent",
              fontSize: 18,
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
    </div>
  );
}

const closeBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: 12,
  right: 12,
  width: 28,
  height: 28,
  borderRadius: "50%",
  background: "rgba(0,0,0,0.4)",
  border: "none",
  color: "#fff",
  fontSize: 16,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backdropFilter: "blur(4px)",
};
