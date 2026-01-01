"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";
import { API_URL } from "@/lib/config";
import { userService } from "@/services/userService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import Link from "next/link";

interface FollowersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "followers" | "following";
}

export function FollowersDialog({
  open,
  onOpenChange,
  type,
}: FollowersDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open, type]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response =
        type === "followers"
          ? await userService.getFollowers()
          : await userService.getFollowing();

      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(`Failed to load ${type}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "followers" ? "Followers" : "Following"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground text-sm">Loading...</p>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No {type === "followers" ? "followers" : "following"} yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.username}`}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
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
                    <p className="font-medium truncate">{user.username}</p>
                    {user.bio && (
                      <p className="text-sm text-muted-foreground truncate">
                        {user.bio}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
