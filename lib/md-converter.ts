import { parse } from "./parser/index";
import { compileToMermaid } from "./compiler";
import { renderMermaid } from "./renderer";
import fs from "fs";
// TODO
// remove this, local dev
const file = fs.readFileSync("./test.md", "utf8");

const getMermaid = async (mermaidFormatedData: string): Promise<string> => {
  const testSvg = await renderMermaid(mermaidFormatedData);
  return testSvg;
};

// This function will actually crete the svg and json files
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
const processMatchAsync = async (match: string) => {
  const cleanMatch = match
    .trim()
    .replace(/^```threatdown/, "")
    .replace(/```$/, "");
  const jsonFormatedData = parse(cleanMatch);
  const mermaidData = compileToMermaid(jsonFormatedData);

  // Define an asynchronous function to get the Mermaid SVG
  const getMermaidAsync = async (mermaidData: string) => {
    try {
      const res = await getMermaid(mermaidData);
      return res;
    } catch (err) {
      console.error(err);
      return "";
    }
  };

  const mermaidSvg = await getMermaidAsync(mermaidData);

  return (
    `<!-- ${match} --> \n` +
    "## JSON \n" +
    // Render JSON
    "```json\n" +
    JSON.stringify(jsonFormatedData) +
    "\n```\n" +
    "## MERMAID \n" +
    // Render Mermaid
    "```mermaid\n" +
    mermaidData +
    "\n```\n" +
    "## SVG \n" +
    "\n" +
    mermaidSvg +
    "\n"
  );
};

// This function takes a file as input and update it adding the svg and json
const generateUpdateMd = (file: string) => {
  const threatdownRegex = /```threatdown([\s\S]*?)```/g;
  const threatdownMatches = file.match(threatdownRegex);
  console.log(threatdownMatches);

  if (!threatdownMatches) {
    throw new Error("No threatdown content found");
  }

  threatdownMatches.forEach((threatdownContent: string) => {
    const trimmedContent = threatdownContent
      .trim()
      .replace(/^```threatdown/, "")
      .replace(/```$/, "");
    console.log("trimmedContent", trimmedContent);
  });

  const newFilePromises = threatdownMatches.map(processMatchAsync);
  Promise.all(newFilePromises)
    .then((newFileContentArray) => {
      let newFile = file;
      for (let i = 0; i < threatdownMatches.length; i++) {
        newFile = newFile.replace(threatdownMatches[i], newFileContentArray[i]);
      }

      fs.writeFile(`test-update.md`, newFile, (err) => {
        if (err) throw err;
        console.log("The file has been saved!");
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

// TODO
// remove this, local dev
generateUpdateMd(file);
