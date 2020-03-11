const store = {
	async updateCart() {
		const basket = await fetch(
			'https://www.marksandspencer.com/webapp/wcs/stores/servlet/MSResMiniBasket',
			{
				method: 'GET',
				credentials: 'include',
				headers: {
					Accept: 'application/json, text/javascript, */*; q=0.01',
				},
			},
		);

		const json = await basket.json();

		this.cart = [...json.basketDetails].map(e => {
			return {
				title: e.productTitle,
				quantity: e.quantity,
				currency: e.currency,
				price: e.itemPrice,
			};
		});
	},
};

// eslint-disable-next-line no-undef
Object.setPrototypeOf(store, JustLess);
store.init();
