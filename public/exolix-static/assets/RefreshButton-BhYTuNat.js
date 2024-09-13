import{cJ as He,b_ as Ge,aK as l,b5 as Ve,ae as z,cK as qe,aC as G,aB as I,aD as D,aE as T,aF as ne,aM as Q,aH as je,aI as Fe,aG as Oe,bg as De,bP as X,aJ as ce,aN as U,aU as Ze,cL as Ke,bL as Xe,bJ as oe,br as Ae,bT as Je,cM as Ye,cN as Qe}from"./main-D0zeExby.js";import{u as K,F as B,s as et,f as tt,a as Be,g as ge,b as it}from"./mixins-D6aRU5Fq.js";import{s as w,V as N,A as x,b as A,u as k,a as de,a3 as rt,P as Ne,S as W,W as nt,a5 as ot,a6 as me,a7 as st}from"./App-Bu7sLToa.js";import{c as at}from"./coinsSlice-CtUIGugP.js";import{e as lt,f as ct,C as xe,a as ve,g as dt}from"./StepsIndicator-DqQRjhr9.js";import{d as ht,h as pt}from"./exchangeSelectors-DMf0CYvt.js";import{a as ut,d as ft}from"./exchangeSelectors-BRRuocQp.js";import{t as gt}from"./trustpilot-Cb5RukDw.js";const _e=w.div`
  ${N}
  font-weight: 500;
  line-height: 150%;
  color: ${({theme:e})=>e.colors.grey300};
  a {
    color: ${({theme:e})=>e.colors.white};
    text-decoration: none;
    transition: 0.3s linear;
    &:hover {
      text-decoration: underline;
      color: ${({theme:e})=>e.colors.primary};
    }
  }
  ${({template:e})=>e==="dexSignWallet"?x`
          ${A}
          a {
            color: ${({theme:t})=>t.colors.primary};
          }
        `:null}
`,Li=({template:e})=>{const t=k(He),i=k(Ge),n=K(),a=h=>{n(Ve.agreeLinkClicked(h))},v=()=>{switch(e){case"dexConnectWallet":return"dex.agree.connectWallet";case"dexSignWallet":return"dex.agree.signWallet";default:return"exchange.agree"}},g=()=>{switch(e){case"dexConnectWallet":return"I agree with <terms>Terms of Use</terms> and <privacy>Privacy Policy</privacy>";case"dexSignWallet":return"By using Exolix I agree with <terms>Terms of Use</terms> and <privacy>Privacy Policy</privacy>";default:return"By clicking Exchange you agree with <terms>Terms of Use</terms> and <privacy>Privacy Policy</privacy>"}};return l.jsxs(l.Fragment,{children:[l.jsx(_e,{template:e,children:l.jsx(B,{id:v(),values:{terms:h=>l.jsx("a",{onClick:a.bind(null,`${i}/terms`),target:"_blank",rel:"noopener noreferrer",href:`${i}/terms`,children:h}),privacy:h=>l.jsx("a",{onClick:a.bind(null,`${i}/privacy`),target:"_blank",rel:"noopener noreferrer",href:`${i}/privacy`,children:h})},defaultMessage:g()})}),!!t&&l.jsx(_e,{children:l.jsx(B,{id:"exchange.support",values:{support:h=>l.jsx("a",{onClick:a.bind(null,`${i}/contact`),target:"_blank",rel:"noopener noreferrer",href:`${i}/contact`,children:h})},defaultMessage:"Need help? Contact <support>support</support>."})})]})};let M;typeof window<"u"?M=window:typeof self<"u"?M=self:M=global;let se=null,ae=null;const ye=20,ee=M.clearTimeout,we=M.setTimeout,te=M.cancelAnimationFrame||M.mozCancelAnimationFrame||M.webkitCancelAnimationFrame,be=M.requestAnimationFrame||M.mozRequestAnimationFrame||M.webkitRequestAnimationFrame;te==null||be==null?(se=ee,ae=function(t){return we(t,ye)}):(se=function([t,i]){te(t),ee(i)},ae=function(t){const i=be(function(){ee(n),t()}),n=we(function(){te(i),t()},ye);return[i,n]});function mt(e){let t,i,n,a,v,g,h;const u=typeof document<"u"&&document.attachEvent;if(!u){g=function(s){const d=s.__resizeTriggers__,m=d.firstElementChild,C=d.lastElementChild,y=m.firstElementChild;C.scrollLeft=C.scrollWidth,C.scrollTop=C.scrollHeight,y.style.width=m.offsetWidth+1+"px",y.style.height=m.offsetHeight+1+"px",m.scrollLeft=m.scrollWidth,m.scrollTop=m.scrollHeight},v=function(s){return s.offsetWidth!==s.__resizeLast__.width||s.offsetHeight!==s.__resizeLast__.height},h=function(s){if(s.target.className&&typeof s.target.className.indexOf=="function"&&s.target.className.indexOf("contract-trigger")<0&&s.target.className.indexOf("expand-trigger")<0)return;const d=this;g(this),this.__resizeRAF__&&se(this.__resizeRAF__),this.__resizeRAF__=ae(function(){v(d)&&(d.__resizeLast__.width=d.offsetWidth,d.__resizeLast__.height=d.offsetHeight,d.__resizeListeners__.forEach(function(y){y.call(d,s)}))})};let o=!1,p="";n="animationstart";const f="Webkit Moz O ms".split(" ");let r="webkitAnimationStart animationstart oAnimationStart MSAnimationStart".split(" "),c="";{const s=document.createElement("fakeelement");if(s.style.animationName!==void 0&&(o=!0),o===!1){for(let d=0;d<f.length;d++)if(s.style[f[d]+"AnimationName"]!==void 0){c=f[d],p="-"+c.toLowerCase()+"-",n=r[d],o=!0;break}}}i="resizeanim",t="@"+p+"keyframes "+i+" { from { opacity: 0; } to { opacity: 0; } } ",a=p+"animation: 1ms "+i+"; "}const _=function(o){if(!o.getElementById("detectElementResize")){const p=(t||"")+".resize-triggers { "+(a||"")+'visibility: hidden; opacity: 0; } .resize-triggers, .resize-triggers > div, .contract-trigger:before { content: " "; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; z-index: -1; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }',f=o.head||o.getElementsByTagName("head")[0],r=o.createElement("style");r.id="detectElementResize",r.type="text/css",e!=null&&r.setAttribute("nonce",e),r.styleSheet?r.styleSheet.cssText=p:r.appendChild(o.createTextNode(p)),f.appendChild(r)}};return{addResizeListener:function(o,p){if(u)o.attachEvent("onresize",p);else{if(!o.__resizeTriggers__){const f=o.ownerDocument,r=M.getComputedStyle(o);r&&r.position==="static"&&(o.style.position="relative"),_(f),o.__resizeLast__={},o.__resizeListeners__=[],(o.__resizeTriggers__=f.createElement("div")).className="resize-triggers";const c=f.createElement("div");c.className="expand-trigger",c.appendChild(f.createElement("div"));const s=f.createElement("div");s.className="contract-trigger",o.__resizeTriggers__.appendChild(c),o.__resizeTriggers__.appendChild(s),o.appendChild(o.__resizeTriggers__),g(o),o.addEventListener("scroll",h,!0),n&&(o.__resizeTriggers__.__animationListener__=function(m){m.animationName===i&&g(o)},o.__resizeTriggers__.addEventListener(n,o.__resizeTriggers__.__animationListener__))}o.__resizeListeners__.push(p)}},removeResizeListener:function(o,p){if(u)o.detachEvent("onresize",p);else if(o.__resizeListeners__.splice(o.__resizeListeners__.indexOf(p),1),!o.__resizeListeners__.length){o.removeEventListener("scroll",h,!0),o.__resizeTriggers__.__animationListener__&&(o.__resizeTriggers__.removeEventListener(n,o.__resizeTriggers__.__animationListener__),o.__resizeTriggers__.__animationListener__=null);try{o.__resizeTriggers__=!o.removeChild(o.__resizeTriggers__)}catch{}}}}}class xt extends z.Component{constructor(...t){super(...t),this.state={height:this.props.defaultHeight||0,scaledHeight:this.props.defaultHeight||0,scaledWidth:this.props.defaultWidth||0,width:this.props.defaultWidth||0},this._autoSizer=null,this._detectElementResize=null,this._parentNode=null,this._resizeObserver=null,this._timeoutId=null,this._onResize=()=>{this._timeoutId=null;const{disableHeight:i,disableWidth:n,onResize:a}=this.props;if(this._parentNode){const v=window.getComputedStyle(this._parentNode)||{},g=parseFloat(v.paddingLeft||"0"),h=parseFloat(v.paddingRight||"0"),u=parseFloat(v.paddingTop||"0"),_=parseFloat(v.paddingBottom||"0"),b=this._parentNode.getBoundingClientRect(),S=b.height-u-_,o=b.width-g-h,p=this._parentNode.offsetHeight-u-_,f=this._parentNode.offsetWidth-g-h;(!i&&(this.state.height!==p||this.state.scaledHeight!==S)||!n&&(this.state.width!==f||this.state.scaledWidth!==o))&&(this.setState({height:p,width:f,scaledHeight:S,scaledWidth:o}),typeof a=="function"&&a({height:p,scaledHeight:S,scaledWidth:o,width:f}))}},this._setRef=i=>{this._autoSizer=i}}componentDidMount(){const{nonce:t}=this.props,i=this._autoSizer?this._autoSizer.parentNode:null;if(i!=null&&i.ownerDocument&&i.ownerDocument.defaultView&&i instanceof i.ownerDocument.defaultView.HTMLElement){this._parentNode=i;const n=i.ownerDocument.defaultView.ResizeObserver;n!=null?(this._resizeObserver=new n(()=>{this._timeoutId=setTimeout(this._onResize,0)}),this._resizeObserver.observe(i)):(this._detectElementResize=mt(t),this._detectElementResize.addResizeListener(i,this._onResize)),this._onResize()}}componentWillUnmount(){this._parentNode&&(this._detectElementResize&&this._detectElementResize.removeResizeListener(this._parentNode,this._onResize),this._timeoutId!==null&&clearTimeout(this._timeoutId),this._resizeObserver&&this._resizeObserver.disconnect())}render(){const{children:t,defaultHeight:i,defaultWidth:n,disableHeight:a=!1,disableWidth:v=!1,nonce:g,onResize:h,style:u={},tagName:_="div",...b}=this.props,{height:S,scaledHeight:o,scaledWidth:p,width:f}=this.state,r={overflow:"visible"},c={};let s=!1;return a||(S===0&&(s=!0),r.height=0,c.height=S,c.scaledHeight=o),v||(f===0&&(s=!0),r.width=0,c.width=f,c.scaledWidth=p),z.createElement(_,{ref:this._setRef,style:{...r,...u},...b},!s&&t(c))}}function Se(e){if(e===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function le(e,t){return le=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(n,a){return n.__proto__=a,n},le(e,t)}function vt(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,le(e,t)}var Ie=Number.isNaN||function(t){return typeof t=="number"&&t!==t};function _t(e,t){return!!(e===t||Ie(e)&&Ie(t))}function yt(e,t){if(e.length!==t.length)return!1;for(var i=0;i<e.length;i++)if(!_t(e[i],t[i]))return!1;return!0}function ie(e,t){t===void 0&&(t=yt);var i,n=[],a,v=!1;function g(){for(var h=[],u=0;u<arguments.length;u++)h[u]=arguments[u];return v&&i===this&&t(h,n)||(a=e.apply(this,h),v=!0,i=this,n=h),a}return g}var wt=typeof performance=="object"&&typeof performance.now=="function",Ce=wt?function(){return performance.now()}:function(){return Date.now()};function $e(e){cancelAnimationFrame(e.id)}function bt(e,t){var i=Ce();function n(){Ce()-i>=t?e.call(null):a.id=requestAnimationFrame(n)}var a={id:requestAnimationFrame(n)};return a}var re=-1;function ke(e){if(e===void 0&&(e=!1),re===-1||e){var t=document.createElement("div"),i=t.style;i.width="50px",i.height="50px",i.overflow="scroll",document.body.appendChild(t),re=t.offsetWidth-t.clientWidth,document.body.removeChild(t)}return re}var H=null;function Re(e){if(e===void 0&&(e=!1),H===null||e){var t=document.createElement("div"),i=t.style;i.width="50px",i.height="50px",i.overflow="scroll",i.direction="rtl";var n=document.createElement("div"),a=n.style;return a.width="100px",a.height="100px",t.appendChild(n),document.body.appendChild(t),t.scrollLeft>0?H="positive-descending":(t.scrollLeft=1,t.scrollLeft===0?H="negative":H="positive-ascending"),document.body.removeChild(t),H}return H}var St=150,It=function(t,i){return t};function Ct(e){var t,i=e.getItemOffset,n=e.getEstimatedTotalSize,a=e.getItemSize,v=e.getOffsetForIndexAndAlignment,g=e.getStartIndexForOffset,h=e.getStopIndexForStartIndex,u=e.initInstanceProps,_=e.shouldResetStyleCacheOnItemSizeChange,b=e.validateProps;return t=function(S){vt(o,S);function o(f){var r;return r=S.call(this,f)||this,r._instanceProps=u(r.props,Se(r)),r._outerRef=void 0,r._resetIsScrollingTimeoutId=null,r.state={instance:Se(r),isScrolling:!1,scrollDirection:"forward",scrollOffset:typeof r.props.initialScrollOffset=="number"?r.props.initialScrollOffset:0,scrollUpdateWasRequested:!1},r._callOnItemsRendered=void 0,r._callOnItemsRendered=ie(function(c,s,d,m){return r.props.onItemsRendered({overscanStartIndex:c,overscanStopIndex:s,visibleStartIndex:d,visibleStopIndex:m})}),r._callOnScroll=void 0,r._callOnScroll=ie(function(c,s,d){return r.props.onScroll({scrollDirection:c,scrollOffset:s,scrollUpdateWasRequested:d})}),r._getItemStyle=void 0,r._getItemStyle=function(c){var s=r.props,d=s.direction,m=s.itemSize,C=s.layout,y=r._getItemStyleCache(_&&m,_&&C,_&&d),$;if(y.hasOwnProperty(c))$=y[c];else{var R=i(r.props,c,r._instanceProps),j=a(r.props,c,r._instanceProps),E=d==="horizontal"||C==="horizontal",P=d==="rtl",L=E?R:0;y[c]=$={position:"absolute",left:P?void 0:L,right:P?L:void 0,top:E?0:R,height:E?"100%":j,width:E?j:"100%"}}return $},r._getItemStyleCache=void 0,r._getItemStyleCache=ie(function(c,s,d){return{}}),r._onScrollHorizontal=function(c){var s=c.currentTarget,d=s.clientWidth,m=s.scrollLeft,C=s.scrollWidth;r.setState(function(y){if(y.scrollOffset===m)return null;var $=r.props.direction,R=m;if($==="rtl")switch(Re()){case"negative":R=-m;break;case"positive-descending":R=C-d-m;break}return R=Math.max(0,Math.min(R,C-d)),{isScrolling:!0,scrollDirection:y.scrollOffset<R?"forward":"backward",scrollOffset:R,scrollUpdateWasRequested:!1}},r._resetIsScrollingDebounced)},r._onScrollVertical=function(c){var s=c.currentTarget,d=s.clientHeight,m=s.scrollHeight,C=s.scrollTop;r.setState(function(y){if(y.scrollOffset===C)return null;var $=Math.max(0,Math.min(C,m-d));return{isScrolling:!0,scrollDirection:y.scrollOffset<$?"forward":"backward",scrollOffset:$,scrollUpdateWasRequested:!1}},r._resetIsScrollingDebounced)},r._outerRefSetter=function(c){var s=r.props.outerRef;r._outerRef=c,typeof s=="function"?s(c):s!=null&&typeof s=="object"&&s.hasOwnProperty("current")&&(s.current=c)},r._resetIsScrollingDebounced=function(){r._resetIsScrollingTimeoutId!==null&&$e(r._resetIsScrollingTimeoutId),r._resetIsScrollingTimeoutId=bt(r._resetIsScrolling,St)},r._resetIsScrolling=function(){r._resetIsScrollingTimeoutId=null,r.setState({isScrolling:!1},function(){r._getItemStyleCache(-1,null)})},r}o.getDerivedStateFromProps=function(r,c){return $t(r,c),b(r),null};var p=o.prototype;return p.scrollTo=function(r){r=Math.max(0,r),this.setState(function(c){return c.scrollOffset===r?null:{scrollDirection:c.scrollOffset<r?"forward":"backward",scrollOffset:r,scrollUpdateWasRequested:!0}},this._resetIsScrollingDebounced)},p.scrollToItem=function(r,c){c===void 0&&(c="auto");var s=this.props,d=s.itemCount,m=s.layout,C=this.state.scrollOffset;r=Math.max(0,Math.min(r,d-1));var y=0;if(this._outerRef){var $=this._outerRef;m==="vertical"?y=$.scrollWidth>$.clientWidth?ke():0:y=$.scrollHeight>$.clientHeight?ke():0}this.scrollTo(v(this.props,r,c,C,this._instanceProps,y))},p.componentDidMount=function(){var r=this.props,c=r.direction,s=r.initialScrollOffset,d=r.layout;if(typeof s=="number"&&this._outerRef!=null){var m=this._outerRef;c==="horizontal"||d==="horizontal"?m.scrollLeft=s:m.scrollTop=s}this._callPropsCallbacks()},p.componentDidUpdate=function(){var r=this.props,c=r.direction,s=r.layout,d=this.state,m=d.scrollOffset,C=d.scrollUpdateWasRequested;if(C&&this._outerRef!=null){var y=this._outerRef;if(c==="horizontal"||s==="horizontal")if(c==="rtl")switch(Re()){case"negative":y.scrollLeft=-m;break;case"positive-ascending":y.scrollLeft=m;break;default:var $=y.clientWidth,R=y.scrollWidth;y.scrollLeft=R-$-m;break}else y.scrollLeft=m;else y.scrollTop=m}this._callPropsCallbacks()},p.componentWillUnmount=function(){this._resetIsScrollingTimeoutId!==null&&$e(this._resetIsScrollingTimeoutId)},p.render=function(){var r=this.props,c=r.children,s=r.className,d=r.direction,m=r.height,C=r.innerRef,y=r.innerElementType,$=r.innerTagName,R=r.itemCount,j=r.itemData,E=r.itemKey,P=E===void 0?It:E,L=r.layout,F=r.outerElementType,O=r.outerTagName,V=r.style,q=r.useIsScrolling,J=r.width,he=this.state.isScrolling,Y=d==="horizontal"||L==="horizontal",We=Y?this._onScrollHorizontal:this._onScrollVertical,pe=this._getRangeToRender(),Ue=pe[0],Pe=pe[1],ue=[];if(R>0)for(var Z=Ue;Z<=Pe;Z++)ue.push(z.createElement(c,{data:j,key:P(Z,j),index:Z,isScrolling:q?he:void 0,style:this._getItemStyle(Z)}));var fe=n(this.props,this._instanceProps);return z.createElement(F||O||"div",{className:s,onScroll:We,ref:this._outerRefSetter,style:qe({position:"relative",height:m,width:J,overflow:"auto",WebkitOverflowScrolling:"touch",willChange:"transform",direction:d},V)},z.createElement(y||$||"div",{children:ue,ref:C,style:{height:Y?"100%":fe,pointerEvents:he?"none":void 0,width:Y?fe:"100%"}}))},p._callPropsCallbacks=function(){if(typeof this.props.onItemsRendered=="function"){var r=this.props.itemCount;if(r>0){var c=this._getRangeToRender(),s=c[0],d=c[1],m=c[2],C=c[3];this._callOnItemsRendered(s,d,m,C)}}if(typeof this.props.onScroll=="function"){var y=this.state,$=y.scrollDirection,R=y.scrollOffset,j=y.scrollUpdateWasRequested;this._callOnScroll($,R,j)}},p._getRangeToRender=function(){var r=this.props,c=r.itemCount,s=r.overscanCount,d=this.state,m=d.isScrolling,C=d.scrollDirection,y=d.scrollOffset;if(c===0)return[0,0,0,0];var $=g(this.props,y,this._instanceProps),R=h(this.props,$,y,this._instanceProps),j=!m||C==="backward"?Math.max(1,s):1,E=!m||C==="forward"?Math.max(1,s):1;return[Math.max(0,$-j),Math.max(0,Math.min(c-1,R+E)),$,R]},o}(z.PureComponent),t.defaultProps={direction:"ltr",itemData:void 0,layout:"vertical",overscanCount:2,useIsScrolling:!1},t}var $t=function(t,i){t.children,t.direction,t.height,t.layout,t.innerTagName,t.outerTagName,t.width,i.instance},ze=Ct({getItemOffset:function(t,i){var n=t.itemSize;return i*n},getItemSize:function(t,i){var n=t.itemSize;return n},getEstimatedTotalSize:function(t){var i=t.itemCount,n=t.itemSize;return n*i},getOffsetForIndexAndAlignment:function(t,i,n,a,v,g){var h=t.direction,u=t.height,_=t.itemCount,b=t.itemSize,S=t.layout,o=t.width,p=h==="horizontal"||S==="horizontal",f=p?o:u,r=Math.max(0,_*b-f),c=Math.min(r,i*b),s=Math.max(0,i*b-f+b+g);switch(n==="smart"&&(a>=s-f&&a<=c+f?n="auto":n="center"),n){case"start":return c;case"end":return s;case"center":{var d=Math.round(s+(c-s)/2);return d<Math.ceil(f/2)?0:d>r+Math.floor(f/2)?r:d}case"auto":default:return a>=s&&a<=c?a:a<s?s:c}},getStartIndexForOffset:function(t,i){var n=t.itemCount,a=t.itemSize;return Math.max(0,Math.min(n-1,Math.floor(i/a)))},getStopIndexForStartIndex:function(t,i,n){var a=t.direction,v=t.height,g=t.itemCount,h=t.itemSize,u=t.layout,_=t.width,b=a==="horizontal"||u==="horizontal",S=i*h,o=b?_:v,p=Math.ceil((o+n-S)/h);return Math.max(0,Math.min(g-1,i+p-1))},initInstanceProps:function(t){},shouldResetStyleCacheOnItemSizeChange:!0,validateProps:function(t){t.itemSize}});function kt(e){var t=e.lastRenderedStartIndex,i=e.lastRenderedStopIndex,n=e.startIndex,a=e.stopIndex;return!(n>i||a<t)}function Rt(e){for(var t=e.isItemLoaded,i=e.itemCount,n=e.minimumBatchSize,a=e.startIndex,v=e.stopIndex,g=[],h=null,u=null,_=a;_<=v;_++){var b=t(_);b?u!==null&&(g.push(h,u),h=u=null):(u=_,h===null&&(h=_))}if(u!==null){for(var S=Math.min(Math.max(u,h+n-1),i-1),o=u+1;o<=S&&!t(o);o++)u=o;g.push(h,u)}if(g.length)for(;g[1]-g[0]+1<n&&g[0]>0;){var p=g[0]-1;if(!t(p))g[0]=p;else break}return g}var zt=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},Lt=function(){function e(t,i){for(var n=0;n<i.length;n++){var a=i[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}(),Mt=function(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},Le=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t&&(typeof t=="object"||typeof t=="function")?t:e},Tt=function(e){Mt(t,e);function t(){var i,n,a,v;zt(this,t);for(var g=arguments.length,h=Array(g),u=0;u<g;u++)h[u]=arguments[u];return v=(n=(a=Le(this,(i=t.__proto__||Object.getPrototypeOf(t)).call.apply(i,[this].concat(h))),a),a._lastRenderedStartIndex=-1,a._lastRenderedStopIndex=-1,a._memoizedUnloadedRanges=[],a._onItemsRendered=function(_){var b=_.visibleStartIndex,S=_.visibleStopIndex;a._lastRenderedStartIndex=b,a._lastRenderedStopIndex=S,a._ensureRowsLoaded(b,S)},a._setRef=function(_){a._listRef=_},n),Le(a,v)}return Lt(t,[{key:"resetloadMoreItemsCache",value:function(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:!1;this._memoizedUnloadedRanges=[],n&&this._ensureRowsLoaded(this._lastRenderedStartIndex,this._lastRenderedStopIndex)}},{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var n=this.props.children;return n({onItemsRendered:this._onItemsRendered,ref:this._setRef})}},{key:"_ensureRowsLoaded",value:function(n,a){var v=this.props,g=v.isItemLoaded,h=v.itemCount,u=v.minimumBatchSize,_=u===void 0?10:u,b=v.threshold,S=b===void 0?15:b,o=Rt({isItemLoaded:g,itemCount:h,minimumBatchSize:_,startIndex:Math.max(0,n-S),stopIndex:Math.min(h-1,a+S)});(this._memoizedUnloadedRanges.length!==o.length||this._memoizedUnloadedRanges.some(function(p,f){return o[f]!==p}))&&(this._memoizedUnloadedRanges=o,this._loadUnloadedRanges(o))}},{key:"_loadUnloadedRanges",value:function(n){for(var a=this,v=this.props.loadMoreItems||this.props.loadMoreRows,g=function(_){var b=n[_],S=n[_+1],o=v(b,S);o!=null&&o.then(function(){if(kt({lastRenderedStartIndex:a._lastRenderedStartIndex,lastRenderedStopIndex:a._lastRenderedStopIndex,startIndex:b,stopIndex:S})){if(a._listRef==null)return;typeof a._listRef.resetAfterIndex=="function"?a._listRef.resetAfterIndex(b,!0):(typeof a._listRef._getItemStyleCache=="function"&&a._listRef._getItemStyleCache(-1),a._listRef.forceUpdate())}})},h=0;h<n.length;h+=2)g(h)}}]),t}(z.PureComponent);const Et="/exolix-static/assets/not-found-Ch0fSy3M.svg",jt=w.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  & > div > div {
    ${({disableScroll:e})=>e?x`
            touch-action: pan-up;
          `:null}
  }
  & > div > div ul {
    margin-bottom: 560px;
    ${({disableScroll:e})=>e?x`
            touch-action: pan-up;
          `:null}
  }
  ${({entrypoint:e})=>e==G.MAIN&&x`
      & > div > div {
        ${et}
      }
      @media (${I.SM}) {
        padding-bottom: 0;
        border-radius: 0 0 8px 8px;
        border-bottom: 1px solid ${({theme:t})=>t.colors.grey900};
        & > div {
          ${tt}
        }
        & > div > div ul {
          margin-bottom: 0;
        }
      }
    `}
  ${({entrypoint:e})=>(D(e)||T(e))&&x`
      & > div > div {
        ${lt}
      }
    `}
`,Ft=w.div`
  position: fixed;
  left: 0;
  right: 4px;
  bottom: 0;
  opacity: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({isVisible:e})=>e?x`
          opacity: 1;
        `:null}
  ${({entrypoint:e})=>e==G.MAIN&&x`
      height: 100px;
      background-color: ${({theme:t})=>t.bgColors.dark400};
      @media (${I.SM}) {
        position: absolute;
        height: 62px;
      }
    `}
  ${({entrypoint:e})=>D(e)&&x`
      height: 45px;
      background-color: ${({theme:t})=>t.colors.white};
    `}

    ${({entrypoint:e})=>T(e)&&x`
      height: 46px;
    `}
`,Ot=w.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8rem;
  span {
    ${A}
    font-weight: 500;
    margin-top: 0.8rem;
  }
  @media (${I.SM}) {
    width: 100%;
    height: 58px;
    flex-direction: row;
    font-weight: 500;
    padding: 0 1.6rem;
    margin-top: 0;
    background-color: ${({theme:e})=>e.bgColors.dark200};
    span {
      margin-top: 0;
    }
  }
  ${({entrypoint:e})=>D(e)&&x`
      span {
        color: ${({theme:t})=>t.bgColors.dark100};
      }
    `}

  ${({entrypoint:e})=>T(e)&&x`
      span {
        ${de}
        color: ${({theme:t})=>t.colors.black};
      }
    `}
`,Dt=w.li`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-height: 58px;
`,At=w.div`
  transition: 0.3s linear;
  ${({entrypoint:e,activeItem:t})=>e==G.MAIN&&x`
      padding: 0 1.6rem;
      &:hover {
        cursor: pointer;
        background-color: ${({theme:i})=>i.bgColors.dark200};
      }
      @media (${I.MD}) {
        padding: 0 0.8rem;
      }
      @media (${I.LG}) {
        padding: 0 1.6rem;
      }
      ${t?x`
            background-color: ${({theme:i})=>i.colors.secondaryDark};
          `:null}
    `}
  ${({entrypoint:e,activeItem:t})=>D(e)&&x`
      padding: 0 0.8rem;
      margin: 0 1.4rem;
      border-radius: 8px;
      &:hover {
        cursor: pointer;
        background-color: ${({theme:i})=>i.colors.grey100};
      }
      ${t?x`
            background-color: ${({theme:i})=>i.colors.grey100};
            svg {
              path {
                stroke: ${({theme:i})=>i.colors.primary};
              }
            }
          `:null}
    `}

    ${({entrypoint:e,theme:t,activeItem:i})=>T(e)&&x`
      margin: 0 20px;
      border-bottom: 1px solid ${ne(t.colors.black,.12)};
      position: relative;

      &::after {
        content: '';
        position: absolute;
        width: calc(100% + 16px);
        height: calc(100% - 1px);
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
        background: ${ne(t.colors.black,.04)};
        opacity: 0;
        border-radius: 8px;
        z-index: -1;
      }

      &:hover {
        cursor: pointer;
        &::after {
          transition: 300ms linear;
          opacity: 1;
        }
      }

      ${i&&x`
        &::after {
          opacity: 1;
        }
      `}

      @media (${Q.M}) {
        margin: 0 24px;
      }
      @media (${Q.L}) {
        margin: 0 32px;
      }
      @media (${Q.XL}) {
        margin: 0 20px;
      }
    `}
`,Bt=w.div`
  display: grid;
  grid-template-columns: minmax(150px, 1fr) minmax(100px, 155px);
  justify-content: space-between;
  gap: 2rem;
  ${({entrypoint:e})=>e==G.MAIN&&x`
      height: 58px;
      border-top: 1px solid ${({theme:t})=>t.colors.grey900};
      @media (${I.SM}) {
        grid-template-columns: minmax(150px, 1fr) minmax(100px, 180px);
      }
    `}
  ${({entrypoint:e})=>D(e)&&x`
      height: 45px;
      padding: 0 0.8rem;
      border-top: 1px solid ${({theme:t})=>t.colors.grey100};
    `}

    ${({entrypoint:e})=>T(e)&&x`
      height: 46px;
    `}
`,Nt=w.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;

  ${({entrypoint:e})=>T(e)&&x`
      gap: 12px;
    `}
`,Wt=w.div`
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  ${({entrypoint:e})=>e==G.MAIN&&x`
      flex-direction: column;
      @media (${I.SM}) {
        flex-direction: row;
        gap: 0.8rem;
      }
      @media (${I.MD}) {
        flex-direction: column;
        gap: 0;
      }
      @media (${I.LG}) {
        flex-direction: row;
        gap: 0.8rem;
      }
    `}
  ${({entrypoint:e})=>D(e)&&x`
      gap: 1.2rem;
      color: ${({theme:t})=>t.colors.grey400};
    `}

    ${({entrypoint:e})=>T(e)&&x`
      gap: 12px;
    `}
`,Me=w.div`
  ${A}
  font-weight: 500;
  line-height: 120%;
  @media (${I.SM}) {
    ${A}
  }
  @media (${I.MD}) {
    ${N}
  }
  @media (${I.LG}) {
    ${A}
  }
  ${({entrypoint:e})=>D(e)&&x`
      color: ${({theme:t})=>t.colors.black};
      @media (${I.SM}) {
        color: ${({theme:t})=>t.colors.black};
      }
      @media (${I.MD}) {
        color: ${({theme:t})=>t.colors.black};
      }
      @media (${I.LG}) {
        color: ${({theme:t})=>t.colors.black};
      }
    `}

  ${({entrypoint:e,theme:t})=>T(e)&&x`
      ${de}
      font-weight: 500;
      color: ${t.colors.black} !important;
    `}
`,Ut=w.div`
  ${A}
  line-height: 120%;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({theme:e})=>e.colors.grey300};
  @media (${I.SM}) {
    ${A}
  }
  @media (${I.MD}) {
    ${N}
  }
  @media (${I.LG}) {
    ${A}
  }
  ${({entrypoint:e})=>D(e)&&x`
      color: ${({theme:t})=>t.colors.grey400};
      @media (${I.SM}) {
        color: ${({theme:t})=>t.colors.grey400};
      }
      @media (${I.MD}) {
        color: ${({theme:t})=>t.colors.grey400};
      }
      @media (${I.LG}) {
        color: ${({theme:t})=>t.colors.grey400};
      }
    `}

  ${({entrypoint:e,theme:t})=>T(e)&&x`
      ${de}
      color: ${t.colors.grey500} !important;
    `}
