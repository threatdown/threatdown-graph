export interface Objective {
  objective: string;

  and?: Child[];
  or?: Child[];
  comments?: string[];
}

export interface Condition {
  condition: string;
  and?: Child[];
  or?: Child[];
  comments?: string[];
  mitigation?: boolean;
  complete?: boolean;
}

export interface Assumption {
  assumption: string;
  and?: Child[];
  or?: Child[];
  comments?: string[];
  mitigation?: boolean;
  complete?: boolean;
}

export type Child = Assumption | Condition;

export function createObjective (name: string, children?: RawCondition[]): Objective {
  const result: Objective = {
    objective: name,
  };

  if (children?.length) {
    Object.assign(result, mergeConditions(children));
  }

  return result;
}

export function createComment (comment: string): { comment: string } {
  return { comment };
}

export interface ParsedCondition {
  boolean: "-" | "+";
  isAssumption?: "?";
  isMitigation?: "[ ]" | "[x]" | "[X]";
  children?: RawCondition[];
  line: string;
}

export function createChild ({ boolean, isAssumption, line, children, isMitigation }: ParsedCondition): Child {
  const bool = boolean === "-" ? "or" : "and";

  const parsedMessage = isAssumption === "?"
    ? { assumption: line }
    : { condition: line };

  const parsedMitigation = isMitigation
    ? isMitigation === "[ ]"
      ? { mitigation: true, complete: false }
      : { mitigation: true, complete: true }
    : {};

  const parsedChildren = children
    ? mergeConditions(children)
    : {};

  const result: unknown = {
    [bool]: {
      ...parsedMessage,
      ...parsedMitigation,
      ...parsedChildren,
    },
  };

  return result as Child;
}

interface RawCondition {
  or?: Condition;
  and?: Condition;
  comment?: string;
}

interface MergedConditions {
  and?: Condition[];
  or?: Condition[];
  comments?: string[];
}

export function mergeConditions (conditions: RawCondition[]): MergedConditions {
  const result: MergedConditions = {};

  for (const condition of conditions) {
    if (condition.and) {
      result.and = result.and ?? [];
      result.and.push(condition.and);
    }

    if (condition.or) {
      result.or = result.or ?? [];
      result.or.push(condition.or);
    }

    if (condition.comment) {
      result.comments = result.comments ?? [];
      result.comments.push(condition.comment);
    }
  }

  return result;
}
