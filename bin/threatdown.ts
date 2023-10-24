#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";

import {
  parse,
  compileToMermaid,
  renderMermaid,
  generateUpdatedMd,
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
    type: {
      type: "string",
      short: "t",
      default: "mermaid",
    },
    mdEmbeddedType: {
      type: "string",
      default: "mermaid",
    }
  },
});

function usage () {
  console.log(`Usage: threatdown <filename>

  --output <output>  Write result to file <output>
  --type <type>      Change output type, must be one of "json", "mermaid", "svg" or "md"
  --mdEmbeddedType <type>    Choose the mdEmbeddedType you want in the updated Markdown  must be one of "mermaid", "svg"
`);
}

async function main () {

  const inputFile = positionals.shift();
  // non-null assertion safe because the outputType has a default
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (!inputFile || !["json", "mermaid", "svg", "md"].includes(values.type!)) { // TODO add md as option here
    usage();
  } else {
    const fileContent = readFileSync(resolve(process.cwd(), inputFile), { encoding: "utf8" });
    const parsedContent = parse(fileContent);
    if (values.type === "json") {
      if (values.output) {
        writeFileSync(resolve(process.cwd(), values.output), JSON.stringify(parsedContent, null, 2));
      } else {
        console.log(JSON.stringify(parsedContent, null, 2));
      }
      return;
    }

    const mermaidContent = compileToMermaid(parsedContent);
    if (values.type === "mermaid") {
      if (values.output) {
        writeFileSync(resolve(process.cwd(), values.output), mermaidContent);
      } else {
        console.log(mermaidContent);
      }
      return;
    }

    const svgContent = await renderMermaid(mermaidContent);
    if (values.type === "svg") {
      if (values.output) {
        writeFileSync(resolve(process.cwd(), values.output), svgContent);
      } else {
        console.log(svgContent);
      }
      return;
    }

    //!! untested yet
    if (values.type === "md") {
      if (!values.mdEmbeddedType || !["mermaid", "svg"].includes(values.mdEmbeddedType)) {
        usage();
      } else {
        const updatedMarkdown = await generateUpdatedMd(fileContent, values.mdEmbeddedType);
        if (values.output) {
          writeFileSync(resolve(process.cwd(), values.output), updatedMarkdown);
        } else {
          console.log(updatedMarkdown);
        }
      }
      return;
    }
  }
}

main()
  .catch((err: Error) => {
    process.exitCode = 1;
    console.error(err.stack);
  });
