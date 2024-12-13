"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";

interface Event {
  id: number;
  name: string;
  content: string;
  img: string;
}

const EventsPosts: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  // Fetch events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Failed to fetch events");

        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
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

  if (events.length === 0) {
    return (
      <Box textAlign="center" padding={2}>
        <Typography variant="h6" color="text.secondary">
          No events available.
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
      {events.map((event) => (
        <Card
          key={event.id}
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
            image={event.img}
            alt={event.name}
          />
          <CardContent>
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: 700 }}
              gutterBottom
            >
              {event.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
            >
              {event.content}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default EventsPosts;
