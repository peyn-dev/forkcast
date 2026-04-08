/**
 * app.js — Controller layer
 * Ties the View (UI) and Service (RestaurantAPI) together.
 * Handles user interactions and orchestrates data flow.
 */
const App = {
  cityInput: null,
  searchBtn: null,
  limitSelect: null,

  init() {
    this.cityInput = document.getElementById("cityInput");
    this.searchBtn = document.getElementById("searchBtn");
    this.limitSelect = document.getElementById("limitSelect");

    UI.init();
    this._bindEvents();
  },

  _bindEvents() {
    this.searchBtn.addEventListener("click", () => this.handleSearch());
    this.cityInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.handleSearch();
    });
  },

  async handleSearch() {
    const city = this.cityInput.value.trim();
    if (!city) return this.cityInput.focus();

    this.searchBtn.disabled = true;
    this.searchBtn.textContent = "Searching...";
    UI.showLoading();

    try {
      const limit = this.limitSelect.value;
      const data = await RestaurantAPI.search(city, limit);
      UI.showResults(data, city);
    } catch (err) {
      UI.showError(err.message);
    } finally {
      this.searchBtn.disabled = false;
      this.searchBtn.textContent = "Search";
    }
  },
};

// Bootstrap the app once DOM is ready
document.addEventListener("DOMContentLoaded", () => App.init());
