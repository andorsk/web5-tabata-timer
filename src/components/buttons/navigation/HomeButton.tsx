import React from "react";
import { useRouter } from "next/router";
import HomeIcon from "@mui/icons-material/Home";

const HomeButton = ({ fontSize = "large" }) => {
  const router = useRouter();

  return (
    <button className="text-white" onClick={() => router.push("/")}>
      <HomeIcon fontSize="large" />
    </button>
  );
};

export default HomeButton;
