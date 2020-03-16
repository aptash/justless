// IBM WebSphere Commerce is used as engine for many stores
// marksandspencer.com uses IBM WebSphere Commerce as well
// For demo purpose some functionality was put here

const ibm = {
	async updateCart() {
		console.log('JustLess ibm.js updateCart()');

		const basket = await fetch(
			`${this.DOMAIN_URL}/webapp/wcs/stores/servlet/MSResMiniBasket`,
			{
				method: 'GET',
				credentials: 'include',
				headers: {
					Accept: 'application/json, text/javascript, */*; q=0.01',
				},
			},
		);

		const json = await basket.json();

		this.cart.items = [...json.basketDetails].map(e => {
			return {
				title: e.productTitle,
				quantity: e.quantity,
				price: e.itemPrice,
			};
		});
	},
};

// eslint-disable-next-line no-undef
Object.setPrototypeOf(ibm, JustLess);
