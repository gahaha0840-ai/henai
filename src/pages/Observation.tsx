import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useItems } from "../hooks/useItems.ts";
import { PhotoMaterial, SavedBoard } from "../types/index.ts";

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
  card: "#FCFAEF",
};
const PIN_COLORS = [
  "#c0392b",
  "#e67e22",
  "#27ae60",
  "#2980b9",
  "#8e44ad",
  "#16a085",
];
const ROTS = [-8, -5, -3, 2, 4, 7, -6, 3, -2, 6];

type FeedItem =
  | { kind: "photo"; data: PhotoMaterial; id: string }
  | { kind: "board"; data: SavedBoard; id: string };

// シード付き乱数
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// Fisher-Yates シャッフル（シード付き）
function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  const r = seededRand(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Observation() {
  const navigate = useNavigate();
  const { photos, loading, error } = useItems();
  const [boards, setBoards] = useState<SavedBoard[]>([]);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 99999));
  const [selTag, setSelTag] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "photo" | "board">("all");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("savedBoards");
      if (raw) setBoards(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  // 全タグ（フォト）
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

  // フィードアイテム生成
  const feed = useMemo((): FeedItem[] => {
    let photoItems: FeedItem[] = photos
      .filter(
        (p) =>
          !selTag ||
          (p.aiTags ?? p.tags ?? [])
            .map((t) => t.replace(/^#/, ""))
            .includes(selTag),
      )
      .map((p) => ({ kind: "photo" as const, data: p, id: `p-${p.id}` }));

    let boardItems: FeedItem[] = boards
      .filter((b) => !selTag || b.condition.tags.includes(selTag))
      .map((b) => ({ kind: "board" as const, data: b, id: `b-${b.id}` }));

    let merged: FeedItem[] =
      filter === "photo"
        ? photoItems
        : filter === "board"
          ? boardItems
          : [...photoItems, ...boardItems];

    return shuffle(merged, seed);
  }, [photos, boards, seed, selTag, filter]);

  const reshuffle = useCallback(
    () => setSeed(Math.floor(Math.random() * 99999)),
    [],
  );

  return (
    <>
      {/* ヘッダー */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
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
              🔭 観測
            </h1>
            <p style={{ fontSize: 12, color: C.sub }}>
              写真と図鑑がランダムに流れてきます。シャッフルで新しい出会いを。
            </p>
          </div>
          <button
            onClick={reshuffle}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: C.bg,
              color: C.sub,
              fontSize: 12,
              cursor: "pointer",
              fontFamily: F.sans,
              transition: "all .15s",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 14 }}>🔀</span> シャッフル
          </button>
        </div>

        {/* フィルター行 */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* 種別フィルター */}
          <div
            style={{
              display: "flex",
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              overflow: "hidden",
              background: C.card,
              flexShrink: 0,
            }}
          >
            {(["all", "photo", "board"] as const).map((v, i) => {
              const labels = {
                all: "すべて",
                photo: "📷 フォト",
                board: "📌 図鑑",
              };
              return (
                <button
                  key={v}
                  onClick={() => setFilter(v)}
                  style={{
                    padding: "5px 14px",
                    border: "none",
                    borderRight: i < 2 ? `1px solid ${C.border}` : "none",
                    background: filter === v ? C.accent : C.card,
                    color: filter === v ? "#fff" : C.sub,
                    fontSize: 11,
                    cursor: "pointer",
                    fontFamily: F.sans,
                    transition: "all .15s",
                  }}
                >
                  {labels[v]}
                </button>
              );
            })}
          </div>

          {/* タグフィルター（横スクロール） */}
          <div
            style={{
              display: "flex",
              gap: 6,
              overflowX: "auto",
              paddingBottom: 2,
              flex: 1,
              minWidth: 0,
            }}
          >
            <TagChip
              label="すべて"
              active={selTag === null}
              onClick={() => setSelTag(null)}
            />
            {allTags.map((t) => (
              <TagChip
                key={t}
                label={`#${t}`}
                active={selTag === t}
                onClick={() => setSelTag(selTag === t ? null : t)}
              />
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: 16,
            background: "#FEE2E2",
            color: "#991B1B",
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

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
          観測中...
        </div>
      ) : feed.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: C.sub }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔭</div>
          <div style={{ fontSize: 13, fontStyle: "italic" }}>
            条件に合う記録がありません
          </div>
        </div>
      ) : (
        /* Masonry風グリッド */
        <div
          style={{
            columns: "repeat(auto-fill,minmax(240px,1fr))",
            columnGap: 16,
            gap: 16,
          }}
        >
          {feed.map((item, i) => (
            <div
              key={item.id}
              style={{ breakInside: "avoid", marginBottom: 16 }}
            >
              {item.kind === "photo" ? (
                <PhotoFeedCard photo={item.data} rot={ROTS[i % ROTS.length]} />
              ) : (
                <BoardFeedCard
                  board={item.data}
                  onClick={() => navigate("/zukan")}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ── フォトカード ──
function PhotoFeedCard({ photo, rot }: { photo: PhotoMaterial; rot: number }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.card,
        borderRadius: 12,
        overflow: "hidden",
        border: `1px solid ${C.border}`,
        boxShadow: hov
          ? "0 8px 24px rgba(0,0,0,.1)"
          : "0 2px 6px rgba(0,0,0,.06)",
        transform: hov
          ? "rotate(0deg) translateY(-3px)"
          : `rotate(${rot * 0.4}deg)`,
        transition: "transform .2s ease, box-shadow .2s ease",
        cursor: "default",
      }}
    >
      {(photo.img ?? photo.imageUrl) && (
        <div
          style={{
            width: "100%",
            height: 160,
            overflow: "hidden",
            background: photo.bg ?? "#E6E0D4",
          }}
        >
          <img
            src={photo.img ?? photo.imageUrl}
            alt={photo.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}
      <div style={{ padding: "12px 14px 14px" }}>
        <div
          style={{
            fontSize: 9,
            color: C.sub,
            fontFamily: F.mono,
            marginBottom: 5,
          }}
        >
          📷 フォト {photo.date && `· ${photo.date}`}
        </div>
        <div
          style={{
            fontWeight: "bold",
            fontSize: 13,
            color: C.text,
            fontFamily: F.serif,
            marginBottom: 4,
          }}
        >
          {photo.title}
        </div>
        {photo.memo && (
          <div
            style={{
              fontSize: 11,
              color: C.sub,
              lineHeight: 1.6,
              marginBottom: 8,
            }}
          >
            {photo.memo}
          </div>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {(photo.tags ?? []).slice(0, 3).map((t) => (
            <span
              key={t}
              style={{
                fontSize: 9,
                padding: "2px 8px",
                borderRadius: 9999,
                border: `1px solid ${C.border}`,
                color: C.sub,
              }}
            >
              #{t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 図鑑カード ──
const MINI_ROTS = [-7, -3, 1, 5, -4, 8];
const MINI_POS = [
  { left: "6%", top: "8%" },
  { left: "28%", top: "4%" },
  { left: "52%", top: "14%" },
  { left: "72%", top: "5%" },
  { left: "16%", top: "50%" },
  { left: "58%", top: "46%" },
];

function BoardFeedCard({
  board,
  onClick,
}: {
  board: SavedBoard;
  onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  const date = new Date(board.createdAt)
    .toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, ".");
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.card,
        borderRadius: 12,
        overflow: "hidden",
        border: `1px solid ${C.border}`,
        cursor: "pointer",
        boxShadow: hov
          ? "0 8px 24px rgba(0,0,0,.1)"
          : "0 2px 6px rgba(0,0,0,.06)",
        transform: hov ? "translateY(-3px)" : "none",
        transition: "transform .2s ease, box-shadow .2s ease",
      }}
    >
      {/* ミニコルクボード */}
      <div
        style={{
          width: "100%",
          height: 130,
          background: board.condition.corkColor,
          backgroundImage: [
            "repeating-linear-gradient(45deg,transparent,transparent 8px,rgba(0,0,0,.025) 8px,rgba(0,0,0,.025) 9px)",
            "repeating-linear-gradient(-45deg,transparent,transparent 8px,rgba(0,0,0,.018) 8px,rgba(0,0,0,.018) 9px)",
          ].join(","),
          position: "relative",
          overflow: "hidden",
        }}
      >
        {MINI_POS.slice(0, Math.min(board.condition.maxCount, 6)).map(
          (pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: pos.left,
                top: pos.top,
                transform: `rotate(${MINI_ROTS[i]}deg)`,
                filter: "drop-shadow(1px 2px 4px rgba(0,0,0,.3))",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: PIN_COLORS[i % PIN_COLORS.length],
                  margin: "0 auto -3px",
                  position: "relative",
                  zIndex: 2,
                }}
              />
              <div
                style={{ width: 44, background: "#FFFDF5", borderRadius: 1 }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 34,
                    background: `hsl(${30 + i * 28},18%,74%)`,
                  }}
                />
                <div style={{ height: 8 }} />
              </div>
            </div>
          ),
        )}
        <div
          style={{
            position: "absolute",
            bottom: 6,
            right: 8,
            fontSize: 9,
            color: "rgba(255,255,255,.7)",
            background: "rgba(0,0,0,.3)",
            padding: "1px 7px",
            borderRadius: 9999,
            fontFamily: F.mono,
          }}
        >
          {board.condition.maxCount}枚
        </div>
      </div>

      <div style={{ padding: "12px 14px 14px" }}>
        <div
          style={{
            fontSize: 9,
            color: C.sub,
            fontFamily: F.mono,
            marginBottom: 5,
          }}
        >
          📌 図鑑 · {date}
        </div>
        <div
          style={{
            fontWeight: "bold",
            fontSize: 14,
            color: C.text,
            fontFamily: F.serif,
            marginBottom: 4,
          }}
        >
          {board.title}
        </div>
        {board.comment && (
          <div
            style={{
              fontSize: 11,
              color: C.sub,
              lineHeight: 1.6,
              marginBottom: 8,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {board.comment}
          </div>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {board.condition.tags.map((t) => (
            <span
              key={t}
              style={{
                fontSize: 9,
                padding: "2px 8px",
                borderRadius: 9999,
                background: "rgba(166,138,97,.1)",
                color: C.accent,
                border: "1px solid rgba(166,138,97,.25)",
              }}
            >
              #{t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── タグチップ ──
function TagChip({
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
        flexShrink: 0,
        fontSize: 11,
        padding: "4px 13px",
        borderRadius: 9999,
        border: `1px solid ${active ? C.accent : C.border}`,
        background: active ? C.accent : C.bg,
        color: active ? "#fff" : C.sub,
        cursor: "pointer",
        fontFamily: F.sans,
        transition: "all .15s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}
