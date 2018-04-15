// Written by J.Haemin
// Last modified at 2018.1.2
// copyright jhaemin.com all rights reserved.

// # Known issues/bugs
// 1. When make bold (bold ~ not bold ~ bold) selection, the selection is hidden on 'not bold' element (Solved)
// 2. After text restoration, the range behaves strangely (Solved)
// 3. Form does not work (Solved);
// 4. When press return after not <p></p> tag, new line starts with <div></div> tag (Solved)

'use strict';

// Turn textarea to marko editor

var debugMode = 0;

if (!debugMode) {
	$('.marko-form-submit-textarea').css('display', 'none');
	$('.marko-test-button-container').css('display', 'none');
}

updatePreview();

$('.marko-editor').on('keyup', function(e) {
	updatePreview();
	// console.log('clicked');
	var sel = window.getSelection();
	var range = sel.getRangeAt(0);
	// console.log(range);
	if (sel.isCollapsed) {
		// console.log('no selection');
		$('.tool').removeClass('active');
		return;
	} else {
		// console.log('updated selection');
		updateSelectionStatus();
	}
});

$('.marko-editor').on('keydown', function(e) {
	var keyId = e.which;

	// console.log(keyId);

	var sel = window.getSelection();
	var range = sel.getRangeAt(0);

		if ($(this).html() === "") {
			var p = document.createElement("p");
			p.innerHTML = "<br />";
			document.getElementsByClassName('marko-editor')[0].appendChild(p);
			var s = window.getSelection();
			var r = document.createRange();
			r.setStart(p, 0);
			r.setEnd(p, 0);
			s.removeAllRanges();
			s.addRange(r);
	}


	switch (keyId) {
		case 8:
			// e.preventDefault();
			// range.deleteContents();
		case 86:
		case 13:
			setTimeout(function() {
				convertDivToP();
			}, 0);

			break;

		default:
			break;
	}
});

function convertDivToP() {
	var sel = document.getSelection();
	var range = sel.getRangeAt(0);

	if (!isSelectionInMarko()) return;

	if (range.startContainer.localName === 'div') {
		var newP = document.createElement("p");
		var oldDiv = range.startContainer;

		range.setStartAfter(oldDiv);
		var node;
		while (node = oldDiv.firstChild) {
			// console.log(node);
			newP.appendChild(node);
		}
		oldDiv.parentNode.removeChild(oldDiv);
		range.insertNode(newP);
		range.setStart(newP, 0);
		sel.removeAllRanges();
		sel.addRange(range);

	}
}

$('.insert-img').on('click', function() {
		$('.marko-editor').append('<img src="/assets/images/jhm-logo.svg" />');
});

$('.make-it-bold').on('click', function() {
	textTransformation("b");
});

$('.marko').on('mousedown', function() {
	var markoClick = true;
	document.getElementsByClassName('marko-editor')[0].normalize();
	$(window).on('mouseup', function() {
		if (markoClick) {
			setTimeout(function() {
				updateSelectionStatus();
			}, 0);
			// updatePreview();
		}
	});
});

$('.marko-editor').on('click', function() {
	$('.subtool-container').removeClass('pop-up active');
});

$('.tool').on('click', function() {
	$('.subtool-container').removeClass('pop-up active');
});

$('.tool.bold-union').on('click', function() {
	// console.log('clicked');
	if (window.getSelection().isCollapsed) {
		return;
	}
	if (globalHasCommonStyles && isElmementInArray(globalCommonStylesTags, 'strong') || isElmementInArray(globalCommonStylesTags, 'b')) {
		textRestoration('strong');
		//htmlRestoration('strong');
		$('.bold-union').removeClass('active');
	} else {
		// tagTransformation('strong');
		// textTransformation('strong');
		// htmlTransformation('strong');
		//tagTransformationCompact('strong');

		// itmotnTT('strong');
		intelliTransform('strong');
	}
});

$('.tool.italics-union').on('click', function() {
	if (window.getSelection().isCollapsed) {
		return;
	}
	if (globalHasCommonStyles && isElmementInArray(globalCommonStylesTags, 'em') || isElmementInArray(globalCommonStylesTags, 'i')) {
		textRestoration('em');
		// htmlRestoration('em');
		$('.italics-union').removeClass('active');
	} else {
		// tagTransformation('em');
		// textTransformation('em');
		// htmlTransformation('em');
		// tagTransformationCompact('em');
		itmotnTT('em');
	}
});

$('.tool.underline-union').on('click', function() {
	if (window.getSelection().isCollapsed) {
		return;
	}
	if (globalHasCommonStyles && isElmementInArray(globalCommonStylesTags, 'u')) {
		textRestoration('u');
		// htmlRestoration('u');
		$('.underline-union').removeClass('active');
	} else {
		// tagTransformation('u');
		// textTransformation('u');
		// htmlTransformation('u');
		// tagTransformationCompact('u');
		itmotnTT('underline');
	}
});

$('.tool.link-union').on('click', function() {
	if (window.getSelection().isCollapsed) {
		return;
	}
	if (globalHasCommonStyles && isElmementInArray(globalCommonStylesTags, 'a')) {
		textRestoration('a');
		// htmlRestoration('a');
		$('.underline-union').removeClass('active');
	} else {
		linking();
	}
});


// START
// Aligning paragraphs event listeners
document.querySelector('.tool.list-union').addEventListener('click', function() {
	listing();
});

document.querySelector('.tool.align-left').addEventListener('click', function() {
	align('left');
});

document.querySelector('.tool.align-center').addEventListener('click', function() {
	align('center');
});

document.querySelector('.tool.align-right').addEventListener('click', function() {
	align('right');
});
// Aligning paragraphs listeners
// END

$('.tool.heading').on('click', function() {
	$('.subtool-container.heading').addClass('active');
	setTimeout(function() {
		$('.subtool-container.heading').addClass('pop-up');
	}, 0);
});

// $('.subtool').on('click', function() {
// 	$('.subtool-container').removeClass('pop-up');
// 	$('.subtool-container').removeClass('active')
// });

var subTools = document.querySelectorAll('.subtool');
subTools.forEach( function(item, index) {
	item.addEventListener('click', function() {
		document.querySelector('.subtool-container').classList.remove('pop-up');
		document.querySelector('.subtool-container').classList.remove('active');
	});
});

$('.subtool.heading1').on('click', function() {
	heading(1);
});

$('.subtool.heading2').on('click', function() {
	heading(2);
});

$('.subtool.heading3').on('click', function() {
	heading(3);
});

$('.subtool.remove-heading').on('click', function() {
	heading(0);
});

$('.marko-popup-bg').on('click', function() {
	$('.marko-popup-container').addClass('hidden');
});

$('.marko-editor').on('click', 'a', function(e) {
	// console.log('clicked');
});

function updatePreview() {
	$('.marko-submit').val($('.marko-editor').html());
}

