import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import config from 'config'
import crypto from 'crypto'
import { listSites, getSite, saveSite, deleteSite } from '../server/api/service/db'

/**
 * This is a basic end-to-end test, designed to demonstrate the various
 * capabilities of a Relay-compliant GraphQL server.
 *
 * It is recommended that readers of this test be familiar with
 * the end-to-end test in GraphQL.js first, as this test skips
 * over the basics covered there in favor of illustrating the
 * key aspects of the Relay spec that this test is designed to illustrate.
 *
 * We will create a GraphQL schema that describes the major
 * factions and ships in the original Star Wars trilogy.
 *
 * NOTE: This may contain spoilers for the original Star
 * Wars trilogy.
 */

/**
 * Using our shorthand to describe type systems,
 * the type system for our example will be the following:
 *
 * interface Node {
 *   id: ID!
 * }
 *
 * type Faction : Node {
 *   id: ID!
 *   name: String
 *   ships: ShipConnection
 * }
 *
 * type Ship : Node {
 *   id: ID!
 *   name: String
 * }
 *
 * type ShipConnection {
 *   edges: [ShipEdge]
 *   pageInfo: PageInfo!
 * }
 *
 * type ShipEdge {
 *   cursor: String!
 *   node: Ship
 * }
 *
 * type PageInfo {
 *   hasNextPage: Boolean!
 *   hasPreviousPage: Boolean!
 *   startCursor: String
 *   endCursor: String
 * }
 *
 * type Query {
 *   rebels: Faction
 *   empire: Faction
 *   node(id: ID!): Node
 * }
 *
 * input IntroduceShipInput {
 *   clientMutationId: string!
 *   shipName: string!
 *   factionId: ID!
 * }
 *
 * input IntroduceShipPayload {
 *   clientMutationId: string!
 *   ship: Ship
 *   faction: Faction
 * }
 *
 * type Mutation {
 *   introduceShip(input IntroduceShipInput!): IntroduceShipPayload
 * }
 */

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve a node object to its GraphQL type.
 */
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

/**
 * We define our basic ship type.
 *
 * This implements the following type system shorthand:
 *   type Ship : Node {
 *     id: String!
 *     name: String
 *   }
 */

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
			description: 'Site name'
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
		},
		JWT: {
			type: GraphQLString
		}
	}),
	interfaces: [nodeInterface]
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
			type: new GraphQLList(siteType),
			resolve: async () => await listSites(),
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
			type: new GraphQLList(GraphQLString)
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
		newSite: {
			type: siteType,
			resolve: async payload => {
				const site = getSite(payload.siteId);
				return {
					cursor: cursorForObjectInConnection(await listSites(), site),
					node: site,
				};
			},
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
		},
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
