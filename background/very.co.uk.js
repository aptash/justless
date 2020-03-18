// ?_DARGS=/content/template/slots/productPage/productPageSelectorsSlot.jsp.addToCartForm
chrome.webRequest.onCompleted.addListener(
	details => {
		console.log(`URL: ${details.url}`);
		chrome.tabs.sendMessage(details.tabId, {
			subject: SUBJECT_ITEM_ADDED,
			from: FROM_BACKGROUND,
		});
	},
	{
		urls: [
			'https://www.very.co.uk/product.page?_DARGS=/content/template/slots/productPage/productPageSelectorsSlot.jsp.addToCartForm', // adding to the cart
		],
	},
);
