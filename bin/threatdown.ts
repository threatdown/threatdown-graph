#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";

import {
  parse,
  compileToMermaid,
  renderMermaid,
} from "../lib";

const {
  values,
  positionals,
} = parseArgs({
  allowPositionals: true,
  options: {
    output: {
      type: "string",
      short: "o",
    },
    outputType: {
      type: "string",
      alias: "type",
      short: "t",
      default: "mermaid",
    },
  },
});

function usage () {
  console.log(`Usage: threatdown <filename>

  --output <output>  Write result to file <output>
  --type <type>      Change output type, must be one of "json", "mermaid" or "svg"
`);
}

async function main () {
  const inputFile = positionals.shift();
  // non-null assertion safe because the outputType has a default
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (!inputFile || !["json", "mermaid", "svg"].includes(values.outputType!)) {
    usage();
  } else {
    const fileContent = readFileSync(resolve(process.cwd(), inputFile), { encoding: "utf8" });
    const parsedContent = parse(fileContent);
    if (values.outputType === "json") {
      if (values.output) {
        writeFileSync(resolve(process.cwd(), values.output), JSON.stringify(parsedContent, null, 2));
      } else {
        console.log(JSON.stringify(parsedContent, null, 2));
      }
      return;
    }

    const mermaidContent = compileToMermaid(parsedContent);
    if (values.outputType === "mermaid") {
      if (values.output) {
        writeFileSync(resolve(process.cwd(), values.output), mermaidContent);
      } else {
        console.log(mermaidContent);
      }
      return;
    }

    const svgContent = await renderMermaid(mermaidContent);
    if (values.outputType === "svg") {
      if (values.output) {
        writeFileSync(resolve(process.cwd(), values.output), svgContent);
      } else {
        console.log(svgContent);
      }
    }
  }
}

main()
  .catch((err: Error) => {
    process.exitCode = 1;
    console.error(err.stack);
  });
