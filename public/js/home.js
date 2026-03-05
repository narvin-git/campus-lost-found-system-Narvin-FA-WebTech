// Auth UI (Login/Register/Logout + show who is logged in)
(function setupAuthUi() {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  const logoutBtn = document.getElementById("btnLogout");
  const whoami = document.getElementById("whoami");

  const loginBtn = document.querySelector('a[href="login.html"]');
  const registerBtn = document.querySelector('a[href="register.html"]');

  const reportButtons = document.querySelectorAll(
    'a[href="report-lost.html"], a[href="report-found.html"]'
  );

  if (!logoutBtn || !whoami) return;

  if (token && userRaw) {
    // USER LOGGED IN
    const user = JSON.parse(userRaw);

    logoutBtn.style.display = "inline-block";

    if (loginBtn) loginBtn.style.display = "none";
    if (registerBtn) registerBtn.style.display = "none";

    whoami.textContent = `Logged in as: ${user.email} (${user.role})`;

    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    });

  } else {
    // USER NOT LOGGED IN
    whoami.textContent = "Not logged in.";

    reportButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Please login first to submit a report.");
        window.location.href = "login.html";
      });
    });
  }
})();

// Stats
(async function loadStats() {
  const statsEl = document.getElementById("stats");
  if (!statsEl) return;

  try {
    const res = await fetch("/api/items");
    const items = await res.json();

    const lost = items.filter(i => i.category === "Lost").length;
    const found = items.filter(i => i.category === "Found").length;

    statsEl.textContent = `Lost reports: ${lost} | Found reports: ${found}`;
  } catch (err) {
    console.error(err);
    statsEl.textContent = "Stats unavailable.";
  }
})();