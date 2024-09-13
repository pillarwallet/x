import{aB as w,ae as N,aK as t,bI as M,bJ as A,bc as ot,bn as U,bK as ue,aw as dt,bs as X,bL as ct,aU as G,bM as ge,bN as dr,bO as cr,bP as H,aN as en,bQ as lt,bR as ut,bS as lr,bT as ur,bU as gt,bV as gr,bW as mr,bX as hr,bY as _r,bZ as pr,aJ as Q,b_ as fr,b$ as wr,c0 as nn,c1 as Be,bb as yr,bD as xr,c2 as vr,c3 as Cr,c4 as ce,c5 as Ge,bi as br}from"./main-D0zeExby.js";import{F as Z,s as Dr,E as Sr,A as tn,a as Mr,R as jr}from"./RefreshButton-BhYTuNat.js";import{r as Y,g as Ee,i as rn,e as Er,f as Fr,h as $r,j as Ir,k as Tr,l as Ar,D as Br,I as Lr,m as Nr,n as kr,o as Rr,M as Gr,p as Pr,q as Or,U as Ur,t as Hr,v as qr,w as Vr,x as Wr,y as Kr,z as Zr,B as zr,C as Yr,E as Jr,F as Xr,G as Qr,H as ei,J as ni,K as ti,L as ri,N as ii,s as l,A as v,u as m,S as E,O as an,P,Q as sn,R as K,b as q,T as ai,V as mt,W as si,_ as oi,X as di}from"./App-Bu7sLToa.js";import{s as z,a as Fe,b as le,c as ci,d as me,e as li,f as ui,g as gi,h as ht,i as _t,j as on,k as pt,l as ft,m as mi,n as hi}from"./exchangeSelectors-BRRuocQp.js";import{s as _i,a as he,b as dn,c as _e,d as pi,e as cn,f as fi,g as wi,h as An,i as yi,j as xi,k as vi,l as ln,m as Ci,n as bi,o as wt,p as yt,q as xt,r as Di,t as Si,u as Mi,v as ji,D as Bn,w as re,x as Ei,y as Fi,z as $i,A as Ii}from"./dexTransaction-C1hUabgJ.js";import{u as F,a as B,F as C,b as un,C as Ti,s as pe,P as ee,c as Ai,d as Bi,T as Li,L as Ni,o as ki}from"./mixins-D6aRU5Fq.js";import{u as vt,C as ie}from"./trustpilot-Cb5RukDw.js";import{r as Ri}from"./tslib.es6-Dx27Sw3w.js";import{c as $e,a as Gi}from"./tslib.es6-D9yd9Yl3.js";import{c as Ln,a as ze,T as Pi,P as Oi,S as Ui}from"./StepsIndicator-DqQRjhr9.js";import{M as Ie}from"./Modal-BXOQH1UM.js";import{C as Hi}from"./Checkbox-BAXk5913.js";import{d as qi}from"./dropdown-DvVsuBFR.js";import"./coinsSlice-CtUIGugP.js";import"./exchangeSelectors-DMf0CYvt.js";import"./index-dIKOytT1.js";import"./useIsomorphicLayoutEffect-Cm8F7eGf.js";function Ct(e){return Intl.getCanonicalLocales(e)}function Vi(e,n){var r=n.zoneNames,i=n.uppercaseLinks,a=e.toUpperCase(),o=r.reduce(function(d,c){return d[c.toUpperCase()]=c,d},{}),s=i[a]||o[a];return s==="Etc/UTC"||s==="Etc/GMT"?"UTC":s}function gn(e){if(typeof e=="symbol")throw TypeError("Cannot convert a Symbol value to a string");return String(e)}function bt(e){if(e===void 0)return NaN;if(e===null)return 0;if(typeof e=="boolean")return e?1:0;if(typeof e=="number")return e;if(typeof e=="symbol"||typeof e=="bigint")throw new TypeError("Cannot convert symbol/bigint to number");return Number(e)}function Wi(e){var n=bt(e);if(isNaN(n)||J(n,-0))return 0;if(isFinite(n))return n;var r=Math.floor(Math.abs(n));return n<0&&(r=-r),J(r,-0)?0:r}function Ki(e){return isFinite(e)?Math.abs(e)>8.64*1e15?NaN:Wi(e):NaN}function mn(e){if(e==null)throw new TypeError("undefined/null cannot be converted to object");return Object(e)}function J(e,n){return Object.is?Object.is(e,n):e===n?e!==0||1/e===1/n:e!==e&&n!==n}function Dt(e){return new Array(e)}function St(e,n){return Object.prototype.hasOwnProperty.call(e,n)}function Zi(e){if(e===null)return"Null";if(typeof e>"u")return"Undefined";if(typeof e=="function"||typeof e=="object")return"Object";if(typeof e=="number")return"Number";if(typeof e=="boolean")return"Boolean";if(typeof e=="string")return"String";if(typeof e=="symbol")return"Symbol";if(typeof e=="bigint")return"BigInt"}var Mt=864e5;function fe(e,n){return e-Math.floor(e/n)*n}function hn(e){return Math.floor(e/Mt)}function zi(e){return fe(hn(e)+4,7)}function jt(e){return Date.UTC(e,0)/Mt}function Yi(e){return Date.UTC(e,0)}function _n(e){return new Date(e).getUTCFullYear()}function Et(e){return e%4!==0?365:e%100!==0?366:e%400!==0?365:366}function pn(e){return hn(e)-jt(_n(e))}function fn(e){return Et(_n(e))===365?0:1}function Ft(e){var n=pn(e),r=fn(e);if(n>=0&&n<31)return 0;if(n<59+r)return 1;if(n<90+r)return 2;if(n<120+r)return 3;if(n<151+r)return 4;if(n<181+r)return 5;if(n<212+r)return 6;if(n<243+r)return 7;if(n<273+r)return 8;if(n<304+r)return 9;if(n<334+r)return 10;if(n<365+r)return 11;throw new Error("Invalid time")}function Ji(e){var n=pn(e),r=Ft(e),i=fn(e);if(r===0)return n+1;if(r===1)return n-30;if(r===2)return n-58-i;if(r===3)return n-89-i;if(r===4)return n-119-i;if(r===5)return n-150-i;if(r===6)return n-180-i;if(r===7)return n-211-i;if(r===8)return n-242-i;if(r===9)return n-272-i;if(r===10)return n-303-i;if(r===11)return n-333-i;throw new Error("Invalid time")}var Xi=24,$t=60,It=60,wn=1e3,Tt=wn*It,Qi=Tt*$t;function ea(e){return fe(Math.floor(e/Qi),Xi)}function na(e){return fe(Math.floor(e/Tt),$t)}function ta(e){return fe(Math.floor(e/wn),It)}function ra(e){return typeof e=="function"}function ia(e,n,r){if(!ra(e))return!1;if(r!=null&&r.boundTargetFunction){var i=r==null?void 0:r.boundTargetFunction;return n instanceof i}if(typeof n!="object")return!1;var a=e.prototype;if(typeof a!="object")throw new TypeError("OrdinaryHasInstance called on an object with an invalid prototype property.");return Object.prototype.isPrototypeOf.call(a,n)}function aa(e){return fe(e,wn)}function At(e){return typeof e>"u"?Object.create(null):mn(e)}function de(e,n,r,i){if(e===void 0)return i;var a=Number(e);if(isNaN(a)||a<n||a>r)throw new RangeError("".concat(a," is outside of range [").concat(n,", ").concat(r,"]"));return Math.floor(a)}function yn(e,n,r,i,a){var o=e[n];return de(o,r,i,a)}function T(e,n,r,i,a){if(typeof e!="object")throw new TypeError("Options must be an object");var o=e[n];if(o!==void 0){if(r!=="boolean"&&r!=="string")throw new TypeError("invalid type");if(r==="boolean"&&(o=!!o),r==="string"&&(o=gn(o)),i!==void 0&&!i.filter(function(s){return s==o}).length)throw new RangeError("".concat(o," is not within ").concat(i.join(", ")));return o}return a}function sa(e){if(typeof e>"u")return Object.create(null);if(typeof e=="object")return e;throw new TypeError("Options must be an object")}function Bt(e,n,r,i,a,o){var s=e[n];if(s===void 0)return o;if(s===!0)return i;var d=!!s;if(d===!1)return a;if(s=gn(s),s==="true"||s==="false")return o;if((r||[]).indexOf(s)===-1)throw new RangeError("Invalid value ".concat(s));return s}var Lt=["angle-degree","area-acre","area-hectare","concentr-percent","digital-bit","digital-byte","digital-gigabit","digital-gigabyte","digital-kilobit","digital-kilobyte","digital-megabit","digital-megabyte","digital-petabyte","digital-terabit","digital-terabyte","duration-day","duration-hour","duration-millisecond","duration-minute","duration-month","duration-second","duration-week","duration-year","length-centimeter","length-foot","length-inch","length-kilometer","length-meter","length-mile-scandinavian","length-mile","length-millimeter","length-yard","mass-gram","mass-kilogram","mass-ounce","mass-pound","mass-stone","temperature-celsius","temperature-fahrenheit","volume-fluid-ounce","volume-gallon","volume-liter","volume-milliliter"];function Nt(e){return e.slice(e.indexOf("-")+1)}var kt=Lt.map(Nt);function Se(e){return kt.indexOf(e)>-1}function oa(e,n){var r=n.zoneNamesFromData,i=n.uppercaseLinks,a=e.toUpperCase(),o=new Set,s=new Set;return r.map(function(d){return d.toUpperCase()}).forEach(function(d){return o.add(d)}),Object.keys(i).forEach(function(d){s.add(d.toUpperCase()),o.add(i[d].toUpperCase())}),o.has(a)||s.has(a)}function da(e){return e.replace(/([a-z])/g,function(n,r){return r.toUpperCase()})}var ca=/[^A-Z]/;function Rt(e){return e=da(e),!(e.length!==3||ca.test(e))}function la(e){return e.replace(/([A-Z])/g,function(n,r){return r.toLowerCase()})}function Gt(e){if(e=la(e),Se(e))return!0;var n=e.split("-per-");if(n.length!==2)return!1;var r=n[0],i=n[1];return!(!Se(r)||!Se(i))}function ua(e,n,r,i){if(e===n)return n;if(i===void 0)throw new Error("unsignedRoundingMode is mandatory");if(i==="zero")return n;if(i==="infinity")return r;var a=e-n,o=r-e;if(a<o)return n;if(o<a)return r;if(a!==o)throw new Error("Unexpected error");if(i==="half-zero")return n;if(i==="half-infinity")return r;if(i!=="half-even")throw new Error("Unexpected value for unsignedRoundingMode: ".concat(i));var s=n/(r-n)%2;return s===0?n:r}function ga(e){return e}function Ye(e,n,r){var i=r.getInternalSlots,a=i(e),o=a.notation,s=a.dataLocaleData,d=a.numberingSystem;switch(o){case"standard":return 0;case"scientific":return n;case"engineering":return Math.floor(n/3)*3;default:{var c=a.compactDisplay,u=a.style,_=a.currencyDisplay,g=void 0;if(u==="currency"&&_!=="name"){var h=s.numbers.currency[d]||s.numbers.currency[s.numbers.nu[0]];g=h.short}else{var p=s.numbers.decimal[d]||s.numbers.decimal[s.numbers.nu[0]];g=c==="long"?p.long:p.short}if(!g)return 0;var f=String(Math.pow(10,n)),x=Object.keys(g);if(f<x[0])return 0;if(f>x[x.length-1])return x[x.length-1].length-1;var b=x.indexOf(f);if(b===-1)return 0;var y=x[b],S=g[y].other;return S==="0"?0:y.length-g[y].other.match(/0+/)[0].length}}}function Je(e,n,r){var i=r,a,o,s;if(e===0)a=Y("0",i),o=0,s=0;else{var d=e.toString(),c=d.indexOf("e"),u=d.split("e"),_=u[0],g=u[1],h=_.replace(".","");if(c>=0&&h.length<=i)o=+g,a=h+Y("0",i-h.length),s=e;else{o=Ee(e);var p=o-i+1,f=Math.round(y(e,p));y(f,i-1)>=10&&(o=o+1,f=Math.floor(f/10)),a=f.toString(),s=y(f,i-1-o)}}var x;if(o>=i-1?(a=a+Y("0",o-i+1),x=o+1):o>=0?(a="".concat(a.slice(0,o+1),".").concat(a.slice(o+1)),x=o+1):(a="0.".concat(Y("0",-o-1)).concat(a),x=1),a.indexOf(".")>=0&&r>n){for(var b=r-n;b>0&&a[a.length-1]==="0";)a=a.slice(0,-1),b--;a[a.length-1]==="."&&(a=a.slice(0,-1))}return{formattedString:a,roundedNumber:s,integerDigitsCount:x};function y(S,D){return D<0?S*Math.pow(10,-D):S/Math.pow(10,D)}}function Te(e,n,r){var i=r,a=Math.round(e*Math.pow(10,i)),o=a/Math.pow(10,i),s;if(a<1e21)s=a.toString();else{s=a.toString();var d=s.split("e"),c=d[0],u=d[1];s=c.replace(".",""),s=s+Y("0",Math.max(+u-s.length+1,0))}var _;if(i!==0){var g=s.length;if(g<=i){var h=Y("0",i+1-g);s=h+s,g=i+1}var p=s.slice(0,g-i),f=s.slice(g-i);s="".concat(p,".").concat(f),_=p.length}else _=s.length;for(var x=r-n;x>0&&s[s.length-1]==="0";)s=s.slice(0,-1),x--;return s[s.length-1]==="."&&(s=s.slice(0,-1)),{formattedString:s,roundedNumber:o,integerDigitsCount:_}}function xn(e,n){var r=n<0||J(n,-0);r&&(n=-n);var i,a=e.roundingType;switch(a){case"significantDigits":i=Je(n,e.minimumSignificantDigits,e.maximumSignificantDigits);break;case"fractionDigits":i=Te(n,e.minimumFractionDigits,e.maximumFractionDigits);break;default:i=Je(n,1,2),i.integerDigitsCount>1&&(i=Te(n,0,0));break}n=i.roundedNumber;var o=i.formattedString,s=i.integerDigitsCount,d=e.minimumIntegerDigits;if(s<d){var c=Y("0",d-s);o=c+o}return r&&(n=-n),{roundedNumber:n,formattedString:o}}function Pt(e,n,r){var i=r.getInternalSlots;if(n===0)return[0,0];n<0&&(n=-n);var a=Ee(n),o=Ye(e,a,{getInternalSlots:i});n=o<0?n*Math.pow(10,-o):n/Math.pow(10,o);var s=xn(i(e),n);if(s.roundedNumber===0)return[o,a];var d=Ee(s.roundedNumber);return d===a-o?[o,a]:[Ye(e,a+1,{getInternalSlots:i}),a+1]}function Ot(e,n){var r=n.currencyDigitsData;return St(r,e)?r[e]:2}function Ut(e,n,r){var i=r.getInternalSlots,a=i(e),o=a.dataLocaleData.numbers.symbols[a.numberingSystem],s=o.approximatelySign;return n.push({type:"approximatelySign",value:s}),n}var ma={adlm:["𞥐","𞥑","𞥒","𞥓","𞥔","𞥕","𞥖","𞥗","𞥘","𞥙"],ahom:["𑜰","𑜱","𑜲","𑜳","𑜴","𑜵","𑜶","𑜷","𑜸","𑜹"],arab:["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"],arabext:["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"],bali:["᭐","᭑","᭒","᭓","᭔","᭕","᭖","᭗","᭘","᭙"],beng:["০","১","২","৩","৪","৫","৬","৭","৮","৯"],bhks:["𑱐","𑱑","𑱒","𑱓","𑱔","𑱕","𑱖","𑱗","𑱘","𑱙"],brah:["𑁦","𑁧","𑁨","𑁩","𑁪","𑁫","𑁬","𑁭","𑁮","𑁯"],cakm:["𑄶","𑄷","𑄸","𑄹","𑄺","𑄻","𑄼","𑄽","𑄾","𑄿"],cham:["꩐","꩑","꩒","꩓","꩔","꩕","꩖","꩗","꩘","꩙"],deva:["०","१","२","३","४","५","६","७","८","९"],diak:["𑥐","𑥑","𑥒","𑥓","𑥔","𑥕","𑥖","𑥗","𑥘","𑥙"],fullwide:["０","１","２","３","４","５","６","７","８","９"],gong:["𑶠","𑶡","𑶢","𑶣","𑶤","𑶥","𑶦","𑶧","𑶨","𑶩"],gonm:["𑵐","𑵑","𑵒","𑵓","𑵔","𑵕","𑵖","𑵗","𑵘","𑵙"],gujr:["૦","૧","૨","૩","૪","૫","૬","૭","૮","૯"],guru:["੦","੧","੨","੩","੪","੫","੬","੭","੮","੯"],hanidec:["〇","一","二","三","四","五","六","七","八","九"],hmng:["𖭐","𖭑","𖭒","𖭓","𖭔","𖭕","𖭖","𖭗","𖭘","𖭙"],hmnp:["𞅀","𞅁","𞅂","𞅃","𞅄","𞅅","𞅆","𞅇","𞅈","𞅉"],java:["꧐","꧑","꧒","꧓","꧔","꧕","꧖","꧗","꧘","꧙"],kali:["꤀","꤁","꤂","꤃","꤄","꤅","꤆","꤇","꤈","꤉"],khmr:["០","១","២","៣","៤","៥","៦","៧","៨","៩"],knda:["೦","೧","೨","೩","೪","೫","೬","೭","೮","೯"],lana:["᪀","᪁","᪂","᪃","᪄","᪅","᪆","᪇","᪈","᪉"],lanatham:["᪐","᪑","᪒","᪓","᪔","᪕","᪖","᪗","᪘","᪙"],laoo:["໐","໑","໒","໓","໔","໕","໖","໗","໘","໙"],lepc:["᪐","᪑","᪒","᪓","᪔","᪕","᪖","᪗","᪘","᪙"],limb:["᥆","᥇","᥈","᥉","᥊","᥋","᥌","᥍","᥎","᥏"],mathbold:["𝟎","𝟏","𝟐","𝟑","𝟒","𝟓","𝟔","𝟕","𝟖","𝟗"],mathdbl:["𝟘","𝟙","𝟚","𝟛","𝟜","𝟝","𝟞","𝟟","𝟠","𝟡"],mathmono:["𝟶","𝟷","𝟸","𝟹","𝟺","𝟻","𝟼","𝟽","𝟾","𝟿"],mathsanb:["𝟬","𝟭","𝟮","𝟯","𝟰","𝟱","𝟲","𝟳","𝟴","𝟵"],mathsans:["𝟢","𝟣","𝟤","𝟥","𝟦","𝟧","𝟨","𝟩","𝟪","𝟫"],mlym:["൦","൧","൨","൩","൪","൫","൬","൭","൮","൯"],modi:["𑙐","𑙑","𑙒","𑙓","𑙔","𑙕","𑙖","𑙗","𑙘","𑙙"],mong:["᠐","᠑","᠒","᠓","᠔","᠕","᠖","᠗","᠘","᠙"],mroo:["𖩠","𖩡","𖩢","𖩣","𖩤","𖩥","𖩦","𖩧","𖩨","𖩩"],mtei:["꯰","꯱","꯲","꯳","꯴","꯵","꯶","꯷","꯸","꯹"],mymr:["၀","၁","၂","၃","၄","၅","၆","၇","၈","၉"],mymrshan:["႐","႑","႒","႓","႔","႕","႖","႗","႘","႙"],mymrtlng:["꧰","꧱","꧲","꧳","꧴","꧵","꧶","꧷","꧸","꧹"],newa:["𑑐","𑑑","𑑒","𑑓","𑑔","𑑕","𑑖","𑑗","𑑘","𑑙"],nkoo:["߀","߁","߂","߃","߄","߅","߆","߇","߈","߉"],olck:["᱐","᱑","᱒","᱓","᱔","᱕","᱖","᱗","᱘","᱙"],orya:["୦","୧","୨","୩","୪","୫","୬","୭","୮","୯"],osma:["𐒠","𐒡","𐒢","𐒣","𐒤","𐒥","𐒦","𐒧","𐒨","𐒩"],rohg:["𐴰","𐴱","𐴲","𐴳","𐴴","𐴵","𐴶","𐴷","𐴸","𐴹"],saur:["꣐","꣑","꣒","꣓","꣔","꣕","꣖","꣗","꣘","꣙"],segment:["🯰","🯱","🯲","🯳","🯴","🯵","🯶","🯷","🯸","🯹"],shrd:["𑇐","𑇑","𑇒","𑇓","𑇔","𑇕","𑇖","𑇗","𑇘","𑇙"],sind:["𑋰","𑋱","𑋲","𑋳","𑋴","𑋵","𑋶","𑋷","𑋸","𑋹"],sinh:["෦","෧","෨","෩","෪","෫","෬","෭","෮","෯"],sora:["𑃰","𑃱","𑃲","𑃳","𑃴","𑃵","𑃶","𑃷","𑃸","𑃹"],sund:["᮰","᮱","᮲","᮳","᮴","᮵","᮶","᮷","᮸","᮹"],takr:["𑛀","𑛁","𑛂","𑛃","𑛄","𑛅","𑛆","𑛇","𑛈","𑛉"],talu:["᧐","᧑","᧒","᧓","᧔","᧕","᧖","᧗","᧘","᧙"],tamldec:["௦","௧","௨","௩","௪","௫","௬","௭","௮","௯"],telu:["౦","౧","౨","౩","౪","౫","౬","౭","౮","౯"],thai:["๐","๑","๒","๓","๔","๕","๖","๗","๘","๙"],tibt:["༠","༡","༢","༣","༤","༥","༦","༧","༨","༩"],tirh:["𑓐","𑓑","𑓒","𑓓","𑓔","𑓕","𑓖","𑓗","𑓘","𑓙"],vaii:["ᘠ","ᘡ","ᘢ","ᘣ","ᘤ","ᘥ","ᘦ","ᘧ","ᘨ","ᘩ"],wara:["𑣠","𑣡","𑣢","𑣣","𑣤","𑣥","𑣦","𑣧","𑣨","𑣩"],wcho:["𞋰","𞋱","𞋲","𞋳","𞋴","𞋵","𞋶","𞋷","𞋸","𞋹"]},Ht=/[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20BF\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC1\uFDFC\uFDFD\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDE8\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEE0-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF73\uDF80-\uDFD8\uDFE0-\uDFEB]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDD78\uDD7A-\uDDCB\uDDCD-\uDE53\uDE60-\uDE6D\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6\uDF00-\uDF92\uDF94-\uDFCA]/,ha=new RegExp("^".concat(Ht.source)),_a=new RegExp("".concat(Ht.source,"$")),Nn=/[#0](?:[\.,][#0]+)*/g;function qt(e,n,r,i){var a=e.sign,o=e.exponent,s=e.magnitude,d=i.notation,c=i.style,u=i.numberingSystem,_=n.numbers.nu[0],g=null;d==="compact"&&s&&(g=fa(e,r,n,c,i.compactDisplay,i.currencyDisplay,u));var h;if(c==="currency"&&i.currencyDisplay!=="name"){var p=n.currencies[i.currency];if(p)switch(i.currencyDisplay){case"code":h=i.currency;break;case"symbol":h=p.symbol;break;default:h=p.narrow;break}else h=i.currency}var f;if(g)f=g;else if(c==="decimal"||c==="unit"||c==="currency"&&i.currencyDisplay==="name"){var x=n.numbers.decimal[u]||n.numbers.decimal[_];f=Me(x.standard,a)}else if(c==="currency"){var b=n.numbers.currency[u]||n.numbers.currency[_];f=Me(b[i.currencySign],a)}else{var y=n.numbers.percent[u]||n.numbers.percent[_];f=Me(y,a)}var S=Nn.exec(f)[0];if(f=f.replace(Nn,"{0}").replace(/'(.)'/g,"$1"),c==="currency"&&i.currencyDisplay!=="name"){var b=n.numbers.currency[u]||n.numbers.currency[_],D=b.currencySpacing.afterInsertBetween;D&&!_a.test(h)&&(f=f.replace("¤{0}","¤".concat(D,"{0}")));var j=b.currencySpacing.beforeInsertBetween;j&&!ha.test(h)&&(f=f.replace("{0}¤","{0}".concat(j,"¤")))}for(var k=f.split(/({c:[^}]+}|\{0\}|[¤%\-\+])/g),$=[],R=n.numbers.symbols[u]||n.numbers.symbols[_],V=0,we=k;V<we.length;V++){var I=we[V];if(I)switch(I){case"{0}":{$.push.apply($,pa(R,e,d,o,u,!g&&!!i.useGrouping,S));break}case"-":$.push({type:"minusSign",value:R.minusSign});break;case"+":$.push({type:"plusSign",value:R.plusSign});break;case"%":$.push({type:"percentSign",value:R.percentSign});break;case"¤":$.push({type:"currency",value:h});break;default:/^\{c:/.test(I)?$.push({type:"compact",value:I.substring(3,I.length-1)}):$.push({type:"literal",value:I});break}}switch(c){case"currency":if(i.currencyDisplay==="name"){var O=(n.numbers.currency[u]||n.numbers.currency[_]).unitPattern,Le=void 0,Dn=n.currencies[i.currency];Dn?Le=te(r,e.roundedNumber*Math.pow(10,o),Dn.displayName):Le=i.currency;for(var ar=O.split(/(\{[01]\})/g),L=[],Ne=0,Sn=ar;Ne<Sn.length;Ne++){var I=Sn[Ne];switch(I){case"{0}":L.push.apply(L,$);break;case"{1}":L.push({type:"currency",value:Le});break;default:I&&L.push({type:"literal",value:I});break}}return L}else return $;case"unit":{var ke=i.unit,ae=i.unitDisplay,Mn=n.units.simple[ke],O=void 0;if(Mn)O=te(r,e.roundedNumber*Math.pow(10,o),n.units.simple[ke][ae]);else{var jn=ke.split("-per-"),En=jn[0],Fn=jn[1];Mn=n.units.simple[En];var $n=te(r,e.roundedNumber*Math.pow(10,o),n.units.simple[En][ae]),In=n.units.simple[Fn].perUnit[ae];if(In)O=In.replace("{0}",$n);else{var sr=n.units.compound.per[ae],or=te(r,1,n.units.simple[Fn][ae]);O=O=sr.replace("{0}",$n).replace("{1}",or.replace("{0}",""))}}for(var L=[],Re=0,Tn=O.split(/(\s*\{0\}\s*)/);Re<Tn.length;Re++){var I=Tn[Re],se=/^(\s*)\{0\}(\s*)$/.exec(I);se?(se[1]&&L.push({type:"literal",value:se[1]}),L.push.apply(L,$),se[2]&&L.push({type:"literal",value:se[2]})):I&&L.push({type:"unit",value:I})}return L}default:return $}}function pa(e,n,r,i,a,o,s){var d=[],c=n.formattedString,u=n.roundedNumber;if(isNaN(u))return[{type:"nan",value:c}];if(!isFinite(u))return[{type:"infinity",value:c}];var _=ma[a];_&&(c=c.replace(/\d/g,function(R){return _[+R]||R}));var g=c.indexOf("."),h,p;if(g>0?(h=c.slice(0,g),p=c.slice(g+1)):h=c,o&&(r!=="compact"||u>=1e4)){var f=e.group,x=[],b=s.split(".")[0],y=b.split(","),S=3,D=3;y.length>1&&(S=y[y.length-1].length),y.length>2&&(D=y[y.length-2].length);var j=h.length-S;if(j>0){for(x.push(h.slice(j,j+S)),j-=D;j>0;j-=D)x.push(h.slice(j,j+D));x.push(h.slice(0,j+D))}else x.push(h);for(;x.length>0;){var k=x.pop();d.push({type:"integer",value:k}),x.length>0&&d.push({type:"group",value:f})}}else d.push({type:"integer",value:h});if(p!==void 0&&d.push({type:"decimal",value:e.decimal},{type:"fraction",value:p}),(r==="scientific"||r==="engineering")&&isFinite(u)){d.push({type:"exponentSeparator",value:e.exponential}),i<0&&(d.push({type:"exponentMinusSign",value:e.minusSign}),i=-i);var $=Te(i,0,0);d.push({type:"exponentInteger",value:$.formattedString})}return d}function Me(e,n){e.indexOf(";")<0&&(e="".concat(e,";-").concat(e));var r=e.split(";"),i=r[0],a=r[1];switch(n){case 0:return i;case-1:return a;default:return a.indexOf("-")>=0?a.replace(/-/g,"+"):"+".concat(i)}}function fa(e,n,r,i,a,o,s){var d,c=e.roundedNumber,u=e.sign,_=e.magnitude,g=String(Math.pow(10,_)),h=r.numbers.nu[0],p;if(i==="currency"&&o!=="name"){var f=r.numbers.currency,x=f[s]||f[h],b=(d=x.short)===null||d===void 0?void 0:d[g];if(!b)return null;p=te(n,c,b)}else{var f=r.numbers.decimal,y=f[s]||f[h],S=y[a][g];if(!S)return null;p=te(n,c,S)}return p==="0"?null:(p=Me(p,u).replace(/([^\s;\-\+\d¤]+)/g,"{c:$1}").replace(/0+/,"0"),p)}function te(e,n,r){return r[e.select(n)]||r.other}function Ae(e,n,r){var i,a=r.getInternalSlots,o=a(e),s=o.pl,d=o.dataLocaleData,c=o.numberingSystem,u=d.numbers.symbols[c]||d.numbers.symbols[d.numbers.nu[0]],_=0,g=0,h;if(isNaN(n))h=u.nan;else if(n==Number.POSITIVE_INFINITY||n==Number.NEGATIVE_INFINITY)h=u.infinity;else{if(!J(n,-0)){if(!isFinite(n))throw new Error("Input must be a mathematical value");o.style=="percent"&&(n*=100),i=Pt(e,n,{getInternalSlots:a}),g=i[0],_=i[1],n=g<0?n*Math.pow(10,-g):n/Math.pow(10,g)}var p=xn(o,n);h=p.formattedString,n=p.roundedNumber}var f,x=o.signDisplay;switch(x){case"never":f=0;break;case"auto":J(n,0)||n>0||isNaN(n)?f=0:f=-1;break;case"always":J(n,0)||n>0||isNaN(n)?f=1:f=-1;break;default:n===0||isNaN(n)?f=0:n>0?f=1:f=-1}return qt({roundedNumber:n,formattedString:h,exponent:g,magnitude:_,sign:f},o.dataLocaleData,s,o)}function vn(e,n,r,i){var a=i.getInternalSlots;if(isNaN(n)||isNaN(r))throw new RangeError("Input must be a number");var o=[],s=Ae(e,n,{getInternalSlots:a}),d=Ae(e,r,{getInternalSlots:a});if(s===d)return Ut(e,s,{getInternalSlots:a});for(var c=0,u=s;c<u.length;c++){var _=u[c];_.source="startRange"}o=o.concat(s);var g=a(e),h=g.dataLocaleData.numbers.symbols[g.numberingSystem];o.push({type:"literal",value:h.rangeSign,source:"shared"});for(var p=0,f=d;p<f.length;p++){var _=f[p];_.source="endRange"}return o=o.concat(d),o}function wa(e,n,r,i){var a=i.getInternalSlots,o=vn(e,n,r,{getInternalSlots:a});return o.map(function(s){return s.value}).join("")}function ya(e,n,r,i){var a=i.getInternalSlots,o=vn(e,n,r,{getInternalSlots:a});return o.map(function(s,d){return{type:s.type,value:s.value,source:s.source,result:d.toString()}})}function xa(e,n,r){for(var i=Ae(e,n,r),a=Dt(0),o=0,s=i;o<s.length;o++){var d=s[o];a.push({type:d.type,value:d.value})}return a}var va={ceil:"zero",floor:"infinity",expand:"infinity",trunc:"zero",halfCeil:"half-zero",halfFloor:"half-infinity",halfExpand:"half-infinity",halfTrunc:"half-zero",halfEven:"half-even"},Ca={ceil:"infinity",floor:"zero",expand:"infinity",trunc:"zero",halfCeil:"half-infinity",halfFloor:"half-zero",halfExpand:"half-infinity",halfTrunc:"half-zero",halfEven:"half-even"};function ba(e,n){return n?va[e]:Ca[e]}var Pe={supplemental:{languageMatching:{"written-new":[{paradigmLocales:{_locales:"en en_GB es es_419 pt_BR pt_PT"}},{$enUS:{_value:"AS+CA+GU+MH+MP+PH+PR+UM+US+VI"}},{$cnsar:{_value:"HK+MO"}},{$americas:{_value:"019"}},{$maghreb:{_value:"MA+DZ+TN+LY+MR+EH"}},{no:{_desired:"nb",_distance:"1"}},{bs:{_desired:"hr",_distance:"4"}},{bs:{_desired:"sh",_distance:"4"}},{hr:{_desired:"sh",_distance:"4"}},{sr:{_desired:"sh",_distance:"4"}},{aa:{_desired:"ssy",_distance:"4"}},{de:{_desired:"gsw",_distance:"4",_oneway:"true"}},{de:{_desired:"lb",_distance:"4",_oneway:"true"}},{no:{_desired:"da",_distance:"8"}},{nb:{_desired:"da",_distance:"8"}},{ru:{_desired:"ab",_distance:"30",_oneway:"true"}},{en:{_desired:"ach",_distance:"30",_oneway:"true"}},{nl:{_desired:"af",_distance:"20",_oneway:"true"}},{en:{_desired:"ak",_distance:"30",_oneway:"true"}},{en:{_desired:"am",_distance:"30",_oneway:"true"}},{es:{_desired:"ay",_distance:"20",_oneway:"true"}},{ru:{_desired:"az",_distance:"30",_oneway:"true"}},{ur:{_desired:"bal",_distance:"20",_oneway:"true"}},{ru:{_desired:"be",_distance:"20",_oneway:"true"}},{en:{_desired:"bem",_distance:"30",_oneway:"true"}},{hi:{_desired:"bh",_distance:"30",_oneway:"true"}},{en:{_desired:"bn",_distance:"30",_oneway:"true"}},{zh:{_desired:"bo",_distance:"20",_oneway:"true"}},{fr:{_desired:"br",_distance:"20",_oneway:"true"}},{es:{_desired:"ca",_distance:"20",_oneway:"true"}},{fil:{_desired:"ceb",_distance:"30",_oneway:"true"}},{en:{_desired:"chr",_distance:"20",_oneway:"true"}},{ar:{_desired:"ckb",_distance:"30",_oneway:"true"}},{fr:{_desired:"co",_distance:"20",_oneway:"true"}},{fr:{_desired:"crs",_distance:"20",_oneway:"true"}},{sk:{_desired:"cs",_distance:"20"}},{en:{_desired:"cy",_distance:"20",_oneway:"true"}},{en:{_desired:"ee",_distance:"30",_oneway:"true"}},{en:{_desired:"eo",_distance:"30",_oneway:"true"}},{es:{_desired:"eu",_distance:"20",_oneway:"true"}},{da:{_desired:"fo",_distance:"20",_oneway:"true"}},{nl:{_desired:"fy",_distance:"20",_oneway:"true"}},{en:{_desired:"ga",_distance:"20",_oneway:"true"}},{en:{_desired:"gaa",_distance:"30",_oneway:"true"}},{en:{_desired:"gd",_distance:"20",_oneway:"true"}},{es:{_desired:"gl",_distance:"20",_oneway:"true"}},{es:{_desired:"gn",_distance:"20",_oneway:"true"}},{hi:{_desired:"gu",_distance:"30",_oneway:"true"}},{en:{_desired:"ha",_distance:"30",_oneway:"true"}},{en:{_desired:"haw",_distance:"20",_oneway:"true"}},{fr:{_desired:"ht",_distance:"20",_oneway:"true"}},{ru:{_desired:"hy",_distance:"30",_oneway:"true"}},{en:{_desired:"ia",_distance:"30",_oneway:"true"}},{en:{_desired:"ig",_distance:"30",_oneway:"true"}},{en:{_desired:"is",_distance:"20",_oneway:"true"}},{id:{_desired:"jv",_distance:"20",_oneway:"true"}},{en:{_desired:"ka",_distance:"30",_oneway:"true"}},{fr:{_desired:"kg",_distance:"30",_oneway:"true"}},{ru:{_desired:"kk",_distance:"30",_oneway:"true"}},{en:{_desired:"km",_distance:"30",_oneway:"true"}},{en:{_desired:"kn",_distance:"30",_oneway:"true"}},{en:{_desired:"kri",_distance:"30",_oneway:"true"}},{tr:{_desired:"ku",_distance:"30",_oneway:"true"}},{ru:{_desired:"ky",_distance:"30",_oneway:"true"}},{it:{_desired:"la",_distance:"20",_oneway:"true"}},{en:{_desired:"lg",_distance:"30",_oneway:"true"}},{fr:{_desired:"ln",_distance:"30",_oneway:"true"}},{en:{_desired:"lo",_distance:"30",_oneway:"true"}},{en:{_desired:"loz",_distance:"30",_oneway:"true"}},{fr:{_desired:"lua",_distance:"30",_oneway:"true"}},{hi:{_desired:"mai",_distance:"20",_oneway:"true"}},{en:{_desired:"mfe",_distance:"30",_oneway:"true"}},{fr:{_desired:"mg",_distance:"30",_oneway:"true"}},{en:{_desired:"mi",_distance:"20",_oneway:"true"}},{en:{_desired:"ml",_distance:"30",_oneway:"true"}},{ru:{_desired:"mn",_distance:"30",_oneway:"true"}},{hi:{_desired:"mr",_distance:"30",_oneway:"true"}},{id:{_desired:"ms",_distance:"30",_oneway:"true"}},{en:{_desired:"mt",_distance:"30",_oneway:"true"}},{en:{_desired:"my",_distance:"30",_oneway:"true"}},{en:{_desired:"ne",_distance:"30",_oneway:"true"}},{nb:{_desired:"nn",_distance:"20"}},{no:{_desired:"nn",_distance:"20"}},{en:{_desired:"nso",_distance:"30",_oneway:"true"}},{en:{_desired:"ny",_distance:"30",_oneway:"true"}},{en:{_desired:"nyn",_distance:"30",_oneway:"true"}},{fr:{_desired:"oc",_distance:"20",_oneway:"true"}},{en:{_desired:"om",_distance:"30",_oneway:"true"}},{en:{_desired:"or",_distance:"30",_oneway:"true"}},{en:{_desired:"pa",_distance:"30",_oneway:"true"}},{en:{_desired:"pcm",_distance:"20",_oneway:"true"}},{en:{_desired:"ps",_distance:"30",_oneway:"true"}},{es:{_desired:"qu",_distance:"30",_oneway:"true"}},{de:{_desired:"rm",_distance:"20",_oneway:"true"}},{en:{_desired:"rn",_distance:"30",_oneway:"true"}},{fr:{_desired:"rw",_distance:"30",_oneway:"true"}},{hi:{_desired:"sa",_distance:"30",_oneway:"true"}},{en:{_desired:"sd",_distance:"30",_oneway:"true"}},{en:{_desired:"si",_distance:"30",_oneway:"true"}},{en:{_desired:"sn",_distance:"30",_oneway:"true"}},{en:{_desired:"so",_distance:"30",_oneway:"true"}},{en:{_desired:"sq",_distance:"30",_oneway:"true"}},{en:{_desired:"st",_distance:"30",_oneway:"true"}},{id:{_desired:"su",_distance:"20",_oneway:"true"}},{en:{_desired:"sw",_distance:"30",_oneway:"true"}},{en:{_desired:"ta",_distance:"30",_oneway:"true"}},{en:{_desired:"te",_distance:"30",_oneway:"true"}},{ru:{_desired:"tg",_distance:"30",_oneway:"true"}},{en:{_desired:"ti",_distance:"30",_oneway:"true"}},{ru:{_desired:"tk",_distance:"30",_oneway:"true"}},{en:{_desired:"tlh",_distance:"30",_oneway:"true"}},{en:{_desired:"tn",_distance:"30",_oneway:"true"}},{en:{_desired:"to",_distance:"30",_oneway:"true"}},{ru:{_desired:"tt",_distance:"30",_oneway:"true"}},{en:{_desired:"tum",_distance:"30",_oneway:"true"}},{zh:{_desired:"ug",_distance:"20",_oneway:"true"}},{ru:{_desired:"uk",_distance:"20",_oneway:"true"}},{en:{_desired:"ur",_distance:"30",_oneway:"true"}},{ru:{_desired:"uz",_distance:"30",_oneway:"true"}},{fr:{_desired:"wo",_distance:"30",_oneway:"true"}},{en:{_desired:"xh",_distance:"30",_oneway:"true"}},{en:{_desired:"yi",_distance:"30",_oneway:"true"}},{en:{_desired:"yo",_distance:"30",_oneway:"true"}},{zh:{_desired:"za",_distance:"20",_oneway:"true"}},{en:{_desired:"zu",_distance:"30",_oneway:"true"}},{ar:{_desired:"aao",_distance:"10",_oneway:"true"}},{ar:{_desired:"abh",_distance:"10",_oneway:"true"}},{ar:{_desired:"abv",_distance:"10",_oneway:"true"}},{ar:{_desired:"acm",_distance:"10",_oneway:"true"}},{ar:{_desired:"acq",_distance:"10",_oneway:"true"}},{ar:{_desired:"acw",_distance:"10",_oneway:"true"}},{ar:{_desired:"acx",_distance:"10",_oneway:"true"}},{ar:{_desired:"acy",_distance:"10",_oneway:"true"}},{ar:{_desired:"adf",_distance:"10",_oneway:"true"}},{ar:{_desired:"aeb",_distance:"10",_oneway:"true"}},{ar:{_desired:"aec",_distance:"10",_oneway:"true"}},{ar:{_desired:"afb",_distance:"10",_oneway:"true"}},{ar:{_desired:"ajp",_distance:"10",_oneway:"true"}},{ar:{_desired:"apc",_distance:"10",_oneway:"true"}},{ar:{_desired:"apd",_distance:"10",_oneway:"true"}},{ar:{_desired:"arq",_distance:"10",_oneway:"true"}},{ar:{_desired:"ars",_distance:"10",_oneway:"true"}},{ar:{_desired:"ary",_distance:"10",_oneway:"true"}},{ar:{_desired:"arz",_distance:"10",_oneway:"true"}},{ar:{_desired:"auz",_distance:"10",_oneway:"true"}},{ar:{_desired:"avl",_distance:"10",_oneway:"true"}},{ar:{_desired:"ayh",_distance:"10",_oneway:"true"}},{ar:{_desired:"ayl",_distance:"10",_oneway:"true"}},{ar:{_desired:"ayn",_distance:"10",_oneway:"true"}},{ar:{_desired:"ayp",_distance:"10",_oneway:"true"}},{ar:{_desired:"bbz",_distance:"10",_oneway:"true"}},{ar:{_desired:"pga",_distance:"10",_oneway:"true"}},{ar:{_desired:"shu",_distance:"10",_oneway:"true"}},{ar:{_desired:"ssh",_distance:"10",_oneway:"true"}},{az:{_desired:"azb",_distance:"10",_oneway:"true"}},{et:{_desired:"vro",_distance:"10",_oneway:"true"}},{ff:{_desired:"ffm",_distance:"10",_oneway:"true"}},{ff:{_desired:"fub",_distance:"10",_oneway:"true"}},{ff:{_desired:"fue",_distance:"10",_oneway:"true"}},{ff:{_desired:"fuf",_distance:"10",_oneway:"true"}},{ff:{_desired:"fuh",_distance:"10",_oneway:"true"}},{ff:{_desired:"fui",_distance:"10",_oneway:"true"}},{ff:{_desired:"fuq",_distance:"10",_oneway:"true"}},{ff:{_desired:"fuv",_distance:"10",_oneway:"true"}},{gn:{_desired:"gnw",_distance:"10",_oneway:"true"}},{gn:{_desired:"gui",_distance:"10",_oneway:"true"}},{gn:{_desired:"gun",_distance:"10",_oneway:"true"}},{gn:{_desired:"nhd",_distance:"10",_oneway:"true"}},{iu:{_desired:"ikt",_distance:"10",_oneway:"true"}},{kln:{_desired:"enb",_distance:"10",_oneway:"true"}},{kln:{_desired:"eyo",_distance:"10",_oneway:"true"}},{kln:{_desired:"niq",_distance:"10",_oneway:"true"}},{kln:{_desired:"oki",_distance:"10",_oneway:"true"}},{kln:{_desired:"pko",_distance:"10",_oneway:"true"}},{kln:{_desired:"sgc",_distance:"10",_oneway:"true"}},{kln:{_desired:"tec",_distance:"10",_oneway:"true"}},{kln:{_desired:"tuy",_distance:"10",_oneway:"true"}},{kok:{_desired:"gom",_distance:"10",_oneway:"true"}},{kpe:{_desired:"gkp",_distance:"10",_oneway:"true"}},{luy:{_desired:"ida",_distance:"10",_oneway:"true"}},{luy:{_desired:"lkb",_distance:"10",_oneway:"true"}},{luy:{_desired:"lko",_distance:"10",_oneway:"true"}},{luy:{_desired:"lks",_distance:"10",_oneway:"true"}},{luy:{_desired:"lri",_distance:"10",_oneway:"true"}},{luy:{_desired:"lrm",_distance:"10",_oneway:"true"}},{luy:{_desired:"lsm",_distance:"10",_oneway:"true"}},{luy:{_desired:"lto",_distance:"10",_oneway:"true"}},{luy:{_desired:"lts",_distance:"10",_oneway:"true"}},{luy:{_desired:"lwg",_distance:"10",_oneway:"true"}},{luy:{_desired:"nle",_distance:"10",_oneway:"true"}},{luy:{_desired:"nyd",_distance:"10",_oneway:"true"}},{luy:{_desired:"rag",_distance:"10",_oneway:"true"}},{lv:{_desired:"ltg",_distance:"10",_oneway:"true"}},{mg:{_desired:"bhr",_distance:"10",_oneway:"true"}},{mg:{_desired:"bjq",_distance:"10",_oneway:"true"}},{mg:{_desired:"bmm",_distance:"10",_oneway:"true"}},{mg:{_desired:"bzc",_distance:"10",_oneway:"true"}},{mg:{_desired:"msh",_distance:"10",_oneway:"true"}},{mg:{_desired:"skg",_distance:"10",_oneway:"true"}},{mg:{_desired:"tdx",_distance:"10",_oneway:"true"}},{mg:{_desired:"tkg",_distance:"10",_oneway:"true"}},{mg:{_desired:"txy",_distance:"10",_oneway:"true"}},{mg:{_desired:"xmv",_distance:"10",_oneway:"true"}},{mg:{_desired:"xmw",_distance:"10",_oneway:"true"}},{mn:{_desired:"mvf",_distance:"10",_oneway:"true"}},{ms:{_desired:"bjn",_distance:"10",_oneway:"true"}},{ms:{_desired:"btj",_distance:"10",_oneway:"true"}},{ms:{_desired:"bve",_distance:"10",_oneway:"true"}},{ms:{_desired:"bvu",_distance:"10",_oneway:"true"}},{ms:{_desired:"coa",_distance:"10",_oneway:"true"}},{ms:{_desired:"dup",_distance:"10",_oneway:"true"}},{ms:{_desired:"hji",_distance:"10",_oneway:"true"}},{ms:{_desired:"id",_distance:"10",_oneway:"true"}},{ms:{_desired:"jak",_distance:"10",_oneway:"true"}},{ms:{_desired:"jax",_distance:"10",_oneway:"true"}},{ms:{_desired:"kvb",_distance:"10",_oneway:"true"}},{ms:{_desired:"kvr",_distance:"10",_oneway:"true"}},{ms:{_desired:"kxd",_distance:"10",_oneway:"true"}},{ms:{_desired:"lce",_distance:"10",_oneway:"true"}},{ms:{_desired:"lcf",_distance:"10",_oneway:"true"}},{ms:{_desired:"liw",_distance:"10",_oneway:"true"}},{ms:{_desired:"max",_distance:"10",_oneway:"true"}},{ms:{_desired:"meo",_distance:"10",_oneway:"true"}},{ms:{_desired:"mfa",_distance:"10",_oneway:"true"}},{ms:{_desired:"mfb",_distance:"10",_oneway:"true"}},{ms:{_desired:"min",_distance:"10",_oneway:"true"}},{ms:{_desired:"mqg",_distance:"10",_oneway:"true"}},{ms:{_desired:"msi",_distance:"10",_oneway:"true"}},{ms:{_desired:"mui",_distance:"10",_oneway:"true"}},{ms:{_desired:"orn",_distance:"10",_oneway:"true"}},{ms:{_desired:"ors",_distance:"10",_oneway:"true"}},{ms:{_desired:"pel",_distance:"10",_oneway:"true"}},{ms:{_desired:"pse",_distance:"10",_oneway:"true"}},{ms:{_desired:"tmw",_distance:"10",_oneway:"true"}},{ms:{_desired:"urk",_distance:"10",_oneway:"true"}},{ms:{_desired:"vkk",_distance:"10",_oneway:"true"}},{ms:{_desired:"vkt",_distance:"10",_oneway:"true"}},{ms:{_desired:"xmm",_distance:"10",_oneway:"true"}},{ms:{_desired:"zlm",_distance:"10",_oneway:"true"}},{ms:{_desired:"zmi",_distance:"10",_oneway:"true"}},{ne:{_desired:"dty",_distance:"10",_oneway:"true"}},{om:{_desired:"gax",_distance:"10",_oneway:"true"}},{om:{_desired:"hae",_distance:"10",_oneway:"true"}},{om:{_desired:"orc",_distance:"10",_oneway:"true"}},{or:{_desired:"spv",_distance:"10",_oneway:"true"}},{ps:{_desired:"pbt",_distance:"10",_oneway:"true"}},{ps:{_desired:"pst",_distance:"10",_oneway:"true"}},{qu:{_desired:"qub",_distance:"10",_oneway:"true"}},{qu:{_desired:"qud",_distance:"10",_oneway:"true"}},{qu:{_desired:"quf",_distance:"10",_oneway:"true"}},{qu:{_desired:"qug",_distance:"10",_oneway:"true"}},{qu:{_desired:"quh",_distance:"10",_oneway:"true"}},{qu:{_desired:"quk",_distance:"10",_oneway:"true"}},{qu:{_desired:"qul",_distance:"10",_oneway:"true"}},{qu:{_desired:"qup",_distance:"10",_oneway:"true"}},{qu:{_desired:"qur",_distance:"10",_oneway:"true"}},{qu:{_desired:"qus",_distance:"10",_oneway:"true"}},{qu:{_desired:"quw",_distance:"10",_oneway:"true"}},{qu:{_desired:"qux",_distance:"10",_oneway:"true"}},{qu:{_desired:"quy",_distance:"10",_oneway:"true"}},{qu:{_desired:"qva",_distance:"10",_oneway:"true"}},{qu:{_desired:"qvc",_distance:"10",_oneway:"true"}},{qu:{_desired:"qve",_distance:"10",_oneway:"true"}},{qu:{_desired:"qvh",_distance:"10",_oneway:"true"}},{qu:{_desired:"qvi",_distance:"10",_oneway:"true"}},{qu:{_desired:"qvj",_distance:"10",_oneway:"true"}},{qu:{_desired:"qvl",_distance:"10",_oneway:"true"}},{qu:{_desired:"qvm",_distance:"10",_oneway:"true"}},{qu:{_desired:"qvn",_distance:"10",_oneway:"true"}},{qu:{_desired:"qvo",_distance:"10",_oneway:"true"}},{qu:{_desired:"qvp",_distance:"10",_oneway:"true"}},{qu:{_desired:"qvs",_distance:"10",_oneway:"true"}},{qu:{_desired:"qvw",_distance:"10",_oneway:"true"}},{qu:{_desired:"qvz",_distance:"10",_oneway:"true"}},{qu:{_desired:"qwa",_distance:"10",_oneway:"true"}},{qu:{_desired:"qwc",_distance:"10",_oneway:"true"}},{qu:{_desired:"qwh",_distance:"10",_oneway:"true"}},{qu:{_desired:"qws",_distance:"10",_oneway:"true"}},{qu:{_desired:"qxa",_distance:"10",_oneway:"true"}},{qu:{_desired:"qxc",_distance:"10",_oneway:"true"}},{qu:{_desired:"qxh",_distance:"10",_oneway:"true"}},{qu:{_desired:"qxl",_distance:"10",_oneway:"true"}},{qu:{_desired:"qxn",_distance:"10",_oneway:"true"}},{qu:{_desired:"qxo",_distance:"10",_oneway:"true"}},{qu:{_desired:"qxp",_distance:"10",_oneway:"true"}},{qu:{_desired:"qxr",_distance:"10",_oneway:"true"}},{qu:{_desired:"qxt",_distance:"10",_oneway:"true"}},{qu:{_desired:"qxu",_distance:"10",_oneway:"true"}},{qu:{_desired:"qxw",_distance:"10",_oneway:"true"}},{sc:{_desired:"sdc",_distance:"10",_oneway:"true"}},{sc:{_desired:"sdn",_distance:"10",_oneway:"true"}},{sc:{_desired:"sro",_distance:"10",_oneway:"true"}},{sq:{_desired:"aae",_distance:"10",_oneway:"true"}},{sq:{_desired:"aat",_distance:"10",_oneway:"true"}},{sq:{_desired:"aln",_distance:"10",_oneway:"true"}},{syr:{_desired:"aii",_distance:"10",_oneway:"true"}},{uz:{_desired:"uzs",_distance:"10",_oneway:"true"}},{yi:{_desired:"yih",_distance:"10",_oneway:"true"}},{zh:{_desired:"cdo",_distance:"10",_oneway:"true"}},{zh:{_desired:"cjy",_distance:"10",_oneway:"true"}},{zh:{_desired:"cpx",_distance:"10",_oneway:"true"}},{zh:{_desired:"czh",_distance:"10",_oneway:"true"}},{zh:{_desired:"czo",_distance:"10",_oneway:"true"}},{zh:{_desired:"gan",_distance:"10",_oneway:"true"}},{zh:{_desired:"hak",_distance:"10",_oneway:"true"}},{zh:{_desired:"hsn",_distance:"10",_oneway:"true"}},{zh:{_desired:"lzh",_distance:"10",_oneway:"true"}},{zh:{_desired:"mnp",_distance:"10",_oneway:"true"}},{zh:{_desired:"nan",_distance:"10",_oneway:"true"}},{zh:{_desired:"wuu",_distance:"10",_oneway:"true"}},{zh:{_desired:"yue",_distance:"10",_oneway:"true"}},{"*":{_desired:"*",_distance:"80"}},{"en-Latn":{_desired:"am-Ethi",_distance:"10",_oneway:"true"}},{"ru-Cyrl":{_desired:"az-Latn",_distance:"10",_oneway:"true"}},{"en-Latn":{_desired:"bn-Beng",_distance:"10",_oneway:"true"}},{"zh-Hans":{_desired:"bo-Tibt",_distance:"10",_oneway:"true"}},{"ru-Cyrl":{_desired:"hy-Armn",_distance:"10",_oneway:"true"}},{"en-Latn":{_desired:"ka-Geor",_distance:"10",_oneway:"true"}},{"en-Latn":{_desired:"km-Khmr",_distance:"10",_oneway:"true"}},{"en-Latn":{_desired:"kn-Knda",_distance:"10",_oneway:"true"}},{"en-Latn":{_desired:"lo-Laoo",_distance:"10",_oneway:"true"}},{"en-Latn":{_desired:"ml-Mlym",_distance:"10",_oneway:"true"}},{"en-Latn":{_desired:"my-Mymr",_distance:"10",_oneway:"true"}},{"en-Latn":{_desired:"ne-Deva",_distance:"10",_oneway:"true"}},{"en-Latn":{_desired:"or-Orya",_distance:"10",_oneway:"true"}},{"en-Latn":{_desired:"pa-Guru",_distance:"10",_oneway:"true"}},{"en-Latn":{_desired:"ps-Arab",_distance:"10",_oneway:"true"}},{"en-Latn":{_desired:"sd-Arab",_distance:"10",_oneway:"true"}},{"en-Latn":{_desired:"si-Sinh",_distance:"10",_oneway:"true"}},{"en-Latn":{_desired:"ta-Taml",_distance:"10",_oneway:"true"}},{"en-Latn":{_desired:"te-Telu",_distance:"10",_oneway:"true"}},{"en-Latn":{_desired:"ti-Ethi",_distance:"10",_oneway:"true"}},{"ru-Cyrl":{_desired:"tk-Latn",_distance:"10",_oneway:"true"}},{"en-Latn":{_desired:"ur-Arab",_distance:"10",_oneway:"true"}},{"ru-Cyrl":{_desired:"uz-Latn",_distance:"10",_oneway:"true"}},{"en-Latn":{_desired:"yi-Hebr",_distance:"10",_oneway:"true"}},{"sr-Cyrl":{_desired:"sr-Latn",_distance:"5"}},{"zh-Hans":{_desired:"za-Latn",_distance:"10",_oneway:"true"}},{"zh-Hans":{_desired:"zh-Hani",_distance:"20",_oneway:"true"}},{"zh-Hant":{_desired:"zh-Hani",_distance:"20",_oneway:"true"}},{"ar-Arab":{_desired:"ar-Latn",_distance:"20",_oneway:"true"}},{"bn-Beng":{_desired:"bn-Latn",_distance:"20",_oneway:"true"}},{"gu-Gujr":{_desired:"gu-Latn",_distance:"20",_oneway:"true"}},{"hi-Deva":{_desired:"hi-Latn",_distance:"20",_oneway:"true"}},{"kn-Knda":{_desired:"kn-Latn",_distance:"20",_oneway:"true"}},{"ml-Mlym":{_desired:"ml-Latn",_distance:"20",_oneway:"true"}},{"mr-Deva":{_desired:"mr-Latn",_distance:"20",_oneway:"true"}},{"ta-Taml":{_desired:"ta-Latn",_distance:"20",_oneway:"true"}},{"te-Telu":{_desired:"te-Latn",_distance:"20",_oneway:"true"}},{"zh-Hans":{_desired:"zh-Latn",_distance:"20",_oneway:"true"}},{"ja-Jpan":{_desired:"ja-Latn",_distance:"5",_oneway:"true"}},{"ja-Jpan":{_desired:"ja-Hani",_distance:"5",_oneway:"true"}},{"ja-Jpan":{_desired:"ja-Hira",_distance:"5",_oneway:"true"}},{"ja-Jpan":{_desired:"ja-Kana",_distance:"5",_oneway:"true"}},{"ja-Jpan":{_desired:"ja-Hrkt",_distance:"5",_oneway:"true"}},{"ja-Hrkt":{_desired:"ja-Hira",_distance:"5",_oneway:"true"}},{"ja-Hrkt":{_desired:"ja-Kana",_distance:"5",_oneway:"true"}},{"ko-Kore":{_desired:"ko-Hani",_distance:"5",_oneway:"true"}},{"ko-Kore":{_desired:"ko-Hang",_distance:"5",_oneway:"true"}},{"ko-Kore":{_desired:"ko-Jamo",_distance:"5",_oneway:"true"}},{"ko-Hang":{_desired:"ko-Jamo",_distance:"5",_oneway:"true"}},{"*-*":{_desired:"*-*",_distance:"50"}},{"ar-*-$maghreb":{_desired:"ar-*-$maghreb",_distance:"4"}},{"ar-*-$!maghreb":{_desired:"ar-*-$!maghreb",_distance:"4"}},{"ar-*-*":{_desired:"ar-*-*",_distance:"5"}},{"en-*-$enUS":{_desired:"en-*-$enUS",_distance:"4"}},{"en-*-GB":{_desired:"en-*-$!enUS",_distance:"3"}},{"en-*-$!enUS":{_desired:"en-*-$!enUS",_distance:"4"}},{"en-*-*":{_desired:"en-*-*",_distance:"5"}},{"es-*-$americas":{_desired:"es-*-$americas",_distance:"4"}},{"es-*-$!americas":{_desired:"es-*-$!americas",_distance:"4"}},{"es-*-*":{_desired:"es-*-*",_distance:"5"}},{"pt-*-$americas":{_desired:"pt-*-$americas",_distance:"4"}},{"pt-*-$!americas":{_desired:"pt-*-$!americas",_distance:"4"}},{"pt-*-*":{_desired:"pt-*-*",_distance:"5"}},{"zh-Hant-$cnsar":{_desired:"zh-Hant-$cnsar",_distance:"4"}},{"zh-Hant-$!cnsar":{_desired:"zh-Hant-$!cnsar",_distance:"4"}},{"zh-Hant-*":{_desired:"zh-Hant-*",_distance:"5"}},{"*-*-*":{_desired:"*-*-*",_distance:"4"}}]}}},Da={"001":["001","001-status-grouping","002","005","009","011","013","014","015","017","018","019","021","029","030","034","035","039","053","054","057","061","142","143","145","150","151","154","155","AC","AD","AE","AF","AG","AI","AL","AM","AO","AQ","AR","AS","AT","AU","AW","AX","AZ","BA","BB","BD","BE","BF","BG","BH","BI","BJ","BL","BM","BN","BO","BQ","BR","BS","BT","BV","BW","BY","BZ","CA","CC","CD","CF","CG","CH","CI","CK","CL","CM","CN","CO","CP","CQ","CR","CU","CV","CW","CX","CY","CZ","DE","DG","DJ","DK","DM","DO","DZ","EA","EC","EE","EG","EH","ER","ES","ET","EU","EZ","FI","FJ","FK","FM","FO","FR","GA","GB","GD","GE","GF","GG","GH","GI","GL","GM","GN","GP","GQ","GR","GS","GT","GU","GW","GY","HK","HM","HN","HR","HT","HU","IC","ID","IE","IL","IM","IN","IO","IQ","IR","IS","IT","JE","JM","JO","JP","KE","KG","KH","KI","KM","KN","KP","KR","KW","KY","KZ","LA","LB","LC","LI","LK","LR","LS","LT","LU","LV","LY","MA","MC","MD","ME","MF","MG","MH","MK","ML","MM","MN","MO","MP","MQ","MR","MS","MT","MU","MV","MW","MX","MY","MZ","NA","NC","NE","NF","NG","NI","NL","NO","NP","NR","NU","NZ","OM","PA","PE","PF","PG","PH","PK","PL","PM","PN","PR","PS","PT","PW","PY","QA","QO","RE","RO","RS","RU","RW","SA","SB","SC","SD","SE","SG","SH","SI","SJ","SK","SL","SM","SN","SO","SR","SS","ST","SV","SX","SY","SZ","TA","TC","TD","TF","TG","TH","TJ","TK","TL","TM","TN","TO","TR","TT","TV","TW","TZ","UA","UG","UM","UN","US","UY","UZ","VA","VC","VE","VG","VI","VN","VU","WF","WS","XK","YE","YT","ZA","ZM","ZW"],"002":["002","002-status-grouping","011","014","015","017","018","202","AO","BF","BI","BJ","BW","CD","CF","CG","CI","CM","CV","DJ","DZ","EA","EG","EH","ER","ET","GA","GH","GM","GN","GQ","GW","IC","IO","KE","KM","LR","LS","LY","MA","MG","ML","MR","MU","MW","MZ","NA","NE","NG","RE","RW","SC","SD","SH","SL","SN","SO","SS","ST","SZ","TD","TF","TG","TN","TZ","UG","YT","ZA","ZM","ZW"],"003":["003","013","021","029","AG","AI","AW","BB","BL","BM","BQ","BS","BZ","CA","CR","CU","CW","DM","DO","GD","GL","GP","GT","HN","HT","JM","KN","KY","LC","MF","MQ","MS","MX","NI","PA","PM","PR","SV","SX","TC","TT","US","VC","VG","VI"],"005":["005","AR","BO","BR","BV","CL","CO","EC","FK","GF","GS","GY","PE","PY","SR","UY","VE"],"009":["009","053","054","057","061","AC","AQ","AS","AU","CC","CK","CP","CX","DG","FJ","FM","GU","HM","KI","MH","MP","NC","NF","NR","NU","NZ","PF","PG","PN","PW","QO","SB","TA","TK","TO","TV","UM","VU","WF","WS"],"011":["011","BF","BJ","CI","CV","GH","GM","GN","GW","LR","ML","MR","NE","NG","SH","SL","SN","TG"],"013":["013","BZ","CR","GT","HN","MX","NI","PA","SV"],"014":["014","BI","DJ","ER","ET","IO","KE","KM","MG","MU","MW","MZ","RE","RW","SC","SO","SS","TF","TZ","UG","YT","ZM","ZW"],"015":["015","DZ","EA","EG","EH","IC","LY","MA","SD","TN"],"017":["017","AO","CD","CF","CG","CM","GA","GQ","ST","TD"],"018":["018","BW","LS","NA","SZ","ZA"],"019":["003","005","013","019","019-status-grouping","021","029","419","AG","AI","AR","AW","BB","BL","BM","BO","BQ","BR","BS","BV","BZ","CA","CL","CO","CR","CU","CW","DM","DO","EC","FK","GD","GF","GL","GP","GS","GT","GY","HN","HT","JM","KN","KY","LC","MF","MQ","MS","MX","NI","PA","PE","PM","PR","PY","SR","SV","SX","TC","TT","US","UY","VC","VE","VG","VI"],"021":["021","BM","CA","GL","PM","US"],"029":["029","AG","AI","AW","BB","BL","BQ","BS","CU","CW","DM","DO","GD","GP","HT","JM","KN","KY","LC","MF","MQ","MS","PR","SX","TC","TT","VC","VG","VI"],"030":["030","CN","HK","JP","KP","KR","MN","MO","TW"],"034":["034","AF","BD","BT","IN","IR","LK","MV","NP","PK"],"035":["035","BN","ID","KH","LA","MM","MY","PH","SG","TH","TL","VN"],"039":["039","AD","AL","BA","ES","GI","GR","HR","IT","ME","MK","MT","PT","RS","SI","SM","VA","XK"],"053":["053","AU","CC","CX","HM","NF","NZ"],"054":["054","FJ","NC","PG","SB","VU"],"057":["057","FM","GU","KI","MH","MP","NR","PW","UM"],"061":["061","AS","CK","NU","PF","PN","TK","TO","TV","WF","WS"],142:["030","034","035","142","143","145","AE","AF","AM","AZ","BD","BH","BN","BT","CN","CY","GE","HK","ID","IL","IN","IQ","IR","JO","JP","KG","KH","KP","KR","KW","KZ","LA","LB","LK","MM","MN","MO","MV","MY","NP","OM","PH","PK","PS","QA","SA","SG","SY","TH","TJ","TL","TM","TR","TW","UZ","VN","YE"],143:["143","KG","KZ","TJ","TM","UZ"],145:["145","AE","AM","AZ","BH","CY","GE","IL","IQ","JO","KW","LB","OM","PS","QA","SA","SY","TR","YE"],150:["039","150","151","154","155","AD","AL","AT","AX","BA","BE","BG","BY","CH","CQ","CZ","DE","DK","EE","ES","FI","FO","FR","GB","GG","GI","GR","HR","HU","IE","IM","IS","IT","JE","LI","LT","LU","LV","MC","MD","ME","MK","MT","NL","NO","PL","PT","RO","RS","RU","SE","SI","SJ","SK","SM","UA","VA","XK"],151:["151","BG","BY","CZ","HU","MD","PL","RO","RU","SK","UA"],154:["154","AX","CQ","DK","EE","FI","FO","GB","GG","IE","IM","IS","JE","LT","LV","NO","SE","SJ"],155:["155","AT","BE","CH","DE","FR","LI","LU","MC","NL"],202:["011","014","017","018","202","AO","BF","BI","BJ","BW","CD","CF","CG","CI","CM","CV","DJ","ER","ET","GA","GH","GM","GN","GQ","GW","IO","KE","KM","LR","LS","MG","ML","MR","MU","MW","MZ","NA","NE","NG","RE","RW","SC","SH","SL","SN","SO","SS","ST","SZ","TD","TF","TG","TZ","UG","YT","ZA","ZM","ZW"],419:["005","013","029","419","AG","AI","AR","AW","BB","BL","BO","BQ","BR","BS","BV","BZ","CL","CO","CR","CU","CW","DM","DO","EC","FK","GD","GF","GP","GS","GT","GY","HN","HT","JM","KN","KY","LC","MF","MQ","MS","MX","NI","PA","PE","PR","PY","SR","SV","SX","TC","TT","UY","VC","VE","VG","VI"],EU:["AT","BE","BG","CY","CZ","DE","DK","EE","ES","EU","FI","FR","GR","HR","HU","IE","IT","LT","LU","LV","MT","NL","PL","PT","RO","SE","SI","SK"],EZ:["AT","BE","CY","DE","EE","ES","EZ","FI","FR","GR","IE","IT","LT","LU","LV","MT","NL","PT","SI","SK"],QO:["AC","AQ","CP","DG","QO","TA"],UN:["AD","AE","AF","AG","AL","AM","AO","AR","AT","AU","AZ","BA","BB","BD","BE","BF","BG","BH","BI","BJ","BN","BO","BR","BS","BT","BW","BY","BZ","CA","CD","CF","CG","CH","CI","CL","CM","CN","CO","CR","CU","CV","CY","CZ","DE","DJ","DK","DM","DO","DZ","EC","EE","EG","ER","ES","ET","FI","FJ","FM","FR","GA","GB","GD","GE","GH","GM","GN","GQ","GR","GT","GW","GY","HN","HR","HT","HU","ID","IE","IL","IN","IQ","IR","IS","IT","JM","JO","JP","KE","KG","KH","KI","KM","KN","KP","KR","KW","KZ","LA","LB","LC","LI","LK","LR","LS","LT","LU","LV","LY","MA","MC","MD","ME","MG","MH","MK","ML","MM","MN","MR","MT","MU","MV","MW","MX","MY","MZ","NA","NE","NG","NI","NL","NO","NP","NR","NZ","OM","PA","PE","PG","PH","PK","PL","PT","PW","PY","QA","RO","RS","RU","RW","SA","SB","SC","SD","SE","SG","SI","SK","SL","SM","SN","SO","SR","SS","ST","SV","SY","SZ","TD","TG","TH","TJ","TL","TM","TN","TO","TR","TT","TV","TZ","UA","UG","UN","US","UY","UZ","VC","VE","VN","VU","WS","YE","ZA","ZM","ZW"]},Cn=/-u(?:-[0-9a-z]{2,8})+/gi;function ne(e,n,r){if(r===void 0&&(r=Error),!e)throw new r(n)}var Sa=838,Oe;function Ma(){var e,n;if(!Oe){var r=(n=(e=Pe.supplemental.languageMatching["written-new"][0])===null||e===void 0?void 0:e.paradigmLocales)===null||n===void 0?void 0:n._locales.split(" "),i=Pe.supplemental.languageMatching["written-new"].slice(1,5),a=Pe.supplemental.languageMatching["written-new"].slice(5),o=a.map(function(s){var d=Object.keys(s)[0],c=s[d];return{supported:d,desired:c._desired,distance:+c._distance,oneway:c.oneway==="true"}},{});Oe={matches:o,matchVariables:i.reduce(function(s,d){var c=Object.keys(d)[0],u=d[c];return s[c.slice(1)]=u._value.split("+"),s},{}),paradigmLocales:$e($e([],r,!0),r.map(function(s){return new Intl.Locale(s.replace(/_/g,"-")).maximize().toString()}),!0)}}return Oe}function ye(e,n,r){var i=n.split("-"),a=i[0],o=i[1],s=i[2],d=!0;if(s&&s[0]==="$"){var c=s[1]!=="!",u=c?r[s.slice(1)]:r[s.slice(2)],_=u.map(function(g){return Da[g]||[g]}).reduce(function(g,h){return $e($e([],g,!0),h,!0)},[]);d&&(d=_.indexOf(e.region||"")>1==c)}else d&&(d=e.region?s==="*"||s===e.region:!0);return d&&(d=e.script?o==="*"||o===e.script:!0),d&&(d=e.language?a==="*"||a===e.language:!0),d}function kn(e){return[e.language,e.script,e.region].filter(Boolean).join("-")}function Ue(e,n,r){for(var i=0,a=r.matches;i<a.length;i++){var o=a[i],s=ye(e,o.desired,r.matchVariables)&&ye(n,o.supported,r.matchVariables);if(!o.oneway&&!s&&(s=ye(e,o.supported,r.matchVariables)&&ye(n,o.desired,r.matchVariables)),s){var d=o.distance*10;return r.paradigmLocales.indexOf(kn(e))>-1!=r.paradigmLocales.indexOf(kn(n))>-1?d-1:d}}throw new Error("No matching distance found")}function ja(e,n){var r=new Intl.Locale(e).maximize(),i=new Intl.Locale(n).maximize(),a={language:r.language,script:r.script||"",region:r.region||""},o={language:i.language,script:i.script||"",region:i.region||""},s=0,d=Ma();return a.language!==o.language&&(s+=Ue({language:r.language,script:"",region:""},{language:i.language,script:"",region:""},d)),a.script!==o.script&&(s+=Ue({language:r.language,script:a.script,region:""},{language:i.language,script:a.script,region:""},d)),a.region!==o.region&&(s+=Ue(a,o,d)),s}function Ea(e,n,r){r===void 0&&(r=Sa);var i=1/0,a={matchedDesiredLocale:"",distances:{}};return e.forEach(function(o,s){a.distances[o]||(a.distances[o]={}),n.forEach(function(d){var c=ja(o,d)+0+s*40;a.distances[o][d]=c,c<i&&(i=c,a.matchedDesiredLocale=o,a.matchedSupportedLocale=d)})}),i>=r&&(a.matchedDesiredLocale=void 0,a.matchedSupportedLocale=void 0),a}function Fa(e,n,r){var i,a,o=[],s=n.reduce(function(c,u){var _=u.replace(Cn,"");return o.push(_),c[_]=u,c},{}),d=Ea(o,e);return d.matchedSupportedLocale&&d.matchedDesiredLocale&&(i=d.matchedSupportedLocale,a=s[d.matchedDesiredLocale].slice(d.matchedDesiredLocale.length)||void 0),i?{locale:i,extension:a}:{locale:r()}}function Vt(e,n){for(var r=n;;){if(e.indexOf(r)>-1)return r;var i=r.lastIndexOf("-");if(!~i)return;i>=2&&r[i-2]==="-"&&(i-=2),r=r.slice(0,i)}}function $a(e,n,r){for(var i={locale:""},a=0,o=n;a<o.length;a++){var s=o[a],d=s.replace(Cn,""),c=Vt(e,d);if(c)return i.locale=c,s!==d&&(i.extension=s.slice(d.length,s.length)),i}return i.locale=r(),i}function Ia(e,n){ne(n.length===2,"key must have 2 elements");var r=e.length,i="-".concat(n,"-"),a=e.indexOf(i);if(a!==-1){for(var o=a+4,s=o,d=o,c=!1;!c;){var u=e.indexOf("-",d),_=void 0;u===-1?_=r-d:_=u-d,_===2?c=!0:u===-1?(s=r,c=!0):(s=u,d=u+1)}return e.slice(o,s)}if(i="-".concat(n),a=e.indexOf(i),a!==-1&&a+3===r)return""}function Ta(e,n,r,i,a,o){var s=r.localeMatcher,d;s==="lookup"?d=$a(Array.from(e),n,o):d=Fa(Array.from(e),n,o);for(var c=d.locale,u={locale:"",dataLocale:c},_="-u",g=0,h=i;g<h.length;g++){var p=h[g];ne(c in a,"Missing locale data for ".concat(c));var f=a[c];ne(typeof f=="object"&&f!==null,"locale data ".concat(p," must be an object"));var x=f[p];ne(Array.isArray(x),"keyLocaleData for ".concat(p," must be an array"));var b=x[0];ne(typeof b=="string"||b===null,"value must be string or null but got ".concat(typeof b," in key ").concat(p));var y="";if(d.extension){var S=Ia(d.extension,p);S!==void 0&&(S!==""?~x.indexOf(S)&&(b=S,y="-".concat(p,"-").concat(b)):~S.indexOf("true")&&(b="true",y="-".concat(p)))}if(p in r){var D=r[p];ne(typeof D=="string"||typeof D>"u"||D===null,"optionsValue must be String, Undefined or Null"),~x.indexOf(D)&&D!==b&&(b=D,y="")}u[p]=b,_+=y}if(_.length>2){var j=c.indexOf("-x-");if(j===-1)c=c+_;else{var k=c.slice(0,j),$=c.slice(j,c.length);c=k+_+$}c=Intl.getCanonicalLocales(c)[0]}return u.locale=c,u}function Rn(e,n){for(var r=[],i=0,a=n;i<a.length;i++){var o=a[i],s=o.replace(Cn,""),d=Vt(e,s);d&&r.push(d)}return r}function Wt(e,n,r,i,a){var o=yn(n,"minimumIntegerDigits",1,21,1),s=n.minimumFractionDigits,d=n.maximumFractionDigits,c=n.minimumSignificantDigits,u=n.maximumSignificantDigits;e.minimumIntegerDigits=o;var _=T(n,"roundingPriority","string",["auto","morePrecision","lessPrecision"],"auto"),g=c!==void 0||u!==void 0,h=s!==void 0||d!==void 0,p=!0,f=!0;if(_==="auto"&&(p=g,(g||!h&&a==="compact")&&(f=!1)),p&&(g?(c=de(c,1,21,1),u=de(u,c,21,21),e.minimumSignificantDigits=c,e.maximumSignificantDigits=u):(e.minimumSignificantDigits=1,e.maximumSignificantDigits=21)),f)if(h){if(s=de(s,0,20,void 0),d=de(d,0,20,void 0),s===void 0)s=Math.min(r,d);else if(d===void 0)d=Math.max(i,s);else if(s>d)throw new RangeError("Invalid range, ".concat(s," > ").concat(d));e.minimumFractionDigits=s,e.maximumFractionDigits=d}else e.minimumFractionDigits=r,e.maximumFractionDigits=i;p||f?_==="morePrecision"?e.roundingType="morePrecision":_==="lessPrecision"?e.roundingType="lessPrecision":g?e.roundingType="significantDigits":e.roundingType="fractionDigits":(e.roundingType="morePrecision",e.minimumFractionDigits=0,e.maximumFractionDigits=0,e.minimumSignificantDigits=1,e.maximumSignificantDigits=2)}function Kt(e,n,r){n===void 0&&(n=Object.create(null));var i=r.getInternalSlots,a=i(e),o=T(n,"style","string",["decimal","percent","currency","unit"],"decimal");a.style=o;var s=T(n,"currency","string",void 0,void 0);if(s!==void 0&&!Rt(s))throw RangeError("Malformed currency code");if(o==="currency"&&s===void 0)throw TypeError("currency cannot be undefined");var d=T(n,"currencyDisplay","string",["code","symbol","narrowSymbol","name"],"symbol"),c=T(n,"currencySign","string",["standard","accounting"],"standard"),u=T(n,"unit","string",void 0,void 0);if(u!==void 0&&!Gt(u))throw RangeError("Invalid unit argument for Intl.NumberFormat()");if(o==="unit"&&u===void 0)throw TypeError("unit cannot be undefined");var _=T(n,"unitDisplay","string",["short","narrow","long"],"short");o==="currency"&&(a.currency=s.toUpperCase(),a.currencyDisplay=d,a.currencySign=c),o==="unit"&&(a.unit=u,a.unitDisplay=_)}var Gn=[1,2,5,10,20,25,50,100,200,250,500,1e3,2e3];function Aa(e,n,r,i){var a=i.getInternalSlots,o=i.localeData,s=i.availableLocales,d=i.numberingSystemNames,c=i.getDefaultLocale,u=i.currencyDigitsData,_=Ct(n),g=At(r),h=Object.create(null),p=T(g,"localeMatcher","string",["lookup","best fit"],"best fit");h.localeMatcher=p;var f=T(g,"numberingSystem","string",void 0,void 0);if(f!==void 0&&d.indexOf(f)<0)throw RangeError("Invalid numberingSystems: ".concat(f));h.nu=f;var x=Ta(Array.from(s),_,h,["nu"],o,c),b=o[x.dataLocale];rn(!!b,"Missing locale data for ".concat(x.dataLocale));var y=a(e);y.locale=x.locale,y.dataLocale=x.dataLocale,y.numberingSystem=x.nu,y.dataLocaleData=b,Kt(e,g,{getInternalSlots:a});var S=y.style,D,j;if(S==="currency"){var k=y.currency,$=Ot(k,{currencyDigitsData:u});D=$,j=$}else D=0,j=S==="percent"?0:3;var R=T(g,"notation","string",["standard","scientific","engineering","compact"],"standard");y.notation=R,Wt(y,g,D,j,R);var V=yn(g,"roundingIncrement",1,5e3,1);if(Gn.indexOf(V)===-1)throw new RangeError("Invalid rounding increment value: ".concat(V,`.
Valid values are `).concat(Gn,"."));if(V!==1&&y.roundingType!=="fractionDigits")throw new TypeError("For roundingIncrement > 1 only fractionDigits is a valid roundingType");if(V!==1&&y.maximumFractionDigits!==y.minimumFractionDigits)throw new RangeError("With roundingIncrement > 1, maximumFractionDigits and minimumFractionDigits must be equal.");y.roundingIncrement=V;var we=T(g,"trailingZeroDisplay","string",["auto","stripIfInteger"],"auto");y.trailingZeroDisplay=we;var I=T(g,"compactDisplay","string",["short","long"],"short"),O="auto";return R==="compact"&&(y.compactDisplay=I,O="min2"),y.useGrouping=Bt(g,"useGrouping",["min2","auto","always"],"always",!1,O),y.signDisplay=T(g,"signDisplay","string",["auto","never","always","exceptZero","negative"],"auto"),y.roundingMode=T(g,"roundingMode","string",["ceil","floor","expand","trunc","halfCeil","halfFloor","halfExpand","halfTrunc","halfEven"],"halfExpand"),e}function Ba(e){for(var n=[],r=e.indexOf("{"),i=0,a=0,o=e.length;r<e.length&&r>-1;)i=e.indexOf("}",r),rn(i>r,"Invalid pattern ".concat(e)),r>a&&n.push({type:"literal",value:e.substring(a,r)}),n.push({type:e.substring(r+1,i),value:void 0}),a=i+1,r=e.indexOf("{",a);return a<o&&n.push({type:"literal",value:e.substring(a,o)}),n}function La(e,n,r){var i="best fit";return r!==void 0&&(r=mn(r),i=T(r,"localeMatcher","string",["lookup","best fit"],"best fit")),Rn(Array.from(e),n)}(function(e){Gi(n,e);function n(){var r=e!==null&&e.apply(this,arguments)||this;return r.type="MISSING_LOCALE_DATA",r}return n})(Error);function Na(e){return e.type==="MISSING_LOCALE_DATA"}var Xe;(function(e){e.startRange="startRange",e.shared="shared",e.endRange="endRange"})(Xe||(Xe={}));const ka=Object.freeze(Object.defineProperty({__proto__:null,ApplyUnsignedRoundingMode:ua,ArrayCreate:Dt,CanonicalizeLocaleList:Ct,CanonicalizeTimeZoneName:Vi,CoerceOptionsToObject:At,CollapseNumberRange:ga,ComputeExponent:Pt,ComputeExponentForMagnitude:Ye,CurrencyDigits:Ot,DateFromTime:Ji,Day:hn,DayFromYear:jt,DayWithinYear:pn,DaysInYear:Et,FormatApproximately:Ut,FormatNumericRange:wa,FormatNumericRangeToParts:ya,FormatNumericToParts:xa,FormatNumericToString:xn,GetNumberOption:yn,GetOption:T,GetOptionsObject:sa,GetStringOrBooleanOption:Bt,GetUnsignedRoundingMode:ba,HasOwnProperty:St,HourFromTime:ea,InLeapYear:fn,InitializeNumberFormat:Aa,IsSanctionedSimpleUnitIdentifier:Se,IsValidTimeZoneName:oa,IsWellFormedCurrencyCode:Rt,IsWellFormedUnitIdentifier:Gt,MinFromTime:na,MonthFromTime:Ft,OrdinaryHasInstance:ia,PartitionNumberPattern:Ae,PartitionNumberRangePattern:vn,PartitionPattern:Ba,get RangePatternType(){return Xe},SANCTIONED_UNITS:Lt,SIMPLE_UNITS:kt,SameValue:J,SecFromTime:ta,SetNumberFormatDigitOptions:Wt,SetNumberFormatUnitOptions:Kt,SupportedLocales:La,TimeClip:Ki,TimeFromYear:Yi,ToNumber:bt,ToObject:mn,ToRawFixed:Te,ToRawPrecision:Je,ToString:gn,Type:Zi,WeekDay:zi,YearFromTime:_n,_formatToParts:qt,defineProperty:Er,getInternalSlot:Fr,getMagnitude:Ee,getMultiInternalSlots:$r,invariant:rn,isLiteralPart:Ir,isMissingLocaleDataError:Na,msFromTime:aa,removeUnitNamespace:Nt,setInternalSlot:Tr,setMultiInternalSlots:Ar},Symbol.toStringTag,{value:"Module"}));function Ra(e){return e}function Ga(e){return e}const Pa=Object.freeze(Object.defineProperty({__proto__:null,DEFAULT_INTL_CONFIG:Br,IntlError:Lr,get IntlErrorCode(){return Nr},IntlFormatError:kr,InvalidConfigError:Rr,MessageFormatError:Gr,MissingDataError:Pr,MissingTranslationError:Or,UnsupportedFormatterError:Ur,createFormatters:Hr,createIntl:qr,createIntlCache:Vr,defineMessage:Ga,defineMessages:Ra,filterProps:Wr,formatDate:Kr,formatDateToParts:Zr,formatDisplayName:zr,formatList:Yr,formatMessage:Jr,formatNumber:Xr,formatNumberToParts:Qr,formatPlural:ei,formatRelativeTime:ni,formatTime:ti,formatTimeToParts:ri,getNamedFormat:ii},Symbol.toStringTag,{value:"Module"})),Oa="data:image/svg+xml,%3csvg%20width='14'%20height='14'%20viewBox='0%200%2014%2014'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M12.8316%206.89988L7.40651%2012.813C7.182%2013.0623%206.818%2013.0623%206.59349%2012.813L1.16838%206.89988C0.943872%206.65061%200.943872%206.24646%201.16838%205.99719C1.39289%205.74792%201.75689%205.74792%201.9814%205.99719L6.42511%2010.8207L6.42511%201.57489C6.42511%201.25739%206.6825%201%207%201C7.3175%201%207.57489%201.25739%207.57489%201.57489L7.57489%2010.8207L12.0186%205.99719C12.2431%205.74792%2012.6071%205.74792%2012.8316%205.99719C13.0561%206.24646%2013.0561%206.65061%2012.8316%206.89988Z'%20fill='white'/%3e%3c/svg%3e",Ua=l.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${({theme:e})=>e.bgColors.dark400};
`,Ha=l.span`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  border-radius: 50%;
  border: 1px solid ${({theme:e})=>e.colors.border};
  background-color: ${({theme:e})=>e.bgColors.dark200};
  transition: 0.3s linear;
  ${({isActive:e,disabled:n})=>e&&!n?v`
          transform: rotate(-180deg);
          &:hover {
            border: 1px solid ${({theme:r})=>r.colors.secondary};
          }
        `:v`
          cursor: initial;
        `}
  @media (${w.MD}) {
    transform: rotate(-90deg);
    ${({isActive:e,disabled:n})=>e&&!n?v`
            transform: rotate(-270deg);
          `:null}
  }
`,qa=()=>{const e=m(z),n=m(_i),[r,i]=N.useState(!1),a=F(),o=()=>{e||(a(M.revertExchange(!n)),a(A.clearAmountTo()),a(A.resetTimer(!0)))};return t.jsx(Ua,{onMouseEnter:()=>i(!0),onMouseLeave:()=>i(!1),onClick:o,disabled:e,children:t.jsx(Ha,{isActive:r,disabled:e,children:t.jsx(E,{src:Oa,title:"Revert icon"})})})};var W={};const Va=ot(ka),Wa=ot(Pa);Object.defineProperty(W,"__esModule",{value:!0});var Zt=W.shallowEqual=W.assignUniqueKeysToParts=W.DEFAULT_INTL_CONFIG=W.invariantIntlContext=void 0,Qe=Ri,zt=Qe.__importStar(N),Ka=Va,Za=Wa;function za(e){(0,Ka.invariant)(e,"[React Intl] Could not find required `intl` object. <IntlProvider> needs to exist in the component ancestry.")}W.invariantIntlContext=za;W.DEFAULT_INTL_CONFIG=Qe.__assign(Qe.__assign({},Za.DEFAULT_INTL_CONFIG),{textComponent:zt.Fragment});function Ya(e){return function(n){return e(zt.Children.toArray(n))}}W.assignUniqueKeysToParts=Ya;function Ja(e,n){if(e===n)return!0;if(!e||!n)return!1;var r=Object.keys(e),i=Object.keys(n),a=r.length;if(i.length!==a)return!1;for(var o=0;o<a;o++){var s=r[o];if(e[s]!==n[s]||!Object.prototype.hasOwnProperty.call(n,s))return!1}return!0}Zt=W.shallowEqual=Ja;const Yt="data:image/svg+xml,%3csvg%20width='8'%20height='6'%20viewBox='0%200%208%206'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M4.143%203.53557C4.06455%203.6158%203.93545%203.6158%203.857%203.53557L1.34332%200.964758C1.09401%200.709786%200.683764%200.709786%200.434458%200.964759C0.192951%201.21176%200.192951%201.60643%200.434458%201.85342L3.28499%204.76874C3.67725%205.16992%204.32275%205.16992%204.71501%204.76874L7.56554%201.85342C7.80705%201.60643%207.80705%201.21176%207.56554%200.964759C7.31624%200.709786%206.90599%200.709786%206.65668%200.964759L4.143%203.53557Z'%20fill='%23ABB5C0'/%3e%3c/svg%3e",Xa=l.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  padding: 0.4rem;
  overflow: hidden;
  background: ${({theme:e})=>e.bgColors.secondary};
`,Qa=l.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  ${({width:e,height:n})=>e&&n?v`
          width: ${e}px;
          height: ${n}px;
        `:null}
`,es=({icon:e,width:n=34,height:r=34})=>{const i=a=>{a.currentTarget.src=Ln};return t.jsx(Xa,{children:t.jsx(Qa,{width:n,height:r,src:e||Ln,onError:i,loading:"lazy",alt:"Coin icon"})})},ns=l.div`
  display: grid;
  grid-template-columns: 1fr 12px;
  align-items: center;
  justify-content: space-between;
  @media (${w.SM}) {
    cursor: pointer;
    ${({isSelectDisabled:e})=>e&&v`
        cursor: initial;
      `}
  }
`,ts=l.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`,rs=l.div`
  display: flex;
  align-items: center;
  column-gap: 1rem;
  width: 108px;
`,is=l.div`
  position: relative;
`,as=l.img`
  position: absolute;
  top: -3px;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
`,ss=l.div`
  ${an}
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,He=l.div`
  ${P}
  line-height: 120%;
  font-weight: 500;
  color: ${({theme:e})=>e.colors.grey700};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,os=({selectType:e})=>{var g,h;const n=m(z),r=m(he,Zt),i=m(dn),a=m(p=>Fe(p,e)),o=m(_e),s=F(),{symbol:d,name:c,icon:u}=a||{},_=()=>{n||(s(M.setSelectOpen({selectType:e,open:!0,source:null})),ct(s,e,!0))};return t.jsxs(ns,{onClick:_,isSelectDisabled:n,children:[t.jsxs(ts,{children:[c&&!i?t.jsx(He,{children:c}):t.jsx(Z,{width:"80px",height:"12px"}),t.jsxs(rs,{children:[t.jsxs(is,{children:[t.jsx(es,{icon:u&&!i?u:"",width:24,height:24}),e===U&&!i?ue.map(p=>t.jsx(dt.Fragment,{children:p.id==o.id?t.jsx(as,{src:p.icon,alt:p.name}):null},p.id)):null]}),d&&!i?t.jsx(ss,{children:d}):t.jsx(Z,{width:"50px",height:"20px"})]}),e==U&&!n?t.jsx(t.Fragment,{children:(g=r.data)!=null&&g.inAmountInUsd?t.jsx(He,{children:`~ $${r.data.inAmountInUsd||"0"}`}):t.jsx(Z,{width:"80px",height:"12px"})}):null,e==X&&!n?t.jsx(t.Fragment,{children:(h=r.data)!=null&&h.outAmountInUsd&&!r.fetching?t.jsx(He,{children:`~ $${r.data.outAmountInUsd||"0"}`}):t.jsx(Z,{width:"80px",height:"12px"})}):null]}),n?null:t.jsx("div",{children:t.jsx(E,{src:Yt,width:12,height:7,title:"Dropdown"})})]})},ds=l.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`,Pn=l.div`
  ${P}
  font-weight: 500;
  color: ${({theme:e})=>e.colors.grey700};
`,Jt=v`
  ${P}
  font-weight: 500;
  padding: 0.2rem 0.6rem;
  border-radius: 100px;
`,cs=l.button`
  ${Jt}
  background-color: ${({theme:e})=>e.colors.grey500};
  @media (${w.SM}) {
    transition: 0.3s linear;
    &:hover {
      color: ${({theme:e})=>e.colors.primary};
    }
  }
`,ls=l.button`
  ${Jt}
  color:#8498F4;
  background-color: #797bf640;
  @media (${w.SM}) {
    transition: 0.3s linear;
    &:hover {
      color: ${({theme:e})=>e.colors.white};
      background-color: ${({theme:e})=>e.colors.secondary};
    }
  }
`,us=({selectType:e})=>{const n=m(_=>pi(_,e)),r=m(cn),{isMobile:i}=B(),a=F(),o=e===U,{formatted:s,symbol:d}=n||{},c=()=>{G()?a(ge("wallet",!0)):a(M.showWallets(!0))},u=()=>{o&&n&&s&&s!=="0"&&a(A.setAmount({selectType:U,amount:s}))};return t.jsx(ds,{children:t.jsxs(t.Fragment,{children:[t.jsxs(Pn,{children:[t.jsx(C,{id:"balance",defaultMessage:"Balance"}),":"]}),r!=null&&r.isConnected?t.jsxs(t.Fragment,{children:[n&&s?t.jsxs(Pn,{children:[s.slice(0,7)," ",d]}):null,n&&o&&!i?t.jsx(cs,{onClick:u,children:t.jsx(C,{id:"btn.max",defaultMessage:"Max"})}):null]}):t.jsx(ls,{onClick:c,children:t.jsx(C,{id:"btn.connectWallet",defaultMessage:"Connect wallet"})})]})})},gs=l.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`,ms=l.div`
  ${P}
  font-weight: 500;
`,hs=l.input`
  width: 100%;
  ${sn}
  background: none;
`,_s=({selectType:e})=>{const n=m(z),r=m(he,K),i=m(dn),a=m(y=>le(y,e)),o=m(y=>Fe(y,e)),s=N.useRef(!1),{isMobile:d}=B(),c=F(),u=N.useId(),_=e===U,g=e===X,h=y=>{const S=y.target.value;if(o){const D=dr(o.decimals,S);cr.test(S)?(c(A.setAmount({selectType:e,amount:D.replace(/,/,".")})),s.current=!1):D.trim()||(c(A.setAmount({selectType:e,amount:""})),s.current=!0),c(A.resetTimer(!0))}},p=()=>{c(M.blurCoinInput(e))},f=_?"You pay":"You get",x=_?"youPay":"youGet",b=!!(r.fetching||r.error||!r.data||!a||i);return t.jsxs(gs,{children:[t.jsx(ms,{children:t.jsx(C,{id:x,defaultMessage:f})}),b&&g?t.jsx(Z,{width:d?"120px":"160px"}):t.jsx(hs,{id:u,onFocus:()=>c(M.focusCoinInput(e)),onInput:h,onChange:h,onBlur:p,value:a,disabled:g||n,type:"text",pattern:"[0-9]*.|,*",inputMode:"decimal",autoComplete:"off"}),n?null:t.jsx(us,{selectType:e})]})},ps=l.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 0 0 1.8rem;
  border-radius: 8px;
  border: 1px solid ${({theme:e})=>e.colors.secondary};
  background: ${({theme:e})=>e.bgColors.dark200};
  ${({$isRtl:e})=>e&&v`
      padding: 0 1.8rem 0 0;
    `}
`,fs=l.input`
  ${q}
  width: 100%;
  height: 100%;
  font-weight: 500;
  margin: 0 0 0 0.8rem;
  border-radius: 8px;
  background: transparent;
  color: ${({theme:e})=>e.colors.white};
  &::placeholder {
    color: ${({theme:e})=>e.colors.grey300};
  }
  &:autofill,
  &:autofill:hover,
  &:autofill:focus {
    border: transparent;
    -webkit-text-fill-color: ${({theme:e})=>e.colors.white};
    box-shadow: 0 0 0px 1000px ${({theme:e})=>e.bgColors.dark200} inset;
  }
  ${({$isRtl:e})=>e&&v`
      margin: 0 0.8rem 0 0;
    `}
`,ws=l.button`
  display: none;
  @media (${w.SM}) {
    display: inline-block;
    width: 20%;
    height: 100%;
    text-align: end;
    padding: 0 2.8rem 0 0;
    svg {
      transform: rotate(180deg);
    }
    ${({$isRtl:e})=>e&&v`
        padding: 0 0 0 2.8rem;
      `}
  }
`,ys=({selectType:e})=>{const n=F(),r=m(_=>fi(_,e)),i=m(wi),a=m(H),o=N.useRef(null),s=un();N.useEffect(()=>{o.current&&o.current.focus({preventScroll:!0})},[]);const d=_=>{const g=_.target.value;n(An.setSearchCoins({selectType:e,search:g.trim()}))},c=()=>{r&&n(An.setSearchCoins({selectType:e,search:""}))},u=()=>{n(M.setSelectOpen({selectType:e,open:!1,source:null}))};return t.jsxs(ps,{$isRtl:a,children:[t.jsx("div",{children:t.jsx(E,{src:Dr,width:18,height:18,title:"Search icon"})}),t.jsx(fs,{ref:o,onFocus:()=>n(M.focusSearchInput(!0)),onBlur:()=>n(M.focusSearchInput(!1)),onChange:d,value:r,placeholder:s.formatMessage({id:"dex.search",defaultMessage:"Search by name from {coinsCount} coins"},{coinsCount:i}),$isRtl:a}),r?t.jsx("div",{children:t.jsx(Ti,{onClick:c,type:"button",children:t.jsx(E,{src:ai,title:"Clear icon"})})}):t.jsx(t.Fragment,{children:t.jsx(ws,{onClick:u,type:"button",$isRtl:a,children:t.jsx(E,{src:Yt,width:12,height:7,title:"Dropdown icon"})})})]})},xs=l.div`
  position: relative;
  width: 100%;
  height: 100px;
  ${({activeSelect:e})=>e&&v`
      z-index: 9;
    `}
  ${({isSelectDisabled:e})=>e&&v`
      height: 80px;
    `}
`,vs=l.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr minmax(111px, 120px);
  gap: 1rem;
  padding: 1.2rem 1.6rem;
  border-radius: 8px;
  border: 1px solid ${({theme:e})=>e.colors.border};
  background-color: ${({theme:e})=>e.bgColors.dark200};
  @media (${w.SM}) {
    gap: 2rem;
    padding: 1.2rem 2.2rem 1.2rem 1.6rem;
  }
  @media (${w.MD}) {
    padding: 1.2rem 2.2rem 1.2rem 2.4rem;
  }
`,Cs=l.div`
  touch-action: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({theme:e})=>e.bgColors.dark400};
  @media (${w.SM}) {
    position: absolute;
    height: max-content;
    border-radius: 8px;
    border: 1px solid ${({theme:e})=>e.colors.border};
  }
