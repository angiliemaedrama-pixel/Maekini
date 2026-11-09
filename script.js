/* =========================================================
   MAEKINI ONLINE STORE
   Main JavaScript file
   ========================================================= */

// ---------------------------------------------------------
// 1. BUSINESS INFORMATION
// ---------------------------------------------------------
const STORE_INFO = {
    socials: {
        facebook: "https://www.facebook.com/search/top/?q=MaeKini.com",
        instagram: "https://www.instagram.com/explore/search/keyword/?q=MaeKini.com",
        linkedin: "https://www.linkedin.com/search/results/all/?keywords=MaeKini.com",
        twitter: "https://x.com/search?q=MaeKini.com"
    }
};
const LOCAL_ACCOUNTS_KEY = "mk_local_accounts_v1";

const API_BASE_URL = (() => {
    if (window.location.protocol === "file:") {
        return "http://localhost:3000";
    }

    const localHosts = ["localhost", "127.0.0.1"];
    if (localHosts.includes(window.location.hostname) && window.location.port !== "3000") {
        return `${window.location.protocol}//${window.location.hostname}:3000`;
    }

    return "";
})();
const ACCOUNT_API_UNAVAILABLE_MESSAGE =
    "Account server offline; using secure browser-local accounts.";

function apiUrl(path) {
    return `${API_BASE_URL}${path}`;
}