$('#clean').on('click', function() {
	cleanHTML();
});

function cleanHTML(mode) {
	var mode = typeof mode !== 'undefined' ?  mode : 'whole';
	var sel = window.getSelection();
	var spanStart = '<span id="mk-cr-s"></span>';
	var spanEnd = '<span id="mk-cr-e"></span>';

	if (sel.rangeCount > 0) {
		var range = sel.getRangeAt(0);
	}

	if (range && !document.querySelector('#mk-cr-s') && !document.querySelector('#mk-cr-e')) {
		recordSelection(range);
	}

	var rare = $('.marko-editor').html();

	if (mode === 'whole') {
		rare = $('.marko-editor').html();
	} else if (mode === 'selection') {
		// console.log("mode is selection");
		var html = $('.marko-editor').html();

		var htmlSplit = html.split(spanStart);

		var secondSplit = htmlSplit[1].split(spanEnd);

		htmlSplit[1] = secondSplit[0];
		htmlSplit[2] = secondSplit[1];

		var selectedHTML = htmlSplit[1];
		rare = selectedHTML;
	}

	var re = /<\/(strong|em|u)><\1>/ig;
	rare = rare.replace(re, '');
	re = /<b>(.*?)<\/b>/ig;
	rare = rare.replace(re, '<strong>$1</strong>');
	re = /<i>(.*?)<\/i>/ig;
	rare = rare.replace(re, '<em>$1</em>');
	re = /<(strong|em|u|b|i|span) *.*?><\/\1>/ig;
	rare = rare.replace(re, '');
	re = /<a( href=".*?")*><\/a>/ig;
	rare = rare.replace(re, '');
	re = /<(strong|em|u)><span id="(mk-cr-s|mk-cr-e)"><\/span><\/\1>/ig;
	rare = rare.replace(re, '<span id="$2"></span>');
	rare = rare.replace('<strong></strong>', '');

	if (mode === 'selection') {
		rare = htmlSplit[0] + spanStart + rare + spanEnd + htmlSplit[2];
	}

	// console.log(rare);

	$('.marko-editor').html(rare);

	revertSelection();

	updatePreview();
	updateSelectionStatus();
}

$('#getsel').on('click', function() {
	var sel = window.getSelection();
	var range = sel.getRangeAt(0);
	console.log(range.startContainer);
	console.log(range.endContainer);
	console.log(range);
});

$('#convert').on('click', function() {
	var htm = $('.marko-form-submit-textarea').val();
	$('.marko-editor').html(htm);
});

$('#htmler').on('click', function() {
	$('.marko-form-submit-textarea').val($('.marko-editor').html());
});

function isSelectionInMarko() {
	var sel = window.getSelection();
	// If there isn't any selection, return false
	if (sel.rangeCount === 0) {
		return false;
	}
	var range = sel.getRangeAt(0);
	var startNode = range.startContainer;
	var endNode = range.endContainer;

	// Check if the selection is inside the Marko
	var pElm = startNode, startOk = false, endOk = false;
	while (pElm && !startOk) {
		if (pElm.className === 'marko-editor') {
			startOk = true;
		} else {
			pElm = pElm.parentElement;
		}
	}
	pElm = endNode;
	while (pElm && !endOk) {
		if (pElm.className === 'marko-editor') {
			endOk = true;
		} else {
			pElm = pElm.parentElement;
		}
	}
	if (!startOk || !endOk) {
		return false;
	} else {
		return true;
	}
}

var globalHasCommonStyles = false;
var globalCommonStylesTags = [];
function updateSelectionStatus() {
	if (!isSelectionInMarko()) {
		globalHasCommonStyles = false;
		globalCommonStylesTags = [];
		$('.tool').removeClass('active');
		return;
	}

	var sel = window.getSelection();

	if (sel.rangeCount === 0) {
		return;
	}

	if (sel.isCollapsed) {
		globalHasCommonStyles = false;
		globalCommonStylesTags = [];
		$('.tool').removeClass('active');
		return;
	}

	var range = sel.getRangeAt(0);
	// console.log(range);
	var startNodeParentTags = [];
	var startNode = range.startContainer;
	var endNode = range.endContainer;
	var middleNode = startNode.parentNode;
	var tempArr = [];
	var sameNodeExists = true;



	// Clear tool active
	$('.tool').removeClass('active');

	// If startNode is the end of the line, skip the startNode
	if (range.startOffset === startNode.textContent.length) {
		while (1) {
			if (startNode.firstChild) {
				startNode = startNode.firstChild;
			} else if (startNode.nextSibling) {
				startNode = startNode.nextSibling;
			} else {
				while (true) {
					startNode = startNode.parentNode;
					if (startNode.nextSibling) {
						startNode = startNode.nextSibling;
						break;
					}
				}
			}
			if (startNode.localName === undefined) {
				break;
			}
		}
	}
	// console.log('update startnode');
	// console.log(startNode);

	var tagName, node = startNode;
	while (true) {
		// node = node.parentNode;
		tagName = getTagName(node);
		if (isMotherTag(node)) {
			break;
		} else {
			startNodeParentTags.push(tagName);
		}
		node = node.parentNode;
	}

	middleNode = startNode;

	while (middleNode !== endNode) {
		// Finding next nodes
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

		// console.log(middleNode);


		if (middleNode.localName === undefined && middleNode.parentNode.localName !== "div") {
			node = middleNode;
			while (true) {
				node = node.parentNode;
				tagName = getTagName(node);
				if (isMotherTag(node)) {
					break;
				} else if (startNodeParentTags.indexOf(tagName) !== -1) {
					tempArr.push(tagName);
				}
			}
			startNodeParentTags = tempArr;
			tempArr = [];
			if (startNodeParentTags.length === 0) {
				sameNodeExists = false;
				break;
			}
		}
	}


	if (!sameNodeExists) {
		globalHasCommonStyles = false;
		globalCommonStylesTags = [];
	} else {
		globalHasCommonStyles = true;
		globalCommonStylesTags = startNodeParentTags;
		for (var i = 0; i < globalCommonStylesTags.length; i += 1) {
			if (globalCommonStylesTags[i] === 'strong') {
				$('.bold-union').addClass('active');
			} else if (globalCommonStylesTags[i] === 'em') {
				$('.italics-union').addClass('active');
			} else if (globalCommonStylesTags[i] === 'underline') {
				$('.underline-union').addClass('active');
			} else if (globalCommonStylesTags[i] === 'a') {
				$('.link-union').addClass('active');
			}
		}
	}
	// console.log(globalHasCommonStyles);
	// console.log(globalCommonStylesTags);
}

function recordSelection(range) {
	var sel = window.getSelection();
	var spanStart = document.createElement("span");
	spanStart.id = "mk-cr-s";
	var spanEnd = document.createElement("span");
	spanEnd.id = "mk-cr-e";

	sel.collapseToStart();
	sel.getRangeAt(0).insertNode(spanStart);
	sel.removeAllRanges();
	sel.addRange(range);
	sel.collapseToEnd();
	sel.getRangeAt(0).insertNode(spanEnd);
}

