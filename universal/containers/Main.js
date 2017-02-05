import React, { Component } from 'react'
import Relay from 'react-relay';

import './common/main.pcss'

import ContainerWrapperHOC from './ContainerWrapperHOC'
import Container from '../components/Container/Container'
import Menu from '../components/Menu/Menu'

@ContainerWrapperHOC
class Main extends Component {
	render() {
		const { viewer } = this.props;
		return (
            <Container>
                <Menu/>
                <div>Hello{!this.props.isAuthenticated && ', anonymous'}{this.props.isAuthenticated && `, ${this.props.role}`}!</div>
				{viewer.sites.map(site =>
					<div>{site.name}</div>
				)}
            </Container>
		)
	}
}

export default Relay.createContainer(Main, {
	fragments: {
		viewer: () => Relay.QL`
			fragment on Viewer {
				sites {
					siteId,
					name
				}
			}
		`
	}
});