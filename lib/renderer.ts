import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { css } from "./style";

export async function renderMermaid (contents: string): Promise<string> {
  const tmpOutput = join(tmpdir(), `.threatdown-${Date.now()}.svg`);
  const tmpCss = join(tmpdir(), ".threatdown.css");
  await writeFile(tmpCss, css);

  let res: (value?: unknown) => void;
  let rej: (err: Error) => void;
  const p = new Promise((_resolve, _reject) => {
    res = _resolve;
    rej = _reject;
  });

  const mmdc = spawn("mmdc", ["--input", "-", "--output", tmpOutput, "--cssFile", tmpCss], { stdio: "pipe" });

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
