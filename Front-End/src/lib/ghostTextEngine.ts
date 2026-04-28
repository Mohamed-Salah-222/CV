export interface SuggestionsData {
  phrases: string[];
  sentences: string[];
  completions: string[];
}

export interface MatchResult {
  text: string;
  score: number;
}

class TrieNode {
  children: Record<string, TrieNode> = {};
  isEndOfWord: boolean = false;
  suggestions: Set<string> = new Set();
}

export class GhostTextEngine {
  private root: TrieNode;
  private tokenMap: Map<string, Set<string>>;
  private allSuggestions: string[];

  constructor() {
    this.root = new TrieNode();
    this.tokenMap = new Map();
    this.allSuggestions = [];
  }

  private normalize(text: string): string {
    return text.toLowerCase().replace(/[^\w\s]/g, "");
  }

  public index(suggestions: SuggestionsData) {
    this.root = new TrieNode();
    this.tokenMap = new Map();
    this.allSuggestions = [
      ...(suggestions.phrases || []),
      ...(suggestions.sentences || []),
      ...(suggestions.completions || [])
    ];

    for (const text of this.allSuggestions) {
      const normalized = this.normalize(text);
      const words = normalized.split(/\s+/).filter(Boolean);
      
      for (const word of words) {
        this.insertWord(word, text);
        
        if (!this.tokenMap.has(word)) {
          this.tokenMap.set(word, new Set());
        }
        this.tokenMap.get(word)!.add(text);
      }
    }
  }

  private insertWord(word: string, suggestion: string) {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
      node.suggestions.add(suggestion);
    }
    node.isEndOfWord = true;
  }

  private searchPrefix(prefix: string): Set<string> {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children[char]) return new Set();
      node = node.children[char];
    }
    return node.suggestions;
  }

  public match(text: string): MatchResult[] {
    if (!text.trim()) return [];

    const words = text.split(/[\s\n]+/).filter(Boolean);
    if (words.length === 0) return [];

    const currentWord = words[words.length - 1];
    const lastNWords = words.slice(-4, -1);

    const normCurrentWord = this.normalize(currentWord);
    const normLastNWords = lastNWords.map(this.normalize).filter(Boolean);
    
    const results = new Map<string, number>();

    // 1. Prefix match for the current word being typed
    if (normCurrentWord) {
      const prefixMatches = this.searchPrefix(normCurrentWord);
      for (const match of prefixMatches) {
        results.set(match, (results.get(match) || 0) + 15);
      }
    }

    // 2. Multi-word context (does the suggestion contain the recent words?)
    const contextStr = normLastNWords.join(" ");
    if (contextStr && contextStr.length > 2) {
      for (const sugg of this.allSuggestions) {
        const normText = this.normalize(sugg);
        if (normText.includes(contextStr)) {
          results.set(sugg, (results.get(sugg) || 0) + 20);
        }
      }
    }

    // 3. Token overlap
    for (const word of normLastNWords) {
      if (this.tokenMap.has(word)) {
        for (const sugg of this.tokenMap.get(word)!) {
          results.set(sugg, (results.get(sugg) || 0) + 2);
        }
      }
    }

    // Score and rank
    const sorted = Array.from(results.entries())
      .map(([sugg, score]) => {
        // Boost score if the suggestion naturally completes the current word
        const normSugg = this.normalize(sugg);
        if (normSugg.startsWith(this.normalize(text))) {
          score += 25; // High boost for exact prefix match of the ENTIRE typed text
        }
        return {
          text: sugg,
          score: score - (sugg.length * 0.01) // slight penalty for very long ones
        };
      })
      .filter(res => res.score > 0)
      .sort((a, b) => b.score - a.score);

    return sorted.slice(0, 5);
  }
}
