const config = window.MAEKINI_SUPABASE_CONFIG;
const client = config && window.supabase?.createClient
    ? window.supabase.createClient(config.url, config.publishableKey)
    : null;

const statusMessage = document.getElementById("adminStatus");
const denied = document.getElementById("adminDenied");
const dashboard = document.getElementById("adminDashboard");
const customerRows = document.getElementById("customerRows");
const productRows = document.getElementById("productRows");
const orderRows = document.getElementById("orderRows");
const ordersEmpty = document.getElementById("ordersEmpty");
const productForm = document.getElementById("productForm");
const productMessage = document.getElementById("productMessage");
const orderMessage = document.getElementById("orderMessage");
const settingsForm = document.getElementById("settingsForm");
const settingsMessage = document.getElementById("settingsMessage");

let products = [];

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function setMessage(element, message, isError = false) {
    element.textContent = message;
    element.classList.toggle("errorText", isError);
    element.classList.toggle("successText", !isError && Boolean(message));
}

function formatPrice(value) {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP"
    }).format(Number(value) || 0);
}

function safeImageUrl(value) {
    const url = new URL(value, window.location.origin);
    if (url.protocol !== "https:" && url.origin !== window.location.origin) {
        throw new Error("Product images must use this site or a secure HTTPS URL.");
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") {
        throw new Error("Use a valid HTTPS image URL or a path on this site.");
    }
    return value.trim();
}

function validSocialLinks() {
    const fields = {
        facebook: document.getElementById("socialFacebook").value.trim(),
        instagram: document.getElementById("socialInstagram").value.trim(),
        linkedin: document.getElementById("socialLinkedin").value.trim(),
        twitter: document.getElementById("socialTwitter").value.trim()
    };

    for (const [label, value] of Object.entries(fields)) {
        if (!value) {
            continue;
        }
        const url = new URL(value);
        if (url.protocol !== "https:" && url.protocol !== "http:") {
            throw new Error(`${label} must be an HTTP or HTTPS link.`);
        }
    }

    return fields;
}

