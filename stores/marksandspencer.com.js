const store = {
	interceptedAdd: [
		'www.marksandspencer.com/webapp/wcs/stores/servlet/AjaxOrderItemAddCmd',
	],
	interceptedUpdate: [
		'www.marksandspencer.com/webapp/wcs/stores/servlet/MSOrderItemUpdateCmd',
	],

	DOMAIN_URL: 'https://www.marksandspencer.com',

	onInit() {
		// TODO: need to detect currency
		this.cart.currency = '£';
	},

	onAdd(data) {
		console.log('JustLess marksandspencer.com.js onAdd()');
		const json = JSON.parse(data);

		if (
			json.errorcode &&
			(!json.title || !json.quantity_1 || !json.quantity_1.length || !json.ecommPvalue)
		) {
			console.log(`JustLess marksandspencer.com.js onAdd(${json.errorMessage})`);
			return;
		}

		this.cart.items.push({
			title: json.title,
			quantity: json.quantity_1[0],
			price: json.ecommPvalue,
		});
	},

	onUpdate(data) {
		console.log('JustLess marksandspencer.com.js onUpdate()');
		const json = JSON.parse(data);
		this.cart.items = [...json.orderItems].map(e => {
			return {
				title: e.productTitle,
				quantity: e.quantity,
				price: numerize(e.itemPrice, this.separator),
			};
		});
	},
};

// eslint-disable-next-line no-undef
Object.setPrototypeOf(store, ibm);
store.init();
