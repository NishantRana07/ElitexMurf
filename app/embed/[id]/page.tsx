"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, ArrowLeft, Bot } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useApp } from "@/lib/context"
import { useToast } from "@/hooks/use-toast"

export default function EmbedPage() {
  const params = useParams()
  const { agents } = useApp()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const agentId = params.id as string
  const agent = agents.find(a => a.id === agentId)

  const generateEmbedCode = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Website</title>
    <style>
        .chat-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            font-family: Arial, sans-serif;
        }
        
        .chat-toggle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            cursor: pointer;
            color: white;
            font-size: 24px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        }
        
        .chat-toggle:hover {
            transform: scale(1.1);
        }
        
        .chat-container {
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            display: none;
            flex-direction: column;
        }
        
        .chat-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            border-radius: 12px 12px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .chat-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            max-height: 350px;
        }
        
        .message {
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 8px;
            max-width: 80%;
        }
        
        .user-message {
            background: #e3f2fd;
            margin-left: auto;
            text-align: right;
        }
        
        .bot-message {
            background: #f5f5f5;
        }
        
        .chat-input {
            padding: 15px;
            border-top: 1px solid #eee;
        }
        
        .chat-input input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 20px;
            outline: none;
        }
        
        .chat-input input:focus {
            border-color: #667eea;
        }
        
        .close-btn {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 18px;
        }
        
        .mic-button {
            background: #667eea;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            margin-left: 10px;
        }
        
        .input-container {
            display: flex;
            align-items: center;
        }
    </style>
</head>
<body>
    <h1>Welcome to Your Website</h1>
    <p>This is where your content goes. The chatbot will appear as a floating widget.</p>
    
    <div class="chat-widget">
        <button class="chat-toggle" onclick="toggleChat()">💬</button>
        <div class="chat-container" id="chatContainer">
            <div class="chat-header">
                <span>${agent?.name || 'AI Assistant'}</span>
                <button class="close-btn" onclick="toggleChat()">✕</button>
            </div>
            <div class="chat-messages" id="chatMessages">
                <div class="message bot-message">${agent?.firstMessage || 'Hello! How can I help you today?'}</div>
            </div>
            <div class="chat-input">
                <div class="input-container">
                    <input type="text" id="messageInput" placeholder="Type your message..." onkeypress="handleKeyPress(event)">
                    <button class="mic-button" id="micButton" onclick="toggleVoice()">🎤</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        const CONFIG = {
            GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY_HERE',
            MURF_API_KEY: 'YOUR_MURF_API_KEY_HERE',
            AGENT_NAME: '${agent?.name || 'AI Assistant'}',
            SYSTEM_PROMPT: '${agent?.prompt || 'You are a helpful, friendly AI assistant.'}',
            VOICE_ID: '${agent?.voiceId || 'en-US-terrell'}',
            AUTO_MODE: true,
            SILENCE_TIMEOUT: 1000,
        };

        let isOpen = false;
        let isListening = false;
        let recognition = null;
        let silenceTimeout = null;

        const chatContainer = document.getElementById('chatContainer');
        const chatMessages = document.getElementById('chatMessages');
        const messageInput = document.getElementById('messageInput');
        const micButton = document.getElementById('micButton');
        const toggleButton = document.querySelector('.chat-toggle');

        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                toggleChat();
            }, 3000);
            initializeSpeechRecognition();
        });

        function toggleChat() {
            isOpen = !isOpen;
            
            if (isOpen) {
                chatContainer.style.display = 'flex';
                toggleButton.innerHTML = '✕';
                messageInput.focus();
            } else {
                chatContainer.style.display = 'none';
                toggleButton.innerHTML = '💬';
                if (isListening) {
                    stopListening();
                }
            }
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }

        function sendMessage() {
            const message = messageInput.value.trim();
            
            if (message) {
                addMessage(message, 'user');
                messageInput.value = '';
                generateAIResponse(message);
            }
        }

        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ' + sender + '-message';
            messageDiv.textContent = text;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        async function generateAIResponse(userInput) {
            if (!CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
                addMessage('Please configure your Gemini API key in the CONFIG section.', 'bot');
                return;
            }

            try {
                const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + CONFIG.GEMINI_API_KEY, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                role: "user",
                                parts: [{ text: CONFIG.SYSTEM_PROMPT + "\\n\\nUser: " + userInput }]
                            }
                        ],
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to generate response');
                }

                const data = await response.json();
                const aiResponse = data.candidates[0].content.parts[0].text;
                
                addMessage(aiResponse, 'bot');
                
                if (CONFIG.MURF_API_KEY && CONFIG.MURF_API_KEY !== 'YOUR_MURF_API_KEY_HERE') {
                    await generateAndPlayAudio(aiResponse);
                }
                
            } catch (error) {
                console.error('Error generating AI response:', error);
                addMessage('Sorry, I encountered an error. Please try again.', 'bot');
            }
        }

        async function generateAndPlayAudio(text) {
            try {
                const response = await fetch('https://api.murf.ai/v1/speech/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'api-key': CONFIG.MURF_API_KEY,
                    },
                    body: JSON.stringify({
                        text: text,
                        voiceId: CONFIG.VOICE_ID,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to generate audio');
                }

                const data = await response.json();
                if (data.audioFile) {
                    playAudio(data.audioFile);
                }
            } catch (error) {
                console.error('Error generating audio:', error);
            }
        }

        function playAudio(audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
            });
        }

        function initializeSpeechRecognition() {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                console.warn('Speech recognition not supported');
                return;
            }

            recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                isListening = true;
                micButton.style.background = '#f44336';
            };

            recognition.onresult = (event) => {
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    }
                }

                if (finalTranscript) {
                    messageInput.value = finalTranscript;
                    
                    if (CONFIG.AUTO_MODE) {
                        if (silenceTimeout) {
                            clearTimeout(silenceTimeout);
                        }
                        silenceTimeout = setTimeout(() => {
                            if (finalTranscript.trim()) {
                                sendMessage();
                            }
                        }, CONFIG.SILENCE_TIMEOUT);
                    }
                }
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                stopListening();
            };

            recognition.onend = () => {
                stopListening();
            };
        }

        function toggleVoice() {
            if (isListening) {
                stopListening();
            } else {
                startListening();
            }
        }

        function startListening() {
            if (recognition && !isListening) {
                try {
                    recognition.start();
                } catch (error) {
                    console.error('Error starting speech recognition:', error);
                }
            }
        }

        function stopListening() {
            if (recognition && isListening) {
                recognition.stop();
                isListening = false;
                micButton.style.background = '#667eea';
                
                if (silenceTimeout) {
                    clearTimeout(silenceTimeout);
                    silenceTimeout = null;
                }
            }
        }
    </script>
