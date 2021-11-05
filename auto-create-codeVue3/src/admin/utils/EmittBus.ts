import mitt, { Handler } from 'mitt';

interface DropInfo {
  targetId: number;
  dropKey: string;
}

interface FnType {
  emit: (name: string, info: DropInfo) => void;
  on: (name: string, fn: () => unknown) => void;
}

function useEmitt(): FnType {
  const emitter = mitt();
  return {
    emit: (name: string, info: DropInfo) => emitter.emit(name, info),
    on: (name: string, fn: Handler<unknown>) => {
      emitter.on(name, fn);
    }
  };
}

export { useEmitt };
