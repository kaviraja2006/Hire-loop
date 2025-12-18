import PostJobForm from "@/components/features/job/PostJobForm";
import Container from "@/components/ui/Container";

export default function PostJobPage() {
  return (
    <Container className="max-w-4xl mt-12">
      <div className="mb-8">
        <h1 className="text-3xl mb-3 font-semibold">Post a New Job</h1>
        <p className="text-lg text-muted-foreground">
          Share your opportunity with talented professionals looking for their
          next career move.
        </p>
      </div>
      <PostJobForm />
    </Container>
  );
}
