"use client";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import AnimeSearch from "./AnimeSearch";
import { useEffect, useState } from "react";
import {
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
} from "./ui/dropdown-menu";
import { Archive, CircleUserRound, House, Menu, Star } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const { userId, isLoaded } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1236) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const menuItems = [
    {
      title: "Home",
      icon: <House />,
      link: "/",
    },
    {
      title: "Archivio",
      icon: <Archive />,
      link: "/anime/archive",
    },
    {
      title: "My Ratings",
      icon: <Star />,
      link: "/user/my-ratings",
    },
  ];

  const handleMenuItems = () => {
    if (!userId || !isLoaded) {
      return menuItems.filter((item) => item.title !== "My Ratings");
    }
    return menuItems;
  };

  const filteredMenuItems = handleMenuItems();

  return (
    <nav className={`fixed w-full bg-custom-background/90 p-4 z-10`}>
      <div className="container mx-auto lg:px-10 flex gap-10 lg:gap-4 justify-between items-center">
        <Link
          href={"/"}
          className="flex justify-center items-center gap-1 cursor-pointer transition-opacity duration-150 hover:opacity-80"
        >
          <Image
            src="/animehunt-logo.png"
            width={isMobile ? 30 : 40}
            height={isMobile ? 30 : 40}
            alt="AnimeHunt Logo"
            className="pl-1"
          />
          <h1 className="text-lg lg:text-2xl font-bold text-custom-secondary">
            {!isMobile ? "AnimeHunt" : "AH"}
          </h1>
        </Link>

        <AnimeSearch />
        <div className="flex flex-row-reverse lg:flex-row gap-2 lg:gap-4 items-center font-bold">
          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant={"customGhost"}>
                  <Menu className="h-6 w-6 text-custom-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-custom-background text-custom-secondary border-0 p-3">
                {filteredMenuItems.map((item, index) => (
                  <Link key={index} href={item.link}>
                    <DropdownMenuItem
                      className={`flex items-center gap-2 ${
                        isActive(item.link)
                          ? "text-custom-primary"
                          : "text-custom-secondary"
                      }`}
                    >
                      {item.icon}
                      {item.title}
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              {filteredMenuItems.map((item, index) => (
                <Link key={index} href={item.link}>
                  <Button
                    variant={
                      isActive(item.link) ? "customPrimary" : "customGhost"
                    }
                  >
                    <div
                      className={`flex items-center gap-2 ${
                        isActive(item.link)
                          ? "text-custom-background"
                          : "text-custom-secondary"
                      }`}
                    >
                      {item.icon}
                      {item.title}
                    </div>
                  </Button>
                </Link>
              ))}
            </div>
          )}

          <ClerkProvider>
            <SignedOut>
              <SignInButton>
                <Button variant={"customGhost"}>
                  <CircleUserRound
                    className="text-custom-primary
                  "
                  />
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </ClerkProvider>
        </div>
      </div>
    </nav>
  );
}
