# Runway to Reality

## AI Fashion Hackathon

This repository is for the GDG Brooklyn x Vonage AI Fashion Hackathon on
September 12, 2026, in New York, NY.

## Challenge

Build a fashion-focused application powered by:

- Google Gemini for image understanding, style suggestions, and AI features
- The Vonage Video API for live, shareable video experiences

Possible ideas include virtual try-on rooms, personal stylists, live shopping
streams, outfit rating bots, and Fashion Week lookbook tools.

## Run Locally

Requirements: Node.js LTS and Python 3.11+.

1. Install JavaScript dependencies:

   ```bash
   npm install
   ```

2. Create your local environment file:

   ```bash
   # macOS/Linux
   cp .env.example .env.local

   # Windows PowerShell
   Copy-Item .env.example .env.local
   ```

3. Add `GEMINI_API_KEY` and your Vonage values to `.env.local`. Never commit
   this file. Gemini handles visual understanding and primitive image
   generation; Vonage handles live camera sessions.

4. Start Forma locally for object generation. From a Forma-OSS checkout, run:

   ```powershell
   .\scripts\development\dev.ps1
   ```

   Keep `FORMA_MODE=local` and `FORMA_MCP_URL=http://127.0.0.1:8000/mcp` in
   `.env.local`.

5. Start the app:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000/workspace](http://localhost:3000/workspace).

## Verify

Run the production build before opening a pull request:

```bash
npm run build
```

Upload an image or MP4, enter creative intent, generate primitives, select a
primitive, and send it to Forma. Camera and microphone access are required for
live capture.

## Event Details

- Teams: 2-4 people
- Duration: One day
- Coding experience: Not required
- Location: New York, NY

## Project Status

This repository is the starting point for our hackathon project.

## License

This project is licensed under the MIT License.
