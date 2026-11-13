import { type FC } from "react";
import { Link } from "react-router-dom";
import { Globe, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";

const SOCIAL_COMING_SOON_TITLE = "Coming soon";

export const SocialLoginSection: FC = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
        <span className="text-sm text-neutral-500">or</span>
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          disabled
          aria-disabled={true}
          title={SOCIAL_COMING_SOON_TITLE}
          aria-label="Sign in with Google — Coming soon"
        >
          <Globe className="h-4 w-4" />
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          disabled
          aria-disabled={true}
          title={SOCIAL_COMING_SOON_TITLE}
          aria-label="Sign in with Apple — Coming soon"
        >
          <Smartphone className="h-4 w-4" />
          Apple
        </Button>
      </div>

      <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-gold-500 hover:text-gold-400"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};
