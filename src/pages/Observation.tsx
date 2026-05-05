import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useItems } from "../hooks/useItems.ts";
import { PhotoMaterial, SavedBoard } from "../types/index.ts";
import PhotoCard from "../components/PhotoCard.tsx";
import ZukanCard from "../components/ZukanCard.tsx";

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
                <PhotoCard item={item.data} />
              ) : (
                <ZukanCard
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
