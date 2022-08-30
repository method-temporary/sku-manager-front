export default interface TriggerContextParams {
  //
  open: boolean;
  onOpen: (...params: any[]) => void;
  onClose: (...params: any[]) => void;
}
