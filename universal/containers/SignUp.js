/**
 * Crafted by x22a on 08.03.17.
 */

import React, { Component } from 'react';
import Relay from 'react-relay';

import SignUpForm from '../components/SignUpForm/SignUpForm'

import SignUpMutation from '../mutations/SignUpMutation'

class SignUp extends Component {
	handleSignUp(id, password) {
		const { relay, viewer } = this.props;
		relay.commitUpdate(
			new SignUpMutation({ id, password, viewer })
		);
	}

	render() {
		return (
			<div>
				<SignUpForm onSignUp={::this.handleSignUp}/>
			</div>
		)
	}
}

export default Relay.createContainer(SignUp, {
	fragments: {
		viewer: () => Relay.QL`
			fragment on Viewer {
				login,
				${SignUpMutation.getFragment('viewer')}
			}
		`
	}
});