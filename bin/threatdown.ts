#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { generateUpdatedMd } from "../lib";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    output: {
      type: "string",
      short: "o",
    },
    type: {
      type: "string",
      short: "t",
      default: "mermaid",
    },
  },
});

function usage() {
  console.log(`Usage: threatdown <filename>

  --output <output>  Write result to file <output>
  --type <type>      Change output type, must be one of "json", "mermaid" or "svg"
`);
}

async function main() {
  const inputFile = positionals.shift();
  // non-null assertion safe because the outputType has a default
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (
    !inputFile ||
    !values.type ||
    !["json", "mermaid", "svg"].includes(values.type)
  ) {
    usage();
  } else {
    const fileContent = readFileSync(resolve(process.cwd(), inputFile), {
      encoding: "utf8",
    });
    const updatedMarkdown = await generateUpdatedMd(fileContent, values.type);
    if (values.output) {
      const safeOutput = values.output.includes(".md") ? values.output : `${values.output}.md`;
      writeFileSync(resolve(process.cwd(), safeOutput), updatedMarkdown);
    } else {
      console.log(updatedMarkdown);
    }
    return;
  }
}

main().catch((err: Error) => {
  process.exitCode = 1;
  console.error(err.stack);
});
