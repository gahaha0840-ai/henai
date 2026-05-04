import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import TagFilter from "../components/TagFilter.tsx";
import { PhotoMaterial, BoardCondition, SavedBoard } from "../types/index.ts";

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
const PIN_COLORS = [
  "#c0392b",
  "#e67e22",
  "#27ae60",
  "#2980b9",
  "#8e44ad",
  "#16a085",
];
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

interface BoardItem extends PhotoMaterial {
  w: number;
  h: number;
  rot: number;
  baseX: number;
  baseY: number;
  pinColor: string;
}
const defaultCond: BoardCondition = {
  tags: [],
  dateFrom: "",
  dateTo: "",
  maxCount: 20,
  sizeIdx: 1,
  corkColor: CORK_COLORS[0].value,
};

// 条件をkeyに変換（オフセットリセット判定用）
const condKey = (c: BoardCondition) =>
  `${c.tags.join(",")}_${c.maxCount}_${c.sizeIdx}`;

export default function Photos() {
  const [photos, setPhotos] = useState<PhotoMaterial[]>([]);
  const [cond, setCond] = useState<BoardCondition>(() => {
    try {
      return JSON.parse(
        sessionStorage.getItem("photosCond") ?? "",
      ) as BoardCondition;
    } catch {
      return defaultCond;
    }
  });
  const [offsets, setOffsets] = useState<
    Record<string | number, { dx: number; dy: number }>
  >(() => {
    try {
      return JSON.parse(sessionStorage.getItem("photosOffsets") ?? "{}");
    } catch {
      return {};
    }
  });
  const prevCondKey = useRef(condKey(cond));
  const [panelOpen, setPanelOpen] = useState(true);
  const [saveModal, setSaveModal] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch("/data.json")
      .then((r) => r.json())
      .then((d) => setPhotos(d.photos ?? d));
  }, []);

  // 条件・オフセットをsessionStorageに永続化
  useEffect(() => {
    sessionStorage.setItem("photosCond", JSON.stringify(cond));
  }, [cond]);
  useEffect(() => {
    sessionStorage.setItem("photosOffsets", JSON.stringify(offsets));
  }, [offsets]);

  const set = <K extends keyof BoardCondition>(k: K, v: BoardCondition[K]) => {
    setCond((c) => {
      const next = { ...c, [k]: v };
      // 条件が変わったらオフセットをリセット
      if (condKey(next) !== prevCondKey.current) {
        prevCondKey.current = condKey(next);
        setOffsets({});
        sessionStorage.removeItem("photosOffsets");
      }
      return next;
    });
  };

  const allTags = useMemo(
    () => [
      ...new Set(
        photos.flatMap((p) =>
          (p.aiTags ?? p.tags ?? []).map((t) => t.replace(/^#/, "")),
        ),
      ),
    ],
    [photos],
  );

  const filtered = useMemo((): PhotoMaterial[] => {
    let r = [...photos];
    if (cond.tags.length > 0)
      r = r.filter((p) =>
        cond.tags.every((t) =>
          (p.aiTags ?? p.tags ?? [])
            .map((s) => s.replace(/^#/, ""))
            .includes(t),
        ),
      );
    return r.slice(0, cond.maxCount);
  }, [photos, cond.tags, cond.maxCount]);

  const size = SIZES[cond.sizeIdx];
  const mixed = cond.sizeIdx === 3;

  const board = useMemo((): BoardItem[] => {
    const rand = seededRand(42);
    const cols = Math.max(2, Math.floor(1060 / ((size.w || 160) + 24)));
    return filtered.map((item, i) => {
      const r = mixed ? seededRand(Number(item.id)) : rand;
      const w = mixed ? [120, 140, 160, 190, 210][Math.floor(r() * 5)] : size.w;
      const h = mixed ? Math.round(w * (0.75 + r() * 0.3)) : size.h;
      const col = i % cols,
        row = Math.floor(i / cols);
      return {
        ...item,
        w,
        h,
        rot: (r() - 0.5) * 8,
        baseX: col * ((size.w || 160) + 28) + (r() - 0.5) * 18,
        baseY: row * ((size.h || 135) + 28) + (r() - 0.5) * 18,
        pinColor: PIN_COLORS[i % PIN_COLORS.length],
      };
    });
  }, [filtered, size.w, size.h, mixed]);

  const boardW = Math.max(
    860,
    ...board.map((b) => b.baseX + (offsets[b.id]?.dx ?? 0) + b.w + 80),
  );
  const boardH = Math.max(
    460,
    ...board.map((b) => b.baseY + (offsets[b.id]?.dy ?? 0) + b.h + 80),
  );

  const lightbox = lightboxIdx !== null ? filtered[lightboxIdx] : null;
  const goPrev = useCallback(
    () => setLightboxIdx((i) => (i !== null && i > 0 ? i - 1 : i)),
    [],
  );
  const goNext = useCallback(
    () =>
      setLightboxIdx((i) =>
        i !== null && i < filtered.length - 1 ? i + 1 : i,
      ),
    [filtered.length],
  );
  useEffect(() => {
    if (lightboxIdx === null) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") setLightboxIdx(null);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [lightboxIdx, goPrev, goNext]);

  return (
    <>
      {/* ヘッダー */}
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
            🖼️ Myフォト
          </h1>
          <p style={{ fontSize: 12, color: C.sub }}>
            条件を設定してコルクボードを作り、図鑑として保存できます。
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
            onClick={() => setSaveModal(true)}
            style={{
              padding: "7px 16px",
              borderRadius: 8,
              border: `1px solid ${C.accent}`,
              background: C.accent,
              color: "#fff",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: F.sans,
              fontWeight: "bold",
            }}
          >
            📖 図鑑として保存
          </button>
        </div>
      </div>

      {/* 条件パネル — 横並び1行 */}
      {panelOpen && (
        <div
          style={{
            background: "#FCFAEF",
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "14px 20px",
            marginBottom: 18,
          }}
        >
          {/* 1行目：タグ */}
          <div style={{ marginBottom: 12 }}>
            <PLabel>タグで絞る</PLabel>
            <TagFilter
              tags={allTags}
              selected={cond.tags.length === 1 ? cond.tags[0] : null}
              onChange={(t) =>
                setCond((c) => {
                  const next = { ...c, tags: t ? [t] : [] };
                  if (condKey(next) !== prevCondKey.current) {
                    prevCondKey.current = condKey(next);
                    setOffsets({});
                  }
                  return next;
                })
              }
              mode="row"
            />
          </div>
          {/* 2行目：各条件を横並び */}
          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <div>
              <PLabel>枚数：{cond.maxCount}枚</PLabel>
              <input
                type="range"
                min={2}
                max={50}
                value={cond.maxCount}
                onChange={(e) => set("maxCount", Number(e.target.value))}
                style={{ width: 120, accentColor: C.accent }}
              />
            </div>
            <div>
              <PLabel>カードサイズ</PLabel>
              <div style={{ display: "flex", gap: 5 }}>
                {SIZES.map((s, i) => (
                  <SmChip
                    key={s.label}
                    label={s.label}
                    active={cond.sizeIdx === i}
                    onClick={() => set("sizeIdx", i)}
                  />
                ))}
              </div>
            </div>
            <div>
              <PLabel>コルクの色</PLabel>
              <div style={{ display: "flex", gap: 7, marginTop: 4 }}>
                {CORK_COLORS.map((cc) => (
                  <button
                    key={cc.value}
                    title={cc.label}
                    onClick={() => set("corkColor", cc.value)}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: cc.value,
                      cursor: "pointer",
                      border: `3px solid ${cond.corkColor === cc.value ? C.text : "transparent"}`,
                      transition: "border .15s",
                    }}
                  />
                ))}
              </div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <PLabel>マッチ</PLabel>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: C.accent,
                  fontFamily: F.serif,
                }}
              >
                {filtered.length}
              </span>
              <span style={{ fontSize: 11, color: C.sub, marginLeft: 4 }}>
                枚
              </span>
            </div>
          </div>
        </div>
      )}

      {/* コルクボード */}
      <div
        style={{
          overflowX: "auto",
          overflowY: "auto",
          borderRadius: 12,
          maxHeight: "65vh",
          boxShadow: "0 4px 24px rgba(0,0,0,.15)",
        }}
      >
        <div
          style={{
            width: boardW,
            height: boardH,
            background: cond.corkColor,
            position: "relative",
            backgroundImage: [
              "repeating-linear-gradient(45deg,transparent,transparent 12px,rgba(0,0,0,.025) 12px,rgba(0,0,0,.025) 13px)",
              "repeating-linear-gradient(-45deg,transparent,transparent 12px,rgba(0,0,0,.018) 12px,rgba(0,0,0,.018) 13px)",
            ].join(","),
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
          {board.map((item, i) => (
            <DraggablePin
              key={item.id}
              item={item}
              offset={offsets[item.id] ?? { dx: 0, dy: 0 }}
              onOffsetChange={(o) =>
                setOffsets((prev) => ({ ...prev, [item.id]: o }))
              }
              onClick={() => setLightboxIdx(i)}
            />
          ))}
        </div>
      </div>
      <div
        style={{
          textAlign: "right",
          fontSize: 10,
          color: C.sub,
          marginTop: 6,
          fontFamily: F.mono,
        }}
      >
        長押しドラッグでカードを移動　条件変更で位置リセット
      </div>

      {saveModal && (
        <SaveModal
          cond={cond}
          offsets={offsets}
          onClose={() => setSaveModal(false)}
        />
      )}

      {/* ライトボックス */}
      {lightbox && lightboxIdx !== null && (
        <div
          onClick={() => setLightboxIdx(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,.78)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <ArrowBtn
            dir="left"
            disabled={lightboxIdx === 0}
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#FFFDF5",
              borderRadius: 4,
              padding: "16px 16px 20px",
              maxWidth: 440,
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,.4)",
              cursor: "default",
            }}
          >
            <div
              style={{
                width: "100%",
                maxHeight: 300,
                overflow: "hidden",
                background: lightbox.bg ?? "#E6E0D4",
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {(lightbox.img ?? lightbox.imageUrl) ? (
                <img
                  src={lightbox.img ?? lightbox.imageUrl}
                  alt={lightbox.title}
                  style={{ width: "100%", maxHeight: 300, objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: 72 }}>{lightbox.emoji}</span>
              )}
            </div>
            <div
              style={{
                fontFamily: F.serif,
                fontSize: 15,
                fontWeight: "bold",
                color: C.text,
                marginBottom: 6,
              }}
            >
              {lightbox.title}
            </div>
            {lightbox.memo && (
              <div
                style={{
                  fontSize: 12,
                  color: C.sub,
                  lineHeight: 1.6,
                  marginBottom: 10,
                }}
              >
                {lightbox.memo}
              </div>
            )}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 5,
                marginBottom: 10,
              }}
            >
              {(lightbox.tags ?? []).map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 10,
                    padding: "2px 9px",
                    borderRadius: 9999,
                    border: `1px solid ${C.border}`,
                    color: C.sub,
                  }}
                >
                  #{t}
                </span>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 10,
                color: C.sub,
              }}
            >
              {lightbox.loc && <span>📍 {lightbox.loc}</span>}
              {lightbox.date && (
                <span style={{ fontFamily: F.mono }}>{lightbox.date}</span>
              )}
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: 11,
                color: C.sub,
                marginTop: 14,
              }}
            >
              {lightboxIdx + 1} / {filtered.length}
            </div>
          </div>
          <ArrowBtn
            dir="right"
            disabled={lightboxIdx === filtered.length - 1}
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
          />
        </div>
      )}
    </>
  );
}

