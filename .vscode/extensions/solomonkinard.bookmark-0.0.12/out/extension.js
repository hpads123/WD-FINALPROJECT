"use strict";var Y=Object.create;var C=Object.defineProperty;var Z=Object.getOwnPropertyDescriptor;var j=Object.getOwnPropertyNames;var ee=Object.getPrototypeOf,oe=Object.prototype.hasOwnProperty;var te=(t,e)=>{for(var o in e)C(t,o,{get:e[o],enumerable:!0})},L=(t,e,o,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of j(e))!oe.call(t,n)&&n!==o&&C(t,n,{get:()=>e[n],enumerable:!(r=Z(e,n))||r.enumerable});return t};var p=(t,e,o)=>(o=t!=null?Y(ee(t)):{},L(e||!t||!t.__esModule?C(o,"default",{value:t,enumerable:!0}):o,t)),se=t=>L(C({},"__esModule",{value:!0}),t);var fe={};te(fe,{activate:()=>de,deactivate:()=>me});module.exports=se(fe);var a=p(require("vscode"));var h=p(require("vscode")),E=class{add(e){let o=e.document.uri.fsPath,r=e.selection.start.line;h.commands.executeCommand("bookmark.addBookmark",o,r)}removeLine(e){let[o,r]=e.id?.split(":",2)??[],n=parseInt(r),s=isNaN(n)?void 0:n;h.commands.executeCommand("bookmark.removeBookmark",o,s)}removeFilepath(e){let o=e.id;h.commands.executeCommand("bookmark.removeBookmark",o)}removeAll(e){h.commands.executeCommand("bookmark.removeBookmarks")}};var u=p(require("vscode"));var W=p(require("vscode"));function I(){let t=W.workspace.workspaceFolders;if(!(!t||t.length<1))return W.workspace.getWorkspaceFolder(t[0].uri)?.uri.path}var S=require("path"),y=class extends u.TreeItem{constructor(e){let o=(e.line+1).toString();super(e.textContent),this.id=`${e.filePath}:${e.line}`,this.resourceUri=u.Uri.parse(e.filePath),this.contextValue="line",this.description=o,this.command={command:"bookmark.gotoBookmark",title:"Goto bookmark",arguments:[e.filePath,e.line]};let r=S.basename(e.filePath),n=S.dirname(e.filePath),s=I(),i=n;s&&n.indexOf(s)===0&&(i=n.substring(s.length+1)),this.tooltip=`${r}:${o} ${i}
${e.textContent}`}},P=class{constructor(e){this._onDidChangeTreeData=new u.EventEmitter;this.onDidChangeTreeData=this._onDidChangeTreeData.event;this.data_=e,this.refresh()}refresh(){this._onDidChangeTreeData.fire()}getTreeItem(e){return e}getChildren(e){let o=[];if(e){let r=e.id,n=this.data_.data_.get(r);for(let s of Array.from(n??[]).sort()){let i=new y({textContent:s[1].content??"",filePath:r,line:s[0]});o.push(i)}return o}for(let[r,n]of Array.from(this.data_.data_).sort()){let s=S.basename(r),i=new u.TreeItem(s,u.TreeItemCollapsibleState.Expanded);i.resourceUri=u.Uri.parse(r),i.contextValue="filepath",i.id=r,o.push(i)}return o}};var $=p(require("vscode")),ne=1e4,B=class{constructor(e){this.data_=new Map;this.context_=e,setTimeout(async()=>{await this.tmpVersionBumpToContentCapture();let o=e.workspaceState.keys();o.length>ne&&this.clear(),o.forEach(r=>{let n=this.getState().get(r),s=new Map(Object.entries(n)),i=new Map;for(let[c,d]of s){if(typeof d=="number"){i.set(d,{content:""});continue}i.set(Number(c),d)}this.data_.set(r,i)}),$.commands.executeCommand("bookmark.refreshGutter")},0)}async tmpVersionBumpToContentCapture(){let e=this.context_.extension.packageJSON.version}add(e,o,r){let n=this.data_.get(e);n||(n=new Map),n.set(o,{content:r}),this.set(e,n)}set(e,o){this.data_.set(e,o),this.getState().update(e,Object.fromEntries(o))}get(e){return this.data_.get(e)}has(e){return this.data_.has(e)}size(){return this.data_.size}isEmpty(){return this.data_.size===0}delete(e){this.data_.delete(e),this.getState().update(e,void 0)}remove(e,o){if(o!==void 0){let r=this.data_.get(e);if(r===void 0)return;if(r.delete(o),r.size===0){this.delete(e);return}this.set(e,r);return}this.data_.delete(e),this.getState().update(e,void 0)}clear(){this.data_.clear(),this.getState().keys().forEach(e=>{this.getState().update(e,void 0)})}hasFilepathAndLine(e,o){return this.get(e)?.has(o)??!1}getState(){return this.context_.workspaceState}};var m=p(require("vscode"));var Q=require("path");function G(t){let e=[];for(let[o,r]of t.data_){let n=I(),s=Q.basename(o),i=Q.dirname(o),c=i;n&&i.indexOf(n)===0&&(c=i.substring(n.length+1)),e.push({label:"",kind:m.QuickPickItemKind.Separator});for(let d of r){let l=[];((H,X)=>{l.push({iconPath:H,tooltip:X})})(new m.ThemeIcon("close"),"Remove");let f=(d[0]+1).toString(),J=`${`${s}:${f}`}`,K=` ${d[1].content??""}`;e.push({label:J,filepath:o,line:d[0],description:c,detail:K,buttons:l})}}return e}var g=class{showMenu(e){if(console.log("showMenu"),e.isEmpty())return;let o=m.window.createQuickPick();o.show(),o.title="Bookmark";let r=G(e);o.items=r,o.buttons=[{iconPath:new m.ThemeIcon("add"),tooltip:"Add"}],o.onDidTriggerButton(n=>{n.tooltip==="Add"&&m.commands.executeCommand("bookmark.add")}),o.onDidAccept(()=>{let n=o.selectedItems[0];m.commands.executeCommand("bookmark.gotoBookmark",n.filepath,n.line)}),o.onDidTriggerItemButton(n=>{let s=n.item;e.remove(s.filepath,s.line);let i=G(e);o.items=i,m.commands.executeCommand("bookmark.refreshTree")}),o.onDidHide(()=>o.dispose())}};var b=p(require("vscode")),F=require("fs");var _=class{},k=class{constructor(){this.filepath="";this.line=0}set(e,o){this.filepath=e,this.line=o}empty(){return this.filepath===""&&this.line===0}};var D=new _;function R(t){if(t.size()===0)return;let e=D.currentBookmark??new k,o=(s,i)=>(0,F.existsSync)(s)?(b.commands.executeCommand("bookmark.gotoBookmark",s,i),e.set(s,i),D.currentBookmark=e,!0):(b.commands.executeCommand("bookmark.removeBookmark",s,i),!1),r=()=>{for(let[s,[i]]of t.data_.entries())if(o(s,i[0]))return};if(!t.hasFilepathAndLine(e.filepath,e.line)){r();return}let n=!1;for(let[s,i]of t.data_.entries())for(let[c,d]of i)if(n){if(!o(s,c))continue;return}else s===e.filepath&&c===e.line&&(n=!0);r()}function O(t){if(t.size()===0)return;let e=D.currentBookmark??new k,o=n=>(0,F.existsSync)(n.filepath)?(b.commands.executeCommand("bookmark.gotoBookmark",n.filepath,n.line),D.currentBookmark=n,!0):(b.commands.executeCommand("bookmark.removeBookmark",n.filepath,n.line),!1),r=new k;for(let[n,s]of t.data_.entries())for(let i of s){if(n===e.filepath&&i[0]===e.line){if(r.empty()||!o(r))continue;return}r.set(n,i[0])}o(r)}var M=class{call(e,o){this.clear(),this.idleTimer=setTimeout(e,o)}clear(){this.idleTimer&&(clearTimeout(this.idleTimer),this.idleTimer=void 0)}};var re=require("os"),x=void 0;function U(t,e,o){x!==void 0&&x.dispose(),x=a.window.createTextEditorDecorationType({gutterIconPath:e.asAbsolutePath("media/16x16.png")}),t.setDecorations(x,o)}function A(t,e,o){t.refresh(),V(e,o)}function ie(){return a.window.activeTextEditor}function z(t){return t?.document.uri.fsPath}function ae(t,e,o){let r=z(o);q(t,e,o,r)}function V(t,e){let o=ie(),r=z(o);q(t,e,o,r)}function q(t,e,o,r){if(!o||!r)return;let n=e.get(r);if(n===void 0){U(o,t,[]);return}let s=[];for(let[i,c]of n){if(i>o.document.lineCount)continue;let d=new a.Position(i,0);s.push(new a.Range(d,d))}U(o,t,s)}function ce(t,e){let o=a.Uri.parse(t);re.platform()==="win32"&&(o=a.Uri.file(o.path));let r=s=>{var c=s.selection.active.with(e,0),d=new a.Selection(c,c);s.selection=d,!(e>=s.visibleRanges[0].start.line&&e<=s.visibleRanges[0].end.line)&&a.commands.executeCommand("revealLine",{lineNumber:e,at:"center"})},n=a.window.activeTextEditor;n?.document.uri===o?r(n):a.window.showTextDocument(o,{}).then(s=>r(s))}function de(t){let e=new E,o=new B(t);t.subscriptions.push(a.commands.registerTextEditorCommand("bookmark.add",s=>e.add(s))),t.subscriptions.push(a.commands.registerCommand("bookmark.removeLine",s=>e.removeLine(s))),t.subscriptions.push(a.commands.registerCommand("bookmark.showMenu",s=>new g().showMenu(o))),t.subscriptions.push(a.commands.registerCommand("bookmark.removeFilepath",s=>e.removeFilepath(s))),t.subscriptions.push(a.commands.registerCommand("bookmark.removeAll",s=>e.removeAll(s))),t.subscriptions.push(a.commands.registerCommand("bookmark.gotoPreviousBookmark",()=>O(o))),t.subscriptions.push(a.commands.registerCommand("bookmark.gotoNextBookmark",()=>R(o))),t.subscriptions.push(a.commands.registerTextEditorCommand("bookmark.toggleBookmark",s=>{let i=s.document.uri.fsPath,c=s.selection.start.line;o.hasFilepathAndLine(i,c)?a.commands.executeCommand("bookmark.removeBookmark",i,c):a.commands.executeCommand("bookmark.addBookmark",i,c)})),t.subscriptions.push(a.commands.registerTextEditorCommand("bookmark.menu",s=>new g().showMenu(o)));let r=new P(o),n=a.window.createTreeView("bookmark.explorer",{treeDataProvider:r,showCollapseAll:!0});t.subscriptions.push(a.commands.registerCommand("bookmark.refreshGutter",()=>V(t,o))),t.subscriptions.push(a.commands.registerCommand("bookmark.addBookmark",(s,i)=>{let c=a.window.activeTextEditor?.document.lineAt(i).text.trim();o.add(s,i,c??""),A(r,t,o)})),t.subscriptions.push(a.commands.registerCommand("bookmark.gotoBookmark",(s,i)=>{ce(s,i)})),t.subscriptions.push(a.commands.registerCommand("bookmark.removeBookmark",(s,i)=>{o.remove(s,i),A(r,t,o)})),t.subscriptions.push(a.commands.registerCommand("bookmark.removeBookmarks",()=>{o.clear(),A(r,t,o)})),t.subscriptions.push(a.commands.registerCommand("bookmark.refreshTree",()=>{A(r,t,o)})),t.subscriptions.push(a.workspace.onDidOpenTextDocument(s=>le(s,t,o))),t.subscriptions.push(a.window.onDidChangeActiveTextEditor(s=>ue(s,o,t))),t.subscriptions.push(a.workspace.onDidChangeTextDocument(s=>pe(s,o,t)))}function me(){x.dispose()}function ue(t,e,o){if(t?.document.fileName===void 0)return;T.clear();let r=async()=>{if(!t)return;let n=t.document.uri.fsPath;await N(n,e,t.document,o,t)};T.call(r,1e3)}function le(t,e,o){T.clear();let r=async()=>{let n=a.window.activeTextEditor;if(!n)return;let s=n.document.uri.fsPath;await N(s,o,n.document,e,n)};T.call(r,1e3)}async function N(t,e,o,r,n){if(!e.has(t))return;let s=e.get(t);if(s){for(let[i,c]of s){if(!c.content)continue;let d=i;if(i>o.lineCount&&(d=Math.floor(o.lineCount/2)),o.lineAt(d).text.trim()!==c.content){let l=0,w=!1;for(;!w;){l++;let f=[];if(d+l<o.lineCount&&f.push(l+d),d-l>=0&&f.push(d-l),f.length===0){w=!0;break}for(let v of f)if(!(v<0||v>o.lineCount)&&o.lineAt(v).text.trim()===c.content){await a.commands.executeCommand("bookmark.removeBookmark",t,i),await a.commands.executeCommand("bookmark.addBookmark",t,v),w=!0;break}}}}ae(r,e,n)}}var T=new M;function pe(t,e,o){let r=a.window.activeTextEditor;if(!r)return;let n=async()=>{let s=t.document.uri.fsPath;await N(s,e,t.document,o,r)};T.call(n,1e3)}0&&(module.exports={activate,deactivate});
