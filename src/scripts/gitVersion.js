const fs = require("fs");
const { execSync } = require("child_process");

const getVersion = () => {
  try {
    // Get the latest git commit hash
    const commitHash = execSync("git rev-parse HEAD").toString().trim();
    // Get the current branch name
    const branch = execSync("git rev-parse --abbrev-ref HEAD")
      .toString()
      .trim();
    // Get the latest commit message
    const commitMessage = execSync("git log --format=%B -n 1")
      .toString()
      .trim();
    // Get the current date
    const currentDate = new Date().toISOString();

    // Construct the version object
    const version = {
      commitHash,
      branch,
      commitMessage,
      currentDate,
    };

    return version;
  } catch (error) {
    console.error("Error getting git version:", error);
    return null;
  }
};

// Write the version information to a JSON file
const writeVersionToFile = () => {
  const version = getVersion();
  if (version) {
    const filePath = "./public/version.json";
    fs.writeFileSync(filePath, JSON.stringify(version, null, 2));
    console.log("Version information written to", filePath);
  }
};

writeVersionToFile();
