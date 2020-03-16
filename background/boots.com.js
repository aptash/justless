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
			'https://www.boots.com/AjaxCustomOrderItemAdd', // adding to the cart
			'https://www.boots.com/*/AjaxCustomOrderItemAdd', // adding to the cart
		],
	},
);

chrome.webRequest.onCompleted.addListener(
	details => {
		console.log(`URL: ${details.url}`);
		chrome.tabs.sendMessage(details.tabId, {
			subject: SUBJECT_ITEM_DELETED,
			from: FROM_BACKGROUND,
		});
	},
	{
		urls: [
			'https://www.boots.com/AjaxOrderChangeServiceItemDelete', // removing item
		],
	},
);

chrome.webRequest.onCompleted.addListener(
	details => {
		console.log(`URL: ${details.url}`);
		chrome.tabs.sendMessage(details.tabId, {
			subject: SUBJECT_CART_UPDATED,
			from: FROM_BACKGROUND,
		});
	},
	{
		urls: [
			'https://www.boots.com/AjaxOrderChangeServiceItemUpdate', // cart update
		],
	},
);
