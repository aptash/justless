const store = {
	onInit() {
		// TODO: need to detect currency
		this.cart.currency = '£';
	},

	async updateCart() {
		console.log('JustLess very.co.uk.js updateCart()');

		const basket = await fetch('https://www.very.co.uk/basket.page', {
			method: 'GET',
			credentials: 'include',
		});

		const text = await basket.text();
		const doc = new DOMParser().parseFromString(text, 'text/html');

		if (doc.querySelectorAll('.item')) {
			this.cart.items = [...doc.querySelectorAll('.item')].map(e => {
				return {
					title: e.querySelector('.name').innerText.trim(),
					quantity: e.querySelector('.quantity').value,
					price: e.querySelector('.priceWhenAddedToBasket').value,
				};
			});
		} else {
			this.cart.items = [];
		}
	},

	onAdd() {
		this.updateCart();
	},
};

// eslint-disable-next-line no-undef
Object.setPrototypeOf(store, JustLess);
store.init();