`,Pt=w.div`
  display: flex;
  align-items: center;
  gap: 2.1rem;

  ${({entrypoint:e})=>T(e)&&x`
      gap: 16px;
    `}
`,Ht=w.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  white-space: nowrap;
  overflow: hidden;
`,Gt=w.div`
  ${N}
  font-weight: 500;
  line-height: 120%;
  ${({entrypoint:e})=>D(e)&&x`
      ${ct}
    `}

  ${({entrypoint:e,theme:t})=>T(e)&&x`
      padding: 2px 12px;
      background: ${ne(t.colors.black,.08)};
      border-radius: 100px;
      color: ${t.colors.black};
      ${rt}
      font-weight: 500;
    `}
`,Vt=w.div`
  ${Ne}
  line-height: 150%;
  color: ${({theme:e})=>e.colors.secondary};
`;w.div`
  ${N}
  font-weight: 500;
  line-height: 140%;
`;w.div`
  ${Ne}
  font-weight: 500;
  line-height: 140%;
  color: ${({theme:e})=>e.colors.grey300};
`;const qt=w.div`
  opacity: 0;
  ${({activeItem:e})=>e?x`
          opacity: 1;
        `:null}
`,Te=({style:e,item:t,service:i,selectType:n,handleListItem:a})=>{const v=k(je),g=k(Fe),h=k(Oe),u=k(De),_=k(X),b=k(m=>ht(m,n)),S=k(m=>ut(m,n)),o=k(ce),p=i===U.CEX,f=i===U.DEX,r=p&&"network"in t?t.network:"",c=f&&"symbol"in t?t.symbol:"",s=f&&"id"in t?t.id:"";let d=!1;return p?d=!!(b&&b.code==t.code&&r&&b.network.network==r.network):f&&(d=!!(S&&S.id==s)),l.jsx(Dt,{id:"coinListItem","data-coin-list-item":JSON.stringify(t),style:e,children:l.jsx(At,{entrypoint:o,activeItem:d,onMouseDown:a,children:l.jsxs(Bt,{activeItem:d,entrypoint:o,$isRtl:_,children:[l.jsxs(Nt,{entrypoint:o,children:[h?l.jsx(xe,{icon:t.icon,width:34,height:34,borderRadius:f?50:6}):null,u?l.jsx(xe,{icon:t.icon,width:20,height:20}):null,l.jsxs(Wt,{entrypoint:o,children:[c?l.jsx(Me,{entrypoint:o,children:c}):null,p?l.jsx(Me,{entrypoint:o,children:t.code}):null,l.jsx(Ut,{entrypoint:o,children:t.name})]})]}),l.jsxs(Pt,{entrypoint:o,children:[l.jsx(Ht,{children:r?l.jsxs(l.Fragment,{children:[l.jsx(Gt,{entrypoint:o,children:r.network}),h?l.jsx(Vt,{children:t.name}):null]}):null}),l.jsxs(qt,{activeItem:d,children:[h?l.jsx(W,{src:ve,width:18,height:18,title:"Checkmark"}):null,v?l.jsx(W,{src:ve,width:14,height:14,title:"Checkmark"}):null,g?l.jsx(W,{src:dt,width:16,height:16,title:"Checkmark"}):null]})]})]})})})},Mi=({service:e,selectType:t,data:i,items:n,selectOpen:a,onSelectClose:v,handleListItem:g})=>{const h=k(Oe),u=k(je),_=k(Fe),b=k(De),S=k(ce),o=k(X),p=z.useRef(null),[f,r]=z.useState(!1),{isMobile:c}=Be(),s=K(),d="count"in i?i.count:0,m="page"in i?i.page:1;z.useEffect(()=>{Ze()&&p.current&&a&&(Ke.observe(p.current),c&&Xe(s,t,c))},[s,a,c,t]),z.useEffect(()=>{const L=F=>{F.key==="Escape"&&v()};return document.addEventListener("keydown",L),()=>{document.removeEventListener("keydown",L)}},[s,t,v]);const C=L=>L<i.coins.length,y=()=>{if(e===U.CEX){const F=Math.ceil(d/25);i.coins.length<d&&m<F&&!i.fetching&&s(at.fetchCoins({selectType:t,params:{page:m+1}}))}},$=L=>{const{onItemsRendered:F,visibleStartIndex:O}=L;F(L),c&&O>=n.length-3?r(!0):r(!1)},R=()=>h?58:u?45:_?46:58,E=R()*6,P=Math.min(n.length*R(),E);return l.jsxs(jt,{ref:p,disableScroll:f,entrypoint:S,children:[l.jsx(Tt,{threshold:5,itemCount:n.length,loadMoreItems:y,isItemLoaded:C,children:({onItemsRendered:L,ref:F})=>l.jsx(l.Fragment,{children:c||b?l.jsx(xt,{ref:F,children:({height:O,width:V})=>l.jsx(ze,{width:V,height:O,itemSize:R(),innerElementType:"ul",itemCount:n.length,direction:o?"rtl":"ltr",onItemsRendered:q=>$({...q,onItemsRendered:L}),children:({index:q,style:J})=>l.jsx(Te,{handleListItem:g,style:J,service:e,item:n[q],selectType:t})})}):l.jsx(ze,{ref:F,width:"100%",height:P,itemSize:R(),innerElementType:"ul",itemCount:n.length,direction:o?"rtl":"ltr",onItemsRendered:O=>$({...O,onItemsRendered:L}),children:({index:O,style:V})=>l.jsx(Te,{handleListItem:g,style:V,service:e,item:n[O],selectType:t})})})}),i.coins.length?null:l.jsxs(Ot,{entrypoint:S,children:[h&&c?l.jsx(W,{src:Et,title:"Not found"}):null,l.jsx("span",{children:l.jsx(B,{id:"exchange.coinNotFound",defaultMessage:"Coin not found..."})})]}),l.jsxs(Ft,{entrypoint:S,isVisible:i.fetching,children:[h?l.jsx(ge,{width:50,height:50}):null,b?l.jsx(ge,{width:20,height:20}):null]})]})},Zt=nt`
    100% {
        transform: translateX(100%);
    }
`,Kt=w.div`
  width: 100%;
  height: 20px;
  display: inline-block;
  overflow: hidden;
  ${({width:e})=>e&&x`
      width: ${e};
    `}
  ${({height:e})=>e&&x`
      height: ${e};
    `}
  ${({entrypoint:e})=>e==G.MAIN&&x`
      border-radius: 4px;
      background-color: ${({theme:t})=>t.colors.grey801};
    `}
  ${({entrypoint:e})=>D(e)&&x`
      border-radius: 8px;
      background-color: ${({theme:t})=>t.colors.grey300};
    `}

    ${({entrypoint:e,theme:t})=>T(e)&&x`
      border-radius: 8px;
      background-color: ${t.colors.primary50};
    `}
`,Xt=w.div`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  transform: translateX(-100px);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: ${Zt} 1.5s infinite;
`,Ti=({width:e,height:t})=>{const i=k(ce);return l.jsx(Kt,{entrypoint:i,width:e||"",height:t||"",children:l.jsx(Xt,{})})},Ei="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='18'%20height='18'%20viewBox='0%200%2018%2018'%20fill='none'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M8%2013.5C11.3137%2013.5%2014%2010.8137%2014%207.5C14%204.18629%2011.3137%201.5%208%201.5C4.68629%201.5%202%204.18629%202%207.5C2%2010.8137%204.68629%2013.5%208%2013.5Z'%20stroke='%23ABB6C1'%20stroke-opacity='0.8'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M17%2016.5L12.5%2012'%20stroke='%23ABB6C1'%20stroke-opacity='0.8'%20stroke-width='1.5'%20stroke-linejoin='round'/%3e%3c/svg%3e",Jt=w.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`,Yt=w(ot)`
  ${A}
  width: 50%;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  font-weight: 600;
  border-radius: 6px 6px 0 0;
  text-decoration: none;
  transition: 0.3s linear;
  color: ${({theme:e})=>e.colors.grey200};
  background: rgba(29, 34, 39, 1);
  &.active {
    color: ${({theme:e})=>e.colors.white};
    background: ${({$activeColor:e})=>e==="gray-gradient"?"linear-gradient(90deg, #25292e, #21252a)":e==="gray-light-gradient"?"linear-gradient(90deg, #292e33, #25292e)":"rgba(34, 39, 44, 1)"};
  }
  @media (${I.SM}) {
    &:before {
      --padding: 6.4rem;
      --width-page: 100vw;
      --width: calc(var(--width-page) - var(--padding));
      content: '';
      position: absolute;
      top: 0;
      width: var(--width);
      height: 100%;
      z-index: -1;
      transition: opacity 0.3s;
      opacity: 0;
    }
    width: 172px;
    ${({$activeColor:e})=>{if(e==="gray-gradient")return x`
          &:before {
            background: linear-gradient(
              80.26deg,
              rgb(42, 47, 52) -9.48%,
              rgb(31, 35, 40) 119.79%
            );
            right: 0;
          }
        `;if(e==="gray-light-gradient")return x`
          &:before {
            background: linear-gradient(
              80.26deg,
              rgb(42, 47, 52) -9.48%,
              rgb(31, 35, 40) 119.79%
            );
            right: -172px;
          }
        `}}
    &.active {
      &:before {
        opacity: 1;
      }
      background: transparent;
    }
  }

  @media (${I.MD}) {
    &:before {
      --padding: 8.6rem;
    }
    ${({$activeColor:e})=>{if(e==="gray-gradient")return x`
          &:before {
            background: linear-gradient(
              80.26deg,
              rgb(42, 47, 52) -9.48%,
              rgb(31, 35, 40) 119.79%
            );
            right: 0;
          }
        `;if(e==="gray-light-gradient")return x`
          &:before {
            background: linear-gradient(
              80.26deg,
              rgb(42, 47, 52) -9.48%,
              rgb(31, 35, 40) 119.79%
            );
            right: -172px;
            width: calc(var(--width) / 2);
          }
        `}}
  }
  svg {
    margin-right: 0.8rem;
  }
  ${({$isRtl:e})=>e&&x`
      svg {
        margin-left: 0.8rem;
      }
    `}
