function intelliTransform(tagName, ref, preRange) {
	var sel = document.getSelection();
	var range = sel.getRangeAt(0);

	console.log(range.startContainer);
	console.log(range.startOffset);
	console.log(range.endContainer);
	console.log(range.endOffset);

	// TODO: Travel through only textContents and apply the transformation
	// with my great algorithm

	// Store selection information to variables,
	// then create another selection information
	// that will be restored after the process
	var startNode = range.startContainer, endNode = range.endNode;
	var startOffset = range.startOffset, endOffset = range.endOffset;
	var newStartNode = startNode, newEndNode = endNode;
	var newStartOffset = startOffset, newEndOffset = endOffset;



	// Travelling
	while (1) {

	}




	sel.removeAllRanges();
	var newRange = document.createRange();
	newRange.setStart(newStartNode, newStartOffset);
	sel.addRange(newRange);
}















function itmotnTT(tagName, ref, preRange) {
	var sel = document.getSelection();

	if (preRange) {
		range = preRange;
		sel.removeAllRanges();
		sel.addRange(range);
	}

	if (!isSelectionInMarko()) return;

	console.log("selection test done");

	var range = sel.getRangeAt(0);

	var startNode = range.startContainer, endNode = range.endContainer;
	var startOffset = range.startOffset, endOffset = range.endOffset;
	var newStartNode = startNode, newEndNode = endNode, newStartOffset = startOffset, newEndOffset = endOffset;
	var tempNode;


	// Narrow the selection to the textContent
	// If the selection is mother tag
	while (isMotherTag(newStartNode)) {
		newStartNode = newStartNode.firstChild;
		console.log("narrowing start node");
	}

	console.log(newStartNode);


	// If the start node is textNode and 0 < startOffset < length,
	// split the node and set new starting point
	if (startNode.nodeType === 3) {
		if (startOffset > 0 && startOffset < startNode.textContent.length) {
			var textContent = startNode.textContent;
			var t1 = document.createTextNode(textContent.slice(0, startOffset));
			var t2 = document.createTextNode(textContent.slice(startOffset));

			// Remove the original startNode
			range.collapse(true);
			range.setStartAfter(startNode);
			startNode.parentNode.removeChild(startNode);
			range.insertNode(t1);
			range.setStartAfter(t1);
			range.insertNode(t2);

			newStartNode = t2;
			newStartOffset = 0;

			if (startNode === endNode) {
				newEndNode = newStartNode;
				newEndOffset = endOffset - startOffset;
			}
		}
	}

	// If end node is on the text,
	// split the text into two nodes
	if (newEndNode.nodeType === 3) {
		if (newEndOffset < newEndNode.textContent.length && newEndOffset > 0) {
			var textContent = newEndNode.textContent;
			var t1 = document.createTextNode(textContent.slice(0, newEndOffset));
			var t2 = document.createTextNode(textContent.slice(newEndOffset));

			// Remove the original startNode
			range.collapse(true);
			range.setStartAfter(newEndNode);
			newEndNode.parentNode.removeChild(newEndNode);
			range.insertNode(t1);
			range.setStartAfter(t1);
			range.insertNode(t2);

			newEndNode = t1;
			newEndOffset = t1.textContent.length;

			if (startNode === endNode) {
				newStartNode = newEndNode;
			}
		}
	}

	// Set a travelNode
	var travelNode = newStartNode;

	// If startNode hang on the end of the startNode
	// skip it
	if (newStartNode.nodeType === 3 && newStartOffset < newStartNode.textContent.length) {
		travelNode = newStartNode;
	} else {
		var middleNode = newStartNode;

		while (middleNode !== newEndNode) {
			// Find the first textNode
			if (middleNode.firstChild) {
				middleNode = middleNode.firstChild;
			} else if (middleNode.nextSibling) {
				middleNode = middleNode.nextSibling;
			} else {
				while (true) {
					middleNode = middleNode.parentNode;
					if (middleNode.nextSibling) {
						middleNode = middleNode.nextSibling;
						break;
					}
				}
			}

			if (middleNode.nodeType === 3) {
				travelNode = middleNode;
				break;
			}
		}
	}

	var travelPastNode = travelNode;
	var newTagNodeRange = document.createRange();
	sel.removeAllRanges();
	sel.addRange(newTagNodeRange);

	// Check if starting point is in the middle of the parentNode
	// or the edge of the front
	while (1) {
		if (travelNode.previousSibling) {
			if (travelNode.previousSibling.textContent.length === 0) {
				// If empty node, skip it
				travelNode = travelNode.previousSibling;
				// console.log('empty previous node');
			} else {
				// console.log('previous node exists');
				// console.log(travelNode.previousSibling);
				break;
			}
		} else if (isChildTag(travelNode.parentNode)) {
			travelNode = travelNode.parentNode;
			// console.log('climb up to the parent');
		} else {
			// console.log('no previous node');
			break;
		}
	}

	// Travel through the nodes
	while (1) {
		// Create a node
		// console.log('create a node');
		console.log(travelNode);
		var newTagNode = generateNode(tagName, ref);
		newTagNodeRange.setStartBefore(travelNode);

		// If it's mother tag
		// get into child
		// If it is a endNode stop -> finish
		if (isMotherTag(travelNode)) {
			console.log("mother tag: " + travelNode.nodeName);
			console.log(travelNode.firstChild);
			if (travelNode === newEndNode) {
				break;
			} else {
				if (travelNode.firstChild) {
					console.log("first child exists");
					travelNode = travelNode.firstChild;
				} else {
					travelNode = travelNode.nextSibling;
				}
				// console.log('met mother tag');
				continue;
			}
		}

		//console.log(travelNode);

		var metEndNode = false;

		while (1) {
			//console.log(travelNode);
			if (travelNode === null) {

				// console.log('met null node');
				metEndNode = true;




				break;

			} else if (travelNode.contains(newEndNode)) {

				// console.log('there is endNode somewhere');

				// If it is endNode itself
				// appendChild and clear the process
				if (travelNode === newEndNode) {

					// console.log('it is endNode itself!');
					metEndNode = true;
					newTagNode.appendChild(travelNode);
					// newTagNodeRange.insertNode(newTagNode);
					// console.log('1');
					insertAndCleanNodesAtRange(newTagNodeRange, newTagNode);
					cleanSameTagChildren(newTagNode);

					//console.log(newTagNode);
					break;

				} else {

					// If the endNode is on the last child of all child nodes,
					// clear the process
					tempNode = travelNode;
					while (tempNode.lastChild) {
						if (tempNode.lastChild === newEndNode) {
							metEndNode = true;
							break;
						} else {
							tempNode = tempNode.lastChild;
							metEndNode = false;
						}
					}

					// If endNode is on the last child of all child nodes
					// insert the node and clear the process
					// Else, insert the element
					// and dive into the node and start again with the firstChild
					// of the node
					if (metEndNode) {
						// console.log('end node at the last');
						newTagNode.appendChild(travelNode);
						// newTagNodeRange.insertNode(newTagNode);
						// console.log('2');
						insertAndCleanNodesAtRange(newTagNodeRange, newTagNode);
						cleanSameTagChildren(newTagNode);

						//console.log(newTagNode);
						break;
					} else {
						// console.log('start again');
						if (travelNode.firstChild) {
							travelNode = travelNode.firstChild;
						} else {
							travelNode = travelNode.nextSibling;
						}

						if (newTagNode.firstChild) {
							// newTagNodeRange.insertNode(newTagNode);
							// console.log('3');
							insertAndCleanNodesAtRange(newTagNodeRange, newTagNode);
							cleanSameTagChildren(newTagNode);

							// console.log(newTagNode);
							// console.log(travelNode);
						}

						break;
					}

				}

			} else {

				tempNode = travelNode;
				var tempNextNode = travelNode.nextSibling;
				newTagNode.appendChild(tempNode);
				travelNode = tempNextNode;
				// console.log('find nextSibling');
				// console.log(travelNode);
				// console.log(newTagNode);

				if (travelNode === null) {
					// console.log('next node is null');
					// newTagNodeRange.insertNode(newTagNode);
					// console.log('4');
					newTagNode = insertAndCleanNodesAtRange(newTagNodeRange, newTagNode);
					cleanSameTagChildren(newTagNode);
					tempNode = newTagNode;

					while (1) {
						if (tempNode.parentNode.nextSibling) {
							travelNode = tempNode.parentNode.nextSibling;
							// console.log(travelNode);
							break;
						} else {
							tempNode = tempNode.parentNode;
						}
					}

					// console.log(travelNode);

					break;
				}

			}
		}

		// console.log('new tag node');
		// console.log(newTagNode);

		if (!newTagNode.firstChild) continue;


		// If there is a same tag parent
		// clear it
		tempNode = newTagNode.parentNode;
		var cleared = false;
		while (1) {
			if (isMotherTag(tempNode)) {
				break;
			} else if (isSameTag(tempNode, newTagNode)) {
				var tempTempNode;
				range.setStartAfter(newTagNode);
				while (tempTempNode = newTagNode.firstChild) {
					range.insertNode(tempTempNode);
					range.setStartAfter(tempTempNode);
				}
				newTagNode.parentNode.removeChild(newTagNode);
				cleared = true;
				break;
			} else {
				tempNode = tempNode.parentNode;
			}
		}

		// merge nodes if previous or next node has same tag
		// if (!cleared) {
		// 	if (isSameTag(newTagNode.previousSibling, newTagNode)) {
		// 		var mergedNode = newTagNode.previousSibling;
		// 		while (tempNode = newTagNode.firstChild) {
		// 			mergedNode.appendChild(tempNode);
		// 		}
		// 		newTagNode.parentNode.removeChild(newTagNode);
		// 		newTagNode = mergedNode;
		// 	}

		// 	if (isSameTag(newTagNode.nextSibling, newTagNode)) {
		// 		while (tempNode = newTagNode.nextSibling.firstChild) {
		// 			newTagNode.appendChild(tempNode);
		// 		}
		// 		newTagNode.nextSibling.parentNode.removeChild(newTagNode.nextSibling);
		// 	}
		// }

		if (metEndNode) {
			break;
		}
	}

	// keepRange
	sel.removeAllRanges();
	range.setStart(newStartNode, newStartOffset);
	range.setEnd(newEndNode, newEndOffset);
	sel.addRange(range);

	updatePreview();

	console.log("transforming done");
}