// ---------------------------------------------------------
// 2. PRODUCT LIST
// ---------------------------------------------------------
// Product photos are loaded automatically from:
// assets/products/<product-id>/
// Put the product image inside the matching numbered folder.
// No product-card HTML or image filename needs to be edited.
// ---------------------------------------------------------
const PRODUCTS = [
    {
        id: 1,
        name: "Long Sleeve Floral Rash Guard Set",
        category: "women",
        price: 499,
        rating: 4.7,
        sold: 62,
        tag: "WOMEN",
    },
    {
        id: 2,
        name: "Blue Floral Crisscross Bikini Set",
        category: "women",
        price: 549,
        rating: 4.8,
        sold: 79,
        tag: "BEST SELLER",
    },
    {
        id: 3,
        name: "Black & Floral Sleeve Modest Swim Set",
        category: "modest",
        price: 899,
        rating: 4.9,
        sold: 96,
        tag: "MODEST",
    },
    {
        id: 4,
        name: "Purple Long Sleeve 3-Piece Swim Set",
        category: "modest",
        price: 949,
        rating: 5.0,
        sold: 113,
        tag: "MODEST",
    },
    {
        id: 5,
        name: "Black & Green Floral Rash Guard Set",
        category: "modest",
        price: 799,
        rating: 4.7,
        sold: 130,
        tag: "MODEST",
    },
    {
        id: 6,
        name: "Pink Crop Rash Guard & Shorts Set",
        category: "modest",
        price: 849,
        rating: 4.8,
        sold: 147,
        tag: "MODEST",
    },
    {
        id: 7,
        name: "Teal Floral 3-Piece Swim Set",
        category: "modest",
        price: 899,
        rating: 4.9,
        sold: 164,
        tag: "MODEST",
    },
    {
        id: 8,
        name: "Black Floral 3-Piece Swim Set",
        category: "modest",
        price: 949,
        rating: 5.0,
        sold: 181,
        tag: "MODEST",
    },
    {
        id: 9,
        name: "Black & Floral 3-Piece Swim Set",
        category: "modest",
        price: 799,
        rating: 4.7,
        sold: 198,
        tag: "MODEST",
    },
    {
        id: 10,
        name: "Coral Floral Long Sleeve Swim Set",
        category: "modest",
        price: 849,
        rating: 4.8,
        sold: 55,
        tag: "MODEST",
    },
    {
        id: 11,
        name: "Aqua Long Sleeve Floral Swim Set",
        category: "modest",
        price: 899,
        rating: 4.9,
        sold: 72,
        tag: "MODEST",
    },
    {
        id: 12,
        name: "Navy Floral Rash Guard Set",
        category: "modest",
        price: 949,
        rating: 5.0,
        sold: 89,
        tag: "MODEST",
    },
    {
        id: 13,
        name: "Pink & Black Modest Swim Set",
        category: "modest",
        price: 799,
        rating: 4.7,
        sold: 106,
        tag: "MODEST",
    },
    {
        id: 14,
        name: "Blue Floral One-Shoulder Swim Set",
        category: "girls",
        price: 379,
        rating: 4.8,
        sold: 123,
        tag: "KIDS",
    },
    {
        id: 15,
        name: "Pink Floral Long Sleeve One-Piece",
        category: "girls",
        price: 399,
        rating: 4.9,
        sold: 140,
        tag: "KIDS",
    },
    {
        id: 16,
        name: "Blue Ruffle One-Piece",
        category: "girls",
        price: 429,
        rating: 5.0,
        sold: 157,
        tag: "KIDS",
    },
    {
        id: 17,
        name: "Pink Floral Long Sleeve One-Piece",
        category: "girls",
        price: 349,
        rating: 4.7,
        sold: 174,
        tag: "KIDS",
    },
    {
        id: 18,
        name: "Black Floral Two-Piece Set",
        category: "girls",
        price: 379,
        rating: 4.8,
        sold: 191,
        tag: "KIDS",
    },
    {
        id: 19,
        name: "Pink Ruffle Floral One-Piece",
        category: "girls",
        price: 399,
        rating: 4.9,
        sold: 48,
        tag: "KIDS",
    },
    {
        id: 20,
        name: "Blue Striped Ruffle One-Piece",
        category: "girls",
        price: 429,
        rating: 5.0,
        sold: 65,
        tag: "KIDS",
    },
    {
        id: 21,
        name: "Hot Pink Sporty Swim Set",
        category: "girls",
        price: 349,
        rating: 4.7,
        sold: 82,
        tag: "KIDS",
    },
    {
        id: 22,
        name: "Pink Floral Tankini Set",
        category: "girls",
        price: 379,
        rating: 4.8,
        sold: 99,
        tag: "KIDS",
    },
    {
        id: 23,
        name: "Aqua Floral Tankini Set",
        category: "girls",
        price: 399,
        rating: 4.9,
        sold: 116,
        tag: "KIDS",
    },
    {
        id: 24,
        name: "Blue Printed One-Shoulder One-Piece",
        category: "girls",
        price: 429,
        rating: 5.0,
        sold: 133,
        tag: "KIDS",
    },
    {
        id: 25,
        name: "Rainbow Long Sleeve One-Piece",
        category: "girls",
        price: 349,
        rating: 4.7,
        sold: 150,
        tag: "KIDS",
    },
    {
        id: 26,
        name: "Floral Crossback One-Piece",
        category: "girls",
        price: 379,
        rating: 4.8,
        sold: 167,
        tag: "KIDS",
    },
    {
        id: 27,
        name: "Rainbow Floral One-Piece",
        category: "girls",
        price: 399,
        rating: 4.9,
        sold: 184,
        tag: "KIDS",
    },
    {
        id: 28,
        name: "Aqua Ruffle Two-Piece Set",
        category: "girls",
        price: 429,
        rating: 5.0,
        sold: 201,
        tag: "KIDS",
    },
    {
        id: 29,
        name: "Pink Polka Dot One-Piece",
        category: "girls",
        price: 349,
        rating: 4.7,
        sold: 58,
        tag: "KIDS",
    },
    {
        id: 30,
        name: "Multicolor Floral One-Piece",
        category: "girls",
        price: 379,
        rating: 4.8,
        sold: 75,
        tag: "KIDS",
    },
    {
        id: 31,
        name: "Pink Floral Crossback One-Piece",
        category: "girls",
        price: 399,
        rating: 4.9,
        sold: 92,
        tag: "KIDS",
    },
    {
        id: 32,
        name: "Rainbow Floral One-Piece",
        category: "girls",
        price: 429,
        rating: 5.0,
        sold: 109,
        tag: "KIDS",
    },
    {
        id: 33,
        name: "Aqua Ruffle Swim Set",
        category: "girls",
        price: 349,
        rating: 4.7,
        sold: 126,
        tag: "KIDS",
    },
    {
        id: 34,
        name: "Pink Polka Dot Ruffle One-Piece",
        category: "girls",
        price: 379,
        rating: 4.8,
        sold: 143,
        tag: "KIDS",
    },
    {
        id: 35,
        name: "Multicolor Floral One-Piece",
        category: "girls",
        price: 399,
        rating: 4.9,
        sold: 160,
        tag: "KIDS",
    },
    {
        id: 36,
        name: "Pink Floral Rash Guard Set",
        category: "modest",
        price: 949,
        rating: 5.0,
        sold: 177,
        tag: "MODEST",
    },
    {
        id: 37,
        name: "Navy Floral Rash Guard Set",
        category: "modest",
        price: 799,
        rating: 4.7,
        sold: 194,
        tag: "MODEST",
    },
    {
        id: 38,
        name: "Tropical Floral Bikini Set",
        category: "women",
        price: 549,
        rating: 4.8,
        sold: 51,
        tag: "WOMEN",
    },
    {
        id: 39,
        name: "Blue Cutout Bikini Set",
        category: "women",
        price: 599,
        rating: 4.9,
        sold: 68,
        tag: "WOMEN",
    },
    {
        id: 40,
        name: "Blue Floral Rash Guard Set",
        category: "modest",
        price: 949,
        rating: 5.0,
        sold: 85,
        tag: "MODEST",
    },
    {
        id: 41,
        name: "Blue Floral Bikini Set",
        category: "women",
        price: 499,
        rating: 4.7,
        sold: 102,
        tag: "WOMEN",
    },
    {
        id: 42,
        name: "Teal Floral Bikini Set",
        category: "women",
        price: 549,
        rating: 4.8,
        sold: 119,
        tag: "WOMEN",
    },
    {
        id: 43,
        name: "Pink Paisley Triangle Bikini Set",
        category: "women",
        price: 599,
        rating: 4.9,
        sold: 136,
        tag: "BEST SELLER",
    },
    {
        id: 44,
        name: "Orange Floral Bikini Set",
        category: "women",
        price: 649,
        rating: 5.0,
        sold: 153,
        tag: "WOMEN",
    },
    {
        id: 45,
        name: "Black Floral Tie-Side Bikini Set",
        category: "women",
        price: 499,
        rating: 4.7,
        sold: 170,
        tag: "WOMEN",
    },
    {
        id: 46,
        name: "White Floral Tie-Side Bikini Set",
        category: "women",
        price: 549,
        rating: 4.8,
        sold: 187,
        tag: "WOMEN",
    },
    {
        id: 47,
        name: "Mint Green Floral Bikini Set",
        category: "women",
        price: 599,
        rating: 4.9,
        sold: 204,
        tag: "WOMEN",
    },
    {
        id: 48,
        name: "Royal Blue Cutout Bikini Set",
        category: "women",
        price: 649,
        rating: 5.0,
        sold: 61,
        tag: "WOMEN",
    },
    {
        id: 49,
        name: "Black Cutout Bikini Set",
        category: "women",
        price: 499,
        rating: 4.7,
        sold: 78,
        tag: "WOMEN",
    },
    {
        id: 50,
        name: "Yellow Floral Bikini Set",
        category: "women",
        price: 549,
        rating: 4.8,
        sold: 95,
        tag: "BEST SELLER",
    },
    {
        id: 51,
        name: "Floral Bandeau Bikini Set",
        category: "women",
        price: 599,
        rating: 4.9,
        sold: 112,
        tag: "WOMEN",
    },
    {
        id: 52,
        name: "Navy Tie-Side Bikini Set",
        category: "women",
        price: 649,
        rating: 5.0,
        sold: 129,
        tag: "WOMEN",
    },
    {
        id: 53,
        name: "Green Tie-Side Bikini Set",
        category: "women",
        price: 499,
        rating: 4.7,
        sold: 146,
        tag: "WOMEN",
    },
    {
        id: 54,
        name: "White Floral Tie-Side Bikini Set",
        category: "women",
        price: 549,
        rating: 4.8,
        sold: 163,
        tag: "WOMEN",
    },
    {
        id: 55,
        name: "Mint Floral Bikini Set",
        category: "women",
        price: 599,
        rating: 4.9,
        sold: 180,
        tag: "WOMEN",
    },
    {
        id: 56,
        name: "Pink Paisley Bikini Feature",
        category: "women",
        price: 649,
        rating: 5.0,
        sold: 197,
        tag: "BEST SELLER",
    },
    {
        id: 57,
        name: "Yellow Floral Bikini Feature",
        category: "women",
        price: 499,
        rating: 4.7,
        sold: 54,
        tag: "BEST SELLER",
    }
];

