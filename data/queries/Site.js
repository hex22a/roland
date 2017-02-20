import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
	globalIdField
} from 'graphql-relay';

const siteFactory = nodeInterface =>
	new GraphQLObjectType({
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
	})

export default siteFactory;
