"use client";

import { useMemo } from "react";
import type { Post } from "@/types/post";
import PostCard from "./PostCard";
import CreatePostCard from "./CreatePostCard";

interface PostGridProps {
  posts: Post[];
  onPostClick?: (post: Post) => void;
  onCreateClick?: () => void;
  onPostDelete?: (post: Post) => void;
}

export default function PostGrid({ posts, onPostClick, onCreateClick, onPostDelete }: PostGridProps) {
  // Grid 아이템 배열: 첫 번째는 "ADD_BUTTON", 나머지는 posts
  const gridItems = useMemo<(Post | "ADD_BUTTON")[]>(() => {
    return onCreateClick ? ["ADD_BUTTON", ...posts] : posts;
  }, [posts, onCreateClick]);

  if (gridItems.length === 0) {
    return (
      <div className="w-full max-w-[935px] mx-auto px-4 pb-8 pt-8">
        <div className="text-center text-gray-500 text-sm">
          아직 게시물이 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[935px] mx-auto px-4 pb-8 pt-8">
      <div className="grid grid-cols-3 gap-1">
        {gridItems.map((item) => {
          if (item === "ADD_BUTTON") {
            return (
              <CreatePostCard
                key="add-post-card"
                onClick={onCreateClick}
              />
            );
          }
          return (
            <PostCard
              key={`post-${item.id}`}
              post={item}
              onClick={onPostClick}
              onDelete={onPostDelete}
            />
          );
        })}
      </div>
    </div>
  );
}
