(this["webpackJsonpreact-view-editor-example"]=this["webpackJsonpreact-view-editor-example"]||[]).push([[32],{636:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return H}));var a=n(4),o=n(3),c=n(9),r=n(0),s=n(68),i=n(170),l=n(133),u=n(171),m=n(172),p=n(168),f=n(242),b=n(314),d=n(59),v=n(46),O=n(8),y=n.n(O),j=n(120),E=n(288),h=n(23),N=n(24),g=n(26),w=n(27),x=function(e){Object(g.a)(n,e);var t=Object(w.a)(n);function n(){var e;return Object(h.a)(this,n),(e=t.apply(this,arguments)).state={error:void 0,info:{componentStack:""}},e}return Object(N.a)(n,[{key:"componentDidCatch",value:function(e,t){this.setState({error:e,info:t})}},{key:"render",value:function(){var e=this.props,t=e.message,n=e.description,a=e.children,o=this.state,c=o.error,s=o.info,i=s&&s.componentStack?s.componentStack:null,l="undefined"===typeof t?(c||"").toString():t,u="undefined"===typeof n?i:n;return c?r.createElement(I,{type:"error",message:l,description:r.createElement("pre",null,u)}):a}}]),n}(r.Component),C=n(40),k=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var o=0;for(a=Object.getOwnPropertySymbols(e);o<a.length;o++)t.indexOf(a[o])<0&&Object.prototype.propertyIsEnumerable.call(e,a[o])&&(n[a[o]]=e[a[o]])}return n},S={success:p.a,info:b.a,error:d.a,warning:f.a},M={success:i.a,info:u.a,error:m.a,warning:l.a},L=function(e){var t,n=e.description,i=e.prefixCls,l=e.message,u=e.banner,m=e.className,p=void 0===m?"":m,f=e.style,b=e.onMouseEnter,d=e.onMouseLeave,O=e.onClick,h=e.afterClose,N=e.showIcon,g=e.closable,w=e.closeText,x=e.action,L=k(e,["description","prefixCls","message","banner","className","style","onMouseEnter","onMouseLeave","onClick","afterClose","showIcon","closable","closeText","action"]),I=r.useState(!1),P=Object(c.a)(I,2),H=P[0],J=P[1],T=r.useRef(),A=r.useContext(j.b),B=A.getPrefixCls,D=A.direction,R=B("alert",i),q=function(e){var t;J(!0),null===(t=L.onClose)||void 0===t||t.call(L,e)},z=!!w||g,F=function(){var e=L.type;return void 0!==e?e:u?"warning":"info"}(),G=!(!u||void 0!==N)||N,K=y()(R,"".concat(R,"-").concat(F),(t={},Object(o.a)(t,"".concat(R,"-with-description"),!!n),Object(o.a)(t,"".concat(R,"-no-icon"),!G),Object(o.a)(t,"".concat(R,"-banner"),!!u),Object(o.a)(t,"".concat(R,"-rtl"),"rtl"===D),t),p),Q=Object(E.a)(L);return r.createElement(v.b,{visible:!H,motionName:"".concat(R,"-motion"),motionAppear:!1,motionEnter:!1,onLeaveStart:function(e){return{maxHeight:e.offsetHeight}},onLeaveEnd:h},(function(e){var t=e.className,c=e.style;return r.createElement("div",Object(a.a)({ref:T,"data-show":!H,className:y()(K,t),style:Object(a.a)(Object(a.a)({},f),c),onMouseEnter:b,onMouseLeave:d,onClick:O,role:"alert"},Q),G?function(){var e=L.icon,t=(n?M:S)[F]||null;return e?Object(C.c)(e,r.createElement("span",{className:"".concat(R,"-icon")},e),(function(){return{className:y()("".concat(R,"-icon"),Object(o.a)({},e.props.className,e.props.className))}})):r.createElement(t,{className:"".concat(R,"-icon")})}():null,r.createElement("div",{className:"".concat(R,"-content")},r.createElement("div",{className:"".concat(R,"-message")},l),r.createElement("div",{className:"".concat(R,"-description")},n)),x?r.createElement("div",{className:"".concat(R,"-action")},x):null,z?r.createElement("button",{type:"button",onClick:q,className:"".concat(R,"-close-icon"),tabIndex:0},w?r.createElement("span",{className:"".concat(R,"-close-text")},w):r.createElement(s.a,null)):null)}))};L.ErrorBoundary=x;var I=L,P=n(98),H=(n(31),n(208),n(28),n(90),n(125),n(41),n(209),n(74),n(89),n(210),Object(P.d)(I))}}]);
//# sourceMappingURL=32.ac48d0e7.chunk.js.map