function revertSelection() {
	var sel = window.getSelection();
	var spanStart = document.querySelector("#mk-cr-s");
	var spanEnd = document.querySelector("#mk-cr-e");
	var newRange = document.createRange();
	var startNode, endNode, startOffset, endOffset;

	// console.log('setting start range...');
	// console.log($('.marko-editor').html());
	// set range start
	var checkPrevious = false;
	if (spanStart.nextSibling) {
		var spanNext = spanStart.nextSibling;
		while (1) {
			if (!spanNext) {
				checkPrevious = true;
				break;
			} else if (spanNext.firstChild) {
				if (spanNext.firstChild.localName === undefined) {
					newRange.setStart(spanNext.firstChild, 0);
					break;
				} else if (spanNext.firstChild.localName === 'br') {
					newRange.setStartBefore(spanNext.firstChild);
					break;
				} else {
					spanNext = spanNext.nextSibling;
				}
			} else {
				if (spanNext.localName === undefined) {
					if (spanNext.textContent.length === 0) {
						spanNext.parentNode.removeChild(spanNext);
					} else {
						newRange.setStart(spanNext, 0);
						break;
					}
				} else if (spanNext.localName === 'br') {
					newRange.setStartBefore(spanNext);
					break;
				} else {
					spanNext = spanNext.firstChild;
				}
			}
		}
	}
	if (checkPrevious && spanStart.previousSibling) {
		var spanPrev = spanStart.previousSibling;
		while (1) {
			if (!spanPrev) {
				newRange.setStartAfter(spanStart);
				break;
			}
			else if (spanPrev.localName === undefined) {
				if (spanPrev.textContent.length === 0) {
					// spanPrev.parentNode.removeChild(spanPrev);
					spanPrev = spanPrev.previousSibling;
				} else {
					newRange.setStart(spanPrev, spanPrev.textContent.length);
					break;
				}
			}
		}
	}

	// console.log('set start done');

	// set range end
	if (spanEnd.previousSibling) {
		var spanPrev = spanEnd.previousSibling;
		if (spanPrev.localName === undefined) {
			newRange.setEnd(spanPrev, spanPrev.textContent.length);
		} else {
			while (spanPrev.localName !== undefined) {
				spanPrev = spanPrev.lastChild;
				if (!spanPrev) {
					newRange.setEndBefore(spanEnd);
					break;
				} else if (spanPrev.localName === undefined) {
					newRange.setEnd(spanPrev, spanPrev.textContent.length);
					break;
				}
			}
		}
	} else {
		newRange.setEndBefore(spanEnd);
	}

	spanStart.parentNode.removeChild(spanStart);
	spanEnd.parentNode.removeChild(spanEnd);

	sel.removeAllRanges();
	sel.addRange(newRange);
}

function keepRange() {
	// return;
	var sel = window.getSelection();

	var newRange = document.createRange();

	if (sel.rangeCount > 0) {
		var range = sel.getRangeAt(0);
	}

	if (range && !document.querySelector('#mk-cr-s') && !document.querySelector('#mk-cr-e')) {
		sel.collapseToStart();
		var elm = document.createElement("div");
		elm.innerHTML = '<span id="mk-cr-s"></span><span id="mk-cr-e"></span>';
		sel.collapseToStart();
		sel.getRangeAt(0).insertNode(elm.firstChild);
		sel.removeAllRanges();
		sel.addRange(range);
		sel.collapseToEnd();
		sel.getRangeAt(0).insertNode(elm.firstChild);
	}

	var startNode = document.querySelector("#mk-cr-s");
	var endNode = document.querySelector("#mk-cr-e");


	var rangeExceptionTag = ['p', 'li', 'ul', 'ol'];
	var node;
	// Set range start
	if (startNode.nextSibling) {
		node = startNode.nextSibling;
		// console.log(node);
		while (1) {
			if (node.localName === undefined) {
				newRange.setStart(node, 0);
				break;
			} else if (node.localName === 'br') {
				newRange.setStartBefore(node);
				break;
			} else {
				node = node.firstChild;
			}
		}
	} else {
		node = startNode.previousSibling;
		while (1) {
			if (node.localName === undefined) {
				newRange.setStart(node, node.textContent.length);
				break;
			} else {
				node = node.lastChild;
			}
		}
	}


	// Set range end
	if (endNode.previousSibling) {
		node = endNode.previousSibling;
		while (1) {
			if (node.localName === undefined) {
				newRange.setEnd(node, node.textContent.length);
				break;
			} else {
				node = node.lastChild;
			}
		}
	} else {
		newRange.setEndBefore(endNode);
	}

	sel.removeAllRanges();
	sel.addRange(newRange);
	startNode.parentNode.removeChild(startNode);
	endNode.parentNode.removeChild(endNode);
}

function createList(range) {
	if (!isSelectionInMarko()) return;

	console.log(range);

	$('.marko-add-link-button').on('click', function() {
		console.log(range);
		var linkInput = $('.marko-link-input').val();
		console.log(linkInput);
		togglePopUp();
	});
}

function togglePopUp() {
	var $popUp = $('.marko-popup-container');
	if ($popUp.hasClass('hidden')) {
		$popUp.removeClass('hidden');
	} else {
		$popUp.addClass('hidden');
	}
}




// Should not merge these tags semantically
var motherTags = ['p', 'ul', 'li', 'div',
'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre',
'body', 'html', 'aside', 'article', 'section',
'img'];

// Mergeable tags semantically
var childTags = ['strong', 'b', 'em', 'i', 'u', 'span', 'a'];

function isMotherTag(node) {
	if (node === null) return false;
	if (motherTags.indexOf(node.nodeName.toLowerCase()) !== -1) {
		return true;
	} else {
		return false;
	}
}
function isChildTag(node) {
	// console.log(':: isChildTag ::');
	// console.log(node.nodeName.toLowerCase());
	if (childTags.indexOf(node.nodeName.toLowerCase()) !== -1) {
		return true;
	} else {
		return false;
	}
}

function isSameTag(node1, node2) {
	if (node1 === null || node2 === null) return false;
	if (node1.nodeType === 3 || node2.nodeType === 3) return false;

	var result = false;

	if (node1.nodeName === node2.nodeName) {
		result = true;
	} else {
		if (node1.nodeName.toLowerCase() === 'span' && node2.nodeName.toLowerCase() === 'u') {
			if (node1.style.textDecoration === 'underline') result = true;
		} else if (node1.nodeName.toLowerCase() === 'u' && node2.nodeName.toLowerCase() === 'span') {
			if (node2.style.textDecoration === 'underline') result = true;
		}
	}

	return result;
}

