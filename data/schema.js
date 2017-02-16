import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
	offsetToCursor,
	fromGlobalId,
	mutationWithClientMutationId,
} from 'graphql-relay';

import config from 'config'
import crypto from 'crypto'
import _ from 'lodash/core'
import { listSites, getSite, saveSite, deleteSite } from '../server/api/service/db'

import viewerType from './queries/Viewer'
import { SitesEdge } from './queries/connections'

import nodeDefinitions from './queries/nodeDefinitions'

const { nodeField } = nodeDefinitions;

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 *
 * This implements the following type system shorthand:
 *   type Query {
 *     factions(names: [FactionName]): [Faction]
 *     node(id: ID!): Node
 *   }
 */
const Root = new GraphQLObjectType({
	name: 'Root',
	fields: () => ({
		viewer: {
			type: viewerType,
			resolve: async () => {
				const sites = await listSites();
				return { sites }
			}
		},
		node: nodeField
	}),
});

/**
 * This will return a GraphQLFieldConfig for our ship mutation.
 *
 * It creates these two types implicitly:
 *   input IntroduceShipInput {
 *     clientMutationId: string!
 *     shipName: string!
 *     factionId: ID!
 *   }
 *
 *   input IntroduceShipPayload {
 *     clientMutationId: string!
 *     ship: Ship
 *     faction: Faction
 *   }
 */
const siteMutation = mutationWithClientMutationId({
	name: 'AddSite',
	inputFields: {
		name: {
			type: new GraphQLNonNull(GraphQLString)
		},
		destinations: {
			type: GraphQLString
		},
		url: {
			type: new GraphQLNonNull(GraphQLString)
		},
		SMTPLogin: {
			type: GraphQLString
		},
		SMTPPassword: {
			type: GraphQLString
		}
	},
	outputFields: {
		siteEdge: {
			type: SitesEdge,
			resolve: async payload => {
				const site = await getSite(payload.siteId);
				const sites = await listSites();
				const offset = _.indexOf(sites, site);
				let cursor = null;
				if (offset === -1) {
					cursor = offsetToCursor(offset)
				}
				return {
					cursor,
					node: site,
				};
			}
		},
		viewer: {
			type: viewerType,
			resolve: async () => {
				const sites = await listSites();
				return { sites }
			}
		}
	},
	mutateAndGetPayload: async ({ destinations, url, name, SMTPLogin, SMTPPassword }) => {
		let site = { destinations, url, name };

		if (SMTPPassword && SMTPPassword) {
			/** @namespace config.crypto */
			const cipher = crypto.createCipher(config.crypto.algorithm, config.crypto.password);
			let crypted = cipher.update(SMTPPassword, 'utf8', 'hex');
			crypted += cipher.final('hex');
			site = { ...site, SMTPLogin, SMTPPassword: crypted };
		}

		const result = await saveSite(site);

		return {
			siteId: result.id
		};
	},
});


const RemoveSiteMutation = mutationWithClientMutationId({
	name: 'RemoveSite',
	inputFields: {
		id: { type: new GraphQLNonNull(GraphQLID) },
	},
	outputFields: {
		deletedId: {
			type: GraphQLID,
			resolve: ({ id }) => id,
		},
		viewer: {
			type: viewerType,
			resolve: async () => {
				const sites = await listSites();
				return { sites }
			}
		}
	},
	mutateAndGetPayload: async ({ id }) => {
		const siteId = fromGlobalId(id).id;
		await deleteSite(siteId);
		return { id };
	},
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 *
 * This implements the following type system shorthand:
 *   type Mutation {
 *     introduceShip(input: IntroduceShipInput!): IntroduceShipPayload
 *   }
 */
const mutationType = new GraphQLObjectType({
	name: 'Mutation',
	fields: () => ({
		addSite: siteMutation,
		removeSite: RemoveSiteMutation,
	}),
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export default new GraphQLSchema({
	query: Root,
	mutation: mutationType,
});
