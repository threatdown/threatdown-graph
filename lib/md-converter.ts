import { parse } from "./parser/index";
import { compileToMermaid } from "./compiler";
import { renderMermaid } from "./renderer";

const threatdownRegex = /```threatdown([\s\S]*?)```/g;

const getMermaidSvg = async (mermaidFormatedData: string, options: GenerateUpdatedMdOptions): Promise<string> => {
  const testSvg = await renderMermaid(mermaidFormatedData, options);
  return testSvg;
};

const cleanThreatdownBlocks = (input: string) => {
  return input
    .trim()
    .replace(/^```threatdown/, "")
    .replace(/```$/, "");
};

// Define an asynchronous function to process each match
const processMatchAsync = async (
  match: string,
  options: GenerateUpdatedMdOptions
): Promise<string> => {
  const mdEmbeddedType = options.type;
  const cleanMatch = cleanThreatdownBlocks(match);
  const jsonFormatedData = parse(cleanMatch);
  const mermaidRaw = compileToMermaid(jsonFormatedData, options);
  let mermaidSvg = "";
  if (mdEmbeddedType === "svg") {
    mermaidSvg = await getMermaidSvg(mermaidRaw, options);
  }

  return (
    `<!-- ${match} --> \n` +
    // Render Mermaid
    `${
      mdEmbeddedType === "json"
        ? "```json\n" + JSON.stringify(jsonFormatedData) + "\n```\n"
        : ""
    }` +
    // Render Mermaid
    `${
      mdEmbeddedType === "mermaid"
        ? "```mermaid\n" + mermaidRaw + "\n```\n"
        : ""
    }` +
    // Render SVG
    `${mdEmbeddedType === "svg" ? "\n" + mermaidSvg + "\n" : ""}`
  );
};

interface GenerateUpdatedMdOptions {
  type: string;
  theme?: "dark" | "light";
  color?: boolean;
}

// generate the updated markdown file
export const generateUpdatedMd = async (
  file: string,
  options: GenerateUpdatedMdOptions
): Promise<string> => {
  try {
    const threatdownMatches = file.match(threatdownRegex);

    if (!threatdownMatches) {
      throw new Error("No threatdown content found");
    }

    const newFilePromises = threatdownMatches.map((match) =>
      processMatchAsync(match, options)
    );
    const newFileContentArray = await Promise.all(newFilePromises);

    let newFile = file;
    for (let i = 0; i < threatdownMatches.length; i++) {
      newFile = newFile.replace(threatdownMatches[i], newFileContentArray[i]);
    }

    return newFile;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
