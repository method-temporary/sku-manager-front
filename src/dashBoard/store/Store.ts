interface Unsubscribe {
  (): void;
}

interface SubscribeCallback<T> {
  (next: T): void;
}

interface Publish<T> {
  (next: T, publisherId: string): void
}

interface Subscribe<T> {
  (subscriberId: string, callback: SubscribeCallback<T>): Unsubscribe
}

interface GetCurrent<T> {
  (): T
}

export function createStore<T>(initialStore: T): [Publish<T>, Subscribe<T>, GetCurrent<T>] {
  let store = initialStore;
  const subscriberMap = new Map<string, SubscribeCallback<T>>();

  function publish(next: T, publisherId: string) {
    store = next;
    subscriberMap.forEach((callback) => {
      callback(store);
    })
  }

  function subscribe(subscriberId: string, callback: SubscribeCallback<T>): Unsubscribe {
    subscriberMap.set(subscriberId, callback);
    // First Callback
    callback(store)
    return () => subscriberMap.delete(subscriberId)
  }

  function getCurrent(): T {
    return store
  }

  return [publish, subscribe, getCurrent]
}