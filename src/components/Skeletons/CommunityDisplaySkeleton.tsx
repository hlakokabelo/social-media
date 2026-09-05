import * as React from "react";

const CommunityDisplaySkeleton: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 space-y-8">
      {/* Community header */}
      <div className="p-6 rounded-xl border border-slate-700 bg-slate-900/80">
        <div className="flex justify-between items-start mb-4 gap-4">
          <div className="h-9 w-56 rounded bg-slate-800 animate-pulse" />
          <div className="h-10 w-20 rounded-lg bg-slate-800 animate-pulse shrink-0" />
        </div>

        <div className="space-y-2 mb-6">
          <div className="h-4 w-full rounded bg-slate-800 animate-pulse" />
          <div className="h-4 w-4/5 rounded bg-slate-800 animate-pulse" />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="h-4 w-32 rounded bg-slate-800 animate-pulse" />
          <div className="h-4 w-36 rounded bg-slate-800 animate-pulse" />
          <div className="h-4 w-24 rounded bg-slate-800 animate-pulse" />
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-2">
        <div className="h-6 w-20 rounded bg-slate-800 animate-pulse mb-5" />

        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="w-full max-w-3xl mx-auto mb-6"
          >
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-slate-800 animate-pulse" />

                <div className="flex flex-col flex-1 gap-2">
                  <div className="h-4 w-32 rounded bg-slate-800 animate-pulse" />
                  <div className="h-3 w-20 rounded bg-slate-800 animate-pulse" />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2 mb-4">
                <div className="h-7 w-4/5 rounded bg-slate-800 animate-pulse" />
                <div className="h-7 w-2/5 rounded bg-slate-800 animate-pulse" />
              </div>

              {/* Image */}
              <div className="w-full h-80 rounded-xl bg-slate-800 animate-pulse mb-4" />

              {/* Actions */}
              <div className="flex items-center gap-6 pt-2 border-t border-slate-800 mt-4">
                <div className="h-8 w-16 rounded-lg bg-slate-800 animate-pulse" />
                <div className="h-8 w-16 rounded-lg bg-slate-800 animate-pulse" />
                <div className="h-8 w-16 rounded-lg bg-slate-800 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityDisplaySkeleton;