import { RecommendationDisc } from "@/components/dashboard/RecommendationDisc";

/** @param {{ title: string, artist: string, thumbnailUrl: string | null }} props */
export function RecommendationCard({ title, artist, thumbnailUrl }) {
  return (
    <article className="recommendation-card">
      <RecommendationDisc thumbnailUrl={thumbnailUrl} alt={`${title} cover art`} />

      <div className="recommendation-card-meta">
        <h3 className="recommendation-card-title" title={title}>
          {title}
        </h3>
        <p className="recommendation-card-artist" title={artist}>
          {artist}
        </p>
      </div>
    </article>
  );
}
