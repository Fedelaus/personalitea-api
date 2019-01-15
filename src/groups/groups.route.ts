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
        const app = request.app;

        const groupProcessor: GroupsProcessor = app.get('groups.processor');
        
        const id = request.query.id;

        const group = {
            id: id,
            ...request.body
        };
        
        response.send(await groupProcessor.getGroups(app, group));
    }

    async deleteGroup(request: Request, response: Response) {
        const app = request.app;

        const groupProcessor: GroupsProcessor = app.get('groups.processor');
        
        const id = request.query.id;

        const group = {
            id: id
        };
        
        response.send(await groupProcessor.getGroups(app, group));
    }

    async putGroupUser(request: Request, response: Response) {
        const app = request.app;

        const groupProcessor: GroupsProcessor = app.get('groups.processor');
        
        const group_id = request.body.group_id;

        const user_id = request.body.user_id;
        
        response.send(await groupProcessor.addGroupUser(app, user_id, group_id));
    }

    async deleteGroupUser(request: Request, response: Response) {

    }

    async updateGroupUser(request: Request, response: Response) {

    }
}