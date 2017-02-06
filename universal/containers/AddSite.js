/**
 * Crafted by x22a on 06.02.17.
 */
import React, { Component, PropTypes } from 'react';
import Input from '../components/common/Input/Input'
import Button from '../components/common/Button/Button'

export default class AddSite extends Component {
	static propTypes = {
		onSave: PropTypes.func.isRequired,
	};

	constructor(props, context) {
		super(props, context);
		this.state = {
			name: this.props.name || '',
			url: this.props.url || '',
			nameError: false,
			urlError: false
		};
	}

	handleNameChange(e) {
		this.setState({ name: e.target.value });
	}

	handleUrlChange(e) {
		this.setState({ url: e.target.value });
	}

	handleSubmit(e) {
		e.preventDefault();

		const { state } = this;
		let errors = false;

		this.setState({
			nameError: false,
			urlError: false
		});

		if (state.url === '') {
			errors = true;
			this.setState({ url: true });
		}

		if (state.name === '') {
			errors = true;
			this.setState({ nameError: true });
		}

		if (!errors) {
			// call mutation
			this.props.onSave({ name: this.state.name, url: this.state.url });

			this.setState({
				name: '',
				url: ''
			})
		}
	}

	render() {
		const { name, nameError, url, urlError } = this.state;

		return (
			<form onSubmit={ ::this.handleSubmit }>
				<Input
					type="text"
					placeholder="name"
					name="name"
					onChange={ ::this.handleNameChange }
					value={ name }
					err={ nameError }/>
				<Input
					type="text"
					placeholder="url"
					name="url"
					onChange={::this.handleUrlChange}
					value={ url }
					err={ urlError }/>
				<Button type="submit">Save</Button>
			</form>
		);
	}
}