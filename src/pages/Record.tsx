import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useItems } from "../hooks/useItems.ts";
import { PhotoMaterial } from "../types/index.ts";

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
  const { addPhoto } = useItems();
  const navigate = useNavigate();
  const [url, setUrl] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [saved, setSaved] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const load = (f?: File) => {
    if (!f?.type.startsWith("image/")) return;
    // localStorageに保存できるよう、Base64形式に変換して読み込む
    const reader = new FileReader();
    reader.onloadend = () => {
      setUrl(reader.result as string);
    };
    reader.readAsDataURL(f);
  };

  const handleSave = () => {
    if (!url) return;
    setSaved(true);
    
    // 今日の日付を取得 (YYYY/MM/DD)
    const today = new Date();
    const dateStr = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;

    const newPhoto: PhotoMaterial = {
      id: crypto.randomUUID(),
      userId: "u1",
      title: "",
      memo: "",
      tags: [],
      date: dateStr,
      imageUrl: url,
    };

    addPhoto(newPhoto);

    setTimeout(() => {
      setSaved(false);
      navigate("/photos");
    }, 1000);
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
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: F.serif,
            fontSize: 26,
            fontWeight: "bold",
            letterSpacing: "0.05em",
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <span>📷</span> 画像を記録
        </h1>
        <p style={{ fontSize: 14, color: C.sub, letterSpacing: "0.02em" }}>
          まずは画像だけを保存。言葉は後から図鑑で紡ぎましょう。
        </p>
      </div>

      {/* ── メインカード ── */}
      <div
        style={{
          background: C.card,
          borderRadius: 24,
          overflow: "hidden",
          border: `1px solid ${C.border}`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          marginBottom: 32,
        }}
      >
        {/* 画像エリア  */}
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
            <div style={{ textAlign: "center", opacity: 0.3 }}>
              <span style={{ fontSize: 48 }}>＋</span>
            </div>
          )}
        </div>
      </div>

      <input
        ref={ref}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => load(e.target.files?.[0])}
      />

      {/* ── 保存ボタン  ── */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={handleSave}
          disabled={!url || saved}
          style={{
            padding: "12px 48px",
            borderRadius: 12,
            border: `1px solid ${C.accent}`,
            background: saved ? C.accent : url ? C.bg : "transparent",
            color: saved ? "#fff" : url ? C.text : C.sub,
            fontSize: 14,
            cursor: url && !saved ? "pointer" : "default",
            transition: "all .2s",
            fontFamily: F.sans,
            fontWeight: "bold",
            letterSpacing: "0.1em",
            opacity: url ? 1 : 0.5,
          }}
        >
          {saved ? "保存済み ✓" : "記録する"}
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
  background: "rgba(0,0,0,0.4)",
  border: "none",
  color: "#fff",
  fontSize: 18,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backdropFilter: "blur(4px)",
};