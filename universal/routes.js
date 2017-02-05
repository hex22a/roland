import React from 'react'
import { Route } from 'react-router'
import Relay from 'react-relay';

import MainContainer from './containers/Main'

const MainQueries = {
	sites: () => Relay.QL`query { sites { id, name } }`
};

export default (
    <Route path='/' component={ MainContainer } queries={ MainQueries } />
);