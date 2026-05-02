import { useState, useRef, useEffect, useCallback } from "react";

const C = {
  bg: "#F8F6F0",
  text: "#3D3328",
  sub: "#A39B8B",
  accent: "#A68A61",
  border: "#E6E0D4",
  card: "#FCFAEF",
  page: "#FDFAF3",
  pageBg: "#FAF6EF",
};
const F = {
  serif: '"Noto Serif JP","Hiragino Mincho ProN",serif',
  sans: '"Noto Sans JP","Hiragino Kaku Gothic ProN",sans-serif',
};

// ── 型 ──────────────────────────────
type RecordType = "フォト" | "図鑑";

interface PhotoBlock {
  id: number;
  kind: "photo";
  url: string;
  scale: number;
  x: number;
  y: number;
}
interface TextBlock {
  id: number;
  kind: "text";
  body: string;
}
type Block = PhotoBlock | TextBlock;

interface ZukanPage {
  id: number;
  blocks: Block[];
}
interface Cover {
  title: string;
  subtitle: string;
  url: string | null;
}

let _uid = 100;
const uid = () => ++_uid;
const makePage = (): ZukanPage => ({ id: uid(), blocks: [] });

// ── Record（親） ────────────────────
export default function Record() {
  const [tab, setTab] = useState<RecordType>("フォト");
  return (
    <div style={{ fontFamily: F.sans, color: C.text }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: F.serif,
            fontSize: 26,
            fontWeight: "bold",
            letterSpacing: "0.05em",
            marginBottom: 16,
          }}
        >
          ✏️ 記録
        </h1>
        <ToggleTabs
          options={[
            { value: "フォト", label: "🖼️ フォト" },
            { value: "図鑑", label: "📖 図鑑" },
          ]}
          value={tab}
          onChange={(v) => setTab(v as RecordType)}
        />
      </div>
      {tab === "フォト" ? <PhotoEditor /> : <ZineEditor />}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// フォトエディター
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function PhotoEditor() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [saved, setSaved] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const load = (f?: File) => {
    if (!f?.type.startsWith("image/")) return;
    setUrl(URL.createObjectURL(f));
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 280px",
        gap: 24,
        alignItems: "start",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <FormField label="タイトル">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトルを入力"
            style={iStyle}
          />
        </FormField>

        <FormField label="画像（1枚）">
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
              height: 240,
              borderRadius: 12,
              overflow: "hidden",
              position: "relative",
              border: `1.5px dashed ${drag ? C.accent : C.border}`,
              background: drag ? "rgba(166,138,97,.06)" : C.card,
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
              <Placeholder
                icon="🖼️"
                label="画像を追加（1枚）"
                hint="クリックまたはドラッグ"
              />
            )}
          </div>
          <input
            ref={ref}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => load(e.target.files?.[0])}
          />
        </FormField>

        <FormField label="内容">
          <div style={{ position: "relative" }}>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="内容テキストを入力"
              rows={6}
              style={{ ...iStyle, resize: "vertical", lineHeight: 1.7 }}
            />
            <button
              onClick={() => {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
              }}
              style={{
                position: "absolute",
                bottom: 12,
                right: 12,
                padding: "6px 18px",
                borderRadius: 6,
                border: `1px solid ${C.accent}`,
                background: saved ? C.accent : "transparent",
                color: saved ? "#fff" : C.accent,
                fontSize: 12,
                cursor: "pointer",
                transition: "all .2s",
              }}
            >
              {saved ? "保存済み ✓" : "保存"}
            </button>
          </div>
        </FormField>
      </div>

      {/* プレビュー */}
      <div>
        <BadgeLabel>プレビュー</BadgeLabel>
        <div
          style={{
            borderRadius: 12,
            border: `1px solid ${C.border}`,
            background: C.card,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              aspectRatio: "4/3",
              background: C.border,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {url ? (
              <img
                src={url}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                alt=""
              />
            ) : (
              <span style={{ fontSize: 28, opacity: 0.3 }}>🖼️</span>
            )}
          </div>
          <div style={{ padding: "10px 12px 14px" }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: "bold",
                fontFamily: F.serif,
                color: C.text,
                opacity: title ? 1 : 0.3,
                marginBottom: 4,
              }}
            >
              {title || "タイトル"}
            </div>
            {body && (
              <div
                style={{
                  fontSize: 11,
                  color: C.sub,
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {body}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Zineエディター
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ZineEditor() {
  const [cover, setCover] = useState<Cover>({
    title: "",
    subtitle: "",
    url: null,
  });
  const [pages, setPages] = useState<ZukanPage[]>([makePage(), makePage()]);
  const [spread, setSpread] = useState(0); // 0=表紙, 1以降=見開き
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const targetId = useRef<number | "cover" | null>(null);

  // spread=0 → 表紙+背表紙
  // spread=1 → pages[0]+pages[1]
  // spread=2 → pages[2]+pages[3] …
  const totalSpreads = Math.ceil(pages.length / 2) + 1;
  const lPage = spread === 0 ? null : (pages[(spread - 1) * 2] ?? null);
  const rPage = spread === 0 ? null : (pages[(spread - 1) * 2 + 1] ?? null);

  const openFile = (id: number | "cover") => {
    targetId.current = id;
    fileRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    if (targetId.current === "cover") {
      setCover((c) => ({ ...c, url }));
    } else {
      const id = targetId.current as number;
      addBlock(id, { id: uid(), kind: "photo", url, scale: 1, x: 0, y: 0 });
    }
    e.target.value = "";
  };

  const addBlock = (pageId: number, block: Block) =>
    setPages((ps) =>
      ps.map((p) =>
        p.id === pageId ? { ...p, blocks: [...p.blocks, block] } : p,
      ),
    );

  const updateBlock = (
    pageId: number,
    blockId: number,
    patch: Partial<Block>,
  ) =>
    setPages((ps) =>
      ps.map((p) =>
        p.id === pageId
          ? {
              ...p,
              blocks: p.blocks.map((b) =>
                b.id === blockId ? ({ ...b, ...patch } as Block) : b,
              ),
            }
          : p,
      ),
    );

  const removeBlock = (pageId: number, blockId: number) =>
    setPages((ps) =>
      ps.map((p) =>
        p.id === pageId
          ? { ...p, blocks: p.blocks.filter((b) => b.id !== blockId) }
          : p,
      ),
    );

  const moveBlock = (pageId: number, blockId: number, dir: -1 | 1) =>
    setPages((ps) =>
      ps.map((p) => {
        if (p.id !== pageId) return p;
        const idx = p.blocks.findIndex((b) => b.id === blockId);
        if (idx < 0) return p;
        const next = [...p.blocks];
        const swap = idx + dir;
        if (swap < 0 || swap >= next.length) return p;
        [next[idx], next[swap]] = [next[swap], next[idx]];
        return { ...p, blocks: next };
      }),
    );

  const addPage = () => setPages((ps) => [...ps, makePage()]);
  const removePage = (id: number) => {
    setPages((ps) => ps.filter((p) => p.id !== id));
    setSpread((s) => Math.max(0, s - 1));
  };

  return (
    <div>
      {/* 保存 */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <button
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          style={{
            padding: "8px 24px",
            borderRadius: 8,
            border: `1px solid ${C.accent}`,
            background: saved ? C.accent : "transparent",
            color: saved ? "#fff" : C.accent,
            fontSize: 13,
            cursor: "pointer",
            transition: "all .2s",
          }}
        >
          {saved ? "保存済み ✓" : "保存する"}
        </button>
      </div>

      {/* ── 見開きビュー ── */}
      <div
        style={{
          background: "#1e1610",
          borderRadius: 16,
          padding: "32px 28px 24px",
          marginBottom: 20,
          boxShadow: "0 8px 40px rgba(0,0,0,.35)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            maxWidth: 820,
            margin: "0 auto",
            boxShadow: "0 4px 32px rgba(0,0,0,.5)",
            borderRadius: 4,
            overflow: "hidden",
            minHeight: 500,
          }}
        >
          {/* 左 */}
          <div
            style={{
              background: C.page,
              borderRight: "2px solid #d8d0c0",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {spread === 0 ? (
              <CoverLeft
                cover={cover}
                onChange={(p) => setCover((c) => ({ ...c, ...p }))}
                onImageClick={() => openFile("cover")}
              />
            ) : lPage ? (
              <PageEditor
                page={lPage}
                onAddPhoto={() => openFile(lPage.id)}
                onAddText={() =>
                  addBlock(lPage.id, { id: uid(), kind: "text", body: "" })
                }
                onUpdateBlock={(bid, patch) =>
                  updateBlock(lPage.id, bid, patch)
                }
                onRemoveBlock={(bid) => removeBlock(lPage.id, bid)}
                onMoveBlock={(bid, dir) => moveBlock(lPage.id, bid, dir)}
                onRemovePage={() => removePage(lPage.id)}
              />
            ) : (
              <EmptyPage onAdd={addPage} />
            )}
          </div>

          {/* 右 */}
          <div
            style={{
              background: C.pageBg,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {spread === 0 ? (
              <CoverRight title={cover.title} />
            ) : rPage ? (
              <PageEditor
                page={rPage}
                onAddPhoto={() => openFile(rPage.id)}
                onAddText={() =>
                  addBlock(rPage.id, { id: uid(), kind: "text", body: "" })
                }
                onUpdateBlock={(bid, patch) =>
                  updateBlock(rPage.id, bid, patch)
                }
                onRemoveBlock={(bid) => removeBlock(rPage.id, bid)}
                onMoveBlock={(bid, dir) => moveBlock(rPage.id, bid, dir)}
                onRemovePage={() => removePage(rPage.id)}
              />
            ) : (
              <EmptyPage onAdd={addPage} />
            )}
          </div>
        </div>

        {/* ページ送り */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            marginTop: 20,
          }}
        >
          <NavBtn
            disabled={spread === 0}
            onClick={() => setSpread((s) => s - 1)}
          >
            ‹
          </NavBtn>
          <span
            style={{
              color: "rgba(255,253,245,.45)",
              fontSize: 12,
              minWidth: 100,
              textAlign: "center",
            }}
          >
            {spread === 0
              ? "表紙"
              : `p${(spread - 1) * 2 + 1} — p${(spread - 1) * 2 + 2}`}{" "}
            / {pages.length}p
          </span>
          <NavBtn
            disabled={spread >= totalSpreads - 1}
            onClick={() => setSpread((s) => s + 1)}
          >
            ›
          </NavBtn>
          <button
            onClick={() => {
              addPage();
              if (pages.length % 2 === 0) addPage();
            }}
            style={{
              padding: "5px 14px",
              borderRadius: 6,
              border: "1px solid rgba(255,253,245,.2)",
              background: "transparent",
              color: "rgba(255,253,245,.4)",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            + 見開き追加
          </button>
        </div>
      </div>

      {/* サムネイル */}
      <div style={{ fontSize: 11, color: C.sub, marginBottom: 8 }}>
        ページ一覧
      </div>
      <div
        style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}
      >
        <Thumb
          label="表紙"
          imageUrl={cover.url}
          active={spread === 0}
          onClick={() => setSpread(0)}
        />
        {pages.map((p, i) => {
          const firstPhoto = p.blocks.find((b) => b.kind === "photo") as
            | PhotoBlock
            | undefined;
          return (
            <Thumb
              key={p.id}
              label={`p${i + 1}`}
              imageUrl={firstPhoto?.url ?? null}
              active={spread === Math.floor(i / 2) + 1}
              onClick={() => setSpread(Math.floor(i / 2) + 1)}
            />
          );
        })}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={onFileChange}
      />
    </div>
  );
}

// ── 表紙（左ページ） ──────────────────
function CoverLeft({
  cover,
  onChange,
  onImageClick,
}: {
  cover: Cover;
  onChange: (p: Partial<Cover>) => void;
  onImageClick: () => void;
}) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(160deg,#2a1f14,#3d2e1a)",
      }}
    >
      {/* 画像エリア */}
      <div
        onClick={onImageClick}
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          minHeight: 280,
        }}
      >
        {cover.url ? (
          <img
            src={cover.url}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.75,
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Placeholder
              icon="🖼️"
              label="表紙の写真"
              hint="クリックで追加"
              light
            />
          </div>
        )}
        {cover.url && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(30,15,5,.8) 0%, transparent 60%)",
            }}
          />
        )}
      </div>
      {/* タイトル */}
      <div
        style={{ padding: "20px 24px 28px", background: "rgba(20,12,5,.6)" }}
      >
        <input
          value={cover.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="タイトル"
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: F.serif,
            fontSize: 22,
            fontWeight: "bold",
            color: "#f5f0e6",
            letterSpacing: "0.06em",
            boxSizing: "border-box",
            borderBottom: "1px solid rgba(255,253,245,.2)",
            paddingBottom: 8,
            marginBottom: 8,
          }}
        />
        <input
          value={cover.subtitle}
          onChange={(e) => onChange({ subtitle: e.target.value })}
          placeholder="サブタイトル"
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: F.sans,
            fontSize: 11,
            color: "rgba(255,253,245,.5)",
            letterSpacing: "0.1em",
            boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
}

// ── 背表紙（右） ─────────────────────
function CoverRight({ title }: { title: string }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right,#c8a870,#b8956a)",
        boxShadow: "inset 4px 0 16px rgba(0,0,0,.2)",
      }}
    >
      <div
        style={{
          writingMode: "vertical-rl",
          fontFamily: F.serif,
          fontSize: 16,
          fontWeight: "bold",
          color: "rgba(255,255,255,.8)",
          letterSpacing: "0.2em",
          textShadow: "0 1px 4px rgba(0,0,0,.3)",
          marginBottom: 24,
        }}
      >
        {title || "偏愛図鑑"}
      </div>
      <div
        style={{
          width: 1,
          height: 60,
          background: "rgba(255,255,255,.25)",
          margin: "8px 0",
        }}
      />
      <div
        style={{
          fontSize: 9,
          color: "rgba(255,255,255,.35)",
          fontFamily: F.sans,
          letterSpacing: "0.12em",
          writingMode: "vertical-rl",
        }}
      >
        personal archive
      </div>
    </div>
  );
}

