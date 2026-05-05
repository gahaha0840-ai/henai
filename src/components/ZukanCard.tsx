import { SavedBoard } from "../types/index.ts";

const colors = {
  text: "#3D3328",
  subtext: "#A39B8B",
  accent: "#A68A61",
  border: "#E6E0D4",
  card: "#FCFAEF",
};
const fonts = {
  serif: '"Noto Serif JP","Hiragino Mincho ProN",serif',
  sans: '"Noto Sans JP","Hiragino Kaku Gothic ProN",sans-serif',
  mono: '"SF Mono","Courier New",monospace',
};

const CORK_COLORS: Record<string, string> = {
  "#B8864E": "#B8864E",
  "#7A5230": "#7A5230",
  "#D4AA78": "#D4AA78",
  "#6B7C5A": "#6B7C5A",
};

interface Props {
  board: SavedBoard;
  onClick?: () => void;
}

export default function ZukanCard({ board, onClick }: Props) {
  const corkColor = CORK_COLORS[board.condition.corkColor] ?? "#B8864E";
  const tags = board.condition.tags;
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
      style={{
        background: colors.card,
        borderRadius: 12,
        overflow: "hidden",
        border: `1px solid ${colors.border}`,
        boxShadow: "0 1px 4px rgba(0,0,0,.05)",
        cursor: onClick ? "pointer" : "default",
        transition: "box-shadow .15s, transform .15s",
      }}
      onMouseEnter={(e) => {
        if (!onClick) return;
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 16px rgba(0,0,0,.1)";
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 1px 4px rgba(0,0,0,.05)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* コルクボードサムネイル */}
      <div
        style={{
          width: "100%",
          height: 160,
          background: corkColor,
          backgroundImage: [
            "repeating-linear-gradient(45deg,transparent,transparent 8px,rgba(0,0,0,.025) 8px,rgba(0,0,0,.025) 9px)",
            "repeating-linear-gradient(-45deg,transparent,transparent 8px,rgba(0,0,0,.018) 8px,rgba(0,0,0,.018) 9px)",
          ].join(","),
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* ミニピンカードを散らして表示 */}
        <MiniPins count={Math.min(board.condition.maxCount, 6)} />

        {/* 枚数バッジ */}
        <div
          style={{
            position: "absolute",
            bottom: 8,
            right: 10,
            fontSize: 10,
            color: "rgba(255,255,255,.7)",
            background: "rgba(0,0,0,.3)",
            padding: "2px 8px",
            borderRadius: 9999,
            fontFamily: fonts.mono,
          }}
        >
          {board.condition.maxCount}枚
        </div>
      </div>

      {/* テキスト部 */}
      <div style={{ padding: "14px 16px 16px" }}>
        <div
          style={{
            fontSize: 11,
            color: colors.subtext,
            fontFamily: fonts.mono,
            marginBottom: 6,
          }}
        >
          {date}
        </div>

        <div
          style={{
            fontWeight: "bold",
            fontSize: 16,
            fontFamily: fonts.serif,
            color: colors.text,
            marginBottom: 6,
            lineHeight: 1.4,
          }}
        >
          {board.title}
        </div>

        {board.comment && (
          <div
            style={{
              fontSize: 12,
              color: colors.subtext,
              lineHeight: 1.6,
              marginBottom: 10,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {board.comment}
          </div>
        )}

        {/* タグ */}
        {tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {tags.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 10,
                  padding: "2px 9px",
                  borderRadius: 9999,
                  background: "rgba(166,138,97,.1)",
                  color: colors.accent,
                  border: "1px solid rgba(166,138,97,.25)",
                }}
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── ミニピンカードをランダム配置 ──
const PIN_COLORS = ["#c0392b", "#e67e22", "#27ae60", "#2980b9", "#8e44ad"];
const ROTS = [-8, -4, -2, 3, 6, 9];
const POSITIONS = [
  { left: "8%", top: "12%" },
  { left: "30%", top: "5%" },
  { left: "52%", top: "15%" },
  { left: "72%", top: "6%" },
  { left: "18%", top: "48%" },
  { left: "60%", top: "44%" },
];

function MiniPins({ count }: { count: number }) {
  return (
    <>
      {POSITIONS.slice(0, count).map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: pos.left,
            top: pos.top,
            transform: `rotate(${ROTS[i % ROTS.length]}deg)`,
            filter: "drop-shadow(1px 3px 5px rgba(0,0,0,.3))",
          }}
        >
          {/* ピン */}
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: PIN_COLORS[i % PIN_COLORS.length],
              margin: "0 auto -3px",
              position: "relative",
              zIndex: 2,
            }}
          />
          {/* ミニポラロイド */}
          <div
            style={{
              width: 52,
              background: "#FFFDF5",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "100%",
                height: 40,
                background: `hsl(${30 + i * 25},20%,75%)`,
              }}
            />
            <div
              style={{
                height: 10,
                background: "#FFFDF5",
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
}
