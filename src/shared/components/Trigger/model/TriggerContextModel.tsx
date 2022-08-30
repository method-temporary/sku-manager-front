interface TriggerContextModel {
  //
  open: boolean;
  onOpen: (...params: any[]) => void;
  onClose: (...params: any[]) => void;
}

export default TriggerContextModel;
