(this["webpackJsonpreact-view-editor-example"]=this["webpackJsonpreact-view-editor-example"]||[]).push([[20],{629:function(e,n,t){"use strict";t.r(n),t.d(n,"default",(function(){return c}));var a=t(655),i=t(98),c=(t(0),t(31),t(208),t(8),t(28),t(90),t(125),t(41),t(209),t(74),t(89),t(210),Object(i.d)(a.a))},655:function(e,n,t){"use strict";var a=t(4),i=t(3),c=t(23),r=t(24),s=t(26),l=t(27),o=t(0),p=t(8),u=t.n(p),d=t(42),m=t(243),f=t.n(m),b=t(120),g=t(57),v=t(40),y=function(e,n){var t={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&n.indexOf(a)<0&&(t[a]=e[a]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var i=0;for(a=Object.getOwnPropertySymbols(e);i<a.length;i++)n.indexOf(a[i])<0&&Object.prototype.propertyIsEnumerable.call(e,a[i])&&(t[a[i]]=e[a[i]])}return t},O=(Object(g.a)("small","default","large"),null);var j=function(e){Object(s.a)(t,e);var n=Object(l.a)(t);function t(e){var r;Object(c.a)(this,t),(r=n.call(this,e)).debouncifyUpdateSpinning=function(e){var n=(e||r.props).delay;n&&(r.cancelExistingSpin(),r.updateSpinning=f()(r.originalUpdateSpinning,n))},r.updateSpinning=function(){var e=r.props.spinning;r.state.spinning!==e&&r.setState({spinning:e})},r.renderSpin=function(e){var n,t=e.getPrefixCls,c=e.direction,s=r.props,l=s.prefixCls,p=s.className,m=s.size,f=s.tip,b=s.wrapperClassName,g=s.style,j=y(s,["prefixCls","className","size","tip","wrapperClassName","style"]),N=r.state.spinning,S=t("spin",l),h=u()(S,(n={},Object(i.a)(n,"".concat(S,"-sm"),"small"===m),Object(i.a)(n,"".concat(S,"-lg"),"large"===m),Object(i.a)(n,"".concat(S,"-spinning"),N),Object(i.a)(n,"".concat(S,"-show-text"),!!f),Object(i.a)(n,"".concat(S,"-rtl"),"rtl"===c),n),p),E=Object(d.a)(j,["spinning","delay","indicator"]),x=o.createElement("div",Object(a.a)({},E,{style:g,className:h}),function(e,n){var t=n.indicator,a="".concat(e,"-dot");return null===t?null:Object(v.b)(t)?Object(v.a)(t,{className:u()(t.props.className,a)}):Object(v.b)(O)?Object(v.a)(O,{className:u()(O.props.className,a)}):o.createElement("span",{className:u()(a,"".concat(e,"-dot-spin"))},o.createElement("i",{className:"".concat(e,"-dot-item")}),o.createElement("i",{className:"".concat(e,"-dot-item")}),o.createElement("i",{className:"".concat(e,"-dot-item")}),o.createElement("i",{className:"".concat(e,"-dot-item")}))}(S,r.props),f?o.createElement("div",{className:"".concat(S,"-text")},f):null);if(r.isNestedPattern()){var k=u()("".concat(S,"-container"),Object(i.a)({},"".concat(S,"-blur"),N));return o.createElement("div",Object(a.a)({},E,{className:u()("".concat(S,"-nested-loading"),b)}),N&&o.createElement("div",{key:"loading"},x),o.createElement("div",{className:k,key:"container"},r.props.children))}return x};var s=e.spinning,l=function(e,n){return!!e&&!!n&&!isNaN(Number(n))}(s,e.delay);return r.state={spinning:s&&!l},r.originalUpdateSpinning=r.updateSpinning,r.debouncifyUpdateSpinning(e),r}return Object(r.a)(t,[{key:"componentDidMount",value:function(){this.updateSpinning()}},{key:"componentDidUpdate",value:function(){this.debouncifyUpdateSpinning(),this.updateSpinning()}},{key:"componentWillUnmount",value:function(){this.cancelExistingSpin()}},{key:"cancelExistingSpin",value:function(){var e=this.updateSpinning;e&&e.cancel&&e.cancel()}},{key:"isNestedPattern",value:function(){return!(!this.props||"undefined"===typeof this.props.children)}},{key:"render",value:function(){return o.createElement(b.a,null,this.renderSpin)}}],[{key:"setDefaultIndicator",value:function(e){O=e}}]),t}(o.Component);j.defaultProps={spinning:!0,size:"default",wrapperClassName:""},n.a=j}}]);
//# sourceMappingURL=20.3e5f5da9.chunk.js.map