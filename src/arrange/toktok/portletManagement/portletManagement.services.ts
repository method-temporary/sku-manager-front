import { useEffect } from "react";
import { initPortletList } from "./portletList/portletList.models";
import { setPortletList, setPortletListLimit, setPortletListPage } from "./portletList/portletList.stores";
import { initPortletSearchBox } from "./portletSerchBox/portletSearchBox.models";
import { setPortletSearchBox } from "./portletSerchBox/portletSearchBox.stores";

export function useClearPortletManagement() {
  useEffect(() => {
    return () => {
      setPortletSearchBox(initPortletSearchBox());
      setPortletList(initPortletList());
      setPortletListPage(1);
      setPortletListLimit(20);
    }
  }, []);
}