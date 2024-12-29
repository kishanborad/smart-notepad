// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const noteRoutes = require('./routes/noteRoutes');


// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB (adjust connection string as per your setup)
mongoose.connect('mongodb+srv://boradkishan99:diAHyt946qKTzfyq@smart-notepad.vhjm6.mongodb.net/SmartNotepad?retryWrites=true&w=majority&appName=smart-Notepad', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("Error connecting to MongoDB:", err));

// Basic route for health check
app.get('/', (req, res) => {
    res.send('Smart Notepad API is running');
});

// Listen on port 1020
app.listen(1020, () => {
    console.log('Server is running on port 1020');
});

// Use the routes
app.use('/api/notes', noteRoutes);