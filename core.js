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

	// event handlers
	onAddCore(data) {
		if (this.onAdd) {
			this.onAdd(data);
		}
	},

	onUpdateCore(data) {
		if (this.onUpdate) {
			this.onUpdate(data);
		}
	},

	onDeleteCore(data) {
		if (this.onDelete) {
			this.onDelete(data);
		}
	},

	// default onUpdate handler for most cases
	onUpdate() {
		this.updateCart();
	},
};

// Inform the background page that
// this tab should have a page-action.
chrome.runtime.sendMessage({
	from: FROM_CORE,
	subject: SUBJECT_SHOW_PAGE_ACTION,
});
