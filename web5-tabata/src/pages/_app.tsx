// pages/_app.tsx
import { AppProps } from "next/app";
import { RoutineProvider } from "@/context/RoutineContext"; // Check the path

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RoutineProvider>
      <Component {...pageProps} />
    </RoutineProvider>
  );
}

export default MyApp;
