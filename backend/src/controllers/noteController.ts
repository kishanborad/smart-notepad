import { Request, Response } from 'express';
import { Note, INote } from '../models/Note';

interface AuthRequest extends Request {
  user?: any;
}

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const note = new Note({
      ...req.body,
      userId: req.user._id
    });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: 'Error creating note', error });
  }
};

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const notes = await Note.find({ userId: req.user._id, status: 'active' });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error });
  }
};

export const getNoteById = async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching note', error });
  }
};

export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(400).json({ message: 'Error updating note', error });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status: 'deleted' },
      { new: true }
    );
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note', error });
  }
}; 