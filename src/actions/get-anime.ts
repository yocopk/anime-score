// app/actions.ts
"use server";

// ... il tuo actionSearchAnime esistente ...

export async function getAnimeDetails(id: number) {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
    const data = await response.json();

    if (!data.data) {
      return { error: "Anime non trovato" };
    }

    return { data: data.data };
  } catch (error) {
    console.error("Error fetching anime details:", error);
    return { error: "Failed to fetch anime details" };
  }
}
