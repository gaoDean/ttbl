import{_ as t,a as i}from"./tslib.es6-9bc0804d.js";import{i as o}from"./tauri-3d655ecc.js";function e(e){return void 0===e&&(e={}),t(this,void 0,void 0,(function(){return i(this,(function(t){return"object"==typeof e&&Object.freeze(e),[2,o({__tauriModule:"Dialog",message:{cmd:"openDialog",options:e}})]}))}))}function n(e){return void 0===e&&(e={}),t(this,void 0,void 0,(function(){return i(this,(function(t){return"object"==typeof e&&Object.freeze(e),[2,o({__tauriModule:"Dialog",message:{cmd:"saveDialog",options:e}})]}))}))}function r(e,n){var r;return t(this,void 0,void 0,(function(){var t;return i(this,(function(i){return t="string"==typeof n?{title:n}:n,[2,o({__tauriModule:"Dialog",message:{cmd:"messageDialog",message:e.toString(),title:null===(r=null==t?void 0:t.title)||void 0===r?void 0:r.toString(),type:null==t?void 0:t.type}})]}))}))}function s(e,n){var r;return t(this,void 0,void 0,(function(){var t;return i(this,(function(i){return t="string"==typeof n?{title:n}:n,[2,o({__tauriModule:"Dialog",message:{cmd:"askDialog",message:e.toString(),title:null===(r=null==t?void 0:t.title)||void 0===r?void 0:r.toString(),type:null==t?void 0:t.type}})]}))}))}function u(e,n){var r;return t(this,void 0,void 0,(function(){var t;return i(this,(function(i){return t="string"==typeof n?{title:n}:n,[2,o({__tauriModule:"Dialog",message:{cmd:"confirmDialog",message:e.toString(),title:null===(r=null==t?void 0:t.title)||void 0===r?void 0:r.toString(),type:null==t?void 0:t.type}})]}))}))}var a=Object.freeze({__proto__:null,open:e,save:n,message:r,ask:s,confirm:u});export{s as a,u as c,a as d,r as m,e as o,n as s};
