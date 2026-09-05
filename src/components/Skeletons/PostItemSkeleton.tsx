import * as React from "react";

const PostItemSkeleton: React.FunctionComponent = () => {
 
    return (
    <div className="w-full max-w-3xl mx-auto mb-6">
      <div className="rounded-2xl border border-slate-800 bg-linear-to-br from-slate-900/95 to-slate-900/80 backdrop-blur-sm p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          {/* Avatar */}
          <div className="w-12 h-12 shrink-0 rounded-full bg-slate-800 animate-pulse" />

          {/* Username + timestamp */}
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

        {/* Action buttons */}
        <div className="flex items-center gap-6 pt-4 border-t border-slate-800">
          <div className="h-8 w-16 rounded-lg bg-slate-800 animate-pulse" />
          <div className="h-8 w-16 rounded-lg bg-slate-800 animate-pulse" />
          <div className="h-8 w-16 rounded-lg bg-slate-800 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default PostItemSkeleton;