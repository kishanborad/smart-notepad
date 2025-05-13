const mongoose = require('mongoose');
const aiService = require('../services/aiService');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['text', 'todo', 'meeting', 'idea', 'code', 'checklist', 'sketch'],
        default: 'text'
    },
    tags: [{
        type: String,
        trim: true
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    version: {
        type: Number,
        default: 1
    },
    versionHistory: [{
        content: String,
        timestamp: Date,
        version: Number
    }],
    metadata: {
        wordCount: Number,
        readingTime: Number,
        lastEdited: Date
    },
    attachments: [{
        type: String,
        url: String,
        name: String
    }],
    reminders: [{
        date: Date,
        description: String
    }],
    status: {
        type: String,
        enum: ['active', 'archived', 'deleted'],
        default: 'active'
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    relatedNotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
    }],
    aiEnhanced: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    color: {
        type: String,
        default: '#ffffff'
    },
    improveContent: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes for better search performance
noteSchema.index({ title: 'text', content: 'text', tags: 'text' });
noteSchema.index({ user: 1, createdAt: -1 });
noteSchema.index({ isPinned: 1, isFavorite: 1 });

// Methods
noteSchema.methods.updateVersion = async function(newContent) {
    this.versionHistory.push({
        content: this.content,
        timestamp: new Date(),
        version: this.version
    });
    this.content = newContent;
    this.version += 1;
    this.metadata.lastEdited = new Date();
    return this.save();
};

noteSchema.methods.addCollaborator = async function(userId) {
    if (!this.collaborators.includes(userId)) {
        this.collaborators.push(userId);
        return this.save();
    }
    return this;
};

noteSchema.methods.removeCollaborator = async function(userId) {
    this.collaborators = this.collaborators.filter(id => id.toString() !== userId.toString());
    return this.save();
};

// Pre-save middleware to update metadata
noteSchema.pre('save', function(next) {
    if (this.isModified('content')) {
        this.metadata.wordCount = this.content.split(/\s+/).length;
        this.metadata.readingTime = Math.ceil(this.metadata.wordCount / 200); // Assuming 200 words per minute
        this.metadata.lastEdited = new Date();
    }
    next();
});

// Pre-save middleware to generate AI-enhanced content
noteSchema.pre('save', async function(next) {
    if (this.isModified('content') && !this.aiEnhanced) {
        try {
            // Generate summary if content is long enough
            if (this.content.length > 100) {
                try {
                    const summary = await aiService.generateNoteSummary(this.content);
                    this.summary = summary;
                } catch (error) {
                    console.error('Error generating summary:', error);
                    // Fallback to basic summary
                    this.summary = this.content.substring(0, 150) + '...';
                }
            }
            
            // Suggest tags if none exist
            if (!this.tags || this.tags.length === 0) {
                try {
                    this.tags = await aiService.suggestTags(this.content);
                } catch (error) {
                    console.error('Error suggesting tags:', error);
                    // Fallback to empty tags
                    this.tags = [];
                }
            }
            
            // Improve content if requested
            if (this.improveContent) {
                try {
                    const improvedContent = await aiService.improveNoteContent(this.content);
                    this.content = improvedContent;
                } catch (error) {
                    console.error('Error improving content:', error);
                    // Keep original content if improvement fails
                }
            }
            
            this.aiEnhanced = true;
        } catch (error) {
            console.error('Error in AI enhancement:', error);
            // Continue saving even if AI enhancement fails
        }
    }
    next();
});

// Method to find related notes
noteSchema.methods.findRelatedNotes = async function() {
    try {
        const allNotes = await this.model('Note').find({
            _id: { $ne: this._id },
            userId: this.userId
        }).select('title content');

        const relatedNotes = await aiService.generateRelatedNotes(
            this.content,
            allNotes
        );

        // Update related notes
        this.relatedNotes = relatedNotes;
        await this.save();

        return relatedNotes;
    } catch (error) {
        console.error('Error finding related notes:', error);
        throw error;
    }
};

// Static method to search notes with AI-enhanced relevance
noteSchema.statics.searchNotes = async function(query, userId) {
    try {
        const notes = await this.find({
            userId,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } }
            ]
        }).sort({ updatedAt: -1 });

        // Use AI to rank results by relevance
        const rankedNotes = await aiService.rankSearchResults(query, notes);
        return rankedNotes;
    } catch (error) {
        console.error('Error searching notes:', error);
        throw error;
    }
};

// Static method to find notes by user
noteSchema.statics.findByUser = async function(userId) {
    return this.find({ user: userId });
};

// Static method to search notes
noteSchema.statics.search = async function(userId, query) {
    return this.find({
        user: userId,
        $text: { $search: query }
    });
};

const Note = mongoose.model('Note', noteSchema);

module.exports = Note; 