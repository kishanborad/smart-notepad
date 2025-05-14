import { Request, Response } from 'express';
import { Note } from '../models/Note';
import mongoose from 'mongoose';

export const createNote = async (req: Request, res: Response) => {
  try {
    console.log('📝 Create Note - Starting note creation');
    console.log('📝 Create Note - User:', req.user);
    console.log('📝 Create Note - Request body:', req.body);

    if (!req.user?.userId) {
      console.warn('⚠️ Create Note - No user ID in request');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    // Validate required fields
    if (!req.body.title || !req.body.content) {
      console.warn('⚠️ Create Note - Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Title and content are required',
        errors: {
          title: !req.body.title ? 'Title is required' : undefined,
          content: !req.body.content ? 'Content is required' : undefined,
        },
      });
    }

    // Validate userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
      console.warn('⚠️ Create Note - Invalid userId format');
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
      });
    }

    const noteData = {
      ...req.body,
      userId: new mongoose.Types.ObjectId(req.user.userId),
    };
    console.log('📝 Create Note - Note data with userId:', noteData);

    const note = new Note(noteData);
    console.log('📝 Create Note - Created note instance:', note);

    const savedNote = await note.save();
    console.log('✅ Create Note - Note saved successfully:', savedNote);

    res.status(201).json({
      success: true,
      data: savedNote,
    });
  } catch (error) {
    console.error('❌ Create Note - Error:', error);
    
    // Handle Mongoose validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors: Record<string, string> = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating note',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getNotes = async (req: Request, res: Response) => {
  try {
    console.log('📝 Get Notes - Starting notes fetch');
    console.log('📝 Get Notes - User:', req.user);

    if (!req.user?.userId) {
      console.warn('⚠️ Get Notes - No user ID in request');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const notes = await Note.find({ userId: req.user.userId });
    console.log('✅ Get Notes - Found notes:', notes.length);

    res.json({
      success: true,
      data: notes,
    });
  } catch (error) {
    console.error('❌ Get Notes - Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notes',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  try {
    console.log('📝 Get Note - Starting note fetch');
    console.log('📝 Get Note - Note ID:', req.params.id);
    console.log('📝 Get Note - User:', req.user);

    if (!req.user?.userId) {
      console.warn('⚠️ Get Note - No user ID in request');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    console.log('📝 Get Note - Found note:', note);

    if (!note) {
      console.warn('⚠️ Get Note - Note not found');
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    res.json({
      success: true,
      data: note,
    });
  } catch (error) {
    console.error('❌ Get Note - Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching note',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  try {
    console.log('📝 Update Note - Starting note update');
    console.log('📝 Update Note - Note ID:', req.params.id);
    console.log('📝 Update Note - User:', req.user);
    console.log('📝 Update Note - Update data:', req.body);

    if (!req.user?.userId) {
      console.warn('⚠️ Update Note - No user ID in request');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    console.log('📝 Update Note - Updated note:', note);

    if (!note) {
      console.warn('⚠️ Update Note - Note not found');
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    res.json({
      success: true,
      data: note,
    });
  } catch (error) {
    console.error('❌ Update Note - Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating note',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    console.log('📝 Delete Note - Starting note deletion');
    console.log('📝 Delete Note - Note ID:', req.params.id);
    console.log('📝 Delete Note - User:', req.user);

    if (!req.user?.userId) {
      console.warn('⚠️ Delete Note - No user ID in request');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { status: 'deleted' },
      { new: true }
    );
    console.log('📝 Delete Note - Deleted note:', note);

    if (!note) {
      console.warn('⚠️ Delete Note - Note not found');
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    res.json({
      success: true,
      data: note,
    });
  } catch (error) {
    console.error('❌ Delete Note - Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting note',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}; 