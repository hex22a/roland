import React, { Component } from 'react'

import ContainerWrapperHOC from './ContainerWrapperHOC'
import Container from '../components/Container/Container'
import Menu from '../components/Menu/Menu'
import SignUpForm from '../components/SignUpForm/SignUpForm'

@ContainerWrapperHOC
export default class SignUp extends Component {
	render() {
		return (
            <Container>
                <Menu/>
                <SignUpForm/>
            </Container>
		)
	}
}