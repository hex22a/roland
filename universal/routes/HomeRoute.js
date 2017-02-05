/**
 * Crafted by x22a on 05.02.17.
 */
import Relay from 'react-relay';

export default class extends Relay.Route {
	static queries = {
		sites: () => Relay.QL`query { viewer { sites } }`,
	};
	static routeName = 'HomeRoute';
}