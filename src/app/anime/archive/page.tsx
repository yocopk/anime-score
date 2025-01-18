"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListFilter, Loader2 } from "lucide-react";
import AnimeCard from "@/components/AnimeCard";

interface Anime {
  mal_id: number;
  title: string;
  genres: Array<{ mal_id: number; name: string }>;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  synopsis: string;
}

interface Genre {
  mal_id: number;
  name: string;
}

export default function AnimeArchivePage() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalResults, setTotalResults] = useState(0);

  // Fetch genres on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("https://api.jikan.moe/v4/genres/anime");
        const data = await response.json();
        setGenres(data.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  // Fetch animes when page, genres, or search changes
  useEffect(() => {
    const fetchAnimes = async () => {
      setIsLoading(true);
      try {
        let url = `https://api.jikan.moe/v4/anime?page=${currentPage}&limit=24`;

        if (selectedGenres.length > 0) {
          url += `&genres=${selectedGenres.join(",")}`;
        }

        if (searchQuery) {
          url += `&q=${encodeURIComponent(searchQuery)}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        setTotalResults(data.pagination.items.total);
        setAnimes(data.data);
        setTotalPages(Math.ceil(data.pagination.items.total / 24));
      } catch (error) {
        console.error("Error fetching animes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Add delay to respect API rate limiting
    const timeoutId = setTimeout(fetchAnimes, 1000);
    return () => clearTimeout(timeoutId);
  }, [currentPage, selectedGenres, searchQuery]);

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 mt-20 bg-custom-background/70 rounded-lg p-5">
        {/* Filters sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <Card className="bg-custom-foreground border-0 text-custom-secondary">
            <CardContent className="p-4">
              <h3 className="font-bold mb-4">Cerca</h3>
              <Input
                placeholder="Cerca anime..."
                value={searchQuery}
                onChange={handleSearch}
                className="mb-4 border-0 !ring-0 bg-custom-background"
              />
              <div className="flex justify-start items-center gap-2 my-5">
                <ListFilter />
                <h3 className="font-bold">Generi</h3>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {genres.map((genre) => (
                  <div
                    key={genre.mal_id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`genre-${genre.mal_id}`}
                      checked={selectedGenres.includes(genre.mal_id)}
                      onCheckedChange={() => handleGenreToggle(genre.mal_id)}
                    />
                    <label
                      htmlFor={`genre-${genre.mal_id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {genre.name}
                    </label>
                  </div>
                ))}
              </div>
              {!isLoading && (
                <div className="text-right mt-3">
                  <span className="bg-custom-primary px-2 py-1 rounded-full">
                    {totalResults}
                  </span>{" "}
                </div>
              )}
              {selectedGenres.length > 0 && (
                <Button
                  variant="customSecondary"
                  className="mt-4 w-full"
                  onClick={() => setSelectedGenres([])}
                >
                  Elimina Filtri
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="flex-1 rounded-xl p-4">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-custom-accent" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {animes.map((anime) => (
                  <AnimeCard
                    key={anime.mal_id}
                    anime={anime}
                    variant="archive"
                  />
                ))}
              </div>

              <Pagination className="mt-8">
                <PaginationContent className="flex justify-between items-center gap-5 text-custom-secondary">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {/* Show current page and total pages */}
                  <PaginationItem>
                    <PaginationLink className="pointer-events-none">
                      {currentPage} / {totalPages}
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem className="">
                    <PaginationNext
                      href="#"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={` ${
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
