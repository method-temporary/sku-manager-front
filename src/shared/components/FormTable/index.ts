import * as FormTableTypes from './type';
import FormTableView from './FormTableView';
import Row from './sub/Row';

type FormTableComp = typeof FormTableView & {
  Row: typeof Row;
};

const FormSegment = FormTableView as FormTableComp;

FormSegment.Row = Row;

export default FormSegment;
export { FormTableTypes };
