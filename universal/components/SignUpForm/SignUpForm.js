import React, { Component, PropTypes } from 'react';

export default class SignUpForm extends Component {
	static propTypes = {
		onSignUp: PropTypes.func.isRequired,
	};

	constructor(props, context) {
		super(props, context);
		this.state = {
			id: '',
			password: '',
			idError: false,
			passwordError: false,
		}
	}

	render() {
		return <div>SUP</div>
	}
}