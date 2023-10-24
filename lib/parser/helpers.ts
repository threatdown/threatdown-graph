export type BooleanInput = "-" | "+";
export type BooleanOutput = "or" | "and";
export function parseBoolean(operation: BooleanInput): BooleanOutput {
  return operation === "-" ? "or" : "and";
}

export type MitigationInput = "[ ]" | "[x]" | "[X]";
export interface MitigationOutput {
  mitigation: true;
  complete: boolean;
}
export function parseMitigation(mitigation?: MitigationInput): MitigationOutput | undefined {
  if (!mitigation) {
    return undefined;
  }

  const result: MitigationOutput = {
    mitigation: true,
    complete: mitigation !== "[ ]",
  };

  return result;
}

export type ProbabilityInput = "(high)" | "(H)" | ("medium") | "(M)" | "(low)" | "(L)";
export interface ProbabilityOutput {
  probability: "high" | "medium" | "low";
}
export function parseProbability(probability?: ProbabilityInput): ProbabilityOutput | undefined {
  if (!probability) {
    return undefined;
  }

  if (["(high)", "(H)"].includes(probability)) {
    return { probability: "high" };
  }

  if (["(medium)", "(M)"].includes(probability)) {
    return { probability: "medium" };
  }

  if (["(low)", "(L)"].includes(probability)) {
    return { probability: "low" };
  }

  return undefined;
}

export interface RawChild {
  and?: Child;
  or?: Child;
  comment?: string;
}
export interface RawChildren {
  and?: Child[];
  or?: Child[];
  comments?: string[];
}
export function parseChildren(children?: RawChild[]): RawChildren {
  const result: RawChildren = {};
  if (!children) {
    return result;
  }

  for (const child of children) {
    if (child.and) {
      result.and = result.and ?? [];
      result.and.push(child.and);
    }

    if (child.or) {
      result.or = result.or ?? [];
      result.or.push(child.or);
    }

    if (child.comment) {
      result.comments = result.comments ?? [];
      result.comments.push(child.comment);
    }
  }

  return result;
}

export interface ChildInput {
  line: string;
  boolean: BooleanInput;
  children?: RawChild[];
  mitigation?: MitigationInput;
  probability?: ProbabilityInput;
}

export interface Assumption {
  assumption: string;
  comments?: string[];
  mitigation?: boolean;
  probability?: "high" | "medium" | "low";
  complete?: boolean;
}

// TODO: this should require that one of these keys is set, but never more or less than 1
export interface AssumptionChild {
  and?: Assumption;
  or?: Assumption;
}

export function createAssumption({ line, boolean, mitigation, probability, children }: ChildInput): AssumptionChild {
  const parsedLine = parseLine(line);
  const parsedBoolean = parseBoolean(boolean);
  const parsedMitigation = parseMitigation(mitigation);
  const parsedProbability = parseProbability(probability);
  const parsedChildren = parseChildren(children);

  const result: AssumptionChild = {
    [parsedBoolean]: {
      assumption: parsedLine,
      ...parsedMitigation,
      ...parsedProbability,
      ...parsedChildren,
    },
  };

  return result;
}

export interface Condition {
  condition: string;
  comments?: string[];
  mitigation?: boolean;
  probability?: "high" | "medium" | "low";
  complete?: boolean;
}

// TODO: this should require that one of these keys is set, but never more or less than 1
export interface ConditionChild {
  and?: Condition;
  or?: Condition;
}

export function createCondition({ line, boolean, mitigation, probability, children }: ChildInput): ConditionChild {
  const parsedLine = parseLine(line);
  const parsedBoolean = parseBoolean(boolean);
  const parsedMitigation = parseMitigation(mitigation);
  const parsedProbability = parseProbability(probability);
  const parsedChildren = parseChildren(children);

  return {
    [parsedBoolean]: {
      condition: parsedLine,
      ...parsedMitigation,
      ...parsedProbability,
      ...parsedChildren,
    },
  };
}

export type Child = AssumptionChild | ConditionChild;

export interface Objective {
  objective: string;
  comments?: string[];
  and?: Child[];
  or?: Child[];
}

export interface ObjectiveInput {
  line: string;
  children?: RawChild[];
}

export function createObjective({ line, children }: ObjectiveInput): Objective {
  return {
    objective: parseLine(line),
    ...parseChildren(children),
  };
}

export function parseLine (line: string | string[]): string {
  if (Array.isArray(line)) {
    return line.join("");
  }

  return line;
}
