import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await fetch("http://localhost:8080/api/events", {
            method: "GET",
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch events" },
                { status: response.status }
            );
        }

        const data = await response.json(); // List of events
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Fetch events error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
