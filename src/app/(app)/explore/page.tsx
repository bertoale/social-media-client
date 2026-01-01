"use client";

import { useEffect, useState, useRef } from "react";
import { userService } from "@/services/userService";
import { User } from "@/types";
import { API_URL } from "@/lib/config";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ExplorePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchExploreUsers();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      searchUsers(searchQuery);
    }, 500);
  }, [searchQuery]);

  const fetchExploreUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await userService.getExploreUsers(20, 0);
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const searchUsers = async (query: string) => {
    try {
      setSearching(true);
      const response = await userService.searchUser(query);
      if (response.success && response.data) {
        setSearchResults(response.data);
        if (response.data.length === 0) {
          toast.info("No users found");
        }
      } else {
        setSearchResults([]);
        toast.error("No users found");
      }
    } catch (error) {
      setSearchResults([]);
      toast.error("Failed to search users");
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };
  return (
    <div className="container mx-auto max-w-6xl px-4 md:px-6 py-4 md:py-6">
      <div className="mb-4 md:mb-6 flex items-center gap-3">
        <Users className="h-6 w-6 md:h-8 md:w-8 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold">Discover People</h1>
      </div>
      {/* Search Bar */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for users by username or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                autoComplete="off"
              />
            </div>
            {searchQuery && (
              <Button type="button" variant="outline" onClick={clearSearch}>
                Clear
              </Button>
            )}
          </div>
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Found {searchResults.length} user(s)
              </p>
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <Link
                    key={user.id}
                    href={`/profile/${user.username}`}
                    className="flex items-center gap-3 rounded-lg border p-4 bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={user.avatar ? API_URL + user.avatar : undefined}
                        alt={user.username}
                      />
                      <AvatarFallback>
                        {user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">@{user.username}</p>
                      {user.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {user.bio}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span>
                          <span className="font-medium text-foreground">
                            {user.followers_count}
                          </span>{" "}
                          followers
                        </span>
                        <span>
                          <span className="font-medium text-foreground">
                            {user.following_count}
                          </span>{" "}
                          following
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>{" "}
      {/* Explore Users */}
      <div>
        <h2 className="mb-3 md:mb-4 text-lg md:text-xl font-semibold">
          {searchResults.length > 0 ? "All Users" : "Suggested For You"}
        </h2>
        {loadingUsers ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No users found.</p>
          </div>
        ) : (
          <div className="grid gap-3 md:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {users.map((user) => (
              <Link key={user.id} href={`/profile/${user.username}`}>
                <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] h-full">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center gap-4">
                      <Avatar className="h-20 w-20 ring-2 ring-border">
                        <AvatarImage
                          src={user.avatar ? API_URL + user.avatar : undefined}
                          alt={user.username}
                        />
                        <AvatarFallback className="text-2xl">
                          {user.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 w-full">
                        <h3 className="font-semibold text-lg truncate">
                          @{user.username}
                        </h3>{" "}
                        {user.bio && (
                          <p className="text-sm text-muted-foreground line-clamp-2 min-h-10">
                            {user.bio}
                          </p>
                        )}
                        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-2">
                          <div>
                            <span className="font-semibold text-foreground">
                              {user.followers_count}
                            </span>{" "}
                            followers
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">
                              {user.following_count}
                            </span>{" "}
                            following
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
