export interface ImportedFurniture {
  name: string;
  image?: string;
  source: string;
}

const API_BASE_URL = (import.meta.env.VITE_APP_SERVER || "http://localhost:5000").replace(
  /\/$/,
  "",
);

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function generateMoodboard(vibe: string, roomType: string) {
  return request<string[]>("/moodboard", {
    method: "POST",
    body: JSON.stringify({ vibe, room_type: roomType }),
  });
}

export function importFurniture(url: string) {
  return request<ImportedFurniture>("/furniture/import", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}