`,bs=l.div`
  touch-action: none;
  padding: 2rem 1.6rem 1.6rem 1.6rem;
  @media (${w.SM}) {
    padding: 1.6rem;
  }
`,Ds=l.div`
  touch-action: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${q}
  font-weight: 600;
  margin-bottom: 2.6rem;
  @media (${w.SM}) {
    display: none;
  }
`,Ss=l.div`
  height: 100%;
  @media (${w.SM}) {
    height: max-content;
    overflow: hidden;
  }
`,On=({selectType:e})=>{const n=m(z),r=m(h=>yi(h,e)),i=m(h=>h.dex.coins[e],K),a=m(h=>xi(h,e)),o=N.useRef(null),s=F(),{isMobile:d}=B();vt(o,h=>{h.target.id!=="coinSelect"&&r&&!d&&u()});const c=h=>{h.preventDefault();const p=h.target.closest("#coinListItem"),f=p&&p.dataset.coinListItem?JSON.parse(p.dataset.coinListItem):null;f&&(s(A.setSelectCoin({selectType:e,coin:f})),s(A.resetTimer(!0)),u())};function u(){s(M.setSelectOpen({selectType:e,open:!1,source:null})),G()&&ct(s,e,!1)}const _=e===U?"You pay":"You get",g=e===U?"youPay":"youGet";return t.jsx(xs,{id:"coinSelect",ref:o,activeSelect:r,isSelectDisabled:n,children:r?t.jsxs(Cs,{children:[t.jsxs(bs,{children:[t.jsxs(Ds,{children:[t.jsx(C,{id:g,defaultMessage:_}),t.jsx(ie,{variant:"bordered",onClose:u})]}),t.jsx(ys,{selectType:e})]}),t.jsx(Ss,{children:t.jsx(Sr,{service:en.DEX,selectType:e,data:i,items:a,selectOpen:r,onSelectClose:()=>u(),handleListItem:c})})]}):t.jsxs(vs,{children:[t.jsx(_s,{selectType:e}),t.jsx(os,{selectType:e})]})})},je="data:image/svg+xml,%3csvg%20width='16'%20height='17'%20viewBox='0%200%2016%2017'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M7.9998%2011.9996C7.5798%2011.9996%207.2998%2011.7196%207.2998%2011.2996V7.79961C7.2998%207.37961%207.5798%207.09961%207.9998%207.09961C8.4198%207.09961%208.6998%207.37961%208.6998%207.79961V11.2996C8.6998%2011.7196%208.4198%2011.9996%207.9998%2011.9996Z'%20fill='%23737F8B'/%3e%3cpath%20d='M7.9998%206.4C8.3864%206.4%208.6998%206.0866%208.6998%205.7C8.6998%205.3134%208.3864%205%207.9998%205C7.61321%205%207.2998%205.3134%207.2998%205.7C7.2998%206.0866%207.61321%206.4%207.9998%206.4Z'%20fill='%23737F8B'/%3e%3ccircle%20cx='8'%20cy='8.5'%20r='6.45'%20stroke='%23737F8B'%20stroke-width='1.1'/%3e%3c/svg%3e",Ms="data:image/svg+xml,%3csvg%20width='14'%20height='14'%20viewBox='0%200%2014%2014'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M7%202.625H10.5C10.9832%202.625%2011.375%203.01675%2011.375%203.5V7'%20stroke='%23737F8B'%20stroke-width='1.1375'%20stroke-linecap='round'/%3e%3cpath%20d='M7%2011.375L3.5%2011.375C3.01675%2011.375%202.625%2010.9832%202.625%2010.5L2.625%207'%20stroke='%23737F8B'%20stroke-width='1.1375'%20stroke-linecap='round'/%3e%3c/svg%3e",Un="data:image/svg+xml,%3csvg%20width='5'%20height='8'%20viewBox='0%200%205%208'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M3.03557%203.857C3.1158%203.93545%203.1158%204.06455%203.03557%204.143L0.464758%206.65668C0.209786%206.90599%200.209786%207.31624%200.464759%207.56554C0.711755%207.80705%201.10643%207.80705%201.35342%207.56554L4.26874%204.71501C4.66992%204.32275%204.66992%203.67725%204.26874%203.28499L1.35342%200.434458C1.10643%200.192951%200.711755%200.19295%200.464758%200.434458C0.209786%200.683764%200.209786%201.09401%200.464758%201.34332L3.03557%203.857Z'%20fill='%23737F8B'/%3e%3c/svg%3e",Xt="data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M3.86454%201.81836C3.1214%201.81836%202.50098%202.43878%202.50098%203.18192V17.4993C2.50098%2017.6801%202.57281%2017.8536%202.70067%2017.9814C2.82852%2018.1093%203.00194%2018.1811%203.18276%2018.1811H11.3641C11.545%2018.1811%2011.7184%2018.1093%2011.8462%2017.9814C11.9741%2017.8536%2012.0459%2017.6801%2012.0459%2017.4993V14.4313C12.0459%2014.3409%2012.0818%2014.2542%2012.1458%2014.1903C12.2097%2014.1263%2012.2964%2014.0904%2012.3868%2014.0904H12.7277C13.1122%2014.0904%2013.4095%2014.3877%2013.4095%2014.7722V15.454C13.4095%2016.5755%2014.3333%2017.4993%2015.4548%2017.4993C16.5763%2017.4993%2017.5002%2016.5755%2017.5002%2015.454V6.59083C17.5002%205.94791%2017.1968%205.34044%2016.682%204.95455L14.5003%203.31828C14.3555%203.21014%2014.1738%203.16377%2013.9949%203.18933C13.816%203.21489%2013.6545%203.31028%2013.5458%203.45463C13.4379%203.59948%2013.3916%203.78116%2013.4172%203.96C13.4427%204.13884%2013.538%204.3003%2013.6822%204.40913L14.5003%205.02273C14.585%205.08624%2014.6537%205.16858%2014.7011%205.26325C14.7484%205.35792%2014.773%205.46231%2014.773%205.56816V7.27261C14.773%207.90121%2015.2142%208.44118%2015.7998%208.5939C15.9812%208.64094%2016.1366%208.78889%2016.1366%208.97706V15.454C16.1366%2015.8385%2015.8393%2016.1358%2015.4548%2016.1358C15.0703%2016.1358%2014.773%2015.8385%2014.773%2015.454V14.7722C14.773%2013.6507%2013.8492%2012.7269%2012.7277%2012.7269H12.3868C12.2964%2012.7269%2012.2097%2012.6909%2012.1458%2012.627C12.0818%2012.5631%2012.0459%2012.4764%2012.0459%2012.386V3.18192C12.0459%202.43878%2011.4255%201.81836%2010.6824%201.81836H3.86454ZM4.20543%203.18192H10.3415C10.5303%203.18192%2010.6824%203.33396%2010.6824%203.52281V8.29528C10.6824%208.48413%2010.5303%208.63617%2010.3415%208.63617H4.20543C4.16064%208.63626%204.11627%208.6275%204.07487%208.6104C4.03347%208.59331%203.99586%208.5682%203.96418%208.53653C3.93251%208.50485%203.9074%208.46724%203.8903%208.42584C3.87321%208.38444%203.86445%208.34007%203.86454%208.29528V3.52281C3.86454%203.33396%204.01658%203.18192%204.20543%203.18192Z'%20fill='%23737F8B'/%3e%3c/svg%3e",js=l.div`
  ${P}
  margin: 1.2rem 0 2.4rem 0;
  @media (${w.SM}) {
    margin: 1.2rem 0 2.2rem 0;
  }
  @media (${w.MD}) {
    margin: 1.2rem 0 2.2rem 0;
  }
