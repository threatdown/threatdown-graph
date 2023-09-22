export interface Node {
  assumption?: string;
  condition?: string;
  objective?: string;
  and?: Node[];
  or?: Node[];
  comments?: string[];
  mitigation?: boolean;
  complete?: boolean;
}

export function compileToMermaid (tree: Node): string {
  let indentMultiplier = 0;
  const positionByIdentifier = new Map<string, number>();
  const lines: string[] = [];

  function addLine (content: string) {
    lines.push(`${"  ".repeat(indentMultiplier)}${content}`);
  }

  function identifier (increment: boolean): string {
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

  function addNode (node: Node) {
    if (node.objective) {
      addLine(`${identifier(false)}{${node.objective}}`);
    } else if (node.condition) {
      addLine(`${previousIdentifier()}---${identifier(true)}(${node.condition})`);
    } else if (node.assumption) {
      addLine(`${previousIdentifier()}---${identifier(true)}>${node.assumption}]`);
    }

    if (node.or?.length) {
      indent();
      addLine(`${previousIdentifier()}---${identifier(true)}(((OR)))`);
      indent();
      for (const child of node.or) {
        addNode(child);
      }
      dedent();
      dedent();
    }

    if (node.and?.length) {
      indent();
      addLine(`${previousIdentifier()}---${identifier(true)}(((AND)))`);
      indent();
      for (const child of node.and) {
        addNode(child);
      }
      dedent();
      dedent();
    }
  }

  addLine("flowchart TD");
  indentMultiplier++;
  addNode(tree);

  return lines.join("\n");
}
