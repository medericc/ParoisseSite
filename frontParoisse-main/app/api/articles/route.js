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

        const data = await response.json(); // Liste des articles
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Fetch articles error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
