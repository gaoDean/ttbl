import{c as t,_ as e,a as i,b as n}from"./tslib.es6-9bc0804d.js";import{i as o}from"./tauri-3d655ecc.js";import{b as r,c as a,d as u,T as s}from"./event-86d4e8b3.js";var d,c=function(t,e){this.type="Logical",this.width=t,this.height=e},l=function(){function t(t,e){this.type="Physical",this.width=t,this.height=e}return t.prototype.toLogical=function(t){return new c(this.width/t,this.height/t)},t}(),h=function(t,e){this.type="Logical",this.x=t,this.y=e},p=function(){function t(t,e){this.type="Physical",this.x=t,this.y=e}return t.prototype.toLogical=function(t){return new h(this.x/t,this.y/t)},t}();function f(){return new w(window.__TAURI_METADATA__.__currentWindow.label,{skip:!0})}function m(){return window.__TAURI_METADATA__.__windows.map((function(t){return new w(t.label,{skip:!0})}))}!function(t){t[t.Critical=1]="Critical",t[t.Informational=2]="Informational"}(d||(d={}));var y,v=["tauri://created","tauri://error"],_=function(){function t(t){this.label=t,this.listeners=Object.create(null)}return t.prototype.listen=function(t,n){return e(this,void 0,void 0,(function(){var e=this;return i(this,(function(i){return this._handleTauriEvent(t,n)?[2,Promise.resolve((function(){var i=e.listeners[t];i.splice(i.indexOf(n),1)}))]:[2,r(t,this.label,n)]}))}))},t.prototype.once=function(t,n){return e(this,void 0,void 0,(function(){var e=this;return i(this,(function(i){return this._handleTauriEvent(t,n)?[2,Promise.resolve((function(){var i=e.listeners[t];i.splice(i.indexOf(n),1)}))]:[2,a(t,this.label,n)]}))}))},t.prototype.emit=function(t,n){return e(this,void 0,void 0,(function(){var e,o;return i(this,(function(i){if(v.includes(t)){for(e=0,o=this.listeners[t]||[];e<o.length;e++)(0,o[e])({event:t,id:-1,windowLabel:this.label,payload:n});return[2,Promise.resolve()]}return[2,u(t,this.label,n)]}))}))},t.prototype._handleTauriEvent=function(t,e){return!!v.includes(t)&&(t in this.listeners?this.listeners[t].push(e):this.listeners[t]=[e],!0)},t}(),g=function(r){function a(){return null!==r&&r.apply(this,arguments)||this}return t(a,r),a.prototype.scaleFactor=function(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"scaleFactor"}}}})]}))}))},a.prototype.innerPosition=function(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"innerPosition"}}}}).then((function(t){var e=t.x,i=t.y;return new p(e,i)}))]}))}))},a.prototype.outerPosition=function(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"outerPosition"}}}}).then((function(t){var e=t.x,i=t.y;return new p(e,i)}))]}))}))},a.prototype.innerSize=function(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"innerSize"}}}}).then((function(t){var e=t.width,i=t.height;return new l(e,i)}))]}))}))},a.prototype.outerSize=function(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"outerSize"}}}}).then((function(t){var e=t.width,i=t.height;return new l(e,i)}))]}))}))},a.prototype.isFullscreen=function(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"isFullscreen"}}}})]}))}))},a.prototype.isMaximized=function(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"isMaximized"}}}})]}))}))},a.prototype.isDecorated=function(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"isDecorated"}}}})]}))}))},a.prototype.isResizable=function(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"isResizable"}}}})]}))}))},a.prototype.isVisible=function(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"isVisible"}}}})]}))}))},a.prototype.theme=function(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"theme"}}}})]}))}))},a.prototype.center=function(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"center"}}}})]}))}))},a.prototype.requestUserAttention=function(t){return e(this,void 0,void 0,(function(){var e;return i(this,(function(i){return e=null,t&&(e=t===d.Critical?{type:"Critical"}:{type:"Informational"}),[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"requestUserAttention",payload:e}}}})]}))}))},a.prototype.setResizable=function(t){return e(this,void 0,void 0,(function(){return i(this,(function(e){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setResizable",payload:t}}}})]}))}))},a.prototype.setTitle=function(t){return e(this,void 0,void 0,(function(){return i(this,(function(e){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setTitle",payload:t}}}})]}))}))},a.prototype.maximize=function(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"maximize"}}}})]}))}))},a.prototype.unmaximize=function(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"unmaximize"}}}})]}))}))},a.prototype.toggleMaximize=function(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"toggleMaximize"}}}})]}))}))},a.prototype.minimize=function(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"minimize"}}}})]}))}))},a.prototype.unminimize=function(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"unminimize"}}}})]}))}))},a.prototype.show=function(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"show"}}}})]}))}))},a.prototype.hide=function(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"hide"}}}})]}))}))},a.prototype.close=function(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"close"}}}})]}))}))},a.prototype.setDecorations=function(t){return e(this,void 0,void 0,(function(){return i(this,(function(e){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setDecorations",payload:t}}}})]}))}))},a.prototype.setAlwaysOnTop=function(t){return e(this,void 0,void 0,(function(){return i(this,(function(e){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setAlwaysOnTop",payload:t}}}})]}))}))},a.prototype.setSize=function(t){return e(this,void 0,void 0,(function(){return i(this,(function(e){if(!t||"Logical"!==t.type&&"Physical"!==t.type)throw new Error("the `size` argument must be either a LogicalSize or a PhysicalSize instance");return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setSize",payload:{type:t.type,data:{width:t.width,height:t.height}}}}}})]}))}))},a.prototype.setMinSize=function(t){return e(this,void 0,void 0,(function(){return i(this,(function(e){if(t&&"Logical"!==t.type&&"Physical"!==t.type)throw new Error("the `size` argument must be either a LogicalSize or a PhysicalSize instance");return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setMinSize",payload:t?{type:t.type,data:{width:t.width,height:t.height}}:null}}}})]}))}))},a.prototype.setMaxSize=function(t){return e(this,void 0,void 0,(function(){return i(this,(function(e){if(t&&"Logical"!==t.type&&"Physical"!==t.type)throw new Error("the `size` argument must be either a LogicalSize or a PhysicalSize instance");return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setMaxSize",payload:t?{type:t.type,data:{width:t.width,height:t.height}}:null}}}})]}))}))},a.prototype.setPosition=function(t){return e(this,void 0,void 0,(function(){return i(this,(function(e){if(!t||"Logical"!==t.type&&"Physical"!==t.type)throw new Error("the `position` argument must be either a LogicalPosition or a PhysicalPosition instance");return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setPosition",payload:{type:t.type,data:{x:t.x,y:t.y}}}}}})]}))}))},a.prototype.setFullscreen=function(t){return e(this,void 0,void 0,(function(){return i(this,(function(e){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setFullscreen",payload:t}}}})]}))}))},a.prototype.setFocus=function(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setFocus"}}}})]}))}))},a.prototype.setIcon=function(t){return e(this,void 0,void 0,(function(){return i(this,(function(e){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setIcon",payload:{icon:"string"==typeof t?t:Array.from(t)}}}}})]}))}))},a.prototype.setSkipTaskbar=function(t){return e(this,void 0,void 0,(function(){return i(this,(function(e){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setSkipTaskbar",payload:t}}}})]}))}))},a.prototype.setCursorGrab=function(t){return e(this,void 0,void 0,(function(){return i(this,(function(e){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setCursorGrab",payload:t}}}})]}))}))},a.prototype.setCursorVisible=function(t){return e(this,void 0,void 0,(function(){return i(this,(function(e){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setCursorVisible",payload:t}}}})]}))}))},a.prototype.setCursorIcon=function(t){return e(this,void 0,void 0,(function(){return i(this,(function(e){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setCursorIcon",payload:t}}}})]}))}))},a.prototype.setCursorPosition=function(t){return e(this,void 0,void 0,(function(){return i(this,(function(e){if(!t||"Logical"!==t.type&&"Physical"!==t.type)throw new Error("the `position` argument must be either a LogicalPosition or a PhysicalPosition instance");return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"setCursorPosition",payload:{type:t.type,data:{x:t.x,y:t.y}}}}}})]}))}))},a.prototype.startDragging=function(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{label:this.label,cmd:{type:"startDragging"}}}})]}))}))},a.prototype.onResized=function(t){return e(this,void 0,void 0,(function(){return i(this,(function(e){return[2,this.listen(s.WINDOW_RESIZED,t)]}))}))},a.prototype.onMoved=function(t){return e(this,void 0,void 0,(function(){return i(this,(function(e){return[2,this.listen(s.WINDOW_MOVED,t)]}))}))},a.prototype.onCloseRequested=function(t){return e(this,void 0,void 0,(function(){var e=this;return i(this,(function(i){return[2,this.listen(s.WINDOW_CLOSE_REQUESTED,(function(i){var n=new b(i);Promise.resolve(t(n)).then((function(){if(!n.isPreventDefault())return e.close()}))}))]}))}))},a.prototype.onFocusChanged=function(t){return e(this,void 0,void 0,(function(){var e,o;return i(this,(function(i){switch(i.label){case 0:return[4,this.listen(s.WINDOW_FOCUS,(function(e){t(n(n({},e),{payload:!0}))}))];case 1:return e=i.sent(),[4,this.listen(s.WINDOW_BLUR,(function(e){t(n(n({},e),{payload:!1}))}))];case 2:return o=i.sent(),[2,function(){e(),o()}]}}))}))},a.prototype.onScaleChanged=function(t){return e(this,void 0,void 0,(function(){return i(this,(function(e){return[2,this.listen(s.WINDOW_SCALE_FACTOR_CHANGED,t)]}))}))},a.prototype.onMenuClicked=function(t){return e(this,void 0,void 0,(function(){return i(this,(function(e){return[2,this.listen(s.MENU,t)]}))}))},a.prototype.onFileDropEvent=function(t){return e(this,void 0,void 0,(function(){var e,o,r;return i(this,(function(i){switch(i.label){case 0:return[4,this.listen(s.WINDOW_FILE_DROP,(function(e){t(n(n({},e),{payload:{type:"drop",paths:e.payload}}))}))];case 1:return e=i.sent(),[4,this.listen(s.WINDOW_FILE_DROP_HOVER,(function(e){t(n(n({},e),{payload:{type:"hover",paths:e.payload}}))}))];case 2:return o=i.sent(),[4,this.listen(s.WINDOW_FILE_DROP_CANCELLED,(function(e){t(n(n({},e),{payload:{type:"cancel"}}))}))];case 3:return r=i.sent(),[2,function(){e(),o(),r()}]}}))}))},a.prototype.onThemeChanged=function(t){return e(this,void 0,void 0,(function(){return i(this,(function(e){return[2,this.listen(s.WINDOW_THEME_CHANGED,t)]}))}))},a}(_),b=function(){function t(t){this._preventDefault=!1,this.event=t.event,this.windowLabel=t.windowLabel,this.id=t.id}return t.prototype.preventDefault=function(){this._preventDefault=!0},t.prototype.isPreventDefault=function(){return this._preventDefault},t}(),w=function(r){function a(t,a){void 0===a&&(a={});var u=r.call(this,t)||this;return(null==a?void 0:a.skip)||o({__tauriModule:"Window",message:{cmd:"createWebview",data:{options:n({label:t},a)}}}).then((function(){return e(u,void 0,void 0,(function(){return i(this,(function(t){return[2,this.emit("tauri://created")]}))}))})).catch((function(t){return e(u,void 0,void 0,(function(){return i(this,(function(e){return[2,this.emit("tauri://error",t)]}))}))})),u}return t(a,r),a.getByLabel=function(t){return m().some((function(e){return e.label===t}))?new a(t,{skip:!0}):null},a}(g);function W(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{cmd:{type:"currentMonitor"}}}})]}))}))}function M(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{cmd:{type:"primaryMonitor"}}}})]}))}))}function z(){return e(this,void 0,void 0,(function(){return i(this,(function(t){return[2,o({__tauriModule:"Window",message:{cmd:"manage",data:{cmd:{type:"availableMonitors"}}}})]}))}))}"__TAURI_METADATA__"in window?y=new w(window.__TAURI_METADATA__.__currentWindow.label,{skip:!0}):(console.warn('Could not find "window.__TAURI_METADATA__". The "appWindow" value will reference the "main" window label.\nNote that this is not an issue if running this frontend on a browser instead of a Tauri window.'),y=new w("main",{skip:!0}));var P=Object.freeze({__proto__:null,WebviewWindow:w,WebviewWindowHandle:_,WindowManager:g,CloseRequestedEvent:b,getCurrent:f,getAll:m,get appWindow(){return y},LogicalSize:c,PhysicalSize:l,LogicalPosition:h,PhysicalPosition:p,get UserAttentionType(){return d},currentMonitor:W,primaryMonitor:M,availableMonitors:z});export{b as C,c as L,l as P,d as U,w as W,_ as a,g as b,m as c,y as d,h as e,p as f,f as g,W as h,z as i,M as p,P as w};
