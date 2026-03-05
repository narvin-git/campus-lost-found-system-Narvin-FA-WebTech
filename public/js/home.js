(async function () {
    const el = document.getElementById("stats");
  
    try {
      const all = await apiGet("/api/items");
  
      const lost = all.filter(i => i.category === "Lost").length;
      const found = all.filter(i => i.category === "Found").length;
      const active = all.filter(i => i.status === "Active").length;
      const resolved = all.filter(i => i.status !== "Active").length;
  
      el.innerHTML = `
        <div class="statBox"><b>Total Reports:</b><br>${all.length}</div>
        <div class="statBox"><b>Lost:</b><br>${lost}</div>
        <div class="statBox"><b>Found:</b><br>${found}</div>
        <div class="statBox"><b>Active:</b><br>${active}</div>
        <div class="statBox"><b>Claimed/Resolved:</b><br>${resolved}</div>
      `;
    } catch (err) {
      el.textContent = "Failed to load stats.";
      console.error(err);
    }
  })();