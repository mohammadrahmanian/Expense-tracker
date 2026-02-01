import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { validateEnv } from "./src/utils/validateEnv";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  // Validate environment variables - will throw if mandatory vars missing
  validateEnv(env, {
    mandatory: ["VITE_API_BASE_URL", "VITE_API_PROXY_TARGET"],
    optional: [
      { name: "PORT", defaultValue: "8080" },
      "SENTRY_DSN",
      "SENTRY_AUTH_TOKEN",
      "SENTRY_ORG",
      "SENTRY_PROJECT",
    ],
  });

  // Validate and normalize the proxy target
  let rawProxyTarget = env.VITE_API_PROXY_TARGET;

  // Normalize the proxy target:
  // 1. Strip trailing "/api" to avoid duplication (proxy already adds /api)
  // 2. Strip any trailing slashes
  // 3. Ensure protocol is present
  let proxyTarget = rawProxyTarget.trim();

  // Strip trailing "/api" if present
  if (proxyTarget.endsWith("/api")) {
    proxyTarget = proxyTarget.slice(0, -4);
  }

  // Strip trailing slashes
  proxyTarget = proxyTarget.replace(/\/+$/, "");

  // Ensure protocol is present
  if (
    !proxyTarget.startsWith("http://") &&
    !proxyTarget.startsWith("https://")
  ) {
    throw new Error(
      `VITE_API_PROXY_TARGET must include protocol (http:// or https://). Got: ${rawProxyTarget}`,
    );
  }

  return {
    server: {
      host: "::",
      port: env.PORT ? parseInt(env.PORT) : 8080,
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      sourcemap: true,
    },
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        devOptions: {
          enabled: true,
        },
        includeAssets: ["favicon.ico", "icons/*.png"],
        workbox: {
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
          globIgnores: ["**/splash/**"],
          runtimeCaching: [
            {
              // API endpoints contain authenticated user data - never cache
              // Using NetworkOnly to prevent caching sensitive financial information
              // that could be exposed if device is shared or service worker persists
              urlPattern: /^https:\/\/.*\/api\/.*/i,
              handler: "NetworkOnly",
            },
            {
              urlPattern: /\.(?:js|css|html)$/,
              handler: "CacheFirst",
              options: {
                cacheName: "expensio-static-cache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                },
              },
            },
          ],
          navigateFallback: "/index.html",
          navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
        },
        manifest: {
          name: "Expensio - Personal Expense Tracker",
          short_name: "Expensio",
          description:
            "Track your personal expenses and manage your budget effectively",
          theme_color: "#000000",
          background_color: "#ffffff",
          display: "fullscreen",
          orientation: "portrait-primary",
          scope: "/",
          start_url: "/",
          categories: ["finance", "productivity", "utilities"],
          icons: [
            {
              src: "/icons/icon-48x48.png",
              sizes: "48x48",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/icons/icon-72x72.png",
              sizes: "72x72",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/icons/icon-96x96.png",
              sizes: "96x96",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/icons/icon-128x128.png",
              sizes: "128x128",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/icons/icon-144x144.png",
              sizes: "144x144",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/icons/icon-152x152.png",
              sizes: "152x152",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/icons/icon-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/icons/icon-256x256.png",
              sizes: "256x256",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/icons/icon-384x384.png",
              sizes: "384x384",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/icons/icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
          ],
          screenshots: [
            {
              src: "/splash/iPhone_16_Pro_Max_portrait.png",
              sizes: "1320x2868",
              type: "image/png",
              form_factor: "narrow",
              label: "iPhone 16 Pro Max",
            },
            {
              src: "/splash/13__iPad_Pro_M4_portrait.png",
              sizes: "2064x2752",
              type: "image/png",
              form_factor: "wide",
              label: 'iPad Pro 13"',
            },
          ],
        },
      }),
      sentryVitePlugin({
        authToken: env.SENTRY_AUTH_TOKEN,
        org: env.SENTRY_ORG,
        project: env.SENTRY_PROJECT,
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    envPrefix: "VITE_", // This is the default, but being explicit
    define: {
      // Suppress React defaultProps warnings in development
      ...(mode === "development" && {
        "process.env.NODE_ENV": '"development"',
      }),
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      css: true,
    },
  };
});
