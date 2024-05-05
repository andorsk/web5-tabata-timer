import { WorkoutSession } from "@/models/workout";
import { Web5 } from "@web5/api";
import { routineProtocol } from "@/lib/protocols/routine";

export const deleteSession = async (id: string, web5: Web5) => {
  const deleteResult = await web5.dwn.records.delete({
    message: {
      recordId: id,
    },
  });
  if (deleteResult.status.code !== 202) {
    throw new Error("failed to delete session");
  }
};

export const getSessions = async (web5: Web5) => {
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
  let { record } = await web5.dwn.records.read({
    message: {
      filter: {
        recordId: session.id,
      },
    },
  });
  if (!record) {
    const sessions = await getSessions(web5);
    const filteredSessions = sessions?.records?.filter(
      (s) => s.id === session.id,
    );
    console.error(record);
    throw new Error(`${session.id} session not found`);
  }
  const { status } = await record.update({ data: JSON.stringify(session) });
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
    console.log(replyResponse);
    throw new Error("failed to store session");
  }
  console.log("session stored,", replyResponse.record?.id);
  let { record } = await web5.dwn.records.read({
    message: {
      filter: {
        recordId: replyResponse.record?.id,
      },
    },
  });
  console.log("refound", record);
  const { status } = await record.update({ data: JSON.stringify(session) });
  if (status.code !== 202) {
    throw new Error("failed to update session");
  }
  console.log(status);

  return replyResponse.record?.id;
};
