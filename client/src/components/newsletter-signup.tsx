
"use client";

import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';

const NewsletterSignup = ({ embedded = false }: { embedded?: boolean }) => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    console.log('Newsletter signup for:', email);
    toast({
      title: "Subscribed!",
      description: "Thanks for subscribing to our newsletter.",
      variant: "default",
    });
    setEmail('');
  };

  return (
    <div className={`rounded-lg ${embedded ? 'bg-transparent' : 'bg-card shadow-md p-6 border border-border'}`}>
      {!embedded && (
         <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-center text-foreground">
            Stay Updated
        </h3>
      )}
      <p className={`mb-4 sm:mb-6 text-sm text-center ${embedded ? 'text-muted-foreground' : 'text-card-foreground'}`}>
        Subscribe to our newsletter for the latest articles and updates.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-center max-w-lg mx-auto">
        <div className="relative flex-grow w-full sm:w-auto">
           <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
           <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 w-full h-10 text-sm bg-input border-border focus:border-primary rounded-md"
            aria-label="Email for newsletter"
          />
        </div>
        <Button type="submit" className="w-full sm:w-auto h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md shrink-0">
          Subscribe
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSignup;
