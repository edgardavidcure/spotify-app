import { auth } from "./auth";

import ProfileCard from "./components/ProfileCard";
import TopArtistsCard from "./components/TopArtistsCard";
import TopSongsCard from "./components/TopSongsCard";

export default async function Home() {
  // Get session on the server side
  const session = await auth();

  // Initialize variables to hold data
  let spotifyProfile = null;
  let topArtists = null;
  let topSongs = null;

  // Check if session is valid
  if (session) {
    try {

      const token = session.token?.access_token;

      // Fetch Spotify profile data
      const profile = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`},
      });
      spotifyProfile = await profile.json();
      

      const artists = await fetch("https://api.spotify.com/v1/me/top/artists", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      topArtists = await artists.json();


      const songs = await fetch("https://api.spotify.com/v1/me/top/tracks", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      topSongs = await songs.json();
      // Parse the JSON responses
      console.log("Spotify Profile:",  spotifyProfile);
      console.log("Top Artists:", topArtists);
      console.log("Top Songs:", topSongs);
      console.log("Session:", session);
    } catch (error) {
      console.error("Failed to fetch Spotify data:", error);
    }
  }

  // Return the JSX with the fetched data
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#1DB954] to-[#191414] p-8">
      {/* Profile Card */}
      <ProfileCard session={session} spotifyProfile={spotifyProfile} />
  
      {session && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Top Artists */}
          <div className="w-[22rem] bg-[#121212] rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col items-center gap-6 text-white">
            <TopArtistsCard topArtists={topArtists} />
          </div>
  
          {/* Top Songs */}
          <div className="w-[22rem] bg-[#121212] rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col items-center gap-6 text-white">
            <TopSongsCard topSongs={topSongs} />
          </div>
        </div>
      )}
    </div>
  );
  
}
