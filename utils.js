/* eslint-disable no-unused-vars */
// consts "subject"
const SUBJECT_CART_UPDATED = 'cart_updated';
const SUBJECT_ITEM_ADDED = 'item_added';
const SUBJECT_ITEM_DELETED = 'item_deleted';
const SUBJECT_GET_CART = 'get_cart';
const SUBJECT_SHOW_PAGE_ACTION = 'show_page_action';

// consts "from"
const FROM_CORE = 'core';
const FROM_BACKGROUND = 'background';
const FROM_POPUP = 'popup';

// any string to float number coverter
// eslint-disable-next-line no-unused-vars
const numerize = (stringNumber, separator) => {
	const str =
		separator === '.'
			? stringNumber.replace(/[^0-9.]+/g, '')
			: stringNumber.replace(/[^0-9,]+/g, '').replace(',', '.');

	return Math.round(parseFloat(str.match(/(\d+(?:\.\d{0,2})?)/)[1]) * 100) / 100;
};
