"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface Article {
  id: number;
  title: string;
  content: string;
  image_url: string;
  published_at: string;
  username: string;
  category_name: string;
}

const SortPosts: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | string>("all");
  const [categories, setCategories] = useState<string[]>([
    "Categorie 1",
    "Categorie 2",
    "Categorie 3",
    "Categorie 4",
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [editMode, setEditMode] = useState(false); // Pour différencier vue/édition
  const [editedArticle, setEditedArticle] = useState<Partial<Article>>({}); // État temporaire pour l'édition

  const { isLoggedIn, userRole, username } = useAuth(); // Vérifie si l'utilisateur est connecté

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/articles");
        if (!res.ok) throw new Error("Failed to fetch articles");

        const data = await res.json();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  const handleDelete = async (id: number) => {
    const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cet article ?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete article");

      setArticles((prevArticles) => prevArticles.filter((article) => article.id !== id));
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  const handleOpenModal = (article: Article, edit = false) => {
    setCurrentArticle(article);
    setEditedArticle(article);
    setEditMode(edit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentArticle(null);
    setEditMode(false);
  };

  const handleEditChange = (field: keyof Article, value: string) => {
    setEditedArticle((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token manquant");

      const res = await fetch(`/api/articles/${editedArticle.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedArticle),
      });

      if (!res.ok) throw new Error("Failed to update article");

      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.id === editedArticle.id ? { ...article, ...editedArticle } : article
        )
      );

      handleCloseModal();
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  const filteredArticles =
    selectedCategory === "all"
      ? articles
      : articles.filter((article) => article.category_name === selectedCategory);

  if (loading) {
    return (
      <div className="text-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-center">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 border rounded-md bg-white shadow-md"
        >
          <option value="all">Toutes les catégories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex space-x-4">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="relative w-64 min-w-[16rem] p-4 bg-white rounded-lg shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => handleOpenModal(article)}
            >
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-40 object-cover rounded-md"
              />
              <h2 className="mt-4 text-lg font-bold text-gray-800">{article.title}</h2>
              <p className="text-sm text-gray-600 truncate">{article.content}</p>
              <p className="text-sm text-gray-600 truncate">{article.category_name}</p>
              <p className="mt-2 text-xs text-gray-500">By {article.username}</p>

              {(isLoggedIn && (userRole === "admin" || username === article.username)) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(article, true);
                  }}
                  className="absolute top-2 right-10 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                >
                  ✏️
                </button>
              )}

              {isLoggedIn && userRole === "admin" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(article.id);
                  }}
                  className="absolute bottom-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                >
                  🗑
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxHeight: "80%",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          {editMode && currentArticle ? (
            <>
              <Typography variant="h5" component="h2" gutterBottom>
                Modifier l'article
              </Typography>
              <TextField
                label="Titre"
                fullWidth
                margin="normal"
                value={editedArticle.title}
                onChange={(e) => handleEditChange("title", e.target.value)}
              />
              <TextField
                label="Contenu"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                value={editedArticle.content}
                onChange={(e) => handleEditChange("content", e.target.value)}
              />
              <TextField
                label="URL de l'image"
                fullWidth
                margin="normal"
                value={editedArticle.image_url}
                onChange={(e) => handleEditChange("image_url", e.target.value)}
              />
              <div className="mt-4 flex justify-end">
                <Button variant="contained" color="primary" onClick={handleSave}>
                  Sauvegarder
                </Button>
              </div>
            </>
          ) : (
            currentArticle && (
              <>
                <Typography variant="h5" component="h2" gutterBottom>
                  {currentArticle.title}
                </Typography>
                <img
                  src={currentArticle.image_url}
                  alt={currentArticle.title}
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {currentArticle.content}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 2, display: "block" }}
                >
                  Published on {new Date(currentArticle.published_at).toLocaleDateString()} by {" "}
                  <strong>{currentArticle.username}</strong>
                </Typography>
              </>
            )
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default SortPosts;
