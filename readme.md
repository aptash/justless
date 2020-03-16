# Justless Test Task - Senior Extensions Developer

The task is to develop a very simple browser extension that has two main components

- A background page that is shown inside the extension pop-up and presents the user with a simple UI
- A script that runs when the user goes to very.co.uk and tracks user’s actions that add or remove products to the shopping cart. The script should communicate any shopping cart state changes to the main extension and inside the UI it must present items that have been added to the shopping cart on the website, as a list with product titles and prices. A total price for the whole cart must also be shown.

You are free to choose any tooling you feel necessary to perform the task and present it as a Git repo with visible commit history.

We expect to receive clean, maintainable, robust and well-documented code. For the timeframe, we look for 7 business days to complete the task.

---

## My own developing notes and comments

There was a problem (Access Denied. You don't have permission to access "<http://www.very.co.uk>" on this server. Reference #18.2da40517.1583851802.25977ee9) with opening very.co.uk in my Chrome. To accomplish the test task I was offered a list of other websites to choose from:

- https://www.johnlewis.com/
- https://www.marksandspencer.com/
- https://www.boots.com/

Firstly I chose marksandspencer.com but secondly to demonstrate different approaches also decided to accomplish the task for boots.com.

For boots.com, chrome.webRequest.onCompleted event listener is used.
For marksandspencer.com, the XHR interceptor is used because of some delayed cart refreshing in case of using chrome.webRequest.onCompleted.

The app consists of the following modules:

- core.js is the main script of the content scripts
- each web store has its own js-file
- some web stores can use the same eCommerce engine. In such cases, a developer should put as much code as possible into the engine's script to minimize repeated code using.
- background script allows dividing the code between files. So a developer is free to use one background script for all stores or one background script per web store or any other combination of background scripts.

The current version works on:

- https://www.marksandspencer.com for the U.K.
- https://www.boots.com for the U.K.

You can do the following actions:

- add items to the cart
- remove items from the cart
- update item amount in the cart

To view the updated cart please click the extension's icon on the browser's toolbar.
