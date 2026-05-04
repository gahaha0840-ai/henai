import { useState, useMemo } from "react";
import { useItems } from "../hooks/useItems.ts";
import TagFilter from "../components/TagFilter.tsx";

const F = {
  serif: '"Noto Serif JP","Hiragino Mincho ProN",serif',
  sans: '"Noto Sans JP","Hiragino Kaku Gothic ProN",sans-serif',
  mono: '"SF Mono","Courier New",monospace',
};
const C = {
  text: "#3D3328",
  sub: "#A39B8B",
  accent: "#A68A61",
  border: "#E6E0D4",
  bg: "#F8F6F0",
};

const CORK_BG = "#B8864E";
const PIN_COLORS = [
  "#c0392b",
  "#e67e22",
  "#27ae60",
  "#2980b9",
  "#8e44ad",
  "#16a085",
];
const ROTATIONS = [-3.5, -2, -1, 1.5, 2.5, -2.5, 3, -1.5, 0.5, -3, 2, -1.8];

const SIZES = [
  { label: "小", w: 120, h: 100 },
  { label: "中", w: 160, h: 135 },
  { label: "大", w: 210, h: 175 },
  { label: "混在", w: 0, h: 0 },
];

const CORK_COLORS = [
  { label: "ナチュラル", value: "#B8864E" },
  { label: "ダーク", value: "#7A5230" },
  { label: "ライト", value: "#D4AA78" },
  { label: "グリーン", value: "#6B7C5A" },
];

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function Zukan() {
  const { collections, loading, error } = useItems();
  const [selTag, setSelTag] = useState<string | null>(null);
  const [sizeIdx, setSizeIdx] = useState(1);
  const [corkColor, setCorkColor] = useState(CORK_COLORS[0].value);
  const [maxCount, setMaxCount] = useState(20);
  const [panelOpen, setPanelOpen] = useState(true);
  const [saved, setSaved] = useState(false);

  // タグ一覧
  const allTags = useMemo(
    () => [
      ...new Set(
        collections.flatMap((c) =>
          (c.aiTags ?? []).map((t) => t.replace(/^#/, "")),
        ),
      ),
    ],
    [collections],
  );

  // フィルタリング
  const filtered = useMemo(() => {
    let r = selTag
      ? collections.filter((c) =>
          c.aiTags?.some((t) => t.replace(/^#/, "") === selTag),
        )
      : collections;
    return r.slice(0, maxCount);
  }, [collections, selTag, maxCount]);

  // レイアウト計算
  const size = SIZES[sizeIdx];
  const mixed = sizeIdx === 3;

  const board = useMemo(() => {
    const rand = seededRand(42);
    const cols = Math.max(2, Math.floor(1060 / ((size.w || 160) + 24)));
    return filtered.map((item, i) => {
      const r = mixed ? seededRand(Number(item.id)) : rand;
      const w = mixed ? [120, 140, 160, 190, 210][Math.floor(r() * 5)] : size.w;
      const h = mixed ? Math.round(w * (0.75 + r() * 0.3)) : size.h;
      const col = i % cols;
      const row = Math.floor(i / cols);
      return {
        ...item,
        w,
        h,
        rot: (r() - 0.5) * 8,
        x: col * ((size.w || 160) + 28) + (r() - 0.5) * 18,
        y: row * ((size.h || 135) + 28) + (r() - 0.5) * 18,
        pinColor: PIN_COLORS[i % PIN_COLORS.length],
      };
    });
  }, [filtered, size.w, size.h, mixed]);

  const boardW = Math.max(860, ...board.map((b) => b.x + b.w + 80));
  const boardH = Math.max(460, ...board.map((b) => b.y + b.h + 80));

  return (
    <>
      {/* ── ヘッダー ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: F.serif,
              fontSize: 24,
              fontWeight: "bold",
              color: C.text,
              letterSpacing: "0.05em",
              marginBottom: 4,
            }}
          >
            📌 図鑑
          </h1>
          <p style={{ fontSize: 12, color: C.sub, fontFamily: F.sans }}>
            条件を設定すると、記録が自動で貼られます。
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setPanelOpen((o) => !o)}
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: panelOpen ? C.accent : C.bg,
              color: panelOpen ? "#fff" : C.sub,
              fontSize: 12,
              cursor: "pointer",
              fontFamily: F.sans,
            }}
          >
            {panelOpen ? "▲ 条件を閉じる" : "▼ 条件を設定"}
          </button>
          <button
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }}
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              border: `1px solid ${C.accent}`,
              background: saved ? C.accent : "transparent",
              color: saved ? "#fff" : C.accent,
              fontSize: 12,
              cursor: "pointer",
              transition: "all .2s",
              fontFamily: F.sans,
            }}
          >
            {saved ? "保存済み ✓" : "保存する"}
          </button>
        </div>
      </div>

      {/* ── 条件パネル ── */}
      {panelOpen && (
        <div
          style={{
            background: "#FCFAEF",
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "18px 20px",
            marginBottom: 18,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
            gap: 18,
          }}
        >
          {/* タグ */}
          <div style={{ gridColumn: "1 / -1" }}>
            <Label>タグで絞る</Label>
            <TagFilter
              tags={allTags}
              selected={selTag}
              onChange={setSelTag}
              mode="row"
            />
          </div>

          {/* 枚数 */}
          <div>
            <Label>枚数：最大 {maxCount} 枚</Label>
            <input
              type="range"
              min={2}
              max={50}
              value={maxCount}
              onChange={(e) => setMaxCount(Number(e.target.value))}
              style={{ width: "100%", accentColor: C.accent }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 10,
                color: C.sub,
                marginTop: 2,
              }}
            >
              <span>2</span>
              <span>50</span>
            </div>
          </div>

          {/* カードサイズ */}
          <div>
            <Label>カードサイズ</Label>
            <div style={{ display: "flex", gap: 6 }}>
              {SIZES.map((s, i) => (
                <Chip
                  key={s.label}
                  label={s.label}
                  active={sizeIdx === i}
                  onClick={() => setSizeIdx(i)}
                />
              ))}
            </div>
          </div>

          {/* コルク色 */}
          <div>
            <Label>コルクの色</Label>
            <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
              {CORK_COLORS.map((cc) => (
                <button
                  key={cc.value}
                  onClick={() => setCorkColor(cc.value)}
                  title={cc.label}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: cc.value,
                    cursor: "pointer",
                    border: `3px solid ${corkColor === cc.value ? C.text : "transparent"}`,
                    transition: "border .15s",
                  }}
                />
              ))}
            </div>
          </div>

          {/* マッチ数 */}
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <div>
              <Label>マッチ</Label>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  color: C.accent,
                  fontFamily: F.serif,
                }}
              >
                {filtered.length}
              </span>
              <span style={{ fontSize: 12, color: C.sub, marginLeft: 4 }}>
                枚
              </span>
              {filtered.length === 0 && (
                <div style={{ fontSize: 11, color: "#c04030", marginTop: 2 }}>
                  条件を緩めてみてください
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── エラー ── */}
      {error && (
        <div
          style={{
            padding: 16,
            background: "#FEE2E2",
            color: "#991B1B",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {/* ── ローディング ── */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: C.sub,
            fontSize: 13,
            fontStyle: "italic",
          }}
        >
          図鑑を開いています...
        </div>
      ) : (
        <>
          {/* ── コルクボード ── */}
          <div
            style={{
              overflowX: "auto",
              overflowY: "auto",
              borderRadius: 12,
              maxHeight: "60vh",
              boxShadow: "0 4px 24px rgba(0,0,0,.15)",
            }}
          >
            <div
              style={{
                width: boardW,
                height: boardH,
                background: corkColor,
                backgroundImage: [
                  "repeating-linear-gradient(45deg,transparent,transparent 12px,rgba(0,0,0,.025) 12px,rgba(0,0,0,.025) 13px)",
                  "repeating-linear-gradient(-45deg,transparent,transparent 12px,rgba(0,0,0,.018) 12px,rgba(0,0,0,.018) 13px)",
                ].join(","),
                position: "relative",
                borderRadius: 12,
              }}
            >
              {filtered.length === 0 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,.4)",
                    fontSize: 14,
                  }}
                >
                  条件に合う記録がありません
                </div>
              )}
              {board.map((item) => (
                <div
                  key={item.id}
                  style={{
                    position: "absolute",
                    left: item.x + 40,
                    top: item.y + 40,
                    width: item.w,
                    transform: `rotate(${item.rot}deg)`,
                    filter: "drop-shadow(2px 5px 10px rgba(0,0,0,.28))",
                    transition: "transform .2s",
                    zIndex: 1,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform =
                      "rotate(0deg) translateY(-6px) scale(1.04)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = `rotate(${item.rot}deg)`)
                  }
                >
                  {/* ピン */}
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: item.pinColor,
                      border: "2px solid rgba(0,0,0,.2)",
                      margin: "0 auto -6px",
                      position: "relative",
                      zIndex: 2,
                      boxShadow: "0 2px 5px rgba(0,0,0,.4)",
                    }}
                  />
                  {/* ポラロイド */}
                  <div style={{ background: "#FFFDF5", borderRadius: 2 }}>
                    <div
                      style={{
                        width: "100%",
                        height: item.h,
                        overflow: "hidden",
                        background: (item as any).bg ?? "#E6E0D4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {(item as any).img ? (
                        <img
                          src={(item as any).img}
                          alt={item.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: Math.round(item.w * 0.22) }}>
                          {(item as any).emoji ?? "📷"}
                        </span>
                      )}
                    </div>
                    <div style={{ padding: "6px 8px 8px" }}>
                      <div
                        style={{
                          fontSize: Math.max(8, Math.round(item.w * 0.066)),
                          fontWeight: "bold",
                          color: "#3a2e22",
                          fontFamily: F.serif,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.title}
                      </div>
                      {(item as any).memo && item.w >= 150 && (
                        <div
                          style={{
                            fontSize: Math.max(7, Math.round(item.w * 0.055)),
                            color: "#8a7860",
                            marginTop: 2,
                            lineHeight: 1.4,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {(item as any).memo}
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: 8,
                          color: "#b8a890",
                          marginTop: 3,
                          fontFamily: F.mono,
                        }}
                      >
                        {(item as any).date ?? ""}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              textAlign: "right",
              fontSize: 10,
              color: C.sub,
              marginTop: 8,
              fontFamily: F.mono,
            }}
          >
            {filtered.length} 枚
          </div>
        </>
      )}
    </>
  );
}

// ── 共通 ──
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        color: C.sub,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: 6,
        fontWeight: "bold",
        fontFamily: F.sans,
      }}
    >
      {children}
    </div>
  );
}
function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 10,
        padding: "3px 10px",
        borderRadius: 9999,
        border: `1px solid ${active ? C.accent : C.border}`,
        background: active ? C.accent : C.bg,
        color: active ? "#fff" : C.sub,
        cursor: "pointer",
        fontFamily: F.sans,
        transition: "all .15s",
      }}
    >
      {label}
    </button>
  );
}

export default Zukan;
