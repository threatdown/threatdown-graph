{{
  let root = module;
  while (root.parent) {
    root = root.parent;
  }

  const { join } = require('path');
  const {
    createAssumption,
    createCondition,
    createObjective,
  } = require('./helpers.js');
}}

{
  const indentStack = [];
  let indent = "";
  let pos = 0;
}

start =
  objective:Objective
  { return objective; }

Objective =
  EOL* "__" line:(!EOL !"__" char:. { return char })+ "__" EOL*
  children:(IndentedChildren / SameIndentChildren)? EOL*
  { return createObjective({ line, children }) }

Assumption =
  SAME_INDENT boolean:Boolean "?" WS mitigation:Mitigation? WS probability:Probability? line:LineToEnd EOL?
  children:IndentedChildren? EOL*
  { return createAssumption({ boolean, mitigation, probability, line, children }) }

Condition =
  SAME_INDENT boolean:Boolean WS mitigation:Mitigation? WS probability:Probability? line:LineToEnd EOL?
  children:IndentedChildren? EOL*
  { return createCondition({ boolean, mitigation, probability, line, children }) }

Comment =
  SAME_INDENT ">" WS comment:LineToEnd EOL?
  { return { comment } }

IndentedChildren =
  INDENT child:(Child)+ DEDENT
  { return child }

SameIndentChildren =
  child:(Child)+
  { return child }

Child = Assumption / Condition / Comment

Boolean = "-" / "+"

Mitigation = "[ ]" / "[x]" / "[X]"

Probability = "(high)" / "(H)" / "(medium)" / "(M)" / "(low)" / "(L)"

LineToEnd = (!EOL char:. { return char })+

WS = [ \t]*

EOL = "\r\n" / "\n"

SAME_INDENT = i:[ \t]* &{ return i.length == indent.length; }

INDENT = &(i:[ \t]+ &{ return i.length > indent.length; }
  { indentStack.push(indent); indent = i.join(""); pos = offset; return indent; })

DEDENT = &"" { indent = indentStack.pop(); return indent; }
