export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Privacy Policy for Revisely</h1>
      <div className="space-y-4">
        <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

        <h2 className="text-xl font-bold">1. Introduction</h2>
        <p>Welcome to Revisely. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.</p>

        <h2 className="text-xl font-bold">2. Information We Collect</h2>
        <p>We may collect information about you in a variety of ways. The information we may collect on the Service includes:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Personal Data:</strong> Personally identifiable information, such as your name and email address, that you voluntarily give to us when you register with the Service.</li>
          <li><strong>Uploaded Documents:</strong> We collect the PDF documents you upload to the Service in order to provide you with our features, such as answering questions about the documents and generating quizzes.</li>
          <li><strong>Chat History:</strong> We store your chat history with our AI assistant to improve our service and your user experience.</li>
        </ul>

        <h2 className="text-xl font-bold">3. Use of Your Information</h2>
        <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Create and manage your account.</li>
          <li>Provide you with the core services of the application, such as generating quizzes and answering questions based on your uploaded documents.</li>
          <li>Improve our services and your experience.</li>
          <li>Respond to your comments and questions and provide customer service.</li>
        </ul>

        <h2 className="text-xl font-bold">4. Disclosure of Your Information</h2>
        <p>We do not share your information with third parties, except as described in this Privacy Policy or with your consent.</p>

        <h2 className="text-xl font-bold">5. Security of Your Information</h2>
        <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

        <h2 className="text-xl font-bold">6. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal data. You can manage your account and uploaded documents through the application dashboard.</p>

        <h2 className="text-xl font-bold">7. Contact Us</h2>
        <p>If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:codeforgenet@icloud.com" className="text-blue-500 hover:underline">codeforgenet@icloud.com</a></p>
      </div>
    </div>
  );
}
