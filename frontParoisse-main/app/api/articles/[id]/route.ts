import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Vérifiez si l'ID est fourni
        if (!id) {
            return NextResponse.json(
                { error: "L'ID de l'article est requis." },
                { status: 400 }
            );
        }

        // Appeler le backend Go pour supprimer l'article
        const response = await fetch(`http://localhost:8080/api/articles/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const errorData = await response.json(); // Parse JSON si disponible
            console.error("Erreur lors de la suppression de l'article :", errorData);
            return NextResponse.json(
                { error: errorData.error || "Erreur lors de la suppression de l'article." },
                { status: response.status }
            );
        }

        // Retourner une réponse de succès
        return NextResponse.json(
            { message: "Article supprimé avec succès." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erreur interne lors de la suppression :", error);
        return NextResponse.json(
            { error: "Une erreur interne est survenue lors de la suppression de l'article." },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Vérifiez si l'ID est fourni
        if (!id) {
            return NextResponse.json(
                { error: "L'ID de l'article est requis." },
                { status: 400 }
            );
        }

        const body = await req.json();

        // Valider le contenu de la requête
        const { title, content } = body;
        if (!title || !content) {
            return NextResponse.json(
                { error: "Le titre et le contenu sont obligatoires." },
                { status: 400 }
            );
        }

        // Appeler le backend Go pour mettre à jour l'article
        const response = await fetch(`http://localhost:8080/api/articles/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, content }),
        });

        if (!response.ok) {
            const errorData = await response.json(); // Parse JSON si disponible
            console.error("Erreur lors de la mise à jour de l'article :", errorData);
            return NextResponse.json(
                { error: errorData.error || "Erreur lors de la mise à jour de l'article." },
                { status: response.status }
            );
        }

        // Retourner une réponse de succès
        return NextResponse.json(
            { message: "Article mis à jour avec succès." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erreur interne lors de la mise à jour :", error);
        return NextResponse.json(
            { error: "Une erreur interne est survenue lors de la mise à jour de l'article." },
            { status: 500 }
        );
    }
}