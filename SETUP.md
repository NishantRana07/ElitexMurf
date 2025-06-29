# Elite AI Setup Guide

## Quick Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Google AI API Key (Required)
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Murf AI API Key (Required)
MURF_API_KEY=your_murf_api_key_here

# Application URL (Optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Get API Keys

#### Google AI API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Paste it in your `.env.local` file

#### Murf AI API Key
1. Go to [Murf AI](https://murf.ai/)
2. Sign up or sign in
3. Go to your account settings
4. Find your API key
5. Copy and paste it in your `.env.local` file

### 3. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 4. Run the Application

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 5. Access the Application

Open your browser and navigate to:
- **Home**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **Chat**: http://localhost:3000/chat/1

## Troubleshooting

### Common Issues

#### 1. "Failed to generate response" Error
**Cause**: Missing or invalid Google AI API key
**Solution**: 
- Check that `GOOGLE_AI_API_KEY` is set in `.env.local`
- Verify the API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Restart the development server after adding the key

#### 2. "Failed to convert text to speech" Error
**Cause**: Missing or invalid Murf AI API key
**Solution**:
- Check that `MURF_API_KEY` is set in `.env.local`
- Verify the API key is valid in your Murf AI account
- Restart the development server after adding the key

#### 3. API Quota Exceeded
**Cause**: You've reached your API usage limits
**Solution**:
- Check your Google AI usage at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Check your Murf AI usage in your account dashboard
- Wait for quota reset or upgrade your plan

#### 4. Network Errors
**Cause**: Internet connection issues or API service downtime
**Solution**:
- Check your internet connection
- Verify API services are operational
- Try again later

### Development Tips

1. **Check Console Logs**: Open browser developer tools (F12) to see detailed error messages
2. **Restart Server**: After changing environment variables, restart the development server
3. **Clear Cache**: If issues persist, clear browser cache and local storage
4. **Check Network Tab**: Use browser developer tools to monitor API requests

### Production Deployment

For production deployment:

1. **Set Environment Variables**: Add the same environment variables to your hosting platform
2. **Build the Application**: Run `npm run build` to create a production build
3. **Deploy**: Deploy to your preferred platform (Vercel, Netlify, etc.)

### Support

If you continue to experience issues:

1. Check the [README.md](README.md) for more detailed information
2. Review the error messages in the browser console
3. Verify all environment variables are correctly set
4. Ensure you have valid API keys with sufficient quota

---

**Happy coding! 🚀** 