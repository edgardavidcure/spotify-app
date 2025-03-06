import dbConnect from "@/lib/db";
import { createUserAndSaveData } from "@/services/userService";

export async function POST(req: Request) {
  let res: Response;

  await dbConnect();

  const { spotifyId, username, email, profilePicture } = await req.json();

  try {
    const user = createUserAndSaveData(
      spotifyId,
      username,
      email,
      profilePicture
    );

    res = new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    res = new Response(
      JSON.stringify({ error: "Error saving user data to MongoDB: " + error }),
      { status: 500 }
    );
  }

  return res;
}
