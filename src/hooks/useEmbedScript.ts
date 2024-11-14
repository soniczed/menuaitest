import { useEffect, useState } from 'react';

interface UseEmbedScriptProps {
  embedId: string;
  baseApiUrl: string;
}

interface UseEmbedScriptReturn {
  isLoaded: boolean;
  error: Error | null;
  isDevelopment: boolean;
}

const useEmbedScript = ({ embedId, baseApiUrl }: UseEmbedScriptProps): UseEmbedScriptReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isDevelopment = import.meta.env.DEV;

  useEffect(() => {
    const scriptId = `anythingllm-embed-${embedId}`;
    const existingScript = document.getElementById(scriptId);

    // Handle development mode
    if (isDevelopment && baseApiUrl.includes('localhost')) {
      console.log('Development mode: Using mock embed implementation');
      setIsLoaded(true);
      return;
    }

    if (existingScript) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = isDevelopment 
      ? 'https://mock-embed-api.example.com/embed.js' // Development fallback
      : `${baseApiUrl}/embed.js`;
    script.async = true;
    script.setAttribute('data-embed-id', embedId);
    script.setAttribute('data-base-url', baseApiUrl);
    script.setAttribute('data-mode', isDevelopment ? 'development' : 'production');

    script.onload = () => {
      setIsLoaded(true);
      setError(null);
      if (isDevelopment) {
        console.log('Embed script loaded successfully');
      }
    };

    script.onerror = () => {
      const errorMessage = isDevelopment
        ? 'Failed to load embed script (Development Mode)'
        : 'Failed to load AnythingLLM embed script';
      setError(new Error(errorMessage));
      script.remove();
      
      if (isDevelopment) {
        console.log('Development mode: Widget functionality simulated');
        setIsLoaded(true); // Allow app to continue in development
      }
    };

    document.body.appendChild(script);

    return () => {
      if (!document.querySelector('[data-using-widget="true"]')) {
        script.remove();
        setIsLoaded(false);
      }
    };
  }, [embedId, baseApiUrl, isDevelopment]);

  return { isLoaded, error, isDevelopment };
};

export default useEmbedScript;