import { db } from "@/lib/db";
import { getThumbnailUrl } from "@/lib/media";

/**
 * @template T
 * @param {T[]} items
 */
function shuffle(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

/**
 * @param {number} [count=16]
 */
export async function getRandomRecommendations(count = 16) {
  const songs = await db.song.all();
  const selected = shuffle(songs).slice(0, count);

  return selected.map((song) => {
    const album = song.getAlbum();
    const artists = song.getArtists();

    return {
      id: song.id,
      title: song.original_name,
      artist: artists.map((entry) => entry.name).join(", ") || "Unknown Artist",
      thumbnailUrl: getThumbnailUrl(album, "300x300"),
      thumbnailUrlLarge: getThumbnailUrl(album, "1200x1200"),
    };
  });
}
