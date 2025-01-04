export interface StorageAccessor<T> {
  get: () => T | null;
  set: (value: T) => void;
}

export interface UnstableSafeStorageAccessor<T> {
  get: () => T | null;
  set: (value: T) => boolean;
  update: (newValueFn: (oldValue: T) => T) => boolean;
  partialUpdate: (newValueFn: (oldValue: T) => Partial<T>) => boolean;
  init: () => boolean;
  isInitialized: () => boolean;
  isAvailable: () => boolean;
}

export interface SafeStorageAccessor<T> {
  get: () => T;
  set: (value: T) => void;
  update: (newValueFn: (oldValue: T) => T) => void;
  partialUpdate: (newValueFn: (oldValue: T) => Partial<T>) => void;
  init: () => void;
  isInitialized: () => boolean;
}

export interface SafeArrayStorageAccessor<T> {
  get: () => T[];
  set: (value: T[]) => void;
  update: (newValueFn: (oldValue: T[]) => T[]) => void;
  push: (value: T) => void;
  pop: () => T | undefined;
  shift: () => T | undefined;
  unshift: (value: T) => number;
  at(index: number): UnstableSafeStorageAccessor<T>;
  findIndex(predicate: (value: T, index: number, obj: T[]) => boolean): number;
  init: () => void;
  isInitialized: () => boolean;
}

export class AppStorage {

