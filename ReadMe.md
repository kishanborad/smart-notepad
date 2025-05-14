# Smart Notepad

A modern note-taking application with real-time collaboration features.

## Features

### Core Features
- 📝 Rich text editing with markdown support
- 🏷️ Automatic content organization and categorization
- 📱 Cross-platform sync
- 👥 Real-time collaboration
- 🔒 End-to-end encryption
- 🎨 Customizable themes and layouts

### Smart Organization
- 📂 Automatic content categorization
- 🏷️ Smart tagging system
- 🔍 Advanced search capabilities
- 📊 Note analytics and insights
- 🔄 Version history and restore points

### Productivity Tools
- ✅ Task management integration
- 📅 Calendar integration
- 🎯 Goal tracking
- 📊 Progress analytics
- 📈 Daily summaries and reports

### Advanced Features
- 🎤 Voice-to-text and audio notes
- ✍️ Handwriting recognition
- 🤖 AI-powered suggestions
- 🔗 Note linking and references
- 📱 Mobile-responsive design

### Security & Privacy
- 🔐 End-to-end encryption
- 👤 User authentication
- 🔑 Role-based access control
- 📱 Two-factor authentication
- 🔒 Secure sharing options

## Tech Stack

- **Frontend:**
  - React.js with TypeScript
  - Redux for state management
  - Tailwind CSS for styling
  - Socket.io for real-time features

- **Backend:**
  - Node.js with Express
  - MongoDB with Mongoose
  - JWT for authentication
  - Socket.io for real-time communication

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5050

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/smart-notepad

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_here

# Optional: Add other environment variables as needed
NODE_ENV=development
```

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-notepad
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Start the development servers:
```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory)
npm run dev
```

## Security Notes

- Never commit the `.env` file to version control
- Keep your JWT secret secure and unique
- Use strong passwords for MongoDB
- Regularly update dependencies to patch security vulnerabilities

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 