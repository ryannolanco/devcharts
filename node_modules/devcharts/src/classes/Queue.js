import Node from './Node';

class Queue {
	constructor(limit = 20) {
		this.items = [];
		this.limit = limit;
	}

	enqueue(item) {
		if (this.items.length >= this.limit) {
			this.items.shift(); // Remove oldest trade
		}
		this.items.push(item); // Add new trade
	}

	getItems() {
		return [...this.items]; // Return a copy to avoid mutation issues
	}
}

export default Queue;