// ---------------------------------------------------------
// 3. DEFAULT CUSTOMER REVIEWS
// ---------------------------------------------------------
const DEFAULT_REVIEWS = [
    {
        name: "Alyssa M.",
        rating: 5,
        text: "Comfortable fit and I like that modest options are included."
    },
    {
        name: "Carla D.",
        rating: 5,
        text: "Beautiful styles and easy to browse."
    },
    {
        name: "Mika S.",
        rating: 4,
        text: "I like being able to save favorites before checkout."
    }
];

// ---------------------------------------------------------
// 4. APPLICATION STATE
// ---------------------------------------------------------
let S = {
    cart: JSON.parse(localStorage.getItem("mk_cart") || "[]"),
    favorites: JSON.parse(localStorage.getItem("mk_fav") || "[]"),
    orders: JSON.parse(localStorage.getItem("mk_orders") || "[]"),
    reviews:
        (JSON.parse(localStorage.getItem("mk_reviews") || "null") || DEFAULT_REVIEWS)
            .filter((review) => !/kids'?\s+section/i.test(review.text || "")),
    user: JSON.parse(localStorage.getItem("mk_user") || "null"),
    search: "",
    filter: "all"
};

// ---------------------------------------------------------
// 4A. DOM REFERENCES
// ---------------------------------------------------------
const auth = document.getElementById("auth");
const authMessage = document.getElementById("authMessage");
const app = document.getElementById("app");
const intro = document.getElementById("intro");
const enterStore = document.getElementById("enterStore");
const introGuest = document.getElementById("introGuest");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showLogin = document.getElementById("showLogin");
const showRegister = document.getElementById("showRegister");
const guestBtn = document.getElementById("guestBtn");
const introLogin = document.getElementById("introLogin");
const introRegister = document.getElementById("introRegister");
const backToIntro = document.getElementById("backToIntro");
const loginName = document.getElementById("loginName");
const loginPass = document.getElementById("loginPass");
const registerName = document.getElementById("registerName");
const registerEmail = document.getElementById("registerEmail");
const registerPass = document.getElementById("registerPass");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const featured = document.getElementById("featured");
const fb = document.getElementById("fb");
const ig = document.getElementById("ig");
const li = document.getElementById("li");
const tw = document.getElementById("tw");
const searchText = document.getElementById("searchText");
const shopGrid = document.getElementById("shopGrid");
const favGrid = document.getElementById("favGrid");
const favEmpty = document.getElementById("favEmpty");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const sub = document.getElementById("sub");
const ship = document.getElementById("ship");
const total = document.getElementById("total");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutForm = document.getElementById("checkoutForm");
const custName = document.getElementById("custName");
const custPhone = document.getElementById("custPhone");
const custAddress = document.getElementById("custAddress");
const checkoutItems = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");
const cardNote = document.getElementById("cardNote");
const orders = document.getElementById("orders");
const ordersEmpty = document.getElementById("ordersEmpty");
const reviewList = document.getElementById("reviewList");
const reviewForm = document.getElementById("reviewForm");
const reviewName = document.getElementById("reviewName");
const reviewRating = document.getElementById("reviewRating");
const reviewText = document.getElementById("reviewText");
const reviewContext = document.getElementById("reviewContext");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const avatar = document.getElementById("avatar");
const logoutBtn = document.getElementById("logoutBtn");
const navCart = document.getElementById("navCart");
const productModal = document.getElementById("productModal");
const closeProduct = document.getElementById("closeProduct");
const productModalImage = document.getElementById("productModalImage");
const toggleProductZoom = document.getElementById("toggleProductZoom");
const productZoomHint = document.querySelector(".zoom-hint");
const productModalTag = document.getElementById("productModalTag");
const productModalTitle = document.getElementById("productModalTitle");
const productModalStars = document.getElementById("productModalStars");
const productModalRating = document.getElementById("productModalRating");
const productModalSold = document.getElementById("productModalSold");
const productModalPrice = document.getElementById("productModalPrice");
const productModalReviews = document.getElementById("productModalReviews");
const productModalAdd = document.getElementById("productModalAdd");
const productWriteReview = document.getElementById("productWriteReview");

let productImages = Object.fromEntries(
    PRODUCTS.map((product) => [
        product.id,
        `assets/products/${product.id}/product.jpg`
    ])
);
let selectedProductId = null;
let activeReviewProductId = null;
let productTrigger = null;

function updateProductZoomAvailability() {
    if (!productModalImage || !toggleProductZoom || !productZoomHint) {
        return;
    }

    toggleProductZoom.disabled = false;
    toggleProductZoom.textContent = "Zoom in";
    toggleProductZoom.setAttribute("aria-pressed", "false");
    productZoomHint.textContent = "Click photo or Zoom in for a closer preview";
}

async function loadProductImages() {
    if (
        window.location.protocol === "file:" ||
        (["localhost", "127.0.0.1"].includes(window.location.hostname) &&
            window.location.port !== "3000")
    ) {
        return;
    }

    try {
        const response = await fetch(apiUrl("/api/product-images"), {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Unable to load product images.");
        }

        const data = await response.json();
        if (data && typeof data === "object" && !Array.isArray(data)) {
            productImages = {
                ...productImages,
                ...data
            };
        }
    } catch (error) {
        console.warn(
            "Maekini product images:",
            error.message
        );
    }
}

function renderStars(rating) {
    const roundedRating = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    return `<span class="stars" aria-label="${roundedRating} out of 5 stars">${"★".repeat(roundedRating)}<span class="empty-stars">${"☆".repeat(5 - roundedRating)}</span></span>`;
}

function displayTag(product) {
    return product.tag === "KIDS" ? "GIRLS" : product.tag;
}

function openProduct(productId) {
    const product = PRODUCTS.find((item) => item.id === productId);
    if (!product || !productModal || !productModalImage) {
        return;
    }

    productTrigger = document.activeElement;
    selectedProductId = product.id;
    productModalImage.classList.remove("zoomed");
    toggleProductZoom?.setAttribute("aria-pressed", "false");
    if (toggleProductZoom) {
        toggleProductZoom.textContent = "Zoom in";
    }
    if (productZoomHint) {
        productZoomHint.textContent = "Click photo to zoom";
    }
    productModalImage.src = productImages[product.id];
    updateProductZoomAvailability();
    productModalImage.alt = product.name;
    productModalTag.textContent = displayTag(product);
    productModalTitle.textContent = product.name;
    productModalStars.innerHTML = renderStars(product.rating);
    productModalRating.textContent = `${product.rating.toFixed(1)} / 5`;
    productModalSold.textContent = `${product.sold} sold`;
    productModalPrice.textContent = peso(product.price);

    const reviews = S.reviews
        .filter((review) => !review.productId || Number(review.productId) === product.id)
        .slice(0, 3);

    productModalReviews.innerHTML = reviews.length
        ? reviews.map((review) => `
            <article class="modal-review">
                <div class="modal-review-heading"><b>${esc(review.name)}</b>${renderStars(review.rating)}</div>
                <p>${esc(review.text)}</p>
            </article>
        `).join("")
        : '<p class="no-product-reviews">No reviews yet. Be the first to share what you think.</p>';

    productModal.classList.remove("hidden");
    productModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    closeProduct.focus();
}

function closeProductModal() {
    if (!productModal) {
        return;
    }

    productModal.classList.add("hidden");
    productModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    productModalImage?.classList.remove("zoomed");
    toggleProductZoom?.setAttribute("aria-pressed", "false");
    if (toggleProductZoom) {
        toggleProductZoom.textContent = "Zoom in";
    }
    if (productZoomHint) {
        productZoomHint.textContent = "Click photo to zoom";
    }
    updateProductZoomAvailability();
    selectedProductId = null;
    if (productTrigger instanceof HTMLElement) {
        productTrigger.focus();
    }
}

// ---------------------------------------------------------
// 5. HELPER FUNCTIONS
// ---------------------------------------------------------
function peso(number) {
    return "₱" + Number(number).toLocaleString("en-PH");
}

function save() {
    localStorage.setItem("mk_cart", JSON.stringify(S.cart));
    localStorage.setItem("mk_fav", JSON.stringify(S.favorites));
    localStorage.setItem("mk_orders", JSON.stringify(S.orders));
    localStorage.setItem("mk_reviews", JSON.stringify(S.reviews));
    localStorage.setItem("mk_user", JSON.stringify(S.user));
}

function toast(message) {
    const toastBox = document.getElementById("toast");

    toastBox.textContent = message;
    toastBox.classList.add("show");

    setTimeout(() => {
        toastBox.classList.remove("show");
    }, 1600);
}

// ---------------------------------------------------------
// 6. PAGE NAVIGATION
// ---------------------------------------------------------
function view(viewId) {
    document.querySelectorAll(".view").forEach((section) => {
        section.classList.remove("active");
    });

    document.getElementById(viewId).classList.add("active");

    document.querySelectorAll("nav button").forEach((button) => {
        button.classList.toggle(
            "active",
            button.dataset.view === viewId
        );
    });

    window.scrollTo(0, 0);

    if (viewId === "shop") {
        renderShop();
    }

    if (viewId === "favorites") {
        renderFav();
    }

    if (viewId === "cart") {
        renderCart();
    }

    if (viewId === "checkout") {
        renderCheckout();
    }

    if (viewId === "alerts") {
        renderOrders();
    }

    if (viewId === "reviews") {
        renderReviews();
        if (!activeReviewProductId && reviewContext) {
            reviewContext.classList.add("hidden");
        }
    }

    if (viewId === "me") {
        renderMe();
    }
}

// ---------------------------------------------------------
// 7. PRODUCT CARD
// ---------------------------------------------------------
function card(product) {
    const isFavorite = S.favorites.includes(product.id);
    const image = productImages[product.id] || "";

    return `
        <article class="product">
            <div class="media">
                <div class="fallback ${image ? "hidden" : ""}">
                    Add your product photo in:
                    <br>
                    assets/products/${product.id}/
                </div>

                ${image ? `<img class="product-image" src="${image}" alt="${product.name} — view details" role="button" tabindex="0" aria-haspopup="dialog" onclick="openProduct(${product.id})" onkeydown="if(event.key === 'Enter' || event.key === ' '){event.preventDefault();openProduct(${product.id})}" onerror="this.hidden=true; this.previousElementSibling.classList.remove('hidden')">` : ""}

                <button
                    class="fav"
                    onclick="toggleFav(${product.id})"
                    aria-label="Add to favorites"
                >
                    ${isFavorite ? "♥" : "♡"}
                </button>
            </div>

            <div class="body">
                <span class="tag">${displayTag(product)}</span>

                <button class="title product-title" onclick="openProduct(${product.id})">
                    ${product.name}
                </button>

                <div class="meta">
                    <span class="rating-stars">★ ${product.rating}</span> · ${product.sold} sold
                </div>

                <div class="bottom">
                    <span class="price">
                        ${peso(product.price)}
                    </span>

                    <button onclick="addCart(${product.id})">
                        Add
                    </button>
                </div>
            </div>
        </article>
    `;
}

// ---------------------------------------------------------
// 8. HOME PAGE
// ---------------------------------------------------------
function renderHome() {
    featured.innerHTML = PRODUCTS
        .slice(0, 4)
        .map(card)
        .join("");

    fb.href = STORE_INFO.socials.facebook;
    ig.href = STORE_INFO.socials.instagram;
    li.href = STORE_INFO.socials.linkedin;
    tw.href = STORE_INFO.socials.twitter;
}

function productGroup(product) {
    return product.category === "modest" || product.tag === "MODEST"
        ? "modest"
        : "sets";
}

// ---------------------------------------------------------
// 9. SHOP AND SEARCH
// ---------------------------------------------------------
function renderShop() {
    let products = PRODUCTS.filter((product) => {
        return (
            S.filter === "all" ||
            productGroup(product) === S.filter
        );
    });

    if (S.search) {
        const keyword = S.search.toLowerCase();

        products = products.filter((product) => {
            const searchableText =
                product.name +
                " " + productGroup(product) +
                " " +
                displayTag(product);

            return searchableText
                .toLowerCase()
                .includes(keyword);
        });
    }

    if (products.length > 0) {
        shopGrid.innerHTML = products
            .map(card)
            .join("");
    } else {
        shopGrid.innerHTML = `
            <div class="empty">
                No products found.
            </div>
        `;
    }

    if (S.search) {
        searchText.textContent =
            `Search results for “${S.search}” · ${products.length} item(s)`;
    } else {
        searchText.textContent = products.length + " products";
    }

    document.querySelectorAll("[data-filter]").forEach((button) => {
        button.classList.toggle(
            "active",
            button.dataset.filter === S.filter
        );
    });
}

function searchProducts() {
    S.search = searchInput.value.trim();
    S.filter = "all";
    view("shop");
}

// ---------------------------------------------------------
// 10. SHOPPING CART
// ---------------------------------------------------------
function addCart(productId) {
    const existingItem = S.cart.find((item) => {
        return item.id === productId;
    });

    if (existingItem) {
        existingItem.qty++;
    } else {
        S.cart.push({
            id: productId,
            qty: 1
        });
    }

    save();
    counts();
    toast("Added to cart");
}

function changeQty(productId, difference) {
    const item = S.cart.find((cartItem) => {
        return cartItem.id === productId;
    });

    if (!item) {
        return;
    }

    item.qty += difference;

    if (item.qty <= 0) {
        S.cart = S.cart.filter((cartItem) => {
            return cartItem.id !== productId;
        });
    }

    save();
    counts();
    renderCart();
}

function removeItem(productId) {
    S.cart = S.cart.filter((item) => {
        return item.id !== productId;
    });

    save();
    counts();
    renderCart();
}

function totals() {
    let subtotal = 0;

    S.cart.forEach((item) => {
        const product = PRODUCTS.find((productItem) => {
            return productItem.id === item.id;
        });

        if (product) {
            subtotal += product.price * item.qty;
        }
    });

    const shipping = subtotal ? 79 : 0;

    return {
        subtotal: subtotal,
        shipping: shipping,
        total: subtotal + shipping
    };
}

function renderCart() {
    const cartLayout = document.querySelector("#cart .two");

    if (!S.cart.length) {
        cartLayout.classList.add("hidden");
        cartEmpty.classList.remove("hidden");
        return;
    }

    cartLayout.classList.remove("hidden");
    cartEmpty.classList.add("hidden");

    // Remove stale cart entries if a product was deleted or renamed.
    S.cart = S.cart.filter((item) =>
        PRODUCTS.some((productItem) => productItem.id === item.id)
    );

    if (!S.cart.length) {
        save();
        counts();
        cartLayout.classList.add("hidden");
        cartEmpty.classList.remove("hidden");
        return;
    }

    cartItems.innerHTML = S.cart
        .map((item) => {
            const product = PRODUCTS.find((productItem) => {
                return productItem.id === item.id;
            });

            if (!product) {
                return "";
            }

            return `
                <div class="cartRow">
                    <img
                        class="cart-thumb"
                        src="${productImages[product.id]}"
                        alt="${product.name}"
                        onclick="openProduct(${product.id})"
                    >
                    <div class="cart-product">
                        <b>${product.name}</b>
                        <div>${peso(product.price)} each</div>

                        <button
                            class="light"
                            onclick="removeItem(${product.id})"
                        >
                            Remove
                        </button>
                    </div>

                    <div class="qty">
                        <button
                            onclick="changeQty(${product.id}, -1)"
                        >
                            −
                        </button>

                        <b>${item.qty}</b>

                        <button
                            onclick="changeQty(${product.id}, 1)"
                        >
                            +
                        </button>

                        <div class="price">
                            ${peso(product.price * item.qty)}
                        </div>
                    </div>
                </div>
            `;
        })
        .join("");

    const cartTotals = totals();

    sub.textContent = peso(cartTotals.subtotal);
    ship.textContent = peso(cartTotals.shipping);
    total.textContent = peso(cartTotals.total);
}

// ---------------------------------------------------------
// 11. FAVORITES
// ---------------------------------------------------------
function toggleFav(productId) {
    if (S.favorites.includes(productId)) {
        S.favorites = S.favorites.filter((id) => {
            return id !== productId;
        });
    } else {
        S.favorites.push(productId);
    }

    save();
    counts();
    renderHome();

    if (shop.classList.contains("active")) {
        renderShop();
    }

    if (favorites.classList.contains("active")) {
        renderFav();
    }
}

function renderFav() {
    const favoriteProducts = PRODUCTS.filter((product) => {
        return S.favorites.includes(product.id);
    });

    favGrid.innerHTML = favoriteProducts
        .map(card)
        .join("");

    favEmpty.classList.toggle(
        "hidden",
        favoriteProducts.length > 0
    );
}

// ---------------------------------------------------------
// 12. CHECKOUT
// ---------------------------------------------------------
function renderCheckout() {
    if (!S.cart.length) {
        view("cart");
        return;
    }

    const cartTotals = totals();

    checkoutItems.innerHTML = S.cart
        .map((item) => {
            const product = PRODUCTS.find((productItem) => {
                return productItem.id === item.id;
            });

            return `
                <p>
                    <span>
                        ${product.name} × ${item.qty}
                    </span>

                    <b>
                        ${peso(product.price * item.qty)}
                    </b>
                </p>
            `;
        })
        .join("");

    checkoutTotal.textContent = peso(cartTotals.total);

    if (S.user) {
        custName.value = S.user.name || "";
    }
}

function placeOrder(event) {
    event.preventDefault();

    const selectedPayment = document.querySelector(
        "input[name=pay]:checked"
    );

    if (!selectedPayment) {
        toast("Please choose a payment method");
        return;
    }

    const cartTotals = totals();

    const order = {
        id: "MK" + Date.now().toString().slice(-8),
        created: new Date().toLocaleString(),
        status: "Preparing for Ship",
        payment: selectedPayment.value,
        total: cartTotals.total,
        items: structuredClone(S.cart)
    };

    S.orders.unshift(order);
    S.cart = [];

    save();
    counts();
    checkoutForm.reset();

    toast("Order placed successfully");
    view("alerts");
}

// ---------------------------------------------------------
// 13. ORDER TRACKING
// ---------------------------------------------------------
function statusClass(status) {
    if (status === "Preparing for Ship") {
        return "preparing";
    }

    if (status === "In Transit") {
        return "transit";
    }

    if (status === "Delivered") {
        return "delivered";
    }

    return "cancelled";
}

function track(status) {
    const trackingSteps = [
        "Preparing for Ship",
        "In Transit",
        "Delivered"
    ];

    const currentIndex =
        status === "Cancelled"
            ? -1
            : trackingSteps.indexOf(status);

    return `
        <div class="track">
            ${trackingSteps
                .map((step, index) => {
                    return `
                        <div class="step ${
                            currentIndex >= index ? "done" : ""
                        }">
                            ${step}
                        </div>
                    `;
                })
                .join("")}

            <div class="step ${
                status === "Cancelled" ? "done" : ""
            }">
                Cancelled
            </div>
        </div>
    `;
}

function updateStatus(orderId, newStatus) {
    const order = S.orders.find((item) => {
        return item.id === orderId;
    });

    if (order) {
        order.status = newStatus;

        save();
        renderOrders();
        toast("Order updated: " + newStatus);
    }
}

function renderOrders() {
    ordersEmpty.classList.toggle(
        "hidden",
        S.orders.length > 0
    );

    orders.innerHTML = S.orders
        .map((order) => {
            let actionButtons = "";

            if (order.status === "Preparing for Ship") {
                actionButtons += `
                    <button
                        onclick="updateStatus('${order.id}', 'In Transit')"
                    >
                        Demo: Mark In Transit
                    </button>
                `;
            }

            if (order.status === "In Transit") {
                actionButtons += `
                    <button
                        onclick="updateStatus('${order.id}', 'Delivered')"
                    >
                        Demo: Mark Delivered
                    </button>
                `;
            }

            if (
                order.status === "Preparing for Ship" ||
                order.status === "In Transit"
            ) {
                actionButtons += `
                    <button
                        class="light"
                        onclick="updateStatus('${order.id}', 'Cancelled')"
                    >
                        Cancel Order
                    </button>
                `;
            }

            return `
                <article class="order">
                    <div>
                        <span>ORDER ${order.id}</span>

                        <h3>
                            ${order.created}
                        </h3>

                        <p>
                            ${order.payment} · ${peso(order.total)}
                        </p>

                        <span class="status ${statusClass(order.status)}">
                            ${order.status}
                        </span>
                    </div>

                    ${track(order.status)}

                    <div class="orderActions">
                        ${actionButtons}
                    </div>
                </article>
            `;
        })
        .join("");
}

// ---------------------------------------------------------
// 14. CUSTOMER REVIEWS
// ---------------------------------------------------------
function esc(text) {
    return String(text).replace(
        /[&<>"']/g,
        (character) => {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[character];
        }
    );
}

function renderReviews() {
    reviewList.innerHTML = S.reviews
        .map((review) => {
            return `
                <article class="review">
                    <b>
                        ${esc(review.name)}
                    </b>

                    ${renderStars(review.rating)}

                    <p>
                        ${esc(review.text)}
                    </p>
                </article>
            `;
        })
        .join("");
}

function submitReview(event) {
    event.preventDefault();

    const newReview = {
        name: reviewName.value.trim(),
        rating: Number(reviewRating.value),
        text: reviewText.value.trim(),
        ...(activeReviewProductId ? { productId: activeReviewProductId } : {})
    };

    S.reviews.unshift(newReview);

    save();
    reviewForm.reset();
    activeReviewProductId = null;
    if (reviewContext) {
        reviewContext.textContent = "";
        reviewContext.classList.add("hidden");
    }
    renderReviews();

    toast("Review submitted");
}

// ---------------------------------------------------------
// 15. COUNTERS AND PROFILE
// ---------------------------------------------------------
function counts() {
    const cartTotal = S.cart.reduce((number, item) => {
        return number + item.qty;
    }, 0);

    cartCount.textContent = cartTotal;
    navCart.textContent = cartTotal;
    favCount.textContent = S.favorites.length;
}

function renderMe() {
    profileName.textContent =
        S.user?.name || "Guest Shopper";

    profileEmail.textContent =
        S.user?.email || "Browsing as guest";

    avatar.textContent = (
        S.user?.name || "M"
    )[0].toUpperCase();
}

// ---------------------------------------------------------
// 16. DATABASE LOGIN AND REGISTRATION
// ---------------------------------------------------------
// Prefer the SQLite API and fall back to browser-local accounts when it is offline.
async function apiRequest(url, options = {}) {
    let response;
    try {
        response = await fetch(apiUrl(url), {
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            },
            ...options
        });
    } catch (error) {
        if (error instanceof TypeError) {
            throw new AccountApiUnavailableError(ACCOUNT_API_UNAVAILABLE_MESSAGE);
        }
        throw error;
    }

    const responseText = await response.text();
    let data;
    try {
        data = responseText ? JSON.parse(responseText) : {};
    } catch {
        if (response.status === 404 || response.status >= 500) {
            throw new AccountApiUnavailableError(ACCOUNT_API_UNAVAILABLE_MESSAGE);
        }
        throw new Error(`The account server returned an invalid response (${response.status}).`);
    }

    if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new Error("The account server returned an invalid response.");
    }

    if (!response.ok) {
        throw new Error(
            typeof data.message === "string" && data.message
                ? data.message
                : `Request failed (${response.status}).`
        );
    }

    return data;
}

