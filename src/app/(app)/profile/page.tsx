"use client";

import { useEffect, useState } from "react";
import { postService } from "@/services/postService";
import { likeService } from "@/services/likeService";
import { followService } from "@/services/followService";
import { reportService } from "@/services/reportService";
import { userService } from "@/services/userService";
import { Post, User } from "@/types";
import { API_URL } from "@/lib/config";
import { PostCard } from "@/components/post/post-card";
import { EditPostDialog } from "@/components/post/edit-post-dialog";
import { ReportPostDialog } from "@/components/post/report-post-dialog";
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";
import { FollowersDialog } from "@/components/profile/followers-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Edit } from "lucide-react";

export default function ProfilePage() {
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [reportingPostId, setReportingPostId] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [followersDialogOpen, setFollowersDialogOpen] = useState(false);
  const [followingDialogOpen, setFollowingDialogOpen] = useState(false);

  useEffect(() => {
    fetchProfileData();
    fetchCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCurrentUser = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUserId(user.id);
      setCurrentUser(user);
    }
  };

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      // Fetch user's posts (already includes like_count, comment_count, is_liked)
      const postsResponse = await postService.getAllByCurrentUser();
      if (postsResponse.success && postsResponse.data) {
        setMyPosts(postsResponse.data);
      }

      // Fetch liked posts (already includes like_count, comment_count, is_liked)
      const likedResponse = await postService.getLikedPost();
      if (likedResponse.success && likedResponse.data) {
        setLikedPosts(likedResponse.data);
      }

      // Fetch followers
      const followersResponse = await userService.getFollowers();
      if (followersResponse.success && followersResponse.data) {
        setFollowerCount(followersResponse.data.length);
      }

      // Fetch following
      const followingResponse = await userService.getFollowing();
      if (followingResponse.success && followingResponse.data) {
        setFollowingCount(followingResponse.data.length);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async (
    postId: number,
    title: string,
    content: string
  ) => {
    try {
      const response = await postService.update(postId, {
        title,
        content,
        edited: true,
      });

      if (response.success) {
        toast.success("Post updated");
        fetchProfileData();
      }
    } catch (error) {
      toast.error("Failed to update post");
    }
  };

  const handleReport = async (
    postId: number,
    reason: string,
    description: string
  ) => {
    try {
      const response = await reportService.createReport(postId, {
        reason,
        description,
      });

      if (response.success) {
        toast.success("Report submitted");
      }
    } catch (error) {
      toast.error("Failed to submit report");
    }
  };

  const handleEditProfile = async (
    username: string,
    bio: string,
    avatar: File | null
  ) => {
    try {
      const response = await userService.updateProfile({
        username,
        bio,
        ...(avatar && { avatar }),
      });

      if (response.success && response.data) {
        toast.success("Profile updated successfully");
        setCurrentUser(response.data);
        // Update localStorage
        localStorage.setItem("user", JSON.stringify(response.data));
        fetchProfileData();
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <p className="text-center text-muted-foreground">Loading profile...</p>
      </div>
    );
  }
  return (
    <div className="container mx-auto max-w-4xl px-4 md:px-6 py-4 md:py-6">
      <h1 className="mb-4 md:mb-6 text-2xl md:text-3xl font-bold">Profile</h1>
      {/* Profile Stats */}
      <Card className="mb-4 md:mb-6">
        <CardContent className="pt-4 md:pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6">
            <Avatar className="h-20 w-20 md:h-24 md:w-24">
              <AvatarImage
                src={
                  currentUser?.avatar ? API_URL + currentUser.avatar : undefined
                }
                alt={currentUser?.username || "Profile"}
              />
              <AvatarFallback>
                {currentUser?.username?.[0]?.toUpperCase() || "ME"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left w-full">
              <div className="mb-3 md:mb-2">
                <h2 className="text-xl md:text-2xl font-bold">
                  {currentUser?.username || "My Profile"}
                </h2>
                {currentUser?.bio && (
                  <p className="text-muted-foreground mt-1 text-sm md:text-base">
                    {currentUser.bio}
                  </p>
                )}
              </div>{" "}
              <div className="grid grid-cols-4 gap-2 md:gap-8 mb-4">
                <div className="text-center">
                  <p className="text-lg md:text-2xl font-bold">
                    {myPosts.length}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Posts
                  </p>
                </div>
                <button
                  onClick={() => setFollowersDialogOpen(true)}
                  className="text-center hover:opacity-80 transition-opacity"
                >
                  <p className="text-lg md:text-2xl font-bold">
                    {followerCount}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Followers
                  </p>
                </button>
                <button
                  onClick={() => setFollowingDialogOpen(true)}
                  className="text-center hover:opacity-80 transition-opacity"
                >
                  <p className="text-lg md:text-2xl font-bold">
                    {followingCount}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Following
                  </p>
                </button>
                <div className="text-center">
                  <p className="text-lg md:text-2xl font-bold">
                    {likedPosts.length}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Liked
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setIsEditProfileOpen(true)}
                variant="outline"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>{" "}
      {/* Posts Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">My Posts</TabsTrigger>
          <TabsTrigger value="liked">Liked Posts</TabsTrigger>
        </TabsList>
        {/* My Posts Tab */}
        <TabsContent value="posts" className="mt-4 md:mt-6">
          {myPosts.length === 0 ? (
            <div className="text-center text-muted-foreground">
              <p>You haven't created any posts yet.</p>
            </div>
          ) : (
            <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
              {myPosts.map((post) => (
                <PostCard key={post.id} post={post} variant="grid" />
              ))}
            </div>
          )}
        </TabsContent>{" "}
        {/* Liked Posts Tab */}
        <TabsContent value="liked" className="mt-4 md:mt-6">
          {likedPosts.length === 0 ? (
            <div className="text-center text-muted-foreground">
              <p>You haven't liked any posts yet.</p>
            </div>
          ) : (
            <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
              {likedPosts.map((post) => (
                <PostCard key={post.id} post={post} variant="grid" />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      {/* Edit Post Dialog */}
      <EditPostDialog
        post={editingPost}
        open={!!editingPost}
        onOpenChange={(open) => !open && setEditingPost(null)}
        onSave={handleEditSave}
      />
      {/* Report Post Dialog */}
      <ReportPostDialog
        postId={reportingPostId}
        open={!!reportingPostId}
        onOpenChange={(open) => !open && setReportingPostId(null)}
        onReport={handleReport}
      />
      {/* Edit Profile Dialog */}
      <EditProfileDialog
        user={currentUser}
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        onSave={handleEditProfile}
      />
    </div>
  );
}
