export const routineProtocol = {
  protocol: "http://andor.us/routine",
  published: true,
  types: {
    routine: {
      schema: "routine",
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
    },
  },
};
