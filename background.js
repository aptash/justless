chrome.webRequest.onCompleted.addListener(
	details => {
		console.log(`URL: ${details.url}`);
		chrome.tabs.sendMessage(details.tabId, {
			subject: 'cart_updated',
			from: 'background',
		});
	},
	{
		urls: [
			'https://www.marksandspencer.com/webapp/wcs/stores/servlet/AjaxOrderItemAddCmd', // adding to the cart
			'https://www.marksandspencer.com/webapp/wcs/stores/servlet/MSOrderItemUpdateCmd', // updating the cart
		],
	},
);
