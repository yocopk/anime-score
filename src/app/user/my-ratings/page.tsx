"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { actionDeleteRating, getAllUserRatings } from "@/actions/ratings";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Clipboard } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Rating = {
  id: string;
  animeId: string;
  plot: number;
  animation: number;
  characters: number;
  dialogues: number;
  soundtrack: number;
  overall: number;
  anime: {
    title: string;
    year: number;
    coverImage: string;
  };
};

type SortOption = "recent-added" | "alphabetical" | "year" | "overall-score";

export default function MyRatingsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("recent-added");
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (!user) return;

    const username =
      user.emailAddresses[0]?.emailAddress.split("@")[0] || "Utente";
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}/user/${username}`;

    try {
      await navigator.clipboard.writeText(fullUrl);
      console.log("Link copiato: ", fullUrl);
      setIsCopied(true);
    } catch {
      console.error("Impossibile copiare il link.");
      setIsCopied(false);
    }
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  useEffect(() => {
    // if (isLoaded && !user) {
    //   router.push("/");
    //   return;
    // }

    const fetchRatings = async () => {
      try {
        const result = await getAllUserRatings();
        setRatings(result || []);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchRatings();
    }
  }, [user, isLoaded, router]);

  const getSortedRatings = () => {
    const ratingsCopy = [...ratings];

    switch (sortBy) {
      case "recent-added":
        return ratingsCopy.sort(
          (a, b) => new Date(b.id).getTime() - new Date(a.id).getTime()
        );
      case "alphabetical":
        return ratingsCopy.sort((a, b) =>
          a.anime.title.localeCompare(b.anime.title)
        );
      case "year":
        return ratingsCopy.sort((a, b) => b.anime.year - a.anime.year);
      case "overall-score":
        return ratingsCopy.sort((a, b) => b.overall - a.overall);
      default:
        return ratingsCopy;
    }
  };

  const username =
    user?.emailAddresses?.[0]?.emailAddress.split("@")[0] || "Utente";

  const handleDeleteRating = async (animeId: string) => {
    const result = await actionDeleteRating(animeId);
    if (!result.error) {
      setRatings(ratings.filter((rating) => rating.animeId !== animeId));
    }
  };

  if (!isLoaded || (isLoading && user)) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-accent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center pt-28">
        <p className="bg-red-300 text-red-700 p-4 rounded">
          Devi accedere per poter usare questa pagina!
        </p>
      </div>
    );
  }

  const sortedRatings = getSortedRatings();

  return (
    <div className="container mx-auto pt-20">
      <div className="max-w-6xl p-2 md:p-4 mx-auto">
        <Card className="mb-8 bg-custom-background text-custom-secondary border-0">
          <CardHeader>
            <CardTitle>Le mie valutazioni</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              {user?.imageUrl && (
                <Image
                  src={user.imageUrl}
                  alt={username}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold truncate">
                    {username.length > 13
                      ? `${username.slice(0, 12)}...`
                      : username}
                  </h2>
                  <div className="relative">
                    <div
                      className="p-2 rounded-full hover:bg-custom-foreground/70 cursor-pointer transition-colors duration-150"
                      onClick={handleCopy}
                    >
                      <Clipboard className="size-4 text-custom-primary" />
                    </div>
                    {isCopied && (
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap transition-all duration-300 fade-in-10">
                        <span className="text-sm text-custom-background bg-custom-primary px-3 py-1.5 rounded-md shadow-sm">
                          Link copiato!
                        </span>
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-custom-primary rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {ratings.length} anime valutati
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <Select
            value={sortBy}
            onValueChange={(value: SortOption) => setSortBy(value)}
          >
            <SelectTrigger className="w-[180px] bg-custom-secondary !border-0 !ring-0 hover:bg-custom-secondary">
              <SelectValue placeholder="Ordina per" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem value="recent-added">Recenti</SelectItem>
              <SelectItem value="alphabetical">Ordine A-Z</SelectItem>
              <SelectItem value="year">Anno</SelectItem>
              <SelectItem value="overall-score">Punteggio</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedRatings.map((rating) => (
            <div key={rating.id}>
              <Card className="bg-custom-background border-0">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative h-[150px] w-[100px] flex-shrink-0">
                      <Link
                        href={`/anime/${rating.animeId.replace("mal_", "")}`}
                      >
                        <Image
                          src={rating.anime.coverImage}
                          alt={rating.anime.title}
                          fill
                          className="object-cover rounded-md"
                          sizes="100px"
                        />
                      </Link>
                    </div>
                    <div className="flex-grow text-custom-secondary">
                      <Link
                        className="flex items-center gap-2 mb-2"
                        href={`/anime/${rating.animeId.replace("mal_", "")}`}
                      >
                        <h3 className="font-bold text-custom-primary line-clamp-2">
                          {rating.anime.title}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {rating.anime.year}
                        </p>
                      </Link>
                      <div className="flex flex-col md:grid grid-cols-2 gap-1 text-xs md:text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="size-3 md:size-4 fill-custom-accent text-custom-accent" />
                          <span>Trama: {rating.plot}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="size-3 md:size-4 fill-custom-accent text-custom-accent" />
                          <span>Animazione: {rating.animation}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="size-3 md:size-4 fill-custom-accent text-custom-accent" />
                          <span>Personaggi: {rating.characters}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="size-3 md:size-4 fill-custom-accent text-custom-accent" />
                          <span>Dialoghi: {rating.dialogues}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="size-3 md:size-4 fill-custom-accent text-custom-accent" />
                          <span>Sonoro: {rating.soundtrack}</span>
                        </div>
                        <div className="flex items-center gap-1 font-bold">
                          <Star className="size-3 md:size-4 fill-custom-primary text-custom-primary" />
                          <span>Totale: {rating.overall.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <Link
                          href={`/anime/${rating.animeId.replace("mal_", "")}`}
                        >
                          <Button
                            size="sm"
                            className="text-custom-secondary"
                            variant="customPrimary"
                          >
                            <Pencil className="size-4" />
                            Modifica
                          </Button>
                        </Link>
                        <Button
                          onClick={() => handleDeleteRating(rating.animeId)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="size-4" />
                          Elimina
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {ratings.length === 0 && (
          <Card className="bg-custom-background border-0">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                Non hai ancora valutato nessun anime.
              </p>
              <Link
                href="/"
                className="text-custom-primary hover:underline mt-2 inline-block"
              >
                Inizia a cercare anime da valutare
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
