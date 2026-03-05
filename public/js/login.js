const form = document.getElementById("loginForm");
const msg = document.getElementById("msg");

function setMsg(text, isError = false) {
  msg.textContent = text;
  msg.style.color = isError ? "crimson" : "#6b7280";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const password = form.password.value;

  setMsg("Logging in...");

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const out = await res.json();
    if (!res.ok) throw new Error(out.error || "Login failed");

    // store JWT + user info
    localStorage.setItem("token", out.token);
    localStorage.setItem("user", JSON.stringify(out.user));

    setMsg("Login successful. Redirecting...");
    setTimeout(() => (window.location.href = "/"), 700);
  } catch (err) {
    setMsg(err.message, true);
  }
});