</body>
</html>`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateEmbedCode())
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Embed code copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  if (!agent) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Agent not found
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Embed Chatbot</h1>
          <p className="text-muted-foreground">
            Get embed code for {agent.name}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Complete Embedded Chatbot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">HTML</Badge>
                <span className="text-sm text-muted-foreground">
                  Complete standalone HTML with Gemini AI + Murf TTS
                </span>
              </div>
              <Button onClick={copyToClipboard} size="sm">
                {copied ? (
                  <Check className="w-4 h-4 mr-2" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copied ? 'Copied!' : 'Copy Code'}
              </Button>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
                <code>{generateEmbedCode()}</code>
              </pre>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>Features:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Gemini AI integration with system prompt</li>
                <li>Murf AI text-to-speech with voice settings</li>
                <li>Auto Mode - automatically sends messages after voice input</li>
                <li>Voice recognition with real-time transcript</li>
                <li>Floating chat widget with toggle button</li>
                <li>Auto-opens after 3 seconds</li>
                <li>Responsive design</li>
                <li>Complete agent configuration</li>
              </ul>
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium mb-2">Setup Instructions:</p>
                <ol className="text-blue-700 text-xs space-y-1 list-decimal list-inside">
                  <li>Replace <code>YOUR_GEMINI_API_KEY_HERE</code> with your actual Gemini API key</li>
                  <li>Replace <code>YOUR_MURF_API_KEY_HERE</code> with your actual Murf AI API key</li>
                  <li>Customize voice settings (speed, pitch, volume) in the CONFIG section</li>
                  <li>Save as .html file and open in any browser</li>
                </ol>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 