function getTagName(node) {
	if (!node) return null;

	var nodeName = node.nodeName.toLowerCase();

	if (nodeName === 'strong' || nodeName === 'b') {
		return 'strong';
	} else if (nodeName === 'em' || nodeName === 'i') {
		return 'em';
	} else if (nodeName === 'u' || nodeName === 'span' && node.style.textDecoration === 'underline') {
		return 'underline';
	} else {
		return nodeName;
	}
}

$('#test').on('click', function() {


	var item = document.querySelector(".marko-editor").firstChild.firstChild.firstChild;
	console.log(item.tagName);
	console.log(item.nodeName);
});

function mergeNodes(node1, node2) {
	var node;
	var sel = window.getSelection();
	var range = document.createRange();

	sel.removeAllRanges();
	sel.addRange(range);

	node2.parentNode.removeChild(node2);

	while (node = node2.firstChild) {
		range.setStartAfter(node1.lastChild);
		insertAndCleanNodesAtRange(range, node);
		// range.insertNode(node);
	}

	return node1;
}

function insertAndCleanNodesAtRange(range, insertingNode) {
	var sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);

	range.insertNode(insertingNode);

	// console.log('inserting node...');

	// If the inserting node is not a mergeable tag stop the process
	if (isMotherTag(insertingNode)) return;

	var prevNode = insertingNode.previousSibling;

	while (prevNode) {
		if (prevNode.textContent.length === 0) {
			prevNode.parentNode.removeChild(prevNode);
			prevNode = insertingNode.previousSibling;
		} else if (isSameTag(prevNode, insertingNode)) {
			insertingNode = mergeNodes(prevNode, insertingNode);
			break;
		} else {
			// Different tag
			break;
		}
	}

	var nextNode = insertingNode.nextSibling;

	while (nextNode) {
		// console.log('looping nextNode');
		if (nextNode.textContent.length === 0) {
			nextNode.parentNode.removeChild(nextNode);
			nextNode = insertingNode.nextSibling;
		} else if (isSameTag(insertingNode, nextNode)) {
			// console.log('next sibling is same tag');
			insertingNode = mergeNodes(insertingNode, nextNode);
			break;
		} else {
			// Different tag
			break;
		}
	}

	// console.log('loop out 2');
	return insertingNode;
}

function hasSameTagChildren(node) {
}

function cleanSameTagChildren(node) {

	var tagName = getTagName(node);

	// No same tag children
	if (node.innerHTML === cleanTagFromHTML(node.innerHTML, tagName)) return;


	var middleNode = node.firstChild;
	var range = document.createRange();
	var tempNode;

	while (1) {
		if (loopExit) break;

		if (isSameTag(node, middleNode)) {
			range.setStartBefore(middleNode);
			var removeAfter = middleNode;
			//console.log('moving children');
			removeAfter.parentNode.removeChild(removeAfter);
			while (tempNode = removeAfter.lastChild) {
				// console.log(tempNode);
				// range.insertNode(tempNode);
				tempNode = insertAndCleanNodesAtRange(range, tempNode);
				range.setStartBefore(tempNode);
				middleNode = tempNode;
			}
			continue;
		}

		if (middleNode.firstChild) {
			middleNode = middleNode.firstChild;
		} else if (middleNode.nextSibling) {
			middleNode = middleNode.nextSibling;
		} else {
			while (true) {
				middleNode = middleNode.parentNode;
				if (middleNode === node) {
					//End the loop
					var loopExit = true;
					// break;
				}
				if (middleNode.nextSibling) {
					middleNode = middleNode.nextSibling;
					break;
				}
			}
		}
	}
}

function cleanTagFromHTML(html, tagName) {
	var tagOpen = "", tagClose = "";

	switch (tagName) {
		case 'strong':
			html = html.replace(/<strong ?.*?>([\s\S]*?)<\/strong>/ig, '$1');
			html = html.replace(/<b ?.*?>([\s\S]*?)<\/b>/ig, '$1');
			break;

		case 'em':
			html = html.replace(/<em ?.*?>([\s\S]*?)<\/em>/ig, '$1');
			html = html.replace(/<i ?.*?>([\s\S]*?)<\/i>/ig, '$1');
			break;

		case 'underline':
			html = html.replace(/<span ?.*?style=".*?text-decoration: ?underline.*?">([\s\S]*?)<\/span>/ig, '$1');
			html = html.replace(/<u>([\s\S]*?)<\/u>/ig, '$1');
			break;
	}

	return html;
}

function generateNode(tagName, ref) {
	var node;

	switch (tagName) {
		case 'strong':
			node = document.createElement('strong');
			break;

		case 'em':
			node = document.createElement('em');
			break;

		case 'underline':
			node = document.createElement('span');
			node.style.textDecoration = 'underline';
			break;

		case 'a':
			node = document.createElement('a');
			node.href = ref;

		default:
			break;
	}

	return node;
}

function align(direction) {
	var sel = window.getSelection();
	if (sel.rangeCount < 1) return;
	if (!isSelectionInMarko()) return;

	var range = sel.getRangeAt(0);

	var startNode = range.startContainer;
	var endNode = range.endContainer;

	var alignableTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'pre', 'section', 'li'];

	// Find alignable tags
	var middleNode = startNode;
	var alignedParents = [];
	while (1) {
		if (middleNode.nodeType === 3) {
			var localParentNode = middleNode.parentNode;
			while (localParentNode.className !== 'marko-editor') {
				if (alignableTags.indexOf(localParentNode.nodeName.toLowerCase()) !== -1) {
					if (alignedParents.indexOf(localParentNode) === -1) {
						alignedParents.push(localParentNode);

						if (direction === 'left') {
							localParentNode.style.textAlign = "";
						} else {
							localParentNode.style.textAlign = direction;
						}

						if (localParentNode.getAttribute('style') === "") {
							localParentNode.removeAttribute('style');
						}

					}
					break;
				} else {
					localParentNode = localParentNode.parentNode;
				}
			}
		}

		if (middleNode === endNode) break;

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
	}
}

function heading(type) {
	var type = typeof type !== 'undefined' ?  type : 1;
	var sel = window.getSelection();

	if (sel.rangeCount < 1) return;
	if (!isSelectionInMarko()) return;

	var range = sel.getRangeAt(0);

	var startNode = range.startContainer;
	var endNode = range.endContainer;
	var startOffset = range.startOffset;
	var endOffset = range.endOffset;

	var headableTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

	var middleNode = startNode;
	var headedTags = [];
	while (1) {
		if (middleNode.nodeType === 3) {
			var localParentNode = middleNode.parentNode;
			while (localParentNode.className !== 'marko-editor') {
				if (headableTags.indexOf(localParentNode.nodeName.toLowerCase()) !== -1) {
					if (headedTags.indexOf(localParentNode) === -1) {

						var node;
						var newHeadingTag;

						if (type === 0) {
							// Removing heading tag
							newHeadingTag = document.createElement('p');
						} else {
							newHeadingTag = document.createElement('h' + type);
						}

						while (node = localParentNode.firstChild) {
							newHeadingTag.appendChild(node);
						}

						localParentNode.parentNode.replaceChild(newHeadingTag, localParentNode);

						headedTags.push(newHeadingTag);

					}
					break;
				} else {
					localParentNode = localParentNode.parentNode;
				}
			}
		}

		if (middleNode === endNode) break;

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
	}

	range.setStart(startNode, startOffset);
	range.setEnd(endNode, endOffset);
	sel.removeAllRanges();
	sel.addRange(range);

	updatePreview();
}

