var testObj = function(keys, array) {
	this.keys = keys;
	this.array = array;
	this.count = 0;
	this.tree = new testObj.Node({}, this._getId());
	this.init();
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
	init: function() {
		for (var i = 0; i < this.array.length; i++) {
			var exist = true;
			var p = this.tree;
			for (var j = 0; j < this.keys.length; j++) {
				if (!exist) {
					p = p.append(new testObj.Node(testObj.copy(p.element), this._getId()));
					p.element[this.keys[j]] = this.array[i][this.keys[j]];   //
				} else if (!p.firstChild) {
					exist = false;
					p = p.append(new testObj.Node(testObj.copy(p.element), this._getId()));
					p.element[this.keys[j]] = this.array[i][this.keys[j]];
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
					}
				}

				/*beta*/
				var out = testObj.copy(p.element);
				out['id'] = p.id;
				if (p.parent.id) out['_parentId'] = p.parent.id;
				output.push(out);
			}
			p = p.append(new testObj.Node(this.array[i], this._getId()));

			/*beta*/
			var out = testObj.copy(p.element);
			out['id'] = p.id;
			if (p.parent.id) out['_parentId'] = p.parent.id;
			output.push(out);
		}
	},
	_getId: function() {
		return this.count++;
	}
};

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