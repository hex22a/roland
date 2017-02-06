import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
	connectionDefinitions,
	connectionArgs,
	connectionFromArray,
	offsetToCursor,
	fromGlobalId,
	globalIdField,
	mutationWithClientMutationId,
	nodeDefinitions,
} from 'graphql-relay';

import config from 'config'
import crypto from 'crypto'
import _ from 'lodash/core'
import { listSites, getSite, saveSite, deleteSite } from '../server/api/service/db'

const { nodeInterface, nodeField } = nodeDefinitions(
  async globalId => {
	const { type, id } = fromGlobalId(globalId);
	if (type === 'Site') {
		return await getSite(id);
	} else if (type === 'Viewer') {
		const sites = await listSites();
		return { sites }
	}
	return null;
},
	obj => {
		if ({}.hasOwnProperty.call(obj, 'sites')) {
			return viewerType
		} else if ({}.hasOwnProperty.call(obj, 'id')) {
			return siteType;
		}
		return null;
	}
);


const siteType = new GraphQLObjectType({
	name: 'Site',
	description: 'A site object',
	fields: () => ({
		id: globalIdField('Site'),
		siteId: {
			type: GraphQLString,
			description: 'id of site in db',
			resolve: site => site.id,
		},
		name: {
			type: GraphQLString,
			description: 'Site name',
			resolve: site => site.name,
		},
		destinations: {
			type: new GraphQLList(GraphQLString),
			resolve: site => site.destinations,
		},
		owners: {
			type: new GraphQLList(GraphQLString),
			resolve: site => site.owners,
		},
		url: {
			type: GraphQLString,
			resolve: site => site.url,
		},
		SMTPLogin: {
			type: GraphQLString,
			resolve: site => site.SMTPLogin,
		},
		JWT: {
			type: GraphQLString,
			resolve: site => site.JWT,
		}
	}),
	interfaces: [nodeInterface]
});


const {
	connectionType: SitesConnection,
	edgeType: SitesEdge,
} = connectionDefinitions({
	name: 'Site',
	nodeType: siteType,
});
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

const viewerType = new GraphQLObjectType({
	name: 'Viewer',
	fields: () => ({
		id: globalIdField('Viewer'),
		sites: {
			type: SitesConnection,
			args: connectionArgs,
			resolve: async (obj, args) => connectionFromArray(await listSites(), args)
		}
	}),
	interfaces: [nodeInterface]
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


const DeleteSiteMutation = mutationWithClientMutationId({
	name: 'DeleteSite',
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
		deleteSite: DeleteSiteMutation,
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
