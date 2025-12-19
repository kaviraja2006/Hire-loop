import Container from "@/components/ui/Container";

// Static Site Generation - Pre-rendered at build time
export const revalidate = false;

export default function About() {
  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Hire Loop</h1>

        <p className="text-lg text-gray-700 mb-6">
          Hire Loop is a modern job posting platform connecting talented
          professionals with exciting career opportunities. Our mission is to
          streamline the hiring process and make it easier for companies to find
          the right talent.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-xl mb-2">Our Mission</h3>
            <p className="text-gray-600">
              Connecting talent with opportunity through innovative technology
              and seamless user experience.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-xl mb-2">Founded</h3>
            <p className="text-gray-600">2024</p>
            <p className="text-sm text-gray-500 mt-2">
              Built with Next.js and modern web technologies
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-xl mb-2">Team Size</h3>
            <p className="text-gray-600">10+ professionals</p>
            <p className="text-sm text-gray-500 mt-2">
              Dedicated to building the best hiring platform
            </p>
          </div>
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Why Choose Hire Loop?</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Easy-to-use interface for posting and browsing jobs</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Secure authentication with Clerk</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Fast, reliable, and built with modern technologies</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Responsive design that works on all devices</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            This page uses <strong>Static Site Generation (SSG)</strong> -
            pre-rendered at build time for maximum performance.
          </p>
        </div>
      </div>
    </Container>
  );
}
