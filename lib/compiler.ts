import { styles } from "./style";

export interface Node {
  assumption?: string;
  condition?: string;
  objective?: string;
  and?: Node[];
  or?: Node[];
  comments?: string[];
  mitigation?: boolean;
  complete?: boolean;
  probability?: string;
}

export interface CompileOptions {
  theme?: "dark" | "light";
  color?: boolean;
}

export function compileToMermaid (tree: Node, options?: CompileOptions): string {
  let indentMultiplier = 0;
  let lineCount = 0;
  const theme = options?.theme ?? "dark";
  const color = options?.color ?? true;
  const positionByIdentifier = new Map<string, number>();
  const lines: string[] = [];
  const styleModifiers: Record<string, string[]> = {};

  function addLine (content: string) {
    lines.push(`${"  ".repeat(indentMultiplier)}${content}`);
  }

  function nextIdentifier (increment: boolean): string {
    const identifierPrefix = String.fromCharCode(64 + indentMultiplier);
    let identifierPosition = positionByIdentifier.get(identifierPrefix) ?? 0;
    if (increment) {
      identifierPosition += 1;
    }

    positionByIdentifier.set(identifierPrefix, identifierPosition);
    return `${identifierPrefix}${identifierPosition}`;
  }

  function previousIdentifier () {
    const identifierPrefix = String.fromCharCode(64 + indentMultiplier - 1);
    const identifierPosition = positionByIdentifier.get(identifierPrefix) ?? 0;
    return `${identifierPrefix}${identifierPosition}`;
  }

  function indent () {
    indentMultiplier += 1;
  }

  function dedent () {
    indentMultiplier -= 1;
  }

  const objectiveClass = color ? ":::objective" : "";
  const conditionClass = color ? ":::condition" : "";
  const assumptionClass = color ? ":::assumption" : "";
  const booleanOrClass = color ? ":::booleanOr": "";
  const booleanAndClass = color ? ":::booleanAnd": "";

  function addNode (node: Node) {
    if (node.objective) {
      addLine(`${nextIdentifier(false)}{${node.objective}}${objectiveClass}`);
      lineCount++;
    } else if (node.condition) {
      if (node.mitigation) {
        if (node.complete) {
          addLine(`${previousIdentifier()}-- mitigated by ---${nextIdentifier(true)}(${node.condition})${conditionClass}`);
          styleModifiers[nextIdentifier(false)] = [styles[theme].modifiers.mitigation, styles[theme].modifiers.complete];
          lineCount++;
        } else {
          addLine(`${previousIdentifier()}-. mitigated by .-${nextIdentifier(true)}(${node.condition})${conditionClass}`);
          styleModifiers[nextIdentifier(false)] = [styles[theme].modifiers.mitigation];
          lineCount++;
        }
      } else {
        addLine(`${previousIdentifier()}---${nextIdentifier(true)}(${node.condition})${conditionClass}`);
        lineCount++;
      }
    } else if (node.assumption) {
      if (node.mitigation) {
        if (node.complete) {
          addLine(`${previousIdentifier()}-- mitigated by ---${nextIdentifier(true)}>${node.assumption}]${assumptionClass}`);
          styleModifiers[nextIdentifier(false)] = [styles[theme].modifiers.mitigation, styles[theme].modifiers.complete];
          lineCount++;
        } else {
          addLine(`${previousIdentifier()}-. mitigated by .-${nextIdentifier(true)}>${node.assumption}]${assumptionClass}`);
          styleModifiers[nextIdentifier(false)] = [styles[theme].modifiers.mitigation];
          lineCount++;
        }
      } else {
        addLine(`${previousIdentifier()}---${nextIdentifier(true)}>${node.assumption}]${assumptionClass}`);
        lineCount++;
      }
    }

    const orCount = node.or?.length ?? 0;
    if (orCount === 1) {
      indent();
      // non-null assertion safe due to length check above
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      addNode(node.or![0]);
      dedent();
    } else if (orCount > 1) {
      indent();
      addLine(`${previousIdentifier()}---${nextIdentifier(true)}(((OR)))${booleanOrClass}`);
      lineCount++;
      indent();
      // non-null assertion safe due to length check above
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      for (const child of node.or!) {
        addNode(child);
      }
      dedent();
      dedent();
    }

    const andLength = node.and?.length ?? 0;
    if (andLength === 1) {
      indent();
      // non-null assertion safe due to length check above
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      addNode(node.and![0]);
      dedent();
    } else if (andLength > 1) {
      indent();
      addLine(`${previousIdentifier()}---${nextIdentifier(true)}(((AND)))${booleanAndClass}`);
      lineCount++;
      indent();
      // non-null assertion safe due to length check above
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      for (const child of node.and!) {
        addNode(child);
      }
      dedent();
      dedent();
    }
  }

  addLine("flowchart TD");
  indentMultiplier++;
  addNode(tree);

  // not sure why the linter thinks this is always true, but it's not
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (color) {
    addLine(`classDef objective ${styles[theme].objective}`);
    addLine(`classDef condition ${styles[theme].condition}`);
    addLine(`classDef assumption ${styles[theme].assumption}`);
    addLine(`classDef booleanAnd ${styles[theme].booleanAnd}`);
    addLine(`classDef booleanOr ${styles[theme].booleanOr}`);
    for (const [identifier, modifiers] of Object.entries(styleModifiers)) {
      const filteredModifiers = modifiers.filter((modifier) => !!modifier); // remove empty strings
      if (!filteredModifiers.length) {
        continue;
      }

      addLine(`style ${identifier} ${filteredModifiers.join(",")}`);
    }
    // TODO: need to pre-process the tree and sort out modifiers for links instead of styling them all the same
    addLine(`linkStyle ${[...Array(lineCount - 1).keys()].join(",")} ${styles[theme].link}`);
  }

  return lines.join("\n");
}
