'use client';
 
import { useEffect } from 'react';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}


// There are a few things you'll notice about the code above:

// "use client" - error.tsx needs to be a Client Component.
// It accepts two props:
// error: This object is an instance of JavaScript's native Error object.
// reset: This is a function to reset the error boundary. When executed, the function will try to re-render the route segment.


// Cuando usas un bloque try/catch, estás interceptando el error para manejarlo dentro de esa misma función. En otras palabras, al capturarlo, evitas que el error se propague hacia los boundaries de error del cliente, que es lo que normalmente dispara la pantalla de error. Si simplemente lanzas el error (sin try/catch), Next.js lo captura y muestra la pantalla de error predeterminada. Por eso, si deseas que se muestre la pantalla de error en el cliente, debes permitir que el error se propague o volver a lanzarlo desde el catch.