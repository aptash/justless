// update popup UI
const updateUI = cart => {
	console.log(`JuastLess Popup: ${cart}`);
	const table = document.querySelector('table');
	let currency = '';
	cart.forEach(e => {
		const item = document.createElement('tr');
		table.appendChild(item);
		item.outerHTML = `
    <tr>
      <td nowrap>${e.title}</td>
      <td align="right"><span>${e.quantity}</span></td>
      <td align="right"><span>${e.currency}${e.price}</span></td>
    </tr>`;
		currency = e.currency;
	});

	//calculate total
	const total = document.querySelector('#total');
	total.innerText =
		currency + cart.reduce((sum, current) => sum + current.quantity * current.price, 0);
};

// Once the popup's DOM is ready
window.addEventListener('DOMContentLoaded', () => {
	// query for the active tab
	chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
		// and send a request to the content script
		chrome.tabs.sendMessage(
			tabs[0].id,
			// ask for the cart info
			{ from: 'popup', subject: 'get_cart' },
			// specify a callback to be called
			// from the receiving end (content script).
			updateUI,
		);
	});
});
