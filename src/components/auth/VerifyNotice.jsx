// src/pages/VerifyNotice.jsx
export default function VerifyNotice() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">
          Vérification de votre e-mail
        </h2>
        <p className="text-gray-700 mb-4">
          Merci pour votre inscription !
        </p>
        <p className="text-gray-700">
          Un e-mail de confirmation a été envoyé à votre adresse.
          <br />
          Veuillez cliquer sur le lien dans cet e-mail pour activer votre compte.
        </p>
      </div>
    </div>
  );
}
