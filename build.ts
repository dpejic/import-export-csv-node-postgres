import { build } from "esbuild";
import { copy } from "esbuild-plugin-copy";

(async () => {
  await build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    minify: true,
    platform: "node",
    target: "esnext",
    sourcemap: true,
    outdir: "dist",
    format: "esm",
    external: ["pg-copy-streams", "pg"],
    plugins: [
      copy({
        assets: [{ from: "./src/static/**/*", to: "./static" }],
      }),
    ],
  });
})();
