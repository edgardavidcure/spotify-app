// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TopSongsCard({ topSongs }: any) {
    return (
      <div className="w-[22rem] bg-[#121212] rounded-2xl shadow-lg border border-gray-700 p-6 text-white">
        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-4">🎵 Top Songs</h2>
  
        {/* Song List */}
        <ul className="space-y-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
          {topSongs.items.map((song: any) => (
            <li
              key={song.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1DB954]/30 transition"
            >
              {/* Album Cover */}
              <img
                src={song.album.images[0].url}
                alt={song.name}
                className="w-12 h-12 rounded-md"
              />
  
              {/* Song Details */}
              <div className="flex flex-col truncate">
                <span className="font-semibold truncate">{song.name}</span>
                <span className="text-sm text-gray-400">{song.artists[0].name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  