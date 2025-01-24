import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AnimeCard from "@/components/AnimeCard";

interface Anime {
  mal_id: number;
  title: string;
  title_english?: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  content?: string;
  rank?: number;
  score?: number;
}

interface AnimeCollectionProps {
  fetchFunction: () => Promise<Anime[]>;
  title: string;
  icon: React.ReactNode;
}

const AnimeCollection: React.FC<AnimeCollectionProps> = ({
  fetchFunction,
  title,
  icon,
}) => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        setIsLoading(true);
        const data = await fetchFunction();
        setAnimes(data);
      } catch (error) {
        console.error(`Failed to fetch ${title}:`, error);
        setError(
          error instanceof Error ? error.message : `Failed to fetch ${title}`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimes();
  }, [fetchFunction, title]);

  const renderAnimeCards = () => {
    const renderedIds = new Set<number>();

    return animes
      .filter((anime) => {
        if (renderedIds.has(anime.mal_id)) {
          return false;
        }
        renderedIds.add(anime.mal_id);
        return true;
      })
      .slice(0, showMore ? undefined : 12)
      .map((anime) => (
        <AnimeCard key={anime.mal_id} anime={anime} variant="featured" />
      ));
  };

  return (
    <div className="container mx-auto p-2 md:p-4">
      <div className="max-w-6xl mx-auto mt-20">
        <div className="bg-custom-foreground/80 rounded-xl p-5">
          <div className="flex items-center justify-center gap-3 mb-5 py-3">
            <div className="flex items-center text-custom-secondary gap-2">
              {icon}
              <h2 className="text-2xl font-bold">{title}</h2>
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
            <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
              {renderAnimeCards()}
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
};

export default AnimeCollection;
