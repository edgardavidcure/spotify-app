// /services/userService.ts
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import { Artist, Song } from "../../types";
import { TopData, User } from "../models"; // MongoDB model
import { fetchUserDataFromAPI } from "./spotifyService";

export async function saveTopData(
  spotifyId: string,
  token: string | undefined
) {
  const { topArtists, topSongs } = await fetchUserDataFromAPI(token);

  const topArtistsData = topArtists.items.map((artist: Artist) => artist.id);
  const topSongsData = topSongs.items.map((song: Song) => song.id);

  // Check if top data already exists for the user
  const existingTopData = await TopData.findOne({ spotifyId });

  if (existingTopData) {
    // Update existing record with fresh data
    existingTopData.topArtists = topArtistsData;
    existingTopData.topSongs = topSongsData;
    existingTopData.lastFetched = new Date();
    await existingTopData.save();
  } else {
    // Create new record if none exists
    const newTopData = new TopData({
      spotifyId: spotifyId,
      topArtists: topArtistsData,
      topSongs: topSongsData,
      lastFetched: new Date(),
    });
    await newTopData.save();
  }
}

export async function createUserAndSaveData(
  spotifyId: string,
  username: string,
  email: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profilePicture: any
) {
  const session = await auth();
  const token = session?.accessToken;
  console.log(token);
  // Create user first
  const user = await User.findOneAndUpdate(
    { spotifyId },
    {
      username,
      email,
      profilePicture: profilePicture,
      lastFetched: new Date(),
    },
    { upsert: true, new: true } // Create if not exist
  );

  // Now fetch and save the top artists and top songs
  await saveTopData(spotifyId, token);
  return user;
}

export async function refreshUserData(
  spotifyId: string,
  token: string | undefined
) {
  try {
    dbConnect();
    await saveTopData(spotifyId, token);
  } catch (error) {
    throw new Error("Error saving user data to MongoDB: " + error);
  }
}

export async function getUserWithFreshData(
  spotifyId: string,
  token: string | undefined
) {
  const user = await User.findOne({ spotifyId: spotifyId });

  if (!user) return null; // User not found

  const userTopData = await TopData.findOne({ spotifyId });

  if (userTopData) {
    const lastFetched = new Date(userTopData.lastFetched);
    const currentTime = new Date();
    const isExpired = currentTime.getTime() - lastFetched.getTime() > 86400000; // 24 hours

    if (isExpired) {
      refreshUserData(spotifyId, token);
    }
  }

  return user;
}

export async function getUserTopDataFromDB(spotifyId: string) {
  const userTopData = await TopData.findOne({ spotifyId });

  if (!userTopData) return null;

  return userTopData;
}

export async function searchUser(spotifyId: string) {
  const user = await User.findOne({ spotifyId: spotifyId });
  return {
    username: user.username,
    profilePicture: user.profilePicture,
    spotifyId: user.spotifyId,
  };
}
