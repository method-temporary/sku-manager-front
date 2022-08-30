import { CheckboxProps } from 'semantic-ui-react';
import { getCinerooms } from 'shared/store';
import { getCheckedCinerooms, setCheckedCinerooms } from './cineroomCheckbox.stores';

export function onCheckAll(_: React.FormEvent<HTMLInputElement>, data: CheckboxProps) {
  const cinerooms = getCinerooms();
  if (cinerooms === undefined) {
    return;
  }
  if (data.checked) {
    const cineroomIds = cinerooms.map((cineroom) => cineroom.id);
    setCheckedCinerooms(cineroomIds);
  } else {
    setCheckedCinerooms([]);
  }
}

export function onCheckCineroom(_: React.FormEvent<HTMLInputElement>, data: CheckboxProps) {
  const checkedCinerooms = getCheckedCinerooms();
  if (checkedCinerooms === undefined) {
    return;
  }

  if (data.checked) {
    if (data.value === 'ne1-m2-c2') {
      /* mySUNI(toktok) 체크 시, 기존에 체크한 관계사 uncheck 처리 */
      setCheckedCinerooms(['ne1-m2-c2']);
    } else {
      const nextCheckedCinerooms = checkedCinerooms.concat(data.value as string);
      setCheckedCinerooms(nextCheckedCinerooms);
    }
  } else {
    const nextCheckedCinerooms = checkedCinerooms.filter(
      (checkedCineroom) => checkedCineroom !== (data.value as string)
    );
    setCheckedCinerooms(nextCheckedCinerooms);
  }
}
