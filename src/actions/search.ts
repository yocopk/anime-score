"use server";
import { db } from "@/lib/prisma";

export async function actionSearchAnime(query: string) {
  if (!query) {
    return { error: "Query is required" };
  }

  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return { error: "No results found" };
    }

    return { data: data.data };
  } catch (error) {
    console.error("Error fetching anime:", error);
    return { error: "Failed to fetch anime data" };
  }
}

export async function searchUsers(query: string) {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const users = await db.user.findMany({
      where: {
        email: {
          contains: query,
        },
      },
      select: {
        id: true,
        email: true,
        _count: {
          select: {
            ratings: true,
          },
        },
      },
      take: 10, // Limitiamo i risultati a 10 per performance
    });

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      totalRatings: user._count.ratings,
    }));
  } catch (error) {
    console.error("Error searching users:", error);
    throw new Error("Failed to search users");
  }
}
