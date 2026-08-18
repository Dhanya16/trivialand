import Button from "@/components/Button";
import ContestColumn from "@/components/ContestColumn";
import RankingsColumn from "@/components/RankingsColumn";
import PageLayout from "@/components/PageLayout";
import { getContestsByStatus, rankings } from "@/lib/data";

export default function ContestsPage() {
  const live = getContestsByStatus("live");
  const upcoming = getContestsByStatus("upcoming");
  const past = getContestsByStatus("past");
  const featuredLive = live[0];

  return (
    <PageLayout
      title="Contests"
      subtitle="Compete in timed quizzes and climb the rankings"
      fullWidth
    >
      {featuredLive && (
        <div className="card-light mb-10 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">
              Live now
            </p>
            <p className="mt-2 text-xl font-semibold tracking-tight text-[var(--text)] sm:text-2xl">
              {featuredLive.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              {featuredLive.description}
            </p>
          </div>
          <Button>Enter Contest</Button>
        </div>
      )}

      <div className="grid items-stretch gap-8 lg:grid-cols-4 lg:gap-10">
        <ContestColumn
          title="Upcoming"
          items={upcoming}
          moreHref="/contests/upcoming"
        />
        <ContestColumn title="Live" items={live} moreHref="/contests/live" />
        <ContestColumn title="Past" items={past} moreHref="/contests/past" />
        <RankingsColumn items={rankings} />
      </div>
    </PageLayout>
  );
}
