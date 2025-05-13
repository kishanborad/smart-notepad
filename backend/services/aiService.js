const { OpenAI } = require('openai');
const config = require('../config/config');

const openai = new OpenAI({
    apiKey: config.openai.apiKey
});

// Generate a summary for a note
const generateNoteSummary = async (content) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that creates concise summaries of text. Keep summaries under 100 words."
                },
                {
                    role: "user",
                    content: `Please summarize this text: ${content}`
                }
            ],
            max_tokens: 150
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error generating summary:', error);
        return null;
    }
};

// Suggest tags for a note
const suggestTags = async (content) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that suggests relevant tags for text. Return only the tags as a comma-separated list."
                },
                {
                    role: "user",
                    content: `Please suggest 3-5 relevant tags for this text: ${content}`
                }
            ],
            max_tokens: 50
        });

        const tags = response.choices[0].message.content
            .split(',')
            .map(tag => tag.trim().toLowerCase())
            .filter(tag => tag.length > 0);

        return tags;
    } catch (error) {
        console.error('Error suggesting tags:', error);
        return [];
    }
};

// Improve note content
const improveNoteContent = async (content) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that improves text by fixing grammar, enhancing clarity, and maintaining the original meaning."
                },
                {
                    role: "user",
                    content: `Please improve this text while maintaining its original meaning: ${content}`
                }
            ],
            max_tokens: 1000
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error improving content:', error);
        return content; // Return original content if improvement fails
    }
};

// Find related notes
const generateRelatedNotes = async (content, allNotes) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that finds related content. Return only the IDs of related notes as a comma-separated list."
                },
                {
                    role: "user",
                    content: `Given this content: ${content}\n\nFind related notes from these options:\n${JSON.stringify(allNotes)}`
                }
            ],
            max_tokens: 100
        });

        const relatedIds = response.choices[0].message.content
            .split(',')
            .map(id => id.trim())
            .filter(id => id.length > 0);

        return relatedIds;
    } catch (error) {
        console.error('Error finding related notes:', error);
        return [];
    }
};

// Rank search results by relevance
const rankSearchResults = async (query, notes) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that ranks search results by relevance. Return only the IDs in order of relevance as a comma-separated list."
                },
                {
                    role: "user",
                    content: `For the query "${query}", rank these notes by relevance:\n${JSON.stringify(notes)}`
                }
            ],
            max_tokens: 100
        });

        const rankedIds = response.choices[0].message.content
            .split(',')
            .map(id => id.trim())
            .filter(id => id.length > 0);

        // Reorder notes based on AI ranking
        return rankedIds.map(id => notes.find(note => note._id.toString() === id));
    } catch (error) {
        console.error('Error ranking search results:', error);
        return notes; // Return original order if ranking fails
    }
};

module.exports = {
    generateNoteSummary,
    suggestTags,
    improveNoteContent,
    generateRelatedNotes,
    rankSearchResults
}; 