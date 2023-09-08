type ServiceRecord = { service: any; singleton: boolean };

const provider: Map<string, ServiceRecord> = new Map();
const singletons = new Map<string, any>();

function isConstructor(obj: any) {
  return (
    typeof obj === "function" &&
    !!obj.prototype &&
    !!obj.prototype.constructor.name
  );
}

function build(service: any) {
  return isConstructor(service)
    ? new service()
    : typeof service === "function"
    ? service()
    : service;
}

export function resolve(id: string) {
  const { service, singleton } = provider.get(id);

  if (singleton) {
    if (!singletons.has(id)) {
      singletons.set(id, build(service));
    }
    return singletons.get(id);
  }

  return build(service);
}

export function inject(id: string) {
  return function decorator(target: any, key: string) {
    return Object.defineProperty(target, key, { get: () => resolve(id) });
  };
}

export function register<T>(id: string, service: T, singleton = false) {
  provider.set(id, { service, singleton });
}
