// app/about/page.jsx
export const revalidate = false; // Static Site Generation

export default function About() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">About Our Job Portal</h1>
      <p className="text-gray-700 leading-relaxed">
        This platform helps job seekers and recruiters connect easily.
        It provides simple, fast, and efficient job searching and posting.
      </p>
    </main>
  );
}
