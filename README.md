# CAPTCHA Challenge Game

A fun web-based game where players solve increasingly difficult CAPTCHAs. Challenge yourself with various types of puzzles that get progressively harder as you level up.

## Features

- Progressive difficulty levels that adapt to your progress
- Multiple CAPTCHA types:
  - Text Recognition
  - Math Problems
  - Image Selection
  - Slider Puzzles
  - Pattern Recognition
- Score tracking based on speed and accuracy
- Local storage to save your game progress
- Level sharing via encoded URLs
- Responsive design that works on all devices

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/captcha-challenge.git
   cd captcha-challenge
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Deploying to Cloudflare Workers

This project can be deployed to Cloudflare Workers. First, make sure you have Cloudflare CLI (Wrangler) installed:

```bash
npm install -D wrangler @cloudflare/workers-types @cloudflare/kv-asset-handler
```

Then, you can deploy using:

```bash
npm run deploy
```

This will build the project and deploy it to Cloudflare Workers. If this is your first deployment, you'll be prompted to log in to your Cloudflare account.

### Configuration

The deployment configuration is defined in `wrangler.toml`:

```toml
name = "captcha-game"
main = "worker.ts"
compatibility_date = "2023-01-01"

[site]
bucket = "./dist"
```

You may want to customize the `name` field to match your preferred project name in Cloudflare.

## Game Instructions

1. **Objective**: Solve the CAPTCHA puzzles within the time limit to earn points and advance to higher levels.

2. **Lives**: You start with 3 lives. Each incorrect attempt costs you one life.

3. **Scoring**: Your score is calculated based on:
   - Difficulty of the level
   - Speed of your solution
   - Accuracy

4. **CAPTCHA Types**:
   - **Text Recognition**: Type the exact text you see, with all the distortions
   - **Math Problems**: Solve the mathematical equation shown
   - **Image Selection**: Pick the correct image based on the prompt
   - **Slider Puzzles**: Drag the slider to the exact value required
   - **Pattern Recognition**: Identify the next number in a sequence

5. **Progression**: As you advance to higher levels, new CAPTCHA types will unlock and existing ones will become more challenging.

6. **Sharing**: You can share specific levels with friends using the "Share" button after completing a level.

## Project Structure

```
/src
  /components          # React components
    /captchas          # Different CAPTCHA type implementations
    /game              # Game logic components
    /ui                # Reusable UI components
  /hooks               # Custom React hooks
  /store               # State management
  /utils               # Helper functions and utilities
  /styles              # CSS styles
  /assets              # Static assets
  /types               # TypeScript type definitions
```

## Future Enhancements

- Audio CAPTCHAs
- More complex pattern recognition
- Animation-based CAPTCHAs
- Leaderboards
- Challenge modes (time attack, endurance mode)
- Custom difficulty settings

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the various CAPTCHA systems across the web
- Built with React, TypeScript, Tailwind CSS, and Framer Motion