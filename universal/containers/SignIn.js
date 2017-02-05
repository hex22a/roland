import React, { Component } from 'react'

import ContainerWrapperHOC from './ContainerWrapperHOC'
import Container from '../components/Container/Container'
import Menu from '../components/Menu/Menu'
import SignInForm from '../components/SignInForm/SignInForm'

@ContainerWrapperHOC
export default class SignIn extends Component {
    render() {
        return (
            <Container>
                <Menu/>
                <SignInForm />
            </Container>
        )
    }
}