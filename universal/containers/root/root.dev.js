import React, { Component } from 'react';
import { Router } from 'react-router';

export default class Root extends Component {
	render() {
		const { routes, history, render, environment } = this.props;
		return (
            <div>
				<Router
					history={history}
					render={render}
					routes={routes}
					environment={environment}
				/>
            </div>
		);
	}
}