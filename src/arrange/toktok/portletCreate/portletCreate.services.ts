import { useEffect } from 'react';
import { setCheckedCinerooms } from '../cineroomCheckbox/cineroomCheckbox.stores';
import { initPortletContentItems } from '../portletContentCreate/portletContentCreate.models';
import { setPortletContentItems } from '../portletContentCreate/portletContentCreate.stores';
import { initPortletCreateForm } from './portletCreate.models';
import { setPortletCreateForm } from './portletCreate.stores';

export function useClearPortletCreate() {
  useEffect(() => {
    setPortletCreateForm(initPortletCreateForm());
    setCheckedCinerooms([]);
    setPortletContentItems(initPortletContentItems());
  }, []);
}
