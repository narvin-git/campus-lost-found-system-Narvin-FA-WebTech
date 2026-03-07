// Fetch helper
async function apiGet(url) {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    headers: {
      "Authorization": token ? `Bearer ${token}` : ""
    }
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login.html";
    return;
  }

  if (!res.ok) throw new Error("Request failed");

  return res.json();
}
  
  // Prevent XSS when displaying text in HTML
  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }