import { User } from "../auth/user.description";

export class Group {
    /** Unique identifier of the group */
    id?: number;
    /** Name of the group */
    name?: string;
    /** Id of the group owner */
    owner?: number;
    /** The users within this group */
    users?: User[];
    /** Permissions within this group. */
    groupPermissions?: GroupPermission[];
};

export interface GroupPermission {
    /** Unique identifier of the permission */
    id: number;
    /** User whom this permission applies to */
    applicant: User | Group | '*';
    /** The permission string */
    permission: string;
}
