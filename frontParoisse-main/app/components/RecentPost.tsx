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

const RecentPosts: React.FC = () => {
  const [recentArticle, setRecentArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = useTheme();

  // Fetch articles from the API
  useEffect(() => {
    const fetchRecentArticle = async () => {
      try {
        const res = await fetch("/api/articles/recent");
        if (!res.ok) throw new Error("Failed to fetch articles");

        const data = await res.json();
        if (data.length > 0) {
          setRecentArticle(data[0]); // Le plus récent est le premier grâce au tri
        }
      } catch (error) {
        console.error("Error fetching recent article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentArticle();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

  if (!recentArticle) {
    return (
      <Box textAlign="center" padding={2}>
        <Typography variant="h6" color="text.secondary">
          No recent posts available.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Card */}
      <Card
        sx={{
          maxWidth: 600,
          margin: "0 auto",
          boxShadow: theme.shadows[3],
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.02)",
            transition: "transform 0.3s ease-in-out",
          },
        }}
        onClick={handleOpenModal}
      >
        <CardMedia
          component="img"
          height="300"
          image={recentArticle.image_url}
          alt={recentArticle.title}
          sx={{
            borderRadius: "4px 4px 0 0",
            objectFit: "cover",
          }}
        />
        <CardContent>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            {recentArticle.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginBottom: 2 }}
          >
            {recentArticle.content.substring(0, 100)}...
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Published on {" "}
            {new Date(recentArticle.published_at).toLocaleDateString()} by {" "}
            <strong>{recentArticle.username}</strong>
          </Typography>
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="recent-article-modal-title"
        aria-describedby="recent-article-modal-description"
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
          <Typography
            id="recent-article-modal-title"
            variant="h4"
            component="h2"
            gutterBottom
          >
            {recentArticle.title}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", marginBottom: 2 }}
          >
            Published on {" "}
            {new Date(recentArticle.published_at).toLocaleDateString()} by {" "}
            <strong>{recentArticle.username}</strong>
          </Typography>
          <img
            src={recentArticle.image_url}
            alt={recentArticle.title}
            style={{
              width: "100%",
              height: "auto",
              marginBottom: "16px",
              borderRadius: "8px",
            }}
          />
          <Typography id="recent-article-modal-description" variant="body1">
            {recentArticle.content}
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default RecentPosts;
