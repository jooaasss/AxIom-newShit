# AxIom - AI-Powered Creation Platform

AxIom is a comprehensive AI-powered platform that enables users to generate text, code, images, and perform intelligent AI searches using advanced artificial intelligence models.

## Features

- **Text Generation**: Create high-quality content with AI assistance
- **Code Generation**: Generate code snippets and complete applications
- **Image Creation**: Generate stunning visuals and artwork
- **AI Search**: Perform intelligent searches with comprehensive results
- **Multi-Provider Support**: Integration with multiple AI providers
- **User Management**: Secure authentication and user profiles
- **Credit System**: Flexible usage tracking and billing

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/axiom.git
cd axiom
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- Database connection string
- AI provider API keys
- Authentication secrets
- Stripe keys (for payments)

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/axiom"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# AI Providers
OPENAI_API_KEY="your-openai-key"
ANTHROPIC_API_KEY="your-anthropic-key"
GOOGLE_API_KEY="your-google-key"

# Payments
STRIPE_SECRET_KEY="your-stripe-secret"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable"
STRIPE_WEBHOOK_SECRET="your-webhook-secret"
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- Render
- DigitalOcean App Platform

## Tech Stack

- **Framework**: Next.js 14
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Payments**: Stripe
- **AI Integration**: Multiple providers (OpenAI, Anthropic, Google, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@axiom.com or join our Discord community.