`,Es=l.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  @media (${w.SM}) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
  }
`,xe=l.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem;
  line-height: 150%;
  &:last-child {
    margin-bottom: 0;
  }
`,qe=l.span`
  line-height: 0;
  margin: 0 0.4rem 0 0;
  ${({$isRtl:e})=>e?v`
          margin: 0 0 0 0.4rem;
        `:null}
`,Ve=l.span`
  font-weight: 500;
`,We=l.span`
  color: ${({theme:e})=>e.colors.grey700};
`,Fs=l.span`
  font-weight: 500;
  color: ${({theme:e})=>e.colors.secondary};
`,Ke=l.button`
  display: flex;
  align-items: center;
  color: ${({theme:e})=>e.colors.white};
  column-gap: 0.4rem;
  @media (${w.SM}) {
    svg {
      &:last-child {
        path {
          transition: 0.3s linear;
        }
      }
    }
    &:hover {
      ${({styleType:e,disabled:n})=>e==="slippageTolerance"&&!n?v`
              svg {
                path {
                  fill: ${({theme:r})=>r.colors.primary};
                }
              }
            `:null}
      ${({styleType:e,disabled:n})=>e==="route"&&!n?v`
              svg {
                &:last-child {
                  path {
                    stroke: ${({theme:r})=>r.colors.primary};
                  }
                }
              }
            `:null}
      ${({disabled:e})=>e&&v`
          cursor: initial;
        `}
    }
  }
