import Processor from "../core/processor/processor";
import { Group } from "./group.description";

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
}