  static set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (item === null) {
      return null;
    }
    return JSON.parse(item);
  }

  static getSafe<T>(key: string, defaultValue: T): T {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item);
  }

  static accessor<T>(key: string): StorageAccessor<T> {
    return {
      get: () => AppStorage.get<T>(key),
      set: (value: T) => AppStorage.set(key, value)
    };
  }

  static safeAccessor<T>(key: string, defaultValue: T, customGetterFn?: (actualValue: T) => T): SafeStorageAccessor<T> {
    const getWrapper = customGetterFn ? customGetterFn : (v: T) => v;
    return {
      get: () => getWrapper(AppStorage.getSafe<T>(key, defaultValue)),
      set: (value: T) => AppStorage.set(key, value),
      update: (newValueFn: (value: T) => T) => {
        const newValue = newValueFn(AppStorage.getSafe<T>(key, defaultValue));
        AppStorage.set(key, newValue);
      },
      partialUpdate: (newValueFn: (value: T) => Partial<T>) => {
        const oldValue = AppStorage.getSafe<T>(key, defaultValue);
        const newValue = { ...oldValue, ...newValueFn(oldValue) };
        AppStorage.set(key, newValue);
      },
      init: () => {
        if (AppStorage.get<T>(key) === null) {
          AppStorage.set(key, defaultValue);
        }
      },
      isInitialized: () => AppStorage.get<T>(key) !== null
    };
  }

  static safeArrayAccessor<T>(key: string, defaultValue: T[], customGetterFn?: (actualValue: T[]) => T[]): SafeArrayStorageAccessor<T> {
    const getWrapper = customGetterFn ? customGetterFn : (v: T[]) => v;
    return {
      get: () => getWrapper(AppStorage.getSafe<T[]>(key, defaultValue)),
      set: (value: T[]) => AppStorage.set(key, value),
      update: (newValueFn: (value: T[]) => T[]) => {
        const newValue = newValueFn(AppStorage.getSafe<T[]>(key, defaultValue));
        AppStorage.set(key, newValue);
      },
      push: (value: T) => {
        const currentValue = AppStorage.getSafe<T[]>(key, defaultValue);
        currentValue.push(value);
        AppStorage.set(key, currentValue);
      },
      pop: () => {
        const currentValue = AppStorage.getSafe<T[]>(key, defaultValue);
        const returnValue = currentValue.pop();
        AppStorage.set(key, currentValue);
        return returnValue;
      },
      shift: () => {
        const currentValue = AppStorage.getSafe<T[]>(key, defaultValue);
        const returnValue = currentValue.shift();
        AppStorage.set(key, currentValue);
        return returnValue;
      },
      unshift: (value: T) => {
        const currentValue = AppStorage.getSafe<T[]>(key, defaultValue);
        const returnValue = currentValue.unshift(value);
        AppStorage.set(key, currentValue);
        return returnValue;
      },
      findIndex: (predicate: (value: T, index: number, obj: T[]) => boolean) => {
        const currentValue = AppStorage.getSafe<T[]>(key, defaultValue);
        return currentValue.findIndex(predicate);
      },
      at: (index: number) => {
        const currentValue = AppStorage.getSafe<T[]>(key, defaultValue);
        return {
          get: () => currentValue[index],
          set: (value: T) => {
            if (currentValue.length <= index) return false;
            currentValue[index] = value;
            AppStorage.set(key, currentValue);
            return true;
          },
          update: (newValueFn: (value: T) => T) => {
            if (currentValue.length <= index) return false;
            currentValue[index] = newValueFn(currentValue[index]);
            AppStorage.set(key, currentValue);
            return true;
          },
          partialUpdate: (newValueFn: (value: T) => Partial<T>) => {
            if (currentValue.length <= index) return false;
            currentValue[index] = { ...currentValue[index], ...newValueFn(currentValue[index]) };
            AppStorage.set(key, currentValue);
            return true;
          },
          init: () => {
            if (currentValue.length <= index) return false;
            if (currentValue[index] === undefined) {
              currentValue[index] = defaultValue[index];
              AppStorage.set(key, currentValue);
            }
            return true;
          },
          isInitialized: () => currentValue[index] !== undefined,
          isAvailable: () => currentValue.length > index
        };
      },
      init: () => {
        if (AppStorage.get<T[]>(key) === null) {
          AppStorage.set(key, defaultValue);
        }
      },
      isInitialized: () => AppStorage.get<T[]>(key) !== null
    };
  }

  static inMemorySafeAccessor<T>(defaultValue: T): SafeStorageAccessor<T> {
    let value = defaultValue;
    return {
      get: () => value,
      set: (newValue: T) => { value = newValue; },
      update: (newValueFn: (oldValue: T) => T) => {
        value = newValueFn(value);
      },
      partialUpdate: (newValueFn: (oldValue: T) => Partial<T>) => {
        value = { ...value, ...newValueFn(value) };
      },
      init: () => {
        value = defaultValue;
      },
      isInitialized: () => true
    };
  }

  static inMemorySafeArrayAccessor<T>(defaultValue: T[]): SafeArrayStorageAccessor<T> {
    let value = defaultValue;
    return {
      get: () => value,
      set: (newValue: T[]) => { value = newValue; },
      update: (newValueFn: (oldValue: T[]) => T[]) => {
        value = newValueFn(value);
      },
      init: () => {
        value = defaultValue;
      },
      push: (newValue: T) => {
        value.push(newValue);
      },
      pop: () => {
        return value.pop();
      },
      shift: () => {
        return value.shift();
      },
      unshift: (newValue: T) => {
        return value.unshift(newValue);
      },
      findIndex: (predicate: (value: T, index: number, obj: T[]) => boolean) => {
        return value.findIndex(predicate);
      },
      at: (index: number) => {
        return {
          get: () => value[index],
          set: (newValue: T) => {
            if (value.length <= index) return false;
            value[index] = newValue;
            return true;
          },
          update: (newValueFn: (oldValue: T) => T) => {
            if (value.length <= index) return false;
            value[index] = newValueFn(value[index]);
            return true;
          },
          partialUpdate: (newValueFn: (oldValue: T) => Partial<T>) => {
            if (value.length <= index) return false;
            value[index] = { ...value[index], ...newValueFn(value[index]) };
            return true;
          },
          init: () => {
            if (value.length <= index) return false;
            if (value[index] === undefined) {
              value[index] = defaultValue[index];
            }
            return true;
          },
          isInitialized: () => true,
          isAvailable: () => value.length > index
        };
      },
      isInitialized: () => true
    };
  }
}
