// the contents of this variable get written to a temporary file and passed via --cssFile to the mermaid cli
export const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz@9..40&amp;display=swap');
* {
  font-family: 'DM Sans', sans-serif;
  word-wrap: break-word;
  white-space: normal;
}
`;

// these styles get inlined into the mermaid code
export const styles = {
  dark: {
    objective: "stroke:#880000",
    condition: "stroke:#008800",
    assumption: "stroke:#000088",
    booleanAnd: "fill:#880000",
    booleanOr: "fill:008800",
    link: "stroke:#666666",
    mitigatedLink: "stroke:#66AA66",
    modifiers: {
      mitigation: "",
      complete: "color:#00FF00",
    },
  },
  light: {
    objective: "stroke:#FF0000",
    condition: "stroke:#00FF00",
    assumption: "stroke:#0000FF",
    booleanAnd: "fill:#FF0000",
    booleanOr: "fill:#00FF00",
    link: "stroke:#FFFFFF",
    mitigatedLink: "stroke:#AAFFAA",
    modifiers: {
      mitigation: "",
      complete: "color:#00FF00",
    },
  },
};
