import Field from './Field';

export default interface FieldCdo {
    title: string;
    order: number;
}

export function fromField(field: Field): FieldCdo {
    const { title, order } = field
    return { title, order };
}