@echo off
echo Starting Genkit AI service...
start "Genkit" cmd /k "npm run genkit:dev"

echo Starting Next.js frontend...
start "Next.js" cmd /k "npm run dev"

echo Both services are starting in new command prompt windows.