`,Ee=({data:e})=>{const t=k(X),i=K(),{content:n,link:a,icon:v,isActive:g,enabled:h,serviceId:u}=e;if(!h)return null;const _=()=>{switch(u){case U.CEX:i(Ae.setResetExchange());break;case U.DEX:i(oe.setResetExchange());break}Je("session","activeServiceId",u)};return l.jsxs(Yt,{onClick:_,$activeColor:e.activeColor,to:a,$isRtl:t,children:[l.jsx(W,{src:g?v.active:v.disabled,width:20,height:16,title:"Tab icon"}),n]})},Qt="data:image/svg+xml,%3csvg%20width='20'%20height='16'%20viewBox='0%200%2020%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M15.3208%206.79749H15.4319V6.9086V9.29808L19.8387%205.1124L15.4319%200.926747V3.05961V3.17072H15.3208H7.22222V6.79749H15.3208Z'%20fill='%23797BF6'%20stroke='url(%23paint0_linear_5230_2179)'%20stroke-width='0.222222'/%3e%3cg%20filter='url(%23filter0_bi_5230_2179)'%3e%3cpath%20d='M4.67924%2015.3359L-3.88545e-07%2010.8915L4.67924%206.44705L4.67924%209.0953L12.8889%209.0953L12.8889%2012.9443L4.67924%2012.9443L4.67924%2015.3359Z'%20fill='%23CFD3FD'%20fill-opacity='0.53'/%3e%3cpath%20d='M4.67924%209.20641L4.56813%209.20641L4.56813%209.0953L4.56813%206.70583L0.161338%2010.8915L4.56813%2015.0772L4.56813%2012.9443L4.56813%2012.8332L4.67924%2012.8332L12.7778%2012.8332L12.7778%209.20641L4.67924%209.20641Z'%20stroke='url(%23paint1_linear_5230_2179)'%20stroke-width='0.222222'/%3e%3c/g%3e%3cdefs%3e%3cfilter%20id='filter0_bi_5230_2179'%20x='-1.69083'%20y='4.75448'%20width='16.2723'%20height='12.6105'%20filterUnits='userSpaceOnUse'%20color-interpolation-filters='sRGB'%3e%3cfeFlood%20flood-opacity='0'%20result='BackgroundImageFix'/%3e%3cfeGaussianBlur%20in='BackgroundImageFix'%20stdDeviation='0.845416'/%3e%3cfeComposite%20in2='SourceAlpha'%20operator='in'%20result='effect1_backgroundBlur_5230_2179'/%3e%3cfeBlend%20mode='normal'%20in='SourceGraphic'%20in2='effect1_backgroundBlur_5230_2179'%20result='shape'/%3e%3cfeColorMatrix%20in='SourceAlpha'%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%20127%200'%20result='hardAlpha'/%3e%3cfeOffset%20dy='2.029'/%3e%3cfeGaussianBlur%20stdDeviation='13.5267'/%3e%3cfeComposite%20in2='hardAlpha'%20operator='arithmetic'%20k2='-1'%20k3='1'/%3e%3cfeColorMatrix%20type='matrix'%20values='0%200%200%200%200.560784%200%200%200%200%200.607843%200%200%200%200%201%200%200%200%200.3%200'/%3e%3cfeBlend%20mode='normal'%20in2='shape'%20result='effect2_innerShadow_5230_2179'/%3e%3c/filter%3e%3clinearGradient%20id='paint0_linear_5230_2179'%20x1='13.0504'%20y1='10.1658'%20x2='11.4147'%20y2='-2.23519'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='white'/%3e%3cstop%20offset='1'%20stop-color='white'%20stop-opacity='0'/%3e%3c/linearGradient%3e%3clinearGradient%20id='paint1_linear_5230_2179'%20x1='6.94964'%20y1='5.83808'%20x2='8.58532'%20y2='18.2391'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='white'/%3e%3cstop%20offset='1'%20stop-color='white'%20stop-opacity='0'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e",ei="data:image/svg+xml,%3csvg%20width='20'%20height='16'%20viewBox='0%200%2020%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M15.3208%206.79627H15.4319V6.90738V9.29686L19.8387%205.11118L15.4319%200.925526V3.05839V3.1695H15.3208H7.22222V6.79627H15.3208Z'%20fill='%23CFD3FD'%20fill-opacity='0.53'%20stroke='url(%23paint0_linear_5296_550)'%20stroke-width='0.222222'/%3e%3cpath%20d='M4.67924%209.20373L4.56813%209.20373L4.56813%209.09262L4.56813%206.70314L0.161338%2010.8888L4.56813%2015.0745L4.56813%2012.9416L4.56813%2012.8305L4.67924%2012.8305L12.7778%2012.8305L12.7778%209.20373L4.67924%209.20373Z'%20fill='%23CFD3FD'%20fill-opacity='0.53'%20stroke='url(%23paint1_linear_5296_550)'%20stroke-width='0.222222'/%3e%3cdefs%3e%3clinearGradient%20id='paint0_linear_5296_550'%20x1='13.0504'%20y1='10.1646'%20x2='11.4147'%20y2='-2.23641'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='white'/%3e%3cstop%20offset='1'%20stop-color='white'%20stop-opacity='0'/%3e%3c/linearGradient%3e%3clinearGradient%20id='paint1_linear_5296_550'%20x1='6.94964'%20y1='5.8354'%20x2='8.58532'%20y2='18.2364'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='white'/%3e%3cstop%20offset='1'%20stop-color='white'%20stop-opacity='0'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e",ti="data:image/svg+xml,%3csvg%20width='19'%20height='16'%20viewBox='0%200%2019%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M13.6001%203.99998C13.6001%206.15377%2011.8528%207.89989%209.69725%207.89989C7.5417%207.89989%205.79441%206.15377%205.79441%203.99998C5.79441%201.84619%207.5417%200.100073%209.69725%200.100073C11.8528%200.100073%2013.6001%201.84619%2013.6001%203.99998Z'%20fill='%23797BF6'%20stroke='url(%23paint0_linear_5217_15998)'%20stroke-width='0.200146'/%3e%3cg%20filter='url(%23filter0_bi_5217_15998)'%3e%3cellipse%20cx='4.8972'%20cy='12'%20rx='4.00292'%20ry='3.99998'%20fill='%23CFD3FD'%20fill-opacity='0.53'/%3e%3cpath%20d='M8.80005%2012C8.80005%2014.1538%207.05275%2015.8999%204.8972%2015.8999C2.74165%2015.8999%200.99436%2014.1538%200.99436%2012C0.99436%209.84619%202.74165%208.10007%204.8972%208.10007C7.05275%208.10007%208.80005%209.84619%208.80005%2012Z'%20stroke='url(%23paint1_linear_5217_15998)'%20stroke-width='0.200146'/%3e%3c/g%3e%3cpath%20d='M18.3999%2012C18.3999%2014.1538%2016.6526%2015.8999%2014.4971%2015.8999C12.3415%2015.8999%2010.5942%2014.1538%2010.5942%2012C10.5942%209.84619%2012.3415%208.10007%2014.4971%208.10007C16.6526%208.10007%2018.3999%209.84619%2018.3999%2012Z'%20fill='%23797BF6'%20stroke='url(%23paint2_linear_5217_15998)'%20stroke-width='0.200146'/%3e%3cdefs%3e%3cfilter%20id='filter0_bi_5217_15998'%20x='-0.796546'%20y='6.30917'%20width='11.3875'%20height='11.7198'%20filterUnits='userSpaceOnUse'%20color-interpolation-filters='sRGB'%3e%3cfeFlood%20flood-opacity='0'%20result='BackgroundImageFix'/%3e%3cfeGaussianBlur%20in='BackgroundImageFix'%20stdDeviation='0.845416'/%3e%3cfeComposite%20in2='SourceAlpha'%20operator='in'%20result='effect1_backgroundBlur_5217_15998'/%3e%3cfeBlend%20mode='normal'%20in='SourceGraphic'%20in2='effect1_backgroundBlur_5217_15998'%20result='shape'/%3e%3cfeColorMatrix%20in='SourceAlpha'%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%20127%200'%20result='hardAlpha'/%3e%3cfeOffset%20dy='2.029'/%3e%3cfeGaussianBlur%20stdDeviation='13.5267'/%3e%3cfeComposite%20in2='hardAlpha'%20operator='arithmetic'%20k2='-1'%20k3='1'/%3e%3cfeColorMatrix%20type='matrix'%20values='0%200%200%200%200.560784%200%200%200%200%200.607843%200%200%200%200%201%200%200%200%200.3%200'/%3e%3cfeBlend%20mode='normal'%20in2='shape'%20result='effect2_innerShadow_5217_15998'/%3e%3c/filter%3e%3clinearGradient%20id='paint0_linear_5217_15998'%20x1='10.011'%20y1='8.54803'%20x2='12.1047'%20y2='-2.40688'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='white'/%3e%3cstop%20offset='1'%20stop-color='white'%20stop-opacity='0'/%3e%3c/linearGradient%3e%3clinearGradient%20id='paint1_linear_5217_15998'%20x1='5.211'%20y1='16.548'%20x2='7.30463'%20y2='5.59312'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='white'/%3e%3cstop%20offset='1'%20stop-color='white'%20stop-opacity='0'/%3e%3c/linearGradient%3e%3clinearGradient%20id='paint2_linear_5217_15998'%20x1='14.8109'%20y1='16.548'%20x2='16.9045'%20y2='5.59312'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='white'/%3e%3cstop%20offset='1'%20stop-color='white'%20stop-opacity='0'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e",ii="data:image/svg+xml,%3csvg%20width='19'%20height='16'%20viewBox='0%200%2019%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M13.6011%203.99998C13.6011%206.15377%2011.8538%207.89989%209.69823%207.89989C7.54268%207.89989%205.79539%206.15377%205.79539%203.99998C5.79539%201.84619%207.54268%200.100073%209.69823%200.100073C11.8538%200.100073%2013.6011%201.84619%2013.6011%203.99998Z'%20fill='%23CFD3FD'%20fill-opacity='0.53'%20stroke='url(%23paint0_linear_5295_8972)'%20stroke-width='0.200146'/%3e%3cpath%20d='M8.80029%2012C8.80029%2014.1538%207.053%2015.8999%204.89745%2015.8999C2.7419%2015.8999%200.994604%2014.1538%200.994604%2012C0.994604%209.84619%202.7419%208.10007%204.89745%208.10007C7.053%208.10007%208.80029%209.84619%208.80029%2012Z'%20fill='%23CFD3FD'%20fill-opacity='0.53'%20stroke='url(%23paint1_linear_5295_8972)'%20stroke-width='0.200146'/%3e%3cpath%20d='M18.4019%2012C18.4019%2014.1538%2016.6546%2015.8999%2014.499%2015.8999C12.3435%2015.8999%2010.5962%2014.1538%2010.5962%2012C10.5962%209.84619%2012.3435%208.10007%2014.499%208.10007C16.6546%208.10007%2018.4019%209.84619%2018.4019%2012Z'%20fill='%23CFD3FD'%20fill-opacity='0.53'%20stroke='url(%23paint2_linear_5295_8972)'%20stroke-width='0.200146'/%3e%3cdefs%3e%3clinearGradient%20id='paint0_linear_5295_8972'%20x1='10.012'%20y1='8.54803'%20x2='12.1057'%20y2='-2.40688'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='white'/%3e%3cstop%20offset='1'%20stop-color='white'%20stop-opacity='0'/%3e%3c/linearGradient%3e%3clinearGradient%20id='paint1_linear_5295_8972'%20x1='5.21124'%20y1='16.548'%20x2='7.30488'%20y2='5.59312'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='white'/%3e%3cstop%20offset='1'%20stop-color='white'%20stop-opacity='0'/%3e%3c/linearGradient%3e%3clinearGradient%20id='paint2_linear_5295_8972'%20x1='14.8128'%20y1='16.548'%20x2='16.9064'%20y2='5.59312'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='white'/%3e%3cstop%20offset='1'%20stop-color='white'%20stop-opacity='0'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e",ri=()=>{const e=it(),t=k(Ye);return l.jsxs(Jt,{children:[l.jsx(Ee,{data:{link:"/cex",isActive:me("/cex")!==null,activeColor:"gray-light-gradient",icon:{active:Qt,disabled:ei},content:e.formatMessage({id:"tabs.title.exchange",defaultMessage:"Exchange"}),enabled:t[0].enabled,serviceId:t[0].id}}),l.jsx(Ee,{data:{link:"/dex",isActive:me("/dex")!==null,activeColor:"gray-gradient",icon:{active:ti,disabled:ii},content:e.formatMessage({id:"tabs.title.dexSwap",defaultMessage:"DEX swap"}),enabled:t[1].enabled,serviceId:t[1].id}})]})},ni="data:image/svg+xml,%3csvg%20width='15'%20height='10'%20viewBox='0%200%2015%2010'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M9.52381%209.9987L4.69183%203.33203L0%209.9987H3.77605H9.52381Z'%20fill='%2364F0BF'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M5.47461%200L10.3066%206.66667L14.9984%200H11.2224H5.47461Z'%20fill='%23F06464'/%3e%3c/svg%3e",oi=w.div`
  width: 47px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid ${({theme:e})=>e.colors.secondary};
  @media (${I.MD}) {
    width: max-content;
    padding: 0 1.6rem;
  }
