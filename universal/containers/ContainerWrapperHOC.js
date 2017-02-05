import React, { Component, PropTypes } from 'react'

const ContainerWrapperHOC = Container => {
    class ContainerWrapper extends Component {
        getChildContext() {
            const { isAuthenticated } = this.props;
            return { isAuthenticated };
        }

        render() {
            return <Container { ...this.props } isAuthenticated={ false } />
        }
    }

    ContainerWrapper.childContextTypes = {
        isAuthenticated: PropTypes.bool
    };
};

export default ContainerWrapperHOC