`,$s=()=>{var f,x,b;const e=m(y=>le(y,X)),n=m(z),r=m(ci,K),i=m(he,K),a=m(dn),o=m(vi),s=m(H),d=m(y=>le(y,U)),c=m(y=>Fe(y,U)),u=m(y=>Fe(y,X)),{isMobile:_}=B(),g=F(),h=()=>{i.data&&!n&&(G()&&!_?g(ge("routing",!0)):g(M.showSwapRouting(!0)))},p=()=>{n||g(M.showSettings(!0))};return t.jsx(js,{children:t.jsxs(Es,{children:[t.jsxs(xe,{children:[t.jsx(qe,{$isRtl:s,children:t.jsx(E,{src:je,title:"Info"})}),t.jsxs(Ve,{children:[d," ",c==null?void 0:c.symbol]}),t.jsx(We,{children:"="}),!i.fetching&&!a&&((f=i.data)!=null&&f.outAmountInUsd)?t.jsxs(t.Fragment,{children:[e," ",u==null?void 0:u.symbol," ",t.jsx(We,{children:`($${((x=i.data)==null?void 0:x.outAmountInUsd)||"0"})`})]}):t.jsx(Z,{width:"100px",height:"12px"})]}),t.jsxs(xe,{children:[t.jsx(qe,{$isRtl:s,children:t.jsx(E,{src:je})}),t.jsx(Ve,{children:t.jsx(C,{id:"route",defaultMessage:"Route"})}),c&&u&&!i.fetching&&!a?t.jsxs(Ke,{onClick:h,disabled:n,styleType:"route",children:[c.symbol,t.jsx(E,{src:Un,title:"Expand "}),u.symbol,n?null:t.jsx(E,{src:Ms,title:"Expand "})]}):t.jsx(Z,{width:"80px",height:"12px"})]}),t.jsxs(xe,{children:[t.jsx(qe,{$isRtl:s,children:t.jsx(E,{src:je})}),t.jsxs(Ke,{onClick:p,disabled:n,styleType:"slippageTolerance",children:[t.jsxs(Ve,{children:[t.jsx(C,{id:"dex.slippageTolerance",defaultMessage:"Slippage Tolerance"}),":"]}),r.slippage.value," %",n?null:t.jsx(E,{src:Un,title:"Expand"})]})]}),t.jsxs(xe,{children:[t.jsx(E,{src:Xt}),o&&((b=i.data)!=null&&b.estimatedGasInUsd)&&!i.fetching&&!a?t.jsxs(Ke,{onClick:p,disabled:n,children:["~",o,t.jsx(We,{children:`(~$${i.data.estimatedGasInUsd||"0"})`}),n?null:t.jsx(Fs,{children:t.jsx(C,{id:"edit",defaultMessage:"Edit"})})]}):t.jsx(Z,{width:"80px",height:"12px"})]})]})})},Is=l.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 11;
  overflow: hidden;
  border-radius: 0 0 6px 6px;
  background-color: ${({theme:e})=>e.bgColors.dark400};
  ${({defaultStep:e})=>e?null:v`
          border-radius: 6px;
        `}
  @media (${w.SM}) {
    border-radius: 6px 0 6px 6px;
    ${({defaultStep:e})=>e?null:v`
            border-radius: 6px;
          `}
    ${({$isRtl:e})=>e&&v`
        border-radius: 0 6px 6px 6px;
      `}
  }
`,Ze=({show:e,children:n,defaultStep:r})=>{const i=m(H);return e?t.jsx(Is,{defaultStep:r,$isRtl:i,children:n}):null},Ts="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M6%209.81V2.132H7.452V8.523H10.477V9.81H6Z'%20fill='%23737F8B'/%3e%3cpath%20d='M16.8403%209.81H11.5163V8.468L13.9253%206.356C14.336%205.99667%2014.6367%205.674%2014.8273%205.388C15.018%205.09467%2015.1133%204.77933%2015.1133%204.442V4.299C15.1133%203.96167%2015.0033%203.705%2014.7833%203.529C14.5633%203.34567%2014.2957%203.254%2013.9803%203.254C13.5843%203.254%2013.2837%203.36767%2013.0783%203.595C12.873%203.815%2012.7263%204.08267%2012.6383%204.398L11.3843%203.914C11.465%203.65733%2011.5787%203.41533%2011.7253%203.188C11.872%202.95333%2012.0553%202.748%2012.2753%202.572C12.5027%202.396%2012.7667%202.25667%2013.0673%202.154C13.368%202.05133%2013.7127%202%2014.1013%202C14.5047%202%2014.864%202.05867%2015.1793%202.176C15.4947%202.286%2015.7587%202.44367%2015.9713%202.649C16.1913%202.85433%2016.3563%203.09633%2016.4663%203.375C16.5837%203.65367%2016.6423%203.958%2016.6423%204.288C16.6423%204.61067%2016.591%204.904%2016.4883%205.168C16.3857%205.432%2016.2463%205.685%2016.0703%205.927C15.8943%206.16167%2015.689%206.389%2015.4543%206.609C15.2197%206.82167%2014.9703%207.038%2014.7063%207.258L13.0893%208.589H16.8403V9.81Z'%20fill='%23737F8B'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M15.6464%2015.9565C15.7402%2015.8627%2015.8673%2015.8101%2015.9999%2015.8101C16.1325%2015.8101%2016.2596%2015.8627%2016.3534%2015.9565L18.8534%2018.4565C18.9471%2018.5502%2018.9998%2018.6774%2018.9998%2018.81C18.9998%2018.9425%2018.9471%2019.0697%2018.8534%2019.1635L16.3534%2021.6635C16.2591%2021.7545%2016.1328%2021.8049%2016.0017%2021.8038C15.8706%2021.8026%2015.7452%2021.7501%2015.6525%2021.6574C15.5598%2021.5647%2015.5072%2021.4393%2015.5061%2021.3082C15.5049%2021.1771%2015.5553%2021.0508%2015.6464%2020.9565L17.7929%2018.81L15.6464%2016.6635C15.5527%2016.5697%2015.5%2016.4425%2015.5%2016.31C15.5%2016.1774%2015.5527%2016.0502%2015.6464%2015.9565Z'%20fill='%23737F8B'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M6.5%2014.8101C6.63261%2014.8101%206.75979%2014.8627%206.85355%2014.9565C6.94732%2015.0503%207%2015.1775%207%2015.3101V16.8101C7%2017.2079%207.15804%2017.5894%207.43934%2017.8707C7.72064%2018.152%208.10218%2018.3101%208.5%2018.3101H18.5C18.6326%2018.3101%2018.7598%2018.3627%2018.8536%2018.4565C18.9473%2018.5503%2019%2018.6775%2019%2018.8101C19%2018.9427%2018.9473%2019.0698%2018.8536%2019.1636C18.7598%2019.2574%2018.6326%2019.3101%2018.5%2019.3101H8.5C7.83696%2019.3101%207.20107%2019.0467%206.73223%2018.5778C6.26339%2018.109%206%2017.4731%206%2016.8101V15.3101C6%2015.1775%206.05268%2015.0503%206.14645%2014.9565C6.24021%2014.8627%206.36739%2014.8101%206.5%2014.8101Z'%20fill='%23737F8B'/%3e%3c/svg%3e",As=l.div`
  width: 100%;
  border: 0;
  opacity: 0;
  padding: 2rem 1.6rem;
  pointer-events: none;
  transition: 0.2s ease-in;
  background-color: ${({theme:e})=>e.bgColors.dark400};
  ${({active:e})=>e?v`
          opacity: 1;
          pointer-events: all;
        `:null}
  @media (${w.SM}) {
    position: absolute;
    left: 0;
    bottom: 64px;
    min-width: 200px;
    max-width: max-content;
    z-index: 10;
    padding: 0.6rem;
    overflow: hidden;
    border-radius: 6px;
    box-shadow: 0px 4px 33px 0px #00000040;
  }
`,Bs=l.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${an}
  font-weight: 500;
  margin-bottom: 1.6rem;
