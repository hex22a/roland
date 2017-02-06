/**
 * Crafted by x22a on 06.02.17.
 */
import Relay from 'react-relay';

export default class RemoveSiteMutation extends Relay.Mutation {
	static fragments = {
		viewer: () => Relay.QL`
			fragment on Viewer {
				id
			}
		`
	};
	getMutation() {
		return Relay.QL`mutation{ removeSite }`;
	}
	getFatQuery() {
		return Relay.QL`
			fragment on RemoveSitePayload {
				deletedId,
				viewer {
					sites
				}
			}
		`;
	}
	getConfigs() {
		return [{
			type: 'NODE_DELETE',
			parentName: 'viewer',
			parentID: this.props.viewer.id,
			connectionName: 'sites',
			deletedIDFieldName: 'deletedId',
		}];
	}
	getVariables() {
		return {
			id: this.props.id
		};
	}
	getOptimisticResponse() {
		return {
			deletedId: this.props.id,
			viewer: this.props.viewer,
		};
	}
}