"use client";
import { generateProfileSVG } from "@/utils/avatarGenerator";
import type { PutBlobResult } from "@vercel/blob";
import { Session } from "next-auth";
import Image from "next/image";
import { useRef, useState } from "react";

export default function CreateProfile({ session }: { session: Session }) {
  const [username, setUsername] = useState(session.user?.name || "");
  const [email, setEmail] = useState(session.user?.email || "");
  const [useGeneratedSVG, setUseGeneratedSVG] = useState(!session.user?.image);
  const defaultSVG = generateProfileSVG(username || "User");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState(session.user?.image || ""); // To preview selected image
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB limit

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(blob);
    if (!file) return;

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 4MB. Please upload a smaller file.");
      setProfilePicture(null);
      setPreviewImage(""); // Reset preview
      return;
    }

    setError(null); // Clear errors if valid
    setProfilePicture(file);
    setPreviewImage(URL.createObjectURL(file)); // Show preview
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (error) return; // Prevent submission if there's an error

    let profilePicUrl = useGeneratedSVG ? defaultSVG : previewImage;

    // Upload Image First (if not using generated SVG)
    if (profilePicture && !useGeneratedSVG) {
      const uploadResponse = await fetch(
        `/api/avatar/upload?filename=${profilePicture.name}`,
        {
          method: "POST",
          body: profilePicture,
        }
      );

      if (!uploadResponse.ok) {
        console.error("Error uploading image");
        return;
      }

      const uploadedBlob = (await uploadResponse.json()) as PutBlobResult;
      setBlob(uploadedBlob);
      profilePicUrl = uploadedBlob.url; // Use the uploaded image URL
    }

    // Send Profile Data
    const response = await fetch("/api/create-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        spotifyId: session.user?.id,
        username,
        email,
        profilePicture: profilePicUrl,
      }),
    });

    if (response.ok) {
      window.location.reload();
    } else {
      console.error("Error creating profile");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 p-8 rounded-3xl shadow-2xl text-white w-[420px] space-y-6 border border-gray-700"
    >
      <h1 className="text-3xl font-bold text-center tracking-wide text-green-400">
        Create Your Profile
      </h1>

      {/* Profile Picture Preview */}
      <div className="flex flex-col items-center space-y-2">
        {useGeneratedSVG ? (
          <div
            className="w-24 h-24 rounded-full overflow-hidden border-4 border-green-500 shadow-lg"
            dangerouslySetInnerHTML={{ __html: defaultSVG }}
          />
        ) : (
          <Image
            src={previewImage || "/file.svg"}
            alt="Profile Picture"
            width={96}
            height={96}
            className="rounded-full border-4 border-green-500 shadow-lg"
          />
        )}
      </div>

      {/* Toggle for Generated SVG */}
      <div className="flex items-center justify-between bg-gray-800 p-2 rounded-xl">
        <span className="text-sm text-gray-300">Use Auto-Generated Avatar</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={useGeneratedSVG}
            onChange={() => setUseGeneratedSVG(!useGeneratedSVG)}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-gray-600 rounded-full peer-checked:bg-green-500 transition-all after:content-[''] after:absolute after:left-1 after:top-1 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5"></div>
        </label>
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
        />
        <label htmlFor="image">Profile Picture</label>
        <input
          type="file"
          id="image"
          name="image"
          ref={inputFileRef}
          disabled={useGeneratedSVG}
          accept="image/*, .heic, .heif"
          onChange={handleFileChange}
          className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 disabled:opacity-50"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
        disabled={!!error} // Disable if error exists
      >
        Create Profile
      </button>
    </form>
  );
}
