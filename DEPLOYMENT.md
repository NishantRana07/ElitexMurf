# Elite AI Deployment Guide

## 🚀 Vercel Deployment

### 1. Environment Variables for Vercel

Add these environment variables in your Vercel dashboard:

```env
GOOGLE_AI_API_KEY=AIzaSyCEUw8hi5QajCQ6vaBwZ-93v48JoWDx8u8
MURF_API_KEY=ap2_212a8c26-44b3-46ae-872a-735aa2c74974
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

### 2. Vercel Dashboard Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Go to "Settings" → "Environment Variables"
5. Add the three variables above
6. Deploy!

### 3. Local Development

For local development, create a `.env.local` file:

```env
GOOGLE_AI_API_KEY=AIzaSyCEUw8hi5QajCQ6vaBwZ-93v48JoWDx8u8
MURF_API_KEY=ap2_212a8c26-44b3-46ae-872a-735aa2c74974
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🔧 API Keys Configuration

### Google AI API Key
- **Key**: `AIzaSyCEUw8hi5QajCQ6vaBwZ-93v48JoWDx8u8`
- **Service**: Google Generative AI (Gemini)
- **Usage**: Text generation and conversation

### Murf AI API Key
- **Key**: `ap2_212a8c26-44b3-46ae-872a-735aa2c74974`
- **Service**: Murf AI Voice Synthesis
- **Usage**: Text-to-speech conversion

## 📋 Quick Start Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Access URLs

- **Local**: http://localhost:3000
- **Vercel**: https://your-app-name.vercel.app

## ✅ Features Ready

- ✅ **AI Chat**: Google Gemini integration
- ✅ **Voice Synthesis**: Murf AI integration
- ✅ **Agent Management**: Create and manage AI agents
- ✅ **Analytics**: Track usage and performance
- ✅ **Responsive Design**: Mobile and desktop optimized

## 🔒 Security Notes

- API keys are configured for immediate use
- Keys are set as fallbacks in API routes
- Environment variables take precedence
- Production deployment uses Vercel environment variables

---

**Ready to deploy! 🎉** 