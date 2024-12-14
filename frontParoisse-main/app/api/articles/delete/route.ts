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
