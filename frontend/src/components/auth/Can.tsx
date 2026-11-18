import { type ReactNode } from 'react';
import { useRBAC, type AppAction, type AppResource } from '../../utils/rbac';

export interface CanProps {
  do: AppAction;
  on?: AppResource;
  fallback?: ReactNode;
  children: ReactNode;
}

export function Can({ do: action, on: resource, fallback = null, children }: CanProps) {
  const { can } = useRBAC();

  if (can(action, resource)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

export default Can;