// ── ドラッグ可能ピンカード ──
function DraggablePin({
  item,
  offset,
  onOffsetChange,
  onClick,
}: {
  item: BoardItem;
  offset: { dx: number; dy: number };
  onOffsetChange: (o: { dx: number; dy: number }) => void;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const didDrag = useRef(false); // ドラッグしたかどうか
  const longTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<{
    mx: number;
    my: number;
    dx: number;
    dy: number;
  } | null>(null);

  // 長押し判定（300ms）
  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    didDrag.current = false;
    startRef.current = {
      mx: e.clientX,
      my: e.clientY,
      dx: offset.dx,
      dy: offset.dy,
    };
    longTimer.current = setTimeout(() => setDragging(true), 300);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!startRef.current) return;
    const moved = Math.hypot(
      e.clientX - startRef.current.mx,
      e.clientY - startRef.current.my,
    );
    if (moved > 4 && longTimer.current) {
      clearTimeout(longTimer.current);
      longTimer.current = null;
    }
    if (!dragging) return;
    didDrag.current = true;
    onOffsetChange({
      dx: startRef.current.dx + e.clientX - startRef.current.mx,
      dy: startRef.current.dy + e.clientY - startRef.current.my,
    });
  };

  const onPointerUp = () => {
    if (longTimer.current) {
      clearTimeout(longTimer.current);
      longTimer.current = null;
    }
    if (!didDrag.current && !dragging) {
      // 長押しなしで離した → クリック扱い
      onClick();
    }
    setDragging(false);
    startRef.current = null;
  };

  const x = item.baseX + offset.dx + 40;
  const y = item.baseY + offset.dy + 40;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: item.w,
        transform: dragging
          ? `rotate(${item.rot * 0.3}deg) scale(1.06)`
          : hovered
            ? "rotate(0deg) translateY(-5px) scale(1.04)"
            : `rotate(${item.rot}deg)`,
        filter: `drop-shadow(${dragging ? "5px 14px 22px rgba(0,0,0,.5)" : "2px 5px 10px rgba(0,0,0,.28)"})`,
        transition: dragging ? "none" : "transform .2s, filter .2s",
        cursor: dragging ? "grabbing" : hovered ? "grab" : "default",
        zIndex: dragging ? 50 : hovered ? 10 : 1,
        userSelect: "none",
        touchAction: "none",
      }}
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
            background: item.bg ?? "#E6E0D4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {(item.img ?? item.imageUrl) ? (
            <img
              src={item.img ?? item.imageUrl}
              alt={item.title}
              draggable={false}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: Math.round(item.w * 0.22) }}>
              {item.emoji ?? "📷"}
            </span>
          )}
        </div>
        <div style={{ padding: "6px 8px 9px" }}>
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
          {item.memo && item.w >= 150 && (
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
              {item.memo}
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
            {item.date ?? ""}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 保存モーダル ──
function SaveModal({
  cond,
  offsets,
  onClose,
}: {
  cond: BoardCondition;
  offsets: Record<string | number, { dx: number; dy: number }>;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [done, setDone] = useState(false);
  const save = () => {
    if (!title.trim()) return;
    const board: SavedBoard = {
      id: crypto.randomUUID(),
      title: title.trim(),
      condition: cond,
      offsets,
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(
      localStorage.getItem("savedBoards") ?? "[]",
    ) as SavedBoard[];
    localStorage.setItem("savedBoards", JSON.stringify([board, ...existing]));
    setDone(true);
    setTimeout(onClose, 1200);
  };
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.bg,
          borderRadius: 14,
          padding: "28px 28px 24px",
          width: 360,
          boxShadow: "0 16px 48px rgba(0,0,0,.3)",
        }}
      >
        {done ? (
          <div
            style={{
              textAlign: "center",
              padding: "20px 0",
              fontFamily: F.serif,
              fontSize: 18,
              color: C.accent,
            }}
          >
            ✓ 図鑑に保存しました
          </div>
        ) : (
          <>
            <div
              style={{
                fontFamily: F.serif,
                fontSize: 18,
                fontWeight: "bold",
                color: C.text,
                marginBottom: 6,
              }}
            >
              図鑑として保存
            </div>
            <div
              style={{
                fontSize: 11,
                color: C.sub,
                marginBottom: 20,
                lineHeight: 1.6,
              }}
            >
              現在の条件と配置を図鑑として保存します。
              <br />
              図鑑画面から同じ条件で再検索できます。
            </div>
            <label
              style={{
                fontSize: 11,
                color: C.sub,
                display: "block",
                marginBottom: 6,
              }}
            >
              タイトル
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例：錆と光の記録"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && save()}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 14px",
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                background: "#fff",
                fontSize: 14,
                fontFamily: F.sans,
                color: C.text,
                outline: "none",
                marginBottom: 20,
              }}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 8,
                  border: `1px solid ${C.border}`,
                  background: "transparent",
                  color: C.sub,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: F.sans,
                }}
              >
                キャンセル
              </button>
              <button
                onClick={save}
                disabled={!title.trim()}
                style={{
                  flex: 2,
                  padding: "10px",
                  borderRadius: 8,
                  border: "none",
                  background: title.trim() ? C.accent : C.border,
                  color: title.trim() ? "#fff" : C.sub,
                  fontSize: 13,
                  fontWeight: "bold",
                  cursor: title.trim() ? "pointer" : "default",
                  fontFamily: F.sans,
                  transition: "all .15s",
                }}
              >
                保存する
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── 共通 ──
function ArrowBtn({
  dir,
  disabled,
  onClick,
}: {
  dir: "left" | "right";
  disabled: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        position: "fixed",
        top: "50%",
        transform: "translateY(-50%)",
        [dir === "left" ? "left" : "right"]: 24,
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: disabled ? "rgba(255,255,255,.1)" : "rgba(255,255,255,.85)",
        border: "none",
        fontSize: 20,
        cursor: disabled ? "default" : "pointer",
        color: disabled ? "rgba(0,0,0,.2)" : "#3D3328",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all .15s",
        zIndex: 101,
      }}
    >
      {dir === "left" ? "‹" : "›"}
    </button>
  );
}
function PLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        color: C.sub,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: 5,
        fontWeight: "bold",
        fontFamily: F.sans,
      }}
    >
      {children}
    </div>
  );
}
function SmChip({
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
