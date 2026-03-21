import { type FC, useState } from "react";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { Mail, Lock, EyeOff, Eye, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { SocialLoginSection } from "./SocialLoginSection";

type LoginFormData = {
  email: string;
  password: string;
};

type LoginFormProps = {
  register: UseFormRegister<LoginFormData>;
  errors: FieldErrors<LoginFormData>;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

export const LoginForm: FC<LoginFormProps> = ({
  register,
  errors,
  isLoading,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" className="text-xs font-medium text-neutral-900 dark:text-neutral-200">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="pl-10"
            {...register("email")}
            aria-invalid={errors.email ? "true" : undefined}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-danger-500">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-xs font-medium text-neutral-900 dark:text-neutral-200">
            Password
          </Label>
          <button type="button" className="text-xs font-medium text-gold-500 hover:text-gold-400">
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 pr-10"
            {...register("password")}
            aria-invalid={errors.password ? "true" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-danger-500">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        <LogIn className="h-4 w-4" />
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <SocialLoginSection />
    </form>
  );
};
