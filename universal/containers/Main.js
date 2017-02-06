import React, { Component } from 'react'
import Relay from 'react-relay';

import './common/main.pcss'

import ContainerWrapperHOC from './ContainerWrapperHOC'
import Container from '../components/Container/Container'
import Menu from '../components/Menu/Menu'
import AddSite from './AddSite'

import AddSiteMutation from '../mutations/AddSiteMutation'
import RemoveSiteMutation from '../mutations/RemoveSiteMutation'

@ContainerWrapperHOC
class Main extends Component {
	handleAddSite(site) {
		const { name, url } = site;
		const { relay, viewer } = this.props;
		relay.commitUpdate(
			new AddSiteMutation({ name, url, viewer })
		);
	}

	handleRemoveSite(id) {
		const { relay, viewer } = this.props;
		console.log(viewer);
		relay.commitUpdate(
			new RemoveSiteMutation({ id, viewer })
		);
	}

	render() {
		const { viewer } = this.props;
		return (
            <Container>
                <Menu/>
                <div>Hello{!this.props.isAuthenticated && ', anonymous'}{this.props.isAuthenticated && `, ${this.props.role}`}!</div>
				{viewer.sites.edges.map((site, id) =>
					<div key={id}>
						url: {site.node.url} - name: {site.node.name}
						<span onClick={() => this.handleRemoveSite(site.node.id)}>DELETE</span>
					</div>
				)}
				<AddSite onSave={::this.handleAddSite}/>
            </Container>
		)
	}
}

export default Relay.createContainer(Main, {
	fragments: {
		viewer: () => Relay.QL`
			fragment on Viewer {
				sites (first: 2147483647) {
					edges {
						node {
							id,
							name,
							url
						}
					}
				}
				${AddSiteMutation.getFragment('viewer')}
				${RemoveSiteMutation.getFragment('viewer')}
			}
		`
	}
});