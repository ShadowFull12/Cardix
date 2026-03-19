"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, updateUserProfile } from "@/lib/firestore";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileSkeleton } from "@/components/ui/SkeletonLoader";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (user?.uid) {
        const data = await getUserProfile(user.uid);
        setProfile(data);
      }
      setLoading(false);
    }
    loadData();
  }, [user]);

  const handleSave = async (updatedData) => {
    try {
      setSaving(true);
      await updateUserProfile(user.uid, updatedData);
      setProfile({ ...profile, ...updatedData });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold font-mono tracking-tight">Edit Profile</h1>
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tight text-white mb-2">Edit Profile</h1>
        <p className="text-zinc-400">Manage your digital identity, public presence, and private data.</p>
      </div>

      <ProfileForm 
        initialData={profile} 
        onSave={handleSave} 
        saving={saving}
        authEmail={user.email} 
      />
    </div>
  );
}
