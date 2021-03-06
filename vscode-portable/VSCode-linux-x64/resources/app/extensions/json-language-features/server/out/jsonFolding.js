/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_languageserver_1 = require("vscode-languageserver");
var jsonc_parser_1 = require("jsonc-parser");
var vscode_languageserver_protocol_foldingprovider_1 = require("vscode-languageserver-protocol-foldingprovider");
function getFoldingRegions(document, maxRanges, cancellationToken) {
    var ranges = [];
    var nestingLevels = [];
    var stack = [];
    var prevStart = -1;
    var scanner = jsonc_parser_1.createScanner(document.getText(), false);
    var token = scanner.scan();
    function addRange(range) {
        ranges.push(range);
        nestingLevels.push(stack.length);
    }
    while (token !== 17 /* EOF */) {
        if (cancellationToken && cancellationToken.isCancellationRequested) {
            return null;
        }
        switch (token) {
            case 1 /* OpenBraceToken */:
            case 3 /* OpenBracketToken */: {
                var startLine = document.positionAt(scanner.getTokenOffset()).line;
                var range = { startLine: startLine, endLine: startLine, type: token === 1 /* OpenBraceToken */ ? 'object' : 'array' };
                stack.push(range);
                break;
            }
            case 2 /* CloseBraceToken */:
            case 4 /* CloseBracketToken */: {
                var type = token === 2 /* CloseBraceToken */ ? 'object' : 'array';
                if (stack.length > 0 && stack[stack.length - 1].type === type) {
                    var range = stack.pop();
                    var line = document.positionAt(scanner.getTokenOffset()).line;
                    if (range && line > range.startLine + 1 && prevStart !== range.startLine) {
                        range.endLine = line - 1;
                        addRange(range);
                        prevStart = range.startLine;
                    }
                }
                break;
            }
            case 13 /* BlockCommentTrivia */: {
                var startLine = document.positionAt(scanner.getTokenOffset()).line;
                var endLine = document.positionAt(scanner.getTokenOffset() + scanner.getTokenLength()).line;
                if (scanner.getTokenError() === 1 /* UnexpectedEndOfComment */ && startLine + 1 < document.lineCount) {
                    scanner.setPosition(document.offsetAt(vscode_languageserver_1.Position.create(startLine + 1, 0)));
                }
                else {
                    if (startLine < endLine) {
                        addRange({ startLine: startLine, endLine: endLine, type: vscode_languageserver_protocol_foldingprovider_1.FoldingRangeType.Comment });
                        prevStart = startLine;
                    }
                }
                break;
            }
            case 12 /* LineCommentTrivia */: {
                var text = document.getText().substr(scanner.getTokenOffset(), scanner.getTokenLength());
                var m = text.match(/^\/\/\s*#(region\b)|(endregion\b)/);
                if (m) {
                    var line = document.positionAt(scanner.getTokenOffset()).line;
                    if (m[1]) {
                        var range = { startLine: line, endLine: line, type: vscode_languageserver_protocol_foldingprovider_1.FoldingRangeType.Region };
                        stack.push(range);
                    }
                    else {
                        var i = stack.length - 1;
                        while (i >= 0 && stack[i].type !== vscode_languageserver_protocol_foldingprovider_1.FoldingRangeType.Region) {
                            i--;
                        }
                        if (i >= 0) {
                            var range = stack[i];
                            stack.length = i;
                            if (line > range.startLine && prevStart !== range.startLine) {
                                range.endLine = line;
                                addRange(range);
                                prevStart = range.startLine;
                            }
                        }
                    }
                }
                break;
            }
        }
        token = scanner.scan();
    }
    if (maxRanges && ranges.length > maxRanges) {
        var counts = [];
        for (var _i = 0, nestingLevels_1 = nestingLevels; _i < nestingLevels_1.length; _i++) {
            var level = nestingLevels_1[_i];
            if (level < 30) {
                counts[level] = (counts[level] || 0) + 1;
            }
        }
        var entries = 0;
        var maxLevel_1 = 0;
        for (var i = 0; i < counts.length; i++) {
            var n = counts[i];
            if (n) {
                if (n + entries > maxRanges) {
                    maxLevel_1 = i;
                    break;
                }
                entries += n;
            }
        }
        ranges = ranges.filter(function (r, index) { return nestingLevels[index] < maxLevel_1; });
    }
    return { ranges: ranges };
}
exports.getFoldingRegions = getFoldingRegions;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/3aeede733d9a3098f7b4bdc1f66b63b0f48c1ef9/extensions/json-language-features/server/out/jsonFolding.js.map
