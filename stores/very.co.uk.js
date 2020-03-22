const store = {
	interceptedAdd: [
		'https://www.very.co.uk/product.page?_DARGS=/content/template/slots/productPage/productPageSelectorsSlot.jsp.addToCartForm', // adding to the cart
	],

	cartPathName: ['/basket.page'],

	onInit() {
		// TODO: need to detect currency
		this.cart.currency = '£';
	},

	// Fetch the cart's URL
	async fetchCart() {
		console.log('JustLess very.co.uk.js fetchCart()');
		const basket = await fetch('https://www.very.co.uk/basket.page', {
			method: 'GET',
			credentials: 'include',
		});

		const text = await basket.text();
		return new DOMParser().parseFromString(text, 'text/html');
	},

	// Parse the document
	parseCart(doc) {
		console.log('JustLess very.co.uk.js parseCart()');
		this.cart.items = [...doc.querySelectorAll('.item')].map(e => {
			return {
				title: e.querySelector('.itemTitle').innerText.trim(),
				quantity: e.querySelector('.quantity').value,
				price: e.querySelector('.priceWhenAddedToBasket').value,
			};
		});
	},

	async onAdd(data) {
		console.log('JustLess very.co.uk.js onAdd()');
		const json = JSON.parse(data);

		if (
			json.status !== 'success' &&
			(!json.productTitle || !json.productQuantity || !json.productPrice)
		) {
			// Fallback
			await this.updateCart();
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
