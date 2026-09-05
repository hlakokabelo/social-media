import * as React from "react";

const UserRepliesSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 mt-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="bg-zinc-900 border border-zinc-700 rounded-lg p-4"
        >
          {/* Reply content */}
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-zinc-800 animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-zinc-800 animate-pulse" />
          </div>

          {/* Parent post */}
          <div className="h-3 w-3/4 rounded bg-zinc-800 animate-pulse mt-3" />

          {/* Timestamp */}
          <div className="h-3 w-20 rounded bg-zinc-800 animate-pulse mt-2" />
        </div>
      ))}
    </div>
  );
};

export default UserRepliesSkeleton;