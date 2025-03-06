
import { useEffect, useState } from "react";

const LoadingScreen = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
      <div className="relative h-20 w-20 mb-4">
        <div className="absolute inset-0 bg-meditation-calm-blue rounded-full animate-breathe opacity-20"></div>
        <div className="absolute inset-2 bg-meditation-calm-blue rounded-full animate-breathe opacity-40" style={{ animationDelay: "0.5s" }}></div>
        <div className="absolute inset-4 bg-meditation-calm-blue rounded-full animate-breathe opacity-60" style={{ animationDelay: "1s" }}></div>
        <div className="absolute inset-6 bg-meditation-calm-blue rounded-full animate-breathe opacity-80" style={{ animationDelay: "1.5s" }}></div>
      </div>
      <p className="text-lg text-meditation-deep-blue font-light tracking-wider">
        Finding calm{dots}
      </p>
    </div>
  );
};

export default LoadingScreen;
