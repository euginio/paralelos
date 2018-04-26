"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const assert = require("assert");
const vscode_1 = require("vscode");
const testUtils_1 = require("./testUtils");
const abbreviationActions_1 = require("../abbreviationActions");
const defaultCompletionProvider_1 = require("../defaultCompletionProvider");
const completionProvider = new defaultCompletionProvider_1.DefaultCompletionItemProvider();
const htmlContents = `
<body class="header">
	<ul class="nav main">
		<li class="item1">img</li>
		<li class="item2">hithere</li>
		ul>li
		ul>li*2
		ul>li.item$*2
		ul>li.item$@44*2
		<div i
	</ul>
	<style>
		.boo {
			m10
		}
	</style>
	<span></span>
	(ul>li.item$)*2
	(ul>li.item$)*2+span
	(div>dl>(dt+dd)*2)
</body>
`;
suite('Tests for Expand Abbreviations (HTML)', () => {
    teardown(() => {
        // Reset config and close all editors
        return vscode_1.workspace.getConfiguration('emmet').update('excludeLanguages', []).then(testUtils_1.closeAllEditors);
    });
    test('Expand snippets (HTML)', () => {
        return testExpandAbbreviation('html', new vscode_1.Selection(3, 23, 3, 23), 'img', '<img src=\"\" alt=\"\">');
    });
    test('Expand snippets in completion list (HTML)', () => {
        return testHtmlCompletionProvider(new vscode_1.Selection(3, 23, 3, 23), 'img', '<img src=\"\" alt=\"\">');
    });
    test('Expand snippets when no parent node (HTML)', () => {
        return testUtils_1.withRandomFileEditor('img', 'html', (editor, doc) => {
            editor.selection = new vscode_1.Selection(0, 3, 0, 3);
            return abbreviationActions_1.expandEmmetAbbreviation(null).then(() => {
                assert.equal(editor.document.getText(), '<img src=\"\" alt=\"\">');
                return Promise.resolve();
            });
        });
    });
    test('Expand snippets when no parent node in completion list (HTML)', () => {
        return testUtils_1.withRandomFileEditor('img', 'html', (editor, doc) => {
            editor.selection = new vscode_1.Selection(0, 3, 0, 3);
            const cancelSrc = new vscode_1.CancellationTokenSource();
            const completionPromise = completionProvider.provideCompletionItems(editor.document, editor.selection.active, cancelSrc.token, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            if (!completionPromise) {
                assert.equal(!completionPromise, false, `Got unexpected undefined instead of a completion promise`);
                return Promise.resolve();
            }
            return completionPromise.then(completionList => {
                assert.equal(completionList && completionList.items && completionList.items.length > 0, true);
                if (completionList) {
                    assert.equal(completionList.items[0].label, 'img');
                    assert.equal((completionList.items[0].documentation || '').replace(/\|/g, ''), '<img src=\"\" alt=\"\">');
                }
                return Promise.resolve();
            });
        });
    });
    test('Expand abbreviation (HTML)', () => {
        return testExpandAbbreviation('html', new vscode_1.Selection(5, 25, 5, 25), 'ul>li', '<ul>\n\t\t\t<li></li>\n\t\t</ul>');
    });
    test('Expand abbreviation in completion list (HTML)', () => {
        return testHtmlCompletionProvider(new vscode_1.Selection(5, 25, 5, 25), 'ul>li', '<ul>\n\t<li></li>\n</ul>');
    });
    test('Expand text that is neither an abbreviation nor a snippet to tags (HTML)', () => {
        return testExpandAbbreviation('html', new vscode_1.Selection(4, 20, 4, 27), 'hithere', '<hithere></hithere>');
    });
    test('Do not Expand text that is neither an abbreviation nor a snippet to tags in completion list (HTML)', () => {
        return testHtmlCompletionProvider(new vscode_1.Selection(4, 20, 4, 27), 'hithere', '<hithere></hithere>', true);
    });
    test('Expand abbreviation with repeaters (HTML)', () => {
        return testExpandAbbreviation('html', new vscode_1.Selection(6, 27, 6, 27), 'ul>li*2', '<ul>\n\t\t\t<li></li>\n\t\t\t<li></li>\n\t\t</ul>');
    });
    test('Expand abbreviation with repeaters in completion list (HTML)', () => {
        return testHtmlCompletionProvider(new vscode_1.Selection(6, 27, 6, 27), 'ul>li*2', '<ul>\n\t<li></li>\n\t<li></li>\n</ul>');
    });
    test('Expand abbreviation with numbered repeaters (HTML)', () => {
        return testExpandAbbreviation('html', new vscode_1.Selection(7, 33, 7, 33), 'ul>li.item$*2', '<ul>\n\t\t\t<li class="item1"></li>\n\t\t\t<li class="item2"></li>\n\t\t</ul>');
    });
    test('Expand abbreviation with numbered repeaters in completion list (HTML)', () => {
        return testHtmlCompletionProvider(new vscode_1.Selection(7, 33, 7, 33), 'ul>li.item$*2', '<ul>\n\t<li class="item1"></li>\n\t<li class="item2"></li>\n</ul>');
    });
    test('Expand abbreviation with numbered repeaters with offset (HTML)', () => {
        return testExpandAbbreviation('html', new vscode_1.Selection(8, 36, 8, 36), 'ul>li.item$@44*2', '<ul>\n\t\t\t<li class="item44"></li>\n\t\t\t<li class="item45"></li>\n\t\t</ul>');
    });
    test('Expand abbreviation with numbered repeaters with offset in completion list (HTML)', () => {
        return testHtmlCompletionProvider(new vscode_1.Selection(8, 36, 8, 36), 'ul>li.item$@44*2', '<ul>\n\t<li class="item44"></li>\n\t<li class="item45"></li>\n</ul>');
    });
    test('Expand abbreviation with numbered repeaters in groups (HTML)', () => {
        return testExpandAbbreviation('html', new vscode_1.Selection(17, 16, 17, 16), '(ul>li.item$)*2', '<ul>\n\t\t<li class="item1"></li>\n\t</ul>\n\t<ul>\n\t\t<li class="item2"></li>\n\t</ul>');
    });
    test('Expand abbreviation with numbered repeaters in groups in completion list (HTML)', () => {
        return testHtmlCompletionProvider(new vscode_1.Selection(17, 16, 17, 16), '(ul>li.item$)*2', '<ul>\n\t<li class="item1"></li>\n</ul>\n<ul>\n\t<li class="item2"></li>\n</ul>');
    });
    test('Expand abbreviation with numbered repeaters in groups with sibling in the end (HTML)', () => {
        return testExpandAbbreviation('html', new vscode_1.Selection(18, 21, 18, 21), '(ul>li.item$)*2+span', '<ul>\n\t\t<li class="item1"></li>\n\t</ul>\n\t<ul>\n\t\t<li class="item2"></li>\n\t</ul>\n\t<span></span>');
    });
    test('Expand abbreviation with numbered repeaters in groups with sibling in the end in completion list (HTML)', () => {
        return testHtmlCompletionProvider(new vscode_1.Selection(18, 21, 18, 21), '(ul>li.item$)*2+span', '<ul>\n\t<li class="item1"></li>\n</ul>\n<ul>\n\t<li class="item2"></li>\n</ul>\n<span></span>');
    });
    test('Expand abbreviation with nested groups (HTML)', () => {
        return testExpandAbbreviation('html', new vscode_1.Selection(19, 19, 19, 19), '(div>dl>(dt+dd)*2)', '<div>\n\t\t<dl>\n\t\t\t<dt></dt>\n\t\t\t<dd></dd>\n\t\t\t<dt></dt>\n\t\t\t<dd></dd>\n\t\t</dl>\n\t</div>');
    });
    test('Expand abbreviation with nested groups in completion list (HTML)', () => {
        return testHtmlCompletionProvider(new vscode_1.Selection(19, 19, 19, 19), '(div>dl>(dt+dd)*2)', '<div>\n\t<dl>\n\t\t<dt></dt>\n\t\t<dd></dd>\n\t\t<dt></dt>\n\t\t<dd></dd>\n\t</dl>\n</div>');
    });
    test('Expand tag that is opened, but not closed (HTML)', () => {
        return testExpandAbbreviation('html', new vscode_1.Selection(9, 6, 9, 6), '<div', '<div></div>');
    });
    test('Do not Expand tag that is opened, but not closed in completion list (HTML)', () => {
        return testHtmlCompletionProvider(new vscode_1.Selection(9, 6, 9, 6), '<div', '<div></div>', true);
    });
    test('No expanding text inside open tag (HTML)', () => {
        return testUtils_1.withRandomFileEditor(htmlContents, 'html', (editor, doc) => {
            editor.selection = new vscode_1.Selection(2, 4, 2, 4);
            return abbreviationActions_1.expandEmmetAbbreviation(null).then(() => {
                assert.equal(editor.document.getText(), htmlContents);
                return Promise.resolve();
            });
        });
    });
    test('No expanding text inside open tag in completion list (HTML)', () => {
        return testUtils_1.withRandomFileEditor(htmlContents, 'html', (editor, doc) => {
            editor.selection = new vscode_1.Selection(2, 4, 2, 4);
            const cancelSrc = new vscode_1.CancellationTokenSource();
            const completionPromise = completionProvider.provideCompletionItems(editor.document, editor.selection.active, cancelSrc.token, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            assert.equal(!completionPromise, true, `Got unexpected comapletion promise instead of undefined`);
            return Promise.resolve();
        });
    });
    test('No expanding text inside open tag when there is no closing tag (HTML)', () => {
        return testUtils_1.withRandomFileEditor(htmlContents, 'html', (editor, doc) => {
            editor.selection = new vscode_1.Selection(9, 8, 9, 8);
            return abbreviationActions_1.expandEmmetAbbreviation(null).then(() => {
                assert.equal(editor.document.getText(), htmlContents);
                return Promise.resolve();
            });
        });
    });
    test('No expanding text inside open tag when there is no closing tag in completion list (HTML)', () => {
        return testUtils_1.withRandomFileEditor(htmlContents, 'html', (editor, doc) => {
            editor.selection = new vscode_1.Selection(9, 8, 9, 8);
            const cancelSrc = new vscode_1.CancellationTokenSource();
            const completionPromise = completionProvider.provideCompletionItems(editor.document, editor.selection.active, cancelSrc.token, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            assert.equal(!completionPromise, true, `Got unexpected comapletion promise instead of undefined`);
            return Promise.resolve();
        });
    });
    test('No expanding text inside open tag when there is no closing tag when there is no parent node (HTML)', () => {
        const fileContents = '<img s';
        return testUtils_1.withRandomFileEditor(fileContents, 'html', (editor, doc) => {
            editor.selection = new vscode_1.Selection(0, 6, 0, 6);
            return abbreviationActions_1.expandEmmetAbbreviation(null).then(() => {
                assert.equal(editor.document.getText(), fileContents);
                return Promise.resolve();
            });
        });
    });
    test('No expanding text in completion list inside open tag when there is no closing tag when there is no parent node (HTML)', () => {
        const fileContents = '<img s';
        return testUtils_1.withRandomFileEditor(fileContents, 'html', (editor, doc) => {
            editor.selection = new vscode_1.Selection(0, 6, 0, 6);
            const cancelSrc = new vscode_1.CancellationTokenSource();
            const completionPromise = completionProvider.provideCompletionItems(editor.document, editor.selection.active, cancelSrc.token, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            assert.equal(!completionPromise, true, `Got unexpected comapletion promise instead of undefined`);
            return Promise.resolve();
        });
    });
    test('Expand css when inside style tag (HTML)', () => {
        return testUtils_1.withRandomFileEditor(htmlContents, 'html', (editor, doc) => {
            editor.selection = new vscode_1.Selection(13, 3, 13, 6);
            let expandPromise = abbreviationActions_1.expandEmmetAbbreviation({ language: 'css' });
            if (!expandPromise) {
                return Promise.resolve();
            }
            return expandPromise.then(() => {
                assert.equal(editor.document.getText(), htmlContents.replace('m10', 'margin: 10px;'));
                return Promise.resolve();
            });
        });
    });
    // test('Expand css when inside style tag in completion list (HTML)', () => {
    // 	const abbreviation = 'm10';
    // 	const expandedText = 'margin: 10px;';
    // 	return withRandomFileEditor(htmlContents, 'html', (editor, doc) => {
    // 		editor.selection = new Selection(13, 3, 13, 6);
    // 		const cancelSrc = new CancellationTokenSource();
    // 		const completionPromise = completionProvider.provideCompletionItems(editor.document, editor.selection.active, cancelSrc.token, { triggerKind: CompletionTriggerKind.Invoke });
    // 		if (!completionPromise) {
    // 			assert.equal(1, 2, `Problem with expanding m10`);
    // 			return Promise.resolve();
    // 		}
    // 		return completionPromise.then((completionList: CompletionList) => {
    // 			if (!completionList.items || !completionList.items.length) {
    // 				assert.equal(1, 2, `Problem with expanding m10`);
    // 				return Promise.resolve();
    // 			}
    // 			const emmetCompletionItem = completionList.items[0];
    // 			assert.equal(emmetCompletionItem.label, expandedText, `Label of completion item doesnt match.`);
    // 			assert.equal((<string>emmetCompletionItem.documentation || '').replace(/\|/g, ''), expandedText, `Docs of completion item doesnt match.`);
    // 			assert.equal(emmetCompletionItem.filterText, abbreviation, `FilterText of completion item doesnt match.`);
    // 			return Promise.resolve();
    // 		});
    // 	});
    // });
    test('No expanding when html is excluded in the settings', () => {
        return vscode_1.workspace.getConfiguration('emmet').update('excludeLanguages', ['html']).then(() => {
            return testExpandAbbreviation('html', new vscode_1.Selection(9, 6, 9, 6), '', '', true).then(() => {
                return vscode_1.workspace.getConfiguration('emmet').update('excludeLanguages', []);
            });
        });
    });
    test('No expanding when html is excluded in the settings in completion list', () => {
        return vscode_1.workspace.getConfiguration('emmet').update('excludeLanguages', ['html']).then(() => {
            return testHtmlCompletionProvider(new vscode_1.Selection(9, 6, 9, 6), '', '', true).then(() => {
                return vscode_1.workspace.getConfiguration('emmet').update('excludeLanguages', []);
            });
        });
    });
    test('No expanding when php (mapped syntax) is excluded in the settings', () => {
        return vscode_1.workspace.getConfiguration('emmet').update('excludeLanguages', ['php']).then(() => {
            return testExpandAbbreviation('php', new vscode_1.Selection(9, 6, 9, 6), '', '', true).then(() => {
                return vscode_1.workspace.getConfiguration('emmet').update('excludeLanguages', []);
            });
        });
    });
});
suite('Tests for jsx, xml and xsl', () => {
    teardown(testUtils_1.closeAllEditors);
    test('Expand abbreviation with className instead of class in jsx', () => {
        return testUtils_1.withRandomFileEditor('ul.nav', 'javascriptreact', (editor, doc) => {
            editor.selection = new vscode_1.Selection(0, 6, 0, 6);
            return abbreviationActions_1.expandEmmetAbbreviation({ language: 'javascriptreact' }).then(() => {
                assert.equal(editor.document.getText(), '<ul className="nav"></ul>');
                return Promise.resolve();
            });
        });
    });
    test('Expand abbreviation with self closing tags for jsx', () => {
        return testUtils_1.withRandomFileEditor('img', 'javascriptreact', (editor, doc) => {
            editor.selection = new vscode_1.Selection(0, 6, 0, 6);
            return abbreviationActions_1.expandEmmetAbbreviation({ language: 'javascriptreact' }).then(() => {
                assert.equal(editor.document.getText(), '<img src="" alt=""/>');
                return Promise.resolve();
            });
        });
    });
    test('Expand abbreviation with single quotes for jsx', () => {
        return vscode_1.workspace.getConfiguration('emmet').update('syntaxProfiles', { jsx: { "attr_quotes": "single" } }).then(() => {
            return testUtils_1.withRandomFileEditor('img', 'javascriptreact', (editor, doc) => {
                editor.selection = new vscode_1.Selection(0, 6, 0, 6);
                return abbreviationActions_1.expandEmmetAbbreviation({ language: 'javascriptreact' }).then(() => {
                    assert.equal(editor.document.getText(), '<img src=\'\' alt=\'\'/>');
                    return vscode_1.workspace.getConfiguration('emmet').update('syntaxProfiles', {});
                });
            });
        });
    });
    test('Expand abbreviation with self closing tags for xml', () => {
        return testUtils_1.withRandomFileEditor('img', 'xml', (editor, doc) => {
            editor.selection = new vscode_1.Selection(0, 6, 0, 6);
            return abbreviationActions_1.expandEmmetAbbreviation({ language: 'xml' }).then(() => {
                assert.equal(editor.document.getText(), '<img src="" alt=""/>');
                return Promise.resolve();
            });
        });
    });
    test('Expand abbreviation with no self closing tags for html', () => {
        return testUtils_1.withRandomFileEditor('img', 'html', (editor, doc) => {
            editor.selection = new vscode_1.Selection(0, 6, 0, 6);
            return abbreviationActions_1.expandEmmetAbbreviation({ language: 'html' }).then(() => {
                assert.equal(editor.document.getText(), '<img src="" alt="">');
                return Promise.resolve();
            });
        });
    });
});
function testExpandAbbreviation(syntax, selection, abbreviation, expandedText, shouldFail) {
    return testUtils_1.withRandomFileEditor(htmlContents, syntax, (editor, doc) => {
        editor.selection = selection;
        let expandPromise = abbreviationActions_1.expandEmmetAbbreviation(null);
        if (!expandPromise) {
            if (!shouldFail) {
                assert.equal(1, 2, `Problem with expanding ${abbreviation} to ${expandedText}`);
            }
            return Promise.resolve();
        }
        return expandPromise.then(() => {
            assert.equal(editor.document.getText(), htmlContents.replace(abbreviation, expandedText));
            return Promise.resolve();
        });
    });
}
function testHtmlCompletionProvider(selection, abbreviation, expandedText, shouldFail) {
    return testUtils_1.withRandomFileEditor(htmlContents, 'html', (editor, doc) => {
        editor.selection = selection;
        const cancelSrc = new vscode_1.CancellationTokenSource();
        const completionPromise = completionProvider.provideCompletionItems(editor.document, editor.selection.active, cancelSrc.token, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
        if (!completionPromise) {
            if (!shouldFail) {
                assert.equal(1, 2, `Problem with expanding ${abbreviation} to ${expandedText}`);
            }
            return Promise.resolve();
        }
        return completionPromise.then((completionList) => {
            if (!completionList.items || !completionList.items.length) {
                if (!shouldFail) {
                    assert.equal(1, 2, `Problem with expanding ${abbreviation} to ${expandedText}`);
                }
                return Promise.resolve();
            }
            const emmetCompletionItem = completionList.items[0];
            assert.equal(emmetCompletionItem.label, abbreviation, `Label of completion item doesnt match.`);
            assert.equal((emmetCompletionItem.documentation || '').replace(/\|/g, ''), expandedText, `Docs of completion item doesnt match.`);
            return Promise.resolve();
        });
    });
}
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/3aeede733d9a3098f7b4bdc1f66b63b0f48c1ef9/extensions/emmet/out/test/abbreviationAction.test.js.map