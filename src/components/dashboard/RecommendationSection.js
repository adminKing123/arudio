import Link from "next/link";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";
import { HorizontalScrollRow } from "@/components/dashboard/HorizontalScrollRow";

/**
 * @param {{
 *   items: Array<{
 *     id: number,
 *     title: string,
 *     artist: string,
 *     thumbnailUrl: string | null,
 *   }>,
 * }} props
 */
export function RecommendationSection({ items }) {
  return (
    <section className="recommendation-section" aria-labelledby="recommendation-heading">
      <div className="recommendation-section-header">
        <h2 id="recommendation-heading" className="recommendation-section-title">
          Recommendation for You
        </h2>
        <Link href="/songs" className="recommendation-section-link">
          See All
        </Link>
      </div>

      <HorizontalScrollRow>
        {items.map((item) => (
          <RecommendationCard
            key={item.id}
            title={item.title}
            artist={item.artist}
            thumbnailUrl={item.thumbnailUrl}
          />
        ))}
      </HorizontalScrollRow>
    </section>
  );
}
