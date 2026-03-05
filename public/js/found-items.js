(async function () {
    const body = document.getElementById("itemsBody");
  
    try {
      const items = await apiGet("/api/items?category=Found");
  
      if (!Array.isArray(items) || items.length === 0) {
        body.innerHTML = `<tr><td colspan="5">No found items reported yet.</td></tr>`;
        return;
      }
  
      body.innerHTML = items.map(i => {
        const dateStr = new Date(i.date).toLocaleDateString();
        return `
          <tr>
            <td>${escapeHtml(i.title)}</td>
            <td>${escapeHtml(i.location)}</td>
            <td>${dateStr}</td>
            <td>${escapeHtml(i.status)}</td>
            <td><a class="linkBtn" href="item.html?id=${i.id}">View</a></td>
          </tr>
        `;
      }).join("");
  
    } catch (err) {
      console.error(err);
      body.innerHTML = `<tr><td colspan="5">Failed to load items.</td></tr>`;
    }
  })();