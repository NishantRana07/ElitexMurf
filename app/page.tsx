"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Bot, Mic, Sparkles, Star, Play, MessageCircle, Volume2, Brain, Shield, Globe } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const features = [
  {
    icon: <Mic className="h-6 w-6" />,
    title: "Advanced Voice AI",
    description: "Powered by Murf's industry-leading voice synthesis technology for natural conversations",
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: "Smart Conversations",
    description: "Google Gemini integration for intelligent, context-aware responses",
  },
  {
    icon: <Bot className="h-6 w-6" />,
    title: "Custom Agents",
    description: "Create specialized AI agents tailored to your specific needs and use cases",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Auto Mode",
    description: "Seamless voice-to-voice conversations with automatic speech recognition",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Enterprise Ready",
    description: "Secure, scalable, and reliable for business-critical applications",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Multi-Language",
    description: "Support for multiple languages and accents with premium voice quality",
  },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechCorp",
    content: "Elite AI transformed our customer service. The voice quality is indistinguishable from human agents.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "CTO",
    company: "StartupXYZ",
    content: "The auto-mode feature is incredible. Our users love the natural conversation flow.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "UX Designer",
    company: "DesignStudio",
    content: "Finally, an AI platform that actually understands context and responds naturally.",
    rating: 5,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/elite-ai-logo.png"
                alt="Elite AI"
                width={40}
                height={30}
                className="w-10 h-7 object-contain"
              />
              <span className="text-2xl font-bold text-white">Elite AI</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
                Testimonials
              </Link>
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
            </div>
            <div className="flex gap-3">
              <Link href="/login">
                <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-purple-100/10 text-purple-300 border-purple-500/30">
            🏆 Murf AI Hackathon 2024 Winner
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            The Future of
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}
              AI Conversations
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Create intelligent AI agents with human-like voices. Powered by Murf's advanced voice technology and Google
            Gemini's conversational AI for seamless, natural interactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-8 py-6 text-lg"
              >
                Start Building
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/chat/1">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent px-8 py-6 text-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to create, deploy, and manage intelligent AI agents with premium voice capabilities
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-black/40 border-white/10 backdrop-blur-xl hover:bg-black/50 transition-all duration-300 hover:scale-105"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="bg-black/40 border border-white/10 backdrop-blur-xl rounded-lg p-8">
            <div className="text-4xl font-bold text-white mb-2">99.9%</div>
            <div className="text-gray-300">Voice Quality</div>
          </div>
          <div className="bg-black/40 border border-white/10 backdrop-blur-xl rounded-lg p-8">
            <div className="text-4xl font-bold text-white mb-2">50ms</div>
            <div className="text-gray-300">Response Time</div>
          </div>
          <div className="bg-black/40 border border-white/10 backdrop-blur-xl rounded-lg p-8">
            <div className="text-4xl font-bold text-white mb-2">24/7</div>
            <div className="text-gray-300">Availability</div>
          </div>
          <div className="bg-black/40 border border-white/10 backdrop-blur-xl rounded-lg p-8">
            <div className="text-4xl font-bold text-white mb-2">100+</div>
            <div className="text-gray-300">Voice Options</div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of developers and businesses building the future with Elite AI
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-gray-300 text-base leading-relaxed">
                  "{testimonial.content}"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-white font-medium">{testimonial.name}</div>
                <div className="text-gray-400 text-sm">
                  {testimonial.role} at {testimonial.company}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 backdrop-blur-xl">
          <CardContent className="text-center py-16">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the AI revolution and create your first intelligent agent in minutes. Experience the power of Murf's
              voice technology today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-8 py-6 text-lg"
                >
                  <Bot className="mr-2 h-5 w-5" />
                  Create Your Agent
                </Button>
              </Link>
              <Link href="/chat/1">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent px-8 py-6 text-lg"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Try Live Demo
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/elite-ai-logo.png"
                  alt="Elite AI"
                  width={32}
                  height={24}
                  className="w-8 h-6 object-contain"
                />
                <span className="text-xl font-bold text-white">Elite AI</span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                The most advanced AI agent platform powered by Murf's voice technology and Google Gemini's intelligence.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Volume2 className="h-4 w-4" />
                <span>Powered by Murf AI • Built for Hackathon 2024</span>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <div className="space-y-2">
                <Link href="/dashboard" className="block text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/create" className="block text-gray-300 hover:text-white transition-colors">
                  Create Agent
                </Link>
                <Link href="/chat/1" className="block text-gray-300 hover:text-white transition-colors">
                  Try Demo
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <div className="space-y-2">
                <Link href="#" className="block text-gray-300 hover:text-white transition-colors">
                  About
                </Link>
                <Link href="#" className="block text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
                <Link href="#" className="block text-gray-300 hover:text-white transition-colors">
                  Support
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Elite AI. Built with ❤️ for Murf AI Hackathon.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
