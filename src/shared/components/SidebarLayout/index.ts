import SidebarLayoutView from './SidebarLayout';
import SidebarLayoutSection from './sub/SidebarLayoutSection';
import SidebarLayoutItem from './sub/SidebarLayoutItem';

type SidebarLayoutComp = typeof SidebarLayoutView & {
  Section: typeof SidebarLayoutSection;
  Item: typeof SidebarLayoutItem;
};

const SidebarLayout = SidebarLayoutView as SidebarLayoutComp;

SidebarLayout.Section = SidebarLayoutSection;
SidebarLayout.Item = SidebarLayoutItem;

export default SidebarLayout;
