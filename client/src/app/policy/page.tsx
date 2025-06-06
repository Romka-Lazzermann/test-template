
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Muse Blog',
  description: 'Read the Privacy Policy for Muse Blog.',
};

export default function PolicyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="shadow-lg bg-card border-border">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-bold text-center text-primary">
            Privacy Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 prose prose-lg max-w-none text-foreground/90 prose-headings:text-primary prose-headings:font-semibold prose-a:text-accent hover:prose-a:underline prose-strong:text-foreground prose-blockquote:border-accent prose-blockquote:text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <p>Muse Blog ("us", "we", or "our") operates the Muse Blog website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>

          <section>
            <h2 className="text-2xl font-semibold">1. Information Collection and Use</h2>
            <p>We collect several different types of information for various purposes to provide and improve our Service to you. This may include, but is not limited to, email addresses for newsletter subscriptions and usage data for analytics.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">2. Types of Data Collected</h2>
            <h3 className="text-xl font-semibold mt-4">Personal Data</h3>
            <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to, your email address.</p>
            <h3 className="text-xl font-semibold mt-4">Usage Data</h3>
            <p>We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">3. Use of Data</h2>
            <p>Muse Blog uses the collected data for various purposes:</p>
            <ul className="list-disc pl-6">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To provide you with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless you have opted not to receive such information (e.g. newsletter)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">4. Cookies</h2>
            <p>We use cookies and similar tracking technologies to track the activity on our Service and we hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold">5. Security of Data</h2>
            <p>The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">6. Links to Other Sites</h2>
            <p>Our Service may contain links to other sites that are not operated by us. If you click a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">7. Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "last updated" date at the top of this Privacy Policy.</p>
          </section>

          <p className="mt-8">If you have any questions about this Privacy Policy, please contact us.</p>
        </CardContent>
      </Card>
    </div>
  );
}
