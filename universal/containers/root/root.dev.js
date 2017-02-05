import React, { Component } from 'react';
import { Router } from 'react-router';


export default class Root extends Component {
    render() {
        const { routing, history } = this.props;
        return (
            <div>
                <Router history={history}>
                    {routing}
                </Router>
            </div>
        );
    }
}