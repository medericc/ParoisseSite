// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    const { email, password } = req.body;

    try {
        // Appel au backend en Go
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            return res.status(response.status).json(error);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        console.error('Erreur:', err);
        res.status(500).json({ message: 'Erreur serveur. Veuillez réessayer.' });
    }
};

export default handler;
