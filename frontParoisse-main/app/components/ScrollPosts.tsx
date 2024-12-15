"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
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
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const theme = useTheme();

  // Fetch articles from the API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/articles");
        if (!res.ok) throw new Error("Failed to fetch articles");

        const data: Article[] = await res.json();

        // Trier les articles du plus récent au plus ancien
        const sortedArticles = data.sort((a, b) =>
          new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        );

        setArticles(sortedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

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
    <>
      <Box
        sx={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          display: "flex",
          gap: 2,
          padding: 2,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
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
              flexShrink: 0,
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.05)",
                transition: "transform 0.3s ease-in-out",
              },
            }}
            onClick={() => handleArticleClick(article)}
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

      {/* Modal */}
      <Modal
        open={!!selectedArticle}
        onClose={handleCloseModal}
        aria-labelledby="article-modal-title"
        aria-describedby="article-modal-description"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "80%",
            maxHeight: "80%",
            overflowY: "auto",
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: theme.shadows[5],
            padding: 3,
          }}
        >
          {selectedArticle && (
            <>
              <Typography
                id="article-modal-title"
                variant="h4"
                component="h2"
                gutterBottom
              >
                {selectedArticle.title}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", marginBottom: 2 }}
              >
                Published on{" "}
                {new Date(selectedArticle.published_at).toLocaleDateString()} by{" "}
                <strong>{selectedArticle.username}</strong>
              </Typography>
              <img
                src={selectedArticle.image_url}
                alt={selectedArticle.title}
                style={{
                  width: "100%",
                  height: "auto",
                  marginBottom: "16px",
                  borderRadius: "8px",
                }}
              />
              <Typography id="article-modal-description" variant="body1">
                {selectedArticle.content}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ScrollPosts;
