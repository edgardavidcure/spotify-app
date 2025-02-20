export interface Song {
  id: string;
  name: string;
  artists: { name: string }[];
  images: { url: string }[];
}

export interface TopSongsCardProps {
  items: Song[];
  topSongs: {
    items: Song[];
  };
}

export interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  followers: { total: number };
}

export interface TopArtistsCardProps {
  items: Artist[];
  topArtists: {
    items: Artist[];
  };
}
export interface TopTabProps {
  topArtists: TopArtistsCardProps;
  topSongs: TopSongsCardProps;
}
