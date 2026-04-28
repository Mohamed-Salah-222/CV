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
    this.refs.set(rule, { id: this.genRefId(), element });
    return element.id;
  }

  addRefStyle(id: string, style: string) {
    const ref = this.refs.get(id);
    if (ref) {
      ref.element.style.cssText = style;
      return;
    }
    throw new Error(`Could not find ref with id: ${id}`);
  }

  unregister(rule: RefRule) {
    this.deleteRef(rule);
  }

  mount(content: Content) {
    for (const [rule, text] of content) {
      const ref = this.getRef(rule);
      if (ref) {
        if ('value' in ref.element) {
          ref.element.value = text;
        } else {
          ref.element.textContent = text;
        }
        Object.assign(ref.element.style, this.baseGhostStyles);
      }
    }
  }

  accept(rule: RefRule) {
    const ref = this.getRef(rule);
    if (ref) {
      Object.assign(ref.element.style, this.baseAcceptedStyles);
      return;
    }
    throw new Error(`Could not find ref with id: ${rule}`);
  }

  // --- Inline Ghost Text Support for contentEditable ---

  showInline(rule: RefRule, text: string) {
    const ref = this.getRef(rule);
    if (!ref) return;

    this.clearInline(rule); // Ensure no old spans exist

    // Find the current text node and append the ghost span
    const el = ref.element as HTMLElement;
    
    // Check if it's a contentEditable div
    if (el.isContentEditable) {
      const span = document.createElement('span');
      span.className = 'spectre-inline-ghost';
      span.contentEditable = 'false';
      span.textContent = text;
      Object.assign(span.style, this.baseGhostStyles);
      span.style.pointerEvents = 'none';
      span.style.userSelect = 'none';

      // We append it to the end of the element.
      // In a more robust system, we'd insert it at the current selection cursor.
      el.appendChild(span);
    } else if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      // For standard inputs, inline ghost text is much harder to implement natively.
      // We'll ignore standard inputs for inline ghost text in this MVP.
      console.warn("Spectre inline ghost text is currently only supported on contentEditable elements.");
    }
  }

  clearInline(rule: RefRule) {
    const ref = this.getRef(rule);
    if (!ref) return;
    const el = ref.element as HTMLElement;
    if (el.isContentEditable) {
      const existingSpans = el.querySelectorAll('.spectre-inline-ghost');
      existingSpans.forEach(span => span.remove());
    }
  }

  acceptInline(rule: RefRule) {
    const ref = this.getRef(rule);
    if (!ref) return null;
    const el = ref.element as HTMLElement;
    if (el.isContentEditable) {
      const span = el.querySelector('.spectre-inline-ghost');
      if (span) {
        const textToAccept = span.textContent || "";
        span.remove();
        
        // Append the text natively
        const textNode = document.createTextNode(textToAccept);
        el.appendChild(textNode);
        
        // Move cursor to the end
        const selection = window.getSelection();
        if (selection) {
          const range = document.createRange();
          range.selectNodeContents(el);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        
        return textToAccept; // Return the accepted text so the caller knows what was added
      }
    }
    return null;
  }

  private getRef(id: string): Ref | null {
    return this.refs.get(id) || null;
  }

  deleteRef(id: string) {
    this.refs.delete(id);
  }

  private genRefId() {
    return `spectre-${Math.random().toString(36).substr(2, 9)}`;
  }
}
