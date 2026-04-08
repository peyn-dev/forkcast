const fetch = require("node-fetch");

const YELP_API_KEY =
  process.env.YELP_API_KEY ||
  "PPRf7UAr9AALGc9UKoyciKrG9fIeTEOle7pPnvWHrBP56Ob06oqdE-C_yjTsuBVfLOTnovyQlHv0SliIygUcQuIVUytp0Qsje9R9ojj4kdeLDL8CcVQa4jiJQ2HUaXYx";

const YELP_BASE_URL = "https://api.yelp.com/v3";

/**
 * Fetches raw restaurant data from Yelp API.
 * @param {string} city
 * @param {number} limit
 * @param {number} offset
 * @returns {Promise<Object>} Raw Yelp API response
 */
const searchRestaurants = async (city, limit = 20, offset = 0) => {
  const params = new URLSearchParams({
    term: "restaurants",
    location: city.trim(),
    limit,
    radius: 8000,
    sort_by: "rating",
  });

  if (offset > 0) {
    params.append("offset", offset.toString());
  }

  const response = await fetch(`${YELP_BASE_URL}/businesses/search?${params}`, {
    headers: {
      Authorization: `Bearer ${YELP_API_KEY}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errData = await response.json();
    const error = new Error(errData.error?.description || "Yelp API error.");
    error.status = response.status;
    throw error;
  }

  return await response.json();
};

/**
 * Transforms raw Yelp business data into a clean format for the frontend.
 * @param {Array} businesses
 * @returns {Array} Formatted restaurant objects
 */
const formatRestaurants = (businesses) =>
  businesses.map((biz) => ({
    id: biz.id,
    name: biz.name,
    rating: biz.rating || null,
    review_count: biz.review_count || null,
    price: biz.price || null,
    address:
      biz.location?.display_address?.join(", ") || "Address not available",
    coordinates: {
      lat: biz.coordinates?.latitude ?? null,
      lng: biz.coordinates?.longitude ?? null,
    },
    categories: biz.categories?.map((c) => c.title).join(", ") || "",
    image_url: biz.image_url || null,
    url: biz.url || null,
    is_closed: biz.is_closed,
    phone: biz.display_phone || null,
  }));

/**
 * Fetches all restaurants for a city by making multiple API calls if needed.
 * @param {string} city
 * @returns {Promise<Object>} Combined results
 */
const searchAllRestaurants = async (city) => {
  console.log(`Starting searchAllRestaurants for city: ${city}`);

  // First, get the total count with a small limit
  const firstData = await searchRestaurants(city, 1, 0);
  const total = firstData.total;

  console.log(`Total restaurants found: ${total}`);

  if (
    total === 0 ||
    !firstData.businesses ||
    firstData.businesses.length === 0
  ) {
    console.log("No restaurants found");
    return { businesses: [], total: 0 };
  }

  // If total is small, just fetch all at once
  if (total <= 50) {
    console.log("Fetching all at once since total <= 50");
    return await searchRestaurants(city, 50, 0);
  }

  // Otherwise, fetch in batches
  const allBusinesses = [];
  let offset = 0;
  const limit = 50;

  console.log(`Fetching in batches. Total: ${total}`);

  while (offset < total && allBusinesses.length < 1000) {
    console.log(`Fetching batch: offset=${offset}, limit=${limit}`);
    const data = await searchRestaurants(city, limit, offset);
    allBusinesses.push(...data.businesses);
    console.log(
      `Batch returned ${data.businesses.length} results. Total so far: ${allBusinesses.length}`,
    );
    offset += limit;
  }

  console.log(`Finished fetching. Total results: ${allBusinesses.length}`);

  return {
    businesses: allBusinesses,
    total: total,
  };
};

module.exports = { searchRestaurants, searchAllRestaurants, formatRestaurants };
