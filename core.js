/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
const JustLess = {
	separator: '.',

	cart: {
		items: [],
		currency: '',
	},

	interceptedAdd: [],
	interceptedUpdate: [],
	interceptedDelete: [],

	// the main method of the extension's initialization
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
				if (request.from === FROM_BACKGROUND) {
					if (request.subject === SUBJECT_CART_UPDATED) {
						this.onUpdateCore();
					} else if (request.subject === SUBJECT_ITEM_ADDED) {
						this.onAddCore();
					} else if (request.subject === SUBJECT_ITEM_DELETED) {
						this.onDeleteCore();
					}
				} else if (request.from === FROM_POPUP && request.subject === SUBJECT_GET_CART) {
					// popup asks for the cart info
					// send internal cart's state
					response(this.cart);
				}
			});
		};

		// Do we need to intercept XHR?
		if (
			(this.interceptedAdd.length ||
				this.interceptedDelete.length ||
				this.interceptedUpdate.length) &&
			!document.querySelector('#JUSTLESS_INTERCEPTOR')
		) {
			const interceptorJS = document.createElement('script');
			interceptorJS.type = 'text/javascript';
			interceptorJS.id = 'JUSTLESS_INTERCEPTOR';
			interceptorJS.src = chrome.runtime.getURL('xhrintercept.js');
			interceptorJS.onload = () => {
				window.addEventListener('message', event => {
					// We only accept messages from ourselves
					if (event.source != window) return;

					if (event.data.type && event.data.type == 'JUSTLESS_INTERCEPTOR') {
						console.log(`JustLess core.js Intercepted: ${event.data.responseURL}`);

						// check which event handler to run
						if (
							this.interceptedAdd.some(url =>
								String(event.data.responseURL).includes(url),
							)
						) {
							this.onAddCore(event.data.responseText);
						} else if (
							this.interceptedUpdate.some(url =>
								String(event.data.responseURL).includes(url),
							)
						) {
							this.onUpdateCore(event.data.responseText);
						} else if (
							this.interceptedDelete.some(url =>
								String(event.data.responseURL).includes(url),
							)
						) {
							this.onDeleteCore(event.data.responseText);
						}
					}
				});
				doInit();
			};
			document.body.appendChild(interceptorJS);
		} else {
			doInit();
		}
	},

	// onAdd the event handler wrapper
	async onAddCore(data) {
		if (this.onAdd) {
			// TODO: do some stuff before the event handler
			await this.onAdd(data);
			// TODO: do some stuff after the event handler
		}
	},

	// onUpdate the event handler wrapper
	async onUpdateCore(data) {
		if (this.onUpdate) {
			// TODO: do some stuff before the event handler
			await this.onUpdate(data);
			// TODO: do some stuff after the event handler
		}
	},

	// onDelete the event handler wrapper
	async onDeleteCore(data) {
		if (this.onDelete) {
			// TODO: do some stuff before the event handler
			await this.onDelete(data);
			// TODO: do some stuff after the event handler
		}
	},

	// default onUpdate handler for most cases
	async onUpdate(data) {
		await this.updateCart(data);
	},

	async updateCart() {
		console.log('JustLess core.js updateCart()');
		// Check if we are on the cart URL
		if (
			this.cartPathName &&
			this.cartPathName.find(e => document.location.pathname.startsWith(e))
		) {
			// It's the cart's URL. Just parse the current document.
			this.parseCart(document);
		} else {
			// Fetch the cart and parse the result
			this.parseCart(await this.fetchCart());
		}
	},
};

// Inform the background page that
// this tab should have a page-action.
chrome.runtime.sendMessage({
	from: FROM_CORE,
	subject: SUBJECT_SHOW_PAGE_ACTION,
});
