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

const RecentPosts: React.FC = () => {
  const [recentArticle, setRecentArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
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
    <Card
      sx={{
        maxWidth: 600,
        margin: "0 auto",
        boxShadow: theme.shadows[3],
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
      }}
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
          {recentArticle.content}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Published on{" "}
          {new Date(recentArticle.published_at).toLocaleDateString()} by{" "}
          <strong>{recentArticle.username}</strong>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RecentPosts;
