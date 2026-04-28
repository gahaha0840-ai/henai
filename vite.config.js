//Viteの挙動（開発サーバーの起動や、本番用ファイルの書き出し設定）を定義します。
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // 書き出し先のフォルダ名
  },
});
