import React, { useState } from "react";
import {
  RoutineConfiguration,
  TimedIntervalConfiguration,
} from "@/models/workout"; // Import your types from the correct location
import { useWeb5 } from "@/context/Web5Context";
import { storeRoutine } from "@/lib/store/dwn/routines";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/reducers";

// Validation function
export const validateRoutineConfiguration = (
  config: RoutineConfiguration,
): boolean => {
  return (
    config.Prepare.duration >= 0 &&
    config.Work.duration >= 0 &&
    config.Rest.duration >= 0 &&
    config.Cycles.value >= 1 &&
    config.Sets.value >= 1 &&
    config.RestBetweenSteps.duration >= 0 &&
    config.CoolDown.duration >= 0
  );
};

type RoutineConfigurationFormProps = {
  onSubmitted: () => void;
};

const RoutineConfigurationForm: React.FC<RoutineConfigurationFormProps> = ({
  onSubmitted,
}) => {
  const web5state = useSelector((state: RootState) => state.web5);

  const [routineConfig, setRoutineConfig] = useState({
    name: "",
    description: "",
    config: {
      Prepare: { duration: 300, name: "Preparation", value: 60 },
      Work: { duration: 50, name: "Work", value: 30 },
      Rest: { duration: 60, name: "Rest", value: 10 },
      Cycles: { value: 6, name: "Cycles" },
      Sets: { value: 4, name: "Sets" },
      RestBetweenSteps: {
        duration: 120,
        name: "Rest Between Cycles",
        value: 30,
      },
      CoolDown: { duration: 300, name: "Cool Down", value: 60 },
    },
  });

  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (event: any, key: string) => {
    let value = event.target.value;

    if (event.target.type === "number") {
      const parsedValue = parseInt(value);
      if (!isNaN(parsedValue)) {
        value = parsedValue;
        if (parsedValue < 0) {
          console.error("no negative values allowed");
          return;
        }
      } else {
        console.error("Invalid input for number field");
        return;
      }
    }
    const keys = key.split(".");
    const updatedRoutineConfig = { ...routineConfig };
    let currentObj = updatedRoutineConfig;

    for (let i = 0; i < keys.length; i++) {
      const currentKey = keys[i];
      if (i === keys.length - 1) {
        // @ts-ignore
        currentObj[currentKey] = value;
      } else {
        // @ts-ignore
        currentObj = currentObj[currentKey];
      }
    }
    setRoutineConfig(updatedRoutineConfig);
  };

  const isTimedIntervalConfiguration = (
    value: any,
  ): value is TimedIntervalConfiguration => {
    return typeof value === "object" && "duration" in value;
  };

  const multiplyDurationsBy1000 = (
    config: RoutineConfiguration,
  ): RoutineConfiguration => {
    const adjustedConfig: RoutineConfiguration = JSON.parse(
      JSON.stringify(config),
    );
    for (const key in adjustedConfig) {
      // @ts-ignore
      if (adjustedConfig.hasOwnProperty(key)) {
        // @ts-ignore
        const value = adjustedConfig[key];
        if (isTimedIntervalConfiguration(value)) {
          // @ts-ignore
          adjustedConfig[key].duration *= 1000;
        }
      }
    }
    return adjustedConfig;
  };

  // @ts-ignore
  const storeRoutineWrapper = async (routineConfig, web5) => {
    const adjustedRoutineConfig = multiplyDurationsBy1000(routineConfig.config);
    const configToSave = { ...routineConfig, config: adjustedRoutineConfig };
    console.log("saving config", configToSave);
    await storeRoutine(configToSave, web5);
    onSubmitted();
  };

  // Function to handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(routineConfig.config);
    const isValid = true;
    //  const isValid = validateRoutineConfiguration(routineConfig.config);
    if (isValid) {
      setErrors([]);
      storeRoutineWrapper(routineConfig, web5state.web5);
    } else {
      setErrors(["Invalid routine configuration. Please check your inputs."]);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full overflow-y-auto">
        <div className="text-center text-2xl">
          <h1>Routine Configuration</h1>
        </div>
        <form
          className="flex flex-col items-center space-y-4"
          onSubmit={handleSubmit}
        >
          {/* Form inputs */}
          {errors.length > 0 && (
            <div className="text-red-600">
              {errors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
          <div className="flex flex-col w-full">
            <label className="mb-1 flex justify-between">
              Routine Name:
              <input
                type="text"
                value={routineConfig.name}
                onChange={(e) => handleInputChange(e, "name")}
                className="py-2 px-3 border border-gray-300 rounded-md"
              />
            </label>
          </div>
          <div className="flex flex-col w-full">
            <label className="mb-1 flex justify-between">
              Routine Description:
              <input
                type="textarea"
                value={routineConfig.description}
                onChange={(e) => handleInputChange(e, "description")}
                className="py-2 px-3 border border-gray-300 rounded-md"
              />
            </label>
          </div>
          <div className="flex flex-col w-full">
            <label className="mb-1 flex justify-between">
              Prepare Time (seconds):
              <input
                type="number"
                value={routineConfig.config.Prepare.duration}
                onChange={(e) =>
                  handleInputChange(e, "config.Prepare.duration")
                }
                className="py-2 px-3 border border-gray-300 rounded-md"
              />
            </label>
          </div>
          <div className="flex flex-col w-full">
            <label className="mb-1 flex justify-between">
              Number of Cycles:
              <input
                type="number"
                value={routineConfig.config.Cycles.value}
                onChange={(e) => handleInputChange(e, "config.Cycles.value")}
                className="py-2 px-3 border border-gray-300 rounded-md"
              />
            </label>
          </div>
          <div className="flex flex-col w-full">
            <label className="mb-1 flex justify-between">
              Number of Sets:
              <input
                type="number"
                value={routineConfig.config.Sets.value}
                onChange={(e) => handleInputChange(e, "config.Sets.value")}
                className="py-2 px-3 border border-gray-300 rounded-md"
              />
            </label>
          </div>
          <div className="flex flex-col w-full">
            <label className="mb-1 flex justify-between">
              Time Per Work (seconds):
              <input
                type="number"
                value={routineConfig.config.Work.duration}
                onChange={(e) => handleInputChange(e, "config.Work.duration")}
                className="py-2 px-3 border border-gray-300 rounded-md"
              />
            </label>
          </div>
          <div className="flex flex-col w-full">
            <label className="mb-1 flex justify-between">
              Time Per Rest (seconds):
              <input
                type="number"
                value={routineConfig.config.Rest.duration}
                onChange={(e) => handleInputChange(e, "config.Rest.duration")}
                className="py-2 px-3 border border-gray-300 rounded-md"
              />
            </label>
          </div>
          <div className="flex flex-col w-full">
            <label className="mb-1 flex justify-between">
              Rest Between Sets (seconds):
              <input
                type="number"
                value={routineConfig.config.RestBetweenSteps.duration}
                onChange={(e) =>
                  handleInputChange(e, "config.RestBetweenSteps.duration")
                }
                className="py-2 px-3 border border-gray-300 rounded-md"
              />
            </label>
          </div>
          <div className="flex flex-col w-full">
            <label className="mb-1 flex justify-between">
              Cooldown Time (seconds):
              <input
                type="number"
                value={routineConfig.config.CoolDown.duration}
                onChange={(e) =>
                  handleInputChange(e, "config.CoolDown.duration")
                }
                className="py-2 px-3 border border-gray-300 rounded-md"
              />
            </label>
          </div>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Configuration
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoutineConfigurationForm;
