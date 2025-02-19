import Link from "next/link";
export default function HeroSection() {
  return (
    <section className="text-center text-white max-w-3xl mx-auto">
      {/* Hero Section */}
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Discover Your Music Journey 🎶
      </h1>
      <p className="text-lg text-gray-300 mb-8">
        Connect your Spotify account to see your top artists, tracks, and
        personalize your music experience.
      </p>

      {/* Call to Action */}
      <Link href="/signin">
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg text-lg transition-all transform hover:scale-105 active:scale-95 shadow-md"
          aria-label="Sign in with Spotify"
        >
          Get Started
        </button>
      </Link>

      {/* Features Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          title="🎵 Personalized Insights"
          description="See your top artists, songs, and trends based on your listening habits."
        />
        <FeatureCard
          title="📊 Music Stats"
          description="Explore deep insights into your favorite genres and listening time."
        />
        <FeatureCard
          title="🎧 Connect & Share"
          description="Share your music journey with friends and discover new tunes."
        />
      </div>
    </section>
  );
}

// Reusable Feature Card Component
function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-[#121212] rounded-lg shadow-lg text-white">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-400 text-sm mt-2">{description}</p>
    </div>
  );
}
