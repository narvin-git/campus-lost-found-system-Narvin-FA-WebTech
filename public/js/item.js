function getId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

const id = getId();
const detailsCard = document.getElementById("detailsCard");
const msg = document.getElementById("msg");

let currentCategory = "Lost";

function setMsg(t, isErr = false) {
  msg.textContent = t;
  msg.style.color = isErr ? "crimson" : "#6b7280";
}

function getToken() {
  return localStorage.getItem("token");
}

function disableActions(reason = "Login required") {
  const c = document.getElementById("btnClaimed");
  const r = document.getElementById("btnResolved");
  const d = document.getElementById("btnDelete");
  if (c) c.disabled = true;
  if (r) r.disabled = true;
  if (d) d.disabled = true;
  setMsg(reason, true);
}

async function loadItem() {
  try {
    const item = await apiGet(`/api/items/${id}`);
    currentCategory = item.category;

    const dateStr = new Date(item.date).toLocaleDateString();

    detailsCard.innerHTML = `
      <h2>${escapeHtml(item.title)}</h2>
      <p><b>Category:</b> ${escapeHtml(item.category)}</p>
      <p><b>Description:</b> ${escapeHtml(item.description)}</p>
      <p><b>Location:</b> ${escapeHtml(item.location)}</p>
      <p><b>Date:</b> ${dateStr}</p>
      <p><b>Contact:</b> ${escapeHtml(item.contact)}</p>
      <p><b>Status:</b> ${escapeHtml(item.status)}</p>
    `;

    // If not logged in, disable update/delete buttons (backend will also block)
    const token = getToken();
    if (!token) disableActions("Login required to update/delete.");
  } catch (err) {
    console.error(err);
    detailsCard.innerHTML = `<p>Item not found.</p>`;
    disableActions("Item not found.");
  }
}

async function updateStatus(status) {
  const token = getToken();
  if (!token) {
    disableActions("Please login first.");
    setTimeout(() => (window.location.href = "login.html"), 700);
    return;
  }

  setMsg("Updating...");
  try {
    const res = await fetch(`/api/items/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const out = await res.json();
    if (!res.ok) throw new Error(out.error || "Failed to update status");

    setMsg("Status updated!");
    await loadItem();
  } catch (err) {
    setMsg(err.message, true);
  }
}

async function deleteItem() {
  const token = getToken();
  if (!token) {
    disableActions("Please login first.");
    setTimeout(() => (window.location.href = "login.html"), 700);
    return;
  }

  if (!confirm("Are you sure you want to delete this report?")) return;

  setMsg("Deleting...");
  try {
    const res = await fetch(`/api/items/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const out = await res.json();
    if (!res.ok) throw new Error(out.error || "Failed to delete");

    setMsg("Deleted! Redirecting...");
    setTimeout(() => {
      window.location.href = currentCategory === "Found" ? "found-items.html" : "lost-items.html";
    }, 700);
  } catch (err) {
    setMsg(err.message, true);
  }
}

document.getElementById("btnClaimed").addEventListener("click", () => updateStatus("Claimed"));
document.getElementById("btnResolved").addEventListener("click", () => updateStatus("Resolved"));
document.getElementById("btnDelete").addEventListener("click", deleteItem);

if (!id) {
  detailsCard.innerHTML = "<p>Missing item id.</p>";
  disableActions("Missing item id.");
} else {
  loadItem();
}