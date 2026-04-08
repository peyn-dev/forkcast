/**
 * api.js — Service layer
 * Responsible only for communicating with the backend API.
 */
const RestaurantAPI = {
  /**
   * Fetches restaurants from the backend for a given city.
   * @param {string} city
   * @param {number} limit
   * @returns {Promise<Object>} { city, total, results }
   */
  search: async (city, limit) => {
    const res = await fetch(
      `/api/restaurants?city=${encodeURIComponent(city)}&limit=${limit}`
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong.");
    return data;
  },
};
