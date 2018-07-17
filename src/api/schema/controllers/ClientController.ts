
import { FieldNode, GraphQLResolveInfo, SelectionNode, SelectionSetNode } from 'graphql';
import { Controller, Query, Mutation, Authorized } from 'vesper';
import { FindManyOptions, DeepPartial } from 'typeorm';

import { ClientService } from '../../services/ClientService';
import { User } from '../../models/User';
import { Client } from '../../models/Client';

interface ClientsArgs {
    limit?: number;
    offset?: number;
    order?: string;
}

interface ClientArgs {
    id?: number;
    name?: string;
}

@Controller()
export class ClientController {

    constructor(private currentUser: User,
                private clientService: ClientService) {
    }

    @Query()
    @Authorized()
    public clients(args: ClientsArgs, context: any, info: GraphQLResolveInfo): Promise<Client[]> {
        const findOptions: FindManyOptions = {};
        if (args.limit) {
            findOptions.take = args.limit;
        }
        if (args.offset) {
            findOptions.skip = args.offset;
        }
        if (args.order === 'last') {
            findOptions.order = {id: 'DESC'};
        }
        if (args.order === 'name') {
            findOptions.order = {name: 'ASC'};
        }

        // recurse ast tree find relationships
        info.fieldNodes.forEach( (fieldNode: FieldNode) => {
            const relations: string[] = this.traverseSelectionSet(fieldNode.selectionSet, '');
            findOptions.relations = relations;
        });

        return this.clientService.find(this.currentUser, findOptions);
    }

    @Query()
    @Authorized()
    public client(arg: ClientArgs): Promise<Client> {
        return this.clientService.findOne(this.currentUser, arg.id, arg.name);
    }

    @Mutation()
    public clientCreate(args: DeepPartial<Client>): Promise<Client> {
        return this.clientService.createFrom(this.currentUser, args);
    }

    @Mutation()
    @Authorized()
    public clientDelete(arg: { id: number }): Promise<boolean> {
        return this.clientService.remove(this.currentUser, arg.id);
    }

    private traverseSelectionSet(selectionSet: SelectionSetNode, prefix: string): string[] {
        let relations: string[];
        if (selectionSet) {
            selectionSet.selections.forEach( (selection: SelectionNode) => {
                const field: FieldNode = selection as FieldNode;
                if (field.selectionSet) {
                    // if node has childern, let's assume it is a relationship
                    if (!relations) {
                        relations = [];
                    }
                    const relation: string = prefix + field.name.value;
                    relations.push(relation);
                    const sub = this.traverseSelectionSet(field.selectionSet, relation + '.');
                    if (sub) {
                        sub.forEach((rel: string) => {
                            relations.push(rel);
                        });
                    }
                }
            });
        }
        return relations;
    }

}
