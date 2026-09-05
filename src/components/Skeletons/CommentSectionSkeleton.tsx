import * as React from "react";

const CommentSkeleton: React.FC<{ nested?: boolean }> = ({
  nested = false,
}) => {
  return (
    <div
      className={`border-l border-l-zinc-700 rounded-lg p-4 ${
        nested ? "ml-4" : ""
      }`}
    >
      {/* Username + timestamp */}
      <div className="mb-2">
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 rounded bg-slate-800 animate-pulse" />
          <div className="h-3 w-20 rounded bg-slate-800 animate-pulse" />
        </div>

        {/* Comment content */}
        <div className="space-y-2 mt-2">
          <div className="h-4 w-full rounded bg-slate-800 animate-pulse" />
          <div className="h-4 w-4/5 rounded bg-slate-800 animate-pulse" />
        </div>

        {/* Like + Reply */}
        <div className="flex items-center gap-4 mt-3">
          <div className="h-6 w-12 rounded bg-slate-800 animate-pulse" />
          <div className="h-4 w-10 rounded bg-slate-800 animate-pulse" />
        </div>
      </div>

      {/* Fake nested replies */}
      {nested === false && (
        <div className="mt-3 space-y-3 pl-2">
          <div className="h-4 w-20 rounded bg-slate-800 animate-pulse" />
        </div>
      )}
    </div>
  );
};

const CommentSectionSkeleton: React.FC = () => {
  return (
    <div className="mt-10 border-t border-slate-800 pt-8">
      {/* Header */}
      <div className="h-6 w-28 rounded bg-slate-800 animate-pulse mb-6" />

      {/* Comment form */}
      <div className="mb-6 p-4 rounded-xl border border-slate-700 bg-slate-900/60">
        <div className="w-full h-20 rounded-lg bg-slate-800 animate-pulse" />

        <div className="flex justify-end mt-3">
          <div className="h-9 w-28 rounded-lg bg-slate-800 animate-pulse" />
        </div>
      </div>

      {/* Comments */}
      <div className="space-y-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <CommentSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default CommentSectionSkeleton;