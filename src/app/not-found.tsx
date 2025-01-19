import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-lg text-custom-foreground">Pagina non trovata</p>
      <Link href="/">
        <p className="text-blue-500">Go back home</p>
      </Link>
    </div>
  );
}