class AccountApiUnavailableError extends Error {
    constructor(message) {
        super(message);
        this.name = "AccountApiUnavailableError";
    }
}

function readLocalAccounts() {
    const storedAccounts = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    if (!storedAccounts) {
        return [];
    }

    let accounts;
    try {
        accounts = JSON.parse(storedAccounts);
    } catch {
        throw new Error("Saved browser accounts are damaged. Clear this site's saved data or use the Maekini server.");
    }

    if (
        !Array.isArray(accounts) ||
        accounts.some((account) =>
            !account ||
            typeof account.email !== "string" ||
            typeof account.name !== "string" ||
            typeof account.salt !== "string" ||
            typeof account.passwordHash !== "string"
        )
    ) {
        throw new Error("Saved browser accounts are invalid. Clear this site's saved data or use the Maekini server.");
    }

    return accounts;
}

async function hashLocalPassword(password, salt) {
    if (!window.crypto?.subtle) {
        throw new Error("Secure local sign-in needs a modern browser. Please update Chrome or Edge and try again.");
    }

    const key = await window.crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
    );
    const saltBytes = Uint8Array.from(
        salt.match(/.{2}/g) || [],
        (byte) => Number.parseInt(byte, 16)
    );
    const digest = await window.crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: saltBytes,
            iterations: 210000,
            hash: "SHA-256"
        },
        key,
        256
    );

    return Array.from(new Uint8Array(digest), (byte) =>
        byte.toString(16).padStart(2, "0")
    ).join("");
}

