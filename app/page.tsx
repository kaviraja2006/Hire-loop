import Hero from "@/components/features/homepage/Hero";
import JobFeed from "@/components/features/homepage/JobFeed";
import Container from "@/components/ui/Container";

// Incremental Static Regeneration - Revalidate every 60 seconds
export const revalidate = 60;

export default async function Home() {
  // This timestamp will update every 60 seconds when the page is regenerated
  const timestamp = new Date().toISOString();

  return (
    <div className="">
      <Hero />
      <section>
        <Container>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Latest Opportunities</h2>
            <p className="text-sm text-gray-500">
              Last updated: {new Date(timestamp).toLocaleTimeString()} (ISR -
              60s)
            </p>
          </div>
          <JobFeed />
        </Container>
      </section>
    </div>
  );
}