`,si=w.span`
  display: none;
  @media (${I.MD}) {
    ${N}
    display: inline-block;
    font-weight: 600;
    color: ${({theme:e})=>e.colors.secondary};
    margin: 0 0.8rem 0 0;
    ${({$isRtl:e})=>e?x`
            margin: 0 0 0 0.8rem;
          `:null}
  }
`,ai=()=>{const e=k(X),{isDesktopLg:t}=Be();return l.jsxs(oi,{children:[l.jsx(si,{$isRtl:e,children:t?l.jsx(B,{id:"exchange.bestRoutes.largeText",defaultMessage:"We find the best exchange Web3 routes in one click"}):l.jsx(B,{id:"exchange.bestRoutes",defaultMessage:"The best exchange Web3 routes"})}),l.jsx(W,{src:ni,title:"Logo"})]})},li=e=>{var t,i,n;return(n=(i=(t=e.trustpilot.data)==null?void 0:t.data)==null?void 0:i.attributes)==null?void 0:n.totalReviewsCount},ci=w.a`
  display: flex;
  position: relative;
  z-index: 1;
  &:hover {
    cursor: pointer;
  }
  span {
    ${N}
    font-weight: 600;
    color: ${({theme:e})=>e.colors.white};
    span {
      font-weight: 400;
    }
    & span:first-child {
      display: none;
      @media (${I.MD}) {
        display: inline-block;
      }
    }
  }
  img {
    margin-left: 1rem;
  }
  @media (${I.SM}) {
    margin-top: 0;
  }
