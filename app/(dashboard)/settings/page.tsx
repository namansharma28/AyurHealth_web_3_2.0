"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useWellnessStore, useChatStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [profileData, setProfileData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: '',
    foodPreference: ''
  });
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user');
        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const userData = await response.json();
        if (userData.profile) {
          setProfileData({
            weight: userData.profile.weight?.toString() || '',
            height: userData.profile.height?.toString() || '',
            age: userData.profile.age?.toString() || '',
            gender: userData.profile.gender || '',
            foodPreference: userData.profile.foodPreference || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleResetData = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset all your data? This will delete all your chats and wellness check-ins."
    );
    
    if (confirmReset) {
      localStorage.removeItem('wellness-storage');
      localStorage.removeItem('chat-storage');
      window.location.reload();
      toast.success("All data has been reset successfully");
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weight: parseInt(profileData.weight),
          height: parseInt(profileData.height),
          age: parseInt(profileData.age),
          gender: profileData.gender,
          foodPreference: profileData.foodPreference,
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  if (initialLoad) {
    return (
      <div className="container p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center text-muted-foreground">Loading profile data...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent mb-8">
        Settings
      </h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Data</CardTitle>
            <CardDescription>Manage your personal health information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={profileData.weight}
                  onChange={(e) => setProfileData(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="Enter weight in kg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={profileData.height}
                  onChange={(e) => setProfileData(prev => ({ ...prev, height: e.target.value }))}
                  placeholder="Enter height in cm"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={profileData.age}
                  onChange={(e) => setProfileData(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="Enter age"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={profileData.gender}
                  onValueChange={(value) => setProfileData(prev => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="foodPreference">Food Preference</Label>
              <Select
                value={profileData.foodPreference}
                onValueChange={(value) => setProfileData(prev => ({ ...prev, foodPreference: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="non-vegetarian">Non-vegetarian</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSaveProfile}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage how and when you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-reminder" className="flex-1">
                Daily check-in reminders
                <span className="text-sm text-muted-foreground block mt-1">
                  Receive a reminder to complete your daily wellness check-in
                </span>
              </Label>
              <Switch 
                id="daily-reminder" 
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how AyurHealth.AI looks on your device</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="flex-1">
                Dark Mode
                <span className="text-sm text-muted-foreground block mt-1">
                  Use dark mode for reduced eye strain in low light environments
                </span>
              </Label>
              <Switch 
                id="dark-mode" 
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>Manage your privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="privacy-mode" className="flex-1">
                Privacy Mode
                <span className="text-sm text-muted-foreground block mt-1">
                  Hide sensitive information when using the app in public
                </span>
              </Label>
              <Switch 
                id="privacy-mode" 
                checked={privacyMode}
                onCheckedChange={setPrivacyMode}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Manage your personal data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will permanently delete all your chats, wellness check-ins, and preferences. This action cannot be undone.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="destructive" 
              onClick={handleResetData}
            >
              Reset All Data
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}