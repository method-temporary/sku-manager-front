import { useEffect, useState } from 'react';

interface Unsubscribe {
  (): void;
}

interface SubscribeCallback<T> {
  (next?: T): void;
}

interface Publish<T> {
  (next?: T, publisherId?: string): void;
}

interface Subscribe<T> {
  (callback: SubscribeCallback<T>, subscriberId: string): Unsubscribe;
}

interface GetCurrent<T> {
  (): T | undefined;
}

interface UseStore<T> {
  (): T | undefined;
}

let subscriberIdRef = 0;

export function createStore<T>(
  initialStore?: T
): [Publish<T>, Subscribe<T>, GetCurrent<T>, UseStore<T>] {
  let store: T | undefined;
  if (initialStore !== undefined) {
    store = initialStore;
  }
  const subscriberMap = new Map<string, SubscribeCallback<T>>();

  function publish(next?: T, publisherId?: string) {
    store = next;
    subscriberMap.forEach((callback) => {
      callback(store);
    });
  }

  function subscribe(
    callback: SubscribeCallback<T>,
    subscriberId: string
  ): Unsubscribe {
    subscriberMap.set(subscriberId, callback);
    // First Callback
    callback(store);
    return () => subscriberMap.delete(subscriberId);
  }

  function getCurrent(): T | undefined {
    return store;
  }

  function useStore(): T | undefined {
    const [subscriberId, setSubscriberId] = useState<string>();
    const [value, setValue] = useState<T | undefined>();

    useEffect(() => {
      const next = `useStore-${++subscriberIdRef}`;
      setSubscriberId(next);
    }, []);

    useEffect(() => {
      if (subscriberId === undefined) {
        return;
      }
      /* eslint-disable consistent-return */
      return subscribe((next) => {
        setValue(next);
      }, subscriberId);
      /* eslint-enable consistent-return */
    }, [subscriberId]);

    return value;
  }

  return [publish, subscribe, getCurrent, useStore];
}
