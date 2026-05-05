import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useItems } from "../hooks/useItems.ts";
import { PhotoMaterial, SavedBoard } from "../types/index.ts";
import PhotoCard from "../components/PhotoCard.tsx";
import ZukanCard from "../components/ZukanCard.tsx";
import TagChip from "../components/TagChip.tsx";

// ── デザイン定義（元の「観測台帳」スタイルを継承） ──
const colors = {
  bg: "#F8F6F0",
  text: "#2A241E",
  subtext: "#5D544D",
  accent: "#8B5E3C",
  line: "rgba(139, 94, 60, 0.12)",
  cardBg: "#FFFDF5",
};

const fonts = {
  serif: '"Noto Serif JP", "Hiragino Mincho ProN", serif',
  sans: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif',
  mono: '"SF Mono", "Courier New", monospace',
};

type FeedItem =
  | { kind: "photo"; data: PhotoMaterial; id: string }
  | { kind: "board"; data: SavedBoard; id: string };

// ── ヘルパー関数（シード付き乱数・シャッフル） ──
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

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

  // ローカルストレージから図鑑データを取得
  useEffect(() => {
    try {
      const raw = localStorage.getItem("savedBoards");
      if (raw) setBoards(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  // 全タグの抽出（フォトと図鑑の両方から）
  const allTags = useMemo(() => {
    const pTags = photos.flatMap((p) =>
      [...(p.aiTags || []), ...(p.tags || [])].map((t) => t.replace(/^#/, "")),
    );
    const bTags = boards.flatMap((b) => b.condition.tags);
    return [...new Set([...pTags, ...bTags])];
  }, [photos, boards]);

  // フィードアイテムの生成とフィルタリング
  const feed = useMemo((): FeedItem[] => {
    let photoItems: FeedItem[] = photos
      .filter((p) => {
        if (!selTag) return true;
        const itemTags = [...(p.aiTags || []), ...(p.tags || [])].map((t) =>
          t.replace(/^#/, ""),
        );
        return itemTags.includes(selTag);
      })
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

  if (loading)
    return (
      <div
        style={{
          color: colors.subtext,
          padding: "40px",
          backgroundColor: colors.bg,
          minHeight: "100vh",
        }}
      >
        観測データを展開中...
      </div>
    );

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100%",
        backgroundColor: colors.bg,
        color: colors.text,
        backgroundImage: `linear-gradient(${colors.line} 1px, transparent 1px), linear-gradient(90deg, ${colors.line} 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
        margin: "-40px -60px",
        padding: "40px 60px",
      }}
    >
      {/* ── ヘッダー ── */}
      <header
        style={{
          marginBottom: "48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-block",
              borderLeft: `5px solid ${colors.accent}`,
              paddingLeft: "20px",
              marginBottom: "12px",
            }}
          >
            <h1
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                fontFamily: fonts.serif,
                margin: 0,
                letterSpacing: "0.15em",
              }}
            >
              🔭 観測台帳
            </h1>
          </div>
          <p
            style={{
              fontSize: "14px",
              color: colors.subtext,
              lineHeight: 1.8,
              maxWidth: "600px",
              fontFamily: fonts.sans,
            }}
          >
            誰かの日常に紛れ込んだ「好き」の断片を観測し、新しい関心の座標を見つける場所です。
          </p>
        </div>

        <button
          onClick={reshuffle}
          style={{
            padding: "10px 20px",
            borderRadius: "4px",
            border: `1px solid ${colors.accent}`,
            background: "transparent",
            color: colors.accent,
            fontSize: "12px",
            cursor: "pointer",
            fontFamily: fonts.sans,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(139, 94, 60, 0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <span>🔀</span> 再配置する
        </button>
      </header>

      {/* ── フィルターセクション ── */}
      <div style={{ marginBottom: "40px" }}>
        {/* 種別フィルター */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          {(["all", "photo", "board"] as const).map((v) => {
            const labels = {
              all: "すべて",
              photo: "📷 フォト",
              board: "📌 図鑑",
            };
            const isActive = filter === v;
            return (
              <button
                key={v}
                onClick={() => setFilter(v)}
                style={{
                  padding: "6px 16px",
                  border: `1px solid ${isActive ? colors.accent : "transparent"}`,
                  borderRadius: "20px",
                  background: isActive ? colors.accent : "transparent",
                  color: isActive ? "#fff" : colors.subtext,
                  fontSize: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {labels[v]}
              </button>
            );
          })}
        </div>

        {/* タグ索引 */}
        <div
          style={{
            fontSize: "12px",
            color: colors.accent,
            marginBottom: "10px",
            fontWeight: "bold",
          }}
        >
          分類 / 索引
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <TagChip
            label="すべて表示"
            active={selTag === null}
            onClick={() => setSelTag(null)}
            fontSize="11px"
          />
          {allTags.map((t) => (
            <TagChip
              key={t}
              label={`#${t}`}
              active={selTag === t}
              onClick={() => setSelTag(selTag === t ? null : t)}
              fontSize="11px"
            />
          ))}
        </div>
      </div>

      {/* ── ステータスバー ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${colors.line}`,
          paddingBottom: "8px",
          marginBottom: "32px",
          fontSize: "12px",
          color: colors.accent,
        }}
      >
        <span>観測対象: {selTag ? `「${selTag}」` : "すべて"}</span>
        <span>標本数: {feed.length.toString().padStart(3, "0")} 件</span>
      </div>

      {/* ── グリッド表示 ── */}
      {error ? (
        <div style={{ color: "#991B1B", padding: "20px" }}>{error}</div>
      ) : feed.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "100px 0",
            color: colors.subtext,
            fontFamily: fonts.serif,
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "16px" }}>🔭</div>
          該当する記録が現在の座標には存在しません。
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "40px",
          }}
        >
          {feed.map((item, index) => (
            <div
              key={item.id}
              style={{
                position: "relative",
                // わずかにランダムな傾きを付与（観測台帳のこだわりデザイン）
                transform: `rotate(${((index % 4) - 1.5) * 1.2}deg)`,
              }}
            >
              {item.kind === "photo" ? (
                <div
                  style={{
                    background: colors.cardBg,
                    padding: "10px",
                    borderRadius: "4px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    border: `1px solid ${colors.line}`,
                  }}
                >
                  <PhotoCard item={item.data} />
                </div>
              ) : (
                <div
                  style={{
                    background: colors.cardBg,
                    padding: "10px",
                    borderRadius: "4px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    border: `2px solid ${colors.accent}`, // 図鑑は少し強調
                  }}
                >
                  <ZukanCard
                    board={item.data}
                    onClick={() => navigate("/zukan")}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
