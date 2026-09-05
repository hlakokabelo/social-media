import * as React from "react";

const PublicProfileSkeleton: React.FC = () => {
  return (
    <div>
      {/* Profile card */}
      <div className="flex justify-center mt-12">
        <div className="bg-zinc-900 p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-full bg-zinc-800 animate-pulse" />

            {/* Display name */}
            <div className="h-5 w-32 rounded bg-zinc-800 animate-pulse mt-4" />

            {/* Username */}
            <div className="h-4 w-24 rounded bg-zinc-800 animate-pulse mt-2" />

            {/* Bio */}
            <div className="w-full space-y-2 mt-5">
              <div className="h-3 w-full rounded bg-zinc-800 animate-pulse" />
              <div className="h-3 w-4/5 mx-auto rounded bg-zinc-800 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-6 border-b border-zinc-700 mt-6 pb-2">
        <div className="h-4 w-12 rounded bg-zinc-800 animate-pulse" />
        <div className="h-4 w-14 rounded bg-zinc-800 animate-pulse" />
        <div className="h-4 w-10 rounded bg-zinc-800 animate-pulse" />
      </div>

      {/* Content skeleton */}
      <div className="flex flex-col gap-4 mt-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="bg-zinc-900 border border-zinc-700 rounded-lg p-4"
          >
            <div className="h-4 w-3/4 rounded bg-zinc-800 animate-pulse" />
            <div className="h-3 w-32 rounded bg-zinc-800 animate-pulse mt-3" />
            <div className="h-3 w-24 rounded bg-zinc-800 animate-pulse mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicProfileSkeleton;