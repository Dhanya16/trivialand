import ContestCard from "@/components/ContestCard";
import PageLayout from "@/components/PageLayout";
import { getContestsByStatus } from "@/lib/data";
import type { Contest } from "@/lib/types";
import { notFound } from "next/navigation";

const STATUS_CONFIG: Record<
  string,
  { title: string; subtitle: string; status: Contest["status"] }
> = {
  upcoming: {
    title: "Upcoming Contests",
    subtitle: "Get ready — these contests are starting soon",
    status: "upcoming",
  },
  live: {
    title: "Live Contests",
    subtitle: "Join now and compete in real time",
    status: "live",
  },
  past: {
    title: "Past Contests",
    subtitle: "Browse previous challenges and results",
    status: "past",
  },
};

type PageProps = {
  params: Promise<{ status: string }>;
};

export function generateStaticParams() {
  return Object.keys(STATUS_CONFIG).map((status) => ({ status }));
}

export default async function ContestStatusPage({ params }: PageProps) {
  const { status } = await params;
  const config = STATUS_CONFIG[status];

  if (!config) {
    notFound();
  }

  const items = getContestsByStatus(config.status);

  return (
    <PageLayout title={config.title} subtitle={config.subtitle} fullWidth>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {items.map((contest) => (
          <ContestCard key={contest.id} contest={contest} />
        ))}
      </div>
    </PageLayout>
  );
}
