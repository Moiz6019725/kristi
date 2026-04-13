import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-black to-gray-800 bg-clip-text text-transparent mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Last updated: October 10, 2024
          </p>
        </div>

        <div className="prose prose-headings:text-2xl prose-headings:font-bold prose-h2:mt-12 prose-p:text-lg prose-p:leading-relaxed prose-li:text-lg max-w-none">
          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to Kristi ("we", "our", or "us"). These Terms of Service ("Terms") govern your use of our e-commerce website and services (the "Service").
              By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, please do not use the Service.
            </p>
          </section>

          <section>
            <h2>2. User Eligibility</h2>
            <p>You must be at least 18 years old to use this Service. By using the Service, you represent that you meet this requirement.</p>
          </section>

          <section>
            <h2>3. Accounts</h2>
            <p>
              When you create an account, you must provide accurate information. You are responsible for maintaining the confidentiality of your account and password.
              Notify us immediately of any unauthorized use.
            </p>
          </section>

          <section>
            <h2>4. Products and Orders</h2>
            <p>
              All product descriptions are as accurate as possible. We reserve the right to modify prices or discontinue products without notice.
              Orders are subject to acceptance; we may refuse or cancel orders for any reason.
            </p>
          </section>

          <section>
            <h2>5. Payments</h2>
            <p>
              Payments are processed securely via our payment gateways. All payments are in PKR (Rs). You agree to pay the full amount at checkout.
              Taxes, duties, and shipping fees are your responsibility unless stated otherwise.
            </p>
          </section>

          <section>
            <h2>6. Shipping and Delivery</h2>
            <p>
              Enjoy <strong>free shipping</strong> on orders above Rs 3500 within Pakistan. Delivery times vary; we are not responsible for delays by carriers.
            </p>
          </section>

          <section>
            <h2>7. Returns and Refunds</h2>
            <p>
              <strong>Free returns within 15 days</strong> for undamaged items. Contact support before returning. Refunds issued to original payment method within 7-10 days post-inspection.
              Certain items (e.g., custom, undergarments) are non-returnable.
            </p>
          </section>

          <section>
            <h2>8. User Content</h2>
            <p>
              Reviews, ratings, and comments are your responsibility. You grant us a license to use them. We may remove inappropriate content.
            </p>
          </section>

          <section>
            <h2>9. Intellectual Property</h2>
            <p>
              All content on the Service is owned by Kristi or licensors. You may not reproduce without permission.
            </p>
          </section>

          <section>
            <h2>10. Limitation of Liability</h2>
            <p>
              The Service is provided "as is". We disclaim all warranties. Liability is limited to the amount you paid us.
            </p>
          </section>

          <section>
            <h2>11. Termination</h2>
            <p>We may suspend or terminate your access for violations of these Terms.</p>
          </section>

          <section>
            <h2>12. Governing Law</h2>
            <p>These Terms are governed by the laws of Pakistan. Disputes resolved in Lahore courts.</p>
          </section>

          <section>
            <h2>13. Changes to Terms</h2>
            <p>We may update these Terms. Continued use constitutes acceptance.</p>
          </section>

          <section>
            <h2>14. Contact Us</h2>
            <p>
              Questions? Email: support@kristi.pk or use our <Link href="/contact" className="text-blue-600 hover:underline">contact form</Link>.
            </p>
          </section>

          <div className="text-center mt-16 p-8 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              &copy; 2024 Kristi. All rights reserved.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
