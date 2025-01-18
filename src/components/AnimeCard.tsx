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
      <div className="bg-custom-background max-h-[200px] rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
        <Link href={`/anime/${anime.mal_id}`} className="flex">
          <div className="relative">
            <Image
              src={
                anime.images.jpg.large_image_url || "/api/placeholder/300/200"
              }
              alt={anime.title}
              width={300}
              height={200}
              className="object-center object-fit h-full max-w-[150px]"
            />
          </div>
          <div className="p-4">
            <h3 className="text-xl text-custom-primary font-bold mb-2 line-clamp-2">
              {anime.title}
            </h3>
            <p className="text-sm text-white/70 dark:text-gray-300 line-clamp-4">
              {anime.content}
            </p>
          </div>
        </Link>
      </div>
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
