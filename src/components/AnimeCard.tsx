import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export interface AnimeData {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  synopsis?: string;
  content?: string;
  genres?: Array<{ mal_id: number; name: string }>;
}

interface AnimeCardProps {
  anime: AnimeData;
  variant?: "featured" | "archive";
}

export default function AnimeCard({
  anime,
  variant = "archive",
}: AnimeCardProps) {
  if (variant === "featured") {
    return (
      <Link href={`/anime/${anime.mal_id}`} className="block">
        <Card className="bg-custom-background overflow-hidden transition-all duration-300 hover:shadow-lg hover:bg-custom-foreground !border-0 !ring-0">
          <div className="flex">
            <div className="w-1/3 min-w-[120px]">
              <div className="relative aspect-[2/3] h-full">
                <Image
                  src={
                    anime.images.jpg.large_image_url ||
                    "/placeholder.svg?height=300&width=200"
                  }
                  alt={anime.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <CardContent className="w-2/3 p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-custom-primary mb-2 line-clamp-2">
                  {anime.title}
                </h3>
                <p className="text-sm text-custom-secondary/50 line-clamp-3">
                  {anime.content}
                </p>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link
      href={`/anime/${anime.mal_id}`}
      target="_blank"
      className="transition-transform min-h-max hover:scale-[1.02]"
    >
      <Card className="border-0 !ring-0 bg-custom-background">
        <CardContent className="p-0">
          <div className="relative h-48">
            <Image
              src={
                anime.images.jpg.large_image_url || "/api/placeholder/400/200"
              }
              alt={anime.title}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
          <div className="p-4">
            <h3 className="font-bold line-clamp-1 text-custom-primary">
              {anime.title}
            </h3>
            {anime.synopsis && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                {anime.synopsis}
              </p>
            )}
            {anime.genres && (
              <div className="flex flex-wrap gap-2 mt-2">
                {anime.genres.slice(0, 3).map((genre) => (
                  <span
                    key={genre.mal_id}
                    className="text-xs bg-custom-secondary dark:bg-slate-700 rounded-full px-2 py-1"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
