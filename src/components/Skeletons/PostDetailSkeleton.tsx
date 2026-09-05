import * as React from "react";

const PostDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 space-y-8">
      {/* Post */}
      <div className="w-full max-w-3xl mx-auto">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 shrink-0 rounded-full bg-slate-800 animate-pulse" />

            <div className="flex flex-col gap-2 flex-1">
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
          <div className="w-full h-96 rounded-xl bg-slate-800 animate-pulse mb-5" />

          {/* Content */}
          <div className="space-y-2 mb-6">
            <div className="h-4 w-full rounded bg-slate-800 animate-pulse" />
            <div className="h-4 w-full rounded bg-slate-800 animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-slate-800 animate-pulse" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 pt-2 border-t border-slate-800 mt-2">
            <div className="h-8 w-16 rounded-lg bg-slate-800 animate-pulse" />
            <div className="h-8 w-16 rounded-lg bg-slate-800 animate-pulse" />
            <div className="h-8 w-16 rounded-lg bg-slate-800 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailSkeleton;