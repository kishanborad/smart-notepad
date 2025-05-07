const natural = require('natural');
const nlp = require('compromise');
const winkNLP = require('wink-nlp');
const model = require('wink-eng-lite-model');
const nlpUtils = require('wink-nlp-utils');

// Initialize NLP
winkNLP.use(model);
const its = winkNLP.its;
const as = winkNLP.as;

class AIService {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.spellcheck = new natural.Spellcheck();
    this.tfidf = new natural.TfIdf();
    this.ngram = new natural.NGrams();
    
    // Initialize dictionary (you can expand this)
    this.dictionary = new Set([
      'meeting', 'agenda', 'minutes', 'action', 'items', 'project',
      'task', 'deadline', 'priority', 'urgent', 'important', 'note',
      'idea', 'concept', 'plan', 'strategy', 'review', 'feedback',
      'summary', 'conclusion', 'recommendation', 'decision', 'follow-up'
    ]);

    // Common grammar patterns
    this.grammarPatterns = {
      capitalization: /^[A-Z]/,
      sentenceEnd: /[.!?]$/,
      properNouns: /\b[A-Z][a-z]+\b/g
    };
  }

  /**
   * Get autocomplete suggestions based on context
   */
  async getAutocompleteSuggestions(text, maxSuggestions = 5) {
    const words = this.tokenizer.tokenize(text.toLowerCase());
    const lastWord = words[words.length - 1] || '';
    
    // Get suggestions from dictionary
    const suggestions = Array.from(this.dictionary)
      .filter(word => word.startsWith(lastWord))
      .slice(0, maxSuggestions);

    // Get suggestions from context using n-grams
    const context = words.slice(-3).join(' ');
    const ngrams = this.ngram.ngrams(context, 2);
    
    // Combine and rank suggestions
    return this.rankSuggestions(suggestions, ngrams);
  }

  /**
   * Check spelling and suggest corrections
   */
  async checkSpelling(text) {
    const words = this.tokenizer.tokenize(text);
    const corrections = [];

    words.forEach(word => {
      if (!this.dictionary.has(word.toLowerCase())) {
        const suggestions = this.spellcheck.getCorrections(word, 2);
        if (suggestions.length > 0) {
          corrections.push({
            word,
            suggestions,
            context: this.getWordContext(text, word)
          });
        }
      }
    });

    return corrections;
  }

  /**
   * Check grammar and suggest improvements
   */
  async checkGrammar(text) {
    const doc = nlp(text);
    const issues = [];

    // Check sentence structure
    doc.sentences().forEach(sentence => {
      const text = sentence.text();
      
      // Check capitalization
      if (!this.grammarPatterns.capitalization.test(text)) {
        issues.push({
          type: 'capitalization',
          text,
          suggestion: text.charAt(0).toUpperCase() + text.slice(1)
        });
      }

      // Check sentence ending
      if (!this.grammarPatterns.sentenceEnd.test(text)) {
        issues.push({
          type: 'sentence_end',
          text,
          suggestion: text + '.'
        });
      }
    });

    // Check for common grammar issues
    const grammarIssues = this.checkCommonGrammarIssues(text);
    issues.push(...grammarIssues);

    return issues;
  }

  /**
   * Get word context for better suggestions
   */
  getWordContext(text, word) {
    const words = this.tokenizer.tokenize(text);
    const index = words.indexOf(word);
    const start = Math.max(0, index - 2);
    const end = Math.min(words.length, index + 3);
    return words.slice(start, end).join(' ');
  }

  /**
   * Check for common grammar issues
   */
  checkCommonGrammarIssues(text) {
    const issues = [];
    const doc = nlp(text);

    // Check for passive voice
    doc.sentences().forEach(sentence => {
      if (sentence.isPassive()) {
        issues.push({
          type: 'passive_voice',
          text: sentence.text(),
          suggestion: 'Consider using active voice'
        });
      }
    });

    // Check for long sentences
    doc.sentences().forEach(sentence => {
      if (sentence.words().length > 20) {
        issues.push({
          type: 'long_sentence',
          text: sentence.text(),
          suggestion: 'Consider breaking into shorter sentences'
        });
      }
    });

    return issues;
  }

  /**
   * Rank suggestions based on context and relevance
   */
  rankSuggestions(suggestions, ngrams) {
    return suggestions.map(suggestion => ({
      text: suggestion,
      score: this.calculateRelevanceScore(suggestion, ngrams)
    })).sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate relevance score for suggestions
   */
  calculateRelevanceScore(suggestion, ngrams) {
    let score = 0;
    
    // Check if suggestion appears in n-grams
    ngrams.forEach(ngram => {
      if (ngram.includes(suggestion)) {
        score += 2;
      }
    });

    // Add base score for dictionary match
    score += 1;

    return score;
  }

  /**
   * Get advanced writing suggestions
   */
  async getWritingSuggestions(text) {
    const doc = winkNLP.readDoc(text);
    const suggestions = [];

    // Analyze readability
    const readability = this.analyzeReadability(text);
    suggestions.push({
      type: 'readability',
      score: readability.score,
      suggestions: readability.suggestions
    });

    // Analyze tone
    const tone = this.analyzeTone(text);
    suggestions.push({
      type: 'tone',
      analysis: tone
    });

    // Analyze structure
    const structure = this.analyzeStructure(text);
    suggestions.push({
      type: 'structure',
      analysis: structure
    });

    return suggestions;
  }

  /**
   * Analyze text readability
   */
  analyzeReadability(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = this.tokenizer.tokenize(text);
    const avgWordsPerSentence = words.length / sentences.length;

    const suggestions = [];
    if (avgWordsPerSentence > 20) {
      suggestions.push('Consider breaking long sentences into shorter ones');
    }

    return {
      score: this.calculateReadabilityScore(text),
      suggestions
    };
  }

  /**
   * Calculate readability score (simplified Flesch-Kincaid)
   */
  calculateReadabilityScore(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = this.tokenizer.tokenize(text);
    const syllables = this.countSyllables(text);

    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;

    return 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  }

  /**
   * Count syllables in text
   */
  countSyllables(text) {
    const words = this.tokenizer.tokenize(text);
    return words.reduce((count, word) => {
      return count + this.countWordSyllables(word);
    }, 0);
  }

  /**
   * Count syllables in a word
   */
  countWordSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace('^y', '');
    
    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
  }

  /**
   * Analyze text tone
   */
  analyzeTone(text) {
    const doc = nlp(text);
    const sentences = doc.sentences().out('array');
    
    return {
      formality: this.analyzeFormality(text),
      sentiment: this.analyzeSentiment(text),
      confidence: this.analyzeConfidence(text)
    };
  }

  /**
   * Analyze text structure
   */
  analyzeStructure(text) {
    const doc = nlp(text);
    const paragraphs = text.split('\n\n');
    
    return {
      paragraphCount: paragraphs.length,
      avgParagraphLength: this.calculateAvgParagraphLength(paragraphs),
      hasHeadings: this.hasHeadings(text),
      structureScore: this.calculateStructureScore(text)
    };
  }

  /**
   * Calculate average paragraph length
   */
  calculateAvgParagraphLength(paragraphs) {
    const lengths = paragraphs.map(p => p.split(/\s+/).length);
    return lengths.reduce((a, b) => a + b, 0) / lengths.length;
  }

  /**
   * Check if text has headings
   */
  hasHeadings(text) {
    return /^#+\s|^[A-Z][^\n]+\n[-=]+$/m.test(text);
  }

  /**
   * Calculate structure score
   */
  calculateStructureScore(text) {
    let score = 0;
    
    // Check for headings
    if (this.hasHeadings(text)) score += 2;
    
    // Check for lists
    if (text.includes('- ') || text.includes('* ')) score += 1;
    
    // Check for paragraphs
    const paragraphs = text.split('\n\n');
    if (paragraphs.length > 1) score += 1;
    
    return score;
  }
}

module.exports = new AIService(); 