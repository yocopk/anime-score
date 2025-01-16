"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface AnimeRecommendation {
  mal_id: string;
  content: string;
  entry: [
    {
      mal_id: number;
      title: string;
      images: {
        jpg: {
          large_image_url: string;
        };
      };
    },
    {
      mal_id: number;
      title: string;
      images: {
        jpg: {
          large_image_url: string;
        };
      };
    }
  ];
}

export default function HomePage() {
  const [recommendations, setRecommendations] = useState<AnimeRecommendation[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchAnimeRecommendations = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          "https://api.jikan.moe/v4/recommendations/anime"
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (Array.isArray(data.data)) {
          setRecommendations(data.data);
        } else {
          throw new Error("Unexpected data format");
        }
      } catch (error) {
        console.error("Failed to fetch anime recommendations:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch recommendations"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimeRecommendations();
  }, []);

  const renderRecommendationCards = () => {
    // Creiamo un Set per tenere traccia degli ID già renderizzati
    const renderedIds = new Set<number>();

    return (
      recommendations
        .flatMap((recommendation) => [
          // Convertiamo la coppia di entry in un array piatto
          {
            ...recommendation.entry[0],
            content: recommendation.content,
          },
          {
            ...recommendation.entry[1],
            content: recommendation.content,
          },
        ])
        // Filtriamo i duplicati basandoci sul mal_id
        .filter((anime) => {
          if (renderedIds.has(anime.mal_id)) {
            return false;
          }
          renderedIds.add(anime.mal_id);
          return true;
        })
        // Limitiamo il numero di anime mostrati (opzionale)
        .slice(0, showMore ? undefined : 12)
        .map((anime) => (
          <div
            key={`anime-${anime.mal_id}`}
            className="bg-slate-500 dark:bg-gray-800 max-h-[200px] rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]"
          >
            <Link href={`/anime/${anime.mal_id}`} className="flex">
              <div className="relative">
                <Image
                  src={
                    anime.images.jpg.large_image_url ||
                    "/api/placeholder/300/200"
                  }
                  alt={anime.title}
                  width={300}
                  height={200}
                  className="object-center object-fit h-full max-w-[150px]"
                />
              </div>
              <div className="">
                <h3 className="text-xl bg-slate-800/70 text-white p-2 font-bold mb-2 dark:text-white line-clamp-2">
                  {anime.title}
                </h3>
                <p className="text-sm px-2 text-white/70 dark:text-gray-300 line-clamp-4">
                  {anime.content}
                </p>
              </div>
            </Link>
          </div>
        ))
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mt-20">
          <h1 className="text-3xl font-bold mb-4 dark:text-white">
            Anime Ratings
          </h1>
          <p className="text-center dark:text-gray-300">
            Welcome to Anime Ratings! This is a simple app to search for anime
            and rate them. You can also see the ratings of other users.
          </p>
          <Button variant="secondary" className="mt-4">
            Get started
          </Button>
        </div>

        <div>
          <h2 className="text-2xl font-bold mt-8 mb-4 dark:text-white">
            Featured Animes
          </h2>

          {isLoading && (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          )}

          {error && <div className="text-red-500 text-center p-4">{error}</div>}

          {!isLoading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 gap-6">
              {renderRecommendationCards()}
            </div>
          )}
        </div>
        {!showMore && (
          <div className="flex justify-center w-full">
            <Button
              variant="secondary"
              onClick={() => setShowMore(true)}
              className="mt-6"
            >
              Mostra di più
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
