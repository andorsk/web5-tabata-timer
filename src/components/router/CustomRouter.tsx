// CustomRouter.js
import { useRouter } from "next/router";
import { useEffect } from "react";

const CustomRouter = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
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
