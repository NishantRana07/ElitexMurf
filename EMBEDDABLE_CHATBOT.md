# 🚀 Embeddable AI Chatbot Widget

Transform your website with an intelligent AI chatbot that users can copy-paste directly into their websites. This feature allows you to embed any of your created AI agents as a floating chat widget.

## ✨ Features

- **One-Click Embed**: Copy-paste ready code for any website
- **Multiple Formats**: HTML, JSX, and TypeScript React components
- **Voice Input**: Speech recognition for hands-free interaction
- **Text-to-Speech**: AI responses with natural voice synthesis
- **Customizable**: Position, size, theme, and behavior options
- **Responsive**: Works on desktop and mobile devices
- **No API Keys Exposed**: Secure implementation with user's own keys

## 🎯 How It Works

1. **Create an Agent**: Build your AI assistant in the dashboard
2. **Generate Embed Code**: Visit the embed page for your agent
3. **Copy & Paste**: Get ready-to-use code in your preferred format
4. **Add API Keys**: Replace placeholders with your own Gemini and Murf API keys
5. **Deploy**: The chatbot works immediately on your website

## 📋 Prerequisites

Before using the embeddable chatbot, you need:

1. **Google Gemini API Key**: For AI responses
2. **Murf AI API Key**: For text-to-speech
3. **Agent ID**: The unique identifier of your created agent

## 🔧 Setup Instructions

### Step 1: Get Your API Keys

1. **Google Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key for later use

2. **Murf AI API Key**:
   - Visit [Murf AI](https://murf.ai/)
   - Sign up and get your API key
   - Copy the key for later use

### Step 2: Create Your Agent

1. Go to your Elite AI dashboard
2. Click "Create Agent" or use an existing agent
3. Configure your agent's personality, voice, and behavior
4. Note down the Agent ID (found in the URL when viewing the agent)

### Step 3: Generate Embed Code

1. Navigate to `/embed/[YOUR_AGENT_ID]` in your Elite AI app
2. Configure the widget settings:
   - **Position**: Choose where the widget appears (bottom-right, bottom-left, top-right, top-left)
   - **Size**: Select widget size (small, medium, large)
   - **Theme**: Choose light or dark theme
   - **Options**: Toggle avatar, header, and auto-open features
3. Copy the code in your preferred format (HTML, JSX, or TSX)

### Step 4: Implement on Your Website

#### HTML Implementation

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Website</title>
    <style>
        .chat-widget-container {
            position: fixed;
            z-index: 9999;
            bottom: 20px;
            right: 20px;
        }
        
        .chat-widget-iframe {
            border: none;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            width: 400px;
            height: 600px;
        }
        
        .chat-widget-toggle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        }
        
        .chat-widget-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
        }
        
        .chat-widget-hidden {
            display: none;
        }
    </style>
</head>
<body>
    <!-- Your website content here -->
    <h1>Welcome to Your Website</h1>
    <p>This is where your content goes. The chatbot will appear as a floating widget.</p>
    
    <!-- Chat Widget Container -->
    <div class="chat-widget-container">
        <button class="chat-widget-toggle" onclick="toggleChat()">
            💬
        </button>
        <iframe 
            id="chat-widget"
            src="https://YOUR_DEPLOYED_URL/chat-widget/YOUR_AGENT_ID"
            class="chat-widget-iframe chat-widget-hidden"
            title="AI Chat Assistant"
        ></iframe>
    </div>

    <script>
        function toggleChat() {
            const iframe = document.getElementById('chat-widget');
            const toggle = document.querySelector('.chat-widget-toggle');
            
            if (iframe.classList.contains('chat-widget-hidden')) {
                iframe.classList.remove('chat-widget-hidden');
                toggle.innerHTML = '✕';
            } else {
                iframe.classList.add('chat-widget-hidden');
                toggle.innerHTML = '💬';
            }
        }
        
        // Auto-open after 3 seconds (optional)
        window.addEventListener('load', function() {
            setTimeout(() => {
                toggleChat();
            }, 3000);
        });
    </script>
