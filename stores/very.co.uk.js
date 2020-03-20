const store = {
	interceptedAdd: [
		'https://www.very.co.uk/product.page?_DARGS=/content/template/slots/productPage/productPageSelectorsSlot.jsp.addToCartForm', // adding to the cart
	],

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
					title: e.querySelector('.itemTitle').innerText.trim(),
					quantity: e.querySelector('.quantity').value,
					price: e.querySelector('.priceWhenAddedToBasket').value,
				};
			});
		} else {
			this.cart.items = [];
		}
	},

	onAdd(data) {
		console.log('JustLess very.co.uk.js onAdd()');
		const json = JSON.parse(data);

		if (
			json.status !== 'success' &&
			(!json.productTitle || !json.productQuantity || !json.productPrice)
		) {
			// Fallback
			this.updateCart();
			return;
		}

		this.cart.items.push({
			title: json.productTitle,
			quantity: json.productQuantity,
			price: numerize(json.productPrice, this.separator),
		});
	},
};

// eslint-disable-next-line no-undef
Object.setPrototypeOf(store, JustLess);
store.init();
