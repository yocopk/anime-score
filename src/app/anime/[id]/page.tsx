// app/anime/[id]/page.tsx
import { getAnimeDetails } from "@/actions/get-anime";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AnimeRating from "@/components/AnimeRating";
import HandleDescription from "./(components)/HandleDescription";

export default async function AnimePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const animeId = Number(id);
  const { data: anime, error } = await getAnimeDetails(animeId);

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">{error}</p>
        <Link href="/anime/archive">
          <Button variant="link">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna alla ricerca
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 md:p-4 pt-20">
      <Link href="/anime/archive">
        <Button variant="link" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna alla ricerca
        </Button>
      </Link>
      <div className="max-w-6xl mx-auto flex flex-col gap-2 md:grid grid-cols-2">
        <Card className="bg-custom-background border-0">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative h-[400px] w-full">
                <Image
                  src={anime.images.jpg.large_image_url}
                  alt={anime.title}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
              </div>

              <div className="md:col-span-2">
                <h1 className="text-3xl text-custom-primary font-bold mb-2">
                  {anime.title}
                </h1>
                {anime.title_japanese && (
                  <h2 className="text-xl text-muted-foreground mb-4">
                    {anime.title_japanese}
                  </h2>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6 text-custom-secondary">
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold text-custom-primary">
                      Punteggio
                    </p>
                    <p className="font-medium">{anime.score || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold text-custom-primary">
                      Anno
                    </p>
                    <p className="font-medium">{anime.year || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold text-custom-primary">
                      Episodi
                    </p>
                    <p className="font-medium">{anime.episodes || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold text-custom-primary">
                      Stato
                    </p>
                    <p className="font-medium">{anime.status}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <HandleDescription description={anime.synopsis} />
                </div>

                <div className="flex flex-wrap gap-2">
                  {anime.genres?.map(
                    (genre: { mal_id: number; name: string }) => (
                      <span
                        key={genre.mal_id}
                        className="px-3 py-1 bg-custom-secondary text-custom-background rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <AnimeRating animeId={animeId} />
      </div>
    </div>
  );
}
