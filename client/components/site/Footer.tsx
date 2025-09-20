import { useLocation } from "react-router-dom";

export default function SiteFooter() {
  const location = useLocation();
  if (location.pathname.startsWith("/dashboard")) return null;
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 md:h-20 md:flex-row">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          © {new Date().getFullYear()} LexFlow CMS · Estudio Jurídico
        </p>
        <div className="flex items-center gap-6 text-sm text-muted-foreground" />
      </div>
    </footer>
  );
}
