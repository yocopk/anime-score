"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { actionSearchUsers } from "@/actions/search";

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface UserResult {
  id: string;
  email: string;
  totalRatings: number;
}

export default function UserSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchUsers = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const users = await actionSearchUsers(debouncedQuery);
        setResults(users);
      } catch (error) {
        console.error(error);
        setError("Failed to search users");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedQuery]);

  const getUserInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      <div className="relative">
        <Input
          placeholder="Search users by email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {results.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {results.map((user) => (
                <Link
                  key={user.id}
                  href={`/user/${encodeURIComponent(user.email)}`}
                  className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                >
                  <Avatar>
                    <AvatarFallback>
                      {getUserInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.totalRatings} ratings
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {query.length >= 2 && results.length === 0 && !isLoading && !error && (
        <p className="text-center text-sm text-muted-foreground">
          No users found
        </p>
      )}
    </div>
  );
}
