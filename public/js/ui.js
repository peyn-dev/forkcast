/**
 * ui.js — View layer
 * Responsible only for rendering UI. No business logic or API calls here.
 */
const UI = {
  appEl: null,

  init() {
    this.appEl = document.getElementById("app");
  },

  showLoading() {
    this.appEl.innerHTML = `
      <div class="spinner-wrap">
        <div class="spinner"></div>
      </div>`;
  },

  showError(msg) {
    this.appEl.innerHTML = `
      <div class="error-box">
        <span>⚠️</span>
        <div>${msg}</div>
      </div>`;
  },

  showEmpty(city) {
    this.appEl.innerHTML = `
      <div class="state-box">
        <div class="icon">🔍</div>
        <h3>No results</h3>
        <p>No restaurants found in <strong>${this._esc(city)}</strong>. Try a different city name.</p>
      </div>`;
  },

  showResults(data, city) {
    if (!data.results || data.results.length === 0) {
      return this.showEmpty(city);
    }

    const cards = data.results.map((r, i) => this._buildCard(r, i)).join("");

    this.appEl.innerHTML = `
      <div class="results-header">
        <h2>Restaurants in ${this._esc(city)}</h2>
        <span class="count">Showing results within a 5-mile radius.</span>
      </div>
      <div class="grid">${cards}</div>`;
  },

  // --- Private helpers ---

  _buildCard(r, i) {
    const img = r.image_url || "";
    const statusClass = r.is_closed ? "closed" : "open";
    const statusText = r.is_closed ? "CLOSED" : "OPEN";

    const lat = r.coordinates?.latitude ?? r.coordinates?.lat;
    const lng = r.coordinates?.longitude ?? r.coordinates?.lng;

    return `
    <article class="card modern" style="animation-delay:${i * 0.04}s">
      
      <!-- IMAGE -->
      <div class="card-img">
        ${
          img
            ? `<img src="${img}" alt="${this._esc(r.name)}" />`
            : `<div class="no-img">🍴</div>`
        }

      
      </div>

      <!-- BODY -->
      <div class="card-body">

     

        <h3 class="title">${this._esc(r.name)}</h3>

        <div class="rating">
          <span class="stars">${this._starIcons(r.rating)}</span>
          <span class="rating-num">${r.rating ?? "N/A"}</span>
          <span class="reviews">(${r.review_count ?? 0} reviews)</span>
        </div>

        <div class="address">
        <svg class="icon" viewBox="0 0 24 24" width="16" height="16" fill="none">
          <path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10z" stroke="currentColor" stroke-width="1.8"/>
          <circle cx="12" cy="11" r="2.5" stroke="currentColor" stroke-width="1.8"/>
        </svg>
           ${this._esc(r.address)}
        </div>

        <div class="coords">
          <span>LAT ${lat ? lat.toFixed(6) : "N/A"}</span>
          <span>LNG ${lng ? lng.toFixed(6) : "N/A"}</span>
        </div>

   
      </div>
    </article>
  `;
  },

  _starIcons(rating) {
    if (!rating) return "☆☆☆☆☆";
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
  },

  _esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  },
};
