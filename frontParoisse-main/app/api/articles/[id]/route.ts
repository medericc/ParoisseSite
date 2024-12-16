import { NextResponse } from "next/server";

export async function DELETE(req: Request, context: { params: { id: string } }) {
    try {
        // Récupération de l'ID depuis `context.params`
        const { id } = context.params;

        // Vérification si l'ID est fourni
        if (!id) {
            return NextResponse.json(
                { error: "L'ID de l'article est requis." },
                { status: 400 }
            );
        }

        // Récupération du token d'authentification (si nécessaire)
        const token = req.headers.get("Authorization")?.replace("Bearer ", "");
        console.log("Token envoyé :", token);

        if (!token) {
            return NextResponse.json(
                { error: "Token d'authentification manquant." },
                { status: 401 }
            );
        }

        // Appeler le backend Go pour supprimer l'article
        const response = await fetch(`http://localhost:8080/api/articles/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: token, // Passer le token dans l'en-tête
            },
        });

        // Gestion des erreurs côté backend
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                error: "Erreur inconnue du backend.",
            }));
            console.error("Erreur lors de la suppression de l'article :", errorData);
            return NextResponse.json(
                { error: errorData.error || "Erreur lors de la suppression de l'article." },
                { status: response.status }
            );
        }

        // Retourner une réponse réussie
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


export async function PUT(req: Request, context: { params: { id: string } }) {
    const { id } = await context.params;

    if (!id) {
        return NextResponse.json(
            { error: "L'ID de l'article est requis." },
            { status: 400 }
        );
    }

    try {
        const body = await req.json();
        const { title, content } = body;

        if (!title || !content) {
            return NextResponse.json(
                { error: "Le titre et le contenu sont obligatoires." },
                { status: 400 }
            );
        }

        // Récupération du token depuis les cookies (ou autre méthode si utilisée)
        const token = req.headers.get("Authorization")?.replace("Bearer ", "");
        console.log("Token envoyé :", token);
        if (!token) {
            return NextResponse.json(
                { error: "Token d'authentification manquant." },
                { status: 401 }
            );
        }
        

        // Requête au backend Go
        const response = await fetch(`http://localhost:8080/api/articles/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: token, // Passer le token ici
            },
            body: JSON.stringify({ title, content }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                error: "Erreur inconnue du backend.",
            }));
            console.error("Erreur lors de la mise à jour de l'article :", errorData);
            return NextResponse.json(
                { error: errorData.error || "Erreur lors de la mise à jour de l'article." },
                { status: response.status }
            );
        }

        return NextResponse.json(
            { message: "Article mis à jour avec succès." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erreur interne lors de la mise à jour :", error);
        return NextResponse.json(
            { error: "Erreur interne." },
            { status: 500 }
        );
    }
}