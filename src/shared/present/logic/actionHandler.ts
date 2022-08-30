
interface ActionHandler {
  actionQueue: {actionType: string, args: any[]}[]
  isContainerMounted: boolean
  actionMap: Map<string, Function>
  setAction: (actionType: string, callback: Function) => void
  containerMounted: () => void
  dispatchAction: (actionType: string, args: any) => void
}

const actionHandler: ActionHandler = {

  actionQueue: [],
  isContainerMounted: false,
  actionMap: new Map(),

  setAction: (actionType, callback) => {
    actionHandler.actionMap.set(actionType, callback);
  },

  containerMounted: () => {
    actionHandler.isContainerMounted = true;
    actionHandler.actionQueue.forEach(({ actionType, args }) => {
      const action = actionHandler.actionMap.get(actionType);
      if (action) {
        action(...args);
      }
    });
  },

  dispatchAction: (actionType, ...args) => {
    if (actionHandler.isContainerMounted) {
      const action = actionHandler.actionMap.get(actionType);
      if (action) {
        action(...args);
      }
    } else {
      actionHandler.actionQueue.push({ actionType, args });
    }
  },
};

export default actionHandler;
