import { useRef, useState, useCallback } from "react";

const F = {
  serif: '"Noto Serif JP","Hiragino Mincho ProN",serif',
  sans: '"Noto Sans JP","Hiragino Kaku Gothic ProN",sans-serif',
};
const C = {
  text: "#3D3328",
  sub: "#A39B8B",
  accent: "#A68A61",
  border: "#E6E0D4",
  bg: "#F8F6F0",
};

export default function Record() {
  const [img, setImg] = useState<string | null>(null);
  const [word, setWord] = useState("");
  const [drag, setDrag] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = (f?: File) => {
    if (!f?.type.startsWith("image/")) return;
    setImg(URL.createObjectURL(f));
    setDone(false);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    load(e.dataTransfer.files[0]);
  }, []);

  const reset = () => {
    setImg(null);
    setWord("");
    setDone(false);
  };

  const post = () => {
    if (!img) return;
    // TODO: API送信
    setDone(true);
    setTimeout(reset, 1400);
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", paddingTop: 8 }}>
      {/* 写真エリア */}
      <div
        onClick={() => !img && fileRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        style={{
          width: "100%",
          aspectRatio: "4/3",
          borderRadius: 12,
          overflow: "hidden",
          border: img ? "none" : `2px dashed ${drag ? C.accent : C.border}`,
          background: drag
            ? "rgba(166,138,97,.06)"
            : img
              ? "transparent"
              : C.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: img ? "default" : "pointer",
          position: "relative",
          transition: "all .15s",
        }}
      >
        {img ? (
          <>
            <img
              src={img}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* 写真を変える */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileRef.current?.click();
              }}
              style={{
                position: "absolute",
                bottom: 12,
                right: 12,
                padding: "5px 12px",
                borderRadius: 6,
                background: "rgba(0,0,0,.45)",
                border: "none",
                color: "#fff",
                fontSize: 11,
                cursor: "pointer",
                fontFamily: F.sans,
              }}
            >
              写真を変える
            </button>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              opacity: 0.5,
            }}
          >
            <span style={{ fontSize: 40 }}>📷</span>
            <span style={{ fontSize: 13, color: C.sub, fontFamily: F.sans }}>
              写真を追加
            </span>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => load(e.target.files?.[0])}
      />

      {/* ひとこと */}
      <textarea
        value={word}
        onChange={(e) => setWord(e.target.value.slice(0, 60))}
        placeholder="ひとこと（任意）"
        rows={2}
        style={{
          width: "100%",
          marginTop: 12,
          boxSizing: "border-box",
          padding: "12px 14px",
          borderRadius: 10,
          border: `1px solid ${C.border}`,
          background: C.bg,
          fontSize: 14,
          fontFamily: F.serif,
          color: C.text,
          lineHeight: 1.7,
          resize: "none",
          outline: "none",
        }}
      />
      {word.length > 0 && (
        <div
          style={{
            textAlign: "right",
            fontSize: 10,
            color: C.sub,
            marginTop: 3,
            fontFamily: F.sans,
          }}
        >
          {word.length} / 60
        </div>
      )}

      {/* 投稿ボタン */}
      <button
        onClick={post}
        disabled={!img || done}
        style={{
          width: "100%",
          marginTop: 16,
          padding: "14px",
          borderRadius: 10,
          border: "none",
          background: done ? "#7aaa7a" : img ? C.accent : C.border,
          color: img ? "#fff" : C.sub,
          fontSize: 15,
          fontFamily: F.sans,
          fontWeight: "bold",
          cursor: img ? "pointer" : "default",
          transition: "all .2s",
          letterSpacing: "0.05em",
        }}
      >
        {done ? "✓ 記録した" : "記録する"}
      </button>
    </div>
  );
}
