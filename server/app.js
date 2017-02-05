import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { RouterContext, match } from 'react-router';

import routes from '../universal/routes';

const isDev = (process.env.NODE_ENV !== 'production');

export default function (req, res) {
	console.log(' [x] Request for', req.url);

    // Wire up routing based upon routes
	match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
		if (req.user != null) {
			console.log('[AUTH]', req.user);
		} else {
			console.log('[AUTH] unauthorized request');
		}

		if (error) {
			console.log('Error', error);
			res.status(400);
			res.send(error);
			return;
		}

		if (redirectLocation) {
			res.redirect(redirectLocation);
			return;
		}

        // Render the component to a string
		const html = ReactDOMServer.renderToString(
            <RouterContext {...renderProps} />
        );

		res.render('index', { isProd: (!isDev), html });
	});
}