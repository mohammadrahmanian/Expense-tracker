import { type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { AuthLayout } from "@/components/layouts/AuthLayout";
import { AuthRedirect } from "@/components/AuthRedirect";
import { useAuth } from "@/contexts/AuthContext";

import { LoginForm } from "./LoginForm";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch {
      // Error toast already shown by AuthContext via handleApiError
    }
  };

  return (
    <AuthRedirect>
      <AuthLayout
        title="Welcome back"
        subtitle="Sign in to your Expensio account"
      >
        <LoginForm
          register={register}
          errors={errors}
          isLoading={isLoading}
          onSubmit={handleSubmit(onSubmit)}
        />
      </AuthLayout>
    </AuthRedirect>
  );
};
