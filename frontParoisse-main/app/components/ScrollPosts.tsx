"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";

interface Article {
  id: number;
  title: string;
  content: string;
  image_url: string;
  published_at: string;
  username: string;
  category_name: string;
}

const ScrollPosts: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

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

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (articles.length === 0) {
    return (
      <Box textAlign="center" padding={2}>
        <Typography variant="h6" color="text.secondary">
          No articles available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        overflowX: "auto",
        whiteSpace: "nowrap",
        display: "flex",
        gap: 2,
        padding: 2,
        scrollbarWidth: "none", // Masquer la scrollbar
        "&::-webkit-scrollbar": { display: "none" }, // Masquer la scrollbar sous Webkit
      }}
    >
      {articles.map((article) => (
        <Card
          key={article.id}
          sx={{
            minWidth: 260,
            maxWidth: 300,
            boxShadow: theme.shadows[3],
            borderRadius: 2,
            flexShrink: 0, // Éviter que la carte rétrécisse dans le flex
            "&:hover": {
              transform: "scale(1.05)",
              transition: "transform 0.3s ease-in-out",
            },
          }}
        >
          <CardMedia
            component="img"
            height="140"
            image={article.image_url}
            alt={article.title}
          />
          <CardContent>
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: 700 }}
              gutterBottom
            >
              {article.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
            >
              {article.content}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              By {article.username}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ScrollPosts;
