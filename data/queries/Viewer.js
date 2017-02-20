import {
  GraphQLObjectType,
} from 'graphql';

import {
	connectionArgs,
	connectionFromArray,
	globalIdField,
} from 'graphql-relay';

import { listSites } from '../../server/api/service/db'

const viewerFactory = (nodeInterface, SitesConnection) => new GraphQLObjectType({
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

export default viewerFactory
