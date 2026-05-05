// タグのUIコンポーネント

type Props = {
  tags: string[];
  selected: string | null;
  onChange: (tag: string | null) => void;
  mode?: "row" | "wrap";
};
// すべてを選択した状態はselected=nullで表現する
export default function TagFilter({
  tags,
  selected,
  onChange,
  mode = "wrap",
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: mode === "wrap" ? "wrap" : "nowrap",
        gap: 8,
        overflowX: mode === "row" ? "auto" : "visible",
      }}
    >
      {/* 全解除ボタン */}
      <button
        onClick={() => onChange(null)}
        style={{
          padding: "4px 10px",
          borderRadius: 9999,
          border: `1px solid ${selected === null ? "#A68A61" : "#E6E0D4"}`,
          background: selected === null ? "#A68A61" : "#F8F6F0",
          color: selected === null ? "#fff" : "#A39B8B",
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        すべて
      </button>

      {/* タグ一覧 */}
      {tags.map((tag) => {
        const active = selected === tag;
        return (
          <button
            key={tag}
            onClick={() => onChange(tag)}
            style={{
              writingMode: "horizontal-tb", // タグが縦書きになるのを防ぐ
              padding: "6px 14px", // タグのサイズに合わせて調整
              borderRadius: 9999,
              border: `1px solid ${active ? "#A68A61" : "#E6E0D4"}`,
              background: active ? "#A68A61" : "#F8F6F0",
              color: active ? "#fff" : "#A39B8B",
              fontSize: 10,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
