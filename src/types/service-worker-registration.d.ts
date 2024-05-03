export type ServiceWorkerRegistration = {
  sync: {
    register(tag: string): Promise<void>;
  };
};
