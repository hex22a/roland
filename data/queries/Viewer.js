import {
  GraphQLObjectType,
} from 'graphql';

import {
	connectionArgs,
	connectionFromArray,
	globalIdField,
} from 'graphql-relay';

import { listSites } from '../../server/api/service/db'

import nodeDefinitions from './nodeDefinitions'
import { SitesConnection } from './connections'

const { nodeInterface } = nodeDefinitions;

export default new GraphQLObjectType({
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
