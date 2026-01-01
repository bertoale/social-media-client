"use client";

import { Post } from "@/types";
import { API_URL } from "@/lib/config";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Archive } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  variant?: "grid" | "feed";
}

export function PostCard({ post, variant = "grid" }: PostCardProps) {
  if (variant === "feed") {
    return (
      <Link href={`/post/${post.id}`}>
        <Card
          className={cn(
            "cursor-pointer hover:shadow-lg transition-all overflow-hidden py-0 gap-0",
            post.archived &&
              "opacity-70 border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20"
          )}
        >
          {/* Author Info */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Link
                href={`/profile/${post.author.username}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-3 hover:opacity-80"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={
                      post.author.avatar
                        ? API_URL + post.author.avatar
                        : undefined
                    }
                    alt={post.author.username}
                  />
                  <AvatarFallback>
                    {post.author.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">
                    {post.author.username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
              {post.archived && (
                <Badge
                  variant="secondary"
                  className="gap-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                >
                  <Archive className="h-3 w-3" />
                  Archived
                </Badge>
              )}{" "}
            </div>
          </div>
          {/* Image */}
          {post.image ? (
            <div className="relative aspect-square w-full">
              <img
                src={API_URL + post.image}
                alt={post.title}
                className={cn(
                  "object-cover w-full h-full",
                  post.archived && "saturate-50"
                )}
              />
            </div>
          ) : (
            <div className="flex relative aspect-square w-full items-center justify-center bg-muted-foreground/10">
              <span className="text-6xl text-muted-foreground/20">🖼️</span>
            </div>
          )}
          {/* Content */}
          <CardContent className="pt-4 pb-2">
            <p className="font-bold text-small line-clamp-1">{post.title}</p>
          </CardContent>
          {/* Stats */}
          <CardFooter className="flex gap-4 pt-0 pb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Heart
                className={`h-4 w-4 ${
                  post.is_liked ? "text-red-500 fill-red-500" : ""
                }`}
              />
              <span className="font-medium">{post.like_count}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4" />
              <span className="font-medium">{post.comment_count}</span>
            </div>
          </CardFooter>
        </Card>
      </Link>
    );
  }
  // Grid variant
  return (
    <Link href={`/post/${post.id}`}>
      <Card
        className={cn(
          "flex flex-col overflow-hidden cursor-pointer hover:shadow-lg transition-all h-full group",
          post.archived &&
            "opacity-70 border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20"
        )}
      >
        {/* Image Container */}
        <div className="relative aspect-square w-full bg-muted overflow-hidden">
          {post.image ? (
            <>
              <img
                src={API_URL + post.image}
                alt={post.title}
                className={cn(
                  "h-full w-full object-cover group-hover:scale-105 transition-transform duration-300",
                  post.archived && "saturate-50"
                )}
              />
              {post.archived && (
                <div className="absolute top-2 right-2">
                  <Badge
                    variant="secondary"
                    className="gap-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                  >
                    <Archive className="h-3 w-3" />
                    Archived
                  </Badge>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted-foreground/10 relative">
              <span className="text-5xl text-muted-foreground/20">🖼️</span>
              {post.archived && (
                <div className="absolute top-2 right-2">
                  <Badge
                    variant="secondary"
                    className="gap-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                  >
                    <Archive className="h-3 w-3" />
                    Archived
                  </Badge>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Content */}
        <CardContent className="flex-1 p-4 pb-2">
          {/* Author */}
          <Link
            href={`/profile/${post.author.username}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 mb-3 hover:opacity-80"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  post.author.avatar ? API_URL + post.author.avatar : undefined
                }
                alt={post.author.username}
              />
              <AvatarFallback>
                {post.author.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{post.author.username}</span>
          </Link>

          {/* Title */}
          <h3 className="font-semibold line-clamp-2 text-base">{post.title}</h3>
        </CardContent>

        {/* Stats */}
        <CardFooter className="flex gap-4 px-4 pb-4 pt-0 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Heart
              className={`h-4 w-4 ${
                post.is_liked ? "text-red-500 fill-red-500" : ""
              }`}
            />
            <span className="font-medium">{post.like_count}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageCircle className="h-4 w-4" />
            <span className="font-medium">{post.comment_count}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
