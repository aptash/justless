// eslint-disable-next-line no-unused-vars
const JustLess = {
	cart: [],

	init() {
		// get current cart
		this.updateCart();

		// messaging with background and popup
		chrome.runtime.onMessage.addListener((request, sender, response) => {
			console.log(`JustLess Core: ${request.subject} ${request.from}`);
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
	},
};
