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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  year: number;
  status: string;
  type: string;
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

  // Stati per i filtri con valore di default "all"
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSort, setSelectedSort] = useState("all");

  // const years = Array.from({ length: 2024 - 1960 + 1 }, (_, i) => 2024 - i);
  const types = [
    {
      value: "TV",
      label: "Serie",
    },
    {
      value: "Movie",
      label: "Film",
    },
    {
      value: "OVA",
      label: "OVA",
    },
    ,
    {
      value: "Special",
      label: "Speciali",
    },
    {
      value: "ONA",
      label: "ONA",
    },
    {
      value: "Music",
      label: "Musicali",
    },
  ];
  const statuses = [
    { value: "Airing", label: "In corso" },
    { value: "Complete", label: "Conclusi" },
    { value: "Upcoming", label: "In arrivo" },
  ];
  const sortOptions = [
    { value: "title", label: "A-Z" },
    { value: "-title", label: "Z-A" },
    { value: "start_date", label: "Data (Vecchi)" },
    { value: "-start_date", label: "Data (Nuovi)" },
  ];

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

  // Fetch animes when filters change
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
        if (selectedYear !== "all") {
          url += `&start_date=${selectedYear}`;
        }
        if (selectedType !== "all") {
          url += `&type=${selectedType}`;
        }
        if (selectedStatus !== "all") {
          url += `&status=${selectedStatus}`;
        }
        if (selectedSort !== "all") {
          url += `&order_by=${selectedSort.replace(/^-/, "")}&sort=${
            selectedSort.startsWith("-") ? "desc" : "asc"
          }`;
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

    const timeoutId = setTimeout(fetchAnimes, 1000);
    return () => clearTimeout(timeoutId);
  }, [
    currentPage,
    selectedGenres,
    searchQuery,
    selectedYear,
    selectedType,
    selectedStatus,
    selectedSort,
  ]);

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
    setCurrentPage(1);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedGenres([]);
    setSelectedYear("all");
    setSelectedType("all");
    setSelectedStatus("all");
    setSelectedSort("all");
    setSearchQuery("");
    setCurrentPage(1);
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

              {/* Select per i filtri */}

              <div className="flex justify-start items-center gap-2 my-5">
                <ListFilter />
                <h3 className="font-bold">Generi</h3>
              </div>

              <div className="space-y-2 max-h-44 md:max-h-96 overflow-y-auto">
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
                  </span>
                </div>
              )}

              {(selectedGenres.length > 0 ||
                selectedYear !== "all" ||
                selectedType !== "all" ||
                selectedStatus !== "all" ||
                selectedSort !== "all" ||
                searchQuery) && (
                <Button
                  variant="customSecondary"
                  className="mt-4 w-full"
                  onClick={resetFilters}
                >
                  Elimina Filtri
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="flex-1 rounded-xl p-4">
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 mb-6">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-custom-secondary text-custom-background">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i tipi</SelectItem>
                {types.map((el, index) => (
                  <SelectItem key={index} value={el!.value}>
                    {el?.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-custom-secondary text-custom-background">
                <SelectValue placeholder="Stato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli stati</SelectItem>
                {statuses.map((el, index) => (
                  <SelectItem key={index} value={el.value}>
                    {el.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSort} onValueChange={setSelectedSort}>
              <SelectTrigger className="bg-custom-secondary text-custom-background">
                <SelectValue placeholder="Ordina per" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Nessun ordine</SelectItem>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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

                  <PaginationItem>
                    <PaginationLink className="pointer-events-none">
                      {currentPage} / {totalPages}
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
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
