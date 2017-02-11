import IsomorphicRouter from 'isomorphic-relay-router';
import ReactDOMServer from 'react-dom/server'
import Relay from 'react-relay'
import { match } from 'react-router';
import routes from '../universal/routes';


const GRAPHQL_URL = 'http://localhost:3000/graphql';

const networkLayer = new Relay.DefaultNetworkLayer(GRAPHQL_URL);

export default(req, res, next) => {
	console.log(req.url);
	match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
		if (error) {
			next(error);
		} else if (redirectLocation) {
			res.redirect(302, redirectLocation.pathname + redirectLocation.search);
		} else if (renderProps) {
			IsomorphicRouter.prepareData(renderProps, networkLayer).then(render).catch(next);
		} else {
			res.status(404).send('Not Found');
		}
		function render({ data, props }) {
			const reactOutput = ReactDOMServer.renderToString(IsomorphicRouter.render(props));
			res.render('index', {
				preloadedData: data,
				reactOutput
			});
		}
	});
}