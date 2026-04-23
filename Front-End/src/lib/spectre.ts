type Style = any
type Element = any

type Text = string
type Content = Map<RefRule, Text>



type Ref = {
  id: string;
  element: Element;
}

type RefRule = string;
type RefMap = Map<RefRule, Ref>;


export class Spectre {
  private refs: RefMap = new Map();
  private baseGhostStyles: Style;
  private baseAcceptedStyles: Style;

  constructor(
    baseGhostStyles?: Style,
    baseAcceptedStyles?: Style
  ) {
    this.baseGhostStyles = baseGhostStyles ?? {
      color: "rgba(17, 24, 39, 0.45)",   // softer gray (Tailwind gray-900 @ ~45%)
      backgroundColor: "transparent",
      fontStyle: "italic",
      opacity: "0.8",
      letterSpacing: "0.01em",
      transition: "all 0.2s ease",
      caretColor: "transparent",        // removes blinking cursor feel (nice touch for ghost)
    };
    this.baseAcceptedStyles = baseAcceptedStyles ?? {
      color: "#111827",                // strong foreground (gray-900)
      backgroundColor: "transparent",
      fontStyle: "normal",
      opacity: "1",
      letterSpacing: "normal",
      caretColor: "#111827",
      transition: "all 0.2s ease",
    };
  }

  register(rule: RefRule, element: Element) {
    console.log("registering ref: ", rule, element);
    this.refs.set(rule, { id: this.genRefId(), element });
    return element.id
  }

  addRefStyle(id: string, style: string) {
    const ref = this.refs.get(id);
    if (ref) {
      ref.element.style.cssText = style;
    }
    throw new Error(`Could not find ref with id: ${id}`);
  }

  unregister(rule: RefRule) {
    this.deleteRef(rule)
  }


  mount(content: Content) {
    console.log(content);
    console.log("mounting spectre");
    for (const [rule, text] of content) {
      const ref = this.getRef(rule);
      console.log("ref: ", ref);
      if (ref) {
        console.log("setting text: ", text);
        ref.element.value = text;
        console.log("setting style: ", this.baseGhostStyles);
        ref.element.style = this.baseGhostStyles;
      }
    }
  }
  accept(rule: RefRule) {
    console.log("accepting ref style: ", rule);

    const ref = this.getRef(rule);

    if (ref) {
      Object.assign(ref.element.style, this.baseAcceptedStyles);
      console.log("applied style:", ref.element.style);
      return;
    }

    throw new Error(`Could not find ref with id: ${rule}`);
  }
  // accept(rule: RefRule) {
  //   console.log("accepting ref style: ", rule);
  //   const ref = this.getRef(rule)
  //   if (ref) {
  //     ref.element.style = this.baseAcceptedStyles;
  //     console.log("accepting ref: ", ref.element.style);
  //     return;
  //   }
  //   throw new Error(`Could not find ref with id: ${rule}`);
  // }


  private getRef(id: string): Ref | null {
    const ref = this.refs.get(id);
    if (ref) {
      return ref;
    }
    return null;
  }

  deleteRef(id: string) {
    const ref = this.getRef(id);
    if (ref) {
      console.log("deleting ref: ", ref);
      // ref.remove();
    }
    return;
  }

  private genRefId() {
    return `spectre-${Math.random().toString(36).substr(2, 9)}`;
  }
}
