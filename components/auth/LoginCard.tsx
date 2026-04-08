"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import { auth } from "@/lib/firebase/firebase";
import { ensureUserProfile } from "@/lib/firebase/profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth.store";

type LoginCardProps = {
  onSuccess?: () => void;
};

export function LoginCard({ onSuccess }: LoginCardProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const closeAuthModal = useAuthStore((state) => state.closeAuthModal);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (mode === "signup") {
        const credentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        if (name.trim()) {
          await updateProfile(credentials.user, {
            displayName: name.trim(),
          });
        }

        await ensureUserProfile(credentials.user);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      onSuccess?.();
      closeAuthModal();
    } catch (err: any) {
      console.error("AUTH ERROR:", err);

      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Wrong email or password.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else {
        setError(err.message || "Authentication failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const credentials = await signInWithPopup(auth, provider);

      await ensureUserProfile(credentials.user);

      closeAuthModal();
      onSuccess?.();
    } catch (error: any) {
      console.error("Google login error", error);
      setError(error.message || "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <div className="border-b px-6 pt-6 pb-4 text-center">
        <h2 className="text-2xl font-semibold">Welcome 👋</h2>
        <p className="mt-1 text-sm opacity-70">
          Sign in to keep your finances safe and synced
        </p>
      </div>

      <CardHeader>
        <CardTitle>
          {mode === "login" ? "Login to your account" : "Create your account"}
        </CardTitle>

        <CardDescription>
          {mode === "login"
            ? "Enter your email below to log in to your account"
            : "Fill in your details to create a new account"}
        </CardDescription>

        <CardAction>
          <Button
            variant="link"
            type="button"
            onClick={() =>
              setMode((prev) => (prev === "login" ? "signup" : "login"))
            }
          >
            {mode === "login" ? "Sign Up" : "Login"}
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="flex flex-col gap-6">
            {mode === "signup" && (
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Valerii"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>

                {mode === "login" && (
                  <button
                    type="button"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </button>
                )}
              </div>

              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error ? <p className="text-sm text-red-500">{error}</p> : null}

            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? mode === "login"
                    ? "Logging in..."
                    : "Creating account..."
                  : mode === "login"
                    ? "Login"
                    : "Create account"}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                Continue with Google
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                type="button"
                onClick={() => {
                  sessionStorage.setItem("seenAuthPrompt", "true");
                  closeAuthModal();
                }}
                disabled={isLoading}
              >
                Continue without account
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}