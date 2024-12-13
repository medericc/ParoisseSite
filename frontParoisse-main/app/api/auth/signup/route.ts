export async function POST(req: Request) {
  try {
    const { email, password, username } = await req.json();
    
    // Vérification simplifiée du mot de passe
    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: 'Password is too short' }),
        { status: 400 }
      );
    }

    // Vérification simplifiée du format de l'email
    if (!email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400 }
      );
    }

    // Envoi des données au backend (le serveur Golang)
    const response = await fetch('http://localhost:8080/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, username }),
    });

    if (!response.ok) {
      throw new Error('Failed to register');
    }

    const result = await response.json();
    return new Response(JSON.stringify(result), { status: response.status });

  } catch (error) {
    console.error('An error occurred:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing your request.' }),
      { status: 500 }
    );
  }
}
