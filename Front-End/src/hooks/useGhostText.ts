import { useState, useEffect, useRef, useCallback } from "react";
import { GhostTextEngine, SuggestionsData, MatchResult } from "@/lib/ghostTextEngine";
import { Spectre } from "@/lib/spectre";

export function useGhostText(suggestions: SuggestionsData | null, ruleName: string) {
  const [engine] = useState(() => new GhostTextEngine());
  const [spectre] = useState(() => new Spectre());
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isActive, setIsActive] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize engine when suggestions arrive
  useEffect(() => {
    if (suggestions) {
      engine.index(suggestions);
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [suggestions, engine]);

  const spectreRef = useCallback((el: HTMLElement | null) => {
    if (el) {
      spectre.register(ruleName, el);
    } else {
      spectre.unregister(ruleName);
    }
  }, [spectre, ruleName]);

  const clearGhostText = useCallback(() => {
    spectre.clearInline(ruleName);
    setMatches([]);
  }, [spectre, ruleName]);

  const handleInput = useCallback((text: string) => {
    if (!isActive) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      // Remove HTML tags for matching (crude but effective for rich text)
      const plainText = text.replace(/<[^>]*>?/gm, "").trim();
      
      if (!plainText) {
        clearGhostText();
        return;
      }

      const results = engine.match(plainText);
      setMatches(results);

      if (results.length > 0) {
        const topMatch = results[0].text;
        
        // Find the suffix to display
        // Example: typed "I developed a ", suggestion "I developed a scalable system"
        // Suffix: "scalable system"
        const plainTextLower = plainText.toLowerCase();
        const topMatchLower = topMatch.toLowerCase();
        
        let suffix = "";
        
        // Simple prefix check (GhostTextEngine already boosts perfect prefixes)
        if (topMatchLower.startsWith(plainTextLower)) {
          suffix = topMatch.slice(plainText.length);
        } else {
          // Check last word prefix
          const words = plainText.split(/\s+/);
          const lastWord = words[words.length - 1].toLowerCase();
          
          if (lastWord && topMatchLower.startsWith(lastWord)) {
            suffix = topMatch.slice(lastWord.length);
          } else {
            // Just show the whole thing with a space if it doesn't perfectly overlap
            suffix = " " + topMatch;
          }
        }
        
        if (suffix) {
          spectre.showInline(ruleName, suffix);
        } else {
          spectre.clearInline(ruleName);
        }
      } else {
        spectre.clearInline(ruleName);
      }
    }, 120); // 120ms debounce
  }, [isActive, engine, spectre, ruleName, clearGhostText]);

  const acceptInline = useCallback(() => {
    const acceptedText = spectre.acceptInline(ruleName);
    if (acceptedText) {
      setMatches([]);
      return acceptedText;
    }
    return null;
  }, [spectre, ruleName]);

  // Handle keyboard events (Tab / ArrowRight to accept)
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isActive || matches.length === 0) return;

    if (e.key === "Tab" || e.key === "ArrowRight") {
      const accepted = acceptInline();
      if (accepted) {
        e.preventDefault();
        // The component using this hook must trigger its onChange 
        // using the element's actual innerHTML/textContent, as we manually modified the DOM.
      }
    } else if (e.key === "Escape") {
      clearGhostText();
    }
  }, [isActive, matches.length, acceptInline, clearGhostText]);

  return {
    spectreRef,
    handleInput,
    handleKeyDown,
    acceptInline,
    matches,
    clearGhostText
  };
}
