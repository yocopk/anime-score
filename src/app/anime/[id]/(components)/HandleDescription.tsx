"use client";

import { useState } from "react";

export default function HandleDescription({
  description,
}: {
  description: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const maxCharactersPerLine = 50; // Adatta in base alla larghezza del contenitore
  const lines = Math.ceil(description.length / maxCharactersPerLine);

  const isLongDescription = lines > 5;

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl text-custom-primary font-semibold">Descrizione</h2>
      <p className="text-custom-secondary">
        {isLongDescription
          ? description.slice(0, maxCharactersPerLine * 5) + "..."
          : description}
        {isLongDescription && (
          <span
            className="text-custom-primary cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            more
          </span>
        )}
      </p>
      {isModalOpen && (
        <div className="fixed inset-0 p-2 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-custom-background p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl text-custom-primary font-semibold mb-4">
              Descrizione Completa
            </h2>
            <p className="text-custom-secondary max-h-56 overflow-y-scroll p-3">
              {description}
            </p>
            <button
              className="mt-4 text-right w-full text-custom-primary"
              onClick={() => setIsModalOpen(false)}
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
