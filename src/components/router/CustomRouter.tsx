// CustomRouter.js
import { useRouter } from "next/router";
import { useEffect } from "react";

// @ts-ignore
const CustomRouter = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url !== "/") {
        router.push("/");
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  return children;
};

export default CustomRouter;
