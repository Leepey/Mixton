// features/admin/services/securityService.ts
import { normalizeAddress } from '../../../shared/utils/formatUtils';

export class SecurityService {
  static checkAdminPermission(userAddress: string | null, adminAddress: string | null): boolean {
    if (!userAddress || !adminAddress) return false;
    return normalizeAddress(userAddress) === normalizeAddress(adminAddress);
  }

  static getDebugInfo(userAddress: string | null, adminAddress: string | null) {
    return {
      currentAddress: userAddress || 'Not connected',
      adminAddress: adminAddress || 'Not configured',
      normalizedCurrentAddress: userAddress ? normalizeAddress(userAddress) : 'Not connected',
      normalizedAdminAddress: adminAddress ? normalizeAddress(adminAddress) : 'Not configured',
      match: userAddress === adminAddress,
      normalizedMatch: userAddress && adminAddress && normalizeAddress(userAddress) === normalizeAddress(adminAddress)
    };
  }
}