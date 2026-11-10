(() => {
    const grid = document.getElementById("shopGrid");
    const shop = document.getElementById("shop");
    if (!grid || !shop || typeof window.renderShop !== "function") return;

    let controls = document.getElementById("collectionTools");
    if (!controls) {
        controls = document.createElement("div");
        controls.className = "collection-tools";
        controls.id = "collectionTools";
        controls.setAttribute("aria-label", "Collection display options");
        controls.innerHTML = `
            <label class="collection-sort"><span>Sort by</span>
                <select id="shopSort" aria-label="Sort products">
                    <option value="featured">Featured</option>
                    <option value="rating">Top rated</option>
                    <option value="popular">Most loved</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                </select>
            </label>
            <label class="collection-price"><span>Max price</span>
                <input id="shopPrice" type="range" min="0" max="0" value="0" aria-label="Maximum product price">
                <output id="shopPriceValue" for="shopPrice">PHP 0</output>
            </label>
            <div class="collection-layout" role="group" aria-label="Product layout">
                <button type="button" data-layout="grid" aria-label="Grid view" aria-pressed="true">
                    <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="3" width="5" height="5" rx="1"/><rect x="12" y="3" width="5" height="5" rx="1"/><rect x="3" y="12" width="5" height="5" rx="1"/><rect x="12" y="12" width="5" height="5" rx="1"/></svg>
                </button>
                <button type="button" data-layout="list" aria-label="List view" aria-pressed="false">
                    <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 5h10M7 10h10M7 15h10"/><circle cx="3.5" cy="5" r=".7"/><circle cx="3.5" cy="10" r=".7"/><circle cx="3.5" cy="15" r=".7"/></svg>
                </button>
            </div>`;
        grid.before(controls);
    }

    const sortSelect = controls.querySelector("#shopSort");
    const priceRange = controls.querySelector("#shopPrice");
    const priceOutput = controls.querySelector("#shopPriceValue");
    const layoutButtons = [...controls.querySelectorAll("[data-layout]")];
    const originalRender = window.renderShop;
    let featuredCards = [];
    let maximumPrice = 0;
    let priceLimit = Infinity;
    let layout = "grid";

    if (!sortSelect || !priceRange || !priceOutput || layoutButtons.length !== 2) return;

    const getPrice = (card) => {
        const text = card.querySelector(".price")?.textContent || "";
        return Number(text.replace(/[^\d.]/g, "")) || 0;
    };

    const getRating = (card) => {
        const text = card.querySelector(".rating-stars")?.textContent || "";
        return Number(text.match(/[\d.]+/)?.[0]) || 0;
    };

    const getPopularity = (card) => {
        const text = card.querySelector(".meta")?.textContent || "";
        return Number(text.match(/([\d,]+)\s+sold/i)?.[1]?.replace(/,/g, "")) || 0;
    };

    function updateCollection() {
        const orderedCards = [...featuredCards].sort((a, b) => {
                switch (sortSelect.value) {
                    case "rating": return getRating(b) - getRating(a);
                    case "popular": return getPopularity(b) - getPopularity(a);
                    case "price-low": return getPrice(a) - getPrice(b);
                    case "price-high": return getPrice(b) - getPrice(a);
                    default: return featuredCards.indexOf(a) - featuredCards.indexOf(b);
                }
            });

        orderedCards.forEach((card) => {
            card.hidden = getPrice(card) > priceLimit;
            grid.append(card);
        });
        grid.classList.toggle("list-layout", layout === "list");
        priceOutput.value = `PHP ${Number(priceRange.value).toLocaleString("en-PH")}`;
        priceOutput.textContent = priceOutput.value;

        const searchSummary = document.getElementById("searchText");
        if (searchSummary) {
            const visibleCount = orderedCards.filter((card) => !card.hidden).length;
            const filterSummary = priceLimit < maximumPrice
                ? ` | ${visibleCount} within budget`
                : "";
            searchSummary.textContent = searchSummary.textContent.replace(/ \| \d+ within budget$/, "") + filterSummary;
        }
    }

    function captureCards() {
        featuredCards = [...grid.querySelectorAll(".product")];
        maximumPrice = Math.ceil(Math.max(0, ...featuredCards.map(getPrice)));
        priceRange.max = String(maximumPrice);
        priceRange.value = String(maximumPrice);
        priceLimit = maximumPrice;
        priceRange.disabled = maximumPrice === 0;
        updateCollection();
    }

    window.renderShop = function (...args) {
        const result = originalRender.apply(this, args);
        captureCards();
        return result;
    };

    const cardObserver = new MutationObserver(() => {
        const currentCards = [...grid.querySelectorAll(".product")];
        if (currentCards.length !== featuredCards.length
            || currentCards.some((card) => !featuredCards.includes(card))) {
            captureCards();
        }
    });
    cardObserver.observe(grid, { childList: true });

    sortSelect.addEventListener("change", updateCollection);
    priceRange.addEventListener("input", () => {
        priceLimit = Number(priceRange.value);
        updateCollection();
    });

    const authTabs = document.querySelector(".authTabs");
    if (authTabs) {
        const syncAuthTabs = () => {
            authTabs.querySelectorAll('[role="tab"]').forEach((tab) => {
                const selected = tab.classList.contains("active");
                tab.setAttribute("aria-selected", String(selected));
                const panel = document.getElementById(tab.getAttribute("aria-controls"));
                if (panel) panel.setAttribute("aria-hidden", String(!selected));
            });
        };
        authTabs.addEventListener("click", syncAuthTabs);
        syncAuthTabs();
    }

    layoutButtons.forEach((button) => {
        button.addEventListener("click", () => {
            layout = button.dataset.layout;
            layoutButtons.forEach((item) => {
                item.setAttribute("aria-pressed", String(item === button));
            });
            updateCollection();
        });
    });

    grid.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse") return;
        const card = event.target.closest(".product");
        if (!card || !grid.contains(card)) return;
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        card.style.setProperty("--mk-tilt-y", `${(x - .5) * 5}deg`);
        card.style.setProperty("--mk-tilt-x", `${(.5 - y) * 4}deg`);
    });

    grid.addEventListener("pointerout", (event) => {
        const card = event.target.closest(".product");
        if (card && !card.contains(event.relatedTarget)) {
            card.style.setProperty("--mk-tilt-x", "0deg");
            card.style.setProperty("--mk-tilt-y", "0deg");
        }
    });

    captureCards();
})();
