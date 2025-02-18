// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TopArtistsCard({ topArtists }: any) {
    return (
      <div className="w-[22rem] bg-[#121212] rounded-2xl shadow-lg border border-gray-700 p-6 text-white">
        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-4">🎤 Top Artists</h2>
  
        {/* Artist List */}
        {topArtists && topArtists.items.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
            {topArtists.items.map((artist: any) => (
              <li
                key={artist.id}
                className="flex gap-4 items-start p-2 rounded-lg hover:bg-[#1DB954]/30 transition"
              >
                {/* Artist Image */}
                <img
                  src={artist.images[0]?.url || "/placeholder.jpg"}
                  alt={artist.name}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex flex-col">
                {/* Artist Name */}
                <span className="text-sm font-medium mt-2 truncate">{artist.name}</span>
                <span className="text-sm mt-2 truncate font-medium text-gray-400">Followers: {artist.followers.total}</span>

                </div>
                
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-center">No top artists found.</p>
        )}
      </div>
    );
  }
  