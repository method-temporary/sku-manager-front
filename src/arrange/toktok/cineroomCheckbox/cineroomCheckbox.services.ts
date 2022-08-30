import { useEffect } from "react";
import { usePortletRouteParams } from "../routeParams";
import { setCheckedCinerooms } from "./cineroomCheckbox.stores";

export function useInitCheckedCinerooms() {
  const params = usePortletRouteParams();
  useEffect(() => {
    if(params?.cineroomId === undefined || params.cineroomId === 'ne1-m2-c2') {
      return;
    }
    setCheckedCinerooms([params.cineroomId]);
  }, [params?.cineroomId]);
}