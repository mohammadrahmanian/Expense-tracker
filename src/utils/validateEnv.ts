interface EnvVarConfig {
  name: string;
  defaultValue?: string;
}

interface EnvConfig {
  mandatory: string[];
  optional?: Array<string | EnvVarConfig>;
}

/**
 * Validates environment variables at build time
 * @param env - Environment variables object from loadEnv
 * @param config - Configuration specifying mandatory and optional variables
 * @throws Error if any mandatory environment variables are missing
 */
export function validateEnv(
  env: Record<string, string>,
  config: EnvConfig,
): void {
  const missingMandatory: string[] = [];

  // Check mandatory variables
  for (const varName of config.mandatory) {
    if (!env[varName] || env[varName].trim() === "") {
      missingMandatory.push(varName);
    }
  }

  // If any mandatory variables are missing, throw error
  if (missingMandatory.length > 0) {
    const errorMessage = [
      "",
      "❌ Missing required environment variables:",
      ...missingMandatory.map((varName) => `  - ${varName}`),
      "",
      "Please copy .env.example to .env and configure the required variables.",
      "See .env.example for details.",
      "",
    ].join("\n");

    throw new Error(errorMessage);
  }

  // Handle optional variables
  if (config.optional) {
    for (const varConfig of config.optional) {
      if (typeof varConfig === "string") {
        // Simple string: warn if missing
        if (!env[varConfig] || env[varConfig].trim() === "") {
          console.warn(
            `⚠️  Optional environment variable '${varConfig}' is not set.`,
          );
        }
      } else {
        // Config object: apply default if missing
        const { name, defaultValue } = varConfig;
        if (!env[name] || env[name].trim() === "") {
          if (defaultValue) {
            env[name] = defaultValue;
            // No warning needed for variables with defaults
          }
        }
      }
    }
  }
}
