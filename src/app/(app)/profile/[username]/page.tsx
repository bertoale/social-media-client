"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { userService } from "@/services/userService";
import { postService } from "@/services/postService";
import { followService } from "@/services/followService";
import { User, Post } from "@/types";
import { API_URL } from "@/lib/config";
import { PostCard } from "@/components/post/post-card";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, UserPlus, UserMinus } from "lucide-react";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);

  useEffect(() => {
    fetchUserProfile();
    fetchFollowers();
    fetchFollowing();
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserDetailByUsername(username);
      if (response.success && response.data) {
        setUser(response.data);
        await fetchUserPosts(response.data.id);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async (userId: number) => {
    try {
      const response = await postService.getPostsByAuthor(userId);
      if (response.success && response.data) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  const fetchFollowers = async () => {
    try {
      const response = await userService.getFollowers();
      if (response.success && response.data) {
        setFollowers(response.data);
      }
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  const fetchFollowing = async () => {
    try {
      const response = await userService.getFollowing();
      if (response.success && response.data) {
        setFollowing(response.data);
      }
    } catch (error) {
      console.error("Error fetching following:", error);
    }
  };

  const handleFollow = async () => {
    if (!user) return;
    setLoadingFollow(true);
    try {
      if (user.is_followed) {
        await followService.unfollowUser(user.id);
        setUser({
          ...user,
          is_followed: false,
          followers_count: user.followers_count - 1,
        });
        toast.success("Unfollowed successfully");
      } else {
        await followService.followUser(user.id);
        setUser({
          ...user,
          is_followed: true,
          followers_count: user.followers_count + 1,
        });
        toast.success("Followed successfully");
      }
    } catch (error) {
      toast.error("Failed to update follow status");
    } finally {
      setLoadingFollow(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">User not found</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl p-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <Avatar className="h-32 w-32 ring-4 ring-border">
              <AvatarImage
                src={user.avatar ? API_URL + user.avatar : undefined}
                alt={user.username}
              />
              <AvatarFallback className="text-4xl">
                {user.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">@{user.username}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <Button
                  onClick={handleFollow}
                  disabled={loadingFollow}
                  variant={user.is_followed ? "outline" : "default"}
                  className="w-full sm:w-auto"
                >
                  {user.is_followed ? (
                    <>
                      <UserMinus className="h-4 w-4 mr-2" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Follow
                    </>
                  )}
                </Button>
              </div>

              {/* Bio */}
              {user.bio && <p className="text-muted-foreground">{user.bio}</p>}

              {/* Stats */}
              <div className="flex gap-6">
                <div>
                  <span className="font-bold text-xl">{followers.length}</span>
                  <span className="text-muted-foreground ml-1">followers</span>
                </div>
                <div>
                  <span className="font-bold text-xl">{following.length}</span>
                  <span className="text-muted-foreground ml-1">following</span>
                </div>
                <div>
                  <span className="font-bold text-xl">{posts.length}</span>
                  <span className="text-muted-foreground ml-1">posts</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Posts */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Posts</h2>
        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No posts yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} variant="grid" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