function listing() {
	var sel = window.getSelection();

	if (sel.rangeCount < 1) return;
	if (!isSelectionInMarko()) return;

	var range = sel.getRangeAt(0);

	var node;

	var startNode = range.startContainer;
	var endNode = range.endContainer;
	var startOffset = range.startOffset;
	var endOffset = range.endOffset;

	var listableTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

	var middleNode = startNode;
	var listedTags = [];

	while (1) {
		if (middleNode.nodeType === 3) {
			var localParentNode = middleNode.parentNode;
			while (localParentNode.className !== 'marko-editor') {
				if (listableTags.indexOf(localParentNode.nodeName.toLowerCase()) !== -1) {
					if (listedTags.indexOf(localParentNode) === -1) {

						listedTags.push(localParentNode);

					}
					break;
				} else {
					localParentNode = localParentNode.parentNode;
				}
			}
		}

		if (middleNode === endNode) break;

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
	}

	if (listedTags.length > 0) {
		var unorderedList = document.createElement('ul');
		for (var i = 0; i < listedTags.length; i += 1) {
			var list = document.createElement('li');
			while (node = listedTags[i].firstChild) {
				list.appendChild(node);
			}
			unorderedList.appendChild(list);
		}

		listedTags[0].parentNode.replaceChild(unorderedList, listedTags[0]);
		for (var i = 1; i < listedTags.length; i += 1) {
			listedTags[i].parentNode.removeChild(listedTags[i]);
		}
	}


	range.setStart(startNode, startOffset);
	range.setEnd(endNode, endOffset);
	sel.removeAllRanges();
	sel.addRange(range);

	updatePreview();
}

function linking() {
	var sel = window.getSelection();
	var range = sel.getRangeAt(0);

	var linkTarget = range.toString();

	document.getElementsByClassName('marko-link-target')[0].innerText = linkTarget;

	// $('.tool').prop('disabled', 'true');

	$('.marko-link-option-container').data('target-range', range);

	togglePopUp();
}

$('.marko-add-link-button').on('click', function() {
	var ref = $('.marko-link-input').val();
	var range = $('.marko-link-option-container').data('target-range');
	$('.marko-link-input').val('');
	togglePopUp();
	itmotnTT('a', ref, range);
});

$('.marko-button-cancel').on('click', function() {
	$('.marko-link-input').val('');
	togglePopUp();
});

function isCaretStart() {
	var sel = window.getSelection();
	if (!isSelectionInMarko()) return;

	var range = sel.getRangeAt(0);


}

function isCaretEnd() {

}









// Old codes

function tagTransformationCompact(tag) {
	var sel = window.getSelection();
	var range = sel.getRangeAt(0);
	var startNode = range.startContainer, endNode = range.endContainer;
	var startOffset = range.startOffset, endOffset = range.endOffset;
	var node;

	// console.log(startNode);
	recordSelection(range);
	var spanStart = document.querySelector("#mk-cr-s");
	var spanEnd = document.querySelector("#mk-cr-e");

	var nodeCopy;
	node = startNode;
	var exitLoop = false;
	// var nextNode = startNode;
	var nextNode = spanStart;
	var tempNode;
	while (1) {

		node = nextNode;

		// if (node === endNode) {
		if (node === spanEnd) {
			exitLoop = true;
			// console.log('End reached');
		}

		if (nextNode.firstChild) {
			nextNode = nextNode.firstChild;
		} else if (nextNode.nextSibling) {
			nextNode = nextNode.nextSibling;
		} else {
			while (true) {
				nextNode = nextNode.parentNode;
				if (nextNode.nextSibling) {
					nextNode = nextNode.nextSibling;
					break;
				}
			}
		}

		if (node.localName === undefined && node.textContent.length !== 0) {
			// console.log(node);
			// Check if node already has the tag
			var tagExists = false;
			var tempElm = node.parentElement;
			while (tempElm.className !== 'marko-editor') {
				if (tempElm.localName === tag) {
					tagExists = true;
					break;
				} else {
					tempElm = tempElm.parentElement;
				}
			}

			if (!tagExists) {
				// console.log(node);
				// Set open and close tag
				var openTag = '<' + tag + '>';
				var closeTag = '</' + tag + '>';

				// console.log(node);
				var elm = document.createElement('div');
				// elm.innerHTML = openTag + node.textContent + closeTag;

				var nodeTextContent = node.textContent;


				elm.innerHTML = openTag + nodeTextContent + closeTag;

				range.collapse(true);
				range.setStartAfter(node);
				node.parentNode.removeChild(node);
				var tempNode;
				while (tempNode = elm.firstChild) {
					range.insertNode(tempNode);
					range.setStartAfter(tempNode);
				}
			}
		}

		node = nextNode;

		if (exitLoop) break;
	}

	revertSelection();
}

