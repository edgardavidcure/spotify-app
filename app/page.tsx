import { redirect } from "next/navigation";
import { auth } from "./auth";
import CreateProfile from "./components/CreateProfile";
import HeroSection from "./components/HeroSection";
import ProfileCard from "./components/ProfileCard";
import TopTab from "./components/TopTab";
import dbConnect from "./lib/db";
import { fetchUserDataFromAPI } from "./services/spotifyService";
import { getUserWithFreshData } from "./services/userService";
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  try {
    const session = await auth();
    await dbConnect();

    if (
      session?.error === "RefreshTokenRevoked" ||
      session?.error === "RefreshTokenExpired"
    ) {
      console.log("Refresh token has been revoked or expired. Signing out.");
      redirect("/signin"); // Redirect to the login page or another appropriate page
    }

    if (!session) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#1DB954] to-[#191414] p-8">
          <HeroSection />
        </div>
      );
    }

    const token = session.accessToken;
    const spotifyId = session.user?.id;

    if (!spotifyId) {
      console.error("User ID is undefined.");
      redirect("/signin");
    }

    const params = await searchParams;
    const limit = parseInt(params?.limit ?? "5", 10);

    if (isNaN(limit) || limit <= 0) {
      redirect("/?limit=5");
    }

    const user = await getUserWithFreshData(spotifyId, token);
    const { topArtists, topSongs } = await fetchUserDataFromAPI(token);
    let profile;

    if (!user) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#1DB954] to-[#191414] p-8">
          <CreateProfile session={session} />
        </div>
      );
    } else {
      profile = {
        spotifyId: user.spotifyId,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        topArtists: user.topArtists,
        topSongs: user.topSongs,
      };
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#1DB954] to-[#191414] p-8">
        <ProfileCard session={session.user} profile={profile} />
        <div className="flex flex-col items-center justify-between mt-8">
          <TopTab topArtists={topArtists} topSongs={topSongs} limit={limit} />
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    redirect("/signin");
  }
}
