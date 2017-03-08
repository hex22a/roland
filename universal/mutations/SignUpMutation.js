/**
 * Crafted by x22a on 08.03.17.
 */
import Relay from 'react-relay'

export default class SignUpMutation extends Relay.Mutation {
	static fragments = {
		viewer: () => Relay.QL`
			fragment on Viewer {
				id
			}
		`
	};
	getMutation() {
		return Relay.QL`mutation { signUp }`
	}
	getFatQuery() {
		return Relay.QL`
			fragment on SignUpPayload {
				viewer {
					id
				}
			}
		`
	}
	getConfigs() {
		return [{
			type: 'RANGE_ADD',
			parentName: 'viewer',
			parentID: this.props.viewer.id,
			rangeBehaviors: {
				'': 'append'
			},
		}];
	}
	getVariables() {
		return {
			id: this.props.id,
			password: this.props.password
		};
	}
	getOptimisticResponse() {
		return {
			viewer: {
				id: this.props.viewer.id,
			},
		};
	}
}