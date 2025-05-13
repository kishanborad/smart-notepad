const Note = require('../models/Note');
const aiService = require('../services/aiService');

// Create a new note
exports.createNote = async (req, res) => {
    try {
        console.log('Request user:', req.user); // Debug log
        console.log('User ID:', req.user._id); // Debug log

        const noteData = {
            ...req.body,
            user: req.user._id // Use _id from the user object
        };
        console.log('Note data:', noteData); // Debug log

        const note = new Note(noteData);
        await note.save();
        
        res.status(201).json({
            success: true,
            data: note
        });
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(400).json({
            success: false,
            message: 'Error creating note',
            error: error.message
        });
    }
};

// Get all notes for a user
exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.findByUser(req.user._id);
        res.json({
            success: true,
            data: notes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get a single note
exports.getNote = async (req, res) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        res.json({
            success: true,
            data: note
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update a note
exports.updateNote = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'content', 'tags', 'isPinned', 'isArchived', 'color'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({
            success: false,
            message: 'Invalid updates!'
        });
    }

    try {
        const note = await Note.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        updates.forEach(update => note[update] = req.body[update]);
        await note.save();

        res.json({
            success: true,
            data: note
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete a note
exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        res.json({
            success: true,
            data: note
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Search notes
exports.searchNotes = async (req, res) => {
    try {
        const notes = await Note.search(req.user._id, req.query.q);
        res.json({
            success: true,
            data: notes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get related notes
exports.getRelatedNotes = async (req, res) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        const relatedNotes = await note.findRelatedNotes();

        res.json({
            success: true,
            data: relatedNotes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error finding related notes',
            error: error.message
        });
    }
};

// Share a note
exports.shareNote = async (req, res) => {
    try {
        const { email } = req.body;
        const note = await Note.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        // TODO: Implement sharing logic with email service
        // For now, just make the note public
        note.isPublic = true;
        await note.save();

        res.json({
            success: true,
            message: 'Note shared successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error sharing note',
            error: error.message
        });
    }
};

// Add collaborator to note
exports.addCollaborator = async (req, res) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            user: req.user._id,
            status: 'active'
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        await note.addCollaborator(req.body.userId);
        await note.populate('collaborators', 'username email profile.avatar');

        res.json({
            success: true,
            data: note
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Remove collaborator from note
exports.removeCollaborator = async (req, res) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            user: req.user._id,
            status: 'active'
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        await note.removeCollaborator(req.params.userId);
        await note.populate('collaborators', 'username email profile.avatar');

        res.json({
            success: true,
            data: note
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get note version history
exports.getVersionHistory = async (req, res) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            $or: [
                { user: req.user._id },
                { collaborators: req.user._id }
            ],
            status: 'active'
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        res.json({
            success: true,
            data: note.versionHistory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 