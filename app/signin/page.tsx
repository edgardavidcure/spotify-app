import { providerMap, signIn } from "@/auth";
import { MusicalNoteIcon } from "@heroicons/react/24/solid";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params?.callbackUrl ?? "/";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] px-4">
      <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-2xl border border-gray-700 w-[26rem] flex flex-col items-center">
        {/* Animated Music Icon */}
        <div className="bg-green-500 p-5 rounded-full animate-pulse shadow-md">
          <MusicalNoteIcon className="w-12 h-12 text-white" />
        </div>

        {/* Header Message */}
        <h2 className="text-2xl font-bold mt-6">Your Music Awaits 🎵</h2>
        <p className="text-gray-400 text-center mt-2">
          Connect your Spotify account to see your top artists, tracks, and more!
        </p>

        {/* Sign-In Buttons */}
        <div className="mt-6 w-full flex flex-col gap-4">
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
                  throw error;
                }
              }}
              className="w-full"
            >
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg text-lg transition-all transform hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2"
              >
                <span>Sign in with {provider.name}</span>
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
