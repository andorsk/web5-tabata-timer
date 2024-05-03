import WorkoutSelectionView from "./WorkoutSelectionPage";
import PlayView from "./PlayWorkoutPage";

import React, { useState } from "react";

const Home = () => {
  const [playView, setPlayView] = useState<boolean>(false);
  return (
    <div>
      {!playView && <WorkoutSelectionView />}
      {playView && <PlayView />}
    </div>
  );
};

export default Home;
