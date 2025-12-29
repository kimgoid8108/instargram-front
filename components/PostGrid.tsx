"use client";

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
  // 게시물이 없고 onCreateClick도 없을 때만 빈 상태 메시지 표시
  if (posts.length === 0 && !onCreateClick) {
    return (
      <div className="w-full max-w-[935px] mx-auto px-4 pb-8 pt-8">
        <div className="text-center text-gray-500 text-sm">아직 게시물이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[935px] mx-auto px-4 pb-8 pt-8">
      <div className="grid grid-cols-3 gap-1">
        {onCreateClick && <CreatePostCard key="add-post-card" onClick={onCreateClick} />}
        {posts.map((post) => (
          <PostCard key={`post-${post.id}`} post={post} onClick={onPostClick} onDelete={onPostDelete} />
        ))}
      </div>
    </div>
  );
}
