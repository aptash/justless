// IBM WebSphere Commerce is used as engine for many stores
// marksandspencer.com uses IBM WebSphere Commerce as well
// For demo purpose some functionality was put here

const ibm = {
	async fetchCart() {
		console.log('JustLess ibm.js fetchCart()');

		const basket = await fetch(
			`${this.DOMAIN_URL}/webapp/wcs/stores/servlet/MSOrderItemUpdateCmd?resJSON=true&basketAction=updateQty&storeId=${this.storeId}`,
			{
				method: 'GET',
				credentials: 'include',
				headers: {
					Accept: 'application/json, text/javascript, */*; q=0.01',
				},
			},
		);

		return await basket.json();
	},

	parseCart(json) {
		console.log('JustLess ibm.js parseCart()');
		if (json.orderItems) {
			this.cart.items = [...json.orderItems].map(e => {
				return {
					title: e.productTitle,
					quantity: e.quantity,
					price: numerize(e.itemPrice, this.separator),
				};
			});
		} else {
			this.cart.items = [];
		}
	},
};

// eslint-disable-next-line no-undef
Object.setPrototypeOf(ibm, JustLess);
