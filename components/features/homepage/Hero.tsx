import Container from "@/components/ui/Container";

export default function Hero() {
  return (
    <section className="bg-linear-to-b from-muted/50 to-background">
      <Container className="min-h-[400px] grid items-center ">
        <div className="max-w-3xl text-center mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tighter">
            Find Your Dream Job
          </h1>
          <p className="text-balance text-lg text-muted-foreground lg:text-xl">
            Connect with top employers and discover career opportunities that
            match your skills and aspirations.
          </p>
        </div>
      </Container>
    </section>
  );
}