function tagTransformation(tag) {
	var sel = window.getSelection();
	var range = sel.getRangeAt(0);
	var startNode = range.startContainer, endNode = range.endContainer;
	var startOffset = range.startOffset, endOffset = range.endOffset;
	var node, newStartNode, newEndNode, newStartOffset, newEndOffset;

	// console.log(startNode);

	var nodeCopy;
	node = startNode;
	var exitLoop = false;
	var nextNode = startNode;
	var tempNode;
	while (1) {

		node = nextNode;

		if (node === endNode) {
			exitLoop = true;
			// console.log('End reached');
		}

		if (nextNode.firstChild) {
			nextNode = nextNode.firstChild;
		} else if (nextNode.nextSibling) {
			nextNode = nextNode.nextSibling;
		} else {
			while (true) {
				nextNode = nextNode.parentNode;
				if (nextNode.nextSibling) {
					nextNode = nextNode.nextSibling;
					break;
				}
			}
		}

		if (node.localName === undefined) {

			// Check if node already has the tag
			var tagExists = false;
			var tempElm = node.parentElement;
			while (tempElm.className !== 'marko-editor') {
				if (tempElm.localName === tag) {
					tagExists = true;
					break;
				} else {
					tempElm = tempElm.parentElement;
				}
			}

			if (!tagExists) {
				// console.log(node);
				// Set open and close tag
				var openTag = '<' + tag + '>';
				var closeTag = '</' + tag + '>';

				// console.log(node);
				var elm = document.createElement('div');
				// elm.innerHTML = openTag + node.textContent + closeTag;

				var nodeTextContent = node.textContent;
				// If startNode === endNode
				if (startNode === endNode) {

					elm.innerHTML = nodeTextContent.slice(0, startOffset) + openTag + nodeTextContent.slice(startOffset, endOffset) + closeTag + nodeTextContent.slice(endOffset);

					range.collapse(true);
					range.setStartAfter(node);
					node.parentNode.removeChild(node);
					while (tempNode = elm.firstChild) {
						if (tempNode.localName === tag) {
							newStartNode = tempNode.firstChild;
							newStartOffset = 0;
							newEndNode = tempNode.firstChild;
							newEndOffset = tempNode.textContent.length;
						}
						range.insertNode(tempNode);
						range.setStartAfter(tempNode);
					}

				} else if (node === startNode && startNode.textContent.length > startOffset) {


					elm.innerHTML = nodeTextContent.slice(0, startOffset) + openTag + nodeTextContent.slice(startOffset) + closeTag;

					range.collapse(true);
					range.setStartAfter(node);
					node.parentNode.removeChild(node);
					var tempNode;
					while (tempNode = elm.firstChild) {
						if (tempNode.localName === tag) {
							newStartNode = tempNode.firstChild;
							newStartOffset = 0;
						}
						range.insertNode(tempNode);
						range.setStartAfter(tempNode);
					}

				} else if (node === endNode) {

					elm.innerHTML = openTag + nodeTextContent.slice(0, endOffset) + closeTag + nodeTextContent.slice(endOffset);

					range.collapse(true);
					range.setStartAfter(node);
					node.parentNode.removeChild(node);
					var tempNode;
					while (tempNode = elm.firstChild) {
						if (tempNode.localName === tag) {
							newEndNode = tempNode.firstChild;
							newEndOffset = tempNode.textContent.length;
						}
						range.insertNode(tempNode);
						range.setStartAfter(tempNode);
					}

				} else {

					elm.innerHTML = openTag + nodeTextContent + closeTag;

					range.collapse(true);
					range.setStartAfter(node);
					node.parentNode.removeChild(node);
					var tempNode;
					while (tempNode = elm.firstChild) {
						range.insertNode(tempNode);
						range.setStartAfter(tempNode);
					}

				}
			}
		}

		node = nextNode;

		if (exitLoop) break;
	}

	var keepRange = document.createRange();

	// If new startNode or new endNode are set,
	// keepRange with them
	// Else, keep first range (ex: hanging on the end or start of the paragraph)
	if (newStartNode) {
		// console.log(newStartNode);
		keepRange.setStart(newStartNode, newStartOffset);
	} else {
		keepRange.setStart(startNode, startOffset);
	}
	if (newEndNode) {
		// console.log(newEndNode);
		keepRange.setEnd(newEndNode, newEndOffset);
	} else {
		keepRange.setEnd(endNode, endOffset);
	}

	sel.removeAllRanges();
	sel.addRange(keepRange);
	cleanHTML('selection');
}

function htmlTransformation(tag, preRange, ref) {
	var sel = window.getSelection();
	var range = preRange || sel.getRangeAt(0);
	var openTag = '<' + tag + '>';
	var closeTag = '</' + tag + '>';
	var openTagAtt = new RegExp('<' + tag + ' *.*?>', 'ig');
	var closeTagAtt = '</' + tag + '>';

	if (tag === 'u') {
		openTag = '<span style="text-decoration:underline;">';
		closeTag = '</span>';
		openTagAtt = new RegExp('<span .*?(style=".*?text-decoration: *underline;.*?").*?>');
		closeTagAtt = '</span>';
	}

	recordSelection(range);

	var spanStart = '<span id="mk-cr-s"></span>';
	var spanEnd = '<span id="mk-cr-e"></span>';
	var html = $('.marko-editor').html();

	var htmlSplit = html.split(spanStart);

	var secondSplit = htmlSplit[1].split(spanEnd);

	htmlSplit[1] = secondSplit[0];
	htmlSplit[2] = secondSplit[1];

	// Get part of selected html
	var selectedHTML = htmlSplit[1];

	// Find open tags
	var openTags;
	var openTagCount = 0;
	var openTagIndex = Number.MAX_VALUE;
	var re;
	if (openTags = selectedHTML.match(openTagAtt)) {
		openTagCount = openTags.length;
		openTagIndex = selectedHTML.search(openTagAtt);
	}

	// Find close tags
	var closeTags;
	var closeTagCount = 0;
	var closeTagIndex = Number.MAX_VALUE;
	if (closeTags = selectedHTML.match(closeTag)) {
		closeTagCount = closeTags.length;
		closeTagIndex = selectedHTML.search('</' + tag + '>');
	}

	// Remove all existing tags
	var re = new RegExp('<' + tag + ' *.*?>' + '|' + closeTagAtt, 'ig');
	selectedHTML = selectedHTML.replace(re, "");

	if (openTagCount === 0 && closeTagCount === 0) {
		selectedHTML = openTag + selectedHTML + closeTag;
	} else if (openTagCount === closeTagCount) {
		// Pair match
		if (openTagIndex < closeTagIndex) {
			selectedHTML = openTag + selectedHTML + closeTag;
		} else {
			selectedHTML = selectedHTML;
		}
	} else {
		// Pair unmatch
		if (openTagIndex < closeTagIndex) {
			selectedHTML = openTag + selectedHTML;
		} else {
			selectedHTML = selectedHTML + closeTag;
		}
	}

	// console.log(selectedHTML);

	$('.marko-editor').html(htmlSplit[0] + spanStart + selectedHTML + spanEnd + htmlSplit[2]);



	cleanHTML('selection');
}

function htmlRestoration(tag) {
	cleanHTML();

	if (!isSelectionInMarko()) return;

	var sel = window.getSelection();
	var range = sel.getRangeAt(0);

	var elm = document.createElement("div");
	elm.innerHTML = '<span id="mk-cr-s"></span><span id="mk-cr-e"></span>';

	sel.collapseToStart();
	sel.getRangeAt(0).insertNode(elm.firstChild);

	sel.removeAllRanges();

	sel.addRange(range);
	sel.collapseToEnd();
	sel.getRangeAt(0).insertNode(elm.firstChild);

	var html = $('.marko-editor').html();

	var htmlSplit = html.split('<span id="mk-cr-s"></span>');

	var secondSplit = htmlSplit[1].split('<span id="mk-cr-e"></span>');

	htmlSplit[1] = secondSplit[0];
	htmlSplit[2] = secondSplit[1];

	var selectedHTML = htmlSplit[1];

	// console.log(selectedHTML);

	var spanStart = '<span id="mk-cr-s"></span>';
	var spanEnd = '<span id="mk-cr-e"></span>';

	// Remove all tags inside the selection
	var re = new RegExp('<' + tag + '>|</' + tag + '>', 'ig');
	selectedHTML = selectedHTML.replace(re, '');

	selectedHTML = '</' + tag + '>' + spanStart + selectedHTML + spanEnd;

	if (document.querySelector('#mk-cr-e').previousSibling) {
		selectedHTML = selectedHTML + '<' + tag + '>';
	}

	// console.log(selectedHTML);

	html = htmlSplit[0] + selectedHTML + htmlSplit[2];

	// console.log(selectedHTML);

	$('.marko-editor').html(html);

	cleanHTML();
	// keepRange();

	updatePreview();
	updateSelectionStatus();
}