function createSalt() {
    const bytes = window.crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes, (byte) =>
        byte.toString(16).padStart(2, "0")
    ).join("");
}

async function createLocalAccount(name, email, password) {
    const accounts = readLocalAccounts();
    if (accounts.some((account) => account.email === email)) {
        throw new Error("That email already has an account in this browser. Log in instead.");
    }

    const salt = createSalt();
    const account = {
        id: `browser-${Date.now()}`,
        name,
        email,
        salt,
        passwordHash: await hashLocalPassword(password, salt),
        createdAt: new Date().toISOString()
    };

    accounts.push(account);
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
    return account;
}

async function verifyLocalPassword(account, password) {
    const actualHash = await hashLocalPassword(password, account.salt);
    if (actualHash.length !== account.passwordHash.length) {
        return false;
    }

    let difference = 0;
    for (let index = 0; index < actualHash.length; index += 1) {
        difference |= actualHash.charCodeAt(index) ^ account.passwordHash.charCodeAt(index);
    }
    return difference === 0;
}

function localAccountUser(account) {
    return {
        id: account.id,
        name: account.name,
        email: account.email,
        createdAt: account.createdAt,
        lastLogin: new Date().toISOString()
    };
}

function getApiUser(data) {
    if (
        !data.user ||
        typeof data.user.name !== "string" ||
        typeof data.user.email !== "string"
    ) {
        throw new Error("The account server response is missing customer details.");
    }

    return data.user;
}