async function loadCustomers() {
    const { data, error } = await client
        .from("profiles")
        .select("id, full_name, email, role, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    customerRows.innerHTML = data.map((customer) => `
        <tr>
            <td>${escapeHtml(customer.full_name)}</td>
            <td>${escapeHtml(customer.email)}</td>
            <td>${escapeHtml(new Date(customer.created_at).toLocaleDateString())}</td>
            <td>${customer.role === "owner" ? "Owner" : "Customer"}</td>
        </tr>
    `).join("");
}

async function loadProducts() {
    const { data, error } = await client
        .from("store_products")
        .select("id, name, category, price, tag, image_url, is_active")
        .order("id");

    if (error) {
        throw error;
    }

    products = data;
    productRows.innerHTML = products.map((product) => `
        <tr>
            <td>${escapeHtml(product.name)}</td>
            <td>${escapeHtml(product.category)}</td>
            <td>${formatPrice(product.price)}</td>
            <td>${product.is_active ? "Visible" : "Hidden"}</td>
            <td class="adminActions">
                <button type="button" class="light" data-edit-product="${product.id}">Edit</button>
                <button type="button" class="light" data-toggle-product="${product.id}">
                    ${product.is_active ? "Hide" : "Show"}
                </button>
            </td>
        </tr>
    `).join("");
}

async function loadOrders() {
    const { data, error } = await client
        .from("store_orders")
        .select("id, order_number, customer_name, phone, shipping_address, payment_method, total, items, status, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    ordersEmpty.hidden = data.length > 0;
    orderRows.innerHTML = data.map((order) => {
        const itemSummary = (order.items || [])
            .map((item) => `${escapeHtml(item.name)} × ${Number(item.qty) || 0}`)
            .join("<br>");
        const statuses = ["Preparing for Ship", "In Transit", "Delivered", "Cancelled"];
        return `
            <tr>
                <td>${escapeHtml(order.order_number)}<br><small>${escapeHtml(new Date(order.created_at).toLocaleString())}</small></td>
                <td>${escapeHtml(order.customer_name)}<br>${escapeHtml(order.phone)}</td>
                <td>${escapeHtml(order.shipping_address)}</td>
                <td>${itemSummary}</td>
                <td>${formatPrice(order.total)}<br><small>${escapeHtml(order.payment_method)}</small></td>
                <td>${escapeHtml(order.status)}</td>
                <td>
                    <select data-order-status="${escapeHtml(order.id)}" aria-label="Status for ${escapeHtml(order.order_number)}">
                        ${statuses.map((status) => `
                            <option value="${status}" ${status === order.status ? "selected" : ""}>${status}</option>
                        `).join("")}
                    </select>
                </td>
            </tr>
        `;
    }).join("");
}

async function loadSettings() {
    const { data, error } = await client
        .from("store_settings")
        .select("value")
        .eq("key", "social_links")
        .single();

    if (error) {
        throw error;
    }

    document.getElementById("socialFacebook").value = data.value.facebook || "";
    document.getElementById("socialInstagram").value = data.value.instagram || "";
    document.getElementById("socialLinkedin").value = data.value.linkedin || "";
    document.getElementById("socialTwitter").value = data.value.twitter || "";
}

function resetProductForm() {
    productForm.reset();
    document.getElementById("productId").value = "";
    document.getElementById("productActive").checked = true;
    document.getElementById("saveProduct").textContent = "Add product";
    document.getElementById("cancelProductEdit").hidden = true;
}

function editProduct(product) {
    document.getElementById("productId").value = product.id;
    document.getElementById("productName").value = product.name;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productTag").value = product.tag;
    document.getElementById("productImage").value = product.image_url;
    document.getElementById("productActive").checked = product.is_active;
    document.getElementById("saveProduct").textContent = "Save product";
    document.getElementById("cancelProductEdit").hidden = false;
    productForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

productForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage(productMessage, "");

    try {
        const id = document.getElementById("productId").value;
        const payload = {
            name: document.getElementById("productName").value.trim(),
            category: document.getElementById("productCategory").value.trim(),
            price: Number(document.getElementById("productPrice").value),
            tag: document.getElementById("productTag").value.trim(),
            image_url: safeImageUrl(document.getElementById("productImage").value),
            is_active: document.getElementById("productActive").checked
        };

        if (!payload.name || !payload.category || !payload.tag || !Number.isFinite(payload.price) || payload.price < 0) {
            throw new Error("Enter a product name, category, tag, and valid price.");
        }

        const result = id
            ? await client.from("store_products").update(payload).eq("id", Number(id))
            : await client.from("store_products").insert(payload);

        if (result.error) {
            throw result.error;
        }

        resetProductForm();
        await loadProducts();
        setMessage(productMessage, "Product saved. The live catalog will reflect the change after refresh.");
    } catch (error) {
        setMessage(productMessage, error instanceof Error ? error.message : "Could not save product.", true);
    }
});

document.getElementById("cancelProductEdit").addEventListener("click", resetProductForm);

productRows.addEventListener("click", async (event) => {
    const editButton = event.target.closest("[data-edit-product]");
    if (editButton) {
        const product = products.find((item) => item.id === Number(editButton.dataset.editProduct));
        if (product) {
            editProduct(product);
        }
        return;
    }

    const toggleButton = event.target.closest("[data-toggle-product]");
    if (!toggleButton) {
        return;
    }

    const product = products.find((item) => item.id === Number(toggleButton.dataset.toggleProduct));
    if (!product) {
        return;
    }

    toggleButton.disabled = true;
    const { error } = await client
        .from("store_products")
        .update({ is_active: !product.is_active })
        .eq("id", product.id);

    if (error) {
        setMessage(productMessage, error.message, true);
    } else {
        setMessage(productMessage, `Product ${product.is_active ? "hidden" : "shown"} in the store.`);
        await loadProducts();
    }
});

orderRows.addEventListener("change", async (event) => {
    const select = event.target.closest("[data-order-status]");
    if (!select) {
        return;
    }

    select.disabled = true;
    setMessage(orderMessage, "");
    const { error } = await client
        .from("store_orders")
        .update({ status: select.value })
        .eq("id", select.dataset.orderStatus);

    if (error) {
        setMessage(orderMessage, error.message, true);
        select.disabled = false;
        return;
    }

    setMessage(orderMessage, "Order status updated.");
    select.disabled = false;
});

settingsForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage(settingsMessage, "");

    try {
        const value = validSocialLinks();
        const { error } = await client
            .from("store_settings")
            .upsert({ key: "social_links", value, updated_at: new Date().toISOString() });

        if (error) {
            throw error;
        }

        setMessage(settingsMessage, "Store links saved.");
    } catch (error) {
        setMessage(settingsMessage, error instanceof Error ? error.message : "Could not save store links.", true);
    }
});

async function initAdmin() {
    if (!client) {
        statusMessage.textContent = "Supabase could not load. Check your connection and refresh.";
        return;
    }

    const { data, error } = await client.auth.getSession();
    if (error) {
        statusMessage.textContent = `Could not check your sign-in: ${error.message}`;
        return;
    }
    if (!data.session?.user) {
        statusMessage.textContent = "Sign in with the owner account to open store controls.";
        denied.hidden = false;
        return;
    }

    const { data: profile, error: profileError } = await client
        .from("profiles")
        .select("role")
        .eq("id", data.session.user.id)
        .single();

    if (profileError) {
        statusMessage.textContent = `Could not verify owner access: ${profileError.message}`;
        return;
    }
    if (profile.role !== "owner") {
        statusMessage.textContent = "This account does not have owner access.";
        denied.hidden = false;
        return;
    }

    try {
        statusMessage.textContent = `Signed in as ${data.session.user.email}`;
        await Promise.all([loadCustomers(), loadProducts(), loadOrders(), loadSettings()]);
        dashboard.hidden = false;
    } catch (error) {
        statusMessage.textContent = `Could not load the dashboard: ${error.message}`;
    }
}

initAdmin();
