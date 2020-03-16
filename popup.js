// update popup UI
const updateUI = cart => {
	console.log(`JuastLess Popup: ${cart}`);
	const table = document.querySelector('table');
	cart.items.forEach(e => {
		const item = document.createElement('tr');
		table.appendChild(item);
		item.outerHTML = `
    <tr>
      <td nowrap>${e.title}</td>
      <td align="right"><span>${e.quantity}</span></td>
      <td align="right"><span>${cart.currency}${e.price}</span></td>
    </tr>`;
	});

	//calculate total
	const total = document.querySelector('#total');
	total.innerText =
		cart.currency +
		Math.round(
			cart.items.reduce((sum, current) => sum + current.quantity * current.price, 0) *
				100,
		) /
			100;
};

// Once the popup's DOM is ready
window.addEventListener('DOMContentLoaded', () => {
	// query for the active tab
	chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
		// and send a request to the content script
		chrome.tabs.sendMessage(
			tabs[0].id,
			// ask for the cart info
			{ from: FROM_POPUP, subject: SUBJECT_GET_CART },
			// specify a callback to be called
			// from the receiving end (content script).
			updateUI,
		);
	});
});