// ── ページエディター（ブロック方式） ──
function PageEditor({
  page,
  onAddPhoto,
  onAddText,
  onUpdateBlock,
  onRemoveBlock,
  onMoveBlock,
  onRemovePage,
}: {
  page: ZukanPage;
  onAddPhoto: () => void;
  onAddText: () => void;
  onUpdateBlock: (id: number, patch: Partial<Block>) => void;
  onRemoveBlock: (id: number) => void;
  onMoveBlock: (id: number, dir: -1 | 1) => void;
  onRemovePage: () => void;
}) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* ツールバー */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 10px",
          borderBottom: `1px solid ${C.border}`,
          background: "rgba(255,255,255,.5)",
          flexShrink: 0,
        }}
      >
        <button onClick={onAddPhoto} style={toolBtnStyle}>
          ＋ 写真
        </button>
        <button onClick={onAddText} style={toolBtnStyle}>
          ＋ テキスト
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={onRemovePage}
          style={{
            ...toolBtnStyle,
            color: "#c04030",
            borderColor: "rgba(192,64,48,.3)",
          }}
        >
          ページ削除
        </button>
      </div>

      {/* ブロック一覧 */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {page.blocks.length === 0 && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.35,
              flexDirection: "column",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 22 }}>📄</span>
            <span style={{ fontSize: 11, color: C.sub }}>
              ブロックを追加しよう
            </span>
          </div>
        )}
        {page.blocks.map((block, i) => (
          <BlockItem
            key={block.id}
            block={block}
            isFirst={i === 0}
            isLast={i === page.blocks.length - 1}
            onUpdate={(patch) => onUpdateBlock(block.id, patch)}
            onRemove={() => onRemoveBlock(block.id)}
            onMove={(dir) => onMoveBlock(block.id, dir)}
          />
        ))}
      </div>
    </div>
  );
}

