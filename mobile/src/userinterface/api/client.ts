import Constants from "expo-constants";

const BACKEND_PORT = 7070;
const REQUEST_TIMEOUT_MS = 5000;

export const API_URL = resolveApiUrl();

/**
 * Uses EXPO_PUBLIC_API_URL when it is set. Otherwise, during development, assumes the
 * backend runs on the same computer as the Expo dev server.
 */

function resolveApiUrl(): string {

  const configuredUrl = process.env.EXPO_PUBLIC_API_URL;
  if (configuredUrl) return configuredUrl;

  const devServerHost = Constants.expoConfig?.hostUri?.split(":")[0] ?? "localhost";
  return `http://${devServerHost}:${BACKEND_PORT}`;

}

/**
 * Sends a request to the backend and returns the parsed JSON response. Gives up after
 * REQUEST_TIMEOUT_MS so an unreachable server shows an error instead of endlessly loading.
 */

export async function fetchApi<T>(
  path: string,
  init?: RequestInit
): Promise<T> {

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS
  );

  try {
    const headers = new Headers(init?.headers);

    // Explicitly tell Javalin that we accept JSON.
    headers.set("Accept", "application/json");

    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      signal: controller.signal,
    });

    // Read the response once.
    const responseText = await res.text();

    let data: unknown = null;

    if (responseText.trim().length > 0) {
      try {
        data = JSON.parse(responseText);
      } catch {
        // Preserve plain-text responses instead of throwing a JSON error.
        data = responseText;
      }
    }

    if (!res.ok) {
      let message = `Server responded with ${res.status}`;

      if (typeof data === "string") {
        message = data;
      } else if (data && typeof data === "object") {
        const body = data as Record<string, unknown>;

        message = String(
          body.message ?? body.error ?? body.title ?? message
        );
      }

      throw new Error(message);
    }

    return data as T;

  } finally {
    clearTimeout(timeout);
  }
}
