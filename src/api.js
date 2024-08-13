import fetch from 'node-fetch';

const STEAM_API_URL = "https://steam-api7.p.rapidapi.com/appDetails/271590";  // Replace with actual Steam API endpoint

export const fetchSteamData = async () => {
  try {
    const response = await fetch(STEAM_API_URL);
    const data = await response.json();

    // Transform data to match the product structure
    const products = data.items.map((item, index) => ({
      id: `p${index + 1}`,
      name: item.name,
      description: item.short_description,
      price: item.price_overview ? item.price_overview.final : 0,
      discontinued: false,
      categories: ["c1"],  // Assign to appropriate categories
    }));

    return products;
  } catch (error) {
    console.error("Error fetching data from Steam API:", error);
    return [];
  }
};
