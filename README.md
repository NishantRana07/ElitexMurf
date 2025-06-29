# Elite AI - Advanced Voice AI Platform

🚀 **Murf AI Hackathon 2025 Submission**

Elite AI is a cutting-edge AI chatbot platform that combines Google Gemini's conversational AI with Murf's advanced voice synthesis technology. Create intelligent AI agents with human-like voices for seamless, natural interactions.

## ✨ Features

### 🎤 Advanced Voice AI
- **Murf AI Integration**: Industry-leading voice synthesis technology
- **100+ Voice Options**: Multiple languages, accents, and styles
- **Real-time Voice Generation**: Instant text-to-speech conversion
- **Voice Preview**: Test voices before creating agents

### 🧠 Smart Conversations
- **Google Gemini Integration**: Intelligent, context-aware responses
- **Conversation Memory**: Maintains context across interactions
- **Natural Language Processing**: Human-like conversation flow
- **Multi-turn Dialogues**: Complex conversation handling

### 🤖 Custom AI Agents
- **Specialized Agents**: Create agents for specific use cases
- **Prompt Engineering**: Customize agent personalities and behaviors
- **Voice Customization**: Match voice to agent personality
- **Category Organization**: Organize agents by purpose

### 🎯 Auto Mode
- **Speech Recognition**: Voice-to-text input
- **Automatic Responses**: Seamless voice-to-voice conversations
- **Real-time Processing**: Instant speech recognition
- **Background Listening**: Continuous conversation flow

### 🏢 Enterprise Ready
- **Scalable Architecture**: Built for production use
- **Secure API**: Protected endpoints and data handling
- **Analytics Dashboard**: Track performance and insights
- **Multi-user Support**: Team collaboration features

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icons

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Google Generative AI**: Advanced language model
- **Murf AI API**: Voice synthesis technology
- **Axios**: HTTP client for API calls

### State Management
- **React Context**: Global state management
- **Local Storage**: Persistent data storage
- **Custom Hooks**: Reusable logic

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Google AI API key
- Murf AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/elite-ai.git
   cd elite-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_AI_API_KEY=your_google_ai_api_key_here
   MURF_API_KEY=your_murf_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
elite-ai/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── agents/        # Agent management
│   │   ├── analytics/     # Analytics data
│   │   ├── generate-response/ # AI response generation
│   │   ├── text-to-speech/    # Voice synthesis
│   │   ├── voices/        # Voice options
│   │   └── health/        # Health check
│   ├── chat/              # Chat interface
│   ├── dashboard/         # Main dashboard
│   ├── create/            # Agent creation
│   ├── analytics/         # Analytics dashboard
│   └── settings/          # User settings
├── components/            # Reusable UI components
│   └── ui/               # Shadcn/ui components
├── lib/                  # Utility libraries
│   ├── api.ts           # API client
│   ├── context.tsx      # Global state
│   ├── storage.ts       # Local storage
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # Utility functions
├── hooks/               # Custom React hooks
└── public/              # Static assets
```

## 🎯 Core Features

### Agent Management
- **Create Agents**: Build custom AI assistants with specific personalities
- **Voice Selection**: Choose from 100+ premium voices
- **Prompt Templates**: Pre-built templates for common use cases
- **Category Organization**: Organize agents by purpose

### Chat Interface
- **Real-time Chat**: Instant message exchange
- **Voice Input**: Speech-to-text functionality
- **Voice Output**: Text-to-speech responses
- **Auto Mode**: Hands-free voice conversations
- **Message History**: Persistent conversation storage

### Analytics Dashboard
- **Performance Metrics**: Track conversation and message counts
- **Response Times**: Monitor AI response speed
- **Voice Usage**: Analyze voice preferences
- **Daily Statistics**: Time-based performance data

### Settings & Configuration
- **User Preferences**: Customize app behavior
- **Theme Selection**: Light, dark, or system theme
- **Voice Settings**: Configure audio preferences
- **Data Management**: Export and clear user data

## 🔧 API Endpoints

### Agent Management
- `GET /api/agents` - Get all agents
- `POST /api/agents` - Create new agent
- `GET /api/agents/[id]` - Get specific agent
- `PUT /api/agents/[id]` - Update agent
- `DELETE /api/agents/[id]` - Delete agent

### AI Services
- `POST /api/generate-response` - Generate AI response
- `POST /api/text-to-speech` - Convert text to speech

### Analytics
- `GET /api/analytics` - Get analytics data
- `POST /api/analytics` - Update analytics

### Voice Management
- `GET /api/voices` - Get available voices

### System
- `GET /api/health` - Health check

## 🎨 UI Components

The project uses a custom component library built with:
- **Radix UI**: Accessible primitives
- **Tailwind CSS**: Utility-first styling
- **Custom Design System**: Consistent theming

### Key Components
- **Cards**: Information containers
- **Buttons**: Interactive elements
- **Forms**: Input and validation
- **Charts**: Data visualization
- **Modals**: Overlay dialogs

## 🔒 Security

- **API Key Protection**: Environment variable storage
- **Input Validation**: Server-side validation
- **Error Handling**: Graceful error management
- **Rate Limiting**: API request throttling

## 📊 Performance

- **Optimized Loading**: Fast initial page loads
- **Code Splitting**: Dynamic imports for better performance
- **Image Optimization**: Next.js image optimization
- **Caching**: Local storage and API response caching

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Static site deployment
- **Railway**: Full-stack deployment
- **AWS**: Custom infrastructure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Murf AI**: Advanced voice synthesis technology
- **Google AI**: Generative AI capabilities
- **Next.js Team**: Amazing React framework
- **Vercel**: Deployment platform
- **Open Source Community**: Libraries and tools

## 📞 Support

- **Documentation**: [docs.elite-ai.com](https://docs.elite-ai.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/elite-ai/issues)
- **Discord**: [Join our community](https://discord.gg/elite-ai)
- **Email**: support@elite-ai.com

## 🎉 Hackathon Submission

This project was created for the **Murf AI Hackathon 2025**. It demonstrates the power of combining advanced voice synthesis with intelligent conversational AI to create truly engaging user experiences.

### Key Innovations
- **Seamless Voice Integration**: Real-time voice generation and recognition
- **Intelligent Agent System**: Customizable AI personalities
- **Enterprise-Grade Architecture**: Scalable and maintainable codebase
- **Beautiful UI/UX**: Modern, accessible interface design

---

**Built with ❤️ for the Murf AI Hackathon 2025**
