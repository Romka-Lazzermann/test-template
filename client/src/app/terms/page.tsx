
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Muse Blog',
  description: 'Read the Terms of Service for Muse Blog.',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="shadow-lg bg-card border-border">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-bold text-center text-primary">
            Terms of Service
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 prose prose-lg max-w-none text-foreground/90 prose-headings:text-primary prose-headings:font-semibold prose-a:text-accent hover:prose-a:underline prose-strong:text-foreground prose-blockquote:border-accent prose-blockquote:text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <section>
            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p>By accessing and using Muse Blog (the "Website"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this Website.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">2. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. We will do so by posting and drawing attention to the updated terms on the Website. Your decision to continue to visit and make use of the Website after such changes have been made constitutes your formal acceptance of the new Terms of Service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">3. Use of the Website</h2>
            <p>You agree to use the Website only for lawful purposes. You are prohibited from posting on or transmitting through the Website any material that is harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, sexually explicit, profane, hateful, or otherwise objectionable.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">4. Intellectual Property</h2>
            <p>All content included on the Website, such as text, graphics, logos, images, as well as the compilation thereof, and any software used on the Website, is the property of Muse Blog or its suppliers and protected by copyright and other laws.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold">5. Disclaimer of Warranties</h2>
            <p>The Website and its content are provided "as is". We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">6. Limitation of Liability</h2>
            <p>In no event shall Muse Blog or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Muse Blog's Website, even if Muse Blog or a Muse Blog authorized representative has been notified orally or in writing of the possibility of such damage.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">7. Governing Law</h2>
            <p>Any claim relating to Muse Blog's Website shall be governed by the laws of the jurisdiction of the Website owner's principal place of business without regard to its conflict of law provisions.</p>
          </section>

          <p className="mt-8">If you have any questions about these Terms, please contact us.</p>
        </CardContent>
      </Card>
    </div>
  );
}
