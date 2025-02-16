import { Role } from '../../../../roles/roles.enum';

export type CurrentUser = {
  id: string;
  role: Role;
};