`,Ls=l.ul`
  height: ${lt};
  width: 100%;
  overflow-y: auto;
  line-height: 0;
  ${pe}
  @media (${w.SM}) {
    height: 342px;
  }
  @media (${w.MD}) {
    height: 290px;
    ${({isStep1:e})=>e?null:v`
            height: 238px;
          `}
  }
`,Ns=l.li`
  height: 4.8rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mt}
  font-weight: 500;
  padding: 0 0.6rem;
  margin-right: 0.6rem;
  &:hover {
    cursor: pointer;
    border-radius: 6px;
    background-color: ${({theme:e})=>e.colors.grey801};
  }
  @media (${w.SM}) {
    height: 3.8rem;
    transition: 0.3s linear;
  }
`,ks=l.div`
  display: flex;
  align-items: center;
  column-gap: 0.8rem;
`,Rs=l.img`
  width: 24px;
  height: 24px;
`,Hn="dexChainItem",Qt=()=>{const e=m(ln),n=m(me),r=m(_e),{isMobile:i}=B(),a=F(),o=s=>{const d=s.target.closest("#"+Hn),c=d&&d.dataset.chainItem?JSON.parse(d.dataset.chainItem):null;c&&(ut(c.id),a(M.showChains(!1)))};return t.jsxs(As,{active:e,children:[i?t.jsxs(Bs,{children:[t.jsx(C,{id:"connectWallet",defaultMessage:"Connect Wallet"}),t.jsx(ie,{variant:i?"bordered":"default",onClose:()=>a(M.showChains(!1))})]}):null,t.jsx(Ls,{onClick:o,isStep1:n,children:e&&ue.map(s=>t.jsxs(Ns,{id:Hn,"data-chain-item":JSON.stringify({id:s.id,code:s.code,network:s.network,source:!1}),children:[t.jsxs(ks,{children:[s.layerTwo?t.jsx("div",{children:t.jsx(E,{src:Ts,width:18,height:18,title:"Checkmark icon"})}):null,t.jsx(Rs,{src:s.icon,alt:s.name}),t.jsx("span",{children:s.name})]}),r.id===s.id?t.jsx("div",{children:t.jsx(E,{src:ze,width:18,height:18,title:"Checkmark icon"})}):null]},s.id))})]})},Gs="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M10.5708%2012.1431C10.4906%2012.0646%2010.4906%2011.9355%2010.5708%2011.8571L14.0473%208.45784C14.3873%208.12543%2014.3873%207.57843%2014.0473%207.24603C13.718%206.92402%2013.1918%206.92402%2012.8624%207.24603L8.73158%2011.2851C8.33041%2011.6773%208.33041%2012.3228%208.73158%2012.7151L12.8624%2016.7541C13.1918%2017.0761%2013.718%2017.0761%2014.0473%2016.7541C14.3873%2016.4217%2014.3873%2015.8747%2014.0473%2015.5423L10.5708%2012.1431Z'%20fill='white'/%3e%3c/svg%3e",Ps="data:image/svg+xml,%3csvg%20width='20'%20height='21'%20viewBox='0%200%2020%2021'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M13.75%208.41602C12.3333%208.41602%2010.9167%207.91602%209.5%206.99935C7.25%205.49935%205.16667%205.49935%202.91667%206.99935C2.58333%207.24935%202.08333%207.16602%201.83333%206.83268C1.58333%206.41602%201.66667%205.91602%202%205.66602C4.83333%203.83268%207.66667%203.83268%2010.4167%205.66602C12.6667%207.16602%2014.75%207.16602%2017%205.66602C17.4167%205.41602%2017.9167%205.49935%2018.1667%205.91602C18.4167%206.33268%2018.3333%206.83268%2017.9167%207.08268C16.5833%207.99935%2015.1667%208.41602%2013.75%208.41602ZM13.75%2016.7493C12.3333%2016.7493%2010.9167%2016.2493%209.5%2015.3327C7.25%2013.8327%205.16667%2013.8327%202.91667%2015.3327C2.5%2015.5827%202%2015.4993%201.75%2015.0827C1.5%2014.666%201.58333%2014.166%202%2013.916C4.83333%2012.0827%207.66667%2012.0827%2010.4167%2013.916C12.6667%2015.416%2014.75%2015.416%2017%2013.916C17.4167%2013.666%2017.9167%2013.7493%2018.1667%2014.166C18.4167%2014.5827%2018.3333%2015.0827%2017.9167%2015.3327C16.5833%2016.3327%2015.1667%2016.7493%2013.75%2016.7493ZM13.75%2012.5827C12.3333%2012.5827%2010.9167%2012.0827%209.5%2011.166C7.25%209.66602%205.16667%209.66602%202.91667%2011.166C2.5%2011.416%202%2011.3327%201.75%2010.916C1.5%2010.4993%201.58333%209.99935%202%209.74935C4.83333%207.91602%207.66667%207.91602%2010.4167%209.74935C12.6667%2011.2493%2014.75%2011.2493%2017%209.74935C17.4167%209.49935%2017.9167%209.58268%2018.1667%209.99935C18.4167%2010.416%2018.3333%2010.916%2017.9167%2011.166C16.5833%2012.166%2015.1667%2012.5827%2013.75%2012.5827Z'%20fill='%23737F8B'/%3e%3c/svg%3e",Os=[{id:1,type:"slippage",title:"Slippage tolerance",icon:Ps,options:["0.1","0.5","1"],localeId:"dex.settings.slippage.description",description:"If the exchange rate changes by more than a specified percentage during a transaction, the transaction will be canceled."},{id:2,type:"gasPrice",title:"Gas price",icon:Xt,options:["3","3.5","5"],localeId:"dex.settings.gas.description",description:"Gas is the essential fuel for the Ethereum network. A higher gas price results in faster transaction completion but requires a larger amount of ether as payment."}],bn=v`
  ${q}
  font-weight: 600;
