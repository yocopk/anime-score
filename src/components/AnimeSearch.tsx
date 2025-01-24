"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { actionSearchAnime } from "@/actions/search";
import debounce from "lodash/debounce";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  year: number;
  score: number;
}

export default function AnimeSearch() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Anime[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);
  // const { user, isLoaded } = useUser();
  const searchRef = React.useRef<HTMLDivElement>(null);

  // React.useEffect(() => {
  //   if (user && isLoaded) {
  //     const email = user.emailAddresses[0].emailAddress;

  //     if (email) {
  //       const handleSync = async () => await actionSyncUser(email);
  //       const result = handleSync();
  //       console.log(result);
  //     }
  //   }
  // }, [isLoaded, user]);

  // Creiamo una versione debounced della funzione di ricerca
  const debouncedSearch = React.useMemo(
    () =>
      debounce(async (searchQuery: string) => {
        if (searchQuery.length < 3) {
          setResults([]);
          return;
        }

        setIsLoading(true);
        const response = await actionSearchAnime(searchQuery);
        setIsLoading(false);

        if ("data" in response) {
          setResults(response.data);
        } else {
          setResults([]);
        }
      }, 300),
    []
  );

  // Gestiamo il cambio dell'input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(true);
    debouncedSearch(value);
  };

  const handleAnimeSelect = (animeId: number) => {
    setShowResults(false);
    setQuery("");
    router.push(`/anime/${animeId}`);
  };

  // Aggiungiamo l'event listener per il click fuori
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-custom-secondary" />
        <Input
          placeholder="Cerca un anime..."
          value={query}
          onChange={handleInputChange}
          className="pl-8 text-custom-secondary bg-custom-foreground !ring-0 !border-0"
          onFocus={() => setShowResults(true)}
        />
      </div>

      {/* Risultati della ricerca */}
      {showResults && (query.length >= 3 || results.length > 0) && (
        <Card className="absolute mt-1 w-full max-h-96 min-w-64 overflow-y-auto z-50">
          <div className="p-2">
            {isLoading ? (
              <p className="text-sm text-muted-foreground p-2">
                Ricerca in corso...
              </p>
            ) : results.length > 0 ? (
              results.map((anime) => (
                <div
                  key={anime.mal_id}
                  className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                  onClick={() => handleAnimeSelect(anime.mal_id)}
                >
                  <Image
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    width={48}
                    height={72}
                    className="h-12 w-8 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{anime.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {anime.year ? `Anno: ${anime.year} • ` : ""}
                      {anime.score ? `Voto: ${anime.score}` : ""}
                    </p>
                  </div>
                </div>
              ))
            ) : query.length >= 3 ? (
              <p className="text-sm text-muted-foreground p-2">
                Nessun risultato trovato
              </p>
            ) : null}
          </div>
        </Card>
      )}
    </div>
  );
}