`,di=()=>{const e=K(),t=k(li);return z.useEffect(()=>{e(Qe.fetchTrustpilotData())},[e]),t?l.jsxs(ci,{href:"https://www.trustpilot.com/review/exolix.com",target:"_blank",children:[l.jsxs("span",{children:[l.jsxs("span",{children:[l.jsx(B,{id:"trustpilot.seeOur",defaultMessage:"See our"})," "]}),t,l.jsxs("span",{children:[" ",l.jsx(B,{id:"trustpilot.reviewsOn",defaultMessage:"reviews on"})]})]}),l.jsx("img",{src:gt,width:75,height:18,alt:"Ttustpilot logo"})]}):null},hi=w.div`
  @media (${I.MD}) {
    position: relative;
    display: flex;
    flex-direction: column;
  }
`,pi=w.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.6rem;
  @media (${I.SM}) {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: -3.8rem;
  }
  @media (${I.MD}) {
    margin-bottom: -3.2rem;
  }
`,ui=w.div`
  display: flex;
  justify-content: space-between;
`,fi=w.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: ${({theme:e})=>e.colors.grey200};
  margin: 0 1.6rem;
`,ji=()=>{const e=k(pt),t=k(ft);return l.jsx(l.Fragment,{children:e||t?l.jsxs(hi,{children:[l.jsxs(pi,{children:[l.jsx(ai,{}),l.jsx(fi,{}),l.jsx(di,{})]}),l.jsxs(ui,{children:[l.jsx("div",{}),l.jsx(ri,{})]})]}):null})},gi="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='30'%20height='30'%20viewBox='0%200%2030%2030'%20fill='none'%20%3e%3cpath%20fillRule='evenodd'%20clipRule='evenodd'%20d='M15%2020.5C11.9624%2020.5%209.5%2018.0376%209.5%2015C9.5%2011.9624%2011.9624%209.5%2015%209.5C16.646%209.5%2018.1231%2010.2231%2019.1311%2011.3689L17.9268%2012.5732C17.7693%2012.7307%2017.8808%2013%2018.1035%2013H20.1251C20.1251%2013%2020.1251%2013%2020.1251%2013H21.7101C21.7101%2013%2021.7101%2013%2021.7101%2013H21.75C21.8881%2013%2022%2012.8881%2022%2012.75V9.10353C22%208.8808%2021.7307%208.76926%2021.5732%208.92675L20.1935%2010.3065C18.9125%208.89001%2017.0602%208%2015%208C11.134%208%208%2011.134%208%2015C8%2018.866%2011.134%2022%2015%2022C18.613%2022%2021.5867%2019.2627%2021.9604%2015.7488C22.0042%2015.3369%2021.6642%2015%2021.25%2015C20.8358%2015%2020.5054%2015.3376%2020.4496%2015.7481C20.0846%2018.4318%2017.7838%2020.5%2015%2020.5Z'%20fill='%23ffffff'%20/%3e%3c/svg%3e",mi=w.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`,xi=w.span`
  display: none;
  @media (${I.SM}) {
    display: inline-block;
    ${N}
    letter-spacing: 0.04rem;
    color: ${({theme:e})=>e.colors.grey200};
  }
`,vi=w.div`
  position: relative;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`,_i=w.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 0.5px solid #74747e;
