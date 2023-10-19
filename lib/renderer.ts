import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export async function renderMermaid (contents: string): Promise<string> {
  const tmpOutput = join(tmpdir(), `.threatdown-${Date.now()}.svg`);

  let resolve: (value?: unknown) => void;
  let reject: (err: Error) => void;
  const p = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  const mmdc = spawn("mmdc", ["--input", "-", "--output", tmpOutput], { stdio: "pipe" });

  mmdc.on("error", (err: Error) => {
    reject(err);
  });

  mmdc.on("close", () => {
    resolve();
  });

  mmdc.stdin.end(contents);
  await p;

  const rendered = await readFile(tmpOutput, { encoding: "utf8" });
  return rendered;
}
