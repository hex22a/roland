import React, { Component } from 'react'

import './common/main.pcss'

import ContainerWrapperHOC from './ContainerWrapperHOC'
import Container from '../components/Container/Container'
import Menu from '../components/Menu/Menu'

@ContainerWrapperHOC
export default class Main extends Component {
	render() {
		return (
            <Container>
                <Menu/>
                <div>Hello{!this.props.isAuthenticated && ', anonymous'}{this.props.isAuthenticated && `, ${this.props.role}`}!</div>
            </Container>
		)
	}
}