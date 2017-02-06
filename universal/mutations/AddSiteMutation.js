/**
 * Crafted by x22a on 06.02.17.
 */

import Relay from 'react-relay';

export default class AddSiteMutation extends Relay.Mutation {
	static fragments = {
		viewer: () => Relay.QL`
			fragment on Viewer {
				id
			}
        `,
	};
	getMutation() {
		return Relay.QL`mutation{ addSite }`;
	}
	getFatQuery() {
		return Relay.QL`
			fragment on AddSitePayload {
				siteEdge,
				viewer {
					sites
				}
			}
		`;
	}
	getConfigs() {
		return [{
			type: 'RANGE_ADD',
			parentName: 'viewer',
			parentID: this.props.viewer.id,
			connectionName: 'sites',
			edgeName: 'siteEdge',
			rangeBehaviors: {
				'': 'append'
			},
		}];
	}
	getVariables() {
		return {
			name: this.props.name,
			url: this.props.url
		};
	}
	getOptimisticResponse() {
		return {
			// FIXME: totalCount gets updated optimistically, but this edge does not
			// get added until the server responds
			siteEdge: {
				node: {
					complete: false,
					name: this.props.name,
					url: this.props.url
				},
			},
			viewer: {
				id: this.props.viewer.id,
			},
		};
	}
}