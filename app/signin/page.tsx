import { providerMap, signIn } from "@/auth";
import { MusicalNoteIcon } from "@heroicons/react/24/solid";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string };
}) {
  // Ensure callbackUrl is properly extracted
  const callbackUrl = searchParams?.callbackUrl ?? "/";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212]">
      <div className="bg-[#121212] p-6 rounded-2xl shadow-xl border border-gray-700 w-[24rem] text-white flex flex-col items-center">
        {/* Animated Music Icon */}
        <div className="bg-green-500 p-5 rounded-full animate-pulse shadow-md">
          <MusicalNoteIcon className="w-12 h-12 text-white" />
        </div>

        {/* Header Message */}
        <h2 className="text-xl font-semibold mt-4">Your Music Awaits 🎵</h2>
        <p className="text-gray-400 text-center px-6">
          Connect your Spotify account to see your top artists, tracks, and more!
        </p>

        {/* Sign In Buttons */}
        {Object.values(providerMap).map((provider) => (
          <form
            key={provider.id}
            action={async () => {
              "use server";
              try {
                await signIn(provider.id, { redirectTo: callbackUrl });
              } catch (error) {
                if (error instanceof AuthError) {
                  return redirect(`/?error=${error.type}`);
                }
                throw error; // Let Next.js handle unexpected errors
              }
            }}
          >
            <button
              type="submit"
              className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-md"
            >
              <span>Sign in with {provider.name}</span>
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
