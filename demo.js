/**
 * to create a processed JSON like this:
 *     var array = new testObj(keys, array);
 *
 * @param {Array} keys
 * @param {Array} array
 * 
 * 
 */

var testObj = function(keys, array) {
	this.keys = keys;
	this.array = array;
	this.count = 0;
	this.tree = new testObj.Node({}, this._getId());
	this.tree.level = 0;
	this.output = [];
	this.init();
	return this.output;
};

testObj.Node = function(el, id) {
	this.element = el;
	this.id = id;
	this.parent = null;
	this.firstChild = null;
	this.nextSibling = null;
};

testObj.Node.prototype = {
	constructor: testObj.Node,

	/**
	     * Append a tree node to a tree node
	     *
	     * @method append
	     * @param {Object testObj.Node} node
	     * @return {Object testObj.Node}
	     */
	append: function(node) {
		if (this.firstChild == null) {
			this.firstChild = node;
		} else {
			var child = this.firstChild;
			while (child.nextSibling != null) {
				child = child.nextSibling;
			}
			child.nextSibling = node;
		}
		node.parent = this;

		return node;
	}
};

testObj.prototype = {
	constructor: testObj,

	/**
	     * Initialize the node tree
	     *
	     * @method init
	     */
	init: function() {
		for (var i = 0; i < this.array.length; i++) {
			var exist = true;
			var p = this.tree;
			for (var j = 0; j < this.keys.length; j++) {
				if (!exist) {
					p = p.append(new testObj.Node(testObj.copy(p.element), this._getId()));
					p.element[this.keys[j]] = this.array[i][this.keys[j]];   //
					p.level = j + 1;
					p.leaf = false;
				} else if (!p.firstChild) {
					exist = false;
					p = p.append(new testObj.Node(testObj.copy(p.element), this._getId()));
					p.element[this.keys[j]] = this.array[i][this.keys[j]];
					p.level = j + 1;
					p.leaf = false;
				} else {
					p = p.firstChild;
					exist = false;
					do {
						if (p.element[this.keys[j]] == this.array[i][this.keys[j]]) {
							exist = true;
							break;
						}
					} while (p.nextSibling && (p = p.nextSibling));
					if (!exist) {
						p = p.parent; //can be improved
						p = p.append(new testObj.Node(testObj.copy(p.element), this._getId()));
						p.element[this.keys[j]] = this.array[i][this.keys[j]];
						p.level = j + 1;
						p.leaf = false;
					}
				}
			}
			p = p.append(new testObj.Node(this.array[i], this._getId()));
			p.level = j + 1;
			p.leaf = true;
		}

		this.toArray();
	},

	/**
	     * create Id for a new node
	     *
	     * @method _getId
	     * @return {number}
	     */
	_getId: function() {
		return this.count++;
	},

	/**
	     * traversal and add node element into a array
	     *
	     * @method _traversal
	     * @param {Object testObj.Node} node
	     * @return {number} sum
	     */
	_traversal: function(node) {
		var sum = 0;
		if (!node.firstChild) {
			sum++;

			var out = testObj.copy(node.element);
			out['_id'] = node.id;
			if (node.parent.id) out['_parentId'] = node.parent.id;
			out['_level'] = node.level;
			this.output.push(out);

			return sum;
		} else {
			var p = node.firstChild;
			do {
				sum += this._traversal(p);
			} while (p.nextSibling && (p = p.nextSibling));

			if (node.parent) {
				var out = testObj.copy(node.element);
				out['_id'] = node.id;
				if (node.parent.id) out['_parentId'] = node.parent.id;
				out['_level'] = node.level;
				out['_state'] = "closed";
				out['_n'] = sum;
				this.output.push(out);
			}
			
			return sum;
		}
	},

	/**
	     * return the node tree array
	     *
	     * @method toArray
	     * @return {array}
	     */
	toArray: function() {
		b = this._traversal(this.tree);
	}
};

/**
     * copy a object
     *
     * @method testObj.copy
     * @param {Object} obj
     * @return {Object}
     */
testObj.copy = function(obj) {
	var newObj = {};
	for (var n in obj) {
		if (obj[n] === null){
			newObj[n] = null;
		} else if (typeof obj[n] == "object") {
			newObj[n] = testObj.copy(obj[n]);
		} else {
			newObj[n] = obj[n];
		}
	}
	return newObj;
};