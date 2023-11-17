const colors = {
  white: "#ffffff",
  n100: "#0c0b0e",
  n90: "#1d1b26",
  n85: "#22202d",
  n80: "#2e2b3b",
  n70: "#312e40",
  n60: "#3e3b4e",
  n50: "#4b4759",
  n40: "#565266",
  n30: "#6b6680",
  n20: "#8d8a99",
  n10: "#adabb2",
  n5: "#c4c2cc",
  n2: "#e6e6e6",
  y5: "#ffe878",
  y1: "#ffec91",
  b80: "#4a3dff",
  b70: "#5f3dff",
  b60: "#7549ff",
  b50: "#7f5bff",
  b40: "#7f63ef",
  b30: "#9385ff",
  b20: "#9e99ff",
};

const defaults = {
  strokeWidth: "2px",
};
// the contents of this variable get written to a temporary file and passed via --cssFile to the mermaid cli
export const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz@9..40&amp;display=swap');
#my-svg * {
  font-family: 'DM Sans', sans-serif;
  word-wrap: break-word;
  white-space: normal;
}
`;

// these styles get inlined into the mermaid code
export const styles = {
  dark: {
    background: colors.n90,
    objective: `fill:${colors.n100},color:${colors.white},stroke:${colors.n60},stroke-width:${defaults.strokeWidth}`,
    condition: `fill:${colors.n100},color:${colors.white},stroke:${colors.n60},stroke-width:${defaults.strokeWidth}`,
    assumption: `fill:${colors.n100},color:${colors.white},stroke:${colors.n60},stroke-width:${defaults.strokeWidth}`,
    booleanAnd: `fill:${colors.b80},color:${colors.white},stroke:${colors.white},stroke-width:${defaults.strokeWidth}, padding-right: 4px`,
    booleanOr: `fill:${colors.b80},color:${colors.white},stroke:${colors.white},stroke-width:${defaults.strokeWidth}, padding-right: 4px`,
    link: `stroke:${colors.b80},stroke-width:${defaults.strokeWidth}`,
    mitigatedLink: `stroke:${colors.b80},stroke-width:${defaults.strokeWidth}`,
    modifiers: {
      mitigation: `stroke:${colors.b80},stroke-width:${defaults.strokeWidth}`,
      complete: `fill:${colors.n100},color:${colors.white},stroke:${colors.n60},stroke-width:${defaults.strokeWidth}`,
    },
  },
  light: {
    background: "white",
    objective: "stroke:#FF0000",
    condition: "stroke:#00FF00",
    assumption: "stroke:#0000FF",
    booleanAnd: "fill:#FF0000",
    booleanOr: "fill:#00FF00",
    link: "stroke:${colors.white}",
    mitigatedLink: "stroke:#AAFFAA",
    modifiers: {
      mitigation: "",
      complete: "color:#00FF00",
    },
  },
};
