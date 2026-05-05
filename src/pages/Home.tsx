import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useItems } from "../hooks/useItems.ts";
import { SavedBoard } from "../types/index.ts";
import PhotoCard from "../components/PhotoCard.tsx";
import ZukanCard from "../components/ZukanCard.tsx";

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
};

export default function Home() {
  const navigate = useNavigate();
  const { photos, loading, error } = useItems();
  const [boards, setBoards] = useState<SavedBoard[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("savedBoards");
      if (raw) setBoards(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
      {error && (
        <div
          style={{
            padding: 16,
            backgroundColor: "#FEE2E2",
            color: "#991B1B",
            borderRadius: 8,
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div
          style={{ textAlign: "center", padding: 40, color: colors.subtext }}
        >
          キャビネットを開いています...
        </div>
      ) : (
        !error && (
          <>
            {/* ── 最近のフォト ── */}
            <section>
              <SectionHeader
                title="最近のフォト"
                onMore={() => navigate("/photos")}
              />
              {photos.length === 0 ? (
                <EmptyMsg>まだ写真がありません。</EmptyMsg>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                    gap: 24,
                    paddingTop: 12,
                  }}
                >
                  {photos.slice(0, 4).map((photo) => (
                    <PhotoCard key={photo.id} item={photo} />
                  ))}
                </div>
              )}
            </section>

            <Divider />

            {/* ── 最近の図鑑 ── */}
            <section>
              <SectionHeader
                title="最近の図鑑"
                onMore={() => navigate("/zukan")}
              />
              {boards.length === 0 ? (
                <EmptyMsg>
                  まだ図鑑がありません。
                  <button
                    onClick={() => navigate("/photos")}
                    style={{
                      marginLeft: 10,
                      fontSize: 12,
                      color: colors.accent,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontFamily: fonts.sans,
                    }}
                  >
                    フォトで作成 →
                  </button>
                </EmptyMsg>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
                    gap: 24,
                  }}
                >
                  {boards.slice(0, 6).map((board) => (
                    <ZukanCard
                      key={board.id}
                      board={board}
                      onClick={() => navigate("/zukan")}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )
      )}
    </div>
  );
}

// ── 共通コンポーネント ──
function SectionHeader({
  title,
  onMore,
}: {
  title: string;
  onMore: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 16,
      }}
    >
      <h2
        style={{
          fontSize: 18,
          fontWeight: "bold",
          fontFamily: fonts.serif,
          margin: 0,
          color: colors.text,
        }}
      >
        {title}
      </h2>
      <span
        onClick={onMore}
        style={{ fontSize: 12, color: colors.subtext, cursor: "pointer" }}
      >
        すべて見る ＞
      </span>
    </div>
  );
}
function Divider() {
  return (
    <div style={{ height: 1, backgroundColor: colors.border, width: "100%" }} />
  );
}
function EmptyMsg({ children }: { children: React.ReactNode }) {
  return <p style={{ color: colors.subtext, fontSize: 14 }}>{children}</p>;
}