`,yi=w.button`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  transition: 0.3s linear;

  ${({disabled:e})=>e?x`
          cursor: initial;
        `:x`
          &:hover {
            background: rgba(57, 64, 73, 1);
          }
        `}
`;w.svg`
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
  transition: all 0.6s ease-in;
`;const wi=w.span`
  line-height: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  & svg {
    transition: all 0.6s ease-in;
    ${({rotationDeg:e})=>e&&x`
        transform: rotate(${e}deg);
      `}
  }
`,Fi=({service:e,disabled:t})=>{const i=e===U.CEX,n=e===U.DEX,v=t?0:i?10:35,[g,h]=z.useState(v),[u,_]=z.useState(0),[b,S]=z.useState(0),o=k(s=>s[e].exchange.resetTimer),p=K();z.useEffect(()=>{t||(i&&o&&p(Ae.resetTimer(!1)),n&&(g===0||o)&&p(oe.resetTimer(!1)))},[p,t,g,o,i,n]),z.useEffect(()=>{o&&!t&&S(s=>s+1)},[t,o]);const f=()=>{t||(_(u+360),setTimeout(()=>{p(oe.resetTimer(!0))},600))},r=s=>{h(s)},c=()=>({shouldRepeat:!0});return l.jsxs(mi,{children:[t?null:l.jsx(xi,{children:l.jsx(B,{id:"btn.refresh.text",values:{count:g},defaultMessage:"Auto refreshes in {count} sec"})}),l.jsxs(vi,{children:[l.jsx(_i,{}),l.jsx(yi,{onClick:f,disabled:t,children:l.jsx(st,{isPlaying:!0,duration:v,colors:"#7B7DFB",trailColor:"#FF00FF05",size:30,strokeWidth:2,strokeLinecap:"square",isGrowing:!1,isSmoothColorTransition:!1,onUpdate:s=>r(s),onComplete:c,children:()=>l.jsx(wi,{rotationDeg:u,children:l.jsx(W,{src:gi,width:30,height:30})})},b)})]})]})};export{Li as A,Mi as E,Ti as F,Fi as R,ji as a,Ei as s};