`,Us=l.div`
  padding: 2rem 1.6rem;
  background-color: ${({theme:e})=>e.bgColors.dark400};
  @media (${w.SM}) {
    padding: 2.2rem 3rem;
  }
`,er=l.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`,nr=l.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  ${bn}
`,Hs=l.button`
  ${bn}
  @media (${w.SM}) {
    transition: 0.3s linear;
    &:hover {
      color: ${({theme:e})=>e.colors.primary};
    }
  }
`,qn=l.span`
  ${bn}
  @media (${w.LG}) {
    font-size: 2rem;
  }
`,qs=l.button`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid ${({theme:e})=>e.colors.border};
  margin: 0 1.4rem 0 0;
  ${({$isRtl:e})=>e&&v`
      margin: 0 0 0 1.4rem;
    `}
  @media (${w.SM}) {
    svg {
      path {
        transition: 0.3s linear;
      }
    }
    &:hover {
      svg {
        path {
          fill: ${({theme:e})=>e.colors.primary};
        }
      }
    }
  }
`,Vs=l.div`
  @media (${w.MD}) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4.2rem;
  }
`,Ws=l.div`
  margin-top: 2.4rem;
`,Ks=l.p`
  ${P}
  font-weight: 500;
  color: ${({theme:e})=>e.colors.grey300};
`,Zs=l.menu`
  display: flex;
  padding: 0.6rem;
  border-radius: 16px;
  margin: 2rem 0 0.8rem 0;
  overflow: hidden;
  background-color: ${({theme:e})=>e.bgColors.dark200};
  color: ${({theme:e})=>e.colors.grey700};
`,zs=l.button`
  ${P}
  min-width: max-content;
  width: 100%;
  height: 100%;
  font-weight: 500;
  padding: 0.8rem 1.3rem;
  border-radius: 14px;
  line-height: 150%;
  color: ${({theme:e})=>e.colors.grey700};
  ${({currentValue:e})=>e?v`
          color: ${({theme:n})=>n.colors.white};
          background-color: ${({theme:n})=>n.colors.secondary};
        `:null}
  @media (${w.LG}) {
    ${q}
    padding: 0.8rem 1.6rem;
    color: ${({theme:e})=>e.colors.grey700};
    transition: 0.3s linear;
    &:hover {
      color: ${({theme:e})=>e.colors.white};
    }
    ${({currentValue:e})=>e?v`
            color: ${({theme:n})=>n.colors.white};
            background-color: ${({theme:n})=>n.colors.secondary};
          `:null}
  }
`,Ys=l.input`
  width: 100%;
  text-align: center;
  font-weight: 500;
  color: ${({theme:e})=>e.colors.white};
  background-color: ${({theme:e})=>e.bgColors.dark200};
  border: 1px solid transparent;
  &::placeholder {
    color: ${({theme:e})=>e.colors.grey700};
  }
  &:focus {
    border-color: ${({theme:e})=>e.colors.secondary};
    border-radius: 16px;
  }
  ${({currentValue:e})=>e?v`
          border-color: ${({theme:n})=>n.colors.secondary};
          border-radius: 16px;
        `:null}
  @media (${w.LG}) {
    ${q}
  }
`,Vn="dexSettingsItem",Js=({data:e})=>{const[n,r]=N.useState(!1),i=F(),a=m(g=>li(g,e.type),K),o=e.type=="slippage",s=a.type==="input",d=(g,h,p)=>{i(A.setSettings({settingsType:g,value:{type:h,value:p}})),ur("local",g,JSON.stringify({variant:g,type:h,value:p}))},c=g=>{const h=g.target.closest("#"+Vn),p=h&&h.dataset.settingsItem?JSON.parse(h.dataset.settingsItem):null;p&&d(p.type,"button",p.value)},u=g=>{const h=g.target.value;(lr.test(h)||h==="")&&d(e.type,"input",h)},_=()=>{if(r(!1),!a.value){const g=o?"0.1":"3";d(e.type,"button",g)}};return t.jsxs(Ws,{children:[t.jsxs(er,{children:[t.jsxs(nr,{children:[t.jsx(E,{src:e.icon}),t.jsx(qn,{children:e.title}),t.jsx(E,{src:je})]}),t.jsxs(qn,{children:[a.value," %"]})]}),t.jsxs(Zs,{onClick:c,children:[e.options.map((g,h)=>t.jsxs(zs,{id:Vn,currentValue:a.value===g&&!s&&!n,"data-settings-item":JSON.stringify({value:g,type:e.type}),children:[e.type=="slippage"?`${g} %`:null,e.type=="gasPrice"?t.jsxs(t.Fragment,{children:[h==0?`Low (${g}) %`:null,h==1?`Medium (${g}) %`:null,h==2?`High (${g}) %`:null]}):null]},h)),t.jsx(Ys,{onChange:u,value:s?a.value:"",currentValue:!!(s&&a.value),onFocus:()=>r(!0),onBlur:_,type:"text",inputMode:"decimal",placeholder:"Custom"})]}),t.jsx(Ks,{children:e.description})]})},Xs=()=>{const e=m(H),n=F(),r=un();return t.jsxs(Us,{children:[t.jsxs(er,{children:[t.jsxs(nr,{children:[t.jsx(qs,{onClick:()=>n(M.showSettings(!1)),$isRtl:e,children:t.jsx(E,{src:Gs,title:"Go back icon"})}),t.jsx(C,{id:"dex.settings.title",defaultMessage:"Settings"})]}),t.jsx(Hs,{onClick:()=>n(A.setResetSettings()),children:t.jsx(C,{id:"dex.settings.reset",defaultMessage:"Reset"})})]}),t.jsx(Vs,{children:Os.map(i=>t.jsx(Js,{data:{...i,description:r.formatMessage({id:i.localeId,defaultMessage:i.description})}},i.id))})]})},Qs=l.div`
  width: max-content;
  display: flex;
  align-items: center;
  column-gap: 0.8rem;
  padding: 0.8rem;
  border-radius: 100px;
  border: 5px solid ${({theme:e})=>e.bgColors.dark400};
  background-color: ${({theme:e})=>e.colors.grey801};
  img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  span {
    ${P}
    font-weight: 500;
  }
  @media (${w.SM}) {
    margin: 0 0.5rem;
  }
  @media (${w.MD}) {
    margin: 0 1rem;
  }
