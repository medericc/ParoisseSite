"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function CreateArticleModal({ closeModal }: { closeModal: () => void }) {
  const { username, isLoggedIn } = useAuth(); // Utilisation de useAuth pour éviter l'erreur
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [categoryNAME, setCategoryNAME] = useState(""); // ID de catégorie par défaut
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isLoggedIn || !username) {
      setError("Vous devez être connecté pour publier un article.");
      return;
    }

    const data = {
      title,
      content,
      image_url: imageURL,
      published_at: new Date().toISOString(),
      username, // Utilisation du nom d'utilisateur récupéré automatiquement
      category_name: categoryNAME,
    };

    console.log("Données envoyées :", data);

    try {
      const response = await fetch("/api/articles/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Erreur lors de la création de l'article :", errorData);
        setError("Une erreur est survenue lors de la création de l'article.");
        return;
      }

      const result = await response.json();
      console.log("Article créé avec succès :", result);
      closeModal();
    } catch (error) {
      console.error("Erreur réseau :", error);
      setError("Erreur de réseau. Veuillez réessayer.");
    }
  };

  const handleOutsideClick = (event: React.MouseEvent) => {
    // Si le clic provient de l'arrière-plan (en dehors du contenu), on ferme la modale
    const target = event.target as HTMLElement;
    if (target.id === "modal-background") {
      closeModal();
    }
  };

  return (
    <div
      id="modal-background"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()} // Empêche la propagation du clic à l'arrière-plan
      >
        <h2 className="text-xl font-semibold mb-4">Créer un article</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Titre
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Contenu
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="imageURL" className="block text-sm font-medium text-gray-700">
              URL de l'image
            </label>
            <input
              id="imageURL"
              type="text"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="categoryID" className="block text-sm font-medium text-gray-700">
              Catégorie
            </label>
            <select
              id="categoryNAME"
              value={categoryNAME}
              onChange={(e) => {
                const selectedValue = e.target.value;
                console.log("Valeur sélectionnée :", selectedValue);
                setCategoryNAME(selectedValue);
              }}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="Categorie 1">Categorie 1</option>
              <option value="Categorie 2">Categorie 2</option>
              <option value="Categorie 3">Categorie 3</option>
              <option value="Categorie 4">Categorie 4</option>
              <option value="Bible">Categorie 5</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="mr-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Publier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
