import { useState, useMemo, useEffect } from "react";
import { useItems } from "../hooks/useItems.ts";
import {
  SavedBoard,
  BoardCondition,
  PhotoMaterial,
  Collection,
} from "../types/index.ts";
import { useNavigate } from "react-router-dom";

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

function buildBoard(
  photos: PhotoMaterial[],
  cond: BoardCondition,
  offsets: Record<string | number, { dx: number; dy: number }>,
) {
  const size = SIZES[cond.sizeIdx];
  const mixed = cond.sizeIdx === 3;
  let filtered = [...photos];
  if (cond.tags.length > 0)
    filtered = filtered.filter((p) =>
      cond.tags.every((t) =>
        (p.aiTags ?? p.tags ?? []).map((s) => s.replace(/^#/, "")).includes(t),
      ),
    );
  filtered = filtered.slice(0, cond.maxCount);

  const rand = seededRand(42);
  const cols = Math.max(2, Math.floor(1060 / ((size.w || 160) + 24)));
  const items: BoardItem[] = filtered.map((item, i) => {
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
  const boardW = Math.max(
    860,
    ...items.map((b) => b.baseX + (offsets[b.id]?.dx ?? 0) + b.w + 80),
  );
  const boardH = Math.max(
    460,
    ...items.map((b) => b.baseY + (offsets[b.id]?.dy ?? 0) + b.h + 80),
  );
  return { items, boardW, boardH, filtered };
}

export default function Zukan() {
  const { photos, loading, error } = useItems();
  const navigate = useNavigate();
  const [boards, setBoards] = useState<SavedBoard[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editModal, setEditModal] = useState<SavedBoard | null>(null);

  // localStorageから保存済みボードを読み込む
  useEffect(() => {
    const raw = localStorage.getItem("savedBoards");
    if (raw) setBoards(JSON.parse(raw));
  }, []);

  const activeBoard =
    boards.find((b) => b.id === activeId) ?? boards[0] ?? null;

  const { items, boardW, boardH } = useMemo(() => {
    if (!activeBoard || photos.length === 0)
      return {
        items: [] as BoardItem[],
        boardW: 860,
        boardH: 460,
        filtered: [] as PhotoMaterial[],
      };
    return buildBoard(photos, activeBoard.condition, activeBoard.offsets ?? {});
  }, [activeBoard, photos]);

  const updateBoard = (id: string, patch: Partial<SavedBoard>) => {
    setBoards((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, ...patch } : b));
      localStorage.setItem("savedBoards", JSON.stringify(next));
      return next;
    });
  };

  const deleteBoard = (id: string) => {
    setBoards((prev) => {
      const next = prev.filter((b) => b.id !== id);
      localStorage.setItem("savedBoards", JSON.stringify(next));
      return next;
    });
    if (activeId === id) setActiveId(null);
  };

  const corkColor = activeBoard?.condition.corkColor ?? CORK_COLORS[0].value;

  return (
    <>
      {/* ヘッダー */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
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
            Myフォトで保存したコルクボードが並びます。
          </p>
        </div>
        <button
          onClick={() => navigate("/photos")}
          style={{
            padding: "8px 18px",
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
          ＋ 新しい図鑑を作る
        </button>
      </div>

      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: C.sub,
            fontSize: 13,
            fontStyle: "italic",
          }}
        >
          読み込み中...
        </div>
      )}
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

      {!loading && boards.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", color: C.sub }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📭</div>
          <div style={{ fontSize: 14, fontFamily: F.serif, marginBottom: 8 }}>
            まだ図鑑がありません
          </div>
          <div style={{ fontSize: 12 }}>
            Myフォトで条件を設定して保存してみましょう
          </div>
        </div>
      )}

      {boards.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: 20,
            alignItems: "start",
          }}
        >
          {/* サイドリスト */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {boards.map((b) => (
              <BoardListItem
                key={b.id}
                board={b}
                active={b.id === activeBoard?.id}
                onClick={() => setActiveId(b.id)}
                onEdit={() => setEditModal(b)}
                onDelete={() => deleteBoard(b.id)}
              />
            ))}
          </div>

          {/* メインビュー */}
          {activeBoard && (
            <div>
              {/* ボードヘッダー */}
              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h2
                      style={{
                        fontFamily: F.serif,
                        fontSize: 20,
                        fontWeight: "bold",
                        color: C.text,
                        marginBottom: activeBoard.comment ? 6 : 0,
                      }}
                    >
                      {activeBoard.title}
                    </h2>
                    {activeBoard.comment && (
                      <p
                        style={{
                          fontSize: 12,
                          color: C.sub,
                          lineHeight: 1.7,
                          margin: 0,
                        }}
                      >
                        {activeBoard.comment}
                      </p>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => setEditModal(activeBoard)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 7,
                        fontSize: 11,
                        cursor: "pointer",
                        border: `1px solid ${C.border}`,
                        background: C.bg,
                        color: C.sub,
                        fontFamily: F.sans,
                      }}
                    >
                      ✏️ 編集
                    </button>
                    <button
                      onClick={() => {
                        // 同じ条件でPhotosへ遷移し、condをsessionStorageに書き込む
                        sessionStorage.setItem(
                          "photosCond",
                          JSON.stringify(activeBoard.condition),
                        );
                        sessionStorage.removeItem("photosOffsets");
                        navigate("/photos");
                      }}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 7,
                        fontSize: 11,
                        cursor: "pointer",
                        border: `1px solid ${C.accent}`,
                        background: "transparent",
                        color: C.accent,
                        fontFamily: F.sans,
                      }}
                    >
                      🔍 同じ条件で再検索
                    </button>
                  </div>
                </div>
                {/* 条件バッジ */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 5,
                    marginTop: 10,
                  }}
                >
                  {activeBoard.condition.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 10,
                        padding: "2px 9px",
                        borderRadius: 9999,
                        background: "rgba(166,138,97,.12)",
                        color: C.accent,
                        border: "1px solid rgba(166,138,97,.3)",
                      }}
                    >
                      #{t}
                    </span>
                  ))}
                  <span
                    style={{
                      fontSize: 10,
                      padding: "2px 9px",
                      borderRadius: 9999,
                      background: C.bg,
                      color: C.sub,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    {items.length}枚
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      padding: "2px 9px",
                      borderRadius: 9999,
                      background: C.bg,
                      color: C.sub,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    {new Date(activeBoard.createdAt).toLocaleDateString(
                      "ja-JP",
                    )}
                  </span>
                </div>
              </div>

              {/* コルクボード */}
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
                    position: "relative",
                    backgroundImage: [
                      "repeating-linear-gradient(45deg,transparent,transparent 12px,rgba(0,0,0,.025) 12px,rgba(0,0,0,.025) 13px)",
                      "repeating-linear-gradient(-45deg,transparent,transparent 12px,rgba(0,0,0,.018) 12px,rgba(0,0,0,.018) 13px)",
                    ].join(","),
                    borderRadius: 12,
                  }}
                >
                  {items.length === 0 && (
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
                  {items.map((item) => (
                    <PinnedCard
                      key={item.id}
                      item={item}
                      offset={
                        activeBoard.offsets?.[item.id] ?? { dx: 0, dy: 0 }
                      }
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
                {items.length}枚
              </div>
            </div>
          )}
        </div>
      )}

      {/* 編集モーダル */}
      {editModal && (
        <EditModal
          board={editModal}
          onSave={(patch) => {
            updateBoard(editModal.id, patch);
            setEditModal(null);
          }}
          onClose={() => setEditModal(null)}
        />
      )}
    </>
  );
}

