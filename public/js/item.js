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
    } catch (err) {
      console.error(err);
      detailsCard.innerHTML = `<p>Item not found.</p>`;
      document.getElementById("btnClaimed").disabled = true;
      document.getElementById("btnResolved").disabled = true;
      document.getElementById("btnDelete").disabled = true;
    }
  }
  
  async function updateStatus(status) {
    setMsg("Updating...");
    try {
      const res = await fetch(`/api/items/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
    if (!confirm("Are you sure you want to delete this report?")) return;
  
    setMsg("Deleting...");
    try {
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
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
  } else {
    loadItem();
  }