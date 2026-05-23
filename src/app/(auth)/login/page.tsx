"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { CardFooter } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm onSuccess={() => router.push("/")} />
    </div>
  );
}