// ── サイドリストアイテム ──
function BoardListItem({
  board,
  active,
  onClick,
  onEdit,
  onDelete,
}: {
  board: SavedBoard;
  active: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: 10,
        border: `1px solid ${active ? "#A68A61" : C.border}`,
        background: active
          ? "rgba(166,138,97,.08)"
          : hover
            ? "rgba(0,0,0,.02)"
            : C.bg,
        padding: "12px 14px",
        cursor: "pointer",
        transition: "all .15s",
        boxShadow: active ? "0 2px 8px rgba(166,138,97,.15)" : "none",
      }}
    >
      <div
        style={{
          fontFamily: F.serif,
          fontSize: 13,
          fontWeight: "bold",
          color: active ? C.accent : C.text,
          marginBottom: 4,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {board.title}
      </div>
      {board.comment && (
        <div
          style={{
            fontSize: 10,
            color: C.sub,
            lineHeight: 1.5,
            marginBottom: 6,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {board.comment}
        </div>
      )}
      <div
        style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}
      >
        {board.condition.tags.slice(0, 3).map((t) => (
          <span
            key={t}
            style={{
              fontSize: 9,
              padding: "1px 7px",
              borderRadius: 9999,
              background: "rgba(166,138,97,.1)",
              color: C.accent,
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
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 9, color: C.sub, fontFamily: F.mono }}>
          {new Date(board.createdAt).toLocaleDateString("ja-JP")}
        </span>
        {(hover || active) && (
          <div
            style={{ display: "flex", gap: 4 }}
            onClick={(e) => e.stopPropagation()}
          >
            <MiniBtn onClick={onEdit}>✏️</MiniBtn>
            <MiniBtn onClick={onDelete} danger>
              🗑
            </MiniBtn>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ピンカード（読み取り専用） ──
function PinnedCard({
  item,
  offset,
}: {
  item: BoardItem;
  offset: { dx: number; dy: number };
}) {
  const [hov, setHov] = useState(false);
  const x = item.baseX + offset.dx + 40;
  const y = item.baseY + offset.dy + 40;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: item.w,
        transform: hov
          ? "rotate(0deg) translateY(-5px) scale(1.04)"
          : `rotate(${item.rot}deg)`,
        filter: `drop-shadow(${hov ? "3px 8px 16px rgba(0,0,0,.4)" : "2px 5px 10px rgba(0,0,0,.28)"})`,
        transition: "transform .2s, filter .2s",
        zIndex: hov ? 10 : 1,
      }}
    >
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

// ── 編集モーダル ──
function EditModal({
  board,
  onSave,
  onClose,
}: {
  board: SavedBoard;
  onSave: (p: Partial<SavedBoard>) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(board.title);
  const [comment, setComment] = useState(board.comment ?? "");
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
          padding: "28px",
          width: 400,
          boxShadow: "0 16px 48px rgba(0,0,0,.3)",
        }}
      >
        <div
          style={{
            fontFamily: F.serif,
            fontSize: 18,
            fontWeight: "bold",
            color: C.text,
            marginBottom: 20,
          }}
        >
          図鑑を編集
        </div>

        <label
          style={{
            fontSize: 11,
            color: C.sub,
            display: "block",
            marginBottom: 5,
          }}
        >
          タイトル
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
            marginBottom: 16,
          }}
        />

        <label
          style={{
            fontSize: 11,
            color: C.sub,
            display: "block",
            marginBottom: 5,
          }}
        >
          コメント（任意）
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="この図鑑についてひとこと…"
          rows={3}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "10px 14px",
            borderRadius: 8,
            border: `1px solid ${C.border}`,
            background: "#fff",
            fontSize: 13,
            fontFamily: F.sans,
            color: C.text,
            outline: "none",
            resize: "none",
            lineHeight: 1.7,
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
            onClick={() =>
              onSave({
                title: title.trim() || board.title,
                comment: comment.trim() || undefined,
              })
            }
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
      </div>
    </div>
  );
}

// ── 共通 ──
function MiniBtn({
  onClick,
  danger,
  children,
}: {
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "2px 7px",
        borderRadius: 5,
        border: "none",
        background: danger ? "rgba(192,64,48,.12)" : "rgba(0,0,0,.06)",
        color: danger ? "#c04030" : C.sub,
        fontSize: 11,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
