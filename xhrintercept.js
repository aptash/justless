if (typeof origSend === 'undefined') {
	let origSend = XMLHttpRequest.prototype.send;

	// XMLHttpRequest send overwritting
	XMLHttpRequest.prototype.send = function(body) {
		this.addEventListener('load', () => {
			// send a message to extension
			// TODO: need to handle intercepted URLs only
			let data = {
				type: 'JUSTLESS_INTERCEPTOR',
				body: body,
				status: this.status,
				statusText: this.statusText,
				responseText:
					this.responseType === 'json'
						? JSON.stringify(this.response)
						: this.responseText,
				responseURL: this.responseURL,
			};
			window.postMessage(data, '*');
		});
		origSend.apply(this, arguments);
	};
}
