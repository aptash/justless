chrome.runtime.onMessage.addListener((request, sender) => {
	if (request.from === 'core' && request.subject === 'show_page_action') {
		// Enable the page-action for the requesting tab.
		chrome.pageAction.show(sender.tab.id);
	}
});

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
			'https://www.boots.com/AjaxCustomOrderItemAdd', // adding to the cart
			'https://www.boots.com/*/AjaxCustomOrderItemAdd', // adding to the cart
			'https://www.boots.com/AjaxOrderChangeServiceItemDelete', // removing item
			'https://www.boots.com/AjaxOrderChangeServiceItemUpdate', // cart update
		],
	},
);
