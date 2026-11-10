(() => {
    const originalView = window.view;
    const originalShowApp = window.showApp;
    const app = document.getElementById("app");
    const loader = document.getElementById("pageLoader");
    const loaderTitle = document.getElementById("loaderTitle");
    if (typeof originalView !== "function" || typeof originalShowApp !== "function" || !app || !loader) throw new Error("MaeKini navigation preview could not initialize.");
    let timer = null;
    let requestId = 0;
    let previewHomeOnEntry = false;
    window.showApp = function (...args) {
        previewHomeOnEntry = true;
        return originalShowApp.apply(this, args);
    };
    window.view = function (viewId, ...args) {
        const destination = document.getElementById(viewId);
        const current = document.querySelector(".view.active");
        const enteringHome = viewId === "home" && previewHomeOnEntry;
        if (enteringHome) previewHomeOnEntry = false;
        if (!destination || app.classList.contains("hidden") || (current === destination && !enteringHome)) return originalView.call(this, viewId, ...args);
        const request = ++requestId;
        window.clearTimeout(timer);
        if (loaderTitle) loaderTitle.textContent = destination.querySelector(".pageHead h2")?.textContent || (viewId === "home" ? "Your MaeKini moment" : "Curating your sunshine");
        loader.classList.remove("hidden");
        loader.setAttribute("aria-hidden", "false");
        app.setAttribute("aria-busy", "true");
        timer = window.setTimeout(() => {
            if (request !== requestId) return;
            app.setAttribute("aria-busy", "false");
            loader.classList.add("hidden");
            loader.setAttribute("aria-hidden", "true");
            originalView.call(this, viewId, ...args);
        }, 2000);
    };
})();
