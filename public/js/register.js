const form = document.getElementById("registerForm");
const msg = document.getElementById("msg");

function setMsg(text, isError = false) {
  msg.textContent = text;
  msg.style.color = isError ? "crimson" : "#6b7280";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const password = form.password.value;

  setMsg("Creating account...");

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const out = await res.json();
    if (!res.ok) throw new Error(out.error || "Registration failed");

    setMsg("Registered successfully. Redirecting to login...");
    setTimeout(() => (window.location.href = "login.html"), 900);
  } catch (err) {
    setMsg(err.message, true);
  }
});