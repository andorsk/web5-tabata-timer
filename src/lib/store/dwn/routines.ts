import { Routine } from "@/models/workout";
import { routineProtocol } from "@/lib/protocols/routine";
import { Web5 } from "@web5/api";

export const configureProtocol = async (web5: Web5) => {
  const { protocol, status } = await web5.dwn.protocols.configure({
    message: {
      definition: routineProtocol,
    },
  });
  if (status.code !== 202) {
    throw new Error("failed to store routine");
  }
};

export const storeRoutine = async (routine: Routine, web5: Web5) => {
  if (!routine.config) {
    throw new Error("routine config is missing");
  }
  const payload = JSON.stringify(routine);
  const replyResponse = await web5.dwn.records.create({
    store: true,
    data: payload,
    message: {
      dataFormat: "application/json",
      schema: routineProtocol.types.routine.schema,
      protocol: routineProtocol.protocol,
      protocolPath: "routine",
    },
  });
  if (replyResponse.status.code !== 202) {
    throw new Error("failed to store routine");
  }
};

export const getRoutines = async (web5: Web5) => {
  const records = await web5.dwn.records.query({
    message: {
      filter: {
        protocol: routineProtocol.protocol,
        protocolPath: "routine",
        dataFormat: "application/json",
        schema: routineProtocol.types.routine.schema,
      },
    },
  });
  return records;
};

export const getRoutine = async (id: string, web5: Web5): Promise<Routine> => {
  let { record } = await web5.dwn.records.read({
    message: {
      filter: {
        recordId: id,
      },
    },
  });
  const r = await record.data.json();
  return r as Routine;
};