function showAuthMessage(message = "") {
    if (!authMessage) {
        if (message) {
            toast(message);
        }
        return;
    }

    authMessage.textContent = message;
    authMessage.classList.toggle("hidden", !message);
}

async function registerUser(event) {
    event.preventDefault();
    showAuthMessage();

    const name = registerName.value.trim();
    const email = registerEmail.value.trim();
    const password = registerPass.value;

    if (!name || !email) {
        showAuthMessage("Enter your name and a valid email address.");
        return;
    }

    if (password.length < 6) {
        showAuthMessage("Your password must be at least 6 characters.");
        return;
    }

    try {
        let accountUser;
        try {
            const data = await apiRequest("/api/register", {
                method: "POST",
                body: JSON.stringify({ name, email, password })
            });
            accountUser = getApiUser(data);
        } catch (error) {
            if (!(error instanceof AccountApiUnavailableError)) {
                throw error;
            }
            const account = await createLocalAccount(name, email.toLowerCase(), password);
            accountUser = localAccountUser(account);
            showAuthMessage("Account created on this browser. It will be available here when you log in again.");
        }

        S.user = accountUser;
        save();
        registerPass.value = "";
        toast("Account created successfully.");
        showApp();
    } catch (error) {
        showAuthMessage(error instanceof Error ? error.message : "Account creation failed. Please try again.");
    }
}

