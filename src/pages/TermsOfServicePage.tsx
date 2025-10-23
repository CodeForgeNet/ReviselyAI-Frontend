export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Terms of Service for Revisely</h1>
      <div className="space-y-4">
        <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

        <h2 className="text-xl font-bold">1. Acceptance of Terms</h2>
        <p>By accessing or using the Revisely application (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Service.</p>

        <h2 className="text-xl font-bold">2. User Accounts</h2>
        <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>

        <h2 className="text-xl font-bold">3. User Content</h2>
        <p>Our Service allows you to upload and process documents ("User Content"). You retain any and all of your rights to any User Content you submit, post, or display on or through the Service and you are responsible for protecting those rights. We take no responsibility and assume no liability for User Content you or any third party posts on or through the Service.</p>

        <h2 className="text-xl font-bold">4. Acceptable Use</h2>
        <p>You agree not to use the Service for any purpose that is illegal or prohibited by these Terms. You agree not to use the Service in any manner that could damage, disable, overburden, or impair the Service.</p>

        <h2 className="text-xl font-bold">5. Intellectual Property</h2>
        <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Revisely and its licensors.</p>

        <h2 className="text-xl font-bold">6. Termination</h2>
        <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

        <h2 className="text-xl font-bold">7. Limitation of Liability</h2>
        <p>In no event shall Revisely, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

        <h2 className="text-xl font-bold">8. Changes to Terms</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>

        <h2 className="text-xl font-bold">9. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us at: <a href="mailto:codeforgenet@icloud.com" className="text-blue-500 hover:underline">codeforgenet@icloud.com</a></p>
      </div>
    </div>
  );
}
