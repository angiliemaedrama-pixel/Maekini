(() => {
    const dashboard = document.getElementById("adminDashboard");
    const navigation = dashboard?.querySelector(".owner-tools-nav");
    if (!dashboard || !navigation) return;

    const metrics = document.createElement("section");
    metrics.className = "owner-overview";
    metrics.setAttribute("aria-label", "Store overview");
    metrics.innerHTML = `
        <article class="owner-overview-card">
            <span>COMMUNITY</span>
            <strong data-owner-count="customers">0</strong>
            <small>Customer profiles</small>
        </article>
        <article class="owner-overview-card">
            <span>COLLECTION</span>
            <strong data-owner-count="products">0</strong>
            <small>Products in your catalog</small>
        </article>
        <article class="owner-overview-card">
            <span>ORDERS IN MOTION</span>
            <strong data-owner-count="orders">0</strong>
            <small>Orders and customer requests</small>
        </article>`;
    navigation.after(metrics);

    const sections = [
        { section: "owner-customers", rows: "customerRows", label: "Search customers", placeholder: "Find a name or email" },
        { section: "owner-products", rows: "productRows", label: "Search products", placeholder: "Find a product or category" },
        { section: "owner-orders", rows: "orderRows", label: "Search orders", placeholder: "Find an order or customer" }
    ];

    function updateMetrics() {
        const counts = {
            customers: document.querySelectorAll("#customerRows > tr").length,
            products: document.querySelectorAll("#productRows > tr").length,
            orders: document.querySelectorAll("#orderRows > tr").length
        };
        Object.entries(counts).forEach(([name, count]) => {
            const value = metrics.querySelector(`[data-owner-count="${name}"]`);
            if (value) value.textContent = count.toLocaleString();
        });
    }

    sections.forEach(({ section: sectionId, rows: rowsId, label, placeholder }) => {
        const section = document.getElementById(sectionId);
        const rows = document.getElementById(rowsId);
        const heading = section?.querySelector(".adminTableTop");
        const table = section?.querySelector(".tableScroll");
        if (!section || !rows || !heading || !table) return;

        const searchLabel = document.createElement("label");
        searchLabel.className = "ownerSectionSearch";
        searchLabel.innerHTML = `
            <span aria-hidden="true">?</span>
            <input type="search" aria-label="${label}" placeholder="${placeholder}" autocomplete="off">`;
        heading.append(searchLabel);

        const emptyMessage = document.createElement("p");
        emptyMessage.className = "owner-search-empty";
        emptyMessage.textContent = "No rows match your search.";
        emptyMessage.hidden = true;
        table.after(emptyMessage);

        const input = searchLabel.querySelector("input");
        const filterRows = () => {
            const query = input.value.trim().toLocaleLowerCase();
            const rowList = [...rows.querySelectorAll("tr")];
            let matches = 0;
            rowList.forEach((row) => {
                const match = row.textContent.toLocaleLowerCase().includes(query);
                row.hidden = !match;
                if (match) matches += 1;
            });
            emptyMessage.hidden = !query || matches > 0;
        };

        input.addEventListener("input", filterRows);
        new MutationObserver(() => {
            filterRows();
            updateMetrics();
        }).observe(rows, { childList: true, subtree: true });
    });

    updateMetrics();
    const navLinks = [...navigation.querySelectorAll('a[href^="#"]')];
    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (!visible) return;
            navLinks.forEach((link) => {
                const selected = link.hash === `#${visible.target.id}`;
                link.classList.toggle("active", selected);
                if (selected) link.setAttribute("aria-current", "location");
                else link.removeAttribute("aria-current");
            });
        }, { rootMargin: "-100px 0px -65% 0px", threshold: [0, .2, .5] });
        sections.forEach(({ section: sectionId }) => {
            const section = document.getElementById(sectionId);
            if (section) sectionObserver.observe(section);
        });
    }
})();
