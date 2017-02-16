import {
    connectionDefinitions
} from 'graphql-relay'

import siteType from './Site'

export const {
	connectionType: SitesConnection,
	edgeType: SitesEdge,
} = connectionDefinitions({
	name: 'Site',
	nodeType: siteType,
});
