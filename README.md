
# CommandPal - Local Development Setup

This is a Next.js application with a Genkit AI backend. To run this project locally, you will need to run both the frontend web server and the backend AI service.

## Prerequisites

1.  **Node.js:** Make sure you have Node.js installed (version 18.0 or later). You can download it from [nodejs.org](https://nodejs.org/).
2.  **npm:** Node.js comes with npm (Node Package Manager).

## Step-by-Step Instructions

### 1. Download and Extract the Code

First, download all the project files and extract them into a folder on your local machine.

### 2. Install Dependencies

Open your terminal or command prompt, navigate into the project folder you just created, and run the following command to install all the necessary packages:

```bash
npm install
```

### 3. Set Up Your Environment Variable

The AI part of this application uses Google's Gemini model, which requires an API key.

1.  **Create a `.env` file** in the root of your project folder. This file is used to store secret keys securely.

2.  **Get your Gemini API Key:**
    *   Go to the [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   Click "**Create API key**" to get your key.

3.  **Add the key to your `.env` file.** Open the `.env` file and add the following line, replacing `YOUR_API_KEY` with the key you just copied:

    ```
    GEMINI_API_KEY="YOUR_API_KEY"
    ```

### 4. Run the Application

You need to run two processes in two separate terminals.

**Terminal 1: Start the AI Backend (Genkit)**

In your first terminal, run this command to start the Genkit AI service. This service is what processes your natural language requests.

```bash
npm run genkit:watch
```

This will start the AI flows and watch for any changes you make to the AI-related files.

**Terminal 2: Start the Frontend (Next.js)**

In your second terminal, run this command to start the user interface:

```bash
npm run dev
```

### 5. Open CommandPal

Once both processes are running, you can open your web browser and go to the following address to use the application:

[**http://localhost:9002**](http://localhost:9002)

You should now see the CommandPal interface and be able to interact with it.
