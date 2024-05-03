import WorkoutSelectionView from "./WorkoutSelectionPage";

import React, { useState } from "react";

const Home = () => {
  const [playView, setPlayView] = useState<boolean>(false);
  return <div>{!playView && <WorkoutSelectionView />}</div>;
};

export default Home;