`,tr=({data:e})=>{const{icon:n,name:r,tootlitpInfo:i}=e;return t.jsx(Pi,{text:i,position:{top:"-40px"},children:t.jsxs(Qs,{children:[n?t.jsx("img",{src:n,alt:"Coin icon"}):null,r?t.jsx("span",{children:r}):null]})})},eo=l.div`
  margin: 0 0 0 3rem;
  ${({$isRtl:e})=>e&&v`
      margin: 0 3rem 0 0;
    `}
`,no=l.div`
  display: flex;
  align-items: center;
  min-height: 50px;
`;l.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  ${mt};
  font-weight: 500;
  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
  svg {
    transform: rotate(90deg);
  }
  ${({active:e})=>e?v`
          svg {
            transform: rotate(-90deg);
          }
        `:null}
  @media (${w.SM}) {
    svg {
      transition: 0.3s linear;
    }
  }
`;const to=l.div`
  min-height: 20px;
  height: 50%;
  width: 30px;
  margin: -2rem 1.2rem 0 -3.1rem;
  border-radius: 0 0 0 12px;
  border-left: 1px dashed ${({theme:e})=>e.colors.grey700};
  border-bottom: 1px dashed ${({theme:e})=>e.colors.grey700};
  ${({$isRtl:e})=>e&&v`
      margin: -2rem -3.1rem 0 1.2rem;
      border-radius: 0 0 12px 0;
      border-left: none;
      border-right: 1px dashed ${({theme:n})=>n.colors.grey700};
    `}
`;l.div`
  margin: 0 0 0 2rem;
  border-left: 1px dashed ${({theme:e})=>e.colors.grey700};
  ${({$isRtl:e})=>e&&v`
      margin: 0 2rem 0 0;
      border-left: none;
      border-right: 1px dashed ${({theme:n})=>n.colors.grey700};
    `}
`;l.div`
  margin: 0 0 1.6rem -2rem;
  background-color: ${({theme:e})=>e.bgColors.dark400};
  ${({$isRtl:e})=>e&&v`
      margin: 0 -2rem 1.6rem 0;
    `}
`;const ro=({data:e})=>{const n=m(H);return t.jsx(eo,{$isRtl:n,children:t.jsxs(no,{children:[t.jsx(to,{$isRtl:n}),t.jsx(tr,{data:{icon:"",name:gt(e.name),tootlitpInfo:e.part.toString()||""}})]})})},io=l.div`
  padding: 2.2rem 1.6rem;
  @media (${w.SM}) {
    width: 800px;
    max-width: 100%;
    overflow: hidden;
    border-radius: 6px;
    padding: 2rem 2.4rem 5.2rem 2.4rem;
    background-color: ${({theme:e})=>e.bgColors.dark400};
  }
`,ao=l.div`
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  margin-bottom: -4rem;
`,Wn=l.div`
  height: ${lt};
  overflow-y: auto;
  ${pe}
  @media (${w.SM}) {
    height: 100%;
    overflow-y: initial;
  }
`,so=l.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${an}
  font-weight: 600;
  margin-bottom: 1.6rem;
  @media (${w.SM}) {
    ${sn}
    margin-bottom: 3.2rem;
  }
`,oo=l.div`
  min-height: 100px;
  height: max-content;
  overflow: hidden;
  margin: 0 0 0 1.2rem;
  border-left: 1px dashed ${({theme:e})=>e.colors.grey700};
  ${({$isRtl:e})=>e&&v`
      margin: 0 1.2rem 0 0;
      border-left: none;
      border-right: 1px dashed ${({theme:n})=>n.colors.grey700};
    `}
  @media (${w.SM}) {
    min-height: 40px;
    width: 100%;
    margin: 0;
    border-left: none;
    border-bottom: 1px dashed ${({theme:e})=>e.colors.grey700};
  }
`;l.div`
  ${P}
  font-weight: 500;
  padding: 1rem 2rem;
  background-color: ${({theme:e})=>e.bgColors.dark400};
  @media (${w.SM}) {
    margin: 0 1rem;
  }
`;const ve=l.div`
  width: max-content;
  display: flex;
  align-items: center;
  column-gap: 1.2rem;
  padding-bottom: 0.4rem;
  background-color: ${({theme:e})=>e.bgColors.dark400};
  &:last-child {
    padding-top: 0.4rem;
    @media (${w.SM}) {
      padding-bottom: 0.4rem;
    }
  }
`,Ce=l.div`
  ${q}
  font-weight: 500;
`,be=l.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  @media (${w.SM}) {
    width: 32px;
    height: 32px;
  }
`,co=l.div`
  @media (${w.SM}) {
    display: flex;
    justify-content: flex-end;
  }
`,De=l.div`
  width: 7px;
  height: 7px;
  margin: 0 0.9rem;
  border-radius: 50%;
  background-color: ${({theme:e})=>e.colors.secondary};
  @media (${w.SM}) {
    margin: 0 1.3rem;
  }
`,lo=l.div`
  padding: 0 1.6rem;
`,uo=l.div`
  position: relative;
  min-height: 100px;
  border-radius: 0 0 20px 20px;
  border-right: 1px dashed ${({theme:e})=>e.colors.grey700};
  border-left: 1px dashed ${({theme:e})=>e.colors.grey700};
  border-bottom: 1px dashed ${({theme:e})=>e.colors.grey700};
  margin-bottom: -1.6rem;
`,go=l.div`
  position: absolute;
  left: 0;
  z-index: 2;
  width: 100%;
  bottom: -2.3rem;
  padding: 0 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`,mo=l.p`
  ${P}
  margin-top: 6rem;
  color: ${({theme:e})=>e.colors.grey700};
`,rr=()=>{var c,u,_,g,h,p,f,x,b,y,S,D;const e=m(ui,K),n=m(Ci),r=m(bi,K),i=m(H),{isMobile:a}=B(),o=F();if(!(r!=null&&r.length))return null;const{from:s,to:d}=e||{};return t.jsxs(io,{children:[t.jsxs(so,{children:[t.jsx(C,{id:"dex.swapRouter.title",defaultMessage:"Routing"}),t.jsx(ie,{variant:a?"bordered":"default",onClose:()=>o(M.showSwapRouting(!1))})]}),a?t.jsxs(Wn,{children:[t.jsxs("div",{children:[t.jsxs(ve,{children:[t.jsx(be,{src:(c=s.coin)==null?void 0:c.icon,alt:(u=s.coin)==null?void 0:u.symbol}),t.jsxs(Ce,{children:[s.amount," ",(_=s.coin)==null?void 0:_.symbol]})]}),t.jsx(De,{})]}),t.jsx(oo,{$isRtl:i,children:r&&r.length>0?r.map((j,k)=>t.jsx(ro,{data:j},k)):null}),t.jsxs("div",{children:[t.jsx(De,{}),t.jsxs(ve,{children:[t.jsx(be,{src:(g=d.coin)==null?void 0:g.icon,alt:(h=d.coin)==null?void 0:h.symbol}),t.jsxs(Ce,{children:[d.amount," ",(p=d.coin)==null?void 0:p.symbol]})]})]})]}):t.jsxs(t.Fragment,{children:[t.jsxs(Wn,{children:[t.jsxs(ao,{children:[t.jsxs("div",{children:[t.jsxs(ve,{children:[t.jsx(be,{src:(f=s.coin)==null?void 0:f.icon,alt:(x=s.coin)==null?void 0:x.symbol}),t.jsxs(Ce,{children:[s.amount," ",(b=s.coin)==null?void 0:b.symbol]})]}),t.jsx(De,{})]}),t.jsxs("div",{children:[t.jsxs(ve,{children:[t.jsxs(Ce,{children:[d.amount," ",(y=d.coin)==null?void 0:y.symbol]}),t.jsx(be,{src:(S=d.coin)==null?void 0:S.icon,alt:(D=d.coin)==null?void 0:D.symbol})]}),t.jsx(co,{children:t.jsx(De,{})})]})]}),t.jsx(lo,{children:t.jsx(uo,{children:t.jsx(go,{children:r&&r.length>0?r.map((j,k)=>t.jsx(tr,{data:{icon:"",name:gt(j.name),tootlitpInfo:`${j.part} %`||""}},k)):null})})})]}),t.jsx(mo,{children:t.jsx(C,{id:"dex.swapRoute.description",values:{price:`$${n}`},defaultMessage:`The most cost-effective route is priced at approximately {price} in
              terms of gas expenses. This route optimizes token acquisition while
              considering route segmentation, intricate paths, and gas costs at
              each stage.`})})]})]})},ho=()=>{const e=m(wt),n=m(yt),r=m(ln),i=m(me),{isMobile:a}=B();return t.jsxs(t.Fragment,{children:[t.jsx(Ze,{defaultStep:i,show:n,children:t.jsx(Xs,{})}),t.jsx(Ze,{defaultStep:i,show:e&&a,children:t.jsx(rr,{})}),t.jsx(Ze,{defaultStep:i,show:r&&a,children:t.jsx(Qt,{})})]})},_o=l.div`
  overflow: hidden;
  padding: 2rem 1.6rem;
  border-radius: 6px;
  ${pe};
  @media (${w.SM}) {
    width: 802px;
    max-width: 100%;
  }
`,po=l.div`
  height: 550px;
  overflow-y: auto;
  overflow-x: hidden;
  ${pe};
  @media (${w.SM}) {
    height: max-content;
  }
`,Kn=l.div`
  margin-top: 3.2rem;
`,fo=l.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${sn};
  font-weight: 600;
  margin-bottom: 1.6rem;
`,Zn=l.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.6rem;
`,zn=l.div`
  width: 26px;
  height: 26px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  color: ${({theme:e})=>e.colors.grey100};
  background: ${({theme:e})=>e.bgColors.secondary};
`,Yn=l.div`
  ${q}
  font-weight: 500;
`,Jn=l.ul`
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, 74px);
  column-gap: 0.8rem;
  row-gap: 1.6rem;
  ${({agreeToTerms:e})=>e?null:v`
          &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0.5;
            background: linear-gradient(
              80.26deg,
              #2a2f34 -9.48%,
              #1f2328 119.79%
            );
          }
        `}
  @media (${w.SM}) {
    column-gap: 7rem;
  }
  @media (${w.MD}) {
    column-gap: 8rem;
  }
`,Xn=l.li`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: max-content;
  @media (${w.SM}) {
    width: 114px;
    height: 110px;
    border-radius: 8px;
    transition: 0.3s linear;
    &:hover {
      cursor: pointer;
      background-color: ${({theme:e})=>e.colors.grey801};
    }
  }
`,Qn=l.div`
  position: relative;
`,et=l.img`
  width: 48px;
  height: 48px;
  @media (${w.SM}) {
    width: 64px;
    height: 64px;
  }
`,nt=l.div`
  ${P}
  font-weight: 500;
  line-height: 150%;
  text-align: center;
  margin-top: 0.4rem;
`,tt=l.div`
  position: absolute;
  right: -1rem;
  bottom: 0.2rem;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${({theme:e})=>e.bgColors.dark400};
  @media (${w.SM}) {
    width: 24px;
    height: 24px;
  }
`,rt=l.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${({theme:e})=>e.colors.primary};
  svg {
    width: 13px;
    height: auto;
    path {
      stroke: ${({theme:e})=>e.bgColors.dark400};
    }
  }
  @media (${w.SM}) {
    width: 20px;
    height: 20px;
  }
  @media (${w.MD}) {
    svg {
      path {
        stroke: ${({theme:e})=>e.colors.grey801};
      }
    }
  }
`,it="dexChainItem",at="dexWalletItem",wo=()=>{const e=m(_e),n=m(gi),r=m(gr),i=m(cn),a=m(xt),o=F(),{isMobile:s}=B(),d=u=>{const _=u.target.closest("#"+it),g=_&&_.dataset.chainItem?JSON.parse(_.dataset.chainItem):null;g&&ut(g.id)},c=async u=>{const _=u.target.closest("#"+at),g=_&&_.dataset.wallet?_.dataset.wallet:null;hr(g)&&(g===_r.META_MASK&&!r?window.open("https://metamask.io","_blank"):pr(g),o(M.showWallets(!1)))};return t.jsxs(_o,{children:[t.jsxs(fo,{children:[t.jsx(C,{id:"connectWallet",defaultMessage:"Connect Wallet"}),t.jsx(ie,{variant:s?"bordered":"default",onClose:()=>o(M.showWallets(!1))})]}),t.jsxs(po,{children:[t.jsx(Hi,{checked:n,setChecked:()=>o(A.setAgreeToTerms(!n)),children:t.jsx(tn,{template:"dexConnectWallet"})}),t.jsxs(Kn,{children:[t.jsxs(Zn,{children:[t.jsx(zn,{children:"1"}),t.jsx(Yn,{children:t.jsx(C,{id:"menu.networks.title",defaultMessage:"Choose Network"})})]}),t.jsx(Jn,{onClick:d,agreeToTerms:n,children:a&&ue.map(u=>t.jsxs(Xn,{id:it,"data-chain-item":JSON.stringify({id:u.id,code:u.code,network:u.network,source:!1}),children:[t.jsxs(Qn,{children:[t.jsx(et,{src:u.icon,alt:u.name}),e.id===u.id&&n?t.jsx(tt,{children:t.jsx(rt,{children:t.jsx(E,{src:ze,title:"Checked icon"})})}):null]}),t.jsx(nt,{children:u.name})]},u.id))})]}),t.jsxs(Kn,{children:[t.jsxs(Zn,{children:[t.jsx(zn,{children:"2"}),t.jsx(Yn,{children:t.jsx(C,{id:"connectWallet",defaultMessage:"Connect Wallet"})})]}),t.jsx(Jn,{onClick:c,agreeToTerms:n,children:a&&mr.map(u=>t.jsxs(Xn,{id:at,"data-wallet":u.id,children:[t.jsxs(Qn,{children:[t.jsx(et,{src:u.icon,alt:u.name}),(i==null?void 0:i.connectorId)===u.id&&n?t.jsx(tt,{children:t.jsx(rt,{children:t.jsx(E,{src:ze,title:"Checked icon"})})}):null]}),t.jsx(nt,{children:u.name})]},u.id))})]})]})]})},yo=l.div`
  width: 588px;
  max-width: 100%;
  border-radius: 6px;
  padding: 2rem 2rem 3.2rem 2rem;
  background-color: ${({theme:e})=>e.bgColors.dark400};
`,xo=l.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.6rem;
  & > button {
    margin-top: 0.7rem;
  }
  @media (${w.SM}) {
    align-items: center;
    & > button {
      margin-top: 0;
    }
  }
`,vo=l.h3`
  font-size: 2rem;
  font-weight: 500;
  color: ${({theme:e})=>e.colors.white};
  text-align: center;
  margin: 0 2rem 0 0;
  ${({$isRtl:e})=>e?v`
          margin: 0 0 0 2rem;
        `:null}
  @media (${w.SM}) {
    font-size: 2.4rem;
    text-align: start;
  }
`,Co=l.div`
  margin: 1.6rem 0;
`,bo=l.div`
  overflow: hidden;
  padding: 1.2rem 0.6rem 1.2rem 0;
  border-radius: 8px;
  background-color: ${({theme:e})=>e.bgColors.dark200};
`,Do=l.div`
  max-height: 300px;
  overflow-y: auto;
  padding: 0 1.6rem;
  ${pe}
  background-color: ${({theme:e})=>e.bgColors.dark200};
`,So=l.span`
  ${q}
  font-weight: 500;
  margin-bottom: 0.8rem;
`,Mo=l.ul`
  ${q}
  font-weight: 500;
  padding: 0 0 0 3rem;
  ${({$isRtl:e})=>e?v`
          padding: 0 3rem 0 0;
        `:null}
  li {
    line-height: 150%;
    list-style: disc;
  }
`,jo=()=>{const e=m(Di),n=m(H),r=m(Q),i=m(fr),a=F(),o=()=>{a(M.showAgreeModal(!1))},s=()=>{a(A.signMessage(wr))};return t.jsx(Ie,{isOpen:!G()&&e,onClose:()=>o(),children:t.jsxs(yo,{children:[t.jsxs(xo,{children:[t.jsx(vo,{$isRtl:n,children:t.jsx(C,{id:"dex.agreeModal.title",defaultMessage:"Terms and Conditions agreement"})}),t.jsx(ie,{onClose:()=>o()})]}),t.jsx(tn,{template:"dexSignWallet"}),t.jsx(Co,{children:t.jsx(bo,{children:t.jsxs(Do,{children:[t.jsx(So,{children:t.jsx(C,{id:"dex.agreeModal.text",defaultMessage:"For these Terms of Use the following terminology applies:"})}),t.jsx(Mo,{$isRtl:n,children:t.jsx(C,{id:"dex.agreeModal.list",values:{li:d=>t.jsx("li",{children:d}),a:d=>t.jsx("a",{href:`${i}`,target:"_blank",rel:"noreferrer",children:d}),br:t.jsx("br",{})},defaultMessage:"<li>“Exolix”, “Website’, “the Services”, “We”, “Us” refer to <a>https://exolix.com</a> and all the related products of the company (the mobile application) as well as the company owning and managing this Website.</li> <li>“User”, “You”, “Your” refer to you, a natural or legal person, who has gained access to the Website and uses its Services through the Website and accepts these Terms of Use.</li><li>“Party” refers to either the User or Exolix. The Parties in accordance to these Terms of Use are You and Exolix.</li>"})})]})})}),t.jsx(ee,{entrypoint:r,onClick:s,width:"100%",children:t.jsx(C,{id:"dex.agreeModal.signButton",defaultMessage:"Sign and Proceed"})})]})})},Eo="data:image/svg+xml,%3csvg%20width='81'%20height='81'%20viewBox='0%200%2081%2081'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3ccircle%20cx='40.5'%20cy='40.5'%20r='39.5'%20stroke='url(%23paint0_linear_8373_276256)'%20stroke-width='2'/%3e%3cdefs%3e%3clinearGradient%20id='paint0_linear_8373_276256'%20x1='3.01749e-07'%20y1='40.5'%20x2='81'%20y2='40.5'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='%23797BF6'/%3e%3cstop%20offset='1'%20stop-color='%231F4083'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e",Fo="data:image/svg+xml,%3csvg%20width='81'%20height='81'%20viewBox='0%200%2081%2081'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3ccircle%20cx='40.5'%20cy='40.5'%20r='39.5'%20stroke='%23F75353'%20stroke-width='2'/%3e%3cpath%20d='M27.4336%2027.5L40.3679%2040.4997L27.4336%2053.4994'%20stroke='%23F75353'%20stroke-width='2'/%3e%3cpath%20d='M53.5605%2027.5L40.6262%2040.4997L53.5605%2053.4994'%20stroke='%23F75353'%20stroke-width='2'/%3e%3c/svg%3e",$o="data:image/svg+xml,%3csvg%20width='81'%20height='81'%20viewBox='0%200%2081%2081'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3ccircle%20cx='40.5'%20cy='40.5'%20r='39.5'%20stroke='%236FF7C7'%20stroke-width='2'/%3e%3cpath%20d='M24.5898%2040.5003L34.7148%2049.1788L56.4113%2027.4824'%20stroke='%236FF7C7'%20stroke-width='2'/%3e%3c/svg%3e",Io=l.div`
  position: relative;
  width: 400px;
  max-width: 100%;
  padding: 2.4rem;
  border-radius: 6px;
  background-color: ${({theme:e})=>e.bgColors.dark400};
`,To=l.div`
  position: absolute;
  top: 2.6rem;
  right: 2.4rem;
`,Ao=l.div`
  font-size: 2rem;
  font-weight: 500;
  text-align: center;
  color: ${({theme:e})=>e.colors.white};
`,Bo=l.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2.4rem 0;
`,oe=l.div`
  ${q}
  line-height: 180%;
  text-align: center;
  margin-top: 2.4rem;
`,ir=v`
  font-size: 2.8rem;
  font-weight: 500;
  color: ${({theme:e})=>e.colors.primary};
`,Lo=l.span`
  display: inline-block;
  ${ir}
  margin-top: 1rem;
`,No=l.span`
  ${ir}
`,st=l.span`
  color: ${({theme:e})=>e.colors.grey300};
