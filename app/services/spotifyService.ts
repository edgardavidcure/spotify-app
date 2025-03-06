// /services/spotifyService.ts
export async function fetchUserDataFromAPI(token: string | undefined) {
  try {
    const profileResponse = fetchSpotifyData("me", token);

    const topArtistsResponse = fetchSpotifyData(
      `me/top/artists?limit=20&time_range=medium_term`,
      token
    );

    const topSongsResponse = fetchSpotifyData(
      `me/top/tracks?limit=20&time_range=medium_term`,
      token
    );

    const [profile, topArtists, topSongs] = await Promise.all([
      profileResponse,
      topArtistsResponse,
      topSongsResponse,
    ]);

    return { profile, topArtists, topSongs };
  } catch (error) {
    throw new Error("Error fetching data from Spotify: " + error);
  }
}

export async function fetchSpotifyData(
  endpoint: string,
  token: string | undefined
) {
  const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error(`Spotify API error: ${response.status}`);
  return response.json();
}

export async function fetchTopSongsWithIds(
  songIds: string[],
  token: string | undefined
) {
  const response = await fetchSpotifyData(
    `/tracks?ids=${songIds.join(",")}`,
    token
  );
  if (!response.ok) throw new Error(`Spotify API error: ${response.status}`);
  return response.json();
}

export async function fetchTopArtistsWithIds(
  artistIds: string[],
  token: string | undefined
) {
  const response = await fetchSpotifyData(
    `/artists?ids=${artistIds.join(",")}`,
    token
  );

  if (!response.ok) throw new Error(`Spotify API error: ${response.status}`);
  return response.json();
}
