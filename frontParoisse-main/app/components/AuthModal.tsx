"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Import du contexte

export default function AuthModal({ closeModal }: { closeModal: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false); // Gestion du mode inscription
  const [username, setUsername] = useState(""); // Nom d'utilisateur pour l'inscription

  const { login } = useAuth(); // Récupère la méthode login du contexte

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Connexion échouée");
        return;
      }

      const data = await response.json();
      console.log("Connexion réussie:", data);

      login(data.user.username, data.token); // Appelle login du contexte
      closeModal();
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError("Erreur interne. Réessayez plus tard.");
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Inscription échouée");
        return;
      }

      const data = await response.json();
      console.log("Inscription réussie:", data);

      login(data.user.username, data.token); // Appelle login du contexte
      closeModal();
    } catch (err) {
      console.error("Erreur d'inscription:", err);
      setError("Erreur interne. Réessayez plus tard.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {isSignup ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Inscription</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-4"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-4"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-4"
            />

            <div className="flex justify-end">
              <button
                onClick={() => setIsSignup(false)}
                className="mr-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Retour
              </button>
              <button
                onClick={handleSignup}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                S'inscrire
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Se connecter</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-4"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-4"
            />

            <div className="flex justify-between items-center">
              <button
                onClick={() => setIsSignup(true)}
                className="text-blue-600 hover:underline"
              >
                Pas de compte ? Inscris-toi
              </button>
              <div className="flex">
                <button
                  onClick={closeModal}
                  className="mr-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  onClick={handleLogin}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Se connecter
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
