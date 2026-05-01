import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Kontrollojmë nëse përdoruesi nuk është lart (p.sh. më shumë se 10px)
    if (window.scrollY > 10) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth' // Kjo krijon animacionin
      });
    }
  }, [pathname]);

  return null;
}