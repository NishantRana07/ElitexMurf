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
        <div className="mobile-container mx-auto py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10 touch-button">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2 sm:gap-3">
                <Image
                  src="/elite-ai-logo.png"
                  alt="Elite AI"
                  width={32}
                  height={24}
                  className="w-6 h-5 sm:w-8 sm:h-6 object-contain"
                />
                <h1 className="mobile-heading font-bold text-white">Settings</h1>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 touch-button"
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

      <div className="mobile-container mx-auto py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* User Profile */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-white flex items-center gap-2 mobile-text">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  User Profile
                </CardTitle>
                <CardDescription className="text-gray-300 mobile-text">
                  Manage your account information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300 mobile-text">
                    Display Name
                  </Label>
                  <Input
                    id="name"
                    value={user?.name || ""}
                    placeholder="Enter your display name"
                    className="bg-black/20 border-white/20 text-white placeholder:text-gray-500 touch-button mobile-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 mobile-text">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    placeholder="Enter your email"
                    className="bg-black/20 border-white/20 text-white placeholder:text-gray-500 touch-button mobile-text"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan" className="text-gray-300 mobile-text">
                    Current Plan
                  </Label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Badge className="bg-purple-100/10 text-purple-300 border-purple-500/30 w-fit">
                      {user?.plan || "Free"}
                    </Badge>
                    <Button variant="outline" size="sm" className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent touch-button">
                      Upgrade
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-white flex items-center gap-2 mobile-text">
                  <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
                  Appearance
                </CardTitle>
                <CardDescription className="text-gray-300 mobile-text">
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-gray-300 mobile-text">
                    Theme
                  </Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => handleSettingChange("theme", value)}
                  >
                    <SelectTrigger className="bg-black/20 border-white/20 text-white touch-button mobile-text">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/20">
                      <SelectItem value="light" className="text-white hover:bg-white/10">Light</SelectItem>
                      <SelectItem value="dark" className="text-white hover:bg-white/10">Dark</SelectItem>
                      <SelectItem value="system" className="text-white hover:bg-white/10">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300 mobile-text">Compact Mode</Label>
                    <p className="text-xs text-gray-400">Reduce spacing for more content</p>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => handleSettingChange("compactMode", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-white flex items-center gap-2 mobile-text">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                  Notifications
                </CardTitle>
                <CardDescription className="text-gray-300 mobile-text">
                  Configure your notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300 mobile-text">Email Notifications</Label>
                    <p className="text-xs text-gray-400">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300 mobile-text">Push Notifications</Label>
                    <p className="text-xs text-gray-400">Get real-time alerts</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300 mobile-text">Agent Updates</Label>
                    <p className="text-xs text-gray-400">Notify when agents are updated</p>
                  </div>
                  <Switch
                    checked={settings.agentUpdates}
                    onCheckedChange={(checked) => handleSettingChange("agentUpdates", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Voice Settings */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-white flex items-center gap-2 mobile-text">
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  Voice Settings
                </CardTitle>
                <CardDescription className="text-gray-300 mobile-text">
                  Configure voice and audio preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultVoice" className="text-gray-300 mobile-text">
                    Default Voice
                  </Label>
                  <Select
                    value={settings.defaultVoice}
                    onValueChange={(value) => handleSettingChange("defaultVoice", value)}
                  >
                    <SelectTrigger className="bg-black/20 border-white/20 text-white touch-button mobile-text">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/20">
                      <SelectItem value="terrell" className="text-white hover:bg-white/10">Terrell</SelectItem>
                      <SelectItem value="natalie" className="text-white hover:bg-white/10">Natalie</SelectItem>
                      <SelectItem value="ken" className="text-white hover:bg-white/10">Ken</SelectItem>
                      <SelectItem value="julia" className="text-white hover:bg-white/10">Julia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300 mobile-text">Auto-Play Audio</Label>
                    <p className="text-xs text-gray-400">Automatically play AI responses</p>
                  </div>
                  <Switch
                    checked={settings.autoPlayAudio}
                    onCheckedChange={(checked) => handleSettingChange("autoPlayAudio", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300 mobile-text">Voice Preview</Label>
                    <p className="text-xs text-gray-400">Play voice samples when selecting</p>
                  </div>
                  <Switch
                    checked={settings.voicePreview}
                    onCheckedChange={(checked) => handleSettingChange("voicePreview", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Security */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-white mobile-text flex items-center gap-2">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full border-white/20 text-gray-300 hover:bg-white/10 bg-transparent touch-button">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full border-white/20 text-gray-300 hover:bg-white/10 bg-transparent touch-button">
                  Two-Factor Auth
                </Button>
                <Button variant="outline" className="w-full border-white/20 text-gray-300 hover:bg-white/10 bg-transparent touch-button">
                  API Keys
                </Button>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-white mobile-text flex items-center gap-2">
                  <Database className="w-4 h-4 sm:w-5 sm:h-5" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  onClick={handleExportData}
                  className="w-full border-white/20 text-gray-300 hover:bg-white/10 bg-transparent touch-button"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleClearData}
                  className="w-full border-red-500/20 text-red-300 hover:bg-red-500/10 bg-transparent touch-button"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Data
                </Button>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-white mobile-text">Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full border-white/20 text-gray-300 hover:bg-white/10 bg-transparent touch-button">
                  Billing & Usage
                </Button>
                <Button variant="outline" className="w-full border-white/20 text-gray-300 hover:bg-white/10 bg-transparent touch-button">
                  Support
                </Button>
                <Button 
                  variant="outline" 
                  onClick={logout}
                  className="w-full border-red-500/20 text-red-300 hover:bg-red-500/10 bg-transparent touch-button"
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 