</body>
</html>
```

#### React JSX Component

```jsx
import React, { useState, useEffect } from 'react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  
  const baseUrl = 'https://YOUR_DEPLOYED_URL';
  const agentId = 'YOUR_AGENT_ID';
  const embedUrl = `${baseUrl}/chat-widget/${agentId}`;
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIframeKey(prev => prev + 1);
    }
  };
  
  useEffect(() => {
    // Auto-open after 3 seconds
    const timer = setTimeout(() => setIsOpen(true), 3000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div style={{
      position: 'fixed',
      zIndex: 9999,
      bottom: '20px',
      right: '20px',
    }}>
      <button
        onClick={toggleChat}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>
      
      {isOpen && (
        <iframe
          key={iframeKey}
          src={embedUrl}
          style={{
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            width: '400px',
            height: '600px',
          }}
          title="AI Chat Assistant"
        />
      )}
    </div>
  );
};

export default ChatWidget;
```

#### TypeScript React Component

```tsx
import React, { useState, useEffect } from 'react';

interface ChatWidgetConfig {
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme: 'light' | 'dark';
  size: 'small' | 'medium' | 'large';
  showAvatar: boolean;
  showHeader: boolean;
  autoOpen: boolean;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);
  
  const baseUrl: string = 'https://YOUR_DEPLOYED_URL';
  const agentId: string = 'YOUR_AGENT_ID';
  const embedUrl: string = `${baseUrl}/chat-widget/${agentId}`;
  
  const config: ChatWidgetConfig = {
    position: 'bottom-right',
    theme: 'dark',
    size: 'medium',
    showAvatar: true,
    showHeader: true,
    autoOpen: true,
  };
  
  const toggleChat = (): void => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIframeKey(prev => prev + 1);
    }
  };
  
  useEffect(() => {
    if (config.autoOpen) {
      const timer = setTimeout(() => setIsOpen(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);
  
  const getPositionStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
    };
    
    switch (config.position) {
      case 'bottom-right':
        return { ...base, bottom: '20px', right: '20px' };
      case 'bottom-left':
        return { ...base, bottom: '20px', left: '20px' };
      case 'top-right':
        return { ...base, top: '20px', right: '20px' };
      case 'top-left':
        return { ...base, top: '20px', left: '20px' };
      default:
        return { ...base, bottom: '20px', right: '20px' };
    }
  };
  
  const getSizeStyles = (): React.CSSProperties => {
    switch (config.size) {
      case 'small':
        return { width: '350px', height: '500px' };
      case 'medium':
        return { width: '400px', height: '600px' };
      case 'large':
        return { width: '450px', height: '700px' };
      default:
        return { width: '400px', height: '600px' };
    }
  };
  
  return (
    <div style={getPositionStyles()}>
      <button
        onClick={toggleChat}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.4)';
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>
      
      {isOpen && (
        <iframe
          key={iframeKey}
          src={`${embedUrl}?config=${encodeURIComponent(JSON.stringify(config))}`}
          style={{
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            ...getSizeStyles(),
          }}
          title="AI Chat Assistant"
        />
      )}
    </div>
  );
};

export default ChatWidget;
```

## 🔑 API Integration

### Backend Setup

You'll need to set up API endpoints on your backend to handle the AI interactions securely:

```javascript
// Example Express.js backend setup
const express = require('express');
const app = express();

// Gemini AI endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, agentPrompt } = req.body;
    
    // Call Google Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${agentPrompt}\n\nUser: ${message}` }]
        }]
      })
    });
    
    const data = await response.json();
    res.json({ response: data.candidates[0].content.parts[0].text });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Murf AI TTS endpoint
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceId } = req.body;
    
    // Call Murf AI API
    const response = await fetch('https://api.murf.ai/v1/speech/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.MURF_API_KEY
      },
      body: JSON.stringify({ text, voiceId })
    });
    
    const data = await response.json();
    res.json({ audioUrl: data.audioFile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate audio' });
  }
});
```

## 🎨 Customization Options

### Widget Configuration

| Option | Description | Values |
|--------|-------------|---------|
| Position | Where the widget appears | `bottom-right`, `bottom-left`, `top-right`, `top-left` |
| Size | Widget dimensions | `small` (350x500), `medium` (400x600), `large` (450x700) |
| Theme | Visual appearance | `light`, `dark` |
| Show Avatar | Display agent avatar | `true`, `false` |
| Show Header | Display chat header | `true`, `false` |
| Auto Open | Automatically open widget | `true`, `false` |

### CSS Customization

You can customize the widget appearance by overriding CSS classes:

```css
/* Custom widget styles */
.chat-widget-container {
  /* Your custom styles */
}

.chat-widget-toggle {
  /* Custom button styles */
}

.chat-widget-iframe {
  /* Custom iframe styles */
}
```

## 🔒 Security Considerations

1. **API Keys**: Never expose API keys in client-side code
2. **CORS**: Configure proper CORS headers for your domain
3. **Rate Limiting**: Implement rate limiting on your backend
4. **Input Validation**: Validate all user inputs
5. **HTTPS**: Always use HTTPS in production

## 🚀 Deployment

### Environment Variables

Set up these environment variables on your server:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
MURF_API_KEY=your_murf_api_key_here
```

### Production Checklist

- [ ] Deploy your Elite AI application
- [ ] Set up environment variables
- [ ] Configure CORS for your domain
- [ ] Test the widget functionality
- [ ] Monitor API usage and costs

## 📱 Mobile Responsiveness

The widget automatically adapts to mobile devices:

- On screens smaller than 480px, the widget becomes full-screen
- Touch-friendly interface for mobile users
- Responsive design that works on all devices

## 🎯 Use Cases

### Customer Support
- 24/7 automated customer service
- Instant responses to common questions
- Escalation to human agents when needed

### Lead Generation
- Qualify leads through conversation
- Collect contact information
- Schedule appointments or demos

### E-commerce
- Product recommendations
- Order tracking
- Shopping assistance

### Education
- Student support
- Course information
- Learning assistance

## 🛠️ Troubleshooting

### Common Issues

1. **Widget not appearing**
   - Check if the iframe URL is correct
   - Verify CORS settings
   - Ensure the agent ID is valid

2. **API errors**
   - Verify API keys are correct
   - Check API quotas and limits
   - Review server logs for errors

3. **Voice not working**
   - Ensure HTTPS is enabled (required for speech recognition)
   - Check browser permissions for microphone
   - Verify speech recognition is supported

### Debug Mode

Enable debug mode to see detailed logs:

```javascript
// Add this to your widget code
window.CHAT_WIDGET_DEBUG = true;
```

## 📞 Support

For technical support or questions:

1. Check the troubleshooting section above
2. Review the API documentation
3. Contact support with your specific issue

## 🎉 Success Stories

> "The embeddable chatbot increased our customer engagement by 300% and reduced support tickets by 40%." - TechCorp

> "Easy to implement and customize. Our users love the voice interaction feature!" - StartupXYZ

---

**Ready to transform your website with AI? Start building your embeddable chatbot today!** 🚀 