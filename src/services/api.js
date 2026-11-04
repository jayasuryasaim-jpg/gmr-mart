const configuredBaseUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, "");
const apiBaseUrl = configuredBaseUrl ?? "";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) return null;
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(payload?.error?.message || "The server could not complete this request.");
    error.status = response.status;
    error.code = payload?.error?.code || "REQUEST_FAILED";
    throw error;
  }
  return payload;
}

export function jsonBody(value) {
  return JSON.stringify(value);
}
