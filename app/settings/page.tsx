"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { uploadUserAvatar } from "@/lib/firebase/storage";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { getUserProfile, updateUserSettings } from "@/lib/firebase/profile";
import { useProfileStore } from "@/store/profile.store";
import { SORTED_CURRENCIES } from "@/lib/currencies";

const fieldClassName =
  "w-full rounded-xl border border-border bg-[var(--surface-elevated)] px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-transparent focus:ring-2 focus:ring-ring";

export default function Settings() {
  const user = useAuthStore((state) => state.user);
  const setProfile = useProfileStore((state) => state.setProfile);

  const [displayName, setDisplayName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getUserProfile(user.uid);

        setDisplayName(profile?.displayName || user.displayName || "");
        setPhotoURL(profile?.photoURL || user.photoURL || "");
        setCurrency(profile?.currency || "USD");
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setUploading(true);
      setMessage("");

      const url = await uploadUserAvatar(file, user.uid);
      setPhotoURL(url);
      setMessage("Photo uploaded successfully.");
    } catch (error) {
      console.error("Failed to upload photo", error);
      setMessage("Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  };

  const handleResetToDefault = () => {
    if (!user) return;
    setPhotoURL(user.photoURL || "");
    setMessage("Default photo restored.");
  };

  const handleDeletePhoto = () => {
    setPhotoURL("");
    setMessage("Photo removed.");
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user) return;

    try {
      setSaving(true);
      setMessage("");

      await updateUserSettings(user, {
        displayName,
        photoURL,
        currency,
      });

      setProfile({
        displayName,
        photoURL,
        currency,
        email: user.email ?? "",
      });

      setMessage("Settings saved successfully.");
    } catch (error) {
      console.error("Failed to save settings", error);
      setMessage("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return (
      <DashboardCard title="Settings">
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Please sign in to manage your profile.
          </p>
        </div>
      </DashboardCard>
    );
  }

  if (loading) {
    return (
      <DashboardCard title="Settings">
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading settings...</p>
        </div>
      </DashboardCard>
    );
  }

  const messageClassName = message.includes("successfully")
    ? "text-[var(--success)]"
    : message.includes("Failed")
      ? "text-[var(--danger)]"
      : "text-muted-foreground";

  return (
    <DashboardCard
      title="Settings"
      contentClassName="min-h-0 overflow-y-auto scrollbar-thin"
    >
      <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-6">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-soft)]">
          <div className="h-16 w-16 overflow-hidden rounded-full border border-border bg-muted">
            {photoURL ? (
              <img
                src={photoURL}
                alt={displayName || "Profile"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-medium text-muted-foreground">
                No photo
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Preview</p>
            <p className="truncate font-medium text-foreground">
              {displayName || "Unnamed user"}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="displayName"
            className="text-sm font-medium text-foreground"
          >
            Name
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your name"
            className={fieldClassName}
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Profile photo
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:cursor-pointer file:rounded-xl file:border file:border-border file:bg-muted file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-[var(--color-hover)]"
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="rounded-xl border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground transition hover:bg-[var(--color-hover)]"
            >
              Use default photo
            </button>

            <button
              type="button"
              onClick={handleDeletePhoto}
              className="rounded-xl border border-border bg-muted px-3 py-2 text-sm font-medium text-[var(--danger)] transition hover:bg-[var(--color-hover)]"
            >
              Remove photo
            </button>
          </div>

          {!photoURL && (
            <p className="text-xs text-muted-foreground">No photo selected</p>
          )}

          {uploading && (
            <p className="text-sm text-muted-foreground">Uploading photo...</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="currency"
            className="text-sm font-medium text-foreground"
          >
            Currency
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={fieldClassName}
          >
            {SORTED_CURRENCIES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code} — {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>

          {message && <p className={`text-sm ${messageClassName}`}>{message}</p>}
        </div>
      </form>
    </DashboardCard>
  );
}