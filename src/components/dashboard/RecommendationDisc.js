import Image from "next/image";

/** @param {{ thumbnailUrl: string | null, alt?: string }} props */
export function RecommendationDisc({ thumbnailUrl, alt = "" }) {
  return (
    <div className="recommendation-disc">
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={alt}
          width={168}
          height={168}
          className="recommendation-disc-image"
          unoptimized
        />
      ) : (
        <span className="recommendation-disc-fallback" aria-hidden="true" />
      )}
    </div>
  );
}