async function loginUser(event) {
    event.preventDefault();
    showAuthMessage();

    const email = loginName.value.trim();
    const password = loginPass.value;

    if (!email || !password) {
        showAuthMessage("Enter your email and password.");
        return;
    }

    try {
        const normalizedEmail = email.toLowerCase();
        const browserAccount = readLocalAccounts().find(
            (account) => account.email === normalizedEmail
        );
        let accountUser;

        if (browserAccount) {
            if (!(await verifyLocalPassword(browserAccount, password))) {
                throw new Error("Incorrect email or password.");
            }
            accountUser = localAccountUser(browserAccount);
        } else {
            const data = await apiRequest("/api/login", {
                method: "POST",
                body: JSON.stringify({ email: normalizedEmail, password })
            });
            accountUser = getApiUser(data);
        }

        S.user = accountUser;
        save();
        loginPass.value = "";
        toast("Welcome back, " + accountUser.name + ".");
        showApp();
    } catch (error) {
        showAuthMessage(
            error instanceof AccountApiUnavailableError
                ? "No browser account was found and the account server is offline. Create an account here to save it securely in this browser."
                : error instanceof Error
                    ? error.message
                    : "Login failed. Please check your details and try again."
        );
    }
}

// ---------------------------------------------------------
// 17. APPLICATION START
// ---------------------------------------------------------
function showApp() {
    intro?.classList.add("hidden");
    auth.classList.add("hidden");
    app.classList.remove("hidden");
    showAuthMessage();

    renderHome();
    renderReviews();
    renderMe();
    counts();

    view("home");
}

