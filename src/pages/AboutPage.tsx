export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-6">About Revisely</h1>
      <div className="space-y-4">
        <p>
          Revisely is an AI-powered learning assistant designed to help you get the most out of your study materials. Simply upload your PDFs, and Revisely will help you learn more effectively.
        </p>
        <h2 className="text-xl font-bold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Ask Questions:</strong> Chat with your documents and get instant answers to your questions.
          </li>
          <li>
            <strong>Generate Quizzes:</strong> Create quizzes from your study materials to test your knowledge.
          </li>
          <li>
            <strong>YouTube Recommendations:</strong> Get relevant YouTube videos based on the content of your PDFs.
          </li>
          <li>
            <strong>Revise with AI:</strong> Use the revise chat to have a conversation with an AI tutor about your study materials.
          </li>
        </ul>
        <p>
          Revisely is built with the latest technologies to provide a seamless and intuitive learning experience. We hope you enjoy using it!
        </p>
      </div>
    </div>
  );
}
