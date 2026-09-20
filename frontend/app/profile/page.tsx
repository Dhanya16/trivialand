import PageLayout from "@/components/PageLayout";
import ProfileView from "@/components/ProfileView";
import { AnimatedProfileVisual } from "@/components/AnimatedVisuals";

export default function ProfilePage() {
  return (
    <PageLayout
      title="Profile"
      subtitle="Your progress, history, and achievements"
      visual={<AnimatedProfileVisual />}
    >
      <ProfileView />
    </PageLayout>
  );
}
