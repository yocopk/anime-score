"use client";

import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { actionSyncUser } from "@/actions/sync-user";

export default function Home() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (user && isLoaded) {
      console.log(user);
      const email = user.emailAddresses[0].emailAddress;
      console.log(email);

      if (email) {
        const handleSync = async () => await actionSyncUser(email);
        const result = handleSync();
        console.log(result);
      }
    }
  }, [isLoaded, user]);

  return (
    <div className="w-64 p-10">
      <h1>Benvenut@ {user?.firstName}</h1>
      <div className="flex gap-2">
        <Input />
        <Button>Invia</Button>
      </div>
    </div>
  );
}
