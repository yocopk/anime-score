"use client";
import { useState, useEffect } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Funzione per mostrare/nascondere la freccia in base allo scroll
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Aggiunge l'evento scroll
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      // Rimuove l'evento scroll al dismount
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // Funzione per scorrere verso l'alto
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Scorrimento fluido
    });
  };

  return (
    isVisible && (
      <div
        className="fixed bottom-4 right-4 size-10 text-center bg-yellow-500 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-600"
        onClick={scrollToTop}
      >
        ↑
      </div>
    )
  );
}
