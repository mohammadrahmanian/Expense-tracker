import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { HeroSection } from "./HeroSection";
import { FeatureCards } from "./FeatureCards";
import { CTASection } from "./CTASection";
import { FloatingShapes } from "./FloatingShapes";

export const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div
      className="min-h-screen bg-[#fafafa] text-gray-900 relative overflow-hidden"
      style={{ fontFamily: "'Source Sans 3', sans-serif" }}
    >
      <FloatingShapes />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          <HeroSection />
          <FeatureCards />
          <CTASection />
        </div>
      </div>
    </div>
  );
};
