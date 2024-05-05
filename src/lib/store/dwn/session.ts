import { WorkoutSession } from "@/models/workout";
import { Web5 } from "@web5/api";
import { routineProtocol } from "@/lib/protocols/routine";

export const deleteSession = async (id: string, web5: Web5) => {
  console.log("deleting session", id);
  const deleteResult = await web5.dwn.records.delete({
    message: {
      recordId: id,
    },
  });
  if (deleteResult.status.code !== 202) {
    console.log(deleteResult);
    throw new Error("failed to delete session");
  }
  console.log("deleted session", id);
};

export const getSessions = async (web5: Web5) => {
  console.log("getting sessions");
  const records = await web5.dwn.records.query({
    message: {
      filter: {
        protocol: routineProtocol.protocol,
        protocolPath: "session",
        dataFormat: "application/json",
        schema: routineProtocol.types.session.schema,
      },
    },
  });
  console.log("^^^^^^ returning records", records);
  return records;
};

export const getSession = async (
  id: string,
  web5: Web5,
): Promise<WorkoutSession> => {
  let { record } = await web5.dwn.records.read({
    message: {
      filter: {
        recordId: id,
      },
    },
  });
  const session = await record.data.json();
  // TODO: add better handling for failed message
  return session as WorkoutSession;
};

export const updateSession = async (session: WorkoutSession, web5: Web5) => {
  if (session.id === undefined) {
    throw new Error("session id is missing");
  }

  return;
  const sessionCopy = { ...session };
  let { record } = await web5.dwn.records.read({
    message: {
      filter: {
        recordId: sessionCopy.id,
      },
    },
  });
  sessionCopy.id = undefined;
  const { status } = await record.update({ data: JSON.stringify(sessionCopy) });
  if (status.code !== 202) {
    throw new Error("failed to update session");
  }
};

export const storeSession = async (session: WorkoutSession, web5: Web5) => {
  const payload = JSON.stringify(session);
  const replyResponse = await web5.dwn.records.create({
    store: true,
    data: payload,
    message: {
      dataFormat: "application/json",
      schema: routineProtocol.types.session.schema,
      protocol: routineProtocol.protocol,
      protocolPath: "session",
    },
  });
  if (replyResponse.status.code !== 202) {
    throw new Error("failed to store routine");
  }
  return replyResponse.record?.id;
};
