import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { toast } from 'sonner';
import { 
  ArrowLeft,
  User,
  Palette,
  Accessibility,
  Bell,
  Lock,
  Globe,
  Eye,
  Type,
  Monitor,
  Moon,
  Sun,
  Save,
  LogOut
} from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
  onLogout?: () => void;
  userInfo: { email: string; name: string } | null;
  onUpdateProfile?: (data: ProfileData) => void;
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  accentColor: 'teal' | 'blue' | 'purple' | 'orange';
  fontSize: number;
  reducedMotion: boolean;
  highContrast: boolean;
  notifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  language: string;
}

export function Settings({ onBack, onLogout, userInfo, onUpdateProfile }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'accessibility' | 'notifications' | 'privacy'>('profile');
  
  // Profile Data
  const [profileData, setProfileData] = useState<ProfileData>(() => {
    // Try to load saved profile data
    const savedProfile = localStorage.getItem('endurolab_profile');
    if (savedProfile) {
      return JSON.parse(savedProfile);
    }
    // Default values if no saved profile
    return {
      name: userInfo?.name || '',
      email: userInfo?.email || '',
      phone: '+63 912 345 6789',
      bio: 'Passionate enduro rider with 10+ years of experience. Always chasing the next trail!',
      address: '1234 Trail Blazer Road',
      city: 'Manila',
      state: 'Metro Manila',
      zipCode: '1000'
    };
  });

  // App Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('endurolab_settings');
    return saved ? JSON.parse(saved) : {
      theme: 'dark',
      accentColor: 'teal',
      fontSize: 16,
      reducedMotion: false,
      highContrast: false,
      notifications: true,
      orderUpdates: true,
      promotions: false,
      language: 'en'
    };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('endurolab_settings', JSON.stringify(settings));
    
    // Apply theme
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Auto: follow system preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    // Apply font size
    document.documentElement.style.setProperty('--font-size', `${settings.fontSize}px`);

    // Apply reduced motion
    if (settings.reducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    } else {
      document.documentElement.style.removeProperty('--animation-duration');
    }
  }, [settings]);

  const handleSaveProfile = () => {
    if (onUpdateProfile) {
      onUpdateProfile(profileData);
    }
    toast.success('Profile updated successfully!', {
      description: 'Your information has been saved.'
    });
  };

  const handleResetSettings = () => {
    const defaultSettings: AppSettings = {
      theme: 'dark',
      accentColor: 'teal',
      fontSize: 16,
      reducedMotion: false,
      highContrast: false,
      notifications: true,
      orderUpdates: true,
      promotions: false,
      language: 'en'
    };
    setSettings(defaultSettings);
    toast.success('Settings reset to defaults');
  };

  const tabs = [
    { id: 'profile' as const, icon: User, label: 'Profile' },
    { id: 'appearance' as const, icon: Palette, label: 'Appearance' },
    { id: 'accessibility' as const, icon: Accessibility, label: 'Accessibility' },
    { id: 'notifications' as const, icon: Bell, label: 'Notifications' },
    { id: 'privacy' as const, icon: Lock, label: 'Privacy' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-md flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-white">Settings</h1>
              <p className="text-sm text-slate-400">Manage your account and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Personal Information</CardTitle>
                <CardDescription className="text-slate-400">
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Full Name</Label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Email Address</Label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Phone Number</Label>
                  <Input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="bg-slate-900 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Bio</Label>
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={3}
                    className="bg-slate-900 border-slate-600 text-white resize-none"
                  />
                </div>

                <Separator className="bg-slate-700" />

                <div className="space-y-2">
                  <Label className="text-slate-300">Address</Label>
                  <Input
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    className="bg-slate-900 border-slate-600 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">City</Label>
                    <Input
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">State/Province</Label>
                    <Input
                      value={profileData.state}
                      onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Zip Code</Label>
                    <Input
                      value={profileData.zipCode}
                      onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSaveProfile}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Theme</CardTitle>
                <CardDescription className="text-slate-400">
                  Customize the visual appearance of the app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-slate-300">Color Mode</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'light', icon: Sun, label: 'Light' },
                      { value: 'dark', icon: Moon, label: 'Dark' },
                      { value: 'auto', icon: Monitor, label: 'Auto' }
                    ].map((mode) => {
                      const Icon = mode.icon;
                      return (
                        <button
                          key={mode.value}
                          onClick={() => setSettings({ ...settings, theme: mode.value as any })}
                          className={`flex flex-col items-center gap-2 p-4 rounded-md border-2 transition-colors ${
                            settings.theme === mode.value
                              ? 'border-teal-500 bg-teal-500/10'
                              : 'border-slate-600 bg-slate-900 hover:border-slate-500'
                          }`}
                        >
                          <Icon className={`w-6 h-6 ${settings.theme === mode.value ? 'text-teal-400' : 'text-slate-400'}`} />
                          <span className={`text-sm ${settings.theme === mode.value ? 'text-teal-400' : 'text-slate-400'}`}>
                            {mode.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                <div className="space-y-3">
                  <Label className="text-slate-300">Accent Color</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { value: 'teal', color: 'bg-teal-500', label: 'Teal' },
                      { value: 'blue', color: 'bg-blue-500', label: 'Blue' },
                      { value: 'purple', color: 'bg-purple-500', label: 'Purple' },
                      { value: 'orange', color: 'bg-orange-500', label: 'Orange' }
                    ].map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setSettings({ ...settings, accentColor: color.value as any })}
                        className={`flex flex-col items-center gap-2 p-3 rounded-md border-2 transition-colors ${
                          settings.accentColor === color.value
                            ? 'border-teal-500 bg-slate-900'
                            : 'border-slate-600 bg-slate-900 hover:border-slate-500'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full ${color.color}`}></div>
                        <span className="text-xs text-slate-400">{color.label}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">Note: Full accent color theming coming soon!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Accessibility Tab */}
        {activeTab === 'accessibility' && (
          <div className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Text & Display</CardTitle>
                <CardDescription className="text-slate-400">
                  Adjust text size and visual preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">Font Size</Label>
                    <span className="text-sm text-slate-400">{settings.fontSize}px</span>
                  </div>
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={(value: number[]) => setSettings({ ...settings, fontSize: value[0] })}
                    min={14}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Small</span>
                    <span>Default (16px)</span>
                    <span>Large</span>
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-slate-300">High Contrast Mode</Label>
                    <p className="text-sm text-slate-400">Increase contrast for better visibility</p>
                  </div>
                  <Switch
                    checked={settings.highContrast}
                    onCheckedChange={(checked: boolean) => setSettings({ ...settings, highContrast: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-slate-300">Reduce Motion</Label>
                    <p className="text-sm text-slate-400">Minimize animations and transitions</p>
                  </div>
                  <Switch
                    checked={settings.reducedMotion}
                    onCheckedChange={(checked: boolean) => setSettings({ ...settings, reducedMotion: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Language & Region</CardTitle>
                <CardDescription className="text-slate-400">
                  Set your preferred language and regional settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Language</Label>
                  <Select value={settings.language} onValueChange={(value: string) => setSettings({ ...settings, language: value })}>
                    <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="en" className="text-white">English</SelectItem>
                      <SelectItem value="fil" className="text-white">Filipino</SelectItem>
                      <SelectItem value="es" className="text-white">Español</SelectItem>
                      <SelectItem value="ja" className="text-white">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Notification Preferences</CardTitle>
                <CardDescription className="text-slate-400">
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-slate-300">Push Notifications</Label>
                    <p className="text-sm text-slate-400">Receive notifications on this device</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked: boolean) => setSettings({ ...settings, notifications: checked })}
                  />
                </div>

                <Separator className="bg-slate-700" />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-slate-300">Order Updates</Label>
                    <p className="text-sm text-slate-400">Notifications about your orders and deliveries</p>
                  </div>
                  <Switch
                    checked={settings.orderUpdates}
                    onCheckedChange={(checked: boolean) => setSettings({ ...settings, orderUpdates: checked })}
                    disabled={!settings.notifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-slate-300">Promotions & Offers</Label>
                    <p className="text-sm text-slate-400">Special deals and product recommendations</p>
                  </div>
                  <Switch
                    checked={settings.promotions}
                    onCheckedChange={(checked: boolean) => setSettings({ ...settings, promotions: checked })}
                    disabled={!settings.notifications}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Account Security</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your account security and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600 justify-start"
                  onClick={() => toast.info('Password change', { description: 'This feature is coming soon!' })}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>

                <Button
                  variant="outline"
                  className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600 justify-start"
                  onClick={() => toast.info('Data download', { description: 'This feature is coming soon!' })}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Download My Data
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Danger Zone</CardTitle>
                <CardDescription className="text-slate-400">
                  Irreversible account actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600 justify-start"
                  onClick={handleResetSettings}
                >
                  Reset All Settings
                </Button>

                {onLogout && (
                  <Button
                    variant="destructive"
                    className="w-full justify-start bg-red-900/50 text-white hover:bg-red-900/70 border border-red-800"
                    onClick={onLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
