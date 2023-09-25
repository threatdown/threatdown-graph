{{
  let root = module;
  while (root.parent) {
    root = root.parent;
  }

  const { join } = require('path');
  const {
    createChild,
    createComment,
    createObjective,
  } = require('./helpers.js');
}}

{
  const indentStack = [];
  let indent = "";
  let pos = 0;
}

start =
  o:Objective
  { return o; }

Objective = EOL? "__" line:(!EOL !"__" c:. { return c; })+ "__" EOL?
  children:( indent:INDENT? c:Child* dedent:DEDENT? { return c; })? EOL*
  { return createObjective(line.join(""), children) }

Condition =
  SAME_INDENT boolean:[-+] isAssumption:"?"? ws* isMitigation:("[ ]" / "[x]" / "[X]")? ws* line:(!EOL c:. { return c })+ EOL?
  children:(INDENT c:Child* DEDENT { return c })?
  { return createChild({ boolean, isAssumption, line: line.join(""), children, isMitigation }) }

Comment = SAME_INDENT ">" ws* comment:(!EOL c:. { return c })+ EOL?
  { return createComment(comment.join("")) }

Child = Condition / Comment

ws = " " / "\t"

EOL = "\r\n" / "\n"

SAME_INDENT = i:[ \t]* &{ return i.length == indent.length; }

INDENT = &(i:[ \t]+ &{ return i.length > indent.length; }
  { indentStack.push(indent); indent = i.join(""); pos = offset; return indent; })

DEDENT = &"" { indent = indentStack.pop(); return indent; }

