
import Link from 'next/link';
import Logo from './logo';
import NewsletterSignup from './newsletter-signup';

const Footer = () => {
  return (
    <footer className="bg-card text-muted-foreground border-t border-border mt-12 sm:mt-16 py-8 sm:py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 items-start">
          <div className="md:col-span-1 flex flex-col items-center md:items-start">
            <Logo />
            <p className="mt-3 text-sm text-center md:text-left max-w-xs text-muted-foreground">
              MuseBlog: Your daily source for inspiration, insights, and modern ideas.
            </p>
          </div>

          <div className="md:col-span-2">
            <NewsletterSignup embedded />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/70 flex flex-col sm:flex-row justify-between items-center text-xs">
          <p className="text-muted-foreground">&copy; {new Date().getFullYear()} MuseBlog. All rights reserved.</p>
          <nav className="flex space-x-4 mt-4 sm:mt-0">
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/policy" className="hover:text-primary transition-colors">Privacy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
