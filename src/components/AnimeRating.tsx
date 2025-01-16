"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Loader2 } from "lucide-react";
import { getUserRating, submitRating } from "@/actions/ratings";
import { useUser } from "@clerk/nextjs";

interface RatingData {
  plot: number;
  animation: number;
  characters: number;
  dialogues: number;
  soundtrack: number;
}

interface RatingCategory {
  name: string;
  key: keyof RatingData;
  description: string;
}

const RATING_CATEGORIES: RatingCategory[] = [
  {
    name: "Trama",
    key: "plot",
    description: "Sviluppo della storia e narrativa",
  },
  {
    name: "Animazione",
    key: "animation",
    description: "Qualità visiva e fluidità",
  },
  {
    name: "Personaggi",
    key: "characters",
    description: "Sviluppo e profondità dei personaggi",
  },
  {
    name: "Dialoghi",
    key: "dialogues",
    description: "Qualità e naturalezza dei dialoghi",
  },
  {
    name: "Sonoro",
    key: "soundtrack",
    description: "Colonna sonora e effetti audio",
  },
];

interface AnimeRatingProps {
  animeId: number;
}

export default function AnimeRating({ animeId }: AnimeRatingProps) {
  const user = useUser();
  const [ratings, setRatings] = useState<Partial<RatingData>>({});
  const [hoveredRatings, setHoveredRatings] = useState<Partial<RatingData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [overallRating, setOverallRating] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const loadExistingRating = async () => {
      try {
        const userRating = await getUserRating(animeId);
        if (userRating) {
          const ratingData: Partial<RatingData> = {
            plot: userRating.plot,
            animation: userRating.animation,
            characters: userRating.characters,
            dialogues: userRating.dialogues,
            soundtrack: userRating.soundtrack,
          };
          setRatings(ratingData);
        }
      } catch (error) {
        console.error("Error loading rating:", error);
        setError("Errore nel caricamento della votazione");
      }
      setIsLoading(false);
    };

    loadExistingRating();
  }, [animeId]);

  const handleRatingHover = (category: keyof RatingData, rating: number) => {
    setHoveredRatings((prev) => ({ ...prev, [category]: rating }));
  };

  const handleRatingClick = (category: keyof RatingData, rating: number) => {
    setRatings((prev) => ({ ...prev, [category]: rating }));
    setHoveredRatings((prev) => ({ ...prev, [category]: 0 }));
    setError(null);
  };

  const handleSubmit = async () => {
    const isComplete = RATING_CATEGORIES.every(
      (category) => ratings[category.key] !== undefined
    );

    if (!user.isSignedIn) {
      setError("Devi effettuare l'accesso per votare");
      return;
    }

    if (!isComplete) {
      setError("Devi votare tutte le categorie");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Otteniamo i dati dell'anime dal server (aggiungi questa funzione nelle tue actions)
      const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
      const { data: animeData } = await response.json();

      if (!animeData) {
        throw new Error("Impossibile recuperare i dati dell'anime");
      }

      const result = await submitRating(animeData, ratings as RatingData);
      console.log(result);

      if ("error" in result) {
        setError("Errore sconosciuto");
      } else {
        // Opzionale: mostra un messaggio di successo
        console.log("Votazione salvata con successo");
        setSuccess("Votazione salvata con successo");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      setError("Errore nel salvare la votazione");
    }

    setIsSubmitting(false);
  };

  const handleClassColor = () => {
    if (overallRating < 5) return "text-red-500";
    if (overallRating < 7) return "text-yellow-500";
    if (overallRating === 10) return "text-violet-500";
    return "text-green-500";
  };

  useEffect(() => {
    const overallRatingValue = () => {
      const values = Object.values(ratings);
      if (values.length === 0) {
        setOverallRating(0);
        return;
      }
      const totalRatings = values.reduce((acc, rating) => acc + rating, 0);
      const result = Number(
        (totalRatings / RATING_CATEGORIES.length).toFixed(1)
      );
      setOverallRating(result);
    };

    overallRatingValue();
  }, [ratings]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>La tua valutazione</CardTitle>
      </CardHeader>
      <CardContent>
        {success && (
          <div className="mb-4 p-2 bg-green-100 text-green-600 rounded">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}
        <div className="space-y-4">
          {RATING_CATEGORIES.map((category) => (
            <div key={category.key} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{category.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
                <div className="flex gap-1">
                  {[...Array(10)].map((_, i) => {
                    const currentRating = ratings[category.key] || 0;
                    const isHovered = (hoveredRatings[category.key] || 0) > i;
                    const isRated = currentRating > i;
                    const shouldFill = isHovered || isRated;

                    return (
                      <div
                        className="text-center text-gray-400 font-extralight"
                        key={i}
                      >
                        <Star
                          className={`h-6 w-6 cursor-pointer transition-colors ${
                            shouldFill
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                          onMouseEnter={() =>
                            handleRatingHover(category.key, i + 1)
                          }
                          onMouseLeave={() =>
                            handleRatingHover(category.key, 0)
                          }
                          onClick={() => handleRatingClick(category.key, i + 1)}
                        />
                        <p>{i + 1}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <div className="text-center flex gap-3 items-center rounded-md px-4 py-2">
            <h3 className="font-semibold">VOTO COMPLESSIVO:</h3>
            <p className={`font-bold text-xl ${handleClassColor()}`}>
              {overallRating}
            </p>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="mt-4"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Salva votazione
          </Button>
          <Button
            size="lg"
            variant="destructive"
            onClick={() => setRatings({})}
            disabled={isSubmitting}
            className="mt-4"
          >
            Annulla votazione
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
