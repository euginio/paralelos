/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var strings_1 = require("../utils/strings");
var url = require("url");
function getDocumentContext(documentUri, workspaceFolders) {
    function getRootFolder() {
        for (var _i = 0, workspaceFolders_1 = workspaceFolders; _i < workspaceFolders_1.length; _i++) {
            var folder = workspaceFolders_1[_i];
            var folderURI = folder.uri;
            if (!strings_1.endsWith(folderURI, '/')) {
                folderURI = folderURI + '/';
            }
            if (strings_1.startsWith(documentUri, folderURI)) {
                return folderURI;
            }
        }
        return void 0;
    }
    return {
        resolveReference: function (ref, base) {
            if (base === void 0) { base = documentUri; }
            if (ref[0] === '/') {
                if (strings_1.startsWith(base, 'file://')) {
                    var folderUri = getRootFolder();
                    if (folderUri) {
                        return folderUri + ref.substr(1);
                    }
                }
            }
            return url.resolve(base, ref);
        },
    };
}
exports.getDocumentContext = getDocumentContext;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/3aeede733d9a3098f7b4bdc1f66b63b0f48c1ef9/extensions/html-language-features/server/out/utils/documentContext.js.map
