# CommandPal: AI-Powered Command-Line Assistant - Project Report

## 1. Project Overview

**CommandPal** is a modern, AI-powered web application designed to act as an intelligent assistant for command-line operations. Built with Next.js and Google's Gemini AI, it provides a user-friendly interface to bridge the gap between natural language and complex shell commands.

The application serves three primary functions:
1.  **Translate**: It converts natural language descriptions into executable shell commands for various operating systems (Linux, macOS, Windows).
2.  **Explain**: It demystifies existing shell commands by providing clear, detailed explanations of their purpose, flags, and arguments.
3.  **Execute**: It allows users to run the generated commands directly from the UI and view the real-time output, creating a seamless workflow for developers, system administrators, and students.

Additional features like command history and a library of saved commands enhance productivity by making it easy to reuse and recall past operations.

---

## 2. Core Features

### 2.1. Natural Language to Command
-   **Functionality**: Users can describe a task in plain English (e.g., "find all text files in the current folder and delete them"). The AI interprets the request and generates the precise command-line equivalent.
-   **OS Selection**: A dropdown menu allows the user to specify the target operating system (Linux, macOS, or Windows) to ensure the generated command is syntactically correct for the intended environment.

### 2.2. Explain Command
-   **Functionality**: Users can paste any shell command into an input field. The AI analyzes the command and returns a detailed, easy-to-understand explanation of what it does, breaking down each component, flag, and parameter.

### 2.3. Command Execution
-   **Functionality**: After a command is generated or explained, an "Execute" button becomes available. When clicked, the application securely runs the command on the local server environment.
-   **Real-time Output**: The standard output (`stdout`) and standard error (`stderr`) from the command's execution are captured and displayed in a terminal-like view within the UI, providing immediate feedback.

### 2.4. Command History
-   **Functionality**: Every command that is generated or explained is automatically saved to the user's browser local storage.
-   **Review**: The "History" tab displays a paginated list of past entries, showing the initial input, the resulting command or explanation, and when it was created. This allows for easy review and reuse.

### 2.5. Saved Commands
-   **Functionality**: Users can manually save their most frequently used or important commands to a personal library.
-   **Quick Access**: The "Saved" tab provides a persistent list of these commands, complete with their descriptions, for quick reference and copying.

---

## 3. Technical Architecture

The application is built on a modern tech stack, separating concerns between the frontend user interface and the backend AI processing.

### 3.1. Frontend
-   **Framework**: **Next.js 15** (with App Router) provides a powerful React-based foundation for building the user interface. It enables server-side rendering and client-side interactivity.
-   **Language**: **TypeScript** is used for type safety, improving code quality and developer experience.
-   **UI Components**: **ShadCN/UI** and **Radix UI** provide a set of accessible, themeable, and production-ready components.
-   **Styling**: **Tailwind CSS** is used for utility-first styling, enabling rapid and consistent UI development.
-   **State Management**: A combination of React hooks (`useState`) and a custom `useLocalStorage` hook for persisting data like history and saved commands.

### 3.2. Backend & AI Integration
-   **AI Framework**: **Genkit** is used as the backbone for all AI-related operations. It simplifies interactions with large language models (LLMs).
-   **AI Model**: **Google Gemini 2.5 Flash** is the underlying model that powers the command generation and explanation capabilities.
-   **Server-Side Logic**: **Next.js Server Actions** are used to create a secure bridge between the client-side UI and the server-side AI flows. These actions handle requests from the user, invoke the appropriate AI flow, and return the result.
-   **Execution Environment**: **Node.js**'s built-in `child_process` module is used on the server to safely execute the `Command.bat` file.

---

## 4. How It Works: Step-by-Step Flow

### 4.1. Natural Language to Command & Execute
1.  **User Input**: The user types a query (e.g., "list all running processes") into the textarea on the "Natural Language" tab and selects an OS.
2.  **Client Request**: The `NaturalLanguageForm` component calls the `handleNaturalLanguageToCommand` server action located in `src/app/actions.ts`.
3.  **AI Flow Invocation**: The server action invokes the `convertNaturalLanguageToCommandFlow` AI flow from `src/ai/flows/natural-language-to-command.ts`.
4.  **AI Generation**: This flow constructs a prompt with the user's query and sends it to the Gemini model via Genkit. The model returns the corresponding shell command as a string.
5.  **Save to `Command.bat`**: The `handleNaturalLanguageToCommand` action receives the command and writes it to the `Command.bat` file in the project's root directory using Node.js's `fs` module.
6.  **UI Update**: The server action returns the generated command to the frontend, which updates the UI to display it in a code block.
7.  **Execution**: The user clicks the "Execute" button.
8.  **Execute Request**: The UI calls the `handleExecuteCommand` server action.
9.  **Run Batch File**: This action reads the content of `Command.bat` and uses the `executeCommandFlow` to run it on the server via `child_process.exec`.
10. **Display Output**: The flow captures `stdout` and `stderr` and returns them to the UI, which displays the results in the execution panel.

### 4.2. Explain Command & Execute
The flow for explaining a command is very similar:
1.  **User Input**: The user pastes a command (e.g., `git log --oneline -5`) into the input field on the "Explain" tab.
2.  **Client Request**: The `CommandExplanationForm` component calls the `handleExplainCommand` server action.
3.  **AI Flow Invocation**: The action invokes the `explainCommandFlow`.
4.  **AI Explanation**: The flow sends the command to the Gemini model, which returns a detailed explanation.
5.  **Save to `Command.bat`**: The `handleExplainCommand` action saves the *input command* (not the explanation) to `Command.bat`.
6.  **UI Update**: The explanation is returned to the UI and displayed.
7.  **Execution**: The execution flow proceeds exactly as described in the "Natural Language" section (steps 7-10).

---

## 5. Local Setup and Running Instructions

To run this project on a local machine, follow these steps:

### Prerequisites
-   [Node.js](https://nodejs.org/) (version 20 or later recommended)
-   [npm](https://www.npmjs.com/) (which comes with Node.js)

### Step 1: Install Dependencies
Open a terminal in the project's root directory and run the following command to install all required packages:
```bash
npm install
```

### Step 2: Set Up Environment Variables
The application uses the Google Gemini API. An API key is required.

1.  Create a new file named `.env` in the root of the project directory.
2.  Obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  Add the following line to your `.env` file, replacing `YOUR_API_KEY` with your actual key:

```
GEMINI_API_KEY=YOUR_API_KEY
```

### Step 3: Run the Application (Single Click)
The easiest way to start the application is to use the provided batch file.

-   Simply double-click the `run.bat` file in the project's root directory.

This script will automatically open two new command prompt windows:
-   One for the **Genkit AI service**, which handles all AI tasks.
-   One for the **Next.js frontend server**, which serves the user interface.

### Step 4: Access the Application
Once both servers are running, open your web browser and navigate to:

**[http://localhost:9002](http://localhost:9002)**

You can now interact with the CommandPal application.