function showAuth(mode = "login") {
    intro?.classList.add("hidden");
    app.classList.add("hidden");
    auth.classList.remove("hidden");
    showAuthMessage();

    const showRegistration = mode === "register";
    loginForm.classList.toggle("hidden", showRegistration);
    registerForm.classList.toggle("hidden", !showRegistration);
    showLogin.classList.toggle("active", !showRegistration);
    showRegister.classList.toggle("active", showRegistration);
    (showRegistration ? registerName : loginName).focus();
}

// ---------------------------------------------------------
// 18. EVENT LISTENERS
// ---------------------------------------------------------
document.addEventListener("click", (event) => {
    const navigationButton = event.target.closest("[data-view]");

    if (navigationButton) {
        view(navigationButton.dataset.view);
    }

    const categoryButton = event.target.closest("[data-cat]");

    if (categoryButton) {
        S.filter = categoryButton.dataset.cat;
        S.search = "";
        searchInput.value = "";
        view("shop");
    }
});

function showEntry() {
    if (S.user) {
        showApp();
        return;
    }

    showAuth("login");
}

enterStore?.addEventListener("click", showEntry);

introLogin?.addEventListener("click", () => showAuth("login"));
introRegister?.addEventListener("click", () => showAuth("register"));
backToIntro?.addEventListener("click", () => {
    auth.classList.add("hidden");
    app.classList.add("hidden");
    intro?.classList.remove("hidden");
    showAuthMessage();
});

introGuest?.addEventListener("click", () => {
    S.user = null;
    save();
    showApp();
});

closeProduct?.addEventListener("click", closeProductModal);

function toggleProductImageZoom() {
    if (!productModalImage || !productModalImage.naturalWidth) {
        return;
    }

    const zoomed = productModalImage.classList.toggle("zoomed");
    toggleProductZoom?.setAttribute("aria-pressed", String(zoomed));
    if (toggleProductZoom) {
        toggleProductZoom.textContent = zoomed ? "Zoom out" : "Zoom in";
    }
    if (productZoomHint) {
        productZoomHint.textContent = zoomed ? "Click photo to zoom out" : "Click photo to zoom";
    }
}

productModalImage?.addEventListener("click", toggleProductImageZoom);
productModalImage?.addEventListener("load", updateProductZoomAvailability);
productModalImage?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleProductImageZoom();
    }
});
toggleProductZoom?.addEventListener("click", toggleProductImageZoom);

productModal?.addEventListener("click", (event) => {
    if (event.target === productModal) {
        closeProductModal();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && productModal && !productModal.classList.contains("hidden")) {
        closeProductModal();
    }
});

productModalAdd?.addEventListener("click", () => {
    if (selectedProductId !== null) {
        addCart(selectedProductId);
        closeProductModal();
    }
});

productWriteReview?.addEventListener("click", () => {
    if (selectedProductId === null) {
        return;
    }

    const product = PRODUCTS.find((item) => item.id === selectedProductId);
    activeReviewProductId = selectedProductId;
    if (reviewContext) {
        reviewContext.textContent = `Your review will be about ${product.name}.`;
        reviewContext.classList.remove("hidden");
    }
    closeProductModal();
    view("reviews");
});

// Login and registration tabs
showLogin.addEventListener("click", () => {
    showAuthMessage();
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    showLogin.classList.add("active");
    showRegister.classList.remove("active");
});

showRegister.addEventListener("click", () => {
    showAuthMessage();
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    showRegister.classList.add("active");
    showLogin.classList.remove("active");
});

// Shop filter buttons
// ---------------------------------------------------------
document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
        S.filter = button.dataset.filter;
        renderShop();
    });
});

// Search button
// ---------------------------------------------------------
searchBtn.addEventListener("click", searchProducts);

// Search using the Enter key
// ---------------------------------------------------------
searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchProducts();
    }
});

// Login form
// ---------------------------------------------------------
loginForm.addEventListener("submit", loginUser);

// Registration form
// ---------------------------------------------------------
registerForm.addEventListener("submit", registerUser);

// Guest button
// ---------------------------------------------------------
guestBtn.addEventListener("click", () => {
    S.user = null;
    save();
    showApp();
});

// Checkout button
// ---------------------------------------------------------
checkoutBtn.addEventListener("click", () => {
    if (S.cart.length) {
        view("checkout");
    } else {
        toast("Your cart is empty.");
    }
});

// Checkout form
// ---------------------------------------------------------
checkoutForm.addEventListener("submit", placeOrder);

// Review form
// ---------------------------------------------------------
reviewForm.addEventListener("submit", submitReview);

// Payment method selection
// ---------------------------------------------------------
document.querySelectorAll("input[name=pay]").forEach((radio) => {
    radio.addEventListener("change", () => {
        const selectedPayment = document.querySelector(
            "input[name=pay]:checked"
        )?.value;

        cardNote.classList.toggle(
            "hidden",
            selectedPayment !== "Credit Card"
        );
    });
});

// Logout button
// ---------------------------------------------------------
logoutBtn.addEventListener("click", () => {
    S.user = null;
    save();

    app.classList.add("hidden");
    showAuth("login");
});

// ---------------------------------------------------------
// 19. INITIALIZE WEBSITE
// ---------------------------------------------------------
async function init() {
    await loadProductImages();

    renderHome();
    renderReviews();
    renderCart();
    renderFav();
    renderOrders();
    counts();

    if (intro) {
        intro.classList.remove("hidden");
        auth.classList.add("hidden");
        app.classList.add("hidden");
    } else if (S.user) {
        showApp();
    } else {
        auth.classList.remove("hidden");
        app.classList.add("hidden");
    }
}

init();
