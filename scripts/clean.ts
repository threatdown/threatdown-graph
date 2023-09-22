#!/usr/bin/env ts-node
// This file is managed by code-skeleton. Do not make changes.

import { rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "child_process";

const ROOT = dirname(__dirname);
const lsFilesResult = spawnSync("git", ["ls-files", "--other", "--ignored", "--exclude-standard", "--directory"], {
  cwd: ROOT,
  shell: true,
  encoding: "utf8",
});

const toRemove = lsFilesResult.stdout.split("\n")
  .filter(Boolean)
  .filter((file) => file !== "node_modules/");

for (const file of toRemove) {
  rmSync(join(ROOT, file), { recursive: true });
}
