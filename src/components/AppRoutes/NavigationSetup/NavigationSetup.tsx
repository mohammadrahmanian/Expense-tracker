import { type FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setNavigationCallback } from "@/services/api";

export const NavigationSetup: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigationCallback(navigate);
  }, [navigate]);

  return null;
};
