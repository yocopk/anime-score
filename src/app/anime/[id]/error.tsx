// app/anime/[id]/error.tsx
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-4">Qualcosa è andato storto!</h2>
        <p className="text-red-500 mb-4">{error.message}</p>
        <div className="flex gap-4">
          <Button onClick={reset}>Riprova</Button>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna alla ricerca
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
