// utils/fetchBlogs.js

export const fetchBlogs = async () => {
    try {
      // Remplacez ceci par l'URL de votre API ou de votre backend
      const response = await fetch("/api/blogs"); // URL de l'API qui retourne les blogs
      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }
  
      const blogs = await response.json();
      return blogs;
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return []; // Retourne un tableau vide en cas d'erreur
    }
  };
  