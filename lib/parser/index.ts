// @ts-expect-error peggy gives us javascript, ignore it
import * as parser from "./tree.js";
import { type Node } from "../compiler";

export function parse (threatdown: string): Node {
  return parser.parse(threatdown) as Node;
}
