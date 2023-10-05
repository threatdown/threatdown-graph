import t from "tap";
import { parse } from "../lib/parser";

void t.test("objectives", (t) => {
  void t.test("can parse a bare objective", (t) => {
    const parsed = parse("__my objective__");

    t.same(parsed, {
      objective: "my objective",
    });

    t.end();
  });

  void t.test("can parse an objective with leading empty lines", (t) => {
    const parsed = parse("\n\n__my objective__");

    t.same(parsed, {
      objective: "my objective",
    });

    t.end();
  });

  void t.test("can parse an objective with trailing empty lines", (t) => {
    const parsed = parse("__my objective__\n\n");

    t.same(parsed, {
      objective: "my objective",
    });

    t.end();
  });

  t.end();
});

void t.test("conditions", (t) => {
  void t.test("can define an indented OR condition", (t) => {
    const parsed = parse("__my objective__\n  - some condition");

    t.same(parsed, {
      objective: "my objective",
      or: [{
        condition: "some condition",
      }],
    });

    t.end();
  });

  void t.test("can define an indented AND condition", (t) => {
    const parsed = parse("__my objective__\n  + some condition");

    t.same(parsed, {
      objective: "my objective",
      and: [{
        condition: "some condition",
      }],
    });

    t.end();
  });

  void t.test("can define a non-indented OR condition", (t) => {
    const parsed = parse("__my objective__\n- some condition");

    t.same(parsed, {
      objective: "my objective",
      or: [{
        condition: "some condition",
      }],
    });

    t.end();
  });

  void t.test("can define a non-indented AND condition", (t) => {
    const parsed = parse("__my objective__\n+ some condition");

    t.same(parsed, {
      objective: "my objective",
      and: [{
        condition: "some condition",
      }],
    });

    t.end();
  });

  t.end();
});
