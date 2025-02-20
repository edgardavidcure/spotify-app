import { redirect } from "next/navigation";
import { auth, signOut } from "./auth";
import HeroSection from "./components/HeroSection";
import ProfileCard from "./components/ProfileCard";
import TopTab from "./components/TopTab";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const session = await auth();

  if (session?.error === "RefreshTokenRevoked") {
    console.log("Refresh token has been revoked. Signing out.");
    signOut();
    redirect("/"); // Redirect to the login page or another appropriate page
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#1DB954] to-[#191414] p-8">
        <HeroSection />
      </div>
    );
  } else {
  }

  const token = session.accessToken;

  // ✅ Await searchParams before using them
  const params = await searchParams;
  const numItems = parseInt(params?.limit ?? "5", 10);

  // If limit is invalid, redirect to default
  if (isNaN(numItems) || numItems <= 0) {
    redirect("/?limit=5");
  }

  try {
    // Fetch Spotify profile data
    const profileResponse = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const profile = await profileResponse.json();

    // Fetch Top Artists (Default limit: 5)
    const artistsResponse = await fetch(
      `https://api.spotify.com/v1/me/top/artists?limit=${numItems}&time_range=medium_term`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const topArtists = await artistsResponse.json();

    // Fetch Top Songs (Default limit: 5)
    const songsResponse = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?limit=${numItems}&time_range=medium_term`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const topSongs = await songsResponse.json();

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#1DB954] to-[#191414] p-8">
        <ProfileCard session={session} spotifyProfile={profile} />
        {/* User selection should be handled in a Client Component */}
        <div className="flex flex-col items-center justify-between mt-8">
          <TopTab topArtists={topArtists} topSongs={topSongs} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching data from Spotify:", error);
    return <p className="text-white">Error loading data. Please try again.</p>;
  }
}
