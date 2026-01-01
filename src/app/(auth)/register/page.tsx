"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { CardFooter } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  return (
    <div>
      <RegisterForm onSuccess={() => router.push("/login")} />
      <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
        <div>
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </Link>
        </div>
      </CardFooter>
    </div>
  );
}
