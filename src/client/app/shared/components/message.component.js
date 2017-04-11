import React from 'react';

let noop = () => {};

export class MessageBox extends React.Component {

	static propTypes = {
		message: React.PropTypes.string,
		status: React.PropTypes.string,
		onMessageDisplayed: React.PropTypes.func,
		closeable : React.PropTypes.bool
	};

	static defaultProps = {
		status: 'info',
		onMessageDisplayed: noop,
		closeable: false
	};

	constructor(props, context) {
		super(props, context);
		this.state = {
			closed: false
		};
	}

	dismiss(event) {
		event.preventDefault();
		this.setState({
			closed: true
		});
		return false;
	}

	messageDisplayed() {
		if (typeof this.props.onMessageDisplayed === "function") {
			this.props.onMessageDisplayed.call(this);
		}
	}

	status(status) {
		switch (status) {
			case 'error':
				return 'alert-danger';
			default:
				return 'alert-info';
		}
	}

	render() {
		let {message, status} = this.props;
		if (!this.state.closed && message && status) {
			this.messageDisplayed();
			let closeButton = undefined;
			if (this.props.closeable) {
				closeButton = (
					<div className='pull-right close' onClick={ (e) => { return this.dismiss(e); } }>
						&times;
					</div>
				);
			}
			return (
				<div className={ 'alert ' + this.status(status) }>
					{ closeButton }
					{ message }
				</div>
			);
		} else {
			return (
				<div style={{ 'display': 'none' }}></div>
			);
		}
	}

}