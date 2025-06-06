
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
      <span className="text-primary">Muse</span>
      <span className="text-foreground">Blog</span>
    </Link>
  );
};

export default Logo;
