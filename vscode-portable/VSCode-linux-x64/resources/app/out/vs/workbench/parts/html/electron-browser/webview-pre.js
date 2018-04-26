/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
!function(){"use strict";function t(t){t&&(t.classList.remove("vscode-light","vscode-dark","vscode-high-contrast"),t.classList.add(b.activeTheme))}function e(){return document.getElementById("active-frame")}function n(){return document.getElementById("pending-frame")}function o(t){if(t&&t.view&&t.view.document)for(var e=t.view.document.getElementsByTagName("base")[0],n=t.target;n;){if(n.tagName&&"a"===n.tagName.toLowerCase()&&n.href){if("#"===n.getAttribute("href"))t.view.scrollTo(0,0);else if(n.hash&&(n.getAttribute("href")===n.hash||e&&n.href.indexOf(e.href)>=0)){var o=t.view.document.getElementById(n.hash.substr(1,n.hash.length-1));o&&o.scrollIntoView()}else c.sendToHost("did-click-link",n.href);t.preventDefault();break}n=n.parentNode}}function r(t){u?c.sendToHost("onmessage",t.data):c.sendToHost(t.data.command,t.data.data)}function i(t){if(m)return;const e=t.target.body.scrollTop/t.target.body.clientHeight;isNaN(e)||(m=!0,window.requestAnimationFrame(function(){try{c.sendToHost("did-scroll",e)}catch(t){}
m=!1}))}const c=require("electron").ipcRenderer,s=function(){let t=!1;return()=>{t||(t=!0,require("electron").webFrame.registerURLSchemeAsPrivileged("vscode-resource",{secure:!0,bypassCSP:!1,allowServiceWorkers:!1,supportFetchAPI:!0,corsEnabled:!0}))}}();var a,l=!0,d=[],u=!1;const b={initialScrollProgress:void 0};var m=!1;document.addEventListener("DOMContentLoaded",function(){c.on("baseUrl",function(t,e){b.baseUrl=e}),c.on("styles",function(n,o,r){b.styles=o,b.activeTheme=r;var i=e();if(i){t(i.contentDocument.getElementsByTagName("body")[0]),Object.keys(o).forEach(function(t){i.contentDocument.documentElement.style.setProperty(`--${t}`,o[t])})}}),c.on("focus",function(){const t=e();t&&t.contentWindow.focus()}),c.on("content",function(r,m){const h=m.options;(u=h&&h.enableWrappedPostMessage)&&s();const f=m.contents,g=(new DOMParser).parseFromString(f,"text/html");if(g.querySelectorAll("a").forEach(t=>{t.title||(t.title=t.href)}),b.baseUrl&&0===g.head.getElementsByTagName("base").length){
const t=g.createElement("base");t.href=b.baseUrl,g.head.appendChild(t)}const v=g.createElement("style");v.id="_defaultStyles";const w=Object.keys(b.styles||{}).map(function(t){return`--${t}: ${b.styles[t]};`})
;v.innerHTML=`\n\t\t\t:root { ${w.join(" ")} }\n\n\t\t\tbody {\n\t\t\t\tbackground-color: var(--background-color);\n\t\t\t\tcolor: var(--color);\n\t\t\t\tfont-family: var(--font-family);\n\t\t\t\tfont-weight: var(--font-weight);\n\t\t\t\tfont-size: var(--font-size);\n\t\t\t\tmargin: 0;\n\t\t\t\tpadding: 0 20px;\n\t\t\t}\n\n\t\t\timg {\n\t\t\t\tmax-width: 100%;\n\t\t\t\tmax-height: 100%;\n\t\t\t}\n\n\t\t\tbody a {\n\t\t\t\tcolor: var(--link-color);\n\t\t\t}\n\n\t\t\ta:focus,\n\t\t\tinput:focus,\n\t\t\tselect:focus,\n\t\t\ttextarea:focus {\n\t\t\t\toutline: 1px solid -webkit-focus-ring-color;\n\t\t\t\toutline-offset: -1px;\n\t\t\t}\n\t\t\t::-webkit-scrollbar {\n\t\t\t\twidth: 10px;\n\t\t\t\theight: 10px;\n\t\t\t}\n\n\t\t\t::-webkit-scrollbar-thumb {\n\t\t\t\tbackground-color: rgba(121, 121, 121, 0.4);\n\t\t\t}\n\t\t\tbody.vscode-light::-webkit-scrollbar-thumb {\n\t\t\t\tbackground-color: rgba(100, 100, 100, 0.4);\n\t\t\t}\n\t\t\tbody.vscode-high-contrast::-webkit-scrollbar-thumb {\n\t\t\t\tbackground-color: rgba(111, 195, 223, 0.3);\n\t\t\t}\n\n\t\t\t::-webkit-scrollbar-thumb:hover {\n\t\t\t\tbackground-color: rgba(100, 100, 100, 0.7);\n\t\t\t}\n\t\t\tbody.vscode-light::-webkit-scrollbar-thumb:hover {\n\t\t\t\tbackground-color: rgba(100, 100, 100, 0.7);\n\t\t\t}\n\t\t\tbody.vscode-high-contrast::-webkit-scrollbar-thumb:hover {\n\t\t\t\tbackground-color: rgba(111, 195, 223, 0.8);\n\t\t\t}\n\n\t\t\t::-webkit-scrollbar-thumb:active {\n\t\t\t\tbackground-color: rgba(85, 85, 85, 0.8);\n\t\t\t}\n\t\t\tbody.vscode-light::-webkit-scrollbar-thumb:active {\n\t\t\t\tbackground-color: rgba(0, 0, 0, 0.6);\n\t\t\t}\n\t\t\tbody.vscode-high-contrast::-webkit-scrollbar-thumb:active {\n\t\t\t\tbackground-color: rgba(111, 195, 223, 0.8);\n\t\t\t}\n\t\t\t`,
g.head.hasChildNodes()?g.head.insertBefore(v,g.head.firstChild):g.head.appendChild(v),t(g.body);const y=e();var p;if(l)l=!1,p=function(t){isNaN(b.initialScrollProgress)||0===t.scrollTop&&(t.scrollTop=t.clientHeight*b.initialScrollProgress)};else{const t=y&&y.contentDocument&&y.contentDocument.body?y.contentDocument.body.scrollTop:0;p=function(e){0===e.scrollTop&&(e.scrollTop=t)}}const k=n();k&&(k.setAttribute("id",""),document.body.removeChild(k)),d=[];const T=document.createElement("iframe");T.setAttribute("id","pending-frame"),T.setAttribute("frameborder","0"),T.setAttribute("sandbox",h.allowScripts?"allow-scripts allow-forms allow-same-origin":"allow-same-origin"),T.style.cssText="display: block; margin: 0; overflow: hidden; position: absolute; width: 100%; height: 100%; visibility: hidden",document.body.appendChild(T),T.contentDocument.open("text/html","replace"),T.contentWindow.onbeforeunload=function(){return console.log("prevented webview navigation"),!1};var E=function(t,r){t.body&&(p(t.body),
t.body.addEventListener("click",o));const c=n();if(c&&c.contentDocument===t){const t=e();t&&document.body.removeChild(t),c.setAttribute("id","active-frame"),c.style.visibility="visible",r.addEventListener("scroll",i),d.forEach(function(t){r.postMessage(t,"*")}),d=[]}};clearTimeout(a),a=void 0,a=setTimeout(function(){clearTimeout(a),a=void 0,E(T.contentDocument,T.contentWindow)},200),T.contentWindow.addEventListener("load",function(t){a&&(clearTimeout(a),a=void 0,E(t.target,this))}),T.contentDocument.write("<!DOCTYPE html>"),T.contentDocument.write(g.documentElement.innerHTML),T.contentDocument.close(),c.sendToHost("did-set-content")}),c.on("message",function(t,o){if(n())d.push(o);else{const t=e();t&&t.contentWindow.postMessage(o,"*")}}),c.on("initial-scroll-position",function(t,e){b.initialScrollProgress=e}),window.onmessage=r,c.sendToHost("webview-ready",process.pid)})}();
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/3aeede733d9a3098f7b4bdc1f66b63b0f48c1ef9/core/vs/workbench/parts/html/electron-browser/webview-pre.js.map