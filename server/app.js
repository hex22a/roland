import IsomorphicRelay from 'isomorphic-relay'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Relay from 'react-relay'
import rootContainerProps from '../universal/containers/root/props'

const GRAPHQL_URL = 'http://localhost:3000/graphql';

const networkLayer = new Relay.DefaultNetworkLayer(GRAPHQL_URL);

export default (res, next) => {
	IsomorphicRelay.prepareData(rootContainerProps, networkLayer).then(({ data, props }) => {
		const reactOutput = ReactDOMServer.renderToString(
			<IsomorphicRelay.Renderer {...props} />
		);
		res.render('index', {
			preloadedData: data,
			reactOutput
		});
	}).catch(next);
}