/**
 * Crafted by x22a on 14.11.16.
 */

import { GraphQLString, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLNonNull } from 'graphql'
import * as db from './service/db'
import jwt from 'jsonwebtoken'
import config from 'config'
import crypto from 'crypto'

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
        owners: {
            type: new GraphQLList(GraphQLString)
        },
        url: {
            type: GraphQLString
        },
        SMTPLogin: {
            type: GraphQLString
        }
    })
});

const AddSiteResult = new GraphQLObjectType({
    name: 'AddSiteResult',
    fields: {
        errors: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
        site: { type: SiteType },
    }
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
            type: AddSiteResult,
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
                },
                token: {
                    name: 'token',
                    type: new GraphQLNonNull(GraphQLString)
                },
                SMTPLogin: {
                    name: 'SMTPLogin',
                    type: GraphQLString
                },
                SMTPPassword: {
                    name: 'SMTPPassword',
                    type: GraphQLString
                }
            },
            resolve: async (root, { destinations, url, name, token, SMTPLogin, SMTPPassword }) => {
                const errors = [];
                let result = null;

                try {
                    const decoded = jwt.verify(token, config.jwtSecret);
                    let site = { destinations, url, name, owners: [decoded.id] };
                    if (SMTPPassword && SMTPPassword) {
                        /** @namespace config.crypto */
                        const cipher = crypto.createCipher(config.crypto.algorithm, config.crypto.password);
                        let crypted = cipher.update(SMTPPassword, 'utf8', 'hex');
                        crypted += cipher.final('hex');
                        site = { ...site, SMTPLogin, SMTPPassword: crypted };
                    }
                    result = await db.saveSite(site);
                    const user = await db.getUser(decoded.id);
                    if (!{}.hasOwnProperty.call(user, 'sites')) {
                        user.sites = [result.id];
                    } else {
                        user.sites.push(result.id);
                    }
                    await db.saveUser(user);
                } catch (decodingError) {
                    errors.push(decodingError);
                }

                return { site: result, errors };
            }
        }
    })
});

export default new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
});