// ── ブロック ─────────────────────────
function BlockItem({
  block,
  isFirst,
  isLast,
  onUpdate,
  onRemove,
  onMove,
}: {
  block: Block;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (p: Partial<Block>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const dragRef = useRef<{
    mx: number;
    my: number;
    ox: number;
    oy: number;
  } | null>(null);

  // マウスドラッグで画像移動
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (block.kind !== "photo") return;
      e.preventDefault();
      dragRef.current = {
        mx: e.clientX,
        my: e.clientY,
        ox: block.x,
        oy: block.y,
      };
    },
    [block],
  );

  useEffect(() => {
    if (block.kind !== "photo") return;
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      onUpdate({
        x: dragRef.current.ox + e.clientX - dragRef.current.mx,
        y: dragRef.current.oy + e.clientY - dragRef.current.my,
      });
    };
    const onUp = () => {
      dragRef.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [block]);

  // スクロール拡縮（ページへの伝播を止める）
  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (block.kind !== "photo") return;
      e.preventDefault();
      e.stopPropagation();
      const s = Math.min(
        4,
        Math.max(0.4, (block as PhotoBlock).scale - e.deltaY * 0.002),
      );
      onUpdate({ scale: s });
    },
    [block],
  );

  return (
    <div
      style={{
        borderRadius: 6,
        border: `1px solid ${C.border}`,
        overflow: "hidden",
        background: "#fff",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* ブロック操作ボタン */}
      <div
        style={{
          position: "absolute",
          top: 4,
          right: 4,
          zIndex: 10,
          display: "flex",
          gap: 3,
        }}
      >
        {!isFirst && <MiniBtn onClick={() => onMove(-1)}>↑</MiniBtn>}
        {!isLast && <MiniBtn onClick={() => onMove(1)}>↓</MiniBtn>}
        <MiniBtn onClick={onRemove} danger>
          ×
        </MiniBtn>
      </div>

      {block.kind === "photo" && (
        <div
          onMouseDown={onMouseDown}
          onWheel={onWheel}
          style={{
            height: 180,
            overflow: "hidden",
            cursor: "grab",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: C.border,
            userSelect: "none",
          }}
        >
          <img
            src={block.url}
            alt=""
            draggable={false}
            style={{
              transform: `translate(${block.x}px,${block.y}px) scale(${block.scale})`,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transformOrigin: "center",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 5,
              right: 6,
              fontSize: 8,
              color: "rgba(255,255,255,.65)",
              background: "rgba(0,0,0,.35)",
              padding: "2px 6px",
              borderRadius: 3,
            }}
          >
            ドラッグで移動・スクロールで拡縮
          </div>
        </div>
      )}

      {block.kind === "text" && (
        <textarea
          value={block.body}
          onChange={(e) => onUpdate({ body: e.target.value })}
          placeholder="テキストを入力…"
          style={{
            width: "100%",
            minHeight: 80,
            border: "none",
            outline: "none",
            resize: "none",
            fontFamily: F.serif,
            fontSize: 12,
            color: C.text,
            lineHeight: 1.8,
            padding: "10px 36px 10px 12px",
            boxSizing: "border-box",
            background: "transparent",
          }}
        />
      )}
    </div>
  );
}

