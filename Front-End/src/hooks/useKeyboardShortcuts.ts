import { useEffect, useCallback } from "react";

interface KeyboardShortcutsConfig {
  onSave?: () => void;
  onExport?: () => void;
  onAIGenerate?: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onSave,
  onExport,
  onAIGenerate,
  enabled = true,
}: KeyboardShortcutsConfig) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isMod = event.metaKey || event.ctrlKey;

      if (!isMod) return;

      switch (event.key.toLowerCase()) {
        case "s":
          event.preventDefault();
          onSave?.();
          break;
        case "e":
          event.preventDefault();
          onExport?.();
          break;
        case "g":
          event.preventDefault();
          onAIGenerate?.();
          break;
      }
    },
    [onSave, onExport, onAIGenerate]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, enabled]);
}