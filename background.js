chrome.runtime.onMessage.addListener((request, sender) => {
	if (request.from === 'core' && request.subject === 'show_page_action') {
		// Enable the page-action for the requesting tab.
		chrome.pageAction.show(sender.tab.id);
	}
});
