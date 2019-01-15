import Processor from "../core/processor/processor";
import { Group } from "./group.description";
import { User } from "../auth/user.description";

export class GroupsProcessor extends Processor {

    async createGroup(app: any, group: Group) {
		const database = this.getDatabase(app);

		const query = database('groups')
			.insert(group)
			.returning(['id', 'owner', 'name']);

		return query;
    }
    
    async getGroups(app: any, group: Group) {
		const database = this.getDatabase(app);

		const query = database('groups')
            .select('*');

        if (group) {
            query.where(group);
        }

		return query;
    }
    
    async updateGroup(app: any, id: number, group: Group) {
        const database = this.getDatabase(app);

		const query = database('groups')
            .update(group)
            .where({id: id })

		return query;
    }

    async deleteGroup(app: any, group: Group) {
        const database = this.getDatabase(app);

		const query = database('groups')
            .delete()
            .where(group)

		return query;
    }

    async addGroupUser(app: any, user: User | number, group: Group | number) {
        if (typeof group === 'object') {
            group = group.id;
        }

        if (typeof user === 'object') {
            user = user.id;
        }

        const database = this.getDatabase(app);

		const query = database('group_users')
            .insert({
                user: user,
                group: group
            })

		return query;
     }
}