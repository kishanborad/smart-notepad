// backend/controller/noteController.js
const Note = require('../models/Note');

// Get all notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({is_Deleted: false}); // Retrieve all notes from the database
    res.status(200).json(notes); // Send the notes as JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving notes' }); // Handle errors
  }
};

// Get a single note by ID
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id); // Find note by ID
    if (!note) {
      return res.status(404).json({ message: 'Note not found' }); // Return 404 if note is not found
    }
    res.status(200).json(note); // Send the note as JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving note' }); // Handle errors
  }
};

// Create a new note
const createNote = async (req, res) => {
  // Log the incoming request body to check what data is received
  console.log('Received note data:', req.body);

  try {
    // Destructure fields from the request body
    const { title, content, is_Deleted } = req.body;

    // Create the new note, ensuring 'is_Deleted' defaults to false if not provided
    const newNote = new Note({
      title, // Set title from the request body
      content, // Set content from the request body
      is_Deleted: is_Deleted !== undefined ? is_Deleted : false, // Default is_Deleted to false if not provided
    });

    // Save the new note to the database
    const savedNote = await newNote.save(); 

    // Send the saved note as JSON response
    res.status(201).json(savedNote); 
  } catch (error) {
    // Handle errors
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Error creating note' }); 
  }
};


// Update an existing note
const updateNote = async (req, res) => {
  // Log the data to ensure you have the correct fields
  console.log('Received update data:', req.body);

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, content: req.body.content, is_Deleted: false }, // Update title and content
      { new: true } // Return the updated note
    );
    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' }); // Return 404 if note is not found
    }

    // Update note fields if they are provided in the request body
    if (title) updateNote.title = title;
    if (content) updateNote.content = content;
    if (typeof is_Deleted === 'boolean') updateNote.is_Deleted = is_Deleted; // Ensure is_Deleted can be updated

    // const updatedNote = await note.save(); // Save the updated note
    res.status(200).json(updatedNote); // Send the updated note as JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error updating note' }); // Handle errors
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id); // Delete the note by ID
    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' }); // Return 404 if note is not found
    }

    // Soft delete the note by updating is_Deleted field
    deletedNote.is_Deleted = true;
    res.status(200).json({ message: 'Note deleted successfully' }); // Confirm deletion
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note' }); // Handle errors
  }
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