function textTransformation(tag) {
	var sel = window.getSelection();
	var range = sel.getRangeAt(0), keepRange = document.createRange();
	var startNode = range.startContainer, endNode = range.endContainer;
	var startOffset = range.startOffset, endOffset = range.endOffset;
	keepRange.setStart(startNode, startOffset);
	keepRange.setEnd(endNode, endOffset);

	// If no selection, stop functioning
	if (sel.isCollapsed) {
		// console.log('no selection');
		sel.removeAllRanges();
		sel.addRange(range);
		return;
	}

	var exitLoop = false;
	var middleNode = startNode, extendedMiddleNode;
	var hasTaggedNode, removeChild;
	var node;
	var el = document.createElement("div");
	var nodeTextContent;
	var isSetRangeStart = false;
	var isStartNodeTagged = false;

	// Bug fix
	// If start node is tagged
	// remove the node and insert it again at last
	// to solve the selection bug
	node = startNode;
	while (node.localName !== 'p') {
		if (node.localName === tag) {
			isStartNodeTagged = true;
			break;
		}
		node = node.parentNode;
	}

	// Loop the whole nodes
	while (!exitLoop) {


		hasTaggedNode = false;
		removeChild = false;

		if (middleNode === endNode) {
			exitLoop = true;
		}

		// Skip the nodes that are already tagged
		if (middleNode.localName === undefined && middleNode.parentNode.localName !== "div") {
			node = middleNode.parentNode;
			while (node.localName !== 'p') {
				if (node.localName === tag) {
					hasTaggedNode = true;
					break;
				}
				node = node.parentNode;
			}
			if (!hasTaggedNode) {
				extendedMiddleNode = middleNode;
				removeChild = true;
			}
		}


		// Finding next nodes
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


		if (removeChild) {
			nodeTextContent = extendedMiddleNode.textContent;
			if (extendedMiddleNode === startNode && extendedMiddleNode === endNode) {

				el.innerHTML = nodeTextContent.slice(0, startOffset) + '<' + tag + '>' + nodeTextContent.slice(startOffset, endOffset) + '</' + tag + '>' + nodeTextContent.slice(endOffset);

				node = el.firstChild;
				while (node) {
					if (node.localName === tag) {
						startNode = node;
						endNode = node;
					}
					node = node.nextSibling;
				}

			} else if (extendedMiddleNode === startNode) {
				el.innerHTML = nodeTextContent.slice(0, startOffset) + '<' + tag + '>' + nodeTextContent.slice(startOffset) + '</' + tag + '>';

				node = el.firstChild;
				while (node) {
					if (node.localName === tag) {
						startNode = node;
					}
					node = node.nextSibling;
				}
			} else if (extendedMiddleNode === endNode) {
				el.innerHTML = '<' + tag + '>' + nodeTextContent.slice(0, endOffset) + '</' + tag + '>' + nodeTextContent.slice(endOffset);

				node = el.firstChild;
				while (node) {
					if (node.localName === tag) {
						endNode = node;
					}
					node = node.nextSibling;
				}
			} else {
				el.innerHTML = '<' + tag + '>' + nodeTextContent + '</' + tag + '>';
			}

			range.collapse(true);
			range.setStartBefore(extendedMiddleNode);

			extendedMiddleNode.parentNode.removeChild(extendedMiddleNode);
			while (node = el.firstChild) {
				range.insertNode(node);
				range.setStartAfter(node);
				if (node === startNode) {
					keepRange.setStart(node.firstChild, 0);
				}
				if (node === endNode) {
					keepRange.setEnd(node.firstChild, node.firstChild.textContent.length);
				}
			}
		}
	}

	sel.removeAllRanges();
	sel.addRange(keepRange);

	// cleanHTML();

	// updateSelectionStatus();
	// updatePreview();
}

$('.get-ranges').on('click', function() {
	var sel = window.getSelection();
	console.log(sel.getRangeAt(0));
	// console.log(sel.getRangeAt(1));
});

