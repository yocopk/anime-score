"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import AnimeCard from "@/components/AnimeCard";
import { BookHeart } from "lucide-react";

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
          <AnimeCard key={anime.mal_id} anime={anime} variant="featured" />
        ))
    );
  };

  return (
    <div className="container mx-auto p-2 md:p-4">
      <div className="max-w-6xl mx-auto mt-20">
        <div className="bg-custom-foreground/80 rounded-xl p-5">
          <div className="flex items-center justify-center gap-3 mb-5 py-3">
            <div className="flex items-center text-custom-secondary gap-2">
              <BookHeart />
              <h2 className="text-2xl font-bold">Anime in evidenza</h2>
            </div>
          </div>
          {showMore && (
            <Button
              className="text-center w-full text-custom-destructive"
              variant="link"
              onClick={() => setShowMore(false)}
            >
              Mostra meno
            </Button>
          )}

          {isLoading && (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-accent"></div>
            </div>
          )}

          {error && <div className="text-red-500 text-center p-4">{error}</div>}

          {!isLoading && !error && (
            <div className="flex flex-col md:grid md:grid-cols-4 lg:grid-cols-3 gap-6">
              {renderRecommendationCards()}
            </div>
          )}
          {!showMore && (
            <div className="flex justify-center w-full">
              <Button
                variant="link"
                onClick={() => setShowMore(true)}
                className="mt-6 text-custom-destructive"
              >
                Mostra di più
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
