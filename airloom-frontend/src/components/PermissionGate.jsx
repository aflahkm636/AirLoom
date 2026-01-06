import { useSelector } from 'react-redux';
import { selectUserPermissions } from '../features/auth/authSelectors';
import LockedContent from './LockedContent';

/**
 * PermissionGate - Wrapper component for permission-based access control
 * 
 * Usage:
 * <PermissionGate requiredPermission="EMPLOYEE_VIEW">
 *   <EmployeesList />
 * </PermissionGate>
 * 
 * Or with multiple permissions (any):
 * <PermissionGate requiredPermissions={["TASK_VIEW", "TASK_CREATE"]} requireAll={false}>
 *   <TasksPage />
 * </PermissionGate>
 */
const PermissionGate = ({ 
  children, 
  requiredPermission,
  requiredPermissions = [],
  requireAll = false,
  fallback = null,
  moduleName = "this module"
}) => {
  const userPermissions = useSelector(selectUserPermissions);

  // Build list of permissions to check
  const permissionsToCheck = requiredPermission 
    ? [requiredPermission] 
    : requiredPermissions;

  // If no permissions required, allow access
  if (permissionsToCheck.length === 0) {
    return children;
  }

  // Check permissions
  const hasPermission = requireAll
    ? permissionsToCheck.every(p => userPermissions.includes(p))
    : permissionsToCheck.some(p => userPermissions.includes(p));

  if (hasPermission) {
    return children;
  }

  // Return fallback or default LockedContent
  return fallback || (
    <LockedContent 
      title="Access Restricted"
      message={`You don't have permission to access ${moduleName}. Contact your administrator for access.`}
    />
  );
};

export default PermissionGate;
