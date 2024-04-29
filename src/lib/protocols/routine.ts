export const routineProtocol = {
  protocol: "http://andor.us/routine",
  published: true,
  types: {
    routine: {
      schema: "routine",
      dataFormats: ["application/json"],
    },
    session: {
      schema: "session",
      dataFormats: ["application/json"],
    },
  },
  structure: {
    routine: {
      $actions: [
        {
          who: "anyone",
          can: ["create", "update"],
        },
      ],
      session: {
        $actions: [
          {
            who: "anyone",
            can: ["create"],
          },
          {
            who: "author",
            of: "session",
            can: ["create", "update"],
          },
        ],
      },
    },
  },
};