// ── 空ページ ──────────────────────────
function EmptyPage({ onAdd }: { onAdd?: () => void }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 12,
        opacity: 0.35,
      }}
    >
      <span style={{ fontSize: 26 }}>📄</span>
      {onAdd && (
        <button
          onClick={onAdd}
          style={{
            padding: "5px 14px",
            borderRadius: 6,
            border: `1px solid ${C.border}`,
            background: "transparent",
            color: C.sub,
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          + ページを追加
        </button>
      )}
    </div>
  );
}

// ── 共通小コンポーネント ──────────────
function ToggleTabs({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        borderRadius: 10,
        border: `1px solid ${C.border}`,
        background: C.card,
        padding: 4,
        gap: 4,
      }}
    >
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          style={{
            padding: "7px 28px",
            borderRadius: 7,
            border: "none",
            background: value === o.value ? C.accent : "transparent",
            color: value === o.value ? "#fff" : C.sub,
            fontSize: 13,
            fontFamily: F.sans,
            fontWeight: value === o.value ? "bold" : "normal",
            cursor: "pointer",
            transition: "all .15s",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 11,
          color: C.sub,
          marginBottom: 6,
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function BadgeLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "inline-block",
        padding: "4px 14px",
        borderRadius: 6,
        border: `1px solid ${C.accent}`,
        color: C.accent,
        fontSize: 12,
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

function Placeholder({
  icon,
  label,
  hint,
  light,
}: {
  icon: string;
  label: string;
  hint?: string;
  light?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        opacity: 0.45,
      }}
    >
      <span style={{ fontSize: 30 }}>{icon}</span>
      <span
        style={{ fontSize: 12, color: light ? "rgba(255,255,255,.7)" : C.sub }}
      >
        {label}
      </span>
      {hint && (
        <span
          style={{
            fontSize: 10,
            color: light ? "rgba(255,255,255,.4)" : C.border,
          }}
        >
          {hint}
        </span>
      )}
    </div>
  );
}

