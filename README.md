# CommandPal - AI-Powered Command-Line Assistant

This is a Next.js application that acts as an AI-powered assistant for command-line operations. It can convert natural language into shell commands, explain existing commands, and execute them directly from the UI.

## Features

- **Natural Language to Command**: Describe what you want to do, and the AI will generate the appropriate command for Linux, macOS, or Windows.
- **Explain Command**: Paste a command to get a clear, detailed explanation of what it does.
- **Command Execution**: Run generated commands and see the real-time output directly in the application. The command is automatically saved to a `Command.bat` file before execution.
- **History**: Your recent generations and explanations are saved for quick reference.
- **Saved Commands**: Bookmark frequently used commands for easy access.

---

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### 1. Install Dependencies

First, open your terminal, navigate to the project's root directory, and install the necessary npm packages.

```bash
npm install
```

### 2. Set Up Environment Variables

The application uses the Google Gemini API for its AI capabilities. You will need an API key to enable these features.

1.  Create a new file named `.env` in the root of the project directory.
2.  Obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  Add the following line to your `.env` file, replacing `YOUR_API_KEY` with your actual key:

```
GEMINI_API_KEY=YOUR_API_KEY
```

### 3. Run the Application

You can start the application using the provided batch file or by running the commands manually.

#### Easy Way (Single Click)

Simply double-click the `run.bat` file in the project's root directory. This will automatically open two new command prompt windows: one for the AI service and one for the frontend application.

#### Manual Way

If you prefer to run the services manually, you will need to open **two separate terminal windows**.

**In your first terminal**, run the Genkit AI service:

```bash
npm run genkit:dev
```

This will start the server that handles all AI-related tasks like generating and explaining commands.

**In your second terminal**, run the Next.js frontend development server:

```bash
npm run dev
```

This will start the user interface of the application.

### 4. Access the Application

Once both servers are running, you can access the application by opening your web browser and navigating to:

[http://localhost:9002](http://localhost:9002)

You should now be able to use all the features of CommandPal.

---

## How Command Execution Works

When you click the **Execute** button, the application will:
1.  Automatically save the generated command into the `Command.bat` file located in the root of your project.
2.  Send a request to the local server to run the `Command.bat` file.
3.  Capture the output (or any errors) from the command and display it in the terminal view within the app.

This allows the application to safely execute commands on your local system and show you the results in real-time.
