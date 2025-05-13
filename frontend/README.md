# Smart Notepad Frontend

A modern, feature-rich note-taking application built with React and TypeScript.

## Features

- 📝 Create, edit, and organize notes
- 🎨 Markdown support with live preview
- 🌓 Dark/Light theme
- 🔍 Search functionality
- 👥 Share notes with other users
- 📱 Responsive design
- 🔒 Secure authentication

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/smart-notepad.git
   cd smart-notepad/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_NAME=Smart Notepad
   REACT_APP_VERSION=0.1.0
   ```

   Note: Make sure to replace the API URL with your actual backend URL in production.

4. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Environment Variables

The following environment variables are used in the application:

- `REACT_APP_API_URL`: The URL of the backend API
- `REACT_APP_NAME`: The name of the application
- `REACT_APP_VERSION`: The version of the application

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── services/      # API and other services
  ├── store/         # Redux store and slices
  ├── hooks/         # Custom React hooks
  ├── utils/         # Utility functions
  └── styles/        # Global styles
```

## Dependencies

- React 18
- TypeScript
- Material-UI
- Redux Toolkit
- React Router
- Axios
- React Markdown

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 