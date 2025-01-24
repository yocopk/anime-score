"use client";
import { BookHeart, TrendingUp } from "lucide-react";
import AnimeCollection from "./(components)/AnimeCollection";

export default function HomePage() {
  const fetchRecommendations = async () => {
    const res = await fetch("https://api.jikan.moe/v4/recommendations/anime");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    //@ts-expect-error data.data is an array
    return data.data.flatMap((recommendation) => [
      {
        ...recommendation.entry[0],
        content: recommendation.content,
      },
      {
        ...recommendation.entry[1],
        content: recommendation.content,
      },
    ]);
  };

  const fetchTopAnime = async () => {
    const res = await fetch("https://api.jikan.moe/v4/top/anime");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    //@ts-expect-error data.data is an array
    return data.data.map((anime) => ({
      ...anime,
      content: anime.synopsis, // Use synopsis as content for top anime
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row container mx-auto">
      <AnimeCollection
        fetchFunction={fetchRecommendations}
        title="Anime in evidenza"
        icon={<BookHeart />}
      />
      <AnimeCollection
        fetchFunction={fetchTopAnime}
        title="Top Anime"
        icon={<TrendingUp />}
      />
    </div>
  );
}