function textRestoration(tag) {
	var sel = window.getSelection();
	var range = sel.getRangeAt(0);
	var keepRange = document.createRange();
	keepRange.setStart(range.startContainer, range.startOffset);
	keepRange.setEnd(range.endContainer, range.endOffset);

	var tags = [tag];
	if (tag === 'strong') {
		tags.push('b');
	} else if (tag === 'em') {
		tags.push('i');
	} else if (tag === 'underline') {
		tags.push('u');
	}

	// If no selection, stop functioning
	if (sel.isCollapsed) {
		// console.log('no selection');
		sel.removeAllRanges();
		sel.addRange(range);
		return;
	}

	// Loop text child
	var startNode = range.startContainer, middleNode = startNode, endNode = range.endContainer, extendedMiddleNode;
	var startOffset = range.startOffset, endOffset = range.endOffset;
	var exitLoop = false, removeChild = false;
	var taggedNodeArray = [];
	var textContentsArray = [];
	while (!exitLoop) {

		if (middleNode === endNode) exitLoop = true;

		// Remove empty node
		// if (middleNode.textContent === "") {
		// 	extendedMiddleNode = middleNode;
		// 	removeChild = true;
		// }

		// Find tagged nodes
		if (middleNode === startNode) {
			var tempNode = middleNode;
			var startTagsArray = [];
			while (tempNode.className !== 'marko-editor') {
				tempNode = tempNode.parentNode;
				// if (tempNode.localName === tag) {
				// 	startTagsArray.push(tempNode);
				// }
				if (tags.indexOf(tempNode.localName) !== -1) {
					startTagsArray.push(tempNode);
				}
			}
			for (var i = startTagsArray.length - 1, j = 0; i >= 0; i -= 1, j += 1) {
				taggedNodeArray[j] = startTagsArray[i];
			}
		}

		// if (middleNode.localName === tag && middleNode.textContent !== "") {
		// 	taggedNodeArray.push(middleNode);
		// }
		if (tags.indexOf(middleNode.localName) !== -1 && middleNode.textContent !== "") {
			taggedNodeArray.push(middleNode);
		}

		if (middleNode.localName === undefined) {
			textContentsArray.push(middleNode);
		}

		// Loop
		if (middleNode.firstChild) {
			middleNode = middleNode.firstChild;
		} else if (middleNode.nextSibling) {
			middleNode = middleNode.nextSibling;
		} else {
			while (!middleNode.parentNode.nextSibling) {
				middleNode = middleNode.parentNode;
			}
			middleNode = middleNode.parentNode.nextSibling;
		}

		if (removeChild) {
			extendedMiddleNode.parentNode.removeChild(extendedMiddleNode);
			removeChild = false;
		}

		if (exitLoop) break;

	}

	// Loop tagged nodes array
	var taggedNode;
	var el = document.createElement("div");
	var node, insideNode;
	for (var i = 0; i < taggedNodeArray.length; i += 1) {

		taggedNode = taggedNodeArray[i];

		range.collapse(true);
		range.setStartBefore(taggedNode);

		// Loop each tagged nodes
		middleNode = taggedNode;
		exitLoop = false;
		removeChild = false;
		var tempEl = document.createElement("div");
		var tempText;
		while (!exitLoop) {

			if (middleNode.localName === undefined) {
				if (middleNode === endNode && endOffset < endNode.textContent.length || middleNode === startNode && startOffset > 0 || !isElmementInArray(textContentsArray, middleNode)) {
					extendedMiddleNode = middleNode;
					removeChild = true;
				}
			}

			// Loop: find next node
			if (middleNode.firstChild) {
				middleNode = middleNode.firstChild;
			} else if (middleNode.nextSibling) {
				middleNode = middleNode.nextSibling;
			} else {
				while (true) {
					middleNode = middleNode.parentNode;
					if (middleNode === taggedNode) {
						exitLoop = true;
						break;
					}
					if (middleNode.nextSibling) {
						middleNode = middleNode.nextSibling;
						break;
					}
				}
			}

			if (removeChild) {
				tempText = extendedMiddleNode.textContent;

				if (startNode === extendedMiddleNode && endNode === extendedMiddleNode) {
					// console.log(extendedMiddleNode);
					// console.log('same container');
					if (startOffset > 0) {
						tempEl.innerHTML += '<' + tag + '>' + tempText.slice(0, startOffset) + '</' + tag + '>';
					}

					tempEl.innerHTML += tempText.slice(startOffset, endOffset);

					if (endOffset < tempText.length) {
						tempEl.innerHTML += '<' + tag + '>' + tempText.slice(endOffset) + '</' + tag + '>';
					}

					// console.log(tempEl.innerHTML);

					// set new range
					if (startOffset > 0) {
						startNode = tempEl.firstChild.nextSibling;
					} else {
						startNode = tempEl.firstChild;
					}
					endNode = startNode;
					startOffset = 0;
					endOffset = startNode.textContent.length;

				} else if (extendedMiddleNode === endNode) {
					// console.log('end node');
					// console.log(extendedMiddleNode);
					tempEl.innerHTML = tempText.slice(0, endOffset) + '<' + tag + '>' + tempText.slice(endOffset) + '</' + tag + '>';

					endNode = tempEl.firstChild;
					endOffset = endNode.textContent.length;

				} else if (extendedMiddleNode === startNode) {
					tempEl.innerHTML = '<' + tag + '>' + tempText.slice(0, startOffset) + '</' + tag + '>' + tempText.slice(startOffset);

					startNode = tempEl.firstChild.nextSibling;
					startOffset = 0;

				} else if (!isElmementInArray(textContentsArray, extendedMiddleNode)) {
					// console.log('not in array');
					// console.log(extendedMiddleNode);
					tempEl.innerHTML = '<' + tag + '>' + tempText + '</' + tag + '>';
				}

				range.setStart(extendedMiddleNode, 0);
				extendedMiddleNode.parentNode.removeChild(extendedMiddleNode);
				var isSetStartOffset = false;
				while (node = tempEl.firstChild) {
					range.insertNode(node);
					range.setStartAfter(node);
				}


				removeChild = false;

			}
		}


		range.setStartBefore(taggedNode);
		while (node = taggedNode.firstChild) {
			range.insertNode(node);
			range.setStartAfter(node);
		}
		taggedNode.parentNode.removeChild(taggedNode);

	}

	// Bug fix
	// If the start node is not tagged
	// Middle sSelection not shown
	range.setStartBefore(startNode);
	startNode.parentNode.removeChild(startNode);
	range.insertNode(startNode);


	// Set a new range
	keepRange.setStart(startNode, startOffset);
	keepRange.setEnd(endNode, endOffset);

	sel.removeAllRanges();
	sel.addRange(keepRange);

	// cleanHTML();

	updateSelectionStatus();
	updatePreview();
}

function isElmementInArray(arr, elm) {
	var i = 0;
	for (i; i < arr.length; i += 1) {
		if (arr[i] === elm) {
			return true;
		}
	}
	return false;
}

$('.start-to-end').on('click', function() {

	startNodeToEndNode();
});
function startNodeToEndNode() {
	var sel = window.getSelection();
	var range = sel.getRangeAt(0);
	var startNode = range.startContainer;
	var endNode = range.endContainer;
	var middleNode = startNode;
	console.log(middleNode);
	do {

		if (middleNode.firstChild) {
			middleNode = middleNode.firstChild;
		} else if (middleNode.nextSibling) {
			middleNode = middleNode.nextSibling;
		} else {
			while (!middleNode.parentNode.nextSibling) {
				middleNode = middleNode.parentNode;
			}
			middleNode = middleNode.parentNode.nextSibling;
		}
		if (middleNode.localName === undefined) {
			console.log(middleNode);
		}
		// console.log(middleNode);

	} while (middleNode !== endNode);

}

$('.get-all-selection').on('click', function() {
	// Get selection & range of index 0
	var sel = window.getSelection();
	var range = sel.getRangeAt(0);
	var sel = window.getSelection();

	console.log(range.startContainer);
	console.log(range.endContainer);
	range.setStartAfter(range.startContainer);
});

$('.get-selection').on('click', function() {
	var s = window.getSelection();
	$('.console-div').append(s);
	// console.log(s);
	var range = s.getRangeAt(0);
	// console.log(range);
	var el = document.createElement("div");
	el.innerHTML = "<span></span>";
	var frag = document.createDocumentFragment();
	frag.appendChild(el.firstChild);
	var cloneContents = range.cloneContents();

	var selectionParentHTML = range.startContainer.parentElement.innerHTML;


	console.log(range.startContainer);
	console.log(range.startOffset);
	console.log(range.endContainer);
	console.log(range.endOffset);
});

$('.previous-sibling').on('click', function() {
	var sel = window.getSelection();
	var range = sel.getRangeAt(0);

	console.log(range.startContainer.previousSibling);
});

$('.next-sibling').on('click', function() {
	var sel = window.getSelection();
	var range = sel.getRangeAt(0);

	console.log(range.startContainer.nextSibling);
});
