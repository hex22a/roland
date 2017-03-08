import MainContainer from './containers/Main';
import SignUp from './containers/SignUp'

import ViewerQueries from './queries/ViewerQueries';

export default [
	{
		path: '/',
		component: MainContainer,
		queries: ViewerQueries,
	},
	{
		path: '/sign-up',
		component: SignUp,
		queries: ViewerQueries,
	},
];