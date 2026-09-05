import * as React from "react";

const UserLikesSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 mt-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="bg-zinc-900 border border-zinc-700 rounded-lg p-4"
        >
          {/* Post title */}
          <div className="h-4 w-3/4 rounded bg-zinc-800 animate-pulse" />

          {/* Vote + timestamp */}
          <div className="h-3 w-40 rounded bg-zinc-800 animate-pulse mt-3" />
        </div>
      ))}
    </div>
  );
};

export default UserLikesSkeleton;