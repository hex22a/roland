import {
	fromGlobalId,
	nodeDefinitions,
} from 'graphql-relay';

import { listSites, getSite } from '../../server/api/service/db'

import viewerType from './Viewer'
import siteType from './Site'

export default nodeDefinitions(
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
