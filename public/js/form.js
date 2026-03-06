const form = document.getElementById("itemForm");
const msg = document.getElementById("msg");

function setMsg(text, isError = false) {
  msg.textContent = text;
  msg.style.color = isError ? "crimson" : "#6b7280";
}

function basicValidate(data) {
  if (data.title.length < 3) return "Title must be at least 3 characters.";
  if (data.description.length < 5) return "Description must be at least 5 characters.";
  if (data.location.length < 2) return "Location is required.";
  if (!data.date) return "Date is required.";
  if (data.contact.length < 5) return "Contact must be at least 5 characters.";
  return null;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setMsg("Submitting...");

  // Require login (JWT)
  const token = localStorage.getItem("token");
  if (!token) {
    setMsg("Please login first.", true);
    setTimeout(() => {
      window.location.href = "login.html";
    }, 700);
    return;
  }

  const data = {
    title: form.title.value.trim(),
    description: form.description.value.trim(),
    category: form.dataset.category, // ✅ fixed
    location: form.location.value.trim(),
    date: form.date.value,
    contact: form.contact.value.trim(),
  };

  const err = basicValidate(data);
  if (err) return setMsg(err, true);

  try {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

    const out = await res.json();
    if (!res.ok) throw new Error(out.error || "Failed to submit");

    setMsg("Report submitted successfully! Redirecting...");

    setTimeout(() => {
      window.location.href = data.category === "Lost" ? "lost-items.html" : "found-items.html";
    }, 800);

  } catch (error) {
    setMsg(error.message, true);
    console.error(error);
  }
});