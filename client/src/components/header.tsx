
import Link from 'next/link';
import Logo from './logo';
import SearchBar from './search-bar';
import { Button } from './ui/button';
import { Menu, Search } from 'lucide-react'; 
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const Header = () => {
  const desktopNavItems = [
    { href: '/terms', label: 'Terms' },
    { href: '/policy', label: 'Policy' },
  ];

  const mobileNavItems = [
    { href: '/', label: 'Home', icon: <Search className="h-5 w-5 mr-2 text-muted-foreground" /> }, // Placeholder, ideally Home icon
    { href: '/search', label: 'Search', icon: <Search className="h-5 w-5 mr-2 text-muted-foreground" /> },
    { href: '/terms', label: 'Terms', icon: <Search className="h-5 w-5 mr-2 text-muted-foreground" /> }, // Placeholder
    { href: '/policy', label: 'Policy', icon: <Search className="h-5 w-5 mr-2 text-muted-foreground" /> }, // Placeholder
  ];


  return (
    <header className="bg-card/95 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-border">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Logo />
        
        <div className="flex-grow max-w-md mx-4 hidden md:block">
          <SearchBar />
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          {desktopNavItems.map((item) => (
            <Button key={item.href} variant="ghost" asChild className="text-sm px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/10">
              <Link href={item.href}>
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-3/4 bg-background p-0">
              <div className="p-4 border-b border-border">
                <Logo />
              </div>
              <div className="p-4">
                <SearchBar />
              </div>
              <nav className="flex flex-col space-y-1 p-4">
                {mobileNavItems.map((item) => (
                   <SheetClose asChild key={item.href}>
                    <Button variant="ghost" asChild className="justify-start text-base px-3 py-3 text-foreground hover:bg-primary/10 hover:text-primary">
                      <Link href={item.href} className="flex items-center">
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </Button>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
