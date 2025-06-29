"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  User,
  Bell,
  Palette,
  Volume2,
  Shield,
  Database,
  Download,
  Trash2,
  Save,
  ArrowLeft,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useApp } from "@/lib/context"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { settings, updateSettings, user, logout } = useApp()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const handleSettingChange = (key: string, value: any) => {
    updateSettings({ [key]: value })
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your data is being prepared for download.",
    })
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      toast({
        title: "Data Cleared",
        description: "All local data has been cleared.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Image
                  src="/elite-ai-logo.png"
                  alt="Elite AI"
                  width={32}
                  height={24}
                  className="w-8 h-6 object-contain"
                />
                <h1 className="text-2xl font-bold text-white">Settings</h1>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Profile */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  User Profile
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Manage your account information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    Display Name
                  </Label>
                  <Input
                    id="name"
                    value={user?.name || ""}
                    placeholder="Enter your display name"
                    className="bg-black/20 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    placeholder="Enter your email"
                    className="bg-black/20 border-white/20 text-white placeholder:text-gray-500"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan" className="text-gray-300">
                    Current Plan
                  </Label>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-100/10 text-purple-300 border-purple-500/30">
                      {user?.plan || "Free"}
                    </Badge>
                    <Button variant="outline" size="sm" className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent">
                      Upgrade
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Appearance
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-gray-300">
                    Theme
                  </Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => handleSettingChange("theme", value)}
                  >
                    <SelectTrigger className="bg-black/20 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/20">
                      <SelectItem value="light" className="text-white hover:bg-white/10">Light</SelectItem>
                      <SelectItem value="dark" className="text-white hover:bg-white/10">Dark</SelectItem>
                      <SelectItem value="system" className="text-white hover:bg-white/10">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Voice & Audio */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Voice & Audio
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configure voice and audio settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-gray-300">Voice Preview</Label>
                    <p className="text-gray-400 text-sm">Play voice samples when selecting voices</p>
                  </div>
                  <Switch
                    checked={settings.voicePreview}
                    onCheckedChange={(checked) => handleSettingChange("voicePreview", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-gray-300">Auto Mode</Label>
                    <p className="text-gray-400 text-sm">Enable automatic voice-to-voice conversations</p>
                  </div>
                  <Switch
                    checked={settings.autoMode}
                    onCheckedChange={(checked) => handleSettingChange("autoMode", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Manage notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-gray-300">Push Notifications</Label>
                    <p className="text-gray-400 text-sm">Receive notifications for new messages</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  className="w-full border-white/20 text-gray-300 hover:bg-white/10 bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearData}
                  className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10 bg-transparent"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Data
                </Button>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Member Since</span>
                  <span className="text-white">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Last Login</span>
                  <span className="text-white">
                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <Separator className="bg-white/20" />
                <Button
                  variant="outline"
                  onClick={logout}
                  className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10 bg-transparent"
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">API Status</span>
                  <Badge className="bg-green-100/10 text-green-300 border-green-500/30">
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Voice Service</span>
                  <Badge className="bg-green-100/10 text-green-300 border-green-500/30">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">AI Service</span>
                  <Badge className="bg-green-100/10 text-green-300 border-green-500/30">
                    Available
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>  
    </div>
  )
} 