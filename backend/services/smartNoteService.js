const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

class SmartNoteService {
  constructor() {
    this.tfidf = new TfIdf();
    this.commonTags = new Set([
      'work', 'personal', 'important', 'urgent', 'project', 'meeting',
      'idea', 'task', 'reminder', 'reference', 'code', 'documentation'
    ]);
  }

  /**
   * Analyze note content and generate smart metadata
   * @param {Object} note - The note object to analyze
   * @returns {Object} Enhanced note with smart metadata
   */
  async analyzeNote(note) {
    const tokens = tokenizer.tokenize(note.content.toLowerCase());
    const titleTokens = tokenizer.tokenize(note.title.toLowerCase());

    // Generate auto tags
    const autoTags = this.generateAutoTags(tokens, titleTokens);
    
    // Detect content type
    const contentType = this.detectContentType(note.content);
    
    // Generate summary
    const summary = this.generateSummary(note.content);
    
    // Extract key points
    const keyPoints = this.extractKeyPoints(note.content);

    // Update note with smart metadata
    note.aiMetadata = {
      ...note.aiMetadata,
      autoTags,
      contentType,
      summary,
      keyPoints,
      sentiment: this.analyzeSentiment(note.content)
    };

    // Update category if not explicitly set
    if (!note.category || note.category === 'Text') {
      note.category = contentType;
    }

    return note;
  }

  /**
   * Generate automatic tags based on content
   */
  generateAutoTags(tokens, titleTokens) {
    const tags = new Set();
    
    // Add tags from title (higher priority)
    titleTokens.forEach(token => {
      if (this.commonTags.has(token)) {
        tags.add(token);
      }
    });

    // Add tags from content
    tokens.forEach(token => {
      if (this.commonTags.has(token)) {
        tags.add(token);
      }
    });

    return Array.from(tags);
  }

  /**
   * Detect the type of content
   */
  detectContentType(content) {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('todo') || lowerContent.includes('task') || lowerContent.includes('checklist')) {
      return 'To-Do List';
    }
    if (lowerContent.includes('meeting') || lowerContent.includes('agenda') || lowerContent.includes('minutes')) {
      return 'Meeting Notes';
    }
    if (lowerContent.includes('```') || lowerContent.includes('function') || lowerContent.includes('class')) {
      return 'Code Snippets';
    }
    if (lowerContent.includes('idea') || lowerContent.includes('concept') || lowerContent.includes('thought')) {
      return 'Idea';
    }
    
    return 'Text';
  }

  /**
   * Generate a summary of the content
   */
  generateSummary(content) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length <= 2) return content;
    
    // Simple extractive summarization (can be enhanced with ML)
    return sentences.slice(0, 2).join('. ') + '.';
  }

  /**
   * Extract key points from content
   */
  extractKeyPoints(content) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const keyPoints = [];
    
    // Simple key point extraction (can be enhanced with ML)
    sentences.forEach(sentence => {
      if (sentence.toLowerCase().includes('important') || 
          sentence.toLowerCase().includes('key') ||
          sentence.toLowerCase().includes('note')) {
        keyPoints.push(sentence.trim());
      }
    });

    return keyPoints.slice(0, 3); // Return top 3 key points
  }

  /**
   * Analyze sentiment of content
   */
  analyzeSentiment(content) {
    const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
    const tokens = tokenizer.tokenize(content);
    const score = analyzer.getSentiment(tokens);
    
    if (score > 0.2) return 'positive';
    if (score < -0.2) return 'negative';
    return 'neutral';
  }

  /**
   * Format content based on type
   */
  formatContent(content, type) {
    switch (type) {
      case 'To-Do List':
        return this.formatTodoList(content);
      case 'Meeting Notes':
        return this.formatMeetingNotes(content);
      case 'Code Snippets':
        return this.formatCodeSnippets(content);
      default:
        return content;
    }
  }

  /**
   * Format content as a todo list
   */
  formatTodoList(content) {
    const lines = content.split('\n');
    return lines.map(line => {
      if (line.trim().startsWith('- [ ]')) return line;
      if (line.trim().startsWith('-')) return line.replace('-', '- [ ]');
      return `- [ ] ${line.trim()}`;
    }).join('\n');
  }

  /**
   * Format content as meeting notes
   */
  formatMeetingNotes(content) {
    const sections = ['Agenda', 'Attendees', 'Notes', 'Action Items'];
    let formatted = '';
    
    sections.forEach(section => {
      if (content.toLowerCase().includes(section.toLowerCase())) {
        formatted += `\n## ${section}\n`;
      }
    });
    
    return formatted || content;
  }

  /**
   * Format content as code snippets
   */
  formatCodeSnippets(content) {
    if (content.includes('```')) return content;
    
    const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
    let formatted = content;
    
    codeBlocks.forEach(block => {
      formatted = formatted.replace(block, `\n${block}\n`);
    });
    
    return formatted;
  }
}

module.exports = new SmartNoteService(); 