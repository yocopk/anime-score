"use server";

export async function actionSearchAnime(query: string) {
  if (!query) {
    return { error: "Query is required" };
  }

  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return { error: "No results found" };
    }

    return { data: data.data };
  } catch (error) {
    console.error("Error fetching anime:", error);
    return { error: "Failed to fetch anime data" };
  }
}
