// app/user/my-ratings/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { Star } from "lucide-react";

export default async function MyRatingsPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
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

  const username =
    user.emailAddresses[0]?.emailAddress.split("@")[0] || "Utente";

  return (
    <div className="container mx-auto p-4 pt-20">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Le mie valutazioni</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              {user.imageUrl && (
                <Image
                  src={user.imageUrl}
                  alt={username}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              )}
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
              <Card className="hover:bg-accent/50 transition-colors">
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
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>Trama: {rating.plot.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>Animazione: {rating.animation.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>
                            Personaggi: {rating.characters.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>Dialoghi: {rating.dialogues.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>Sonoro: {rating.soundtrack.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1 font-bold">
                          <Star className="h-4 w-4 fill-violet-400 text-violet-400" />
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
                Non hai ancora valutato nessun anime.
              </p>
              <Link
                href="/"
                className="text-primary hover:underline mt-2 inline-block"
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
