import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

interface RenderOptions {
  theme?: "dark" | "light";
  color?: boolean;
}

import { css, styles } from "./style";

export async function renderMermaid (contents: string, options?: RenderOptions): Promise<string> {
  const tmpOutput = join(tmpdir(), `.threatdown-${Date.now()}.svg`);
  const tmpCss = join(tmpdir(), ".threatdown.css");
  const theme = options?.theme ?? "dark";
  const color = options?.color ?? true;
  await writeFile(tmpCss, css);

  let res: (value?: unknown) => void;
  let rej: (err: Error) => void;
  const p = new Promise((_resolve, _reject) => {
    res = _resolve;
    rej = _reject;
  });

  const args = ["--input", "-", "--output", tmpOutput];
  if (color) {
    args.push("--cssFile", tmpCss, "--background", styles[theme].background);
  }
  const mmdc = spawn("mmdc", args, { stdio: "pipe" });

  mmdc.on("error", (err: Error) => {
    rej(err);
  });

  mmdc.on("close", () => {
    res();
  });

  mmdc.stdin.end(contents);
  await p;

  const rendered = await readFile(tmpOutput, { encoding: "utf8" });
  return rendered;
}
