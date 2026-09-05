import * as React from "react";

const CommunityListSkeleton: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-700 mb-6">
        <div className="h-5 w-20 rounded bg-slate-800 animate-pulse mb-2" />
        <div className="h-5 w-32 rounded bg-slate-800 animate-pulse mb-2" />
      </div>

      {/* Community cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-5"
          >
            <div className="flex items-center gap-4">
              {/* Community avatar */}
              <div className="w-12 h-12 shrink-0 rounded-full bg-slate-800 animate-pulse" />

              <div className="flex-1 min-w-0">
                {/* Name */}
                <div className="h-5 w-36 rounded bg-slate-800 animate-pulse" />

                {/* Description */}
                <div className="h-3 w-24 rounded bg-slate-800 animate-pulse mt-2" />
              </div>

              {/* Join button */}
              <div className="h-9 w-20 rounded-lg bg-slate-800 animate-pulse" />
            </div>

            {/* Description/content */}
            <div className="space-y-2 mt-4">
              <div className="h-3 w-full rounded bg-slate-800 animate-pulse" />
              <div className="h-3 w-4/5 rounded bg-slate-800 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityListSkeleton;