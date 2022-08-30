import PermissionPolicy from './PermissionPolicy';

export default interface PagePermission {
  communityMemberId?: number;
  permissionPolicy?: PermissionPolicy;
}
