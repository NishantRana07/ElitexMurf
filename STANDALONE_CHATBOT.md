# 🤖 Standalone AI Chatbot Widget

A completely self-contained AI chatbot widget that you can copy-paste directly into any website. No server setup required - just add your API keys and deploy!

## ✨ Features

- **🎯 Completely Standalone** - Single HTML file with embedded CSS and JavaScript
- **🤖 Google Gemini AI Integration** - Powered by Google's latest AI model
- **🎤 Voice Input & Output** - Speech recognition and text-to-speech with Murf AI
- **📱 Responsive Design** - Works on desktop, tablet, and mobile
- **🎨 Customizable** - Easy to customize appearance and behavior
- **⚡ No Dependencies** - No external libraries or frameworks required
- **🔒 Secure** - API keys are client-side (use with caution in production)

## 🚀 Quick Start

1. **Download the file**: `standalone-chatbot.html`
2. **Replace API keys** in the CONFIG section
3. **Upload to your website** - it works immediately!

## 🔑 Required API Keys

### Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Replace `YOUR_GEMINI_API_KEY_HERE` in the CONFIG section

### Murf AI API (for voice features)
1. Go to [Murf AI](https://murf.ai/)
2. Sign up and get your API key
3. Replace `YOUR_MURF_API_KEY_HERE` in the CONFIG section

## ⚙️ Configuration

Find the `CONFIG` object in the JavaScript section and customize:

```javascript
const CONFIG = {
    // 🔑 API Keys
    GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY_HERE',
    MURF_API_KEY: 'YOUR_MURF_API_KEY_HERE',
    
    // 🤖 Agent Configuration
    AGENT_NAME: 'Your AI Assistant',
    AGENT_DESCRIPTION: 'Your helpful AI companion',
    FIRST_MESSAGE: 'Hello! How can I help you today?',
    SYSTEM_PROMPT: 'You are a helpful, friendly AI assistant...',
    
    // 🎤 Voice Settings
    VOICE_ID: 'en-US-terrell', // Murf AI voice ID
    VOICE_SPEED: 1.0, // Voice speed (0.5 to 2.0)
    VOICE_PITCH: 0, // Voice pitch (-50 to 50)
    VOICE_VOLUME: 1.0, // Voice volume (0.0 to 1.0)
    
    // 🎨 Widget Settings
    AUTO_OPEN: false, // Set to true to auto-open
    AUTO_OPEN_DELAY: 3000, // Delay before auto-opening
    POSITION: 'bottom-right', // Widget position
    SIZE: 'medium', // Widget size
    THEME: 'dark', // Theme
};
```

## 🎨 Customization Options

### Widget Position
- `'bottom-right'` (default)
- `'bottom-left'`
- `'top-right'`
- `'top-left'`

### Widget Size
- `'small'` (350x500px)
- `'medium'` (400x600px) - default
- `'large'` (450x700px)

### Theme
- `'dark'` (default) - Dark gradient theme
- `'light'` - Light theme

### Voice Settings
- **Voice ID**: Choose from Murf AI's voice library
- **Speed**: 0.5 (slow) to 2.0 (fast)
- **Pitch**: -50 (low) to 50 (high)
- **Volume**: 0.0 (mute) to 1.0 (full volume)

## 📱 Usage Examples

### Basic Integration
Simply include the HTML file in your website:

```html
<!-- Option 1: Direct file inclusion -->
<iframe src="standalone-chatbot.html" style="display: none;"></iframe>

<!-- Option 2: Copy the entire HTML content -->
<!-- Paste the entire HTML content from standalone-chatbot.html -->
```

### Custom Styling
You can override the widget styles by adding CSS:

```css
/* Customize widget appearance */
.chat-widget-container {
    /* Your custom styles */
}

.chat-widget-toggle {
    /* Customize the chat button */
}
```

### Advanced Configuration
For production use, consider these security enhancements:

```javascript
// Example: Load API keys from environment variables
const CONFIG = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    MURF_API_KEY: process.env.MURF_API_KEY,
    // ... other settings
};
```

## 🔧 API Integration Details

### Google Gemini API
The widget uses Google's Gemini 2.0 Flash model for AI responses:

```javascript
// API Endpoint
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent

// Request Format
{
    contents: conversationHistory,
    generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
    }
}
```

### Murf AI TTS API
Text-to-speech conversion using Murf AI:

```javascript
// API Endpoint
https://api.murf.ai/v1/speech/generate

// Request Format
{
    text: "Text to convert to speech",
    voiceId: "en-US-terrell",
    speed: 1.0,
    pitch: 0,
    volume: 1.0
}
```

## 🛡️ Security Considerations

### API Key Security
- **Development**: API keys in client-side code are fine for testing
- **Production**: Consider using a backend proxy to protect API keys
- **Rate Limiting**: Implement rate limiting to prevent abuse

### CORS Issues
If you encounter CORS errors:
1. Ensure your API keys are valid
2. Check that the APIs allow requests from your domain
3. Consider using a proxy server for production

## 🐛 Troubleshooting

### Common Issues

**"API Error: 401 - Unauthorized"**
- Check that your API keys are correct
- Ensure API keys have proper permissions

**"Speech recognition not supported"**
- Use Chrome or Edge browser
- Ensure microphone permissions are granted

**"TTS Error: API Error"**
- Verify Murf AI API key is valid
- Check API quota and billing status

**Widget not appearing**
- Check z-index conflicts with other elements
- Ensure JavaScript is enabled

### Debug Mode
Enable console logging for debugging:

```javascript
// Add this to the CONFIG object
DEBUG: true
```

## 📊 Performance Optimization

### Best Practices
1. **Minimize API calls** - Implement conversation caching
2. **Optimize voice settings** - Use appropriate voice parameters
3. **Lazy loading** - Load the widget only when needed
4. **CDN hosting** - Host the file on a CDN for faster loading

### Caching Strategy
```javascript
// Example: Cache conversation history
localStorage.setItem('chatHistory', JSON.stringify(conversationHistory));
```

## 🔄 Updates and Maintenance

### Version History
- **v1.0** - Initial release with Gemini and Murf AI integration
- **v1.1** - Added voice input/output capabilities
- **v1.2** - Enhanced customization options

### Updating the Widget
1. Download the latest version
2. Replace your existing file
3. Update configuration if needed
4. Test thoroughly

## 📞 Support

### Getting Help
- Check the troubleshooting section above
- Review API documentation for Gemini and Murf AI
- Test with the demo page first

### Contributing
Feel free to customize and improve the widget for your needs!

## 📄 License

This widget is provided as-is for educational and commercial use. Please ensure you comply with the terms of service for Google Gemini and Murf AI APIs.

---

**Ready to deploy?** Just replace the API keys and upload the HTML file to your website! 🚀 