"use client";

import React, { useEffect, useState } from "react";

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
  const [categories, setCategories] = useState<string[]>(["Catégorie 1", "Catégorie 2", "Catégorie 3", "Catégorie 4"]);

  // Fetch articles from the API
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

  // Handle category change
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(Number(event.target.value) || "1");
  };

  const filteredArticles = selectedCategory === "1" ? articles : articles.filter(article => article.category_name === selectedCategory);

  if (loading) {
    return <div className="text-center">Loading articles...</div>;
  }

  return (
    <div className="w-full">
      {/* Responsive Category Dropdown */}
      <div className="mb-4 flex justify-center">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 border rounded-md bg-white shadow-md"
        >
          {categories.map((category, index) => (
            <option key={index} value={category === "Catégorie 1" ? "Catégorie 1" : category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Posts */}
      <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex space-x-4">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="w-64 min-w-[16rem] p-4 bg-white rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SortPosts;
