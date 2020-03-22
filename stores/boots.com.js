const store = {
	cartPathName: ['/OrderItemDisplay', '/AjaxOrderItemDisplayView'],

	onInit() {
		// TODO: need to detect currency
		this.cart.currency = '£';
	},

	async fetchCart() {
		console.log('JustLess boots.com.js fetchCart()');
		const basket = await fetch('https://www.boots.com/ShopCartDisplayView', {
			method: 'GET',
			credentials: 'include',
		});

		const text = await basket.text();
		return new DOMParser().parseFromString(text, 'text/html');
	},

	parseCart(doc) {
		console.log('JustLess boots.com.js parseCart()');

		this.cart.items = [
			...doc.querySelectorAll('#products_container .basket_product_details'),
		].map(e => {
			const quantity = e.querySelector('.basket_quantity')
				? e.querySelector('.basket_quantity').value
				: e.querySelector('.free_gift_qty')
					? e.querySelector('.free_gift_qty').value
					: 0;

			const priceRaw = e.querySelector('.basket_product_price .showing_pounds')
				? e.querySelector('.basket_product_price .showing_pounds').innerText.trim()
				: e.querySelector('.basket_product_price .details')
					? e.querySelector('.basket_product_price .details').innerText.trim()
					: 'free';

			const price =
				priceRaw.toLowerCase() === 'free'
					? 0
					: Math.round((numerize(priceRaw, this.separator) / quantity) * 100) / 100;

			return {
				title: e.querySelector('.basketitem').innerText.trim(),
				quantity: quantity,
				price: price,
			};
		});
	},

	async onAdd() {
		this.parseCart(await this.fetchCart());
	},

	async onDelete() {
		this.parseCart(await this.fetchCart());
	},

	// overwrite the default behavior
	async onUpdate() {
		this.parseCart(await this.fetchCart());
	},
};

// eslint-disable-next-line no-undef
Object.setPrototypeOf(store, JustLess);
store.init();
