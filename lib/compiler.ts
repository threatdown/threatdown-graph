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

    const orCount = node.or?.length ?? 0;
    if (orCount === 1) {
      indent();
      // non-null assertion safe due to length check above
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      addNode(node.or![0]);
      dedent();
    } else if (orCount > 1) {
      indent();
      addLine(`${previousIdentifier()}---${identifier(true)}(((OR)))`);
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
      addLine(`${previousIdentifier()}---${identifier(true)}(((AND)))`);
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

  return lines.join("\n");
}
