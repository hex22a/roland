/**
 * Crafted by x22a on 14.11.16.
 */

import { GraphQLString, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLNonNull, GraphQLInt } from 'graphql'
import * as db from './service/db'

const SiteType = new GraphQLObjectType({
    name: 'Site',
    description: 'A site object',
    fields: () => ({
        id: {
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
                    type: new GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: (root, { id }) => {
                console.log(root);
                return { id, destinations: ['foo1'], url: '' };
            }
        },
        addSite: {
            type: SiteType,
            args: {
                destinations: {
                    name: 'destinations',
                    type: new GraphQLList(GraphQLString)
                },
                url: {
                    name: 'url',
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: (root, { destinations, url }) => {
                const site = { destinations, url };
                db.saveSite(site, (err, inserted, id) => {
                    if (err) {
                        return { error: err }
                    } else if (!inserted) {
                        return { error: 'Not inserted' }
                    }
                    site.id = id;
                    console.log(site);
                    return { id, destinations: ['foo1'], url: '' };
                })
            }
        }
    })
});

export default new GraphQLSchema({
    query: QueryType
});