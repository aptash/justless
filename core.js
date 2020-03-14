// eslint-disable-next-line no-unused-vars
const JustLess = {
	separator: '.',

	cart: {
		items: [],
		currency: '',
	},

	init() {
		const doInit = async () => {
			console.log('JustLess core.js doInit()');
			// onInit event handler
			if (this.onInit) {
				await this.onInit();
			}

			// get current cart
			this.updateCart();

			// messaging with background and popup
			chrome.runtime.onMessage.addListener((request, sender, response) => {
				console.log(`JustLess core.js onMessage: ${request.subject} ${request.from}`);
				// background script detected cart update.
				if (request.from === 'background' && request.subject === 'cart_updated') {
					// update internal cart's state
					this.updateCart();
				} else if (request.from === 'popup' && request.subject === 'get_cart') {
					// popup asks for the cart info
					// send internal cart's state
					response(this.cart);
				}
			});
		};

		// Do we need to intercept XHR?
		if (
			this.interceptedURLs &&
			this.interceptedURLs.length &&
			!document.querySelector('#JUSTLESS_INTERCEPTOR')
		) {
			const interceptorJS = document.createElement('script');
			interceptorJS.type = 'text/javascript';
			interceptorJS.id = 'JUSTLESS_INTERCEPTOR';
			interceptorJS.src = chrome.runtime.getURL('xhrintercept.js');
			interceptorJS.onload = () => {
				//this.remove();
				window.addEventListener('message', event => {
					// We only accept messages from ourselves
					if (event.source != window) return;

					if (
						event.data.type &&
						event.data.type == 'JUSTLESS_INTERCEPTOR' &&
						this.interceptedURLs.some(url => String(event.data.responseURL).includes(url))
					) {
						console.log(`JustLess core.js Intercepted: ${event.data.responseURL}`);
						// TODO: distinguish add, remove, update item
						this.updateCart();
					}
				});
				doInit();
			};
			document.body.appendChild(interceptorJS);
		} else {
			doInit();
		}
	},
};

// Inform the background page that
// this tab should have a page-action.
chrome.runtime.sendMessage({
	from: 'core',
	subject: 'show_page_action',
});

// any string to float number coverter
// eslint-disable-next-line no-unused-vars
function numerize(stringNumber, separator) {
	const str =
		separator === '.'
			? stringNumber.replace(/[^0-9.]+/g, '')
			: stringNumber.replace(/[^0-9,]+/g, '').replace(',', '.');

	return Math.round(parseFloat(str.match(/(\d+(?:\.\d{0,2})?)/)[1]) * 100) / 100;
}
