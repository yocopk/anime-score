// app/user/[username]/page.tsx
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import { Star } from "lucide-react";

interface Props {
  params: {
    username: string;
  };
}

export default async function UserProfilePage({ params }: Props) {
  // Decodifica lo username dall'URL (potrebbe contenere caratteri speciali)
  const username = decodeURIComponent(params.username);

  // Cerca l'utente per email (username + qualsiasi dominio)
  const user = await db.user.findFirst({
    where: {
      email: {
        startsWith: username + "@",
      },
    },
  });

  if (!user) {
    notFound();
  }

  const ratings = await db.rating.findMany({
    where: {
      userId: user.id,
    },
    include: {
      anime: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="container mx-auto p-4 pt-20">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-8 bg-custom-background border-0 text-custom-secondary">
          <CardContent className="pt-5">
            <div className="flex items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">{username}</h2>
                <p className="text-muted-foreground">
                  {ratings.length} anime valutati
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ratings.map((rating) => (
            <Link
              href={`/anime/${rating.animeId.replace("mal_", "")}`}
              key={rating.id}
            >
              <Card className="bg-custom-secondary transition-transform hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative h-[150px] w-[100px] flex-shrink-0">
                      <Image
                        src={rating.anime.coverImage}
                        alt={rating.anime.title}
                        fill
                        className="object-cover rounded-md"
                        sizes="100px"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold mb-2">{rating.anime.title}</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-custom-accent text-custom-accent" />
                          <span>Trama: {rating.plot.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-custom-accent text-custom-accent" />
                          <span>Animazione: {rating.animation.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-custom-accent text-custom-accent" />
                          <span>
                            Personaggi: {rating.characters.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-custom-accent text-custom-accent" />
                          <span>Dialoghi: {rating.dialogues.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-custom-accent text-custom-accent" />
                          <span>Sonoro: {rating.soundtrack.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1 font-bold">
                          <Star className="h-4 w-4 fill-custom-primary text-custom-primary" />
                          <span>Totale: {rating.overall.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {ratings.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                Questo utente non ha ancora valutato nessun anime.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
