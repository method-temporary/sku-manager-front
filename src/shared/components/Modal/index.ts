import * as ModalTypes from './type';
import ModalContainer from './logic/ModalContainer';
import ModalContext from './sub/ModalContext';
import ModalHeader from './sub/ModalHeader';
import ModalContent from './sub/ModalContent';
import ModalActions from './sub/ModalActions';
import ModalCloseButton from './sub/ModalCloseButton';
import ModalDescription from './sub/ModalDescription';

type ModalType = typeof ModalContainer & {
  Context: typeof ModalContext;
  Header: typeof ModalHeader;
  Content: typeof ModalContent;
  Actions: typeof ModalActions;
  CloseButton: typeof ModalCloseButton;
  Description: typeof ModalDescription;
};

const Modal = ModalContainer as ModalType;

Modal.Context = ModalContext;
Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Actions = ModalActions;
Modal.CloseButton = ModalCloseButton;
Modal.Description = ModalDescription;

export default Modal;
export { ModalTypes };