function NavBtn({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        border: "1px solid rgba(255,253,245,.2)",
        background: "transparent",
        color: disabled ? "rgba(255,253,245,.2)" : "rgba(255,253,245,.7)",
        fontSize: 18,
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

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
        width: 20,
        height: 20,
        borderRadius: "50%",
        border: "none",
        background: danger ? "rgba(192,64,48,.7)" : "rgba(0,0,0,.35)",
        color: "#fff",
        fontSize: 11,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1,
        padding: 0,
      }}
    >
      {children}
    </button>
  );
}

function Thumb({
  label,
  imageUrl,
  active,
  onClick,
}: {
  label: string;
  imageUrl: string | null;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{ flexShrink: 0, width: 64, cursor: "pointer" }}
    >
      <div
        style={{
          width: 64,
          height: 46,
          borderRadius: 4,
          overflow: "hidden",
          border: `2px solid ${active ? C.accent : C.border}`,
          background: C.border,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "border-color .15s",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: 14, opacity: 0.3 }}>📄</span>
        )}
      </div>
      <div
        style={{
          fontSize: 9,
          color: active ? C.accent : C.sub,
          textAlign: "center",
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  );
}

const iStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 8,
  border: `1px solid ${C.border}`,
  background: C.card,
  fontSize: 13,
  fontFamily: F.sans,
  color: C.text,
  outline: "none",
  boxSizing: "border-box",
};
const closeBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: 10,
  right: 10,
  width: 28,
  height: 28,
  borderRadius: "50%",
  background: "rgba(0,0,0,.5)",
  border: "none",
  color: "#fff",
  fontSize: 14,
  cursor: "pointer",
};
const toolBtnStyle: React.CSSProperties = {
  fontSize: 11,
  padding: "4px 10px",
  borderRadius: 5,
  border: `1px solid ${C.border}`,
  background: "transparent",
  color: C.sub,
  cursor: "pointer",
  fontFamily: F.sans,
};
