import Route from "../core/route/route";
import { Request, Response } from "express";
import { Group } from "./group.description";
import { GroupsProcessor } from "./groups.processor";

export class GroupsRoute extends Route {
    constructor() {
        super('groups', true);

        this.registerEndpoint({
			path: 'create',
			method: 'post',
			funct: this.createGroup.bind(this),
			authRequired: true
		});
    }


    async createGroup(request: Request, response: Response) {
        const app = request.app;

        const groupProcessor: GroupsProcessor = app.get('groups.processor');
        
        const group: Group = {
            name: request.body.name,
            owner: request.body.owner
        }

        return response.send(await groupProcessor.createGroup(app, group));
    }

    async getGroups(request: Request, response: Response) {
        const app = request.app;

        const groupProcessor: GroupsProcessor = app.get('groups.processor');

        const groupFilter = request.body;

        response.send(await groupProcessor.getGroups(app, groupFilter));           
    }

    async updateGroup(request: Request, response: Response) {

    }

    async deleteGroup(request: Request, response: Response) {

    }

    async putGroupUser(request: Request, response: Response) {

    }

    async deleteGroupUser(request: Request, response: Response) {

    }

    async updateGroupUser(request: Request, response: Response) {

    }
}