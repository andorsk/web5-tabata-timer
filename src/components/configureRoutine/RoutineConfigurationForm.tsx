import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { Routine, RoutineConfiguration } from "@/models/workout";
import { TimedIntervalConfiguration } from "@/models/workout";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

interface RoutineConfigurationFormProps {
  defaultValues?: Routine;
  onClose?: () => void;
  onSubmit?: (r: Routine) => void;
  title: string;
}

const defaultConfig = {
  name: "",
  description: "",
  config: {
    Prepare: { duration: 300000, name: "Preparation" },
    Work: { duration: 50000, name: "Work" },
    Rest: { duration: 60000, name: "Rest" },
    Cycles: { value: 6, name: "Cycles" },
    Sets: { value: 4, name: "Sets" },
    RestBetweenSteps: {
      duration: 120000,
      name: "Rest Between Sets",
    },
    CoolDown: { duration: 300000, name: "Cool Down" },
  },
};

const RoutineConfigurationForm: React.FC<RoutineConfigurationFormProps> = ({
  defaultValues = defaultConfig,
  onClose,
  onSubmit,
  title,
}) => {
  const validationSchema = Yup.object().shape({
    description: Yup.string(),
    config: Yup.object().shape({
      Prepare: Yup.object().shape({
        duration: Yup.number().required(
          "Prepare Duration is required. Must be greater than 0.",
        ),
        name: Yup.string().required("Prepare Name is required"),
      }),
      Work: Yup.object().shape({
        duration: Yup.number().required(
          "Work Duration is required. Must be greater than 0.",
        ),
        name: Yup.string().required("Work Name is required"),
      }),
      Rest: Yup.object().shape({
        duration: Yup.number().required(
          "Rest Duration is required. Must be greater than 0.",
        ),
        name: Yup.string().required("Rest Name is required"),
      }),
      Cycles: Yup.object().shape({
        value: Yup.number().required("Cycles Value is required"),
        name: Yup.string().required("Cycles Name is required"),
      }),
      Sets: Yup.object().shape({
        value: Yup.number().required("Sets Value is required"),
        name: Yup.string().required("Sets Name is required"),
      }),
      RestBetweenSteps: Yup.object().shape({
        duration: Yup.number().required(
          "Rest Between Steps Duration is required. Must be greater than 0.",
        ),
        name: Yup.string(),
      }),
      CoolDown: Yup.object().shape({
        duration: Yup.number().required(
          "Cool Down Duration is required. Must be greater than 0.",
        ),
        name: Yup.string().required("cool down name required"),
      }),
    }),
  });

  const handleSubmit = (values: Routine) => {
    const newRoutine = transformConfigDurationValues(values, (i: number) => {
      return i * 1000;
    });
    console.log("Form values:", newRoutine);
    if (onSubmit) {
      onSubmit(newRoutine);
    }
  };

  const isTimedConfiguration = (
    config: any,
  ): config is TimedIntervalConfiguration => {
    return "duration" in config;
  };

  const transformConfigDurationValues = (
    routine: Routine,
    f: (dur: number) => number,
  ): Routine => {
    const adjustedConfig: RoutineConfiguration = {
      Prepare: { duration: 0, name: "" },
      Work: { duration: 0, name: "" },
      Rest: { duration: 0, name: "" },
      Cycles: { value: 0, name: "" },
      Sets: { value: 0, name: "" },
      RestBetweenSteps: { duration: 0, name: "" },
      CoolDown: { duration: 0, name: "" },
    };

    for (const key in routine.config) {
      if (Object.prototype.hasOwnProperty.call(routine.config, key)) {
        // @ts-ignore
        const configValue = routine.config[key];
        // @ts-ignore
        adjustedConfig[key] = {
          ...configValue,
          duration: f(configValue.duration),
        };
      }
    }
    return { ...routine, config: adjustedConfig };
  };

  const adjustedInitialConfig = transformConfigDurationValues(
    defaultValues,
    (i: number) => {
      return i / 1000;
    },
  );

  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full overflow-y-auto">
        <div className="text-center mb-3 text-2xl">
          <h1>{title}</h1>
        </div>
        <div className="absolute top-0 right-0 p-2 text-4xl rounded">
          <button onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <Formik
          initialValues={adjustedInitialConfig}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="grid grid-cols-2 gap-4">
              {/* Form inputs */}
              <div>
                <label>
                  <span>{"Name"} </span>
                </label>
              </div>
              <div>
                <Field
                  type="text"
                  name="name"
                  className="py-2 px-3 border border-gray-300 rounded-md w-full"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div>
                <label>
                  <span>{"Routine Description"} </span>
                </label>
              </div>
              <div>
                <Field
                  type="text"
                  name="description"
                  className="py-2 px-3 border border-gray-300 rounded-md w-full"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500"
                />
              </div>
              {
                // @ts-ignore
                Object.keys(defaultValues.config).map((key) => (
                  <React.Fragment key={key}>
                    <div>
                      <label>
                        <span>
                          {
                            // @ts-ignore
                            defaultValues.config[key].name
                          }{" "}
                        </span>
                        {
                          // @ts-ignore
                          isTimedConfiguration(defaultValues.config[key]) ? (
                            <span>(seconds)</span>
                          ) : (
                            <span> Count </span>
                          )
                        }
                      </label>
                    </div>
                    <div>
                      <Field
                        type="number"
                        name={
                          // @ts-ignore
                          isTimedConfiguration(defaultValues.config[key])
                            ? `config.${key}.duration`
                            : `config.${key}.value`
                        }
                        className="py-2 px-3 border border-gray-300 rounded-md w-full"
                      />
                    </div>
                  </React.Fragment>
                ))
              }
              <div className="col-span-2 text-center">
                <button
                  type="submit"
                  className="py-2 px-4 rounded-md hover:bg-gray-500 w-full"
                >
                  <SaveIcon /> Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RoutineConfigurationForm;
