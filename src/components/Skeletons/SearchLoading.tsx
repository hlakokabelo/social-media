const SearchLoading = () => {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-4 rounded-xl bg-gray-800/60 border border-gray-700/50"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gray-700" />

            <div className="space-y-2">
              <div className="h-3 w-24 bg-gray-700 rounded" />
              <div className="h-2 w-16 bg-gray-700 rounded" />
            </div>
          </div>

          <div className="h-5 w-3/4 bg-gray-700 rounded mb-2" />
          <div className="h-3 w-full bg-gray-700 rounded" />
          <div className="h-3 w-2/3 bg-gray-700 rounded mt-2" />
        </div>
      ))}
    </div>
  );
};

export default SearchLoading;
