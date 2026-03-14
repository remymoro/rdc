import { User, UserRole } from '@rdc/domain';
import type { ResponsableCentreDto } from '@rdc/shared';

export function toResponsableDto(user: User): ResponsableCentreDto {
  if (user.role !== UserRole.RESPONSABLE_CENTRE || !user.centreId) {
    throw new Error('Utilisateur invalide pour le mapping responsable centre');
  }

  return {
    id: user.id,
    email: user.email.value,
    role: 'RESPONSABLE_CENTRE',
    centreId: user.centreId,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
