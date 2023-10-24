import { parse } from "./parser/index";
import { compileToMermaid } from "./compiler";
import { renderMermaid } from "./renderer";
import fs from "fs";

// TODO/ remove this later:
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const threatdownRegex = /```threatdown([\s\S]*?)```/g;
const getMermaid = async (mermaidFormatedData: string): Promise<string> => {
  const testSvg = await renderMermaid(mermaidFormatedData);
  return testSvg;
};

// This function will actually crete the svg and json files and write to system
const getThreatdownContent = (trimmedContent: string) => {
  const jsonFormatedData = parse(trimmedContent);
  writeFileType(JSON.stringify(jsonFormatedData), "json");

  const mermaidFormatedData = compileToMermaid(jsonFormatedData);

  // returns the svg
  getMermaid(mermaidFormatedData)
    .then((res: string) => {
      writeFileType(res, "svg");
    })
    .catch((err) => {
      console.log(err);
    });
};

// This function write the svg and json files
const writeFileType = (svg: string, type: string) => {
  fs.writeFile(`threatdown-${Date.now()}.${type}`, svg, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
};

// Define an asynchronous function to process each match
const processMatchAsync = async (match: string, mdEmbeddedType: string) => {
  const cleanMatch = match
    .trim()
    .replace(/^```threatdown/, "")
    .replace(/```$/, "");
  const jsonFormatedData = parse(cleanMatch);
  const mermaidData = compileToMermaid(jsonFormatedData);
  const mermaidSvg = await getMermaid(mermaidData);

  return (
    `<!-- ${match} --> \n` +
    // Render JSON
    `${
      mdEmbeddedType === "json"
        ? "## JSON \n" +
          "```json\n" +
          JSON.stringify(jsonFormatedData) +
          "\n```\n"
        : ""
    }` +
    // Render Mermaid
    `${
      mdEmbeddedType === "mermaid"
        ? "## MERMAID \n" + "```mermaid\n" + mermaidData + "\n```\n"
        : ""
    }` +
    // Render SVG
    `${mdEmbeddedType === "svg" ? "## SVG \n" + "\n" + mermaidSvg + "\n" : ""}`
  );
};

// generate the updated markdown file
export const generateUpdatedMd = async (file: string, mdEmbeddedType: string) => {
  try {
    const threatdownMatches = file.match(threatdownRegex);

    if (!threatdownMatches) {
      throw new Error("No threatdown content found");
    }

    const newFilePromises = threatdownMatches.map((match) =>
      processMatchAsync(match, mdEmbeddedType)
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

// TODO
// remove this, local dev
const fileContent = readFileSync(resolve(process.cwd(), "./test.md"), {
  encoding: "utf8",
});
generateUpdatedMd(fileContent, "mermaid")
  .then((res) => {
    fs.writeFile("test-uodate.md", res, (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
  })
  .catch((err) => {
    console.error(err);
  });
