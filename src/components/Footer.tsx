import { portfolioData } from "@/lib/data";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full">
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} {portfolioData.name}. All rights reserved.</p>
        <p className="mt-1">Built with Next.js and Tailwind CSS.</p>
      </div>
    </footer>
  );
};

export default Footer;
