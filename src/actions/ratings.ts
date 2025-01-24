"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface AnimeData {
  mal_id: number;
  title: string;
  synopsis: string;
  year: number | null;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
}

interface RatingData {
  plot: number;
  animation: number;
  characters: number;
  dialogues: number;
  soundtrack: number;
}

async function findOrCreateAnime(animeData: AnimeData) {
  const animeId = `mal_${animeData.mal_id}`;

  try {
    // Assicuriamoci che year sia un numero valido o defaulti a un valore
    const year = animeData?.year || new Date().getFullYear();

    const anime = await db.anime.upsert({
      where: {
        id: animeId,
      },
      update: {
        title: animeData.title,
        description: animeData.synopsis || "",
        coverImage: animeData.images?.jpg?.large_image_url || "",
        year: year,
      },
      create: {
        id: animeId,
        title: animeData.title,
        description: animeData.synopsis || "",
        coverImage: animeData.images?.jpg?.large_image_url || "",
        year: year,
      },
    });

    return anime;
  } catch (error) {
    console.error("Error in findOrCreateAnime:", error);
    throw new Error("Failed to create or update anime");
  }
}

async function findOrCreateUser(userId: string, email: string) {
  try {
    // Prima cerchiamo l'utente per ID
    let user = await db.user.findUnique({
      where: { id: userId },
    });

    // Se non troviamo l'utente per ID, cerchiamo per email
    if (!user) {
      user = await db.user.findUnique({
        where: { email: email },
      });

      // Se troviamo l'utente per email ma ha un ID diverso, aggiorniamo l'ID
      if (user) {
        user = await db.user.update({
          where: { email: email },
          data: { id: userId },
        });
      } else {
        // Se non troviamo l'utente né per ID né per email, lo creiamo
        user = await db.user.create({
          data: {
            id: userId,
            email: email,
          },
        });
      }
    }

    return user;
  } catch (error) {
    console.error("Error in findOrCreateUser:", error);
    throw new Error("Failed to handle user data");
  }
}

export async function submitRating(animeData: AnimeData, ratings: RatingData) {
  try {
    if (!animeData?.mal_id) {
      console.error("Invalid anime data:", animeData);
      return { error: "Dati anime non validi" };
    }

    if (!ratings || Object.values(ratings).some((r) => !r || r < 1 || r > 10)) {
      console.error("Invalid ratings:", ratings);
      return { error: "Valutazioni non valide" };
    }

    const user = await currentUser();

    if (!user?.id || !user.emailAddresses?.[0]?.emailAddress) {
      console.error("User not authenticated");
      return { error: "Devi essere loggato per votare" };
    }

    const anime = await findOrCreateAnime(animeData);
    const dbUser = await findOrCreateUser(
      user.id,
      user.emailAddresses[0].emailAddress
    );

    const overall = Number(
      (
        Object.values(ratings).reduce((a, b) => a + b, 0) /
        Object.values(ratings).length
      ).toFixed(1)
    );

    const ratingId = `${dbUser.id}_${anime.id}`;

    const rating = await db.rating.upsert({
      where: {
        id: ratingId,
      },
      update: {
        plot: ratings.plot,
        animation: ratings.animation,
        characters: ratings.characters,
        dialogues: ratings.dialogues,
        soundtrack: ratings.soundtrack,
        overall,
        updatedAt: new Date(),
      },
      create: {
        id: ratingId,
        userId: dbUser.id,
        animeId: anime.id,
        plot: ratings.plot,
        animation: ratings.animation,
        characters: ratings.characters,
        dialogues: ratings.dialogues,
        soundtrack: ratings.soundtrack,
        overall,
      },
    });

    revalidatePath(`/anime/${animeData.mal_id}`);
    return { data: rating };
  } catch (error) {
    console.error("Detailed Error in submitRating:", error);
    console.error("Anime Data:", animeData);
    console.error("Ratings:", ratings);
    return {
      error:
        error instanceof Error
          ? `Errore specifico: ${error.message}`
          : "Errore nel salvataggio della votazione",
    };
  }
}

export async function getUserRating(animeId: number) {
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const rating = await db.rating.findFirst({
      where: {
        userId: user.id,
        animeId: `mal_${animeId}`,
      },
    });

    return rating;
  } catch (error) {
    console.error("Error in getUserRating:", error);
    return null;
  }
}

export async function getAllUserRatings() {
  try {
    const user = await currentUser();

    if (!user) {
      return null;
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

    return ratings;
  } catch (error) {
    console.error("Error in getAllUserRatings:", error);
    return null;
  }
}

export async function actionDeleteRating(animeId: string) {
  try {
    const user = await currentUser();

    if (!user) {
      return { error: "Devi essere loggato per eliminare la votazione" };
    }

    await db.rating.delete({
      where: {
        id: `${user.id}_${animeId}`,
      },
    });

    revalidatePath("/user/my-ratings");
    return { success: true };
  } catch (error) {
    console.error("Error in actionDeleteRating:", error);
    return { error: "Errore durante l'eliminazione della votazione" };
  }
}
