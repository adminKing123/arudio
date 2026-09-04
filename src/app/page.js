import { DashboardLayout } from "@/components/layout/dashboard/DashboardLayout";
import { RecommendationSection } from "@/components/dashboard/RecommendationSection";
import { getRandomRecommendations } from "@/lib/recommendations";

export default async function Home() {
  const recommendations = await getRandomRecommendations(16);

  return (
    <DashboardLayout>
      <RecommendationSection items={recommendations} />
    </DashboardLayout>
  );
}
