/**
 * Crafted by x22a on 14.11.16.
 */

import { GraphQLString, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLNonNull } from 'graphql'
import * as db from './service/db'

const SiteType = new GraphQLObjectType({
    name: 'Site',
    description: 'A site object',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        destinations: {
            type: new GraphQLList(GraphQLString)
        },
        url: {
            type: GraphQLString
        }
    })
});

const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        site: {
            type: SiteType,
            args: {
                id: {
                    name: 'id',
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (root, { id }) => {
                console.log(root);
                return await db.getSite(id);
            }
        }
    })
});

const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        addSite: {
            type: SiteType,
            args: {
                name: {
                    name: 'name',
                    type: new GraphQLNonNull(GraphQLString)
                },
                destinations: {
                    name: 'destinations',
                    type: new GraphQLList(GraphQLString)
                },
                url: {
                    name: 'url',
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async(root, { destinations, url, name }) => {
                const site = { destinations, url, name };
                return await db.saveSite(site)
            }
        }
    })
});

export default new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
});