"use client";

import { Post } from "@/types";
import { API_URL } from "@/lib/config";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Archive } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface PostCardProps {
  post: Post;
  variant?: "grid" | "feed";
}

export function PostCard({ post, variant = "grid" }: PostCardProps) {
  const router = useRouter();
  if (variant === "feed") {
    return (
      <Card
        onClick={() => router.push(`/post/${post.id}`)}
        className={cn(
          "relative cursor-pointer overflow-hidden aspect-square transition-all hover:shadow-lg",
          post.archived && "opacity-70 border-amber-200 dark:border-amber-900"
        )}
      >
        {/* Background Image */}
        {post.image ? (
          <img
            src={API_URL + post.image}
            alt={post.title}
            className={cn(
              "absolute inset-0 h-full w-full object-cover",
              post.archived && "saturate-50"
            )}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <span className="text-6xl text-muted-foreground/30">🖼️</span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/15" />

        {/* Top Content */}
        <div className="relative z-10 p-4">
          <Link
            href={`/profile/${post.author.username}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  post.author.avatar ? API_URL + post.author.avatar : undefined
                }
              />
              <AvatarFallback>
                {post.author.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-white">
              {post.author.username}
            </span>
          </Link>
        </div>

        {/* Bottom Overlay (TITLE + STATS) */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 space-y-2">
          {/* Title */}
          <div className="rounded-md bg-black/10 px-3 py-1">
            <p className="text-sm font-bold text-white line-clamp-1">
              {post.title}
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-sm text-white">
            <div className="flex items-center gap-1.5">
              <Heart
                className={cn(
                  "h-4 w-4",
                  post.is_liked && "fill-red-500 text-red-500"
                )}
              />
              <span>{post.like_count}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comment_count}</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }
  // Grid variant
  return (
    <Card
      onClick={() => router.push(`/post/${post.id}`)}
      className={cn(
        "relative aspect-square cursor-pointer overflow-hidden transition-all hover:shadow-lg group",
        post.archived && "opacity-70 border-amber-200 dark:border-amber-900"
      )}
    >
      {/* Background Image */}
      {post.image ? (
        <img
          src={API_URL + post.image}
          alt={post.title}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
            post.archived && "saturate-50"
          )}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <span className="text-6xl text-muted-foreground/30">🖼️</span>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Top Content (Author + Badge) */}
      <div className="relative z-10 p-4">
        <Link
          href={`/profile/${post.author.username}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={
                post.author.avatar ? API_URL + post.author.avatar : undefined
              }
            />
            <AvatarFallback>
              {post.author.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-white">
            {post.author.username}
          </span>
        </Link>

        {post.archived && (
          <Badge className="mt-2 bg-amber-500/80 text-white">
            <Archive className="mr-1 h-3 w-3" />
            Archived
          </Badge>
        )}
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 space-y-2">
        {/* Title */}
        <div className="inline-block max-w-full rounded-md bg-black/50 px-3 py-1">
          <h3 className="text-sm font-semibold text-white line-clamp-2">
            {post.title}
          </h3>
        </div>

        {/* Stats */}
        <CardFooter className="p-0 flex gap-4 text-sm text-white">
          <div className="flex items-center gap-1.5">
            <Heart
              className={cn(
                "h-4 w-4",
                post.is_liked && "fill-red-500 text-red-500"
              )}
            />
            <span>{post.like_count}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageCircle className="h-4 w-4" />
            <span>{post.comment_count}</span>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
