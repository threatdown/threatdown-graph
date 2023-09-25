# threatdown-graph

`threatdown-graph` creates visualizations from **threatdown** formatted text.

## Usage

- TODO

## What is threatdown? 

Threatdown is a simple and familiar notation syntax for documenting attack trees in describing threat models. 

Threatdown is an open standard that can be interpreted into a [mermaid](https://mermaid.js.org) graph using `threatdown-graph`.

Threatdown looks like this:

```threatdown

__Root attacker goal__
- method which in order to be viable
  + requires both this condition to be true
    [ ] TODO that would mitigate this
    [x] install condition blocker (#31, #35)
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

- TODO
