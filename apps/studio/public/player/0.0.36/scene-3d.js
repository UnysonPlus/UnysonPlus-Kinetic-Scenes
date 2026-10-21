/*! Unyson+ scene player 0.0.36, 3D runtime | three.js (MIT, \u00a9 three.js authors) | 3D text font: Inter (SIL OFL 1.1, \u00a9 The Inter Project Authors) */
(function(){"use strict";/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const $s="186",Ma="attached",zl="detached",An="",Et="srgb",Ot="srgb-linear",ns="linear",lt="srgb",Sa="300 es";function kl(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Vl(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function Ri(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Hl(){const s=Ri("canvas");return s.style.display="block",s}const ya={};function is(...s){const e="THREE."+s.shift();console.log(e,...s)}function Ta(s){const e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=s[1];t&&t.isStackTrace?s[0]+=" "+t.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Be(...s){s=Ta(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...s)}}function Xe(...s){s=Ta(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...s)}}function Qn(...s){const e=s.join(" ");e in ya||(ya[e]=!0,Be(...s))}function Wl(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const Xl={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3};class zn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}}const qt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ba=1234567;const Ci=Math.PI/180,jn=180/Math.PI;function zt(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(qt[s&255]+qt[s>>8&255]+qt[s>>16&255]+qt[s>>24&255]+"-"+qt[e&255]+qt[e>>8&255]+"-"+qt[e>>16&15|64]+qt[e>>24&255]+"-"+qt[t&63|128]+qt[t>>8&255]+"-"+qt[t>>16&255]+qt[t>>24&255]+qt[n&255]+qt[n>>8&255]+qt[n>>16&255]+qt[n>>24&255]).toLowerCase()}function et(s,e,t){return Math.max(e,Math.min(t,s))}function Qs(s,e){return(s%e+e)%e}function Yl(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function Kl(s,e,t){return s!==e?(t-s)/(e-s):0}function qi(s,e,t){return(1-t)*s+t*e}function Jl(s,e,t,n){return qi(s,e,1-Math.exp(-t*n))}function Zl(s,e=1){return e-Math.abs(Qs(s,e*2)-e)}function $l(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function Ql(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function jl(s,e){return s+Math.floor(Math.random()*(e-s+1))}function ec(s,e){return s+Math.random()*(e-s)}function tc(s){return s*(.5-Math.random())}function nc(s){s!==void 0&&(ba=s);let e=ba+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function ic(s){return s*Ci}function sc(s){return s*jn}function rc(s){return s>0&&Number.isInteger(s)&&2**Math.round(Math.log2(s))===s}function ac(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function oc(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function lc(s,e,t,n,i){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),h=a((e+n)/2),u=r((e-n)/2),f=a((e-n)/2),d=r((n-e)/2),g=a((n-e)/2);switch(i){case"XYX":s.set(o*h,l*u,l*f,o*c);break;case"YZY":s.set(l*f,o*h,l*u,o*c);break;case"ZXZ":s.set(l*u,l*f,o*h,o*c);break;case"XZX":s.set(o*h,l*g,l*d,o*c);break;case"YXY":s.set(l*d,o*h,l*g,o*c);break;case"ZYZ":s.set(l*g,l*d,o*h,o*c);break;default:Be("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Yt(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:case Uint8ClampedArray:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function ct(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const cc={DEG2RAD:Ci,RAD2DEG:jn,generateUUID:zt,clamp:et,euclideanModulo:Qs,mapLinear:Yl,inverseLerp:Kl,lerp:qi,damp:Jl,pingpong:Zl,smoothstep:$l,smootherstep:Ql,randInt:jl,randFloat:ec,randFloatSpread:tc,seededRandom:nc,degToRad:ic,radToDeg:sc,isPowerOfTwo:rc,ceilPowerOfTwo:ac,floorPowerOfTwo:oc,setQuaternionFromProperEuler:lc,normalize:ct,denormalize:Yt},da=class da{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(et(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};da.prototype.isVector2=!0;let de=da;class pn{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],f=r[a+0],d=r[a+1],g=r[a+2],v=r[a+3];if(u!==v||l!==f||c!==d||h!==g){let m=l*f+c*d+h*g+u*v;m<0&&(f=-f,d=-d,g=-g,v=-v,m=-m);let p=1-o;if(m<.9995){const b=Math.acos(m),A=Math.sin(b);p=Math.sin(p*b)/A,o=Math.sin(o*b)/A,l=l*p+f*o,c=c*p+d*o,h=h*p+g*o,u=u*p+v*o}else{l=l*p+f*o,c=c*p+d*o,h=h*p+g*o,u=u*p+v*o;const b=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=b,c*=b,h*=b,u*=b}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,a){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[a],f=r[a+1],d=r[a+2],g=r[a+3];return e[t]=o*g+h*u+l*d-c*f,e[t+1]=l*g+h*f+c*u-o*d,e[t+2]=c*g+h*d+o*f-l*u,e[t+3]=h*g-o*u-l*f-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),u=o(r/2),f=l(n/2),d=l(i/2),g=l(r/2);switch(a){case"XYZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"YZX":this._x=f*h*u+c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u-f*d*g;break;case"XZY":this._x=f*h*u-c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u+f*d*g;break;default:Be("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=n+o+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(a-i)*d}else if(n>o&&n>u){const d=2*Math.sqrt(1+n-o-u);this._w=(h-l)/d,this._x=.25*d,this._y=(i+a)/d,this._z=(r+c)/d}else if(o>u){const d=2*Math.sqrt(1+o-n-u);this._w=(r-c)/d,this._x=(i+a)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+u-n-o);this._w=(a-i)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(et(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+i*c-r*l,this._y=i*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,i=-i,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const pa=class pa{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ea.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ea.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),h=2*(o*t-r*i),u=2*(r*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=i+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this.z=et(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this.z=et(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return js.copy(this).projectOnVector(e),this.sub(js)}reflect(e){return this.sub(js.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(et(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};pa.prototype.isVector3=!0;let F=pa;const js=new F,Ea=new pn,ma=class ma{constructor(e,t,n,i,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c)}set(e,t,n,i,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],d=n[5],g=n[8],v=i[0],m=i[3],p=i[6],b=i[1],A=i[4],_=i[7],T=i[2],E=i[5],C=i[8];return r[0]=a*v+o*b+l*T,r[3]=a*m+o*A+l*E,r[6]=a*p+o*_+l*C,r[1]=c*v+h*b+u*T,r[4]=c*m+h*A+u*E,r[7]=c*p+h*_+u*C,r[2]=f*v+d*b+g*T,r[5]=f*m+d*A+g*E,r[8]=f*p+d*_+g*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+i*r*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,f=o*l-h*r,d=c*r-a*l,g=t*u+n*f+i*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=u*v,e[1]=(i*c-h*n)*v,e[2]=(o*n-i*a)*v,e[3]=f*v,e[4]=(h*t-i*l)*v,e[5]=(i*r-o*t)*v,e[6]=d*v,e[7]=(n*l-c*t)*v,e[8]=(a*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Qn("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(er.makeScale(e,t)),this}rotate(e){return Qn("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(er.makeRotation(-e)),this}translate(e,t){return Qn("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(er.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};ma.prototype.isMatrix3=!0;let Ve=ma;const er=new Ve,Aa=new Ve().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),wa=new Ve().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function hc(){const s={enabled:!0,workingColorSpace:Ot,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===lt&&(i.r=mn(i.r),i.g=mn(i.g),i.b=mn(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===lt&&(i.r=ei(i.r),i.g=ei(i.g),i.b=ei(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===An?ns:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return Qn("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return Qn("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[Ot]:{primaries:e,whitePoint:n,transfer:ns,toXYZ:Aa,fromXYZ:wa,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Et},outputColorSpaceConfig:{drawingBufferColorSpace:Et}},[Et]:{primaries:e,whitePoint:n,transfer:lt,toXYZ:Aa,fromXYZ:wa,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Et}}}),s}const nt=hc();function mn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function ei(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let ti;class uc{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement=="undefined")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ti===void 0&&(ti=Ri("canvas")),ti.width=e.width,ti.height=e.height;const i=ti.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=ti}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap){const t=Ri("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=mn(r[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(mn(t[n]/255)*255):t[n]=mn(t[n]);return{data:t,width:e.width,height:e.height}}else return Be("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let fc=0;class tr{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:fc++}),this.uuid=zt(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement!="undefined"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame!="undefined"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(nr(i[a].image)):r.push(nr(i[a]))}else r=nr(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function nr(s){return typeof HTMLImageElement!="undefined"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&s instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&s instanceof ImageBitmap?uc.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Be("Texture: Unable to serialize Texture."),{})}let dc=0;const ir=new F;class At extends zn{constructor(e=At.DEFAULT_IMAGE,t=At.DEFAULT_MAPPING,n=1001,i=1001,r=1006,a=1008,o=1023,l=1009,c=At.DEFAULT_ANISOTROPY,h=An){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:dc++}),this.uuid=zt(),this.name="",this.source=new tr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new de(0,0),this.repeat=new de(1,1),this.center=new de(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ve,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(ir).x}get height(){return this.source.getSize(ir).y}get depth(){return this.source.getSize(ir).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Be(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Be(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case 1e3:e.x=e.x-Math.floor(e.x);break;case 1001:e.x=e.x<0?0:1;break;case 1002:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case 1e3:e.y=e.y-Math.floor(e.y);break;case 1001:e.y=e.y<0?0:1;break;case 1002:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}At.DEFAULT_IMAGE=null,At.DEFAULT_MAPPING=300,At.DEFAULT_ANISOTROPY=1;const ga=class ga{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],d=l[5],g=l[9],v=l[2],m=l[6],p=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const A=(c+1)/2,_=(d+1)/2,T=(p+1)/2,E=(h+f)/4,C=(u+v)/4,x=(g+m)/4;return A>_&&A>T?A<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(A),i=E/n,r=C/n):_>T?_<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(_),n=E/i,r=x/i):T<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(T),n=C/r,i=x/r),this.set(n,i,r,t),this}let b=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(f-h)*(f-h));return Math.abs(b)<.001&&(b=1),this.x=(m-g)/b,this.y=(u-v)/b,this.z=(f-h)/b,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this.z=et(this.z,e.z,t.z),this.w=et(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this.z=et(this.z,e,t),this.w=et(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};ga.prototype.isVector4=!0;let ut=ga;class pc extends zn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:1006,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new ut(0,0,e,t),this.scissorTest=!1,this.viewport=new ut(0,0,e,t),this.textures=[];const i={width:e,height:t,depth:n.depth},r=new At(i),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:1006,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new tr(i)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Kt extends pc{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Ra extends At{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class mc extends At{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const Ks=class Ks{constructor(e,t,n,i,r,a,o,l,c,h,u,f,d,g,v,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c,h,u,f,d,g,v,m)}set(e,t,n,i,r,a,o,l,c,h,u,f,d,g,v,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ks().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,i=1/ni.setFromMatrixColumn(e,0).length(),r=1/ni.setFromMatrixColumn(e,1).length(),a=1/ni.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const f=a*h,d=a*u,g=o*h,v=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=d+g*c,t[5]=f-v*c,t[9]=-o*l,t[2]=v-f*c,t[6]=g+d*c,t[10]=a*l}else if(e.order==="YXZ"){const f=l*h,d=l*u,g=c*h,v=c*u;t[0]=f+v*o,t[4]=g*o-d,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=d*o-g,t[6]=v+f*o,t[10]=a*l}else if(e.order==="ZXY"){const f=l*h,d=l*u,g=c*h,v=c*u;t[0]=f-v*o,t[4]=-a*u,t[8]=g+d*o,t[1]=d+g*o,t[5]=a*h,t[9]=v-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const f=a*h,d=a*u,g=o*h,v=o*u;t[0]=l*h,t[4]=g*c-d,t[8]=f*c+v,t[1]=l*u,t[5]=v*c+f,t[9]=d*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const f=a*l,d=a*c,g=o*l,v=o*c;t[0]=l*h,t[4]=v-f*u,t[8]=g*u+d,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=d*u+g,t[10]=f-v*u}else if(e.order==="XZY"){const f=a*l,d=a*c,g=o*l,v=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+v,t[5]=a*h,t[9]=d*u-g,t[2]=g*u-d,t[6]=o*h,t[10]=v*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(gc,e,_c)}lookAt(e,t,n){const i=this.elements;return Bt.subVectors(e,t),Bt.lengthSq()===0&&(Bt.z=1),Bt.normalize(),wn.crossVectors(n,Bt),wn.lengthSq()===0&&(Math.abs(n.z)===1?Bt.x+=1e-4:Bt.z+=1e-4,Bt.normalize(),wn.crossVectors(n,Bt)),wn.normalize(),ss.crossVectors(Bt,wn),i[0]=wn.x,i[4]=ss.x,i[8]=Bt.x,i[1]=wn.y,i[5]=ss.y,i[9]=Bt.y,i[2]=wn.z,i[6]=ss.z,i[10]=Bt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],d=n[13],g=n[2],v=n[6],m=n[10],p=n[14],b=n[3],A=n[7],_=n[11],T=n[15],E=i[0],C=i[4],x=i[8],w=i[12],I=i[1],z=i[5],G=i[9],Y=i[13],O=i[2],J=i[6],ie=i[10],$=i[14],Z=i[3],se=i[7],ae=i[11],he=i[15];return r[0]=a*E+o*I+l*O+c*Z,r[4]=a*C+o*z+l*J+c*se,r[8]=a*x+o*G+l*ie+c*ae,r[12]=a*w+o*Y+l*$+c*he,r[1]=h*E+u*I+f*O+d*Z,r[5]=h*C+u*z+f*J+d*se,r[9]=h*x+u*G+f*ie+d*ae,r[13]=h*w+u*Y+f*$+d*he,r[2]=g*E+v*I+m*O+p*Z,r[6]=g*C+v*z+m*J+p*se,r[10]=g*x+v*G+m*ie+p*ae,r[14]=g*w+v*Y+m*$+p*he,r[3]=b*E+A*I+_*O+T*Z,r[7]=b*C+A*z+_*J+T*se,r[11]=b*x+A*G+_*ie+T*ae,r[15]=b*w+A*Y+_*$+T*he,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],d=e[14],g=e[3],v=e[7],m=e[11],p=e[15],b=l*d-c*f,A=o*d-c*u,_=o*f-l*u,T=a*d-c*h,E=a*f-l*h,C=a*u-o*h;return t*(v*b-m*A+p*_)-n*(g*b-m*T+p*E)+i*(g*A-v*T+p*C)-r*(g*_-v*E+m*C)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(r*h-o*l)+i*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],d=e[11],g=e[12],v=e[13],m=e[14],p=e[15],b=t*o-n*a,A=t*l-i*a,_=t*c-r*a,T=n*l-i*o,E=n*c-r*o,C=i*c-r*l,x=h*v-u*g,w=h*m-f*g,I=h*p-d*g,z=u*m-f*v,G=u*p-d*v,Y=f*p-d*m,O=b*Y-A*G+_*z+T*I-E*w+C*x;if(O===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const J=1/O;return e[0]=(o*Y-l*G+c*z)*J,e[1]=(i*G-n*Y-r*z)*J,e[2]=(v*C-m*E+p*T)*J,e[3]=(f*E-u*C-d*T)*J,e[4]=(l*I-a*Y-c*w)*J,e[5]=(t*Y-i*I+r*w)*J,e[6]=(m*_-g*C-p*A)*J,e[7]=(h*C-f*_+d*A)*J,e[8]=(a*G-o*I+c*x)*J,e[9]=(n*I-t*G-r*x)*J,e[10]=(g*E-v*_+p*b)*J,e[11]=(u*_-h*E-d*b)*J,e[12]=(o*w-a*z-l*x)*J,e[13]=(t*z-n*w+i*x)*J,e[14]=(v*A-g*T-m*b)*J,e[15]=(h*T-u*A+f*b)*J,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,f=r*c,d=r*h,g=r*u,v=a*h,m=a*u,p=o*u,b=l*c,A=l*h,_=l*u,T=n.x,E=n.y,C=n.z;return i[0]=(1-(v+p))*T,i[1]=(d+_)*T,i[2]=(g-A)*T,i[3]=0,i[4]=(d-_)*E,i[5]=(1-(f+p))*E,i[6]=(m+b)*E,i[7]=0,i[8]=(g+A)*C,i[9]=(m-b)*C,i[10]=(1-(f+v))*C,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=ni.set(i[0],i[1],i[2]).length();const o=ni.set(i[4],i[5],i[6]).length(),l=ni.set(i[8],i[9],i[10]).length();r<0&&(a=-a),Jt.copy(this);const c=1/a,h=1/o,u=1/l;return Jt.elements[0]*=c,Jt.elements[1]*=c,Jt.elements[2]*=c,Jt.elements[4]*=h,Jt.elements[5]*=h,Jt.elements[6]*=h,Jt.elements[8]*=u,Jt.elements[9]*=u,Jt.elements[10]*=u,t.setFromRotationMatrix(Jt),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,i,r,a,o=2e3,l=!1){const c=this.elements,h=2*r/(t-e),u=2*r/(n-i),f=(t+e)/(t-e),d=(n+i)/(n-i);let g,v;if(l)g=r/(a-r),v=a*r/(a-r);else if(o===2e3)g=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===2001)g=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,r,a,o=2e3,l=!1){const c=this.elements,h=2/(t-e),u=2/(n-i),f=-(t+e)/(t-e),d=-(n+i)/(n-i);let g,v;if(l)g=1/(a-r),v=a/(a-r);else if(o===2e3)g=-2/(a-r),v=-(a+r)/(a-r);else if(o===2001)g=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=u,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};Ks.prototype.isMatrix4=!0;let Ze=Ks;const ni=new F,Jt=new Ze,gc=new F(0,0,0),_c=new F(1,1,1),wn=new F,ss=new F,Bt=new F,Ca=new Ze,qa=new pn;class gn{constructor(e=0,t=0,n=0,i=gn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],u=i[2],f=i[6],d=i[10];switch(t){case"XYZ":this._y=Math.asin(et(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-et(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(et(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-et(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(et(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-et(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:Be("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Ca.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ca,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return qa.setFromEuler(this),this.setFromQuaternion(qa,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}gn.DEFAULT_ORDER="XYZ";class Pa{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let xc=0;const La=new F,ii=new pn,_n=new Ze,rs=new F,Pi=new F,vc=new F,Mc=new pn,Ia=new F(1,0,0),Na=new F(0,1,0),Da=new F(0,0,1),Ua={type:"added"},Sc={type:"removed"},si={type:"childadded",child:null},sr={type:"childremoved",child:null};class gt extends zn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:xc++}),this.uuid=zt(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=gt.DEFAULT_UP.clone();const e=new F,t=new gn,n=new pn,i=new F(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Ze},normalMatrix:{value:new Ve}}),this.matrix=new Ze,this.matrixWorld=new Ze,this.matrixAutoUpdate=gt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=gt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Pa,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ii.setFromAxisAngle(e,t),this.quaternion.multiply(ii),this}rotateOnWorldAxis(e,t){return ii.setFromAxisAngle(e,t),this.quaternion.premultiply(ii),this}rotateX(e){return this.rotateOnAxis(Ia,e)}rotateY(e){return this.rotateOnAxis(Na,e)}rotateZ(e){return this.rotateOnAxis(Da,e)}translateOnAxis(e,t){return La.copy(e).applyQuaternion(this.quaternion),this.position.add(La.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ia,e)}translateY(e){return this.translateOnAxis(Na,e)}translateZ(e){return this.translateOnAxis(Da,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(_n.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?rs.copy(e):rs.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Pi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?_n.lookAt(Pi,rs,this.up):_n.lookAt(rs,Pi,this.up),this.quaternion.setFromRotationMatrix(_n),i&&(_n.extractRotation(i.matrixWorld),ii.setFromRotationMatrix(_n),this.quaternion.premultiply(ii.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Xe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ua),si.child=e,this.dispatchEvent(si),si.child=null):Xe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Sc),sr.child=e,this.dispatchEvent(sr),sr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),_n.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),_n.multiply(e.parent.matrixWorld)),e.applyMatrix4(_n),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ua),si.child=e,this.dispatchEvent(si),si.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Pi,e,vc),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Pi,Mc,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,i=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*i,r[13]+=n-r[1]*t-r[5]*n-r[9]*i,r[14]+=i-r[2]*t-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),f=a(e.skeletons),d=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}gt.DEFAULT_UP=new F(0,1,0),gt.DEFAULT_MATRIX_AUTO_UPDATE=!0,gt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class kt extends gt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const yc={type:"move"};class rr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new kt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new kt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new F,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new F),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new kt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new F,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new F,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,n),p=this._getHandJoint(c,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;c.inputState.pinching&&f>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(yc)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new kt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Fa={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Rn={h:0,s:0,l:0},as={h:0,s:0,l:0};function ar(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class He{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Et){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,nt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=nt.workingColorSpace){return this.r=e,this.g=t,this.b=n,nt.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=nt.workingColorSpace){if(e=Qs(e,1),t=et(t,0,1),n=et(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=ar(a,r,e+1/3),this.g=ar(a,r,e),this.b=ar(a,r,e-1/3)}return nt.colorSpaceToWorking(this,i),this}setStyle(e,t=Et){function n(r){r!==void 0&&parseFloat(r)<1&&Be("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Be("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Be("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Et){const n=Fa[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Be("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=mn(e.r),this.g=mn(e.g),this.b=mn(e.b),this}copyLinearToSRGB(e){return this.r=ei(e.r),this.g=ei(e.g),this.b=ei(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Et){return nt.workingToColorSpace(Pt.copy(this),e),Math.round(et(Pt.r*255,0,255))*65536+Math.round(et(Pt.g*255,0,255))*256+Math.round(et(Pt.b*255,0,255))}getHexString(e=Et){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=nt.workingColorSpace){nt.workingToColorSpace(Pt.copy(this),t);const n=Pt.r,i=Pt.g,r=Pt.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=nt.workingColorSpace){return nt.workingToColorSpace(Pt.copy(this),t),e.r=Pt.r,e.g=Pt.g,e.b=Pt.b,e}getStyle(e=Et){nt.workingToColorSpace(Pt.copy(this),e);const t=Pt.r,n=Pt.g,i=Pt.b;return e!==Et?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Rn),this.setHSL(Rn.h+e,Rn.s+t,Rn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Rn),e.getHSL(as);const n=qi(Rn.h,as.h,t),i=qi(Rn.s,as.s,t),r=qi(Rn.l,as.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Pt=new He;He.NAMES=Fa;class Oa extends gt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new gn,this.environmentIntensity=1,this.environmentRotation=new gn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Zt=new F,xn=new F,or=new F,vn=new F,ri=new F,ai=new F,Ba=new F,lr=new F,cr=new F,hr=new F,ur=new ut,fr=new ut,dr=new ut;class $t{constructor(e=new F,t=new F,n=new F){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Zt.subVectors(e,t),i.cross(Zt);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){Zt.subVectors(i,t),xn.subVectors(n,t),or.subVectors(e,t);const a=Zt.dot(Zt),o=Zt.dot(xn),l=Zt.dot(or),c=xn.dot(xn),h=xn.dot(or),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,d=(c*l-o*h)*f,g=(a*h-o*l)*f;return r.set(1-d-g,g,d)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,vn)===null?!1:vn.x>=0&&vn.y>=0&&vn.x+vn.y<=1}static getInterpolation(e,t,n,i,r,a,o,l){return this.getBarycoord(e,t,n,i,vn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,vn.x),l.addScaledVector(a,vn.y),l.addScaledVector(o,vn.z),l)}static getInterpolatedAttribute(e,t,n,i,r,a){return ur.setScalar(0),fr.setScalar(0),dr.setScalar(0),ur.fromBufferAttribute(e,t),fr.fromBufferAttribute(e,n),dr.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(ur,r.x),a.addScaledVector(fr,r.y),a.addScaledVector(dr,r.z),a}static isFrontFacing(e,t,n,i){return Zt.subVectors(n,t),xn.subVectors(e,t),Zt.cross(xn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Zt.subVectors(this.c,this.b),xn.subVectors(this.a,this.b),Zt.cross(xn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return $t.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return $t.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return $t.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return $t.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return $t.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let a,o;ri.subVectors(i,n),ai.subVectors(r,n),lr.subVectors(e,n);const l=ri.dot(lr),c=ai.dot(lr);if(l<=0&&c<=0)return t.copy(n);cr.subVectors(e,i);const h=ri.dot(cr),u=ai.dot(cr);if(h>=0&&u<=h)return t.copy(i);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(ri,a);hr.subVectors(e,r);const d=ri.dot(hr),g=ai.dot(hr);if(g>=0&&d<=g)return t.copy(r);const v=d*c-l*g;if(v<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(ai,o);const m=h*g-d*u;if(m<=0&&u-h>=0&&d-g>=0)return Ba.subVectors(r,i),o=(u-h)/(u-h+(d-g)),t.copy(i).addScaledVector(Ba,o);const p=1/(m+v+f);return a=v*p,o=f*p,t.copy(n).addScaledVector(ri,a).addScaledVector(ai,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Qt{constructor(e=new F(1/0,1/0,1/0),t=new F(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(jt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(jt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=jt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,jt):jt.fromBufferAttribute(r,a),jt.applyMatrix4(e.matrixWorld),this.expandByPoint(jt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),os.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),os.copy(n.boundingBox)),os.applyMatrix4(e.matrixWorld),this.union(os)}const i=e.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,jt),jt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Li),ls.subVectors(this.max,Li),oi.subVectors(e.a,Li),li.subVectors(e.b,Li),ci.subVectors(e.c,Li),Cn.subVectors(li,oi),qn.subVectors(ci,li),kn.subVectors(oi,ci);let t=[0,-Cn.z,Cn.y,0,-qn.z,qn.y,0,-kn.z,kn.y,Cn.z,0,-Cn.x,qn.z,0,-qn.x,kn.z,0,-kn.x,-Cn.y,Cn.x,0,-qn.y,qn.x,0,-kn.y,kn.x,0];return!pr(t,oi,li,ci,ls)||(t=[1,0,0,0,1,0,0,0,1],!pr(t,oi,li,ci,ls))?!1:(cs.crossVectors(Cn,qn),t=[cs.x,cs.y,cs.z],pr(t,oi,li,ci,ls))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,jt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(jt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Mn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Mn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Mn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Mn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Mn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Mn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Mn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Mn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Mn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Mn=[new F,new F,new F,new F,new F,new F,new F,new F],jt=new F,os=new Qt,oi=new F,li=new F,ci=new F,Cn=new F,qn=new F,kn=new F,Li=new F,ls=new F,cs=new F,Vn=new F;function pr(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){Vn.fromArray(s,r);const o=i.x*Math.abs(Vn.x)+i.y*Math.abs(Vn.y)+i.z*Math.abs(Vn.z),l=e.dot(Vn),c=t.dot(Vn),h=n.dot(Vn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const yt=new F,hs=new de;let Tc=0;class Ft extends zn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Tc++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=35044,this.updateRanges=[],this.gpuType=1015,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)hs.fromBufferAttribute(this,t),hs.applyMatrix3(e),this.setXY(t,hs.x,hs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix3(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix4(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.applyNormalMatrix(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.transformDirection(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Yt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ct(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Yt(t,this.array)),t}setX(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Yt(t,this.array)),t}setY(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Yt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Yt(t,this.array)),t}setW(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array),i=ct(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array),i=ct(i,this.array),r=ct(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class Ga extends Ft{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class za extends Ft{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class rt extends Ft{constructor(e,t,n){super(new Float32Array(e),t,n)}}const bc=new Qt,Ii=new F,mr=new F;class rn{constructor(e=new F,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):bc.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ii.subVectors(e,this.center);const t=Ii.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Ii,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(mr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ii.copy(e.center).add(mr)),this.expandByPoint(Ii.copy(e.center).sub(mr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Ec=0;const Vt=new Ze,gr=new gt,hi=new F,Gt=new Qt,Ni=new Qt,Ct=new F;class Tt extends zn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ec++}),this.uuid=zt(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(kl(e)?za:Ga)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ve().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Vt.makeRotationFromQuaternion(e),this.applyMatrix4(Vt),this}rotateX(e){return Vt.makeRotationX(e),this.applyMatrix4(Vt),this}rotateY(e){return Vt.makeRotationY(e),this.applyMatrix4(Vt),this}rotateZ(e){return Vt.makeRotationZ(e),this.applyMatrix4(Vt),this}translate(e,t,n){return Vt.makeTranslation(e,t,n),this.applyMatrix4(Vt),this}scale(e,t,n){return Vt.makeScale(e,t,n),this.applyMatrix4(Vt),this}lookAt(e){return gr.lookAt(e),gr.updateMatrix(),this.applyMatrix4(gr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(hi).negate(),this.translate(hi.x,hi.y,hi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new rt(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&Be("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Qt);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Xe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new F(-1/0,-1/0,-1/0),new F(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];Gt.setFromBufferAttribute(r),this.morphTargetsRelative?(Ct.addVectors(this.boundingBox.min,Gt.min),this.boundingBox.expandByPoint(Ct),Ct.addVectors(this.boundingBox.max,Gt.max),this.boundingBox.expandByPoint(Ct)):(this.boundingBox.expandByPoint(Gt.min),this.boundingBox.expandByPoint(Gt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Xe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new rn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Xe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new F,1/0);return}if(e){const n=this.boundingSphere.center;if(Gt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Ni.setFromBufferAttribute(o),this.morphTargetsRelative?(Ct.addVectors(Gt.min,Ni.min),Gt.expandByPoint(Ct),Ct.addVectors(Gt.max,Ni.max),Gt.expandByPoint(Ct)):(Gt.expandByPoint(Ni.min),Gt.expandByPoint(Ni.max))}Gt.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)Ct.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(Ct));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ct.fromBufferAttribute(o,c),l&&(hi.fromBufferAttribute(e,c),Ct.add(hi)),i=Math.max(i,n.distanceToSquared(Ct))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Xe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Xe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Ft(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let x=0;x<n.count;x++)o[x]=new F,l[x]=new F;const c=new F,h=new F,u=new F,f=new de,d=new de,g=new de,v=new F,m=new F;function p(x,w,I){c.fromBufferAttribute(n,x),h.fromBufferAttribute(n,w),u.fromBufferAttribute(n,I),f.fromBufferAttribute(r,x),d.fromBufferAttribute(r,w),g.fromBufferAttribute(r,I),h.sub(c),u.sub(c),d.sub(f),g.sub(f);const z=1/(d.x*g.y-g.x*d.y);isFinite(z)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(u,-d.y).multiplyScalar(z),m.copy(u).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(z),o[x].add(v),o[w].add(v),o[I].add(v),l[x].add(m),l[w].add(m),l[I].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let x=0,w=b.length;x<w;++x){const I=b[x],z=I.start,G=I.count;for(let Y=z,O=z+G;Y<O;Y+=3)p(e.getX(Y+0),e.getX(Y+1),e.getX(Y+2))}const A=new F,_=new F,T=new F,E=new F;function C(x){T.fromBufferAttribute(i,x),E.copy(T);const w=o[x];A.copy(w),A.sub(T.multiplyScalar(T.dot(w))).normalize(),_.crossVectors(E,w);const z=_.dot(l[x])<0?-1:1;a.setXYZW(x,A.x,A.y,A.z,z)}for(let x=0,w=b.length;x<w;++x){const I=b[x],z=I.start,G=I.count;for(let Y=z,O=z+G;Y<O;Y+=3)C(e.getX(Y+0)),C(e.getX(Y+1)),C(e.getX(Y+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Ft(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const i=new F,r=new F,a=new F,o=new F,l=new F,c=new F,h=new F,u=new F;if(e)for(let f=0,d=e.count;f<d;f+=3){const g=e.getX(f+0),v=e.getX(f+1),m=e.getX(f+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,m),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,d=t.count;f<d;f+=3)i.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ct.fromBufferAttribute(e,t),Ct.normalize(),e.setXYZ(t,Ct.x,Ct.y,Ct.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,f=new c.constructor(l.length*h);let d=0,g=0;for(let v=0,m=l.length;v<m;v++){o.isInterleavedBufferAttribute?d=l[v]*o.data.stride+o.offset:d=l[v]*h;for(let p=0;p<h;p++)f[g++]=c[d++]}return new Ft(f,h,u)}if(this.index===null)return Be("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Tt,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const f=c[h],d=e(f,n);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const d=c[u];h.push(d.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ac{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=35044,this.updateRanges=[],this.version=0,this.uuid=zt()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=zt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=zt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));const t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}}const It=new F;class _r{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)It.fromBufferAttribute(this,t),It.applyMatrix4(e),this.setXYZ(t,It.x,It.y,It.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.applyNormalMatrix(e),this.setXYZ(t,It.x,It.y,It.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.transformDirection(e),this.setXYZ(t,It.x,It.y,It.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Yt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ct(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Yt(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Yt(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Yt(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Yt(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array),i=ct(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array),i=ct(i,this.array),r=ct(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){is("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new Ft(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new _r(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){is("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const xr=new F,wc=new F,Rc=new Ve;class Pn{constructor(e=new F(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=xr.subVectors(n,t).cross(wc.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const i=e.delta(xr),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Rc.getNormalMatrix(e),i=this.coplanarPoint(xr).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let Cc=0;class en extends zn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Cc++}),this.uuid=zt(),this.name="",this.type="Material",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new He(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Be(`Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Be(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new He().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Pn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new de().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new de().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Sn=new F,vr=new F,us=new F,fs=new F;class ds{constructor(e=new F,t=new F(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Sn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Sn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Sn.copy(this.origin).addScaledVector(this.direction,t),Sn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){vr.copy(e).add(t).multiplyScalar(.5),us.copy(t).sub(e).normalize(),fs.copy(this.origin).sub(vr);const r=e.distanceTo(t)*.5,a=-this.direction.dot(us),o=fs.dot(this.direction),l=-fs.dot(us),c=fs.lengthSq(),h=Math.abs(1-a*a);let u,f,d,g;if(h>0)if(u=a*l-o,f=a*o-l,g=r*h,u>=0)if(f>=-g)if(f<=g){const v=1/h;u*=v,f*=v,d=u*(u+a*f+2*o)+f*(a*u+f+2*l)+c}else f=r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;else f<=-g?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c):f<=g?(u=0,f=Math.min(Math.max(-r,-l),r),d=f*(f+2*l)+c):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(vr).addScaledVector(us,f),d}intersectSphere(e,t){if(e.radius<0)return null;Sn.subVectors(e.center,this.origin);const n=Sn.dot(this.direction),i=Sn.dot(Sn)-n*n,r=e.radius*e.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,i=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,i=(e.min.x-f.x)*c),h>=0?(r=(e.min.y-f.y)*h,a=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,a=(e.min.y-f.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),u>=0?(o=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(o=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Sn)!==null}intersectTriangle(e,t,n,i,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,u=e.x-a.x,f=e.y-a.y,d=e.z-a.z,g=t.x-a.x,v=t.y-a.y,m=t.z-a.z,p=n.x-a.x,b=n.y-a.y,A=n.z-a.z,_=Math.abs(l),T=Math.abs(c),E=Math.abs(h);let C,x,w,I,z,G,Y,O,J,ie,$,Z;if(_>=T&&_>=E?(w=l,G=u,J=g,Z=p,l>=0?(C=c,x=h,I=f,z=d,Y=v,O=m,ie=b,$=A):(C=h,x=c,I=d,z=f,Y=m,O=v,ie=A,$=b)):T>=E?(w=c,G=f,J=v,Z=b,c>=0?(C=h,x=l,I=d,z=u,Y=m,O=g,ie=A,$=p):(C=l,x=h,I=u,z=d,Y=g,O=m,ie=p,$=A)):(w=h,G=d,J=m,Z=A,h>=0?(C=l,x=c,I=u,z=f,Y=g,O=v,ie=p,$=b):(C=c,x=l,I=f,z=u,Y=v,O=g,ie=b,$=p)),w===0)return null;const se=C/w,ae=x/w,he=1/w,Le=I-se*G,Ce=z-ae*G,Ke=Y-se*J,Ye=O-ae*J,$e=ie-se*Z,U=$-ae*Z,N=$e*Ye-U*Ke,L=Le*U-Ce*$e,P=Ke*Ce-Ye*Le;if(i){if(N<0||L<0||P<0)return null}else if((N<0||L<0||P<0)&&(N>0||L>0||P>0))return null;const B=N+L+P;if(B===0)return null;const ne=he*(N*G+L*J+P*Z);return(B>0?ne<0:ne>0)?null:this.at(ne/B,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class yn extends en{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new He(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ka=new Ze,Hn=new ds,ps=new rn,Va=new F,ms=new F,gs=new F,_s=new F,Mr=new F,xs=new F,Ha=new F,vs=new F;class xt extends gt{constructor(e=new Tt,t=new yn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(r&&o){xs.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(Mr.fromBufferAttribute(u,e),a?xs.addScaledVector(Mr,h):xs.addScaledVector(Mr.sub(t),h))}t.add(xs)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ps.copy(n.boundingSphere),ps.applyMatrix4(r),Hn.copy(e.ray).recast(e.near),!(ps.containsPoint(Hn.origin)===!1&&(Hn.intersectSphere(ps,Va)===null||Hn.origin.distanceToSquared(Va)>(e.far-e.near)**2))&&(ka.copy(r).invert(),Hn.copy(e.ray).applyMatrix4(ka),!(n.boundingBox!==null&&Hn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Hn)))}_computeIntersections(e,t,n){let i;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=f.length;g<v;g++){const m=f[g],p=a[m.materialIndex],b=Math.max(m.start,d.start),A=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let _=b,T=A;_<T;_+=3){const E=o.getX(_),C=o.getX(_+1),x=o.getX(_+2);i=Ms(this,p,e,n,c,h,u,E,C,x),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,d.start),v=Math.min(o.count,d.start+d.count);for(let m=g,p=v;m<p;m+=3){const b=o.getX(m),A=o.getX(m+1),_=o.getX(m+2);i=Ms(this,a,e,n,c,h,u,b,A,_),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,v=f.length;g<v;g++){const m=f[g],p=a[m.materialIndex],b=Math.max(m.start,d.start),A=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let _=b,T=A;_<T;_+=3){const E=_,C=_+1,x=_+2;i=Ms(this,p,e,n,c,h,u,E,C,x),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,d.start),v=Math.min(l.count,d.start+d.count);for(let m=g,p=v;m<p;m+=3){const b=m,A=m+1,_=m+2;i=Ms(this,a,e,n,c,h,u,b,A,_),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}}function qc(s,e,t,n,i,r,a,o){let l;if(e.side===1?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,e.side===0,o),l===null)return null;vs.copy(o),vs.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(vs);return c<t.near||c>t.far?null:{distance:c,point:vs.clone(),object:s}}function Ms(s,e,t,n,i,r,a,o,l,c){s.getVertexPosition(o,ms),s.getVertexPosition(l,gs),s.getVertexPosition(c,_s);const h=qc(s,e,t,n,ms,gs,_s,Ha);if(h){const u=new F;$t.getBarycoord(Ha,ms,gs,_s,u),i&&(h.uv=$t.getInterpolatedAttribute(i,o,l,c,u,new de)),r&&(h.uv1=$t.getInterpolatedAttribute(r,o,l,c,u,new de)),a&&(h.normal=$t.getInterpolatedAttribute(a,o,l,c,u,new F),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new F,materialIndex:0};$t.getNormal(ms,gs,_s,f.normal),h.face=f,h.barycoord=u}return h}const Di=new ut,Wa=new ut,Xa=new ut,Pc=new ut,Ya=new Ze,Ss=new F,Sr=new rn,Ka=new Ze,yr=new ds;class Lc extends xt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Ma,this.bindMatrix=new Ze,this.bindMatrixInverse=new Ze,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Qt),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Ss),this.boundingBox.expandByPoint(Ss)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new rn),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Ss),this.boundingSphere.expandByPoint(Ss)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Sr.copy(this.boundingSphere),Sr.applyMatrix4(i),e.ray.intersectsSphere(Sr)!==!1&&(Ka.copy(i).invert(),yr.copy(e.ray).applyMatrix4(Ka),!(this.boundingBox!==null&&yr.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,yr)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new ut,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Ma?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===zl?this.bindMatrixInverse.copy(this.bindMatrix).invert():Be("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;Wa.fromBufferAttribute(i.attributes.skinIndex,e),Xa.fromBufferAttribute(i.attributes.skinWeight,e),t.isVector4?(Di.copy(t),t.set(0,0,0,0)):(Di.set(...t,1),t.set(0,0,0)),Di.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){const a=Xa.getComponent(r);if(a!==0){const o=Wa.getComponent(r);Ya.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(Pc.copy(Di).applyMatrix4(Ya),a)}}return t.isVector4&&(t.w=Di.w),t.applyMatrix4(this.bindMatrixInverse)}}class Ja extends gt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Tr extends At{constructor(e=null,t=1,n=1,i,r,a,o,l,c=1003,h=1003,u,f){super(null,a,o,l,c,h,i,r,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Za=new Ze,Ic=new Ze;class br{constructor(e=[],t=[]){this.uuid=zt(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Be("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Ze)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Ze;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:Ic;Za.multiplyMatrices(o,t[r]),Za.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new br(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Tr(t,e,e,1023,1015);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const r=e.bones[n];let a=t[r];a===void 0&&(Be("Skeleton: No bone found with UUID:",r),a=new Ja),this.bones.push(a),this.boneInverses.push(new Ze().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){const a=t[i];e.bones.push(a.uuid);const o=n[i];e.boneInverses.push(o.toArray())}return e}}class ys extends Ft{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const ui=new Ze,$a=new Ze,Ts=[],Qa=new Qt,Nc=new Ze,Ui=new xt,Fi=new rn;class ja extends xt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ys(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Nc)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Qt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ui),Qa.copy(e.boundingBox).applyMatrix4(ui),this.boundingBox.union(Qa)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new rn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ui),Fi.copy(e.boundingSphere).applyMatrix4(ui),this.boundingSphere.union(Fi)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(Ui.geometry=this.geometry,Ui.material=this.material,Ui.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Fi.copy(this.boundingSphere),Fi.applyMatrix4(n),e.ray.intersectsSphere(Fi)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,ui),$a.multiplyMatrices(n,ui),Ui.matrixWorld=$a,Ui.raycast(e,Ts);for(let a=0,o=Ts.length;a<o;a++){const l=Ts[a];l.instanceId=r,l.object=this,t.push(l)}Ts.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new ys(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Tr(new Float32Array(i*this.count),i,this.count,1028,1015));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Wn=new rn,Dc=new de(.5,.5),bs=new F;class Er{constructor(e=new Pn,t=new Pn,n=new Pn,i=new Pn,r=new Pn,a=new Pn){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=2e3,n=!1){const i=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],f=r[6],d=r[7],g=r[8],v=r[9],m=r[10],p=r[11],b=r[12],A=r[13],_=r[14],T=r[15];if(i[0].setComponents(c-a,d-h,p-g,T-b).normalize(),i[1].setComponents(c+a,d+h,p+g,T+b).normalize(),i[2].setComponents(c+o,d+u,p+v,T+A).normalize(),i[3].setComponents(c-o,d-u,p-v,T-A).normalize(),n)i[4].setComponents(l,f,m,_).normalize(),i[5].setComponents(c-l,d-f,p-m,T-_).normalize();else if(i[4].setComponents(c-l,d-f,p-m,T-_).normalize(),t===2e3)i[5].setComponents(c+l,d+f,p+m,T+_).normalize();else if(t===2001)i[5].setComponents(l,f,m,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Wn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Wn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Wn)}intersectsSprite(e){Wn.center.set(0,0,0);const t=Dc.distanceTo(e.center);return Wn.radius=.7071067811865476+t,Wn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Wn)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(bs.x=i.normal.x>0?e.max.x:e.min.x,bs.y=i.normal.y>0?e.max.y:e.min.y,bs.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(bs)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class eo extends en{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new He(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Es=new F,As=new F,to=new Ze,Oi=new ds,ws=new rn,Ar=new F,no=new F;class wr extends gt{constructor(e=new Tt,t=new eo){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)Es.fromBufferAttribute(t,i-1),As.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Es.distanceTo(As);e.setAttribute("lineDistance",new rt(n,1))}else Be("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ws.copy(n.boundingSphere),ws.applyMatrix4(i),ws.radius+=r,e.ray.intersectsSphere(ws)===!1)return;to.copy(i).invert(),Oi.copy(e.ray).applyMatrix4(to);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){const d=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let v=d,m=g-1;v<m;v+=c){const p=h.getX(v),b=h.getX(v+1),A=Rs(this,e,Oi,l,p,b,v);A&&t.push(A)}if(this.isLineLoop){const v=h.getX(g-1),m=h.getX(d),p=Rs(this,e,Oi,l,v,m,g-1);p&&t.push(p)}}else{const d=Math.max(0,a.start),g=Math.min(f.count,a.start+a.count);for(let v=d,m=g-1;v<m;v+=c){const p=Rs(this,e,Oi,l,v,v+1,v);p&&t.push(p)}if(this.isLineLoop){const v=Rs(this,e,Oi,l,g-1,d,g-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Rs(s,e,t,n,i,r,a){const o=s.geometry.attributes.position;if(Es.fromBufferAttribute(o,i),As.fromBufferAttribute(o,r),t.distanceSqToSegment(Es,As,Ar,no)>n)return;Ar.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(Ar);if(!(c<e.near||c>e.far))return{distance:c,point:no.clone().applyMatrix4(s.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:s}}const io=new F,so=new F;class Uc extends wr{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)io.fromBufferAttribute(t,i),so.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+io.distanceTo(so);e.setAttribute("lineDistance",new rt(n,1))}else Be("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Fc extends wr{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class ro extends en{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new He(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const ao=new Ze,Rr=new ds,Cs=new rn,qs=new F;class Oc extends gt{constructor(e=new Tt,t=new ro){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Cs.copy(n.boundingSphere),Cs.applyMatrix4(i),Cs.radius+=r,e.ray.intersectsSphere(Cs)===!1)return;ao.copy(i).invert(),Rr.copy(e.ray).applyMatrix4(ao);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){const f=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let g=f,v=d;g<v;g++){const m=c.getX(g);qs.fromBufferAttribute(u,m),oo(qs,m,l,i,e,t,this)}}else{const f=Math.max(0,a.start),d=Math.min(u.count,a.start+a.count);for(let g=f,v=d;g<v;g++)qs.fromBufferAttribute(u,g),oo(qs,g,l,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function oo(s,e,t,n,i,r,a){const o=Rr.distanceSqToPoint(s);if(o<t){const l=new F;Rr.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class lo extends At{constructor(e=[],t=301,n,i,r,a,o,l,c,h){super(e,t,n,i,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Bc extends At{constructor(e,t,n,i,r,a,o,l,c){super(e,t,n,i,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Bi extends At{constructor(e,t,n=1014,i,r,a,o=1003,l=1003,c,h=1026,u=1){if(h!==1026&&h!==1027)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:u};super(f,i,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new tr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class Gc extends Bi{constructor(e,t=1014,n=301,i,r,a=1003,o=1003,l,c=1026){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,i,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class co extends At{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Xn extends Tt{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let f=0,d=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,i,a,2),g("x","z","y",1,-1,e,n,-t,i,a,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new rt(c,3)),this.setAttribute("normal",new rt(h,3)),this.setAttribute("uv",new rt(u,2));function g(v,m,p,b,A,_,T,E,C,x,w){const I=_/C,z=T/x,G=_/2,Y=T/2,O=E/2,J=C+1,ie=x+1;let $=0,Z=0;const se=new F;for(let ae=0;ae<ie;ae++){const he=ae*z-Y;for(let Le=0;Le<J;Le++){const Ce=Le*I-G;se[v]=Ce*b,se[m]=he*A,se[p]=O,c.push(se.x,se.y,se.z),se[v]=0,se[m]=0,se[p]=E>0?1:-1,h.push(se.x,se.y,se.z),u.push(Le/C),u.push(1-ae/x),$+=1}}for(let ae=0;ae<x;ae++)for(let he=0;he<C;he++){const Le=f+he+J*ae,Ce=f+he+J*(ae+1),Ke=f+(he+1)+J*(ae+1),Ye=f+(he+1)+J*ae;l.push(Le,Ce,Ye),l.push(Ce,Ke,Ye),Z+=6}o.addGroup(d,Z,w),d+=Z,f+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Cr extends Tt{constructor(e=1,t=1,n=1,i=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const h=[],u=[],f=[],d=[];let g=0;const v=[],m=n/2;let p=0;b(),a===!1&&(e>0&&A(!0),t>0&&A(!1)),this.setIndex(h),this.setAttribute("position",new rt(u,3)),this.setAttribute("normal",new rt(f,3)),this.setAttribute("uv",new rt(d,2));function b(){const _=new F,T=new F;let E=0;const C=(t-e)/n;for(let x=0;x<=r;x++){const w=[],I=x/r,z=I*(t-e)+e;for(let G=0;G<=i;G++){const Y=G/i,O=Y*l+o,J=Math.sin(O),ie=Math.cos(O);T.x=z*J,T.y=-I*n+m,T.z=z*ie,u.push(T.x,T.y,T.z),_.set(J,C,ie).normalize(),f.push(_.x,_.y,_.z),d.push(Y,1-I),w.push(g++)}v.push(w)}for(let x=0;x<i;x++)for(let w=0;w<r;w++){const I=v[w][x],z=v[w+1][x],G=v[w+1][x+1],Y=v[w][x+1];(e>0||w!==0)&&(h.push(I,z,Y),E+=3),(t>0||w!==r-1)&&(h.push(z,G,Y),E+=3)}c.addGroup(p,E,0),p+=E}function A(_){const T=g,E=new de,C=new F;let x=0;const w=_===!0?e:t,I=_===!0?1:-1;for(let G=1;G<=i;G++)u.push(0,m*I,0),f.push(0,I,0),d.push(.5,.5),g++;const z=g;for(let G=0;G<=i;G++){const O=G/i*l+o,J=Math.cos(O),ie=Math.sin(O);C.x=w*ie,C.y=m*I,C.z=w*J,u.push(C.x,C.y,C.z),f.push(0,I,0),E.x=J*.5+.5,E.y=ie*.5*I+.5,d.push(E.x,E.y),g++}for(let G=0;G<i;G++){const Y=T+G,O=z+G;_===!0?h.push(O,O+1,Y):h.push(O+1,O,Y),x+=3}c.addGroup(p,x,_===!0?1:2),p+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Cr(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class qr extends Tt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],a=[];o(i),c(n),h(),this.setAttribute("position",new rt(r,3)),this.setAttribute("normal",new rt(r.slice(),3)),this.setAttribute("uv",new rt(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(b){const A=new F,_=new F,T=new F;for(let E=0;E<t.length;E+=3)d(t[E+0],A),d(t[E+1],_),d(t[E+2],T),l(A,_,T,b)}function l(b,A,_,T){const E=T+1,C=[];for(let x=0;x<=E;x++){C[x]=[];const w=b.clone().lerp(_,x/E),I=A.clone().lerp(_,x/E),z=E-x;for(let G=0;G<=z;G++)G===0&&x===E?C[x][G]=w:C[x][G]=w.clone().lerp(I,G/z)}for(let x=0;x<E;x++)for(let w=0;w<2*(E-x)-1;w++){const I=Math.floor(w/2);w%2===0?(f(C[x][I+1]),f(C[x+1][I]),f(C[x][I])):(f(C[x][I+1]),f(C[x+1][I+1]),f(C[x+1][I]))}}function c(b){const A=new F;for(let _=0;_<r.length;_+=3)A.x=r[_+0],A.y=r[_+1],A.z=r[_+2],A.normalize().multiplyScalar(b),r[_+0]=A.x,r[_+1]=A.y,r[_+2]=A.z}function h(){const b=new F;for(let A=0;A<r.length;A+=3){b.x=r[A+0],b.y=r[A+1],b.z=r[A+2];const _=m(b)/2/Math.PI+.5,T=p(b)/Math.PI+.5;a.push(_,1-T)}g(),u()}function u(){for(let b=0;b<a.length;b+=6){const A=a[b+0],_=a[b+2],T=a[b+4],E=Math.max(A,_,T),C=Math.min(A,_,T);E>.9&&C<.1&&(A<.2&&(a[b+0]+=1),_<.2&&(a[b+2]+=1),T<.2&&(a[b+4]+=1))}}function f(b){r.push(b.x,b.y,b.z)}function d(b,A){const _=b*3;A.x=e[_+0],A.y=e[_+1],A.z=e[_+2]}function g(){const b=new F,A=new F,_=new F,T=new F,E=new de,C=new de,x=new de;for(let w=0,I=0;w<r.length;w+=9,I+=6){b.set(r[w+0],r[w+1],r[w+2]),A.set(r[w+3],r[w+4],r[w+5]),_.set(r[w+6],r[w+7],r[w+8]),E.set(a[I+0],a[I+1]),C.set(a[I+2],a[I+3]),x.set(a[I+4],a[I+5]),T.copy(b).add(A).add(_).divideScalar(3);const z=m(T);v(E,I+0,b,z),v(C,I+2,A,z),v(x,I+4,_,z)}}function v(b,A,_,T){T<0&&b.x===1&&(a[A]=b.x-1),_.x===0&&_.z===0&&(a[A]=T/2/Math.PI+.5)}function m(b){return Math.atan2(b.z,-b.x)}function p(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qr(e.vertices,e.indices,e.radius,e.detail)}}class an{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Be("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let i=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(r-1);const h=n[i],f=n[i+1]-h,d=(a-h)/f;return(i+d)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);const a=this.getPoint(i),o=this.getPoint(r),l=t||(a.isVector2?new de:new F);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new F,i=[],r=[],a=[],o=new F,l=new Ze;for(let d=0;d<=e;d++){const g=d/e;i[d]=this.getTangentAt(g,new F)}r[0]=new F,a[0]=new F;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),f=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),f<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let d=1;d<=e;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(i[d-1],i[d]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(et(i[d-1].dot(i[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(o,g))}a[d].crossVectors(i[d],r[d])}if(t===!0){let d=Math.acos(et(r[0].dot(r[e]),-1,1));d/=e,i[0].dot(o.crossVectors(r[0],r[e]))>0&&(d=-d);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(i[g],d*g)),a[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Pr extends an{constructor(e=0,t=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new de){const n=t,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);const o=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=l-this.aX,d=c-this.aY;l=f*h-d*u+this.aX,c=f*u+d*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class zc extends Pr{constructor(e,t,n,i,r,a){super(e,t,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Lr(){let s=0,e=0,t=0,n=0;function i(r,a,o,l){s=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){i(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let f=(a-r)/c-(o-r)/(c+h)+(o-a)/h,d=(o-a)/h-(l-a)/(h+u)+(l-o)/u;f*=h,d*=h,i(a,o,f,d)},calc:function(r){const a=r*r,o=a*r;return s+e*r+t*a+n*o}}}const ho=new F,uo=new F,Ir=new Lr,Nr=new Lr,Dr=new Lr;class kc extends an{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new F){const n=t,i=this.points,r=i.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=i[(o-1)%r]:(uo.subVectors(i[0],i[1]).add(i[0]),c=uo);const u=i[o%r],f=i[(o+1)%r];if(this.closed||o+2<r?h=i[(o+2)%r]:(ho.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=ho),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),d),v=Math.pow(u.distanceToSquared(f),d),m=Math.pow(f.distanceToSquared(h),d);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),Ir.initNonuniformCatmullRom(c.x,u.x,f.x,h.x,g,v,m),Nr.initNonuniformCatmullRom(c.y,u.y,f.y,h.y,g,v,m),Dr.initNonuniformCatmullRom(c.z,u.z,f.z,h.z,g,v,m)}else this.curveType==="catmullrom"&&(Ir.initCatmullRom(c.x,u.x,f.x,h.x,this.tension),Nr.initCatmullRom(c.y,u.y,f.y,h.y,this.tension),Dr.initCatmullRom(c.z,u.z,f.z,h.z,this.tension));return n.set(Ir.calc(l),Nr.calc(l),Dr.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new F().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function fo(s,e,t,n,i){const r=(n-e)*.5,a=(i-t)*.5,o=s*s,l=s*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*s+t}function Vc(s,e){const t=1-s;return t*t*e}function Hc(s,e){return 2*(1-s)*s*e}function Wc(s,e){return s*s*e}function Gi(s,e,t,n){return Vc(s,e)+Hc(s,t)+Wc(s,n)}function Xc(s,e){const t=1-s;return t*t*t*e}function Yc(s,e){const t=1-s;return 3*t*t*s*e}function Kc(s,e){return 3*(1-s)*s*s*e}function Jc(s,e){return s*s*s*e}function zi(s,e,t,n,i){return Xc(s,e)+Yc(s,t)+Kc(s,n)+Jc(s,i)}class po extends an{constructor(e=new de,t=new de,n=new de,i=new de){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new de){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(zi(e,i.x,r.x,a.x,o.x),zi(e,i.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Zc extends an{constructor(e=new F,t=new F,n=new F,i=new F){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new F){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(zi(e,i.x,r.x,a.x,o.x),zi(e,i.y,r.y,a.y,o.y),zi(e,i.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class mo extends an{constructor(e=new de,t=new de){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new de){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new de){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class $c extends an{constructor(e=new F,t=new F){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new F){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new F){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class go extends an{constructor(e=new de,t=new de,n=new de){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new de){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(Gi(e,i.x,r.x,a.x),Gi(e,i.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Qc extends an{constructor(e=new F,t=new F,n=new F){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new F){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(Gi(e,i.x,r.x,a.x),Gi(e,i.y,r.y,a.y),Gi(e,i.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class _o extends an{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new de){const n=t,i=this.points,r=(i.length-1)*e,a=Math.floor(r),o=r-a,l=i[a===0?a:a-1],c=i[a],h=i[a>i.length-2?i.length-1:a+1],u=i[a>i.length-3?i.length-1:a+2];return n.set(fo(o,l.x,c.x,h.x,u.x),fo(o,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new de().fromArray(i))}return this}}var Ur=Object.freeze({__proto__:null,ArcCurve:zc,CatmullRomCurve3:kc,CubicBezierCurve:po,CubicBezierCurve3:Zc,EllipseCurve:Pr,LineCurve:mo,LineCurve3:$c,QuadraticBezierCurve:go,QuadraticBezierCurve3:Qc,SplineCurve:_o});class jc extends an{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ur[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const a=i[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const a=r[i],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(new Ur[i.type]().fromJSON(i))}return this}}class fi extends jc{constructor(e){super(),this.type="Path",this.currentPoint=new de,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new mo(this.currentPoint.clone(),new de(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){const r=new go(this.currentPoint.clone(),new de(e,t),new de(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,r,a){const o=new po(this.currentPoint.clone(),new de(e,t),new de(n,i),new de(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new _o(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,i,r,a),this}absarc(e,t,n,i,r,a){return this.absellipse(e,t,n,n,i,r,a),this}ellipse(e,t,n,i,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,i,r,a,o,l),this}absellipse(e,t,n,i,r,a,o,l){const c=new Pr(e,t,n,i,r,a,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class xo extends fi{constructor(e){super(e),this.uuid=zt(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(new fi().fromJSON(i))}return this}}function eh(s,e,t=2){const n=e&&e.length,i=n?e[0]*t:s.length;let r=vo(s,0,i,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=rh(s,e,r,t)),s.length>80*t){o=s[0],l=s[1];let h=o,u=l;for(let f=t;f<i;f+=t){const d=s[f],g=s[f+1];d<o&&(o=d),g<l&&(l=g),d>h&&(h=d),g>u&&(u=g)}c=Math.max(h-o,u-l),c=c!==0?32767/c:0}return ki(r,a,t,o,l,c,0),a}function vo(s,e,t,n,i){let r;if(i===gh(s,e,t,n)>0)for(let a=e;a<t;a+=n)r=To(a/n|0,s[a],s[a+1],r);else for(let a=t-n;a>=e;a-=n)r=To(a/n|0,s[a],s[a+1],r);return r&&di(r,r.next)&&(Wi(r),r=r.next),r}function Yn(s,e){if(!s)return s;e||(e=s);let t=s,n;do if(n=!1,!t.steiner&&(di(t,t.next)||vt(t.prev,t,t.next)===0)){if(Wi(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function ki(s,e,t,n,i,r,a){if(!s)return;!a&&r&&hh(s,n,i,r);let o=s;for(;s.prev!==s.next;){const l=s.prev,c=s.next;if(r?nh(s,n,i,r):th(s)){e.push(l.i,s.i,c.i),Wi(s),s=c.next,o=c.next;continue}if(s=c,s===o){a?a===1?(s=ih(Yn(s),e),ki(s,e,t,n,i,r,2)):a===2&&sh(s,e,t,n,i,r):ki(Yn(s),e,t,n,i,r,1);break}}}function th(s){const e=s.prev,t=s,n=s.next;if(vt(e,t,n)>=0)return!1;const i=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=Math.min(i,r,a),u=Math.min(o,l,c),f=Math.max(i,r,a),d=Math.max(o,l,c);let g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=f&&g.y>=u&&g.y<=d&&Vi(i,o,r,l,a,c,g.x,g.y)&&vt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function nh(s,e,t,n){const i=s.prev,r=s,a=s.next;if(vt(i,r,a)>=0)return!1;const o=i.x,l=r.x,c=a.x,h=i.y,u=r.y,f=a.y,d=Math.min(o,l,c),g=Math.min(h,u,f),v=Math.max(o,l,c),m=Math.max(h,u,f),p=Fr(d,g,e,t,n),b=Fr(v,m,e,t,n);let A=s.prevZ,_=s.nextZ;for(;A&&A.z>=p&&_&&_.z<=b;){if(A.x>=d&&A.x<=v&&A.y>=g&&A.y<=m&&A!==i&&A!==a&&Vi(o,h,l,u,c,f,A.x,A.y)&&vt(A.prev,A,A.next)>=0||(A=A.prevZ,_.x>=d&&_.x<=v&&_.y>=g&&_.y<=m&&_!==i&&_!==a&&Vi(o,h,l,u,c,f,_.x,_.y)&&vt(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;A&&A.z>=p;){if(A.x>=d&&A.x<=v&&A.y>=g&&A.y<=m&&A!==i&&A!==a&&Vi(o,h,l,u,c,f,A.x,A.y)&&vt(A.prev,A,A.next)>=0)return!1;A=A.prevZ}for(;_&&_.z<=b;){if(_.x>=d&&_.x<=v&&_.y>=g&&_.y<=m&&_!==i&&_!==a&&Vi(o,h,l,u,c,f,_.x,_.y)&&vt(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function ih(s,e){let t=s;do{const n=t.prev,i=t.next.next;!di(n,i)&&So(n,t,t.next,i)&&Hi(n,i)&&Hi(i,n)&&(e.push(n.i,t.i,i.i),Wi(t),Wi(t.next),t=s=i),t=t.next}while(t!==s);return Yn(t)}function sh(s,e,t,n,i,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&dh(a,o)){let l=yo(a,o);a=Yn(a,a.next),l=Yn(l,l.next),ki(a,e,t,n,i,r,0),ki(l,e,t,n,i,r,0);return}o=o.next}a=a.next}while(a!==s)}function rh(s,e,t,n){const i=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*n,l=r<a-1?e[r+1]*n:s.length,c=vo(s,o,l,n,!1);c===c.next&&(c.steiner=!0),i.push(fh(c))}i.sort(ah);for(let r=0;r<i.length;r++)t=oh(i[r],t);return t}function ah(s,e){let t=s.x-e.x;if(t===0&&(t=s.y-e.y,t===0)){const n=(s.next.y-s.y)/(s.next.x-s.x),i=(e.next.y-e.y)/(e.next.x-e.x);t=n-i}return t}function oh(s,e){const t=lh(s,e);if(!t)return e;const n=yo(t,s);return Yn(n,n.next),Yn(t,t.next)}function lh(s,e){let t=e;const n=s.x,i=s.y;let r=-1/0,a;if(di(s,t))return t;do{if(di(s,t.next))return t.next;if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){const u=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&Mo(i<c?n:r,i,l,c,i<c?r:n,i,t.x,t.y)){const u=Math.abs(i-t.y)/(n-t.x);Hi(t,s)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&ch(a,t)))&&(a=t,h=u)}t=t.next}while(t!==o);return a}function ch(s,e){return vt(s.prev,s,e.prev)<0&&vt(e.next,s,s.next)<0}function hh(s,e,t,n){let i=s;do i.z===0&&(i.z=Fr(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,uh(i)}function uh(s){let e,t=1;do{let n=s,i;s=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,o--):(i=a,a=a.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=a}r.nextZ=null,t*=2}while(e>1);return s}function Fr(s,e,t,n,i){return s=(s-t)*i|0,e=(e-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function fh(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function Mo(s,e,t,n,i,r,a,o){return(i-a)*(e-o)>=(s-a)*(r-o)&&(s-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(i-a)*(n-o)}function Vi(s,e,t,n,i,r,a,o){return!(s===a&&e===o)&&Mo(s,e,t,n,i,r,a,o)}function dh(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!ph(s,e)&&(Hi(s,e)&&Hi(e,s)&&mh(s,e)&&(vt(s.prev,s,e.prev)||vt(s,e.prev,e))||di(s,e)&&vt(s.prev,s,s.next)>0&&vt(e.prev,e,e.next)>0)}function vt(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function di(s,e){return s.x===e.x&&s.y===e.y}function So(s,e,t,n){const i=Ls(vt(s,e,t)),r=Ls(vt(s,e,n)),a=Ls(vt(t,n,s)),o=Ls(vt(t,n,e));return!!(i!==r&&a!==o||i===0&&Ps(s,t,e)||r===0&&Ps(s,n,e)||a===0&&Ps(t,s,n)||o===0&&Ps(t,e,n))}function Ps(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function Ls(s){return s>0?1:s<0?-1:0}function ph(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&So(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function Hi(s,e){return vt(s.prev,s,s.next)<0?vt(s,e,s.next)>=0&&vt(s,s.prev,e)>=0:vt(s,e,s.prev)<0||vt(s,s.next,e)<0}function mh(s,e){let t=s,n=!1;const i=(s.x+e.x)/2,r=(s.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&i<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==s);return n}function yo(s,e){const t=Or(s.i,s.x,s.y),n=Or(e.i,e.x,e.y),i=s.next,r=e.prev;return s.next=e,e.prev=s,t.next=i,i.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function To(s,e,t,n){const i=Or(s,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Wi(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Or(s,e,t){return{i:s,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function gh(s,e,t,n){let i=0;for(let r=e,a=t-n;r<t;r+=n)i+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return i}class _h{static triangulate(e,t,n=2){return eh(e,t,n)}}class Ln{static area(e){const t=e.length;let n=0;for(let i=t-1,r=0;r<t;i=r++)n+=e[i].x*e[r].y-e[r].x*e[i].y;return n*.5}static isClockWise(e){return Ln.area(e)<0}static triangulateShape(e,t){const n=[],i=[],r=[];bo(e),Eo(n,e);let a=e.length;t.forEach(bo);for(let l=0;l<t.length;l++)i.push(a),a+=t[l].length,Eo(n,t[l]);const o=_h.triangulate(n,i);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function bo(s){const e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function Eo(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}class Is extends Tt{constructor(e=new xo([new de(.5,.5),new de(-.5,.5),new de(-.5,-.5),new de(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,i=[],r=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];a(c)}this.setAttribute("position",new rt(i,3)),this.setAttribute("uv",new rt(r,2)),this.computeVertexNormals();function a(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1;let f=t.bevelEnabled!==void 0?t.bevelEnabled:!0,d=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:d-.1,v=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const p=t.extrudePath,b=t.UVGenerator!==void 0?t.UVGenerator:xh;let A,_=!1,T,E,C,x;if(p){A=p.getSpacedPoints(h),_=!0,f=!1;const R=p.isCatmullRomCurve3?p.closed:!1;T=p.computeFrenetFrames(h,R),E=new F,C=new F,x=new F}f||(m=0,d=0,g=0,v=0);const w=o.extractPoints(c);let I=w.shape;const z=w.holes;if(!Ln.isClockWise(I)){I=I.reverse();for(let R=0,k=z.length;R<k;R++){const D=z[R];Ln.isClockWise(D)&&(z[R]=D.reverse())}}function Y(R){const D=10000000000000001e-36;let K=R[0];for(let Q=1;Q<=R.length;Q++){const le=Q%R.length,me=R[le],pe=me.x-K.x,X=me.y-K.y,S=pe*pe+X*X,Ae=Math.max(Math.abs(me.x),Math.abs(me.y),Math.abs(K.x),Math.abs(K.y)),Ne=D*Ae*Ae;if(S<=Ne){R.splice(le,1),Q--;continue}K=me}}Y(I),z.forEach(Y);const O=z.length,J=I;for(let R=0;R<O;R++){const k=z[R];I=I.concat(k)}function ie(R,k,D){return k||Xe("ExtrudeGeometry: vec does not exist"),R.clone().addScaledVector(k,D)}const $=I.length;function Z(R,k,D){let K,Q,le;const me=R.x-k.x,pe=R.y-k.y,X=D.x-R.x,S=D.y-R.y,Ae=me*me+pe*pe,Ne=me*S-pe*X;if(Math.abs(Ne)>Number.EPSILON){const q=Math.sqrt(Ae),M=Math.sqrt(X*X+S*S),W=k.x-pe/q,j=k.y+me/q,oe=D.x-S/M,xe=D.y+X/M,ve=((oe-W)*S-(xe-j)*X)/(me*S-pe*X);K=W+me*ve-R.x,Q=j+pe*ve-R.y;const ce=K*K+Q*Q;if(ce<=2)return new de(K,Q);le=Math.sqrt(ce/2)}else{let q=!1;me>Number.EPSILON?X>Number.EPSILON&&(q=!0):me<-Number.EPSILON?X<-Number.EPSILON&&(q=!0):Math.sign(pe)===Math.sign(S)&&(q=!0),q?(K=-pe,Q=me,le=Math.sqrt(Ae)):(K=me,Q=pe,le=Math.sqrt(Ae/2))}return new de(K/le,Q/le)}const se=[];for(let R=0,k=J.length,D=k-1,K=R+1;R<k;R++,D++,K++)D===k&&(D=0),K===k&&(K=0),se[R]=Z(J[R],J[D],J[K]);const ae=[];let he,Le=se.concat();for(let R=0,k=O;R<k;R++){const D=z[R];he=[];for(let K=0,Q=D.length,le=Q-1,me=K+1;K<Q;K++,le++,me++)le===Q&&(le=0),me===Q&&(me=0),he[K]=Z(D[K],D[le],D[me]);ae.push(he),Le=Le.concat(he)}let Ce;if(m===0)Ce=Ln.triangulateShape(J,z);else{const R=[],k=[];for(let D=0;D<m;D++){const K=D/m,Q=d*Math.cos(K*Math.PI/2),le=g*Math.sin(K*Math.PI/2)+v;for(let me=0,pe=J.length;me<pe;me++){const X=ie(J[me],se[me],le);L(X.x,X.y,-Q),K===0&&R.push(X)}for(let me=0,pe=O;me<pe;me++){const X=z[me];he=ae[me];const S=[];for(let Ae=0,Ne=X.length;Ae<Ne;Ae++){const q=ie(X[Ae],he[Ae],le);L(q.x,q.y,-Q),K===0&&S.push(q)}K===0&&k.push(S)}}Ce=Ln.triangulateShape(R,k)}const Ke=Ce.length,Ye=g+v;for(let R=0;R<$;R++){const k=f?ie(I[R],Le[R],Ye):I[R];_?(C.copy(T.normals[0]).multiplyScalar(k.x),E.copy(T.binormals[0]).multiplyScalar(k.y),x.copy(A[0]).add(C).add(E),L(x.x,x.y,x.z)):L(k.x,k.y,0)}for(let R=1;R<=h;R++)for(let k=0;k<$;k++){const D=f?ie(I[k],Le[k],Ye):I[k];_?(C.copy(T.normals[R]).multiplyScalar(D.x),E.copy(T.binormals[R]).multiplyScalar(D.y),x.copy(A[R]).add(C).add(E),L(x.x,x.y,x.z)):L(D.x,D.y,u/h*R)}for(let R=m-1;R>=0;R--){const k=R/m,D=d*Math.cos(k*Math.PI/2),K=g*Math.sin(k*Math.PI/2)+v;for(let Q=0,le=J.length;Q<le;Q++){const me=ie(J[Q],se[Q],K);L(me.x,me.y,u+D)}for(let Q=0,le=z.length;Q<le;Q++){const me=z[Q];he=ae[Q];for(let pe=0,X=me.length;pe<X;pe++){const S=ie(me[pe],he[pe],K);_?L(S.x,S.y+A[h-1].y,A[h-1].x+D):L(S.x,S.y,u+D)}}}$e(),U();function $e(){const R=i.length/3;if(f){let k=0,D=$*k;for(let K=0;K<Ke;K++){const Q=Ce[K];P(Q[2]+D,Q[1]+D,Q[0]+D)}k=h+m*2,D=$*k;for(let K=0;K<Ke;K++){const Q=Ce[K];P(Q[0]+D,Q[1]+D,Q[2]+D)}}else{for(let k=0;k<Ke;k++){const D=Ce[k];P(D[2],D[1],D[0])}for(let k=0;k<Ke;k++){const D=Ce[k];P(D[0]+$*h,D[1]+$*h,D[2]+$*h)}}n.addGroup(R,i.length/3-R,0)}function U(){const R=i.length/3;let k=0;N(J,k),k+=J.length;for(let D=0,K=z.length;D<K;D++){const Q=z[D];N(Q,k),k+=Q.length}n.addGroup(R,i.length/3-R,1)}function N(R,k){let D=R.length;for(;--D>=0;){const K=D;let Q=D-1;Q<0&&(Q=R.length-1);for(let le=0,me=h+m*2;le<me;le++){const pe=$*le,X=$*(le+1),S=k+K+pe,Ae=k+Q+pe,Ne=k+Q+X,q=k+K+X;B(S,Ae,Ne,q)}}}function L(R,k,D){l.push(R),l.push(k),l.push(D)}function P(R,k,D){ne(R),ne(k),ne(D);const K=i.length/3,Q=b.generateTopUV(n,i,K-3,K-2,K-1);_e(Q[0]),_e(Q[1]),_e(Q[2])}function B(R,k,D,K){ne(R),ne(k),ne(K),ne(k),ne(D),ne(K);const Q=i.length/3,le=b.generateSideWallUV(n,i,Q-6,Q-3,Q-2,Q-1);_e(le[0]),_e(le[1]),_e(le[3]),_e(le[1]),_e(le[2]),_e(le[3])}function ne(R){i.push(l[R*3+0]),i.push(l[R*3+1]),i.push(l[R*3+2])}function _e(R){r.push(R.x),r.push(R.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return vh(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,a=e.shapes.length;r<a;r++){const o=t[e.shapes[r]];n.push(o)}const i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new Ur[i.type]().fromJSON(i)),new Is(n,e.options)}}const xh={generateTopUV:function(s,e,t,n,i){const r=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[i*3],h=e[i*3+1];return[new de(r,a),new de(o,l),new de(c,h)]},generateSideWallUV:function(s,e,t,n,i,r){const a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],f=e[i*3],d=e[i*3+1],g=e[i*3+2],v=e[r*3],m=e[r*3+1],p=e[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new de(a,1-l),new de(c,1-u),new de(f,1-g),new de(v,1-p)]:[new de(o,1-l),new de(h,1-u),new de(d,1-g),new de(m,1-p)]}};function vh(s,e,t){if(t.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){const r=s[n];t.shapes.push(r.uuid)}else t.shapes.push(s.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Br extends qr{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Br(e.radius,e.detail)}}class Ns extends Tt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,u=e/o,f=t/l,d=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const b=p*f-a;for(let A=0;A<c;A++){const _=A*u-r;g.push(_,-b,0),v.push(0,0,1),m.push(A/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let b=0;b<o;b++){const A=b+c*p,_=b+c*(p+1),T=b+1+c*(p+1),E=b+1+c*p;d.push(A,_,E),d.push(_,T,E)}this.setIndex(d),this.setAttribute("position",new rt(g,3)),this.setAttribute("normal",new rt(v,3)),this.setAttribute("uv",new rt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ns(e.width,e.height,e.widthSegments,e.heightSegments)}}class Gr extends Tt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new F,f=new F,d=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){const b=[],A=p/n,_=a+A*o,T=e*Math.cos(_),E=Math.sqrt(e*e-T*T);let C=0;p===0&&a===0?C=.5/t:p===n&&l===Math.PI&&(C=-.5/t);for(let x=0;x<=t;x++){const w=x/t,I=i+w*r;u.x=-E*Math.cos(I),u.y=T,u.z=E*Math.sin(I),g.push(u.x,u.y,u.z),f.copy(u).normalize(),v.push(f.x,f.y,f.z),m.push(w+C,1-A),b.push(c++)}h.push(b)}for(let p=0;p<n;p++)for(let b=0;b<t;b++){const A=h[p][b+1],_=h[p][b],T=h[p+1][b],E=h[p+1][b+1];(p!==0||a>0)&&d.push(A,_,E),(p!==n-1||l<Math.PI)&&d.push(_,T,E)}this.setIndex(d),this.setAttribute("position",new rt(g,3)),this.setAttribute("normal",new rt(v,3)),this.setAttribute("uv",new rt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gr(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class zr extends Tt{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),i=Math.floor(i);const l=[],c=[],h=[],u=[],f=new F,d=new F,g=new F;for(let v=0;v<=n;v++){const m=a+v/n*o;for(let p=0;p<=i;p++){const b=p/i*r;d.x=(e+t*Math.cos(m))*Math.cos(b),d.y=(e+t*Math.cos(m))*Math.sin(b),d.z=t*Math.sin(m),c.push(d.x,d.y,d.z),f.x=e*Math.cos(b),f.y=e*Math.sin(b),g.subVectors(d,f).normalize(),h.push(g.x,g.y,g.z),u.push(p/i),u.push(v/n)}}for(let v=1;v<=n;v++)for(let m=1;m<=i;m++){const p=(i+1)*v+m-1,b=(i+1)*(v-1)+m-1,A=(i+1)*(v-1)+m,_=(i+1)*v+m;l.push(p,b,_),l.push(b,A,_)}this.setIndex(l),this.setAttribute("position",new rt(c,3)),this.setAttribute("normal",new rt(h,3)),this.setAttribute("uv",new rt(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new zr(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}}class kr extends Tt{constructor(e=1,t=.4,n=64,i=8,r=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:n,radialSegments:i,p:r,q:a},n=Math.floor(n),i=Math.floor(i);const o=[],l=[],c=[],h=[],u=new F,f=new F,d=new F,g=new F,v=new F,m=new F,p=new F;for(let A=0;A<=n;++A){const _=A/n*r*Math.PI*2;b(_,r,a,e,d),b(_+.01,r,a,e,g),m.subVectors(g,d),p.addVectors(g,d),v.crossVectors(m,p),p.crossVectors(v,m),v.normalize(),p.normalize();for(let T=0;T<=i;++T){const E=T/i*Math.PI*2,C=-t*Math.cos(E),x=t*Math.sin(E);u.x=d.x+(C*p.x+x*v.x),u.y=d.y+(C*p.y+x*v.y),u.z=d.z+(C*p.z+x*v.z),l.push(u.x,u.y,u.z),f.subVectors(u,d).normalize(),c.push(f.x,f.y,f.z),h.push(A/n),h.push(T/i)}}for(let A=1;A<=n;A++)for(let _=1;_<=i;_++){const T=(i+1)*(A-1)+(_-1),E=(i+1)*A+(_-1),C=(i+1)*A+_,x=(i+1)*(A-1)+_;o.push(T,E,x),o.push(E,C,x)}this.setIndex(o),this.setAttribute("position",new rt(l,3)),this.setAttribute("normal",new rt(c,3)),this.setAttribute("uv",new rt(h,2));function b(A,_,T,E,C){const x=Math.cos(A),w=Math.sin(A),I=T/_*A,z=Math.cos(I);C.x=E*(2+z)*.5*x,C.y=E*(2+z)*w*.5,C.z=E*Math.sin(I)*.5}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new kr(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}}function pi(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];if(Ao(i))i.isRenderTargetTexture?(Be("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(Ao(i[0])){const r=[];for(let a=0,o=i.length;a<o;a++)r[a]=i[a].clone();e[t][n]=r}else e[t][n]=i.slice();else e[t][n]=i}}return e}function Nt(s){const e={};for(let t=0;t<s.length;t++){const n=pi(s[t]);for(const i in n)e[i]=n[i]}return e}function Ao(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function Mh(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function wo(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:nt.workingColorSpace}const Sh={clone:pi,merge:Nt};var yh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Th=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class on extends en{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=yh,this.fragmentShader=Th,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=pi(e.uniforms),this.uniformsGroups=Mh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new He().setHex(i.value);break;case"v2":this.uniforms[n].value=new de().fromArray(i.value);break;case"v3":this.uniforms[n].value=new F().fromArray(i.value);break;case"v4":this.uniforms[n].value=new ut().fromArray(i.value);break;case"m3":this.uniforms[n].value=new Ve().fromArray(i.value);break;case"m4":this.uniforms[n].value=new Ze().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class bh extends on{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Xi extends en{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new He(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new He(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new de(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class tn extends Xi{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new de(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return et(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new He(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new He(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new He(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Eh extends en{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new He(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new He(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new de(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gn,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Ah extends en{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class wh extends en{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function In(s,e){return!s||s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function Ds(s){return s!==void 0&&s.inTangents!==void 0&&s.outTangents!==void 0}function Rh(s){function e(i,r){return s[i]-s[r]}const t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Ro(s,e,t){const n=s.length,i=new s.constructor(n);for(let r=0,a=0;a!==n;++r){const o=t[r]*e;for(let l=0;l!==e;++l)i[a++]=s[o+l]}return i}function Ch(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=s[i++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=s[i++];while(r!==void 0)}class mi{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=i,i=t[++n],e<i)break e}a=t.length;break t}if(!(e>=r)){const o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let a=0;a!==i;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class qh extends mi{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:2400,endingEnd:2400}}intervalChanged_(e,t,n){const i=this.parameterPositions;let r=e-2,a=e+1,o=i[r],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case 2401:r=e,o=2*t-n;break;case 2402:r=i.length-2,o=t+i[r]-i[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case 2401:a=e,l=2*n-t;break;case 2402:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}const c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,d=this._weightNext,g=(n-t)/(i-t),v=g*g,m=v*g,p=-f*m+2*f*v-f*g,b=(1+f)*m+(-1.5-2*f)*v+(-.5+f)*g+1,A=(-1-d)*m+(1.5+d)*v+.5*g,_=d*m-d*v;for(let T=0;T!==o;++T)r[T]=p*a[h+T]+b*a[c+T]+A*a[l+T]+_*a[u+T];return r}}class Ph extends mi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(i-t),u=1-h;for(let f=0;f!==o;++f)r[f]=a[c+f]*u+a[l+f]*h;return r}}class Lh extends mi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class Ih extends mi{interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.inTangents,u=this.outTangents;if(!h||!u){const g=(n-t)/(i-t),v=1-g;for(let m=0;m!==o;++m)r[m]=a[c+m]*v+a[l+m]*g;return r}const f=o*2,d=e-1;for(let g=0;g!==o;++g){const v=a[c+g],m=a[l+g],p=d*f+g*2,b=u[p],A=u[p+1],_=e*f+g*2,T=h[_],E=h[_+1],C=Dh(n,t,b,T,i);r[g]=Co(C,v,A,E,m)}return r}}function Co(s,e,t,n,i){const r=1-s;return r*r*r*e+3*r*r*s*t+3*r*s*s*n+s*s*s*i}function Nh(s,e,t,n,i){const r=1-s;return 3*r*r*(t-e)+6*r*s*(n-t)+3*s*s*(i-n)}function Dh(s,e,t,n,i){let r=(s-e)/(i-e);for(let a=0;a<8;a++){const o=Co(r,e,t,n,i)-s;if(Math.abs(o)<1e-10)break;const l=Nh(r,e,t,n,i);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}class nn{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=In(t,this.TimeBufferType),this.values=In(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:In(e.times,Array),values:In(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i),Ds(e.settings)&&(n.settings={inTangents:In(e.settings.inTangents,Array),outTangents:In(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Lh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ph(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new qh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new Ih(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case 2300:t=this.InterpolantFactoryMethodDiscrete;break;case 2301:t=this.InterpolantFactoryMethodLinear;break;case 2302:t=this.InterpolantFactoryMethodSmooth;break;case 2303:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Be("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return 2300;case this.InterpolantFactoryMethodLinear:return 2301;case this.InterpolantFactoryMethodSmooth:return 2302;case this.InterpolantFactoryMethodBezier:return 2303}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e;Ds(this.settings)&&(qo(this.settings.inTangents,e),qo(this.settings.outTangents,e))}return this}trim(e,t){const n=this.times,i=n.length;let r=0,a=i-1;for(;r!==i&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==i){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(Xe("KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,r=n.length;r===0&&(Xe("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const l=n[o];if(typeof l=="number"&&isNaN(l)){Xe("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Xe("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(i!==void 0&&Vl(i))for(let o=0,l=i.length;o!==l;++o){const c=i[o];if(isNaN(c)){Xe("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===2302,r=e.length-1;let a=1;for(let o=1;o<r;++o){let l=!1;const c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(i)l=!0;else{const u=o*n,f=u-n,d=u+n;for(let g=0;g!==n;++g){const v=t[u+g];if(v!==t[f+g]||v!==t[d+g]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const u=o*n,f=a*n;for(let d=0;d!==n;++d)t[f+d]=t[u+d]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,Ds(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}}function qo(s,e){for(let t=0,n=s.length;t!==n;t+=2)s[t]*=e}nn.prototype.ValueTypeName="",nn.prototype.TimeBufferType=Float32Array,nn.prototype.ValueBufferType=Float32Array,nn.prototype.DefaultInterpolation=2301;class gi extends nn{constructor(e,t,n){super(e,t,n)}}gi.prototype.ValueTypeName="bool",gi.prototype.ValueBufferType=Array,gi.prototype.DefaultInterpolation=2300,gi.prototype.InterpolantFactoryMethodLinear=void 0,gi.prototype.InterpolantFactoryMethodSmooth=void 0;class Po extends nn{constructor(e,t,n,i){super(e,t,n,i)}}Po.prototype.ValueTypeName="color";class Yi extends nn{constructor(e,t,n,i){super(e,t,n,i)}}Yi.prototype.ValueTypeName="number";class Uh extends mi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(i-t);let c=e*o;for(let h=c+o;c!==h;c+=4)pn.slerpFlat(r,0,a,c-o,a,c,l);return r}}class Ki extends nn{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new Uh(this.times,this.values,this.getValueSize(),e)}}Ki.prototype.ValueTypeName="quaternion",Ki.prototype.InterpolantFactoryMethodSmooth=void 0;class _i extends nn{constructor(e,t,n){super(e,t,n)}}_i.prototype.ValueTypeName="string",_i.prototype.ValueBufferType=Array,_i.prototype.DefaultInterpolation=2300,_i.prototype.InterpolantFactoryMethodLinear=void 0,_i.prototype.InterpolantFactoryMethodSmooth=void 0;class Us extends nn{constructor(e,t,n,i){super(e,t,n,i)}}Us.prototype.ValueTypeName="vector";class Fh{constructor(e="",t=-1,n=[],i=2500){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=zt(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(Bh(n[a]).scale(i));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=n.length;r!==a;++r)t.push(nn.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);const h=Rh(l);l=Ro(l,1,h),c=Ro(c,1,h),!i&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new Yi(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],h=c.name.match(r);if(h&&h.length>1){const u=h[1];let f=i[u];f||(i[u]=f=[]),f.push(c)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function Oh(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Yi;case"vector":case"vector2":case"vector3":case"vector4":return Us;case"color":return Po;case"quaternion":return Ki;case"bool":case"boolean":return gi;case"string":return _i}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function Bh(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=Oh(s.type);if(s.times===void 0){const n=[],i=[];Ch(s.keys,n,i,"value"),s.times=n,s.values=i}let t;return e.parse!==void 0?t=e.parse(s):t=new e(s.name,s.times,s.values,s.interpolation),Ds(s.settings)&&(t.settings={inTangents:In(s.settings.inTangents,Float32Array),outTangents:In(s.settings.outTangents,Float32Array)}),t}const Tn={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(Lo(s)||(this.files[s]=e))},get:function(s){if(this.enabled!==!1&&!Lo(s))return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};function Lo(s){try{const e=s.slice(s.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class Gh{constructor(e,t,n){const i=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&i.onStart!==void 0&&i.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=c.length;u<f;u+=2){const d=c[u],g=c[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const zh=new Gh;class Nn{constructor(e){this.manager=e!==void 0?e:zh,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}Nn.DEFAULT_MATERIAL_NAME="__DEFAULT";const bn={};class kh extends Error{constructor(e,t){super(e),this.response=t}}class Fs extends Nn{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=Tn.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(bn[e]!==void 0){bn[e].push({onLoad:t,onProgress:n,onError:i});return}bn[e]=[],bn[e].push({onLoad:t,onProgress:n,onError:i});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Be("FileLoader: HTTP Status 0 received."),typeof ReadableStream=="undefined"||c.body===void 0||c.body.getReader===void 0)return c;const h=bn[e],u=c.body.getReader(),f=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),d=f?parseInt(f):0,g=d!==0;let v=0;const m=new ReadableStream({start(p){b();function b(){u.read().then(({done:A,value:_})=>{if(A)p.close();else{v+=_.byteLength;const T=new ProgressEvent("progress",{lengthComputable:g,loaded:v,total:d});for(let E=0,C=h.length;E<C;E++){const x=h[E];x.onProgress&&x.onProgress(T)}p.enqueue(_),b()}},A=>{p.error(A)})}}});return new Response(m)}else throw new kh(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{const u=/charset="?([^;"\s]*)"?/i.exec(o),f=u&&u[1]?u[1].toLowerCase():void 0,d=new TextDecoder(f);return c.arrayBuffer().then(g=>d.decode(g))}}}).then(c=>{Tn.add(`file:${e}`,c);const h=bn[e];delete bn[e];for(let u=0,f=h.length;u<f;u++){const d=h[u];d.onLoad&&d.onLoad(c)}}).catch(c=>{const h=bn[e];if(h===void 0)throw this.manager.itemError(e),c;delete bn[e];for(let u=0,f=h.length;u<f;u++){const d=h[u];d.onError&&d.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const xi=new WeakMap;class Vh extends Nn{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=Tn.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let u=xi.get(a);u===void 0&&(u=[],xi.set(a,u)),u.push({onLoad:t,onError:i})}return a}const o=Ri("img");function l(){h(),t&&t(this);const u=xi.get(this)||[];for(let f=0;f<u.length;f++){const d=u[f];d.onLoad&&d.onLoad(this)}xi.delete(this),r.manager.itemEnd(e)}function c(u){h(),i&&i(u),Tn.remove(`image:${e}`);const f=xi.get(this)||[];for(let d=0;d<f.length;d++){const g=f[d];g.onError&&g.onError(u)}xi.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Tn.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}}class Hh extends Nn{constructor(e){super(e)}load(e,t,n,i){const r=new At,a=new Vh(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}}class Os extends gt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new He(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class Wh extends Os{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(gt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new He(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Vr=new Ze,Io=new F,No=new F;class Hr{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new de(512,512),this.mapType=1009,this.map=null,this.mapPass=null,this.matrix=new Ze,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Er,this._frameExtents=new de(1,1),this._viewportCount=1,this._viewports=[new ut(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;Io.setFromMatrixPosition(e.matrixWorld),t.position.copy(Io),No.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(No),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,i){Vr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Vr,e.coordinateSystem,e.reversedDepth);const r=this._frameExtents,a=i?i.z/r.x:1,o=i?i.w/r.y:1,l=i?i.x/r.x:0,c=i?i.y/r.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Vr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Bs=new F,Gs=new pn,ln=new F;class Do extends gt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ze,this.projectionMatrix=new Ze,this.projectionMatrixInverse=new Ze,this.coordinateSystem=2e3,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Bs,Gs,ln),ln.x===1&&ln.y===1&&ln.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Bs,Gs,ln.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Bs,Gs,ln),ln.x===1&&ln.y===1&&ln.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Bs,Gs,ln.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Dn=new F,Uo=new de,Fo=new de;class Dt extends Do{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=jn*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ci*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return jn*2*Math.atan(Math.tan(Ci*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Dn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Dn.x,Dn.y).multiplyScalar(-e/Dn.z),Dn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Dn.x,Dn.y).multiplyScalar(-e/Dn.z)}getViewSize(e,t){return this.getViewBounds(e,Uo,Fo),t.subVectors(Fo,Uo)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ci*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Xh extends Hr{constructor(){super(new Dt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=jn*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){const e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}}class Yh extends Os{constructor(e,t,n=0,i=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(gt.DEFAULT_UP),this.updateMatrix(),this.target=new gt,this.distance=n,this.angle=i,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new Xh}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class Kh extends Hr{constructor(){super(new Dt(90,1,.5,500)),this.isPointLightShadow=!0}}class Oo extends Os{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Kh}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class zs extends Do{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Jh extends Hr{constructor(){super(new zs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Bo extends Os{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(gt.DEFAULT_UP),this.updateMatrix(),this.target=new gt,this.shadow=new Jh}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class Ji{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const Wr=new WeakMap;class Zh extends Nn{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap=="undefined"&&Be("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch=="undefined"&&Be("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=Tn.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{Wr.has(a)===!0?(i&&i(Wr.get(a)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(c),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);return}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(c){return Tn.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){i&&i(c),Wr.set(l,c),Tn.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});Tn.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const vi=-90,Mi=1;class $h extends gt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Dt(vi,Mi,e,t);i.layers=this.layers,this.add(i);const r=new Dt(vi,Mi,e,t);r.layers=this.layers,this.add(r);const a=new Dt(vi,Mi,e,t);a.layers=this.layers,this.add(a);const o=new Dt(vi,Mi,e,t);o.layers=this.layers,this.add(o);const l=new Dt(vi,Mi,e,t);l.layers=this.layers,this.add(l);const c=new Dt(vi,Mi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,f,d),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Qh extends Dt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Xr="\\[\\]\\.:\\/",jh=new RegExp("["+Xr+"]","g"),Yr="[^"+Xr+"]",eu="[^"+Xr.replace("\\.","")+"]",tu=/((?:WC+[\/:])*)/.source.replace("WC",Yr),nu=/(WCOD+)?/.source.replace("WCOD",eu),iu=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Yr),su=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Yr),ru=new RegExp("^"+tu+nu+iu+su+"$"),au=["material","materials","bones","map"];class ou{constructor(e,t,n){const i=n||ht.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class ht{constructor(e,t,n){this.path=t,this.parsedPath=n||ht.parseTrackName(t),this.node=ht.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new ht.Composite(e,t,n):new ht(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(jh,"")}static parseTrackName(e){const t=ru.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const r=n.nodeName.substring(i+1);au.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let r=t.propertyIndex;if(e||(e=ht.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Be("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Xe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Xe("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Xe("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Xe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Xe("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Xe("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Xe("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[i];if(a===void 0){const c=t.nodeName;Xe("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){Xe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Xe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}ht.Composite=ou,ht.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},ht.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},ht.prototype.GetterByBindingType=[ht.prototype._getValue_direct,ht.prototype._getValue_array,ht.prototype._getValue_arrayElement,ht.prototype._getValue_toArray],ht.prototype.SetterByBindingTypeAndVersioning=[[ht.prototype._setValue_direct,ht.prototype._setValue_direct_setNeedsUpdate,ht.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ht.prototype._setValue_array,ht.prototype._setValue_array_setNeedsUpdate,ht.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ht.prototype._setValue_arrayElement,ht.prototype._setValue_arrayElement_setNeedsUpdate,ht.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ht.prototype._setValue_fromArray,ht.prototype._setValue_fromArray_setNeedsUpdate,ht.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];const _a=class _a{constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){const r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=i,this}};_a.prototype.isMatrix2=!0;let Go=_a;const zo=new de;class Kr{constructor(e=new de(1/0,1/0),t=new de(-1/0,-1/0)){this.isBox2=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=zo.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(e){return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,zo).distanceTo(e)}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}class Un{constructor(){this.type="ShapePath",this.color=new He,this.subPaths=[],this.currentPath=null,this.userData={}}moveTo(e,t){return this.currentPath=new fi,this.subPaths.push(this.currentPath),this.currentPath.moveTo(e,t),this}lineTo(e,t){return this.currentPath.lineTo(e,t),this}quadraticCurveTo(e,t,n,i){return this.currentPath.quadraticCurveTo(e,t,n,i),this}bezierCurveTo(e,t,n,i,r,a){return this.currentPath.bezierCurveTo(e,t,n,i,r,a),this}splineThru(e){return this.currentPath.splineThru(e),this}toShapes(){function e(l,c){let h=!1;const u=c.length;for(let f=0,d=u-1;f<u;d=f++){const g=c[f],v=c[d];g.y>l.y!=v.y>l.y&&l.x<(v.x-g.x)*(l.y-g.y)/(v.y-g.y)+g.x&&(h=!h)}return h}function t(l,c){const h=c.getCenter(new de);if(e(h,l))return h;const u=h.y,f=[],d=l.length;for(let g=0;g<d;g++){const v=l[g],m=l[(g+1)%d];if(v.y>u!=m.y>u){const p=v.x+(u-v.y)*(m.x-v.x)/(m.y-v.y);f.push(p)}}return f.length>1&&(f.sort((g,v)=>g-v),h.x=(f[0]+f[1])/2),h}let n=this.userData.style&&this.userData.style.fillRule||"nonzero";n!=="nonzero"&&n!=="evenodd"&&(Be('Fill-rule "'+n+'" is not supported, falling back to "nonzero".'),n="nonzero");const i=n==="nonzero"?l=>l!==0:l=>(l&1)!==0,r=[];for(const l of this.subPaths){const c=l.getPoints();if(c.length<3)continue;const h=Ln.area(c);if(h===0)continue;const u=new Kr;for(let f=0;f<c.length;f++)u.expandByPoint(c[f]);r.push({subPath:l,points:c,boundingBox:u,interiorPoint:t(c,u),absArea:Math.abs(h),winding:h<0?-1:1,container:null,exclude:!1,role:null})}r.sort((l,c)=>c.absArea-l.absArea);for(let l=0;l<r.length;l++){const c=r[l];let h=0;for(let u=l-1;u>=0;u--){const f=r[u];if(f.boundingBox.containsBox(c.boundingBox)&&e(c.interiorPoint,f.points)){c.container=f.exclude?f.container:f,h=f.winding,c.winding+=h;break}}i(c.winding)===i(h)&&(c.exclude=!0)}for(const l of r)l.exclude||(l.role=l.container===null||l.container.role==="hole"?"outer":"hole");const a=[],o=new Map;for(const l of r){if(l.exclude||l.role!=="outer")continue;const c=new xo;c.curves=l.subPath.curves,a.push(c),o.set(l,c)}for(const l of r){if(l.exclude||l.role!=="hole")continue;const c=o.get(l.container);if(!c)continue;const h=new fi;h.curves=l.subPath.curves,c.holes.push(h)}return a}}function ko(s,e,t,n){const i=lu(n);switch(t){case 1021:return s*e;case 1028:return s*e/i.components*i.byteLength;case 1029:return s*e/i.components*i.byteLength;case 1030:return s*e*2/i.components*i.byteLength;case 1031:return s*e*2/i.components*i.byteLength;case 1022:return s*e*3/i.components*i.byteLength;case 1023:return s*e*4/i.components*i.byteLength;case 1033:return s*e*4/i.components*i.byteLength;case 33776:case 33777:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case 33778:case 33779:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case 35841:case 35843:return Math.max(s,16)*Math.max(e,8)/4;case 35840:case 35842:return Math.max(s,8)*Math.max(e,8)/2;case 36196:case 37492:case 37488:case 37489:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case 37496:case 37490:case 37491:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case 37808:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case 37809:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case 37810:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case 37811:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case 37812:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case 37813:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case 37814:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case 37815:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case 37816:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case 37817:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case 37818:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case 37819:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case 37820:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case 37821:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(s/4)*Math.ceil(e/4)*16;case 36283:case 36284:return Math.ceil(s/4)*Math.ceil(e/4)*8;case 36285:case 36286:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function lu(s){switch(s){case 1009:case 1010:return{byteLength:1,components:1};case 1012:case 1011:case 1016:return{byteLength:2,components:1};case 1017:case 1018:return{byteLength:2,components:4};case 1014:case 1013:case 1015:return{byteLength:4,components:1};case 35902:case 35899:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:$s}})),typeof window!="undefined"&&(window.__THREE__?Be("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=$s);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Vo(){let s=null,e=!1,t=null,n=null;function i(r,a){n=s.requestAnimationFrame(i),t(r,a)}return{start:function(){e!==!0&&t!==null&&s!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function cu(s){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,f=s.createBuffer();s.bindBuffer(l,f),s.bufferData(l,c,h),o.onUploadCallback();let d;if(c instanceof Float32Array)d=s.FLOAT;else if(typeof Float16Array!="undefined"&&c instanceof Float16Array)d=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=s.HALF_FLOAT:d=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=s.SHORT;else if(c instanceof Uint32Array)d=s.UNSIGNED_INT;else if(c instanceof Int32Array)d=s.INT;else if(c instanceof Int8Array)d=s.BYTE;else if(c instanceof Uint8Array)d=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(s.bindBuffer(c,o),u.length===0)s.bufferSubData(c,0,h);else{u.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<u.length;d++){const g=u[f],v=u[d];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++f,u[f]=v)}u.length=f+1;for(let d=0,g=u.length;d<g;d++){const v=u[d];s.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(s.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}var hu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,uu=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,fu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,du=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,pu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,mu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,gu=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,_u=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xu=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,vu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Mu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Su=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,yu=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Tu=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bu=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Eu=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Au=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,wu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ru=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Cu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,qu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Pu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Lu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Iu=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Nu=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Du=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Uu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Fu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ou=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Bu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Gu="gl_FragColor = linearToOutputTexel( gl_FragColor );",zu=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,ku=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Vu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Hu=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Wu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Xu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Yu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ku=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ju=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Zu=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,$u=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Qu=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ju=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ef=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,tf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,nf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,sf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,rf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,af=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,of=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,cf=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,hf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,uf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ff=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,df=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,pf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,mf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,gf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,_f=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,xf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,vf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Mf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Sf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,yf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Tf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,bf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ef=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Af=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Rf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Cf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,qf=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Pf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,If=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Nf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Df=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Uf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ff=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Of=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Bf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Gf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,zf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,kf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Vf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Hf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Wf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Xf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Yf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Kf=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Jf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Zf=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,$f=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Qf=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,jf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ed=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,td=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,nd=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,id=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,sd=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,rd=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,ad=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,od=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ld=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,cd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,hd=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Qe={alphahash_fragment:hu,alphahash_pars_fragment:uu,alphamap_fragment:fu,alphamap_pars_fragment:du,alphatest_fragment:pu,alphatest_pars_fragment:mu,aomap_fragment:gu,aomap_pars_fragment:_u,batching_pars_vertex:xu,batching_vertex:vu,begin_vertex:Mu,beginnormal_vertex:Su,bsdfs:yu,iridescence_fragment:Tu,bumpmap_pars_fragment:bu,clipping_planes_fragment:Eu,clipping_planes_pars_fragment:Au,clipping_planes_pars_vertex:wu,clipping_planes_vertex:Ru,color_fragment:Cu,color_pars_fragment:qu,color_pars_vertex:Pu,color_vertex:Lu,common:Iu,cube_uv_reflection_fragment:Nu,defaultnormal_vertex:Du,displacementmap_pars_vertex:Uu,displacementmap_vertex:Fu,emissivemap_fragment:Ou,emissivemap_pars_fragment:Bu,colorspace_fragment:Gu,colorspace_pars_fragment:zu,envmap_fragment:ku,envmap_common_pars_fragment:Vu,envmap_pars_fragment:Hu,envmap_pars_vertex:Wu,envmap_physical_pars_fragment:nf,envmap_vertex:Xu,fog_vertex:Yu,fog_pars_vertex:Ku,fog_fragment:Ju,fog_pars_fragment:Zu,gradientmap_pars_fragment:$u,lightmap_pars_fragment:Qu,lights_lambert_fragment:ju,lights_lambert_pars_fragment:ef,lights_pars_begin:tf,lights_toon_fragment:sf,lights_toon_pars_fragment:rf,lights_phong_fragment:af,lights_phong_pars_fragment:of,lights_physical_fragment:lf,lights_physical_pars_fragment:cf,lights_fragment_begin:hf,lights_fragment_maps:uf,lights_fragment_end:ff,lightprobes_pars_fragment:df,logdepthbuf_fragment:pf,logdepthbuf_pars_fragment:mf,logdepthbuf_pars_vertex:gf,logdepthbuf_vertex:_f,map_fragment:xf,map_pars_fragment:vf,map_particle_fragment:Mf,map_particle_pars_fragment:Sf,metalnessmap_fragment:yf,metalnessmap_pars_fragment:Tf,morphinstance_vertex:bf,morphcolor_vertex:Ef,morphnormal_vertex:Af,morphtarget_pars_vertex:wf,morphtarget_vertex:Rf,normal_fragment_begin:Cf,normal_fragment_maps:qf,normal_pars_fragment:Pf,normal_pars_vertex:Lf,normal_vertex:If,normalmap_pars_fragment:Nf,clearcoat_normal_fragment_begin:Df,clearcoat_normal_fragment_maps:Uf,clearcoat_pars_fragment:Ff,iridescence_pars_fragment:Of,opaque_fragment:Bf,packing:Gf,premultiplied_alpha_fragment:zf,project_vertex:kf,dithering_fragment:Vf,dithering_pars_fragment:Hf,roughnessmap_fragment:Wf,roughnessmap_pars_fragment:Xf,shadowmap_pars_fragment:Yf,shadowmap_pars_vertex:Kf,shadowmap_vertex:Jf,shadowmask_pars_fragment:Zf,skinbase_vertex:$f,skinning_pars_vertex:Qf,skinning_vertex:jf,skinnormal_vertex:ed,specularmap_fragment:td,specularmap_pars_fragment:nd,tonemapping_fragment:id,tonemapping_pars_fragment:sd,transmission_fragment:rd,transmission_pars_fragment:ad,uv_pars_fragment:od,uv_pars_vertex:ld,uv_vertex:cd,worldpos_vertex:hd,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},Ee={common:{diffuse:{value:new He(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ve}},envmap:{envMap:{value:null},envMapRotation:{value:new Ve},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ve}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ve}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ve},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ve},normalScale:{value:new de(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ve},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ve}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ve}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ve}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new He(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new F},probesMax:{value:new F},probesResolution:{value:new F}},points:{diffuse:{value:new He(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0},uvTransform:{value:new Ve}},sprite:{diffuse:{value:new He(16777215)},opacity:{value:1},center:{value:new de(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}}},cn={basic:{uniforms:Nt([Ee.common,Ee.specularmap,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.fog]),vertexShader:Qe.meshbasic_vert,fragmentShader:Qe.meshbasic_frag},lambert:{uniforms:Nt([Ee.common,Ee.specularmap,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.fog,Ee.lights,{emissive:{value:new He(0)},envMapIntensity:{value:1}}]),vertexShader:Qe.meshlambert_vert,fragmentShader:Qe.meshlambert_frag},phong:{uniforms:Nt([Ee.common,Ee.specularmap,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.fog,Ee.lights,{emissive:{value:new He(0)},specular:{value:new He(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Qe.meshphong_vert,fragmentShader:Qe.meshphong_frag},standard:{uniforms:Nt([Ee.common,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.roughnessmap,Ee.metalnessmap,Ee.fog,Ee.lights,{emissive:{value:new He(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Qe.meshphysical_vert,fragmentShader:Qe.meshphysical_frag},toon:{uniforms:Nt([Ee.common,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.gradientmap,Ee.fog,Ee.lights,{emissive:{value:new He(0)}}]),vertexShader:Qe.meshtoon_vert,fragmentShader:Qe.meshtoon_frag},matcap:{uniforms:Nt([Ee.common,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.fog,{matcap:{value:null}}]),vertexShader:Qe.meshmatcap_vert,fragmentShader:Qe.meshmatcap_frag},points:{uniforms:Nt([Ee.points,Ee.fog]),vertexShader:Qe.points_vert,fragmentShader:Qe.points_frag},dashed:{uniforms:Nt([Ee.common,Ee.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Qe.linedashed_vert,fragmentShader:Qe.linedashed_frag},depth:{uniforms:Nt([Ee.common,Ee.displacementmap]),vertexShader:Qe.depth_vert,fragmentShader:Qe.depth_frag},normal:{uniforms:Nt([Ee.common,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,{opacity:{value:1}}]),vertexShader:Qe.meshnormal_vert,fragmentShader:Qe.meshnormal_frag},sprite:{uniforms:Nt([Ee.sprite,Ee.fog]),vertexShader:Qe.sprite_vert,fragmentShader:Qe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ve},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Qe.background_vert,fragmentShader:Qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ve}},vertexShader:Qe.backgroundCube_vert,fragmentShader:Qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Qe.cube_vert,fragmentShader:Qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Qe.equirect_vert,fragmentShader:Qe.equirect_frag},distance:{uniforms:Nt([Ee.common,Ee.displacementmap,{referencePosition:{value:new F},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Qe.distance_vert,fragmentShader:Qe.distance_frag},shadow:{uniforms:Nt([Ee.lights,Ee.fog,{color:{value:new He(0)},opacity:{value:1}}]),vertexShader:Qe.shadow_vert,fragmentShader:Qe.shadow_frag}};cn.physical={uniforms:Nt([cn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ve},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ve},clearcoatNormalScale:{value:new de(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ve},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ve},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ve},sheen:{value:0},sheenColor:{value:new He(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ve},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ve},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ve},transmissionSamplerSize:{value:new de},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ve},attenuationDistance:{value:0},attenuationColor:{value:new He(0)},specularColor:{value:new He(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ve},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ve},anisotropyVector:{value:new de},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ve}}]),vertexShader:Qe.meshphysical_vert,fragmentShader:Qe.meshphysical_frag};const ks={r:0,b:0,g:0},ud=new Ze,Ho=new Ve;Ho.set(-1,0,0,0,1,0,0,0,1);function fd(s,e,t,n,i,r){const a=new He(0);let o=i===!0?0:1,l,c,h=null,u=0,f=null;function d(b){let A=b.isScene===!0?b.background:null;if(A&&A.isTexture){const _=b.backgroundBlurriness>0;A=e.get(A,_)}return A}function g(b){let A=!1;const _=d(b);_===null?m(a,o):_&&_.isColor&&(m(_,1),A=!0);const T=s.xr.getEnvironmentBlendMode();T==="additive"?t.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(s.autoClear||A)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function v(b,A){const _=d(A);_&&(_.isCubeTexture||_.mapping===306)?(c===void 0&&(c=new xt(new Xn(1,1,1),new on({name:"BackgroundCubeMaterial",uniforms:pi(cn.backgroundCube.uniforms),vertexShader:cn.backgroundCube.vertexShader,fragmentShader:cn.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(T,E,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=_,c.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(ud.makeRotationFromEuler(A.backgroundRotation)).transpose(),_.isCubeTexture&&_.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Ho),c.material.toneMapped=nt.getTransfer(_.colorSpace)!==lt,(h!==_||u!==_.version||f!==s.toneMapping)&&(c.material.needsUpdate=!0,h=_,u=_.version,f=s.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new xt(new Ns(2,2),new on({name:"BackgroundMaterial",uniforms:pi(cn.background.uniforms),vertexShader:cn.background.vertexShader,fragmentShader:cn.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.toneMapped=nt.getTransfer(_.colorSpace)!==lt,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(h!==_||u!==_.version||f!==s.toneMapping)&&(l.material.needsUpdate=!0,h=_,u=_.version,f=s.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function m(b,A){b.getRGB(ks,wo(s)),t.buffers.color.setClear(ks.r,ks.g,ks.b,A,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(b,A=1){a.set(b),o=A,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(b){o=b,m(a,o)},render:g,addToRenderList:v,dispose:p}}function dd(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=f(null);let r=i,a=!1;function o(z,G,Y,O,J){let ie=!1;const $=u(z,O,Y,G);r!==$&&(r=$,c(r.object)),ie=d(z,O,Y,J),ie&&g(z,O,Y,J),J!==null&&e.update(J,s.ELEMENT_ARRAY_BUFFER),(ie||a)&&(a=!1,_(z,G,Y,O),J!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(J).buffer))}function l(){return s.createVertexArray()}function c(z){return s.bindVertexArray(z)}function h(z){return s.deleteVertexArray(z)}function u(z,G,Y,O){const J=O.wireframe===!0;let ie=n[G.id];ie===void 0&&(ie={},n[G.id]=ie);const $=z.isInstancedMesh===!0?z.id:0;let Z=ie[$];Z===void 0&&(Z={},ie[$]=Z);let se=Z[Y.id];se===void 0&&(se={},Z[Y.id]=se);let ae=se[J];return ae===void 0&&(ae=f(l()),se[J]=ae),ae}function f(z){const G=[],Y=[],O=[];for(let J=0;J<t;J++)G[J]=0,Y[J]=0,O[J]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:G,enabledAttributes:Y,attributeDivisors:O,object:z,attributes:{},index:null}}function d(z,G,Y,O){const J=r.attributes,ie=G.attributes;let $=0;const Z=Y.getAttributes();for(const se in Z)if(Z[se].location>=0){const he=J[se];let Le=ie[se];if(Le===void 0&&(se==="instanceMatrix"&&z.instanceMatrix&&(Le=z.instanceMatrix),se==="instanceColor"&&z.instanceColor&&(Le=z.instanceColor)),he===void 0||he.attribute!==Le||Le&&he.data!==Le.data)return!0;$++}return r.attributesNum!==$||r.index!==O}function g(z,G,Y,O){const J={},ie=G.attributes;let $=0;const Z=Y.getAttributes();for(const se in Z)if(Z[se].location>=0){let he=ie[se];he===void 0&&(se==="instanceMatrix"&&z.instanceMatrix&&(he=z.instanceMatrix),se==="instanceColor"&&z.instanceColor&&(he=z.instanceColor));const Le={};Le.attribute=he,he&&he.data&&(Le.data=he.data),J[se]=Le,$++}r.attributes=J,r.attributesNum=$,r.index=O}function v(){const z=r.newAttributes;for(let G=0,Y=z.length;G<Y;G++)z[G]=0}function m(z){p(z,0)}function p(z,G){const Y=r.newAttributes,O=r.enabledAttributes,J=r.attributeDivisors;Y[z]=1,O[z]===0&&(s.enableVertexAttribArray(z),O[z]=1),J[z]!==G&&(s.vertexAttribDivisor(z,G),J[z]=G)}function b(){const z=r.newAttributes,G=r.enabledAttributes;for(let Y=0,O=G.length;Y<O;Y++)G[Y]!==z[Y]&&(s.disableVertexAttribArray(Y),G[Y]=0)}function A(z,G,Y,O,J,ie,$){$===!0?s.vertexAttribIPointer(z,G,Y,J,ie):s.vertexAttribPointer(z,G,Y,O,J,ie)}function _(z,G,Y,O){v();const J=O.attributes,ie=Y.getAttributes(),$=G.defaultAttributeValues;for(const Z in ie){const se=ie[Z];if(se.location>=0){let ae=J[Z];if(ae===void 0&&(Z==="instanceMatrix"&&z.instanceMatrix&&(ae=z.instanceMatrix),Z==="instanceColor"&&z.instanceColor&&(ae=z.instanceColor)),ae!==void 0){const he=ae.normalized,Le=ae.itemSize,Ce=e.get(ae);if(Ce===void 0)continue;const Ke=Ce.buffer,Ye=Ce.type,$e=Ce.bytesPerElement,U=Ye===s.INT||Ye===s.UNSIGNED_INT||ae.gpuType===1013;if(ae.isInterleavedBufferAttribute){const N=ae.data,L=N.stride,P=ae.offset;if(N.isInstancedInterleavedBuffer){for(let B=0;B<se.locationSize;B++)p(se.location+B,N.meshPerAttribute);z.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=N.meshPerAttribute*N.count)}else for(let B=0;B<se.locationSize;B++)m(se.location+B);s.bindBuffer(s.ARRAY_BUFFER,Ke);for(let B=0;B<se.locationSize;B++)A(se.location+B,Le/se.locationSize,Ye,he,L*$e,(P+Le/se.locationSize*B)*$e,U)}else{if(ae.isInstancedBufferAttribute){for(let N=0;N<se.locationSize;N++)p(se.location+N,ae.meshPerAttribute);z.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let N=0;N<se.locationSize;N++)m(se.location+N);s.bindBuffer(s.ARRAY_BUFFER,Ke);for(let N=0;N<se.locationSize;N++)A(se.location+N,Le/se.locationSize,Ye,he,Le*$e,Le/se.locationSize*N*$e,U)}}else if($!==void 0){const he=$[Z];if(he!==void 0)switch(he.length){case 2:s.vertexAttrib2fv(se.location,he);break;case 3:s.vertexAttrib3fv(se.location,he);break;case 4:s.vertexAttrib4fv(se.location,he);break;default:s.vertexAttrib1fv(se.location,he)}}}}b()}function T(){w();for(const z in n){const G=n[z];for(const Y in G){const O=G[Y];for(const J in O){const ie=O[J];for(const $ in ie)h(ie[$].object),delete ie[$];delete O[J]}}delete n[z]}}function E(z){if(n[z.id]===void 0)return;const G=n[z.id];for(const Y in G){const O=G[Y];for(const J in O){const ie=O[J];for(const $ in ie)h(ie[$].object),delete ie[$];delete O[J]}}delete n[z.id]}function C(z){for(const G in n){const Y=n[G];for(const O in Y){const J=Y[O];if(J[z.id]===void 0)continue;const ie=J[z.id];for(const $ in ie)h(ie[$].object),delete ie[$];delete J[z.id]}}}function x(z){for(const G in n){const Y=n[G],O=z.isInstancedMesh===!0?z.id:0,J=Y[O];if(J!==void 0){for(const ie in J){const $=J[ie];for(const Z in $)h($[Z].object),delete $[Z];delete J[ie]}delete Y[O],Object.keys(Y).length===0&&delete n[G]}}}function w(){I(),a=!0,r!==i&&(r=i,c(r.object))}function I(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:w,resetDefaultState:I,dispose:T,releaseStatesOfGeometry:E,releaseStatesOfObject:x,releaseStatesOfProgram:C,initAttributes:v,enableAttribute:m,disableUnusedAttributes:b}}function pd(s,e,t){let n;function i(l){n=l}function r(l,c){s.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(s.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let f=0;for(let d=0;d<h;d++)f+=c[d];t.update(f,n,1)}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function md(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(C){return!(C!==1023&&n.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const x=C===1016&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==1009&&C!==1015&&!x&&n.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function l(C){if(C==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Be("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&f===!1&&Be("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),b=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),A=s.getParameter(s.MAX_VARYING_VECTORS),_=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),T=s.getParameter(s.MAX_SAMPLES),E=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:b,maxVaryings:A,maxFragmentUniforms:_,maxSamples:T,samples:E}}function gd(s){const e=this;let t=null,n=0,i=!1,r=!1;const a=new Pn,o=new Ve,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||i;return i=f,n=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,d){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,p=s.get(u);if(!i||g===null||g.length===0||r&&!m)r?h(null):c();else{const b=r?0:n,A=b*4;let _=p.clippingState||null;l.value=_,_=h(g,f,A,d);for(let T=0;T!==A;++T)_[T]=t[T];p.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,d,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const p=d+v*4,b=f.matrixWorldInverse;o.getNormalMatrix(b),(m===null||m.length<p)&&(m=new Float32Array(p));for(let A=0,_=d;A!==v;++A,_+=4)a.copy(u[A]).applyMatrix4(b,o),a.normal.toArray(m,_),m[_+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}const Si=4,_d=6,xd=20,vd=256,Zi=new zs,Wo=new He;let Jr=null,Zr=0,$r=0,Qr=!1;const Md=new F,Kn=new F;class jr{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,i=100,r={}){const{size:a=256,position:o=Md}=r;Jr=this._renderer.getRenderTarget(),Zr=this._renderer.getActiveCubeFace(),$r=this._renderer.getActiveMipmapLevel(),Qr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ko(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Yo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Jr,Zr,$r),this._renderer.xr.enabled=Qr,e.scissorTest=!1,yi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Jr=this._renderer.getRenderTarget(),Zr=this._renderer.getActiveCubeFace(),$r=this._renderer.getActiveMipmapLevel(),Qr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:1006,minFilter:1006,generateMipmaps:!1,type:1016,format:1023,colorSpace:Ot,depthBuffer:!1},i=Xo(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Xo(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Sd(r)),this._blurMaterial=Td(r,e,t),this._ggxMaterial=yd(r,e,t)}return i}_compileMaterial(e){const t=new xt(new Tt,e);this._renderer.compile(t,Zi)}_sceneToCubeUV(e,t,n,i,r){const l=new Dt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(Wo),u.toneMapping=0,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new xt(new Xn,new yn({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,m=v.material;let p=!1;const b=e.background;b?b.isColor&&(m.color.copy(b),e.background=null,p=!0):(m.color.copy(Wo),p=!0);for(let A=0;A<6;A++){const _=A%3;_===0?(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[A],r.y,r.z)):_===1?(l.up.set(0,0,c[A]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[A],r.z)):(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[A]));const T=this._cubeSize;yi(i,_*T,A>2?T:0,T,T),u.setRenderTarget(i),p&&u.render(v,l),u.render(e,l)}u.toneMapping=d,u.autoClear=f,e.background=b}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===301||e.mapping===302;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ko()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Yo());const r=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;yi(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Zi)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const i=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),f=c*1.25,d=u*f,{_lodMax:g}=this,v=this._sizeLods[n],m=3*v*(n>g-Si?n-g+Si:0),p=4*(this._cubeSize-v);l.envMap.value=e.texture,l.roughness.value=d,l.mipInt.value=g-t,yi(r,m,p,3*v,2*v),i.setRenderTarget(r),i.render(o,Zi),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,yi(e,m,p,3*v,2*v),i.setRenderTarget(e),i.render(o,Zi)}_blur(e,t,n,i){const r=this._pingPongRenderTarget,a=Math.min(i,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,a),this._blurPass(r,e,n,n,a)}_blurPass(e,t,n,i,r){const a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[i];l.material=o;const c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;const h=this._sizeLods[i],u=3*h*(i>this._lodMax-Si?i-this._lodMax+Si:0),f=4*(this._cubeSize-h);yi(t,u,f,3*h,2*h),a.setRenderTarget(t),a.render(l,Zi)}}function Sd(s){const e=[],t=[];let n=s;const i=s-Si+1+_d;for(let r=0;r<i;r++){const a=Math.pow(2,n);e.push(a);const o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],u=6,f=6,d=3,g=new Float32Array(d*f*u),v=new Float32Array(d*f*u);for(let p=0;p<u;p++){const b=p%3*2/3-1,A=p>2?0:-1,_=[b,A,0,b+2/3,A,0,b+2/3,A+1,0,b,A,0,b+2/3,A+1,0,b,A+1,0];g.set(_,d*f*p);for(let T=0;T<f;T++){const E=h[T*2]*2-1,C=h[T*2+1]*2-1;p===0?Kn.set(1,C,E):p===1?Kn.set(-E,1,-C):p===2?Kn.set(-E,C,1):p===3?Kn.set(-1,C,-E):p===4?Kn.set(-E,-1,C):Kn.set(E,C,-1),Kn.toArray(v,(p*f+T)*d)}}const m=new Tt;m.setAttribute("position",new Ft(g,d)),m.setAttribute("outputDirection",new Ft(v,d)),t.push(new xt(m,null)),n>Si&&n--}return{lodMeshes:t,sizeLods:e}}function Xo(s,e,t){const n=new Kt(s,e,t);return n.texture.mapping=306,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function yi(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function yd(s,e,t){return new on({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:vd,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Vs(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Td(s,e,t){return new on({name:"SphericalGaussianBlur",defines:{SAMPLES:xd,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Vs(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Yo(){return new on({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Vs(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ko(){return new on({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Vs(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Vs(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class Jo extends Kt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new lo(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Xn(5,5,5),r=new on({name:"CubemapFromEquirect",uniforms:pi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});r.uniforms.tEquirect.value=t;const a=new xt(i,r),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=1006),new $h(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}}function bd(s){let e=new WeakMap,t=new WeakMap,n=null;function i(f,d=!1){return f==null?null:d?a(f):r(f)}function r(f){if(f&&f.isTexture){const d=f.mapping;if(d===303||d===304)if(e.has(f)){const g=e.get(f).texture;return o(g,f.mapping)}else{const g=f.image;if(g&&g.height>0){const v=new Jo(g.height);return v.fromEquirectangularTexture(s,f),e.set(f,v),f.addEventListener("dispose",c),o(v.texture,f.mapping)}else return null}}return f}function a(f){if(f&&f.isTexture){const d=f.mapping,g=d===303||d===304,v=d===301||d===302;if(g||v){let m=t.get(f);const p=m!==void 0?m.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==p)return n===null&&(n=new jr(s)),m=g?n.fromEquirectangular(f,m):n.fromCubemap(f,m),m.texture.pmremVersion=f.pmremVersion,t.set(f,m),m.texture;if(m!==void 0)return m.texture;{const b=f.image;return g&&b&&b.height>0||v&&b&&l(b)?(n===null&&(n=new jr(s)),m=g?n.fromEquirectangular(f):n.fromCubemap(f),m.texture.pmremVersion=f.pmremVersion,t.set(f,m),f.addEventListener("dispose",h),m.texture):null}}}return f}function o(f,d){return d===303?f.mapping=301:d===304&&(f.mapping=302),f}function l(f){let d=0;const g=6;for(let v=0;v<g;v++)f[v]!==void 0&&d++;return d===g}function c(f){const d=f.target;d.removeEventListener("dispose",c);const g=e.get(d);g!==void 0&&(e.delete(d),g.dispose())}function h(f){const d=f.target;d.removeEventListener("dispose",h);const g=t.get(d);g!==void 0&&(t.delete(d),g.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:u}}function Ed(s){const e={};function t(n){if(e[n]!==void 0)return e[n];const i=s.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&Qn("WebGLRenderer: "+n+" extension not supported."),i}}}function Ad(s,e,t,n){const i={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);f.removeEventListener("dispose",a),delete i[f.id];const d=r.get(f);d&&(e.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(u,f){return i[f.id]===!0||(f.addEventListener("dispose",a),i[f.id]=!0,t.memory.geometries++),f}function l(u){const f=u.attributes;for(const d in f)e.update(f[d],s.ARRAY_BUFFER)}function c(u){const f=[],d=u.index,g=u.attributes.position;let v=0;if(g===void 0)return;if(d!==null){const b=d.array;v=d.version;for(let A=0,_=b.length;A<_;A+=3){const T=b[A+0],E=b[A+1],C=b[A+2];f.push(T,E,E,C,C,T)}}else{const b=g.array;v=g.version;for(let A=0,_=b.length/3-1;A<_;A+=3){const T=A+0,E=A+1,C=A+2;f.push(T,E,E,C,C,T)}}const m=new(g.count>=65535?za:Ga)(f,1);m.version=v;const p=r.get(u);p&&e.remove(p),r.set(u,m)}function h(u){const f=r.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function wd(s,e,t){let n;function i(u){n=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,f){s.drawElements(n,f,r,u*a),t.update(f,n,1)}function c(u,f,d){d!==0&&(s.drawElementsInstanced(n,f,r,u*a,d),t.update(f,n,d))}function h(u,f,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,u,0,d);let v=0;for(let m=0;m<d;m++)v+=f[m];t.update(v,n,1)}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Rd(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:Xe("WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Cd(s,e,t){const n=new WeakMap,i=new ut;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(o);if(f===void 0||f.count!==u){let w=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",w)};f!==void 0&&f.texture.dispose();const d=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let A=0;d===!0&&(A=1),g===!0&&(A=2),v===!0&&(A=3);let _=o.attributes.position.count*A,T=1;_>e.maxTextureSize&&(T=Math.ceil(_/e.maxTextureSize),_=e.maxTextureSize);const E=new Float32Array(_*T*4*u),C=new Ra(E,_,T,u);C.type=1015,C.needsUpdate=!0;const x=A*4;for(let I=0;I<u;I++){const z=m[I],G=p[I],Y=b[I],O=_*T*4*I;for(let J=0;J<z.count;J++){const ie=J*x;d===!0&&(i.fromBufferAttribute(z,J),E[O+ie+0]=i.x,E[O+ie+1]=i.y,E[O+ie+2]=i.z,E[O+ie+3]=0),g===!0&&(i.fromBufferAttribute(G,J),E[O+ie+4]=i.x,E[O+ie+5]=i.y,E[O+ie+6]=i.z,E[O+ie+7]=0),v===!0&&(i.fromBufferAttribute(Y,J),E[O+ie+8]=i.x,E[O+ie+9]=i.y,E[O+ie+10]=i.z,E[O+ie+11]=Y.itemSize===4?i.w:1)}}f={count:u,texture:C,size:new de(_,T)},n.set(o,f),o.addEventListener("dispose",w)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let d=0;for(let v=0;v<c.length;v++)d+=c[v];const g=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(s,"morphTargetBaseInfluence",g),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",f.size)}return{update:r}}function qd(s,e,t,n,i){let r=new WeakMap;function a(c){const h=i.render.frame,u=c.geometry,f=e.get(c,u);if(r.get(f)!==h&&(e.update(f),r.set(f,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==h&&(d.update(),r.set(d,h))}return f}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const Pd={1:"LINEAR_TONE_MAPPING",2:"REINHARD_TONE_MAPPING",3:"CINEON_TONE_MAPPING",4:"ACES_FILMIC_TONE_MAPPING",6:"AGX_TONE_MAPPING",7:"NEUTRAL_TONE_MAPPING",5:"CUSTOM_TONE_MAPPING"};function Ld(s,e,t,n,i,r){const a=new Kt(e,t,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null;const c=new Tt;c.setAttribute("position",new rt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new rt([0,2,0,0,2,0],2));const h=new bh({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new xt(c,h),f=new zs(-1,1,1,-1,0,1);let d=null,g=null,v=!1,m,p=null,b=[],A=!1;this.setSize=function(_,T){a.setSize(_,T),o!==null&&o.setSize(_,T),l!==null&&l.setSize(_,T);for(let E=0;E<b.length;E++){const C=b[E];C.setSize&&C.setSize(_,T)}},this.setEffects=function(_){b=_,A=b.length>0&&b[0].isRenderPass===!0;const T=a.width,E=a.height;b.length>0&&o===null&&(o=new Kt(T,E,{type:1016,depthBuffer:!1,stencilBuffer:!1}),l=new Kt(T,E,{type:1016,depthBuffer:!1,stencilBuffer:!1}));for(let C=0;C<b.length;C++){const x=b[C];x.setSize&&x.setSize(T,E)}},this.begin=function(_,T){if(v||_.toneMapping===0&&b.length===0)return!1;if(p=T,T!==null){const E=T.width,C=T.height;(a.width!==E||a.height!==C)&&this.setSize(E,C)}return A===!1&&_.setRenderTarget(a),m=_.toneMapping,_.toneMapping=0,!0},this.hasRenderPass=function(){return A},this.end=function(_,T){_.toneMapping=m,v=!0;let E=a,C=o;for(let x=0;x<b.length;x++){const w=b[x];w.enabled!==!1&&(w.render(_,C,E,T),w.needsSwap!==!1&&(E=C,C=C===o?l:o))}if(d!==_.outputColorSpace||g!==_.toneMapping){d=_.outputColorSpace,g=_.toneMapping,h.defines={},nt.getTransfer(d)===lt&&(h.defines.SRGB_TRANSFER="");const x=Pd[g];x&&(h.defines[x]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=E.texture,_.setRenderTarget(p),_.render(u,f),p=null,v=!1},this.isCompositing=function(){return v},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}const Zo=new At,ea=new Bi(1,1),$o=new Ra,Qo=new mc,jo=new lo,el=[],tl=[],nl=new Float32Array(16),il=new Float32Array(9),sl=new Float32Array(4);function Ti(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=el[i];if(r===void 0&&(r=new Float32Array(i),el[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function wt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function Rt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Hs(s,e){let t=tl[e];t===void 0&&(t=new Int32Array(e),tl[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function Id(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function Nd(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;s.uniform2fv(this.addr,e),Rt(t,e)}}function Dd(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(wt(t,e))return;s.uniform3fv(this.addr,e),Rt(t,e)}}function Ud(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;s.uniform4fv(this.addr,e),Rt(t,e)}}function Fd(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(wt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Rt(t,e)}else{if(wt(t,n))return;sl.set(n),s.uniformMatrix2fv(this.addr,!1,sl),Rt(t,n)}}function Od(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(wt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Rt(t,e)}else{if(wt(t,n))return;il.set(n),s.uniformMatrix3fv(this.addr,!1,il),Rt(t,n)}}function Bd(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(wt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Rt(t,e)}else{if(wt(t,n))return;nl.set(n),s.uniformMatrix4fv(this.addr,!1,nl),Rt(t,n)}}function Gd(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function zd(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;s.uniform2iv(this.addr,e),Rt(t,e)}}function kd(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(wt(t,e))return;s.uniform3iv(this.addr,e),Rt(t,e)}}function Vd(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;s.uniform4iv(this.addr,e),Rt(t,e)}}function Hd(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function Wd(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;s.uniform2uiv(this.addr,e),Rt(t,e)}}function Xd(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(wt(t,e))return;s.uniform3uiv(this.addr,e),Rt(t,e)}}function Yd(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;s.uniform4uiv(this.addr,e),Rt(t,e)}}function Kd(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(ea.compareFunction=t.isReversedDepthBuffer()?518:515,r=ea):r=Zo,t.setTexture2D(e||r,i)}function Jd(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Qo,i)}function Zd(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||jo,i)}function $d(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||$o,i)}function Qd(s){switch(s){case 5126:return Id;case 35664:return Nd;case 35665:return Dd;case 35666:return Ud;case 35674:return Fd;case 35675:return Od;case 35676:return Bd;case 5124:case 35670:return Gd;case 35667:case 35671:return zd;case 35668:case 35672:return kd;case 35669:case 35673:return Vd;case 5125:return Hd;case 36294:return Wd;case 36295:return Xd;case 36296:return Yd;case 35678:case 36198:case 36298:case 36306:case 35682:return Kd;case 35679:case 36299:case 36307:return Jd;case 35680:case 36300:case 36308:case 36293:return Zd;case 36289:case 36303:case 36311:case 36292:return $d}}function jd(s,e){s.uniform1fv(this.addr,e)}function e1(s,e){const t=Ti(e,this.size,2);s.uniform2fv(this.addr,t)}function t1(s,e){const t=Ti(e,this.size,3);s.uniform3fv(this.addr,t)}function n1(s,e){const t=Ti(e,this.size,4);s.uniform4fv(this.addr,t)}function i1(s,e){const t=Ti(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function s1(s,e){const t=Ti(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function r1(s,e){const t=Ti(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function a1(s,e){s.uniform1iv(this.addr,e)}function o1(s,e){s.uniform2iv(this.addr,e)}function l1(s,e){s.uniform3iv(this.addr,e)}function c1(s,e){s.uniform4iv(this.addr,e)}function h1(s,e){s.uniform1uiv(this.addr,e)}function u1(s,e){s.uniform2uiv(this.addr,e)}function f1(s,e){s.uniform3uiv(this.addr,e)}function d1(s,e){s.uniform4uiv(this.addr,e)}function p1(s,e,t){const n=this.cache,i=e.length,r=Hs(t,i);wt(n,r)||(s.uniform1iv(this.addr,r),Rt(n,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=ea:a=Zo;for(let o=0;o!==i;++o)t.setTexture2D(e[o]||a,r[o])}function m1(s,e,t){const n=this.cache,i=e.length,r=Hs(t,i);wt(n,r)||(s.uniform1iv(this.addr,r),Rt(n,r));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||Qo,r[a])}function g1(s,e,t){const n=this.cache,i=e.length,r=Hs(t,i);wt(n,r)||(s.uniform1iv(this.addr,r),Rt(n,r));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||jo,r[a])}function _1(s,e,t){const n=this.cache,i=e.length,r=Hs(t,i);wt(n,r)||(s.uniform1iv(this.addr,r),Rt(n,r));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||$o,r[a])}function x1(s){switch(s){case 5126:return jd;case 35664:return e1;case 35665:return t1;case 35666:return n1;case 35674:return i1;case 35675:return s1;case 35676:return r1;case 5124:case 35670:return a1;case 35667:case 35671:return o1;case 35668:case 35672:return l1;case 35669:case 35673:return c1;case 5125:return h1;case 36294:return u1;case 36295:return f1;case 36296:return d1;case 35678:case 36198:case 36298:case 36306:case 35682:return p1;case 35679:case 36299:case 36307:return m1;case 35680:case 36300:case 36308:case 36293:return g1;case 36289:case 36303:case 36311:case 36292:return _1}}class v1{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Qd(t.type)}}class M1{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=x1(t.type)}}class S1{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(e,t[o.id],n)}}}const ta=/(\w+)(\])?(\[|\.)?/g;function rl(s,e){s.seq.push(e),s.map[e.id]=e}function y1(s,e,t){const n=s.name,i=n.length;for(ta.lastIndex=0;;){const r=ta.exec(n),a=ta.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){rl(t,c===void 0?new v1(o,s,e):new M1(o,s,e));break}else{let u=t.map[o];u===void 0&&(u=new S1(o),rl(t,u)),t=u}}}class Ws{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);y1(o,l,this)}const i=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(a):r.push(a);i.length>0&&(this.seq=i.concat(r))}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function al(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const T1=37297;let b1=0;function E1(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const ol=new Ve;function A1(s){nt._getMatrix(ol,nt.workingColorSpace,s);const e=`mat3( ${ol.elements.map(t=>t.toFixed(4))} )`;switch(nt.getTransfer(s)){case ns:return[e,"LinearTransferOETF"];case lt:return[e,"sRGBTransferOETF"];default:return Be("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function ll(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+E1(s.getShaderSource(e),o)}else return r}function w1(s,e){const t=A1(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const R1={1:"Linear",2:"Reinhard",3:"Cineon",4:"ACESFilmic",6:"AgX",7:"Neutral",5:"Custom"};function C1(s,e){const t=R1[e];return t===void 0?(Be("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Xs=new F;function q1(){nt.getLuminanceCoefficients(Xs);const s=Xs.x.toFixed(4),e=Xs.y.toFixed(4),t=Xs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function P1(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter($i).join(`
`)}function L1(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function I1(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function $i(s){return s!==""}function cl(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function hl(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const N1=/^[ \t]*#include +<([\w\d./]+)>/gm;function na(s){return s.replace(N1,U1)}const D1=new Map;function U1(s,e){let t=Qe[e];if(t===void 0){const n=D1.get(e);if(n!==void 0)t=Qe[n],Be('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return na(t)}const F1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ul(s){return s.replace(F1,O1)}function O1(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function fl(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const B1={1:"SHADOWMAP_TYPE_PCF",3:"SHADOWMAP_TYPE_VSM"};function G1(s){return B1[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const z1={301:"ENVMAP_TYPE_CUBE",302:"ENVMAP_TYPE_CUBE",306:"ENVMAP_TYPE_CUBE_UV"};function k1(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":z1[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const V1={302:"ENVMAP_MODE_REFRACTION"};function H1(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":V1[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const W1={0:"ENVMAP_BLENDING_MULTIPLY",1:"ENVMAP_BLENDING_MIX",2:"ENVMAP_BLENDING_ADD"};function X1(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":W1[s.combine]||"ENVMAP_BLENDING_NONE"}function Y1(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function K1(s,e,t,n){const i=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=G1(t),c=k1(t),h=H1(t),u=X1(t),f=Y1(t),d=P1(t),g=L1(r),v=i.createProgram();let m,p,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter($i).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter($i).join(`
`),p.length>0&&(p+=`
`)):(m=[fl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter($i).join(`
`),p=[fl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==0?"#define TONE_MAPPING":"",t.toneMapping!==0?Qe.tonemapping_pars_fragment:"",t.toneMapping!==0?C1("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Qe.colorspace_pars_fragment,w1("linearToOutputTexel",t.outputColorSpace),q1(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter($i).join(`
`)),a=na(a),a=cl(a,t),a=hl(a,t),o=na(o),o=cl(o,t),o=hl(o,t),a=ul(a),o=ul(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Sa?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Sa?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const A=b+m+a,_=b+p+o,T=al(i,i.VERTEX_SHADER,A),E=al(i,i.FRAGMENT_SHADER,_);i.attachShader(v,T),i.attachShader(v,E),t.index0AttributeName!==void 0?i.bindAttribLocation(v,0,t.index0AttributeName):t.hasPositionAttribute===!0&&i.bindAttribLocation(v,0,"position"),i.linkProgram(v);function C(z){if(s.debug.checkShaderErrors){const G=i.getProgramInfoLog(v)||"",Y=i.getShaderInfoLog(T)||"",O=i.getShaderInfoLog(E)||"",J=G.trim(),ie=Y.trim(),$=O.trim();let Z=!0,se=!0;if(i.getProgramParameter(v,i.LINK_STATUS)===!1)if(Z=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,v,T,E);else{const ae=ll(i,T,"vertex"),he=ll(i,E,"fragment");Xe("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(v,i.VALIDATE_STATUS)+`

Material Name: `+z.name+`
Material Type: `+z.type+`

Program Info Log: `+J+`
`+ae+`
`+he)}else J!==""?Be("WebGLProgram: Program Info Log:",J):(ie===""||$==="")&&(se=!1);se&&(z.diagnostics={runnable:Z,programLog:J,vertexShader:{log:ie,prefix:m},fragmentShader:{log:$,prefix:p}})}i.deleteShader(T),i.deleteShader(E),x=new Ws(i,v),w=I1(i,v)}let x;this.getUniforms=function(){return x===void 0&&C(this),x};let w;this.getAttributes=function(){return w===void 0&&C(this),w};let I=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=i.getProgramParameter(v,T1)),I},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=b1++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=T,this.fragmentShader=E,this}let J1=0;class Z1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const i=this._getShaderCacheForMaterial(e);return i.has(t)===!1&&(i.add(t),t.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new $1(e),t.set(e,n)),n}}class $1{constructor(e){this.id=J1++,this.code=e,this.usedTimes=0}}function Q1(s){return s===1030||s===37490||s===36285}function j1(s,e,t,n,i,r){const a=new Pa,o=new Z1,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer;let f=n.precision;const d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return l.add(x),x===0?"uv":`uv${x}`}function v(x,w,I,z,G,Y){const O=z.fog,J=G.geometry,ie=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?z.environment:null,$=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,Z=e.get(x.envMap||ie,$),se=Z&&Z.mapping===306?Z.image.height:null,ae=d[x.type];x.precision!==null&&(f=n.getMaxPrecision(x.precision),f!==x.precision&&Be("WebGLProgram.getParameters:",x.precision,"not supported, using",f,"instead."));const he=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,Le=he!==void 0?he.length:0;let Ce=0;J.morphAttributes.position!==void 0&&(Ce=1),J.morphAttributes.normal!==void 0&&(Ce=2),J.morphAttributes.color!==void 0&&(Ce=3);let Ke,Ye,$e,U;if(ae){const pt=cn[ae];Ke=pt.vertexShader,Ye=pt.fragmentShader}else{Ke=x.vertexShader,Ye=x.fragmentShader;const pt=o.getVertexShaderStage(x),at=o.getFragmentShaderStage(x);o.update(x,pt,at),$e=pt.id,U=at.id}const N=s.getRenderTarget(),L=s.state.buffers.depth.getReversed(),P=G.isInstancedMesh===!0,B=G.isBatchedMesh===!0,ne=!!x.map,_e=!!x.matcap,R=!!Z,k=!!x.aoMap,D=!!x.lightMap,K=!!x.bumpMap&&x.wireframe===!1,Q=!!x.normalMap,le=!!x.displacementMap,me=!!x.emissiveMap,pe=!!x.metalnessMap,X=!!x.roughnessMap,S=x.anisotropy>0,Ae=x.clearcoat>0,Ne=x.dispersion>0,q=x.retroreflectivity>0,M=x.iridescence>0,W=x.sheen>0,j=x.transmission>0,oe=S&&!!x.anisotropyMap,xe=Ae&&!!x.clearcoatMap,ve=Ae&&!!x.clearcoatNormalMap,ce=Ae&&!!x.clearcoatRoughnessMap,ue=M&&!!x.iridescenceMap,Me=M&&!!x.iridescenceThicknessMap,Fe=W&&!!x.sheenColorMap,ye=W&&!!x.sheenRoughnessMap,Se=!!x.specularMap,ze=!!x.specularColorMap,We=!!x.specularIntensityMap,Je=j&&!!x.transmissionMap,H=j&&!!x.thicknessMap,Te=!!x.gradientMap,fe=!!x.alphaMap,be=x.alphaTest>0,qe=!!x.alphaHash,ge=!!x.extensions;let ke=0;x.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(ke=s.toneMapping);const Oe={shaderID:ae,shaderType:x.type,shaderName:x.name,vertexShader:Ke,fragmentShader:Ye,defines:x.defines,customVertexShaderID:$e,customFragmentShaderID:U,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:f,batching:B,batchingColor:B&&G._colorsTexture!==null,instancing:P,instancingColor:P&&G.instanceColor!==null,instancingMorph:P&&G.morphTexture!==null,outputColorSpace:N===null?s.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:nt.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:ne,matcap:_e,envMap:R,envMapMode:R&&Z.mapping,envMapCubeUVHeight:se,aoMap:k,lightMap:D,bumpMap:K,normalMap:Q,displacementMap:le,emissiveMap:me,normalMapObjectSpace:Q&&x.normalMapType===1,normalMapTangentSpace:Q&&x.normalMapType===0,packedNormalMap:Q&&x.normalMapType===0&&Q1(x.normalMap.format),metalnessMap:pe,roughnessMap:X,anisotropy:S,anisotropyMap:oe,clearcoat:Ae,clearcoatMap:xe,clearcoatNormalMap:ve,clearcoatRoughnessMap:ce,dispersion:Ne,retroreflection:q,iridescence:M,iridescenceMap:ue,iridescenceThicknessMap:Me,sheen:W,sheenColorMap:Fe,sheenRoughnessMap:ye,specularMap:Se,specularColorMap:ze,specularIntensityMap:We,transmission:j,transmissionMap:Je,thicknessMap:H,gradientMap:Te,opaque:x.transparent===!1&&x.blending===1&&x.alphaToCoverage===!1,alphaMap:fe,alphaTest:be,alphaHash:qe,combine:x.combine,mapUv:ne&&g(x.map.channel),aoMapUv:k&&g(x.aoMap.channel),lightMapUv:D&&g(x.lightMap.channel),bumpMapUv:K&&g(x.bumpMap.channel),normalMapUv:Q&&g(x.normalMap.channel),displacementMapUv:le&&g(x.displacementMap.channel),emissiveMapUv:me&&g(x.emissiveMap.channel),metalnessMapUv:pe&&g(x.metalnessMap.channel),roughnessMapUv:X&&g(x.roughnessMap.channel),anisotropyMapUv:oe&&g(x.anisotropyMap.channel),clearcoatMapUv:xe&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:ve&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ce&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:ue&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:Me&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:Fe&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:ye&&g(x.sheenRoughnessMap.channel),specularMapUv:Se&&g(x.specularMap.channel),specularColorMapUv:ze&&g(x.specularColorMap.channel),specularIntensityMapUv:We&&g(x.specularIntensityMap.channel),transmissionMapUv:Je&&g(x.transmissionMap.channel),thicknessMapUv:H&&g(x.thicknessMap.channel),alphaMapUv:fe&&g(x.alphaMap.channel),vertexTangents:!!J.attributes.tangent&&(Q||S),vertexNormals:!!J.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,pointsUvs:G.isPoints===!0&&!!J.attributes.uv&&(ne||fe),fog:!!O,useFog:x.fog===!0,fogExp2:!!O&&O.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||J.attributes.normal===void 0&&Q===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:L,skinning:G.isSkinnedMesh===!0,hasPositionAttribute:J.attributes.position!==void 0,morphTargets:J.morphAttributes.position!==void 0,morphNormals:J.morphAttributes.normal!==void 0,morphColors:J.morphAttributes.color!==void 0,morphTargetsCount:Le,morphTextureStride:Ce,numSunLights:w.sun.length,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numSunLightShadows:w.sunShadowMap.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:Y.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:s.shadowMap.enabled&&I.length>0,shadowMapType:s.shadowMap.type,toneMapping:ke,decodeVideoTexture:ne&&x.map.isVideoTexture===!0&&nt.getTransfer(x.map.colorSpace)===lt,decodeVideoTextureEmissive:me&&x.emissiveMap.isVideoTexture===!0&&nt.getTransfer(x.emissiveMap.colorSpace)===lt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===2,flipSided:x.side===1,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:ge&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ge&&x.extensions.multiDraw===!0||B)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Oe.vertexUv1s=l.has(1),Oe.vertexUv2s=l.has(2),Oe.vertexUv3s=l.has(3),l.clear(),Oe}function m(x){const w=[];if(x.shaderID?w.push(x.shaderID):(w.push(x.customVertexShaderID),w.push(x.customFragmentShaderID)),x.defines!==void 0)for(const I in x.defines)w.push(I),w.push(x.defines[I]);return x.isRawShaderMaterial===!1&&(p(w,x),b(w,x),w.push(s.outputColorSpace)),w.push(x.customProgramCacheKey),w.join()}function p(x,w){x.push(w.precision),x.push(w.outputColorSpace),x.push(w.envMapMode),x.push(w.envMapCubeUVHeight),x.push(w.mapUv),x.push(w.alphaMapUv),x.push(w.lightMapUv),x.push(w.aoMapUv),x.push(w.bumpMapUv),x.push(w.normalMapUv),x.push(w.displacementMapUv),x.push(w.emissiveMapUv),x.push(w.metalnessMapUv),x.push(w.roughnessMapUv),x.push(w.anisotropyMapUv),x.push(w.clearcoatMapUv),x.push(w.clearcoatNormalMapUv),x.push(w.clearcoatRoughnessMapUv),x.push(w.iridescenceMapUv),x.push(w.iridescenceThicknessMapUv),x.push(w.sheenColorMapUv),x.push(w.sheenRoughnessMapUv),x.push(w.specularMapUv),x.push(w.specularColorMapUv),x.push(w.specularIntensityMapUv),x.push(w.transmissionMapUv),x.push(w.thicknessMapUv),x.push(w.combine),x.push(w.fogExp2),x.push(w.sizeAttenuation),x.push(w.morphTargetsCount),x.push(w.morphAttributeCount),x.push(w.numSunLights),x.push(w.numDirLights),x.push(w.numPointLights),x.push(w.numSpotLights),x.push(w.numSpotLightMaps),x.push(w.numHemiLights),x.push(w.numRectAreaLights),x.push(w.numSunLightShadows),x.push(w.numDirLightShadows),x.push(w.numPointLightShadows),x.push(w.numSpotLightShadows),x.push(w.numSpotLightShadowsWithMaps),x.push(w.numLightProbes),x.push(w.shadowMapType),x.push(w.toneMapping),x.push(w.numClippingPlanes),x.push(w.numClipIntersection),x.push(w.depthPacking)}function b(x,w){a.disableAll(),w.instancing&&a.enable(0),w.instancingColor&&a.enable(1),w.instancingMorph&&a.enable(2),w.matcap&&a.enable(3),w.envMap&&a.enable(4),w.normalMapObjectSpace&&a.enable(5),w.normalMapTangentSpace&&a.enable(6),w.clearcoat&&a.enable(7),w.iridescence&&a.enable(8),w.alphaTest&&a.enable(9),w.vertexColors&&a.enable(10),w.vertexAlphas&&a.enable(11),w.vertexUv1s&&a.enable(12),w.vertexUv2s&&a.enable(13),w.vertexUv3s&&a.enable(14),w.vertexTangents&&a.enable(15),w.anisotropy&&a.enable(16),w.alphaHash&&a.enable(17),w.batching&&a.enable(18),w.dispersion&&a.enable(19),w.retroreflection&&a.enable(24),w.batchingColor&&a.enable(20),w.gradientMap&&a.enable(21),w.packedNormalMap&&a.enable(22),w.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reversedDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.decodeVideoTextureEmissive&&a.enable(20),w.alphaToCoverage&&a.enable(21),w.numLightProbeGrids>0&&a.enable(22),w.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function A(x){const w=d[x.type];let I;if(w){const z=cn[w];I=Sh.clone(z.uniforms)}else I=x.uniforms;return I}function _(x,w){let I=h.get(w);return I!==void 0?++I.usedTimes:(I=new K1(s,w,x,i),c.push(I),h.set(w,I)),I}function T(x){if(--x.usedTimes===0){const w=c.indexOf(x);c[w]=c[c.length-1],c.pop(),h.delete(x.cacheKey),x.destroy()}}function E(x){o.remove(x)}function C(){o.dispose()}return{getParameters:v,getProgramCacheKey:m,getUniforms:A,acquireProgram:_,releaseProgram:T,releaseShaderCache:E,programs:c,dispose:C}}function ep(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function tp(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function dl(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function pl(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function a(f){let d=0;return f.isInstancedMesh&&(d+=2),f.isSkinnedMesh&&(d+=1),d}function o(f,d,g,v,m,p){let b=s[e];return b===void 0?(b={id:f.id,object:f,geometry:d,material:g,materialVariant:a(f),groupOrder:v,renderOrder:f.renderOrder,z:m,group:p},s[e]=b):(b.id=f.id,b.object=f,b.geometry=d,b.material=g,b.materialVariant=a(f),b.groupOrder=v,b.renderOrder=f.renderOrder,b.z=m,b.group=p),e++,b}function l(f,d,g,v,m,p,b){b.reversedDepth===!0&&(m=-m);const A=o(f,d,g,v,m,p);g.transmission>0?n.push(A):g.transparent===!0?i.push(A):t.push(A)}function c(f,d,g,v,m,p){const b=o(f,d,g,v,m,p);g.transmission>0?n.unshift(b):g.transparent===!0?i.unshift(b):t.unshift(b)}function h(f,d){t.length>1&&t.sort(f||tp),n.length>1&&n.sort(d||dl),i.length>1&&i.sort(d||dl)}function u(){for(let f=e,d=s.length;f<d;f++){const g=s[f];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:l,unshift:c,finish:u,sort:h}}function np(){let s=new WeakMap;function e(n,i){const r=s.get(n);let a;return r===void 0?(a=new pl,s.set(n,[a])):i>=r.length?(a=new pl,r.push(a)):a=r[i],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function ip(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new F,color:new He};break;case"SpotLight":t={position:new F,direction:new F,color:new He,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new F,color:new He,distance:0,decay:0};break;case"HemisphereLight":t={direction:new F,skyColor:new He,groundColor:new He};break;case"RectAreaLight":t={color:new He,position:new F,halfWidth:new F,halfHeight:new F};break}return s[e.id]=t,t}}}function sp(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let rp=0;function ap(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function op(s){const e=new ip,t=sp(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new F);const i=new F,r=new Ze,a=new Ze;function o(c){let h=0,u=0,f=0;for(let G=0;G<9;G++)n.probe[G].set(0,0,0);let d=0,g=0,v=0,m=0,p=0,b=0,A=0,_=0,T=0,E=0,C=0,x=0,w=0,I=0;c.sort(ap);for(let G=0,Y=c.length;G<Y;G++){const O=c[G],J=O.color,ie=O.intensity,$=O.distance;let Z=null;if(O.shadow&&O.shadow.map&&(O.shadow.map.texture.format===1030?Z=O.shadow.map.texture:Z=O.shadow.map.depthTexture||O.shadow.map.texture),O.isAmbientLight)h+=J.r*ie,u+=J.g*ie,f+=J.b*ie;else if(O.isLightProbe){for(let se=0;se<9;se++)n.probe[se].addScaledVector(O.sh.coefficients[se],ie);I++}else if(O.isSunLight){const se=e.get(O);if(se.color.copy(O.color).multiplyScalar(O.intensity),O.castShadow){const ae=O.shadow,he=t.get(O);he.shadowIntensity=ae.intensity,he.shadowBias=ae.bias,he.shadowNormalBias=ae.normalBias,he.shadowRadius=ae.radius,he.shadowMapSize.copy(ae.mapSize).multiply(ae.getFrameExtents()),n.sunShadow[g]=he,n.sunShadowMap[g]=Z;const Le=ae.getViewportCount();for(let Ce=0;Ce<Le;Ce++)n.sunShadowMatrix[v+Ce]=ae.getMatrix(Ce),n.sunShadowCascade[v+Ce]=ae._cascadeData[Ce];v+=Le,g++}n.sun[d]=se,d++}else if(O.isDirectionalLight){const se=e.get(O);if(se.color.copy(O.color).multiplyScalar(O.intensity),O.castShadow){const ae=O.shadow,he=t.get(O);he.shadowIntensity=ae.intensity,he.shadowBias=ae.bias,he.shadowNormalBias=ae.normalBias,he.shadowRadius=ae.radius,he.shadowMapSize=ae.mapSize,n.directionalShadow[m]=he,n.directionalShadowMap[m]=Z,n.directionalShadowMatrix[m]=O.shadow.matrix,T++}n.directional[m]=se,m++}else if(O.isSpotLight){const se=e.get(O);se.position.setFromMatrixPosition(O.matrixWorld),se.color.copy(J).multiplyScalar(ie),se.distance=$,se.coneCos=Math.cos(O.angle),se.penumbraCos=Math.cos(O.angle*(1-O.penumbra)),se.decay=O.decay,n.spot[b]=se;const ae=O.shadow;if(O.map&&(n.spotLightMap[x]=O.map,x++,ae.updateMatrices(O),O.castShadow&&w++),n.spotLightMatrix[b]=ae.matrix,O.castShadow){const he=t.get(O);he.shadowIntensity=ae.intensity,he.shadowBias=ae.bias,he.shadowNormalBias=ae.normalBias,he.shadowRadius=ae.radius,he.shadowMapSize=ae.mapSize,n.spotShadow[b]=he,n.spotShadowMap[b]=Z,C++}b++}else if(O.isRectAreaLight){const se=e.get(O);se.color.copy(J).multiplyScalar(ie),se.halfWidth.set(O.width*.5,0,0),se.halfHeight.set(0,O.height*.5,0),n.rectArea[A]=se,A++}else if(O.isPointLight){const se=e.get(O);if(se.color.copy(O.color).multiplyScalar(O.intensity),se.distance=O.distance,se.decay=O.decay,O.castShadow){const ae=O.shadow,he=t.get(O);he.shadowIntensity=ae.intensity,he.shadowBias=ae.bias,he.shadowNormalBias=ae.normalBias,he.shadowRadius=ae.radius,he.shadowMapSize=ae.mapSize,he.shadowCameraNear=ae.camera.near,he.shadowCameraFar=ae.camera.far,n.pointShadow[p]=he,n.pointShadowMap[p]=Z,n.pointShadowMatrix[p]=O.shadow.matrix,E++}n.point[p]=se,p++}else if(O.isHemisphereLight){const se=e.get(O);se.skyColor.copy(O.color).multiplyScalar(ie),se.groundColor.copy(O.groundColor).multiplyScalar(ie),n.hemi[_]=se,_++}}A>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ee.LTC_FLOAT_1,n.rectAreaLTC2=Ee.LTC_FLOAT_2):(n.rectAreaLTC1=Ee.LTC_HALF_1,n.rectAreaLTC2=Ee.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const z=n.hash;(z.sunLength!==d||z.directionalLength!==m||z.pointLength!==p||z.spotLength!==b||z.rectAreaLength!==A||z.hemiLength!==_||z.numSunShadows!==g||z.numDirectionalShadows!==T||z.numPointShadows!==E||z.numSpotShadows!==C||z.numSpotMaps!==x||z.numLightProbes!==I)&&(n.sun.length=d,n.directional.length=m,n.spot.length=b,n.rectArea.length=A,n.point.length=p,n.hemi.length=_,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=v,n.sunShadowCascade.length=v,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.directionalShadowMatrix.length=T,n.pointShadow.length=E,n.pointShadowMap.length=E,n.pointShadowMatrix.length=E,n.spotShadow.length=C,n.spotShadowMap.length=C,n.spotLightMatrix.length=C+x-w,n.spotLightMap.length=x,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=I,z.sunLength=d,z.directionalLength=m,z.pointLength=p,z.spotLength=b,z.rectAreaLength=A,z.hemiLength=_,z.numSunShadows=g,z.numDirectionalShadows=T,z.numPointShadows=E,z.numSpotShadows=C,z.numSpotMaps=x,z.numLightProbes=I,n.version=rp++)}function l(c,h){let u=0,f=0,d=0,g=0,v=0,m=0;const p=h.matrixWorldInverse;for(let b=0,A=c.length;b<A;b++){const _=c[b];if(_.isSunLight){const T=n.sun[u];T.direction.setFromMatrixPosition(_.matrixWorld),T.direction.transformDirection(p),u++}else if(_.isDirectionalLight){const T=n.directional[f];T.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),T.direction.sub(i),T.direction.transformDirection(p),f++}else if(_.isSpotLight){const T=n.spot[g];T.position.setFromMatrixPosition(_.matrixWorld),T.position.applyMatrix4(p),T.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),T.direction.sub(i),T.direction.transformDirection(p),g++}else if(_.isRectAreaLight){const T=n.rectArea[v];T.position.setFromMatrixPosition(_.matrixWorld),T.position.applyMatrix4(p),a.identity(),r.copy(_.matrixWorld),r.premultiply(p),a.extractRotation(r),T.halfWidth.set(_.width*.5,0,0),T.halfHeight.set(0,_.height*.5,0),T.halfWidth.applyMatrix4(a),T.halfHeight.applyMatrix4(a),v++}else if(_.isPointLight){const T=n.point[d];T.position.setFromMatrixPosition(_.matrixWorld),T.position.applyMatrix4(p),d++}else if(_.isHemisphereLight){const T=n.hemi[m];T.direction.setFromMatrixPosition(_.matrixWorld),T.direction.transformDirection(p),m++}}}return{setup:o,setupView:l,state:n}}function ml(s){const e=new op(s),t=[],n=[],i=[];function r(f){u.camera=f,t.length=0,n.length=0,i.length=0}function a(f){t.push(f)}function o(f){n.push(f)}function l(f){i.push(f)}function c(){e.setup(t)}function h(f){e.setupView(t,f)}const u={lightsArray:t,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function lp(s){let e=new WeakMap;function t(i,r=0){const a=e.get(i);let o;return a===void 0?(o=new ml(s),e.set(i,[o])):r>=a.length?(o=new ml(s),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const cp=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,hp=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,up=[new F(1,0,0),new F(-1,0,0),new F(0,1,0),new F(0,-1,0),new F(0,0,1),new F(0,0,-1)],fp=[new F(0,-1,0),new F(0,-1,0),new F(0,0,1),new F(0,0,-1),new F(0,-1,0),new F(0,-1,0)],gl=new Ze,Qi=new F,ia=new F;function dp(s,e,t){let n=new Er;const i=new de,r=new de,a=new ut,o=new Ah,l=new wh,c={},h=t.maxTextureSize,u={0:1,1:0,2:2},f=new on({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new de},radius:{value:4}},vertexShader:cp,fragmentShader:hp}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const g=new Tt;g.setAttribute("position",new Ft(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new xt(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let p=this.type;this.render=function(E,C,x){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;this.type===2&&(Be("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=1);const w=s.getRenderTarget(),I=s.getActiveCubeFace(),z=s.getActiveMipmapLevel(),G=s.state;G.setBlending(0),G.buffers.depth.getReversed()===!0?G.buffers.color.setClear(0,0,0,0):G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const Y=p!==this.type;Y&&C.traverse(function(O){O.material&&(Array.isArray(O.material)?O.material.forEach(J=>J.needsUpdate=!0):O.material.needsUpdate=!0)});for(let O=0,J=E.length;O<J;O++){const ie=E[O],$=ie.shadow;if($===void 0){Be("WebGLShadowMap:",ie,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;i.copy($.mapSize);const Z=$.getFrameExtents();i.multiply(Z),r.copy($.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/Z.x),i.x=r.x*Z.x,$.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/Z.y),i.y=r.y*Z.y,$.mapSize.y=r.y));const se=s.state.buffers.depth.getReversed();if($.camera._reversedDepth=se,$.map===null||Y===!0){if($.map!==null&&($.map.depthTexture!==null&&($.map.depthTexture.dispose(),$.map.depthTexture=null),$.map.dispose()),this.type===3){if(ie.isPointLight){Be("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}$.map=new Kt(i.x,i.y,{format:1030,type:1016,minFilter:1006,magFilter:1006,generateMipmaps:!1}),$.map.texture.name=ie.name+".shadowMap",$.map.depthTexture=new Bi(i.x,i.y,1015),$.map.depthTexture.name=ie.name+".shadowMapDepth",$.map.depthTexture.format=1026,$.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=1003,$.map.depthTexture.magFilter=1003}else ie.isPointLight?($.map=new Jo(i.x),$.map.depthTexture=new Gc(i.x,1014)):($.map=new Kt(i.x,i.y),$.map.depthTexture=new Bi(i.x,i.y,1014)),$.map.depthTexture.name=ie.name+".shadowMap",$.map.depthTexture.format=1026,this.type===1?($.map.depthTexture.compareFunction=se?518:515,$.map.depthTexture.minFilter=1006,$.map.depthTexture.magFilter=1006):($.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=1003,$.map.depthTexture.magFilter=1003);$.camera.updateProjectionMatrix()}$.map.isWebGLCubeRenderTarget!==!0&&($.map.width!==i.x||$.map.height!==i.y)&&$.map.setSize(i.x,i.y);const ae=$.map.isWebGLCubeRenderTarget?6:$.getViewportCount();ie.isPointLight!==!0&&$.updateMatrices(ie,x);for(let he=0;he<ae;he++){const Le=$.getCamera(he);if(ie.isPointLight){const Ce=$.camera,Ke=$.matrix,Ye=ie.distance||Ce.far;Ye!==Ce.far&&(Ce.far=Ye,Ce.updateProjectionMatrix()),Qi.setFromMatrixPosition(ie.matrixWorld),Ce.position.copy(Qi),ia.copy(Ce.position),ia.add(up[he]),Ce.up.copy(fp[he]),Ce.lookAt(ia),Ce.updateMatrixWorld(),Ke.makeTranslation(-Qi.x,-Qi.y,-Qi.z),gl.multiplyMatrices(Ce.projectionMatrix,Ce.matrixWorldInverse),$._frustum.setFromProjectionMatrix(gl,Ce.coordinateSystem,Ce.reversedDepth)}if($.map.isWebGLCubeRenderTarget)s.setRenderTarget($.map,he),s.clear();else{he===0&&(s.setRenderTarget($.map),s.clear());const Ce=$.getViewport(he);a.set(r.x*Ce.x,r.y*Ce.y,r.x*Ce.z,r.y*Ce.w),G.viewport(a)}n=$.getFrustum(he),_(C,x,Le,ie,this.type)}$.isPointLightShadow!==!0&&this.type===3&&b($,x),$.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(w,I,z)};function b(E,C){const x=e.update(v);f.defines.VSM_SAMPLES!==E.blurSamples&&(f.defines.VSM_SAMPLES=E.blurSamples,d.defines.VSM_SAMPLES=E.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),E.mapPass===null?E.mapPass=new Kt(i.x,i.y,{format:1030,type:1016}):(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)&&E.mapPass.setSize(E.map.width,E.map.height),f.uniforms.shadow_pass.value=E.map.depthTexture,f.uniforms.resolution.value.set(E.map.width,E.map.height),f.uniforms.radius.value=E.radius,s.setRenderTarget(E.mapPass),s.clear(),s.renderBufferDirect(C,null,x,f,v,null),d.uniforms.shadow_pass.value=E.mapPass.texture,d.uniforms.resolution.value.set(E.map.width,E.map.height),d.uniforms.radius.value=E.radius,s.setRenderTarget(E.map),s.clear(),s.renderBufferDirect(C,null,x,d,v,null)}function A(E,C,x,w){let I=null;const z=x.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(z!==void 0)I=z;else if(I=x.isPointLight===!0?l:o,s.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const G=I.uuid,Y=C.uuid;let O=c[G];O===void 0&&(O={},c[G]=O);let J=O[Y];J===void 0&&(J=I.clone(),O[Y]=J,C.addEventListener("dispose",T)),I=J}if(I.visible=C.visible,I.wireframe=C.wireframe,w===3?I.side=C.shadowSide!==null?C.shadowSide:C.side:I.side=C.shadowSide!==null?C.shadowSide:u[C.side],I.alphaMap=C.alphaMap,I.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,I.map=C.map,I.clipShadows=C.clipShadows,I.clippingPlanes=C.clippingPlanes,I.clipIntersection=C.clipIntersection,I.displacementMap=C.displacementMap,I.displacementScale=C.displacementScale,I.displacementBias=C.displacementBias,I.wireframeLinewidth=C.wireframeLinewidth,I.linewidth=C.linewidth,x.isPointLight===!0&&I.isMeshDistanceMaterial===!0){const G=s.properties.get(I);G.light=x}return I}function _(E,C,x,w,I){if(E.visible===!1)return;if(E.layers.test(C.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&I===3)&&(!E.frustumCulled||E.intersectsFrustum(n))){E.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,E.matrixWorld);const Y=e.update(E),O=E.material;if(Array.isArray(O)){const J=Y.groups;for(let ie=0,$=J.length;ie<$;ie++){const Z=J[ie],se=O[Z.materialIndex];if(se&&se.visible){const ae=A(E,se,w,I);E.onBeforeShadow(s,E,C,x,Y,ae,Z),s.renderBufferDirect(x,null,Y,ae,E,Z),E.onAfterShadow(s,E,C,x,Y,ae,Z)}}}else if(O.visible){const J=A(E,O,w,I);E.onBeforeShadow(s,E,C,x,Y,J,null),s.renderBufferDirect(x,null,Y,J,E,null),E.onAfterShadow(s,E,C,x,Y,J,null)}}const G=E.children;for(let Y=0,O=G.length;Y<O;Y++)_(G[Y],C,x,w,I)}function T(E){E.target.removeEventListener("dispose",T);for(const x in c){const w=c[x],I=E.target.uuid;I in w&&(w[I].dispose(),delete w[I])}}}function pp(s,e){function t(){let H=!1;const Te=new ut;let fe=null;const be=new ut(0,0,0,0);return{setMask:function(qe){fe!==qe&&!H&&(s.colorMask(qe,qe,qe,qe),fe=qe)},setLocked:function(qe){H=qe},setClear:function(qe,ge,ke,Oe,pt){pt===!0&&(qe*=Oe,ge*=Oe,ke*=Oe),Te.set(qe,ge,ke,Oe),be.equals(Te)===!1&&(s.clearColor(qe,ge,ke,Oe),be.copy(Te))},reset:function(){H=!1,fe=null,be.set(-1,0,0,0)}}}function n(){let H=!1,Te=!1,fe=null,be=null,qe=null;return{setReversed:function(ge){if(Te!==ge){const ke=e.get("EXT_clip_control");ge?ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.ZERO_TO_ONE_EXT):ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.NEGATIVE_ONE_TO_ONE_EXT),Te=ge;const Oe=qe;qe=null,this.setClear(Oe)}},getReversed:function(){return Te},setTest:function(ge){ge?N(s.DEPTH_TEST):L(s.DEPTH_TEST)},setMask:function(ge){fe!==ge&&!H&&(s.depthMask(ge),fe=ge)},setFunc:function(ge){if(Te&&(ge=Xl[ge]),be!==ge){switch(ge){case 0:s.depthFunc(s.NEVER);break;case 1:s.depthFunc(s.ALWAYS);break;case 2:s.depthFunc(s.LESS);break;case 3:s.depthFunc(s.LEQUAL);break;case 4:s.depthFunc(s.EQUAL);break;case 5:s.depthFunc(s.GEQUAL);break;case 6:s.depthFunc(s.GREATER);break;case 7:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}be=ge}},setLocked:function(ge){H=ge},setClear:function(ge){qe!==ge&&(qe=ge,Te&&(ge=1-ge),s.clearDepth(ge))},reset:function(){H=!1,fe=null,be=null,qe=null,Te=!1}}}function i(){let H=!1,Te=null,fe=null,be=null,qe=null,ge=null,ke=null,Oe=null,pt=null;return{setTest:function(at){H||(at?N(s.STENCIL_TEST):L(s.STENCIL_TEST))},setMask:function(at){Te!==at&&!H&&(s.stencilMask(at),Te=at)},setFunc:function(at,sn,fn){(fe!==at||be!==sn||qe!==fn)&&(s.stencilFunc(at,sn,fn),fe=at,be=sn,qe=fn)},setOp:function(at,sn,fn){(ge!==at||ke!==sn||Oe!==fn)&&(s.stencilOp(at,sn,fn),ge=at,ke=sn,Oe=fn)},setLocked:function(at){H=at},setClear:function(at){pt!==at&&(s.clearStencil(at),pt=at)},reset:function(){H=!1,Te=null,fe=null,be=null,qe=null,ge=null,ke=null,Oe=null,pt=null}}}const r=new t,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let h={},u={},f={},d=new WeakMap,g=[],v=null,m=!1,p=null,b=null,A=null,_=null,T=null,E=null,C=null,x=new He(0,0,0),w=0,I=!1,z=null,G=null,Y=null,O=null,J=null;const ie=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let $=!1,Z=0;const se=s.getParameter(s.VERSION);se.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(se)[1]),$=Z>=1):se.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(se)[1]),$=Z>=2);let ae=null,he={};const Le=s.getParameter(s.SCISSOR_BOX),Ce=s.getParameter(s.VIEWPORT),Ke=new ut().fromArray(Le),Ye=new ut().fromArray(Ce);function $e(H,Te,fe,be){const qe=new Uint8Array(4),ge=s.createTexture();s.bindTexture(H,ge),s.texParameteri(H,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(H,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let ke=0;ke<fe;ke++)H===s.TEXTURE_3D||H===s.TEXTURE_2D_ARRAY?s.texImage3D(Te,0,s.RGBA,1,1,be,0,s.RGBA,s.UNSIGNED_BYTE,qe):s.texImage2D(Te+ke,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,qe);return ge}const U={};U[s.TEXTURE_2D]=$e(s.TEXTURE_2D,s.TEXTURE_2D,1),U[s.TEXTURE_CUBE_MAP]=$e(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),U[s.TEXTURE_2D_ARRAY]=$e(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),U[s.TEXTURE_3D]=$e(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),N(s.DEPTH_TEST),a.setFunc(3),K(!1),Q(1),N(s.CULL_FACE),k(0);function N(H){h[H]!==!0&&(s.enable(H),h[H]=!0)}function L(H){h[H]!==!1&&(s.disable(H),h[H]=!1)}function P(H,Te){return f[H]!==Te?(s.bindFramebuffer(H,Te),f[H]=Te,H===s.DRAW_FRAMEBUFFER&&(f[s.FRAMEBUFFER]=Te),H===s.FRAMEBUFFER&&(f[s.DRAW_FRAMEBUFFER]=Te),!0):!1}function B(H,Te){let fe=g,be=!1;if(H){fe=d.get(Te),fe===void 0&&(fe=[],d.set(Te,fe));const qe=H.textures;if(fe.length!==qe.length||fe[0]!==s.COLOR_ATTACHMENT0){for(let ge=0,ke=qe.length;ge<ke;ge++)fe[ge]=s.COLOR_ATTACHMENT0+ge;fe.length=qe.length,be=!0}}else fe[0]!==s.BACK&&(fe[0]=s.BACK,be=!0);be&&s.drawBuffers(fe)}function ne(H){return v!==H?(s.useProgram(H),v=H,!0):!1}const _e={100:s.FUNC_ADD,101:s.FUNC_SUBTRACT,102:s.FUNC_REVERSE_SUBTRACT};_e[103]=s.MIN,_e[104]=s.MAX;const R={200:s.ZERO,201:s.ONE,202:s.SRC_COLOR,204:s.SRC_ALPHA,210:s.SRC_ALPHA_SATURATE,208:s.DST_COLOR,206:s.DST_ALPHA,203:s.ONE_MINUS_SRC_COLOR,205:s.ONE_MINUS_SRC_ALPHA,209:s.ONE_MINUS_DST_COLOR,207:s.ONE_MINUS_DST_ALPHA,211:s.CONSTANT_COLOR,212:s.ONE_MINUS_CONSTANT_COLOR,213:s.CONSTANT_ALPHA,214:s.ONE_MINUS_CONSTANT_ALPHA};function k(H,Te,fe,be,qe,ge,ke,Oe,pt,at){if(H===0){m===!0&&(L(s.BLEND),m=!1);return}if(m===!1&&(N(s.BLEND),m=!0),H!==5){if(H!==p||at!==I){if((b!==100||T!==100)&&(s.blendEquation(s.FUNC_ADD),b=100,T=100),at)switch(H){case 1:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case 2:s.blendFunc(s.ONE,s.ONE);break;case 3:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case 4:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:Xe("WebGLState: Invalid blending: ",H);break}else switch(H){case 1:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case 2:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case 3:Xe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case 4:Xe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Xe("WebGLState: Invalid blending: ",H);break}A=null,_=null,E=null,C=null,x.set(0,0,0),w=0,p=H,I=at}return}qe=qe||Te,ge=ge||fe,ke=ke||be,(Te!==b||qe!==T)&&(s.blendEquationSeparate(_e[Te],_e[qe]),b=Te,T=qe),(fe!==A||be!==_||ge!==E||ke!==C)&&(s.blendFuncSeparate(R[fe],R[be],R[ge],R[ke]),A=fe,_=be,E=ge,C=ke),(Oe.equals(x)===!1||pt!==w)&&(s.blendColor(Oe.r,Oe.g,Oe.b,pt),x.copy(Oe),w=pt),p=H,I=!1}function D(H,Te){H.side===2?L(s.CULL_FACE):N(s.CULL_FACE);let fe=H.side===1;Te&&(fe=!fe),K(fe),H.blending===1&&H.transparent===!1?k(0):k(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),a.setFunc(H.depthFunc),a.setTest(H.depthTest),a.setMask(H.depthWrite),r.setMask(H.colorWrite);const be=H.stencilWrite;o.setTest(be),be&&(o.setMask(H.stencilWriteMask),o.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),o.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),me(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?N(s.SAMPLE_ALPHA_TO_COVERAGE):L(s.SAMPLE_ALPHA_TO_COVERAGE)}function K(H){z!==H&&(H?s.frontFace(s.CW):s.frontFace(s.CCW),z=H)}function Q(H){H!==0?(N(s.CULL_FACE),H!==G&&(H===1?s.cullFace(s.BACK):H===2?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):L(s.CULL_FACE),G=H}function le(H){H!==Y&&($&&s.lineWidth(H),Y=H)}function me(H,Te,fe){H?(N(s.POLYGON_OFFSET_FILL),(O!==Te||J!==fe)&&(O=Te,J=fe,a.getReversed()&&(Te=-Te),s.polygonOffset(Te,fe))):L(s.POLYGON_OFFSET_FILL)}function pe(H){H?N(s.SCISSOR_TEST):L(s.SCISSOR_TEST)}function X(H){H===void 0&&(H=s.TEXTURE0+ie-1),ae!==H&&(s.activeTexture(H),ae=H)}function S(H,Te,fe){fe===void 0&&(ae===null?fe=s.TEXTURE0+ie-1:fe=ae);let be=he[fe];be===void 0&&(be={type:void 0,texture:void 0},he[fe]=be),(be.type!==H||be.texture!==Te)&&(ae!==fe&&(s.activeTexture(fe),ae=fe),s.bindTexture(H,Te||U[H]),be.type=H,be.texture=Te)}function Ae(){const H=he[ae];H!==void 0&&H.type!==void 0&&(s.bindTexture(H.type,null),H.type=void 0,H.texture=void 0)}function Ne(){try{s.compressedTexImage2D(...arguments)}catch(H){Xe("WebGLState:",H)}}function q(){try{s.compressedTexImage3D(...arguments)}catch(H){Xe("WebGLState:",H)}}function M(){try{s.texSubImage2D(...arguments)}catch(H){Xe("WebGLState:",H)}}function W(){try{s.texSubImage3D(...arguments)}catch(H){Xe("WebGLState:",H)}}function j(){try{s.compressedTexSubImage2D(...arguments)}catch(H){Xe("WebGLState:",H)}}function oe(){try{s.compressedTexSubImage3D(...arguments)}catch(H){Xe("WebGLState:",H)}}function xe(){try{s.texStorage2D(...arguments)}catch(H){Xe("WebGLState:",H)}}function ve(){try{s.texStorage3D(...arguments)}catch(H){Xe("WebGLState:",H)}}function ce(){try{s.texImage2D(...arguments)}catch(H){Xe("WebGLState:",H)}}function ue(){try{s.texImage3D(...arguments)}catch(H){Xe("WebGLState:",H)}}function Me(H){return u[H]!==void 0?u[H]:s.getParameter(H)}function Fe(H,Te){u[H]!==Te&&(s.pixelStorei(H,Te),u[H]=Te)}function ye(H){Ke.equals(H)===!1&&(s.scissor(H.x,H.y,H.z,H.w),Ke.copy(H))}function Se(H){Ye.equals(H)===!1&&(s.viewport(H.x,H.y,H.z,H.w),Ye.copy(H))}function ze(H,Te){let fe=c.get(Te);fe===void 0&&(fe=new WeakMap,c.set(Te,fe));let be=fe.get(H);be===void 0&&(be=s.getUniformBlockIndex(Te,H.name),fe.set(H,be))}function We(H,Te){const be=c.get(Te).get(H);l.get(Te)!==be&&(s.uniformBlockBinding(Te,be,H.__bindingPointIndex),l.set(Te,be))}function Je(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},u={},ae=null,he={},f={},d=new WeakMap,g=[],v=null,m=!1,p=null,b=null,A=null,_=null,T=null,E=null,C=null,x=new He(0,0,0),w=0,I=!1,z=null,G=null,Y=null,O=null,J=null,Ke.set(0,0,s.canvas.width,s.canvas.height),Ye.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:N,disable:L,bindFramebuffer:P,drawBuffers:B,useProgram:ne,setBlending:k,setMaterial:D,setFlipSided:K,setCullFace:Q,setLineWidth:le,setPolygonOffset:me,setScissorTest:pe,activeTexture:X,bindTexture:S,unbindTexture:Ae,compressedTexImage2D:Ne,compressedTexImage3D:q,texImage2D:ce,texImage3D:ue,pixelStorei:Fe,getParameter:Me,updateUBOMapping:ze,uniformBlockBinding:We,texStorage2D:xe,texStorage3D:ve,texSubImage2D:M,texSubImage3D:W,compressedTexSubImage2D:j,compressedTexSubImage3D:oe,scissor:ye,viewport:Se,reset:Je}}function mp(s,e,t,n,i,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new de,h=new WeakMap,u=new Set;let f;const d=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(q,M){return g?new OffscreenCanvas(q,M):Ri("canvas")}function m(q,M,W){let j=1;const oe=Ne(q);if((oe.width>W||oe.height>W)&&(j=W/Math.max(oe.width,oe.height)),j<1)if(typeof HTMLImageElement!="undefined"&&q instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&q instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&q instanceof ImageBitmap||typeof VideoFrame!="undefined"&&q instanceof VideoFrame){const xe=Math.floor(j*oe.width),ve=Math.floor(j*oe.height);f===void 0&&(f=v(xe,ve));const ce=M?v(xe,ve):f;return ce.width=xe,ce.height=ve,ce.getContext("2d").drawImage(q,0,0,xe,ve),Be("WebGLRenderer: Texture has been resized from ("+oe.width+"x"+oe.height+") to ("+xe+"x"+ve+")."),ce}else return"data"in q&&Be("WebGLRenderer: Image in DataTexture is too big ("+oe.width+"x"+oe.height+")."),q;return q}function p(q){return q.generateMipmaps}function b(q){s.generateMipmap(q)}function A(q){return q.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:q.isWebGL3DRenderTarget?s.TEXTURE_3D:q.isWebGLArrayRenderTarget||q.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function _(q,M,W,j,oe,xe=!1){if(q!==null){if(s[q]!==void 0)return s[q];Be("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+q+"'")}let ve;j&&(ve=e.get("EXT_texture_norm16"),ve||Be("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ce=M;if(M===s.RED&&(W===s.FLOAT&&(ce=s.R32F),W===s.HALF_FLOAT&&(ce=s.R16F),W===s.UNSIGNED_BYTE&&(ce=s.R8),W===s.UNSIGNED_SHORT&&ve&&(ce=ve.R16_EXT),W===s.SHORT&&ve&&(ce=ve.R16_SNORM_EXT)),M===s.RED_INTEGER&&(W===s.UNSIGNED_BYTE&&(ce=s.R8UI),W===s.UNSIGNED_SHORT&&(ce=s.R16UI),W===s.UNSIGNED_INT&&(ce=s.R32UI),W===s.BYTE&&(ce=s.R8I),W===s.SHORT&&(ce=s.R16I),W===s.INT&&(ce=s.R32I)),M===s.RG&&(W===s.FLOAT&&(ce=s.RG32F),W===s.HALF_FLOAT&&(ce=s.RG16F),W===s.UNSIGNED_BYTE&&(ce=s.RG8),W===s.UNSIGNED_SHORT&&ve&&(ce=ve.RG16_EXT),W===s.SHORT&&ve&&(ce=ve.RG16_SNORM_EXT)),M===s.RG_INTEGER&&(W===s.UNSIGNED_BYTE&&(ce=s.RG8UI),W===s.UNSIGNED_SHORT&&(ce=s.RG16UI),W===s.UNSIGNED_INT&&(ce=s.RG32UI),W===s.BYTE&&(ce=s.RG8I),W===s.SHORT&&(ce=s.RG16I),W===s.INT&&(ce=s.RG32I)),M===s.RGB_INTEGER&&(W===s.UNSIGNED_BYTE&&(ce=s.RGB8UI),W===s.UNSIGNED_SHORT&&(ce=s.RGB16UI),W===s.UNSIGNED_INT&&(ce=s.RGB32UI),W===s.BYTE&&(ce=s.RGB8I),W===s.SHORT&&(ce=s.RGB16I),W===s.INT&&(ce=s.RGB32I)),M===s.RGBA_INTEGER&&(W===s.UNSIGNED_BYTE&&(ce=s.RGBA8UI),W===s.UNSIGNED_SHORT&&(ce=s.RGBA16UI),W===s.UNSIGNED_INT&&(ce=s.RGBA32UI),W===s.BYTE&&(ce=s.RGBA8I),W===s.SHORT&&(ce=s.RGBA16I),W===s.INT&&(ce=s.RGBA32I)),M===s.RGB&&(W===s.UNSIGNED_SHORT&&ve&&(ce=ve.RGB16_EXT),W===s.SHORT&&ve&&(ce=ve.RGB16_SNORM_EXT),W===s.UNSIGNED_INT_5_9_9_9_REV&&(ce=s.RGB9_E5),W===s.UNSIGNED_INT_10F_11F_11F_REV&&(ce=s.R11F_G11F_B10F)),M===s.RGBA){const ue=xe?ns:nt.getTransfer(oe);W===s.FLOAT&&(ce=s.RGBA32F),W===s.HALF_FLOAT&&(ce=s.RGBA16F),W===s.UNSIGNED_BYTE&&(ce=ue===lt?s.SRGB8_ALPHA8:s.RGBA8),W===s.UNSIGNED_SHORT&&ve&&(ce=ve.RGBA16_EXT),W===s.SHORT&&ve&&(ce=ve.RGBA16_SNORM_EXT),W===s.UNSIGNED_SHORT_4_4_4_4&&(ce=s.RGBA4),W===s.UNSIGNED_SHORT_5_5_5_1&&(ce=s.RGB5_A1)}return(ce===s.R16F||ce===s.R32F||ce===s.RG16F||ce===s.RG32F||ce===s.RGBA16F||ce===s.RGBA32F)&&e.get("EXT_color_buffer_float"),ce}function T(q,M){let W;return q?M===null||M===1014||M===1020?W=s.DEPTH24_STENCIL8:M===1015?W=s.DEPTH32F_STENCIL8:M===1012&&(W=s.DEPTH24_STENCIL8,Be("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===1014||M===1020?W=s.DEPTH_COMPONENT24:M===1015?W=s.DEPTH_COMPONENT32F:M===1012&&(W=s.DEPTH_COMPONENT16),W}function E(q,M){return p(q)===!0||q.isFramebufferTexture&&q.minFilter!==1003&&q.minFilter!==1006?Math.log2(Math.max(M.width,M.height))+1:q.mipmaps!==void 0&&q.mipmaps.length>0?q.mipmaps.length:q.isCompressedTexture&&Array.isArray(q.image)?M.mipmaps.length:1}function C(q){const M=q.target;M.removeEventListener("dispose",C),w(M),M.isVideoTexture&&h.delete(M),M.isHTMLTexture&&u.delete(M)}function x(q){const M=q.target;M.removeEventListener("dispose",x),z(M)}function w(q){const M=n.get(q);if(M.__webglInit===void 0)return;const W=q.source,j=d.get(W);if(j){const oe=j[M.__cacheKey];oe.usedTimes--,oe.usedTimes===0&&I(q),Object.keys(j).length===0&&d.delete(W)}n.remove(q)}function I(q){const M=n.get(q);s.deleteTexture(M.__webglTexture);const W=q.source,j=d.get(W);delete j[M.__cacheKey],a.memory.textures--}function z(q){const M=n.get(q);if(q.depthTexture&&(q.depthTexture.dispose(),n.remove(q.depthTexture)),q.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(M.__webglFramebuffer[j]))for(let oe=0;oe<M.__webglFramebuffer[j].length;oe++)s.deleteFramebuffer(M.__webglFramebuffer[j][oe]);else s.deleteFramebuffer(M.__webglFramebuffer[j]);M.__webglDepthbuffer&&s.deleteRenderbuffer(M.__webglDepthbuffer[j])}else{if(Array.isArray(M.__webglFramebuffer))for(let j=0;j<M.__webglFramebuffer.length;j++)s.deleteFramebuffer(M.__webglFramebuffer[j]);else s.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&s.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&s.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let j=0;j<M.__webglColorRenderbuffer.length;j++)M.__webglColorRenderbuffer[j]&&s.deleteRenderbuffer(M.__webglColorRenderbuffer[j]);M.__webglDepthRenderbuffer&&s.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const W=q.textures;for(let j=0,oe=W.length;j<oe;j++){const xe=n.get(W[j]);xe.__webglTexture&&(s.deleteTexture(xe.__webglTexture),a.memory.textures--),n.remove(W[j])}n.remove(q)}let G=0;function Y(){G=0}function O(){return G}function J(q){G=q}function ie(){const q=G;return q>=i.maxTextures&&Be("WebGLTextures: Trying to use "+(q+1)+" texture units while this GPU supports only "+i.maxTextures),G+=1,q}function $(q){const M=[];return M.push(q.wrapS),M.push(q.wrapT),M.push(q.wrapR||0),M.push(q.magFilter),M.push(q.minFilter),M.push(q.anisotropy),M.push(q.internalFormat),M.push(q.format),M.push(q.type),M.push(q.generateMipmaps),M.push(q.premultiplyAlpha),M.push(q.flipY),M.push(q.unpackAlignment),M.push(q.colorSpace),M.join()}function Z(q,M){const W=n.get(q);if(q.isVideoTexture&&S(q),q.isRenderTargetTexture===!1&&q.isExternalTexture!==!0&&q.version>0&&W.__version!==q.version){const j=q.image;if(j===null)Be("WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)Be("WebGLRenderer: Texture marked for update but image is incomplete");else{L(W,q,M);return}}else q.isExternalTexture&&(W.__webglTexture=q.sourceTexture?q.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,W.__webglTexture,s.TEXTURE0+M)}function se(q,M){const W=n.get(q);if(q.isRenderTargetTexture===!1&&q.version>0&&W.__version!==q.version){L(W,q,M);return}else q.isExternalTexture&&(W.__webglTexture=q.sourceTexture?q.sourceTexture:null);t.bindTexture(s.TEXTURE_2D_ARRAY,W.__webglTexture,s.TEXTURE0+M)}function ae(q,M){const W=n.get(q);if(q.isRenderTargetTexture===!1&&q.version>0&&W.__version!==q.version){L(W,q,M);return}t.bindTexture(s.TEXTURE_3D,W.__webglTexture,s.TEXTURE0+M)}function he(q,M){const W=n.get(q);if(q.isCubeDepthTexture!==!0&&q.version>0&&W.__version!==q.version){P(W,q,M);return}t.bindTexture(s.TEXTURE_CUBE_MAP,W.__webglTexture,s.TEXTURE0+M)}const Le={1e3:s.REPEAT,1001:s.CLAMP_TO_EDGE,1002:s.MIRRORED_REPEAT},Ce={1003:s.NEAREST,1004:s.NEAREST_MIPMAP_NEAREST,1005:s.NEAREST_MIPMAP_LINEAR,1006:s.LINEAR,1007:s.LINEAR_MIPMAP_NEAREST,1008:s.LINEAR_MIPMAP_LINEAR},Ke={512:s.NEVER,519:s.ALWAYS,513:s.LESS,515:s.LEQUAL,514:s.EQUAL,518:s.GEQUAL,516:s.GREATER,517:s.NOTEQUAL};function Ye(q,M){if(M.type===1015&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===1006||M.magFilter===1007||M.magFilter===1005||M.magFilter===1008||M.minFilter===1006||M.minFilter===1007||M.minFilter===1005||M.minFilter===1008)&&Be("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(q,s.TEXTURE_WRAP_S,Le[M.wrapS]),s.texParameteri(q,s.TEXTURE_WRAP_T,Le[M.wrapT]),(q===s.TEXTURE_3D||q===s.TEXTURE_2D_ARRAY)&&s.texParameteri(q,s.TEXTURE_WRAP_R,Le[M.wrapR]),s.texParameteri(q,s.TEXTURE_MAG_FILTER,Ce[M.magFilter]),s.texParameteri(q,s.TEXTURE_MIN_FILTER,Ce[M.minFilter]),M.compareFunction&&(s.texParameteri(q,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(q,s.TEXTURE_COMPARE_FUNC,Ke[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===1003||M.minFilter!==1005&&M.minFilter!==1008||M.type===1015&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const W=e.get("EXT_texture_filter_anisotropic");s.texParameterf(q,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,i.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function $e(q,M){let W=!1;q.__webglInit===void 0&&(q.__webglInit=!0,M.addEventListener("dispose",C));const j=M.source;let oe=d.get(j);oe===void 0&&(oe={},d.set(j,oe));const xe=$(M);if(xe!==q.__cacheKey){oe[xe]===void 0&&(oe[xe]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,W=!0),oe[xe].usedTimes++;const ve=oe[q.__cacheKey];ve!==void 0&&(oe[q.__cacheKey].usedTimes--,ve.usedTimes===0&&I(M)),q.__cacheKey=xe,q.__webglTexture=oe[xe].texture}return W}function U(q,M,W){return Math.floor(Math.floor(q/W)/M)}function N(q,M,W,j){const xe=q.updateRanges;if(xe.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,M.width,M.height,W,j,M.data);else{xe.sort((Fe,ye)=>Fe.start-ye.start);let ve=0;for(let Fe=1;Fe<xe.length;Fe++){const ye=xe[ve],Se=xe[Fe],ze=ye.start+ye.count,We=U(Se.start,M.width,4),Je=U(ye.start,M.width,4);Se.start<=ze+1&&We===Je&&U(Se.start+Se.count-1,M.width,4)===We?ye.count=Math.max(ye.count,Se.start+Se.count-ye.start):(++ve,xe[ve]=Se)}xe.length=ve+1;const ce=t.getParameter(s.UNPACK_ROW_LENGTH),ue=t.getParameter(s.UNPACK_SKIP_PIXELS),Me=t.getParameter(s.UNPACK_SKIP_ROWS);t.pixelStorei(s.UNPACK_ROW_LENGTH,M.width);for(let Fe=0,ye=xe.length;Fe<ye;Fe++){const Se=xe[Fe],ze=Math.floor(Se.start/4),We=Math.ceil(Se.count/4),Je=ze%M.width,H=Math.floor(ze/M.width),Te=We,fe=1;t.pixelStorei(s.UNPACK_SKIP_PIXELS,Je),t.pixelStorei(s.UNPACK_SKIP_ROWS,H),t.texSubImage2D(s.TEXTURE_2D,0,Je,H,Te,fe,W,j,M.data)}q.clearUpdateRanges(),t.pixelStorei(s.UNPACK_ROW_LENGTH,ce),t.pixelStorei(s.UNPACK_SKIP_PIXELS,ue),t.pixelStorei(s.UNPACK_SKIP_ROWS,Me)}}function L(q,M,W){let j=s.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(j=s.TEXTURE_2D_ARRAY),M.isData3DTexture&&(j=s.TEXTURE_3D);const oe=$e(q,M),xe=M.source;t.bindTexture(j,q.__webglTexture,s.TEXTURE0+W);const ve=n.get(xe);if(xe.version!==ve.__version||oe===!0){if(t.activeTexture(s.TEXTURE0+W),(typeof ImageBitmap!="undefined"&&M.image instanceof ImageBitmap)===!1){const fe=nt.getPrimaries(nt.workingColorSpace),be=M.colorSpace===An?null:nt.getPrimaries(M.colorSpace),qe=M.colorSpace===An||fe===be?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,qe)}t.pixelStorei(s.UNPACK_ALIGNMENT,M.unpackAlignment);let ue=m(M.image,!1,i.maxTextureSize);ue=Ae(M,ue);const Me=r.convert(M.format,M.colorSpace),Fe=r.convert(M.type);let ye=_(M.internalFormat,Me,Fe,M.normalized,M.colorSpace,M.isVideoTexture);Ye(j,M);let Se;const ze=M.mipmaps,We=M.isVideoTexture!==!0,Je=ve.__version===void 0||oe===!0,H=xe.dataReady,Te=E(M,ue);if(M.isDepthTexture)ye=T(M.format===1027,M.type),Je&&(We?t.texStorage2D(s.TEXTURE_2D,1,ye,ue.width,ue.height):t.texImage2D(s.TEXTURE_2D,0,ye,ue.width,ue.height,0,Me,Fe,null));else if(M.isDataTexture)if(ze.length>0){We&&Je&&t.texStorage2D(s.TEXTURE_2D,Te,ye,ze[0].width,ze[0].height);for(let fe=0,be=ze.length;fe<be;fe++)Se=ze[fe],We?H&&t.texSubImage2D(s.TEXTURE_2D,fe,0,0,Se.width,Se.height,Me,Fe,Se.data):t.texImage2D(s.TEXTURE_2D,fe,ye,Se.width,Se.height,0,Me,Fe,Se.data);M.generateMipmaps=!1}else We?(Je&&t.texStorage2D(s.TEXTURE_2D,Te,ye,ue.width,ue.height),H&&N(M,ue,Me,Fe)):t.texImage2D(s.TEXTURE_2D,0,ye,ue.width,ue.height,0,Me,Fe,ue.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){We&&Je&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Te,ye,ze[0].width,ze[0].height,ue.depth);for(let fe=0,be=ze.length;fe<be;fe++)if(Se=ze[fe],M.format!==1023)if(Me!==null)if(We){if(H)if(M.layerUpdates.size>0){const qe=ko(Se.width,Se.height,M.format,M.type);for(const ge of M.layerUpdates){const ke=Se.data.subarray(ge*qe/Se.data.BYTES_PER_ELEMENT,(ge+1)*qe/Se.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,fe,0,0,ge,Se.width,Se.height,1,Me,ke)}}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,fe,0,0,0,Se.width,Se.height,ue.depth,Me,Se.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,fe,ye,Se.width,Se.height,ue.depth,0,Se.data,0,0);else Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else We?H&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,fe,0,0,0,Se.width,Se.height,ue.depth,Me,Fe,Se.data):t.texImage3D(s.TEXTURE_2D_ARRAY,fe,ye,Se.width,Se.height,ue.depth,0,Me,Fe,Se.data);M.layerUpdates.size>0&&M.clearLayerUpdates()}else{We&&Je&&t.texStorage2D(s.TEXTURE_2D,Te,ye,ze[0].width,ze[0].height);for(let fe=0,be=ze.length;fe<be;fe++)Se=ze[fe],M.format!==1023?Me!==null?We?H&&t.compressedTexSubImage2D(s.TEXTURE_2D,fe,0,0,Se.width,Se.height,Me,Se.data):t.compressedTexImage2D(s.TEXTURE_2D,fe,ye,Se.width,Se.height,0,Se.data):Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):We?H&&t.texSubImage2D(s.TEXTURE_2D,fe,0,0,Se.width,Se.height,Me,Fe,Se.data):t.texImage2D(s.TEXTURE_2D,fe,ye,Se.width,Se.height,0,Me,Fe,Se.data)}else if(M.isDataArrayTexture)if(We){if(Je&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Te,ye,ue.width,ue.height,ue.depth),H)if(M.layerUpdates.size>0){const fe=ko(ue.width,ue.height,M.format,M.type);for(const be of M.layerUpdates){const qe=ue.data.subarray(be*fe/ue.data.BYTES_PER_ELEMENT,(be+1)*fe/ue.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,be,ue.width,ue.height,1,Me,Fe,qe)}M.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ue.width,ue.height,ue.depth,Me,Fe,ue.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,ye,ue.width,ue.height,ue.depth,0,Me,Fe,ue.data);else if(M.isData3DTexture)We?(Je&&t.texStorage3D(s.TEXTURE_3D,Te,ye,ue.width,ue.height,ue.depth),H&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ue.width,ue.height,ue.depth,Me,Fe,ue.data)):t.texImage3D(s.TEXTURE_3D,0,ye,ue.width,ue.height,ue.depth,0,Me,Fe,ue.data);else if(M.isFramebufferTexture){if(Je)if(We)t.texStorage2D(s.TEXTURE_2D,Te,ye,ue.width,ue.height);else{let fe=ue.width,be=ue.height;for(let qe=0;qe<Te;qe++)t.texImage2D(s.TEXTURE_2D,qe,ye,fe,be,0,Me,Fe,null),fe>>=1,be>>=1}}else if(M.isHTMLTexture){if("texElementImage2D"in s){const fe=s.canvas;if(fe.hasAttribute("layoutsubtree")||fe.setAttribute("layoutsubtree","true"),ue.parentNode!==fe){fe.appendChild(ue),u.add(M),fe.onpaint=be=>{const qe=be.changedElements;for(const ge of u)qe.includes(ge.image)&&(ge.needsUpdate=!0)},fe.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,ue);else{const qe=s.RGBA,ge=s.RGBA,ke=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,qe,ge,ke,ue)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(ze.length>0){if(We&&Je){const fe=Ne(ze[0]);t.texStorage2D(s.TEXTURE_2D,Te,ye,fe.width,fe.height)}for(let fe=0,be=ze.length;fe<be;fe++)Se=ze[fe],We?H&&t.texSubImage2D(s.TEXTURE_2D,fe,0,0,Me,Fe,Se):t.texImage2D(s.TEXTURE_2D,fe,ye,Me,Fe,Se);M.generateMipmaps=!1}else if(We){if(Je){const fe=Ne(ue);t.texStorage2D(s.TEXTURE_2D,Te,ye,fe.width,fe.height)}H&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,Me,Fe,ue)}else t.texImage2D(s.TEXTURE_2D,0,ye,Me,Fe,ue);p(M)&&b(j),ve.__version=xe.version,M.onUpdate&&M.onUpdate(M)}q.__version=M.version}function P(q,M,W){if(M.image.length!==6)return;const j=$e(q,M),oe=M.source;t.bindTexture(s.TEXTURE_CUBE_MAP,q.__webglTexture,s.TEXTURE0+W);const xe=n.get(oe);if(oe.version!==xe.__version||j===!0){t.activeTexture(s.TEXTURE0+W);const ve=nt.getPrimaries(nt.workingColorSpace),ce=M.colorSpace===An?null:nt.getPrimaries(M.colorSpace),ue=M.colorSpace===An||ve===ce?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(s.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ue);const Me=M.isCompressedTexture||M.image[0].isCompressedTexture,Fe=M.image[0]&&M.image[0].isDataTexture,ye=[];for(let ge=0;ge<6;ge++)!Me&&!Fe?ye[ge]=m(M.image[ge],!0,i.maxCubemapSize):ye[ge]=Fe?M.image[ge].image:M.image[ge],ye[ge]=Ae(M,ye[ge]);const Se=ye[0],ze=r.convert(M.format,M.colorSpace),We=r.convert(M.type),Je=_(M.internalFormat,ze,We,M.normalized,M.colorSpace),H=M.isVideoTexture!==!0,Te=xe.__version===void 0||j===!0,fe=oe.dataReady;let be=E(M,Se);Ye(s.TEXTURE_CUBE_MAP,M);let qe;if(Me){H&&Te&&t.texStorage2D(s.TEXTURE_CUBE_MAP,be,Je,Se.width,Se.height);for(let ge=0;ge<6;ge++){qe=ye[ge].mipmaps;for(let ke=0;ke<qe.length;ke++){const Oe=qe[ke];M.format!==1023?ze!==null?H?fe&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,ke,0,0,Oe.width,Oe.height,ze,Oe.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,ke,Je,Oe.width,Oe.height,0,Oe.data):Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):H?fe&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,ke,0,0,Oe.width,Oe.height,ze,We,Oe.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,ke,Je,Oe.width,Oe.height,0,ze,We,Oe.data)}}}else{if(qe=M.mipmaps,H&&Te){qe.length>0&&be++;const ge=Ne(ye[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,be,Je,ge.width,ge.height)}for(let ge=0;ge<6;ge++)if(Fe){H?fe&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,0,0,ye[ge].width,ye[ge].height,ze,We,ye[ge].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,Je,ye[ge].width,ye[ge].height,0,ze,We,ye[ge].data);for(let ke=0;ke<qe.length;ke++){const pt=qe[ke].image[ge].image;H?fe&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,ke+1,0,0,pt.width,pt.height,ze,We,pt.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,ke+1,Je,pt.width,pt.height,0,ze,We,pt.data)}}else{H?fe&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,0,0,ze,We,ye[ge]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,Je,ze,We,ye[ge]);for(let ke=0;ke<qe.length;ke++){const Oe=qe[ke];H?fe&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,ke+1,0,0,ze,We,Oe.image[ge]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,ke+1,Je,ze,We,Oe.image[ge])}}}p(M)&&b(s.TEXTURE_CUBE_MAP),xe.__version=oe.version,M.onUpdate&&M.onUpdate(M)}q.__version=M.version}function B(q,M,W,j,oe,xe){const ve=r.convert(W.format,W.colorSpace),ce=r.convert(W.type),ue=_(W.internalFormat,ve,ce,W.normalized,W.colorSpace),Me=n.get(M),Fe=n.get(W);if(Fe.__renderTarget=M,!Me.__hasExternalTextures){const ye=Math.max(1,M.width>>xe),Se=Math.max(1,M.height>>xe);oe===s.TEXTURE_3D||oe===s.TEXTURE_2D_ARRAY?t.texImage3D(oe,xe,ue,ye,Se,M.depth,0,ve,ce,null):t.texImage2D(oe,xe,ue,ye,Se,0,ve,ce,null)}t.bindFramebuffer(s.FRAMEBUFFER,q),X(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,j,oe,Fe.__webglTexture,0,pe(M)):(oe===s.TEXTURE_2D||oe>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&oe<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,j,oe,Fe.__webglTexture,xe),t.bindFramebuffer(s.FRAMEBUFFER,null)}function ne(q,M,W){if(s.bindRenderbuffer(s.RENDERBUFFER,q),M.depthBuffer){const j=M.depthTexture,oe=j&&j.isDepthTexture?j.type:null,xe=T(M.stencilBuffer,oe),ve=M.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;X(M)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,pe(M),xe,M.width,M.height):W?s.renderbufferStorageMultisample(s.RENDERBUFFER,pe(M),xe,M.width,M.height):s.renderbufferStorage(s.RENDERBUFFER,xe,M.width,M.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,ve,s.RENDERBUFFER,q)}else{const j=M.textures;for(let oe=0;oe<j.length;oe++){const xe=j[oe],ve=r.convert(xe.format,xe.colorSpace),ce=r.convert(xe.type),ue=_(xe.internalFormat,ve,ce,xe.normalized,xe.colorSpace);X(M)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,pe(M),ue,M.width,M.height):W?s.renderbufferStorageMultisample(s.RENDERBUFFER,pe(M),ue,M.width,M.height):s.renderbufferStorage(s.RENDERBUFFER,ue,M.width,M.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function _e(q,M,W){const j=M.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(s.FRAMEBUFFER,q),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const oe=n.get(M.depthTexture);if(oe.__renderTarget=M,(!oe.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),j){if(oe.__webglInit===void 0&&(oe.__webglInit=!0,M.depthTexture.addEventListener("dispose",C)),oe.__webglTexture===void 0){oe.__webglTexture=s.createTexture(),t.bindTexture(s.TEXTURE_CUBE_MAP,oe.__webglTexture),Ye(s.TEXTURE_CUBE_MAP,M.depthTexture);const Me=r.convert(M.depthTexture.format),Fe=r.convert(M.depthTexture.type);let ye;M.depthTexture.format===1026?ye=s.DEPTH_COMPONENT24:M.depthTexture.format===1027&&(ye=s.DEPTH24_STENCIL8);for(let Se=0;Se<6;Se++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,0,ye,M.width,M.height,0,Me,Fe,null)}}else Z(M.depthTexture,0);const xe=oe.__webglTexture,ve=pe(M),ce=j?s.TEXTURE_CUBE_MAP_POSITIVE_X+W:s.TEXTURE_2D,ue=M.depthTexture.format===1027?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(M.depthTexture.format===1026)X(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ue,ce,xe,0,ve):s.framebufferTexture2D(s.FRAMEBUFFER,ue,ce,xe,0);else if(M.depthTexture.format===1027)X(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ue,ce,xe,0,ve):s.framebufferTexture2D(s.FRAMEBUFFER,ue,ce,xe,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function R(q){const M=n.get(q),W=q.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==q.depthTexture){const j=q.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),j){const oe=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,j.removeEventListener("dispose",oe)};j.addEventListener("dispose",oe),M.__depthDisposeCallback=oe}M.__boundDepthTexture=j}if(q.depthTexture&&!M.__autoAllocateDepthBuffer)if(W)for(let j=0;j<6;j++)_e(M.__webglFramebuffer[j],q,j);else{const j=q.texture.mipmaps;j&&j.length>0?_e(M.__webglFramebuffer[0],q,0):_e(M.__webglFramebuffer,q,0)}else if(W){M.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(t.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer[j]),M.__webglDepthbuffer[j]===void 0)M.__webglDepthbuffer[j]=s.createRenderbuffer(),ne(M.__webglDepthbuffer[j],q,!1);else{const oe=q.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,xe=M.__webglDepthbuffer[j];s.bindRenderbuffer(s.RENDERBUFFER,xe),s.framebufferRenderbuffer(s.FRAMEBUFFER,oe,s.RENDERBUFFER,xe)}}else{const j=q.texture.mipmaps;if(j&&j.length>0?t.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=s.createRenderbuffer(),ne(M.__webglDepthbuffer,q,!1);else{const oe=q.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,xe=M.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,xe),s.framebufferRenderbuffer(s.FRAMEBUFFER,oe,s.RENDERBUFFER,xe)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function k(q,M,W){const j=n.get(q);M!==void 0&&B(j.__webglFramebuffer,q,q.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),W!==void 0&&R(q)}function D(q){const M=q.texture,W=n.get(q),j=n.get(M);q.addEventListener("dispose",x);const oe=q.textures,xe=q.isWebGLCubeRenderTarget===!0,ve=oe.length>1;if(ve||(j.__webglTexture===void 0&&(j.__webglTexture=s.createTexture()),j.__version=M.version,a.memory.textures++),xe){W.__webglFramebuffer=[];for(let ce=0;ce<6;ce++)if(M.mipmaps&&M.mipmaps.length>0){W.__webglFramebuffer[ce]=[];for(let ue=0;ue<M.mipmaps.length;ue++)W.__webglFramebuffer[ce][ue]=s.createFramebuffer()}else W.__webglFramebuffer[ce]=s.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){W.__webglFramebuffer=[];for(let ce=0;ce<M.mipmaps.length;ce++)W.__webglFramebuffer[ce]=s.createFramebuffer()}else W.__webglFramebuffer=s.createFramebuffer();if(ve)for(let ce=0,ue=oe.length;ce<ue;ce++){const Me=n.get(oe[ce]);Me.__webglTexture===void 0&&(Me.__webglTexture=s.createTexture(),a.memory.textures++)}if(q.samples>0&&X(q)===!1){W.__webglMultisampledFramebuffer=s.createFramebuffer(),W.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let ce=0;ce<oe.length;ce++){const ue=oe[ce];W.__webglColorRenderbuffer[ce]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,W.__webglColorRenderbuffer[ce]);const Me=r.convert(ue.format,ue.colorSpace),Fe=r.convert(ue.type),ye=_(ue.internalFormat,Me,Fe,ue.normalized,ue.colorSpace,q.isXRRenderTarget===!0),Se=pe(q);s.renderbufferStorageMultisample(s.RENDERBUFFER,Se,ye,q.width,q.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ce,s.RENDERBUFFER,W.__webglColorRenderbuffer[ce])}s.bindRenderbuffer(s.RENDERBUFFER,null),q.depthBuffer&&(W.__webglDepthRenderbuffer=s.createRenderbuffer(),ne(W.__webglDepthRenderbuffer,q,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(xe){t.bindTexture(s.TEXTURE_CUBE_MAP,j.__webglTexture),Ye(s.TEXTURE_CUBE_MAP,M);for(let ce=0;ce<6;ce++)if(M.mipmaps&&M.mipmaps.length>0)for(let ue=0;ue<M.mipmaps.length;ue++)B(W.__webglFramebuffer[ce][ue],q,M,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ce,ue);else B(W.__webglFramebuffer[ce],q,M,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0);p(M)&&b(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ve){for(let ce=0,ue=oe.length;ce<ue;ce++){const Me=oe[ce],Fe=n.get(Me);let ye=s.TEXTURE_2D;(q.isWebGL3DRenderTarget||q.isWebGLArrayRenderTarget)&&(ye=q.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ye,Fe.__webglTexture),Ye(ye,Me),B(W.__webglFramebuffer,q,Me,s.COLOR_ATTACHMENT0+ce,ye,0),p(Me)&&b(ye)}t.unbindTexture()}else{let ce=s.TEXTURE_2D;if((q.isWebGL3DRenderTarget||q.isWebGLArrayRenderTarget)&&(ce=q.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ce,j.__webglTexture),Ye(ce,M),M.mipmaps&&M.mipmaps.length>0)for(let ue=0;ue<M.mipmaps.length;ue++)B(W.__webglFramebuffer[ue],q,M,s.COLOR_ATTACHMENT0,ce,ue);else B(W.__webglFramebuffer,q,M,s.COLOR_ATTACHMENT0,ce,0);p(M)&&b(ce),t.unbindTexture()}q.depthBuffer&&R(q)}function K(q){const M=q.textures;for(let W=0,j=M.length;W<j;W++){const oe=M[W];if(p(oe)){const xe=A(q),ve=n.get(oe).__webglTexture;t.bindTexture(xe,ve),b(xe),t.unbindTexture()}}}const Q=[],le=[];function me(q){if(q.samples>0){if(X(q)===!1){const M=q.textures,W=q.width,j=q.height;let oe=s.COLOR_BUFFER_BIT;const xe=q.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ve=n.get(q),ce=M.length>1;if(ce)for(let Me=0;Me<M.length;Me++)t.bindFramebuffer(s.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,ve.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,ve.__webglMultisampledFramebuffer);const ue=q.texture.mipmaps;ue&&ue.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ve.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ve.__webglFramebuffer);for(let Me=0;Me<M.length;Me++){if(q.resolveDepthBuffer&&(q.depthBuffer&&(oe|=s.DEPTH_BUFFER_BIT),q.stencilBuffer&&q.resolveStencilBuffer&&(oe|=s.STENCIL_BUFFER_BIT)),ce){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ve.__webglColorRenderbuffer[Me]);const Fe=n.get(M[Me]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Fe,0)}s.blitFramebuffer(0,0,W,j,0,0,W,j,oe,s.NEAREST),l===!0&&(Q.length=0,le.length=0,Q.push(s.COLOR_ATTACHMENT0+Me),q.depthBuffer&&q.storeMultisampledDepthBuffer===!1&&(Q.push(xe),le.push(xe),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,le)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Q))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ce)for(let Me=0;Me<M.length;Me++){t.bindFramebuffer(s.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.RENDERBUFFER,ve.__webglColorRenderbuffer[Me]);const Fe=n.get(M[Me]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,ve.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.TEXTURE_2D,Fe,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ve.__webglMultisampledFramebuffer)}else if(q.depthBuffer&&q.storeMultisampledDepthBuffer===!1&&l){const M=q.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[M])}}}function pe(q){return Math.min(i.maxSamples,q.samples)}function X(q){const M=n.get(q);return q.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function S(q){const M=a.render.frame;h.get(q)!==M&&(h.set(q,M),q.update())}function Ae(q,M){const W=q.colorSpace,j=q.format,oe=q.type;return q.isCompressedTexture===!0||q.isVideoTexture===!0||W!==Ot&&W!==An&&(nt.getTransfer(W)===lt?(j!==1023||oe!==1009)&&Be("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Xe("WebGLTextures: Unsupported texture color space:",W)),M}function Ne(q){return typeof HTMLImageElement!="undefined"&&q instanceof HTMLImageElement?(c.width=q.naturalWidth||q.width,c.height=q.naturalHeight||q.height):typeof VideoFrame!="undefined"&&q instanceof VideoFrame?(c.width=q.displayWidth,c.height=q.displayHeight):(c.width=q.width,c.height=q.height),c}this.allocateTextureUnit=ie,this.resetTextureUnits=Y,this.getTextureUnits=O,this.setTextureUnits=J,this.setTexture2D=Z,this.setTexture2DArray=se,this.setTexture3D=ae,this.setTextureCube=he,this.rebindTextures=k,this.setupRenderTarget=D,this.updateRenderTargetMipmap=K,this.updateMultisampleRenderTarget=me,this.setupDepthRenderbuffer=R,this.setupFrameBufferTexture=B,this.useMultisampledRTT=X,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function gp(s,e){function t(n,i=An){let r;const a=nt.getTransfer(i);if(n===1009)return s.UNSIGNED_BYTE;if(n===1017)return s.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return s.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return s.BYTE;if(n===1011)return s.SHORT;if(n===1012)return s.UNSIGNED_SHORT;if(n===1013)return s.INT;if(n===1014)return s.UNSIGNED_INT;if(n===1015)return s.FLOAT;if(n===1016)return s.HALF_FLOAT;if(n===1021)return s.ALPHA;if(n===1022)return s.RGB;if(n===1023)return s.RGBA;if(n===1026)return s.DEPTH_COMPONENT;if(n===1027)return s.DEPTH_STENCIL;if(n===1028)return s.RED;if(n===1029)return s.RED_INTEGER;if(n===1030)return s.RG;if(n===1031)return s.RG_INTEGER;if(n===1033)return s.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779)if(a===lt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===33776)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===33776)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===35840||n===35841||n===35842||n===35843)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===35840)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===36196||n===37492)return a===lt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===37496)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return r.COMPRESSED_R11_EAC;if(n===37489)return r.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return r.COMPRESSED_RG11_EAC;if(n===37491)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===37808)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===36492||n===36494||n===36495)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===36492)return a===lt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===36283||n===36284||n===36285||n===36286)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===36283)return r.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===1020?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}const _p=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,xp=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class vp{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new co(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new on({vertexShader:_p,fragmentShader:xp,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new xt(new Ns(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Mp extends zn{constructor(e,t){super();const n=this;let i=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,f=null,d=null,g=null;const v=typeof XRWebGLBinding!="undefined",m=new vp,p={},b=t.getContextAttributes();let A=null,_=null;const T=[],E=[],C=new de;let x=null,w=null;const I=new Dt;I.viewport=new ut;const z=new Dt;z.viewport=new ut;const G=[I,z],Y=new Qh;let O=null,J=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(U){let N=T[U];return N===void 0&&(N=new rr,T[U]=N),N.getTargetRaySpace()},this.getControllerGrip=function(U){let N=T[U];return N===void 0&&(N=new rr,T[U]=N),N.getGripSpace()},this.getHand=function(U){let N=T[U];return N===void 0&&(N=new rr,T[U]=N),N.getHandSpace()};function ie(U){const N=E.indexOf(U.inputSource);if(N===-1)return;const L=T[N];L!==void 0&&(L.update(U.inputSource,U.frame,c||a),L.dispatchEvent({type:U.type,data:U.inputSource}))}function $(){i.removeEventListener("select",ie),i.removeEventListener("selectstart",ie),i.removeEventListener("selectend",ie),i.removeEventListener("squeeze",ie),i.removeEventListener("squeezestart",ie),i.removeEventListener("squeezeend",ie),i.removeEventListener("end",$),i.removeEventListener("inputsourceschange",Z);for(let U=0;U<T.length;U++){const N=E[U];N!==null&&(E[U]=null,T[U].disconnect(N))}O=null,J=null,m.reset();for(const U in p)delete p[U];if(e.setRenderTarget(A),d=null,f=null,u=null,i=null,_=null,$e.stop(),n.isPresenting=!1,e.setPixelRatio(x),e.setSize(C.width,C.height,!1),w!==null){const U=w.camera;U.fov=w.fov,U.zoom=w.zoom,U.updateProjectionMatrix(),w=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(U){r=U,n.isPresenting===!0&&Be("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(U){o=U,n.isPresenting===!0&&Be("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(U){c=U},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(i,t)),u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(U){if(i=U,i!==null){if(A=e.getRenderTarget(),i.addEventListener("select",ie),i.addEventListener("selectstart",ie),i.addEventListener("selectend",ie),i.addEventListener("squeeze",ie),i.addEventListener("squeezestart",ie),i.addEventListener("squeezeend",ie),i.addEventListener("end",$),i.addEventListener("inputsourceschange",Z),b.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(C),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let L=null,P=null,B=null;b.depth&&(B=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,L=b.stencil?1027:1026,P=b.stencil?1020:1014);const ne={colorFormat:t.RGBA8,depthFormat:B,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(ne),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),_=new Kt(f.textureWidth,f.textureHeight,{format:1023,type:1009,depthTexture:new Bi(f.textureWidth,f.textureHeight,P,void 0,void 0,void 0,void 0,void 0,void 0,L),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}else{const L={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(i,t,L),i.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),_=new Kt(d.framebufferWidth,d.framebufferHeight,{format:1023,type:1009,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),$e.setContext(i),$e.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Z(U){for(let N=0;N<U.removed.length;N++){const L=U.removed[N],P=E.indexOf(L);P>=0&&(E[P]=null,T[P].disconnect(L))}for(let N=0;N<U.added.length;N++){const L=U.added[N];let P=E.indexOf(L);if(P===-1){for(let ne=0;ne<T.length;ne++)if(ne>=E.length){E.push(L),P=ne;break}else if(E[ne]===null){E[ne]=L,P=ne;break}if(P===-1)break}const B=T[P];B&&B.connect(L)}}const se=new F,ae=new F;function he(U,N,L){se.setFromMatrixPosition(N.matrixWorld),ae.setFromMatrixPosition(L.matrixWorld);const P=se.distanceTo(ae),B=N.projectionMatrix.elements,ne=L.projectionMatrix.elements,_e=B[14]/(B[10]-1),R=B[14]/(B[10]+1),k=(B[9]+1)/B[5],D=(B[9]-1)/B[5],K=(B[8]-1)/B[0],Q=(ne[8]+1)/ne[0],le=_e*K,me=_e*Q,pe=P/(-K+Q),X=pe*-K;if(N.matrixWorld.decompose(U.position,U.quaternion,U.scale),U.translateX(X),U.translateZ(pe),U.matrixWorld.compose(U.position,U.quaternion,U.scale),U.matrixWorldInverse.copy(U.matrixWorld).invert(),B[10]===-1)U.projectionMatrix.copy(N.projectionMatrix),U.projectionMatrixInverse.copy(N.projectionMatrixInverse);else{const S=_e+pe,Ae=R+pe,Ne=le-X,q=me+(P-X),M=k*R/Ae*S,W=D*R/Ae*S;U.projectionMatrix.makePerspective(Ne,q,M,W,S,Ae),U.projectionMatrixInverse.copy(U.projectionMatrix).invert()}}function Le(U,N){N===null?U.matrixWorld.copy(U.matrix):U.matrixWorld.multiplyMatrices(N.matrixWorld,U.matrix),U.matrixWorldInverse.copy(U.matrixWorld).invert()}this.updateCamera=function(U){if(i===null)return;let N=U.near,L=U.far;m.texture!==null&&(m.depthNear>0&&(N=m.depthNear),m.depthFar>0&&(L=m.depthFar)),Y.near=z.near=I.near=N,Y.far=z.far=I.far=L,(O!==Y.near||J!==Y.far)&&(i.updateRenderState({depthNear:Y.near,depthFar:Y.far}),O=Y.near,J=Y.far),Y.layers.mask=U.layers.mask|6,I.layers.mask=Y.layers.mask&-5,z.layers.mask=Y.layers.mask&-3;const P=U.parent,B=Y.cameras;Le(Y,P);for(let ne=0;ne<B.length;ne++)Le(B[ne],P);B.length===2?he(Y,I,z):Y.projectionMatrix.copy(I.projectionMatrix),w===null&&U.isPerspectiveCamera&&(w={camera:U,fov:U.fov,zoom:U.zoom}),Ce(U,Y,P)};function Ce(U,N,L){L===null?U.matrix.copy(N.matrixWorld):(U.matrix.copy(L.matrixWorld),U.matrix.invert(),U.matrix.multiply(N.matrixWorld)),U.matrix.decompose(U.position,U.quaternion,U.scale),U.updateMatrixWorld(!0),U.projectionMatrix.copy(N.projectionMatrix),U.projectionMatrixInverse.copy(N.projectionMatrixInverse),U.isPerspectiveCamera&&(U.fov=jn*2*Math.atan(1/U.projectionMatrix.elements[5]),U.zoom=1)}this.getCamera=function(){return Y},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function(U){l=U,f!==null&&(f.fixedFoveation=U),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=U)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(Y)},this.getCameraTexture=function(U){return p[U]};let Ke=null;function Ye(U,N){if(h=N.getViewerPose(c||a),g=N,h!==null){const L=h.views;d!==null&&(e.setRenderTargetFramebuffer(_,d.framebuffer),e.setRenderTarget(_));let P=!1;L.length!==Y.cameras.length&&(Y.cameras.length=0,P=!0);for(let R=0;R<L.length;R++){const k=L[R];let D=null;if(d!==null)D=d.getViewport(k);else{const Q=u.getViewSubImage(f,k);D=Q.viewport,R===0&&(e.setRenderTargetTextures(_,Q.colorTexture,Q.depthStencilTexture),e.setRenderTarget(_))}let K=G[R];K===void 0&&(K=new Dt,K.layers.enable(R),K.viewport=new ut,G[R]=K),K.matrix.fromArray(k.transform.matrix),K.matrix.decompose(K.position,K.quaternion,K.scale),K.projectionMatrix.fromArray(k.projectionMatrix),K.projectionMatrixInverse.copy(K.projectionMatrix).invert(),K.viewport.set(D.x,D.y,D.width,D.height),R===0&&(Y.matrix.copy(K.matrix),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale)),P===!0&&Y.cameras.push(K)}const B=i.enabledFeatures;if(B&&B.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&v){u=n.getBinding();const R=u.getDepthInformation(L[0]);R&&R.isValid&&R.texture&&m.init(R,i.renderState)}if(B&&B.includes("camera-access")&&v){e.state.unbindTexture(),u=n.getBinding();for(let R=0;R<L.length;R++){const k=L[R].camera;if(k){let D=p[k];D||(D=new co,p[k]=D);const K=u.getCameraImage(k);D.sourceTexture=K}}}}for(let L=0;L<T.length;L++){const P=E[L],B=T[L];P!==null&&B!==void 0&&B.update(P,N,c||a)}Ke&&Ke(U,N),N.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:N}),g=null}const $e=new Vo;$e.setAnimationLoop(Ye),this.setAnimationLoop=function(U){Ke=U},this.dispose=function(){}}}const Sp=new Ze,_l=new Ve;_l.set(-1,0,0,0,1,0,0,0,1);function yp(s,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,wo(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,b,A,_){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(m,p):p.isMeshLambertMaterial?(r(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,_)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),v(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,b,A):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===1&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===1&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const b=e.get(p),A=b.envMap,_=b.envMapRotation;A&&(m.envMap.value=A,m.envMapRotation.value.setFromMatrix4(Sp.makeRotationFromEuler(_)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(_l),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,b,A){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*b,m.scale.value=A*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,b){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===1&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.retroreflectivity>0&&(m.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const b=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Tp(s,e,t,n){let i={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,T){const E=T.program;n.uniformBlockBinding(_,E)}function c(_,T){let E=i[_.id];E===void 0&&(m(_),E=h(_),i[_.id]=E,_.addEventListener("dispose",b));const C=T.program;n.updateUBOMapping(_,C);const x=e.render.frame;r[_.id]!==x&&(f(_),r[_.id]=x)}function h(_){const T=u();_.__bindingPointIndex=T;const E=s.createBuffer(),C=_.__size,x=_.usage;return s.bindBuffer(s.UNIFORM_BUFFER,E),s.bufferData(s.UNIFORM_BUFFER,C,x),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,T,E),E}function u(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return Xe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(_){const T=i[_.id],E=_.uniforms,C=_.__cache;s.bindBuffer(s.UNIFORM_BUFFER,T);for(let x=0,w=E.length;x<w;x++){const I=E[x];if(Array.isArray(I))for(let z=0,G=I.length;z<G;z++)d(I[z],x,z,C);else d(I,x,0,C)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function d(_,T,E,C){if(v(_,T,E,C)===!0){const x=_.__offset,w=_.value;if(Array.isArray(w)){let I=0;for(let z=0;z<w.length;z++){const G=w[z],Y=p(G);g(G,_.__data,I),typeof G!="number"&&typeof G!="boolean"&&!G.isMatrix3&&!ArrayBuffer.isView(G)&&(I+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(w,_.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,x,_.__data)}}function g(_,T,E){typeof _=="number"||typeof _=="boolean"?T[0]=_:_.isMatrix3?(T[0]=_.elements[0],T[1]=_.elements[1],T[2]=_.elements[2],T[3]=0,T[4]=_.elements[3],T[5]=_.elements[4],T[6]=_.elements[5],T[7]=0,T[8]=_.elements[6],T[9]=_.elements[7],T[10]=_.elements[8],T[11]=0):ArrayBuffer.isView(_)?T.set(new _.constructor(_.buffer,_.byteOffset,T.length)):_.toArray(T,E)}function v(_,T,E,C){const x=_.value,w=T+"_"+E;if(C[w]===void 0)return typeof x=="number"||typeof x=="boolean"?C[w]=x:ArrayBuffer.isView(x)?C[w]=x.slice():C[w]=x.clone(),!0;{const I=C[w];if(typeof x=="number"||typeof x=="boolean"){if(I!==x)return C[w]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(I.equals(x)===!1)return I.copy(x),!0}}return!1}function m(_){const T=_.uniforms;let E=0;const C=16;for(let w=0,I=T.length;w<I;w++){const z=Array.isArray(T[w])?T[w]:[T[w]];for(let G=0,Y=z.length;G<Y;G++){const O=z[G],J=Array.isArray(O.value)?O.value:[O.value];for(let ie=0,$=J.length;ie<$;ie++){const Z=J[ie],se=p(Z),ae=E%C,he=ae%se.boundary,Le=ae+he;E+=he,Le!==0&&C-Le<se.storage&&(E+=C-Le),O.__data=new Float32Array(se.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=E,E+=se.storage}}}const x=E%C;return x>0&&(E+=C-x),_.__size=E,_.__cache={},this}function p(_){const T={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(T.boundary=4,T.storage=4):_.isVector2?(T.boundary=8,T.storage=8):_.isVector3||_.isColor?(T.boundary=16,T.storage=12):_.isVector4?(T.boundary=16,T.storage=16):_.isMatrix3?(T.boundary=48,T.storage=48):_.isMatrix4?(T.boundary=64,T.storage=64):_.isTexture?Be("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(_)?(T.boundary=16,T.storage=_.byteLength):Be("WebGLRenderer: Unsupported uniform value type.",_),T}function b(_){const T=_.target;T.removeEventListener("dispose",b);const E=a.indexOf(T.__bindingPointIndex);a.splice(E,1),s.deleteBuffer(i[T.id]),delete i[T.id],delete r[T.id]}function A(){for(const _ in i)s.deleteBuffer(i[_]);a=[],i={},r={}}return{bind:l,update:c,dispose:A}}const bp=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let hn=null;function Ep(){return hn===null&&(hn=new Tr(bp,16,16,1030,1016),hn.name="DFG_LUT",hn.minFilter=1006,hn.magFilter=1006,hn.wrapS=1001,hn.wrapT=1001,hn.generateMipmaps=!1,hn.needsUpdate=!0),hn}class Ap{constructor(e={}){const{canvas:t=Hl(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1,outputBufferType:d=1009}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext!="undefined"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const v=d,m=new Set([1033,1031,1029]),p=new Set([1009,1014,1012,1020,1017,1018]),b=new Uint32Array(4),A=new Int32Array(4),_=new F;let T=null,E=null;const C=[],x=[];let w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const I=this;let z=!1,G=null,Y=null,O=null,J=null;this._outputColorSpace=Et;let ie=0,$=0,Z=null,se=-1,ae=null;const he=new ut,Le=new ut;let Ce=null;const Ke=new He(0);let Ye=0,$e=t.width,U=t.height,N=1,L=null,P=null;const B=new ut(0,0,$e,U),ne=new ut(0,0,$e,U);let _e=!1;const R=new Er;let k=!1,D=!1;const K=new Ze,Q=new F,le=new ut,me={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let pe=!1;function X(){return Z===null?N:1}let S=n;function Ae(y,V){return t.getContext(y,V)}let Ne,q,M,W,j,oe,xe,ve,ce,ue,Me,Fe,ye,Se,ze,We,Je,H,Te,fe,be,qe,ge;try{const y={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${$s}`),t.addEventListener("webglcontextlost",pt,!1),t.addEventListener("webglcontextrestored",at,!1),t.addEventListener("webglcontextcreationerror",sn,!1),S===null){const V="webgl2";if(S=Ae(V,y),S===null)throw Ae(V)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}ke()}catch(y){throw t.removeEventListener("webglcontextlost",pt,!1),t.removeEventListener("webglcontextrestored",at,!1),t.removeEventListener("webglcontextcreationerror",sn,!1),Xe("WebGLRenderer: "+y.message),y}function ke(){Ne=new Ed(S),Ne.init(),be=new gp(S,Ne),q=new md(S,Ne,e,be),M=new pp(S,Ne),q.reversedDepthBuffer&&f&&M.buffers.depth.setReversed(!0),Y=S.createFramebuffer(),O=S.createFramebuffer(),J=S.createFramebuffer(),W=new Rd(S),j=new ep,oe=new mp(S,Ne,M,j,q,be,W),xe=new bd(I),ve=new cu(S),qe=new dd(S,ve),ce=new Ad(S,ve,W,qe),ue=new qd(S,ce,ve,qe,W),H=new Cd(S,q,oe),ze=new gd(j),Me=new j1(I,xe,Ne,q,qe,ze),Fe=new yp(I,j),ye=new np,Se=new lp(Ne),Je=new fd(I,xe,M,ue,g,l),We=new dp(I,ue,q),ge=new Tp(S,W,q,M),Te=new pd(S,Ne,W),fe=new wd(S,Ne,W),W.programs=Me.programs,I.capabilities=q,I.extensions=Ne,I.properties=j,I.renderLists=ye,I.shadowMap=We,I.state=M,I.info=W}v!==1009&&(w=new Ld(v,t.width,t.height,o,i,r));const Oe=new Mp(I,S);this.xr=Oe,this.getContext=function(){return S},this.getContextAttributes=function(){return S.getContextAttributes()},this.forceContextLoss=function(){const y=Ne.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=Ne.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return N},this.setPixelRatio=function(y){y!==void 0&&(N=y,this.setSize($e,U,!1))},this.getSize=function(y){return y.set($e,U)},this.setSize=function(y,V,re=!0){if(Oe.isPresenting){Be("WebGLRenderer: Can't change size while VR device is presenting.");return}$e=y,U=V,t.width=Math.floor(y*N),t.height=Math.floor(V*N),re===!0&&(t.style.width=y+"px",t.style.height=V+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,y,V)},this.getDrawingBufferSize=function(y){return y.set($e*N,U*N).floor()},this.setDrawingBufferSize=function(y,V,re){$e=y,U=V,N=re,t.width=Math.floor(y*re),t.height=Math.floor(V*re),this.setViewport(0,0,y,V)},this.setEffects=function(y){if(v===1009){Xe("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let V=0;V<y.length;V++)if(y[V].isOutputPass===!0){Be("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(he)},this.getViewport=function(y){return y.copy(B)},this.setViewport=function(y,V,re,ee){y.isVector4?B.set(y.x,y.y,y.z,y.w):B.set(y,V,re,ee),M.viewport(he.copy(B).multiplyScalar(N).round())},this.getScissor=function(y){return y.copy(ne)},this.setScissor=function(y,V,re,ee){y.isVector4?ne.set(y.x,y.y,y.z,y.w):ne.set(y,V,re,ee),M.scissor(Le.copy(ne).multiplyScalar(N).round())},this.getScissorTest=function(){return _e},this.setScissorTest=function(y){M.setScissorTest(_e=y)},this.setOpaqueSort=function(y){L=y},this.setTransparentSort=function(y){P=y},this.getClearColor=function(y){return y.copy(Je.getClearColor())},this.setClearColor=function(){Je.setClearColor(...arguments)},this.getClearAlpha=function(){return Je.getClearAlpha()},this.setClearAlpha=function(){Je.setClearAlpha(...arguments)},this.clear=function(y=!0,V=!0,re=!0){let ee=0;if(y){let te=!1;if(Z!==null){const Re=Z.texture.format;te=m.has(Re)}if(te){const Re=Z.texture.type,Ie=p.has(Re),we=Je.getClearColor(),De=Je.getClearAlpha(),Ge=we.r,je=we.g,it=we.b;Ie?(b[0]=Ge,b[1]=je,b[2]=it,b[3]=De,S.clearBufferuiv(S.COLOR,0,b)):(A[0]=Ge,A[1]=je,A[2]=it,A[3]=De,S.clearBufferiv(S.COLOR,0,A))}else ee|=S.COLOR_BUFFER_BIT}V&&(ee|=S.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),re&&(ee|=S.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),ee!==0&&S.clear(ee)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(y){y.setRenderer(this),G=y},this.dispose=function(){t.removeEventListener("webglcontextlost",pt,!1),t.removeEventListener("webglcontextrestored",at,!1),t.removeEventListener("webglcontextcreationerror",sn,!1),Je.dispose(),ye.dispose(),Se.dispose(),j.dispose(),xe.dispose(),ue.dispose(),qe.dispose(),ge.dispose(),Me.dispose(),Oe.dispose(),Oe.removeEventListener("sessionstart",Ll),Oe.removeEventListener("sessionend",Il),$n.stop()};function pt(y){y.preventDefault(),is("WebGLRenderer: Context Lost."),z=!0}function at(){is("WebGLRenderer: Context Restored."),z=!1;const y=W.autoReset,V=We.enabled,re=We.autoUpdate,ee=We.needsUpdate,te=We.type;ke(),W.autoReset=y,We.enabled=V,We.autoUpdate=re,We.needsUpdate=ee,We.type=te}function sn(y){Xe("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function fn(y){const V=y.target;V.removeEventListener("dispose",fn),M0(V)}function M0(y){S0(y),j.remove(y)}function S0(y){const V=j.get(y).programs;V!==void 0&&(V.forEach(function(re){Me.releaseProgram(re)}),y.isShaderMaterial&&Me.releaseShaderCache(y))}this.renderBufferDirect=function(y,V,re,ee,te,Re){V===null&&(V=me);const Ie=te.isMesh&&te.matrixWorld.determinantAffine()<0,we=b0(y,V,re,ee,te);M.setMaterial(ee,Ie);let De=re.index,Ge=1;if(ee.wireframe===!0){if(De=ce.getWireframeAttribute(re),De===void 0)return;Ge=2}const je=re.drawRange,it=re.attributes.position;let Ue=je.start*Ge,ot=(je.start+je.count)*Ge;Re!==null&&(Ue=Math.max(Ue,Re.start*Ge),ot=Math.min(ot,(Re.start+Re.count)*Ge)),De!==null?(Ue=Math.max(Ue,0),ot=Math.min(ot,De.count)):it!=null&&(Ue=Math.max(Ue,0),ot=Math.min(ot,it.count));const bt=ot-Ue;if(bt<0||bt===1/0)return;qe.setup(te,ee,we,re,De);let _t,dt=Te;if(De!==null&&(_t=ve.get(De),dt=fe,dt.setIndex(_t)),te.isMesh)ee.wireframe===!0?(M.setLineWidth(ee.wireframeLinewidth*X()),dt.setMode(S.LINES)):dt.setMode(S.TRIANGLES);else if(te.isLine){let Lt=ee.linewidth;Lt===void 0&&(Lt=1),M.setLineWidth(Lt*X()),te.isLineSegments?dt.setMode(S.LINES):te.isLineLoop?dt.setMode(S.LINE_LOOP):dt.setMode(S.LINE_STRIP)}else te.isPoints?dt.setMode(S.POINTS):te.isSprite&&dt.setMode(S.TRIANGLES);if(te.isBatchedMesh)if(Ne.get("WEBGL_multi_draw"))dt.renderMultiDraw(te._multiDrawStarts,te._multiDrawCounts,te._multiDrawCount);else{const Lt=te._multiDrawStarts,Pe=te._multiDrawCounts,Ut=te._multiDrawCount,st=De?ve.get(De).bytesPerElement:1,Xt=j.get(ee).currentProgram.getUniforms();for(let dn=0;dn<Ut;dn++)Xt.setValue(S,"_gl_DrawID",dn),dt.render(Lt[dn]/st,Pe[dn])}else if(te.isInstancedMesh)dt.renderInstances(Ue,bt,te.count);else if(re.isInstancedBufferGeometry){const Lt=re._maxInstanceCount!==void 0?re._maxInstanceCount:1/0,Pe=Math.min(re.instanceCount,Lt);dt.renderInstances(Ue,bt,Pe)}else dt.render(Ue,bt)};function Pl(y,V,re,ee){G!==null&&y.isNodeMaterial&&G.setObject(ee,y),k===!0&&ze.setState(y,re,!1),y.transparent===!0&&y.side===2&&y.forceSinglePass===!1?(y.side=1,y.needsUpdate=!0,Zs(y,V,ee),y.side=0,y.needsUpdate=!0,Zs(y,V,ee),y.side=2):Zs(y,V,ee)}this.compile=function(y,V,re=null){re===null&&(re=y),G!==null&&G.renderStart(y,V,re),E=Se.get(re),E.init(V),x.push(E),re.traverseVisible(function(te){te.isLight&&te.layers.test(V.layers)&&(E.pushLight(te),te.castShadow&&E.pushShadow(te))}),y!==re&&y.traverseVisible(function(te){te.isLight&&te.layers.test(V.layers)&&(E.pushLight(te),te.castShadow&&E.pushShadow(te))}),E.setupLights(),G!==null&&G.updateLights(E.state.lightsArray),D=this.localClippingEnabled,k=ze.init(this.clippingPlanes,D),k===!0&&ze.setGlobalState(this.clippingPlanes,V),G!==null&&We.render(E.state.shadowsArray,re,V);const ee=new Set;return y.traverse(function(te){if(!(te.isMesh||te.isPoints||te.isLine||te.isSprite))return;const Re=te.material;if(Re)if(Array.isArray(Re))for(let Ie=0;Ie<Re.length;Ie++){const we=Re[Ie];Pl(we,re,V,te),ee.add(we)}else Pl(Re,re,V,te),ee.add(Re)}),E=x.pop(),G!==null&&G.renderEnd(),ee},this.compileAsync=function(y,V,re=null){const ee=this.compile(y,V,re);return new Promise(te=>{function Re(){if(ee.forEach(function(Ie){const De=j.get(Ie).currentProgram;(De===void 0||De.isReady())&&ee.delete(Ie)}),ee.size===0){te(y);return}setTimeout(Re,10)}Ne.get("KHR_parallel_shader_compile")!==null?Re():setTimeout(Re,10)})};let xa=null;function y0(y){xa&&xa(y)}function Ll(){$n.stop()}function Il(){$n.start()}const $n=new Vo;$n.setAnimationLoop(y0),typeof self!="undefined"&&$n.setContext(self),this.setAnimationLoop=function(y){xa=y,Oe.setAnimationLoop(y),y===null?$n.stop():$n.start()},Oe.addEventListener("sessionstart",Ll),Oe.addEventListener("sessionend",Il),this.render=function(y,V){if(V!==void 0&&V.isCamera!==!0){Xe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(z===!0)return;G!==null&&G.renderStart(y,V);const re=Oe.enabled===!0&&Oe.isPresenting===!0,ee=w!==null&&(Z===null||re)&&w.begin(I,Z);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),V.parent===null&&V.matrixWorldAutoUpdate===!0&&V.updateMatrixWorld(),Oe.enabled===!0&&Oe.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Oe.cameraAutoUpdate===!0&&Oe.updateCamera(V),V=Oe.getCamera()),y.isScene===!0&&y.onBeforeRender(I,y,V,Z),E=Se.get(y,x.length),E.init(V),E.state.textureUnits=oe.getTextureUnits(),x.push(E),K.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),R.setFromProjectionMatrix(K,2e3,V.reversedDepth),D=this.localClippingEnabled,k=ze.init(this.clippingPlanes,D),T=ye.get(y,C.length),T.init(),C.push(T),Oe.enabled===!0&&Oe.isPresenting===!0){const Ie=I.xr.getDepthSensingMesh();Ie!==null&&va(Ie,V,-1/0,I.sortObjects)}va(y,V,0,I.sortObjects),T.finish(),G!==null&&G.updateLights(E.state.lightsArray),I.sortObjects===!0&&T.sort(L,P),pe=Oe.enabled===!1||Oe.isPresenting===!1||Oe.hasDepthSensing()===!1,pe&&Je.addToRenderList(T,y),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),k===!0&&ze.beginShadows();const te=E.state.shadowsArray;if(We.render(te,y,V),k===!0&&ze.endShadows(),(ee&&w.hasRenderPass())===!1){const Ie=T.opaque,we=T.transmissive;if(E.setupLights(),V.isArrayCamera){const De=V.cameras;if(we.length>0)for(let Ge=0,je=De.length;Ge<je;Ge++){const it=De[Ge];Dl(Ie,we,y,it)}pe&&Je.render(y);for(let Ge=0,je=De.length;Ge<je;Ge++){const it=De[Ge];Nl(T,y,it,it.viewport)}}else we.length>0&&Dl(Ie,we,y,V),pe&&Je.render(y),Nl(T,y,V)}Z!==null&&$===0&&(oe.updateMultisampleRenderTarget(Z),oe.updateRenderTargetMipmap(Z)),ee&&w.end(I),y.isScene===!0&&y.onAfterRender(I,y,V),qe.resetDefaultState(),se=-1,ae=null,x.pop(),x.length>0?(E=x[x.length-1],oe.setTextureUnits(E.state.textureUnits),k===!0&&ze.setGlobalState(I.clippingPlanes,E.state.camera)):E=null,C.pop(),C.length>0?T=C[C.length-1]:T=null,G!==null&&G.renderEnd()};function va(y,V,re,ee){if(y.visible===!1)return;if(y.layers.test(V.layers)){if(y.isGroup)re=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(V);else if(y.isLightProbeGrid)E.pushLightProbeGrid(y);else if(y.isLight)E.pushLight(y),y.castShadow&&E.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||y.intersectsFrustum(R)){ee&&le.setFromMatrixPosition(y.matrixWorld).applyMatrix4(K);const Ie=ue.update(y),we=y.material;we.visible&&T.push(y,Ie,we,re,le.z,null,V)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||y.intersectsFrustum(R))){const Ie=ue.update(y),we=y.material;if(ee&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),le.copy(y.boundingSphere.center)):(Ie.boundingSphere===null&&Ie.computeBoundingSphere(),le.copy(Ie.boundingSphere.center)),le.applyMatrix4(y.matrixWorld).applyMatrix4(K)),Array.isArray(we)){const De=Ie.groups;for(let Ge=0,je=De.length;Ge<je;Ge++){const it=De[Ge],Ue=we[it.materialIndex];Ue&&Ue.visible&&T.push(y,Ie,Ue,re,le.z,it,V)}}else we.visible&&T.push(y,Ie,we,re,le.z,null,V)}}const Re=y.children;for(let Ie=0,we=Re.length;Ie<we;Ie++)va(Re[Ie],V,re,ee)}function Nl(y,V,re,ee){const{opaque:te,transmissive:Re,transparent:Ie}=y;E.setupLightsView(re),k===!0&&ze.setGlobalState(I.clippingPlanes,re),ee&&M.viewport(he.copy(ee)),te.length>0&&Js(te,V,re),Re.length>0&&Js(Re,V,re),Ie.length>0&&Js(Ie,V,re),M.buffers.depth.setTest(!0),M.buffers.depth.setMask(!0),M.buffers.color.setMask(!0),M.setPolygonOffset(!1)}function Dl(y,V,re,ee){if((re.isScene===!0?re.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[ee.id]===void 0){const Ue=Ne.has("EXT_color_buffer_half_float")||Ne.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[ee.id]=new Kt(1,1,{generateMipmaps:!0,type:Ue?1016:1009,minFilter:1008,samples:Math.max(4,q.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:nt.workingColorSpace})}const Re=E.state.transmissionRenderTarget[ee.id],Ie=ee.viewport||he;Re.setSize(Ie.z*I.transmissionResolutionScale,Ie.w*I.transmissionResolutionScale);const we=I.getRenderTarget(),De=I.getActiveCubeFace(),Ge=I.getActiveMipmapLevel();I.setRenderTarget(Re),I.getClearColor(Ke),Ye=I.getClearAlpha(),Ye<1&&I.setClearColor(16777215,.5),I.clear(),pe&&Je.render(re);const je=I.toneMapping;I.toneMapping=0;const it=ee.viewport;if(ee.viewport!==void 0&&(ee.viewport=void 0),E.setupLightsView(ee),k===!0&&ze.setGlobalState(I.clippingPlanes,ee),Js(y,re,ee),oe.updateMultisampleRenderTarget(Re),oe.updateRenderTargetMipmap(Re),Ne.has("WEBGL_multisampled_render_to_texture")===!1){let Ue=!1;for(let ot=0,bt=V.length;ot<bt;ot++){const _t=V[ot],{object:dt,geometry:Lt,material:Pe,group:Ut}=_t;if(Pe.side===2&&dt.layers.test(ee.layers)){const st=Pe.side;Pe.side=1,Pe.needsUpdate=!0,Ul(dt,re,ee,Lt,Pe,Ut),Pe.side=st,Pe.needsUpdate=!0,Ue=!0}}Ue===!0&&(oe.updateMultisampleRenderTarget(Re),oe.updateRenderTargetMipmap(Re))}I.setRenderTarget(we,De,Ge),I.setClearColor(Ke,Ye),it!==void 0&&(ee.viewport=it),I.toneMapping=je}function Js(y,V,re){const ee=V.isScene===!0?V.overrideMaterial:null;for(let te=0,Re=y.length;te<Re;te++){const Ie=y[te],{object:we,geometry:De,group:Ge}=Ie;let je=Ie.material;je.allowOverride===!0&&ee!==null&&(je=ee),we.layers.test(re.layers)&&Ul(we,V,re,De,je,Ge)}}function Ul(y,V,re,ee,te,Re){G!==null&&te.isNodeMaterial&&G.setObject(y,te),y.onBeforeRender(I,V,re,ee,te,Re),y.modelViewMatrix.multiplyMatrices(re.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),te.onBeforeRender(I,V,re,ee,y,Re),te.transparent===!0&&te.side===2&&te.forceSinglePass===!1?(te.side=1,te.needsUpdate=!0,I.renderBufferDirect(re,V,ee,te,y,Re),te.side=0,te.needsUpdate=!0,I.renderBufferDirect(re,V,ee,te,y,Re),te.side=2):I.renderBufferDirect(re,V,ee,te,y,Re),y.onAfterRender(I,V,re,ee,te,Re)}function Zs(y,V,re){V.isScene!==!0&&(V=me);const ee=j.get(y),te=E.state.lights,Re=E.state.shadowsArray,Ie=te.state.version,we=Me.getParameters(y,te.state,Re,V,re,E.state.lightProbeGridArray),De=Me.getProgramCacheKey(we);let Ge=ee.programs;ee.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?V.environment:null,ee.fog=V.fog;const je=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;ee.envMap=xe.get(y.envMap||ee.environment,je),ee.envMapRotation=ee.environment!==null&&y.envMap===null?V.environmentRotation:y.envMapRotation,Ge===void 0&&(y.addEventListener("dispose",fn),Ge=new Map,ee.programs=Ge);let it=Ge.get(De);if(it!==void 0){if(ee.currentProgram===it&&ee.lightsStateVersion===Ie)return Ol(y,we),it}else we.uniforms=Me.getUniforms(y),G!==null&&y.isNodeMaterial&&G.build(y,re,we),y.onBeforeCompile(we,I),it=Me.acquireProgram(we,De),Ge.set(De,it),ee.uniforms=we.uniforms;const Ue=ee.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Ue.clippingPlanes=ze.uniform),Ol(y,we),ee.needsLights=A0(y),ee.lightsStateVersion=Ie,ee.needsLights&&(Ue.ambientLightColor.value=te.state.ambient,Ue.lightProbe.value=te.state.probe,Ue.sunLights.value=te.state.sun,Ue.sunLightShadows.value=te.state.sunShadow,Ue.directionalLights.value=te.state.directional,Ue.directionalLightShadows.value=te.state.directionalShadow,Ue.spotLights.value=te.state.spot,Ue.spotLightShadows.value=te.state.spotShadow,Ue.rectAreaLights.value=te.state.rectArea,Ue.ltc_1.value=te.state.rectAreaLTC1,Ue.ltc_2.value=te.state.rectAreaLTC2,Ue.pointLights.value=te.state.point,Ue.pointLightShadows.value=te.state.pointShadow,Ue.hemisphereLights.value=te.state.hemi,Ue.sunShadowMatrix.value=te.state.sunShadowMatrix,Ue.sunShadowCascade.value=te.state.sunShadowCascade,Ue.directionalShadowMatrix.value=te.state.directionalShadowMatrix,Ue.spotLightMatrix.value=te.state.spotLightMatrix,Ue.spotLightMap.value=te.state.spotLightMap,Ue.pointShadowMatrix.value=te.state.pointShadowMatrix),ee.lightProbeGrid=E.state.lightProbeGridArray.length>0,ee.currentProgram=it,ee.uniformsList=null,it}function Fl(y){if(y.uniformsList===null){const V=y.currentProgram.getUniforms();y.uniformsList=Ws.seqWithValue(V.seq,y.uniforms)}return y.uniformsList}function Ol(y,V){const re=j.get(y);re.outputColorSpace=V.outputColorSpace,re.batching=V.batching,re.batchingColor=V.batchingColor,re.instancing=V.instancing,re.instancingColor=V.instancingColor,re.instancingMorph=V.instancingMorph,re.skinning=V.skinning,re.morphTargets=V.morphTargets,re.morphNormals=V.morphNormals,re.morphColors=V.morphColors,re.morphTargetsCount=V.morphTargetsCount,re.numClippingPlanes=V.numClippingPlanes,re.numIntersection=V.numClipIntersection,re.vertexAlphas=V.vertexAlphas,re.vertexTangents=V.vertexTangents,re.toneMapping=V.toneMapping}function T0(y,V){if(y.length===0)return null;if(y.length===1)return y[0].texture!==null?y[0]:null;_.setFromMatrixPosition(V.matrixWorld);for(let re=0,ee=y.length;re<ee;re++){const te=y[re];if(te.texture!==null&&te.boundingBox.containsPoint(_))return te}return null}function b0(y,V,re,ee,te){V.isScene!==!0&&(V=me),oe.resetTextureUnits();const Re=V.fog,Ie=ee.isMeshStandardMaterial||ee.isMeshLambertMaterial||ee.isMeshPhongMaterial?V.environment:null,we=Z===null?I.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:nt.workingColorSpace,De=ee.isMeshStandardMaterial||ee.isMeshLambertMaterial&&!ee.envMap||ee.isMeshPhongMaterial&&!ee.envMap,Ge=xe.get(ee.envMap||Ie,De),je=ee.vertexColors===!0&&!!re.attributes.color&&re.attributes.color.itemSize===4,it=!!re.attributes.tangent&&(!!ee.normalMap||ee.anisotropy>0),Ue=!!re.morphAttributes.position,ot=!!re.morphAttributes.normal,bt=!!re.morphAttributes.color;let _t=0;ee.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(_t=I.toneMapping);const dt=re.morphAttributes.position||re.morphAttributes.normal||re.morphAttributes.color,Lt=dt!==void 0?dt.length:0,Pe=j.get(ee),Ut=E.state.lights;if(k===!0&&(D===!0||y!==ae)){const mt=y===ae&&ee.id===se;ze.setState(ee,y,mt)}let st=!1;ee.version===Pe.__version?(Pe.needsLights&&Pe.lightsStateVersion!==Ut.state.version||Pe.outputColorSpace!==we||te.isBatchedMesh&&Pe.batching===!1||!te.isBatchedMesh&&Pe.batching===!0||te.isBatchedMesh&&Pe.batchingColor===!0&&te._colorsTexture===null||te.isBatchedMesh&&Pe.batchingColor===!1&&te._colorsTexture!==null||te.isInstancedMesh&&Pe.instancing===!1||!te.isInstancedMesh&&Pe.instancing===!0||te.isSkinnedMesh&&Pe.skinning===!1||!te.isSkinnedMesh&&Pe.skinning===!0||te.isInstancedMesh&&Pe.instancingColor===!0&&te.instanceColor===null||te.isInstancedMesh&&Pe.instancingColor===!1&&te.instanceColor!==null||te.isInstancedMesh&&Pe.instancingMorph===!0&&te.morphTexture===null||te.isInstancedMesh&&Pe.instancingMorph===!1&&te.morphTexture!==null||Pe.envMap!==Ge||ee.fog===!0&&Pe.fog!==Re||Pe.numClippingPlanes!==void 0&&(Pe.numClippingPlanes!==ze.numPlanes||Pe.numIntersection!==ze.numIntersection)||Pe.vertexAlphas!==je||Pe.vertexTangents!==it||Pe.morphTargets!==Ue||Pe.morphNormals!==ot||Pe.morphColors!==bt||Pe.toneMapping!==_t||Pe.morphTargetsCount!==Lt||!!Pe.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(st=!0):(st=!0,Pe.__version=ee.version);let Xt=Pe.currentProgram;st===!0&&(Xt=Zs(ee,V,te),G&&ee.isNodeMaterial&&G.onUpdateProgram(ee,Xt,Pe));let dn=!1,On=!1,Ai=!1;const ft=Xt.getUniforms(),St=Pe.uniforms;if(M.useProgram(Xt.program)&&(dn=!0,On=!0,Ai=!0),ee.id!==se&&(se=ee.id,On=!0),Pe.needsLights){const mt=T0(E.state.lightProbeGridArray,te);Pe.lightProbeGrid!==mt&&(Pe.lightProbeGrid=mt,On=!0)}if(dn||ae!==y){M.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),ft.setValue(S,"projectionMatrix",y.projectionMatrix),ft.setValue(S,"viewMatrix",y.matrixWorldInverse);const Gn=ft.map.cameraPosition;Gn!==void 0&&Gn.setValue(S,Q.setFromMatrixPosition(y.matrixWorld)),q.logarithmicDepthBuffer&&ft.setValue(S,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(ee.isMeshPhongMaterial||ee.isMeshToonMaterial||ee.isMeshLambertMaterial||ee.isMeshBasicMaterial||ee.isMeshStandardMaterial||ee.isShaderMaterial)&&ft.setValue(S,"isOrthographic",y.isOrthographicCamera===!0),ae!==y&&(ae=y,On=!0,Ai=!0)}if(Pe.needsLights&&(Ut.state.sunShadowMap.length>0&&ft.setValue(S,"sunShadowMap",Ut.state.sunShadowMap,oe),Ut.state.directionalShadowMap.length>0&&ft.setValue(S,"directionalShadowMap",Ut.state.directionalShadowMap,oe),Ut.state.spotShadowMap.length>0&&ft.setValue(S,"spotShadowMap",Ut.state.spotShadowMap,oe),Ut.state.pointShadowMap.length>0&&ft.setValue(S,"pointShadowMap",Ut.state.pointShadowMap,oe)),te.isSkinnedMesh){ft.setOptional(S,te,"bindMatrix"),ft.setOptional(S,te,"bindMatrixInverse");const mt=te.skeleton;mt&&(mt.boneTexture===null&&mt.computeBoneTexture(),ft.setValue(S,"boneTexture",mt.boneTexture,oe))}te.isBatchedMesh&&(ft.setOptional(S,te,"batchingTexture"),ft.setValue(S,"batchingTexture",te._matricesTexture,oe),ft.setOptional(S,te,"batchingIdTexture"),ft.setValue(S,"batchingIdTexture",te._indirectTexture,oe),ft.setOptional(S,te,"batchingColorTexture"),te._colorsTexture!==null&&ft.setValue(S,"batchingColorTexture",te._colorsTexture,oe));const Bn=re.morphAttributes;if((Bn.position!==void 0||Bn.normal!==void 0||Bn.color!==void 0)&&H.update(te,re,Xt),(On||Pe.receiveShadow!==te.receiveShadow)&&(Pe.receiveShadow=te.receiveShadow,ft.setValue(S,"receiveShadow",te.receiveShadow)),(ee.isMeshStandardMaterial||ee.isMeshLambertMaterial||ee.isMeshPhongMaterial)&&ee.envMap===null&&V.environment!==null&&(St.envMapIntensity.value=V.environmentIntensity),St.dfgLUT!==void 0&&(St.dfgLUT.value=Ep()),On){if(ft.setValue(S,"toneMappingExposure",I.toneMappingExposure),Pe.needsLights&&E0(St,Ai),Re&&ee.fog===!0&&Fe.refreshFogUniforms(St,Re),Fe.refreshMaterialUniforms(St,ee,N,U,E.state.transmissionRenderTarget[y.id]),Pe.needsLights&&Pe.lightProbeGrid){const mt=Pe.lightProbeGrid;St.probesSH.value=mt.texture,St.probesMin.value.copy(mt.boundingBox.min),St.probesMax.value.copy(mt.boundingBox.max),St.probesResolution.value.copy(mt.resolution)}Ws.upload(S,Fl(Pe),St,oe)}if(ee.isShaderMaterial&&ee.uniformsNeedUpdate===!0&&(Ws.upload(S,Fl(Pe),St,oe),ee.uniformsNeedUpdate=!1),ee.isSpriteMaterial&&ft.setValue(S,"center",te.center),ft.setValue(S,"modelViewMatrix",te.modelViewMatrix),ft.setValue(S,"normalMatrix",te.normalMatrix),ft.setValue(S,"modelMatrix",te.matrixWorld),ee.uniformsGroups!==void 0){const mt=ee.uniformsGroups;for(let Gn=0,wi=mt.length;Gn<wi;Gn++){const Gl=mt[Gn];ge.update(Gl,Xt),ge.bind(Gl,Xt)}}return Xt}function E0(y,V){y.ambientLightColor.needsUpdate=V,y.lightProbe.needsUpdate=V,y.sunLights.needsUpdate=V,y.sunLightShadows.needsUpdate=V,y.directionalLights.needsUpdate=V,y.directionalLightShadows.needsUpdate=V,y.pointLights.needsUpdate=V,y.pointLightShadows.needsUpdate=V,y.spotLights.needsUpdate=V,y.spotLightShadows.needsUpdate=V,y.rectAreaLights.needsUpdate=V,y.hemisphereLights.needsUpdate=V}function A0(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return ie},this.getActiveMipmapLevel=function(){return $},this.getRenderTarget=function(){return Z},this.setRenderTargetTextures=function(y,V,re){const ee=j.get(y);ee.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,ee.__autoAllocateDepthBuffer===!1&&(ee.__useRenderToTexture=!1),j.get(y.texture).__webglTexture=V,j.get(y.depthTexture).__webglTexture=ee.__autoAllocateDepthBuffer?void 0:re,ee.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,V){const re=j.get(y);re.__webglFramebuffer=V,re.__useDefaultFramebuffer=V===void 0},this.setRenderTarget=function(y,V=0,re=0){Z=y,ie=V,$=re;let ee=null,te=!1,Re=!1;if(y){const we=j.get(y);if(we.__useDefaultFramebuffer!==void 0){M.bindFramebuffer(S.FRAMEBUFFER,we.__webglFramebuffer),he.copy(y.viewport),Le.copy(y.scissor),Ce=y.scissorTest,M.viewport(he),M.scissor(Le),M.setScissorTest(Ce),se=-1;return}else if(we.__webglFramebuffer===void 0)oe.setupRenderTarget(y);else if(we.__hasExternalTextures)oe.rebindTextures(y,j.get(y.texture).__webglTexture,j.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const je=y.depthTexture;if(we.__boundDepthTexture!==je){if(je!==null&&j.has(je)&&(y.width!==je.image.width||y.height!==je.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");oe.setupDepthRenderbuffer(y)}}const De=y.texture;(De.isData3DTexture||De.isDataArrayTexture||De.isCompressedArrayTexture)&&(Re=!0);const Ge=j.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Ge[V])?ee=Ge[V][re]:ee=Ge[V],te=!0):y.samples>0&&oe.useMultisampledRTT(y)===!1?ee=j.get(y).__webglMultisampledFramebuffer:Array.isArray(Ge)?ee=Ge[re]:ee=Ge,he.copy(y.viewport),Le.copy(y.scissor),Ce=y.scissorTest}else he.copy(B).multiplyScalar(N).floor(),Le.copy(ne).multiplyScalar(N).floor(),Ce=_e;if(re!==0&&(ee=Y),M.bindFramebuffer(S.FRAMEBUFFER,ee)&&M.drawBuffers(y,ee),M.viewport(he),M.scissor(Le),M.setScissorTest(Ce),te){const we=j.get(y.texture);S.framebufferTexture2D(S.FRAMEBUFFER,S.COLOR_ATTACHMENT0,S.TEXTURE_CUBE_MAP_POSITIVE_X+V,we.__webglTexture,re)}else if(Re){const we=V;for(let De=0;De<y.textures.length;De++){const Ge=j.get(y.textures[De]);S.framebufferTextureLayer(S.FRAMEBUFFER,S.COLOR_ATTACHMENT0+De,Ge.__webglTexture,re,we)}}else if(y!==null&&re!==0){const we=j.get(y.texture);S.framebufferTexture2D(S.FRAMEBUFFER,S.COLOR_ATTACHMENT0,S.TEXTURE_2D,we.__webglTexture,re)}se=-1};function Bl(y){const V=j.get(y);return(V.__readFormat!==y.format||V.__readType!==y.type)&&(V.__readFormat=y.format,V.__readType=y.type,V.__formatReadable=q.textureFormatReadable(y.format),V.__typeReadable=q.textureTypeReadable(y.type)),V}this.readRenderTargetPixels=function(y,V,re,ee,te,Re,Ie,we=0){if(!(y&&y.isWebGLRenderTarget)){Xe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let De=j.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Ie!==void 0&&(De=De[Ie]),De){M.bindFramebuffer(S.FRAMEBUFFER,De);try{const Ge=y.textures[we],je=Ge.format,it=Ge.type;y.textures.length>1&&S.readBuffer(S.COLOR_ATTACHMENT0+we);const Ue=Bl(Ge);if(Ue.__formatReadable===!1){Xe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ue.__typeReadable===!1){Xe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}V>=0&&V<=y.width-ee&&re>=0&&re<=y.height-te&&S.readPixels(V,re,ee,te,be.convert(je),be.convert(it),Re)}finally{const Ge=Z!==null?j.get(Z).__webglFramebuffer:null;M.bindFramebuffer(S.FRAMEBUFFER,Ge)}}},this.readRenderTargetPixelsAsync=async function(y,V,re,ee,te,Re,Ie,we=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let De=j.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Ie!==void 0&&(De=De[Ie]),De)if(V>=0&&V<=y.width-ee&&re>=0&&re<=y.height-te){M.bindFramebuffer(S.FRAMEBUFFER,De);const Ge=y.textures[we],je=Ge.format,it=Ge.type;y.textures.length>1&&S.readBuffer(S.COLOR_ATTACHMENT0+we);const Ue=Bl(Ge);if(Ue.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ue.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ot=S.createBuffer();S.bindBuffer(S.PIXEL_PACK_BUFFER,ot),S.bufferData(S.PIXEL_PACK_BUFFER,Re.byteLength,S.STREAM_READ),S.readPixels(V,re,ee,te,be.convert(je),be.convert(it),0),S.bindBuffer(S.PIXEL_PACK_BUFFER,null);const bt=Z!==null?j.get(Z).__webglFramebuffer:null;M.bindFramebuffer(S.FRAMEBUFFER,bt);const _t=S.fenceSync(S.SYNC_GPU_COMMANDS_COMPLETE,0);return S.flush(),await Wl(S,_t,4),S.bindBuffer(S.PIXEL_PACK_BUFFER,ot),S.getBufferSubData(S.PIXEL_PACK_BUFFER,0,Re),S.bindBuffer(S.PIXEL_PACK_BUFFER,null),S.deleteBuffer(ot),S.deleteSync(_t),Re}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,V=null,re=0){const ee=Math.pow(2,-re),te=Math.floor(y.image.width*ee),Re=Math.floor(y.image.height*ee),Ie=V!==null?V.x:0,we=V!==null?V.y:0;oe.setTexture2D(y,0),S.copyTexSubImage2D(S.TEXTURE_2D,re,0,0,Ie,we,te,Re),M.unbindTexture()},this.copyTextureToTexture=function(y,V,re=null,ee=null,te=0,Re=0){let Ie,we,De,Ge,je,it,Ue,ot,bt;const _t=y.isCompressedTexture?y.mipmaps[Re]:y.image;if(re!==null)Ie=re.max.x-re.min.x,we=re.max.y-re.min.y,De=re.isBox3?re.max.z-re.min.z:1,Ge=re.min.x,je=re.min.y,it=re.isBox3?re.min.z:0;else{const St=Math.pow(2,-te);Ie=Math.floor(_t.width*St),we=Math.floor(_t.height*St),y.isDataArrayTexture?De=_t.depth:y.isData3DTexture?De=Math.floor(_t.depth*St):De=1,Ge=0,je=0,it=0}ee!==null?(Ue=ee.x,ot=ee.y,bt=ee.z):(Ue=0,ot=0,bt=0);const dt=be.convert(V.format),Lt=be.convert(V.type);let Pe;V.isData3DTexture?(oe.setTexture3D(V,0),Pe=S.TEXTURE_3D):V.isDataArrayTexture||V.isCompressedArrayTexture?(oe.setTexture2DArray(V,0),Pe=S.TEXTURE_2D_ARRAY):(oe.setTexture2D(V,0),Pe=S.TEXTURE_2D),M.activeTexture(S.TEXTURE0),M.pixelStorei(S.UNPACK_FLIP_Y_WEBGL,V.flipY),M.pixelStorei(S.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),M.pixelStorei(S.UNPACK_ALIGNMENT,V.unpackAlignment);const Ut=M.getParameter(S.UNPACK_ROW_LENGTH),st=M.getParameter(S.UNPACK_IMAGE_HEIGHT),Xt=M.getParameter(S.UNPACK_SKIP_PIXELS),dn=M.getParameter(S.UNPACK_SKIP_ROWS),On=M.getParameter(S.UNPACK_SKIP_IMAGES);M.pixelStorei(S.UNPACK_ROW_LENGTH,_t.width),M.pixelStorei(S.UNPACK_IMAGE_HEIGHT,_t.height),M.pixelStorei(S.UNPACK_SKIP_PIXELS,Ge),M.pixelStorei(S.UNPACK_SKIP_ROWS,je),M.pixelStorei(S.UNPACK_SKIP_IMAGES,it);const Ai=y.isDataArrayTexture||y.isData3DTexture,ft=V.isDataArrayTexture||V.isData3DTexture;if(y.isDepthTexture){const St=j.get(y),Bn=j.get(V),mt=j.get(St.__renderTarget),Gn=j.get(Bn.__renderTarget);M.bindFramebuffer(S.READ_FRAMEBUFFER,mt.__webglFramebuffer),M.bindFramebuffer(S.DRAW_FRAMEBUFFER,Gn.__webglFramebuffer);for(let wi=0;wi<De;wi++)Ai&&(S.framebufferTextureLayer(S.READ_FRAMEBUFFER,S.COLOR_ATTACHMENT0,j.get(y).__webglTexture,te,it+wi),S.framebufferTextureLayer(S.DRAW_FRAMEBUFFER,S.COLOR_ATTACHMENT0,j.get(V).__webglTexture,Re,bt+wi)),S.blitFramebuffer(Ge,je,Ie,we,Ue,ot,Ie,we,S.DEPTH_BUFFER_BIT,S.NEAREST);M.bindFramebuffer(S.READ_FRAMEBUFFER,null),M.bindFramebuffer(S.DRAW_FRAMEBUFFER,null)}else if(te!==0||y.isRenderTargetTexture||j.has(y)){const St=j.get(y),Bn=j.get(V);M.bindFramebuffer(S.READ_FRAMEBUFFER,O),M.bindFramebuffer(S.DRAW_FRAMEBUFFER,J);for(let mt=0;mt<De;mt++)Ai?S.framebufferTextureLayer(S.READ_FRAMEBUFFER,S.COLOR_ATTACHMENT0,St.__webglTexture,te,it+mt):S.framebufferTexture2D(S.READ_FRAMEBUFFER,S.COLOR_ATTACHMENT0,S.TEXTURE_2D,St.__webglTexture,te),ft?S.framebufferTextureLayer(S.DRAW_FRAMEBUFFER,S.COLOR_ATTACHMENT0,Bn.__webglTexture,Re,bt+mt):S.framebufferTexture2D(S.DRAW_FRAMEBUFFER,S.COLOR_ATTACHMENT0,S.TEXTURE_2D,Bn.__webglTexture,Re),te!==0?S.blitFramebuffer(Ge,je,Ie,we,Ue,ot,Ie,we,S.COLOR_BUFFER_BIT,S.NEAREST):ft?S.copyTexSubImage3D(Pe,Re,Ue,ot,bt+mt,Ge,je,Ie,we):S.copyTexSubImage2D(Pe,Re,Ue,ot,Ge,je,Ie,we);M.bindFramebuffer(S.READ_FRAMEBUFFER,null),M.bindFramebuffer(S.DRAW_FRAMEBUFFER,null)}else ft?y.isDataTexture||y.isData3DTexture?S.texSubImage3D(Pe,Re,Ue,ot,bt,Ie,we,De,dt,Lt,_t.data):V.isCompressedArrayTexture?S.compressedTexSubImage3D(Pe,Re,Ue,ot,bt,Ie,we,De,dt,_t.data):S.texSubImage3D(Pe,Re,Ue,ot,bt,Ie,we,De,dt,Lt,_t):y.isDataTexture?S.texSubImage2D(S.TEXTURE_2D,Re,Ue,ot,Ie,we,dt,Lt,_t.data):y.isCompressedTexture?S.compressedTexSubImage2D(S.TEXTURE_2D,Re,Ue,ot,_t.width,_t.height,dt,_t.data):S.texSubImage2D(S.TEXTURE_2D,Re,Ue,ot,Ie,we,dt,Lt,_t);M.pixelStorei(S.UNPACK_ROW_LENGTH,Ut),M.pixelStorei(S.UNPACK_IMAGE_HEIGHT,st),M.pixelStorei(S.UNPACK_SKIP_PIXELS,Xt),M.pixelStorei(S.UNPACK_SKIP_ROWS,dn),M.pixelStorei(S.UNPACK_SKIP_IMAGES,On),Re===0&&V.generateMipmaps&&S.generateMipmap(Pe),M.unbindTexture()},this.initRenderTarget=function(y){j.get(y).__webglFramebuffer===void 0&&oe.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?oe.setTextureCube(y,0):y.isData3DTexture?oe.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?oe.setTexture2DArray(y,0):oe.setTexture2D(y,0),M.unbindTexture()},this.resetState=function(){ie=0,$=0,Z=null,M.reset(),qe.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return 2e3}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=nt._getDrawingBufferColorSpace(e),t.unpackColorSpace=nt._getUnpackColorSpace()}}class wp extends Nn{constructor(e){super(e)}load(e,t,n,i){const r=this,a=new Fs(this.manager);a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(o){const l=r.parse(JSON.parse(o));t&&t(l)},n,i)}parse(e){return new xl(e)}}class xl{constructor(e){this.isFont=!0,this.type="Font",this.data=e}generateShapes(e,t=100,n="ltr"){const i=[],r=Rp(e,t,this.data,n);for(let a=0,o=r.length;a<o;a++)i.push(...r[a].toShapes());return i}}function Rp(s,e,t,n){const i=Array.from(s),r=e/t.resolution,a=(t.boundingBox.yMax-t.boundingBox.yMin+t.underlineThickness)*r,o=[];let l=0,c=0;(n=="rtl"||n=="tb")&&i.reverse();for(let h=0;h<i.length;h++){const u=i[h];if(u===`
`)l=0,c-=a;else{const f=Cp(u,r,l,c,t);n=="tb"?(l=0,c+=t.ascender*r):l+=f.offsetX,o.push(f.path)}}return o}function Cp(s,e,t,n,i){const r=i.glyphs[s]||i.glyphs["?"];if(!r){console.error('THREE.Font: character "'+s+'" does not exists in font family '+i.familyName+".");return}const a=new Un;let o,l,c,h,u,f,d,g;if(r.o){const v=r._cachedOutline||(r._cachedOutline=r.o.split(" "));for(let m=0,p=v.length;m<p;)switch(v[m++]){case"m":o=v[m++]*e+t,l=v[m++]*e+n,a.moveTo(o,l);break;case"l":o=v[m++]*e+t,l=v[m++]*e+n,a.lineTo(o,l);break;case"q":c=v[m++]*e+t,h=v[m++]*e+n,u=v[m++]*e+t,f=v[m++]*e+n,a.quadraticCurveTo(u,f,c,h);break;case"b":c=v[m++]*e+t,h=v[m++]*e+n,u=v[m++]*e+t,f=v[m++]*e+n,d=v[m++]*e+t,g=v[m++]*e+n,a.bezierCurveTo(u,f,d,g,c,h);break}}return{offsetX:r.ha*e,path:a}}class sa extends Is{constructor(e,t={}){const n=t.font;if(n===void 0)super();else{const i=n.generateShapes(e,t.size,t.direction);t.depth===void 0&&(t.depth=50),t.bevelThickness===void 0&&(t.bevelThickness=10),t.bevelSize===void 0&&(t.bevelSize=8),t.bevelEnabled===void 0&&(t.bevelEnabled=!1),super(i,t)}this.type="TextGeometry"}toJSON(){return super.toJSON()}static fromJSON(e){const t=e.options;return t.font=new xl(t.font.data),new sa(t.text,t)}}const ji=new F;function Ht(s,e,t,n,i,r){const a=2*Math.PI*i/4,o=Math.max(r-2*i,0),l=Math.PI/4;ji.copy(e),ji[n]=0,ji.normalize();const c=.5*a/(a+o),h=1-ji.angleTo(s)/l;return Math.sign(ji[t])===1?h*c:o/(a+o)+c+c*(1-h)}class ra extends Xn{constructor(e=1,t=1,n=1,i=2,r=.1){const a=i*2+1;if(r=Math.min(e/2,t/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:n,segments:i,radius:r},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const l=new F,c=new F,h=new F(e,t,n).divideScalar(2).subScalar(r),u=this.attributes.position.array,f=this.attributes.normal.array,d=this.attributes.uv.array,g=u.length/6,v=new F,m=.5/a;for(let p=0,b=0;p<u.length;p+=3,b+=2)switch(l.fromArray(u,p),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),u[p+0]=h.x*Math.sign(l.x)+c.x*r,u[p+1]=h.y*Math.sign(l.y)+c.y*r,u[p+2]=h.z*Math.sign(l.z)+c.z*r,f[p+0]=c.x,f[p+1]=c.y,f[p+2]=c.z,Math.floor(p/g)){case 0:v.set(1,0,0),d[b+0]=Ht(v,c,"z","y",r,n),d[b+1]=1-Ht(v,c,"y","z",r,t);break;case 1:v.set(-1,0,0),d[b+0]=1-Ht(v,c,"z","y",r,n),d[b+1]=1-Ht(v,c,"y","z",r,t);break;case 2:v.set(0,1,0),d[b+0]=1-Ht(v,c,"x","z",r,e),d[b+1]=Ht(v,c,"z","x",r,n);break;case 3:v.set(0,-1,0),d[b+0]=1-Ht(v,c,"x","z",r,e),d[b+1]=1-Ht(v,c,"z","x",r,n);break;case 4:v.set(0,0,1),d[b+0]=1-Ht(v,c,"x","y",r,e),d[b+1]=1-Ht(v,c,"y","x",r,t);break;case 5:v.set(0,0,-1),d[b+0]=Ht(v,c,"x","y",r,e),d[b+1]=1-Ht(v,c,"y","x",r,t);break}}static fromJSON(e){return new ra(e.width,e.height,e.depth,e.segments,e.radius)}}const es=Et;class aa extends Nn{constructor(e){super(e),this.defaultDPI=90,this.defaultUnit="px"}load(e,t,n,i){const r=this,a=new Fs(r.manager);a.setPath(r.path),a.setRequestHeader(r.requestHeader),a.setWithCredentials(r.withCredentials),a.load(e,function(o){try{t(r.parse(o))}catch(l){i?i(l):console.error(l),r.manager.itemError(e)}},n,i)}parse(e){const t=this;function n(N,L){if(N.nodeType!==1)return;N.hasAttribute("filter")&&console.warn("THREE.SVGLoader: Filters are not supported.");const P=T(N);let B=!1,ne=null;switch(N.nodeName){case"svg":L=v(N,L);break;case"style":r(N);break;case"g":L=v(N,L);break;case"path":L=v(N,L),N.hasAttribute("d")&&(ne=i(N));break;case"rect":L=v(N,L),ne=l(N);break;case"polygon":L=v(N,L),ne=c(N);break;case"polyline":L=v(N,L),ne=h(N);break;case"circle":L=v(N,L),ne=u(N);break;case"ellipse":L=v(N,L),ne=f(N);break;case"line":L=v(N,L),ne=d(N);break;case"defs":B=!0;break;case"use":L=v(N,L);const k=(N.getAttributeNS("http://www.w3.org/1999/xlink","href")||"").substring(1),D=N.viewportElement.getElementById(k);D?n(D,L):console.warn("SVGLoader: 'use node' references non-existent node id: "+k);break}if(ne){L.fill!==void 0&&L.fill!=="none"&&!L.fill.startsWith("url")&&ne.color.setStyle(L.fill,es),x(ne,Ye),J.push(ne);const R=Object.assign({},L);R.strokeWidth=L.strokeWidth*Y(Ye),ne.userData={node:N,style:R,transform:Ye.clone(),gradients:$}}const _e=N.childNodes;for(let R=0;R<_e.length;R++){const k=_e[R];B&&k.nodeName!=="style"&&k.nodeName!=="defs"||n(k,L)}P&&(Z.pop(),Z.length>0?Ye.copy(Z[Z.length-1]):Ye.identity())}function i(N){const L=new Un,P=new de,B=new de,ne=new de;let _e=!0,R=!1;const k=N.getAttribute("d");if(k===""||k==="none")return null;const D=k.match(/[a-df-z][^a-df-z]*/ig);for(let K=0,Q=D.length;K<Q;K++){const le=D[K],me=le.charAt(0),pe=le.slice(1).trim();_e===!0&&(R=!0,_e=!1);let X;switch(me){case"M":X=p(pe);for(let S=0,Ae=X.length;S<Ae;S+=2)P.x=X[S+0],P.y=X[S+1],B.x=P.x,B.y=P.y,S===0?L.moveTo(P.x,P.y):L.lineTo(P.x,P.y),S===0&&ne.copy(P);break;case"H":X=p(pe);for(let S=0,Ae=X.length;S<Ae;S++)P.x=X[S],B.x=P.x,B.y=P.y,L.lineTo(P.x,P.y),S===0&&R===!0&&ne.copy(P);break;case"V":X=p(pe);for(let S=0,Ae=X.length;S<Ae;S++)P.y=X[S],B.x=P.x,B.y=P.y,L.lineTo(P.x,P.y),S===0&&R===!0&&ne.copy(P);break;case"L":X=p(pe);for(let S=0,Ae=X.length;S<Ae;S+=2)P.x=X[S+0],P.y=X[S+1],B.x=P.x,B.y=P.y,L.lineTo(P.x,P.y),S===0&&R===!0&&ne.copy(P);break;case"C":X=p(pe);for(let S=0,Ae=X.length;S<Ae;S+=6)L.bezierCurveTo(X[S+0],X[S+1],X[S+2],X[S+3],X[S+4],X[S+5]),B.x=X[S+2],B.y=X[S+3],P.x=X[S+4],P.y=X[S+5],S===0&&R===!0&&ne.copy(P);break;case"S":X=p(pe);for(let S=0,Ae=X.length;S<Ae;S+=4)L.bezierCurveTo(m(P.x,B.x),m(P.y,B.y),X[S+0],X[S+1],X[S+2],X[S+3]),B.x=X[S+0],B.y=X[S+1],P.x=X[S+2],P.y=X[S+3],S===0&&R===!0&&ne.copy(P);break;case"Q":X=p(pe);for(let S=0,Ae=X.length;S<Ae;S+=4)L.quadraticCurveTo(X[S+0],X[S+1],X[S+2],X[S+3]),B.x=X[S+0],B.y=X[S+1],P.x=X[S+2],P.y=X[S+3],S===0&&R===!0&&ne.copy(P);break;case"T":X=p(pe);for(let S=0,Ae=X.length;S<Ae;S+=2){const Ne=m(P.x,B.x),q=m(P.y,B.y);L.quadraticCurveTo(Ne,q,X[S+0],X[S+1]),B.x=Ne,B.y=q,P.x=X[S+0],P.y=X[S+1],S===0&&R===!0&&ne.copy(P)}break;case"A":X=p(pe,[3,4],7);for(let S=0,Ae=X.length;S<Ae;S+=7){if(X[S+5]==P.x&&X[S+6]==P.y)continue;const Ne=P.clone();P.x=X[S+5],P.y=X[S+6],B.x=P.x,B.y=P.y,a(L,X[S],X[S+1],X[S+2],X[S+3],X[S+4],Ne,P),S===0&&R===!0&&ne.copy(P)}break;case"m":X=p(pe);for(let S=0,Ae=X.length;S<Ae;S+=2)P.x+=X[S+0],P.y+=X[S+1],B.x=P.x,B.y=P.y,S===0?L.moveTo(P.x,P.y):L.lineTo(P.x,P.y),S===0&&ne.copy(P);break;case"h":X=p(pe);for(let S=0,Ae=X.length;S<Ae;S++)P.x+=X[S],B.x=P.x,B.y=P.y,L.lineTo(P.x,P.y),S===0&&R===!0&&ne.copy(P);break;case"v":X=p(pe);for(let S=0,Ae=X.length;S<Ae;S++)P.y+=X[S],B.x=P.x,B.y=P.y,L.lineTo(P.x,P.y),S===0&&R===!0&&ne.copy(P);break;case"l":X=p(pe);for(let S=0,Ae=X.length;S<Ae;S+=2)P.x+=X[S+0],P.y+=X[S+1],B.x=P.x,B.y=P.y,L.lineTo(P.x,P.y),S===0&&R===!0&&ne.copy(P);break;case"c":X=p(pe);for(let S=0,Ae=X.length;S<Ae;S+=6)L.bezierCurveTo(P.x+X[S+0],P.y+X[S+1],P.x+X[S+2],P.y+X[S+3],P.x+X[S+4],P.y+X[S+5]),B.x=P.x+X[S+2],B.y=P.y+X[S+3],P.x+=X[S+4],P.y+=X[S+5],S===0&&R===!0&&ne.copy(P);break;case"s":X=p(pe);for(let S=0,Ae=X.length;S<Ae;S+=4)L.bezierCurveTo(m(P.x,B.x),m(P.y,B.y),P.x+X[S+0],P.y+X[S+1],P.x+X[S+2],P.y+X[S+3]),B.x=P.x+X[S+0],B.y=P.y+X[S+1],P.x+=X[S+2],P.y+=X[S+3],S===0&&R===!0&&ne.copy(P);break;case"q":X=p(pe);for(let S=0,Ae=X.length;S<Ae;S+=4)L.quadraticCurveTo(P.x+X[S+0],P.y+X[S+1],P.x+X[S+2],P.y+X[S+3]),B.x=P.x+X[S+0],B.y=P.y+X[S+1],P.x+=X[S+2],P.y+=X[S+3],S===0&&R===!0&&ne.copy(P);break;case"t":X=p(pe);for(let S=0,Ae=X.length;S<Ae;S+=2){const Ne=m(P.x,B.x),q=m(P.y,B.y);L.quadraticCurveTo(Ne,q,P.x+X[S+0],P.y+X[S+1]),B.x=Ne,B.y=q,P.x=P.x+X[S+0],P.y=P.y+X[S+1],S===0&&R===!0&&ne.copy(P)}break;case"a":X=p(pe,[3,4],7);for(let S=0,Ae=X.length;S<Ae;S+=7){if(X[S+5]==0&&X[S+6]==0)continue;const Ne=P.clone();P.x+=X[S+5],P.y+=X[S+6],B.x=P.x,B.y=P.y,a(L,X[S],X[S+1],X[S+2],X[S+3],X[S+4],Ne,P),S===0&&R===!0&&ne.copy(P)}break;case"Z":case"z":L.currentPath.autoClose=!0,L.currentPath.curves.length>0&&(P.copy(ne),L.currentPath.currentPoint.copy(P),_e=!0);break;default:console.warn(le)}R=!1}return L}function r(N){if(!(!N.sheet||!N.sheet.cssRules||!N.sheet.cssRules.length))for(let L=0;L<N.sheet.cssRules.length;L++){const P=N.sheet.cssRules[L];if(P.type!==1)continue;const B=P.selectorText.split(/,/gm).filter(Boolean).map(ne=>ne.trim());for(let ne=0;ne<B.length;ne++){const _e=Object.fromEntries(Object.entries(P.style).filter(([,R])=>R!==""));ie[B[ne]]=Object.assign(ie[B[ne]]||{},_e)}}}function a(N,L,P,B,ne,_e,R,k){if(L==0||P==0){N.lineTo(k.x,k.y);return}B=B*Math.PI/180,L=Math.abs(L),P=Math.abs(P);const D=(R.x-k.x)/2,K=(R.y-k.y)/2,Q=Math.cos(B)*D+Math.sin(B)*K,le=-Math.sin(B)*D+Math.cos(B)*K;let me=L*L,pe=P*P;const X=Q*Q,S=le*le,Ae=X/me+S/pe;if(Ae>1){const ue=Math.sqrt(Ae);L=ue*L,P=ue*P,me=L*L,pe=P*P}const Ne=me*S+pe*X,q=(me*pe-Ne)/Ne;let M=Math.sqrt(Math.max(0,q));ne===_e&&(M=-M);const W=M*L*le/P,j=-M*P*Q/L,oe=Math.cos(B)*W-Math.sin(B)*j+(R.x+k.x)/2,xe=Math.sin(B)*W+Math.cos(B)*j+(R.y+k.y)/2,ve=o(1,0,(Q-W)/L,(le-j)/P),ce=o((Q-W)/L,(le-j)/P,(-Q-W)/L,(-le-j)/P)%(Math.PI*2);N.currentPath.absellipse(oe,xe,L,P,ve,ve+ce,_e===0,B)}function o(N,L,P,B){const ne=N*P+L*B,_e=Math.sqrt(N*N+L*L)*Math.sqrt(P*P+B*B);let R=Math.acos(Math.max(-1,Math.min(1,ne/_e)));return N*B-L*P<0&&(R=-R),R}function l(N){const L=_(N.getAttribute("x")||0),P=_(N.getAttribute("y")||0),B=_(N.getAttribute("rx")||N.getAttribute("ry")||0),ne=_(N.getAttribute("ry")||N.getAttribute("rx")||0),_e=_(N.getAttribute("width")),R=_(N.getAttribute("height")),k=1-.551915024494,D=new Un;return D.moveTo(L+B,P),D.lineTo(L+_e-B,P),(B!==0||ne!==0)&&D.bezierCurveTo(L+_e-B*k,P,L+_e,P+ne*k,L+_e,P+ne),D.lineTo(L+_e,P+R-ne),(B!==0||ne!==0)&&D.bezierCurveTo(L+_e,P+R-ne*k,L+_e-B*k,P+R,L+_e-B,P+R),D.lineTo(L+B,P+R),(B!==0||ne!==0)&&D.bezierCurveTo(L+B*k,P+R,L,P+R-ne*k,L,P+R-ne),D.lineTo(L,P+ne),(B!==0||ne!==0)&&D.bezierCurveTo(L,P+ne*k,L+B*k,P,L+B,P),D}function c(N){function L(_e,R,k){const D=_(R),K=_(k);ne===0?B.moveTo(D,K):B.lineTo(D,K),ne++}const P=/([+-]?\d*\.?\d+(?:e[+-]?\d+)?)(?:,|\s)([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/g,B=new Un;let ne=0;return N.getAttribute("points").replace(P,L),B.currentPath.autoClose=!0,B}function h(N){function L(_e,R,k){const D=_(R),K=_(k);ne===0?B.moveTo(D,K):B.lineTo(D,K),ne++}const P=/([+-]?\d*\.?\d+(?:e[+-]?\d+)?)(?:,|\s)([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/g,B=new Un;let ne=0;return N.getAttribute("points").replace(P,L),B.currentPath.autoClose=!1,B}function u(N){const L=_(N.getAttribute("cx")||0),P=_(N.getAttribute("cy")||0),B=_(N.getAttribute("r")||0),ne=new fi;ne.absarc(L,P,B,0,Math.PI*2);const _e=new Un;return _e.subPaths.push(ne),_e}function f(N){const L=_(N.getAttribute("cx")||0),P=_(N.getAttribute("cy")||0),B=_(N.getAttribute("rx")||0),ne=_(N.getAttribute("ry")||0),_e=new fi;_e.absellipse(L,P,B,ne,0,Math.PI*2);const R=new Un;return R.subPaths.push(_e),R}function d(N){const L=_(N.getAttribute("x1")||0),P=_(N.getAttribute("y1")||0),B=_(N.getAttribute("x2")||0),ne=_(N.getAttribute("y2")||0),_e=new Un;return _e.moveTo(L,P),_e.lineTo(B,ne),_e.currentPath.autoClose=!1,_e}function g(N){const L="http://www.w3.org/1999/xlink",P=N.querySelectorAll("linearGradient, radialGradient"),B=["x1","y1","x2","y2","cx","cy","r","fx","fy","gradientUnits","gradientTransform","spreadMethod"],ne={};for(const R of P){const k=R.getAttribute("id");if(!k)continue;const D={type:R.nodeName==="radialGradient"?"radialGradient":"linearGradient",attrs:{},stops:null,href:null},K=R.getAttributeNS(L,"href")||R.getAttribute("href")||"";K.startsWith("#")&&(D.href=K.substring(1));for(const le of B)R.hasAttribute(le)&&(D.attrs[le]=R.getAttribute(le));const Q=R.querySelectorAll("stop");if(Q.length>0){D.stops=[];for(const le of Q){let me=le.getAttribute("stop-color");!me&&le.style&&(me=le.style["stop-color"]),me||(me="#000");let pe=le.getAttribute("stop-opacity");(pe===null||pe==="")&&le.style&&(pe=le.style["stop-opacity"]),pe=pe===null||pe===""||pe===void 0?1:Math.max(0,Math.min(1,parseFloat(pe)));const X=Math.max(0,Math.min(1,parseFloat(le.getAttribute("offset")||"0")));D.stops.push({offset:X,color:me,opacity:pe})}}ne[k]=D}function _e(R,k){const D=ne[R];if(!D||k.has(R))return D;if(k.add(R),D.href&&ne[D.href]){const K=_e(D.href,k);if(K){D.stops||(D.stops=K.stops);for(const Q in K.attrs)Q in D.attrs||(D.attrs[Q]=K.attrs[Q])}}return D}for(const R in ne)_e(R,new Set);for(const R in ne){let le=function(me){return typeof me!="string"?0:me.endsWith("%")?parseFloat(me)/100:_(me)};const k=ne[R],D=k.attrs,K=D.gradientUnits==="userSpaceOnUse"?"userSpaceOnUse":"objectBoundingBox",Q={type:k.type,gradientUnits:K,spreadMethod:D.spreadMethod==="reflect"||D.spreadMethod==="repeat"?D.spreadMethod:"pad",gradientTransform:null,stops:(k.stops||[]).slice().sort((me,pe)=>me.offset-pe.offset)};if(D.gradientTransform&&(Q.gradientTransform=new Ve,C(D.gradientTransform,Q.gradientTransform)),k.type==="linearGradient")Q.x1=D.x1!==void 0?le(D.x1):0,Q.y1=D.y1!==void 0?le(D.y1):0,Q.x2=D.x2!==void 0?le(D.x2):K==="objectBoundingBox"?1:0,Q.y2=D.y2!==void 0?le(D.y2):0;else{const me=K==="objectBoundingBox"?.5:0,pe=K==="objectBoundingBox"?.5:0;Q.cx=D.cx!==void 0?le(D.cx):me,Q.cy=D.cy!==void 0?le(D.cy):me,Q.r=D.r!==void 0?le(D.r):pe,Q.fx=D.fx!==void 0?le(D.fx):Q.cx,Q.fy=D.fy!==void 0?le(D.fy):Q.cy}$[R]=Q}}function v(N,L){L=Object.assign({},L);let P={};if(N.hasAttribute("class")){const R=N.getAttribute("class").split(/\s/).filter(Boolean).map(k=>k.trim());for(let k=0;k<R.length;k++)P=Object.assign(P,ie["."+R[k]])}N.hasAttribute("id")&&(P=Object.assign(P,ie["#"+N.getAttribute("id")]));function B(R,k,D){D===void 0&&(D=function(Q){return Q}),N.hasAttribute(R)&&(L[k]=D(N.getAttribute(R))),P[k]&&(L[k]=D(P[k])),N.style&&N.style[R]!==""&&(L[k]=D(N.style[R]))}function ne(R){return Math.max(0,Math.min(1,_(R)))}function _e(R){return Math.max(0,_(R))}return B("fill","fill"),B("fill-opacity","fillOpacity",ne),B("fill-rule","fillRule"),B("opacity","opacity",ne),B("stroke","stroke"),B("stroke-opacity","strokeOpacity",ne),B("stroke-width","strokeWidth",_e),B("stroke-linejoin","strokeLineJoin"),B("stroke-linecap","strokeLineCap"),B("stroke-miterlimit","strokeMiterLimit",_e),B("visibility","visibility"),L}function m(N,L){return N-(L-N)}function p(N,L,P){if(typeof N!="string")throw new TypeError("Invalid input: "+typeof N);const B={WHITESPACE:/[ \t\r\n]/,DIGIT:/[\d]/,SIGN:/[-+]/,POINT:/\./,COMMA:/,/,EXP:/e/i,FLAGS:/[01]/},ne=0,_e=1,R=2,k=3;let D=ne,K=!0,Q="",le="";const me=[];function pe(Ne,q,M){const W=new SyntaxError('Unexpected character "'+Ne+'" at index '+q+".");throw W.partial=M,W}function X(){Q!==""&&(le===""?me.push(Number(Q)):me.push(Number(Q)*Math.pow(10,Number(le)))),Q="",le=""}let S;const Ae=N.length;for(let Ne=0;Ne<Ae;Ne++){if(S=N[Ne],Array.isArray(L)&&L.includes(me.length%P)&&B.FLAGS.test(S)){D=_e,Q=S,X();continue}if(D===ne){if(B.WHITESPACE.test(S))continue;if(B.DIGIT.test(S)||B.SIGN.test(S)){D=_e,Q=S;continue}if(B.POINT.test(S)){D=R,Q=S;continue}B.COMMA.test(S)&&(K&&pe(S,Ne,me),K=!0)}if(D===_e){if(B.DIGIT.test(S)){Q+=S;continue}if(B.POINT.test(S)){Q+=S,D=R;continue}if(B.EXP.test(S)){D=k;continue}B.SIGN.test(S)&&Q.length===1&&B.SIGN.test(Q[0])&&pe(S,Ne,me)}if(D===R){if(B.DIGIT.test(S)){Q+=S;continue}if(B.EXP.test(S)){D=k;continue}B.POINT.test(S)&&Q[Q.length-1]==="."&&pe(S,Ne,me)}if(D===k){if(B.DIGIT.test(S)){le+=S;continue}if(B.SIGN.test(S)){if(le===""){le+=S;continue}le.length===1&&B.SIGN.test(le)&&pe(S,Ne,me)}}B.WHITESPACE.test(S)?(X(),D=ne,K=!1):B.COMMA.test(S)?(X(),D=ne,K=!0):B.SIGN.test(S)?(X(),D=_e,Q=S):B.POINT.test(S)?(X(),D=R,Q=S):pe(S,Ne,me)}return X(),me}const b=["mm","cm","in","pt","pc","px"],A={mm:{mm:1,cm:.1,in:1/25.4,pt:72/25.4,pc:6/25.4,px:-1},cm:{mm:10,cm:1,in:1/2.54,pt:72/2.54,pc:6/2.54,px:-1},in:{mm:25.4,cm:2.54,in:1,pt:72,pc:6,px:-1},pt:{mm:25.4/72,cm:2.54/72,in:1/72,pt:1,pc:6/72,px:-1},pc:{mm:25.4/6,cm:2.54/6,in:1/6,pt:72/6,pc:1,px:-1},px:{px:1}};function _(N){let L="px";if(typeof N=="string"||N instanceof String)for(let B=0,ne=b.length;B<ne;B++){const _e=b[B];if(N.endsWith(_e)){L=_e,N=N.substring(0,N.length-_e.length);break}}let P;return L==="px"&&t.defaultUnit!=="px"?P=A.in[t.defaultUnit]/t.defaultDPI:(P=A[L][t.defaultUnit],P<0&&(P=A[L].in*t.defaultDPI)),P*parseFloat(N)}function T(N){if(!(N.hasAttribute("transform")||N.nodeName==="use"&&(N.hasAttribute("x")||N.hasAttribute("y"))))return null;const L=E(N);return Z.length>0&&L.premultiply(Z[Z.length-1]),Ye.copy(L),Z.push(L),L}function E(N){const L=new Ve;if(N.nodeName==="use"&&(N.hasAttribute("x")||N.hasAttribute("y"))){const P=_(N.getAttribute("x")||0),B=_(N.getAttribute("y")||0);L.makeTranslation(P,B)}return N.hasAttribute("transform")&&C(N.getAttribute("transform"),L),L}function C(N,L){const P=se,B=N.split(")");for(let ne=B.length-1;ne>=0;ne--){const _e=B[ne].trim();if(_e==="")continue;const R=_e.indexOf("("),k=_e.length;if(R>0&&R<k){const D=_e.slice(0,R),K=p(_e.slice(R+1));switch(P.identity(),D){case"translate":if(K.length>=1){const Q=K[0];let le=0;K.length>=2&&(le=K[1]),P.makeTranslation(Q,le)}break;case"rotate":if(K.length>=1){let Q=0,le=0,me=0;Q=K[0]*Math.PI/180,K.length>=3&&(le=K[1],me=K[2]),ae.makeTranslation(-le,-me),he.makeRotation(Q),Le.multiplyMatrices(he,ae),ae.makeTranslation(le,me),P.multiplyMatrices(ae,Le)}break;case"scale":if(K.length>=1){const Q=K[0];let le=Q;K.length>=2&&(le=K[1]),P.makeScale(Q,le)}break;case"skewX":K.length===1&&P.set(1,Math.tan(K[0]*Math.PI/180),0,0,1,0,0,0,1);break;case"skewY":K.length===1&&P.set(1,0,0,Math.tan(K[0]*Math.PI/180),1,0,0,0,1);break;case"matrix":K.length===6&&P.set(K[0],K[2],K[4],K[1],K[3],K[5],0,0,1);break}L.premultiply(P)}}return L}function x(N,L){function P(R){Ke.set(R.x,R.y,1).applyMatrix3(L),R.set(Ke.x,Ke.y)}function B(R){const k=R.xRadius,D=R.yRadius,K=Math.cos(R.aRotation),Q=Math.sin(R.aRotation),le=new F(k*K,k*Q,0),me=new F(-D*Q,D*K,0),pe=le.applyMatrix3(L),X=me.applyMatrix3(L),S=se.set(pe.x,X.x,0,pe.y,X.y,0,0,0,1),Ae=ae.copy(S).invert(),M=he.copy(Ae).transpose().multiply(Ae).elements,W=O(M[0],M[1],M[4]),j=Math.sqrt(W.rt1),oe=Math.sqrt(W.rt2);if(R.xRadius=1/j,R.yRadius=1/oe,R.aRotation=Math.atan2(W.sn,W.cs),!((R.aEndAngle-R.aStartAngle)%(2*Math.PI)<Number.EPSILON)){const ve=ae.set(j,0,0,0,oe,0,0,0,1),ce=he.set(W.cs,W.sn,0,-W.sn,W.cs,0,0,0,1),ue=ve.multiply(ce).multiply(S),Me=Fe=>{const{x:ye,y:Se}=new F(Math.cos(Fe),Math.sin(Fe),0).applyMatrix3(ue);return Math.atan2(Se,ye)};R.aStartAngle=Me(R.aStartAngle),R.aEndAngle=Me(R.aEndAngle),w(L)&&(R.aClockwise=!R.aClockwise)}}function ne(R){const k=z(L),D=G(L);R.xRadius*=k,R.yRadius*=D;const K=k>Number.EPSILON?Math.atan2(L.elements[1],L.elements[0]):Math.atan2(-L.elements[3],L.elements[4]);R.aRotation+=K,w(L)&&(R.aStartAngle*=-1,R.aEndAngle*=-1,R.aClockwise=!R.aClockwise)}const _e=N.subPaths;for(let R=0,k=_e.length;R<k;R++){const K=_e[R].curves;for(let Q=0;Q<K.length;Q++){const le=K[Q];le.isLineCurve?(P(le.v1),P(le.v2)):le.isCubicBezierCurve?(P(le.v0),P(le.v1),P(le.v2),P(le.v3)):le.isQuadraticBezierCurve?(P(le.v0),P(le.v1),P(le.v2)):le.isEllipseCurve&&(Ce.set(le.aX,le.aY),P(Ce),le.aX=Ce.x,le.aY=Ce.y,I(L)?B(le):ne(le))}}}function w(N){const L=N.elements;return L[0]*L[4]-L[1]*L[3]<0}function I(N){const L=N.elements,P=L[0]*L[3]+L[1]*L[4];if(P===0)return!1;const B=z(N),ne=G(N);return Math.abs(P/(B*ne))>Number.EPSILON}function z(N){const L=N.elements;return Math.sqrt(L[0]*L[0]+L[1]*L[1])}function G(N){const L=N.elements;return Math.sqrt(L[3]*L[3]+L[4]*L[4])}function Y(N){const L=N.elements,P=L[0]*L[4]-L[1]*L[3];return Math.sqrt(Math.abs(P))}function O(N,L,P){let B,ne,_e,R,k;const D=N+P,K=N-P,Q=Math.sqrt(K*K+4*L*L);return D>0?(B=.5*(D+Q),k=1/B,ne=N*k*P-L*k*L):D<0?ne=.5*(D-Q):(B=.5*Q,ne=-.5*Q),K>0?_e=K+Q:_e=K-Q,Math.abs(_e)>2*Math.abs(L)?(k=-2*L/_e,R=1/Math.sqrt(1+k*k),_e=k*R):Math.abs(L)===0?(_e=1,R=0):(k=-.5*_e/L,_e=1/Math.sqrt(1+k*k),R=k*_e),K>0&&(k=_e,_e=-R,R=k),{rt1:B,rt2:ne,cs:_e,sn:R}}const J=[],ie={},$={},Z=[],se=new Ve,ae=new Ve,he=new Ve,Le=new Ve,Ce=new de,Ke=new F,Ye=new Ve,$e=new DOMParser().parseFromString(e,"image/svg+xml");return g($e),n($e.documentElement,{fill:"#000",fillOpacity:1,strokeOpacity:1,strokeWidth:1,strokeLineJoin:"miter",strokeLineCap:"butt",strokeMiterLimit:4}),{paths:J,gradients:$,xml:$e.documentElement}}static createFillMaterial(e){const t=e.userData.style;if(t.fill===void 0||t.fill==="none")return null;const n=e.color;let i=null;const r=vl.exec(t.fill);if(r){const o=e.userData.gradients&&e.userData.gradients[r[1]];i=qp(o,e)}const a=new yn({opacity:t.fillOpacity*(t.opacity||1),transparent:!0,side:2,depthWrite:!1});return i!==null?a.map=i:a.color=n,a}static createStrokeMaterial(e){const t=e.userData.style;return t.stroke===void 0||t.stroke==="none"?null:(vl.test(t.stroke)&&console.warn("THREE.SVGLoader: Gradient strokes are not supported."),new yn({color:new He().setStyle(t.stroke,es),opacity:t.strokeOpacity*(t.opacity||1),transparent:!0,side:2,depthWrite:!1}))}static createShapes(e){return console.warn("SVGLoader: createShapes() is deprecated. Use shapePath.toShapes() instead."),e.toShapes()}static getStrokeStyle(e,t,n,i,r){return e=e!==void 0?e:1,t=t!==void 0?t:"#000",n=n!==void 0?n:"miter",i=i!==void 0?i:"butt",r=r!==void 0?r:4,{strokeColor:t,strokeWidth:e,strokeLineJoin:n,strokeLineCap:i,strokeMiterLimit:r}}static pointsToStroke(e,t,n,i){const r=[],a=[],o=[];if(aa.pointsToStrokeWithBuffers(e,t,n,i,r,a,o)===0)return null;const l=new Tt;return l.setAttribute("position",new rt(r,3)),l.setAttribute("normal",new rt(a,3)),l.setAttribute("uv",new rt(o,2)),l}static pointsToStrokeWithBuffers(e,t,n,i,r,a,o,l){const c=new de,h=new de,u=new de,f=new de,d=new de,g=new de,v=new de,m=new de,p=new de,b=new de,A=new de,_=new de,T=new de,E=new de,C=new de,x=new de,w=new de;n=n!==void 0?n:12,i=i!==void 0?i:.001,l=l!==void 0?l:0,e=_e(e);const I=e.length;if(I<2)return 0;const z=e[0].equals(e[I-1]);let G,Y=e[0],O;const J=t.strokeWidth/2,ie=1/(I-1);let $=0,Z,se,ae,he,Le=!1,Ce=0,Ke=l*3,Ye=l*2;$e(e[0],e[1],c).multiplyScalar(J),m.copy(e[0]).sub(c),p.copy(e[0]).add(c),b.copy(m),A.copy(p);for(let R=1;R<I;R++){G=e[R],R===I-1?z?O=e[1]:O=void 0:O=e[R+1];const k=c;if($e(Y,G,k),u.copy(k).multiplyScalar(J),_.copy(G).sub(u),T.copy(G).add(u),Z=$+ie,se=!1,O!==void 0){$e(G,O,h),u.copy(h).multiplyScalar(J),E.copy(G).sub(u),C.copy(G).add(u),ae=!0,u.subVectors(O,Y),k.dot(u)<0&&(ae=!1),R===1&&(Le=ae),u.subVectors(O,G),u.normalize();const D=Math.abs(k.dot(u));if(D>Number.EPSILON){const K=J/D;u.multiplyScalar(-K),f.subVectors(G,Y),d.copy(f).setLength(K).add(u),x.copy(d).negate();const Q=d.length(),le=f.length();f.divideScalar(le),g.subVectors(O,G);const me=g.length();if(g.divideScalar(me),f.dot(x)<le&&g.dot(x)<me&&(se=!0),w.copy(d).add(G),x.add(G),se){const pe=ae?p:m,X=(w.x-pe.x)*(x.y-pe.y)-(w.y-pe.y)*(x.x-pe.x);(ae&&X<0||!ae&&X>0)&&x.copy(pe)}switch(he=!1,se?ae?(C.copy(x),T.copy(x)):(E.copy(x),_.copy(x)):L(),t.strokeLineJoin){case"bevel":P(ae,se,Z);break;case"round":B(ae,se),ae?N(G,_,E,Z,0):N(G,C,T,Z,1);break;case"miter":case"miter-clip":default:const pe=J*t.strokeMiterLimit/Q;if(pe<1)if(t.strokeLineJoin!=="miter-clip"){P(ae,se,Z);break}else B(ae,se),ae?(g.subVectors(w,_).multiplyScalar(pe).add(_),v.subVectors(w,E).multiplyScalar(pe).add(E),U(_,Z,0),U(g,Z,0),U(G,Z,.5),U(G,Z,.5),U(g,Z,0),U(v,Z,0),U(G,Z,.5),U(v,Z,0),U(E,Z,0)):(g.subVectors(w,T).multiplyScalar(pe).add(T),v.subVectors(w,C).multiplyScalar(pe).add(C),U(T,Z,1),U(g,Z,1),U(G,Z,.5),U(G,Z,.5),U(g,Z,1),U(v,Z,1),U(G,Z,.5),U(v,Z,1),U(C,Z,1));else se?(ae?(U(p,$,1),U(m,$,0),U(w,Z,0),U(p,$,1),U(w,Z,0),U(x,Z,1)):(U(p,$,1),U(m,$,0),U(w,Z,1),U(m,$,0),U(x,Z,0),U(w,Z,1)),ae?E.copy(w):C.copy(w)):ae?(U(_,Z,0),U(w,Z,0),U(G,Z,.5),U(G,Z,.5),U(w,Z,0),U(E,Z,0)):(U(T,Z,1),U(w,Z,1),U(G,Z,.5),U(G,Z,.5),U(w,Z,1),U(C,Z,1)),he=!0;break}}else L()}else L();!z&&R===I-1&&ne(e[0],b,A,ae,!0,$),$=Z,Y=G,m.copy(E),p.copy(C)}if(!z)ne(G,_,T,ae,!1,Z);else if(se&&r){let R=w,k=x;Le!==ae&&(R=x,k=w),ae?(he||Le)&&(k.toArray(r,0*3),k.toArray(r,3*3),he&&R.toArray(r,1*3)):(he||!Le)&&(k.toArray(r,1*3),k.toArray(r,3*3),he&&R.toArray(r,0*3))}if(r){const R=[new de,new de,new de],k=l*3;for(let D=k;D<Ke;D+=9)R[0].set(r[D],r[D+1]),R[1].set(r[D+3],r[D+4]),R[2].set(r[D+6],r[D+7]),Ln.area(R)<0&&(r[D+3]=R[0].x,r[D+4]=R[0].y)}return Ce;function $e(R,k,D){return D.subVectors(k,R),D.set(-D.y,D.x).normalize()}function U(R,k,D){r&&(r[Ke]=R.x,r[Ke+1]=R.y,r[Ke+2]=0,a&&(a[Ke]=0,a[Ke+1]=0,a[Ke+2]=1),Ke+=3,o&&(o[Ye]=k,o[Ye+1]=D,Ye+=2)),Ce+=3}function N(R,k,D,K,Q){c.copy(k).sub(R).normalize(),h.copy(D).sub(R).normalize();let le=Math.PI;const me=c.dot(h);Math.abs(me)<1&&(le=Math.abs(Math.acos(me))),le/=n,u.copy(k);for(let pe=0,X=n-1;pe<X;pe++)f.copy(u).rotateAround(R,le),U(u,K,Q),U(f,K,Q),U(R,K,.5),u.copy(f);U(u,K,Q),U(D,K,Q),U(R,K,.5)}function L(){U(p,$,1),U(m,$,0),U(_,Z,0),U(p,$,1),U(_,Z,0),U(T,Z,1)}function P(R,k,D){k?R?(U(p,$,1),U(m,$,0),U(_,Z,0),U(p,$,1),U(_,Z,0),U(x,Z,1),U(_,D,0),U(E,D,0),U(x,D,.5)):(U(p,$,1),U(m,$,0),U(T,Z,1),U(m,$,0),U(x,Z,0),U(T,Z,1),U(T,D,1),U(x,D,0),U(C,D,1)):R?(U(_,D,0),U(E,D,0),U(G,D,.5)):(U(T,D,1),U(C,D,0),U(G,D,.5))}function B(R,k){k&&(R?(U(p,$,1),U(m,$,0),U(_,Z,0),U(p,$,1),U(_,Z,0),U(x,Z,1),U(_,$,0),U(G,Z,.5),U(x,Z,1),U(G,Z,.5),U(E,$,0),U(x,Z,1)):(U(p,$,1),U(m,$,0),U(T,Z,1),U(m,$,0),U(x,Z,0),U(T,Z,1),U(T,$,1),U(x,Z,0),U(G,Z,.5),U(G,Z,.5),U(x,Z,0),U(C,$,1)))}function ne(R,k,D,K,Q,le){switch(t.strokeLineCap){case"round":Q?N(R,D,k,le,.5):N(R,k,D,le,.5);break;case"square":if(Q)c.subVectors(k,R),h.set(c.y,-c.x),u.addVectors(c,h).add(R),f.subVectors(h,c).add(R),K?(u.toArray(r,1*3),f.toArray(r,0*3),f.toArray(r,3*3)):(u.toArray(r,1*3),o[3*2+1]===1?f.toArray(r,3*3):u.toArray(r,3*3),f.toArray(r,0*3));else{c.subVectors(D,R),h.set(c.y,-c.x),u.addVectors(c,h).add(R),f.subVectors(h,c).add(R);const me=r.length;K?(u.toArray(r,me-1*3),f.toArray(r,me-2*3),f.toArray(r,me-4*3)):(f.toArray(r,me-2*3),u.toArray(r,me-1*3),f.toArray(r,me-4*3))}break}}function _e(R){let k=!1;for(let K=1,Q=R.length-1;K<Q;K++)if(R[K].distanceTo(R[K+1])<i){k=!0;break}if(!k)return R;const D=[];D.push(R[0]);for(let K=1,Q=R.length-1;K<Q;K++)R[K].distanceTo(R[K+1])>=i&&D.push(R[K]);return D.push(R[R.length-1]),D}}}const vl=/^\s*url\(\s*(?:["']\s*)?#([^)'"\s]+)(?:\s*["'])?\s*\)\s*$/;function qp(s,e,t=256){if(!s||!Array.isArray(s.stops)||s.stops.length===0)return null;const n=e.userData.transform,i=s.gradientUnits==="objectBoundingBox";let r=null;if(i&&(r=Pp(e,n),r===null))return null;function a(u,f,d){d.set(u,f,1),s.gradientTransform&&d.applyMatrix3(s.gradientTransform),i&&d.set(r.minX+d.x*r.width,r.minY+d.y*r.height,1),n&&d.applyMatrix3(n)}const o=document.createElement("canvas");let l;if(s.type==="linearGradient"){o.width=t,o.height=1;const u=o.getContext("2d"),f=u.createLinearGradient(0,0,t,0);Ml(f,s.stops),u.fillStyle=f,u.fillRect(0,0,t,1);const d=new F,g=new F;a(s.x1,s.y1,d),a(s.x2,s.y2,g);const v=g.x-d.x,m=g.y-d.y,p=v*v+m*m||1e-20,b=v/p,A=m/p,_=-(b*d.x+A*d.y);l=new Ve().set(b,A,_,0,0,.5,0,0,1)}else{let u=s.cx,f=s.cy,d=s.fx,g=s.fy,v=s.r;if(s.gradientTransform){const x=new F;x.set(u,f,1).applyMatrix3(s.gradientTransform),u=x.x,f=x.y,x.set(d,g,1).applyMatrix3(s.gradientTransform),d=x.x,g=x.y}if(i&&(u=r.minX+u*r.width,f=r.minY+f*r.height,d=r.minX+d*r.width,g=r.minY+g*r.height,v=v*Math.sqrt((r.width*r.width+r.height*r.height)/2)),v<=0)return null;o.width=t,o.height=t;const m=o.getContext("2d"),p=u-v,b=f-v,A=2*v,_=t/A;m.setTransform(_,0,0,_,-p*_,-b*_);const T=m.createRadialGradient(d,g,0,u,f,v);Ml(T,s.stops),m.fillStyle=T,m.fillRect(p,b,A,A);const E=n?n.clone().invert():new Ve;l=new Ve().set(1/A,0,-p/A,0,1/A,-b/A,0,0,1).multiply(E)}const c=new Bc(o);c.colorSpace=es,c.flipY=!1,c.matrixAutoUpdate=!1,c.matrix=l;const h=s.spreadMethod==="reflect"?1002:s.spreadMethod==="repeat"?1e3:1001;return c.wrapS=h,c.wrapT=h,c}function Pp(s,e){const t=e?e.clone().invert():null,n=new de,i=new Kr;for(const r of s.subPaths)for(const a of r.getPoints())n.copy(a),t&&n.applyMatrix3(t),i.expandByPoint(n);return i.isEmpty()?null:{minX:i.min.x,minY:i.min.y,width:i.max.x-i.min.x,height:i.max.y-i.min.y}}function Ml(s,e){const t=new He;for(const n of e){let i=n.color;if(n.opacity<1){t.setStyle(n.color,es);const r=/rgb\(([^)]+)\)/.exec(t.getStyle(es));r&&(i=`rgba(${r[1]},${n.opacity})`)}s.addColorStop(Math.max(0,Math.min(1,n.offset)),i)}}function Sl(s,e){if(e===0)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(e===2||e===1){let t=s.getIndex();if(t===null){const r=[],a=s.getAttribute("position");if(a!==void 0){for(let o=0;o<a.count;o++)r.push(o);s.setIndex(r),t=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}const n=t.count-2,i=[];if(e===2)for(let r=1;r<=n;r++)i.push(t.getX(0)),i.push(t.getX(r)),i.push(t.getX(r+1));else for(let r=0;r<n;r++)r%2===0?(i.push(t.getX(r)),i.push(t.getX(r+1)),i.push(t.getX(r+2))):(i.push(t.getX(r+2)),i.push(t.getX(r+1)),i.push(t.getX(r)));return i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),s.setIndex(i),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),s}function Lp(s){const e=new Map,t=new Map,n=s.clone();return yl(s,n,function(i,r){e.set(r,i),t.set(i,r)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;const r=i,a=e.get(i),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),n}function yl(s,e,t){t(s,e);for(let n=0;n<s.children.length;n++)yl(s.children[n],e.children[n],t)}class Ip extends Nn{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Op(t)}),this.register(function(t){return new Bp(t)}),this.register(function(t){return new Kp(t)}),this.register(function(t){return new Jp(t)}),this.register(function(t){return new Zp(t)}),this.register(function(t){return new zp(t)}),this.register(function(t){return new kp(t)}),this.register(function(t){return new Vp(t)}),this.register(function(t){return new Hp(t)}),this.register(function(t){return new Fp(t)}),this.register(function(t){return new Wp(t)}),this.register(function(t){return new Gp(t)}),this.register(function(t){return new Yp(t)}),this.register(function(t){return new Xp(t)}),this.register(function(t){return new Dp(t)}),this.register(function(t){return new Tl(t,tt.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Tl(t,tt.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new $p(t)})}load(e,t,n,i){const r=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const c=Ji.extractUrlBase(e);a=Ji.resolveURL(c,this.path)}else a=Ji.extractUrlBase(e);this.manager.itemStart(e);const o=function(c){i?i(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new Fs(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,a,function(h){t(h),r.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let r;const a={},o={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===bl){try{a[tt.KHR_BINARY_GLTF]=new Qp(e)}catch(u){i&&i(u);return}r=JSON.parse(a[tt.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new u0(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const u=this.pluginCallbacks[h](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[u.name]=u,a[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){const u=r.extensionsUsed[h],f=r.extensionsRequired||[];switch(u){case tt.KHR_MATERIALS_UNLIT:a[u]=new Up;break;case tt.KHR_DRACO_MESH_COMPRESSION:a[u]=new jp(r,this.dracoLoader);break;case tt.KHR_TEXTURE_TRANSFORM:a[u]=new e0;break;case tt.KHR_MESH_QUANTIZATION:a[u]=new t0;break;default:f.indexOf(u)>=0&&o[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,i)}parseAsync(e,t){const n=this;return new Promise(function(i,r){n.parse(e,t,i,r)})}}function Np(){let s={};return{get:function(e){return s[e]},add:function(e,t){s[e]=t},remove:function(e){delete s[e]},removeAll:function(){s={}}}}function Mt(s,e,t){const n=s.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}const tt={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class Dp{constructor(e){this.parser=e,this.name=tt.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){const r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let i=t.cache.get(n);if(i)return i;const r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e];let c;const h=new He(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],Ot);const u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Bo(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Oo(h),c.distance=u;break;case"spot":c=new Yh(h),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),un(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}}class Up{constructor(){this.name=tt.KHR_MATERIALS_UNLIT}getMaterialType(){return yn}extendParams(e,t,n){const i=[];e.color=new He(1,1,1),e.opacity=1;const r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],Ot),e.opacity=a[3]}r.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",r.baseColorTexture,Et))}return Promise.all(i)}}class Fp{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const n=Mt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}}class Op{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?tn:null}extendMaterialParams(e,t){const n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){const r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new de(r,r)}return Promise.all(i)}}class Bp{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?tn:null}extendMaterialParams(e,t){const n=Mt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}}class Gp{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?tn:null}extendMaterialParams(e,t){const n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(i)}}class zp{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_SHEEN}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?tn:null}extendMaterialParams(e,t){const n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(t.sheenColor=new He(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){const r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],Ot)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,Et)),n.sheenRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(i)}}class kp{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?tn:null}extendMaterialParams(e,t){const n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(i)}}class Vp{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_VOLUME}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?tn:null}extendMaterialParams(e,t){const n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;const r=n.attenuationColor||[1,1,1];return t.attenuationColor=new He().setRGB(r[0],r[1],r[2],Ot),Promise.all(i)}}class Hp{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_IOR}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?tn:null}extendMaterialParams(e,t){const n=Mt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}}class Wp{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?tn:null}extendMaterialParams(e,t){const n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));const r=n.specularColorFactor||[1,1,1];return t.specularColor=new He().setRGB(r[0],r[1],r[2],Ot),n.specularColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,Et)),Promise.all(i)}}class Xp{constructor(e){this.parser=e,this.name=tt.EXT_MATERIALS_BUMP}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?tn:null}extendMaterialParams(e,t){const n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(i)}}class Yp{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?tn:null}extendMaterialParams(e,t){const n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(i)}}class Kp{constructor(e){this.parser=e,this.name=tt.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;const r=i.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}}class Jp{constructor(e){this.parser=e,this.name=tt.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class Zp{constructor(e){this.parser=e,this.name=tt.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class Tl{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const i=n.extensions[this.name],r=this.parser.getDependency("buffer",i.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){const l=i.byteOffset||0,c=i.byteLength||0,h=i.count,u=i.byteStride,f=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,u,f,i.mode,i.filter).then(function(d){return d.buffer}):a.ready.then(function(){const d=new ArrayBuffer(h*u);return a.decodeGltfBuffer(new Uint8Array(d),h,u,f,i.mode,i.filter),d})})}else return null}}class $p{constructor(e){this.name=tt.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const i=t.meshes[n.mesh];for(const c of i.primitives)if(c.mode!==Wt.TRIANGLES&&c.mode!==Wt.TRIANGLE_STRIP&&c.mode!==Wt.TRIANGLE_FAN&&c.mode!==void 0)return null;const a=n.extensions[this.name].attributes,o=[],l={};for(const c in a)o.push(this.parser.getDependency("accessor",a[c]).then(h=>(l[c]=h,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{const h=c.pop(),u=h.isGroup?h.children:[h],f=c[0].count,d=[];for(const g of u){const v=new Ze,m=new F,p=new pn,b=new F(1,1,1),A=new ja(g.geometry,g.material,f);for(let T=0;T<f;T++)l.TRANSLATION&&m.fromBufferAttribute(l.TRANSLATION,T),l.ROTATION&&p.fromBufferAttribute(l.ROTATION,T),l.SCALE&&b.fromBufferAttribute(l.SCALE,T),A.setMatrixAt(T,v.compose(m,p,b));let _=null;for(const T in l)if(T==="_COLOR_0"){const E=l[T];A.instanceColor=new ys(E.array,E.itemSize,E.normalized)}else if(T!=="TRANSLATION"&&T!=="ROTATION"&&T!=="SCALE"){if(_===null){const C=A.geometry;_=new Tt,_.name=C.name;for(const x in C.attributes)_.setAttribute(x,C.attributes[x]);for(const x in C.morphAttributes)_.morphAttributes[x]=C.morphAttributes[x];C.index!==null&&_.setIndex(C.index),_.morphTargetsRelative=C.morphTargetsRelative;for(const x of C.groups)_.addGroup(x.start,x.count,x.materialIndex);C.boundingBox!==null&&(_.boundingBox=C.boundingBox.clone()),C.boundingSphere!==null&&(_.boundingSphere=C.boundingSphere.clone()),_.drawRange.start=C.drawRange.start,_.drawRange.count=C.drawRange.count,_.userData=Object.assign({},C.userData),A.geometry=_}const E=l[T];_.setAttribute(T,new ys(E.array,E.itemSize,E.normalized))}gt.prototype.copy.call(A,g),this.parser.assignFinalMaterial(A),d.push(A)}return h.isGroup?(h.clear(),h.add(...d),h):d[0]}))}}const bl="glTF",ts=12,El={JSON:1313821514,BIN:5130562};class Qp{constructor(e){this.name=tt.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,ts),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==bl)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const i=this.header.length-ts,r=new DataView(e,ts);let a=0;for(;a<i;){const o=r.getUint32(a,!0);a+=4;const l=r.getUint32(a,!0);if(a+=4,l===El.JSON){const c=new Uint8Array(e,ts+a,o);this.content=n.decode(c)}else if(l===El.BIN){const c=ts+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class jp{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=tt.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,i=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(const h in a){const u=la[h]||h.toLowerCase();o[u]=a[h]}for(const h in e.attributes){const u=la[h]||h.toLowerCase();if(a[h]!==void 0){const f=n.accessors[e.attributes[h]],d=bi[f.componentType];c[u]=d.name,l[u]=f.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(u,f){i.decodeDracoFile(h,function(d){for(const g in d.attributes){const v=d.attributes[g],m=l[g];m!==void 0&&(v.normalized=m)}u(d)},o,c,Ot,f)})})}}class e0{constructor(){this.name=tt.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){const n=Math.cos(e.rotation),i=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*i,e.offset.x,-e.repeat.x*i,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}}class t0{constructor(){this.name=tt.KHR_MESH_QUANTIZATION}}class Al extends mi{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i*3+i;for(let a=0;a!==i;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,h=i-t,u=(n-t)/h,f=u*u,d=f*u,g=e*c,v=g-c,m=-2*d+3*f,p=d-f,b=1-m,A=p-f+u;for(let _=0;_!==o;_++){const T=a[v+_+o],E=a[v+_+l]*h,C=a[g+_+o],x=a[g+_]*h;r[_]=b*T+A*E+m*C+p*x}return r}}const n0=new pn;class i0 extends Al{interpolate_(e,t,n,i){const r=super.interpolate_(e,t,n,i);return n0.fromArray(r).normalize().toArray(r),r}}const Wt={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},bi={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},wl={9728:1003,9729:1006,9984:1004,9985:1007,9986:1005,9987:1008},Rl={33071:1001,33648:1002,10497:1e3},oa={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},la={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Fn={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},s0={CUBICSPLINE:void 0,LINEAR:2301,STEP:2300},ca={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function r0(s){return s.DefaultMaterial===void 0&&(s.DefaultMaterial=new Xi({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:0})),s.DefaultMaterial}function Jn(s,e,t){for(const n in t.extensions)s[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function un(s,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(s.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function a0(s,e,t){let n=!1,i=!1,r=!1;for(let c=0,h=e.length;c<h;c++){const u=e[c];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(r=!0),n&&i&&r)break}if(!n&&!i&&!r)return Promise.resolve(s);const a=[],o=[],l=[];for(let c=0,h=e.length;c<h;c++){const u=e[c];if(n){const f=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):s.attributes.position;a.push(f)}if(i){const f=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):s.attributes.normal;o.push(f)}if(r){const f=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):s.attributes.color;l.push(f)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){const h=c[0],u=c[1],f=c[2];return n&&(s.morphAttributes.position=h),i&&(s.morphAttributes.normal=u),r&&(s.morphAttributes.color=f),s.morphTargetsRelative=!0,s})}function o0(s,e){if(s.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)s.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(s.morphTargetInfluences.length===t.length){s.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)s.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function l0(s){let e;const t=s.extensions&&s.extensions[tt.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+ha(t.attributes):e=s.indices+":"+ha(s.attributes)+":"+s.mode,s.targets!==void 0)for(let n=0,i=s.targets.length;n<i;n++)e+=":"+ha(s.targets[n]);return e}function ha(s){let e="";const t=Object.keys(s).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+s[t[n]]+";";return e}function ua(s){switch(s){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function c0(s){return s.search(/\.jpe?g($|\?)/i)>0||s.search(/^data\:image\/jpeg/)===0?"image/jpeg":s.search(/\.webp($|\?)/i)>0||s.search(/^data\:image\/webp/)===0?"image/webp":s.search(/\.ktx2($|\?)/i)>0||s.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const h0=new Ze;class u0{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Np,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,r=!1,a=-1;if(typeof navigator!="undefined"&&typeof navigator.userAgent!="undefined"){const o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;const l=o.match(/Version\/(\d+)/);i=n&&l?parseInt(l[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap=="undefined"||n&&i<17||r&&a<98?this.textureLoader=new Hh(this.options.manager):this.textureLoader=new Zh(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Fs(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,i=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){const o={scene:a[0][i.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:i.asset,parser:n,userData:{}};return Jn(r,o,i),un(o,i),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(const l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,r=t.length;i<r;i++){const a=t[i].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let i=0,r=e.length;i<r;i++){const a=e[i];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const i=n.clone(),r=(a,o)=>{const l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(const[c,h]of a.children.entries())r(h,o.children[c])};return r(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const i=e(t[n]);if(i)return i}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let i=0;i<t.length;i++){const r=e(t[i]);r&&n.push(r)}return n}getDependency(e,t){const n=e+":"+t;let i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":i=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[tt.KHR_BINARY_GLTF].body);const i=this.options;return new Promise(function(r,a){n.load(Ji.resolveURL(t.uri,i.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const i=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+i)})}loadAccessor(e){const t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){const a=oa[i.type],o=bi[i.componentType],l=i.normalized===!0,c=new o(i.count*a);return Promise.resolve(new Ft(c,a,l))}const r=[];return i.bufferView!==void 0?r.push(this.getDependency("bufferView",i.bufferView)):r.push(null),i.sparse!==void 0&&(r.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(r).then(function(a){const o=a[0],l=oa[i.type],c=bi[i.componentType],h=c.BYTES_PER_ELEMENT,u=h*l,f=i.byteOffset||0,d=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,g=i.normalized===!0;let v,m;if(d&&d!==u){const p=Math.floor(f/d),b="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+p+":"+i.count;let A=t.cache.get(b);A||(v=new c(o,p*d,i.count*d/h),A=new Ac(v,d/h),t.cache.add(b,A)),m=new _r(A,l,f%d/h,g)}else o===null?v=new c(i.count*l):v=new c(o,f,i.count*l),m=new Ft(v,l,g);if(i.sparse!==void 0){const p=oa.SCALAR,b=bi[i.sparse.indices.componentType],A=i.sparse.indices.byteOffset||0,_=i.sparse.values.byteOffset||0,T=new b(a[1],A,i.sparse.count*p),E=new c(a[2],_,i.sparse.count*l);o!==null&&(m=new Ft(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let C=0,x=T.length;C<x;C++){const w=T[C];if(m.setX(w,E[C*l]),l>=2&&m.setY(w,E[C*l+1]),l>=3&&m.setZ(w,E[C*l+2]),l>=4&&m.setW(w,E[C*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){const t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r];let o=this.textureLoader;if(a.uri){const l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){const i=this,r=this.json,a=r.textures[e],o=r.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);const f=(r.samplers||{})[a.sampler]||{};return h.magFilter=wl[f.magFilter]||1006,h.minFilter=wl[f.minFilter]||1008,h.wrapS=Rl[f.wrapS]||1e3,h.wrapT=Rl[f.wrapT]||1e3,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==1003&&h.minFilter!==1006,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const n=this,i=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());const a=i.images[e],o=self.URL||self.webkitURL;let l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(u){c=!0;const f=new Blob([u],{type:a.mimeType});return l=o.createObjectURL(f),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(l).then(function(u){return new Promise(function(f,d){let g=f;t.isImageBitmapLoader===!0&&(g=function(v){const m=new At(v);m.needsUpdate=!0,f(m)}),t.load(Ji.resolveURL(u,r.path),g,void 0,d)})}).then(function(u){return c===!0&&o.revokeObjectURL(l),un(u,a),u.userData.mimeType=a.mimeType||c0(a.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){const r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[tt.KHR_TEXTURE_TRANSFORM]){const o=n.extensions!==void 0?n.extensions[tt.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const l=r.associations.get(a);a=r.extensions[tt.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,l)}}return i!==void 0&&(a.colorSpace=i),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const i=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new ro,en.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){const o="LineBasicMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new eo,en.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(i||r||a){let o="ClonedMaterial:"+n.uuid+":";i&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),r&&(l.vertexColors=!0),a&&(l.flatShading=!0),i&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return Xi}loadMaterial(e){const t=this,n=this.json,i=this.extensions,r=n.materials[e];let a;const o={},l=r.extensions||{},c=[];if(l[tt.KHR_MATERIALS_UNLIT]){const u=i[tt.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),c.push(u.extendParams(o,r,t))}else{const u=r.pbrMetallicRoughness||{};if(o.color=new He(1,1,1),o.opacity=1,Array.isArray(u.baseColorFactor)){const f=u.baseColorFactor;o.color.setRGB(f[0],f[1],f[2],Ot),o.opacity=f[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",u.baseColorTexture,Et)),o.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,o.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(f){return f.getMaterialType&&f.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(f){return f.extendMaterialParams&&f.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=2);const h=r.alphaMode||ca.OPAQUE;if(h===ca.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===ca.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==yn&&(c.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new de(1,1),r.normalTexture.scale!==void 0)){const u=r.normalTexture.scale;o.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&a!==yn&&(c.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==yn){const u=r.emissiveFactor;o.emissive=new He().setRGB(u[0],u[1],u[2],Ot)}return r.emissiveTexture!==void 0&&a!==yn&&c.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,Et)),Promise.all(c).then(function(){const u=new a(o);return r.name&&(u.name=r.name),un(u,r),t.associations.set(u,{materials:e}),r.extensions&&Jn(i,u,r),u})}createUniqueName(e){const t=ht.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,i=this.primitiveCache;function r(o){return n[tt.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return Cl(l,o,t)})}const a=[];for(let o=0,l=e.length;o<l;o++){const c=e[o],h=l0(c),u=i[h];if(u)a.push(u.promise);else{let f;c.extensions&&c.extensions[tt.KHR_DRACO_MESH_COMPRESSION]?f=r(c):f=Cl(new Tt,c,t),c.mode===Wt.TRIANGLE_STRIP?f=f.then(d=>Sl(d,1)):c.mode===Wt.TRIANGLE_FAN&&(f=f.then(d=>Sl(d,2))),i[h]={primitive:c,promise:f},a.push(f)}}return Promise.all(a)}loadMesh(e){const t=this,n=this.json,i=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let l=0,c=a.length;l<c;l++){const h=a[l].material===void 0?r0(this.cache):this.getDependency("material",a[l].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(async function(l){const c=l.slice(0,l.length-1),h=l[l.length-1],u=[];for(let d=0,g=h.length;d<g;d++){const v=h[d],m=a[d];let p;const b=c[d];if(m.mode===Wt.TRIANGLES||m.mode===Wt.TRIANGLE_STRIP||m.mode===Wt.TRIANGLE_FAN||m.mode===void 0){const A=r.isSkinnedMesh===!0,_=v.hasAttribute("skinIndex")&&v.hasAttribute("skinWeight");A&&_===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),p=A&&_?new Lc(v,b):new xt(v,b),p.isSkinnedMesh===!0&&p.normalizeSkinWeights()}else if(m.mode===Wt.LINES)p=new Uc(v,b);else if(m.mode===Wt.LINE_STRIP)p=new wr(v,b);else if(m.mode===Wt.LINE_LOOP)p=new Fc(v,b);else if(m.mode===Wt.POINTS)p=new Oc(v,b);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(p.geometry.morphAttributes).length>0&&o0(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),un(p,r),m.extensions&&Jn(i,p,m),t.assignFinalMaterial(p),u.push(p)}for(let d=0,g=u.length;d<g;d++)t.associations.set(u[d],{meshes:e,primitives:d});if(u.length===1)return r.extensions&&Jn(i,u[0],r),u[0];const f=new kt;r.extensions&&Jn(i,f,r),t.associations.set(f,{meshes:e});for(let d=0,g=u.length;d<g;d++)f.add(u[d]);return f})}loadCamera(e){let t;const n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Dt(cc.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new zs(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),un(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let i=0,r=t.joints.length;i<r;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){const r=i.pop(),a=i,o=[],l=[];for(let c=0,h=a.length;c<h;c++){const u=a[c];if(u){o.push(u);const f=new Ze;r!==null&&f.fromArray(r.array,c*16),l.push(f)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new br(o,l)})}loadAnimation(e){const t=this.json,n=this,i=t.animations[e],r=i.name?i.name:"animation_"+e,a=[],o=[],l=[],c=[],h=[];for(let u=0,f=i.channels.length;u<f;u++){const d=i.channels[u],g=i.samplers[d.sampler],v=d.target,m=v.node,p=i.parameters!==void 0?i.parameters[g.input]:g.input,b=i.parameters!==void 0?i.parameters[g.output]:g.output;v.node!==void 0&&(a.push(this.getDependency("node",m)),o.push(this.getDependency("accessor",p)),l.push(this.getDependency("accessor",b)),c.push(g),h.push(v))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(u){const f=u[0],d=u[1],g=u[2],v=u[3],m=u[4],p=[];for(let A=0,_=f.length;A<_;A++){const T=f[A],E=d[A],C=g[A],x=v[A],w=m[A];if(T===void 0)continue;T.updateMatrix&&T.updateMatrix();const I=n._createAnimationTracks(T,E,C,x,w);if(I)for(let z=0;z<I.length;z++)p.push(I[z])}const b=new Fh(r,void 0,p);return un(b,i),b})}createNodeMesh(e){const t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(r){const a=n._getNodeRef(n.meshCache,i.mesh,r);return i.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=i.weights.length;l<c;l++)o.morphTargetInfluences[l]=i.weights[l]}),a})}loadNode(e){const t=this.json,n=this,i=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=i.children||[];for(let c=0,h=o.length;c<h;c++)a.push(n.getDependency("node",o[c]));const l=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([r,Promise.all(a),l]).then(function(c){const h=c[0],u=c[1],f=c[2];f!==null&&h.traverse(function(d){d.isSkinnedMesh&&d.bind(f,h0)});for(let d=0,g=u.length;d<g;d++)h.add(u[d]);if(h.userData.pivot!==void 0&&u.length>0){const d=h.userData.pivot,g=u[0];h.pivot=new F().fromArray(d),h.position.x-=d[0],h.position.y-=d[1],h.position.z-=d[2],g.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const r=t.nodes[e],a=r.name?i.createUniqueName(r.name):"",o=[],l=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),r.camera!==void 0&&o.push(i.getDependency("camera",r.camera).then(function(c){return i._getNodeRef(i.cameraCache,r.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let h;if(r.isBone===!0?h=new Ja:c.length>1?h=new kt:c.length===1?h=c[0]:h=new gt,h!==c[0])for(let u=0,f=c.length;u<f;u++)h.add(c[u]);if(r.name&&(h.userData.name=r.name,h.name=a),un(h,r),r.extensions&&Jn(n,h,r),r.matrix!==void 0){const u=new Ze;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!i.associations.has(h))i.associations.set(h,{});else if(r.mesh!==void 0&&i.meshCache.refs[r.mesh]>1){const u=i.associations.get(h);i.associations.set(h,{...u})}return i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],i=this,r=new kt;n.name&&(r.name=i.createUniqueName(n.name)),un(r,n),n.extensions&&Jn(t,r,n);const a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(i.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let h=0,u=l.length;h<u;h++){const f=l[h];f.parent!==null?r.add(Lp(f)):r.add(f)}const c=h=>{const u=new Map;for(const[f,d]of i.associations)(f instanceof en||f instanceof At)&&u.set(f,d);return h.traverse(f=>{const d=i.associations.get(f);d!=null&&u.set(f,d)}),u};return i.associations=c(r),r})}_createAnimationTracks(e,t,n,i,r){const a=[],o=e.name?e.name:e.uuid,l=[];function c(d){d.morphTargetInfluences&&l.push(d.name?d.name:d.uuid)}Fn[r.path]===Fn.weights?(c(e),e.isGroup&&e.children.forEach(c)):l.push(o);let h;switch(Fn[r.path]){case Fn.weights:h=Yi;break;case Fn.rotation:h=Ki;break;case Fn.translation:case Fn.scale:h=Us;break;default:switch(n.itemSize){case 1:h=Yi;break;case 2:case 3:default:h=Us;break}break}const u=i.interpolation!==void 0?s0[i.interpolation]:2301,f=this._getArrayFromAccessor(n);for(let d=0,g=l.length;d<g;d++){const v=new h(l[d]+"."+Fn[r.path],t.array,f,u);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(v),a.push(v)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=ua(t.constructor),i=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)i[r]=t[r]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const i=this instanceof Ki?i0:Al;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function f0(s,e,t){const n=e.attributes,i=new Qt;if(n.POSITION!==void 0){const o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(i.set(new F(l[0],l[1],l[2]),new F(c[0],c[1],c[2])),o.normalized){const h=ua(bi[o.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=e.targets;if(r!==void 0){const o=new F,l=new F;for(let c=0,h=r.length;c<h;c++){const u=r[c];if(u.POSITION!==void 0){const f=t.json.accessors[u.POSITION],d=f.min,g=f.max;if(d!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(d[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(d[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(d[2]),Math.abs(g[2]))),f.normalized){const v=ua(bi[f.componentType]);l.multiplyScalar(v)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(o)}s.boundingBox=i;const a=new rn;i.getCenter(a.center),a.radius=i.min.distanceTo(i.max)/2,s.boundingSphere=a}function Cl(s,e,t){const n=e.attributes,i=[];function r(a,o){return t.getDependency("accessor",a).then(function(l){s.setAttribute(o,l)})}for(const a in n){const o=la[a]||a.toLowerCase();o in s.attributes||i.push(r(n[a],o))}if(e.indices!==void 0&&!s.index){const a=t.getDependency("accessor",e.indices).then(function(o){s.setIndex(o)});i.push(a)}return nt.workingColorSpace!==Ot&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${nt.workingColorSpace}" not supported.`),un(s,e),f0(s,e,t),Promise.all(i).then(function(){return e.targets!==void 0?a0(s,e.targets,t):s})}class d0 extends Oa{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;const e=new Xn;e.deleteAttribute("uv");const t=new Xi({side:1}),n=new Xi,i=new Oo(16777215,900,28,2);i.position.set(.418,16.199,.3),this.add(i);const r=new xt(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new ja(e,n,6),o=new gt;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const l=new xt(e,Ei(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);const c=new xt(e,Ei(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);const h=new xt(e,Ei(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);const u=new xt(e,Ei(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);const f=new xt(e,Ei(20));f.position.set(3.235,11.486,-12.541),f.scale.set(2.5,2,.1),this.add(f);const d=new xt(e,Ei(100));d.position.set(0,20,0),d.scale.set(1,.1,1),this.add(d)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function Ei(s){return new Eh({color:0,emissive:16777215,emissiveIntensity:s})}const p0={glyphs:{0:{ha:1417,x_min:82,x_max:1334,o:"m 708 -20 l 708 -20 q 372 71 511 -20 q 157 333 232 162 q 82 744 82 503 l 82 744 q 157 1157 82 985 q 372 1419 232 1328 q 708 1510 511 1510 l 708 1510 q 1046 1419 905 1510 q 1260 1156 1186 1327 q 1334 744 1334 985 l 1334 744 q 1260 333 1334 503 q 1046 71 1186 162 q 708 -20 906 -20 m 708 269 l 708 269 q 852 324 793 269 q 941 485 910 379 q 971 744 971 591 l 971 744 q 941 1005 971 898 q 852 1167 910 1111 q 709 1223 793 1223 l 709 1223 q 566 1167 624 1223 q 477 1005 507 1111 q 446 744 446 898 l 446 744 q 476 485 446 591 q 565 324 506 379 q 708 269 624 269"},1:{ha:904,x_min:91,x_max:788,o:"m 423 1490 l 788 1490 l 788 0 l 436 0 l 436 1183 l 426 1183 l 91 952 l 91 1262 l 423 1490"},2:{ha:1306,x_min:91,x_max:1209,o:"m 1209 0 l 111 0 l 111 253 l 653 732 q 759 836 715 788 q 825 930 802 883 q 848 1034 848 977 l 848 1034 q 821 1141 848 1096 q 746 1209 793 1185 q 636 1233 698 1233 l 636 1233 q 526 1208 573 1233 q 453 1135 479 1183 q 427 1019 427 1087 l 427 1019 l 91 1019 q 160 1280 91 1170 q 351 1450 228 1390 q 637 1510 474 1510 l 637 1510 q 930 1454 805 1510 q 1122 1296 1054 1397 q 1190 1061 1190 1194 l 1190 1061 q 1157 894 1190 976 q 1036 709 1123 811 q 786 467 948 607 l 786 467 l 601 295 l 601 285 l 1209 285 l 1209 0"},3:{ha:1345,x_min:88,x_max:1262,o:"m 669 -20 l 669 -20 q 370 38 500 -20 q 164 199 239 96 q 88 435 89 301 l 88 435 l 442 435 q 474 348 444 386 q 556 289 504 310 q 672 268 607 268 l 672 268 q 787 291 737 268 q 864 355 836 314 q 892 449 892 395 l 892 449 q 862 544 892 503 q 775 609 831 585 q 642 632 718 632 l 642 632 l 497 632 l 497 884 l 642 884 q 759 907 708 884 q 839 970 810 930 q 867 1062 867 1009 l 867 1062 q 843 1152 867 1113 q 775 1212 818 1190 q 673 1233 731 1233 l 673 1233 q 563 1212 612 1233 q 485 1152 514 1190 q 456 1061 456 1114 l 456 1061 l 117 1061 q 191 1295 118 1193 q 389 1453 263 1396 q 674 1510 514 1510 l 674 1510 q 953 1454 832 1510 q 1141 1302 1074 1398 q 1208 1084 1208 1205 l 1208 1084 q 1127 878 1208 960 q 916 776 1045 795 l 916 776 l 916 765 q 1107 706 1030 752 q 1223 587 1184 659 q 1262 422 1262 514 l 1262 422 q 1187 194 1262 294 q 977 37 1111 93 q 669 -20 843 -20"},4:{ha:1410,x_min:93,x_max:1329,o:"m 811 249 l 93 249 l 93 525 l 705 1490 l 1150 1490 l 1150 528 l 1329 528 l 1329 249 l 1150 249 l 1150 0 l 811 0 l 811 249 m 444 528 l 819 528 l 819 1114 l 807 1114 l 444 540 l 444 528"},5:{ha:1298,x_min:79,x_max:1215,o:"m 642 -20 l 642 -20 q 353 39 479 -20 q 155 200 227 97 q 79 435 82 302 l 79 435 l 423 435 q 454 340 424 381 q 534 276 484 298 q 642 253 583 253 l 642 253 q 763 283 710 253 q 845 368 815 313 q 874 494 874 422 l 874 494 q 844 622 874 567 q 761 708 814 677 q 639 738 708 738 l 639 738 q 515 709 573 738 q 427 631 457 680 l 427 631 l 114 690 l 179 1490 l 1129 1490 l 1129 1204 l 470 1204 l 436 850 l 444 850 q 564 950 482 911 q 750 989 646 989 l 750 989 q 935 954 850 989 q 1083 853 1020 918 q 1181 699 1146 788 q 1215 503 1215 610 l 1215 503 q 1144 232 1215 350 q 943 47 1072 114 q 642 -20 814 -20"},6:{ha:1355,x_min:82,x_max:1273,o:"m 699 -20 l 699 -20 q 467 20 578 -20 q 270 146 356 59 q 133 374 183 232 q 82 718 82 515 l 82 718 q 126 1050 82 903 q 253 1299 170 1196 q 450 1456 335 1402 q 706 1510 565 1510 l 706 1510 q 981 1450 862 1510 q 1171 1288 1099 1389 q 1256 1061 1243 1186 l 1256 1061 l 909 1061 q 838 1171 893 1133 q 706 1208 783 1208 l 706 1208 q 553 1154 614 1208 q 462 1002 492 1100 q 431 768 431 903 l 431 768 l 440 768 q 529 883 472 835 q 660 957 585 931 q 817 982 735 982 l 817 982 q 1054 921 951 982 q 1215 751 1156 859 q 1273 505 1273 643 l 1273 505 q 1200 232 1273 350 q 998 47 1127 113 q 699 -20 869 -20 m 696 253 l 696 253 q 817 285 764 253 q 900 371 869 316 q 931 494 931 425 l 931 494 q 901 617 931 562 q 818 703 870 671 q 697 734 765 734 l 697 734 q 606 716 648 734 q 531 664 563 697 q 482 588 499 631 q 464 493 464 544 l 464 493 q 494 372 464 426 q 577 285 524 317 q 696 253 630 253"},7:{ha:1204,x_min:66,x_max:1138,o:"m 532 0 l 168 0 l 771 1195 l 771 1204 l 66 1204 l 66 1490 l 1138 1490 l 1138 1201 l 532 0"},8:{ha:1360,x_min:82,x_max:1278,o:"m 679 -20 l 679 -20 q 372 36 506 -20 q 160 187 237 91 q 82 402 82 282 l 82 402 q 127 572 82 495 q 247 701 171 649 q 415 768 322 753 l 415 768 l 415 777 q 215 894 293 802 q 136 1108 136 985 l 136 1108 q 207 1315 136 1224 q 400 1458 277 1405 q 679 1510 523 1510 l 679 1510 q 959 1458 836 1510 q 1153 1314 1082 1405 q 1224 1108 1224 1223 l 1224 1108 q 1145 894 1224 985 q 945 777 1066 802 l 945 777 l 945 768 q 1114 701 1038 753 q 1234 572 1189 649 q 1278 402 1278 495 l 1278 402 q 1201 187 1278 282 q 988 36 1123 91 q 679 -20 853 -20 m 679 231 l 679 231 q 798 257 747 231 q 878 328 849 282 q 907 432 907 373 l 907 432 q 878 536 907 491 q 797 608 848 581 q 679 634 746 634 l 679 634 q 563 608 614 634 q 483 537 512 582 q 453 432 453 491 l 453 432 q 482 328 453 373 q 562 257 510 283 q 679 231 613 231 m 679 884 l 679 884 q 782 908 737 884 q 852 974 826 932 q 878 1068 878 1015 l 878 1068 q 853 1163 878 1122 q 783 1226 827 1203 q 679 1249 738 1249 l 679 1249 q 577 1226 622 1249 q 507 1163 532 1203 q 482 1068 482 1122 l 482 1068 q 507 974 482 1015 q 577 908 532 932 q 679 884 622 884"},9:{ha:1355,x_min:82,x_max:1273,o:"m 649 -23 l 649 -23 q 375 38 494 -23 q 185 202 256 99 q 99 430 113 305 l 99 430 l 447 430 q 518 319 463 358 q 649 279 572 279 l 649 279 q 803 334 741 279 q 894 488 864 388 q 924 722 924 588 l 924 722 l 915 722 q 828 608 885 656 q 696 535 770 560 q 539 509 622 509 l 539 509 q 302 571 405 509 q 141 740 199 632 q 82 986 82 848 l 82 986 q 155 1261 82 1141 q 358 1447 228 1380 q 657 1513 487 1514 l 657 1513 q 890 1473 779 1513 q 1086 1346 1000 1433 q 1223 1118 1172 1259 q 1273 772 1273 976 l 1273 772 q 1229 440 1273 587 q 1103 190 1185 293 q 906 32 1021 86 q 649 -23 791 -23 m 658 757 l 658 757 q 751 776 708 757 q 826 827 794 794 q 875 904 857 860 q 892 998 892 947 l 892 998 q 862 1119 892 1065 q 780 1205 832 1173 q 659 1237 727 1237 l 659 1237 q 540 1206 593 1237 q 456 1120 486 1174 q 425 997 425 1065 l 425 997 q 456 874 425 928 q 539 789 486 820 q 658 757 591 757"}," ":{ha:448,x_min:0,x_max:0,o:""},"!":{ha:734,x_min:172,x_max:562,o:"m 527 469 l 207 469 l 181 1490 l 553 1490 l 527 469 m 367 -21 l 367 -21 q 226 29 280 -21 q 172 162 172 79 l 172 162 q 226 296 172 245 q 367 346 280 346 l 367 346 q 509 296 455 346 q 562 162 562 245 l 562 162 q 509 29 562 79 q 367 -21 455 -21"},'"':{ha:1201,x_min:199,x_max:1002,o:"m 494 848 l 233 848 l 199 1490 l 527 1490 l 494 848 m 969 848 l 708 848 l 674 1490 l 1002 1490 l 969 848"},"#":{ha:1342,x_min:17,x_max:1324,o:"m 938 0 l 681 0 l 740 357 l 474 357 l 416 0 l 158 0 l 216 357 l 17 357 l 61 615 l 259 615 l 301 875 l 102 875 l 146 1133 l 344 1133 l 402 1490 l 660 1490 l 602 1133 l 867 1133 l 926 1490 l 1184 1490 l 1125 1133 l 1324 1133 l 1281 875 l 1082 875 l 1040 615 l 1240 615 l 1196 357 l 997 357 l 938 0 m 559 875 l 517 615 l 782 615 l 825 875 l 559 875"},$:{ha:1352,x_min:72,x_max:1280,o:"m 750 -194 l 630 -194 l 630 -18 q 367 36 482 -11 l 367 36 q 152 206 229 92 q 72 492 75 320 l 72 492 l 411 492 q 451 371 416 420 q 546 298 485 322 l 546 298 q 630 276 584 282 l 630 276 l 630 612 l 524 637 q 221 781 331 681 q 111 1049 111 881 l 111 1049 q 186 1291 111 1187 q 392 1453 261 1395 l 392 1453 q 630 1508 498 1499 l 630 1508 l 630 1684 l 750 1684 l 750 1508 q 991 1452 886 1500 l 991 1452 q 1188 1289 1118 1393 q 1260 1046 1258 1184 l 1260 1046 l 921 1046 q 855 1172 914 1127 l 855 1172 q 750 1213 814 1203 l 750 1213 l 750 894 l 825 877 q 1018 815 933 854 q 1161 720 1102 775 q 1250 593 1219 665 q 1280 432 1280 521 l 1280 432 q 1210 190 1280 291 q 1008 34 1139 88 l 1008 34 q 750 -19 897 -11 l 750 -19 l 750 -194 m 750 583 l 750 277 q 813 293 784 282 l 813 293 q 895 349 866 313 q 923 433 923 385 l 923 433 q 897 506 923 476 q 817 559 870 536 l 817 559 q 750 583 788 572 l 750 583 m 630 925 l 630 925 l 630 1213 q 572 1199 598 1208 l 572 1199 q 500 1148 524 1180 q 476 1073 476 1115 l 476 1073 q 503 996 476 1027 q 580 943 530 964 l 580 943 q 630 925 603 933"},"%":{ha:2108,x_min:168,x_max:1940,o:"m 506 757 l 506 757 q 321 804 396 757 q 207 928 245 850 q 168 1096 168 1005 l 168 1096 l 168 1174 q 208 1344 168 1267 q 323 1468 247 1421 q 506 1514 399 1514 l 506 1514 q 692 1468 617 1514 q 806 1344 767 1421 q 844 1174 844 1267 l 844 1174 l 844 1096 q 805 926 844 1003 q 691 803 766 849 q 506 757 615 757 m 506 962 l 506 962 q 591 1004 569 962 q 613 1096 613 1046 l 613 1096 l 613 1174 q 592 1267 613 1223 q 506 1311 571 1311 l 506 1311 q 421 1266 443 1311 q 399 1174 399 1221 l 399 1174 l 399 1096 q 422 1004 399 1046 q 506 962 444 962 m 1601 -25 l 1601 -25 q 1417 22 1492 -25 q 1302 145 1341 68 q 1263 314 1263 222 l 1263 314 l 1263 392 q 1303 562 1263 484 q 1419 686 1343 639 q 1601 732 1494 732 l 1601 732 q 1788 686 1712 732 q 1902 562 1863 639 q 1940 392 1940 484 l 1940 392 l 1940 314 q 1901 144 1940 221 q 1786 21 1861 67 q 1601 -25 1710 -25 m 1601 180 l 1601 180 q 1687 222 1665 180 q 1709 314 1709 264 l 1709 314 l 1709 392 q 1688 485 1709 441 q 1601 529 1667 529 l 1601 529 q 1517 484 1539 529 q 1494 392 1494 439 l 1494 392 l 1494 314 q 1517 222 1494 264 q 1601 180 1540 180 m 648 0 l 425 0 l 1449 1490 l 1672 1490 l 648 0"},"&":{ha:1399,x_min:72,x_max:1400,o:"m 578 -23 l 578 -23 q 308 34 422 -23 q 133 185 194 90 q 72 394 72 279 l 72 394 q 105 549 72 482 q 199 671 138 615 l 199 671 q 339 779 259 726 l 339 779 q 339 780 339 779 l 339 780 q 245 934 283 850 q 206 1116 206 1017 l 206 1116 q 258 1316 206 1226 q 405 1458 310 1405 q 625 1510 499 1510 l 625 1510 q 835 1461 747 1510 q 971 1329 923 1411 q 1019 1146 1019 1246 l 1019 1146 q 996 1015 1019 1077 q 928 900 972 953 q 821 800 883 846 l 821 800 l 741 743 l 963 492 q 990 549 978 519 l 990 549 q 1028 748 1028 639 l 1028 748 l 1311 748 q 1282 500 1311 614 q 1198 297 1253 386 l 1198 297 q 1171 258 1185 277 l 1171 258 l 1400 0 l 1043 0 l 959 92 q 779 6 877 33 l 779 6 q 578 -23 676 -23 m 769 299 l 512 580 q 438 508 466 545 l 438 508 q 408 414 408 469 l 408 414 q 432 329 408 365 q 498 273 456 292 q 597 253 540 253 l 597 253 q 752 290 675 253 l 752 290 q 769 299 761 294 l 769 299 m 578 931 l 578 931 l 651 978 q 706 1023 683 999 q 739 1073 728 1047 q 750 1125 750 1099 l 750 1125 q 719 1201 750 1169 q 626 1233 687 1233 l 626 1233 q 558 1218 587 1233 q 513 1176 529 1203 q 497 1112 497 1148 l 497 1112 q 521 1019 497 1066 l 521 1019 q 578 931 542 977"},"'":{ha:726,x_min:199,x_max:527,o:"m 494 848 l 233 848 l 199 1490 l 527 1490 l 494 848"},"(":{ha:783,x_min:150,x_max:728,o:"m 150 607 l 150 607 q 183 954 150 774 q 274 1298 216 1133 q 408 1581 332 1462 l 408 1581 l 728 1581 q 608 1260 658 1427 q 532 926 558 1092 q 505 607 505 759 l 505 607 q 528 346 505 476 q 599 64 550 215 q 728 -279 648 -87 l 728 -279 l 408 -279 q 216 155 281 -71 q 150 607 150 380"},")":{ha:783,x_min:55,x_max:633,o:"m 375 -279 l 55 -279 q 185 66 136 -86 q 256 347 233 217 q 278 607 278 477 l 278 607 q 251 926 278 759 q 175 1260 224 1092 q 55 1581 125 1427 l 55 1581 l 375 1581 q 509 1298 451 1462 q 600 954 567 1133 q 633 607 633 774 l 633 607 q 568 154 633 379 q 375 -279 502 -72 l 375 -279"},"*":{ha:1193,x_min:179,x_max:1012,o:"m 701 652 l 490 652 l 512 923 l 286 769 l 179 953 l 425 1070 l 179 1187 l 286 1373 l 512 1219 l 490 1490 l 701 1490 l 682 1219 l 907 1373 l 1012 1187 l 768 1070 l 1012 953 l 907 769 l 682 923 l 701 652"},"+":{ha:1404,x_min:178,x_max:1227,o:"m 846 74 l 558 74 l 558 463 l 178 463 l 178 737 l 558 737 l 558 1125 l 846 1125 l 846 737 l 1227 737 l 1227 463 l 846 463 l 846 74"},",":{ha:722,x_min:116,x_max:542,o:"m 346 -410 l 116 -410 l 204 232 l 542 232 l 346 -410"},"-":{ha:965,x_min:139,x_max:826,o:"m 139 738 l 826 738 l 826 469 l 139 469 l 139 738"},".":{ha:722,x_min:172,x_max:550,o:"m 361 -21 l 361 -21 q 227 33 281 -21 q 172 165 172 86 l 172 165 q 227 299 172 245 q 361 352 281 352 l 361 352 q 496 299 441 352 q 550 165 550 245 l 550 165 q 496 33 550 86 q 361 -21 441 -21"},"/":{ha:819,x_min:20,x_max:798,o:"m 500 1560 l 798 1560 l 318 -224 l 20 -224 l 500 1560"},":":{ha:722,x_min:172,x_max:550,o:"m 361 -21 l 361 -21 q 227 33 281 -21 q 172 165 172 86 l 172 165 q 227 299 172 245 q 361 352 281 352 l 361 352 q 496 299 441 352 q 550 165 550 245 l 550 165 q 496 33 550 86 q 361 -21 441 -21 m 361 694 l 361 694 q 227 748 281 694 q 172 880 172 801 l 172 880 q 227 1014 172 960 q 361 1067 281 1067 l 361 1067 q 496 1014 441 1067 q 550 880 550 960 l 550 880 q 496 748 550 801 q 361 694 441 694"},";":{ha:737,x_min:116,x_max:564,o:"m 346 -410 l 116 -410 l 204 232 l 542 232 l 346 -410 m 375 694 l 375 694 q 241 748 295 694 q 186 880 186 801 l 186 880 q 241 1014 186 960 q 375 1067 295 1067 l 375 1067 q 510 1014 455 1067 q 564 880 564 960 l 564 880 q 510 748 564 801 q 375 694 455 694"},"<":{ha:1404,x_min:163,x_max:1212,o:"m 1212 9 l 163 452 l 163 748 l 1212 1192 l 1212 865 l 528 606 l 528 592 l 1212 334 l 1212 9"},"=":{ha:1404,x_min:185,x_max:1220,o:"m 1220 706 l 185 706 l 185 992 l 1220 992 l 1220 706 m 1220 208 l 185 208 l 185 495 l 1220 495 l 1220 208"},">":{ha:1404,x_min:192,x_max:1241,o:"m 1241 748 l 1241 452 l 192 9 l 192 334 l 878 592 l 878 606 l 192 865 l 192 1192 l 1241 748"},"?":{ha:1186,x_min:77,x_max:1092,o:"m 696 462 l 393 462 l 393 490 q 414 687 393 614 q 474 802 434 759 q 572 882 514 845 l 572 882 q 687 973 641 926 q 733 1088 733 1020 l 733 1088 q 712 1165 733 1132 q 655 1217 691 1198 q 576 1235 619 1235 l 576 1235 q 494 1216 532 1235 q 431 1159 455 1196 q 406 1070 407 1122 l 406 1070 l 77 1070 q 147 1319 79 1222 q 329 1463 215 1416 q 577 1510 442 1510 l 577 1510 q 843 1464 727 1510 q 1026 1327 959 1417 q 1092 1104 1092 1236 l 1092 1104 q 1029 889 1092 974 q 861 743 965 804 l 861 743 q 769 677 806 710 q 714 600 732 643 q 696 490 696 556 l 696 490 l 696 462 m 545 -21 l 545 -21 q 404 29 458 -21 q 350 162 350 79 l 350 162 q 404 296 350 245 q 545 346 458 346 l 545 346 q 687 296 633 346 q 740 162 740 245 l 740 162 q 687 29 740 79 q 545 -21 633 -21"},"@":{ha:2122,x_min:82,x_max:2040,o:"m 1070 -441 l 1070 -441 q 654 -377 837 -441 q 343 -191 471 -314 q 149 108 215 -69 q 82 512 82 285 l 82 512 q 146 909 82 729 q 334 1221 209 1089 q 642 1424 458 1352 q 1067 1496 826 1496 l 1067 1496 q 1467 1433 1288 1496 q 1775 1252 1646 1369 q 1972 972 1903 1134 q 2040 613 2040 810 l 2040 613 q 2012 373 2040 481 q 1929 187 1984 265 q 1791 67 1874 109 q 1598 25 1708 25 l 1598 25 q 1471 44 1528 25 q 1378 100 1414 62 q 1332 193 1342 137 l 1332 193 l 1324 193 q 1213 67 1296 113 q 1010 21 1130 21 l 1010 21 q 773 83 871 21 q 622 258 674 145 q 569 522 569 370 l 569 522 q 625 790 569 675 q 781 970 680 905 q 1014 1034 881 1034 l 1014 1034 q 1186 999 1113 1034 q 1289 901 1259 963 l 1289 901 l 1300 901 l 1300 1011 l 1526 1011 l 1526 330 q 1543 265 1526 286 q 1599 244 1560 244 l 1599 244 q 1694 281 1658 244 q 1747 393 1730 317 q 1763 584 1763 468 l 1763 584 q 1721 860 1763 739 q 1595 1064 1679 981 q 1386 1190 1511 1147 q 1095 1233 1260 1233 l 1095 1233 q 780 1185 915 1233 q 553 1045 644 1137 q 416 822 462 953 q 370 523 370 690 l 370 523 q 417 223 370 353 q 557 3 464 92 q 785 -131 649 -86 q 1099 -177 920 -177 l 1099 -177 q 1257 -166 1182 -177 q 1394 -137 1331 -155 q 1502 -100 1456 -120 l 1502 -100 l 1596 -335 q 1465 -385 1545 -361 q 1285 -425 1385 -410 q 1070 -441 1185 -441 m 1047 258 l 1047 258 q 1176 289 1124 258 q 1253 380 1227 320 q 1279 525 1279 439 l 1279 525 q 1253 667 1279 611 q 1175 749 1226 722 q 1048 775 1123 775 l 1048 775 q 924 745 975 775 q 846 659 872 715 q 819 526 819 603 l 819 526 q 844 386 819 446 q 921 292 869 325 q 1047 258 972 258"},A:{ha:1576,x_min:47,x_max:1529,o:"m 439 0 l 47 0 l 544 1490 l 1017 1490 l 1529 0 l 1133 0 l 1032 317 l 536 317 l 439 0 m 619 587 l 946 587 l 926 651 q 830 998 876 814 l 830 998 q 777 1210 803 1101 l 777 1210 q 728 997 752 1101 l 728 997 q 639 651 686 813 l 639 651 l 619 587"},B:{ha:1361,x_min:116,x_max:1297,o:"m 780 0 l 116 0 l 116 1490 l 734 1490 q 1013 1442 900 1490 q 1183 1310 1126 1394 q 1239 1112 1239 1225 l 1239 1112 q 1204 961 1239 1027 q 1106 851 1168 894 q 962 790 1043 807 l 962 790 l 962 774 q 1128 727 1051 771 q 1251 603 1204 682 q 1297 416 1297 524 l 1297 416 q 1237 202 1297 296 q 1061 54 1176 108 q 780 0 946 0 l 780 0 m 469 647 l 469 285 l 697 285 q 873 331 816 285 q 929 456 929 376 l 929 456 q 902 557 929 514 q 825 624 875 600 q 704 647 774 647 l 704 647 l 469 647 m 469 1208 l 469 876 l 674 876 q 780 896 733 876 q 853 954 826 916 q 879 1045 879 991 l 879 1045 q 825 1164 879 1120 q 680 1208 771 1208 l 680 1208 l 469 1208"},C:{ha:1523,x_min:82,x_max:1446,o:"m 787 -20 l 787 -20 q 427 69 586 -20 q 175 329 267 158 q 82 744 82 500 l 82 744 q 176 1161 82 990 q 429 1421 269 1332 q 787 1510 589 1510 l 787 1510 q 1033 1474 920 1510 q 1233 1367 1146 1437 q 1375 1196 1320 1297 q 1445 964 1429 1094 l 1445 964 l 1088 964 q 1055 1063 1079 1019 q 994 1137 1031 1106 q 906 1184 956 1168 q 796 1200 856 1200 l 796 1200 q 608 1146 687 1200 q 486 991 528 1092 q 443 744 443 889 l 443 744 q 487 494 443 595 q 609 341 530 392 q 794 290 687 290 l 794 290 q 904 306 854 290 q 992 353 954 322 q 1055 428 1030 384 q 1089 526 1080 471 l 1089 526 l 1446 526 q 1389 330 1436 426 q 1259 154 1342 233 q 1057 27 1175 74 q 787 -20 939 -20"},D:{ha:1480,x_min:116,x_max:1397,o:"m 664 0 l 664 0 l 116 0 l 116 1490 l 664 1490 q 1055 1401 891 1490 q 1308 1144 1219 1311 q 1397 745 1397 977 q 1309 346 1397 513 q 1056 89 1220 178 q 664 0 891 0 m 469 1188 l 469 302 l 649 302 q 866 345 777 302 q 999 486 954 388 q 1044 745 1044 584 q 998 1004 1044 906 q 864 1145 952 1101 q 644 1188 775 1188 l 644 1188 l 469 1188"},E:{ha:1249,x_min:116,x_max:1150,o:"m 1149 0 l 116 0 l 116 1490 l 1150 1490 l 1150 1202 l 469 1202 l 469 894 l 1096 894 l 1096 612 l 469 612 l 469 288 l 1149 288 l 1149 0"},F:{ha:1199,x_min:116,x_max:1129,o:"m 469 0 l 116 0 l 116 1490 l 1129 1490 l 1129 1202 l 469 1202 l 469 824 l 1064 824 l 1064 542 l 469 542 l 469 0"},G:{ha:1541,x_min:82,x_max:1453,o:"m 797 -20 l 797 -20 q 424 73 585 -20 q 173 336 263 165 q 82 742 82 507 l 82 742 q 178 1158 82 986 q 434 1420 273 1329 q 793 1510 594 1510 l 793 1510 q 1033 1473 922 1510 q 1230 1368 1143 1436 q 1370 1208 1316 1300 q 1437 1004 1423 1115 l 1437 1004 l 1080 1004 q 1043 1087 1067 1050 q 982 1149 1018 1123 q 901 1187 946 1174 q 799 1200 855 1200 l 799 1200 q 611 1147 691 1200 q 487 993 530 1094 q 443 747 443 891 l 443 747 q 486 500 443 602 q 608 344 528 398 q 800 290 688 290 l 800 290 q 971 323 901 290 q 1076 418 1040 356 l 1076 418 q 1112 553 1110 476 l 1112 553 l 814 553 l 814 812 l 1453 812 l 1453 616 q 1369 275 1453 417 q 1137 56 1285 132 q 797 -20 988 -20"},H:{ha:1533,x_min:116,x_max:1416,o:"m 469 0 l 116 0 l 116 1490 l 469 1490 l 469 905 l 1064 905 l 1064 1490 l 1416 1490 l 1416 0 l 1064 0 l 1064 617 l 469 617 l 469 0"},I:{ha:585,x_min:116,x_max:469,o:"m 116 1490 l 469 1490 l 469 0 l 116 0 l 116 1490"},J:{ha:1208,x_min:54,x_max:1092,o:"m 576 -20 l 576 -20 q 192 104 330 -20 q 54 456 54 227 l 54 456 l 54 546 l 407 546 l 407 450 q 452 307 407 355 q 576 259 497 259 l 576 259 q 700 307 655 259 q 744 452 744 355 l 744 452 l 744 1490 l 1092 1490 l 1092 458 q 956 104 1092 228 q 576 -20 820 -20"},K:{ha:1512,x_min:116,x_max:1463,o:"m 469 0 l 116 0 l 116 1490 l 469 1490 l 469 1124 l 463 764 q 466 770 464 767 l 466 770 q 561 917 508 843 q 686 1083 613 991 l 686 1083 l 1018 1490 l 1442 1490 l 902 846 l 1463 0 l 1048 0 l 659 615 l 469 400 l 469 0"},L:{ha:1158,x_min:116,x_max:1092,o:"m 1092 0 l 116 0 l 116 1490 l 469 1490 l 469 288 l 1092 288 l 1092 0"},M:{ha:1932,x_min:116,x_max:1816,o:"m 470 0 l 116 0 l 116 1490 l 666 1490 l 856 910 q 893 770 872 857 q 934 582 913 682 l 934 582 q 968 415 952 496 l 968 415 q 1001 582 983 495 l 1001 582 q 1042 769 1021 682 q 1078 910 1062 856 l 1078 910 l 1265 1490 l 1816 1490 l 1816 0 l 1461 0 l 1461 642 q 1463 771 1461 692 q 1468 941 1465 849 q 1473 1127 1470 1033 l 1473 1127 q 1474 1199 1474 1164 l 1474 1199 q 1455 1117 1465 1159 l 1455 1117 q 1408 932 1431 1022 q 1363 767 1384 842 q 1326 642 1341 692 l 1326 642 l 1114 0 l 819 0 l 604 642 q 567 766 589 691 q 521 931 545 841 q 473 1116 497 1021 l 473 1116 q 457 1181 465 1149 l 457 1181 q 458 1129 457 1155 l 458 1129 q 463 943 460 1036 q 468 772 465 850 q 470 642 470 693 l 470 642 l 470 0"},N:{ha:1568,x_min:116,x_max:1452,o:"m 478 0 l 116 0 l 116 1490 l 504 1490 l 920 817 q 999 679 960 750 q 1075 520 1037 607 l 1075 520 q 1111 432 1093 479 l 1111 432 q 1107 502 1109 466 l 1107 502 q 1095 697 1100 602 q 1090 856 1090 791 l 1090 856 l 1090 1490 l 1452 1490 l 1452 0 l 1063 0 l 682 617 q 590 778 631 702 q 507 943 548 854 l 507 943 q 457 1050 484 992 l 457 1050 q 464 944 460 996 l 464 944 q 474 758 470 842 q 478 617 478 673 l 478 617 l 478 0"},O:{ha:1583,x_min:82,x_max:1500,o:"m 792 -20 l 792 -20 q 431 69 591 -20 q 176 329 270 158 q 82 744 82 500 l 82 744 q 176 1161 82 990 q 431 1421 270 1332 q 792 1510 591 1510 l 792 1510 q 1153 1421 992 1510 q 1407 1161 1313 1332 q 1500 744 1500 990 l 1500 744 q 1407 328 1500 499 q 1153 69 1313 157 q 792 -20 992 -20 m 792 290 l 792 290 q 978 342 900 290 q 1098 496 1056 394 q 1140 744 1140 597 l 1140 744 q 1098 994 1140 892 q 978 1148 1056 1096 q 792 1200 900 1200 l 792 1200 q 605 1148 683 1200 q 485 994 527 1095 q 443 744 443 892 l 443 744 q 485 496 443 597 q 605 343 527 395 q 792 290 683 290"},P:{ha:1335,x_min:116,x_max:1269,o:"m 469 0 l 116 0 l 116 1490 l 726 1490 q 1016 1425 894 1490 q 1204 1244 1138 1360 q 1269 975 1269 1128 l 1269 975 q 1202 707 1269 821 q 1011 529 1135 593 q 716 465 887 465 l 716 465 l 469 465 l 469 0 m 469 1204 l 469 744 l 652 744 q 791 773 735 744 q 875 854 847 802 q 903 975 903 906 l 903 975 q 875 1097 903 1045 q 791 1176 847 1148 q 651 1204 734 1204 l 651 1204 l 469 1204"},Q:{ha:1601,x_min:82,x_max:1502,o:"m 792 -20 l 792 -20 q 431 69 591 -20 q 176 329 270 158 q 82 744 82 500 l 82 744 q 176 1161 82 990 q 431 1421 270 1332 q 792 1510 591 1510 l 792 1510 q 1153 1421 992 1510 q 1407 1161 1313 1332 q 1500 744 1500 990 l 1500 744 q 1407 328 1500 499 l 1407 328 q 1279 160 1353 231 l 1279 160 l 1502 -117 l 1183 -117 l 1062 27 q 792 -20 938 -20 m 863 296 l 684 531 l 970 531 l 1058 421 q 1098 496 1081 454 l 1098 496 q 1140 744 1140 597 l 1140 744 q 1098 994 1140 892 q 978 1148 1056 1096 q 792 1200 900 1200 l 792 1200 q 605 1148 683 1200 q 485 994 527 1095 q 443 744 443 892 l 443 744 q 485 496 443 597 q 605 343 527 395 q 792 290 683 290 l 792 290 q 863 296 829 290 l 863 296"},R:{ha:1356,x_min:116,x_max:1321,o:"m 469 0 l 116 0 l 116 1490 l 726 1490 q 1016 1430 894 1490 q 1204 1258 1138 1369 q 1269 995 1269 1147 l 1269 995 q 1202 734 1269 842 q 1011 569 1135 625 l 1011 569 q 1010 569 1011 569 l 1010 569 l 1321 0 l 934 0 l 661 513 l 469 513 l 469 0 m 469 1204 l 469 792 l 652 792 q 791 814 735 792 q 875 881 846 836 q 903 995 903 926 l 903 995 q 875 1111 903 1065 q 790 1181 846 1157 q 651 1204 734 1204 l 651 1204 l 469 1204"},S:{ha:1352,x_min:72,x_max:1280,o:"m 691 -20 l 691 -20 q 367 36 505 -20 q 152 206 229 92 q 72 492 75 320 l 72 492 l 411 492 q 451 371 416 420 q 546 298 485 322 q 687 273 606 273 l 687 273 q 813 293 760 273 q 895 349 866 313 q 923 433 923 385 l 923 433 q 897 506 923 476 q 817 559 870 536 q 682 600 764 582 l 682 600 l 524 637 q 221 781 331 681 q 111 1049 111 881 l 111 1049 q 186 1291 111 1187 q 392 1453 261 1395 q 691 1510 522 1510 l 691 1510 q 991 1452 864 1510 q 1188 1289 1118 1393 q 1260 1046 1258 1184 l 1260 1046 l 921 1046 q 855 1172 914 1127 q 690 1217 796 1217 l 690 1217 q 572 1199 620 1217 q 500 1148 524 1180 q 476 1073 476 1115 l 476 1073 q 503 996 476 1027 q 580 943 530 964 q 696 907 630 922 l 696 907 l 825 877 q 1018 815 933 854 q 1161 720 1102 775 q 1250 593 1219 665 q 1280 432 1280 521 l 1280 432 q 1210 190 1280 291 q 1008 34 1139 88 q 691 -20 876 -20"},T:{ha:1386,x_min:66,x_max:1320,o:"m 517 1202 l 66 1202 l 66 1490 l 1320 1490 l 1320 1202 l 869 1202 l 869 0 l 517 0 l 517 1202"},U:{ha:1489,x_min:116,x_max:1373,o:"m 744 -19 l 744 -19 q 415 49 556 -19 q 195 240 273 116 q 116 529 116 363 l 116 529 l 116 1490 l 469 1490 l 469 558 q 504 419 469 480 q 601 324 539 358 q 744 289 662 289 l 744 289 q 889 324 826 289 q 986 419 951 358 q 1020 558 1020 480 l 1020 558 l 1020 1490 l 1373 1490 l 1373 529 q 1294 240 1373 363 q 1074 49 1215 116 q 744 -19 932 -19"},V:{ha:1576,x_min:47,x_max:1529,o:"m 1031 0 l 559 0 l 47 1490 l 444 1490 l 651 839 q 746 499 700 677 l 746 499 q 798 289 772 397 l 798 289 q 848 500 823 397 l 848 500 q 938 839 891 677 l 938 839 l 1137 1490 l 1529 1490 l 1031 0"},W:{ha:2168,x_min:47,x_max:2121,o:"m 846 0 l 445 0 l 47 1490 l 438 1490 l 585 831 q 625 615 607 731 q 659 382 642 498 l 659 382 q 662 362 660 372 l 662 362 q 665 382 663 372 l 665 382 q 703 615 683 498 q 747 831 723 731 l 747 831 l 905 1490 l 1264 1490 l 1421 831 q 1465 615 1445 731 q 1504 382 1485 498 l 1504 382 q 1506 365 1505 373 l 1506 365 q 1509 382 1507 373 l 1509 382 q 1544 615 1525 498 q 1583 831 1562 731 l 1583 831 l 1730 1490 l 2121 1490 l 1723 0 l 1323 0 l 1149 688 q 1092 994 1114 829 l 1092 994 q 1083 1053 1087 1024 l 1083 1053 q 1076 997 1079 1025 l 1076 997 q 1020 688 1057 834 l 1020 688 l 846 0"},X:{ha:1559,x_min:49,x_max:1510,o:"m 458 0 l 49 0 l 585 762 l 102 1490 l 511 1490 l 653 1267 q 727 1136 698 1196 q 780 1020 756 1075 l 780 1020 q 784 1012 782 1016 l 784 1012 q 788 1020 786 1016 l 788 1020 q 842 1136 812 1075 q 916 1267 871 1196 l 916 1267 l 1061 1490 l 1459 1490 l 984 772 l 1510 0 l 1091 0 l 905 285 q 840 393 864 349 q 798 474 816 436 l 798 474 q 779 509 789 491 l 779 509 q 761 474 770 491 l 761 474 q 718 392 742 436 q 651 285 693 348 l 651 285 l 458 0"},Y:{ha:1540,x_min:47,x_max:1493,o:"m 952 0 l 601 0 l 601 540 l 47 1490 l 461 1490 l 695 1033 q 756 900 729 967 l 756 900 q 778 841 767 873 l 778 841 q 800 901 789 873 l 800 901 q 858 1033 825 968 l 858 1033 l 1081 1490 l 1493 1490 l 952 540 l 952 0"},Z:{ha:1390,x_min:108,x_max:1282,o:"m 1282 0 l 109 0 l 109 202 l 688 1000 q 822 1166 748 1083 l 822 1166 q 858 1206 840 1186 l 858 1206 q 788 1204 823 1205 l 788 1204 q 580 1202 684 1202 l 580 1202 l 108 1202 l 108 1490 l 1281 1490 l 1281 1287 l 713 504 q 574 332 650 418 l 574 332 q 530 283 552 308 l 530 283 q 616 286 573 285 l 616 286 q 835 288 725 288 l 835 288 l 1282 288 l 1282 0"},"[":{ha:783,x_min:164,x_max:689,o:"m 689 -279 l 164 -279 l 164 1581 l 689 1581 l 689 1322 l 501 1322 l 501 -20 l 689 -20 l 689 -279"},"\\":{ha:819,x_min:20,x_max:798,o:"m 798 -224 l 500 -224 l 20 1560 l 318 1560 l 798 -224"},"]":{ha:783,x_min:93,x_max:619,o:"m 619 -279 l 93 -279 l 93 -20 l 281 -20 l 281 1322 l 93 1322 l 93 1581 l 619 1581 l 619 -279"},"^":{ha:1010,x_min:64,x_max:946,o:"m 316 814 l 64 814 l 373 1460 l 637 1460 l 946 814 l 694 814 l 512 1237 l 498 1237 l 316 814"},_:{ha:992,x_min:0,x_max:992,o:"m 0 0 l 992 0 l 992 -257 l 0 -257 l 0 0"},"`":{ha:783,x_min:165,x_max:613,o:"m 613 1258 l 377 1258 l 165 1576 l 475 1576 l 613 1258"},a:{ha:1205,x_min:60,x_max:1089,o:"m 428 -20 l 428 -20 q 238 17 321 -20 q 107 127 154 53 q 60 310 60 200 l 60 310 q 93 467 60 403 q 183 571 125 531 q 316 632 241 611 q 476 660 391 653 l 476 660 q 629 678 571 668 q 714 706 687 687 q 741 759 741 725 l 741 759 l 741 763 q 723 829 741 802 q 671 870 705 856 q 589 884 637 884 l 589 884 q 504 870 541 884 q 442 830 466 856 q 408 769 418 804 l 408 769 l 92 810 q 179 979 114 906 q 348 1092 243 1051 q 592 1132 452 1132 l 592 1132 q 787 1108 696 1132 q 945 1036 877 1083 q 1051 919 1013 988 q 1089 759 1089 849 l 1089 759 l 1089 0 l 761 0 l 761 157 l 752 157 q 676 60 722 99 q 568 1 629 21 q 428 -20 506 -20 m 534 211 l 534 211 q 641 235 593 211 q 716 301 688 259 q 744 398 744 343 l 744 398 l 744 505 q 707 490 729 497 q 657 478 684 483 q 603 468 630 472 q 551 459 576 463 l 551 459 q 464 435 500 452 q 409 391 428 418 q 390 326 390 364 l 390 326 q 409 264 390 289 q 460 225 428 238 q 534 211 492 211"},b:{ha:1306,x_min:115,x_max:1234,o:"m 786 -16 l 786 -16 q 639 13 701 -16 q 535 86 576 41 q 472 181 494 131 l 472 181 l 460 181 l 460 0 l 115 0 l 115 1490 l 464 1490 l 464 926 l 472 926 q 534 1024 493 977 q 637 1102 574 1071 q 788 1132 699 1132 l 788 1132 q 1008 1071 906 1132 q 1172 882 1109 1009 q 1234 558 1234 754 l 1234 558 q 1174 241 1234 368 q 1012 49 1114 113 q 786 -16 910 -16 m 667 256 l 667 256 q 781 294 734 256 q 851 400 827 331 q 875 558 875 468 l 875 558 q 851 717 875 649 q 781 822 827 784 q 667 859 735 859 l 667 859 q 553 823 600 859 q 481 719 506 786 q 456 558 456 651 l 456 558 q 481 399 456 467 q 554 294 506 331 q 667 256 601 256"},c:{ha:1219,x_min:72,x_max:1150,o:"m 634 -21 l 634 -21 q 333 52 459 -21 q 140 254 207 124 q 72 555 72 383 l 72 555 q 140 858 72 728 q 333 1060 207 987 q 634 1132 459 1132 l 634 1132 q 830 1104 741 1132 q 986 1025 919 1076 q 1095 900 1053 973 q 1149 735 1136 826 l 1149 735 l 827 681 q 803 759 819 725 q 763 817 786 793 q 708 853 739 841 q 638 865 676 865 l 638 865 q 524 829 571 865 q 453 723 477 792 q 428 557 428 653 l 428 557 q 453 391 428 461 q 524 284 477 321 q 638 246 571 246 l 638 246 q 708 259 677 246 q 764 296 739 271 q 805 356 788 320 q 828 436 821 391 l 828 436 l 1150 384 q 1096 216 1137 290 q 987 88 1054 141 q 831 7 920 35 q 634 -21 741 -21"},d:{ha:1306,x_min:72,x_max:1190,o:"m 520 -16 l 520 -16 q 294 49 396 -16 q 132 241 192 113 q 72 558 72 368 l 72 558 q 135 882 72 754 q 299 1071 197 1009 q 517 1132 400 1132 l 517 1132 q 669 1102 606 1132 q 773 1024 732 1071 q 834 926 813 977 l 834 926 l 842 926 l 842 1490 l 1190 1490 l 1190 0 l 846 0 l 846 181 l 834 181 q 771 86 812 131 q 668 13 729 41 q 520 -16 606 -16 m 639 256 l 639 256 q 753 294 705 256 q 825 399 800 331 q 850 558 850 467 l 850 558 q 825 719 850 651 q 753 823 800 786 q 639 859 705 859 l 639 859 q 526 822 572 859 q 455 717 479 784 q 431 558 431 649 l 431 558 q 455 400 431 468 q 526 294 479 331 q 639 256 572 256"},e:{ha:1230,x_min:72,x_max:1162,o:"m 636 -21 l 636 -21 q 334 49 461 -21 q 140 247 207 118 q 72 555 72 376 l 72 555 q 140 857 72 727 q 331 1060 207 987 q 623 1132 455 1132 l 623 1132 q 840 1095 741 1132 q 1011 986 938 1058 q 1123 807 1083 913 q 1162 562 1162 701 l 1162 562 l 1162 474 l 415 474 q 444 347 418 399 l 444 347 q 523 261 472 289 q 642 232 574 232 l 642 232 q 728 245 689 232 q 794 284 766 258 q 835 347 821 310 l 835 347 l 1146 296 q 1050 129 1118 200 q 877 18 981 57 q 636 -21 772 -21 m 417 677 l 417 677 l 831 677 q 810 763 825 725 l 810 763 q 740 849 786 819 q 626 879 694 879 q 511 849 558 879 q 440 764 464 818 l 440 764 q 417 677 422 725"},f:{ha:839,x_min:20,x_max:823,o:"m 555 1118 l 779 1118 l 779 859 l 555 859 l 555 0 l 208 0 l 208 859 l 20 859 l 20 1118 l 208 1118 l 208 1178 q 256 1391 208 1306 q 390 1518 304 1476 q 588 1560 476 1560 l 588 1560 q 728 1549 662 1560 q 823 1528 793 1537 l 823 1528 l 767 1273 q 720 1283 747 1278 q 666 1287 693 1287 l 666 1287 q 580 1259 604 1287 q 555 1181 555 1230 l 555 1181 l 555 1118"},g:{ha:1309,x_min:72,x_max:1194,o:"m 630 -442 l 630 -442 q 375 -405 484 -442 q 199 -302 266 -368 q 111 -149 131 -236 l 111 -149 l 414 -87 q 451 -142 424 -117 q 522 -183 478 -168 q 628 -199 566 -199 l 628 -199 q 793 -151 735 -199 q 850 -3 850 -103 l 850 -3 l 850 195 l 823 195 q 764 104 803 145 q 664 39 724 63 q 520 15 603 15 l 520 15 q 296 73 397 15 q 133 251 194 130 q 72 559 72 371 l 72 559 q 135 882 72 755 q 300 1071 198 1009 q 519 1132 401 1132 l 519 1132 q 672 1102 608 1132 q 777 1025 735 1072 q 839 926 818 977 l 839 926 l 849 926 l 849 1118 l 1194 1118 l 1194 25 q 1123 -233 1194 -129 q 924 -389 1051 -337 q 630 -442 797 -442 m 639 271 l 639 271 q 753 305 706 271 q 825 405 800 339 q 850 560 850 470 l 850 560 q 825 719 850 652 q 754 823 800 786 q 639 859 707 859 l 639 859 q 526 822 572 859 q 455 717 479 784 q 431 560 431 650 l 431 560 q 455 405 431 470 q 526 306 479 340 q 639 271 572 271"},h:{ha:1301,x_min:115,x_max:1186,o:"m 464 638 l 464 638 l 464 0 l 115 0 l 115 1490 l 457 1490 l 457 896 q 564 1051 497 988 l 564 1051 q 799 1132 651 1132 l 799 1132 q 1003 1080 916 1132 q 1138 933 1090 1028 q 1186 712 1186 838 l 1186 712 l 1186 0 l 837 0 l 837 644 q 789 792 837 738 q 655 845 741 845 l 655 845 q 556 821 599 845 q 488 750 512 796 q 464 638 464 704"},i:{ha:580,x_min:109,x_max:470,o:"m 464 0 l 115 0 l 115 1118 l 464 1118 l 464 0 m 289 1249 l 289 1249 q 162 1299 215 1249 q 109 1417 109 1348 l 109 1417 q 162 1536 109 1487 q 289 1585 215 1585 l 289 1585 q 417 1537 364 1585 q 470 1417 470 1488 l 470 1417 q 417 1298 470 1347 q 289 1249 364 1249"},j:{ha:580,x_min:-59,x_max:471,o:"m 115 -42 l 115 1118 l 464 1118 l 464 -48 q 409 -266 464 -185 q 251 -382 353 -347 q 12 -418 149 -418 l 12 -418 l -59 -418 l -59 -153 l -17 -153 q 87 -125 58 -153 q 115 -42 115 -98 l 115 -42 m 290 1249 l 290 1249 q 163 1299 216 1249 q 110 1417 110 1348 l 110 1417 q 163 1536 110 1487 q 290 1585 216 1585 l 290 1585 q 418 1537 365 1585 q 471 1417 471 1488 l 471 1417 q 418 1298 471 1347 q 290 1249 365 1249"},k:{ha:1214,x_min:115,x_max:1213,o:"m 464 0 l 115 0 l 115 1490 l 464 1490 l 464 714 l 480 714 l 800 1118 l 1197 1118 l 798 630 l 1213 0 l 810 0 l 538 427 l 464 338 l 464 0"},l:{ha:580,x_min:115,x_max:464,o:"m 115 1490 l 464 1490 l 464 0 l 115 0 l 115 1490"},m:{ha:1899,x_min:115,x_max:1783,o:"m 464 0 l 115 0 l 115 1118 l 436 1118 l 451 894 q 510 1004 475 959 l 510 1004 q 630 1102 561 1071 q 774 1133 698 1133 l 774 1133 q 968 1056 894 1133 l 968 1056 q 1062 874 1025 995 l 1062 874 q 1127 994 1088 944 l 1127 994 q 1263 1100 1185 1067 q 1425 1133 1341 1133 l 1425 1133 q 1611 1088 1530 1133 q 1737 958 1691 1042 q 1783 754 1783 873 l 1783 754 l 1783 0 l 1435 0 l 1435 675 q 1391 804 1435 760 q 1277 848 1346 848 l 1277 848 q 1192 826 1228 848 q 1136 765 1155 804 q 1117 671 1117 725 l 1117 671 l 1117 0 l 782 0 l 782 680 q 739 803 782 757 q 626 848 696 848 l 626 848 q 542 826 578 848 q 485 764 505 804 q 464 664 464 723 l 464 664 l 464 0"},n:{ha:1301,x_min:115,x_max:1186,o:"m 464 638 l 464 638 l 464 0 l 115 0 l 115 1118 l 443 1118 l 449 876 q 564 1051 490 982 l 564 1051 q 799 1132 651 1132 l 799 1132 q 1003 1080 916 1132 q 1138 933 1090 1028 q 1186 712 1186 838 l 1186 712 l 1186 0 l 837 0 l 837 644 q 789 792 837 738 q 655 845 741 845 l 655 845 q 556 821 599 845 q 488 750 512 796 q 464 638 464 704"},o:{ha:1268,x_min:72,x_max:1195,o:"m 634 -21 l 634 -21 q 333 52 459 -21 q 140 254 207 124 q 72 555 72 383 l 72 555 q 140 858 72 728 q 333 1060 207 987 q 634 1132 459 1132 l 634 1132 q 935 1060 809 1132 q 1128 858 1061 987 q 1195 555 1195 728 l 1195 555 q 1128 254 1195 383 q 935 52 1061 124 q 634 -21 809 -21 m 634 246 l 634 246 q 747 285 701 246 q 817 394 793 324 q 840 557 840 464 l 840 557 q 817 720 840 650 q 747 827 793 789 q 634 865 701 865 l 634 865 q 521 827 567 865 q 452 720 475 789 q 428 557 428 650 l 428 557 q 452 394 428 464 q 521 285 475 324 q 634 246 567 246"},p:{ha:1306,x_min:115,x_max:1234,o:"m 464 -418 l 115 -418 l 115 1118 l 460 1118 l 460 926 l 472 926 q 534 1024 493 977 q 637 1102 574 1071 q 788 1132 699 1132 l 788 1132 q 1008 1071 906 1132 q 1172 882 1109 1009 q 1234 558 1234 754 l 1234 558 q 1174 241 1234 368 q 1012 49 1114 113 q 786 -16 910 -16 l 786 -16 q 639 13 701 -16 q 535 86 576 41 q 472 181 494 131 l 472 181 l 464 181 l 464 -418 m 667 256 l 667 256 q 781 294 734 256 q 851 400 827 331 q 875 558 875 468 l 875 558 q 851 717 875 649 q 781 822 827 784 q 667 859 735 859 l 667 859 q 553 823 600 859 q 481 719 506 786 q 456 558 456 651 l 456 558 q 481 399 456 467 q 554 294 506 331 q 667 256 601 256"},q:{ha:1306,x_min:72,x_max:1190,o:"m 1190 1118 l 1190 -418 l 842 -418 l 842 181 l 834 181 q 771 86 812 131 q 668 13 729 41 q 520 -16 606 -16 l 520 -16 q 294 49 396 -16 q 132 241 192 113 q 72 558 72 368 l 72 558 q 135 882 72 754 q 299 1071 197 1009 q 517 1132 400 1132 l 517 1132 q 669 1102 606 1132 q 773 1024 732 1071 q 834 926 813 977 l 834 926 l 846 926 l 846 1118 l 1190 1118 m 639 256 l 639 256 q 753 294 705 256 q 825 399 800 331 q 850 558 850 467 l 850 558 q 825 719 850 651 q 753 823 800 786 q 639 859 705 859 l 639 859 q 526 822 572 859 q 455 717 479 784 q 431 558 431 649 l 431 558 q 455 400 431 468 q 526 294 479 331 q 639 256 572 256"},r:{ha:860,x_min:115,x_max:826,o:"m 464 0 l 115 0 l 115 1118 l 454 1118 l 454 914 l 466 914 q 566 1079 496 1025 q 727 1132 635 1132 l 727 1132 q 778 1129 751 1132 q 826 1120 804 1126 l 826 1120 l 826 816 q 761 830 801 825 q 688 834 720 834 l 688 834 q 573 806 624 834 q 493 727 522 777 q 464 610 464 677 l 464 610 l 464 0"},s:{ha:1174,x_min:65,x_max:1110,o:"m 586 -21 l 586 -21 q 333 20 443 -21 q 154 137 223 60 q 65 320 85 213 l 65 320 l 389 371 q 460 261 410 298 q 599 224 510 224 l 599 224 q 714 250 672 224 q 756 317 756 275 l 756 317 q 723 380 756 356 q 619 417 689 403 l 619 417 l 424 455 q 176 568 258 487 q 93 777 93 648 l 93 777 q 154 968 93 889 q 325 1090 214 1047 q 585 1132 435 1132 l 585 1132 q 829 1095 725 1132 q 996 988 932 1057 q 1078 822 1059 918 l 1078 822 l 770 773 q 709 861 755 829 q 591 892 662 892 l 591 892 q 485 867 528 892 q 441 798 441 841 l 441 798 q 468 739 441 764 q 567 699 495 713 l 567 699 l 781 659 q 1029 553 947 627 q 1110 357 1110 479 l 1110 357 q 1043 157 1110 242 q 857 26 975 72 q 586 -21 739 -21"},t:{ha:782,x_min:20,x_max:748,o:"m 517 1118 l 718 1118 l 718 859 l 517 859 l 517 342 q 538 277 517 298 q 606 255 559 255 l 606 255 q 657 259 624 255 q 703 267 689 263 l 703 267 l 748 13 q 634 -10 689 -4 q 530 -16 579 -16 l 530 -16 q 260 68 352 -16 q 168 311 168 151 l 168 311 l 168 859 l 20 859 l 20 1118 l 168 1118 l 168 1384 l 517 1384 l 517 1118"},u:{ha:1301,x_min:115,x_max:1186,o:"m 503 -14 l 503 -14 q 299 38 386 -14 q 163 185 211 90 q 115 406 115 280 l 115 406 l 115 1118 l 464 1118 l 464 474 q 513 327 464 380 q 646 273 561 273 l 646 273 q 747 298 704 273 q 813 369 789 322 q 837 480 837 415 l 837 480 l 837 1118 l 1186 1118 l 1186 0 l 858 0 l 853 242 q 737 67 811 135 l 737 67 q 503 -14 649 -14"},v:{ha:1260,x_min:22,x_max:1238,o:"m 831 0 l 427 0 l 22 1118 l 390 1118 l 557 571 q 616 346 591 461 l 616 346 q 634 260 625 304 l 634 260 q 653 346 644 304 l 653 346 q 710 571 677 460 l 710 571 l 874 1118 l 1238 1118 l 831 0"},w:{ha:1767,x_min:15,x_max:1752,o:"m 697 0 l 341 0 l 15 1118 l 380 1118 l 462 735 q 513 488 485 620 l 513 488 q 546 309 531 403 l 546 309 q 583 487 563 403 l 583 487 q 640 735 614 619 l 640 735 l 729 1118 l 1039 1118 l 1125 735 q 1181 487 1150 619 l 1181 487 q 1219 306 1201 402 l 1219 306 q 1250 486 1233 401 l 1250 486 q 1300 735 1276 618 l 1300 735 l 1381 1118 l 1752 1118 l 1423 0 l 1067 0 l 951 401 q 918 538 935 460 q 885 697 901 616 l 885 697 q 882 710 884 703 l 882 710 q 880 697 881 703 l 880 697 q 847 538 863 616 q 813 401 830 459 l 813 401 l 697 0"},x:{ha:1217,x_min:33,x_max:1184,o:"m 396 0 l 33 0 l 380 574 l 54 1118 l 424 1118 l 510 958 q 594 782 556 871 l 594 782 q 611 742 602 762 l 611 742 q 628 781 619 761 l 628 781 q 715 958 667 871 l 715 958 l 805 1118 l 1169 1118 l 834 572 l 1184 0 l 816 0 l 708 194 q 620 372 660 281 l 620 372 q 603 410 611 391 l 603 410 q 587 372 595 391 l 587 372 q 502 194 548 281 l 502 194 l 396 0"},y:{ha:1266,x_min:22,x_max:1244,o:"m 112 -392 l 112 -392 l 190 -137 l 234 -149 q 345 -158 297 -165 q 418 -123 392 -151 q 440 -49 443 -95 l 440 -49 l 439 -2 l 22 1118 l 390 1118 l 557 571 q 611 346 591 459 l 611 346 q 623 277 616 312 l 623 277 q 639 347 631 313 l 639 347 q 701 571 666 461 l 701 571 l 880 1118 l 1244 1118 l 775 -118 q 686 -277 741 -208 q 546 -386 631 -347 q 334 -426 460 -426 l 334 -426 q 211 -416 270 -426 q 112 -392 151 -407"},z:{ha:1190,x_min:117,x_max:1073,o:"m 1073 0 l 117 0 l 117 201 l 638 838 l 638 845 l 134 845 l 134 1118 l 1054 1118 l 1054 897 l 571 280 l 571 273 l 1073 273 l 1073 0"},"{":{ha:996,x_min:139,x_max:903,o:"m 903 -21 l 903 -279 q 694 -267 792 -279 q 522 -216 596 -256 q 405 -93 447 -177 q 363 134 363 -10 l 363 134 l 363 286 q 314 447 363 396 q 139 497 264 497 l 139 497 l 139 805 q 314 856 264 805 q 363 1015 363 906 l 363 1015 l 363 1168 q 405 1396 363 1312 q 522 1519 447 1479 q 694 1570 596 1558 q 903 1581 792 1581 l 903 1581 l 903 1323 q 730 1276 773 1323 q 687 1128 687 1228 l 687 1128 l 687 937 q 667 829 687 883 q 589 730 646 774 l 589 730 q 440 663 536 688 l 440 663 l 440 639 q 589 572 536 613 l 589 572 q 667 474 646 528 q 687 364 687 419 l 687 364 l 687 174 q 730 27 687 75 q 903 -21 773 -21 l 903 -21"},"|":{ha:794,x_min:229,x_max:564,o:"m 229 1970 l 564 1970 l 564 -480 l 229 -480 l 229 1970"},"}":{ha:996,x_min:93,x_max:857,o:"m 93 -279 l 93 -279 l 93 -21 q 267 27 224 -21 q 309 174 309 75 l 309 174 l 309 364 q 330 474 309 419 q 408 572 350 528 l 408 572 q 556 638 460 612 l 556 638 l 556 663 q 408 730 460 689 l 408 730 q 330 829 350 774 q 309 937 309 883 l 309 937 l 309 1128 q 267 1276 309 1228 q 93 1323 224 1323 l 93 1323 l 93 1581 q 303 1570 205 1581 q 475 1519 400 1558 q 591 1396 549 1479 q 633 1168 633 1312 l 633 1168 l 633 1015 q 683 856 633 906 q 857 805 732 805 l 857 805 l 857 497 q 682 447 731 497 q 633 286 633 396 l 633 286 l 633 134 q 591 -93 633 -10 q 475 -216 549 -177 q 303 -267 400 -256 q 93 -279 205 -279"},"~":{ha:1404,x_min:152,x_max:1253,o:"m 414 391 l 153 391 q 185 636 148 534 q 296 791 222 737 q 475 844 370 844 l 475 844 q 605 817 542 844 q 746 719 667 790 l 746 719 q 814 666 786 685 q 879 646 841 646 l 879 646 q 961 685 928 646 q 990 811 993 724 l 990 811 l 1252 811 q 1218 568 1257 669 q 1106 413 1179 466 q 930 359 1032 359 l 930 359 q 794 389 857 359 q 655 483 730 418 l 655 483 q 587 540 612 522 q 525 557 562 557 l 525 557 q 444 519 476 557 q 414 391 412 480 l 414 391"},\u00c0:{ha:1576,x_min:47,x_max:1529,o:"m 439 0 l 47 0 l 544 1490 l 1017 1490 l 1529 0 l 1133 0 l 1032 317 l 536 317 l 439 0 m 619 587 l 946 587 l 926 651 q 830 998 876 814 l 830 998 q 777 1210 803 1101 l 777 1210 q 728 997 752 1101 l 728 997 q 639 651 686 813 l 639 651 l 619 587 m 905 1630 l 669 1630 l 457 1948 l 767 1948 l 905 1630"},\u00c1:{ha:1576,x_min:47,x_max:1529,o:"m 439 0 l 47 0 l 544 1490 l 1017 1490 l 1529 0 l 1133 0 l 1032 317 l 536 317 l 439 0 m 619 587 l 946 587 l 926 651 q 830 998 876 814 l 830 998 q 777 1210 803 1101 l 777 1210 q 728 997 752 1101 l 728 997 q 639 651 686 813 l 639 651 l 619 587 m 900 1630 l 665 1630 l 803 1948 l 1113 1948 l 900 1630"},\u00c2:{ha:1576,x_min:47,x_max:1529,o:"m 439 0 l 47 0 l 544 1490 l 1017 1490 l 1529 0 l 1133 0 l 1032 317 l 536 317 l 439 0 m 619 587 l 946 587 l 926 651 q 830 998 876 814 l 830 998 q 777 1210 803 1101 l 777 1210 q 728 997 752 1101 l 728 997 q 639 651 686 813 l 639 651 l 619 587 m 785 1802 l 642 1634 l 347 1634 l 347 1641 l 658 1948 l 911 1948 l 1222 1641 l 1222 1634 l 927 1634 l 785 1802"},\u00c3:{ha:1576,x_min:47,x_max:1529,o:"m 439 0 l 47 0 l 544 1490 l 1017 1490 l 1529 0 l 1133 0 l 1032 317 l 536 317 l 439 0 m 619 587 l 946 587 l 926 651 q 830 998 876 814 l 830 998 q 777 1210 803 1101 l 777 1210 q 728 997 752 1101 l 728 997 q 639 651 686 813 l 639 651 l 619 587 m 929 1642 l 929 1642 q 839 1659 877 1642 q 771 1697 800 1675 q 716 1736 741 1719 q 666 1753 691 1753 l 666 1753 q 615 1725 633 1753 q 595 1649 597 1697 l 595 1649 l 414 1649 q 481 1863 417 1790 q 642 1936 544 1936 l 642 1936 q 732 1920 694 1936 q 800 1881 770 1903 q 854 1843 829 1859 q 905 1826 879 1826 l 905 1826 q 960 1853 943 1826 q 978 1930 976 1880 l 978 1930 l 1156 1930 q 1089 1717 1154 1791 q 929 1642 1024 1642"},\u00c4:{ha:1576,x_min:47,x_max:1529,o:"m 439 0 l 47 0 l 544 1490 l 1017 1490 l 1529 0 l 1133 0 l 1032 317 l 536 317 l 439 0 m 619 587 l 946 587 l 926 651 q 830 998 876 814 l 830 998 q 777 1210 803 1101 l 777 1210 q 728 997 752 1101 l 728 997 q 639 651 686 813 l 639 651 l 619 587 m 1011 1632 l 1011 1632 q 896 1678 944 1632 q 848 1789 848 1724 l 848 1789 q 896 1900 848 1854 q 1011 1946 944 1946 l 1011 1946 q 1126 1900 1078 1946 q 1173 1789 1173 1854 l 1173 1789 q 1126 1678 1173 1724 q 1011 1632 1078 1632 m 559 1632 l 559 1632 q 444 1678 491 1632 q 396 1789 396 1724 l 396 1789 q 444 1900 396 1854 q 559 1946 491 1946 l 559 1946 q 674 1900 626 1946 q 721 1789 721 1854 l 721 1789 q 674 1678 721 1724 q 559 1632 626 1632"},\u00c5:{ha:1576,x_min:47,x_max:1529,o:"m 439 0 l 47 0 l 544 1490 l 1017 1490 l 1529 0 l 1133 0 l 1032 317 l 536 317 l 439 0 m 619 587 l 946 587 l 926 651 q 830 998 876 814 l 830 998 q 777 1210 803 1101 l 777 1210 q 728 997 752 1101 l 728 997 q 639 651 686 813 l 639 651 l 619 587 m 786 1546 l 786 1546 q 639 1579 702 1546 q 541 1666 576 1611 q 506 1789 506 1721 l 506 1789 q 541 1913 506 1858 q 639 1999 576 1967 q 786 2031 702 2031 l 786 2031 q 933 1999 870 2031 q 1030 1913 995 1967 q 1065 1789 1065 1858 l 1065 1789 q 1030 1666 1065 1721 q 933 1579 995 1611 q 786 1546 870 1546 m 786 1681 l 786 1681 q 870 1711 838 1681 q 901 1789 901 1741 l 901 1789 q 870 1867 901 1837 q 786 1897 838 1897 l 786 1897 q 702 1867 734 1897 q 670 1789 670 1837 l 670 1789 q 702 1711 670 1741 q 786 1681 734 1681"},\u00c6:{ha:2119,x_min:47,x_max:2019,o:"m 437 0 l 47 0 l 662 1490 l 2019 1490 l 2019 1202 l 1338 1202 l 1338 892 l 1966 892 l 1966 610 l 1338 610 l 1338 288 l 2019 288 l 2019 0 l 1000 0 l 1000 329 l 565 329 l 437 0 m 660 572 l 1000 572 l 1000 1267 l 931 1267 l 660 572"},\u00c7:{ha:1523,x_min:82,x_max:1446,o:"m 794 -416 l 645 -416 l 645 -291 l 776 -291 q 841 -277 821 -291 q 860 -231 860 -263 l 860 -231 q 841 -186 860 -200 q 776 -172 821 -172 l 776 -172 l 680 -172 l 708 -16 q 427 69 554 -2 l 427 69 q 175 329 267 158 q 82 744 82 500 l 82 744 q 176 1161 82 990 q 429 1421 269 1332 q 787 1510 589 1510 l 787 1510 q 1033 1474 920 1510 q 1233 1367 1146 1437 q 1375 1196 1320 1297 q 1445 964 1429 1094 l 1445 964 l 1088 964 q 1055 1063 1079 1019 q 994 1137 1031 1106 q 906 1184 956 1168 q 796 1200 856 1200 l 796 1200 q 608 1146 687 1200 q 486 991 528 1092 q 443 744 443 889 l 443 744 q 487 494 443 595 q 609 341 530 392 q 794 290 687 290 l 794 290 q 904 306 854 290 q 992 353 954 322 q 1055 428 1030 384 q 1089 526 1080 471 l 1089 526 l 1446 526 q 1389 330 1436 426 q 1259 154 1342 233 q 1057 27 1175 74 l 1057 27 q 841 -18 960 -11 l 841 -18 l 835 -87 q 982 -121 928 -79 q 1036 -241 1036 -163 l 1036 -241 q 979 -376 1036 -336 q 794 -416 921 -416 l 794 -416"},\u00c8:{ha:1249,x_min:116,x_max:1150,o:"m 1149 0 l 116 0 l 116 1490 l 1150 1490 l 1150 1202 l 469 1202 l 469 894 l 1096 894 l 1096 612 l 469 612 l 469 288 l 1149 288 l 1149 0 m 754 1630 l 518 1630 l 306 1948 l 616 1948 l 754 1630"},\u00c9:{ha:1249,x_min:116,x_max:1150,o:"m 1149 0 l 116 0 l 116 1490 l 1150 1490 l 1150 1202 l 469 1202 l 469 894 l 1096 894 l 1096 612 l 469 612 l 469 288 l 1149 288 l 1149 0 m 749 1630 l 514 1630 l 652 1948 l 962 1948 l 749 1630"},\u00ca:{ha:1249,x_min:116,x_max:1150,o:"m 1149 0 l 116 0 l 116 1490 l 1150 1490 l 1150 1202 l 469 1202 l 469 894 l 1096 894 l 1096 612 l 469 612 l 469 288 l 1149 288 l 1149 0 m 635 1802 l 492 1634 l 197 1634 l 197 1641 l 508 1948 l 761 1948 l 1072 1641 l 1072 1634 l 777 1634 l 635 1802"},\u00cb:{ha:1249,x_min:116,x_max:1150,o:"m 1149 0 l 116 0 l 116 1490 l 1150 1490 l 1150 1202 l 469 1202 l 469 894 l 1096 894 l 1096 612 l 469 612 l 469 288 l 1149 288 l 1149 0 m 861 1632 l 861 1632 q 746 1678 794 1632 q 698 1789 698 1724 l 698 1789 q 746 1900 698 1854 q 861 1946 794 1946 l 861 1946 q 976 1900 928 1946 q 1023 1789 1023 1854 l 1023 1789 q 976 1678 1023 1724 q 861 1632 928 1632 m 409 1632 l 409 1632 q 294 1678 341 1632 q 246 1789 246 1724 l 246 1789 q 294 1900 246 1854 q 409 1946 341 1946 l 409 1946 q 524 1900 476 1946 q 571 1789 571 1854 l 571 1789 q 524 1678 571 1724 q 409 1632 476 1632"},\u00cc:{ha:585,x_min:-34,x_max:469,o:"m 116 1490 l 469 1490 l 469 0 l 116 0 l 116 1490 m 414 1630 l 178 1630 l -34 1948 l 276 1948 l 414 1630"},\u00cd:{ha:585,x_min:116,x_max:622,o:"m 116 1490 l 469 1490 l 469 0 l 116 0 l 116 1490 m 409 1630 l 174 1630 l 312 1948 l 622 1948 l 409 1630"},\u00ce:{ha:585,x_min:-144,x_max:731,o:"m 116 1490 l 469 1490 l 469 0 l 116 0 l 116 1490 m 294 1802 l 151 1634 l -144 1634 l -144 1641 l 167 1948 l 420 1948 l 731 1641 l 731 1634 l 436 1634 l 294 1802"},\u00cf:{ha:585,x_min:-95,x_max:682,o:"m 116 1490 l 469 1490 l 469 0 l 116 0 l 116 1490 m 520 1632 l 520 1632 q 405 1678 453 1632 q 357 1789 357 1724 l 357 1789 q 405 1900 357 1854 q 520 1946 453 1946 l 520 1946 q 635 1900 587 1946 q 682 1789 682 1854 l 682 1789 q 635 1678 682 1724 q 520 1632 587 1632 m 68 1632 l 68 1632 q -47 1678 0 1632 q -95 1789 -95 1724 l -95 1789 q -47 1900 -95 1854 q 68 1946 0 1946 l 68 1946 q 183 1900 135 1946 q 230 1789 230 1854 l 230 1789 q 183 1678 230 1724 q 68 1632 135 1632"},\u00d1:{ha:1568,x_min:116,x_max:1452,o:"m 478 0 l 116 0 l 116 1490 l 504 1490 l 920 817 q 999 679 960 750 q 1075 520 1037 607 l 1075 520 q 1111 432 1093 479 l 1111 432 q 1107 502 1109 466 l 1107 502 q 1095 697 1100 602 q 1090 856 1090 791 l 1090 856 l 1090 1490 l 1452 1490 l 1452 0 l 1063 0 l 682 617 q 590 778 631 702 q 507 943 548 854 l 507 943 q 457 1050 484 992 l 457 1050 q 464 944 460 996 l 464 944 q 474 758 470 842 q 478 617 478 673 l 478 617 l 478 0 m 928 1642 l 928 1642 q 838 1659 876 1642 q 770 1697 799 1675 q 715 1736 740 1719 q 665 1753 690 1753 l 665 1753 q 614 1725 632 1753 q 594 1649 596 1697 l 594 1649 l 413 1649 q 480 1863 416 1790 q 641 1936 543 1936 l 641 1936 q 731 1920 693 1936 q 799 1881 769 1903 q 853 1843 828 1859 q 904 1826 878 1826 l 904 1826 q 959 1853 942 1826 q 977 1930 975 1880 l 977 1930 l 1155 1930 q 1088 1717 1153 1791 q 928 1642 1023 1642"},\u00d2:{ha:1583,x_min:82,x_max:1500,o:"m 792 -20 l 792 -20 q 431 69 591 -20 q 176 329 270 158 q 82 744 82 500 l 82 744 q 176 1161 82 990 q 431 1421 270 1332 q 792 1510 591 1510 l 792 1510 q 1153 1421 992 1510 q 1407 1161 1313 1332 q 1500 744 1500 990 l 1500 744 q 1407 328 1500 499 q 1153 69 1313 157 q 792 -20 992 -20 m 792 290 l 792 290 q 978 342 900 290 q 1098 496 1056 394 q 1140 744 1140 597 l 1140 744 q 1098 994 1140 892 q 978 1148 1056 1096 q 792 1200 900 1200 l 792 1200 q 605 1148 683 1200 q 485 994 527 1095 q 443 744 443 892 l 443 744 q 485 496 443 597 q 605 343 527 395 q 792 290 683 290 m 912 1630 l 676 1630 l 464 1948 l 774 1948 l 912 1630"},\u00d3:{ha:1583,x_min:82,x_max:1500,o:"m 792 -20 l 792 -20 q 431 69 591 -20 q 176 329 270 158 q 82 744 82 500 l 82 744 q 176 1161 82 990 q 431 1421 270 1332 q 792 1510 591 1510 l 792 1510 q 1153 1421 992 1510 q 1407 1161 1313 1332 q 1500 744 1500 990 l 1500 744 q 1407 328 1500 499 q 1153 69 1313 157 q 792 -20 992 -20 m 792 290 l 792 290 q 978 342 900 290 q 1098 496 1056 394 q 1140 744 1140 597 l 1140 744 q 1098 994 1140 892 q 978 1148 1056 1096 q 792 1200 900 1200 l 792 1200 q 605 1148 683 1200 q 485 994 527 1095 q 443 744 443 892 l 443 744 q 485 496 443 597 q 605 343 527 395 q 792 290 683 290 m 906 1630 l 671 1630 l 809 1948 l 1119 1948 l 906 1630"},\u00d4:{ha:1583,x_min:82,x_max:1500,o:"m 792 -20 l 792 -20 q 431 69 591 -20 q 176 329 270 158 q 82 744 82 500 l 82 744 q 176 1161 82 990 q 431 1421 270 1332 q 792 1510 591 1510 l 792 1510 q 1153 1421 992 1510 q 1407 1161 1313 1332 q 1500 744 1500 990 l 1500 744 q 1407 328 1500 499 q 1153 69 1313 157 q 792 -20 992 -20 m 792 290 l 792 290 q 978 342 900 290 q 1098 496 1056 394 q 1140 744 1140 597 l 1140 744 q 1098 994 1140 892 q 978 1148 1056 1096 q 792 1200 900 1200 l 792 1200 q 605 1148 683 1200 q 485 994 527 1095 q 443 744 443 892 l 443 744 q 485 496 443 597 q 605 343 527 395 q 792 290 683 290 m 792 1802 l 649 1634 l 354 1634 l 354 1641 l 665 1948 l 918 1948 l 1229 1641 l 1229 1634 l 934 1634 l 792 1802"},\u00d5:{ha:1583,x_min:82,x_max:1500,o:"m 792 -20 l 792 -20 q 431 69 591 -20 q 176 329 270 158 q 82 744 82 500 l 82 744 q 176 1161 82 990 q 431 1421 270 1332 q 792 1510 591 1510 l 792 1510 q 1153 1421 992 1510 q 1407 1161 1313 1332 q 1500 744 1500 990 l 1500 744 q 1407 328 1500 499 q 1153 69 1313 157 q 792 -20 992 -20 m 792 290 l 792 290 q 978 342 900 290 q 1098 496 1056 394 q 1140 744 1140 597 l 1140 744 q 1098 994 1140 892 q 978 1148 1056 1096 q 792 1200 900 1200 l 792 1200 q 605 1148 683 1200 q 485 994 527 1095 q 443 744 443 892 l 443 744 q 485 496 443 597 q 605 343 527 395 q 792 290 683 290 m 935 1642 l 935 1642 q 845 1659 883 1642 q 777 1697 806 1675 q 722 1736 747 1719 q 672 1753 697 1753 l 672 1753 q 621 1725 639 1753 q 601 1649 603 1697 l 601 1649 l 420 1649 q 487 1863 423 1790 q 648 1936 550 1936 l 648 1936 q 738 1920 700 1936 q 806 1881 776 1903 q 860 1843 835 1859 q 911 1826 885 1826 l 911 1826 q 966 1853 949 1826 q 984 1930 982 1880 l 984 1930 l 1162 1930 q 1095 1717 1160 1791 q 935 1642 1030 1642"},\u00d6:{ha:1583,x_min:82,x_max:1500,o:"m 792 -20 l 792 -20 q 431 69 591 -20 q 176 329 270 158 q 82 744 82 500 l 82 744 q 176 1161 82 990 q 431 1421 270 1332 q 792 1510 591 1510 l 792 1510 q 1153 1421 992 1510 q 1407 1161 1313 1332 q 1500 744 1500 990 l 1500 744 q 1407 328 1500 499 q 1153 69 1313 157 q 792 -20 992 -20 m 792 290 l 792 290 q 978 342 900 290 q 1098 496 1056 394 q 1140 744 1140 597 l 1140 744 q 1098 994 1140 892 q 978 1148 1056 1096 q 792 1200 900 1200 l 792 1200 q 605 1148 683 1200 q 485 994 527 1095 q 443 744 443 892 l 443 744 q 485 496 443 597 q 605 343 527 395 q 792 290 683 290 m 1018 1632 l 1018 1632 q 903 1678 951 1632 q 855 1789 855 1724 l 855 1789 q 903 1900 855 1854 q 1018 1946 951 1946 l 1018 1946 q 1133 1900 1085 1946 q 1180 1789 1180 1854 l 1180 1789 q 1133 1678 1180 1724 q 1018 1632 1085 1632 m 566 1632 l 566 1632 q 451 1678 498 1632 q 403 1789 403 1724 l 403 1789 q 451 1900 403 1854 q 566 1946 498 1946 l 566 1946 q 681 1900 633 1946 q 728 1789 728 1854 l 728 1789 q 681 1678 728 1724 q 566 1632 633 1632"},\u00d8:{ha:1583,x_min:82,x_max:1500,o:"m 792 -20 l 792 -20 q 431 69 591 -20 l 431 69 q 430 69 430 69 l 430 69 l 331 -70 l 177 35 l 282 183 q 176 329 221 247 l 176 329 q 82 744 82 500 l 82 744 q 176 1161 82 990 q 431 1421 270 1332 q 792 1510 591 1510 l 792 1510 q 1153 1421 992 1510 l 1153 1421 q 1155 1420 1154 1420 l 1155 1420 l 1253 1559 l 1407 1452 l 1303 1305 q 1407 1161 1362 1242 l 1407 1161 q 1500 744 1500 990 l 1500 744 q 1407 328 1500 499 q 1153 69 1313 157 q 792 -20 992 -20 m 492 481 l 492 481 l 968 1155 q 792 1200 893 1200 l 792 1200 q 605 1148 683 1200 q 485 994 527 1095 q 443 744 443 892 l 443 744 q 485 496 443 597 l 485 496 q 492 481 488 488 m 792 290 l 792 290 q 978 342 900 290 q 1098 496 1056 394 q 1140 744 1140 597 l 1140 744 q 1098 994 1140 892 l 1098 994 q 1092 1007 1095 1001 l 1092 1007 l 617 335 q 792 290 691 290"},\u00d9:{ha:1489,x_min:116,x_max:1373,o:"m 744 -19 l 744 -19 q 415 49 556 -19 q 195 240 273 116 q 116 529 116 363 l 116 529 l 116 1490 l 469 1490 l 469 558 q 504 419 469 480 q 601 324 539 358 q 744 289 662 289 l 744 289 q 889 324 826 289 q 986 419 951 358 q 1020 558 1020 480 l 1020 558 l 1020 1490 l 1373 1490 l 1373 529 q 1294 240 1373 363 q 1074 49 1215 116 q 744 -19 932 -19 m 864 1630 l 628 1630 l 416 1948 l 726 1948 l 864 1630"},\u00da:{ha:1489,x_min:116,x_max:1373,o:"m 744 -19 l 744 -19 q 415 49 556 -19 q 195 240 273 116 q 116 529 116 363 l 116 529 l 116 1490 l 469 1490 l 469 558 q 504 419 469 480 q 601 324 539 358 q 744 289 662 289 l 744 289 q 889 324 826 289 q 986 419 951 358 q 1020 558 1020 480 l 1020 558 l 1020 1490 l 1373 1490 l 1373 529 q 1294 240 1373 363 q 1074 49 1215 116 q 744 -19 932 -19 m 859 1630 l 624 1630 l 762 1948 l 1072 1948 l 859 1630"},\u00db:{ha:1489,x_min:116,x_max:1373,o:"m 744 -19 l 744 -19 q 415 49 556 -19 q 195 240 273 116 q 116 529 116 363 l 116 529 l 116 1490 l 469 1490 l 469 558 q 504 419 469 480 q 601 324 539 358 q 744 289 662 289 l 744 289 q 889 324 826 289 q 986 419 951 358 q 1020 558 1020 480 l 1020 558 l 1020 1490 l 1373 1490 l 1373 529 q 1294 240 1373 363 q 1074 49 1215 116 q 744 -19 932 -19 m 744 1802 l 601 1634 l 306 1634 l 306 1641 l 617 1948 l 870 1948 l 1181 1641 l 1181 1634 l 886 1634 l 744 1802"},\u00dc:{ha:1489,x_min:116,x_max:1373,o:"m 744 -19 l 744 -19 q 415 49 556 -19 q 195 240 273 116 q 116 529 116 363 l 116 529 l 116 1490 l 469 1490 l 469 558 q 504 419 469 480 q 601 324 539 358 q 744 289 662 289 l 744 289 q 889 324 826 289 q 986 419 951 358 q 1020 558 1020 480 l 1020 558 l 1020 1490 l 1373 1490 l 1373 529 q 1294 240 1373 363 q 1074 49 1215 116 q 744 -19 932 -19 m 970 1632 l 970 1632 q 855 1678 903 1632 q 807 1789 807 1724 l 807 1789 q 855 1900 807 1854 q 970 1946 903 1946 l 970 1946 q 1085 1900 1037 1946 q 1132 1789 1132 1854 l 1132 1789 q 1085 1678 1132 1724 q 970 1632 1037 1632 m 518 1632 l 518 1632 q 403 1678 450 1632 q 355 1789 355 1724 l 355 1789 q 403 1900 355 1854 q 518 1946 450 1946 l 518 1946 q 633 1900 585 1946 q 680 1789 680 1854 l 680 1789 q 633 1678 680 1724 q 518 1632 585 1632"},\u00dd:{ha:1540,x_min:47,x_max:1493,o:"m 952 0 l 601 0 l 601 540 l 47 1490 l 461 1490 l 695 1033 q 756 900 729 967 l 756 900 q 778 841 767 873 l 778 841 q 800 901 789 873 l 800 901 q 858 1033 825 968 l 858 1033 l 1081 1490 l 1493 1490 l 952 540 l 952 0 m 885 1630 l 650 1630 l 788 1948 l 1098 1948 l 885 1630"},\u00df:{ha:1381,x_min:116,x_max:1316,o:"m 465 0 l 116 0 l 116 1093 q 182 1317 116 1223 q 369 1460 248 1410 q 652 1510 489 1510 l 652 1510 q 931 1465 804 1510 q 1134 1329 1057 1419 q 1211 1101 1211 1238 l 1211 1101 q 1157 909 1211 990 q 1002 802 1102 828 l 1002 802 l 1002 785 q 1233 672 1149 776 q 1316 410 1316 567 l 1316 410 q 1254 185 1316 276 q 1080 47 1191 93 q 825 0 969 0 l 825 0 l 618 0 l 618 279 l 760 279 q 908 325 853 279 q 962 448 962 371 l 962 448 q 901 575 962 528 q 736 622 840 622 l 736 622 l 624 622 l 624 884 l 698 884 q 780 907 745 884 q 834 967 814 929 q 853 1051 853 1004 l 853 1051 q 803 1174 853 1126 q 664 1222 753 1222 l 664 1222 q 520 1171 574 1222 q 465 1034 465 1120 l 465 1034 l 465 0"},\u00e0:{ha:1205,x_min:60,x_max:1089,o:"m 428 -20 l 428 -20 q 238 17 321 -20 q 107 127 154 53 q 60 310 60 200 l 60 310 q 93 467 60 403 q 183 571 125 531 q 316 632 241 611 q 476 660 391 653 l 476 660 q 629 678 571 668 q 714 706 687 687 q 741 759 741 725 l 741 759 l 741 763 q 723 829 741 802 q 671 870 705 856 q 589 884 637 884 l 589 884 q 504 870 541 884 q 442 830 466 856 q 408 769 418 804 l 408 769 l 92 810 q 179 979 114 906 q 348 1092 243 1051 q 592 1132 452 1132 l 592 1132 q 787 1108 696 1132 q 945 1036 877 1083 q 1051 919 1013 988 q 1089 759 1089 849 l 1089 759 l 1089 0 l 761 0 l 761 157 l 752 157 q 676 60 722 99 q 568 1 629 21 q 428 -20 506 -20 m 534 211 l 534 211 q 641 235 593 211 q 716 301 688 259 q 744 398 744 343 l 744 398 l 744 505 q 707 490 729 497 q 657 478 684 483 q 603 468 630 472 q 551 459 576 463 l 551 459 q 464 435 500 452 q 409 391 428 418 q 390 326 390 364 l 390 326 q 409 264 390 289 q 460 225 428 238 q 534 211 492 211 m 722 1258 l 486 1258 l 274 1576 l 584 1576 l 722 1258"},\u00e1:{ha:1205,x_min:60,x_max:1089,o:"m 428 -20 l 428 -20 q 238 17 321 -20 q 107 127 154 53 q 60 310 60 200 l 60 310 q 93 467 60 403 q 183 571 125 531 q 316 632 241 611 q 476 660 391 653 l 476 660 q 629 678 571 668 q 714 706 687 687 q 741 759 741 725 l 741 759 l 741 763 q 723 829 741 802 q 671 870 705 856 q 589 884 637 884 l 589 884 q 504 870 541 884 q 442 830 466 856 q 408 769 418 804 l 408 769 l 92 810 q 179 979 114 906 q 348 1092 243 1051 q 592 1132 452 1132 l 592 1132 q 787 1108 696 1132 q 945 1036 877 1083 q 1051 919 1013 988 q 1089 759 1089 849 l 1089 759 l 1089 0 l 761 0 l 761 157 l 752 157 q 676 60 722 99 q 568 1 629 21 q 428 -20 506 -20 m 534 211 l 534 211 q 641 235 593 211 q 716 301 688 259 q 744 398 744 343 l 744 398 l 744 505 q 707 490 729 497 q 657 478 684 483 q 603 468 630 472 q 551 459 576 463 l 551 459 q 464 435 500 452 q 409 391 428 418 q 390 326 390 364 l 390 326 q 409 264 390 289 q 460 225 428 238 q 534 211 492 211 m 717 1258 l 482 1258 l 620 1576 l 930 1576 l 717 1258"},\u00e2:{ha:1205,x_min:60,x_max:1089,o:"m 428 -20 l 428 -20 q 238 17 321 -20 q 107 127 154 53 q 60 310 60 200 l 60 310 q 93 467 60 403 q 183 571 125 531 q 316 632 241 611 q 476 660 391 653 l 476 660 q 629 678 571 668 q 714 706 687 687 q 741 759 741 725 l 741 759 l 741 763 q 723 829 741 802 q 671 870 705 856 q 589 884 637 884 l 589 884 q 504 870 541 884 q 442 830 466 856 q 408 769 418 804 l 408 769 l 92 810 q 179 979 114 906 q 348 1092 243 1051 q 592 1132 452 1132 l 592 1132 q 787 1108 696 1132 q 945 1036 877 1083 q 1051 919 1013 988 q 1089 759 1089 849 l 1089 759 l 1089 0 l 761 0 l 761 157 l 752 157 q 676 60 722 99 q 568 1 629 21 q 428 -20 506 -20 m 534 211 l 534 211 q 641 235 593 211 q 716 301 688 259 q 744 398 744 343 l 744 398 l 744 505 q 707 490 729 497 q 657 478 684 483 q 603 468 630 472 q 551 459 576 463 l 551 459 q 464 435 500 452 q 409 391 428 418 q 390 326 390 364 l 390 326 q 409 264 390 289 q 460 225 428 238 q 534 211 492 211 m 602 1430 l 459 1262 l 164 1262 l 164 1269 l 475 1576 l 728 1576 l 1039 1269 l 1039 1262 l 744 1262 l 602 1430"},\u00e3:{ha:1205,x_min:60,x_max:1089,o:"m 428 -20 l 428 -20 q 238 17 321 -20 q 107 127 154 53 q 60 310 60 200 l 60 310 q 93 467 60 403 q 183 571 125 531 q 316 632 241 611 q 476 660 391 653 l 476 660 q 629 678 571 668 q 714 706 687 687 q 741 759 741 725 l 741 759 l 741 763 q 723 829 741 802 q 671 870 705 856 q 589 884 637 884 l 589 884 q 504 870 541 884 q 442 830 466 856 q 408 769 418 804 l 408 769 l 92 810 q 179 979 114 906 q 348 1092 243 1051 q 592 1132 452 1132 l 592 1132 q 787 1108 696 1132 q 945 1036 877 1083 q 1051 919 1013 988 q 1089 759 1089 849 l 1089 759 l 1089 0 l 761 0 l 761 157 l 752 157 q 676 60 722 99 q 568 1 629 21 q 428 -20 506 -20 m 534 211 l 534 211 q 641 235 593 211 q 716 301 688 259 q 744 398 744 343 l 744 398 l 744 505 q 707 490 729 497 q 657 478 684 483 q 603 468 630 472 q 551 459 576 463 l 551 459 q 464 435 500 452 q 409 391 428 418 q 390 326 390 364 l 390 326 q 409 264 390 289 q 460 225 428 238 q 534 211 492 211 m 746 1270 l 746 1270 q 656 1287 694 1270 q 588 1325 617 1303 q 533 1364 558 1347 q 483 1381 508 1381 l 483 1381 q 432 1353 450 1381 q 412 1277 414 1325 l 412 1277 l 231 1277 q 298 1491 234 1418 q 459 1564 361 1564 l 459 1564 q 549 1548 511 1564 q 617 1509 587 1531 q 671 1471 646 1487 q 722 1454 696 1454 l 722 1454 q 777 1481 760 1454 q 795 1558 793 1508 l 795 1558 l 973 1558 q 906 1345 971 1419 q 746 1270 841 1270"},\u00e4:{ha:1205,x_min:60,x_max:1089,o:"m 428 -20 l 428 -20 q 238 17 321 -20 q 107 127 154 53 q 60 310 60 200 l 60 310 q 93 467 60 403 q 183 571 125 531 q 316 632 241 611 q 476 660 391 653 l 476 660 q 629 678 571 668 q 714 706 687 687 q 741 759 741 725 l 741 759 l 741 763 q 723 829 741 802 q 671 870 705 856 q 589 884 637 884 l 589 884 q 504 870 541 884 q 442 830 466 856 q 408 769 418 804 l 408 769 l 92 810 q 179 979 114 906 q 348 1092 243 1051 q 592 1132 452 1132 l 592 1132 q 787 1108 696 1132 q 945 1036 877 1083 q 1051 919 1013 988 q 1089 759 1089 849 l 1089 759 l 1089 0 l 761 0 l 761 157 l 752 157 q 676 60 722 99 q 568 1 629 21 q 428 -20 506 -20 m 534 211 l 534 211 q 641 235 593 211 q 716 301 688 259 q 744 398 744 343 l 744 398 l 744 505 q 707 490 729 497 q 657 478 684 483 q 603 468 630 472 q 551 459 576 463 l 551 459 q 464 435 500 452 q 409 391 428 418 q 390 326 390 364 l 390 326 q 409 264 390 289 q 460 225 428 238 q 534 211 492 211 m 828 1260 l 828 1260 q 713 1306 761 1260 q 665 1417 665 1352 l 665 1417 q 713 1528 665 1482 q 828 1574 761 1574 l 828 1574 q 943 1528 895 1574 q 990 1417 990 1482 l 990 1417 q 943 1306 990 1352 q 828 1260 895 1260 m 376 1260 l 376 1260 q 261 1306 308 1260 q 213 1417 213 1352 l 213 1417 q 261 1528 213 1482 q 376 1574 308 1574 l 376 1574 q 491 1528 443 1574 q 538 1417 538 1482 l 538 1417 q 491 1306 538 1352 q 376 1260 443 1260"},\u00e5:{ha:1205,x_min:60,x_max:1089,o:"m 428 -20 l 428 -20 q 238 17 321 -20 q 107 127 154 53 q 60 310 60 200 l 60 310 q 93 467 60 403 q 183 571 125 531 q 316 632 241 611 q 476 660 391 653 l 476 660 q 629 678 571 668 q 714 706 687 687 q 741 759 741 725 l 741 759 l 741 763 q 723 829 741 802 q 671 870 705 856 q 589 884 637 884 l 589 884 q 504 870 541 884 q 442 830 466 856 q 408 769 418 804 l 408 769 l 92 810 q 179 979 114 906 q 348 1092 243 1051 q 592 1132 452 1132 l 592 1132 q 787 1108 696 1132 q 945 1036 877 1083 q 1051 919 1013 988 q 1089 759 1089 849 l 1089 759 l 1089 0 l 761 0 l 761 157 l 752 157 q 676 60 722 99 q 568 1 629 21 q 428 -20 506 -20 m 534 211 l 534 211 q 641 235 593 211 q 716 301 688 259 q 744 398 744 343 l 744 398 l 744 505 q 707 490 729 497 q 657 478 684 483 q 603 468 630 472 q 551 459 576 463 l 551 459 q 464 435 500 452 q 409 391 428 418 q 390 326 390 364 l 390 326 q 409 264 390 289 q 460 225 428 238 q 534 211 492 211 m 603 1197 l 603 1197 q 462 1232 526 1197 q 361 1326 398 1267 q 323 1457 323 1385 l 323 1457 q 361 1587 323 1528 q 462 1681 398 1645 q 602 1716 526 1716 l 602 1716 q 744 1681 680 1716 q 845 1587 807 1645 q 882 1456 882 1529 l 882 1456 q 845 1326 882 1385 q 744 1232 807 1267 q 603 1197 680 1197 m 603 1339 l 603 1339 q 686 1373 652 1339 q 720 1456 720 1407 l 720 1456 q 686 1540 720 1505 q 602 1574 652 1574 l 602 1574 q 520 1540 554 1574 q 485 1456 485 1505 l 485 1456 q 520 1373 485 1407 q 603 1339 554 1339"},\u00e6:{ha:1858,x_min:60,x_max:1790,o:"m 449 -20 l 449 -20 q 244 17 332 -20 q 108 127 156 53 q 60 310 60 200 l 60 310 q 100 475 60 406 q 210 589 140 544 q 372 656 280 634 q 568 677 463 677 l 568 677 l 743 677 l 743 763 q 725 829 743 802 q 672 870 706 856 q 589 884 637 884 q 504 870 541 884 q 442 830 466 856 q 408 769 418 804 l 408 769 l 92 810 q 179 979 114 906 q 348 1092 243 1051 q 592 1132 452 1132 l 592 1132 q 816 1091 728 1132 l 816 1091 q 911 1023 872 1064 l 911 1023 q 925 1034 918 1028 l 925 1034 q 1072 1107 990 1081 q 1252 1132 1154 1132 l 1252 1132 q 1469 1095 1370 1132 q 1639 986 1567 1058 q 1751 807 1711 913 q 1790 562 1790 701 l 1790 562 l 1790 474 l 1043 474 q 1071 344 1046 396 l 1071 344 q 1151 260 1099 287 q 1269 232 1202 232 l 1269 232 q 1355 245 1316 232 q 1421 284 1393 258 q 1463 348 1449 310 l 1463 348 l 1783 337 q 1695 148 1762 228 q 1518 23 1627 67 q 1263 -21 1409 -21 l 1263 -21 q 1070 6 1158 -21 q 916 82 982 32 l 916 82 q 850 141 879 108 l 850 141 q 815 101 835 119 l 815 101 q 713 34 771 60 q 588 -6 655 7 q 449 -20 520 -20 m 743 398 l 743 474 l 598 474 q 481 454 526 474 q 413 402 435 434 q 390 333 390 370 l 390 333 q 431 241 390 271 q 534 211 471 211 l 534 211 q 640 235 593 211 q 715 301 687 259 q 743 398 743 343 l 743 398 m 1045 677 l 1045 677 l 1459 677 q 1440 762 1455 724 l 1440 762 q 1370 849 1416 818 q 1255 879 1323 879 l 1255 879 q 1139 849 1186 879 q 1068 764 1092 818 l 1068 764 q 1045 677 1050 725"},\u00e7:{ha:1219,x_min:72,x_max:1150,o:"m 647 -418 l 498 -418 l 498 -293 l 629 -293 q 694 -279 674 -293 q 713 -233 713 -265 l 713 -233 q 694 -188 713 -202 q 629 -174 674 -174 l 629 -174 l 533 -174 l 561 -18 q 333 52 432 -5 l 333 52 q 140 254 207 124 q 72 555 72 383 l 72 555 q 140 858 72 728 q 333 1060 207 987 q 634 1132 459 1132 l 634 1132 q 830 1104 741 1132 q 986 1025 919 1076 q 1095 900 1053 973 q 1149 735 1136 826 l 1149 735 l 827 681 q 803 759 819 725 q 763 817 786 793 q 708 853 739 841 q 638 865 676 865 l 638 865 q 524 829 571 865 q 453 723 477 792 q 428 557 428 653 q 453 391 428 461 q 524 284 477 321 q 638 246 571 246 l 638 246 q 708 259 677 246 q 764 296 739 271 q 805 356 788 320 q 828 436 821 391 l 828 436 l 1150 384 q 1096 216 1137 290 q 987 88 1054 141 q 831 7 920 35 l 831 7 q 694 -19 767 -13 l 694 -19 l 688 -89 q 835 -123 781 -81 q 889 -243 889 -165 l 889 -243 q 832 -378 889 -338 q 647 -418 774 -418 l 647 -418"},\u00e8:{ha:1230,x_min:72,x_max:1162,o:"m 636 -21 l 636 -21 q 334 49 461 -21 q 140 247 207 118 q 72 555 72 376 l 72 555 q 140 857 72 727 q 331 1060 207 987 q 623 1132 455 1132 l 623 1132 q 840 1095 741 1132 q 1011 986 938 1058 q 1123 807 1083 913 q 1162 562 1162 701 l 1162 562 l 1162 474 l 415 474 q 444 347 418 399 l 444 347 q 523 261 472 289 q 642 232 574 232 l 642 232 q 728 245 689 232 q 794 284 766 258 q 835 347 821 310 l 835 347 l 1146 296 q 1050 129 1118 200 q 877 18 981 57 q 636 -21 772 -21 m 417 677 l 417 677 l 831 677 q 810 763 825 725 l 810 763 q 740 849 786 819 q 626 879 694 879 q 511 849 558 879 q 440 764 464 818 l 440 764 q 417 677 422 725 m 737 1258 l 501 1258 l 289 1576 l 599 1576 l 737 1258"},\u00e9:{ha:1230,x_min:72,x_max:1162,o:"m 636 -21 l 636 -21 q 334 49 461 -21 q 140 247 207 118 q 72 555 72 376 l 72 555 q 140 857 72 727 q 331 1060 207 987 q 623 1132 455 1132 l 623 1132 q 840 1095 741 1132 q 1011 986 938 1058 q 1123 807 1083 913 q 1162 562 1162 701 l 1162 562 l 1162 474 l 415 474 q 444 347 418 399 l 444 347 q 523 261 472 289 q 642 232 574 232 l 642 232 q 728 245 689 232 q 794 284 766 258 q 835 347 821 310 l 835 347 l 1146 296 q 1050 129 1118 200 q 877 18 981 57 q 636 -21 772 -21 m 417 677 l 417 677 l 831 677 q 810 763 825 725 l 810 763 q 740 849 786 819 q 626 879 694 879 q 511 849 558 879 q 440 764 464 818 l 440 764 q 417 677 422 725 m 732 1258 l 497 1258 l 635 1576 l 945 1576 l 732 1258"},\u00ea:{ha:1230,x_min:72,x_max:1162,o:"m 636 -21 l 636 -21 q 334 49 461 -21 q 140 247 207 118 q 72 555 72 376 l 72 555 q 140 857 72 727 q 331 1060 207 987 q 623 1132 455 1132 l 623 1132 q 840 1095 741 1132 q 1011 986 938 1058 q 1123 807 1083 913 q 1162 562 1162 701 l 1162 562 l 1162 474 l 415 474 q 444 347 418 399 l 444 347 q 523 261 472 289 q 642 232 574 232 l 642 232 q 728 245 689 232 q 794 284 766 258 q 835 347 821 310 l 835 347 l 1146 296 q 1050 129 1118 200 q 877 18 981 57 q 636 -21 772 -21 m 417 677 l 417 677 l 831 677 q 810 763 825 725 l 810 763 q 740 849 786 819 q 626 879 694 879 q 511 849 558 879 q 440 764 464 818 l 440 764 q 417 677 422 725 m 618 1430 l 475 1262 l 180 1262 l 180 1269 l 491 1576 l 744 1576 l 1055 1269 l 1055 1262 l 760 1262 l 618 1430"},\u00eb:{ha:1230,x_min:72,x_max:1162,o:"m 636 -21 l 636 -21 q 334 49 461 -21 q 140 247 207 118 q 72 555 72 376 l 72 555 q 140 857 72 727 q 331 1060 207 987 q 623 1132 455 1132 l 623 1132 q 840 1095 741 1132 q 1011 986 938 1058 q 1123 807 1083 913 q 1162 562 1162 701 l 1162 562 l 1162 474 l 415 474 q 444 347 418 399 l 444 347 q 523 261 472 289 q 642 232 574 232 l 642 232 q 728 245 689 232 q 794 284 766 258 q 835 347 821 310 l 835 347 l 1146 296 q 1050 129 1118 200 q 877 18 981 57 q 636 -21 772 -21 m 417 677 l 417 677 l 831 677 q 810 763 825 725 l 810 763 q 740 849 786 819 q 626 879 694 879 q 511 849 558 879 q 440 764 464 818 l 440 764 q 417 677 422 725 m 844 1260 l 844 1260 q 729 1306 777 1260 q 681 1417 681 1352 l 681 1417 q 729 1528 681 1482 q 844 1574 777 1574 l 844 1574 q 959 1528 911 1574 q 1006 1417 1006 1482 l 1006 1417 q 959 1306 1006 1352 q 844 1260 911 1260 m 392 1260 l 392 1260 q 277 1306 324 1260 q 229 1417 229 1352 l 229 1417 q 277 1528 229 1482 q 392 1574 324 1574 l 392 1574 q 507 1528 459 1574 q 554 1417 554 1482 l 554 1417 q 507 1306 554 1352 q 392 1260 459 1260"},\u00ec:{ha:580,x_min:-39,x_max:464,o:"m 464 0 l 115 0 l 115 1118 l 464 1118 l 464 0 m 409 1258 l 173 1258 l -39 1576 l 271 1576 l 409 1258"},\u00ed:{ha:580,x_min:115,x_max:617,o:"m 464 0 l 115 0 l 115 1118 l 464 1118 l 464 0 m 404 1258 l 169 1258 l 307 1576 l 617 1576 l 404 1258"},\u00ee:{ha:580,x_min:-148,x_max:727,o:"m 464 0 l 115 0 l 115 1118 l 464 1118 l 464 0 m 290 1430 l 147 1262 l -148 1262 l -148 1269 l 163 1576 l 416 1576 l 727 1269 l 727 1262 l 432 1262 l 290 1430"},\u00ef:{ha:580,x_min:-99,x_max:678,o:"m 464 0 l 115 0 l 115 1118 l 464 1118 l 464 0 m 516 1260 l 516 1260 q 401 1306 449 1260 q 353 1417 353 1352 l 353 1417 q 401 1528 353 1482 q 516 1574 449 1574 l 516 1574 q 631 1528 583 1574 q 678 1417 678 1482 l 678 1417 q 631 1306 678 1352 q 516 1260 583 1260 m 64 1260 l 64 1260 q -51 1306 -4 1260 q -99 1417 -99 1352 l -99 1417 q -51 1528 -99 1482 q 64 1574 -4 1574 l 64 1574 q 179 1528 131 1574 q 226 1417 226 1482 l 226 1417 q 179 1306 226 1352 q 64 1260 131 1260"},\u00f1:{ha:1301,x_min:115,x_max:1186,o:"m 464 638 l 464 638 l 464 0 l 115 0 l 115 1118 l 443 1118 l 449 876 q 564 1051 490 982 l 564 1051 q 799 1132 651 1132 l 799 1132 q 1003 1080 916 1132 q 1138 933 1090 1028 q 1186 712 1186 838 l 1186 712 l 1186 0 l 837 0 l 837 644 q 789 792 837 738 q 655 845 741 845 l 655 845 q 556 821 599 845 q 488 750 512 796 q 464 638 464 704 m 794 1270 l 794 1270 q 704 1287 742 1270 q 636 1325 665 1303 q 581 1364 606 1347 q 531 1381 556 1381 l 531 1381 q 480 1353 498 1381 q 460 1277 462 1325 l 460 1277 l 279 1277 q 346 1491 282 1418 q 507 1564 409 1564 l 507 1564 q 597 1548 559 1564 q 665 1509 635 1531 q 719 1471 694 1487 q 770 1454 744 1454 l 770 1454 q 825 1481 808 1454 q 843 1558 841 1508 l 843 1558 l 1021 1558 q 954 1345 1019 1419 q 794 1270 889 1270"},\u00f2:{ha:1268,x_min:72,x_max:1195,o:"m 634 -21 l 634 -21 q 333 52 459 -21 q 140 254 207 124 q 72 555 72 383 l 72 555 q 140 858 72 728 q 333 1060 207 987 q 634 1132 459 1132 l 634 1132 q 935 1060 809 1132 q 1128 858 1061 987 q 1195 555 1195 728 l 1195 555 q 1128 254 1195 383 q 935 52 1061 124 q 634 -21 809 -21 m 634 246 l 634 246 q 747 285 701 246 q 817 394 793 324 q 840 557 840 464 l 840 557 q 817 720 840 650 q 747 827 793 789 q 634 865 701 865 l 634 865 q 521 827 567 865 q 452 720 475 789 q 428 557 428 650 l 428 557 q 452 394 428 464 q 521 285 475 324 q 634 246 567 246 m 753 1258 l 517 1258 l 305 1576 l 615 1576 l 753 1258"},\u00f3:{ha:1268,x_min:72,x_max:1195,o:"m 634 -21 l 634 -21 q 333 52 459 -21 q 140 254 207 124 q 72 555 72 383 l 72 555 q 140 858 72 728 q 333 1060 207 987 q 634 1132 459 1132 l 634 1132 q 935 1060 809 1132 q 1128 858 1061 987 q 1195 555 1195 728 l 1195 555 q 1128 254 1195 383 q 935 52 1061 124 q 634 -21 809 -21 m 634 246 l 634 246 q 747 285 701 246 q 817 394 793 324 q 840 557 840 464 l 840 557 q 817 720 840 650 q 747 827 793 789 q 634 865 701 865 l 634 865 q 521 827 567 865 q 452 720 475 789 q 428 557 428 650 l 428 557 q 452 394 428 464 q 521 285 475 324 q 634 246 567 246 m 748 1258 l 513 1258 l 651 1576 l 961 1576 l 748 1258"},\u00f4:{ha:1268,x_min:72,x_max:1195,o:"m 634 -21 l 634 -21 q 333 52 459 -21 q 140 254 207 124 q 72 555 72 383 l 72 555 q 140 858 72 728 q 333 1060 207 987 q 634 1132 459 1132 l 634 1132 q 935 1060 809 1132 q 1128 858 1061 987 q 1195 555 1195 728 l 1195 555 q 1128 254 1195 383 q 935 52 1061 124 q 634 -21 809 -21 m 634 246 l 634 246 q 747 285 701 246 q 817 394 793 324 q 840 557 840 464 l 840 557 q 817 720 840 650 q 747 827 793 789 q 634 865 701 865 l 634 865 q 521 827 567 865 q 452 720 475 789 q 428 557 428 650 l 428 557 q 452 394 428 464 q 521 285 475 324 q 634 246 567 246 m 634 1430 l 491 1262 l 196 1262 l 196 1269 l 507 1576 l 760 1576 l 1071 1269 l 1071 1262 l 776 1262 l 634 1430"},\u00f5:{ha:1268,x_min:72,x_max:1195,o:"m 634 -21 l 634 -21 q 333 52 459 -21 q 140 254 207 124 q 72 555 72 383 l 72 555 q 140 858 72 728 q 333 1060 207 987 q 634 1132 459 1132 l 634 1132 q 935 1060 809 1132 q 1128 858 1061 987 q 1195 555 1195 728 l 1195 555 q 1128 254 1195 383 q 935 52 1061 124 q 634 -21 809 -21 m 634 246 l 634 246 q 747 285 701 246 q 817 394 793 324 q 840 557 840 464 l 840 557 q 817 720 840 650 q 747 827 793 789 q 634 865 701 865 l 634 865 q 521 827 567 865 q 452 720 475 789 q 428 557 428 650 l 428 557 q 452 394 428 464 q 521 285 475 324 q 634 246 567 246 m 777 1270 l 777 1270 q 687 1287 725 1270 q 619 1325 648 1303 q 564 1364 589 1347 q 514 1381 539 1381 l 514 1381 q 463 1353 481 1381 q 443 1277 445 1325 l 443 1277 l 262 1277 q 329 1491 265 1418 q 490 1564 392 1564 l 490 1564 q 580 1548 542 1564 q 648 1509 618 1531 q 702 1471 677 1487 q 753 1454 727 1454 l 753 1454 q 808 1481 791 1454 q 826 1558 824 1508 l 826 1558 l 1004 1558 q 937 1345 1002 1419 q 777 1270 872 1270"},\u00f6:{ha:1268,x_min:72,x_max:1195,o:"m 634 -21 l 634 -21 q 333 52 459 -21 q 140 254 207 124 q 72 555 72 383 l 72 555 q 140 858 72 728 q 333 1060 207 987 q 634 1132 459 1132 l 634 1132 q 935 1060 809 1132 q 1128 858 1061 987 q 1195 555 1195 728 l 1195 555 q 1128 254 1195 383 q 935 52 1061 124 q 634 -21 809 -21 m 634 246 l 634 246 q 747 285 701 246 q 817 394 793 324 q 840 557 840 464 l 840 557 q 817 720 840 650 q 747 827 793 789 q 634 865 701 865 l 634 865 q 521 827 567 865 q 452 720 475 789 q 428 557 428 650 l 428 557 q 452 394 428 464 q 521 285 475 324 q 634 246 567 246 m 860 1260 l 860 1260 q 745 1306 793 1260 q 697 1417 697 1352 l 697 1417 q 745 1528 697 1482 q 860 1574 793 1574 l 860 1574 q 975 1528 927 1574 q 1022 1417 1022 1482 l 1022 1417 q 975 1306 1022 1352 q 860 1260 927 1260 m 408 1260 l 408 1260 q 293 1306 340 1260 q 245 1417 245 1352 l 245 1417 q 293 1528 245 1482 q 408 1574 340 1574 l 408 1574 q 523 1528 475 1574 q 570 1417 570 1482 l 570 1417 q 523 1306 570 1352 q 408 1260 475 1260"},\u00f8:{ha:1268,x_min:72,x_max:1195,o:"m 634 -21 l 634 -21 q 333 52 459 -21 l 333 52 q 295 75 313 63 l 295 75 l 186 -47 l 81 47 l 192 172 q 140 254 163 209 l 140 254 q 72 555 72 383 l 72 555 q 140 858 72 728 q 333 1060 207 987 q 634 1132 459 1132 q 935 1060 809 1132 l 935 1060 q 968 1039 952 1050 l 968 1039 l 1081 1165 l 1186 1071 l 1072 944 q 1128 858 1104 904 l 1128 858 q 1195 555 1195 728 l 1195 555 q 1128 254 1195 383 q 935 52 1061 124 q 634 -21 809 -21 m 634 246 l 634 246 q 747 285 701 246 q 817 394 793 324 q 840 557 840 464 l 840 557 q 829 672 840 620 l 829 672 l 501 305 q 521 285 510 294 l 521 285 q 634 246 567 246 m 438 446 l 438 446 l 764 811 q 747 827 756 820 l 747 827 q 634 865 701 865 q 521 827 567 865 q 452 720 475 789 q 428 557 428 650 l 428 557 q 438 446 428 497"},\u00f9:{ha:1301,x_min:115,x_max:1186,o:"m 503 -14 l 503 -14 q 299 38 386 -14 q 163 185 211 90 q 115 406 115 280 l 115 406 l 115 1118 l 464 1118 l 464 474 q 513 327 464 380 q 646 273 561 273 l 646 273 q 747 298 704 273 q 813 369 789 322 q 837 480 837 415 l 837 480 l 837 1118 l 1186 1118 l 1186 0 l 858 0 l 853 242 q 737 67 811 135 l 737 67 q 503 -14 649 -14 m 771 1258 l 535 1258 l 323 1576 l 633 1576 l 771 1258"},\u00fa:{ha:1301,x_min:115,x_max:1186,o:"m 503 -14 l 503 -14 q 299 38 386 -14 q 163 185 211 90 q 115 406 115 280 l 115 406 l 115 1118 l 464 1118 l 464 474 q 513 327 464 380 q 646 273 561 273 l 646 273 q 747 298 704 273 q 813 369 789 322 q 837 480 837 415 l 837 480 l 837 1118 l 1186 1118 l 1186 0 l 858 0 l 853 242 q 737 67 811 135 l 737 67 q 503 -14 649 -14 m 766 1258 l 531 1258 l 669 1576 l 979 1576 l 766 1258"},\u00fb:{ha:1301,x_min:115,x_max:1186,o:"m 503 -14 l 503 -14 q 299 38 386 -14 q 163 185 211 90 q 115 406 115 280 l 115 406 l 115 1118 l 464 1118 l 464 474 q 513 327 464 380 q 646 273 561 273 l 646 273 q 747 298 704 273 q 813 369 789 322 q 837 480 837 415 l 837 480 l 837 1118 l 1186 1118 l 1186 0 l 858 0 l 853 242 q 737 67 811 135 l 737 67 q 503 -14 649 -14 m 652 1430 l 509 1262 l 214 1262 l 214 1269 l 525 1576 l 778 1576 l 1089 1269 l 1089 1262 l 794 1262 l 652 1430"},\u00fc:{ha:1301,x_min:115,x_max:1186,o:"m 503 -14 l 503 -14 q 299 38 386 -14 q 163 185 211 90 q 115 406 115 280 l 115 406 l 115 1118 l 464 1118 l 464 474 q 513 327 464 380 q 646 273 561 273 l 646 273 q 747 298 704 273 q 813 369 789 322 q 837 480 837 415 l 837 480 l 837 1118 l 1186 1118 l 1186 0 l 858 0 l 853 242 q 737 67 811 135 l 737 67 q 503 -14 649 -14 m 878 1260 l 878 1260 q 763 1306 811 1260 q 715 1417 715 1352 l 715 1417 q 763 1528 715 1482 q 878 1574 811 1574 l 878 1574 q 993 1528 945 1574 q 1040 1417 1040 1482 l 1040 1417 q 993 1306 1040 1352 q 878 1260 945 1260 m 426 1260 l 426 1260 q 311 1306 358 1260 q 263 1417 263 1352 l 263 1417 q 311 1528 263 1482 q 426 1574 358 1574 l 426 1574 q 541 1528 493 1574 q 588 1417 588 1482 l 588 1417 q 541 1306 588 1352 q 426 1260 493 1260"},\u00fd:{ha:1266,x_min:22,x_max:1244,o:"m 112 -392 l 112 -392 l 190 -137 l 234 -149 q 345 -158 297 -165 q 418 -123 392 -151 q 440 -49 443 -95 l 440 -49 l 439 -2 l 22 1118 l 390 1118 l 557 571 q 611 346 591 459 l 611 346 q 623 277 616 312 l 623 277 q 639 347 631 313 l 639 347 q 701 571 666 461 l 701 571 l 880 1118 l 1244 1118 l 775 -118 q 686 -277 741 -208 q 546 -386 631 -347 q 334 -426 460 -426 l 334 -426 q 211 -416 270 -426 q 112 -392 151 -407 m 751 1258 l 516 1258 l 654 1576 l 964 1576 l 751 1258"},\u00ff:{ha:1266,x_min:22,x_max:1244,o:"m 112 -392 l 112 -392 l 190 -137 l 234 -149 q 345 -158 297 -165 q 418 -123 392 -151 q 440 -49 443 -95 l 440 -49 l 439 -2 l 22 1118 l 390 1118 l 557 571 q 611 346 591 459 l 611 346 q 623 277 616 312 l 623 277 q 639 347 631 313 l 639 347 q 701 571 666 461 l 701 571 l 880 1118 l 1244 1118 l 775 -118 q 686 -277 741 -208 q 546 -386 631 -347 q 334 -426 460 -426 l 334 -426 q 211 -416 270 -426 q 112 -392 151 -407 m 862 1260 l 862 1260 q 747 1306 795 1260 q 699 1417 699 1352 l 699 1417 q 747 1528 699 1482 q 862 1574 795 1574 l 862 1574 q 977 1528 929 1574 q 1024 1417 1024 1482 l 1024 1417 q 977 1306 1024 1352 q 862 1260 929 1260 m 410 1260 l 410 1260 q 295 1306 342 1260 q 247 1417 247 1352 l 247 1417 q 295 1528 247 1482 q 410 1574 342 1574 l 410 1574 q 525 1528 477 1574 q 572 1417 572 1482 l 572 1417 q 525 1306 572 1352 q 410 1260 477 1260"},"\u2013":{ha:1024,x_min:0,x_max:1024,o:"m 0 738 l 1024 738 l 1024 469 l 0 469 l 0 738"},"\u2014":{ha:2048,x_min:0,x_max:2048,o:"m 0 738 l 2048 738 l 2048 469 l 0 469 l 0 738"},"\u2018":{ha:678,x_min:168,x_max:594,o:"m 506 848 l 168 848 l 363 1490 l 594 1490 l 506 848"},"\u2019":{ha:678,x_min:168,x_max:594,o:"m 398 848 l 168 848 l 256 1490 l 594 1490 l 398 848"},"\u201c":{ha:1189,x_min:168,x_max:1105,o:"m 506 848 l 168 848 l 363 1490 l 594 1490 l 506 848 m 1017 848 l 679 848 l 874 1490 l 1105 1490 l 1017 848"},"\u201d":{ha:1166,x_min:168,x_max:1082,o:"m 398 848 l 168 848 l 256 1490 l 594 1490 l 398 848 m 886 848 l 656 848 l 744 1490 l 1082 1490 l 886 848"},"\u2022":{ha:897,x_min:128,x_max:768,o:"m 448 274 l 448 274 q 287 317 360 274 q 171 433 214 360 q 128 594 128 506 l 128 594 q 171 756 128 683 q 287 871 214 828 q 448 914 360 914 l 448 914 q 610 871 537 914 q 725 756 682 828 q 768 594 768 683 l 768 594 q 725 433 768 506 q 610 317 682 360 q 448 274 537 274"},"\u2026":{ha:2167,x_min:172,x_max:1994,o:"m 361 -21 l 361 -21 q 227 33 281 -21 q 172 165 172 86 l 172 165 q 227 299 172 245 q 361 352 281 352 l 361 352 q 496 299 441 352 q 550 165 550 245 l 550 165 q 496 33 550 86 q 361 -21 441 -21 m 1083 -21 l 1083 -21 q 949 33 1003 -21 q 894 165 894 86 l 894 165 q 949 299 894 245 q 1083 352 1003 352 l 1083 352 q 1218 299 1163 352 q 1272 165 1272 245 l 1272 165 q 1218 33 1272 86 q 1083 -21 1163 -21 m 1805 -21 l 1805 -21 q 1671 33 1725 -21 q 1616 165 1616 86 l 1616 165 q 1671 299 1616 245 q 1805 352 1725 352 l 1805 352 q 1940 299 1885 352 q 1994 165 1994 245 l 1994 165 q 1940 33 1994 86 q 1805 -21 1885 -21"},"\u20ac":{ha:1417,x_min:61,x_max:1309,o:"m 635 980 l 1114 980 l 1042 818 l 609 818 q 607 742 607 782 l 607 742 q 609 672 607 705 l 609 672 l 971 672 l 890 504 l 636 504 q 644 480 639 492 l 644 480 q 748 336 680 380 q 910 291 816 291 l 910 291 q 1026 308 975 291 q 1114 348 1077 325 q 1173 384 1151 370 l 1173 384 l 1304 108 q 1124 12 1224 44 q 910 -20 1024 -20 l 910 -20 q 568 70 717 -20 q 335 330 419 159 l 335 330 q 274 504 295 409 l 274 504 l 61 504 l 122 672 l 252 672 q 250 742 250 706 l 250 742 q 252 818 250 781 l 252 818 l 61 818 l 122 980 l 274 980 q 335 1158 295 1077 l 335 1158 q 568 1420 419 1329 q 910 1510 717 1510 l 910 1510 q 1128 1477 1028 1510 q 1309 1381 1227 1444 l 1309 1381 l 1179 1104 q 1117 1140 1155 1118 q 1028 1180 1079 1162 q 910 1197 976 1197 l 910 1197 q 748 1151 816 1197 q 644 1005 680 1105 l 644 1005 q 635 980 639 993 l 635 980"},"\u00a3":{ha:1331,x_min:87,x_max:1255,o:"m 904 0 l 87 0 l 87 289 l 88 289 q 216 324 169 289 q 258 428 262 359 l 258 428 l 245 640 l 87 640 l 87 850 l 233 850 l 225 985 q 280 1272 214 1154 q 465 1451 345 1389 q 735 1513 584 1513 l 735 1513 q 974 1463 867 1513 q 1150 1321 1080 1413 q 1241 1101 1220 1229 l 1241 1101 l 916 1051 q 861 1181 903 1137 q 741 1224 818 1224 l 741 1224 q 635 1199 676 1224 q 575 1125 593 1174 q 558 1004 556 1076 l 558 1004 l 563 850 l 919 850 l 919 640 l 571 640 l 576 488 q 538 359 579 407 l 538 359 q 440 289 499 313 l 440 289 l 888 289 q 920 300 909 289 q 930 332 930 311 l 930 332 l 930 386 l 1255 386 l 1255 327 q 1165 85 1255 169 q 904 0 1075 0 l 904 0"},"\u00a5":{ha:1185,x_min:30,x_max:1157,o:"m 30 1490 l 387 1490 l 593 965 l 798 1490 l 1157 1490 l 835 776 l 1047 776 l 1047 582 l 761 582 l 761 488 l 1047 488 l 1047 294 l 761 294 l 761 0 l 414 0 l 414 294 l 98 294 l 98 488 l 414 488 l 414 582 l 98 582 l 98 776 l 349 776 l 30 1490"},"\u00a9":{ha:1872,x_min:168,x_max:1704,o:"m 538 744 l 538 744 q 592 948 538 856 q 739 1094 646 1039 q 942 1149 831 1149 l 942 1149 q 1124 1106 1041 1149 q 1261 988 1207 1062 q 1325 820 1314 914 l 1325 820 l 1098 820 q 1044 901 1088 869 q 942 932 999 932 l 942 932 q 849 907 891 932 q 780 840 806 882 q 754 745 754 797 l 754 745 q 780 652 754 694 q 849 584 806 609 q 942 558 891 558 l 942 558 q 1042 589 999 558 q 1095 669 1084 620 l 1095 669 l 1321 669 q 1258 502 1311 576 q 1123 384 1205 427 q 942 341 1041 341 l 942 341 q 739 396 831 341 q 592 542 646 450 q 538 744 538 633 m 936 -23 l 936 -23 q 638 37 777 -23 q 393 202 499 96 q 228 447 287 308 q 168 745 168 586 l 168 745 q 228 1043 168 904 q 393 1288 287 1182 q 638 1454 499 1394 q 936 1513 777 1513 l 936 1513 q 1234 1454 1095 1513 q 1479 1288 1373 1394 q 1645 1043 1585 1182 q 1704 745 1704 904 l 1704 745 q 1645 447 1704 586 q 1479 202 1585 308 q 1234 37 1373 96 q 936 -23 1095 -23 m 936 239 l 936 239 q 1133 279 1041 239 q 1294 388 1224 318 q 1403 549 1363 457 q 1442 745 1442 640 l 1442 745 q 1403 942 1442 850 q 1294 1103 1363 1033 q 1133 1212 1224 1172 q 936 1251 1041 1251 l 936 1251 q 740 1212 831 1251 q 579 1103 648 1172 q 470 942 509 1033 q 430 745 430 850 l 430 745 q 470 549 430 640 q 579 388 509 457 q 740 279 648 318 q 936 239 831 239"},"\u00ae":{ha:1353,x_min:95,x_max:1258,o:"m 676 346 l 676 346 q 451 392 556 346 q 266 517 345 437 q 141 703 186 597 q 95 928 95 808 q 141 1154 95 1048 q 266 1339 186 1259 q 451 1465 345 1419 q 676 1510 556 1510 l 676 1510 q 903 1465 797 1510 q 1088 1339 1008 1419 q 1213 1154 1168 1259 q 1258 928 1258 1048 q 1213 703 1258 808 q 1088 517 1168 597 q 903 392 1008 437 q 676 346 797 346 m 676 504 l 676 504 q 891 561 794 504 q 1044 715 987 618 q 1101 928 1101 811 q 1044 1141 1101 1045 q 890 1295 986 1237 q 676 1352 794 1352 l 676 1352 q 463 1295 559 1352 q 310 1141 367 1237 q 252 928 252 1045 q 310 715 252 811 q 464 562 367 619 q 676 504 560 504 m 932 665 l 771 665 l 691 845 l 610 845 l 610 665 l 464 665 l 464 1201 l 724 1201 q 824 1180 780 1201 q 892 1119 867 1158 q 916 1023 916 1079 l 916 1023 q 891 927 916 966 l 891 927 q 831 872 868 892 l 831 872 l 932 665 m 610 1095 l 610 938 l 691 938 q 744 958 723 938 q 764 1018 764 978 q 744 1077 764 1058 q 691 1095 723 1095 l 691 1095 l 610 1095"},"\u2122":{ha:1335,x_min:82,x_max:1241,o:"m 986 954 l 903 954 l 794 1236 l 794 954 l 648 954 l 648 1490 l 822 1490 l 944 1147 l 1067 1490 l 1241 1490 l 1241 954 l 1095 954 l 1095 1238 l 986 954 m 392 954 l 244 954 l 244 1370 l 82 1370 l 82 1490 l 554 1490 l 554 1370 l 392 1370 l 392 954"},"\u00b0":{ha:944,x_min:109,x_max:836,o:"m 473 772 l 473 772 q 290 821 372 772 q 158 953 207 870 q 109 1135 109 1035 l 109 1135 q 158 1319 109 1236 q 290 1450 207 1401 q 473 1499 372 1499 l 473 1499 q 656 1450 573 1499 q 787 1319 738 1401 q 836 1135 836 1236 l 836 1135 q 787 953 836 1035 q 656 821 738 870 q 473 772 573 772 m 473 995 l 473 995 q 543 1015 511 996 q 594 1065 575 1033 q 613 1135 613 1097 l 613 1135 q 594 1206 613 1174 q 543 1256 575 1237 q 473 1274 511 1274 l 473 1274 q 403 1256 434 1274 q 352 1206 371 1237 q 333 1135 333 1174 l 333 1135 q 352 1066 333 1097 q 403 1015 371 1034 q 473 995 434 996"},"\u00d7":{ha:1404,x_min:155,x_max:1251,o:"m 1251 264 l 1038 51 l 703 385 l 369 51 l 155 264 l 489 598 l 155 931 l 369 1148 l 703 813 l 1038 1148 l 1251 931 l 918 598 l 1251 264"},"\u00f7":{ha:1404,x_min:181,x_max:1224,o:"m 181 735 l 1224 735 l 1224 465 l 181 465 l 181 735 m 702 -1 l 702 -1 q 569 55 624 0 q 514 189 514 110 l 514 189 q 569 320 514 265 q 702 374 624 374 l 702 374 q 834 320 779 374 q 889 189 889 265 l 889 189 q 834 55 889 110 q 702 -1 779 0 m 702 825 l 702 825 q 569 881 624 825 q 514 1014 514 936 l 514 1014 q 569 1146 514 1091 q 702 1201 624 1201 l 702 1201 q 835 1146 780 1201 q 889 1014 889 1091 l 889 1014 q 835 881 889 936 q 702 825 780 825"}},familyName:"Inter",ascender:1984,descender:-494,underlinePosition:-313,underlineThickness:210,boundingBox:{yMin:-480,xMin:-400,yMax:2282,xMax:5290},resolution:2048,original_font_information:{license:"SIL Open Font License 1.1",copyright:"Copyright 2016 The Inter Project Authors (https://github.com/rsms/inter)",fontFamily:"Inter",fontSubfamily:"ExtraBold"}},En=Math.PI/180,ql=22,Zn=.35;let fa=null;const m0=()=>fa!=null?fa:fa=new wp().parse(p0);function Ys(s,e="#2ad38b"){var r,a;const t=new He((s==null?void 0:s.color)||e),n=(r=s==null?void 0:s.finish)!=null?r:"glossy",i={matte:{roughness:.9,metalness:0},satin:{roughness:.5,metalness:0},glossy:{roughness:.2,metalness:0,clearcoat:1,clearcoatRoughness:.08},metal:{roughness:.32,metalness:1},chrome:{roughness:.04,metalness:1}};return new tn({color:t,...(a=i[n])!=null?a:i.glossy})}async function g0(s){const e=s.trim();if(e.startsWith("<"))return e;if(e.startsWith("data:")){const n=e.indexOf(","),i=e.slice(0,n),r=e.slice(n+1);return i.includes(";base64")?atob(r):decodeURIComponent(r)}const t=await fetch(e);if(!t.ok)throw new Error(`Could not load the SVG (${t.status}).`);return t.text()}async function _0(s){var h,u,f,d,g,v,m,p,b,A;const e=s.model,t=(h=e.depth)!=null?h:.3,n=(u=e.bevel)!=null?u:.4;let i;if(e.kind==="text"){const _=new sa(e.text||" ",{font:m0(),size:1,depth:t,curveSegments:10,bevelEnabled:n>0,bevelThickness:t*n*.4,bevelSize:.012+n*.035,bevelSegments:5});_.computeVertexNormals(),i=new xt(_,Ys(s.material))}else if(e.kind==="shape"){const _={box:()=>new ra(1,1,1,6,.1),sphere:()=>new Gr(.6,96,48),torus:()=>new zr(.5,.2,64,160),knot:()=>new kr(.45,.15,300,40),cylinder:()=>new Cr(.5,.5,1,96),crystal:()=>new Br(.6,0)},T=Ys(s.material);e.shape==="crystal"&&(T.flatShading=!0),i=new xt(((d=_[(f=e.shape)!=null?f:"box"])!=null?d:_.box)(),T)}else if(e.kind==="svg"){const _=new aa().parse(await g0((g=e.src)!=null?g:"")),T=new kt,E=new Kr;_.paths.forEach(x=>x.toShapes().forEach(w=>w.getPoints().forEach(I=>E.expandByPoint(I))));const C=Math.max(1e-6,E.max.y-E.min.y);for(const x of _.paths){const w=(m=(v=x.userData)==null?void 0:v.style)==null?void 0:m.fill;if(w==="none")continue;const I=Ys((p=s.material)!=null&&p.color?s.material:{...s.material,color:w&&w!=="currentColor"?w:void 0});for(const z of x.toShapes()){const G=new Is(z,{depth:t*C,curveSegments:12,bevelEnabled:n>0,bevelThickness:t*C*n*.3,bevelSize:C*(.004+n*.012),bevelSegments:4});T.add(new xt(G,I))}}T.scale.y=-1,i=T}else if(i=(await new Ip().loadAsync((b=e.src)!=null?b:"")).scene,((A=s.material)==null?void 0:A.original)===!1){const T=Ys(s.material);i.traverse(E=>{E.isMesh&&(E.material=T)})}const r=new kt;r.add(i);const a=new Qt().setFromObject(r),o=a.getSize(new F),l=a.getCenter(new F);i.position.sub(l);const c=1/Math.max(o.x,o.y,o.z,1e-6);return r.scale.setScalar(c),r}function x0(s,e){var C,x,w,I,z,G;const t=new Ap({alpha:!0,antialias:!0,powerPreference:"high-performance"});t.setPixelRatio(Math.min(2,window.devicePixelRatio||1)),t.outputColorSpace=Et,t.toneMapping=7;const n=t.domElement;Object.assign(n.style,{position:"absolute",left:`${-Zn*100}%`,top:`${-Zn*100}%`,width:`${(1+2*Zn)*100}%`,height:`${(1+2*Zn)*100}%`,display:"block",pointerEvents:"none"}),n.setAttribute("aria-hidden","true"),s.appendChild(n);const i=new Oa,r=new jr(t),a=r.fromScene(new d0,.04).texture;i.environment=a;const o=(C=e.light)!=null?C:1;i.environmentIntensity=o;const l=new Bo(16777215,1.6*o);l.position.set(2,3,4),i.add(l,new Wh(16777215,2241348,.35*o));const c=new Dt(ql,1,.01,100),h=new kt,u=new kt;h.add(u),i.add(h);const f=(x=e.pose)!=null?x:{};u.rotation.set(((w=f.rx)!=null?w:0)*En,((I=f.ry)!=null?I:0)*En,((z=f.rz)!=null?z:0)*En,"YXZ"),u.scale.setScalar((G=f.scale)!=null?G:1);let d=null,g=!1,v=0,m=0,p=new F(.5,.5,.5);function b(Y){const O=ql/2*En,J=Math.atan(Math.tan(O)*Y),ie=1+2*Zn;return Math.max(p.y*ie/Math.tan(O),p.x*ie/Math.tan(J))*1.25+p.z}function A(){const Y=Math.round(s.clientWidth*(1+2*Zn)),O=Math.round(s.clientHeight*(1+2*Zn));!Y||!O||Y===v&&O===m||(v=Y,m=O,t.setSize(v,m,!1),c.aspect=v/m,c.updateProjectionMatrix())}function _(Y){if(g||(A(),!v||!m))return;h.rotation.set(Y.rx*En,Y.ry*En,Y.rz*En,"YXZ"),h.scale.setScalar(Math.max(1e-4,Y.s)),h.position.set(Y.px,Y.py,0);const O=b(c.aspect)*Math.max(.05,Y.dolly),J=Y.orbit*En,ie=Y.tilt*En;c.position.set(Math.sin(J)*Math.cos(ie)*O,Math.sin(ie)*O,Math.cos(J)*Math.cos(ie)*O),c.lookAt(0,0,0),t.render(i,c)}const T=new ResizeObserver(()=>{d&&_(d)});return T.observe(s),{ready:_0(e).then(Y=>{if(g)return;const O=new kt;O.rotation.copy(u.rotation),O.scale.copy(u.scale),O.add(Y),O.updateMatrixWorld(!0),new Qt().setFromObject(O).getSize(p).multiplyScalar(.5),u.add(Y),d&&_(d)}).catch(Y=>{console.warn('[Unyson+ scene] 3D layer "'+e.id+'" could not be built:',Y)}),render(Y){d={...Y},_(d)},dispose(){g=!0,T.disconnect(),i.traverse(Y=>{const O=Y;O.isMesh&&(O.geometry.dispose(),(Array.isArray(O.material)?O.material:[O.material]).forEach(ie=>ie.dispose()))}),a.dispose(),r.dispose(),t.dispose(),n.remove()}}}const v0={create:x0};window.UnysonPlusScene3D=v0})();
