import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import IsomorphicRelay from 'isomorphic-relay';
import rootContainerProps from '../universal/containers/root/props'

const environment = new Relay.Environment();

environment.injectNetworkLayer(new Relay.DefaultNetworkLayer('/graphql'));

const data = JSON.parse(document.getElementById('preloadedData').textContent);

const rootElement = document.getElementById('app');

IsomorphicRelay.injectPreparedData(environment, data);

IsomorphicRelay.prepareInitialRender({ ...rootContainerProps, environment }).then(props => {
	ReactDOM.render(<IsomorphicRelay.Renderer {...props} />, rootElement);
});