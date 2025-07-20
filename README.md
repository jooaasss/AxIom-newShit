<<<<<<< HEAD
# Polniy - AI-Powered Creation Platform

A full-stack SaaS platform that offers AI-powered generation services including text, code, image, and website generation.

## Features

- 🔐 Authentication with Clerk
- 💳 Payments with Stripe
- 📊 Analytics with PostHog
- 🎨 Text, Code, Image, and Website generation
- 📱 Responsive UI with Tailwind CSS
- 🌓 Light and Dark mode
- 📜 Generation history and details
- 💰 Credit system for generations

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Auth**: Clerk
- **Database**: Prisma with your preferred database
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Payments**: Stripe
- **Analytics**: PostHog
- **AI Provider**: OpenAI

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- OpenAI API key
- Clerk account
- Stripe account
- PostHog account (optional)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-saas-platform.git
cd ai-saas-platform
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in the environment variables in `.env.local`

4. Set up the database

```bash
npx prisma generate
npx prisma db push
```

5. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - React components
- `/lib` - Utility functions and shared code
- `/prisma` - Prisma schema and migrations
- `/public` - Static assets

## API Routes

- `/api/agents/text` - Text generation
- `/api/agents/code` - Code generation
- `/api/agents/image` - Image generation
- `/api/agents/website` - Website generation
- `/api/generations` - Get all generations
- `/api/generations/[id]` - Get a specific generation
- `/api/stripe` - Create Stripe checkout session
- `/api/webhook` - Stripe webhook handler

## License

This project is licensed under the MIT License - see the LICENSE file for details.
=======
# polniy
pizdes
>>>>>>> 4b2d976f947efe67f415a9e9336ece92dc22c003
