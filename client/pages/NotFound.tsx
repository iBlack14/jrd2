import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <main className="container max-w-3xl py-24">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">404</h1>
        <p className="mt-2 text-lg text-muted-foreground">La página que buscas no existe.</p>
        <p className="mt-1 text-sm text-muted-foreground">Ruta solicitada: {location.pathname}</p>
        <div className="mt-6">
          <a href="/" className="text-primary underline underline-offset-4">
            Volver al inicio
          </a>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