`,ko=l.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  ${({status:e})=>e==="success"?v`
          button {
            &:first-child {
              margin-bottom: 1.6rem;
            }
          }
        `:null}
`,Ro=si`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Go=l.div`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${Ro} 2s linear infinite;
`,Po=()=>{var y,S,D;const e=m(Si),n=m(Mi),r=m(ji),i=m(_e),a=m(Q),o=F(),s=e.variant==="confirmSign",d=e.variant==="confirmSwap",c=e.variant==="success",u=e.variant==="timeout",_=e.variant==="error",g=r==null?void 0:r.txHash,h=(r==null?void 0:r.txType)||n,p=!!(h&&h===Bn.APPROVE),f=!!(h&&h===Bn.SWAP),x=()=>{o(M.showSwapModal({show:!1,variant:e.variant})),c&&o(nn.clearSwapInfo())},b=ue.find(j=>j.id===i.id);return t.jsx(Ie,{isOpen:!G()&&e.show,onClose:()=>x(),children:t.jsxs(Io,{children:[t.jsxs("div",{children:[t.jsxs(Ao,{children:[s||d?t.jsxs(t.Fragment,{children:[f?t.jsx(C,{id:"dex.swapModal.confirmTitle.swap",defaultMessage:"Confirm swap"}):null,p?t.jsx(C,{id:"dex.swapModal.confirmTitle.approve",defaultMessage:"Confirm approve"}):null]}):null,c?t.jsx(C,{id:"dex.swapModal.successTitle",defaultMessage:"Transaction sent!"}):null,u?t.jsx(C,{id:"dex.swapModal.errorTitle",defaultMessage:"Sign request has expired"}):null,_?t.jsx(C,{id:"dex.swapModal.errorTitle",defaultMessage:"Canceled by user"}):null]}),t.jsx(To,{children:t.jsx(ie,{onClose:()=>x()})})]}),t.jsxs(Bo,{children:[s||d?t.jsx(Go,{children:t.jsx(E,{src:Eo,width:81,height:81,title:"Confirm"})}):null,c?t.jsx(E,{src:$o,width:81,height:81,title:"Success"}):null,u||_?t.jsx(E,{src:Fo,width:81,height:81,title:"Error"}):null,s?t.jsx(oe,{children:t.jsx(C,{id:"dex.swapModal.signText",defaultMessage:"Please, sign message in your wallet. Signing is free and will not send a transaction."})}):null,d?t.jsxs(t.Fragment,{children:[f?t.jsx(oe,{children:t.jsx(C,{id:"dex.swapModal.confirmText.swap",defaultMessage:"Please, confirm swap in your wallet"})}):null,p?t.jsx(oe,{children:t.jsx(C,{id:"dex.swapModal.confirmText.approve",defaultMessage:"Please, confirm approve in your wallet"})}):null]}):null,c?t.jsxs(t.Fragment,{children:[f?t.jsx(oe,{children:t.jsx(C,{id:"dex.swapModal.successText.swap",values:{coinFrom:(y=r==null?void 0:r.from.coin)==null?void 0:y.symbol,amountFrom:r==null?void 0:r.from.amount,amountFromInDollars:t.jsx(st,{children:`($${r==null?void 0:r.from.amountInUsd})`}),coinTo:t.jsx(No,{children:(S=r==null?void 0:r.to.coin)==null?void 0:S.symbol}),amountTo:t.jsx(Lo,{children:r==null?void 0:r.to.amount}),amountToInDollars:t.jsx(st,{children:`($${r==null?void 0:r.to.amountInUsd})`}),br:t.jsx("br",{})},defaultMessage:"Initiated a swap on {coinFrom} {br} from {amountFrom} {coinFrom} { amountFromInDollars} to {br} {amountTo} {coinTo} {br} {amountToInDollars}"})}):null,p?t.jsx(oe,{children:t.jsx(C,{id:"dex.swapModal.successText.approve",values:{coinFrom:(D=r==null?void 0:r.from.coin)==null?void 0:D.symbol},defaultMessage:"Initiated approve on {coinFrom}"})}):null]}):null]}),t.jsxs(ko,{status:e.variant,children:[c&&b?t.jsx(Ai,{entrypoint:a,href:b.viewOn.link+g,target:"_blanck",width:"100%",children:t.jsx(C,{id:"dex.swapModal.viewButton",values:{network:b.viewOn.name},defaultMessage:"View on {network}"})}):null,t.jsx(ee,{entrypoint:a,width:"100%",height:"50px",variant:"grey",onClick:x,children:t.jsx(C,{id:"dex.swapModal.closeButton",defaultMessage:"Close"})})]})]})})},Oo=()=>{const e=m(xt),n=m(wt),{isMobile:r}=B(),i=F();return t.jsxs(t.Fragment,{children:[t.jsx(Ie,{isOpen:!G()&&e,onClose:()=>i(M.showWallets(!1)),isMobile:r,children:t.jsx(wo,{})}),t.jsx(Ie,{isOpen:!G()&&!r&&n,onClose:()=>i(M.showSwapRouting(!1)),children:t.jsx(rr,{})}),t.jsx(jo,{}),t.jsx(Po,{})]})},Uo=()=>{const e=m(h=>le(h,X)),n=m(ht),r=m(_t),i=m(on),a=m(he,K),o=m(pt),s=m(ft),d=m(Q),c=m(Be),{isMobile:u}=B(),_=F(),g=()=>{o?_(nn.getBuildApprove()):G()?_(ge("agree",!0)):_(M.showAgreeModal(!0))};return t.jsx(ee,{height:"60px",entrypoint:d,sizeFont:"1.8rem",onClick:g,width:u?"100%":"210px",style:{backgroundColor:c?`#${c}`:void 0},disabled:i===re.SWAP||n||r||a.fetching||!a.data||s||!e,children:i===re.APPROVE_DIFFERENCE?t.jsx(C,{id:"dex.allowDifference",defaultMessage:"Approve Difference"}):t.jsx(C,{id:"dex.btn.allowToUse",defaultMessage:"Allow to use"})})},Ho=l.button`
  ${({backgroundStyle:e})=>e?v`
          ${Bi};
          height: 60px;
          width: 84px;
          display: flex;
          font-size: 1.8rem;
          align-items: center;
          justify-content: center;
          padding: 0 1rem;
          color: ${({theme:n})=>n.colors.white};
          background: ${e};
          &:hover {
            background: ${e};
            opacity: 0.9;
          }
          @media (${w.MD}) {
            width: 200px;
            padding: 0 1.6rem;
          }
        `:null}
`,qo=l.img`
  margin: 0 1.4rem 0 0;
  ${({$isRtl:e})=>e&&v`
      margin: 0 0 0 1.4rem;
    `}

  @media (${w.MD}) {
    margin: 0;
  }
`,Vo=l.span`
  @media (${w.MD}) {
    margin: 0 2.4rem 0 1rem;
    ${({$isRtl:e})=>e&&v`
        margin: 0 2.4rem 0 1rem;
      `}
  }
`,Wo=l.div`
  transform: rotate(90deg);
  @media (${w.SM}) {
    transition: 0.3s linear;
    ${({showNetworks:e})=>e?v`
            transform: rotate(-90deg);
          `:null}
    svg {
      path {
        stroke: ${({theme:e})=>e.colors.white};
      }
    }
  }
`,Ko=()=>{const e=m(ln),n=m(H),{isMobile:r,isDesktop:i}=B(),a=m(_e),o=F(),s=N.useRef(null),d=N.useId();vt(s,u=>{u.target.id!==d&&e&&!r&&o(M.showChains(!1))});const c=()=>{o(M.showChains(!e)),G()&&o(yr.postMessage({data:{event:xr,payload:{type:"dex/showChains",payload:!1}},source:null}))};return t.jsxs("div",{id:d,ref:s,children:[ue.map(u=>t.jsx(dt.Fragment,{children:u.id===a.id?t.jsxs(Ho,{id:"networkList",onClick:c,backgroundStyle:u.color,children:[t.jsx(qo,{src:u.icon,width:28,height:28,alt:u.name,$isRtl:n}),i?t.jsx(Vo,{$isRtl:n,children:u.name}):null,t.jsx(Wo,{showNetworks:e,children:t.jsx(E,{src:qi,width:7,title:"Dropdown"})})]}):null},u.id)),r?null:t.jsx(Qt,{})]})},Zo=()=>{const e=m(Q),n=m(Be),r=F(),{isMobile:i}=B(),a=()=>{G()?r(ge("wallet",!0)):r(M.showWallets(!0))};return t.jsx(ee,{height:"60px",entrypoint:e,sizeFont:"1.8rem",onClick:a,width:i?"100%":"210px",style:{backgroundColor:n?`#${n}`:void 0},children:t.jsx(C,{id:"connectWallet",defaultMessage:"Connect Wallet"})})},zo=()=>{const e=m(Q),n=F(),r=()=>{n(A.setWalletBusy(!1)),vr()&&n(Cr(!1))};return t.jsx(ee,{entrypoint:e,width:"122px",height:"60px",type:"button",variant:"grey",onClick:r,children:t.jsx(C,{id:"btn.back",defaultMessage:"Back"})})},Yo=()=>{const e=m(Q),n=m(Be),{isMobile:r}=B(),i=F(),a=()=>{i(A.setExchangeStep({step:ce.STEP_2,source:null}))};return t.jsx(ee,{height:"60px",entrypoint:e,sizeFont:"1.8rem",onClick:a,width:r?"100%":"200px",style:{backgroundColor:n?`#${n}`:void 0},children:t.jsx(C,{id:"dex.btn.newSwap",defaultMessage:"New Swap"})})},Jo=()=>{const e=m(p=>le(p,X)),n=m(ht),r=m(z),i=m(_t),a=m(on),o=m(he,K),s=m(pt),d=m(ft),c=m(Q),u=m(Be),{isMobile:_}=B(),g=F(),h=()=>{s?g(nn.getBuildSwap()):G()?g(ge("agree",!0)):g(M.showAgreeModal(!0))};return t.jsx(ee,{height:"60px",entrypoint:c,sizeFont:"1.8rem",onClick:h,width:_?"100%":"210px",style:{backgroundColor:u?`#${u}`:void 0},disabled:a!==re.SWAP||n||i||o.fetching||!o.data||d||!e,children:a===re.INSUFFITIENT_BALANCE?t.jsx(C,{id:"dex.btn.swap.balance",defaultMessage:"Insufficient Balance"}):t.jsx(t.Fragment,{children:r?t.jsx(C,{id:"dex.btn.confirm",defaultMessage:"Confirm swap"}):t.jsx(C,{id:"dex.btn.swap",defaultMessage:"Swap"})})})},Xo=l.div`
  position: relative;
  display: flex;
  ${({showSettings:e})=>e?v`
          display: none;
        `:null}
  @media (${w.SM}) {
    position: absolute;
    right: 3rem;
    bottom: -3rem;
    ${({$isRtl:e})=>e?v`
            right: initial;
            left: 3rem;
          `:null}
  }
  @media (${w.MD}) {
    right: 2.4rem;
    ${({$isRtl:e})=>e?v`
            right: initial;
            left: 2.4rem;
          `:null}
  }
  @media (${w.LG}) {
    right: 3.4rem;
    ${({$isRtl:e})=>e?v`
            right: initial;
            left: 3.4rem;
          `:null}
  }
`,Qo=l.div`
  width: 1.6rem;
  height: 100%;
`,e0=()=>{const e=m(z),n=m(on),r=m(yt),i=m(H),a=m(cn),o=m(me),s=m(mi),d=n===re.APPROVE||n===re.APPROVE_DIFFERENCE;return t.jsxs(Xo,{showSettings:r,$isRtl:i,children:[e&&!o?null:t.jsx(Ko,{}),e&&!s?t.jsx(zo,{}):null,t.jsx(Qo,{}),a!=null&&a.isConnected?t.jsx(t.Fragment,{children:s?t.jsx(Yo,{}):t.jsx(t.Fragment,{children:d?t.jsx(Uo,{}):t.jsx(Jo,{})})}):t.jsx(Zo,{})]})},n0=()=>m(me)?t.jsx(Mr,{}):null,t0=l.div`
  position: relative;
`,r0=l.div`
  padding: 2.2rem 1.6rem 1.6rem 1.6rem;
  border-radius: 0 0 6px 6px;
  background: ${({theme:e})=>e.bgColors.primary};
  @media (${w.SM}) {
    padding: 2.2rem 3rem 3rem 3rem;
  }
  @media (${w.MD}) {
    padding: 2.2rem 2.4rem 3rem 2.4rem;
  }
  @media (${w.LG}) {
    padding: 2.2rem 3.4rem 3rem 3.4rem;
  }
`,i0=l.div`
  position: relative;
  @media (${w.MD}) {
    display: flex;
  }
`,a0=l.div`
  height: 1rem;
  width: 100%;
  @media (${w.MD}) {
    height: 100%;
    width: 1rem;
  }
`,s0=l.div`
  text-align: center;
  margin-top: 1.6rem;
  @media (${w.SM}) {
    text-align: start;
    max-width: 45%;
  }
`,o0="data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M10.5192%207.27922H2.76363C2.55593%207.27922%202.35672%207.19671%202.20985%207.04984C2.06298%206.90296%201.98047%206.70376%201.98047%206.49605C1.98047%206.28835%202.06298%206.08915%202.20985%205.94227C2.35672%205.7954%202.55593%205.71289%202.76363%205.71289H10.5201C10.7278%205.71289%2010.927%205.7954%2011.0739%205.94227C11.2207%206.08915%2011.3033%206.28835%2011.3033%206.49605C11.3033%206.70376%2011.2207%206.90296%2011.0739%207.04984C10.927%207.19671%2010.7278%207.27922%2010.5201%207.27922H10.5192ZM17.2365%207.27922H15.2761C15.0684%207.27922%2014.8692%207.19671%2014.7223%207.04984C14.5754%206.90296%2014.4929%206.70376%2014.4929%206.49605C14.4929%206.28835%2014.5754%206.08915%2014.7223%205.94227C14.8692%205.7954%2015.0684%205.71289%2015.2761%205.71289H17.2365C17.4442%205.71289%2017.6434%205.7954%2017.7903%205.94227C17.9372%206.08915%2018.0197%206.28835%2018.0197%206.49605C18.0197%206.70376%2017.9372%206.90296%2017.7903%207.04984C17.6434%207.19671%2017.4442%207.27922%2017.2365%207.27922ZM17.2365%2014.5119H9.48099C9.27328%2014.5119%209.07408%2014.4294%208.92721%2014.2825C8.78034%2014.1356%208.69783%2013.9364%208.69783%2013.7287C8.69783%2013.521%208.78034%2013.3218%208.92721%2013.175C9.07408%2013.0281%209.27328%2012.9456%209.48099%2012.9456H17.2365C17.4442%2012.9456%2017.6434%2013.0281%2017.7903%2013.175C17.9372%2013.3218%2018.0197%2013.521%2018.0197%2013.7287C18.0197%2013.9364%2017.9372%2014.1356%2017.7903%2014.2825C17.6434%2014.4294%2017.4442%2014.5119%2017.2365%2014.5119ZM4.72405%2014.5119H2.76363C2.55593%2014.5119%202.35672%2014.4294%202.20985%2014.2825C2.06298%2014.1356%201.98047%2013.9364%201.98047%2013.7287C1.98047%2013.521%202.06298%2013.3218%202.20985%2013.175C2.35672%2013.0281%202.55593%2012.9456%202.76363%2012.9456H4.72405C4.93176%2012.9456%205.13096%2013.0281%205.27783%2013.175C5.4247%2013.3218%205.50721%2013.521%205.50721%2013.7287C5.50721%2013.9364%205.4247%2014.1356%205.27783%2014.2825C5.13096%2014.4294%204.93176%2014.5119%204.72405%2014.5119Z'%20fill='white'/%3e%3cpath%20d='M7.10254%2016.8323C6.47718%2016.8324%205.86585%2016.647%205.34585%2016.2996C4.82586%2015.9522%204.42055%2015.4584%204.1812%2014.8807C3.94184%2014.3029%203.87918%2013.6672%204.00115%2013.0539C4.12311%2012.4405%204.42422%2011.8771%204.86639%2011.4349C5.30856%2010.9927%205.87194%2010.6915%206.48527%2010.5695C7.09861%2010.4475%207.73435%2010.5101%208.31211%2010.7494C8.88987%2010.9887%209.3837%2011.3939%209.73113%2011.9139C10.0786%2012.4338%2010.264%2013.0451%2010.264%2013.6705C10.2634%2014.5088%209.93017%2015.3127%209.33742%2015.9055C8.74466%2016.4983%207.94086%2016.8316%207.10254%2016.8323ZM7.10254%2012.0754C6.78696%2012.0753%206.47845%2012.1688%206.21603%2012.3441C5.95361%2012.5194%205.74906%2012.7686%205.62827%2013.0601C5.50747%2013.3517%205.47585%2013.6725%205.5374%2013.982C5.59895%2014.2915%205.75091%2014.5758%205.97406%2014.799C6.19721%2015.0221%206.48152%2015.1741%206.79104%2015.2356C7.10056%2015.2972%207.42138%2015.2656%207.71292%2015.1448C8.00447%2015.024%208.25364%2014.8194%208.42893%2014.557C8.60422%2014.2946%208.69775%2013.9861%208.69768%2013.6705C8.69702%2013.2476%208.52875%2012.8423%208.22974%2012.5433C7.93074%2012.2443%207.52539%2012.076%207.10254%2012.0754ZM12.8973%209.65757C12.272%209.65757%2011.6607%209.47213%2011.1407%209.12471C10.6208%208.77729%2010.2155%208.28348%209.97621%207.70574C9.7369%207.128%209.67429%206.49227%209.79629%205.87894C9.91828%205.26561%2010.2194%204.70224%2010.6616%204.26005C11.1038%203.81787%2011.6672%203.51674%2012.2805%203.39474C12.8938%203.27274%2013.5295%203.33535%2014.1073%203.57466C14.685%203.81397%2015.1788%204.21923%2015.5263%204.73918C15.8737%205.25913%2016.0591%205.87043%2016.0591%206.49578C16.0585%207.33416%2015.7252%208.13803%2015.1324%208.73086C14.5396%209.32368%2013.7357%209.65699%2012.8973%209.65757ZM12.8973%204.90063C12.5818%204.90063%2012.2733%204.99421%2012.0109%205.16953C11.7485%205.34486%2011.544%205.59405%2011.4233%205.88561C11.3025%206.17716%2011.271%206.49797%2011.3325%206.80746C11.3941%207.11696%2011.5461%207.40125%2011.7693%207.62436C11.9924%207.84748%2012.2767%207.99941%2012.5863%208.06093C12.8958%208.12246%2013.2166%208.09082%2013.5081%207.97002C13.7996%207.84921%2014.0488%207.64467%2014.2241%207.38225C14.3993%207.11984%2014.4929%206.81134%2014.4928%206.49578C14.4921%206.07287%2014.3238%205.66747%2014.0247%205.36846C13.7257%205.06944%2013.3202%204.90121%2012.8973%204.90063Z'%20fill='white'/%3e%3c/svg%3e",d0=l.button`
  @media (${w.SM}) {
    svg {
      path {
        transition: 0.3s linear;
      }
    }
    &:hover {
      svg {
        path {
          fill: ${({theme:e})=>e.colors.primary};
        }
      }
    }
  }
`,c0=()=>{const e=F();return t.jsx(d0,{onClick:()=>e(M.showSettings(!0)),children:t.jsx(E,{src:o0,title:"Settings icon"})})},l0=l.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${({theme:e})=>e.bgColors.primary};
  ${({exchangeStep:e})=>e>ce.STEP_1?v`
          border-radius: 6px 6px 0 0;
        `:null}
  @media (${w.SM}) {
    border-radius: 6px 0 0 0;
    ${({exchangeStep:e})=>e>ce.STEP_1?v`
            border-radius: 6px 6px 0 0;
          `:null}
    ${({$isRtl:e})=>e?v`
            border-radius: 0 6px 0 0;
          `:null}
  }
`,u0=l.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2.2rem 1.6rem 0 1.6rem;
  @media (${w.SM}) {
    padding: 2.2rem 3rem 0 3rem;
  }
  @media (${w.MD}) {
    padding: 2.2rem 2.4rem 0 2.4rem;
  }
  @media (${w.LG}) {
    padding: 2.2rem 3.4rem 0 3.4rem;
  }
`,g0=l.div`
  display: flex;
  align-items: center;
  column-gap: 1.8rem;
`,m0=()=>{const e=m(z),n=m(hi),r=m(Ei),i=m(H),a=m(me),o=F(),s=un();N.useEffect(()=>{r&&(oi.custom(c=>t.jsx(di,{toastData:{...c,type:"blank"},children:t.jsx(Li,{children:t.jsx(C,{id:"dex.toast.ethSign",values:{a:()=>t.jsx("a",{href:"https://pillarx.app/eth-sign-setting",rel:"noopener noreferrer",target:"_blank",children:"Read more"})},defaultMessage:"Enable 'eth_sign' requests in the wallet's advanced settings to continue. <a>Read more</a>"})})}),{duration:9e3}),o(M.showEthSignMessage(!1)))},[o,r]);const d=()=>{switch(n){case ce.STEP_2:return Ge.STEP_TWO;case ce.STEP_3:return Ge.STEP_THREE;default:return Ge.STEP_ONE}};return t.jsxs(l0,{exchangeStep:n,$isRtl:i,children:[a?null:t.jsx(Oi,{step:n,maxSteps:3,isError:!1}),t.jsxs(u0,{children:[t.jsx(Ui,{step:n,maxSteps:3,title:s.formatMessage({id:`dex.exchangeStep.item${n}`,defaultMessage:d()})}),t.jsxs(g0,{children:[t.jsx(jr,{service:en.DEX,disabled:e}),e?null:t.jsx(c0,{})]})]})]})},h0=()=>{const e=m(Fi),n=m($i),r=m(Ii);return t.jsx(Ni,{isVisible:e||n||r,transparentBg:!0,height:60,width:60})},_0=()=>t.jsxs(t.Fragment,{children:[t.jsx(h0,{}),t.jsxs(t.Fragment,{children:[t.jsx(n0,{}),t.jsxs(t0,{children:[t.jsx(m0,{}),t.jsxs(r0,{children:[t.jsxs(i0,{children:[t.jsx(On,{selectType:U}),t.jsx(qa,{}),t.jsx(a0,{}),t.jsx(On,{selectType:X})]}),t.jsx($s,{}),t.jsx(e0,{})]}),t.jsx(ho,{})]}),t.jsx(s0,{children:t.jsx(tn,{})})]}),t.jsx(Oo,{})]}),p0=l.div`
  position: relative;
  min-width: 320px;
  min-height: 376px;
  width: 100%;
  height: 100%;
  ${ki}/* Match parent window padding */
`,B0=()=>(N.useEffect(()=>()=>{br(en.DEX)},[]),t.jsx(p0,{children:t.jsx(_0,{})}));export{B0 as default};
