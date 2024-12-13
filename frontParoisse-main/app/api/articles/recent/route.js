import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await fetch("http://localhost:8080/api/articles", {
            method: "GET",
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch articles" },
                { status: response.status }
            );
        }

        // Récupérer les articles
        const data = await response.json();

        // Trier les articles par published_at dans l'ordre décroissant
        const sortedArticles = data.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

        return NextResponse.json(sortedArticles, { status: 200 });
    } catch (error) {
        console.error("Fetch articles error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
