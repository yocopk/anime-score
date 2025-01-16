import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import AnimeSearch from "./AnimeSearch";

export default function Navbar() {
  return (
    <div className="container mx-auto flex justify-between items-center fixed bg-gray-800/70 p-4 text-white z-10">
      <h1 className="text-2xl font-bold">Anime Ratings</h1>
      <AnimeSearch />
      <div className="flex gap-4 items-center font-bold">
        <Link className="hover:text-slate-400" href="/">
          Home
        </Link>
        <Link className="hover:text-slate-400" href="/anime">
          Anime
        </Link>
        <Link className="hover:text-slate-400" href="/user/my-ratings">
          My Ratings
        </Link>
        <ClerkProvider>
          <SignedOut>
            <SignInButton>
              <Button>Accedi</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </ClerkProvider>
      </div>
    </div>
  );
}
