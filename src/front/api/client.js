export const apiBase = () => {
  const base = import.meta.env.VITE_BACKEND_URL?.trim().replace(/\/$/, "");
  return `${base}/api`;
};

export async function apiFetch(
  path,
  { method = "GET", headers = {}, body } = {}
) {
  const token = localStorage.getItem("access_token");
  const finalHeaders = { "Content-Type": "application/json", ...headers };
  if (token && !finalHeaders.Authorization) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }
  const resp = await fetch(`${apiBase()}${path}`, {
    method,
    headers: finalHeaders,
    body: body
      ? typeof body === "string"
        ? body
        : JSON.stringify(body)
      : undefined,
  });
  const contentType = resp.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await resp.json().catch(() => ({}))
    : await resp.text();
  if (!resp.ok) {
    const msg =
      typeof data === "string"
        ? data
        : data?.msg || `Request failed (${resp.status})`;
    const err = new Error(msg);
    err.status = resp.status;
    err.data = data;
    throw err;
  }
  return data;
}