# threatdown

`threatdown` creates visualizations from **threatdown** formatted text.

## Usage

```shell
> npx threatdown my-threatdown.td
# OR
> npx threatdown my-markdown.md
```

When provided a threatdown file (with the extension `.td`) the entire file is parsed as threatdown. When provided a markdown file (with the extension `.md`) the markdown will be read, and threatdown code blocks found inside will be commented out and parsed output inserted in its place.

### Options

`--type <outputType>`: outputType must be one of `json`, `mermaid` or `svg` (defaults to `mermaid`)
`--output <outputPath>`: writes the parsed results to the file `outputPath`, if unspecified results will be logged instead of written

## What is threatdown? 

Threatdown is a simple and familiar notation syntax for documenting attack trees in describing threat models. 

Threatdown is an open standard that can be interpreted into a [mermaid](https://mermaid.js.org) graph using the `threatdown` tool.

Threatdown looks like this:

```threatdown

__Root attacker goal__
- method which in order to be viable
  + requires both this condition to be true
    + [ ] TODO that would mitigate this
    + [x] install condition blocker (#31, #35)
  + AND this condition, which depends on either
    - x to be true
    - or y to be true
- another method 
  - a condition that depends on some assumptions
     +? this might be a problem
     +? but only if this is also a problem
  - another condition

```

From which threatdown-graph will produce:

```mermaid
flowchart TD
  A0{Root attacker goal}
    A0---B1(((OR)))
      B1---C1(method which in order to be viable)
        C1---D1(((AND)))
          D1---E1(requires both this condition to be true)
            E1---F1(((AND)))
              F1-. mitigated by .-G1(TODO that would mitigate this)
              F1-- mitigated by ---G2(install condition blocker (#31, #35))
          D1---E2(AND this condition, which depends on either)
            E2---F2(((OR)))
              F2---G3(x to be true)
              F2---G4(or y to be true)
      B1---C2(another method )
        C2---D2(((OR)))
          D2---E3(a condition that depends on some assumptions)
            E3---F3(((AND)))
              F3---G5>this might be a problem]
              F3---G6>but only if this is also a problem]
          D2---E4(another condition)
```
