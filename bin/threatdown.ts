#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { extname, resolve } from "node:path";
import { parseArgs } from "node:util";

import {
  parse,
  compileToMermaid,
  generateUpdatedMd,
  renderMermaid,
} from "../lib";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    color: {
      type: "boolean",
      default: true,
    },
    "no-color": {
      type: "boolean",
      default: false,
    },
    output: {
      type: "string",
      short: "o",
    },
    type: {
      type: "string",
      short: "t",
      default: "svg",
    },
  },
});

function usage() {
  console.log(`Usage: threatdown <filename>

  <filename>         Must have extension \`.td\` or \`.md\`
  --output <output>  Write result to file <output>
  --type <type>      Change output type, must be one of "json", "mermaid" or "svg", defaults to "svg"
  --color/--no-color Enable or disable styling of results, defaults to \`true\`
`);
}

async function main() {
  if (positionals.length !== 1) {
    return usage();
  }

  // non-null assertion safe because we already checked for length
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const inputFile = positionals.shift()!;
  const inputFileExt = extname(inputFile);

  // non-null assertion safe because the outputType has a default
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (
    !values.type ||
    !["json", "mermaid", "svg"].includes(values.type) ||
    ![".md", ".td"].includes(inputFileExt)
  ) {
    process.exitCode = 1;
    return usage();
  }

  const fileContent = readFileSync(resolve(process.cwd(), inputFile), {
    encoding: "utf8",
  });

  const color = values["no-color"] ? false : values.color;

  if (inputFileExt === ".md") {
    const markdownContent = await generateUpdatedMd(fileContent, { type: values.type, color });
    if (values.output) {
      writeFileSync(resolve(process.cwd(), values.output), markdownContent);
    } else {
      console.log(markdownContent);
    }
  } else if (inputFileExt === ".td") {
    const parsedContent = parse(fileContent);
    if (values.type === "json") {
      if (values.output) {
        writeFileSync(resolve(process.cwd(), values.output), JSON.stringify(parsedContent, null, 2));
      } else {
        console.log(JSON.stringify(parsedContent, null, 2));
      }

      return;
    }

    const mermaidContent = compileToMermaid(parsedContent, { color });
    if (values.type === "mermaid") {
      if (values.output) {
        writeFileSync(resolve(process.cwd(), values.output), mermaidContent);
      } else {
        console.log(mermaidContent);
      }

      return;
    }

    const svgContent = await renderMermaid(mermaidContent, { color });
    if (values.type === "svg") {
      if (values.output) {
        writeFileSync(resolve(process.cwd(), values.output), svgContent);
      } else {
        console.log(svgContent);
      }
    }

    return;
  }
}

main().catch((err: Error) => {
  process.exitCode = 1;
  console.error(err.stack);
});
