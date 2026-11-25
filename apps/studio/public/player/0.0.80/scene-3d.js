/*! Unyson+ scene player 0.0.80, 3D runtime | three.js (MIT, \u00a9 three.js authors) | 3D text font: Inter (SIL OFL 1.1, \u00a9 The Inter Project Authors) */
(function(){"use strict";/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const nr="186",wa="attached",$l="detached",wn="",St="srgb",Bt="srgb-linear",ls="linear",ht="srgb",Ra="300 es";function Ql(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function jl(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function Pi(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function ec(){const s=Pi("canvas");return s.style.display="block",s}const Ca={};function cs(...s){const e="THREE."+s.shift();console.log(e,...s)}function qa(s){const e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=s[1];t&&t.isStackTrace?s[0]+=" "+t.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Be(...s){s=qa(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...s)}}function Ke(...s){s=qa(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...s)}}function Qn(...s){const e=s.join(" ");e in Ca||(Ca[e]=!0,Be(...s))}function tc(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const nc={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3};class Rn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}}const Pt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Pa=1234567;const Ii=Math.PI/180,jn=180/Math.PI;function zt(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Pt[s&255]+Pt[s>>8&255]+Pt[s>>16&255]+Pt[s>>24&255]+"-"+Pt[e&255]+Pt[e>>8&255]+"-"+Pt[e>>16&15|64]+Pt[e>>24&255]+"-"+Pt[t&63|128]+Pt[t>>8&255]+"-"+Pt[t>>16&255]+Pt[t>>24&255]+Pt[n&255]+Pt[n>>8&255]+Pt[n>>16&255]+Pt[n>>24&255]).toLowerCase()}function et(s,e,t){return Math.max(e,Math.min(t,s))}function ir(s,e){return(s%e+e)%e}function ic(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function sc(s,e,t){return s!==e?(t-s)/(e-s):0}function Li(s,e,t){return(1-t)*s+t*e}function rc(s,e,t,n){return Li(s,e,1-Math.exp(-t*n))}function ac(s,e=1){return e-Math.abs(ir(s,e*2)-e)}function oc(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function lc(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function cc(s,e){return s+Math.floor(Math.random()*(e-s+1))}function hc(s,e){return s+Math.random()*(e-s)}function uc(s){return s*(.5-Math.random())}function dc(s){s!==void 0&&(Pa=s);let e=Pa+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function fc(s){return s*Ii}function pc(s){return s*jn}function mc(s){return s>0&&Number.isInteger(s)&&2**Math.round(Math.log2(s))===s}function gc(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function _c(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function xc(s,e,t,n,i){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),h=a((e+n)/2),u=r((e-n)/2),d=a((e-n)/2),f=r((n-e)/2),g=a((n-e)/2);switch(i){case"XYX":s.set(o*h,l*u,l*d,o*c);break;case"YZY":s.set(l*d,o*h,l*u,o*c);break;case"ZXZ":s.set(l*u,l*d,o*h,o*c);break;case"XZX":s.set(o*h,l*g,l*f,o*c);break;case"YXY":s.set(l*f,o*h,l*g,o*c);break;case"ZYZ":s.set(l*g,l*f,o*h,o*c);break;default:Be("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function $t(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:case Uint8ClampedArray:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function ut(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const vc={DEG2RAD:Ii,RAD2DEG:jn,generateUUID:zt,clamp:et,euclideanModulo:ir,mapLinear:ic,inverseLerp:sc,lerp:Li,damp:rc,pingpong:ac,smoothstep:oc,smootherstep:lc,randInt:cc,randFloat:hc,randFloatSpread:uc,seededRandom:dc,degToRad:fc,radToDeg:pc,isPowerOfTwo:mc,ceilPowerOfTwo:gc,floorPowerOfTwo:_c,setQuaternionFromProperEuler:xc,normalize:ut,denormalize:$t},ya=class ya{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(et(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};ya.prototype.isVector2=!0;let fe=ya;class Vt{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],d=r[a+0],f=r[a+1],g=r[a+2],v=r[a+3];if(u!==v||l!==d||c!==f||h!==g){let m=l*d+c*f+h*g+u*v;m<0&&(d=-d,f=-f,g=-g,v=-v,m=-m);let p=1-o;if(m<.9995){const M=Math.acos(m),A=Math.sin(M);p=Math.sin(p*M)/A,o=Math.sin(o*M)/A,l=l*p+d*o,c=c*p+f*o,h=h*p+g*o,u=u*p+v*o}else{l=l*p+d*o,c=c*p+f*o,h=h*p+g*o,u=u*p+v*o;const M=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=M,c*=M,h*=M,u*=M}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,a){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[a],d=r[a+1],f=r[a+2],g=r[a+3];return e[t]=o*g+h*u+l*f-c*d,e[t+1]=l*g+h*d+c*u-o*f,e[t+2]=c*g+h*f+o*d-l*u,e[t+3]=h*g-o*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),u=o(r/2),d=l(n/2),f=l(i/2),g=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:Be("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-i)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(r+c)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(r-c)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(et(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+i*c-r*l,this._y=i*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,i=-i,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Sa=class Sa{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ia.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ia.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),h=2*(o*t-r*i),u=2*(r*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=i+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this.z=et(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this.z=et(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return sr.copy(this).projectOnVector(e),this.sub(sr)}reflect(e){return this.sub(sr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(et(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Sa.prototype.isVector3=!0;let U=Sa;const sr=new U,Ia=new Vt,Ma=class Ma{constructor(e,t,n,i,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c)}set(e,t,n,i,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],v=i[0],m=i[3],p=i[6],M=i[1],A=i[4],_=i[7],b=i[2],T=i[5],R=i[8];return r[0]=a*v+o*M+l*b,r[3]=a*m+o*A+l*T,r[6]=a*p+o*_+l*R,r[1]=c*v+h*M+u*b,r[4]=c*m+h*A+u*T,r[7]=c*p+h*_+u*R,r[2]=d*v+f*M+g*b,r[5]=d*m+f*A+g*T,r[8]=d*p+f*_+g*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+i*r*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*r,f=c*r-a*l,g=t*u+n*d+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=u*v,e[1]=(i*c-h*n)*v,e[2]=(o*n-i*a)*v,e[3]=d*v,e[4]=(h*t-i*l)*v,e[5]=(i*r-o*t)*v,e[6]=f*v,e[7]=(n*l-c*t)*v,e[8]=(a*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Qn("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(rr.makeScale(e,t)),this}rotate(e){return Qn("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(rr.makeRotation(-e)),this}translate(e,t){return Qn("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(rr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Ma.prototype.isMatrix3=!0;let Ve=Ma;const rr=new Ve,La=new Ve().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Na=new Ve().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function yc(){const s={enabled:!0,workingColorSpace:Bt,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ht&&(i.r=xn(i.r),i.g=xn(i.g),i.b=xn(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ht&&(i.r=ei(i.r),i.g=ei(i.g),i.b=ei(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===wn?ls:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return Qn("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return Qn("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[Bt]:{primaries:e,whitePoint:n,transfer:ls,toXYZ:La,fromXYZ:Na,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:St},outputColorSpaceConfig:{drawingBufferColorSpace:St}},[St]:{primaries:e,whitePoint:n,transfer:ht,toXYZ:La,fromXYZ:Na,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:St}}}),s}const it=yc();function xn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function ei(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let ti;class Sc{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement=="undefined")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ti===void 0&&(ti=Pi("canvas")),ti.width=e.width,ti.height=e.height;const i=ti.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=ti}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap){const t=Pi("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=xn(r[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(xn(t[n]/255)*255):t[n]=xn(t[n]);return{data:t,width:e.width,height:e.height}}else return Be("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Mc=0;class ar{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Mc++}),this.uuid=zt(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement!="undefined"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame!="undefined"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(or(i[a].image)):r.push(or(i[a]))}else r=or(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function or(s){return typeof HTMLImageElement!="undefined"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&s instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&s instanceof ImageBitmap?Sc.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Be("Texture: Unable to serialize Texture."),{})}let bc=0;const lr=new U;class Tt extends Rn{constructor(e=Tt.DEFAULT_IMAGE,t=Tt.DEFAULT_MAPPING,n=1001,i=1001,r=1006,a=1008,o=1023,l=1009,c=Tt.DEFAULT_ANISOTROPY,h=wn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:bc++}),this.uuid=zt(),this.name="",this.source=new ar(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new fe(0,0),this.repeat=new fe(1,1),this.center=new fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ve,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(lr).x}get height(){return this.source.getSize(lr).y}get depth(){return this.source.getSize(lr).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Be(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Be(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case 1e3:e.x=e.x-Math.floor(e.x);break;case 1001:e.x=e.x<0?0:1;break;case 1002:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case 1e3:e.y=e.y-Math.floor(e.y);break;case 1001:e.y=e.y<0?0:1;break;case 1002:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Tt.DEFAULT_IMAGE=null,Tt.DEFAULT_MAPPING=300,Tt.DEFAULT_ANISOTROPY=1;const ba=class ba{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],v=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const A=(c+1)/2,_=(f+1)/2,b=(p+1)/2,T=(h+d)/4,R=(u+v)/4,x=(g+m)/4;return A>_&&A>b?A<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(A),i=T/n,r=R/n):_>b?_<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(_),n=T/i,r=x/i):b<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(b),n=R/r,i=x/r),this.set(n,i,r,t),this}let M=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(u-v)/M,this.z=(d-h)/M,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this.z=et(this.z,e.z,t.z),this.w=et(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this.z=et(this.z,e,t),this.w=et(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};ba.prototype.isVector4=!0;let dt=ba;class Tc extends Rn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:1006,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new dt(0,0,e,t),this.scissorTest=!1,this.viewport=new dt(0,0,e,t),this.textures=[];const i={width:e,height:t,depth:n.depth},r=new Tt(i),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:1006,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new ar(i)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Qt extends Tc{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Da extends Tt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Ec extends Tt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const js=class js{constructor(e,t,n,i,r,a,o,l,c,h,u,d,f,g,v,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c,h,u,d,f,g,v,m)}set(e,t,n,i,r,a,o,l,c,h,u,d,f,g,v,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new js().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,i=1/ni.setFromMatrixColumn(e,0).length(),r=1/ni.setFromMatrixColumn(e,1).length(),a=1/ni.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=a*h,f=a*u,g=o*h,v=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+g*c,t[5]=d-v*c,t[9]=-o*l,t[2]=v-d*c,t[6]=g+f*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*h,f=l*u,g=c*h,v=c*u;t[0]=d+v*o,t[4]=g*o-f,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-g,t[6]=v+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*h,f=l*u,g=c*h,v=c*u;t[0]=d-v*o,t[4]=-a*u,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*h,t[9]=v-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*h,f=a*u,g=o*h,v=o*u;t[0]=l*h,t[4]=g*c-f,t[8]=d*c+v,t[1]=l*u,t[5]=v*c+d,t[9]=f*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,f=a*c,g=o*l,v=o*c;t[0]=l*h,t[4]=v-d*u,t[8]=g*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*u+g,t[10]=d-v*u}else if(e.order==="XZY"){const d=a*l,f=a*c,g=o*l,v=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+v,t[5]=a*h,t[9]=f*u-g,t[2]=g*u-f,t[6]=o*h,t[10]=v*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ac,e,wc)}lookAt(e,t,n){const i=this.elements;return kt.subVectors(e,t),kt.lengthSq()===0&&(kt.z=1),kt.normalize(),Cn.crossVectors(n,kt),Cn.lengthSq()===0&&(Math.abs(n.z)===1?kt.x+=1e-4:kt.z+=1e-4,kt.normalize(),Cn.crossVectors(n,kt)),Cn.normalize(),hs.crossVectors(kt,Cn),i[0]=Cn.x,i[4]=hs.x,i[8]=kt.x,i[1]=Cn.y,i[5]=hs.y,i[9]=kt.y,i[2]=Cn.z,i[6]=hs.z,i[10]=kt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],v=n[6],m=n[10],p=n[14],M=n[3],A=n[7],_=n[11],b=n[15],T=i[0],R=i[4],x=i[8],w=i[12],I=i[1],O=i[5],B=i[9],J=i[13],G=i[2],Z=i[6],re=i[10],$=i[14],z=i[3],Q=i[7],ie=i[11],oe=i[15];return r[0]=a*T+o*I+l*G+c*z,r[4]=a*R+o*O+l*Z+c*Q,r[8]=a*x+o*B+l*re+c*ie,r[12]=a*w+o*J+l*$+c*oe,r[1]=h*T+u*I+d*G+f*z,r[5]=h*R+u*O+d*Z+f*Q,r[9]=h*x+u*B+d*re+f*ie,r[13]=h*w+u*J+d*$+f*oe,r[2]=g*T+v*I+m*G+p*z,r[6]=g*R+v*O+m*Z+p*Q,r[10]=g*x+v*B+m*re+p*ie,r[14]=g*w+v*J+m*$+p*oe,r[3]=M*T+A*I+_*G+b*z,r[7]=M*R+A*O+_*Z+b*Q,r[11]=M*x+A*B+_*re+b*ie,r[15]=M*w+A*J+_*$+b*oe,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],g=e[3],v=e[7],m=e[11],p=e[15],M=l*f-c*d,A=o*f-c*u,_=o*d-l*u,b=a*f-c*h,T=a*d-l*h,R=a*u-o*h;return t*(v*M-m*A+p*_)-n*(g*M-m*b+p*T)+i*(g*A-v*b+p*R)-r*(g*_-v*T+m*R)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(r*h-o*l)+i*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],g=e[12],v=e[13],m=e[14],p=e[15],M=t*o-n*a,A=t*l-i*a,_=t*c-r*a,b=n*l-i*o,T=n*c-r*o,R=i*c-r*l,x=h*v-u*g,w=h*m-d*g,I=h*p-f*g,O=u*m-d*v,B=u*p-f*v,J=d*p-f*m,G=M*J-A*B+_*O+b*I-T*w+R*x;if(G===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const Z=1/G;return e[0]=(o*J-l*B+c*O)*Z,e[1]=(i*B-n*J-r*O)*Z,e[2]=(v*R-m*T+p*b)*Z,e[3]=(d*T-u*R-f*b)*Z,e[4]=(l*I-a*J-c*w)*Z,e[5]=(t*J-i*I+r*w)*Z,e[6]=(m*_-g*R-p*A)*Z,e[7]=(h*R-d*_+f*A)*Z,e[8]=(a*B-o*I+c*x)*Z,e[9]=(n*I-t*B-r*x)*Z,e[10]=(g*T-v*_+p*M)*Z,e[11]=(u*_-h*T-f*M)*Z,e[12]=(o*w-a*O-l*x)*Z,e[13]=(t*O-n*w+i*x)*Z,e[14]=(v*A-g*b-m*M)*Z,e[15]=(h*b-u*A+d*M)*Z,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,d=r*c,f=r*h,g=r*u,v=a*h,m=a*u,p=o*u,M=l*c,A=l*h,_=l*u,b=n.x,T=n.y,R=n.z;return i[0]=(1-(v+p))*b,i[1]=(f+_)*b,i[2]=(g-A)*b,i[3]=0,i[4]=(f-_)*T,i[5]=(1-(d+p))*T,i[6]=(m+M)*T,i[7]=0,i[8]=(g+A)*R,i[9]=(m-M)*R,i[10]=(1-(d+v))*R,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=ni.set(i[0],i[1],i[2]).length();const o=ni.set(i[4],i[5],i[6]).length(),l=ni.set(i[8],i[9],i[10]).length();r<0&&(a=-a),jt.copy(this);const c=1/a,h=1/o,u=1/l;return jt.elements[0]*=c,jt.elements[1]*=c,jt.elements[2]*=c,jt.elements[4]*=h,jt.elements[5]*=h,jt.elements[6]*=h,jt.elements[8]*=u,jt.elements[9]*=u,jt.elements[10]*=u,t.setFromRotationMatrix(jt),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,i,r,a,o=2e3,l=!1){const c=this.elements,h=2*r/(t-e),u=2*r/(n-i),d=(t+e)/(t-e),f=(n+i)/(n-i);let g,v;if(l)g=r/(a-r),v=a*r/(a-r);else if(o===2e3)g=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===2001)g=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,r,a,o=2e3,l=!1){const c=this.elements,h=2/(t-e),u=2/(n-i),d=-(t+e)/(t-e),f=-(n+i)/(n-i);let g,v;if(l)g=1/(a-r),v=a/(a-r);else if(o===2e3)g=-2/(a-r),v=-(a+r)/(a-r);else if(o===2001)g=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};js.prototype.isMatrix4=!0;let $e=js;const ni=new U,jt=new $e,Ac=new U(0,0,0),wc=new U(1,1,1),Cn=new U,hs=new U,kt=new U,Fa=new $e,Ua=new Vt;class vn{constructor(e=0,t=0,n=0,i=vn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(et(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-et(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(et(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-et(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(et(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-et(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Be("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Fa.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Fa,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ua.setFromEuler(this),this.setFromQuaternion(Ua,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}vn.DEFAULT_ORDER="XYZ";class Oa{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Rc=0;const Ba=new U,ii=new Vt,yn=new $e,us=new U,Ni=new U,Cc=new U,qc=new Vt,ka=new U(1,0,0),Ga=new U(0,1,0),za=new U(0,0,1),Va={type:"added"},Pc={type:"removed"},si={type:"childadded",child:null},cr={type:"childremoved",child:null};class _t extends Rn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Rc++}),this.uuid=zt(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=_t.DEFAULT_UP.clone();const e=new U,t=new vn,n=new Vt,i=new U(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new $e},normalMatrix:{value:new Ve}}),this.matrix=new $e,this.matrixWorld=new $e,this.matrixAutoUpdate=_t.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Oa,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ii.setFromAxisAngle(e,t),this.quaternion.multiply(ii),this}rotateOnWorldAxis(e,t){return ii.setFromAxisAngle(e,t),this.quaternion.premultiply(ii),this}rotateX(e){return this.rotateOnAxis(ka,e)}rotateY(e){return this.rotateOnAxis(Ga,e)}rotateZ(e){return this.rotateOnAxis(za,e)}translateOnAxis(e,t){return Ba.copy(e).applyQuaternion(this.quaternion),this.position.add(Ba.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ka,e)}translateY(e){return this.translateOnAxis(Ga,e)}translateZ(e){return this.translateOnAxis(za,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(yn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?us.copy(e):us.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Ni.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?yn.lookAt(Ni,us,this.up):yn.lookAt(us,Ni,this.up),this.quaternion.setFromRotationMatrix(yn),i&&(yn.extractRotation(i.matrixWorld),ii.setFromRotationMatrix(yn),this.quaternion.premultiply(ii.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ke("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Va),si.child=e,this.dispatchEvent(si),si.child=null):Ke("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Pc),cr.child=e,this.dispatchEvent(cr),cr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),yn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),yn.multiply(e.parent.matrixWorld)),e.applyMatrix4(yn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Va),si.child=e,this.dispatchEvent(si),si.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ni,e,Cc),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ni,qc,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,i=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*i,r[13]+=n-r[1]*t-r[5]*n-r[9]*i,r[14]+=i-r[2]*t-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}_t.DEFAULT_UP=new U(0,1,0),_t.DEFAULT_MATRIX_AUTO_UPDATE=!0,_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class qt extends _t{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Ic={type:"move"};class hr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new qt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new qt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new qt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,n),p=this._getHandJoint(c,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Ic)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new qt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Ha={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},qn={h:0,s:0,l:0},ds={h:0,s:0,l:0};function ur(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class We{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=St){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,it.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=it.workingColorSpace){return this.r=e,this.g=t,this.b=n,it.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=it.workingColorSpace){if(e=ir(e,1),t=et(t,0,1),n=et(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=ur(a,r,e+1/3),this.g=ur(a,r,e),this.b=ur(a,r,e-1/3)}return it.colorSpaceToWorking(this,i),this}setStyle(e,t=St){function n(r){r!==void 0&&parseFloat(r)<1&&Be("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Be("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Be("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=St){const n=Ha[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Be("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=xn(e.r),this.g=xn(e.g),this.b=xn(e.b),this}copyLinearToSRGB(e){return this.r=ei(e.r),this.g=ei(e.g),this.b=ei(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=St){return it.workingToColorSpace(It.copy(this),e),Math.round(et(It.r*255,0,255))*65536+Math.round(et(It.g*255,0,255))*256+Math.round(et(It.b*255,0,255))}getHexString(e=St){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=it.workingColorSpace){it.workingToColorSpace(It.copy(this),t);const n=It.r,i=It.g,r=It.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=it.workingColorSpace){return it.workingToColorSpace(It.copy(this),t),e.r=It.r,e.g=It.g,e.b=It.b,e}getStyle(e=St){it.workingToColorSpace(It.copy(this),e);const t=It.r,n=It.g,i=It.b;return e!==St?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(qn),this.setHSL(qn.h+e,qn.s+t,qn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(qn),e.getHSL(ds);const n=Li(qn.h,ds.h,t),i=Li(qn.s,ds.s,t),r=Li(qn.l,ds.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const It=new We;We.NAMES=Ha;class Wa extends _t{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new vn,this.environmentIntensity=1,this.environmentRotation=new vn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const en=new U,Sn=new U,dr=new U,Mn=new U,ri=new U,ai=new U,Xa=new U,fr=new U,pr=new U,mr=new U,gr=new dt,_r=new dt,xr=new dt;class tn{constructor(e=new U,t=new U,n=new U){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),en.subVectors(e,t),i.cross(en);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){en.subVectors(i,t),Sn.subVectors(n,t),dr.subVectors(e,t);const a=en.dot(en),o=en.dot(Sn),l=en.dot(dr),c=Sn.dot(Sn),h=Sn.dot(dr),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(c*l-o*h)*d,g=(a*h-o*l)*d;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Mn)===null?!1:Mn.x>=0&&Mn.y>=0&&Mn.x+Mn.y<=1}static getInterpolation(e,t,n,i,r,a,o,l){return this.getBarycoord(e,t,n,i,Mn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Mn.x),l.addScaledVector(a,Mn.y),l.addScaledVector(o,Mn.z),l)}static getInterpolatedAttribute(e,t,n,i,r,a){return gr.setScalar(0),_r.setScalar(0),xr.setScalar(0),gr.fromBufferAttribute(e,t),_r.fromBufferAttribute(e,n),xr.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(gr,r.x),a.addScaledVector(_r,r.y),a.addScaledVector(xr,r.z),a}static isFrontFacing(e,t,n,i){return en.subVectors(n,t),Sn.subVectors(e,t),en.cross(Sn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return en.subVectors(this.c,this.b),Sn.subVectors(this.a,this.b),en.cross(Sn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return tn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return tn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return tn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return tn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return tn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let a,o;ri.subVectors(i,n),ai.subVectors(r,n),fr.subVectors(e,n);const l=ri.dot(fr),c=ai.dot(fr);if(l<=0&&c<=0)return t.copy(n);pr.subVectors(e,i);const h=ri.dot(pr),u=ai.dot(pr);if(h>=0&&u<=h)return t.copy(i);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(ri,a);mr.subVectors(e,r);const f=ri.dot(mr),g=ai.dot(mr);if(g>=0&&f<=g)return t.copy(r);const v=f*c-l*g;if(v<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(ai,o);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return Xa.subVectors(r,i),o=(u-h)/(u-h+(f-g)),t.copy(i).addScaledVector(Xa,o);const p=1/(m+v+d);return a=v*p,o=d*p,t.copy(n).addScaledVector(ri,a).addScaledVector(ai,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class nn{constructor(e=new U(1/0,1/0,1/0),t=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(sn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(sn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=sn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,sn):sn.fromBufferAttribute(r,a),sn.applyMatrix4(e.matrixWorld),this.expandByPoint(sn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),fs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),fs.copy(n.boundingBox)),fs.applyMatrix4(e.matrixWorld),this.union(fs)}const i=e.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,sn),sn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Di),ps.subVectors(this.max,Di),oi.subVectors(e.a,Di),li.subVectors(e.b,Di),ci.subVectors(e.c,Di),Pn.subVectors(li,oi),In.subVectors(ci,li),zn.subVectors(oi,ci);let t=[0,-Pn.z,Pn.y,0,-In.z,In.y,0,-zn.z,zn.y,Pn.z,0,-Pn.x,In.z,0,-In.x,zn.z,0,-zn.x,-Pn.y,Pn.x,0,-In.y,In.x,0,-zn.y,zn.x,0];return!vr(t,oi,li,ci,ps)||(t=[1,0,0,0,1,0,0,0,1],!vr(t,oi,li,ci,ps))?!1:(ms.crossVectors(Pn,In),t=[ms.x,ms.y,ms.z],vr(t,oi,li,ci,ps))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,sn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(sn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(bn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),bn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),bn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),bn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),bn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),bn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),bn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),bn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(bn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const bn=[new U,new U,new U,new U,new U,new U,new U,new U],sn=new U,fs=new nn,oi=new U,li=new U,ci=new U,Pn=new U,In=new U,zn=new U,Di=new U,ps=new U,ms=new U,Vn=new U;function vr(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){Vn.fromArray(s,r);const o=i.x*Math.abs(Vn.x)+i.y*Math.abs(Vn.y)+i.z*Math.abs(Vn.z),l=e.dot(Vn),c=t.dot(Vn),h=n.dot(Vn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Et=new U,gs=new fe;let Lc=0;class Ot extends Rn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Lc++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=35044,this.updateRanges=[],this.gpuType=1015,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)gs.fromBufferAttribute(this,t),gs.applyMatrix3(e),this.setXY(t,gs.x,gs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.applyMatrix3(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.applyMatrix4(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.applyNormalMatrix(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.transformDirection(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=$t(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ut(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=$t(t,this.array)),t}setX(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=$t(t,this.array)),t}setY(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=$t(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=$t(t,this.array)),t}setW(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),i=ut(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),i=ut(i,this.array),r=ut(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class Ya extends Ot{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Ka extends Ot{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class st extends Ot{constructor(e,t,n){super(new Float32Array(e),t,n)}}const Nc=new nn,Fi=new U,yr=new U;class cn{constructor(e=new U,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Nc.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Fi.subVectors(e,this.center);const t=Fi.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Fi,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(yr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Fi.copy(e.center).add(yr)),this.expandByPoint(Fi.copy(e.center).sub(yr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Dc=0;const Ht=new $e,Sr=new _t,hi=new U,Gt=new nn,Ui=new nn,Ct=new U;class yt extends Rn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Dc++}),this.uuid=zt(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ql(e)?Ka:Ya)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ve().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Ht.makeRotationFromQuaternion(e),this.applyMatrix4(Ht),this}rotateX(e){return Ht.makeRotationX(e),this.applyMatrix4(Ht),this}rotateY(e){return Ht.makeRotationY(e),this.applyMatrix4(Ht),this}rotateZ(e){return Ht.makeRotationZ(e),this.applyMatrix4(Ht),this}translate(e,t,n){return Ht.makeTranslation(e,t,n),this.applyMatrix4(Ht),this}scale(e,t,n){return Ht.makeScale(e,t,n),this.applyMatrix4(Ht),this}lookAt(e){return Sr.lookAt(e),Sr.updateMatrix(),this.applyMatrix4(Sr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(hi).negate(),this.translate(hi.x,hi.y,hi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new st(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&Be("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new nn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ke("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];Gt.setFromBufferAttribute(r),this.morphTargetsRelative?(Ct.addVectors(this.boundingBox.min,Gt.min),this.boundingBox.expandByPoint(Ct),Ct.addVectors(this.boundingBox.max,Gt.max),this.boundingBox.expandByPoint(Ct)):(this.boundingBox.expandByPoint(Gt.min),this.boundingBox.expandByPoint(Gt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ke('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new cn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ke("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(e){const n=this.boundingSphere.center;if(Gt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Ui.setFromBufferAttribute(o),this.morphTargetsRelative?(Ct.addVectors(Gt.min,Ui.min),Gt.expandByPoint(Ct),Ct.addVectors(Gt.max,Ui.max),Gt.expandByPoint(Ct)):(Gt.expandByPoint(Ui.min),Gt.expandByPoint(Ui.max))}Gt.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)Ct.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(Ct));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ct.fromBufferAttribute(o,c),l&&(hi.fromBufferAttribute(e,c),Ct.add(hi)),i=Math.max(i,n.distanceToSquared(Ct))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Ke('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ke("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Ot(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let x=0;x<n.count;x++)o[x]=new U,l[x]=new U;const c=new U,h=new U,u=new U,d=new fe,f=new fe,g=new fe,v=new U,m=new U;function p(x,w,I){c.fromBufferAttribute(n,x),h.fromBufferAttribute(n,w),u.fromBufferAttribute(n,I),d.fromBufferAttribute(r,x),f.fromBufferAttribute(r,w),g.fromBufferAttribute(r,I),h.sub(c),u.sub(c),f.sub(d),g.sub(d);const O=1/(f.x*g.y-g.x*f.y);isFinite(O)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(O),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(O),o[x].add(v),o[w].add(v),o[I].add(v),l[x].add(m),l[w].add(m),l[I].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let x=0,w=M.length;x<w;++x){const I=M[x],O=I.start,B=I.count;for(let J=O,G=O+B;J<G;J+=3)p(e.getX(J+0),e.getX(J+1),e.getX(J+2))}const A=new U,_=new U,b=new U,T=new U;function R(x){b.fromBufferAttribute(i,x),T.copy(b);const w=o[x];A.copy(w),A.sub(b.multiplyScalar(b.dot(w))).normalize(),_.crossVectors(T,w);const O=_.dot(l[x])<0?-1:1;a.setXYZW(x,A.x,A.y,A.z,O)}for(let x=0,w=M.length;x<w;++x){const I=M[x],O=I.start,B=I.count;for(let J=O,G=O+B;J<G;J+=3)R(e.getX(J+0)),R(e.getX(J+1)),R(e.getX(J+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Ot(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new U,r=new U,a=new U,o=new U,l=new U,c=new U,h=new U,u=new U;if(e)for(let d=0,f=e.count;d<f;d+=3){const g=e.getX(d+0),v=e.getX(d+1),m=e.getX(d+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,m),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ct.fromBufferAttribute(e,t),Ct.normalize(),e.setXYZ(t,Ct.x,Ct.y,Ct.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h);let f=0,g=0;for(let v=0,m=l.length;v<m;v++){o.isInterleavedBufferAttribute?f=l[v]*o.data.stride+o.offset:f=l[v]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new Ot(d,h,u)}if(this.index===null)return Be("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new yt,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Fc{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=35044,this.updateRanges=[],this.version=0,this.uuid=zt()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=zt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=zt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));const t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}}const Nt=new U;class Mr{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.applyMatrix4(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.applyNormalMatrix(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.transformDirection(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=$t(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ut(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=$t(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=$t(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=$t(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=$t(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),i=ut(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),i=ut(i,this.array),r=ut(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){cs("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new Ot(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Mr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){cs("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const br=new U,Uc=new U,Oc=new Ve;class Ln{constructor(e=new U(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=br.subVectors(n,t).cross(Uc.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const i=e.delta(br),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Oc.getNormalMatrix(e),i=this.coplanarPoint(br).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let Bc=0;class rn extends Rn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Bc++}),this.uuid=zt(),this.name="",this.type="Material",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new We(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Be(`Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Be(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new We().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Ln().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new fe().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new fe().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Tn=new U,Tr=new U,_s=new U,xs=new U;class vs{constructor(e=new U,t=new U(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Tn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Tn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Tn.copy(this.origin).addScaledVector(this.direction,t),Tn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Tr.copy(e).add(t).multiplyScalar(.5),_s.copy(t).sub(e).normalize(),xs.copy(this.origin).sub(Tr);const r=e.distanceTo(t)*.5,a=-this.direction.dot(_s),o=xs.dot(this.direction),l=-xs.dot(_s),c=xs.lengthSq(),h=Math.abs(1-a*a);let u,d,f,g;if(h>0)if(u=a*l-o,d=a*o-l,g=r*h,u>=0)if(d>=-g)if(d<=g){const v=1/h;u*=v,d*=v,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Tr).addScaledVector(_s,d),f}intersectSphere(e,t){if(e.radius<0)return null;Tn.subVectors(e.center,this.origin);const n=Tn.dot(this.direction),i=Tn.dot(Tn)-n*n,r=e.radius*e.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Tn)!==null}intersectTriangle(e,t,n,i,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,g=t.x-a.x,v=t.y-a.y,m=t.z-a.z,p=n.x-a.x,M=n.y-a.y,A=n.z-a.z,_=Math.abs(l),b=Math.abs(c),T=Math.abs(h);let R,x,w,I,O,B,J,G,Z,re,$,z;if(_>=b&&_>=T?(w=l,B=u,Z=g,z=p,l>=0?(R=c,x=h,I=d,O=f,J=v,G=m,re=M,$=A):(R=h,x=c,I=f,O=d,J=m,G=v,re=A,$=M)):b>=T?(w=c,B=d,Z=v,z=M,c>=0?(R=h,x=l,I=f,O=u,J=m,G=g,re=A,$=p):(R=l,x=h,I=u,O=f,J=g,G=m,re=p,$=A)):(w=h,B=f,Z=m,z=A,h>=0?(R=l,x=c,I=u,O=d,J=g,G=v,re=p,$=M):(R=c,x=l,I=d,O=u,J=v,G=g,re=M,$=p)),w===0)return null;const Q=R/w,ie=x/w,oe=1/w,Se=I-Q*B,be=O-ie*B,Ye=J-Q*Z,He=G-ie*Z,Je=re-Q*z,D=$-ie*z,N=Je*He-D*Ye,L=Se*D-be*Je,P=Ye*be-He*Se;if(i){if(N<0||L<0||P<0)return null}else if((N<0||L<0||P<0)&&(N>0||L>0||P>0))return null;const k=N+L+P;if(k===0)return null;const se=oe*(N*B+L*Z+P*z);return(k>0?se<0:se>0)?null:this.at(se/k,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Wt extends rn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new We(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ja=new $e,Hn=new vs,ys=new cn,Za=new U,Ss=new U,Ms=new U,bs=new U,Er=new U,Ts=new U,$a=new U,Es=new U;class tt extends _t{constructor(e=new yt,t=new Wt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(r&&o){Ts.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(Er.fromBufferAttribute(u,e),a?Ts.addScaledVector(Er,h):Ts.addScaledVector(Er.sub(t),h))}t.add(Ts)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ys.copy(n.boundingSphere),ys.applyMatrix4(r),Hn.copy(e.ray).recast(e.near),!(ys.containsPoint(Hn.origin)===!1&&(Hn.intersectSphere(ys,Za)===null||Hn.origin.distanceToSquared(Za)>(e.far-e.near)**2))&&(Ja.copy(r).invert(),Hn.copy(e.ray).applyMatrix4(Ja),!(n.boundingBox!==null&&Hn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Hn)))}_computeIntersections(e,t,n){let i;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=a[m.materialIndex],M=Math.max(m.start,f.start),A=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let _=M,b=A;_<b;_+=3){const T=o.getX(_),R=o.getX(_+1),x=o.getX(_+2);i=As(this,p,e,n,c,h,u,T,R,x),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const M=o.getX(m),A=o.getX(m+1),_=o.getX(m+2);i=As(this,a,e,n,c,h,u,M,A,_),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=a[m.materialIndex],M=Math.max(m.start,f.start),A=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let _=M,b=A;_<b;_+=3){const T=_,R=_+1,x=_+2;i=As(this,p,e,n,c,h,u,T,R,x),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const M=m,A=m+1,_=m+2;i=As(this,a,e,n,c,h,u,M,A,_),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}}function kc(s,e,t,n,i,r,a,o){let l;if(e.side===1?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,e.side===0,o),l===null)return null;Es.copy(o),Es.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(Es);return c<t.near||c>t.far?null:{distance:c,point:Es.clone(),object:s}}function As(s,e,t,n,i,r,a,o,l,c){s.getVertexPosition(o,Ss),s.getVertexPosition(l,Ms),s.getVertexPosition(c,bs);const h=kc(s,e,t,n,Ss,Ms,bs,$a);if(h){const u=new U;tn.getBarycoord($a,Ss,Ms,bs,u),i&&(h.uv=tn.getInterpolatedAttribute(i,o,l,c,u,new fe)),r&&(h.uv1=tn.getInterpolatedAttribute(r,o,l,c,u,new fe)),a&&(h.normal=tn.getInterpolatedAttribute(a,o,l,c,u,new U),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new U,materialIndex:0};tn.getNormal(Ss,Ms,bs,d.normal),h.face=d,h.barycoord=u}return h}const Oi=new dt,Qa=new dt,ja=new dt,Gc=new dt,eo=new $e,ws=new U,Ar=new cn,to=new $e,wr=new vs;class zc extends tt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=wa,this.bindMatrix=new $e,this.bindMatrixInverse=new $e,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new nn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ws),this.boundingBox.expandByPoint(ws)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new cn),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ws),this.boundingSphere.expandByPoint(ws)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ar.copy(this.boundingSphere),Ar.applyMatrix4(i),e.ray.intersectsSphere(Ar)!==!1&&(to.copy(i).invert(),wr.copy(e.ray).applyMatrix4(to),!(this.boundingBox!==null&&wr.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,wr)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new dt,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===wa?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===$l?this.bindMatrixInverse.copy(this.bindMatrix).invert():Be("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;Qa.fromBufferAttribute(i.attributes.skinIndex,e),ja.fromBufferAttribute(i.attributes.skinWeight,e),t.isVector4?(Oi.copy(t),t.set(0,0,0,0)):(Oi.set(...t,1),t.set(0,0,0)),Oi.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){const a=ja.getComponent(r);if(a!==0){const o=Qa.getComponent(r);eo.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(Gc.copy(Oi).applyMatrix4(eo),a)}}return t.isVector4&&(t.w=Oi.w),t.applyMatrix4(this.bindMatrixInverse)}}class no extends _t{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Rr extends Tt{constructor(e=null,t=1,n=1,i,r,a,o,l,c=1003,h=1003,u,d){super(null,a,o,l,c,h,i,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const io=new $e,Vc=new $e;class Cr{constructor(e=[],t=[]){this.uuid=zt(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Be("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new $e)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new $e;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:Vc;io.multiplyMatrices(o,t[r]),io.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new Cr(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Rr(t,e,e,1023,1015);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const r=e.bones[n];let a=t[r];a===void 0&&(Be("Skeleton: No bone found with UUID:",r),a=new no),this.bones.push(a),this.boneInverses.push(new $e().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){const a=t[i];e.bones.push(a.uuid);const o=n[i];e.boneInverses.push(o.toArray())}return e}}class Rs extends Ot{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const ui=new $e,so=new $e,Cs=[],ro=new nn,Hc=new $e,Bi=new tt,ki=new cn;class ao extends tt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Rs(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Hc)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new nn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ui),ro.copy(e.boundingBox).applyMatrix4(ui),this.boundingBox.union(ro)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new cn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ui),ki.copy(e.boundingSphere).applyMatrix4(ui),this.boundingSphere.union(ki)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(Bi.geometry=this.geometry,Bi.material=this.material,Bi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ki.copy(this.boundingSphere),ki.applyMatrix4(n),e.ray.intersectsSphere(ki)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,ui),so.multiplyMatrices(n,ui),Bi.matrixWorld=so,Bi.raycast(e,Cs);for(let a=0,o=Cs.length;a<o;a++){const l=Cs[a];l.instanceId=r,l.object=this,t.push(l)}Cs.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Rs(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Rr(new Float32Array(i*this.count),i,this.count,1028,1015));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Wn=new cn,Wc=new fe(.5,.5),qs=new U;class qr{constructor(e=new Ln,t=new Ln,n=new Ln,i=new Ln,r=new Ln,a=new Ln){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=2e3,n=!1){const i=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],g=r[8],v=r[9],m=r[10],p=r[11],M=r[12],A=r[13],_=r[14],b=r[15];if(i[0].setComponents(c-a,f-h,p-g,b-M).normalize(),i[1].setComponents(c+a,f+h,p+g,b+M).normalize(),i[2].setComponents(c+o,f+u,p+v,b+A).normalize(),i[3].setComponents(c-o,f-u,p-v,b-A).normalize(),n)i[4].setComponents(l,d,m,_).normalize(),i[5].setComponents(c-l,f-d,p-m,b-_).normalize();else if(i[4].setComponents(c-l,f-d,p-m,b-_).normalize(),t===2e3)i[5].setComponents(c+l,f+d,p+m,b+_).normalize();else if(t===2001)i[5].setComponents(l,d,m,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Wn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Wn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Wn)}intersectsSprite(e){Wn.center.set(0,0,0);const t=Wc.distanceTo(e.center);return Wn.radius=.7071067811865476+t,Wn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Wn)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(qs.x=i.normal.x>0?e.max.x:e.min.x,qs.y=i.normal.y>0?e.max.y:e.min.y,qs.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(qs)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class oo extends rn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new We(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ps=new U,Is=new U,lo=new $e,Gi=new vs,Ls=new cn,Pr=new U,co=new U;class Ir extends _t{constructor(e=new yt,t=new oo){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)Ps.fromBufferAttribute(t,i-1),Is.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Ps.distanceTo(Is);e.setAttribute("lineDistance",new st(n,1))}else Be("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ls.copy(n.boundingSphere),Ls.applyMatrix4(i),Ls.radius+=r,e.ray.intersectsSphere(Ls)===!1)return;lo.copy(i).invert(),Gi.copy(e.ray).applyMatrix4(lo);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let v=f,m=g-1;v<m;v+=c){const p=h.getX(v),M=h.getX(v+1),A=Ns(this,e,Gi,l,p,M,v);A&&t.push(A)}if(this.isLineLoop){const v=h.getX(g-1),m=h.getX(f),p=Ns(this,e,Gi,l,v,m,g-1);p&&t.push(p)}}else{const f=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let v=f,m=g-1;v<m;v+=c){const p=Ns(this,e,Gi,l,v,v+1,v);p&&t.push(p)}if(this.isLineLoop){const v=Ns(this,e,Gi,l,g-1,f,g-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Ns(s,e,t,n,i,r,a){const o=s.geometry.attributes.position;if(Ps.fromBufferAttribute(o,i),Is.fromBufferAttribute(o,r),t.distanceSqToSegment(Ps,Is,Pr,co)>n)return;Pr.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(Pr);if(!(c<e.near||c>e.far))return{distance:c,point:co.clone().applyMatrix4(s.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:s}}const ho=new U,uo=new U;class Xc extends Ir{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)ho.fromBufferAttribute(t,i),uo.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+ho.distanceTo(uo);e.setAttribute("lineDistance",new st(n,1))}else Be("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Yc extends Ir{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class fo extends rn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new We(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const po=new $e,Lr=new vs,Ds=new cn,Fs=new U;class Kc extends _t{constructor(e=new yt,t=new fo){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ds.copy(n.boundingSphere),Ds.applyMatrix4(i),Ds.radius+=r,e.ray.intersectsSphere(Ds)===!1)return;po.copy(i).invert(),Lr.copy(e.ray).applyMatrix4(po);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){const d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let g=d,v=f;g<v;g++){const m=c.getX(g);Fs.fromBufferAttribute(u,m),mo(Fs,m,l,i,e,t,this)}}else{const d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let g=d,v=f;g<v;g++)Fs.fromBufferAttribute(u,g),mo(Fs,g,l,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function mo(s,e,t,n,i,r,a){const o=Lr.distanceSqToPoint(s);if(o<t){const l=new U;Lr.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Jc extends Tt{constructor(e,t,n,i,r=1006,a=1006,o,l,c){super(e,t,n,i,r,a,o,l,c),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;const h=this;function u(){h.needsUpdate=!0,h._requestVideoFrameCallbackId=e.requestVideoFrameCallback(u)}"requestVideoFrameCallback"in e&&(this._requestVideoFrameCallbackId=e.requestVideoFrameCallback(u))}clone(){return new this.constructor(this.image).copy(this)}update(){const e=this.image;"requestVideoFrameCallback"in e===!1&&e.readyState>=e.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&(this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),this._requestVideoFrameCallbackId=0),super.dispose()}}class go extends Tt{constructor(e=[],t=301,n,i,r,a,o,l,c,h){super(e,t,n,i,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class _o extends Tt{constructor(e,t,n,i,r,a,o,l,c){super(e,t,n,i,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class zi extends Tt{constructor(e,t,n=1014,i,r,a,o=1003,l=1003,c,h=1026,u=1){if(h!==1026&&h!==1027)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:u};super(d,i,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ar(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class Zc extends zi{constructor(e,t=1014,n=301,i,r,a=1003,o=1003,l,c=1026){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,i,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class xo extends Tt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Xn extends yt{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,i,a,2),g("x","z","y",1,-1,e,n,-t,i,a,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new st(c,3)),this.setAttribute("normal",new st(h,3)),this.setAttribute("uv",new st(u,2));function g(v,m,p,M,A,_,b,T,R,x,w){const I=_/R,O=b/x,B=_/2,J=b/2,G=T/2,Z=R+1,re=x+1;let $=0,z=0;const Q=new U;for(let ie=0;ie<re;ie++){const oe=ie*O-J;for(let Se=0;Se<Z;Se++){const be=Se*I-B;Q[v]=be*M,Q[m]=oe*A,Q[p]=G,c.push(Q.x,Q.y,Q.z),Q[v]=0,Q[m]=0,Q[p]=T>0?1:-1,h.push(Q.x,Q.y,Q.z),u.push(Se/R),u.push(1-ie/x),$+=1}}for(let ie=0;ie<x;ie++)for(let oe=0;oe<R;oe++){const Se=d+oe+Z*ie,be=d+oe+Z*(ie+1),Ye=d+(oe+1)+Z*(ie+1),He=d+(oe+1)+Z*ie;l.push(Se,be,He),l.push(be,Ye,He),z+=6}o.addGroup(f,z,w),f+=z,d+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Nr extends yt{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);const r=[],a=[],o=[],l=[],c=new U,h=new fe;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){const f=n+u/t*i;c.x=e*Math.cos(f),c.y=e*Math.sin(f),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[d]/e+1)/2,h.y=(a[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new st(a,3)),this.setAttribute("normal",new st(o,3)),this.setAttribute("uv",new st(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Nr(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Us extends yt{constructor(e=1,t=1,n=1,i=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const h=[],u=[],d=[],f=[];let g=0;const v=[],m=n/2;let p=0;M(),a===!1&&(e>0&&A(!0),t>0&&A(!1)),this.setIndex(h),this.setAttribute("position",new st(u,3)),this.setAttribute("normal",new st(d,3)),this.setAttribute("uv",new st(f,2));function M(){const _=new U,b=new U;let T=0;const R=(t-e)/n;for(let x=0;x<=r;x++){const w=[],I=x/r,O=I*(t-e)+e;for(let B=0;B<=i;B++){const J=B/i,G=J*l+o,Z=Math.sin(G),re=Math.cos(G);b.x=O*Z,b.y=-I*n+m,b.z=O*re,u.push(b.x,b.y,b.z),_.set(Z,R,re).normalize(),d.push(_.x,_.y,_.z),f.push(J,1-I),w.push(g++)}v.push(w)}for(let x=0;x<i;x++)for(let w=0;w<r;w++){const I=v[w][x],O=v[w+1][x],B=v[w+1][x+1],J=v[w][x+1];(e>0||w!==0)&&(h.push(I,O,J),T+=3),(t>0||w!==r-1)&&(h.push(O,B,J),T+=3)}c.addGroup(p,T,0),p+=T}function A(_){const b=g,T=new fe,R=new U;let x=0;const w=_===!0?e:t,I=_===!0?1:-1;for(let B=1;B<=i;B++)u.push(0,m*I,0),d.push(0,I,0),f.push(.5,.5),g++;const O=g;for(let B=0;B<=i;B++){const G=B/i*l+o,Z=Math.cos(G),re=Math.sin(G);R.x=w*re,R.y=m*I,R.z=w*Z,u.push(R.x,R.y,R.z),d.push(0,I,0),T.x=Z*.5+.5,T.y=re*.5*I+.5,f.push(T.x,T.y),g++}for(let B=0;B<i;B++){const J=b+B,G=O+B;_===!0?h.push(G,G+1,J):h.push(G+1,G,J),x+=3}c.addGroup(p,x,_===!0?1:2),p+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Us(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Dr extends yt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],a=[];o(i),c(n),h(),this.setAttribute("position",new st(r,3)),this.setAttribute("normal",new st(r.slice(),3)),this.setAttribute("uv",new st(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(M){const A=new U,_=new U,b=new U;for(let T=0;T<t.length;T+=3)f(t[T+0],A),f(t[T+1],_),f(t[T+2],b),l(A,_,b,M)}function l(M,A,_,b){const T=b+1,R=[];for(let x=0;x<=T;x++){R[x]=[];const w=M.clone().lerp(_,x/T),I=A.clone().lerp(_,x/T),O=T-x;for(let B=0;B<=O;B++)B===0&&x===T?R[x][B]=w:R[x][B]=w.clone().lerp(I,B/O)}for(let x=0;x<T;x++)for(let w=0;w<2*(T-x)-1;w++){const I=Math.floor(w/2);w%2===0?(d(R[x][I+1]),d(R[x+1][I]),d(R[x][I])):(d(R[x][I+1]),d(R[x+1][I+1]),d(R[x+1][I]))}}function c(M){const A=new U;for(let _=0;_<r.length;_+=3)A.x=r[_+0],A.y=r[_+1],A.z=r[_+2],A.normalize().multiplyScalar(M),r[_+0]=A.x,r[_+1]=A.y,r[_+2]=A.z}function h(){const M=new U;for(let A=0;A<r.length;A+=3){M.x=r[A+0],M.y=r[A+1],M.z=r[A+2];const _=m(M)/2/Math.PI+.5,b=p(M)/Math.PI+.5;a.push(_,1-b)}g(),u()}function u(){for(let M=0;M<a.length;M+=6){const A=a[M+0],_=a[M+2],b=a[M+4],T=Math.max(A,_,b),R=Math.min(A,_,b);T>.9&&R<.1&&(A<.2&&(a[M+0]+=1),_<.2&&(a[M+2]+=1),b<.2&&(a[M+4]+=1))}}function d(M){r.push(M.x,M.y,M.z)}function f(M,A){const _=M*3;A.x=e[_+0],A.y=e[_+1],A.z=e[_+2]}function g(){const M=new U,A=new U,_=new U,b=new U,T=new fe,R=new fe,x=new fe;for(let w=0,I=0;w<r.length;w+=9,I+=6){M.set(r[w+0],r[w+1],r[w+2]),A.set(r[w+3],r[w+4],r[w+5]),_.set(r[w+6],r[w+7],r[w+8]),T.set(a[I+0],a[I+1]),R.set(a[I+2],a[I+3]),x.set(a[I+4],a[I+5]),b.copy(M).add(A).add(_).divideScalar(3);const O=m(b);v(T,I+0,M,O),v(R,I+2,A,O),v(x,I+4,_,O)}}function v(M,A,_,b){b<0&&M.x===1&&(a[A]=M.x-1),_.x===0&&_.z===0&&(a[A]=b/2/Math.PI+.5)}function m(M){return Math.atan2(M.z,-M.x)}function p(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Dr(e.vertices,e.indices,e.radius,e.detail)}}class hn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Be("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let i=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(r-1);const h=n[i],d=n[i+1]-h,f=(a-h)/d;return(i+f)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);const a=this.getPoint(i),o=this.getPoint(r),l=t||(a.isVector2?new fe:new U);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new U,i=[],r=[],a=[],o=new U,l=new $e;for(let f=0;f<=e;f++){const g=f/e;i[f]=this.getTangentAt(g,new U)}r[0]=new U,a[0]=new U;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(et(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,g))}a[f].crossVectors(i[f],r[f])}if(t===!0){let f=Math.acos(et(r[0].dot(r[e]),-1,1));f/=e,i[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(i[g],f*g)),a[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Fr extends hn{constructor(e=0,t=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new fe){const n=t,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);const o=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class $c extends Fr{constructor(e,t,n,i,r,a){super(e,t,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Ur(){let s=0,e=0,t=0,n=0;function i(r,a,o,l){s=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){i(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let d=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,f*=h,i(a,o,d,f)},calc:function(r){const a=r*r,o=a*r;return s+e*r+t*a+n*o}}}const vo=new U,yo=new U,Or=new Ur,Br=new Ur,kr=new Ur;class Qc extends hn{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new U){const n=t,i=this.points,r=i.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=i[(o-1)%r]:(yo.subVectors(i[0],i[1]).add(i[0]),c=yo);const u=i[o%r],d=i[(o+1)%r];if(this.closed||o+2<r?h=i[(o+2)%r]:(vo.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=vo),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),Or.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,v,m),Br.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,v,m),kr.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,v,m)}else this.curveType==="catmullrom"&&(Or.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),Br.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),kr.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(Or.calc(l),Br.calc(l),kr.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new U().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function So(s,e,t,n,i){const r=(n-e)*.5,a=(i-t)*.5,o=s*s,l=s*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*s+t}function jc(s,e){const t=1-s;return t*t*e}function eh(s,e){return 2*(1-s)*s*e}function th(s,e){return s*s*e}function Vi(s,e,t,n){return jc(s,e)+eh(s,t)+th(s,n)}function nh(s,e){const t=1-s;return t*t*t*e}function ih(s,e){const t=1-s;return 3*t*t*s*e}function sh(s,e){return 3*(1-s)*s*s*e}function rh(s,e){return s*s*s*e}function Hi(s,e,t,n,i){return nh(s,e)+ih(s,t)+sh(s,n)+rh(s,i)}class Mo extends hn{constructor(e=new fe,t=new fe,n=new fe,i=new fe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new fe){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Hi(e,i.x,r.x,a.x,o.x),Hi(e,i.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class ah extends hn{constructor(e=new U,t=new U,n=new U,i=new U){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new U){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Hi(e,i.x,r.x,a.x,o.x),Hi(e,i.y,r.y,a.y,o.y),Hi(e,i.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class bo extends hn{constructor(e=new fe,t=new fe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new fe){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new fe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class oh extends hn{constructor(e=new U,t=new U){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new U){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new U){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class To extends hn{constructor(e=new fe,t=new fe,n=new fe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new fe){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(Vi(e,i.x,r.x,a.x),Vi(e,i.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class lh extends hn{constructor(e=new U,t=new U,n=new U){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new U){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(Vi(e,i.x,r.x,a.x),Vi(e,i.y,r.y,a.y),Vi(e,i.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Eo extends hn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new fe){const n=t,i=this.points,r=(i.length-1)*e,a=Math.floor(r),o=r-a,l=i[a===0?a:a-1],c=i[a],h=i[a>i.length-2?i.length-1:a+1],u=i[a>i.length-3?i.length-1:a+2];return n.set(So(o,l.x,c.x,h.x,u.x),So(o,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new fe().fromArray(i))}return this}}var Gr=Object.freeze({__proto__:null,ArcCurve:$c,CatmullRomCurve3:Qc,CubicBezierCurve:Mo,CubicBezierCurve3:ah,EllipseCurve:Fr,LineCurve:bo,LineCurve3:oh,QuadraticBezierCurve:To,QuadraticBezierCurve3:lh,SplineCurve:Eo});class ch extends hn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Gr[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const a=i[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const a=r[i],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(new Gr[i.type]().fromJSON(i))}return this}}class di extends ch{constructor(e){super(),this.type="Path",this.currentPoint=new fe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new bo(this.currentPoint.clone(),new fe(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){const r=new To(this.currentPoint.clone(),new fe(e,t),new fe(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,r,a){const o=new Mo(this.currentPoint.clone(),new fe(e,t),new fe(n,i),new fe(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Eo(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,i,r,a),this}absarc(e,t,n,i,r,a){return this.absellipse(e,t,n,n,i,r,a),this}ellipse(e,t,n,i,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,i,r,a,o,l),this}absellipse(e,t,n,i,r,a,o,l){const c=new Fr(e,t,n,i,r,a,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Os extends di{constructor(e){super(e),this.uuid=zt(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(new di().fromJSON(i))}return this}}function hh(s,e,t=2){const n=e&&e.length,i=n?e[0]*t:s.length;let r=Ao(s,0,i,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=mh(s,e,r,t)),s.length>80*t){o=s[0],l=s[1];let h=o,u=l;for(let d=t;d<i;d+=t){const f=s[d],g=s[d+1];f<o&&(o=f),g<l&&(l=g),f>h&&(h=f),g>u&&(u=g)}c=Math.max(h-o,u-l),c=c!==0?32767/c:0}return Wi(r,a,t,o,l,c,0),a}function Ao(s,e,t,n,i){let r;if(i===Ah(s,e,t,n)>0)for(let a=e;a<t;a+=n)r=qo(a/n|0,s[a],s[a+1],r);else for(let a=t-n;a>=e;a-=n)r=qo(a/n|0,s[a],s[a+1],r);return r&&fi(r,r.next)&&(Ki(r),r=r.next),r}function Yn(s,e){if(!s)return s;e||(e=s);let t=s,n;do if(n=!1,!t.steiner&&(fi(t,t.next)||vt(t.prev,t,t.next)===0)){if(Ki(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Wi(s,e,t,n,i,r,a){if(!s)return;!a&&r&&yh(s,n,i,r);let o=s;for(;s.prev!==s.next;){const l=s.prev,c=s.next;if(r?dh(s,n,i,r):uh(s)){e.push(l.i,s.i,c.i),Ki(s),s=c.next,o=c.next;continue}if(s=c,s===o){a?a===1?(s=fh(Yn(s),e),Wi(s,e,t,n,i,r,2)):a===2&&ph(s,e,t,n,i,r):Wi(Yn(s),e,t,n,i,r,1);break}}}function uh(s){const e=s.prev,t=s,n=s.next;if(vt(e,t,n)>=0)return!1;const i=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=Math.min(i,r,a),u=Math.min(o,l,c),d=Math.max(i,r,a),f=Math.max(o,l,c);let g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&Xi(i,o,r,l,a,c,g.x,g.y)&&vt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function dh(s,e,t,n){const i=s.prev,r=s,a=s.next;if(vt(i,r,a)>=0)return!1;const o=i.x,l=r.x,c=a.x,h=i.y,u=r.y,d=a.y,f=Math.min(o,l,c),g=Math.min(h,u,d),v=Math.max(o,l,c),m=Math.max(h,u,d),p=zr(f,g,e,t,n),M=zr(v,m,e,t,n);let A=s.prevZ,_=s.nextZ;for(;A&&A.z>=p&&_&&_.z<=M;){if(A.x>=f&&A.x<=v&&A.y>=g&&A.y<=m&&A!==i&&A!==a&&Xi(o,h,l,u,c,d,A.x,A.y)&&vt(A.prev,A,A.next)>=0||(A=A.prevZ,_.x>=f&&_.x<=v&&_.y>=g&&_.y<=m&&_!==i&&_!==a&&Xi(o,h,l,u,c,d,_.x,_.y)&&vt(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;A&&A.z>=p;){if(A.x>=f&&A.x<=v&&A.y>=g&&A.y<=m&&A!==i&&A!==a&&Xi(o,h,l,u,c,d,A.x,A.y)&&vt(A.prev,A,A.next)>=0)return!1;A=A.prevZ}for(;_&&_.z<=M;){if(_.x>=f&&_.x<=v&&_.y>=g&&_.y<=m&&_!==i&&_!==a&&Xi(o,h,l,u,c,d,_.x,_.y)&&vt(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function fh(s,e){let t=s;do{const n=t.prev,i=t.next.next;!fi(n,i)&&Ro(n,t,t.next,i)&&Yi(n,i)&&Yi(i,n)&&(e.push(n.i,t.i,i.i),Ki(t),Ki(t.next),t=s=i),t=t.next}while(t!==s);return Yn(t)}function ph(s,e,t,n,i,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&bh(a,o)){let l=Co(a,o);a=Yn(a,a.next),l=Yn(l,l.next),Wi(a,e,t,n,i,r,0),Wi(l,e,t,n,i,r,0);return}o=o.next}a=a.next}while(a!==s)}function mh(s,e,t,n){const i=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*n,l=r<a-1?e[r+1]*n:s.length,c=Ao(s,o,l,n,!1);c===c.next&&(c.steiner=!0),i.push(Mh(c))}i.sort(gh);for(let r=0;r<i.length;r++)t=_h(i[r],t);return t}function gh(s,e){let t=s.x-e.x;if(t===0&&(t=s.y-e.y,t===0)){const n=(s.next.y-s.y)/(s.next.x-s.x),i=(e.next.y-e.y)/(e.next.x-e.x);t=n-i}return t}function _h(s,e){const t=xh(s,e);if(!t)return e;const n=Co(t,s);return Yn(n,n.next),Yn(t,t.next)}function xh(s,e){let t=e;const n=s.x,i=s.y;let r=-1/0,a;if(fi(s,t))return t;do{if(fi(s,t.next))return t.next;if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){const u=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&wo(i<c?n:r,i,l,c,i<c?r:n,i,t.x,t.y)){const u=Math.abs(i-t.y)/(n-t.x);Yi(t,s)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&vh(a,t)))&&(a=t,h=u)}t=t.next}while(t!==o);return a}function vh(s,e){return vt(s.prev,s,e.prev)<0&&vt(e.next,s,s.next)<0}function yh(s,e,t,n){let i=s;do i.z===0&&(i.z=zr(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,Sh(i)}function Sh(s){let e,t=1;do{let n=s,i;s=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,o--):(i=a,a=a.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=a}r.nextZ=null,t*=2}while(e>1);return s}function zr(s,e,t,n,i){return s=(s-t)*i|0,e=(e-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function Mh(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function wo(s,e,t,n,i,r,a,o){return(i-a)*(e-o)>=(s-a)*(r-o)&&(s-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(i-a)*(n-o)}function Xi(s,e,t,n,i,r,a,o){return!(s===a&&e===o)&&wo(s,e,t,n,i,r,a,o)}function bh(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!Th(s,e)&&(Yi(s,e)&&Yi(e,s)&&Eh(s,e)&&(vt(s.prev,s,e.prev)||vt(s,e.prev,e))||fi(s,e)&&vt(s.prev,s,s.next)>0&&vt(e.prev,e,e.next)>0)}function vt(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function fi(s,e){return s.x===e.x&&s.y===e.y}function Ro(s,e,t,n){const i=ks(vt(s,e,t)),r=ks(vt(s,e,n)),a=ks(vt(t,n,s)),o=ks(vt(t,n,e));return!!(i!==r&&a!==o||i===0&&Bs(s,t,e)||r===0&&Bs(s,n,e)||a===0&&Bs(t,s,n)||o===0&&Bs(t,e,n))}function Bs(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function ks(s){return s>0?1:s<0?-1:0}function Th(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&Ro(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function Yi(s,e){return vt(s.prev,s,s.next)<0?vt(s,e,s.next)>=0&&vt(s,s.prev,e)>=0:vt(s,e,s.prev)<0||vt(s,s.next,e)<0}function Eh(s,e){let t=s,n=!1;const i=(s.x+e.x)/2,r=(s.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&i<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==s);return n}function Co(s,e){const t=Vr(s.i,s.x,s.y),n=Vr(e.i,e.x,e.y),i=s.next,r=e.prev;return s.next=e,e.prev=s,t.next=i,i.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function qo(s,e,t,n){const i=Vr(s,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Ki(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Vr(s,e,t){return{i:s,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Ah(s,e,t,n){let i=0;for(let r=e,a=t-n;r<t;r+=n)i+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return i}class wh{static triangulate(e,t,n=2){return hh(e,t,n)}}class an{static area(e){const t=e.length;let n=0;for(let i=t-1,r=0;r<t;i=r++)n+=e[i].x*e[r].y-e[r].x*e[i].y;return n*.5}static isClockWise(e){return an.area(e)<0}static triangulateShape(e,t){const n=[],i=[],r=[];Po(e),Io(n,e);let a=e.length;t.forEach(Po);for(let l=0;l<t.length;l++)i.push(a),a+=t[l].length,Io(n,t[l]);const o=wh.triangulate(n,i);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Po(s){const e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function Io(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}class Ji extends yt{constructor(e=new Os([new fe(.5,.5),new fe(-.5,.5),new fe(-.5,-.5),new fe(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,i=[],r=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];a(c)}this.setAttribute("position",new st(i,3)),this.setAttribute("uv",new st(r,2)),this.computeVertexNormals();function a(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1;let d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,v=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const p=t.extrudePath,M=t.UVGenerator!==void 0?t.UVGenerator:Rh;let A,_=!1,b,T,R,x;if(p){A=p.getSpacedPoints(h),_=!0,d=!1;const C=p.isCatmullRomCurve3?p.closed:!1;b=p.computeFrenetFrames(h,C),T=new U,R=new U,x=new U}d||(m=0,f=0,g=0,v=0);const w=o.extractPoints(c);let I=w.shape;const O=w.holes;if(!an.isClockWise(I)){I=I.reverse();for(let C=0,V=O.length;C<V;C++){const F=O[C];an.isClockWise(F)&&(O[C]=F.reverse())}}function J(C){const F=10000000000000001e-36;let K=C[0];for(let j=1;j<=C.length;j++){const ce=j%C.length,me=C[ce],pe=me.x-K.x,Y=me.y-K.y,S=pe*pe+Y*Y,Re=Math.max(Math.abs(me.x),Math.abs(me.y),Math.abs(K.x),Math.abs(K.y)),Ne=F*Re*Re;if(S<=Ne){C.splice(ce,1),j--;continue}K=me}}J(I),O.forEach(J);const G=O.length,Z=I;for(let C=0;C<G;C++){const V=O[C];I=I.concat(V)}function re(C,V,F){return V||Ke("ExtrudeGeometry: vec does not exist"),C.clone().addScaledVector(V,F)}const $=I.length;function z(C,V,F){let K,j,ce;const me=C.x-V.x,pe=C.y-V.y,Y=F.x-C.x,S=F.y-C.y,Re=me*me+pe*pe,Ne=me*S-pe*Y;if(Math.abs(Ne)>Number.EPSILON){const q=Math.sqrt(Re),y=Math.sqrt(Y*Y+S*S),X=V.x-pe/q,ee=V.y+me/q,le=F.x-S/y,xe=F.y+Y/y,ve=((le-X)*S-(xe-ee)*Y)/(me*S-pe*Y);K=X+me*ve-C.x,j=ee+pe*ve-C.y;const he=K*K+j*j;if(he<=2)return new fe(K,j);ce=Math.sqrt(he/2)}else{let q=!1;me>Number.EPSILON?Y>Number.EPSILON&&(q=!0):me<-Number.EPSILON?Y<-Number.EPSILON&&(q=!0):Math.sign(pe)===Math.sign(S)&&(q=!0),q?(K=-pe,j=me,ce=Math.sqrt(Re)):(K=me,j=pe,ce=Math.sqrt(Re/2))}return new fe(K/ce,j/ce)}const Q=[];for(let C=0,V=Z.length,F=V-1,K=C+1;C<V;C++,F++,K++)F===V&&(F=0),K===V&&(K=0),Q[C]=z(Z[C],Z[F],Z[K]);const ie=[];let oe,Se=Q.concat();for(let C=0,V=G;C<V;C++){const F=O[C];oe=[];for(let K=0,j=F.length,ce=j-1,me=K+1;K<j;K++,ce++,me++)ce===j&&(ce=0),me===j&&(me=0),oe[K]=z(F[K],F[ce],F[me]);ie.push(oe),Se=Se.concat(oe)}let be;if(m===0)be=an.triangulateShape(Z,O);else{const C=[],V=[];for(let F=0;F<m;F++){const K=F/m,j=f*Math.cos(K*Math.PI/2),ce=g*Math.sin(K*Math.PI/2)+v;for(let me=0,pe=Z.length;me<pe;me++){const Y=re(Z[me],Q[me],ce);L(Y.x,Y.y,-j),K===0&&C.push(Y)}for(let me=0,pe=G;me<pe;me++){const Y=O[me];oe=ie[me];const S=[];for(let Re=0,Ne=Y.length;Re<Ne;Re++){const q=re(Y[Re],oe[Re],ce);L(q.x,q.y,-j),K===0&&S.push(q)}K===0&&V.push(S)}}be=an.triangulateShape(C,V)}const Ye=be.length,He=g+v;for(let C=0;C<$;C++){const V=d?re(I[C],Se[C],He):I[C];_?(R.copy(b.normals[0]).multiplyScalar(V.x),T.copy(b.binormals[0]).multiplyScalar(V.y),x.copy(A[0]).add(R).add(T),L(x.x,x.y,x.z)):L(V.x,V.y,0)}for(let C=1;C<=h;C++)for(let V=0;V<$;V++){const F=d?re(I[V],Se[V],He):I[V];_?(R.copy(b.normals[C]).multiplyScalar(F.x),T.copy(b.binormals[C]).multiplyScalar(F.y),x.copy(A[C]).add(R).add(T),L(x.x,x.y,x.z)):L(F.x,F.y,u/h*C)}for(let C=m-1;C>=0;C--){const V=C/m,F=f*Math.cos(V*Math.PI/2),K=g*Math.sin(V*Math.PI/2)+v;for(let j=0,ce=Z.length;j<ce;j++){const me=re(Z[j],Q[j],K);L(me.x,me.y,u+F)}for(let j=0,ce=O.length;j<ce;j++){const me=O[j];oe=ie[j];for(let pe=0,Y=me.length;pe<Y;pe++){const S=re(me[pe],oe[pe],K);_?L(S.x,S.y+A[h-1].y,A[h-1].x+F):L(S.x,S.y,u+F)}}}Je(),D();function Je(){const C=i.length/3;if(d){let V=0,F=$*V;for(let K=0;K<Ye;K++){const j=be[K];P(j[2]+F,j[1]+F,j[0]+F)}V=h+m*2,F=$*V;for(let K=0;K<Ye;K++){const j=be[K];P(j[0]+F,j[1]+F,j[2]+F)}}else{for(let V=0;V<Ye;V++){const F=be[V];P(F[2],F[1],F[0])}for(let V=0;V<Ye;V++){const F=be[V];P(F[0]+$*h,F[1]+$*h,F[2]+$*h)}}n.addGroup(C,i.length/3-C,0)}function D(){const C=i.length/3;let V=0;N(Z,V),V+=Z.length;for(let F=0,K=O.length;F<K;F++){const j=O[F];N(j,V),V+=j.length}n.addGroup(C,i.length/3-C,1)}function N(C,V){let F=C.length;for(;--F>=0;){const K=F;let j=F-1;j<0&&(j=C.length-1);for(let ce=0,me=h+m*2;ce<me;ce++){const pe=$*ce,Y=$*(ce+1),S=V+K+pe,Re=V+j+pe,Ne=V+j+Y,q=V+K+Y;k(S,Re,Ne,q)}}}function L(C,V,F){l.push(C),l.push(V),l.push(F)}function P(C,V,F){se(C),se(V),se(F);const K=i.length/3,j=M.generateTopUV(n,i,K-3,K-2,K-1);_e(j[0]),_e(j[1]),_e(j[2])}function k(C,V,F,K){se(C),se(V),se(K),se(V),se(F),se(K);const j=i.length/3,ce=M.generateSideWallUV(n,i,j-6,j-3,j-2,j-1);_e(ce[0]),_e(ce[1]),_e(ce[3]),_e(ce[1]),_e(ce[2]),_e(ce[3])}function se(C){i.push(l[C*3+0]),i.push(l[C*3+1]),i.push(l[C*3+2])}function _e(C){r.push(C.x),r.push(C.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Ch(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,a=e.shapes.length;r<a;r++){const o=t[e.shapes[r]];n.push(o)}const i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new Gr[i.type]().fromJSON(i)),new Ji(n,e.options)}}const Rh={generateTopUV:function(s,e,t,n,i){const r=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[i*3],h=e[i*3+1];return[new fe(r,a),new fe(o,l),new fe(c,h)]},generateSideWallUV:function(s,e,t,n,i,r){const a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[i*3],f=e[i*3+1],g=e[i*3+2],v=e[r*3],m=e[r*3+1],p=e[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new fe(a,1-l),new fe(c,1-u),new fe(d,1-g),new fe(v,1-p)]:[new fe(o,1-l),new fe(h,1-u),new fe(f,1-g),new fe(m,1-p)]}};function Ch(s,e,t){if(t.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){const r=s[n];t.shapes.push(r.uuid)}else t.shapes.push(s.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Hr extends Dr{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Hr(e.radius,e.detail)}}class Zi extends yt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,u=e/o,d=t/l,f=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const M=p*d-a;for(let A=0;A<c;A++){const _=A*u-r;g.push(_,-M,0),v.push(0,0,1),m.push(A/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let M=0;M<o;M++){const A=M+c*p,_=M+c*(p+1),b=M+1+c*(p+1),T=M+1+c*p;f.push(A,_,T),f.push(_,b,T)}this.setIndex(f),this.setAttribute("position",new st(g,3)),this.setAttribute("normal",new st(v,3)),this.setAttribute("uv",new st(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zi(e.width,e.height,e.widthSegments,e.heightSegments)}}class Wr extends yt{constructor(e=new Os([new fe(0,.5),new fe(-.5,-.5),new fe(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],i=[],r=[],a=[];let o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new st(i,3)),this.setAttribute("normal",new st(r,3)),this.setAttribute("uv",new st(a,2));function c(h){const u=i.length/3,d=h.extractPoints(t);let f=d.shape;const g=d.holes;an.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){const M=g[m];an.isClockWise(M)===!0&&(g[m]=M.reverse())}const v=an.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){const M=g[m];f=f.concat(M)}for(let m=0,p=f.length;m<p;m++){const M=f[m];i.push(M.x,M.y,0),r.push(0,0,1),a.push(M.x,M.y)}for(let m=0,p=v.length;m<p;m++){const M=v[m],A=M[0]+u,_=M[1]+u,b=M[2]+u;n.push(A,_,b),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return qh(t,e)}static fromJSON(e,t){const n=[];for(let i=0,r=e.shapes.length;i<r;i++){const a=t[e.shapes[i]];n.push(a)}return new Wr(n,e.curveSegments)}}function qh(s,e){if(e.shapes=[],Array.isArray(s))for(let t=0,n=s.length;t<n;t++){const i=s[t];e.shapes.push(i.uuid)}else e.shapes.push(s.uuid);return e}class Xr extends yt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new U,d=new U,f=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){const M=[],A=p/n,_=a+A*o,b=e*Math.cos(_),T=Math.sqrt(e*e-b*b);let R=0;p===0&&a===0?R=.5/t:p===n&&l===Math.PI&&(R=-.5/t);for(let x=0;x<=t;x++){const w=x/t,I=i+w*r;u.x=-T*Math.cos(I),u.y=b,u.z=T*Math.sin(I),g.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),m.push(w+R,1-A),M.push(c++)}h.push(M)}for(let p=0;p<n;p++)for(let M=0;M<t;M++){const A=h[p][M+1],_=h[p][M],b=h[p+1][M],T=h[p+1][M+1];(p!==0||a>0)&&f.push(A,_,T),(p!==n-1||l<Math.PI)&&f.push(_,b,T)}this.setIndex(f),this.setAttribute("position",new st(g,3)),this.setAttribute("normal",new st(v,3)),this.setAttribute("uv",new st(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xr(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Yr extends yt{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),i=Math.floor(i);const l=[],c=[],h=[],u=[],d=new U,f=new U,g=new U;for(let v=0;v<=n;v++){const m=a+v/n*o;for(let p=0;p<=i;p++){const M=p/i*r;f.x=(e+t*Math.cos(m))*Math.cos(M),f.y=(e+t*Math.cos(m))*Math.sin(M),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(M),d.y=e*Math.sin(M),g.subVectors(f,d).normalize(),h.push(g.x,g.y,g.z),u.push(p/i),u.push(v/n)}}for(let v=1;v<=n;v++)for(let m=1;m<=i;m++){const p=(i+1)*v+m-1,M=(i+1)*(v-1)+m-1,A=(i+1)*(v-1)+m,_=(i+1)*v+m;l.push(p,M,_),l.push(M,A,_)}this.setIndex(l),this.setAttribute("position",new st(c,3)),this.setAttribute("normal",new st(h,3)),this.setAttribute("uv",new st(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Yr(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}}class Kr extends yt{constructor(e=1,t=.4,n=64,i=8,r=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:n,radialSegments:i,p:r,q:a},n=Math.floor(n),i=Math.floor(i);const o=[],l=[],c=[],h=[],u=new U,d=new U,f=new U,g=new U,v=new U,m=new U,p=new U;for(let A=0;A<=n;++A){const _=A/n*r*Math.PI*2;M(_,r,a,e,f),M(_+.01,r,a,e,g),m.subVectors(g,f),p.addVectors(g,f),v.crossVectors(m,p),p.crossVectors(v,m),v.normalize(),p.normalize();for(let b=0;b<=i;++b){const T=b/i*Math.PI*2,R=-t*Math.cos(T),x=t*Math.sin(T);u.x=f.x+(R*p.x+x*v.x),u.y=f.y+(R*p.y+x*v.y),u.z=f.z+(R*p.z+x*v.z),l.push(u.x,u.y,u.z),d.subVectors(u,f).normalize(),c.push(d.x,d.y,d.z),h.push(A/n),h.push(b/i)}}for(let A=1;A<=n;A++)for(let _=1;_<=i;_++){const b=(i+1)*(A-1)+(_-1),T=(i+1)*A+(_-1),R=(i+1)*A+_,x=(i+1)*(A-1)+_;o.push(b,T,x),o.push(T,R,x)}this.setIndex(o),this.setAttribute("position",new st(l,3)),this.setAttribute("normal",new st(c,3)),this.setAttribute("uv",new st(h,2));function M(A,_,b,T,R){const x=Math.cos(A),w=Math.sin(A),I=b/_*A,O=Math.cos(I);R.x=T*(2+O)*.5*x,R.y=T*(2+O)*w*.5,R.z=T*Math.sin(I)*.5}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Kr(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}}function pi(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];if(Lo(i))i.isRenderTargetTexture?(Be("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(Lo(i[0])){const r=[];for(let a=0,o=i.length;a<o;a++)r[a]=i[a].clone();e[t][n]=r}else e[t][n]=i.slice();else e[t][n]=i}}return e}function Dt(s){const e={};for(let t=0;t<s.length;t++){const n=pi(s[t]);for(const i in n)e[i]=n[i]}return e}function Lo(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function Ph(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function No(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:it.workingColorSpace}const Ih={clone:pi,merge:Dt};var Lh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Nh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class un extends rn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Lh,this.fragmentShader=Nh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=pi(e.uniforms),this.uniformsGroups=Ph(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new We().setHex(i.value);break;case"v2":this.uniforms[n].value=new fe().fromArray(i.value);break;case"v3":this.uniforms[n].value=new U().fromArray(i.value);break;case"v4":this.uniforms[n].value=new dt().fromArray(i.value);break;case"m3":this.uniforms[n].value=new Ve().fromArray(i.value);break;case"m4":this.uniforms[n].value=new $e().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class Dh extends un{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class mi extends rn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new We(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new We(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Xt extends mi{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new fe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return et(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new We(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new We(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new We(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Fh extends rn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new We(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new We(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vn,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Uh extends rn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Oh extends rn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function Nn(s,e){return!s||s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function Gs(s){return s!==void 0&&s.inTangents!==void 0&&s.outTangents!==void 0}function Bh(s){function e(i,r){return s[i]-s[r]}const t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Do(s,e,t){const n=s.length,i=new s.constructor(n);for(let r=0,a=0;a!==n;++r){const o=t[r]*e;for(let l=0;l!==e;++l)i[a++]=s[o+l]}return i}function kh(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=s[i++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=s[i++];while(r!==void 0)}class gi{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],r=t[n-1];e:{t:{let a;n:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=i,i=t[++n],e<i)break t}a=t.length;break n}if(!(e>=r)){const o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=t[--n-1],e>=r)break t}a=n,n=0;break n}break e}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let a=0;a!==i;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class Gh extends gi{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:2400,endingEnd:2400}}intervalChanged_(e,t,n){const i=this.parameterPositions;let r=e-2,a=e+1,o=i[r],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case 2401:r=e,o=2*t-n;break;case 2402:r=i.length-2,o=t+i[r]-i[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case 2401:a=e,l=2*n-t;break;case 2402:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}const c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(n-t)/(i-t),v=g*g,m=v*g,p=-d*m+2*d*v-d*g,M=(1+d)*m+(-1.5-2*d)*v+(-.5+d)*g+1,A=(-1-f)*m+(1.5+f)*v+.5*g,_=f*m-f*v;for(let b=0;b!==o;++b)r[b]=p*a[h+b]+M*a[c+b]+A*a[l+b]+_*a[u+b];return r}}class Fo extends gi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(i-t),u=1-h;for(let d=0;d!==o;++d)r[d]=a[c+d]*u+a[l+d]*h;return r}}class zh extends gi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class Vh extends gi{interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.inTangents,u=this.outTangents;if(!h||!u){const g=(n-t)/(i-t),v=1-g;for(let m=0;m!==o;++m)r[m]=a[c+m]*v+a[l+m]*g;return r}const d=o*2,f=e-1;for(let g=0;g!==o;++g){const v=a[c+g],m=a[l+g],p=f*d+g*2,M=u[p],A=u[p+1],_=e*d+g*2,b=h[_],T=h[_+1],R=Wh(n,t,M,b,i);r[g]=Uo(R,v,A,T,m)}return r}}function Uo(s,e,t,n,i){const r=1-s;return r*r*r*e+3*r*r*s*t+3*r*s*s*n+s*s*s*i}function Hh(s,e,t,n,i){const r=1-s;return 3*r*r*(t-e)+6*r*s*(n-t)+3*s*s*(i-n)}function Wh(s,e,t,n,i){let r=(s-e)/(i-e);for(let a=0;a<8;a++){const o=Uo(r,e,t,n,i)-s;if(Math.abs(o)<1e-10)break;const l=Hh(r,e,t,n,i);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}class on{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Nn(t,this.TimeBufferType),this.values=Nn(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Nn(e.times,Array),values:Nn(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i),Gs(e.settings)&&(n.settings={inTangents:Nn(e.settings.inTangents,Array),outTangents:Nn(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new zh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Fo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Gh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new Vh(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case 2300:t=this.InterpolantFactoryMethodDiscrete;break;case 2301:t=this.InterpolantFactoryMethodLinear;break;case 2302:t=this.InterpolantFactoryMethodSmooth;break;case 2303:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Be("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return 2300;case this.InterpolantFactoryMethodLinear:return 2301;case this.InterpolantFactoryMethodSmooth:return 2302;case this.InterpolantFactoryMethodBezier:return 2303}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e;Gs(this.settings)&&(Oo(this.settings.inTangents,e),Oo(this.settings.outTangents,e))}return this}trim(e,t){const n=this.times,i=n.length;let r=0,a=i-1;for(;r!==i&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==i){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(Ke("KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,r=n.length;r===0&&(Ke("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const l=n[o];if(typeof l=="number"&&isNaN(l)){Ke("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Ke("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(i!==void 0&&jl(i))for(let o=0,l=i.length;o!==l;++o){const c=i[o];if(isNaN(c)){Ke("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===2302,r=e.length-1;let a=1;for(let o=1;o<r;++o){let l=!1;const c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(i)l=!0;else{const u=o*n,d=u-n,f=u+n;for(let g=0;g!==n;++g){const v=t[u+g];if(v!==t[d+g]||v!==t[f+g]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const u=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,Gs(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}}function Oo(s,e){for(let t=0,n=s.length;t!==n;t+=2)s[t]*=e}on.prototype.ValueTypeName="",on.prototype.TimeBufferType=Float32Array,on.prototype.ValueBufferType=Float32Array,on.prototype.DefaultInterpolation=2301;class _i extends on{constructor(e,t,n){super(e,t,n)}}_i.prototype.ValueTypeName="bool",_i.prototype.ValueBufferType=Array,_i.prototype.DefaultInterpolation=2300,_i.prototype.InterpolantFactoryMethodLinear=void 0,_i.prototype.InterpolantFactoryMethodSmooth=void 0;class Bo extends on{constructor(e,t,n,i){super(e,t,n,i)}}Bo.prototype.ValueTypeName="color";class $i extends on{constructor(e,t,n,i){super(e,t,n,i)}}$i.prototype.ValueTypeName="number";class Xh extends gi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(i-t);let c=e*o;for(let h=c+o;c!==h;c+=4)Vt.slerpFlat(r,0,a,c-o,a,c,l);return r}}class Qi extends on{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new Xh(this.times,this.values,this.getValueSize(),e)}}Qi.prototype.ValueTypeName="quaternion",Qi.prototype.InterpolantFactoryMethodSmooth=void 0;class xi extends on{constructor(e,t,n){super(e,t,n)}}xi.prototype.ValueTypeName="string",xi.prototype.ValueBufferType=Array,xi.prototype.DefaultInterpolation=2300,xi.prototype.InterpolantFactoryMethodLinear=void 0,xi.prototype.InterpolantFactoryMethodSmooth=void 0;class zs extends on{constructor(e,t,n,i){super(e,t,n,i)}}zs.prototype.ValueTypeName="vector";class Jr{constructor(e="",t=-1,n=[],i=2500){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=zt(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(Kh(n[a]).scale(i));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=n.length;r!==a;++r)t.push(on.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);const h=Bh(l);l=Do(l,1,h),c=Do(c,1,h),!i&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new $i(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],h=c.name.match(r);if(h&&h.length>1){const u=h[1];let d=i[u];d||(i[u]=d=[]),d.push(c)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function Yh(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return $i;case"vector":case"vector2":case"vector3":case"vector4":return zs;case"color":return Bo;case"quaternion":return Qi;case"bool":case"boolean":return _i;case"string":return xi}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function Kh(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=Yh(s.type);if(s.times===void 0){const n=[],i=[];kh(s.keys,n,i,"value"),s.times=n,s.values=i}let t;return e.parse!==void 0?t=e.parse(s):t=new e(s.name,s.times,s.values,s.interpolation),Gs(s.settings)&&(t.settings={inTangents:Nn(s.settings.inTangents,Float32Array),outTangents:Nn(s.settings.outTangents,Float32Array)}),t}const En={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(ko(s)||(this.files[s]=e))},get:function(s){if(this.enabled!==!1&&!ko(s))return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};function ko(s){try{const e=s.slice(s.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class Jh{constructor(e,t,n){const i=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&i.onStart!==void 0&&i.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){const f=c[u],g=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const Zh=new Jh;class Dn{constructor(e){this.manager=e!==void 0?e:Zh,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}Dn.DEFAULT_MATERIAL_NAME="__DEFAULT";const An={};class $h extends Error{constructor(e,t){super(e),this.response=t}}class Vs extends Dn{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=En.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(An[e]!==void 0){An[e].push({onLoad:t,onProgress:n,onError:i});return}An[e]=[],An[e].push({onLoad:t,onProgress:n,onError:i});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Be("FileLoader: HTTP Status 0 received."),typeof ReadableStream=="undefined"||c.body===void 0||c.body.getReader===void 0)return c;const h=An[e],u=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,g=f!==0;let v=0;const m=new ReadableStream({start(p){M();function M(){u.read().then(({done:A,value:_})=>{if(A)p.close();else{v+=_.byteLength;const b=new ProgressEvent("progress",{lengthComputable:g,loaded:v,total:f});for(let T=0,R=h.length;T<R;T++){const x=h[T];x.onProgress&&x.onProgress(b)}p.enqueue(_),M()}},A=>{p.error(A)})}}});return new Response(m)}else throw new $h(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{const u=/charset="?([^;"\s]*)"?/i.exec(o),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(g=>f.decode(g))}}}).then(c=>{En.add(`file:${e}`,c);const h=An[e];delete An[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onLoad&&f.onLoad(c)}}).catch(c=>{const h=An[e];if(h===void 0)throw this.manager.itemError(e),c;delete An[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const vi=new WeakMap;class Qh extends Dn{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=En.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let u=vi.get(a);u===void 0&&(u=[],vi.set(a,u)),u.push({onLoad:t,onError:i})}return a}const o=Pi("img");function l(){h(),t&&t(this);const u=vi.get(this)||[];for(let d=0;d<u.length;d++){const f=u[d];f.onLoad&&f.onLoad(this)}vi.delete(this),r.manager.itemEnd(e)}function c(u){h(),i&&i(u),En.remove(`image:${e}`);const d=vi.get(this)||[];for(let f=0;f<d.length;f++){const g=d[f];g.onError&&g.onError(u)}vi.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),En.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}}class Go extends Dn{constructor(e){super(e)}load(e,t,n,i){const r=new Tt,a=new Qh(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}}class Hs extends _t{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new We(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class jh extends Hs{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.groundColor=new We(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Zr=new $e,zo=new U,Vo=new U;class $r{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new fe(512,512),this.mapType=1009,this.map=null,this.mapPass=null,this.matrix=new $e,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new qr,this._frameExtents=new fe(1,1),this._viewportCount=1,this._viewports=[new dt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;zo.setFromMatrixPosition(e.matrixWorld),t.position.copy(zo),Vo.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Vo),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,i){Zr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Zr,e.coordinateSystem,e.reversedDepth);const r=this._frameExtents,a=i?i.z/r.x:1,o=i?i.w/r.y:1,l=i?i.x/r.x:0,c=i?i.y/r.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Zr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Ws=new U,Xs=new Vt,dn=new U;class Ho extends _t{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new $e,this.projectionMatrix=new $e,this.projectionMatrixInverse=new $e,this.coordinateSystem=2e3,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Ws,Xs,dn),dn.x===1&&dn.y===1&&dn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ws,Xs,dn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Ws,Xs,dn),dn.x===1&&dn.y===1&&dn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ws,Xs,dn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Fn=new U,Wo=new fe,Xo=new fe;class Ft extends Ho{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=jn*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ii*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return jn*2*Math.atan(Math.tan(Ii*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Fn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Fn.x,Fn.y).multiplyScalar(-e/Fn.z),Fn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Fn.x,Fn.y).multiplyScalar(-e/Fn.z)}getViewSize(e,t){return this.getViewBounds(e,Wo,Xo),t.subVectors(Xo,Wo)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ii*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class eu extends $r{constructor(){super(new Ft(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=jn*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){const e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}}class tu extends Hs{constructor(e,t,n=0,i=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.target=new _t,this.distance=n,this.angle=i,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new eu}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class nu extends $r{constructor(){super(new Ft(90,1,.5,500)),this.isPointLightShadow=!0}}class Yo extends Hs{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new nu}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class Ys extends Ho{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class iu extends $r{constructor(){super(new Ys(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ko extends Hs{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.target=new _t,this.shadow=new iu}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class ji{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const Qr=new WeakMap;class su extends Dn{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap=="undefined"&&Be("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch=="undefined"&&Be("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=En.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{Qr.has(a)===!0?(i&&i(Qr.get(a)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(c),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);return}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(c){return En.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){i&&i(c),Qr.set(l,c),En.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});En.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const yi=-90,Si=1;class ru extends _t{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Ft(yi,Si,e,t);i.layers=this.layers,this.add(i);const r=new Ft(yi,Si,e,t);r.layers=this.layers,this.add(r);const a=new Ft(yi,Si,e,t);a.layers=this.layers,this.add(a);const o=new Ft(yi,Si,e,t);o.layers=this.layers,this.add(o);const l=new Ft(yi,Si,e,t);l.layers=this.layers,this.add(l);const c=new Ft(yi,Si,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class au extends Ft{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class ou{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,r,a;switch(t){case"quaternion":i=this._slerp,r=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,r=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,r=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=r,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const n=this.buffer,i=this.valueSize,r=e*i+i;let a=this.cumulativeWeight;if(a===0){for(let o=0;o!==i;++o)n[r+o]=n[o];a=t}else{a+=t;const o=t/a;this._mixBufferRegion(n,r,0,o,i)}this.cumulativeWeight=a}accumulateAdditive(e){const t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,n=this.buffer,i=e*t+t,r=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){const l=t*this._origIndex;this._mixBufferRegion(n,i,l,1-r,t)}a>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(n[l]!==n[l+t]){o.setValue(n,i);break}}saveOriginalState(){const e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let r=n,a=i;r!==a;++r)t[r]=t[i+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,r){if(i>=.5)for(let a=0;a!==r;++a)e[t+a]=e[n+a]}_slerp(e,t,n,i){Vt.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,r){const a=this._workIndex*r;Vt.multiplyQuaternionsFlat(e,a,e,t,e,n),Vt.slerpFlat(e,t,e,t,e,a,i)}_lerp(e,t,n,i,r){const a=1-i;for(let o=0;o!==r;++o){const l=t+o;e[l]=e[l]*a+e[n+o]*i}}_lerpAdditive(e,t,n,i,r){for(let a=0;a!==r;++a){const o=t+a;e[o]=e[o]+e[n+a]*i}}}const jr="\\[\\]\\.:\\/",lu=new RegExp("["+jr+"]","g"),ea="[^"+jr+"]",cu="[^"+jr.replace("\\.","")+"]",hu=/((?:WC+[\/:])*)/.source.replace("WC",ea),uu=/(WCOD+)?/.source.replace("WCOD",cu),du=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",ea),fu=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",ea),pu=new RegExp("^"+hu+uu+du+fu+"$"),mu=["material","materials","bones","map"];class gu{constructor(e,t,n){const i=n||ot.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class ot{constructor(e,t,n){this.path=t,this.parsedPath=n||ot.parseTrackName(t),this.node=ot.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new ot.Composite(e,t,n):new ot(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(lu,"")}static parseTrackName(e){const t=pu.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const r=n.nodeName.substring(i+1);mu.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let r=t.propertyIndex;if(e||(e=ot.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Be("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ke("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ke("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ke("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ke("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Ke("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[i];if(a===void 0){const c=t.nodeName;Ke("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){Ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}ot.Composite=gu,ot.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},ot.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},ot.prototype.GetterByBindingType=[ot.prototype._getValue_direct,ot.prototype._getValue_array,ot.prototype._getValue_arrayElement,ot.prototype._getValue_toArray],ot.prototype.SetterByBindingTypeAndVersioning=[[ot.prototype._setValue_direct,ot.prototype._setValue_direct_setNeedsUpdate,ot.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ot.prototype._setValue_array,ot.prototype._setValue_array_setNeedsUpdate,ot.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ot.prototype._setValue_arrayElement,ot.prototype._setValue_arrayElement_setNeedsUpdate,ot.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ot.prototype._setValue_fromArray,ot.prototype._setValue_fromArray_setNeedsUpdate,ot.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class _u{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;const r=t.tracks,a=r.length,o=new Array(a),l={endingStart:2400,endingEnd:2400};for(let c=0;c!==a;++c){const h=r[c].createInterpolant(null);o[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=2201,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){const i=this._clip.duration,r=e._clip.duration,a=r/i,o=i/r;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,a,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){const i=this._mixer,r=i.time,a=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=i._lendControlInterpolant(),this._timeScaleInterpolant=o);const l=o.parameterPositions,c=o.sampleValues;return l[0]=r,l[1]=r+n,c[0]=e/a,c[1]=t/a,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}const r=this._startTime;if(r!==null){const l=(e-r)*n;l<0||n===0?t=0:(this._startTime=null,t=n*l)}t*=this._updateTimeScale(e);const a=this._updateTime(t),o=this._updateWeight(e);if(o>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case 2501:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(a),c[h].accumulateAdditive(o);break;case 2500:default:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(a),c[h].accumulate(i,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const n=this._weightInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const n=this._timeScaleInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,n=this.loop;let i=this.time+e,r=this._loopCount;const a=n===2202;if(e===0)return r===-1?i:a&&(r&1)===1?t-i:i;if(n===2200){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),i>=t||i<0){const o=Math.floor(i/t);i-=t*o,r+=Math.abs(o);const l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){const c=e<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=r,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this._loopCount=r,this.time=i;if(a&&(r&1)===1)return t-i}return i}_setEndings(e,t,n){const i=this._interpolantSettings;n?(i.endingStart=2401,i.endingEnd=2401):(e?i.endingStart=this.zeroSlopeAtStart?2401:2400:i.endingStart=2402,t?i.endingEnd=this.zeroSlopeAtEnd?2401:2400:i.endingEnd=2402)}_scheduleFading(e,t,n){const i=this._mixer,r=i.time;let a=this._weightInterpolant;a===null&&(a=i._lendControlInterpolant(),this._weightInterpolant=a);const o=a.parameterPositions,l=a.sampleValues;return o[0]=r,l[0]=t,o[1]=r+e,l[1]=n,this}}const xu=new Float32Array(1);class vu extends Rn{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){const n=e._localRoot||this._root,i=e._clip.tracks,r=i.length,a=e._propertyBindings,o=e._interpolants,l=n.uuid,c=this._bindingsByRootAndName;let h=c[l];h===void 0&&(h={},c[l]=h);for(let u=0;u!==r;++u){const d=i[u],f=d.name;let g=h[f];if(g!==void 0)++g.referenceCount,a[u]=g;else{if(g=a[u],g!==void 0){g._cacheIndex===null&&(++g.referenceCount,this._addInactiveBinding(g,l,f));continue}const v=t&&t._propertyBindings[u].binding.parsedPath;g=new ou(ot.create(n,f,v),d.ValueTypeName,d.getValueSize()),++g.referenceCount,this._addInactiveBinding(g,l,f),a[u]=g}o[u].resultBuffer=g.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const n=(e._localRoot||this._root).uuid,i=e._clip.uuid,r=this._actionsByClip[i];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,i,n)}const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){const i=this._actions,r=this._actionsByClip;let a=r[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=a;else{const o=a.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=i.length,i.push(e),a.actionByRoot[n]=e}_removeInactiveAction(e){const t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;const r=e._clip.uuid,a=this._actionsByClip,o=a[r],l=o.knownActions,c=l[l.length-1],h=e._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),e._byClipCacheIndex=null;const u=o.actionByRoot,d=(e._localRoot||this._root).uuid;delete u[d],l.length===0&&delete a[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){const t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackAction(e){const t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_addInactiveBinding(e,t,n){const i=this._bindingsByRootAndName,r=this._bindings;let a=i[t];a===void 0&&(a={},i[t]=a),a[n]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){const t=this._bindings,n=e.binding,i=n.rootNode.uuid,r=n.path,a=this._bindingsByRootAndName,o=a[i],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete o[r],Object.keys(o).length===0&&delete a[i]}_lendBinding(e){const t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackBinding(e){const t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let n=e[t];return n===void 0&&(n=new Fo(new Float32Array(2),new Float32Array(2),1,xu),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){const t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,r=t[i];e.__cacheIndex=i,t[i]=e,r.__cacheIndex=n,t[n]=r}clipAction(e,t,n){const i=t||this._root,r=i.uuid;let a=typeof e=="string"?Jr.findByName(i,e):e;const o=a!==null?a.uuid:e,l=this._actionsByClip[o];let c=null;if(n===void 0&&(a!==null?n=a.blendMode:n=2500),l!==void 0){const u=l.actionByRoot[r];if(u!==void 0&&u.blendMode===n)return u;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;const h=new _u(this,a,t,n);return this._bindAction(h,c),this._addInactiveAction(h,o,r),h}existingAction(e,t){const n=t||this._root,i=n.uuid,r=typeof e=="string"?Jr.findByName(n,e):e,a=r?r.uuid:e,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[i]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;const t=this._actions,n=this._nActiveActions,i=this.time+=e,r=Math.sign(e),a=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(i,e,r,a);const o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,n=e.uuid,i=this._actionsByClip,r=i[n];if(r!==void 0){const a=r.knownActions;for(let o=0,l=a.length;o!==l;++o){const c=a[o];this._deactivateAction(c);const h=c._cacheIndex,u=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,u._cacheIndex=h,t[h]=u,t.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(e){const t=e.uuid,n=this._actionsByClip;for(const a in n){const o=n[a].actionByRoot,l=o[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const i=this._bindingsByRootAndName,r=i[t];if(r!==void 0)for(const a in r){const o=r[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){const n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}const Ta=class Ta{constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){const r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=i,this}};Ta.prototype.isMatrix2=!0;let Jo=Ta;const Zo=new fe;class ta{constructor(e=new fe(1/0,1/0),t=new fe(-1/0,-1/0)){this.isBox2=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Zo.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(e){return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Zo).distanceTo(e)}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}class Un{constructor(){this.type="ShapePath",this.color=new We,this.subPaths=[],this.currentPath=null,this.userData={}}moveTo(e,t){return this.currentPath=new di,this.subPaths.push(this.currentPath),this.currentPath.moveTo(e,t),this}lineTo(e,t){return this.currentPath.lineTo(e,t),this}quadraticCurveTo(e,t,n,i){return this.currentPath.quadraticCurveTo(e,t,n,i),this}bezierCurveTo(e,t,n,i,r,a){return this.currentPath.bezierCurveTo(e,t,n,i,r,a),this}splineThru(e){return this.currentPath.splineThru(e),this}toShapes(){function e(l,c){let h=!1;const u=c.length;for(let d=0,f=u-1;d<u;f=d++){const g=c[d],v=c[f];g.y>l.y!=v.y>l.y&&l.x<(v.x-g.x)*(l.y-g.y)/(v.y-g.y)+g.x&&(h=!h)}return h}function t(l,c){const h=c.getCenter(new fe);if(e(h,l))return h;const u=h.y,d=[],f=l.length;for(let g=0;g<f;g++){const v=l[g],m=l[(g+1)%f];if(v.y>u!=m.y>u){const p=v.x+(u-v.y)*(m.x-v.x)/(m.y-v.y);d.push(p)}}return d.length>1&&(d.sort((g,v)=>g-v),h.x=(d[0]+d[1])/2),h}let n=this.userData.style&&this.userData.style.fillRule||"nonzero";n!=="nonzero"&&n!=="evenodd"&&(Be('Fill-rule "'+n+'" is not supported, falling back to "nonzero".'),n="nonzero");const i=n==="nonzero"?l=>l!==0:l=>(l&1)!==0,r=[];for(const l of this.subPaths){const c=l.getPoints();if(c.length<3)continue;const h=an.area(c);if(h===0)continue;const u=new ta;for(let d=0;d<c.length;d++)u.expandByPoint(c[d]);r.push({subPath:l,points:c,boundingBox:u,interiorPoint:t(c,u),absArea:Math.abs(h),winding:h<0?-1:1,container:null,exclude:!1,role:null})}r.sort((l,c)=>c.absArea-l.absArea);for(let l=0;l<r.length;l++){const c=r[l];let h=0;for(let u=l-1;u>=0;u--){const d=r[u];if(d.boundingBox.containsBox(c.boundingBox)&&e(c.interiorPoint,d.points)){c.container=d.exclude?d.container:d,h=d.winding,c.winding+=h;break}}i(c.winding)===i(h)&&(c.exclude=!0)}for(const l of r)l.exclude||(l.role=l.container===null||l.container.role==="hole"?"outer":"hole");const a=[],o=new Map;for(const l of r){if(l.exclude||l.role!=="outer")continue;const c=new Os;c.curves=l.subPath.curves,a.push(c),o.set(l,c)}for(const l of r){if(l.exclude||l.role!=="hole")continue;const c=o.get(l.container);if(!c)continue;const h=new di;h.curves=l.subPath.curves,c.holes.push(h)}return a}}function $o(s,e,t,n){const i=yu(n);switch(t){case 1021:return s*e;case 1028:return s*e/i.components*i.byteLength;case 1029:return s*e/i.components*i.byteLength;case 1030:return s*e*2/i.components*i.byteLength;case 1031:return s*e*2/i.components*i.byteLength;case 1022:return s*e*3/i.components*i.byteLength;case 1023:return s*e*4/i.components*i.byteLength;case 1033:return s*e*4/i.components*i.byteLength;case 33776:case 33777:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case 33778:case 33779:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case 35841:case 35843:return Math.max(s,16)*Math.max(e,8)/4;case 35840:case 35842:return Math.max(s,8)*Math.max(e,8)/2;case 36196:case 37492:case 37488:case 37489:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case 37496:case 37490:case 37491:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case 37808:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case 37809:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case 37810:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case 37811:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case 37812:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case 37813:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case 37814:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case 37815:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case 37816:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case 37817:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case 37818:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case 37819:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case 37820:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case 37821:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(s/4)*Math.ceil(e/4)*16;case 36283:case 36284:return Math.ceil(s/4)*Math.ceil(e/4)*8;case 36285:case 36286:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function yu(s){switch(s){case 1009:case 1010:return{byteLength:1,components:1};case 1012:case 1011:case 1016:return{byteLength:2,components:1};case 1017:case 1018:return{byteLength:2,components:4};case 1014:case 1013:case 1015:return{byteLength:4,components:1};case 35902:case 35899:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:nr}})),typeof window!="undefined"&&(window.__THREE__?Be("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=nr);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Qo(){let s=null,e=!1,t=null,n=null;function i(r,a){n=s.requestAnimationFrame(i),t(r,a)}return{start:function(){e!==!0&&t!==null&&s!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Su(s){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,d=s.createBuffer();s.bindBuffer(l,d),s.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array!="undefined"&&c instanceof Float16Array)f=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(s.bindBuffer(c,o),u.length===0)s.bufferSubData(c,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],v=u[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,u[d]=v)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const v=u[f];s.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(s.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}var Mu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,bu=`#ifdef USE_ALPHAHASH
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
#endif`,Tu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Eu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Au=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,wu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ru=`#ifdef USE_AOMAP
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
#endif`,Cu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,qu=`#ifdef USE_BATCHING
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
#endif`,Pu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Iu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Lu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Nu=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Du=`#ifdef USE_IRIDESCENCE
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
#endif`,Fu=`#ifdef USE_BUMPMAP
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
#endif`,Uu=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Ou=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Bu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ku=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Gu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,zu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Vu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Hu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Wu=`#define PI 3.141592653589793
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
} // validated`,Xu=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Yu=`vec3 transformedNormal = objectNormal;
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
#endif`,Ku=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ju=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Zu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,$u=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Qu="gl_FragColor = linearToOutputTexel( gl_FragColor );",ju=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,ed=`#ifdef USE_ENVMAP
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
#endif`,td=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,nd=`#ifdef USE_ENVMAP
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
#endif`,id=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,sd=`#ifdef USE_ENVMAP
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
#endif`,rd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ad=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,od=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ld=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,cd=`#ifdef USE_GRADIENTMAP
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
}`,hd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ud=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,dd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,fd=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,pd=`#ifdef USE_ENVMAP
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
#endif`,md=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,gd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,_d=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,xd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,vd=`PhysicalMaterial material;
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
#endif`,yd=`uniform sampler2D dfgLUT;
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
}`,Sd=`
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
#endif`,Md=`#if defined( RE_IndirectDiffuse )
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
#endif`,bd=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Td=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Ed=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ad=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Rd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Cd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,qd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Pd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Id=`#if defined( USE_POINTS_UV )
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
#endif`,Ld=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Nd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Dd=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Fd=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ud=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Od=`#ifdef USE_MORPHTARGETS
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
#endif`,Bd=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,kd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Gd=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,zd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Vd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Hd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Wd=`#ifdef USE_NORMALMAP
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
#endif`,Xd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Yd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Kd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Jd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Zd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,$d=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Qd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,jd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ef=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,tf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,nf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,sf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,rf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,af=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,of=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,lf=`float getShadowMask() {
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
}`,cf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,hf=`#ifdef USE_SKINNING
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
#endif`,uf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,df=`#ifdef USE_SKINNING
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
#endif`,ff=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,pf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,mf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,gf=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,_f=`#ifdef USE_TRANSMISSION
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
#endif`,xf=`#ifdef USE_TRANSMISSION
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
#endif`,vf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,yf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Sf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Mf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Qe={alphahash_fragment:Mu,alphahash_pars_fragment:bu,alphamap_fragment:Tu,alphamap_pars_fragment:Eu,alphatest_fragment:Au,alphatest_pars_fragment:wu,aomap_fragment:Ru,aomap_pars_fragment:Cu,batching_pars_vertex:qu,batching_vertex:Pu,begin_vertex:Iu,beginnormal_vertex:Lu,bsdfs:Nu,iridescence_fragment:Du,bumpmap_pars_fragment:Fu,clipping_planes_fragment:Uu,clipping_planes_pars_fragment:Ou,clipping_planes_pars_vertex:Bu,clipping_planes_vertex:ku,color_fragment:Gu,color_pars_fragment:zu,color_pars_vertex:Vu,color_vertex:Hu,common:Wu,cube_uv_reflection_fragment:Xu,defaultnormal_vertex:Yu,displacementmap_pars_vertex:Ku,displacementmap_vertex:Ju,emissivemap_fragment:Zu,emissivemap_pars_fragment:$u,colorspace_fragment:Qu,colorspace_pars_fragment:ju,envmap_fragment:ed,envmap_common_pars_fragment:td,envmap_pars_fragment:nd,envmap_pars_vertex:id,envmap_physical_pars_fragment:pd,envmap_vertex:sd,fog_vertex:rd,fog_pars_vertex:ad,fog_fragment:od,fog_pars_fragment:ld,gradientmap_pars_fragment:cd,lightmap_pars_fragment:hd,lights_lambert_fragment:ud,lights_lambert_pars_fragment:dd,lights_pars_begin:fd,lights_toon_fragment:md,lights_toon_pars_fragment:gd,lights_phong_fragment:_d,lights_phong_pars_fragment:xd,lights_physical_fragment:vd,lights_physical_pars_fragment:yd,lights_fragment_begin:Sd,lights_fragment_maps:Md,lights_fragment_end:bd,lightprobes_pars_fragment:Td,logdepthbuf_fragment:Ed,logdepthbuf_pars_fragment:Ad,logdepthbuf_pars_vertex:wd,logdepthbuf_vertex:Rd,map_fragment:Cd,map_pars_fragment:qd,map_particle_fragment:Pd,map_particle_pars_fragment:Id,metalnessmap_fragment:Ld,metalnessmap_pars_fragment:Nd,morphinstance_vertex:Dd,morphcolor_vertex:Fd,morphnormal_vertex:Ud,morphtarget_pars_vertex:Od,morphtarget_vertex:Bd,normal_fragment_begin:kd,normal_fragment_maps:Gd,normal_pars_fragment:zd,normal_pars_vertex:Vd,normal_vertex:Hd,normalmap_pars_fragment:Wd,clearcoat_normal_fragment_begin:Xd,clearcoat_normal_fragment_maps:Yd,clearcoat_pars_fragment:Kd,iridescence_pars_fragment:Jd,opaque_fragment:Zd,packing:$d,premultiplied_alpha_fragment:Qd,project_vertex:jd,dithering_fragment:ef,dithering_pars_fragment:tf,roughnessmap_fragment:nf,roughnessmap_pars_fragment:sf,shadowmap_pars_fragment:rf,shadowmap_pars_vertex:af,shadowmap_vertex:of,shadowmask_pars_fragment:lf,skinbase_vertex:cf,skinning_pars_vertex:hf,skinning_vertex:uf,skinnormal_vertex:df,specularmap_fragment:ff,specularmap_pars_fragment:pf,tonemapping_fragment:mf,tonemapping_pars_fragment:gf,transmission_fragment:_f,transmission_pars_fragment:xf,uv_pars_fragment:vf,uv_pars_vertex:yf,uv_vertex:Sf,worldpos_vertex:Mf,background_vert:`varying vec2 vUv;
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
}`},we={common:{diffuse:{value:new We(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ve}},envmap:{envMap:{value:null},envMapRotation:{value:new Ve},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ve}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ve}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ve},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ve},normalScale:{value:new fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ve},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ve}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ve}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ve}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new We(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new U},probesMax:{value:new U},probesResolution:{value:new U}},points:{diffuse:{value:new We(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0},uvTransform:{value:new Ve}},sprite:{diffuse:{value:new We(16777215)},opacity:{value:1},center:{value:new fe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}}},fn={basic:{uniforms:Dt([we.common,we.specularmap,we.envmap,we.aomap,we.lightmap,we.fog]),vertexShader:Qe.meshbasic_vert,fragmentShader:Qe.meshbasic_frag},lambert:{uniforms:Dt([we.common,we.specularmap,we.envmap,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.fog,we.lights,{emissive:{value:new We(0)},envMapIntensity:{value:1}}]),vertexShader:Qe.meshlambert_vert,fragmentShader:Qe.meshlambert_frag},phong:{uniforms:Dt([we.common,we.specularmap,we.envmap,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.fog,we.lights,{emissive:{value:new We(0)},specular:{value:new We(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Qe.meshphong_vert,fragmentShader:Qe.meshphong_frag},standard:{uniforms:Dt([we.common,we.envmap,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.roughnessmap,we.metalnessmap,we.fog,we.lights,{emissive:{value:new We(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Qe.meshphysical_vert,fragmentShader:Qe.meshphysical_frag},toon:{uniforms:Dt([we.common,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.gradientmap,we.fog,we.lights,{emissive:{value:new We(0)}}]),vertexShader:Qe.meshtoon_vert,fragmentShader:Qe.meshtoon_frag},matcap:{uniforms:Dt([we.common,we.bumpmap,we.normalmap,we.displacementmap,we.fog,{matcap:{value:null}}]),vertexShader:Qe.meshmatcap_vert,fragmentShader:Qe.meshmatcap_frag},points:{uniforms:Dt([we.points,we.fog]),vertexShader:Qe.points_vert,fragmentShader:Qe.points_frag},dashed:{uniforms:Dt([we.common,we.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Qe.linedashed_vert,fragmentShader:Qe.linedashed_frag},depth:{uniforms:Dt([we.common,we.displacementmap]),vertexShader:Qe.depth_vert,fragmentShader:Qe.depth_frag},normal:{uniforms:Dt([we.common,we.bumpmap,we.normalmap,we.displacementmap,{opacity:{value:1}}]),vertexShader:Qe.meshnormal_vert,fragmentShader:Qe.meshnormal_frag},sprite:{uniforms:Dt([we.sprite,we.fog]),vertexShader:Qe.sprite_vert,fragmentShader:Qe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ve},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Qe.background_vert,fragmentShader:Qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ve}},vertexShader:Qe.backgroundCube_vert,fragmentShader:Qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Qe.cube_vert,fragmentShader:Qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Qe.equirect_vert,fragmentShader:Qe.equirect_frag},distance:{uniforms:Dt([we.common,we.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Qe.distance_vert,fragmentShader:Qe.distance_frag},shadow:{uniforms:Dt([we.lights,we.fog,{color:{value:new We(0)},opacity:{value:1}}]),vertexShader:Qe.shadow_vert,fragmentShader:Qe.shadow_frag}};fn.physical={uniforms:Dt([fn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ve},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ve},clearcoatNormalScale:{value:new fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ve},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ve},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ve},sheen:{value:0},sheenColor:{value:new We(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ve},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ve},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ve},transmissionSamplerSize:{value:new fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ve},attenuationDistance:{value:0},attenuationColor:{value:new We(0)},specularColor:{value:new We(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ve},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ve},anisotropyVector:{value:new fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ve}}]),vertexShader:Qe.meshphysical_vert,fragmentShader:Qe.meshphysical_frag};const Ks={r:0,b:0,g:0},bf=new $e,jo=new Ve;jo.set(-1,0,0,0,1,0,0,0,1);function Tf(s,e,t,n,i,r){const a=new We(0);let o=i===!0?0:1,l,c,h=null,u=0,d=null;function f(M){let A=M.isScene===!0?M.background:null;if(A&&A.isTexture){const _=M.backgroundBlurriness>0;A=e.get(A,_)}return A}function g(M){let A=!1;const _=f(M);_===null?m(a,o):_&&_.isColor&&(m(_,1),A=!0);const b=s.xr.getEnvironmentBlendMode();b==="additive"?t.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(s.autoClear||A)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function v(M,A){const _=f(A);_&&(_.isCubeTexture||_.mapping===306)?(c===void 0&&(c=new tt(new Xn(1,1,1),new un({name:"BackgroundCubeMaterial",uniforms:pi(fn.backgroundCube.uniforms),vertexShader:fn.backgroundCube.vertexShader,fragmentShader:fn.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,T,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=_,c.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(bf.makeRotationFromEuler(A.backgroundRotation)).transpose(),_.isCubeTexture&&_.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(jo),c.material.toneMapped=it.getTransfer(_.colorSpace)!==ht,(h!==_||u!==_.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,h=_,u=_.version,d=s.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new tt(new Zi(2,2),new un({name:"BackgroundMaterial",uniforms:pi(fn.background.uniforms),vertexShader:fn.background.vertexShader,fragmentShader:fn.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.toneMapped=it.getTransfer(_.colorSpace)!==ht,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(h!==_||u!==_.version||d!==s.toneMapping)&&(l.material.needsUpdate=!0,h=_,u=_.version,d=s.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function m(M,A){M.getRGB(Ks,No(s)),t.buffers.color.setClear(Ks.r,Ks.g,Ks.b,A,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,A=1){a.set(M),o=A,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,m(a,o)},render:g,addToRenderList:v,dispose:p}}function Ef(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null);let r=i,a=!1;function o(O,B,J,G,Z){let re=!1;const $=u(O,G,J,B);r!==$&&(r=$,c(r.object)),re=f(O,G,J,Z),re&&g(O,G,J,Z),Z!==null&&e.update(Z,s.ELEMENT_ARRAY_BUFFER),(re||a)&&(a=!1,_(O,B,J,G),Z!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(Z).buffer))}function l(){return s.createVertexArray()}function c(O){return s.bindVertexArray(O)}function h(O){return s.deleteVertexArray(O)}function u(O,B,J,G){const Z=G.wireframe===!0;let re=n[B.id];re===void 0&&(re={},n[B.id]=re);const $=O.isInstancedMesh===!0?O.id:0;let z=re[$];z===void 0&&(z={},re[$]=z);let Q=z[J.id];Q===void 0&&(Q={},z[J.id]=Q);let ie=Q[Z];return ie===void 0&&(ie=d(l()),Q[Z]=ie),ie}function d(O){const B=[],J=[],G=[];for(let Z=0;Z<t;Z++)B[Z]=0,J[Z]=0,G[Z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:J,attributeDivisors:G,object:O,attributes:{},index:null}}function f(O,B,J,G){const Z=r.attributes,re=B.attributes;let $=0;const z=J.getAttributes();for(const Q in z)if(z[Q].location>=0){const oe=Z[Q];let Se=re[Q];if(Se===void 0&&(Q==="instanceMatrix"&&O.instanceMatrix&&(Se=O.instanceMatrix),Q==="instanceColor"&&O.instanceColor&&(Se=O.instanceColor)),oe===void 0||oe.attribute!==Se||Se&&oe.data!==Se.data)return!0;$++}return r.attributesNum!==$||r.index!==G}function g(O,B,J,G){const Z={},re=B.attributes;let $=0;const z=J.getAttributes();for(const Q in z)if(z[Q].location>=0){let oe=re[Q];oe===void 0&&(Q==="instanceMatrix"&&O.instanceMatrix&&(oe=O.instanceMatrix),Q==="instanceColor"&&O.instanceColor&&(oe=O.instanceColor));const Se={};Se.attribute=oe,oe&&oe.data&&(Se.data=oe.data),Z[Q]=Se,$++}r.attributes=Z,r.attributesNum=$,r.index=G}function v(){const O=r.newAttributes;for(let B=0,J=O.length;B<J;B++)O[B]=0}function m(O){p(O,0)}function p(O,B){const J=r.newAttributes,G=r.enabledAttributes,Z=r.attributeDivisors;J[O]=1,G[O]===0&&(s.enableVertexAttribArray(O),G[O]=1),Z[O]!==B&&(s.vertexAttribDivisor(O,B),Z[O]=B)}function M(){const O=r.newAttributes,B=r.enabledAttributes;for(let J=0,G=B.length;J<G;J++)B[J]!==O[J]&&(s.disableVertexAttribArray(J),B[J]=0)}function A(O,B,J,G,Z,re,$){$===!0?s.vertexAttribIPointer(O,B,J,Z,re):s.vertexAttribPointer(O,B,J,G,Z,re)}function _(O,B,J,G){v();const Z=G.attributes,re=J.getAttributes(),$=B.defaultAttributeValues;for(const z in re){const Q=re[z];if(Q.location>=0){let ie=Z[z];if(ie===void 0&&(z==="instanceMatrix"&&O.instanceMatrix&&(ie=O.instanceMatrix),z==="instanceColor"&&O.instanceColor&&(ie=O.instanceColor)),ie!==void 0){const oe=ie.normalized,Se=ie.itemSize,be=e.get(ie);if(be===void 0)continue;const Ye=be.buffer,He=be.type,Je=be.bytesPerElement,D=He===s.INT||He===s.UNSIGNED_INT||ie.gpuType===1013;if(ie.isInterleavedBufferAttribute){const N=ie.data,L=N.stride,P=ie.offset;if(N.isInstancedInterleavedBuffer){for(let k=0;k<Q.locationSize;k++)p(Q.location+k,N.meshPerAttribute);O.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=N.meshPerAttribute*N.count)}else for(let k=0;k<Q.locationSize;k++)m(Q.location+k);s.bindBuffer(s.ARRAY_BUFFER,Ye);for(let k=0;k<Q.locationSize;k++)A(Q.location+k,Se/Q.locationSize,He,oe,L*Je,(P+Se/Q.locationSize*k)*Je,D)}else{if(ie.isInstancedBufferAttribute){for(let N=0;N<Q.locationSize;N++)p(Q.location+N,ie.meshPerAttribute);O.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let N=0;N<Q.locationSize;N++)m(Q.location+N);s.bindBuffer(s.ARRAY_BUFFER,Ye);for(let N=0;N<Q.locationSize;N++)A(Q.location+N,Se/Q.locationSize,He,oe,Se*Je,Se/Q.locationSize*N*Je,D)}}else if($!==void 0){const oe=$[z];if(oe!==void 0)switch(oe.length){case 2:s.vertexAttrib2fv(Q.location,oe);break;case 3:s.vertexAttrib3fv(Q.location,oe);break;case 4:s.vertexAttrib4fv(Q.location,oe);break;default:s.vertexAttrib1fv(Q.location,oe)}}}}M()}function b(){w();for(const O in n){const B=n[O];for(const J in B){const G=B[J];for(const Z in G){const re=G[Z];for(const $ in re)h(re[$].object),delete re[$];delete G[Z]}}delete n[O]}}function T(O){if(n[O.id]===void 0)return;const B=n[O.id];for(const J in B){const G=B[J];for(const Z in G){const re=G[Z];for(const $ in re)h(re[$].object),delete re[$];delete G[Z]}}delete n[O.id]}function R(O){for(const B in n){const J=n[B];for(const G in J){const Z=J[G];if(Z[O.id]===void 0)continue;const re=Z[O.id];for(const $ in re)h(re[$].object),delete re[$];delete Z[O.id]}}}function x(O){for(const B in n){const J=n[B],G=O.isInstancedMesh===!0?O.id:0,Z=J[G];if(Z!==void 0){for(const re in Z){const $=Z[re];for(const z in $)h($[z].object),delete $[z];delete Z[re]}delete J[G],Object.keys(J).length===0&&delete n[B]}}}function w(){I(),a=!0,r!==i&&(r=i,c(r.object))}function I(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:w,resetDefaultState:I,dispose:b,releaseStatesOfGeometry:T,releaseStatesOfObject:x,releaseStatesOfProgram:R,initAttributes:v,enableAttribute:m,disableUnusedAttributes:M}}function Af(s,e,t){let n;function i(l){n=l}function r(l,c){s.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(s.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];t.update(d,n,1)}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function wf(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(R){return!(R!==1023&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const x=R===1016&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==1009&&R!==1015&&!x&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function l(R){if(R==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Be("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&Be("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),M=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),A=s.getParameter(s.MAX_VARYING_VECTORS),_=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),b=s.getParameter(s.MAX_SAMPLES),T=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:M,maxVaryings:A,maxFragmentUniforms:_,maxSamples:b,samples:T}}function Rf(s){const e=this;let t=null,n=0,i=!1,r=!1;const a=new Ln,o=new Ve,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,p=s.get(u);if(!i||g===null||g.length===0||r&&!m)r?h(null):c();else{const M=r?0:n,A=M*4;let _=p.clippingState||null;l.value=_,_=h(g,d,A,f);for(let b=0;b!==A;++b)_[b]=t[b];p.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const p=f+v*4,M=d.matrixWorldInverse;o.getNormalMatrix(M),(m===null||m.length<p)&&(m=new Float32Array(p));for(let A=0,_=f;A!==v;++A,_+=4)a.copy(u[A]).applyMatrix4(M,o),a.normal.toArray(m,_),m[_+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}const Mi=4,Cf=6,qf=20,Pf=256,es=new Ys,el=new We;let na=null,ia=0,sa=0,ra=!1;const If=new U,Kn=new U;class aa{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,i=100,r={}){const{size:a=256,position:o=If}=r;na=this._renderer.getRenderTarget(),ia=this._renderer.getActiveCubeFace(),sa=this._renderer.getActiveMipmapLevel(),ra=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=il(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=nl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(na,ia,sa),this._renderer.xr.enabled=ra,e.scissorTest=!1,bi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),na=this._renderer.getRenderTarget(),ia=this._renderer.getActiveCubeFace(),sa=this._renderer.getActiveMipmapLevel(),ra=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:1006,minFilter:1006,generateMipmaps:!1,type:1016,format:1023,colorSpace:Bt,depthBuffer:!1},i=tl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=tl(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Lf(r)),this._blurMaterial=Df(r,e,t),this._ggxMaterial=Nf(r,e,t)}return i}_compileMaterial(e){const t=new tt(new yt,e);this._renderer.compile(t,es)}_sceneToCubeUV(e,t,n,i,r){const l=new Ft(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(el),u.toneMapping=0,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new tt(new Xn,new Wt({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,m=v.material;let p=!1;const M=e.background;M?M.isColor&&(m.color.copy(M),e.background=null,p=!0):(m.color.copy(el),p=!0);for(let A=0;A<6;A++){const _=A%3;_===0?(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[A],r.y,r.z)):_===1?(l.up.set(0,0,c[A]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[A],r.z)):(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[A]));const b=this._cubeSize;bi(i,_*b,A>2?b:0,b,b),u.setRenderTarget(i),p&&u.render(v,l),u.render(e,l)}u.toneMapping=f,u.autoClear=d,e.background=M}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===301||e.mapping===302;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=il()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=nl());const r=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;bi(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,es)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const i=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),d=c*1.25,f=u*d,{_lodMax:g}=this,v=this._sizeLods[n],m=3*v*(n>g-Mi?n-g+Mi:0),p=4*(this._cubeSize-v);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=g-t,bi(r,m,p,3*v,2*v),i.setRenderTarget(r),i.render(o,es),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,bi(e,m,p,3*v,2*v),i.setRenderTarget(e),i.render(o,es)}_blur(e,t,n,i){const r=this._pingPongRenderTarget,a=Math.min(i,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,a),this._blurPass(r,e,n,n,a)}_blurPass(e,t,n,i,r){const a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[i];l.material=o;const c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;const h=this._sizeLods[i],u=3*h*(i>this._lodMax-Mi?i-this._lodMax+Mi:0),d=4*(this._cubeSize-h);bi(t,u,d,3*h,2*h),a.setRenderTarget(t),a.render(l,es)}}function Lf(s){const e=[],t=[];let n=s;const i=s-Mi+1+Cf;for(let r=0;r<i;r++){const a=Math.pow(2,n);e.push(a);const o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],u=6,d=6,f=3,g=new Float32Array(f*d*u),v=new Float32Array(f*d*u);for(let p=0;p<u;p++){const M=p%3*2/3-1,A=p>2?0:-1,_=[M,A,0,M+2/3,A,0,M+2/3,A+1,0,M,A,0,M+2/3,A+1,0,M,A+1,0];g.set(_,f*d*p);for(let b=0;b<d;b++){const T=h[b*2]*2-1,R=h[b*2+1]*2-1;p===0?Kn.set(1,R,T):p===1?Kn.set(-T,1,-R):p===2?Kn.set(-T,R,1):p===3?Kn.set(-1,R,-T):p===4?Kn.set(-T,-1,R):Kn.set(T,R,-1),Kn.toArray(v,(p*d+b)*f)}}const m=new yt;m.setAttribute("position",new Ot(g,f)),m.setAttribute("outputDirection",new Ot(v,f)),t.push(new tt(m,null)),n>Mi&&n--}return{lodMeshes:t,sizeLods:e}}function tl(s,e,t){const n=new Qt(s,e,t);return n.texture.mapping=306,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function bi(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function Nf(s,e,t){return new un({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Pf,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Js(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function Df(s,e,t){return new un({name:"SphericalGaussianBlur",defines:{SAMPLES:qf,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Js(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function nl(){return new un({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Js(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function il(){return new un({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Js(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Js(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class sl extends Qt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new go(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Xn(5,5,5),r=new un({name:"CubemapFromEquirect",uniforms:pi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});r.uniforms.tEquirect.value=t;const a=new tt(i,r),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=1006),new ru(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}}function Ff(s){let e=new WeakMap,t=new WeakMap,n=null;function i(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){const f=d.mapping;if(f===303||f===304)if(e.has(d)){const g=e.get(d).texture;return o(g,d.mapping)}else{const g=d.image;if(g&&g.height>0){const v=new sl(g.height);return v.fromEquirectangularTexture(s,d),e.set(d,v),d.addEventListener("dispose",c),o(v.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){const f=d.mapping,g=f===303||f===304,v=f===301||f===302;if(g||v){let m=t.get(d);const p=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==p)return n===null&&(n=new aa(s)),m=g?n.fromEquirectangular(d,m):n.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),m.texture;if(m!==void 0)return m.texture;{const M=d.image;return g&&M&&M.height>0||v&&M&&l(M)?(n===null&&(n=new aa(s)),m=g?n.fromEquirectangular(d):n.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),d.addEventListener("dispose",h),m.texture):null}}}return d}function o(d,f){return f===303?d.mapping=301:f===304&&(d.mapping=302),d}function l(d){let f=0;const g=6;for(let v=0;v<g;v++)d[v]!==void 0&&f++;return f===g}function c(d){const f=d.target;f.removeEventListener("dispose",c);const g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function h(d){const f=d.target;f.removeEventListener("dispose",h);const g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:u}}function Uf(s){const e={};function t(n){if(e[n]!==void 0)return e[n];const i=s.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&Qn("WebGLRenderer: "+n+" extension not supported."),i}}}function Of(s,e,t,n){const i={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete i[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return i[d.id]===!0||(d.addEventListener("dispose",a),i[d.id]=!0,t.memory.geometries++),d}function l(u){const d=u.attributes;for(const f in d)e.update(d[f],s.ARRAY_BUFFER)}function c(u){const d=[],f=u.index,g=u.attributes.position;let v=0;if(g===void 0)return;if(f!==null){const M=f.array;v=f.version;for(let A=0,_=M.length;A<_;A+=3){const b=M[A+0],T=M[A+1],R=M[A+2];d.push(b,T,T,R,R,b)}}else{const M=g.array;v=g.version;for(let A=0,_=M.length/3-1;A<_;A+=3){const b=A+0,T=A+1,R=A+2;d.push(b,T,T,R,R,b)}}const m=new(g.count>=65535?Ka:Ya)(d,1);m.version=v;const p=r.get(u);p&&e.remove(p),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function Bf(s,e,t){let n;function i(u){n=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,d){s.drawElements(n,d,r,u*a),t.update(d,n,1)}function c(u,d,f){f!==0&&(s.drawElementsInstanced(n,d,r,u*a,f),t.update(d,n,f))}function h(u,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,u,0,f);let v=0;for(let m=0;m<f;m++)v+=d[m];t.update(v,n,1)}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function kf(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:Ke("WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Gf(s,e,t){const n=new WeakMap,i=new dt;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let w=function(){R.dispose(),n.delete(o),o.removeEventListener("dispose",w)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let A=0;f===!0&&(A=1),g===!0&&(A=2),v===!0&&(A=3);let _=o.attributes.position.count*A,b=1;_>e.maxTextureSize&&(b=Math.ceil(_/e.maxTextureSize),_=e.maxTextureSize);const T=new Float32Array(_*b*4*u),R=new Da(T,_,b,u);R.type=1015,R.needsUpdate=!0;const x=A*4;for(let I=0;I<u;I++){const O=m[I],B=p[I],J=M[I],G=_*b*4*I;for(let Z=0;Z<O.count;Z++){const re=Z*x;f===!0&&(i.fromBufferAttribute(O,Z),T[G+re+0]=i.x,T[G+re+1]=i.y,T[G+re+2]=i.z,T[G+re+3]=0),g===!0&&(i.fromBufferAttribute(B,Z),T[G+re+4]=i.x,T[G+re+5]=i.y,T[G+re+6]=i.z,T[G+re+7]=0),v===!0&&(i.fromBufferAttribute(J,Z),T[G+re+8]=i.x,T[G+re+9]=i.y,T[G+re+10]=i.z,T[G+re+11]=J.itemSize===4?i.w:1)}}d={count:u,texture:R,size:new fe(_,b)},n.set(o,d),o.addEventListener("dispose",w)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];const g=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(s,"morphTargetBaseInfluence",g),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function zf(s,e,t,n,i){let r=new WeakMap;function a(c){const h=i.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const Vf={1:"LINEAR_TONE_MAPPING",2:"REINHARD_TONE_MAPPING",3:"CINEON_TONE_MAPPING",4:"ACES_FILMIC_TONE_MAPPING",6:"AGX_TONE_MAPPING",7:"NEUTRAL_TONE_MAPPING",5:"CUSTOM_TONE_MAPPING"};function Hf(s,e,t,n,i,r){const a=new Qt(e,t,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null;const c=new yt;c.setAttribute("position",new st([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new st([0,2,0,0,2,0],2));const h=new Dh({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),u=new tt(c,h),d=new Ys(-1,1,1,-1,0,1);let f=null,g=null,v=!1,m,p=null,M=[],A=!1;this.setSize=function(_,b){a.setSize(_,b),o!==null&&o.setSize(_,b),l!==null&&l.setSize(_,b);for(let T=0;T<M.length;T++){const R=M[T];R.setSize&&R.setSize(_,b)}},this.setEffects=function(_){M=_,A=M.length>0&&M[0].isRenderPass===!0;const b=a.width,T=a.height;M.length>0&&o===null&&(o=new Qt(b,T,{type:1016,depthBuffer:!1,stencilBuffer:!1}),l=new Qt(b,T,{type:1016,depthBuffer:!1,stencilBuffer:!1}));for(let R=0;R<M.length;R++){const x=M[R];x.setSize&&x.setSize(b,T)}},this.begin=function(_,b){if(v||_.toneMapping===0&&M.length===0)return!1;if(p=b,b!==null){const T=b.width,R=b.height;(a.width!==T||a.height!==R)&&this.setSize(T,R)}return A===!1&&_.setRenderTarget(a),m=_.toneMapping,_.toneMapping=0,!0},this.hasRenderPass=function(){return A},this.end=function(_,b){_.toneMapping=m,v=!0;let T=a,R=o;for(let x=0;x<M.length;x++){const w=M[x];w.enabled!==!1&&(w.render(_,R,T,b),w.needsSwap!==!1&&(T=R,R=R===o?l:o))}if(f!==_.outputColorSpace||g!==_.toneMapping){f=_.outputColorSpace,g=_.toneMapping,h.defines={},it.getTransfer(f)===ht&&(h.defines.SRGB_TRANSFER="");const x=Vf[g];x&&(h.defines[x]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=T.texture,_.setRenderTarget(p),_.render(u,d),p=null,v=!1},this.isCompositing=function(){return v},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}const rl=new Tt,oa=new zi(1,1),al=new Da,ol=new Ec,ll=new go,cl=[],hl=[],ul=new Float32Array(16),dl=new Float32Array(9),fl=new Float32Array(4);function Ti(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=cl[i];if(r===void 0&&(r=new Float32Array(i),cl[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function wt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function Rt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Zs(s,e){let t=hl[e];t===void 0&&(t=new Int32Array(e),hl[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function Wf(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function Xf(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;s.uniform2fv(this.addr,e),Rt(t,e)}}function Yf(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(wt(t,e))return;s.uniform3fv(this.addr,e),Rt(t,e)}}function Kf(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;s.uniform4fv(this.addr,e),Rt(t,e)}}function Jf(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(wt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Rt(t,e)}else{if(wt(t,n))return;fl.set(n),s.uniformMatrix2fv(this.addr,!1,fl),Rt(t,n)}}function Zf(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(wt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Rt(t,e)}else{if(wt(t,n))return;dl.set(n),s.uniformMatrix3fv(this.addr,!1,dl),Rt(t,n)}}function $f(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(wt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Rt(t,e)}else{if(wt(t,n))return;ul.set(n),s.uniformMatrix4fv(this.addr,!1,ul),Rt(t,n)}}function Qf(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function jf(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;s.uniform2iv(this.addr,e),Rt(t,e)}}function e1(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(wt(t,e))return;s.uniform3iv(this.addr,e),Rt(t,e)}}function t1(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;s.uniform4iv(this.addr,e),Rt(t,e)}}function n1(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function i1(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;s.uniform2uiv(this.addr,e),Rt(t,e)}}function s1(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(wt(t,e))return;s.uniform3uiv(this.addr,e),Rt(t,e)}}function r1(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;s.uniform4uiv(this.addr,e),Rt(t,e)}}function a1(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(oa.compareFunction=t.isReversedDepthBuffer()?518:515,r=oa):r=rl,t.setTexture2D(e||r,i)}function o1(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||ol,i)}function l1(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||ll,i)}function c1(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||al,i)}function h1(s){switch(s){case 5126:return Wf;case 35664:return Xf;case 35665:return Yf;case 35666:return Kf;case 35674:return Jf;case 35675:return Zf;case 35676:return $f;case 5124:case 35670:return Qf;case 35667:case 35671:return jf;case 35668:case 35672:return e1;case 35669:case 35673:return t1;case 5125:return n1;case 36294:return i1;case 36295:return s1;case 36296:return r1;case 35678:case 36198:case 36298:case 36306:case 35682:return a1;case 35679:case 36299:case 36307:return o1;case 35680:case 36300:case 36308:case 36293:return l1;case 36289:case 36303:case 36311:case 36292:return c1}}function u1(s,e){s.uniform1fv(this.addr,e)}function d1(s,e){const t=Ti(e,this.size,2);s.uniform2fv(this.addr,t)}function f1(s,e){const t=Ti(e,this.size,3);s.uniform3fv(this.addr,t)}function p1(s,e){const t=Ti(e,this.size,4);s.uniform4fv(this.addr,t)}function m1(s,e){const t=Ti(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function g1(s,e){const t=Ti(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function _1(s,e){const t=Ti(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function x1(s,e){s.uniform1iv(this.addr,e)}function v1(s,e){s.uniform2iv(this.addr,e)}function y1(s,e){s.uniform3iv(this.addr,e)}function S1(s,e){s.uniform4iv(this.addr,e)}function M1(s,e){s.uniform1uiv(this.addr,e)}function b1(s,e){s.uniform2uiv(this.addr,e)}function T1(s,e){s.uniform3uiv(this.addr,e)}function E1(s,e){s.uniform4uiv(this.addr,e)}function A1(s,e,t){const n=this.cache,i=e.length,r=Zs(t,i);wt(n,r)||(s.uniform1iv(this.addr,r),Rt(n,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=oa:a=rl;for(let o=0;o!==i;++o)t.setTexture2D(e[o]||a,r[o])}function w1(s,e,t){const n=this.cache,i=e.length,r=Zs(t,i);wt(n,r)||(s.uniform1iv(this.addr,r),Rt(n,r));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||ol,r[a])}function R1(s,e,t){const n=this.cache,i=e.length,r=Zs(t,i);wt(n,r)||(s.uniform1iv(this.addr,r),Rt(n,r));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||ll,r[a])}function C1(s,e,t){const n=this.cache,i=e.length,r=Zs(t,i);wt(n,r)||(s.uniform1iv(this.addr,r),Rt(n,r));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||al,r[a])}function q1(s){switch(s){case 5126:return u1;case 35664:return d1;case 35665:return f1;case 35666:return p1;case 35674:return m1;case 35675:return g1;case 35676:return _1;case 5124:case 35670:return x1;case 35667:case 35671:return v1;case 35668:case 35672:return y1;case 35669:case 35673:return S1;case 5125:return M1;case 36294:return b1;case 36295:return T1;case 36296:return E1;case 35678:case 36198:case 36298:case 36306:case 35682:return A1;case 35679:case 36299:case 36307:return w1;case 35680:case 36300:case 36308:case 36293:return R1;case 36289:case 36303:case 36311:case 36292:return C1}}class P1{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=h1(t.type)}}class I1{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=q1(t.type)}}class L1{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(e,t[o.id],n)}}}const la=/(\w+)(\])?(\[|\.)?/g;function pl(s,e){s.seq.push(e),s.map[e.id]=e}function N1(s,e,t){const n=s.name,i=n.length;for(la.lastIndex=0;;){const r=la.exec(n),a=la.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){pl(t,c===void 0?new P1(o,s,e):new I1(o,s,e));break}else{let u=t.map[o];u===void 0&&(u=new L1(o),pl(t,u)),t=u}}}class $s{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);N1(o,l,this)}const i=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(a):r.push(a);i.length>0&&(this.seq=i.concat(r))}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function ml(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const D1=37297;let F1=0;function U1(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const gl=new Ve;function O1(s){it._getMatrix(gl,it.workingColorSpace,s);const e=`mat3( ${gl.elements.map(t=>t.toFixed(4))} )`;switch(it.getTransfer(s)){case ls:return[e,"LinearTransferOETF"];case ht:return[e,"sRGBTransferOETF"];default:return Be("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function _l(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+U1(s.getShaderSource(e),o)}else return r}function B1(s,e){const t=O1(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const k1={1:"Linear",2:"Reinhard",3:"Cineon",4:"ACESFilmic",6:"AgX",7:"Neutral",5:"Custom"};function G1(s,e){const t=k1[e];return t===void 0?(Be("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Qs=new U;function z1(){it.getLuminanceCoefficients(Qs);const s=Qs.x.toFixed(4),e=Qs.y.toFixed(4),t=Qs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function V1(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ts).join(`
`)}function H1(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function W1(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function ts(s){return s!==""}function xl(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function vl(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const X1=/^[ \t]*#include +<([\w\d./]+)>/gm;function ca(s){return s.replace(X1,K1)}const Y1=new Map;function K1(s,e){let t=Qe[e];if(t===void 0){const n=Y1.get(e);if(n!==void 0)t=Qe[n],Be('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return ca(t)}const J1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function yl(s){return s.replace(J1,Z1)}function Z1(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Sl(s){let e=`precision ${s.precision} float;
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
#define LOW_PRECISION`),e}const $1={1:"SHADOWMAP_TYPE_PCF",3:"SHADOWMAP_TYPE_VSM"};function Q1(s){return $1[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const j1={301:"ENVMAP_TYPE_CUBE",302:"ENVMAP_TYPE_CUBE",306:"ENVMAP_TYPE_CUBE_UV"};function ep(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":j1[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const tp={302:"ENVMAP_MODE_REFRACTION"};function np(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":tp[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const ip={0:"ENVMAP_BLENDING_MULTIPLY",1:"ENVMAP_BLENDING_MIX",2:"ENVMAP_BLENDING_ADD"};function sp(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":ip[s.combine]||"ENVMAP_BLENDING_NONE"}function rp(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function ap(s,e,t,n){const i=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Q1(t),c=ep(t),h=np(t),u=sp(t),d=rp(t),f=V1(t),g=H1(r),v=i.createProgram();let m,p,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ts).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ts).join(`
`),p.length>0&&(p+=`
`)):(m=[Sl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ts).join(`
`),p=[Sl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==0?"#define TONE_MAPPING":"",t.toneMapping!==0?Qe.tonemapping_pars_fragment:"",t.toneMapping!==0?G1("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Qe.colorspace_pars_fragment,B1("linearToOutputTexel",t.outputColorSpace),z1(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ts).join(`
`)),a=ca(a),a=xl(a,t),a=vl(a,t),o=ca(o),o=xl(o,t),o=vl(o,t),a=yl(a),o=yl(o),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Ra?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ra?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const A=M+m+a,_=M+p+o,b=ml(i,i.VERTEX_SHADER,A),T=ml(i,i.FRAGMENT_SHADER,_);i.attachShader(v,b),i.attachShader(v,T),t.index0AttributeName!==void 0?i.bindAttribLocation(v,0,t.index0AttributeName):t.hasPositionAttribute===!0&&i.bindAttribLocation(v,0,"position"),i.linkProgram(v);function R(O){if(s.debug.checkShaderErrors){const B=i.getProgramInfoLog(v)||"",J=i.getShaderInfoLog(b)||"",G=i.getShaderInfoLog(T)||"",Z=B.trim(),re=J.trim(),$=G.trim();let z=!0,Q=!0;if(i.getProgramParameter(v,i.LINK_STATUS)===!1)if(z=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,v,b,T);else{const ie=_l(i,b,"vertex"),oe=_l(i,T,"fragment");Ke("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(v,i.VALIDATE_STATUS)+`

Material Name: `+O.name+`
Material Type: `+O.type+`

Program Info Log: `+Z+`
`+ie+`
`+oe)}else Z!==""?Be("WebGLProgram: Program Info Log:",Z):(re===""||$==="")&&(Q=!1);Q&&(O.diagnostics={runnable:z,programLog:Z,vertexShader:{log:re,prefix:m},fragmentShader:{log:$,prefix:p}})}i.deleteShader(b),i.deleteShader(T),x=new $s(i,v),w=W1(i,v)}let x;this.getUniforms=function(){return x===void 0&&R(this),x};let w;this.getAttributes=function(){return w===void 0&&R(this),w};let I=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=i.getProgramParameter(v,D1)),I},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=F1++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=b,this.fragmentShader=T,this}let op=0;class lp{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const i=this._getShaderCacheForMaterial(e);return i.has(t)===!1&&(i.add(t),t.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new cp(e),t.set(e,n)),n}}class cp{constructor(e){this.id=op++,this.code=e,this.usedTimes=0}}function hp(s){return s===1030||s===37490||s===36285}function up(s,e,t,n,i,r){const a=new Oa,o=new lp,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer;let d=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return l.add(x),x===0?"uv":`uv${x}`}function v(x,w,I,O,B,J){const G=O.fog,Z=B.geometry,re=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?O.environment:null,$=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,z=e.get(x.envMap||re,$),Q=z&&z.mapping===306?z.image.height:null,ie=f[x.type];x.precision!==null&&(d=n.getMaxPrecision(x.precision),d!==x.precision&&Be("WebGLProgram.getParameters:",x.precision,"not supported, using",d,"instead."));const oe=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,Se=oe!==void 0?oe.length:0;let be=0;Z.morphAttributes.position!==void 0&&(be=1),Z.morphAttributes.normal!==void 0&&(be=2),Z.morphAttributes.color!==void 0&&(be=3);let Ye,He,Je,D;if(ie){const mt=fn[ie];Ye=mt.vertexShader,He=mt.fragmentShader}else{Ye=x.vertexShader,He=x.fragmentShader;const mt=o.getVertexShaderStage(x),lt=o.getFragmentShaderStage(x);o.update(x,mt,lt),Je=mt.id,D=lt.id}const N=s.getRenderTarget(),L=s.state.buffers.depth.getReversed(),P=B.isInstancedMesh===!0,k=B.isBatchedMesh===!0,se=!!x.map,_e=!!x.matcap,C=!!z,V=!!x.aoMap,F=!!x.lightMap,K=!!x.bumpMap&&x.wireframe===!1,j=!!x.normalMap,ce=!!x.displacementMap,me=!!x.emissiveMap,pe=!!x.metalnessMap,Y=!!x.roughnessMap,S=x.anisotropy>0,Re=x.clearcoat>0,Ne=x.dispersion>0,q=x.retroreflectivity>0,y=x.iridescence>0,X=x.sheen>0,ee=x.transmission>0,le=S&&!!x.anisotropyMap,xe=Re&&!!x.clearcoatMap,ve=Re&&!!x.clearcoatNormalMap,he=Re&&!!x.clearcoatRoughnessMap,ue=y&&!!x.iridescenceMap,ye=y&&!!x.iridescenceThicknessMap,Ue=X&&!!x.sheenColorMap,Te=X&&!!x.sheenRoughnessMap,Me=!!x.specularMap,Ge=!!x.specularColorMap,Xe=!!x.specularIntensityMap,Ze=ee&&!!x.transmissionMap,W=ee&&!!x.thicknessMap,Ee=!!x.gradientMap,de=!!x.alphaMap,Ae=x.alphaTest>0,Pe=!!x.alphaHash,ge=!!x.extensions;let ze=0;x.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(ze=s.toneMapping);const Oe={shaderID:ie,shaderType:x.type,shaderName:x.name,vertexShader:Ye,fragmentShader:He,defines:x.defines,customVertexShaderID:Je,customFragmentShaderID:D,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:d,batching:k,batchingColor:k&&B._colorsTexture!==null,instancing:P,instancingColor:P&&B.instanceColor!==null,instancingMorph:P&&B.morphTexture!==null,outputColorSpace:N===null?s.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:it.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:se,matcap:_e,envMap:C,envMapMode:C&&z.mapping,envMapCubeUVHeight:Q,aoMap:V,lightMap:F,bumpMap:K,normalMap:j,displacementMap:ce,emissiveMap:me,normalMapObjectSpace:j&&x.normalMapType===1,normalMapTangentSpace:j&&x.normalMapType===0,packedNormalMap:j&&x.normalMapType===0&&hp(x.normalMap.format),metalnessMap:pe,roughnessMap:Y,anisotropy:S,anisotropyMap:le,clearcoat:Re,clearcoatMap:xe,clearcoatNormalMap:ve,clearcoatRoughnessMap:he,dispersion:Ne,retroreflection:q,iridescence:y,iridescenceMap:ue,iridescenceThicknessMap:ye,sheen:X,sheenColorMap:Ue,sheenRoughnessMap:Te,specularMap:Me,specularColorMap:Ge,specularIntensityMap:Xe,transmission:ee,transmissionMap:Ze,thicknessMap:W,gradientMap:Ee,opaque:x.transparent===!1&&x.blending===1&&x.alphaToCoverage===!1,alphaMap:de,alphaTest:Ae,alphaHash:Pe,combine:x.combine,mapUv:se&&g(x.map.channel),aoMapUv:V&&g(x.aoMap.channel),lightMapUv:F&&g(x.lightMap.channel),bumpMapUv:K&&g(x.bumpMap.channel),normalMapUv:j&&g(x.normalMap.channel),displacementMapUv:ce&&g(x.displacementMap.channel),emissiveMapUv:me&&g(x.emissiveMap.channel),metalnessMapUv:pe&&g(x.metalnessMap.channel),roughnessMapUv:Y&&g(x.roughnessMap.channel),anisotropyMapUv:le&&g(x.anisotropyMap.channel),clearcoatMapUv:xe&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:ve&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:he&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:ue&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:ye&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:Ue&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:Te&&g(x.sheenRoughnessMap.channel),specularMapUv:Me&&g(x.specularMap.channel),specularColorMapUv:Ge&&g(x.specularColorMap.channel),specularIntensityMapUv:Xe&&g(x.specularIntensityMap.channel),transmissionMapUv:Ze&&g(x.transmissionMap.channel),thicknessMapUv:W&&g(x.thicknessMap.channel),alphaMapUv:de&&g(x.alphaMap.channel),vertexTangents:!!Z.attributes.tangent&&(j||S),vertexNormals:!!Z.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!Z.attributes.uv&&(se||de),fog:!!G,useFog:x.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||Z.attributes.normal===void 0&&j===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:L,skinning:B.isSkinnedMesh===!0,hasPositionAttribute:Z.attributes.position!==void 0,morphTargets:Z.morphAttributes.position!==void 0,morphNormals:Z.morphAttributes.normal!==void 0,morphColors:Z.morphAttributes.color!==void 0,morphTargetsCount:Se,morphTextureStride:be,numSunLights:w.sun.length,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numSunLightShadows:w.sunShadowMap.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:J.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:s.shadowMap.enabled&&I.length>0,shadowMapType:s.shadowMap.type,toneMapping:ze,decodeVideoTexture:se&&x.map.isVideoTexture===!0&&it.getTransfer(x.map.colorSpace)===ht,decodeVideoTextureEmissive:me&&x.emissiveMap.isVideoTexture===!0&&it.getTransfer(x.emissiveMap.colorSpace)===ht,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===2,flipSided:x.side===1,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:ge&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ge&&x.extensions.multiDraw===!0||k)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Oe.vertexUv1s=l.has(1),Oe.vertexUv2s=l.has(2),Oe.vertexUv3s=l.has(3),l.clear(),Oe}function m(x){const w=[];if(x.shaderID?w.push(x.shaderID):(w.push(x.customVertexShaderID),w.push(x.customFragmentShaderID)),x.defines!==void 0)for(const I in x.defines)w.push(I),w.push(x.defines[I]);return x.isRawShaderMaterial===!1&&(p(w,x),M(w,x),w.push(s.outputColorSpace)),w.push(x.customProgramCacheKey),w.join()}function p(x,w){x.push(w.precision),x.push(w.outputColorSpace),x.push(w.envMapMode),x.push(w.envMapCubeUVHeight),x.push(w.mapUv),x.push(w.alphaMapUv),x.push(w.lightMapUv),x.push(w.aoMapUv),x.push(w.bumpMapUv),x.push(w.normalMapUv),x.push(w.displacementMapUv),x.push(w.emissiveMapUv),x.push(w.metalnessMapUv),x.push(w.roughnessMapUv),x.push(w.anisotropyMapUv),x.push(w.clearcoatMapUv),x.push(w.clearcoatNormalMapUv),x.push(w.clearcoatRoughnessMapUv),x.push(w.iridescenceMapUv),x.push(w.iridescenceThicknessMapUv),x.push(w.sheenColorMapUv),x.push(w.sheenRoughnessMapUv),x.push(w.specularMapUv),x.push(w.specularColorMapUv),x.push(w.specularIntensityMapUv),x.push(w.transmissionMapUv),x.push(w.thicknessMapUv),x.push(w.combine),x.push(w.fogExp2),x.push(w.sizeAttenuation),x.push(w.morphTargetsCount),x.push(w.morphAttributeCount),x.push(w.numSunLights),x.push(w.numDirLights),x.push(w.numPointLights),x.push(w.numSpotLights),x.push(w.numSpotLightMaps),x.push(w.numHemiLights),x.push(w.numRectAreaLights),x.push(w.numSunLightShadows),x.push(w.numDirLightShadows),x.push(w.numPointLightShadows),x.push(w.numSpotLightShadows),x.push(w.numSpotLightShadowsWithMaps),x.push(w.numLightProbes),x.push(w.shadowMapType),x.push(w.toneMapping),x.push(w.numClippingPlanes),x.push(w.numClipIntersection),x.push(w.depthPacking)}function M(x,w){a.disableAll(),w.instancing&&a.enable(0),w.instancingColor&&a.enable(1),w.instancingMorph&&a.enable(2),w.matcap&&a.enable(3),w.envMap&&a.enable(4),w.normalMapObjectSpace&&a.enable(5),w.normalMapTangentSpace&&a.enable(6),w.clearcoat&&a.enable(7),w.iridescence&&a.enable(8),w.alphaTest&&a.enable(9),w.vertexColors&&a.enable(10),w.vertexAlphas&&a.enable(11),w.vertexUv1s&&a.enable(12),w.vertexUv2s&&a.enable(13),w.vertexUv3s&&a.enable(14),w.vertexTangents&&a.enable(15),w.anisotropy&&a.enable(16),w.alphaHash&&a.enable(17),w.batching&&a.enable(18),w.dispersion&&a.enable(19),w.retroreflection&&a.enable(24),w.batchingColor&&a.enable(20),w.gradientMap&&a.enable(21),w.packedNormalMap&&a.enable(22),w.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reversedDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.decodeVideoTextureEmissive&&a.enable(20),w.alphaToCoverage&&a.enable(21),w.numLightProbeGrids>0&&a.enable(22),w.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function A(x){const w=f[x.type];let I;if(w){const O=fn[w];I=Ih.clone(O.uniforms)}else I=x.uniforms;return I}function _(x,w){let I=h.get(w);return I!==void 0?++I.usedTimes:(I=new ap(s,w,x,i),c.push(I),h.set(w,I)),I}function b(x){if(--x.usedTimes===0){const w=c.indexOf(x);c[w]=c[c.length-1],c.pop(),h.delete(x.cacheKey),x.destroy()}}function T(x){o.remove(x)}function R(){o.dispose()}return{getParameters:v,getProgramCacheKey:m,getUniforms:A,acquireProgram:_,releaseProgram:b,releaseShaderCache:T,programs:c,dispose:R}}function dp(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function fp(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function Ml(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function bl(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,g,v,m,p){let M=s[e];return M===void 0?(M={id:d.id,object:d,geometry:f,material:g,materialVariant:a(d),groupOrder:v,renderOrder:d.renderOrder,z:m,group:p},s[e]=M):(M.id=d.id,M.object=d,M.geometry=f,M.material=g,M.materialVariant=a(d),M.groupOrder=v,M.renderOrder=d.renderOrder,M.z=m,M.group=p),e++,M}function l(d,f,g,v,m,p,M){M.reversedDepth===!0&&(m=-m);const A=o(d,f,g,v,m,p);g.transmission>0?n.push(A):g.transparent===!0?i.push(A):t.push(A)}function c(d,f,g,v,m,p){const M=o(d,f,g,v,m,p);g.transmission>0?n.unshift(M):g.transparent===!0?i.unshift(M):t.unshift(M)}function h(d,f){t.length>1&&t.sort(d||fp),n.length>1&&n.sort(f||Ml),i.length>1&&i.sort(f||Ml)}function u(){for(let d=e,f=s.length;d<f;d++){const g=s[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:l,unshift:c,finish:u,sort:h}}function pp(){let s=new WeakMap;function e(n,i){const r=s.get(n);let a;return r===void 0?(a=new bl,s.set(n,[a])):i>=r.length?(a=new bl,r.push(a)):a=r[i],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function mp(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new U,color:new We};break;case"SpotLight":t={position:new U,direction:new U,color:new We,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new U,color:new We,distance:0,decay:0};break;case"HemisphereLight":t={direction:new U,skyColor:new We,groundColor:new We};break;case"RectAreaLight":t={color:new We,position:new U,halfWidth:new U,halfHeight:new U};break}return s[e.id]=t,t}}}function gp(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let _p=0;function xp(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function vp(s){const e=new mp,t=gp(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new U);const i=new U,r=new $e,a=new $e;function o(c){let h=0,u=0,d=0;for(let B=0;B<9;B++)n.probe[B].set(0,0,0);let f=0,g=0,v=0,m=0,p=0,M=0,A=0,_=0,b=0,T=0,R=0,x=0,w=0,I=0;c.sort(xp);for(let B=0,J=c.length;B<J;B++){const G=c[B],Z=G.color,re=G.intensity,$=G.distance;let z=null;if(G.shadow&&G.shadow.map&&(G.shadow.map.texture.format===1030?z=G.shadow.map.texture:z=G.shadow.map.depthTexture||G.shadow.map.texture),G.isAmbientLight)h+=Z.r*re,u+=Z.g*re,d+=Z.b*re;else if(G.isLightProbe){for(let Q=0;Q<9;Q++)n.probe[Q].addScaledVector(G.sh.coefficients[Q],re);I++}else if(G.isSunLight){const Q=e.get(G);if(Q.color.copy(G.color).multiplyScalar(G.intensity),G.castShadow){const ie=G.shadow,oe=t.get(G);oe.shadowIntensity=ie.intensity,oe.shadowBias=ie.bias,oe.shadowNormalBias=ie.normalBias,oe.shadowRadius=ie.radius,oe.shadowMapSize.copy(ie.mapSize).multiply(ie.getFrameExtents()),n.sunShadow[g]=oe,n.sunShadowMap[g]=z;const Se=ie.getViewportCount();for(let be=0;be<Se;be++)n.sunShadowMatrix[v+be]=ie.getMatrix(be),n.sunShadowCascade[v+be]=ie._cascadeData[be];v+=Se,g++}n.sun[f]=Q,f++}else if(G.isDirectionalLight){const Q=e.get(G);if(Q.color.copy(G.color).multiplyScalar(G.intensity),G.castShadow){const ie=G.shadow,oe=t.get(G);oe.shadowIntensity=ie.intensity,oe.shadowBias=ie.bias,oe.shadowNormalBias=ie.normalBias,oe.shadowRadius=ie.radius,oe.shadowMapSize=ie.mapSize,n.directionalShadow[m]=oe,n.directionalShadowMap[m]=z,n.directionalShadowMatrix[m]=G.shadow.matrix,b++}n.directional[m]=Q,m++}else if(G.isSpotLight){const Q=e.get(G);Q.position.setFromMatrixPosition(G.matrixWorld),Q.color.copy(Z).multiplyScalar(re),Q.distance=$,Q.coneCos=Math.cos(G.angle),Q.penumbraCos=Math.cos(G.angle*(1-G.penumbra)),Q.decay=G.decay,n.spot[M]=Q;const ie=G.shadow;if(G.map&&(n.spotLightMap[x]=G.map,x++,ie.updateMatrices(G),G.castShadow&&w++),n.spotLightMatrix[M]=ie.matrix,G.castShadow){const oe=t.get(G);oe.shadowIntensity=ie.intensity,oe.shadowBias=ie.bias,oe.shadowNormalBias=ie.normalBias,oe.shadowRadius=ie.radius,oe.shadowMapSize=ie.mapSize,n.spotShadow[M]=oe,n.spotShadowMap[M]=z,R++}M++}else if(G.isRectAreaLight){const Q=e.get(G);Q.color.copy(Z).multiplyScalar(re),Q.halfWidth.set(G.width*.5,0,0),Q.halfHeight.set(0,G.height*.5,0),n.rectArea[A]=Q,A++}else if(G.isPointLight){const Q=e.get(G);if(Q.color.copy(G.color).multiplyScalar(G.intensity),Q.distance=G.distance,Q.decay=G.decay,G.castShadow){const ie=G.shadow,oe=t.get(G);oe.shadowIntensity=ie.intensity,oe.shadowBias=ie.bias,oe.shadowNormalBias=ie.normalBias,oe.shadowRadius=ie.radius,oe.shadowMapSize=ie.mapSize,oe.shadowCameraNear=ie.camera.near,oe.shadowCameraFar=ie.camera.far,n.pointShadow[p]=oe,n.pointShadowMap[p]=z,n.pointShadowMatrix[p]=G.shadow.matrix,T++}n.point[p]=Q,p++}else if(G.isHemisphereLight){const Q=e.get(G);Q.skyColor.copy(G.color).multiplyScalar(re),Q.groundColor.copy(G.groundColor).multiplyScalar(re),n.hemi[_]=Q,_++}}A>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=we.LTC_FLOAT_1,n.rectAreaLTC2=we.LTC_FLOAT_2):(n.rectAreaLTC1=we.LTC_HALF_1,n.rectAreaLTC2=we.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const O=n.hash;(O.sunLength!==f||O.directionalLength!==m||O.pointLength!==p||O.spotLength!==M||O.rectAreaLength!==A||O.hemiLength!==_||O.numSunShadows!==g||O.numDirectionalShadows!==b||O.numPointShadows!==T||O.numSpotShadows!==R||O.numSpotMaps!==x||O.numLightProbes!==I)&&(n.sun.length=f,n.directional.length=m,n.spot.length=M,n.rectArea.length=A,n.point.length=p,n.hemi.length=_,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=v,n.sunShadowCascade.length=v,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=T,n.pointShadowMap.length=T,n.pointShadowMatrix.length=T,n.spotShadow.length=R,n.spotShadowMap.length=R,n.spotLightMatrix.length=R+x-w,n.spotLightMap.length=x,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=I,O.sunLength=f,O.directionalLength=m,O.pointLength=p,O.spotLength=M,O.rectAreaLength=A,O.hemiLength=_,O.numSunShadows=g,O.numDirectionalShadows=b,O.numPointShadows=T,O.numSpotShadows=R,O.numSpotMaps=x,O.numLightProbes=I,n.version=_p++)}function l(c,h){let u=0,d=0,f=0,g=0,v=0,m=0;const p=h.matrixWorldInverse;for(let M=0,A=c.length;M<A;M++){const _=c[M];if(_.isSunLight){const b=n.sun[u];b.direction.setFromMatrixPosition(_.matrixWorld),b.direction.transformDirection(p),u++}else if(_.isDirectionalLight){const b=n.directional[d];b.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(p),d++}else if(_.isSpotLight){const b=n.spot[g];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(p),b.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(p),g++}else if(_.isRectAreaLight){const b=n.rectArea[v];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(p),a.identity(),r.copy(_.matrixWorld),r.premultiply(p),a.extractRotation(r),b.halfWidth.set(_.width*.5,0,0),b.halfHeight.set(0,_.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),v++}else if(_.isPointLight){const b=n.point[f];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(p),f++}else if(_.isHemisphereLight){const b=n.hemi[m];b.direction.setFromMatrixPosition(_.matrixWorld),b.direction.transformDirection(p),m++}}}return{setup:o,setupView:l,state:n}}function Tl(s){const e=new vp(s),t=[],n=[],i=[];function r(d){u.camera=d,t.length=0,n.length=0,i.length=0}function a(d){t.push(d)}function o(d){n.push(d)}function l(d){i.push(d)}function c(){e.setup(t)}function h(d){e.setupView(t,d)}const u={lightsArray:t,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function yp(s){let e=new WeakMap;function t(i,r=0){const a=e.get(i);let o;return a===void 0?(o=new Tl(s),e.set(i,[o])):r>=a.length?(o=new Tl(s),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const Sp=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Mp=`uniform sampler2D shadow_pass;
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
}`,bp=[new U(1,0,0),new U(-1,0,0),new U(0,1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1)],Tp=[new U(0,-1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1),new U(0,-1,0),new U(0,-1,0)],El=new $e,ns=new U,ha=new U;function Ep(s,e,t){let n=new qr;const i=new fe,r=new fe,a=new dt,o=new Uh,l=new Oh,c={},h=t.maxTextureSize,u={0:1,1:0,2:2},d=new un({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new fe},radius:{value:4}},vertexShader:Sp,fragmentShader:Mp}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new yt;g.setAttribute("position",new Ot(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new tt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let p=this.type;this.render=function(T,R,x){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;this.type===2&&(Be("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=1);const w=s.getRenderTarget(),I=s.getActiveCubeFace(),O=s.getActiveMipmapLevel(),B=s.state;B.setBlending(0),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const J=p!==this.type;J&&R.traverse(function(G){G.material&&(Array.isArray(G.material)?G.material.forEach(Z=>Z.needsUpdate=!0):G.material.needsUpdate=!0)});for(let G=0,Z=T.length;G<Z;G++){const re=T[G],$=re.shadow;if($===void 0){Be("WebGLShadowMap:",re,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;i.copy($.mapSize);const z=$.getFrameExtents();i.multiply(z),r.copy($.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/z.x),i.x=r.x*z.x,$.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/z.y),i.y=r.y*z.y,$.mapSize.y=r.y));const Q=s.state.buffers.depth.getReversed();if($.camera._reversedDepth=Q,$.map===null||J===!0){if($.map!==null&&($.map.depthTexture!==null&&($.map.depthTexture.dispose(),$.map.depthTexture=null),$.map.dispose()),this.type===3){if(re.isPointLight){Be("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}$.map=new Qt(i.x,i.y,{format:1030,type:1016,minFilter:1006,magFilter:1006,generateMipmaps:!1}),$.map.texture.name=re.name+".shadowMap",$.map.depthTexture=new zi(i.x,i.y,1015),$.map.depthTexture.name=re.name+".shadowMapDepth",$.map.depthTexture.format=1026,$.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=1003,$.map.depthTexture.magFilter=1003}else re.isPointLight?($.map=new sl(i.x),$.map.depthTexture=new Zc(i.x,1014)):($.map=new Qt(i.x,i.y),$.map.depthTexture=new zi(i.x,i.y,1014)),$.map.depthTexture.name=re.name+".shadowMap",$.map.depthTexture.format=1026,this.type===1?($.map.depthTexture.compareFunction=Q?518:515,$.map.depthTexture.minFilter=1006,$.map.depthTexture.magFilter=1006):($.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=1003,$.map.depthTexture.magFilter=1003);$.camera.updateProjectionMatrix()}$.map.isWebGLCubeRenderTarget!==!0&&($.map.width!==i.x||$.map.height!==i.y)&&$.map.setSize(i.x,i.y);const ie=$.map.isWebGLCubeRenderTarget?6:$.getViewportCount();re.isPointLight!==!0&&$.updateMatrices(re,x);for(let oe=0;oe<ie;oe++){const Se=$.getCamera(oe);if(re.isPointLight){const be=$.camera,Ye=$.matrix,He=re.distance||be.far;He!==be.far&&(be.far=He,be.updateProjectionMatrix()),ns.setFromMatrixPosition(re.matrixWorld),be.position.copy(ns),ha.copy(be.position),ha.add(bp[oe]),be.up.copy(Tp[oe]),be.lookAt(ha),be.updateMatrixWorld(),Ye.makeTranslation(-ns.x,-ns.y,-ns.z),El.multiplyMatrices(be.projectionMatrix,be.matrixWorldInverse),$._frustum.setFromProjectionMatrix(El,be.coordinateSystem,be.reversedDepth)}if($.map.isWebGLCubeRenderTarget)s.setRenderTarget($.map,oe),s.clear();else{oe===0&&(s.setRenderTarget($.map),s.clear());const be=$.getViewport(oe);a.set(r.x*be.x,r.y*be.y,r.x*be.z,r.y*be.w),B.viewport(a)}n=$.getFrustum(oe),_(R,x,Se,re,this.type)}$.isPointLightShadow!==!0&&this.type===3&&M($,x),$.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(w,I,O)};function M(T,R){const x=e.update(v);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null?T.mapPass=new Qt(i.x,i.y,{format:1030,type:1016}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),d.uniforms.shadow_pass.value=T.map.depthTexture,d.uniforms.resolution.value.set(T.map.width,T.map.height),d.uniforms.radius.value=T.radius,s.setRenderTarget(T.mapPass),s.clear(),s.renderBufferDirect(R,null,x,d,v,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value.set(T.map.width,T.map.height),f.uniforms.radius.value=T.radius,s.setRenderTarget(T.map),s.clear(),s.renderBufferDirect(R,null,x,f,v,null)}function A(T,R,x,w){let I=null;const O=x.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(O!==void 0)I=O;else if(I=x.isPointLight===!0?l:o,s.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const B=I.uuid,J=R.uuid;let G=c[B];G===void 0&&(G={},c[B]=G);let Z=G[J];Z===void 0&&(Z=I.clone(),G[J]=Z,R.addEventListener("dispose",b)),I=Z}if(I.visible=R.visible,I.wireframe=R.wireframe,w===3?I.side=R.shadowSide!==null?R.shadowSide:R.side:I.side=R.shadowSide!==null?R.shadowSide:u[R.side],I.alphaMap=R.alphaMap,I.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,I.map=R.map,I.clipShadows=R.clipShadows,I.clippingPlanes=R.clippingPlanes,I.clipIntersection=R.clipIntersection,I.displacementMap=R.displacementMap,I.displacementScale=R.displacementScale,I.displacementBias=R.displacementBias,I.wireframeLinewidth=R.wireframeLinewidth,I.linewidth=R.linewidth,x.isPointLight===!0&&I.isMeshDistanceMaterial===!0){const B=s.properties.get(I);B.light=x}return I}function _(T,R,x,w,I){if(T.visible===!1)return;if(T.layers.test(R.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&I===3)&&(!T.frustumCulled||T.intersectsFrustum(n))){T.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,T.matrixWorld);const J=e.update(T),G=T.material;if(Array.isArray(G)){const Z=J.groups;for(let re=0,$=Z.length;re<$;re++){const z=Z[re],Q=G[z.materialIndex];if(Q&&Q.visible){const ie=A(T,Q,w,I);T.onBeforeShadow(s,T,R,x,J,ie,z),s.renderBufferDirect(x,null,J,ie,T,z),T.onAfterShadow(s,T,R,x,J,ie,z)}}}else if(G.visible){const Z=A(T,G,w,I);T.onBeforeShadow(s,T,R,x,J,Z,null),s.renderBufferDirect(x,null,J,Z,T,null),T.onAfterShadow(s,T,R,x,J,Z,null)}}const B=T.children;for(let J=0,G=B.length;J<G;J++)_(B[J],R,x,w,I)}function b(T){T.target.removeEventListener("dispose",b);for(const x in c){const w=c[x],I=T.target.uuid;I in w&&(w[I].dispose(),delete w[I])}}}function Ap(s,e){function t(){let W=!1;const Ee=new dt;let de=null;const Ae=new dt(0,0,0,0);return{setMask:function(Pe){de!==Pe&&!W&&(s.colorMask(Pe,Pe,Pe,Pe),de=Pe)},setLocked:function(Pe){W=Pe},setClear:function(Pe,ge,ze,Oe,mt){mt===!0&&(Pe*=Oe,ge*=Oe,ze*=Oe),Ee.set(Pe,ge,ze,Oe),Ae.equals(Ee)===!1&&(s.clearColor(Pe,ge,ze,Oe),Ae.copy(Ee))},reset:function(){W=!1,de=null,Ae.set(-1,0,0,0)}}}function n(){let W=!1,Ee=!1,de=null,Ae=null,Pe=null;return{setReversed:function(ge){if(Ee!==ge){const ze=e.get("EXT_clip_control");ge?ze.clipControlEXT(ze.LOWER_LEFT_EXT,ze.ZERO_TO_ONE_EXT):ze.clipControlEXT(ze.LOWER_LEFT_EXT,ze.NEGATIVE_ONE_TO_ONE_EXT),Ee=ge;const Oe=Pe;Pe=null,this.setClear(Oe)}},getReversed:function(){return Ee},setTest:function(ge){ge?N(s.DEPTH_TEST):L(s.DEPTH_TEST)},setMask:function(ge){de!==ge&&!W&&(s.depthMask(ge),de=ge)},setFunc:function(ge){if(Ee&&(ge=nc[ge]),Ae!==ge){switch(ge){case 0:s.depthFunc(s.NEVER);break;case 1:s.depthFunc(s.ALWAYS);break;case 2:s.depthFunc(s.LESS);break;case 3:s.depthFunc(s.LEQUAL);break;case 4:s.depthFunc(s.EQUAL);break;case 5:s.depthFunc(s.GEQUAL);break;case 6:s.depthFunc(s.GREATER);break;case 7:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}Ae=ge}},setLocked:function(ge){W=ge},setClear:function(ge){Pe!==ge&&(Pe=ge,Ee&&(ge=1-ge),s.clearDepth(ge))},reset:function(){W=!1,de=null,Ae=null,Pe=null,Ee=!1}}}function i(){let W=!1,Ee=null,de=null,Ae=null,Pe=null,ge=null,ze=null,Oe=null,mt=null;return{setTest:function(lt){W||(lt?N(s.STENCIL_TEST):L(s.STENCIL_TEST))},setMask:function(lt){Ee!==lt&&!W&&(s.stencilMask(lt),Ee=lt)},setFunc:function(lt,ln,gn){(de!==lt||Ae!==ln||Pe!==gn)&&(s.stencilFunc(lt,ln,gn),de=lt,Ae=ln,Pe=gn)},setOp:function(lt,ln,gn){(ge!==lt||ze!==ln||Oe!==gn)&&(s.stencilOp(lt,ln,gn),ge=lt,ze=ln,Oe=gn)},setLocked:function(lt){W=lt},setClear:function(lt){mt!==lt&&(s.clearStencil(lt),mt=lt)},reset:function(){W=!1,Ee=null,de=null,Ae=null,Pe=null,ge=null,ze=null,Oe=null,mt=null}}}const r=new t,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let h={},u={},d={},f=new WeakMap,g=[],v=null,m=!1,p=null,M=null,A=null,_=null,b=null,T=null,R=null,x=new We(0,0,0),w=0,I=!1,O=null,B=null,J=null,G=null,Z=null;const re=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let $=!1,z=0;const Q=s.getParameter(s.VERSION);Q.indexOf("WebGL")!==-1?(z=parseFloat(/^WebGL (\d)/.exec(Q)[1]),$=z>=1):Q.indexOf("OpenGL ES")!==-1&&(z=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),$=z>=2);let ie=null,oe={};const Se=s.getParameter(s.SCISSOR_BOX),be=s.getParameter(s.VIEWPORT),Ye=new dt().fromArray(Se),He=new dt().fromArray(be);function Je(W,Ee,de,Ae){const Pe=new Uint8Array(4),ge=s.createTexture();s.bindTexture(W,ge),s.texParameteri(W,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(W,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let ze=0;ze<de;ze++)W===s.TEXTURE_3D||W===s.TEXTURE_2D_ARRAY?s.texImage3D(Ee,0,s.RGBA,1,1,Ae,0,s.RGBA,s.UNSIGNED_BYTE,Pe):s.texImage2D(Ee+ze,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Pe);return ge}const D={};D[s.TEXTURE_2D]=Je(s.TEXTURE_2D,s.TEXTURE_2D,1),D[s.TEXTURE_CUBE_MAP]=Je(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),D[s.TEXTURE_2D_ARRAY]=Je(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),D[s.TEXTURE_3D]=Je(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),N(s.DEPTH_TEST),a.setFunc(3),K(!1),j(1),N(s.CULL_FACE),V(0);function N(W){h[W]!==!0&&(s.enable(W),h[W]=!0)}function L(W){h[W]!==!1&&(s.disable(W),h[W]=!1)}function P(W,Ee){return d[W]!==Ee?(s.bindFramebuffer(W,Ee),d[W]=Ee,W===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=Ee),W===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=Ee),!0):!1}function k(W,Ee){let de=g,Ae=!1;if(W){de=f.get(Ee),de===void 0&&(de=[],f.set(Ee,de));const Pe=W.textures;if(de.length!==Pe.length||de[0]!==s.COLOR_ATTACHMENT0){for(let ge=0,ze=Pe.length;ge<ze;ge++)de[ge]=s.COLOR_ATTACHMENT0+ge;de.length=Pe.length,Ae=!0}}else de[0]!==s.BACK&&(de[0]=s.BACK,Ae=!0);Ae&&s.drawBuffers(de)}function se(W){return v!==W?(s.useProgram(W),v=W,!0):!1}const _e={100:s.FUNC_ADD,101:s.FUNC_SUBTRACT,102:s.FUNC_REVERSE_SUBTRACT};_e[103]=s.MIN,_e[104]=s.MAX;const C={200:s.ZERO,201:s.ONE,202:s.SRC_COLOR,204:s.SRC_ALPHA,210:s.SRC_ALPHA_SATURATE,208:s.DST_COLOR,206:s.DST_ALPHA,203:s.ONE_MINUS_SRC_COLOR,205:s.ONE_MINUS_SRC_ALPHA,209:s.ONE_MINUS_DST_COLOR,207:s.ONE_MINUS_DST_ALPHA,211:s.CONSTANT_COLOR,212:s.ONE_MINUS_CONSTANT_COLOR,213:s.CONSTANT_ALPHA,214:s.ONE_MINUS_CONSTANT_ALPHA};function V(W,Ee,de,Ae,Pe,ge,ze,Oe,mt,lt){if(W===0){m===!0&&(L(s.BLEND),m=!1);return}if(m===!1&&(N(s.BLEND),m=!0),W!==5){if(W!==p||lt!==I){if((M!==100||b!==100)&&(s.blendEquation(s.FUNC_ADD),M=100,b=100),lt)switch(W){case 1:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case 2:s.blendFunc(s.ONE,s.ONE);break;case 3:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case 4:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:Ke("WebGLState: Invalid blending: ",W);break}else switch(W){case 1:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case 2:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case 3:Ke("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case 4:Ke("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ke("WebGLState: Invalid blending: ",W);break}A=null,_=null,T=null,R=null,x.set(0,0,0),w=0,p=W,I=lt}return}Pe=Pe||Ee,ge=ge||de,ze=ze||Ae,(Ee!==M||Pe!==b)&&(s.blendEquationSeparate(_e[Ee],_e[Pe]),M=Ee,b=Pe),(de!==A||Ae!==_||ge!==T||ze!==R)&&(s.blendFuncSeparate(C[de],C[Ae],C[ge],C[ze]),A=de,_=Ae,T=ge,R=ze),(Oe.equals(x)===!1||mt!==w)&&(s.blendColor(Oe.r,Oe.g,Oe.b,mt),x.copy(Oe),w=mt),p=W,I=!1}function F(W,Ee){W.side===2?L(s.CULL_FACE):N(s.CULL_FACE);let de=W.side===1;Ee&&(de=!de),K(de),W.blending===1&&W.transparent===!1?V(0):V(W.blending,W.blendEquation,W.blendSrc,W.blendDst,W.blendEquationAlpha,W.blendSrcAlpha,W.blendDstAlpha,W.blendColor,W.blendAlpha,W.premultipliedAlpha),a.setFunc(W.depthFunc),a.setTest(W.depthTest),a.setMask(W.depthWrite),r.setMask(W.colorWrite);const Ae=W.stencilWrite;o.setTest(Ae),Ae&&(o.setMask(W.stencilWriteMask),o.setFunc(W.stencilFunc,W.stencilRef,W.stencilFuncMask),o.setOp(W.stencilFail,W.stencilZFail,W.stencilZPass)),me(W.polygonOffset,W.polygonOffsetFactor,W.polygonOffsetUnits),W.alphaToCoverage===!0?N(s.SAMPLE_ALPHA_TO_COVERAGE):L(s.SAMPLE_ALPHA_TO_COVERAGE)}function K(W){O!==W&&(W?s.frontFace(s.CW):s.frontFace(s.CCW),O=W)}function j(W){W!==0?(N(s.CULL_FACE),W!==B&&(W===1?s.cullFace(s.BACK):W===2?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):L(s.CULL_FACE),B=W}function ce(W){W!==J&&($&&s.lineWidth(W),J=W)}function me(W,Ee,de){W?(N(s.POLYGON_OFFSET_FILL),(G!==Ee||Z!==de)&&(G=Ee,Z=de,a.getReversed()&&(Ee=-Ee),s.polygonOffset(Ee,de))):L(s.POLYGON_OFFSET_FILL)}function pe(W){W?N(s.SCISSOR_TEST):L(s.SCISSOR_TEST)}function Y(W){W===void 0&&(W=s.TEXTURE0+re-1),ie!==W&&(s.activeTexture(W),ie=W)}function S(W,Ee,de){de===void 0&&(ie===null?de=s.TEXTURE0+re-1:de=ie);let Ae=oe[de];Ae===void 0&&(Ae={type:void 0,texture:void 0},oe[de]=Ae),(Ae.type!==W||Ae.texture!==Ee)&&(ie!==de&&(s.activeTexture(de),ie=de),s.bindTexture(W,Ee||D[W]),Ae.type=W,Ae.texture=Ee)}function Re(){const W=oe[ie];W!==void 0&&W.type!==void 0&&(s.bindTexture(W.type,null),W.type=void 0,W.texture=void 0)}function Ne(){try{s.compressedTexImage2D(...arguments)}catch(W){Ke("WebGLState:",W)}}function q(){try{s.compressedTexImage3D(...arguments)}catch(W){Ke("WebGLState:",W)}}function y(){try{s.texSubImage2D(...arguments)}catch(W){Ke("WebGLState:",W)}}function X(){try{s.texSubImage3D(...arguments)}catch(W){Ke("WebGLState:",W)}}function ee(){try{s.compressedTexSubImage2D(...arguments)}catch(W){Ke("WebGLState:",W)}}function le(){try{s.compressedTexSubImage3D(...arguments)}catch(W){Ke("WebGLState:",W)}}function xe(){try{s.texStorage2D(...arguments)}catch(W){Ke("WebGLState:",W)}}function ve(){try{s.texStorage3D(...arguments)}catch(W){Ke("WebGLState:",W)}}function he(){try{s.texImage2D(...arguments)}catch(W){Ke("WebGLState:",W)}}function ue(){try{s.texImage3D(...arguments)}catch(W){Ke("WebGLState:",W)}}function ye(W){return u[W]!==void 0?u[W]:s.getParameter(W)}function Ue(W,Ee){u[W]!==Ee&&(s.pixelStorei(W,Ee),u[W]=Ee)}function Te(W){Ye.equals(W)===!1&&(s.scissor(W.x,W.y,W.z,W.w),Ye.copy(W))}function Me(W){He.equals(W)===!1&&(s.viewport(W.x,W.y,W.z,W.w),He.copy(W))}function Ge(W,Ee){let de=c.get(Ee);de===void 0&&(de=new WeakMap,c.set(Ee,de));let Ae=de.get(W);Ae===void 0&&(Ae=s.getUniformBlockIndex(Ee,W.name),de.set(W,Ae))}function Xe(W,Ee){const Ae=c.get(Ee).get(W);l.get(Ee)!==Ae&&(s.uniformBlockBinding(Ee,Ae,W.__bindingPointIndex),l.set(Ee,Ae))}function Ze(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},u={},ie=null,oe={},d={},f=new WeakMap,g=[],v=null,m=!1,p=null,M=null,A=null,_=null,b=null,T=null,R=null,x=new We(0,0,0),w=0,I=!1,O=null,B=null,J=null,G=null,Z=null,Ye.set(0,0,s.canvas.width,s.canvas.height),He.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:N,disable:L,bindFramebuffer:P,drawBuffers:k,useProgram:se,setBlending:V,setMaterial:F,setFlipSided:K,setCullFace:j,setLineWidth:ce,setPolygonOffset:me,setScissorTest:pe,activeTexture:Y,bindTexture:S,unbindTexture:Re,compressedTexImage2D:Ne,compressedTexImage3D:q,texImage2D:he,texImage3D:ue,pixelStorei:Ue,getParameter:ye,updateUBOMapping:Ge,uniformBlockBinding:Xe,texStorage2D:xe,texStorage3D:ve,texSubImage2D:y,texSubImage3D:X,compressedTexSubImage2D:ee,compressedTexSubImage3D:le,scissor:Te,viewport:Me,reset:Ze}}function wp(s,e,t,n,i,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new fe,h=new WeakMap,u=new Set;let d;const f=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(q,y){return g?new OffscreenCanvas(q,y):Pi("canvas")}function m(q,y,X){let ee=1;const le=Ne(q);if((le.width>X||le.height>X)&&(ee=X/Math.max(le.width,le.height)),ee<1)if(typeof HTMLImageElement!="undefined"&&q instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&q instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&q instanceof ImageBitmap||typeof VideoFrame!="undefined"&&q instanceof VideoFrame){const xe=Math.floor(ee*le.width),ve=Math.floor(ee*le.height);d===void 0&&(d=v(xe,ve));const he=y?v(xe,ve):d;return he.width=xe,he.height=ve,he.getContext("2d").drawImage(q,0,0,xe,ve),Be("WebGLRenderer: Texture has been resized from ("+le.width+"x"+le.height+") to ("+xe+"x"+ve+")."),he}else return"data"in q&&Be("WebGLRenderer: Image in DataTexture is too big ("+le.width+"x"+le.height+")."),q;return q}function p(q){return q.generateMipmaps}function M(q){s.generateMipmap(q)}function A(q){return q.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:q.isWebGL3DRenderTarget?s.TEXTURE_3D:q.isWebGLArrayRenderTarget||q.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function _(q,y,X,ee,le,xe=!1){if(q!==null){if(s[q]!==void 0)return s[q];Be("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+q+"'")}let ve;ee&&(ve=e.get("EXT_texture_norm16"),ve||Be("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let he=y;if(y===s.RED&&(X===s.FLOAT&&(he=s.R32F),X===s.HALF_FLOAT&&(he=s.R16F),X===s.UNSIGNED_BYTE&&(he=s.R8),X===s.UNSIGNED_SHORT&&ve&&(he=ve.R16_EXT),X===s.SHORT&&ve&&(he=ve.R16_SNORM_EXT)),y===s.RED_INTEGER&&(X===s.UNSIGNED_BYTE&&(he=s.R8UI),X===s.UNSIGNED_SHORT&&(he=s.R16UI),X===s.UNSIGNED_INT&&(he=s.R32UI),X===s.BYTE&&(he=s.R8I),X===s.SHORT&&(he=s.R16I),X===s.INT&&(he=s.R32I)),y===s.RG&&(X===s.FLOAT&&(he=s.RG32F),X===s.HALF_FLOAT&&(he=s.RG16F),X===s.UNSIGNED_BYTE&&(he=s.RG8),X===s.UNSIGNED_SHORT&&ve&&(he=ve.RG16_EXT),X===s.SHORT&&ve&&(he=ve.RG16_SNORM_EXT)),y===s.RG_INTEGER&&(X===s.UNSIGNED_BYTE&&(he=s.RG8UI),X===s.UNSIGNED_SHORT&&(he=s.RG16UI),X===s.UNSIGNED_INT&&(he=s.RG32UI),X===s.BYTE&&(he=s.RG8I),X===s.SHORT&&(he=s.RG16I),X===s.INT&&(he=s.RG32I)),y===s.RGB_INTEGER&&(X===s.UNSIGNED_BYTE&&(he=s.RGB8UI),X===s.UNSIGNED_SHORT&&(he=s.RGB16UI),X===s.UNSIGNED_INT&&(he=s.RGB32UI),X===s.BYTE&&(he=s.RGB8I),X===s.SHORT&&(he=s.RGB16I),X===s.INT&&(he=s.RGB32I)),y===s.RGBA_INTEGER&&(X===s.UNSIGNED_BYTE&&(he=s.RGBA8UI),X===s.UNSIGNED_SHORT&&(he=s.RGBA16UI),X===s.UNSIGNED_INT&&(he=s.RGBA32UI),X===s.BYTE&&(he=s.RGBA8I),X===s.SHORT&&(he=s.RGBA16I),X===s.INT&&(he=s.RGBA32I)),y===s.RGB&&(X===s.UNSIGNED_SHORT&&ve&&(he=ve.RGB16_EXT),X===s.SHORT&&ve&&(he=ve.RGB16_SNORM_EXT),X===s.UNSIGNED_INT_5_9_9_9_REV&&(he=s.RGB9_E5),X===s.UNSIGNED_INT_10F_11F_11F_REV&&(he=s.R11F_G11F_B10F)),y===s.RGBA){const ue=xe?ls:it.getTransfer(le);X===s.FLOAT&&(he=s.RGBA32F),X===s.HALF_FLOAT&&(he=s.RGBA16F),X===s.UNSIGNED_BYTE&&(he=ue===ht?s.SRGB8_ALPHA8:s.RGBA8),X===s.UNSIGNED_SHORT&&ve&&(he=ve.RGBA16_EXT),X===s.SHORT&&ve&&(he=ve.RGBA16_SNORM_EXT),X===s.UNSIGNED_SHORT_4_4_4_4&&(he=s.RGBA4),X===s.UNSIGNED_SHORT_5_5_5_1&&(he=s.RGB5_A1)}return(he===s.R16F||he===s.R32F||he===s.RG16F||he===s.RG32F||he===s.RGBA16F||he===s.RGBA32F)&&e.get("EXT_color_buffer_float"),he}function b(q,y){let X;return q?y===null||y===1014||y===1020?X=s.DEPTH24_STENCIL8:y===1015?X=s.DEPTH32F_STENCIL8:y===1012&&(X=s.DEPTH24_STENCIL8,Be("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===1014||y===1020?X=s.DEPTH_COMPONENT24:y===1015?X=s.DEPTH_COMPONENT32F:y===1012&&(X=s.DEPTH_COMPONENT16),X}function T(q,y){return p(q)===!0||q.isFramebufferTexture&&q.minFilter!==1003&&q.minFilter!==1006?Math.log2(Math.max(y.width,y.height))+1:q.mipmaps!==void 0&&q.mipmaps.length>0?q.mipmaps.length:q.isCompressedTexture&&Array.isArray(q.image)?y.mipmaps.length:1}function R(q){const y=q.target;y.removeEventListener("dispose",R),w(y),y.isVideoTexture&&h.delete(y),y.isHTMLTexture&&u.delete(y)}function x(q){const y=q.target;y.removeEventListener("dispose",x),O(y)}function w(q){const y=n.get(q);if(y.__webglInit===void 0)return;const X=q.source,ee=f.get(X);if(ee){const le=ee[y.__cacheKey];le.usedTimes--,le.usedTimes===0&&I(q),Object.keys(ee).length===0&&f.delete(X)}n.remove(q)}function I(q){const y=n.get(q);s.deleteTexture(y.__webglTexture);const X=q.source,ee=f.get(X);delete ee[y.__cacheKey],a.memory.textures--}function O(q){const y=n.get(q);if(q.depthTexture&&(q.depthTexture.dispose(),n.remove(q.depthTexture)),q.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(y.__webglFramebuffer[ee]))for(let le=0;le<y.__webglFramebuffer[ee].length;le++)s.deleteFramebuffer(y.__webglFramebuffer[ee][le]);else s.deleteFramebuffer(y.__webglFramebuffer[ee]);y.__webglDepthbuffer&&s.deleteRenderbuffer(y.__webglDepthbuffer[ee])}else{if(Array.isArray(y.__webglFramebuffer))for(let ee=0;ee<y.__webglFramebuffer.length;ee++)s.deleteFramebuffer(y.__webglFramebuffer[ee]);else s.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&s.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&s.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let ee=0;ee<y.__webglColorRenderbuffer.length;ee++)y.__webglColorRenderbuffer[ee]&&s.deleteRenderbuffer(y.__webglColorRenderbuffer[ee]);y.__webglDepthRenderbuffer&&s.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const X=q.textures;for(let ee=0,le=X.length;ee<le;ee++){const xe=n.get(X[ee]);xe.__webglTexture&&(s.deleteTexture(xe.__webglTexture),a.memory.textures--),n.remove(X[ee])}n.remove(q)}let B=0;function J(){B=0}function G(){return B}function Z(q){B=q}function re(){const q=B;return q>=i.maxTextures&&Be("WebGLTextures: Trying to use "+(q+1)+" texture units while this GPU supports only "+i.maxTextures),B+=1,q}function $(q){const y=[];return y.push(q.wrapS),y.push(q.wrapT),y.push(q.wrapR||0),y.push(q.magFilter),y.push(q.minFilter),y.push(q.anisotropy),y.push(q.internalFormat),y.push(q.format),y.push(q.type),y.push(q.generateMipmaps),y.push(q.premultiplyAlpha),y.push(q.flipY),y.push(q.unpackAlignment),y.push(q.colorSpace),y.join()}function z(q,y){const X=n.get(q);if(q.isVideoTexture&&S(q),q.isRenderTargetTexture===!1&&q.isExternalTexture!==!0&&q.version>0&&X.__version!==q.version){const ee=q.image;if(ee===null)Be("WebGLRenderer: Texture marked for update but no image data found.");else if(ee.complete===!1)Be("WebGLRenderer: Texture marked for update but image is incomplete");else{L(X,q,y);return}}else q.isExternalTexture&&(X.__webglTexture=q.sourceTexture?q.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,X.__webglTexture,s.TEXTURE0+y)}function Q(q,y){const X=n.get(q);if(q.isRenderTargetTexture===!1&&q.version>0&&X.__version!==q.version){L(X,q,y);return}else q.isExternalTexture&&(X.__webglTexture=q.sourceTexture?q.sourceTexture:null);t.bindTexture(s.TEXTURE_2D_ARRAY,X.__webglTexture,s.TEXTURE0+y)}function ie(q,y){const X=n.get(q);if(q.isRenderTargetTexture===!1&&q.version>0&&X.__version!==q.version){L(X,q,y);return}t.bindTexture(s.TEXTURE_3D,X.__webglTexture,s.TEXTURE0+y)}function oe(q,y){const X=n.get(q);if(q.isCubeDepthTexture!==!0&&q.version>0&&X.__version!==q.version){P(X,q,y);return}t.bindTexture(s.TEXTURE_CUBE_MAP,X.__webglTexture,s.TEXTURE0+y)}const Se={1e3:s.REPEAT,1001:s.CLAMP_TO_EDGE,1002:s.MIRRORED_REPEAT},be={1003:s.NEAREST,1004:s.NEAREST_MIPMAP_NEAREST,1005:s.NEAREST_MIPMAP_LINEAR,1006:s.LINEAR,1007:s.LINEAR_MIPMAP_NEAREST,1008:s.LINEAR_MIPMAP_LINEAR},Ye={512:s.NEVER,519:s.ALWAYS,513:s.LESS,515:s.LEQUAL,514:s.EQUAL,518:s.GEQUAL,516:s.GREATER,517:s.NOTEQUAL};function He(q,y){if(y.type===1015&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===1006||y.magFilter===1007||y.magFilter===1005||y.magFilter===1008||y.minFilter===1006||y.minFilter===1007||y.minFilter===1005||y.minFilter===1008)&&Be("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(q,s.TEXTURE_WRAP_S,Se[y.wrapS]),s.texParameteri(q,s.TEXTURE_WRAP_T,Se[y.wrapT]),(q===s.TEXTURE_3D||q===s.TEXTURE_2D_ARRAY)&&s.texParameteri(q,s.TEXTURE_WRAP_R,Se[y.wrapR]),s.texParameteri(q,s.TEXTURE_MAG_FILTER,be[y.magFilter]),s.texParameteri(q,s.TEXTURE_MIN_FILTER,be[y.minFilter]),y.compareFunction&&(s.texParameteri(q,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(q,s.TEXTURE_COMPARE_FUNC,Ye[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===1003||y.minFilter!==1005&&y.minFilter!==1008||y.type===1015&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const X=e.get("EXT_texture_filter_anisotropic");s.texParameterf(q,X.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,i.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function Je(q,y){let X=!1;q.__webglInit===void 0&&(q.__webglInit=!0,y.addEventListener("dispose",R));const ee=y.source;let le=f.get(ee);le===void 0&&(le={},f.set(ee,le));const xe=$(y);if(xe!==q.__cacheKey){le[xe]===void 0&&(le[xe]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,X=!0),le[xe].usedTimes++;const ve=le[q.__cacheKey];ve!==void 0&&(le[q.__cacheKey].usedTimes--,ve.usedTimes===0&&I(y)),q.__cacheKey=xe,q.__webglTexture=le[xe].texture}return X}function D(q,y,X){return Math.floor(Math.floor(q/X)/y)}function N(q,y,X,ee){const xe=q.updateRanges;if(xe.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,y.width,y.height,X,ee,y.data);else{xe.sort((Ue,Te)=>Ue.start-Te.start);let ve=0;for(let Ue=1;Ue<xe.length;Ue++){const Te=xe[ve],Me=xe[Ue],Ge=Te.start+Te.count,Xe=D(Me.start,y.width,4),Ze=D(Te.start,y.width,4);Me.start<=Ge+1&&Xe===Ze&&D(Me.start+Me.count-1,y.width,4)===Xe?Te.count=Math.max(Te.count,Me.start+Me.count-Te.start):(++ve,xe[ve]=Me)}xe.length=ve+1;const he=t.getParameter(s.UNPACK_ROW_LENGTH),ue=t.getParameter(s.UNPACK_SKIP_PIXELS),ye=t.getParameter(s.UNPACK_SKIP_ROWS);t.pixelStorei(s.UNPACK_ROW_LENGTH,y.width);for(let Ue=0,Te=xe.length;Ue<Te;Ue++){const Me=xe[Ue],Ge=Math.floor(Me.start/4),Xe=Math.ceil(Me.count/4),Ze=Ge%y.width,W=Math.floor(Ge/y.width),Ee=Xe,de=1;t.pixelStorei(s.UNPACK_SKIP_PIXELS,Ze),t.pixelStorei(s.UNPACK_SKIP_ROWS,W),t.texSubImage2D(s.TEXTURE_2D,0,Ze,W,Ee,de,X,ee,y.data)}q.clearUpdateRanges(),t.pixelStorei(s.UNPACK_ROW_LENGTH,he),t.pixelStorei(s.UNPACK_SKIP_PIXELS,ue),t.pixelStorei(s.UNPACK_SKIP_ROWS,ye)}}function L(q,y,X){let ee=s.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(ee=s.TEXTURE_2D_ARRAY),y.isData3DTexture&&(ee=s.TEXTURE_3D);const le=Je(q,y),xe=y.source;t.bindTexture(ee,q.__webglTexture,s.TEXTURE0+X);const ve=n.get(xe);if(xe.version!==ve.__version||le===!0){if(t.activeTexture(s.TEXTURE0+X),(typeof ImageBitmap!="undefined"&&y.image instanceof ImageBitmap)===!1){const de=it.getPrimaries(it.workingColorSpace),Ae=y.colorSpace===wn?null:it.getPrimaries(y.colorSpace),Pe=y.colorSpace===wn||de===Ae?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,y.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pe)}t.pixelStorei(s.UNPACK_ALIGNMENT,y.unpackAlignment);let ue=m(y.image,!1,i.maxTextureSize);ue=Re(y,ue);const ye=r.convert(y.format,y.colorSpace),Ue=r.convert(y.type);let Te=_(y.internalFormat,ye,Ue,y.normalized,y.colorSpace,y.isVideoTexture);He(ee,y);let Me;const Ge=y.mipmaps,Xe=y.isVideoTexture!==!0,Ze=ve.__version===void 0||le===!0,W=xe.dataReady,Ee=T(y,ue);if(y.isDepthTexture)Te=b(y.format===1027,y.type),Ze&&(Xe?t.texStorage2D(s.TEXTURE_2D,1,Te,ue.width,ue.height):t.texImage2D(s.TEXTURE_2D,0,Te,ue.width,ue.height,0,ye,Ue,null));else if(y.isDataTexture)if(Ge.length>0){Xe&&Ze&&t.texStorage2D(s.TEXTURE_2D,Ee,Te,Ge[0].width,Ge[0].height);for(let de=0,Ae=Ge.length;de<Ae;de++)Me=Ge[de],Xe?W&&t.texSubImage2D(s.TEXTURE_2D,de,0,0,Me.width,Me.height,ye,Ue,Me.data):t.texImage2D(s.TEXTURE_2D,de,Te,Me.width,Me.height,0,ye,Ue,Me.data);y.generateMipmaps=!1}else Xe?(Ze&&t.texStorage2D(s.TEXTURE_2D,Ee,Te,ue.width,ue.height),W&&N(y,ue,ye,Ue)):t.texImage2D(s.TEXTURE_2D,0,Te,ue.width,ue.height,0,ye,Ue,ue.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){Xe&&Ze&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ee,Te,Ge[0].width,Ge[0].height,ue.depth);for(let de=0,Ae=Ge.length;de<Ae;de++)if(Me=Ge[de],y.format!==1023)if(ye!==null)if(Xe){if(W)if(y.layerUpdates.size>0){const Pe=$o(Me.width,Me.height,y.format,y.type);for(const ge of y.layerUpdates){const ze=Me.data.subarray(ge*Pe/Me.data.BYTES_PER_ELEMENT,(ge+1)*Pe/Me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,de,0,0,ge,Me.width,Me.height,1,ye,ze)}}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,de,0,0,0,Me.width,Me.height,ue.depth,ye,Me.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,de,Te,Me.width,Me.height,ue.depth,0,Me.data,0,0);else Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Xe?W&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,de,0,0,0,Me.width,Me.height,ue.depth,ye,Ue,Me.data):t.texImage3D(s.TEXTURE_2D_ARRAY,de,Te,Me.width,Me.height,ue.depth,0,ye,Ue,Me.data);y.layerUpdates.size>0&&y.clearLayerUpdates()}else{Xe&&Ze&&t.texStorage2D(s.TEXTURE_2D,Ee,Te,Ge[0].width,Ge[0].height);for(let de=0,Ae=Ge.length;de<Ae;de++)Me=Ge[de],y.format!==1023?ye!==null?Xe?W&&t.compressedTexSubImage2D(s.TEXTURE_2D,de,0,0,Me.width,Me.height,ye,Me.data):t.compressedTexImage2D(s.TEXTURE_2D,de,Te,Me.width,Me.height,0,Me.data):Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xe?W&&t.texSubImage2D(s.TEXTURE_2D,de,0,0,Me.width,Me.height,ye,Ue,Me.data):t.texImage2D(s.TEXTURE_2D,de,Te,Me.width,Me.height,0,ye,Ue,Me.data)}else if(y.isDataArrayTexture)if(Xe){if(Ze&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ee,Te,ue.width,ue.height,ue.depth),W)if(y.layerUpdates.size>0){const de=$o(ue.width,ue.height,y.format,y.type);for(const Ae of y.layerUpdates){const Pe=ue.data.subarray(Ae*de/ue.data.BYTES_PER_ELEMENT,(Ae+1)*de/ue.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,Ae,ue.width,ue.height,1,ye,Ue,Pe)}y.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ue.width,ue.height,ue.depth,ye,Ue,ue.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,Te,ue.width,ue.height,ue.depth,0,ye,Ue,ue.data);else if(y.isData3DTexture)Xe?(Ze&&t.texStorage3D(s.TEXTURE_3D,Ee,Te,ue.width,ue.height,ue.depth),W&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ue.width,ue.height,ue.depth,ye,Ue,ue.data)):t.texImage3D(s.TEXTURE_3D,0,Te,ue.width,ue.height,ue.depth,0,ye,Ue,ue.data);else if(y.isFramebufferTexture){if(Ze)if(Xe)t.texStorage2D(s.TEXTURE_2D,Ee,Te,ue.width,ue.height);else{let de=ue.width,Ae=ue.height;for(let Pe=0;Pe<Ee;Pe++)t.texImage2D(s.TEXTURE_2D,Pe,Te,de,Ae,0,ye,Ue,null),de>>=1,Ae>>=1}}else if(y.isHTMLTexture){if("texElementImage2D"in s){const de=s.canvas;if(de.hasAttribute("layoutsubtree")||de.setAttribute("layoutsubtree","true"),ue.parentNode!==de){de.appendChild(ue),u.add(y),de.onpaint=Ae=>{const Pe=Ae.changedElements;for(const ge of u)Pe.includes(ge.image)&&(ge.needsUpdate=!0)},de.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,ue);else{const Pe=s.RGBA,ge=s.RGBA,ze=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,Pe,ge,ze,ue)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Ge.length>0){if(Xe&&Ze){const de=Ne(Ge[0]);t.texStorage2D(s.TEXTURE_2D,Ee,Te,de.width,de.height)}for(let de=0,Ae=Ge.length;de<Ae;de++)Me=Ge[de],Xe?W&&t.texSubImage2D(s.TEXTURE_2D,de,0,0,ye,Ue,Me):t.texImage2D(s.TEXTURE_2D,de,Te,ye,Ue,Me);y.generateMipmaps=!1}else if(Xe){if(Ze){const de=Ne(ue);t.texStorage2D(s.TEXTURE_2D,Ee,Te,de.width,de.height)}W&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,ye,Ue,ue)}else t.texImage2D(s.TEXTURE_2D,0,Te,ye,Ue,ue);p(y)&&M(ee),ve.__version=xe.version,y.onUpdate&&y.onUpdate(y)}q.__version=y.version}function P(q,y,X){if(y.image.length!==6)return;const ee=Je(q,y),le=y.source;t.bindTexture(s.TEXTURE_CUBE_MAP,q.__webglTexture,s.TEXTURE0+X);const xe=n.get(le);if(le.version!==xe.__version||ee===!0){t.activeTexture(s.TEXTURE0+X);const ve=it.getPrimaries(it.workingColorSpace),he=y.colorSpace===wn?null:it.getPrimaries(y.colorSpace),ue=y.colorSpace===wn||ve===he?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,y.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),t.pixelStorei(s.UNPACK_ALIGNMENT,y.unpackAlignment),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ue);const ye=y.isCompressedTexture||y.image[0].isCompressedTexture,Ue=y.image[0]&&y.image[0].isDataTexture,Te=[];for(let ge=0;ge<6;ge++)!ye&&!Ue?Te[ge]=m(y.image[ge],!0,i.maxCubemapSize):Te[ge]=Ue?y.image[ge].image:y.image[ge],Te[ge]=Re(y,Te[ge]);const Me=Te[0],Ge=r.convert(y.format,y.colorSpace),Xe=r.convert(y.type),Ze=_(y.internalFormat,Ge,Xe,y.normalized,y.colorSpace),W=y.isVideoTexture!==!0,Ee=xe.__version===void 0||ee===!0,de=le.dataReady;let Ae=T(y,Me);He(s.TEXTURE_CUBE_MAP,y);let Pe;if(ye){W&&Ee&&t.texStorage2D(s.TEXTURE_CUBE_MAP,Ae,Ze,Me.width,Me.height);for(let ge=0;ge<6;ge++){Pe=Te[ge].mipmaps;for(let ze=0;ze<Pe.length;ze++){const Oe=Pe[ze];y.format!==1023?Ge!==null?W?de&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,ze,0,0,Oe.width,Oe.height,Ge,Oe.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,ze,Ze,Oe.width,Oe.height,0,Oe.data):Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):W?de&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,ze,0,0,Oe.width,Oe.height,Ge,Xe,Oe.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,ze,Ze,Oe.width,Oe.height,0,Ge,Xe,Oe.data)}}}else{if(Pe=y.mipmaps,W&&Ee){Pe.length>0&&Ae++;const ge=Ne(Te[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,Ae,Ze,ge.width,ge.height)}for(let ge=0;ge<6;ge++)if(Ue){W?de&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,0,0,Te[ge].width,Te[ge].height,Ge,Xe,Te[ge].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,Ze,Te[ge].width,Te[ge].height,0,Ge,Xe,Te[ge].data);for(let ze=0;ze<Pe.length;ze++){const mt=Pe[ze].image[ge].image;W?de&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,ze+1,0,0,mt.width,mt.height,Ge,Xe,mt.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,ze+1,Ze,mt.width,mt.height,0,Ge,Xe,mt.data)}}else{W?de&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,0,0,Ge,Xe,Te[ge]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,Ze,Ge,Xe,Te[ge]);for(let ze=0;ze<Pe.length;ze++){const Oe=Pe[ze];W?de&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,ze+1,0,0,Ge,Xe,Oe.image[ge]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,ze+1,Ze,Ge,Xe,Oe.image[ge])}}}p(y)&&M(s.TEXTURE_CUBE_MAP),xe.__version=le.version,y.onUpdate&&y.onUpdate(y)}q.__version=y.version}function k(q,y,X,ee,le,xe){const ve=r.convert(X.format,X.colorSpace),he=r.convert(X.type),ue=_(X.internalFormat,ve,he,X.normalized,X.colorSpace),ye=n.get(y),Ue=n.get(X);if(Ue.__renderTarget=y,!ye.__hasExternalTextures){const Te=Math.max(1,y.width>>xe),Me=Math.max(1,y.height>>xe);le===s.TEXTURE_3D||le===s.TEXTURE_2D_ARRAY?t.texImage3D(le,xe,ue,Te,Me,y.depth,0,ve,he,null):t.texImage2D(le,xe,ue,Te,Me,0,ve,he,null)}t.bindFramebuffer(s.FRAMEBUFFER,q),Y(y)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ee,le,Ue.__webglTexture,0,pe(y)):(le===s.TEXTURE_2D||le>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&le<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,ee,le,Ue.__webglTexture,xe),t.bindFramebuffer(s.FRAMEBUFFER,null)}function se(q,y,X){if(s.bindRenderbuffer(s.RENDERBUFFER,q),y.depthBuffer){const ee=y.depthTexture,le=ee&&ee.isDepthTexture?ee.type:null,xe=b(y.stencilBuffer,le),ve=y.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;Y(y)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,pe(y),xe,y.width,y.height):X?s.renderbufferStorageMultisample(s.RENDERBUFFER,pe(y),xe,y.width,y.height):s.renderbufferStorage(s.RENDERBUFFER,xe,y.width,y.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,ve,s.RENDERBUFFER,q)}else{const ee=y.textures;for(let le=0;le<ee.length;le++){const xe=ee[le],ve=r.convert(xe.format,xe.colorSpace),he=r.convert(xe.type),ue=_(xe.internalFormat,ve,he,xe.normalized,xe.colorSpace);Y(y)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,pe(y),ue,y.width,y.height):X?s.renderbufferStorageMultisample(s.RENDERBUFFER,pe(y),ue,y.width,y.height):s.renderbufferStorage(s.RENDERBUFFER,ue,y.width,y.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function _e(q,y,X){const ee=y.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(s.FRAMEBUFFER,q),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const le=n.get(y.depthTexture);if(le.__renderTarget=y,(!le.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),ee){if(le.__webglInit===void 0&&(le.__webglInit=!0,y.depthTexture.addEventListener("dispose",R)),le.__webglTexture===void 0){le.__webglTexture=s.createTexture(),t.bindTexture(s.TEXTURE_CUBE_MAP,le.__webglTexture),He(s.TEXTURE_CUBE_MAP,y.depthTexture);const ye=r.convert(y.depthTexture.format),Ue=r.convert(y.depthTexture.type);let Te;y.depthTexture.format===1026?Te=s.DEPTH_COMPONENT24:y.depthTexture.format===1027&&(Te=s.DEPTH24_STENCIL8);for(let Me=0;Me<6;Me++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Me,0,Te,y.width,y.height,0,ye,Ue,null)}}else z(y.depthTexture,0);const xe=le.__webglTexture,ve=pe(y),he=ee?s.TEXTURE_CUBE_MAP_POSITIVE_X+X:s.TEXTURE_2D,ue=y.depthTexture.format===1027?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(y.depthTexture.format===1026)Y(y)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ue,he,xe,0,ve):s.framebufferTexture2D(s.FRAMEBUFFER,ue,he,xe,0);else if(y.depthTexture.format===1027)Y(y)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ue,he,xe,0,ve):s.framebufferTexture2D(s.FRAMEBUFFER,ue,he,xe,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function C(q){const y=n.get(q),X=q.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==q.depthTexture){const ee=q.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),ee){const le=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,ee.removeEventListener("dispose",le)};ee.addEventListener("dispose",le),y.__depthDisposeCallback=le}y.__boundDepthTexture=ee}if(q.depthTexture&&!y.__autoAllocateDepthBuffer)if(X)for(let ee=0;ee<6;ee++)_e(y.__webglFramebuffer[ee],q,ee);else{const ee=q.texture.mipmaps;ee&&ee.length>0?_e(y.__webglFramebuffer[0],q,0):_e(y.__webglFramebuffer,q,0)}else if(X){y.__webglDepthbuffer=[];for(let ee=0;ee<6;ee++)if(t.bindFramebuffer(s.FRAMEBUFFER,y.__webglFramebuffer[ee]),y.__webglDepthbuffer[ee]===void 0)y.__webglDepthbuffer[ee]=s.createRenderbuffer(),se(y.__webglDepthbuffer[ee],q,!1);else{const le=q.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,xe=y.__webglDepthbuffer[ee];s.bindRenderbuffer(s.RENDERBUFFER,xe),s.framebufferRenderbuffer(s.FRAMEBUFFER,le,s.RENDERBUFFER,xe)}}else{const ee=q.texture.mipmaps;if(ee&&ee.length>0?t.bindFramebuffer(s.FRAMEBUFFER,y.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=s.createRenderbuffer(),se(y.__webglDepthbuffer,q,!1);else{const le=q.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,xe=y.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,xe),s.framebufferRenderbuffer(s.FRAMEBUFFER,le,s.RENDERBUFFER,xe)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function V(q,y,X){const ee=n.get(q);y!==void 0&&k(ee.__webglFramebuffer,q,q.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),X!==void 0&&C(q)}function F(q){const y=q.texture,X=n.get(q),ee=n.get(y);q.addEventListener("dispose",x);const le=q.textures,xe=q.isWebGLCubeRenderTarget===!0,ve=le.length>1;if(ve||(ee.__webglTexture===void 0&&(ee.__webglTexture=s.createTexture()),ee.__version=y.version,a.memory.textures++),xe){X.__webglFramebuffer=[];for(let he=0;he<6;he++)if(y.mipmaps&&y.mipmaps.length>0){X.__webglFramebuffer[he]=[];for(let ue=0;ue<y.mipmaps.length;ue++)X.__webglFramebuffer[he][ue]=s.createFramebuffer()}else X.__webglFramebuffer[he]=s.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){X.__webglFramebuffer=[];for(let he=0;he<y.mipmaps.length;he++)X.__webglFramebuffer[he]=s.createFramebuffer()}else X.__webglFramebuffer=s.createFramebuffer();if(ve)for(let he=0,ue=le.length;he<ue;he++){const ye=n.get(le[he]);ye.__webglTexture===void 0&&(ye.__webglTexture=s.createTexture(),a.memory.textures++)}if(q.samples>0&&Y(q)===!1){X.__webglMultisampledFramebuffer=s.createFramebuffer(),X.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let he=0;he<le.length;he++){const ue=le[he];X.__webglColorRenderbuffer[he]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,X.__webglColorRenderbuffer[he]);const ye=r.convert(ue.format,ue.colorSpace),Ue=r.convert(ue.type),Te=_(ue.internalFormat,ye,Ue,ue.normalized,ue.colorSpace,q.isXRRenderTarget===!0),Me=pe(q);s.renderbufferStorageMultisample(s.RENDERBUFFER,Me,Te,q.width,q.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+he,s.RENDERBUFFER,X.__webglColorRenderbuffer[he])}s.bindRenderbuffer(s.RENDERBUFFER,null),q.depthBuffer&&(X.__webglDepthRenderbuffer=s.createRenderbuffer(),se(X.__webglDepthRenderbuffer,q,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(xe){t.bindTexture(s.TEXTURE_CUBE_MAP,ee.__webglTexture),He(s.TEXTURE_CUBE_MAP,y);for(let he=0;he<6;he++)if(y.mipmaps&&y.mipmaps.length>0)for(let ue=0;ue<y.mipmaps.length;ue++)k(X.__webglFramebuffer[he][ue],q,y,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+he,ue);else k(X.__webglFramebuffer[he],q,y,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+he,0);p(y)&&M(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ve){for(let he=0,ue=le.length;he<ue;he++){const ye=le[he],Ue=n.get(ye);let Te=s.TEXTURE_2D;(q.isWebGL3DRenderTarget||q.isWebGLArrayRenderTarget)&&(Te=q.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(Te,Ue.__webglTexture),He(Te,ye),k(X.__webglFramebuffer,q,ye,s.COLOR_ATTACHMENT0+he,Te,0),p(ye)&&M(Te)}t.unbindTexture()}else{let he=s.TEXTURE_2D;if((q.isWebGL3DRenderTarget||q.isWebGLArrayRenderTarget)&&(he=q.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(he,ee.__webglTexture),He(he,y),y.mipmaps&&y.mipmaps.length>0)for(let ue=0;ue<y.mipmaps.length;ue++)k(X.__webglFramebuffer[ue],q,y,s.COLOR_ATTACHMENT0,he,ue);else k(X.__webglFramebuffer,q,y,s.COLOR_ATTACHMENT0,he,0);p(y)&&M(he),t.unbindTexture()}q.depthBuffer&&C(q)}function K(q){const y=q.textures;for(let X=0,ee=y.length;X<ee;X++){const le=y[X];if(p(le)){const xe=A(q),ve=n.get(le).__webglTexture;t.bindTexture(xe,ve),M(xe),t.unbindTexture()}}}const j=[],ce=[];function me(q){if(q.samples>0){if(Y(q)===!1){const y=q.textures,X=q.width,ee=q.height;let le=s.COLOR_BUFFER_BIT;const xe=q.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ve=n.get(q),he=y.length>1;if(he)for(let ye=0;ye<y.length;ye++)t.bindFramebuffer(s.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ye,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,ve.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ye,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,ve.__webglMultisampledFramebuffer);const ue=q.texture.mipmaps;ue&&ue.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ve.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ve.__webglFramebuffer);for(let ye=0;ye<y.length;ye++){if(q.resolveDepthBuffer&&(q.depthBuffer&&(le|=s.DEPTH_BUFFER_BIT),q.stencilBuffer&&q.resolveStencilBuffer&&(le|=s.STENCIL_BUFFER_BIT)),he){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ve.__webglColorRenderbuffer[ye]);const Ue=n.get(y[ye]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Ue,0)}s.blitFramebuffer(0,0,X,ee,0,0,X,ee,le,s.NEAREST),l===!0&&(j.length=0,ce.length=0,j.push(s.COLOR_ATTACHMENT0+ye),q.depthBuffer&&q.storeMultisampledDepthBuffer===!1&&(j.push(xe),ce.push(xe),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,ce)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,j))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),he)for(let ye=0;ye<y.length;ye++){t.bindFramebuffer(s.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ye,s.RENDERBUFFER,ve.__webglColorRenderbuffer[ye]);const Ue=n.get(y[ye]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,ve.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ye,s.TEXTURE_2D,Ue,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ve.__webglMultisampledFramebuffer)}else if(q.depthBuffer&&q.storeMultisampledDepthBuffer===!1&&l){const y=q.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[y])}}}function pe(q){return Math.min(i.maxSamples,q.samples)}function Y(q){const y=n.get(q);return q.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function S(q){const y=a.render.frame;h.get(q)!==y&&(h.set(q,y),q.update())}function Re(q,y){const X=q.colorSpace,ee=q.format,le=q.type;return q.isCompressedTexture===!0||q.isVideoTexture===!0||X!==Bt&&X!==wn&&(it.getTransfer(X)===ht?(ee!==1023||le!==1009)&&Be("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ke("WebGLTextures: Unsupported texture color space:",X)),y}function Ne(q){return typeof HTMLImageElement!="undefined"&&q instanceof HTMLImageElement?(c.width=q.naturalWidth||q.width,c.height=q.naturalHeight||q.height):typeof VideoFrame!="undefined"&&q instanceof VideoFrame?(c.width=q.displayWidth,c.height=q.displayHeight):(c.width=q.width,c.height=q.height),c}this.allocateTextureUnit=re,this.resetTextureUnits=J,this.getTextureUnits=G,this.setTextureUnits=Z,this.setTexture2D=z,this.setTexture2DArray=Q,this.setTexture3D=ie,this.setTextureCube=oe,this.rebindTextures=V,this.setupRenderTarget=F,this.updateRenderTargetMipmap=K,this.updateMultisampleRenderTarget=me,this.setupDepthRenderbuffer=C,this.setupFrameBufferTexture=k,this.useMultisampledRTT=Y,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Rp(s,e){function t(n,i=wn){let r;const a=it.getTransfer(i);if(n===1009)return s.UNSIGNED_BYTE;if(n===1017)return s.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return s.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return s.BYTE;if(n===1011)return s.SHORT;if(n===1012)return s.UNSIGNED_SHORT;if(n===1013)return s.INT;if(n===1014)return s.UNSIGNED_INT;if(n===1015)return s.FLOAT;if(n===1016)return s.HALF_FLOAT;if(n===1021)return s.ALPHA;if(n===1022)return s.RGB;if(n===1023)return s.RGBA;if(n===1026)return s.DEPTH_COMPONENT;if(n===1027)return s.DEPTH_STENCIL;if(n===1028)return s.RED;if(n===1029)return s.RED_INTEGER;if(n===1030)return s.RG;if(n===1031)return s.RG_INTEGER;if(n===1033)return s.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779)if(a===ht)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===33776)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===33776)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===35840||n===35841||n===35842||n===35843)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===35840)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===36196||n===37492)return a===ht?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===37496)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return r.COMPRESSED_R11_EAC;if(n===37489)return r.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return r.COMPRESSED_RG11_EAC;if(n===37491)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===37808)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===36492||n===36494||n===36495)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===36492)return a===ht?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===36283||n===36284||n===36285||n===36286)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===36283)return r.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===1020?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}const Cp=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,qp=`
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

}`;class Pp{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new xo(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new un({vertexShader:Cp,fragmentShader:qp,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new tt(new Zi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Ip extends Rn{constructor(e,t){super();const n=this;let i=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null;const v=typeof XRWebGLBinding!="undefined",m=new Pp,p={},M=t.getContextAttributes();let A=null,_=null;const b=[],T=[],R=new fe;let x=null,w=null;const I=new Ft;I.viewport=new dt;const O=new Ft;O.viewport=new dt;const B=[I,O],J=new au;let G=null,Z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(D){let N=b[D];return N===void 0&&(N=new hr,b[D]=N),N.getTargetRaySpace()},this.getControllerGrip=function(D){let N=b[D];return N===void 0&&(N=new hr,b[D]=N),N.getGripSpace()},this.getHand=function(D){let N=b[D];return N===void 0&&(N=new hr,b[D]=N),N.getHandSpace()};function re(D){const N=T.indexOf(D.inputSource);if(N===-1)return;const L=b[N];L!==void 0&&(L.update(D.inputSource,D.frame,c||a),L.dispatchEvent({type:D.type,data:D.inputSource}))}function $(){i.removeEventListener("select",re),i.removeEventListener("selectstart",re),i.removeEventListener("selectend",re),i.removeEventListener("squeeze",re),i.removeEventListener("squeezestart",re),i.removeEventListener("squeezeend",re),i.removeEventListener("end",$),i.removeEventListener("inputsourceschange",z);for(let D=0;D<b.length;D++){const N=T[D];N!==null&&(T[D]=null,b[D].disconnect(N))}G=null,Z=null,m.reset();for(const D in p)delete p[D];if(e.setRenderTarget(A),f=null,d=null,u=null,i=null,_=null,Je.stop(),n.isPresenting=!1,e.setPixelRatio(x),e.setSize(R.width,R.height,!1),w!==null){const D=w.camera;D.fov=w.fov,D.zoom=w.zoom,D.updateProjectionMatrix(),w=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(D){r=D,n.isPresenting===!0&&Be("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(D){o=D,n.isPresenting===!0&&Be("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(D){c=D},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(i,t)),u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(D){if(i=D,i!==null){if(A=e.getRenderTarget(),i.addEventListener("select",re),i.addEventListener("selectstart",re),i.addEventListener("selectend",re),i.addEventListener("squeeze",re),i.addEventListener("squeezestart",re),i.addEventListener("squeezeend",re),i.addEventListener("end",$),i.addEventListener("inputsourceschange",z),M.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(R),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let L=null,P=null,k=null;M.depth&&(k=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,L=M.stencil?1027:1026,P=M.stencil?1020:1014);const se={colorFormat:t.RGBA8,depthFormat:k,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(se),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),_=new Qt(d.textureWidth,d.textureHeight,{format:1023,type:1009,depthTexture:new zi(d.textureWidth,d.textureHeight,P,void 0,void 0,void 0,void 0,void 0,void 0,L),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{const L={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,t,L),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new Qt(f.framebufferWidth,f.framebufferHeight,{format:1023,type:1009,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),Je.setContext(i),Je.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function z(D){for(let N=0;N<D.removed.length;N++){const L=D.removed[N],P=T.indexOf(L);P>=0&&(T[P]=null,b[P].disconnect(L))}for(let N=0;N<D.added.length;N++){const L=D.added[N];let P=T.indexOf(L);if(P===-1){for(let se=0;se<b.length;se++)if(se>=T.length){T.push(L),P=se;break}else if(T[se]===null){T[se]=L,P=se;break}if(P===-1)break}const k=b[P];k&&k.connect(L)}}const Q=new U,ie=new U;function oe(D,N,L){Q.setFromMatrixPosition(N.matrixWorld),ie.setFromMatrixPosition(L.matrixWorld);const P=Q.distanceTo(ie),k=N.projectionMatrix.elements,se=L.projectionMatrix.elements,_e=k[14]/(k[10]-1),C=k[14]/(k[10]+1),V=(k[9]+1)/k[5],F=(k[9]-1)/k[5],K=(k[8]-1)/k[0],j=(se[8]+1)/se[0],ce=_e*K,me=_e*j,pe=P/(-K+j),Y=pe*-K;if(N.matrixWorld.decompose(D.position,D.quaternion,D.scale),D.translateX(Y),D.translateZ(pe),D.matrixWorld.compose(D.position,D.quaternion,D.scale),D.matrixWorldInverse.copy(D.matrixWorld).invert(),k[10]===-1)D.projectionMatrix.copy(N.projectionMatrix),D.projectionMatrixInverse.copy(N.projectionMatrixInverse);else{const S=_e+pe,Re=C+pe,Ne=ce-Y,q=me+(P-Y),y=V*C/Re*S,X=F*C/Re*S;D.projectionMatrix.makePerspective(Ne,q,y,X,S,Re),D.projectionMatrixInverse.copy(D.projectionMatrix).invert()}}function Se(D,N){N===null?D.matrixWorld.copy(D.matrix):D.matrixWorld.multiplyMatrices(N.matrixWorld,D.matrix),D.matrixWorldInverse.copy(D.matrixWorld).invert()}this.updateCamera=function(D){if(i===null)return;let N=D.near,L=D.far;m.texture!==null&&(m.depthNear>0&&(N=m.depthNear),m.depthFar>0&&(L=m.depthFar)),J.near=O.near=I.near=N,J.far=O.far=I.far=L,(G!==J.near||Z!==J.far)&&(i.updateRenderState({depthNear:J.near,depthFar:J.far}),G=J.near,Z=J.far),J.layers.mask=D.layers.mask|6,I.layers.mask=J.layers.mask&-5,O.layers.mask=J.layers.mask&-3;const P=D.parent,k=J.cameras;Se(J,P);for(let se=0;se<k.length;se++)Se(k[se],P);k.length===2?oe(J,I,O):J.projectionMatrix.copy(I.projectionMatrix),w===null&&D.isPerspectiveCamera&&(w={camera:D,fov:D.fov,zoom:D.zoom}),be(D,J,P)};function be(D,N,L){L===null?D.matrix.copy(N.matrixWorld):(D.matrix.copy(L.matrixWorld),D.matrix.invert(),D.matrix.multiply(N.matrixWorld)),D.matrix.decompose(D.position,D.quaternion,D.scale),D.updateMatrixWorld(!0),D.projectionMatrix.copy(N.projectionMatrix),D.projectionMatrixInverse.copy(N.projectionMatrixInverse),D.isPerspectiveCamera&&(D.fov=jn*2*Math.atan(1/D.projectionMatrix.elements[5]),D.zoom=1)}this.getCamera=function(){return J},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(D){l=D,d!==null&&(d.fixedFoveation=D),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=D)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(J)},this.getCameraTexture=function(D){return p[D]};let Ye=null;function He(D,N){if(h=N.getViewerPose(c||a),g=N,h!==null){const L=h.views;f!==null&&(e.setRenderTargetFramebuffer(_,f.framebuffer),e.setRenderTarget(_));let P=!1;L.length!==J.cameras.length&&(J.cameras.length=0,P=!0);for(let C=0;C<L.length;C++){const V=L[C];let F=null;if(f!==null)F=f.getViewport(V);else{const j=u.getViewSubImage(d,V);F=j.viewport,C===0&&(e.setRenderTargetTextures(_,j.colorTexture,j.depthStencilTexture),e.setRenderTarget(_))}let K=B[C];K===void 0&&(K=new Ft,K.layers.enable(C),K.viewport=new dt,B[C]=K),K.matrix.fromArray(V.transform.matrix),K.matrix.decompose(K.position,K.quaternion,K.scale),K.projectionMatrix.fromArray(V.projectionMatrix),K.projectionMatrixInverse.copy(K.projectionMatrix).invert(),K.viewport.set(F.x,F.y,F.width,F.height),C===0&&(J.matrix.copy(K.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale)),P===!0&&J.cameras.push(K)}const k=i.enabledFeatures;if(k&&k.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&v){u=n.getBinding();const C=u.getDepthInformation(L[0]);C&&C.isValid&&C.texture&&m.init(C,i.renderState)}if(k&&k.includes("camera-access")&&v){e.state.unbindTexture(),u=n.getBinding();for(let C=0;C<L.length;C++){const V=L[C].camera;if(V){let F=p[V];F||(F=new xo,p[V]=F);const K=u.getCameraImage(V);F.sourceTexture=K}}}}for(let L=0;L<b.length;L++){const P=T[L],k=b[L];P!==null&&k!==void 0&&k.update(P,N,c||a)}Ye&&Ye(D,N),N.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:N}),g=null}const Je=new Qo;Je.setAnimationLoop(He),this.setAnimationLoop=function(D){Ye=D},this.dispose=function(){}}}const Lp=new $e,Al=new Ve;Al.set(-1,0,0,0,1,0,0,0,1);function Np(s,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,No(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,M,A,_){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(m,p):p.isMeshLambertMaterial?(r(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,_)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),v(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,M,A):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===1&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===1&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const M=e.get(p),A=M.envMap,_=M.envMapRotation;A&&(m.envMap.value=A,m.envMapRotation.value.setFromMatrix4(Lp.makeRotationFromEuler(_)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Al),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,M,A){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*M,m.scale.value=A*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,M){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===1&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.retroreflectivity>0&&(m.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const M=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Dp(s,e,t,n){let i={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,b){const T=b.program;n.uniformBlockBinding(_,T)}function c(_,b){let T=i[_.id];T===void 0&&(m(_),T=h(_),i[_.id]=T,_.addEventListener("dispose",M));const R=b.program;n.updateUBOMapping(_,R);const x=e.render.frame;r[_.id]!==x&&(d(_),r[_.id]=x)}function h(_){const b=u();_.__bindingPointIndex=b;const T=s.createBuffer(),R=_.__size,x=_.usage;return s.bindBuffer(s.UNIFORM_BUFFER,T),s.bufferData(s.UNIFORM_BUFFER,R,x),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,b,T),T}function u(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return Ke("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(_){const b=i[_.id],T=_.uniforms,R=_.__cache;s.bindBuffer(s.UNIFORM_BUFFER,b);for(let x=0,w=T.length;x<w;x++){const I=T[x];if(Array.isArray(I))for(let O=0,B=I.length;O<B;O++)f(I[O],x,O,R);else f(I,x,0,R)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(_,b,T,R){if(v(_,b,T,R)===!0){const x=_.__offset,w=_.value;if(Array.isArray(w)){let I=0;for(let O=0;O<w.length;O++){const B=w[O],J=p(B);g(B,_.__data,I),typeof B!="number"&&typeof B!="boolean"&&!B.isMatrix3&&!ArrayBuffer.isView(B)&&(I+=J.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(w,_.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,x,_.__data)}}function g(_,b,T){typeof _=="number"||typeof _=="boolean"?b[0]=_:_.isMatrix3?(b[0]=_.elements[0],b[1]=_.elements[1],b[2]=_.elements[2],b[3]=0,b[4]=_.elements[3],b[5]=_.elements[4],b[6]=_.elements[5],b[7]=0,b[8]=_.elements[6],b[9]=_.elements[7],b[10]=_.elements[8],b[11]=0):ArrayBuffer.isView(_)?b.set(new _.constructor(_.buffer,_.byteOffset,b.length)):_.toArray(b,T)}function v(_,b,T,R){const x=_.value,w=b+"_"+T;if(R[w]===void 0)return typeof x=="number"||typeof x=="boolean"?R[w]=x:ArrayBuffer.isView(x)?R[w]=x.slice():R[w]=x.clone(),!0;{const I=R[w];if(typeof x=="number"||typeof x=="boolean"){if(I!==x)return R[w]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(I.equals(x)===!1)return I.copy(x),!0}}return!1}function m(_){const b=_.uniforms;let T=0;const R=16;for(let w=0,I=b.length;w<I;w++){const O=Array.isArray(b[w])?b[w]:[b[w]];for(let B=0,J=O.length;B<J;B++){const G=O[B],Z=Array.isArray(G.value)?G.value:[G.value];for(let re=0,$=Z.length;re<$;re++){const z=Z[re],Q=p(z),ie=T%R,oe=ie%Q.boundary,Se=ie+oe;T+=oe,Se!==0&&R-Se<Q.storage&&(T+=R-Se),G.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=T,T+=Q.storage}}}const x=T%R;return x>0&&(T+=R-x),_.__size=T,_.__cache={},this}function p(_){const b={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(b.boundary=4,b.storage=4):_.isVector2?(b.boundary=8,b.storage=8):_.isVector3||_.isColor?(b.boundary=16,b.storage=12):_.isVector4?(b.boundary=16,b.storage=16):_.isMatrix3?(b.boundary=48,b.storage=48):_.isMatrix4?(b.boundary=64,b.storage=64):_.isTexture?Be("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(_)?(b.boundary=16,b.storage=_.byteLength):Be("WebGLRenderer: Unsupported uniform value type.",_),b}function M(_){const b=_.target;b.removeEventListener("dispose",M);const T=a.indexOf(b.__bindingPointIndex);a.splice(T,1),s.deleteBuffer(i[b.id]),delete i[b.id],delete r[b.id]}function A(){for(const _ in i)s.deleteBuffer(i[_]);a=[],i={},r={}}return{bind:l,update:c,dispose:A}}const Fp=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let pn=null;function Up(){return pn===null&&(pn=new Rr(Fp,16,16,1030,1016),pn.name="DFG_LUT",pn.minFilter=1006,pn.magFilter=1006,pn.wrapS=1001,pn.wrapT=1001,pn.generateMipmaps=!1,pn.needsUpdate=!0),pn}class Op{constructor(e={}){const{canvas:t=ec(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=1009}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext!="undefined"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const v=f,m=new Set([1033,1031,1029]),p=new Set([1009,1014,1012,1020,1017,1018]),M=new Uint32Array(4),A=new Int32Array(4),_=new U;let b=null,T=null;const R=[],x=[];let w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const I=this;let O=!1,B=null,J=null,G=null,Z=null;this._outputColorSpace=St;let re=0,$=0,z=null,Q=-1,ie=null;const oe=new dt,Se=new dt;let be=null;const Ye=new We(0);let He=0,Je=t.width,D=t.height,N=1,L=null,P=null;const k=new dt(0,0,Je,D),se=new dt(0,0,Je,D);let _e=!1;const C=new qr;let V=!1,F=!1;const K=new $e,j=new U,ce=new dt,me={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let pe=!1;function Y(){return z===null?N:1}let S=n;function Re(E,H){return t.getContext(E,H)}let Ne,q,y,X,ee,le,xe,ve,he,ue,ye,Ue,Te,Me,Ge,Xe,Ze,W,Ee,de,Ae,Pe,ge;try{const E={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${nr}`),t.addEventListener("webglcontextlost",mt,!1),t.addEventListener("webglcontextrestored",lt,!1),t.addEventListener("webglcontextcreationerror",ln,!1),S===null){const H="webgl2";if(S=Re(H,E),S===null)throw Re(H)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}ze()}catch(E){throw t.removeEventListener("webglcontextlost",mt,!1),t.removeEventListener("webglcontextrestored",lt,!1),t.removeEventListener("webglcontextcreationerror",ln,!1),Ke("WebGLRenderer: "+E.message),E}function ze(){Ne=new Uf(S),Ne.init(),Ae=new Rp(S,Ne),q=new wf(S,Ne,e,Ae),y=new Ap(S,Ne),q.reversedDepthBuffer&&d&&y.buffers.depth.setReversed(!0),J=S.createFramebuffer(),G=S.createFramebuffer(),Z=S.createFramebuffer(),X=new kf(S),ee=new dp,le=new wp(S,Ne,y,ee,q,Ae,X),xe=new Ff(I),ve=new Su(S),Pe=new Ef(S,ve),he=new Of(S,ve,X,Pe),ue=new zf(S,he,ve,Pe,X),W=new Gf(S,q,le),Ge=new Rf(ee),ye=new up(I,xe,Ne,q,Pe,Ge),Ue=new Np(I,ee),Te=new pp,Me=new yp(Ne),Ze=new Tf(I,xe,y,ue,g,l),Xe=new Ep(I,ue,q),ge=new Dp(S,X,q,y),Ee=new Af(S,Ne,X),de=new Bf(S,Ne,X),X.programs=ye.programs,I.capabilities=q,I.extensions=Ne,I.properties=ee,I.renderLists=Te,I.shadowMap=Xe,I.state=y,I.info=X}v!==1009&&(w=new Hf(v,t.width,t.height,o,i,r));const Oe=new Ip(I,S);this.xr=Oe,this.getContext=function(){return S},this.getContextAttributes=function(){return S.getContextAttributes()},this.forceContextLoss=function(){const E=Ne.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Ne.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return N},this.setPixelRatio=function(E){E!==void 0&&(N=E,this.setSize(Je,D,!1))},this.getSize=function(E){return E.set(Je,D)},this.setSize=function(E,H,ae=!0){if(Oe.isPresenting){Be("WebGLRenderer: Can't change size while VR device is presenting.");return}Je=E,D=H,t.width=Math.floor(E*N),t.height=Math.floor(H*N),ae===!0&&(t.style.width=E+"px",t.style.height=H+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,E,H)},this.getDrawingBufferSize=function(E){return E.set(Je*N,D*N).floor()},this.setDrawingBufferSize=function(E,H,ae){Je=E,D=H,N=ae,t.width=Math.floor(E*ae),t.height=Math.floor(H*ae),this.setViewport(0,0,E,H)},this.setEffects=function(E){if(v===1009){Ke("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(E){for(let H=0;H<E.length;H++)if(E[H].isOutputPass===!0){Be("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(E||[])},this.getCurrentViewport=function(E){return E.copy(oe)},this.getViewport=function(E){return E.copy(k)},this.setViewport=function(E,H,ae,te){E.isVector4?k.set(E.x,E.y,E.z,E.w):k.set(E,H,ae,te),y.viewport(oe.copy(k).multiplyScalar(N).round())},this.getScissor=function(E){return E.copy(se)},this.setScissor=function(E,H,ae,te){E.isVector4?se.set(E.x,E.y,E.z,E.w):se.set(E,H,ae,te),y.scissor(Se.copy(se).multiplyScalar(N).round())},this.getScissorTest=function(){return _e},this.setScissorTest=function(E){y.setScissorTest(_e=E)},this.setOpaqueSort=function(E){L=E},this.setTransparentSort=function(E){P=E},this.getClearColor=function(E){return E.copy(Ze.getClearColor())},this.setClearColor=function(){Ze.setClearColor(...arguments)},this.getClearAlpha=function(){return Ze.getClearAlpha()},this.setClearAlpha=function(){Ze.setClearAlpha(...arguments)},this.clear=function(E=!0,H=!0,ae=!0){let te=0;if(E){let ne=!1;if(z!==null){const qe=z.texture.format;ne=m.has(qe)}if(ne){const qe=z.texture.type,Le=p.has(qe),Ce=Ze.getClearColor(),De=Ze.getClearAlpha(),ke=Ce.r,je=Ce.g,rt=Ce.b;Le?(M[0]=ke,M[1]=je,M[2]=rt,M[3]=De,S.clearBufferuiv(S.COLOR,0,M)):(A[0]=ke,A[1]=je,A[2]=rt,A[3]=De,S.clearBufferiv(S.COLOR,0,A))}else te|=S.COLOR_BUFFER_BIT}H&&(te|=S.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),ae&&(te|=S.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),te!==0&&S.clear(te)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(E){E.setRenderer(this),B=E},this.dispose=function(){t.removeEventListener("webglcontextlost",mt,!1),t.removeEventListener("webglcontextrestored",lt,!1),t.removeEventListener("webglcontextcreationerror",ln,!1),Ze.dispose(),Te.dispose(),Me.dispose(),ee.dispose(),xe.dispose(),ue.dispose(),Pe.dispose(),ge.dispose(),ye.dispose(),Oe.dispose(),Oe.removeEventListener("sessionstart",zl),Oe.removeEventListener("sessionend",Vl),$n.stop()};function mt(E){E.preventDefault(),cs("WebGLRenderer: Context Lost."),O=!0}function lt(){cs("WebGLRenderer: Context Restored."),O=!1;const E=X.autoReset,H=Xe.enabled,ae=Xe.autoUpdate,te=Xe.needsUpdate,ne=Xe.type;ze(),X.autoReset=E,Xe.enabled=H,Xe.autoUpdate=ae,Xe.needsUpdate=te,Xe.type=ne}function ln(E){Ke("WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function gn(E){const H=E.target;H.removeEventListener("dispose",gn),O0(H)}function O0(E){B0(E),ee.remove(E)}function B0(E){const H=ee.get(E).programs;H!==void 0&&(H.forEach(function(ae){ye.releaseProgram(ae)}),E.isShaderMaterial&&ye.releaseShaderCache(E))}this.renderBufferDirect=function(E,H,ae,te,ne,qe){H===null&&(H=me);const Le=ne.isMesh&&ne.matrixWorld.determinantAffine()<0,Ce=z0(E,H,ae,te,ne);y.setMaterial(te,Le);let De=ae.index,ke=1;if(te.wireframe===!0){if(De=he.getWireframeAttribute(ae),De===void 0)return;ke=2}const je=ae.drawRange,rt=ae.attributes.position;let Fe=je.start*ke,ct=(je.start+je.count)*ke;qe!==null&&(Fe=Math.max(Fe,qe.start*ke),ct=Math.min(ct,(qe.start+qe.count)*ke)),De!==null?(Fe=Math.max(Fe,0),ct=Math.min(ct,De.count)):rt!=null&&(Fe=Math.max(Fe,0),ct=Math.min(ct,rt.count));const At=ct-Fe;if(At<0||At===1/0)return;Pe.setup(ne,te,Ce,ae,De);let xt,pt=Ee;if(De!==null&&(xt=ve.get(De),pt=de,pt.setIndex(xt)),ne.isMesh)te.wireframe===!0?(y.setLineWidth(te.wireframeLinewidth*Y()),pt.setMode(S.LINES)):pt.setMode(S.TRIANGLES);else if(ne.isLine){let Lt=te.linewidth;Lt===void 0&&(Lt=1),y.setLineWidth(Lt*Y()),ne.isLineSegments?pt.setMode(S.LINES):ne.isLineLoop?pt.setMode(S.LINE_LOOP):pt.setMode(S.LINE_STRIP)}else ne.isPoints?pt.setMode(S.POINTS):ne.isSprite&&pt.setMode(S.TRIANGLES);if(ne.isBatchedMesh)if(Ne.get("WEBGL_multi_draw"))pt.renderMultiDraw(ne._multiDrawStarts,ne._multiDrawCounts,ne._multiDrawCount);else{const Lt=ne._multiDrawStarts,Ie=ne._multiDrawCounts,Ut=ne._multiDrawCount,at=De?ve.get(De).bytesPerElement:1,Zt=ee.get(te).currentProgram.getUniforms();for(let _n=0;_n<Ut;_n++)Zt.setValue(S,"_gl_DrawID",_n),pt.render(Lt[_n]/at,Ie[_n])}else if(ne.isInstancedMesh)pt.renderInstances(Fe,At,ne.count);else if(ae.isInstancedBufferGeometry){const Lt=ae._maxInstanceCount!==void 0?ae._maxInstanceCount:1/0,Ie=Math.min(ae.instanceCount,Lt);pt.renderInstances(Fe,At,Ie)}else pt.render(Fe,At)};function Gl(E,H,ae,te){B!==null&&E.isNodeMaterial&&B.setObject(te,E),V===!0&&Ge.setState(E,ae,!1),E.transparent===!0&&E.side===2&&E.forceSinglePass===!1?(E.side=1,E.needsUpdate=!0,tr(E,H,te),E.side=0,E.needsUpdate=!0,tr(E,H,te),E.side=2):tr(E,H,te)}this.compile=function(E,H,ae=null){ae===null&&(ae=E),B!==null&&B.renderStart(E,H,ae),T=Me.get(ae),T.init(H),x.push(T),ae.traverseVisible(function(ne){ne.isLight&&ne.layers.test(H.layers)&&(T.pushLight(ne),ne.castShadow&&T.pushShadow(ne))}),E!==ae&&E.traverseVisible(function(ne){ne.isLight&&ne.layers.test(H.layers)&&(T.pushLight(ne),ne.castShadow&&T.pushShadow(ne))}),T.setupLights(),B!==null&&B.updateLights(T.state.lightsArray),F=this.localClippingEnabled,V=Ge.init(this.clippingPlanes,F),V===!0&&Ge.setGlobalState(this.clippingPlanes,H),B!==null&&Xe.render(T.state.shadowsArray,ae,H);const te=new Set;return E.traverse(function(ne){if(!(ne.isMesh||ne.isPoints||ne.isLine||ne.isSprite))return;const qe=ne.material;if(qe)if(Array.isArray(qe))for(let Le=0;Le<qe.length;Le++){const Ce=qe[Le];Gl(Ce,ae,H,ne),te.add(Ce)}else Gl(qe,ae,H,ne),te.add(qe)}),T=x.pop(),B!==null&&B.renderEnd(),te},this.compileAsync=function(E,H,ae=null){const te=this.compile(E,H,ae);return new Promise(ne=>{function qe(){if(te.forEach(function(Le){const De=ee.get(Le).currentProgram;(De===void 0||De.isReady())&&te.delete(Le)}),te.size===0){ne(E);return}setTimeout(qe,10)}Ne.get("KHR_parallel_shader_compile")!==null?qe():setTimeout(qe,10)})};let Ea=null;function k0(E){Ea&&Ea(E)}function zl(){$n.stop()}function Vl(){$n.start()}const $n=new Qo;$n.setAnimationLoop(k0),typeof self!="undefined"&&$n.setContext(self),this.setAnimationLoop=function(E){Ea=E,Oe.setAnimationLoop(E),E===null?$n.stop():$n.start()},Oe.addEventListener("sessionstart",zl),Oe.addEventListener("sessionend",Vl),this.render=function(E,H){if(H!==void 0&&H.isCamera!==!0){Ke("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(O===!0)return;B!==null&&B.renderStart(E,H);const ae=Oe.enabled===!0&&Oe.isPresenting===!0,te=w!==null&&(z===null||ae)&&w.begin(I,z);if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),Oe.enabled===!0&&Oe.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Oe.cameraAutoUpdate===!0&&Oe.updateCamera(H),H=Oe.getCamera()),E.isScene===!0&&E.onBeforeRender(I,E,H,z),T=Me.get(E,x.length),T.init(H),T.state.textureUnits=le.getTextureUnits(),x.push(T),K.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),C.setFromProjectionMatrix(K,2e3,H.reversedDepth),F=this.localClippingEnabled,V=Ge.init(this.clippingPlanes,F),b=Te.get(E,R.length),b.init(),R.push(b),Oe.enabled===!0&&Oe.isPresenting===!0){const Le=I.xr.getDepthSensingMesh();Le!==null&&Aa(Le,H,-1/0,I.sortObjects)}Aa(E,H,0,I.sortObjects),b.finish(),B!==null&&B.updateLights(T.state.lightsArray),I.sortObjects===!0&&b.sort(L,P),pe=Oe.enabled===!1||Oe.isPresenting===!1||Oe.hasDepthSensing()===!1,pe&&Ze.addToRenderList(b,E),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),V===!0&&Ge.beginShadows();const ne=T.state.shadowsArray;if(Xe.render(ne,E,H),V===!0&&Ge.endShadows(),(te&&w.hasRenderPass())===!1){const Le=b.opaque,Ce=b.transmissive;if(T.setupLights(),H.isArrayCamera){const De=H.cameras;if(Ce.length>0)for(let ke=0,je=De.length;ke<je;ke++){const rt=De[ke];Wl(Le,Ce,E,rt)}pe&&Ze.render(E);for(let ke=0,je=De.length;ke<je;ke++){const rt=De[ke];Hl(b,E,rt,rt.viewport)}}else Ce.length>0&&Wl(Le,Ce,E,H),pe&&Ze.render(E),Hl(b,E,H)}z!==null&&$===0&&(le.updateMultisampleRenderTarget(z),le.updateRenderTargetMipmap(z)),te&&w.end(I),E.isScene===!0&&E.onAfterRender(I,E,H),Pe.resetDefaultState(),Q=-1,ie=null,x.pop(),x.length>0?(T=x[x.length-1],le.setTextureUnits(T.state.textureUnits),V===!0&&Ge.setGlobalState(I.clippingPlanes,T.state.camera)):T=null,R.pop(),R.length>0?b=R[R.length-1]:b=null,B!==null&&B.renderEnd()};function Aa(E,H,ae,te){if(E.visible===!1)return;if(E.layers.test(H.layers)){if(E.isGroup)ae=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(H);else if(E.isLightProbeGrid)T.pushLightProbeGrid(E);else if(E.isLight)T.pushLight(E),E.castShadow&&T.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||E.intersectsFrustum(C)){te&&ce.setFromMatrixPosition(E.matrixWorld).applyMatrix4(K);const Le=ue.update(E),Ce=E.material;Ce.visible&&b.push(E,Le,Ce,ae,ce.z,null,H)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||E.intersectsFrustum(C))){const Le=ue.update(E),Ce=E.material;if(te&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),ce.copy(E.boundingSphere.center)):(Le.boundingSphere===null&&Le.computeBoundingSphere(),ce.copy(Le.boundingSphere.center)),ce.applyMatrix4(E.matrixWorld).applyMatrix4(K)),Array.isArray(Ce)){const De=Le.groups;for(let ke=0,je=De.length;ke<je;ke++){const rt=De[ke],Fe=Ce[rt.materialIndex];Fe&&Fe.visible&&b.push(E,Le,Fe,ae,ce.z,rt,H)}}else Ce.visible&&b.push(E,Le,Ce,ae,ce.z,null,H)}}const qe=E.children;for(let Le=0,Ce=qe.length;Le<Ce;Le++)Aa(qe[Le],H,ae,te)}function Hl(E,H,ae,te){const{opaque:ne,transmissive:qe,transparent:Le}=E;T.setupLightsView(ae),V===!0&&Ge.setGlobalState(I.clippingPlanes,ae),te&&y.viewport(oe.copy(te)),ne.length>0&&er(ne,H,ae),qe.length>0&&er(qe,H,ae),Le.length>0&&er(Le,H,ae),y.buffers.depth.setTest(!0),y.buffers.depth.setMask(!0),y.buffers.color.setMask(!0),y.setPolygonOffset(!1)}function Wl(E,H,ae,te){if((ae.isScene===!0?ae.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[te.id]===void 0){const Fe=Ne.has("EXT_color_buffer_half_float")||Ne.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[te.id]=new Qt(1,1,{generateMipmaps:!0,type:Fe?1016:1009,minFilter:1008,samples:Math.max(4,q.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:it.workingColorSpace})}const qe=T.state.transmissionRenderTarget[te.id],Le=te.viewport||oe;qe.setSize(Le.z*I.transmissionResolutionScale,Le.w*I.transmissionResolutionScale);const Ce=I.getRenderTarget(),De=I.getActiveCubeFace(),ke=I.getActiveMipmapLevel();I.setRenderTarget(qe),I.getClearColor(Ye),He=I.getClearAlpha(),He<1&&I.setClearColor(16777215,.5),I.clear(),pe&&Ze.render(ae);const je=I.toneMapping;I.toneMapping=0;const rt=te.viewport;if(te.viewport!==void 0&&(te.viewport=void 0),T.setupLightsView(te),V===!0&&Ge.setGlobalState(I.clippingPlanes,te),er(E,ae,te),le.updateMultisampleRenderTarget(qe),le.updateRenderTargetMipmap(qe),Ne.has("WEBGL_multisampled_render_to_texture")===!1){let Fe=!1;for(let ct=0,At=H.length;ct<At;ct++){const xt=H[ct],{object:pt,geometry:Lt,material:Ie,group:Ut}=xt;if(Ie.side===2&&pt.layers.test(te.layers)){const at=Ie.side;Ie.side=1,Ie.needsUpdate=!0,Xl(pt,ae,te,Lt,Ie,Ut),Ie.side=at,Ie.needsUpdate=!0,Fe=!0}}Fe===!0&&(le.updateMultisampleRenderTarget(qe),le.updateRenderTargetMipmap(qe))}I.setRenderTarget(Ce,De,ke),I.setClearColor(Ye,He),rt!==void 0&&(te.viewport=rt),I.toneMapping=je}function er(E,H,ae){const te=H.isScene===!0?H.overrideMaterial:null;for(let ne=0,qe=E.length;ne<qe;ne++){const Le=E[ne],{object:Ce,geometry:De,group:ke}=Le;let je=Le.material;je.allowOverride===!0&&te!==null&&(je=te),Ce.layers.test(ae.layers)&&Xl(Ce,H,ae,De,je,ke)}}function Xl(E,H,ae,te,ne,qe){B!==null&&ne.isNodeMaterial&&B.setObject(E,ne),E.onBeforeRender(I,H,ae,te,ne,qe),E.modelViewMatrix.multiplyMatrices(ae.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),ne.onBeforeRender(I,H,ae,te,E,qe),ne.transparent===!0&&ne.side===2&&ne.forceSinglePass===!1?(ne.side=1,ne.needsUpdate=!0,I.renderBufferDirect(ae,H,te,ne,E,qe),ne.side=0,ne.needsUpdate=!0,I.renderBufferDirect(ae,H,te,ne,E,qe),ne.side=2):I.renderBufferDirect(ae,H,te,ne,E,qe),E.onAfterRender(I,H,ae,te,ne,qe)}function tr(E,H,ae){H.isScene!==!0&&(H=me);const te=ee.get(E),ne=T.state.lights,qe=T.state.shadowsArray,Le=ne.state.version,Ce=ye.getParameters(E,ne.state,qe,H,ae,T.state.lightProbeGridArray),De=ye.getProgramCacheKey(Ce);let ke=te.programs;te.environment=E.isMeshStandardMaterial||E.isMeshLambertMaterial||E.isMeshPhongMaterial?H.environment:null,te.fog=H.fog;const je=E.isMeshStandardMaterial||E.isMeshLambertMaterial&&!E.envMap||E.isMeshPhongMaterial&&!E.envMap;te.envMap=xe.get(E.envMap||te.environment,je),te.envMapRotation=te.environment!==null&&E.envMap===null?H.environmentRotation:E.envMapRotation,ke===void 0&&(E.addEventListener("dispose",gn),ke=new Map,te.programs=ke);let rt=ke.get(De);if(rt!==void 0){if(te.currentProgram===rt&&te.lightsStateVersion===Le)return Kl(E,Ce),rt}else Ce.uniforms=ye.getUniforms(E),B!==null&&E.isNodeMaterial&&B.build(E,ae,Ce),E.onBeforeCompile(Ce,I),rt=ye.acquireProgram(Ce,De),ke.set(De,rt),te.uniforms=Ce.uniforms;const Fe=te.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Fe.clippingPlanes=Ge.uniform),Kl(E,Ce),te.needsLights=H0(E),te.lightsStateVersion=Le,te.needsLights&&(Fe.ambientLightColor.value=ne.state.ambient,Fe.lightProbe.value=ne.state.probe,Fe.sunLights.value=ne.state.sun,Fe.sunLightShadows.value=ne.state.sunShadow,Fe.directionalLights.value=ne.state.directional,Fe.directionalLightShadows.value=ne.state.directionalShadow,Fe.spotLights.value=ne.state.spot,Fe.spotLightShadows.value=ne.state.spotShadow,Fe.rectAreaLights.value=ne.state.rectArea,Fe.ltc_1.value=ne.state.rectAreaLTC1,Fe.ltc_2.value=ne.state.rectAreaLTC2,Fe.pointLights.value=ne.state.point,Fe.pointLightShadows.value=ne.state.pointShadow,Fe.hemisphereLights.value=ne.state.hemi,Fe.sunShadowMatrix.value=ne.state.sunShadowMatrix,Fe.sunShadowCascade.value=ne.state.sunShadowCascade,Fe.directionalShadowMatrix.value=ne.state.directionalShadowMatrix,Fe.spotLightMatrix.value=ne.state.spotLightMatrix,Fe.spotLightMap.value=ne.state.spotLightMap,Fe.pointShadowMatrix.value=ne.state.pointShadowMatrix),te.lightProbeGrid=T.state.lightProbeGridArray.length>0,te.currentProgram=rt,te.uniformsList=null,rt}function Yl(E){if(E.uniformsList===null){const H=E.currentProgram.getUniforms();E.uniformsList=$s.seqWithValue(H.seq,E.uniforms)}return E.uniformsList}function Kl(E,H){const ae=ee.get(E);ae.outputColorSpace=H.outputColorSpace,ae.batching=H.batching,ae.batchingColor=H.batchingColor,ae.instancing=H.instancing,ae.instancingColor=H.instancingColor,ae.instancingMorph=H.instancingMorph,ae.skinning=H.skinning,ae.morphTargets=H.morphTargets,ae.morphNormals=H.morphNormals,ae.morphColors=H.morphColors,ae.morphTargetsCount=H.morphTargetsCount,ae.numClippingPlanes=H.numClippingPlanes,ae.numIntersection=H.numClipIntersection,ae.vertexAlphas=H.vertexAlphas,ae.vertexTangents=H.vertexTangents,ae.toneMapping=H.toneMapping}function G0(E,H){if(E.length===0)return null;if(E.length===1)return E[0].texture!==null?E[0]:null;_.setFromMatrixPosition(H.matrixWorld);for(let ae=0,te=E.length;ae<te;ae++){const ne=E[ae];if(ne.texture!==null&&ne.boundingBox.containsPoint(_))return ne}return null}function z0(E,H,ae,te,ne){H.isScene!==!0&&(H=me),le.resetTextureUnits();const qe=H.fog,Le=te.isMeshStandardMaterial||te.isMeshLambertMaterial||te.isMeshPhongMaterial?H.environment:null,Ce=z===null?I.outputColorSpace:z.isXRRenderTarget===!0?z.texture.colorSpace:it.workingColorSpace,De=te.isMeshStandardMaterial||te.isMeshLambertMaterial&&!te.envMap||te.isMeshPhongMaterial&&!te.envMap,ke=xe.get(te.envMap||Le,De),je=te.vertexColors===!0&&!!ae.attributes.color&&ae.attributes.color.itemSize===4,rt=!!ae.attributes.tangent&&(!!te.normalMap||te.anisotropy>0),Fe=!!ae.morphAttributes.position,ct=!!ae.morphAttributes.normal,At=!!ae.morphAttributes.color;let xt=0;te.toneMapped&&(z===null||z.isXRRenderTarget===!0)&&(xt=I.toneMapping);const pt=ae.morphAttributes.position||ae.morphAttributes.normal||ae.morphAttributes.color,Lt=pt!==void 0?pt.length:0,Ie=ee.get(te),Ut=T.state.lights;if(V===!0&&(F===!0||E!==ie)){const gt=E===ie&&te.id===Q;Ge.setState(te,E,gt)}let at=!1;te.version===Ie.__version?(Ie.needsLights&&Ie.lightsStateVersion!==Ut.state.version||Ie.outputColorSpace!==Ce||ne.isBatchedMesh&&Ie.batching===!1||!ne.isBatchedMesh&&Ie.batching===!0||ne.isBatchedMesh&&Ie.batchingColor===!0&&ne._colorsTexture===null||ne.isBatchedMesh&&Ie.batchingColor===!1&&ne._colorsTexture!==null||ne.isInstancedMesh&&Ie.instancing===!1||!ne.isInstancedMesh&&Ie.instancing===!0||ne.isSkinnedMesh&&Ie.skinning===!1||!ne.isSkinnedMesh&&Ie.skinning===!0||ne.isInstancedMesh&&Ie.instancingColor===!0&&ne.instanceColor===null||ne.isInstancedMesh&&Ie.instancingColor===!1&&ne.instanceColor!==null||ne.isInstancedMesh&&Ie.instancingMorph===!0&&ne.morphTexture===null||ne.isInstancedMesh&&Ie.instancingMorph===!1&&ne.morphTexture!==null||Ie.envMap!==ke||te.fog===!0&&Ie.fog!==qe||Ie.numClippingPlanes!==void 0&&(Ie.numClippingPlanes!==Ge.numPlanes||Ie.numIntersection!==Ge.numIntersection)||Ie.vertexAlphas!==je||Ie.vertexTangents!==rt||Ie.morphTargets!==Fe||Ie.morphNormals!==ct||Ie.morphColors!==At||Ie.toneMapping!==xt||Ie.morphTargetsCount!==Lt||!!Ie.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(at=!0):(at=!0,Ie.__version=te.version);let Zt=Ie.currentProgram;at===!0&&(Zt=tr(te,H,ne),B&&te.isNodeMaterial&&B.onUpdateProgram(te,Zt,Ie));let _n=!1,Bn=!1,Ci=!1;const ft=Zt.getUniforms(),bt=Ie.uniforms;if(y.useProgram(Zt.program)&&(_n=!0,Bn=!0,Ci=!0),te.id!==Q&&(Q=te.id,Bn=!0),Ie.needsLights){const gt=G0(T.state.lightProbeGridArray,ne);Ie.lightProbeGrid!==gt&&(Ie.lightProbeGrid=gt,Bn=!0)}if(_n||ie!==E){y.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),ft.setValue(S,"projectionMatrix",E.projectionMatrix),ft.setValue(S,"viewMatrix",E.matrixWorldInverse);const Gn=ft.map.cameraPosition;Gn!==void 0&&Gn.setValue(S,j.setFromMatrixPosition(E.matrixWorld)),q.logarithmicDepthBuffer&&ft.setValue(S,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(te.isMeshPhongMaterial||te.isMeshToonMaterial||te.isMeshLambertMaterial||te.isMeshBasicMaterial||te.isMeshStandardMaterial||te.isShaderMaterial)&&ft.setValue(S,"isOrthographic",E.isOrthographicCamera===!0),ie!==E&&(ie=E,Bn=!0,Ci=!0)}if(Ie.needsLights&&(Ut.state.sunShadowMap.length>0&&ft.setValue(S,"sunShadowMap",Ut.state.sunShadowMap,le),Ut.state.directionalShadowMap.length>0&&ft.setValue(S,"directionalShadowMap",Ut.state.directionalShadowMap,le),Ut.state.spotShadowMap.length>0&&ft.setValue(S,"spotShadowMap",Ut.state.spotShadowMap,le),Ut.state.pointShadowMap.length>0&&ft.setValue(S,"pointShadowMap",Ut.state.pointShadowMap,le)),ne.isSkinnedMesh){ft.setOptional(S,ne,"bindMatrix"),ft.setOptional(S,ne,"bindMatrixInverse");const gt=ne.skeleton;gt&&(gt.boneTexture===null&&gt.computeBoneTexture(),ft.setValue(S,"boneTexture",gt.boneTexture,le))}ne.isBatchedMesh&&(ft.setOptional(S,ne,"batchingTexture"),ft.setValue(S,"batchingTexture",ne._matricesTexture,le),ft.setOptional(S,ne,"batchingIdTexture"),ft.setValue(S,"batchingIdTexture",ne._indirectTexture,le),ft.setOptional(S,ne,"batchingColorTexture"),ne._colorsTexture!==null&&ft.setValue(S,"batchingColorTexture",ne._colorsTexture,le));const kn=ae.morphAttributes;if((kn.position!==void 0||kn.normal!==void 0||kn.color!==void 0)&&W.update(ne,ae,Zt),(Bn||Ie.receiveShadow!==ne.receiveShadow)&&(Ie.receiveShadow=ne.receiveShadow,ft.setValue(S,"receiveShadow",ne.receiveShadow)),(te.isMeshStandardMaterial||te.isMeshLambertMaterial||te.isMeshPhongMaterial)&&te.envMap===null&&H.environment!==null&&(bt.envMapIntensity.value=H.environmentIntensity),bt.dfgLUT!==void 0&&(bt.dfgLUT.value=Up()),Bn){if(ft.setValue(S,"toneMappingExposure",I.toneMappingExposure),Ie.needsLights&&V0(bt,Ci),qe&&te.fog===!0&&Ue.refreshFogUniforms(bt,qe),Ue.refreshMaterialUniforms(bt,te,N,D,T.state.transmissionRenderTarget[E.id]),Ie.needsLights&&Ie.lightProbeGrid){const gt=Ie.lightProbeGrid;bt.probesSH.value=gt.texture,bt.probesMin.value.copy(gt.boundingBox.min),bt.probesMax.value.copy(gt.boundingBox.max),bt.probesResolution.value.copy(gt.resolution)}$s.upload(S,Yl(Ie),bt,le)}if(te.isShaderMaterial&&te.uniformsNeedUpdate===!0&&($s.upload(S,Yl(Ie),bt,le),te.uniformsNeedUpdate=!1),te.isSpriteMaterial&&ft.setValue(S,"center",ne.center),ft.setValue(S,"modelViewMatrix",ne.modelViewMatrix),ft.setValue(S,"normalMatrix",ne.normalMatrix),ft.setValue(S,"modelMatrix",ne.matrixWorld),te.uniformsGroups!==void 0){const gt=te.uniformsGroups;for(let Gn=0,qi=gt.length;Gn<qi;Gn++){const Zl=gt[Gn];ge.update(Zl,Zt),ge.bind(Zl,Zt)}}return Zt}function V0(E,H){E.ambientLightColor.needsUpdate=H,E.lightProbe.needsUpdate=H,E.sunLights.needsUpdate=H,E.sunLightShadows.needsUpdate=H,E.directionalLights.needsUpdate=H,E.directionalLightShadows.needsUpdate=H,E.pointLights.needsUpdate=H,E.pointLightShadows.needsUpdate=H,E.spotLights.needsUpdate=H,E.spotLightShadows.needsUpdate=H,E.rectAreaLights.needsUpdate=H,E.hemisphereLights.needsUpdate=H}function H0(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return re},this.getActiveMipmapLevel=function(){return $},this.getRenderTarget=function(){return z},this.setRenderTargetTextures=function(E,H,ae){const te=ee.get(E);te.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,te.__autoAllocateDepthBuffer===!1&&(te.__useRenderToTexture=!1),ee.get(E.texture).__webglTexture=H,ee.get(E.depthTexture).__webglTexture=te.__autoAllocateDepthBuffer?void 0:ae,te.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,H){const ae=ee.get(E);ae.__webglFramebuffer=H,ae.__useDefaultFramebuffer=H===void 0},this.setRenderTarget=function(E,H=0,ae=0){z=E,re=H,$=ae;let te=null,ne=!1,qe=!1;if(E){const Ce=ee.get(E);if(Ce.__useDefaultFramebuffer!==void 0){y.bindFramebuffer(S.FRAMEBUFFER,Ce.__webglFramebuffer),oe.copy(E.viewport),Se.copy(E.scissor),be=E.scissorTest,y.viewport(oe),y.scissor(Se),y.setScissorTest(be),Q=-1;return}else if(Ce.__webglFramebuffer===void 0)le.setupRenderTarget(E);else if(Ce.__hasExternalTextures)le.rebindTextures(E,ee.get(E.texture).__webglTexture,ee.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const je=E.depthTexture;if(Ce.__boundDepthTexture!==je){if(je!==null&&ee.has(je)&&(E.width!==je.image.width||E.height!==je.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");le.setupDepthRenderbuffer(E)}}const De=E.texture;(De.isData3DTexture||De.isDataArrayTexture||De.isCompressedArrayTexture)&&(qe=!0);const ke=ee.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(ke[H])?te=ke[H][ae]:te=ke[H],ne=!0):E.samples>0&&le.useMultisampledRTT(E)===!1?te=ee.get(E).__webglMultisampledFramebuffer:Array.isArray(ke)?te=ke[ae]:te=ke,oe.copy(E.viewport),Se.copy(E.scissor),be=E.scissorTest}else oe.copy(k).multiplyScalar(N).floor(),Se.copy(se).multiplyScalar(N).floor(),be=_e;if(ae!==0&&(te=J),y.bindFramebuffer(S.FRAMEBUFFER,te)&&y.drawBuffers(E,te),y.viewport(oe),y.scissor(Se),y.setScissorTest(be),ne){const Ce=ee.get(E.texture);S.framebufferTexture2D(S.FRAMEBUFFER,S.COLOR_ATTACHMENT0,S.TEXTURE_CUBE_MAP_POSITIVE_X+H,Ce.__webglTexture,ae)}else if(qe){const Ce=H;for(let De=0;De<E.textures.length;De++){const ke=ee.get(E.textures[De]);S.framebufferTextureLayer(S.FRAMEBUFFER,S.COLOR_ATTACHMENT0+De,ke.__webglTexture,ae,Ce)}}else if(E!==null&&ae!==0){const Ce=ee.get(E.texture);S.framebufferTexture2D(S.FRAMEBUFFER,S.COLOR_ATTACHMENT0,S.TEXTURE_2D,Ce.__webglTexture,ae)}Q=-1};function Jl(E){const H=ee.get(E);return(H.__readFormat!==E.format||H.__readType!==E.type)&&(H.__readFormat=E.format,H.__readType=E.type,H.__formatReadable=q.textureFormatReadable(E.format),H.__typeReadable=q.textureTypeReadable(E.type)),H}this.readRenderTargetPixels=function(E,H,ae,te,ne,qe,Le,Ce=0){if(!(E&&E.isWebGLRenderTarget)){Ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let De=ee.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Le!==void 0&&(De=De[Le]),De){y.bindFramebuffer(S.FRAMEBUFFER,De);try{const ke=E.textures[Ce],je=ke.format,rt=ke.type;E.textures.length>1&&S.readBuffer(S.COLOR_ATTACHMENT0+Ce);const Fe=Jl(ke);if(Fe.__formatReadable===!1){Ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Fe.__typeReadable===!1){Ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=E.width-te&&ae>=0&&ae<=E.height-ne&&S.readPixels(H,ae,te,ne,Ae.convert(je),Ae.convert(rt),qe)}finally{const ke=z!==null?ee.get(z).__webglFramebuffer:null;y.bindFramebuffer(S.FRAMEBUFFER,ke)}}},this.readRenderTargetPixelsAsync=async function(E,H,ae,te,ne,qe,Le,Ce=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let De=ee.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Le!==void 0&&(De=De[Le]),De)if(H>=0&&H<=E.width-te&&ae>=0&&ae<=E.height-ne){y.bindFramebuffer(S.FRAMEBUFFER,De);const ke=E.textures[Ce],je=ke.format,rt=ke.type;E.textures.length>1&&S.readBuffer(S.COLOR_ATTACHMENT0+Ce);const Fe=Jl(ke);if(Fe.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Fe.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ct=S.createBuffer();S.bindBuffer(S.PIXEL_PACK_BUFFER,ct),S.bufferData(S.PIXEL_PACK_BUFFER,qe.byteLength,S.STREAM_READ),S.readPixels(H,ae,te,ne,Ae.convert(je),Ae.convert(rt),0),S.bindBuffer(S.PIXEL_PACK_BUFFER,null);const At=z!==null?ee.get(z).__webglFramebuffer:null;y.bindFramebuffer(S.FRAMEBUFFER,At);const xt=S.fenceSync(S.SYNC_GPU_COMMANDS_COMPLETE,0);return S.flush(),await tc(S,xt,4),S.bindBuffer(S.PIXEL_PACK_BUFFER,ct),S.getBufferSubData(S.PIXEL_PACK_BUFFER,0,qe),S.bindBuffer(S.PIXEL_PACK_BUFFER,null),S.deleteBuffer(ct),S.deleteSync(xt),qe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,H=null,ae=0){const te=Math.pow(2,-ae),ne=Math.floor(E.image.width*te),qe=Math.floor(E.image.height*te),Le=H!==null?H.x:0,Ce=H!==null?H.y:0;le.setTexture2D(E,0),S.copyTexSubImage2D(S.TEXTURE_2D,ae,0,0,Le,Ce,ne,qe),y.unbindTexture()},this.copyTextureToTexture=function(E,H,ae=null,te=null,ne=0,qe=0){let Le,Ce,De,ke,je,rt,Fe,ct,At;const xt=E.isCompressedTexture?E.mipmaps[qe]:E.image;if(ae!==null)Le=ae.max.x-ae.min.x,Ce=ae.max.y-ae.min.y,De=ae.isBox3?ae.max.z-ae.min.z:1,ke=ae.min.x,je=ae.min.y,rt=ae.isBox3?ae.min.z:0;else{const bt=Math.pow(2,-ne);Le=Math.floor(xt.width*bt),Ce=Math.floor(xt.height*bt),E.isDataArrayTexture?De=xt.depth:E.isData3DTexture?De=Math.floor(xt.depth*bt):De=1,ke=0,je=0,rt=0}te!==null?(Fe=te.x,ct=te.y,At=te.z):(Fe=0,ct=0,At=0);const pt=Ae.convert(H.format),Lt=Ae.convert(H.type);let Ie;H.isData3DTexture?(le.setTexture3D(H,0),Ie=S.TEXTURE_3D):H.isDataArrayTexture||H.isCompressedArrayTexture?(le.setTexture2DArray(H,0),Ie=S.TEXTURE_2D_ARRAY):(le.setTexture2D(H,0),Ie=S.TEXTURE_2D),y.activeTexture(S.TEXTURE0),y.pixelStorei(S.UNPACK_FLIP_Y_WEBGL,H.flipY),y.pixelStorei(S.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),y.pixelStorei(S.UNPACK_ALIGNMENT,H.unpackAlignment);const Ut=y.getParameter(S.UNPACK_ROW_LENGTH),at=y.getParameter(S.UNPACK_IMAGE_HEIGHT),Zt=y.getParameter(S.UNPACK_SKIP_PIXELS),_n=y.getParameter(S.UNPACK_SKIP_ROWS),Bn=y.getParameter(S.UNPACK_SKIP_IMAGES);y.pixelStorei(S.UNPACK_ROW_LENGTH,xt.width),y.pixelStorei(S.UNPACK_IMAGE_HEIGHT,xt.height),y.pixelStorei(S.UNPACK_SKIP_PIXELS,ke),y.pixelStorei(S.UNPACK_SKIP_ROWS,je),y.pixelStorei(S.UNPACK_SKIP_IMAGES,rt);const Ci=E.isDataArrayTexture||E.isData3DTexture,ft=H.isDataArrayTexture||H.isData3DTexture;if(E.isDepthTexture){const bt=ee.get(E),kn=ee.get(H),gt=ee.get(bt.__renderTarget),Gn=ee.get(kn.__renderTarget);y.bindFramebuffer(S.READ_FRAMEBUFFER,gt.__webglFramebuffer),y.bindFramebuffer(S.DRAW_FRAMEBUFFER,Gn.__webglFramebuffer);for(let qi=0;qi<De;qi++)Ci&&(S.framebufferTextureLayer(S.READ_FRAMEBUFFER,S.COLOR_ATTACHMENT0,ee.get(E).__webglTexture,ne,rt+qi),S.framebufferTextureLayer(S.DRAW_FRAMEBUFFER,S.COLOR_ATTACHMENT0,ee.get(H).__webglTexture,qe,At+qi)),S.blitFramebuffer(ke,je,Le,Ce,Fe,ct,Le,Ce,S.DEPTH_BUFFER_BIT,S.NEAREST);y.bindFramebuffer(S.READ_FRAMEBUFFER,null),y.bindFramebuffer(S.DRAW_FRAMEBUFFER,null)}else if(ne!==0||E.isRenderTargetTexture||ee.has(E)){const bt=ee.get(E),kn=ee.get(H);y.bindFramebuffer(S.READ_FRAMEBUFFER,G),y.bindFramebuffer(S.DRAW_FRAMEBUFFER,Z);for(let gt=0;gt<De;gt++)Ci?S.framebufferTextureLayer(S.READ_FRAMEBUFFER,S.COLOR_ATTACHMENT0,bt.__webglTexture,ne,rt+gt):S.framebufferTexture2D(S.READ_FRAMEBUFFER,S.COLOR_ATTACHMENT0,S.TEXTURE_2D,bt.__webglTexture,ne),ft?S.framebufferTextureLayer(S.DRAW_FRAMEBUFFER,S.COLOR_ATTACHMENT0,kn.__webglTexture,qe,At+gt):S.framebufferTexture2D(S.DRAW_FRAMEBUFFER,S.COLOR_ATTACHMENT0,S.TEXTURE_2D,kn.__webglTexture,qe),ne!==0?S.blitFramebuffer(ke,je,Le,Ce,Fe,ct,Le,Ce,S.COLOR_BUFFER_BIT,S.NEAREST):ft?S.copyTexSubImage3D(Ie,qe,Fe,ct,At+gt,ke,je,Le,Ce):S.copyTexSubImage2D(Ie,qe,Fe,ct,ke,je,Le,Ce);y.bindFramebuffer(S.READ_FRAMEBUFFER,null),y.bindFramebuffer(S.DRAW_FRAMEBUFFER,null)}else ft?E.isDataTexture||E.isData3DTexture?S.texSubImage3D(Ie,qe,Fe,ct,At,Le,Ce,De,pt,Lt,xt.data):H.isCompressedArrayTexture?S.compressedTexSubImage3D(Ie,qe,Fe,ct,At,Le,Ce,De,pt,xt.data):S.texSubImage3D(Ie,qe,Fe,ct,At,Le,Ce,De,pt,Lt,xt):E.isDataTexture?S.texSubImage2D(S.TEXTURE_2D,qe,Fe,ct,Le,Ce,pt,Lt,xt.data):E.isCompressedTexture?S.compressedTexSubImage2D(S.TEXTURE_2D,qe,Fe,ct,xt.width,xt.height,pt,xt.data):S.texSubImage2D(S.TEXTURE_2D,qe,Fe,ct,Le,Ce,pt,Lt,xt);y.pixelStorei(S.UNPACK_ROW_LENGTH,Ut),y.pixelStorei(S.UNPACK_IMAGE_HEIGHT,at),y.pixelStorei(S.UNPACK_SKIP_PIXELS,Zt),y.pixelStorei(S.UNPACK_SKIP_ROWS,_n),y.pixelStorei(S.UNPACK_SKIP_IMAGES,Bn),qe===0&&H.generateMipmaps&&S.generateMipmap(Ie),y.unbindTexture()},this.initRenderTarget=function(E){ee.get(E).__webglFramebuffer===void 0&&le.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?le.setTextureCube(E,0):E.isData3DTexture?le.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?le.setTexture2DArray(E,0):le.setTexture2D(E,0),y.unbindTexture()},this.resetState=function(){re=0,$=0,z=null,y.reset(),Pe.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return 2e3}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=it._getDrawingBufferColorSpace(e),t.unpackColorSpace=it._getUnpackColorSpace()}}class Bp extends Dn{constructor(e){super(e)}load(e,t,n,i){const r=this,a=new Vs(this.manager);a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(o){const l=r.parse(JSON.parse(o));t&&t(l)},n,i)}parse(e){return new wl(e)}}class wl{constructor(e){this.isFont=!0,this.type="Font",this.data=e}generateShapes(e,t=100,n="ltr"){const i=[],r=kp(e,t,this.data,n);for(let a=0,o=r.length;a<o;a++)i.push(...r[a].toShapes());return i}}function kp(s,e,t,n){const i=Array.from(s),r=e/t.resolution,a=(t.boundingBox.yMax-t.boundingBox.yMin+t.underlineThickness)*r,o=[];let l=0,c=0;(n=="rtl"||n=="tb")&&i.reverse();for(let h=0;h<i.length;h++){const u=i[h];if(u===`
`)l=0,c-=a;else{const d=Gp(u,r,l,c,t);n=="tb"?(l=0,c+=t.ascender*r):l+=d.offsetX,o.push(d.path)}}return o}function Gp(s,e,t,n,i){const r=i.glyphs[s]||i.glyphs["?"];if(!r){console.error('THREE.Font: character "'+s+'" does not exists in font family '+i.familyName+".");return}const a=new Un;let o,l,c,h,u,d,f,g;if(r.o){const v=r._cachedOutline||(r._cachedOutline=r.o.split(" "));for(let m=0,p=v.length;m<p;)switch(v[m++]){case"m":o=v[m++]*e+t,l=v[m++]*e+n,a.moveTo(o,l);break;case"l":o=v[m++]*e+t,l=v[m++]*e+n,a.lineTo(o,l);break;case"q":c=v[m++]*e+t,h=v[m++]*e+n,u=v[m++]*e+t,d=v[m++]*e+n,a.quadraticCurveTo(u,d,c,h);break;case"b":c=v[m++]*e+t,h=v[m++]*e+n,u=v[m++]*e+t,d=v[m++]*e+n,f=v[m++]*e+t,g=v[m++]*e+n,a.bezierCurveTo(u,d,f,g,c,h);break}}return{offsetX:r.ha*e,path:a}}class ua extends Ji{constructor(e,t={}){const n=t.font;if(n===void 0)super();else{const i=n.generateShapes(e,t.size,t.direction);t.depth===void 0&&(t.depth=50),t.bevelThickness===void 0&&(t.bevelThickness=10),t.bevelSize===void 0&&(t.bevelSize=8),t.bevelEnabled===void 0&&(t.bevelEnabled=!1),super(i,t)}this.type="TextGeometry"}toJSON(){return super.toJSON()}static fromJSON(e){const t=e.options;return t.font=new wl(t.font.data),new ua(t.text,t)}}const is=new U;function Yt(s,e,t,n,i,r){const a=2*Math.PI*i/4,o=Math.max(r-2*i,0),l=Math.PI/4;is.copy(e),is[n]=0,is.normalize();const c=.5*a/(a+o),h=1-is.angleTo(s)/l;return Math.sign(is[t])===1?h*c:o/(a+o)+c+c*(1-h)}class ss extends Xn{constructor(e=1,t=1,n=1,i=2,r=.1){const a=i*2+1;if(r=Math.min(e/2,t/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:n,segments:i,radius:r},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const l=new U,c=new U,h=new U(e,t,n).divideScalar(2).subScalar(r),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,g=u.length/6,v=new U,m=.5/a;for(let p=0,M=0;p<u.length;p+=3,M+=2)switch(l.fromArray(u,p),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),u[p+0]=h.x*Math.sign(l.x)+c.x*r,u[p+1]=h.y*Math.sign(l.y)+c.y*r,u[p+2]=h.z*Math.sign(l.z)+c.z*r,d[p+0]=c.x,d[p+1]=c.y,d[p+2]=c.z,Math.floor(p/g)){case 0:v.set(1,0,0),f[M+0]=Yt(v,c,"z","y",r,n),f[M+1]=1-Yt(v,c,"y","z",r,t);break;case 1:v.set(-1,0,0),f[M+0]=1-Yt(v,c,"z","y",r,n),f[M+1]=1-Yt(v,c,"y","z",r,t);break;case 2:v.set(0,1,0),f[M+0]=1-Yt(v,c,"x","z",r,e),f[M+1]=Yt(v,c,"z","x",r,n);break;case 3:v.set(0,-1,0),f[M+0]=1-Yt(v,c,"x","z",r,e),f[M+1]=1-Yt(v,c,"z","x",r,n);break;case 4:v.set(0,0,1),f[M+0]=1-Yt(v,c,"x","y",r,e),f[M+1]=1-Yt(v,c,"y","x",r,t);break;case 5:v.set(0,0,-1),f[M+0]=Yt(v,c,"x","y",r,e),f[M+1]=1-Yt(v,c,"y","x",r,t);break}}static fromJSON(e){return new ss(e.width,e.height,e.depth,e.segments,e.radius)}}const rs=St;class da extends Dn{constructor(e){super(e),this.defaultDPI=90,this.defaultUnit="px"}load(e,t,n,i){const r=this,a=new Vs(r.manager);a.setPath(r.path),a.setRequestHeader(r.requestHeader),a.setWithCredentials(r.withCredentials),a.load(e,function(o){try{t(r.parse(o))}catch(l){i?i(l):console.error(l),r.manager.itemError(e)}},n,i)}parse(e){const t=this;function n(N,L){if(N.nodeType!==1)return;N.hasAttribute("filter")&&console.warn("THREE.SVGLoader: Filters are not supported.");const P=b(N);let k=!1,se=null;switch(N.nodeName){case"svg":L=v(N,L);break;case"style":r(N);break;case"g":L=v(N,L);break;case"path":L=v(N,L),N.hasAttribute("d")&&(se=i(N));break;case"rect":L=v(N,L),se=l(N);break;case"polygon":L=v(N,L),se=c(N);break;case"polyline":L=v(N,L),se=h(N);break;case"circle":L=v(N,L),se=u(N);break;case"ellipse":L=v(N,L),se=d(N);break;case"line":L=v(N,L),se=f(N);break;case"defs":k=!0;break;case"use":L=v(N,L);const V=(N.getAttributeNS("http://www.w3.org/1999/xlink","href")||"").substring(1),F=N.viewportElement.getElementById(V);F?n(F,L):console.warn("SVGLoader: 'use node' references non-existent node id: "+V);break}if(se){L.fill!==void 0&&L.fill!=="none"&&!L.fill.startsWith("url")&&se.color.setStyle(L.fill,rs),x(se,He),Z.push(se);const C=Object.assign({},L);C.strokeWidth=L.strokeWidth*J(He),se.userData={node:N,style:C,transform:He.clone(),gradients:$}}const _e=N.childNodes;for(let C=0;C<_e.length;C++){const V=_e[C];k&&V.nodeName!=="style"&&V.nodeName!=="defs"||n(V,L)}P&&(z.pop(),z.length>0?He.copy(z[z.length-1]):He.identity())}function i(N){const L=new Un,P=new fe,k=new fe,se=new fe;let _e=!0,C=!1;const V=N.getAttribute("d");if(V===""||V==="none")return null;const F=V.match(/[a-df-z][^a-df-z]*/ig);for(let K=0,j=F.length;K<j;K++){const ce=F[K],me=ce.charAt(0),pe=ce.slice(1).trim();_e===!0&&(C=!0,_e=!1);let Y;switch(me){case"M":Y=p(pe);for(let S=0,Re=Y.length;S<Re;S+=2)P.x=Y[S+0],P.y=Y[S+1],k.x=P.x,k.y=P.y,S===0?L.moveTo(P.x,P.y):L.lineTo(P.x,P.y),S===0&&se.copy(P);break;case"H":Y=p(pe);for(let S=0,Re=Y.length;S<Re;S++)P.x=Y[S],k.x=P.x,k.y=P.y,L.lineTo(P.x,P.y),S===0&&C===!0&&se.copy(P);break;case"V":Y=p(pe);for(let S=0,Re=Y.length;S<Re;S++)P.y=Y[S],k.x=P.x,k.y=P.y,L.lineTo(P.x,P.y),S===0&&C===!0&&se.copy(P);break;case"L":Y=p(pe);for(let S=0,Re=Y.length;S<Re;S+=2)P.x=Y[S+0],P.y=Y[S+1],k.x=P.x,k.y=P.y,L.lineTo(P.x,P.y),S===0&&C===!0&&se.copy(P);break;case"C":Y=p(pe);for(let S=0,Re=Y.length;S<Re;S+=6)L.bezierCurveTo(Y[S+0],Y[S+1],Y[S+2],Y[S+3],Y[S+4],Y[S+5]),k.x=Y[S+2],k.y=Y[S+3],P.x=Y[S+4],P.y=Y[S+5],S===0&&C===!0&&se.copy(P);break;case"S":Y=p(pe);for(let S=0,Re=Y.length;S<Re;S+=4)L.bezierCurveTo(m(P.x,k.x),m(P.y,k.y),Y[S+0],Y[S+1],Y[S+2],Y[S+3]),k.x=Y[S+0],k.y=Y[S+1],P.x=Y[S+2],P.y=Y[S+3],S===0&&C===!0&&se.copy(P);break;case"Q":Y=p(pe);for(let S=0,Re=Y.length;S<Re;S+=4)L.quadraticCurveTo(Y[S+0],Y[S+1],Y[S+2],Y[S+3]),k.x=Y[S+0],k.y=Y[S+1],P.x=Y[S+2],P.y=Y[S+3],S===0&&C===!0&&se.copy(P);break;case"T":Y=p(pe);for(let S=0,Re=Y.length;S<Re;S+=2){const Ne=m(P.x,k.x),q=m(P.y,k.y);L.quadraticCurveTo(Ne,q,Y[S+0],Y[S+1]),k.x=Ne,k.y=q,P.x=Y[S+0],P.y=Y[S+1],S===0&&C===!0&&se.copy(P)}break;case"A":Y=p(pe,[3,4],7);for(let S=0,Re=Y.length;S<Re;S+=7){if(Y[S+5]==P.x&&Y[S+6]==P.y)continue;const Ne=P.clone();P.x=Y[S+5],P.y=Y[S+6],k.x=P.x,k.y=P.y,a(L,Y[S],Y[S+1],Y[S+2],Y[S+3],Y[S+4],Ne,P),S===0&&C===!0&&se.copy(P)}break;case"m":Y=p(pe);for(let S=0,Re=Y.length;S<Re;S+=2)P.x+=Y[S+0],P.y+=Y[S+1],k.x=P.x,k.y=P.y,S===0?L.moveTo(P.x,P.y):L.lineTo(P.x,P.y),S===0&&se.copy(P);break;case"h":Y=p(pe);for(let S=0,Re=Y.length;S<Re;S++)P.x+=Y[S],k.x=P.x,k.y=P.y,L.lineTo(P.x,P.y),S===0&&C===!0&&se.copy(P);break;case"v":Y=p(pe);for(let S=0,Re=Y.length;S<Re;S++)P.y+=Y[S],k.x=P.x,k.y=P.y,L.lineTo(P.x,P.y),S===0&&C===!0&&se.copy(P);break;case"l":Y=p(pe);for(let S=0,Re=Y.length;S<Re;S+=2)P.x+=Y[S+0],P.y+=Y[S+1],k.x=P.x,k.y=P.y,L.lineTo(P.x,P.y),S===0&&C===!0&&se.copy(P);break;case"c":Y=p(pe);for(let S=0,Re=Y.length;S<Re;S+=6)L.bezierCurveTo(P.x+Y[S+0],P.y+Y[S+1],P.x+Y[S+2],P.y+Y[S+3],P.x+Y[S+4],P.y+Y[S+5]),k.x=P.x+Y[S+2],k.y=P.y+Y[S+3],P.x+=Y[S+4],P.y+=Y[S+5],S===0&&C===!0&&se.copy(P);break;case"s":Y=p(pe);for(let S=0,Re=Y.length;S<Re;S+=4)L.bezierCurveTo(m(P.x,k.x),m(P.y,k.y),P.x+Y[S+0],P.y+Y[S+1],P.x+Y[S+2],P.y+Y[S+3]),k.x=P.x+Y[S+0],k.y=P.y+Y[S+1],P.x+=Y[S+2],P.y+=Y[S+3],S===0&&C===!0&&se.copy(P);break;case"q":Y=p(pe);for(let S=0,Re=Y.length;S<Re;S+=4)L.quadraticCurveTo(P.x+Y[S+0],P.y+Y[S+1],P.x+Y[S+2],P.y+Y[S+3]),k.x=P.x+Y[S+0],k.y=P.y+Y[S+1],P.x+=Y[S+2],P.y+=Y[S+3],S===0&&C===!0&&se.copy(P);break;case"t":Y=p(pe);for(let S=0,Re=Y.length;S<Re;S+=2){const Ne=m(P.x,k.x),q=m(P.y,k.y);L.quadraticCurveTo(Ne,q,P.x+Y[S+0],P.y+Y[S+1]),k.x=Ne,k.y=q,P.x=P.x+Y[S+0],P.y=P.y+Y[S+1],S===0&&C===!0&&se.copy(P)}break;case"a":Y=p(pe,[3,4],7);for(let S=0,Re=Y.length;S<Re;S+=7){if(Y[S+5]==0&&Y[S+6]==0)continue;const Ne=P.clone();P.x+=Y[S+5],P.y+=Y[S+6],k.x=P.x,k.y=P.y,a(L,Y[S],Y[S+1],Y[S+2],Y[S+3],Y[S+4],Ne,P),S===0&&C===!0&&se.copy(P)}break;case"Z":case"z":L.currentPath.autoClose=!0,L.currentPath.curves.length>0&&(P.copy(se),L.currentPath.currentPoint.copy(P),_e=!0);break;default:console.warn(ce)}C=!1}return L}function r(N){if(!(!N.sheet||!N.sheet.cssRules||!N.sheet.cssRules.length))for(let L=0;L<N.sheet.cssRules.length;L++){const P=N.sheet.cssRules[L];if(P.type!==1)continue;const k=P.selectorText.split(/,/gm).filter(Boolean).map(se=>se.trim());for(let se=0;se<k.length;se++){const _e=Object.fromEntries(Object.entries(P.style).filter(([,C])=>C!==""));re[k[se]]=Object.assign(re[k[se]]||{},_e)}}}function a(N,L,P,k,se,_e,C,V){if(L==0||P==0){N.lineTo(V.x,V.y);return}k=k*Math.PI/180,L=Math.abs(L),P=Math.abs(P);const F=(C.x-V.x)/2,K=(C.y-V.y)/2,j=Math.cos(k)*F+Math.sin(k)*K,ce=-Math.sin(k)*F+Math.cos(k)*K;let me=L*L,pe=P*P;const Y=j*j,S=ce*ce,Re=Y/me+S/pe;if(Re>1){const ue=Math.sqrt(Re);L=ue*L,P=ue*P,me=L*L,pe=P*P}const Ne=me*S+pe*Y,q=(me*pe-Ne)/Ne;let y=Math.sqrt(Math.max(0,q));se===_e&&(y=-y);const X=y*L*ce/P,ee=-y*P*j/L,le=Math.cos(k)*X-Math.sin(k)*ee+(C.x+V.x)/2,xe=Math.sin(k)*X+Math.cos(k)*ee+(C.y+V.y)/2,ve=o(1,0,(j-X)/L,(ce-ee)/P),he=o((j-X)/L,(ce-ee)/P,(-j-X)/L,(-ce-ee)/P)%(Math.PI*2);N.currentPath.absellipse(le,xe,L,P,ve,ve+he,_e===0,k)}function o(N,L,P,k){const se=N*P+L*k,_e=Math.sqrt(N*N+L*L)*Math.sqrt(P*P+k*k);let C=Math.acos(Math.max(-1,Math.min(1,se/_e)));return N*k-L*P<0&&(C=-C),C}function l(N){const L=_(N.getAttribute("x")||0),P=_(N.getAttribute("y")||0),k=_(N.getAttribute("rx")||N.getAttribute("ry")||0),se=_(N.getAttribute("ry")||N.getAttribute("rx")||0),_e=_(N.getAttribute("width")),C=_(N.getAttribute("height")),V=1-.551915024494,F=new Un;return F.moveTo(L+k,P),F.lineTo(L+_e-k,P),(k!==0||se!==0)&&F.bezierCurveTo(L+_e-k*V,P,L+_e,P+se*V,L+_e,P+se),F.lineTo(L+_e,P+C-se),(k!==0||se!==0)&&F.bezierCurveTo(L+_e,P+C-se*V,L+_e-k*V,P+C,L+_e-k,P+C),F.lineTo(L+k,P+C),(k!==0||se!==0)&&F.bezierCurveTo(L+k*V,P+C,L,P+C-se*V,L,P+C-se),F.lineTo(L,P+se),(k!==0||se!==0)&&F.bezierCurveTo(L,P+se*V,L+k*V,P,L+k,P),F}function c(N){function L(_e,C,V){const F=_(C),K=_(V);se===0?k.moveTo(F,K):k.lineTo(F,K),se++}const P=/([+-]?\d*\.?\d+(?:e[+-]?\d+)?)(?:,|\s)([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/g,k=new Un;let se=0;return N.getAttribute("points").replace(P,L),k.currentPath.autoClose=!0,k}function h(N){function L(_e,C,V){const F=_(C),K=_(V);se===0?k.moveTo(F,K):k.lineTo(F,K),se++}const P=/([+-]?\d*\.?\d+(?:e[+-]?\d+)?)(?:,|\s)([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/g,k=new Un;let se=0;return N.getAttribute("points").replace(P,L),k.currentPath.autoClose=!1,k}function u(N){const L=_(N.getAttribute("cx")||0),P=_(N.getAttribute("cy")||0),k=_(N.getAttribute("r")||0),se=new di;se.absarc(L,P,k,0,Math.PI*2);const _e=new Un;return _e.subPaths.push(se),_e}function d(N){const L=_(N.getAttribute("cx")||0),P=_(N.getAttribute("cy")||0),k=_(N.getAttribute("rx")||0),se=_(N.getAttribute("ry")||0),_e=new di;_e.absellipse(L,P,k,se,0,Math.PI*2);const C=new Un;return C.subPaths.push(_e),C}function f(N){const L=_(N.getAttribute("x1")||0),P=_(N.getAttribute("y1")||0),k=_(N.getAttribute("x2")||0),se=_(N.getAttribute("y2")||0),_e=new Un;return _e.moveTo(L,P),_e.lineTo(k,se),_e.currentPath.autoClose=!1,_e}function g(N){const L="http://www.w3.org/1999/xlink",P=N.querySelectorAll("linearGradient, radialGradient"),k=["x1","y1","x2","y2","cx","cy","r","fx","fy","gradientUnits","gradientTransform","spreadMethod"],se={};for(const C of P){const V=C.getAttribute("id");if(!V)continue;const F={type:C.nodeName==="radialGradient"?"radialGradient":"linearGradient",attrs:{},stops:null,href:null},K=C.getAttributeNS(L,"href")||C.getAttribute("href")||"";K.startsWith("#")&&(F.href=K.substring(1));for(const ce of k)C.hasAttribute(ce)&&(F.attrs[ce]=C.getAttribute(ce));const j=C.querySelectorAll("stop");if(j.length>0){F.stops=[];for(const ce of j){let me=ce.getAttribute("stop-color");!me&&ce.style&&(me=ce.style["stop-color"]),me||(me="#000");let pe=ce.getAttribute("stop-opacity");(pe===null||pe==="")&&ce.style&&(pe=ce.style["stop-opacity"]),pe=pe===null||pe===""||pe===void 0?1:Math.max(0,Math.min(1,parseFloat(pe)));const Y=Math.max(0,Math.min(1,parseFloat(ce.getAttribute("offset")||"0")));F.stops.push({offset:Y,color:me,opacity:pe})}}se[V]=F}function _e(C,V){const F=se[C];if(!F||V.has(C))return F;if(V.add(C),F.href&&se[F.href]){const K=_e(F.href,V);if(K){F.stops||(F.stops=K.stops);for(const j in K.attrs)j in F.attrs||(F.attrs[j]=K.attrs[j])}}return F}for(const C in se)_e(C,new Set);for(const C in se){let ce=function(me){return typeof me!="string"?0:me.endsWith("%")?parseFloat(me)/100:_(me)};const V=se[C],F=V.attrs,K=F.gradientUnits==="userSpaceOnUse"?"userSpaceOnUse":"objectBoundingBox",j={type:V.type,gradientUnits:K,spreadMethod:F.spreadMethod==="reflect"||F.spreadMethod==="repeat"?F.spreadMethod:"pad",gradientTransform:null,stops:(V.stops||[]).slice().sort((me,pe)=>me.offset-pe.offset)};if(F.gradientTransform&&(j.gradientTransform=new Ve,R(F.gradientTransform,j.gradientTransform)),V.type==="linearGradient")j.x1=F.x1!==void 0?ce(F.x1):0,j.y1=F.y1!==void 0?ce(F.y1):0,j.x2=F.x2!==void 0?ce(F.x2):K==="objectBoundingBox"?1:0,j.y2=F.y2!==void 0?ce(F.y2):0;else{const me=K==="objectBoundingBox"?.5:0,pe=K==="objectBoundingBox"?.5:0;j.cx=F.cx!==void 0?ce(F.cx):me,j.cy=F.cy!==void 0?ce(F.cy):me,j.r=F.r!==void 0?ce(F.r):pe,j.fx=F.fx!==void 0?ce(F.fx):j.cx,j.fy=F.fy!==void 0?ce(F.fy):j.cy}$[C]=j}}function v(N,L){L=Object.assign({},L);let P={};if(N.hasAttribute("class")){const C=N.getAttribute("class").split(/\s/).filter(Boolean).map(V=>V.trim());for(let V=0;V<C.length;V++)P=Object.assign(P,re["."+C[V]])}N.hasAttribute("id")&&(P=Object.assign(P,re["#"+N.getAttribute("id")]));function k(C,V,F){F===void 0&&(F=function(j){return j}),N.hasAttribute(C)&&(L[V]=F(N.getAttribute(C))),P[V]&&(L[V]=F(P[V])),N.style&&N.style[C]!==""&&(L[V]=F(N.style[C]))}function se(C){return Math.max(0,Math.min(1,_(C)))}function _e(C){return Math.max(0,_(C))}return k("fill","fill"),k("fill-opacity","fillOpacity",se),k("fill-rule","fillRule"),k("opacity","opacity",se),k("stroke","stroke"),k("stroke-opacity","strokeOpacity",se),k("stroke-width","strokeWidth",_e),k("stroke-linejoin","strokeLineJoin"),k("stroke-linecap","strokeLineCap"),k("stroke-miterlimit","strokeMiterLimit",_e),k("visibility","visibility"),L}function m(N,L){return N-(L-N)}function p(N,L,P){if(typeof N!="string")throw new TypeError("Invalid input: "+typeof N);const k={WHITESPACE:/[ \t\r\n]/,DIGIT:/[\d]/,SIGN:/[-+]/,POINT:/\./,COMMA:/,/,EXP:/e/i,FLAGS:/[01]/},se=0,_e=1,C=2,V=3;let F=se,K=!0,j="",ce="";const me=[];function pe(Ne,q,y){const X=new SyntaxError('Unexpected character "'+Ne+'" at index '+q+".");throw X.partial=y,X}function Y(){j!==""&&(ce===""?me.push(Number(j)):me.push(Number(j)*Math.pow(10,Number(ce)))),j="",ce=""}let S;const Re=N.length;for(let Ne=0;Ne<Re;Ne++){if(S=N[Ne],Array.isArray(L)&&L.includes(me.length%P)&&k.FLAGS.test(S)){F=_e,j=S,Y();continue}if(F===se){if(k.WHITESPACE.test(S))continue;if(k.DIGIT.test(S)||k.SIGN.test(S)){F=_e,j=S;continue}if(k.POINT.test(S)){F=C,j=S;continue}k.COMMA.test(S)&&(K&&pe(S,Ne,me),K=!0)}if(F===_e){if(k.DIGIT.test(S)){j+=S;continue}if(k.POINT.test(S)){j+=S,F=C;continue}if(k.EXP.test(S)){F=V;continue}k.SIGN.test(S)&&j.length===1&&k.SIGN.test(j[0])&&pe(S,Ne,me)}if(F===C){if(k.DIGIT.test(S)){j+=S;continue}if(k.EXP.test(S)){F=V;continue}k.POINT.test(S)&&j[j.length-1]==="."&&pe(S,Ne,me)}if(F===V){if(k.DIGIT.test(S)){ce+=S;continue}if(k.SIGN.test(S)){if(ce===""){ce+=S;continue}ce.length===1&&k.SIGN.test(ce)&&pe(S,Ne,me)}}k.WHITESPACE.test(S)?(Y(),F=se,K=!1):k.COMMA.test(S)?(Y(),F=se,K=!0):k.SIGN.test(S)?(Y(),F=_e,j=S):k.POINT.test(S)?(Y(),F=C,j=S):pe(S,Ne,me)}return Y(),me}const M=["mm","cm","in","pt","pc","px"],A={mm:{mm:1,cm:.1,in:1/25.4,pt:72/25.4,pc:6/25.4,px:-1},cm:{mm:10,cm:1,in:1/2.54,pt:72/2.54,pc:6/2.54,px:-1},in:{mm:25.4,cm:2.54,in:1,pt:72,pc:6,px:-1},pt:{mm:25.4/72,cm:2.54/72,in:1/72,pt:1,pc:6/72,px:-1},pc:{mm:25.4/6,cm:2.54/6,in:1/6,pt:72/6,pc:1,px:-1},px:{px:1}};function _(N){let L="px";if(typeof N=="string"||N instanceof String)for(let k=0,se=M.length;k<se;k++){const _e=M[k];if(N.endsWith(_e)){L=_e,N=N.substring(0,N.length-_e.length);break}}let P;return L==="px"&&t.defaultUnit!=="px"?P=A.in[t.defaultUnit]/t.defaultDPI:(P=A[L][t.defaultUnit],P<0&&(P=A[L].in*t.defaultDPI)),P*parseFloat(N)}function b(N){if(!(N.hasAttribute("transform")||N.nodeName==="use"&&(N.hasAttribute("x")||N.hasAttribute("y"))))return null;const L=T(N);return z.length>0&&L.premultiply(z[z.length-1]),He.copy(L),z.push(L),L}function T(N){const L=new Ve;if(N.nodeName==="use"&&(N.hasAttribute("x")||N.hasAttribute("y"))){const P=_(N.getAttribute("x")||0),k=_(N.getAttribute("y")||0);L.makeTranslation(P,k)}return N.hasAttribute("transform")&&R(N.getAttribute("transform"),L),L}function R(N,L){const P=Q,k=N.split(")");for(let se=k.length-1;se>=0;se--){const _e=k[se].trim();if(_e==="")continue;const C=_e.indexOf("("),V=_e.length;if(C>0&&C<V){const F=_e.slice(0,C),K=p(_e.slice(C+1));switch(P.identity(),F){case"translate":if(K.length>=1){const j=K[0];let ce=0;K.length>=2&&(ce=K[1]),P.makeTranslation(j,ce)}break;case"rotate":if(K.length>=1){let j=0,ce=0,me=0;j=K[0]*Math.PI/180,K.length>=3&&(ce=K[1],me=K[2]),ie.makeTranslation(-ce,-me),oe.makeRotation(j),Se.multiplyMatrices(oe,ie),ie.makeTranslation(ce,me),P.multiplyMatrices(ie,Se)}break;case"scale":if(K.length>=1){const j=K[0];let ce=j;K.length>=2&&(ce=K[1]),P.makeScale(j,ce)}break;case"skewX":K.length===1&&P.set(1,Math.tan(K[0]*Math.PI/180),0,0,1,0,0,0,1);break;case"skewY":K.length===1&&P.set(1,0,0,Math.tan(K[0]*Math.PI/180),1,0,0,0,1);break;case"matrix":K.length===6&&P.set(K[0],K[2],K[4],K[1],K[3],K[5],0,0,1);break}L.premultiply(P)}}return L}function x(N,L){function P(C){Ye.set(C.x,C.y,1).applyMatrix3(L),C.set(Ye.x,Ye.y)}function k(C){const V=C.xRadius,F=C.yRadius,K=Math.cos(C.aRotation),j=Math.sin(C.aRotation),ce=new U(V*K,V*j,0),me=new U(-F*j,F*K,0),pe=ce.applyMatrix3(L),Y=me.applyMatrix3(L),S=Q.set(pe.x,Y.x,0,pe.y,Y.y,0,0,0,1),Re=ie.copy(S).invert(),y=oe.copy(Re).transpose().multiply(Re).elements,X=G(y[0],y[1],y[4]),ee=Math.sqrt(X.rt1),le=Math.sqrt(X.rt2);if(C.xRadius=1/ee,C.yRadius=1/le,C.aRotation=Math.atan2(X.sn,X.cs),!((C.aEndAngle-C.aStartAngle)%(2*Math.PI)<Number.EPSILON)){const ve=ie.set(ee,0,0,0,le,0,0,0,1),he=oe.set(X.cs,X.sn,0,-X.sn,X.cs,0,0,0,1),ue=ve.multiply(he).multiply(S),ye=Ue=>{const{x:Te,y:Me}=new U(Math.cos(Ue),Math.sin(Ue),0).applyMatrix3(ue);return Math.atan2(Me,Te)};C.aStartAngle=ye(C.aStartAngle),C.aEndAngle=ye(C.aEndAngle),w(L)&&(C.aClockwise=!C.aClockwise)}}function se(C){const V=O(L),F=B(L);C.xRadius*=V,C.yRadius*=F;const K=V>Number.EPSILON?Math.atan2(L.elements[1],L.elements[0]):Math.atan2(-L.elements[3],L.elements[4]);C.aRotation+=K,w(L)&&(C.aStartAngle*=-1,C.aEndAngle*=-1,C.aClockwise=!C.aClockwise)}const _e=N.subPaths;for(let C=0,V=_e.length;C<V;C++){const K=_e[C].curves;for(let j=0;j<K.length;j++){const ce=K[j];ce.isLineCurve?(P(ce.v1),P(ce.v2)):ce.isCubicBezierCurve?(P(ce.v0),P(ce.v1),P(ce.v2),P(ce.v3)):ce.isQuadraticBezierCurve?(P(ce.v0),P(ce.v1),P(ce.v2)):ce.isEllipseCurve&&(be.set(ce.aX,ce.aY),P(be),ce.aX=be.x,ce.aY=be.y,I(L)?k(ce):se(ce))}}}function w(N){const L=N.elements;return L[0]*L[4]-L[1]*L[3]<0}function I(N){const L=N.elements,P=L[0]*L[3]+L[1]*L[4];if(P===0)return!1;const k=O(N),se=B(N);return Math.abs(P/(k*se))>Number.EPSILON}function O(N){const L=N.elements;return Math.sqrt(L[0]*L[0]+L[1]*L[1])}function B(N){const L=N.elements;return Math.sqrt(L[3]*L[3]+L[4]*L[4])}function J(N){const L=N.elements,P=L[0]*L[4]-L[1]*L[3];return Math.sqrt(Math.abs(P))}function G(N,L,P){let k,se,_e,C,V;const F=N+P,K=N-P,j=Math.sqrt(K*K+4*L*L);return F>0?(k=.5*(F+j),V=1/k,se=N*V*P-L*V*L):F<0?se=.5*(F-j):(k=.5*j,se=-.5*j),K>0?_e=K+j:_e=K-j,Math.abs(_e)>2*Math.abs(L)?(V=-2*L/_e,C=1/Math.sqrt(1+V*V),_e=V*C):Math.abs(L)===0?(_e=1,C=0):(V=-.5*_e/L,_e=1/Math.sqrt(1+V*V),C=V*_e),K>0&&(V=_e,_e=-C,C=V),{rt1:k,rt2:se,cs:_e,sn:C}}const Z=[],re={},$={},z=[],Q=new Ve,ie=new Ve,oe=new Ve,Se=new Ve,be=new fe,Ye=new U,He=new Ve,Je=new DOMParser().parseFromString(e,"image/svg+xml");return g(Je),n(Je.documentElement,{fill:"#000",fillOpacity:1,strokeOpacity:1,strokeWidth:1,strokeLineJoin:"miter",strokeLineCap:"butt",strokeMiterLimit:4}),{paths:Z,gradients:$,xml:Je.documentElement}}static createFillMaterial(e){const t=e.userData.style;if(t.fill===void 0||t.fill==="none")return null;const n=e.color;let i=null;const r=Rl.exec(t.fill);if(r){const o=e.userData.gradients&&e.userData.gradients[r[1]];i=zp(o,e)}const a=new Wt({opacity:t.fillOpacity*(t.opacity||1),transparent:!0,side:2,depthWrite:!1});return i!==null?a.map=i:a.color=n,a}static createStrokeMaterial(e){const t=e.userData.style;return t.stroke===void 0||t.stroke==="none"?null:(Rl.test(t.stroke)&&console.warn("THREE.SVGLoader: Gradient strokes are not supported."),new Wt({color:new We().setStyle(t.stroke,rs),opacity:t.strokeOpacity*(t.opacity||1),transparent:!0,side:2,depthWrite:!1}))}static createShapes(e){return console.warn("SVGLoader: createShapes() is deprecated. Use shapePath.toShapes() instead."),e.toShapes()}static getStrokeStyle(e,t,n,i,r){return e=e!==void 0?e:1,t=t!==void 0?t:"#000",n=n!==void 0?n:"miter",i=i!==void 0?i:"butt",r=r!==void 0?r:4,{strokeColor:t,strokeWidth:e,strokeLineJoin:n,strokeLineCap:i,strokeMiterLimit:r}}static pointsToStroke(e,t,n,i){const r=[],a=[],o=[];if(da.pointsToStrokeWithBuffers(e,t,n,i,r,a,o)===0)return null;const l=new yt;return l.setAttribute("position",new st(r,3)),l.setAttribute("normal",new st(a,3)),l.setAttribute("uv",new st(o,2)),l}static pointsToStrokeWithBuffers(e,t,n,i,r,a,o,l){const c=new fe,h=new fe,u=new fe,d=new fe,f=new fe,g=new fe,v=new fe,m=new fe,p=new fe,M=new fe,A=new fe,_=new fe,b=new fe,T=new fe,R=new fe,x=new fe,w=new fe;n=n!==void 0?n:12,i=i!==void 0?i:.001,l=l!==void 0?l:0,e=_e(e);const I=e.length;if(I<2)return 0;const O=e[0].equals(e[I-1]);let B,J=e[0],G;const Z=t.strokeWidth/2,re=1/(I-1);let $=0,z,Q,ie,oe,Se=!1,be=0,Ye=l*3,He=l*2;Je(e[0],e[1],c).multiplyScalar(Z),m.copy(e[0]).sub(c),p.copy(e[0]).add(c),M.copy(m),A.copy(p);for(let C=1;C<I;C++){B=e[C],C===I-1?O?G=e[1]:G=void 0:G=e[C+1];const V=c;if(Je(J,B,V),u.copy(V).multiplyScalar(Z),_.copy(B).sub(u),b.copy(B).add(u),z=$+re,Q=!1,G!==void 0){Je(B,G,h),u.copy(h).multiplyScalar(Z),T.copy(B).sub(u),R.copy(B).add(u),ie=!0,u.subVectors(G,J),V.dot(u)<0&&(ie=!1),C===1&&(Se=ie),u.subVectors(G,B),u.normalize();const F=Math.abs(V.dot(u));if(F>Number.EPSILON){const K=Z/F;u.multiplyScalar(-K),d.subVectors(B,J),f.copy(d).setLength(K).add(u),x.copy(f).negate();const j=f.length(),ce=d.length();d.divideScalar(ce),g.subVectors(G,B);const me=g.length();if(g.divideScalar(me),d.dot(x)<ce&&g.dot(x)<me&&(Q=!0),w.copy(f).add(B),x.add(B),Q){const pe=ie?p:m,Y=(w.x-pe.x)*(x.y-pe.y)-(w.y-pe.y)*(x.x-pe.x);(ie&&Y<0||!ie&&Y>0)&&x.copy(pe)}switch(oe=!1,Q?ie?(R.copy(x),b.copy(x)):(T.copy(x),_.copy(x)):L(),t.strokeLineJoin){case"bevel":P(ie,Q,z);break;case"round":k(ie,Q),ie?N(B,_,T,z,0):N(B,R,b,z,1);break;case"miter":case"miter-clip":default:const pe=Z*t.strokeMiterLimit/j;if(pe<1)if(t.strokeLineJoin!=="miter-clip"){P(ie,Q,z);break}else k(ie,Q),ie?(g.subVectors(w,_).multiplyScalar(pe).add(_),v.subVectors(w,T).multiplyScalar(pe).add(T),D(_,z,0),D(g,z,0),D(B,z,.5),D(B,z,.5),D(g,z,0),D(v,z,0),D(B,z,.5),D(v,z,0),D(T,z,0)):(g.subVectors(w,b).multiplyScalar(pe).add(b),v.subVectors(w,R).multiplyScalar(pe).add(R),D(b,z,1),D(g,z,1),D(B,z,.5),D(B,z,.5),D(g,z,1),D(v,z,1),D(B,z,.5),D(v,z,1),D(R,z,1));else Q?(ie?(D(p,$,1),D(m,$,0),D(w,z,0),D(p,$,1),D(w,z,0),D(x,z,1)):(D(p,$,1),D(m,$,0),D(w,z,1),D(m,$,0),D(x,z,0),D(w,z,1)),ie?T.copy(w):R.copy(w)):ie?(D(_,z,0),D(w,z,0),D(B,z,.5),D(B,z,.5),D(w,z,0),D(T,z,0)):(D(b,z,1),D(w,z,1),D(B,z,.5),D(B,z,.5),D(w,z,1),D(R,z,1)),oe=!0;break}}else L()}else L();!O&&C===I-1&&se(e[0],M,A,ie,!0,$),$=z,J=B,m.copy(T),p.copy(R)}if(!O)se(B,_,b,ie,!1,z);else if(Q&&r){let C=w,V=x;Se!==ie&&(C=x,V=w),ie?(oe||Se)&&(V.toArray(r,0*3),V.toArray(r,3*3),oe&&C.toArray(r,1*3)):(oe||!Se)&&(V.toArray(r,1*3),V.toArray(r,3*3),oe&&C.toArray(r,0*3))}if(r){const C=[new fe,new fe,new fe],V=l*3;for(let F=V;F<Ye;F+=9)C[0].set(r[F],r[F+1]),C[1].set(r[F+3],r[F+4]),C[2].set(r[F+6],r[F+7]),an.area(C)<0&&(r[F+3]=C[0].x,r[F+4]=C[0].y)}return be;function Je(C,V,F){return F.subVectors(V,C),F.set(-F.y,F.x).normalize()}function D(C,V,F){r&&(r[Ye]=C.x,r[Ye+1]=C.y,r[Ye+2]=0,a&&(a[Ye]=0,a[Ye+1]=0,a[Ye+2]=1),Ye+=3,o&&(o[He]=V,o[He+1]=F,He+=2)),be+=3}function N(C,V,F,K,j){c.copy(V).sub(C).normalize(),h.copy(F).sub(C).normalize();let ce=Math.PI;const me=c.dot(h);Math.abs(me)<1&&(ce=Math.abs(Math.acos(me))),ce/=n,u.copy(V);for(let pe=0,Y=n-1;pe<Y;pe++)d.copy(u).rotateAround(C,ce),D(u,K,j),D(d,K,j),D(C,K,.5),u.copy(d);D(u,K,j),D(F,K,j),D(C,K,.5)}function L(){D(p,$,1),D(m,$,0),D(_,z,0),D(p,$,1),D(_,z,0),D(b,z,1)}function P(C,V,F){V?C?(D(p,$,1),D(m,$,0),D(_,z,0),D(p,$,1),D(_,z,0),D(x,z,1),D(_,F,0),D(T,F,0),D(x,F,.5)):(D(p,$,1),D(m,$,0),D(b,z,1),D(m,$,0),D(x,z,0),D(b,z,1),D(b,F,1),D(x,F,0),D(R,F,1)):C?(D(_,F,0),D(T,F,0),D(B,F,.5)):(D(b,F,1),D(R,F,0),D(B,F,.5))}function k(C,V){V&&(C?(D(p,$,1),D(m,$,0),D(_,z,0),D(p,$,1),D(_,z,0),D(x,z,1),D(_,$,0),D(B,z,.5),D(x,z,1),D(B,z,.5),D(T,$,0),D(x,z,1)):(D(p,$,1),D(m,$,0),D(b,z,1),D(m,$,0),D(x,z,0),D(b,z,1),D(b,$,1),D(x,z,0),D(B,z,.5),D(B,z,.5),D(x,z,0),D(R,$,1)))}function se(C,V,F,K,j,ce){switch(t.strokeLineCap){case"round":j?N(C,F,V,ce,.5):N(C,V,F,ce,.5);break;case"square":if(j)c.subVectors(V,C),h.set(c.y,-c.x),u.addVectors(c,h).add(C),d.subVectors(h,c).add(C),K?(u.toArray(r,1*3),d.toArray(r,0*3),d.toArray(r,3*3)):(u.toArray(r,1*3),o[3*2+1]===1?d.toArray(r,3*3):u.toArray(r,3*3),d.toArray(r,0*3));else{c.subVectors(F,C),h.set(c.y,-c.x),u.addVectors(c,h).add(C),d.subVectors(h,c).add(C);const me=r.length;K?(u.toArray(r,me-1*3),d.toArray(r,me-2*3),d.toArray(r,me-4*3)):(d.toArray(r,me-2*3),u.toArray(r,me-1*3),d.toArray(r,me-4*3))}break}}function _e(C){let V=!1;for(let K=1,j=C.length-1;K<j;K++)if(C[K].distanceTo(C[K+1])<i){V=!0;break}if(!V)return C;const F=[];F.push(C[0]);for(let K=1,j=C.length-1;K<j;K++)C[K].distanceTo(C[K+1])>=i&&F.push(C[K]);return F.push(C[C.length-1]),F}}}const Rl=/^\s*url\(\s*(?:["']\s*)?#([^)'"\s]+)(?:\s*["'])?\s*\)\s*$/;function zp(s,e,t=256){if(!s||!Array.isArray(s.stops)||s.stops.length===0)return null;const n=e.userData.transform,i=s.gradientUnits==="objectBoundingBox";let r=null;if(i&&(r=Vp(e,n),r===null))return null;function a(u,d,f){f.set(u,d,1),s.gradientTransform&&f.applyMatrix3(s.gradientTransform),i&&f.set(r.minX+f.x*r.width,r.minY+f.y*r.height,1),n&&f.applyMatrix3(n)}const o=document.createElement("canvas");let l;if(s.type==="linearGradient"){o.width=t,o.height=1;const u=o.getContext("2d"),d=u.createLinearGradient(0,0,t,0);Cl(d,s.stops),u.fillStyle=d,u.fillRect(0,0,t,1);const f=new U,g=new U;a(s.x1,s.y1,f),a(s.x2,s.y2,g);const v=g.x-f.x,m=g.y-f.y,p=v*v+m*m||1e-20,M=v/p,A=m/p,_=-(M*f.x+A*f.y);l=new Ve().set(M,A,_,0,0,.5,0,0,1)}else{let u=s.cx,d=s.cy,f=s.fx,g=s.fy,v=s.r;if(s.gradientTransform){const x=new U;x.set(u,d,1).applyMatrix3(s.gradientTransform),u=x.x,d=x.y,x.set(f,g,1).applyMatrix3(s.gradientTransform),f=x.x,g=x.y}if(i&&(u=r.minX+u*r.width,d=r.minY+d*r.height,f=r.minX+f*r.width,g=r.minY+g*r.height,v=v*Math.sqrt((r.width*r.width+r.height*r.height)/2)),v<=0)return null;o.width=t,o.height=t;const m=o.getContext("2d"),p=u-v,M=d-v,A=2*v,_=t/A;m.setTransform(_,0,0,_,-p*_,-M*_);const b=m.createRadialGradient(f,g,0,u,d,v);Cl(b,s.stops),m.fillStyle=b,m.fillRect(p,M,A,A);const T=n?n.clone().invert():new Ve;l=new Ve().set(1/A,0,-p/A,0,1/A,-M/A,0,0,1).multiply(T)}const c=new _o(o);c.colorSpace=rs,c.flipY=!1,c.matrixAutoUpdate=!1,c.matrix=l;const h=s.spreadMethod==="reflect"?1002:s.spreadMethod==="repeat"?1e3:1001;return c.wrapS=h,c.wrapT=h,c}function Vp(s,e){const t=e?e.clone().invert():null,n=new fe,i=new ta;for(const r of s.subPaths)for(const a of r.getPoints())n.copy(a),t&&n.applyMatrix3(t),i.expandByPoint(n);return i.isEmpty()?null:{minX:i.min.x,minY:i.min.y,width:i.max.x-i.min.x,height:i.max.y-i.min.y}}function Cl(s,e){const t=new We;for(const n of e){let i=n.color;if(n.opacity<1){t.setStyle(n.color,rs);const r=/rgb\(([^)]+)\)/.exec(t.getStyle(rs));r&&(i=`rgba(${r[1]},${n.opacity})`)}s.addColorStop(Math.max(0,Math.min(1,n.offset)),i)}}function ql(s,e){if(e===0)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(e===2||e===1){let t=s.getIndex();if(t===null){const r=[],a=s.getAttribute("position");if(a!==void 0){for(let o=0;o<a.count;o++)r.push(o);s.setIndex(r),t=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}const n=t.count-2,i=[];if(e===2)for(let r=1;r<=n;r++)i.push(t.getX(0)),i.push(t.getX(r)),i.push(t.getX(r+1));else for(let r=0;r<n;r++)r%2===0?(i.push(t.getX(r)),i.push(t.getX(r+1)),i.push(t.getX(r+2))):(i.push(t.getX(r+2)),i.push(t.getX(r+1)),i.push(t.getX(r)));return i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),s.setIndex(i),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),s}function Hp(s){const e=new Map,t=new Map,n=s.clone();return Pl(s,n,function(i,r){e.set(r,i),t.set(i,r)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;const r=i,a=e.get(i),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),n}function Pl(s,e,t){t(s,e);for(let n=0;n<s.children.length;n++)Pl(s.children[n],e.children[n],t)}class Wp extends Dn{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Zp(t)}),this.register(function(t){return new $p(t)}),this.register(function(t){return new a0(t)}),this.register(function(t){return new o0(t)}),this.register(function(t){return new l0(t)}),this.register(function(t){return new jp(t)}),this.register(function(t){return new e0(t)}),this.register(function(t){return new t0(t)}),this.register(function(t){return new n0(t)}),this.register(function(t){return new Jp(t)}),this.register(function(t){return new i0(t)}),this.register(function(t){return new Qp(t)}),this.register(function(t){return new r0(t)}),this.register(function(t){return new s0(t)}),this.register(function(t){return new Yp(t)}),this.register(function(t){return new Il(t,nt.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Il(t,nt.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new c0(t)})}load(e,t,n,i){const r=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const c=ji.extractUrlBase(e);a=ji.resolveURL(c,this.path)}else a=ji.extractUrlBase(e);this.manager.itemStart(e);const o=function(c){i?i(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new Vs(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,a,function(h){t(h),r.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let r;const a={},o={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Ll){try{a[nt.KHR_BINARY_GLTF]=new h0(e)}catch(u){i&&i(u);return}r=JSON.parse(a[nt.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new b0(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const u=this.pluginCallbacks[h](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[u.name]=u,a[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){const u=r.extensionsUsed[h],d=r.extensionsRequired||[];switch(u){case nt.KHR_MATERIALS_UNLIT:a[u]=new Kp;break;case nt.KHR_DRACO_MESH_COMPRESSION:a[u]=new u0(r,this.dracoLoader);break;case nt.KHR_TEXTURE_TRANSFORM:a[u]=new d0;break;case nt.KHR_MESH_QUANTIZATION:a[u]=new f0;break;default:d.indexOf(u)>=0&&o[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,i)}parseAsync(e,t){const n=this;return new Promise(function(i,r){n.parse(e,t,i,r)})}}function Xp(){let s={};return{get:function(e){return s[e]},add:function(e,t){s[e]=t},remove:function(e){delete s[e]},removeAll:function(){s={}}}}function Mt(s,e,t){const n=s.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}const nt={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class Yp{constructor(e){this.parser=e,this.name=nt.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){const r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let i=t.cache.get(n);if(i)return i;const r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e];let c;const h=new We(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],Bt);const u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Ko(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Yo(h),c.distance=u;break;case"spot":c=new tu(h),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),mn(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}}class Kp{constructor(){this.name=nt.KHR_MATERIALS_UNLIT}getMaterialType(){return Wt}extendParams(e,t,n){const i=[];e.color=new We(1,1,1),e.opacity=1;const r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],Bt),e.opacity=a[3]}r.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",r.baseColorTexture,St))}return Promise.all(i)}}class Jp{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const n=Mt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}}class Zp{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?Xt:null}extendMaterialParams(e,t){const n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){const r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new fe(r,r)}return Promise.all(i)}}class $p{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?Xt:null}extendMaterialParams(e,t){const n=Mt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}}class Qp{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?Xt:null}extendMaterialParams(e,t){const n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(i)}}class jp{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_SHEEN}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?Xt:null}extendMaterialParams(e,t){const n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(t.sheenColor=new We(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){const r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],Bt)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,St)),n.sheenRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(i)}}class e0{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?Xt:null}extendMaterialParams(e,t){const n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(i)}}class t0{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_VOLUME}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?Xt:null}extendMaterialParams(e,t){const n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;const r=n.attenuationColor||[1,1,1];return t.attenuationColor=new We().setRGB(r[0],r[1],r[2],Bt),Promise.all(i)}}class n0{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_IOR}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?Xt:null}extendMaterialParams(e,t){const n=Mt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}}class i0{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?Xt:null}extendMaterialParams(e,t){const n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));const r=n.specularColorFactor||[1,1,1];return t.specularColor=new We().setRGB(r[0],r[1],r[2],Bt),n.specularColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,St)),Promise.all(i)}}class s0{constructor(e){this.parser=e,this.name=nt.EXT_MATERIALS_BUMP}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?Xt:null}extendMaterialParams(e,t){const n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(i)}}class r0{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?Xt:null}extendMaterialParams(e,t){const n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(i)}}class a0{constructor(e){this.parser=e,this.name=nt.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;const r=i.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}}class o0{constructor(e){this.parser=e,this.name=nt.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class l0{constructor(e){this.parser=e,this.name=nt.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class Il{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const i=n.extensions[this.name],r=this.parser.getDependency("buffer",i.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){const l=i.byteOffset||0,c=i.byteLength||0,h=i.count,u=i.byteStride,d=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,u,d,i.mode,i.filter).then(function(f){return f.buffer}):a.ready.then(function(){const f=new ArrayBuffer(h*u);return a.decodeGltfBuffer(new Uint8Array(f),h,u,d,i.mode,i.filter),f})})}else return null}}class c0{constructor(e){this.name=nt.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const i=t.meshes[n.mesh];for(const c of i.primitives)if(c.mode!==Kt.TRIANGLES&&c.mode!==Kt.TRIANGLE_STRIP&&c.mode!==Kt.TRIANGLE_FAN&&c.mode!==void 0)return null;const a=n.extensions[this.name].attributes,o=[],l={};for(const c in a)o.push(this.parser.getDependency("accessor",a[c]).then(h=>(l[c]=h,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{const h=c.pop(),u=h.isGroup?h.children:[h],d=c[0].count,f=[];for(const g of u){const v=new $e,m=new U,p=new Vt,M=new U(1,1,1),A=new ao(g.geometry,g.material,d);for(let b=0;b<d;b++)l.TRANSLATION&&m.fromBufferAttribute(l.TRANSLATION,b),l.ROTATION&&p.fromBufferAttribute(l.ROTATION,b),l.SCALE&&M.fromBufferAttribute(l.SCALE,b),A.setMatrixAt(b,v.compose(m,p,M));let _=null;for(const b in l)if(b==="_COLOR_0"){const T=l[b];A.instanceColor=new Rs(T.array,T.itemSize,T.normalized)}else if(b!=="TRANSLATION"&&b!=="ROTATION"&&b!=="SCALE"){if(_===null){const R=A.geometry;_=new yt,_.name=R.name;for(const x in R.attributes)_.setAttribute(x,R.attributes[x]);for(const x in R.morphAttributes)_.morphAttributes[x]=R.morphAttributes[x];R.index!==null&&_.setIndex(R.index),_.morphTargetsRelative=R.morphTargetsRelative;for(const x of R.groups)_.addGroup(x.start,x.count,x.materialIndex);R.boundingBox!==null&&(_.boundingBox=R.boundingBox.clone()),R.boundingSphere!==null&&(_.boundingSphere=R.boundingSphere.clone()),_.drawRange.start=R.drawRange.start,_.drawRange.count=R.drawRange.count,_.userData=Object.assign({},R.userData),A.geometry=_}const T=l[b];_.setAttribute(b,new Rs(T.array,T.itemSize,T.normalized))}_t.prototype.copy.call(A,g),this.parser.assignFinalMaterial(A),f.push(A)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}}const Ll="glTF",as=12,Nl={JSON:1313821514,BIN:5130562};class h0{constructor(e){this.name=nt.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,as),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Ll)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const i=this.header.length-as,r=new DataView(e,as);let a=0;for(;a<i;){const o=r.getUint32(a,!0);a+=4;const l=r.getUint32(a,!0);if(a+=4,l===Nl.JSON){const c=new Uint8Array(e,as+a,o);this.content=n.decode(c)}else if(l===Nl.BIN){const c=as+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class u0{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=nt.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,i=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(const h in a){const u=pa[h]||h.toLowerCase();o[u]=a[h]}for(const h in e.attributes){const u=pa[h]||h.toLowerCase();if(a[h]!==void 0){const d=n.accessors[e.attributes[h]],f=Ei[d.componentType];c[u]=f.name,l[u]=d.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(u,d){i.decodeDracoFile(h,function(f){for(const g in f.attributes){const v=f.attributes[g],m=l[g];m!==void 0&&(v.normalized=m)}u(f)},o,c,Bt,d)})})}}class d0{constructor(){this.name=nt.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){const n=Math.cos(e.rotation),i=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*i,e.offset.x,-e.repeat.x*i,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}}class f0{constructor(){this.name=nt.KHR_MESH_QUANTIZATION}}class Dl extends gi{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i*3+i;for(let a=0;a!==i;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,h=i-t,u=(n-t)/h,d=u*u,f=d*u,g=e*c,v=g-c,m=-2*f+3*d,p=f-d,M=1-m,A=p-d+u;for(let _=0;_!==o;_++){const b=a[v+_+o],T=a[v+_+l]*h,R=a[g+_+o],x=a[g+_]*h;r[_]=M*b+A*T+m*R+p*x}return r}}const p0=new Vt;class m0 extends Dl{interpolate_(e,t,n,i){const r=super.interpolate_(e,t,n,i);return p0.fromArray(r).normalize().toArray(r),r}}const Kt={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Ei={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Fl={9728:1003,9729:1006,9984:1004,9985:1007,9986:1005,9987:1008},Ul={33071:1001,33648:1002,10497:1e3},fa={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},pa={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},On={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},g0={CUBICSPLINE:void 0,LINEAR:2301,STEP:2300},ma={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function _0(s){return s.DefaultMaterial===void 0&&(s.DefaultMaterial=new mi({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:0})),s.DefaultMaterial}function Jn(s,e,t){for(const n in t.extensions)s[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function mn(s,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(s.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function x0(s,e,t){let n=!1,i=!1,r=!1;for(let c=0,h=e.length;c<h;c++){const u=e[c];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(r=!0),n&&i&&r)break}if(!n&&!i&&!r)return Promise.resolve(s);const a=[],o=[],l=[];for(let c=0,h=e.length;c<h;c++){const u=e[c];if(n){const d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):s.attributes.position;a.push(d)}if(i){const d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):s.attributes.normal;o.push(d)}if(r){const d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):s.attributes.color;l.push(d)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){const h=c[0],u=c[1],d=c[2];return n&&(s.morphAttributes.position=h),i&&(s.morphAttributes.normal=u),r&&(s.morphAttributes.color=d),s.morphTargetsRelative=!0,s})}function v0(s,e){if(s.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)s.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(s.morphTargetInfluences.length===t.length){s.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)s.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function y0(s){let e;const t=s.extensions&&s.extensions[nt.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+ga(t.attributes):e=s.indices+":"+ga(s.attributes)+":"+s.mode,s.targets!==void 0)for(let n=0,i=s.targets.length;n<i;n++)e+=":"+ga(s.targets[n]);return e}function ga(s){let e="";const t=Object.keys(s).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+s[t[n]]+";";return e}function _a(s){switch(s){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function S0(s){return s.search(/\.jpe?g($|\?)/i)>0||s.search(/^data\:image\/jpeg/)===0?"image/jpeg":s.search(/\.webp($|\?)/i)>0||s.search(/^data\:image\/webp/)===0?"image/webp":s.search(/\.ktx2($|\?)/i)>0||s.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const M0=new $e;class b0{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Xp,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,r=!1,a=-1;if(typeof navigator!="undefined"&&typeof navigator.userAgent!="undefined"){const o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;const l=o.match(/Version\/(\d+)/);i=n&&l?parseInt(l[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap=="undefined"||n&&i<17||r&&a<98?this.textureLoader=new Go(this.options.manager):this.textureLoader=new su(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Vs(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,i=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){const o={scene:a[0][i.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:i.asset,parser:n,userData:{}};return Jn(r,o,i),mn(o,i),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(const l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,r=t.length;i<r;i++){const a=t[i].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let i=0,r=e.length;i<r;i++){const a=e[i];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const i=n.clone(),r=(a,o)=>{const l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(const[c,h]of a.children.entries())r(h,o.children[c])};return r(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const i=e(t[n]);if(i)return i}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let i=0;i<t.length;i++){const r=e(t[i]);r&&n.push(r)}return n}getDependency(e,t){const n=e+":"+t;let i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":i=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[nt.KHR_BINARY_GLTF].body);const i=this.options;return new Promise(function(r,a){n.load(ji.resolveURL(t.uri,i.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const i=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+i)})}loadAccessor(e){const t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){const a=fa[i.type],o=Ei[i.componentType],l=i.normalized===!0,c=new o(i.count*a);return Promise.resolve(new Ot(c,a,l))}const r=[];return i.bufferView!==void 0?r.push(this.getDependency("bufferView",i.bufferView)):r.push(null),i.sparse!==void 0&&(r.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(r).then(function(a){const o=a[0],l=fa[i.type],c=Ei[i.componentType],h=c.BYTES_PER_ELEMENT,u=h*l,d=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,g=i.normalized===!0;let v,m;if(f&&f!==u){const p=Math.floor(d/f),M="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+p+":"+i.count;let A=t.cache.get(M);A||(v=new c(o,p*f,i.count*f/h),A=new Fc(v,f/h),t.cache.add(M,A)),m=new Mr(A,l,d%f/h,g)}else o===null?v=new c(i.count*l):v=new c(o,d,i.count*l),m=new Ot(v,l,g);if(i.sparse!==void 0){const p=fa.SCALAR,M=Ei[i.sparse.indices.componentType],A=i.sparse.indices.byteOffset||0,_=i.sparse.values.byteOffset||0,b=new M(a[1],A,i.sparse.count*p),T=new c(a[2],_,i.sparse.count*l);o!==null&&(m=new Ot(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let R=0,x=b.length;R<x;R++){const w=b[R];if(m.setX(w,T[R*l]),l>=2&&m.setY(w,T[R*l+1]),l>=3&&m.setZ(w,T[R*l+2]),l>=4&&m.setW(w,T[R*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){const t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r];let o=this.textureLoader;if(a.uri){const l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){const i=this,r=this.json,a=r.textures[e],o=r.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);const d=(r.samplers||{})[a.sampler]||{};return h.magFilter=Fl[d.magFilter]||1006,h.minFilter=Fl[d.minFilter]||1008,h.wrapS=Ul[d.wrapS]||1e3,h.wrapT=Ul[d.wrapT]||1e3,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==1003&&h.minFilter!==1006,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const n=this,i=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());const a=i.images[e],o=self.URL||self.webkitURL;let l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(u){c=!0;const d=new Blob([u],{type:a.mimeType});return l=o.createObjectURL(d),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(l).then(function(u){return new Promise(function(d,f){let g=d;t.isImageBitmapLoader===!0&&(g=function(v){const m=new Tt(v);m.needsUpdate=!0,d(m)}),t.load(ji.resolveURL(u,r.path),g,void 0,f)})}).then(function(u){return c===!0&&o.revokeObjectURL(l),mn(u,a),u.userData.mimeType=a.mimeType||S0(a.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){const r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[nt.KHR_TEXTURE_TRANSFORM]){const o=n.extensions!==void 0?n.extensions[nt.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const l=r.associations.get(a);a=r.extensions[nt.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,l)}}return i!==void 0&&(a.colorSpace=i),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const i=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new fo,rn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){const o="LineBasicMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new oo,rn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(i||r||a){let o="ClonedMaterial:"+n.uuid+":";i&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),r&&(l.vertexColors=!0),a&&(l.flatShading=!0),i&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return mi}loadMaterial(e){const t=this,n=this.json,i=this.extensions,r=n.materials[e];let a;const o={},l=r.extensions||{},c=[];if(l[nt.KHR_MATERIALS_UNLIT]){const u=i[nt.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),c.push(u.extendParams(o,r,t))}else{const u=r.pbrMetallicRoughness||{};if(o.color=new We(1,1,1),o.opacity=1,Array.isArray(u.baseColorFactor)){const d=u.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],Bt),o.opacity=d[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",u.baseColorTexture,St)),o.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,o.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=2);const h=r.alphaMode||ma.OPAQUE;if(h===ma.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===ma.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==Wt&&(c.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new fe(1,1),r.normalTexture.scale!==void 0)){const u=r.normalTexture.scale;o.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&a!==Wt&&(c.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==Wt){const u=r.emissiveFactor;o.emissive=new We().setRGB(u[0],u[1],u[2],Bt)}return r.emissiveTexture!==void 0&&a!==Wt&&c.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,St)),Promise.all(c).then(function(){const u=new a(o);return r.name&&(u.name=r.name),mn(u,r),t.associations.set(u,{materials:e}),r.extensions&&Jn(i,u,r),u})}createUniqueName(e){const t=ot.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,i=this.primitiveCache;function r(o){return n[nt.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return Ol(l,o,t)})}const a=[];for(let o=0,l=e.length;o<l;o++){const c=e[o],h=y0(c),u=i[h];if(u)a.push(u.promise);else{let d;c.extensions&&c.extensions[nt.KHR_DRACO_MESH_COMPRESSION]?d=r(c):d=Ol(new yt,c,t),c.mode===Kt.TRIANGLE_STRIP?d=d.then(f=>ql(f,1)):c.mode===Kt.TRIANGLE_FAN&&(d=d.then(f=>ql(f,2))),i[h]={primitive:c,promise:d},a.push(d)}}return Promise.all(a)}loadMesh(e){const t=this,n=this.json,i=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let l=0,c=a.length;l<c;l++){const h=a[l].material===void 0?_0(this.cache):this.getDependency("material",a[l].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(async function(l){const c=l.slice(0,l.length-1),h=l[l.length-1],u=[];for(let f=0,g=h.length;f<g;f++){const v=h[f],m=a[f];let p;const M=c[f];if(m.mode===Kt.TRIANGLES||m.mode===Kt.TRIANGLE_STRIP||m.mode===Kt.TRIANGLE_FAN||m.mode===void 0){const A=r.isSkinnedMesh===!0,_=v.hasAttribute("skinIndex")&&v.hasAttribute("skinWeight");A&&_===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),p=A&&_?new zc(v,M):new tt(v,M),p.isSkinnedMesh===!0&&p.normalizeSkinWeights()}else if(m.mode===Kt.LINES)p=new Xc(v,M);else if(m.mode===Kt.LINE_STRIP)p=new Ir(v,M);else if(m.mode===Kt.LINE_LOOP)p=new Yc(v,M);else if(m.mode===Kt.POINTS)p=new Kc(v,M);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(p.geometry.morphAttributes).length>0&&v0(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),mn(p,r),m.extensions&&Jn(i,p,m),t.assignFinalMaterial(p),u.push(p)}for(let f=0,g=u.length;f<g;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return r.extensions&&Jn(i,u[0],r),u[0];const d=new qt;r.extensions&&Jn(i,d,r),t.associations.set(d,{meshes:e});for(let f=0,g=u.length;f<g;f++)d.add(u[f]);return d})}loadCamera(e){let t;const n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Ft(vc.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new Ys(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),mn(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let i=0,r=t.joints.length;i<r;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){const r=i.pop(),a=i,o=[],l=[];for(let c=0,h=a.length;c<h;c++){const u=a[c];if(u){o.push(u);const d=new $e;r!==null&&d.fromArray(r.array,c*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new Cr(o,l)})}loadAnimation(e){const t=this.json,n=this,i=t.animations[e],r=i.name?i.name:"animation_"+e,a=[],o=[],l=[],c=[],h=[];for(let u=0,d=i.channels.length;u<d;u++){const f=i.channels[u],g=i.samplers[f.sampler],v=f.target,m=v.node,p=i.parameters!==void 0?i.parameters[g.input]:g.input,M=i.parameters!==void 0?i.parameters[g.output]:g.output;v.node!==void 0&&(a.push(this.getDependency("node",m)),o.push(this.getDependency("accessor",p)),l.push(this.getDependency("accessor",M)),c.push(g),h.push(v))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(u){const d=u[0],f=u[1],g=u[2],v=u[3],m=u[4],p=[];for(let A=0,_=d.length;A<_;A++){const b=d[A],T=f[A],R=g[A],x=v[A],w=m[A];if(b===void 0)continue;b.updateMatrix&&b.updateMatrix();const I=n._createAnimationTracks(b,T,R,x,w);if(I)for(let O=0;O<I.length;O++)p.push(I[O])}const M=new Jr(r,void 0,p);return mn(M,i),M})}createNodeMesh(e){const t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(r){const a=n._getNodeRef(n.meshCache,i.mesh,r);return i.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=i.weights.length;l<c;l++)o.morphTargetInfluences[l]=i.weights[l]}),a})}loadNode(e){const t=this.json,n=this,i=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=i.children||[];for(let c=0,h=o.length;c<h;c++)a.push(n.getDependency("node",o[c]));const l=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([r,Promise.all(a),l]).then(function(c){const h=c[0],u=c[1],d=c[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,M0)});for(let f=0,g=u.length;f<g;f++)h.add(u[f]);if(h.userData.pivot!==void 0&&u.length>0){const f=h.userData.pivot,g=u[0];h.pivot=new U().fromArray(f),h.position.x-=f[0],h.position.y-=f[1],h.position.z-=f[2],g.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const r=t.nodes[e],a=r.name?i.createUniqueName(r.name):"",o=[],l=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),r.camera!==void 0&&o.push(i.getDependency("camera",r.camera).then(function(c){return i._getNodeRef(i.cameraCache,r.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let h;if(r.isBone===!0?h=new no:c.length>1?h=new qt:c.length===1?h=c[0]:h=new _t,h!==c[0])for(let u=0,d=c.length;u<d;u++)h.add(c[u]);if(r.name&&(h.userData.name=r.name,h.name=a),mn(h,r),r.extensions&&Jn(n,h,r),r.matrix!==void 0){const u=new $e;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!i.associations.has(h))i.associations.set(h,{});else if(r.mesh!==void 0&&i.meshCache.refs[r.mesh]>1){const u=i.associations.get(h);i.associations.set(h,{...u})}return i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],i=this,r=new qt;n.name&&(r.name=i.createUniqueName(n.name)),mn(r,n),n.extensions&&Jn(t,r,n);const a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(i.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let h=0,u=l.length;h<u;h++){const d=l[h];d.parent!==null?r.add(Hp(d)):r.add(d)}const c=h=>{const u=new Map;for(const[d,f]of i.associations)(d instanceof rn||d instanceof Tt)&&u.set(d,f);return h.traverse(d=>{const f=i.associations.get(d);f!=null&&u.set(d,f)}),u};return i.associations=c(r),r})}_createAnimationTracks(e,t,n,i,r){const a=[],o=e.name?e.name:e.uuid,l=[];function c(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}On[r.path]===On.weights?(c(e),e.isGroup&&e.children.forEach(c)):l.push(o);let h;switch(On[r.path]){case On.weights:h=$i;break;case On.rotation:h=Qi;break;case On.translation:case On.scale:h=zs;break;default:switch(n.itemSize){case 1:h=$i;break;case 2:case 3:default:h=zs;break}break}const u=i.interpolation!==void 0?g0[i.interpolation]:2301,d=this._getArrayFromAccessor(n);for(let f=0,g=l.length;f<g;f++){const v=new h(l[f]+"."+On[r.path],t.array,d,u);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(v),a.push(v)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=_a(t.constructor),i=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)i[r]=t[r]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const i=this instanceof Qi?m0:Dl;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function T0(s,e,t){const n=e.attributes,i=new nn;if(n.POSITION!==void 0){const o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(i.set(new U(l[0],l[1],l[2]),new U(c[0],c[1],c[2])),o.normalized){const h=_a(Ei[o.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=e.targets;if(r!==void 0){const o=new U,l=new U;for(let c=0,h=r.length;c<h;c++){const u=r[c];if(u.POSITION!==void 0){const d=t.json.accessors[u.POSITION],f=d.min,g=d.max;if(f!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(g[2]))),d.normalized){const v=_a(Ei[d.componentType]);l.multiplyScalar(v)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(o)}s.boundingBox=i;const a=new cn;i.getCenter(a.center),a.radius=i.min.distanceTo(i.max)/2,s.boundingSphere=a}function Ol(s,e,t){const n=e.attributes,i=[];function r(a,o){return t.getDependency("accessor",a).then(function(l){s.setAttribute(o,l)})}for(const a in n){const o=pa[a]||a.toLowerCase();o in s.attributes||i.push(r(n[a],o))}if(e.indices!==void 0&&!s.index){const a=t.getDependency("accessor",e.indices).then(function(o){s.setIndex(o)});i.push(a)}return it.workingColorSpace!==Bt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${it.workingColorSpace}" not supported.`),mn(s,e),T0(s,e,t),Promise.all(i).then(function(){return e.targets!==void 0?x0(s,e.targets,t):s})}class E0 extends Wa{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;const e=new Xn;e.deleteAttribute("uv");const t=new mi({side:1}),n=new mi,i=new Yo(16777215,900,28,2);i.position.set(.418,16.199,.3),this.add(i);const r=new tt(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new ao(e,n,6),o=new _t;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const l=new tt(e,Ai(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);const c=new tt(e,Ai(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);const h=new tt(e,Ai(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);const u=new tt(e,Ai(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);const d=new tt(e,Ai(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);const f=new tt(e,Ai(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function Ai(s){return new Fh({color:0,emissive:16777215,emissiveIntensity:s})}const A0=.35,w0={glyphs:{0:{ha:1417,x_min:82,x_max:1334,o:"m 708 -20 l 708 -20 q 372 71 511 -20 q 157 333 232 162 q 82 744 82 503 l 82 744 q 157 1157 82 985 q 372 1419 232 1328 q 708 1510 511 1510 l 708 1510 q 1046 1419 905 1510 q 1260 1156 1186 1327 q 1334 744 1334 985 l 1334 744 q 1260 333 1334 503 q 1046 71 1186 162 q 708 -20 906 -20 m 708 269 l 708 269 q 852 324 793 269 q 941 485 910 379 q 971 744 971 591 l 971 744 q 941 1005 971 898 q 852 1167 910 1111 q 709 1223 793 1223 l 709 1223 q 566 1167 624 1223 q 477 1005 507 1111 q 446 744 446 898 l 446 744 q 476 485 446 591 q 565 324 506 379 q 708 269 624 269"},1:{ha:904,x_min:91,x_max:788,o:"m 423 1490 l 788 1490 l 788 0 l 436 0 l 436 1183 l 426 1183 l 91 952 l 91 1262 l 423 1490"},2:{ha:1306,x_min:91,x_max:1209,o:"m 1209 0 l 111 0 l 111 253 l 653 732 q 759 836 715 788 q 825 930 802 883 q 848 1034 848 977 l 848 1034 q 821 1141 848 1096 q 746 1209 793 1185 q 636 1233 698 1233 l 636 1233 q 526 1208 573 1233 q 453 1135 479 1183 q 427 1019 427 1087 l 427 1019 l 91 1019 q 160 1280 91 1170 q 351 1450 228 1390 q 637 1510 474 1510 l 637 1510 q 930 1454 805 1510 q 1122 1296 1054 1397 q 1190 1061 1190 1194 l 1190 1061 q 1157 894 1190 976 q 1036 709 1123 811 q 786 467 948 607 l 786 467 l 601 295 l 601 285 l 1209 285 l 1209 0"},3:{ha:1345,x_min:88,x_max:1262,o:"m 669 -20 l 669 -20 q 370 38 500 -20 q 164 199 239 96 q 88 435 89 301 l 88 435 l 442 435 q 474 348 444 386 q 556 289 504 310 q 672 268 607 268 l 672 268 q 787 291 737 268 q 864 355 836 314 q 892 449 892 395 l 892 449 q 862 544 892 503 q 775 609 831 585 q 642 632 718 632 l 642 632 l 497 632 l 497 884 l 642 884 q 759 907 708 884 q 839 970 810 930 q 867 1062 867 1009 l 867 1062 q 843 1152 867 1113 q 775 1212 818 1190 q 673 1233 731 1233 l 673 1233 q 563 1212 612 1233 q 485 1152 514 1190 q 456 1061 456 1114 l 456 1061 l 117 1061 q 191 1295 118 1193 q 389 1453 263 1396 q 674 1510 514 1510 l 674 1510 q 953 1454 832 1510 q 1141 1302 1074 1398 q 1208 1084 1208 1205 l 1208 1084 q 1127 878 1208 960 q 916 776 1045 795 l 916 776 l 916 765 q 1107 706 1030 752 q 1223 587 1184 659 q 1262 422 1262 514 l 1262 422 q 1187 194 1262 294 q 977 37 1111 93 q 669 -20 843 -20"},4:{ha:1410,x_min:93,x_max:1329,o:"m 811 249 l 93 249 l 93 525 l 705 1490 l 1150 1490 l 1150 528 l 1329 528 l 1329 249 l 1150 249 l 1150 0 l 811 0 l 811 249 m 444 528 l 819 528 l 819 1114 l 807 1114 l 444 540 l 444 528"},5:{ha:1298,x_min:79,x_max:1215,o:"m 642 -20 l 642 -20 q 353 39 479 -20 q 155 200 227 97 q 79 435 82 302 l 79 435 l 423 435 q 454 340 424 381 q 534 276 484 298 q 642 253 583 253 l 642 253 q 763 283 710 253 q 845 368 815 313 q 874 494 874 422 l 874 494 q 844 622 874 567 q 761 708 814 677 q 639 738 708 738 l 639 738 q 515 709 573 738 q 427 631 457 680 l 427 631 l 114 690 l 179 1490 l 1129 1490 l 1129 1204 l 470 1204 l 436 850 l 444 850 q 564 950 482 911 q 750 989 646 989 l 750 989 q 935 954 850 989 q 1083 853 1020 918 q 1181 699 1146 788 q 1215 503 1215 610 l 1215 503 q 1144 232 1215 350 q 943 47 1072 114 q 642 -20 814 -20"},6:{ha:1355,x_min:82,x_max:1273,o:"m 699 -20 l 699 -20 q 467 20 578 -20 q 270 146 356 59 q 133 374 183 232 q 82 718 82 515 l 82 718 q 126 1050 82 903 q 253 1299 170 1196 q 450 1456 335 1402 q 706 1510 565 1510 l 706 1510 q 981 1450 862 1510 q 1171 1288 1099 1389 q 1256 1061 1243 1186 l 1256 1061 l 909 1061 q 838 1171 893 1133 q 706 1208 783 1208 l 706 1208 q 553 1154 614 1208 q 462 1002 492 1100 q 431 768 431 903 l 431 768 l 440 768 q 529 883 472 835 q 660 957 585 931 q 817 982 735 982 l 817 982 q 1054 921 951 982 q 1215 751 1156 859 q 1273 505 1273 643 l 1273 505 q 1200 232 1273 350 q 998 47 1127 113 q 699 -20 869 -20 m 696 253 l 696 253 q 817 285 764 253 q 900 371 869 316 q 931 494 931 425 l 931 494 q 901 617 931 562 q 818 703 870 671 q 697 734 765 734 l 697 734 q 606 716 648 734 q 531 664 563 697 q 482 588 499 631 q 464 493 464 544 l 464 493 q 494 372 464 426 q 577 285 524 317 q 696 253 630 253"},7:{ha:1204,x_min:66,x_max:1138,o:"m 532 0 l 168 0 l 771 1195 l 771 1204 l 66 1204 l 66 1490 l 1138 1490 l 1138 1201 l 532 0"},8:{ha:1360,x_min:82,x_max:1278,o:"m 679 -20 l 679 -20 q 372 36 506 -20 q 160 187 237 91 q 82 402 82 282 l 82 402 q 127 572 82 495 q 247 701 171 649 q 415 768 322 753 l 415 768 l 415 777 q 215 894 293 802 q 136 1108 136 985 l 136 1108 q 207 1315 136 1224 q 400 1458 277 1405 q 679 1510 523 1510 l 679 1510 q 959 1458 836 1510 q 1153 1314 1082 1405 q 1224 1108 1224 1223 l 1224 1108 q 1145 894 1224 985 q 945 777 1066 802 l 945 777 l 945 768 q 1114 701 1038 753 q 1234 572 1189 649 q 1278 402 1278 495 l 1278 402 q 1201 187 1278 282 q 988 36 1123 91 q 679 -20 853 -20 m 679 231 l 679 231 q 798 257 747 231 q 878 328 849 282 q 907 432 907 373 l 907 432 q 878 536 907 491 q 797 608 848 581 q 679 634 746 634 l 679 634 q 563 608 614 634 q 483 537 512 582 q 453 432 453 491 l 453 432 q 482 328 453 373 q 562 257 510 283 q 679 231 613 231 m 679 884 l 679 884 q 782 908 737 884 q 852 974 826 932 q 878 1068 878 1015 l 878 1068 q 853 1163 878 1122 q 783 1226 827 1203 q 679 1249 738 1249 l 679 1249 q 577 1226 622 1249 q 507 1163 532 1203 q 482 1068 482 1122 l 482 1068 q 507 974 482 1015 q 577 908 532 932 q 679 884 622 884"},9:{ha:1355,x_min:82,x_max:1273,o:"m 649 -23 l 649 -23 q 375 38 494 -23 q 185 202 256 99 q 99 430 113 305 l 99 430 l 447 430 q 518 319 463 358 q 649 279 572 279 l 649 279 q 803 334 741 279 q 894 488 864 388 q 924 722 924 588 l 924 722 l 915 722 q 828 608 885 656 q 696 535 770 560 q 539 509 622 509 l 539 509 q 302 571 405 509 q 141 740 199 632 q 82 986 82 848 l 82 986 q 155 1261 82 1141 q 358 1447 228 1380 q 657 1513 487 1514 l 657 1513 q 890 1473 779 1513 q 1086 1346 1000 1433 q 1223 1118 1172 1259 q 1273 772 1273 976 l 1273 772 q 1229 440 1273 587 q 1103 190 1185 293 q 906 32 1021 86 q 649 -23 791 -23 m 658 757 l 658 757 q 751 776 708 757 q 826 827 794 794 q 875 904 857 860 q 892 998 892 947 l 892 998 q 862 1119 892 1065 q 780 1205 832 1173 q 659 1237 727 1237 l 659 1237 q 540 1206 593 1237 q 456 1120 486 1174 q 425 997 425 1065 l 425 997 q 456 874 425 928 q 539 789 486 820 q 658 757 591 757"}," ":{ha:448,x_min:0,x_max:0,o:""},"!":{ha:734,x_min:172,x_max:562,o:"m 527 469 l 207 469 l 181 1490 l 553 1490 l 527 469 m 367 -21 l 367 -21 q 226 29 280 -21 q 172 162 172 79 l 172 162 q 226 296 172 245 q 367 346 280 346 l 367 346 q 509 296 455 346 q 562 162 562 245 l 562 162 q 509 29 562 79 q 367 -21 455 -21"},'"':{ha:1201,x_min:199,x_max:1002,o:"m 494 848 l 233 848 l 199 1490 l 527 1490 l 494 848 m 969 848 l 708 848 l 674 1490 l 1002 1490 l 969 848"},"#":{ha:1342,x_min:17,x_max:1324,o:"m 938 0 l 681 0 l 740 357 l 474 357 l 416 0 l 158 0 l 216 357 l 17 357 l 61 615 l 259 615 l 301 875 l 102 875 l 146 1133 l 344 1133 l 402 1490 l 660 1490 l 602 1133 l 867 1133 l 926 1490 l 1184 1490 l 1125 1133 l 1324 1133 l 1281 875 l 1082 875 l 1040 615 l 1240 615 l 1196 357 l 997 357 l 938 0 m 559 875 l 517 615 l 782 615 l 825 875 l 559 875"},$:{ha:1352,x_min:72,x_max:1280,o:"m 750 -194 l 630 -194 l 630 -18 q 367 36 482 -11 l 367 36 q 152 206 229 92 q 72 492 75 320 l 72 492 l 411 492 q 451 371 416 420 q 546 298 485 322 l 546 298 q 630 276 584 282 l 630 276 l 630 612 l 524 637 q 221 781 331 681 q 111 1049 111 881 l 111 1049 q 186 1291 111 1187 q 392 1453 261 1395 l 392 1453 q 630 1508 498 1499 l 630 1508 l 630 1684 l 750 1684 l 750 1508 q 991 1452 886 1500 l 991 1452 q 1188 1289 1118 1393 q 1260 1046 1258 1184 l 1260 1046 l 921 1046 q 855 1172 914 1127 l 855 1172 q 750 1213 814 1203 l 750 1213 l 750 894 l 825 877 q 1018 815 933 854 q 1161 720 1102 775 q 1250 593 1219 665 q 1280 432 1280 521 l 1280 432 q 1210 190 1280 291 q 1008 34 1139 88 l 1008 34 q 750 -19 897 -11 l 750 -19 l 750 -194 m 750 583 l 750 277 q 813 293 784 282 l 813 293 q 895 349 866 313 q 923 433 923 385 l 923 433 q 897 506 923 476 q 817 559 870 536 l 817 559 q 750 583 788 572 l 750 583 m 630 925 l 630 925 l 630 1213 q 572 1199 598 1208 l 572 1199 q 500 1148 524 1180 q 476 1073 476 1115 l 476 1073 q 503 996 476 1027 q 580 943 530 964 l 580 943 q 630 925 603 933"},"%":{ha:2108,x_min:168,x_max:1940,o:"m 506 757 l 506 757 q 321 804 396 757 q 207 928 245 850 q 168 1096 168 1005 l 168 1096 l 168 1174 q 208 1344 168 1267 q 323 1468 247 1421 q 506 1514 399 1514 l 506 1514 q 692 1468 617 1514 q 806 1344 767 1421 q 844 1174 844 1267 l 844 1174 l 844 1096 q 805 926 844 1003 q 691 803 766 849 q 506 757 615 757 m 506 962 l 506 962 q 591 1004 569 962 q 613 1096 613 1046 l 613 1096 l 613 1174 q 592 1267 613 1223 q 506 1311 571 1311 l 506 1311 q 421 1266 443 1311 q 399 1174 399 1221 l 399 1174 l 399 1096 q 422 1004 399 1046 q 506 962 444 962 m 1601 -25 l 1601 -25 q 1417 22 1492 -25 q 1302 145 1341 68 q 1263 314 1263 222 l 1263 314 l 1263 392 q 1303 562 1263 484 q 1419 686 1343 639 q 1601 732 1494 732 l 1601 732 q 1788 686 1712 732 q 1902 562 1863 639 q 1940 392 1940 484 l 1940 392 l 1940 314 q 1901 144 1940 221 q 1786 21 1861 67 q 1601 -25 1710 -25 m 1601 180 l 1601 180 q 1687 222 1665 180 q 1709 314 1709 264 l 1709 314 l 1709 392 q 1688 485 1709 441 q 1601 529 1667 529 l 1601 529 q 1517 484 1539 529 q 1494 392 1494 439 l 1494 392 l 1494 314 q 1517 222 1494 264 q 1601 180 1540 180 m 648 0 l 425 0 l 1449 1490 l 1672 1490 l 648 0"},"&":{ha:1399,x_min:72,x_max:1400,o:"m 578 -23 l 578 -23 q 308 34 422 -23 q 133 185 194 90 q 72 394 72 279 l 72 394 q 105 549 72 482 q 199 671 138 615 l 199 671 q 339 779 259 726 l 339 779 q 339 780 339 779 l 339 780 q 245 934 283 850 q 206 1116 206 1017 l 206 1116 q 258 1316 206 1226 q 405 1458 310 1405 q 625 1510 499 1510 l 625 1510 q 835 1461 747 1510 q 971 1329 923 1411 q 1019 1146 1019 1246 l 1019 1146 q 996 1015 1019 1077 q 928 900 972 953 q 821 800 883 846 l 821 800 l 741 743 l 963 492 q 990 549 978 519 l 990 549 q 1028 748 1028 639 l 1028 748 l 1311 748 q 1282 500 1311 614 q 1198 297 1253 386 l 1198 297 q 1171 258 1185 277 l 1171 258 l 1400 0 l 1043 0 l 959 92 q 779 6 877 33 l 779 6 q 578 -23 676 -23 m 769 299 l 512 580 q 438 508 466 545 l 438 508 q 408 414 408 469 l 408 414 q 432 329 408 365 q 498 273 456 292 q 597 253 540 253 l 597 253 q 752 290 675 253 l 752 290 q 769 299 761 294 l 769 299 m 578 931 l 578 931 l 651 978 q 706 1023 683 999 q 739 1073 728 1047 q 750 1125 750 1099 l 750 1125 q 719 1201 750 1169 q 626 1233 687 1233 l 626 1233 q 558 1218 587 1233 q 513 1176 529 1203 q 497 1112 497 1148 l 497 1112 q 521 1019 497 1066 l 521 1019 q 578 931 542 977"},"'":{ha:726,x_min:199,x_max:527,o:"m 494 848 l 233 848 l 199 1490 l 527 1490 l 494 848"},"(":{ha:783,x_min:150,x_max:728,o:"m 150 607 l 150 607 q 183 954 150 774 q 274 1298 216 1133 q 408 1581 332 1462 l 408 1581 l 728 1581 q 608 1260 658 1427 q 532 926 558 1092 q 505 607 505 759 l 505 607 q 528 346 505 476 q 599 64 550 215 q 728 -279 648 -87 l 728 -279 l 408 -279 q 216 155 281 -71 q 150 607 150 380"},")":{ha:783,x_min:55,x_max:633,o:"m 375 -279 l 55 -279 q 185 66 136 -86 q 256 347 233 217 q 278 607 278 477 l 278 607 q 251 926 278 759 q 175 1260 224 1092 q 55 1581 125 1427 l 55 1581 l 375 1581 q 509 1298 451 1462 q 600 954 567 1133 q 633 607 633 774 l 633 607 q 568 154 633 379 q 375 -279 502 -72 l 375 -279"},"*":{ha:1193,x_min:179,x_max:1012,o:"m 701 652 l 490 652 l 512 923 l 286 769 l 179 953 l 425 1070 l 179 1187 l 286 1373 l 512 1219 l 490 1490 l 701 1490 l 682 1219 l 907 1373 l 1012 1187 l 768 1070 l 1012 953 l 907 769 l 682 923 l 701 652"},"+":{ha:1404,x_min:178,x_max:1227,o:"m 846 74 l 558 74 l 558 463 l 178 463 l 178 737 l 558 737 l 558 1125 l 846 1125 l 846 737 l 1227 737 l 1227 463 l 846 463 l 846 74"},",":{ha:722,x_min:116,x_max:542,o:"m 346 -410 l 116 -410 l 204 232 l 542 232 l 346 -410"},"-":{ha:965,x_min:139,x_max:826,o:"m 139 738 l 826 738 l 826 469 l 139 469 l 139 738"},".":{ha:722,x_min:172,x_max:550,o:"m 361 -21 l 361 -21 q 227 33 281 -21 q 172 165 172 86 l 172 165 q 227 299 172 245 q 361 352 281 352 l 361 352 q 496 299 441 352 q 550 165 550 245 l 550 165 q 496 33 550 86 q 361 -21 441 -21"},"/":{ha:819,x_min:20,x_max:798,o:"m 500 1560 l 798 1560 l 318 -224 l 20 -224 l 500 1560"},":":{ha:722,x_min:172,x_max:550,o:"m 361 -21 l 361 -21 q 227 33 281 -21 q 172 165 172 86 l 172 165 q 227 299 172 245 q 361 352 281 352 l 361 352 q 496 299 441 352 q 550 165 550 245 l 550 165 q 496 33 550 86 q 361 -21 441 -21 m 361 694 l 361 694 q 227 748 281 694 q 172 880 172 801 l 172 880 q 227 1014 172 960 q 361 1067 281 1067 l 361 1067 q 496 1014 441 1067 q 550 880 550 960 l 550 880 q 496 748 550 801 q 361 694 441 694"},";":{ha:737,x_min:116,x_max:564,o:"m 346 -410 l 116 -410 l 204 232 l 542 232 l 346 -410 m 375 694 l 375 694 q 241 748 295 694 q 186 880 186 801 l 186 880 q 241 1014 186 960 q 375 1067 295 1067 l 375 1067 q 510 1014 455 1067 q 564 880 564 960 l 564 880 q 510 748 564 801 q 375 694 455 694"},"<":{ha:1404,x_min:163,x_max:1212,o:"m 1212 9 l 163 452 l 163 748 l 1212 1192 l 1212 865 l 528 606 l 528 592 l 1212 334 l 1212 9"},"=":{ha:1404,x_min:185,x_max:1220,o:"m 1220 706 l 185 706 l 185 992 l 1220 992 l 1220 706 m 1220 208 l 185 208 l 185 495 l 1220 495 l 1220 208"},">":{ha:1404,x_min:192,x_max:1241,o:"m 1241 748 l 1241 452 l 192 9 l 192 334 l 878 592 l 878 606 l 192 865 l 192 1192 l 1241 748"},"?":{ha:1186,x_min:77,x_max:1092,o:"m 696 462 l 393 462 l 393 490 q 414 687 393 614 q 474 802 434 759 q 572 882 514 845 l 572 882 q 687 973 641 926 q 733 1088 733 1020 l 733 1088 q 712 1165 733 1132 q 655 1217 691 1198 q 576 1235 619 1235 l 576 1235 q 494 1216 532 1235 q 431 1159 455 1196 q 406 1070 407 1122 l 406 1070 l 77 1070 q 147 1319 79 1222 q 329 1463 215 1416 q 577 1510 442 1510 l 577 1510 q 843 1464 727 1510 q 1026 1327 959 1417 q 1092 1104 1092 1236 l 1092 1104 q 1029 889 1092 974 q 861 743 965 804 l 861 743 q 769 677 806 710 q 714 600 732 643 q 696 490 696 556 l 696 490 l 696 462 m 545 -21 l 545 -21 q 404 29 458 -21 q 350 162 350 79 l 350 162 q 404 296 350 245 q 545 346 458 346 l 545 346 q 687 296 633 346 q 740 162 740 245 l 740 162 q 687 29 740 79 q 545 -21 633 -21"},"@":{ha:2122,x_min:82,x_max:2040,o:"m 1070 -441 l 1070 -441 q 654 -377 837 -441 q 343 -191 471 -314 q 149 108 215 -69 q 82 512 82 285 l 82 512 q 146 909 82 729 q 334 1221 209 1089 q 642 1424 458 1352 q 1067 1496 826 1496 l 1067 1496 q 1467 1433 1288 1496 q 1775 1252 1646 1369 q 1972 972 1903 1134 q 2040 613 2040 810 l 2040 613 q 2012 373 2040 481 q 1929 187 1984 265 q 1791 67 1874 109 q 1598 25 1708 25 l 1598 25 q 1471 44 1528 25 q 1378 100 1414 62 q 1332 193 1342 137 l 1332 193 l 1324 193 q 1213 67 1296 113 q 1010 21 1130 21 l 1010 21 q 773 83 871 21 q 622 258 674 145 q 569 522 569 370 l 569 522 q 625 790 569 675 q 781 970 680 905 q 1014 1034 881 1034 l 1014 1034 q 1186 999 1113 1034 q 1289 901 1259 963 l 1289 901 l 1300 901 l 1300 1011 l 1526 1011 l 1526 330 q 1543 265 1526 286 q 1599 244 1560 244 l 1599 244 q 1694 281 1658 244 q 1747 393 1730 317 q 1763 584 1763 468 l 1763 584 q 1721 860 1763 739 q 1595 1064 1679 981 q 1386 1190 1511 1147 q 1095 1233 1260 1233 l 1095 1233 q 780 1185 915 1233 q 553 1045 644 1137 q 416 822 462 953 q 370 523 370 690 l 370 523 q 417 223 370 353 q 557 3 464 92 q 785 -131 649 -86 q 1099 -177 920 -177 l 1099 -177 q 1257 -166 1182 -177 q 1394 -137 1331 -155 q 1502 -100 1456 -120 l 1502 -100 l 1596 -335 q 1465 -385 1545 -361 q 1285 -425 1385 -410 q 1070 -441 1185 -441 m 1047 258 l 1047 258 q 1176 289 1124 258 q 1253 380 1227 320 q 1279 525 1279 439 l 1279 525 q 1253 667 1279 611 q 1175 749 1226 722 q 1048 775 1123 775 l 1048 775 q 924 745 975 775 q 846 659 872 715 q 819 526 819 603 l 819 526 q 844 386 819 446 q 921 292 869 325 q 1047 258 972 258"},A:{ha:1576,x_min:47,x_max:1529,o:"m 439 0 l 47 0 l 544 1490 l 1017 1490 l 1529 0 l 1133 0 l 1032 317 l 536 317 l 439 0 m 619 587 l 946 587 l 926 651 q 830 998 876 814 l 830 998 q 777 1210 803 1101 l 777 1210 q 728 997 752 1101 l 728 997 q 639 651 686 813 l 639 651 l 619 587"},B:{ha:1361,x_min:116,x_max:1297,o:"m 780 0 l 116 0 l 116 1490 l 734 1490 q 1013 1442 900 1490 q 1183 1310 1126 1394 q 1239 1112 1239 1225 l 1239 1112 q 1204 961 1239 1027 q 1106 851 1168 894 q 962 790 1043 807 l 962 790 l 962 774 q 1128 727 1051 771 q 1251 603 1204 682 q 1297 416 1297 524 l 1297 416 q 1237 202 1297 296 q 1061 54 1176 108 q 780 0 946 0 l 780 0 m 469 647 l 469 285 l 697 285 q 873 331 816 285 q 929 456 929 376 l 929 456 q 902 557 929 514 q 825 624 875 600 q 704 647 774 647 l 704 647 l 469 647 m 469 1208 l 469 876 l 674 876 q 780 896 733 876 q 853 954 826 916 q 879 1045 879 991 l 879 1045 q 825 1164 879 1120 q 680 1208 771 1208 l 680 1208 l 469 1208"},C:{ha:1523,x_min:82,x_max:1446,o:"m 787 -20 l 787 -20 q 427 69 586 -20 q 175 329 267 158 q 82 744 82 500 l 82 744 q 176 1161 82 990 q 429 1421 269 1332 q 787 1510 589 1510 l 787 1510 q 1033 1474 920 1510 q 1233 1367 1146 1437 q 1375 1196 1320 1297 q 1445 964 1429 1094 l 1445 964 l 1088 964 q 1055 1063 1079 1019 q 994 1137 1031 1106 q 906 1184 956 1168 q 796 1200 856 1200 l 796 1200 q 608 1146 687 1200 q 486 991 528 1092 q 443 744 443 889 l 443 744 q 487 494 443 595 q 609 341 530 392 q 794 290 687 290 l 794 290 q 904 306 854 290 q 992 353 954 322 q 1055 428 1030 384 q 1089 526 1080 471 l 1089 526 l 1446 526 q 1389 330 1436 426 q 1259 154 1342 233 q 1057 27 1175 74 q 787 -20 939 -20"},D:{ha:1480,x_min:116,x_max:1397,o:"m 664 0 l 664 0 l 116 0 l 116 1490 l 664 1490 q 1055 1401 891 1490 q 1308 1144 1219 1311 q 1397 745 1397 977 q 1309 346 1397 513 q 1056 89 1220 178 q 664 0 891 0 m 469 1188 l 469 302 l 649 302 q 866 345 777 302 q 999 486 954 388 q 1044 745 1044 584 q 998 1004 1044 906 q 864 1145 952 1101 q 644 1188 775 1188 l 644 1188 l 469 1188"},E:{ha:1249,x_min:116,x_max:1150,o:"m 1149 0 l 116 0 l 116 1490 l 1150 1490 l 1150 1202 l 469 1202 l 469 894 l 1096 894 l 1096 612 l 469 612 l 469 288 l 1149 288 l 1149 0"},F:{ha:1199,x_min:116,x_max:1129,o:"m 469 0 l 116 0 l 116 1490 l 1129 1490 l 1129 1202 l 469 1202 l 469 824 l 1064 824 l 1064 542 l 469 542 l 469 0"},G:{ha:1541,x_min:82,x_max:1453,o:"m 797 -20 l 797 -20 q 424 73 585 -20 q 173 336 263 165 q 82 742 82 507 l 82 742 q 178 1158 82 986 q 434 1420 273 1329 q 793 1510 594 1510 l 793 1510 q 1033 1473 922 1510 q 1230 1368 1143 1436 q 1370 1208 1316 1300 q 1437 1004 1423 1115 l 1437 1004 l 1080 1004 q 1043 1087 1067 1050 q 982 1149 1018 1123 q 901 1187 946 1174 q 799 1200 855 1200 l 799 1200 q 611 1147 691 1200 q 487 993 530 1094 q 443 747 443 891 l 443 747 q 486 500 443 602 q 608 344 528 398 q 800 290 688 290 l 800 290 q 971 323 901 290 q 1076 418 1040 356 l 1076 418 q 1112 553 1110 476 l 1112 553 l 814 553 l 814 812 l 1453 812 l 1453 616 q 1369 275 1453 417 q 1137 56 1285 132 q 797 -20 988 -20"},H:{ha:1533,x_min:116,x_max:1416,o:"m 469 0 l 116 0 l 116 1490 l 469 1490 l 469 905 l 1064 905 l 1064 1490 l 1416 1490 l 1416 0 l 1064 0 l 1064 617 l 469 617 l 469 0"},I:{ha:585,x_min:116,x_max:469,o:"m 116 1490 l 469 1490 l 469 0 l 116 0 l 116 1490"},J:{ha:1208,x_min:54,x_max:1092,o:"m 576 -20 l 576 -20 q 192 104 330 -20 q 54 456 54 227 l 54 456 l 54 546 l 407 546 l 407 450 q 452 307 407 355 q 576 259 497 259 l 576 259 q 700 307 655 259 q 744 452 744 355 l 744 452 l 744 1490 l 1092 1490 l 1092 458 q 956 104 1092 228 q 576 -20 820 -20"},K:{ha:1512,x_min:116,x_max:1463,o:"m 469 0 l 116 0 l 116 1490 l 469 1490 l 469 1124 l 463 764 q 466 770 464 767 l 466 770 q 561 917 508 843 q 686 1083 613 991 l 686 1083 l 1018 1490 l 1442 1490 l 902 846 l 1463 0 l 1048 0 l 659 615 l 469 400 l 469 0"},L:{ha:1158,x_min:116,x_max:1092,o:"m 1092 0 l 116 0 l 116 1490 l 469 1490 l 469 288 l 1092 288 l 1092 0"},M:{ha:1932,x_min:116,x_max:1816,o:"m 470 0 l 116 0 l 116 1490 l 666 1490 l 856 910 q 893 770 872 857 q 934 582 913 682 l 934 582 q 968 415 952 496 l 968 415 q 1001 582 983 495 l 1001 582 q 1042 769 1021 682 q 1078 910 1062 856 l 1078 910 l 1265 1490 l 1816 1490 l 1816 0 l 1461 0 l 1461 642 q 1463 771 1461 692 q 1468 941 1465 849 q 1473 1127 1470 1033 l 1473 1127 q 1474 1199 1474 1164 l 1474 1199 q 1455 1117 1465 1159 l 1455 1117 q 1408 932 1431 1022 q 1363 767 1384 842 q 1326 642 1341 692 l 1326 642 l 1114 0 l 819 0 l 604 642 q 567 766 589 691 q 521 931 545 841 q 473 1116 497 1021 l 473 1116 q 457 1181 465 1149 l 457 1181 q 458 1129 457 1155 l 458 1129 q 463 943 460 1036 q 468 772 465 850 q 470 642 470 693 l 470 642 l 470 0"},N:{ha:1568,x_min:116,x_max:1452,o:"m 478 0 l 116 0 l 116 1490 l 504 1490 l 920 817 q 999 679 960 750 q 1075 520 1037 607 l 1075 520 q 1111 432 1093 479 l 1111 432 q 1107 502 1109 466 l 1107 502 q 1095 697 1100 602 q 1090 856 1090 791 l 1090 856 l 1090 1490 l 1452 1490 l 1452 0 l 1063 0 l 682 617 q 590 778 631 702 q 507 943 548 854 l 507 943 q 457 1050 484 992 l 457 1050 q 464 944 460 996 l 464 944 q 474 758 470 842 q 478 617 478 673 l 478 617 l 478 0"},O:{ha:1583,x_min:82,x_max:1500,o:"m 792 -20 l 792 -20 q 431 69 591 -20 q 176 329 270 158 q 82 744 82 500 l 82 744 q 176 1161 82 990 q 431 1421 270 1332 q 792 1510 591 1510 l 792 1510 q 1153 1421 992 1510 q 1407 1161 1313 1332 q 1500 744 1500 990 l 1500 744 q 1407 328 1500 499 q 1153 69 1313 157 q 792 -20 992 -20 m 792 290 l 792 290 q 978 342 900 290 q 1098 496 1056 394 q 1140 744 1140 597 l 1140 744 q 1098 994 1140 892 q 978 1148 1056 1096 q 792 1200 900 1200 l 792 1200 q 605 1148 683 1200 q 485 994 527 1095 q 443 744 443 892 l 443 744 q 485 496 443 597 q 605 343 527 395 q 792 290 683 290"},P:{ha:1335,x_min:116,x_max:1269,o:"m 469 0 l 116 0 l 116 1490 l 726 1490 q 1016 1425 894 1490 q 1204 1244 1138 1360 q 1269 975 1269 1128 l 1269 975 q 1202 707 1269 821 q 1011 529 1135 593 q 716 465 887 465 l 716 465 l 469 465 l 469 0 m 469 1204 l 469 744 l 652 744 q 791 773 735 744 q 875 854 847 802 q 903 975 903 906 l 903 975 q 875 1097 903 1045 q 791 1176 847 1148 q 651 1204 734 1204 l 651 1204 l 469 1204"},Q:{ha:1601,x_min:82,x_max:1502,o:"m 792 -20 l 792 -20 q 431 69 591 -20 q 176 329 270 158 q 82 744 82 500 l 82 744 q 176 1161 82 990 q 431 1421 270 1332 q 792 1510 591 1510 l 792 1510 q 1153 1421 992 1510 q 1407 1161 1313 1332 q 1500 744 1500 990 l 1500 744 q 1407 328 1500 499 l 1407 328 q 1279 160 1353 231 l 1279 160 l 1502 -117 l 1183 -117 l 1062 27 q 792 -20 938 -20 m 863 296 l 684 531 l 970 531 l 1058 421 q 1098 496 1081 454 l 1098 496 q 1140 744 1140 597 l 1140 744 q 1098 994 1140 892 q 978 1148 1056 1096 q 792 1200 900 1200 l 792 1200 q 605 1148 683 1200 q 485 994 527 1095 q 443 744 443 892 l 443 744 q 485 496 443 597 q 605 343 527 395 q 792 290 683 290 l 792 290 q 863 296 829 290 l 863 296"},R:{ha:1356,x_min:116,x_max:1321,o:"m 469 0 l 116 0 l 116 1490 l 726 1490 q 1016 1430 894 1490 q 1204 1258 1138 1369 q 1269 995 1269 1147 l 1269 995 q 1202 734 1269 842 q 1011 569 1135 625 l 1011 569 q 1010 569 1011 569 l 1010 569 l 1321 0 l 934 0 l 661 513 l 469 513 l 469 0 m 469 1204 l 469 792 l 652 792 q 791 814 735 792 q 875 881 846 836 q 903 995 903 926 l 903 995 q 875 1111 903 1065 q 790 1181 846 1157 q 651 1204 734 1204 l 651 1204 l 469 1204"},S:{ha:1352,x_min:72,x_max:1280,o:"m 691 -20 l 691 -20 q 367 36 505 -20 q 152 206 229 92 q 72 492 75 320 l 72 492 l 411 492 q 451 371 416 420 q 546 298 485 322 q 687 273 606 273 l 687 273 q 813 293 760 273 q 895 349 866 313 q 923 433 923 385 l 923 433 q 897 506 923 476 q 817 559 870 536 q 682 600 764 582 l 682 600 l 524 637 q 221 781 331 681 q 111 1049 111 881 l 111 1049 q 186 1291 111 1187 q 392 1453 261 1395 q 691 1510 522 1510 l 691 1510 q 991 1452 864 1510 q 1188 1289 1118 1393 q 1260 1046 1258 1184 l 1260 1046 l 921 1046 q 855 1172 914 1127 q 690 1217 796 1217 l 690 1217 q 572 1199 620 1217 q 500 1148 524 1180 q 476 1073 476 1115 l 476 1073 q 503 996 476 1027 q 580 943 530 964 q 696 907 630 922 l 696 907 l 825 877 q 1018 815 933 854 q 1161 720 1102 775 q 1250 593 1219 665 q 1280 432 1280 521 l 1280 432 q 1210 190 1280 291 q 1008 34 1139 88 q 691 -20 876 -20"},T:{ha:1386,x_min:66,x_max:1320,o:"m 517 1202 l 66 1202 l 66 1490 l 1320 1490 l 1320 1202 l 869 1202 l 869 0 l 517 0 l 517 1202"},U:{ha:1489,x_min:116,x_max:1373,o:"m 744 -19 l 744 -19 q 415 49 556 -19 q 195 240 273 116 q 116 529 116 363 l 116 529 l 116 1490 l 469 1490 l 469 558 q 504 419 469 480 q 601 324 539 358 q 744 289 662 289 l 744 289 q 889 324 826 289 q 986 419 951 358 q 1020 558 1020 480 l 1020 558 l 1020 1490 l 1373 1490 l 1373 529 q 1294 240 1373 363 q 1074 49 1215 116 q 744 -19 932 -19"},V:{ha:1576,x_min:47,x_max:1529,o:"m 1031 0 l 559 0 l 47 1490 l 444 1490 l 651 839 q 746 499 700 677 l 746 499 q 798 289 772 397 l 798 289 q 848 500 823 397 l 848 500 q 938 839 891 677 l 938 839 l 1137 1490 l 1529 1490 l 1031 0"},W:{ha:2168,x_min:47,x_max:2121,o:"m 846 0 l 445 0 l 47 1490 l 438 1490 l 585 831 q 625 615 607 731 q 659 382 642 498 l 659 382 q 662 362 660 372 l 662 362 q 665 382 663 372 l 665 382 q 703 615 683 498 q 747 831 723 731 l 747 831 l 905 1490 l 1264 1490 l 1421 831 q 1465 615 1445 731 q 1504 382 1485 498 l 1504 382 q 1506 365 1505 373 l 1506 365 q 1509 382 1507 373 l 1509 382 q 1544 615 1525 498 q 1583 831 1562 731 l 1583 831 l 1730 1490 l 2121 1490 l 1723 0 l 1323 0 l 1149 688 q 1092 994 1114 829 l 1092 994 q 1083 1053 1087 1024 l 1083 1053 q 1076 997 1079 1025 l 1076 997 q 1020 688 1057 834 l 1020 688 l 846 0"},X:{ha:1559,x_min:49,x_max:1510,o:"m 458 0 l 49 0 l 585 762 l 102 1490 l 511 1490 l 653 1267 q 727 1136 698 1196 q 780 1020 756 1075 l 780 1020 q 784 1012 782 1016 l 784 1012 q 788 1020 786 1016 l 788 1020 q 842 1136 812 1075 q 916 1267 871 1196 l 916 1267 l 1061 1490 l 1459 1490 l 984 772 l 1510 0 l 1091 0 l 905 285 q 840 393 864 349 q 798 474 816 436 l 798 474 q 779 509 789 491 l 779 509 q 761 474 770 491 l 761 474 q 718 392 742 436 q 651 285 693 348 l 651 285 l 458 0"},Y:{ha:1540,x_min:47,x_max:1493,o:"m 952 0 l 601 0 l 601 540 l 47 1490 l 461 1490 l 695 1033 q 756 900 729 967 l 756 900 q 778 841 767 873 l 778 841 q 800 901 789 873 l 800 901 q 858 1033 825 968 l 858 1033 l 1081 1490 l 1493 1490 l 952 540 l 952 0"},Z:{ha:1390,x_min:108,x_max:1282,o:"m 1282 0 l 109 0 l 109 202 l 688 1000 q 822 1166 748 1083 l 822 1166 q 858 1206 840 1186 l 858 1206 q 788 1204 823 1205 l 788 1204 q 580 1202 684 1202 l 580 1202 l 108 1202 l 108 1490 l 1281 1490 l 1281 1287 l 713 504 q 574 332 650 418 l 574 332 q 530 283 552 308 l 530 283 q 616 286 573 285 l 616 286 q 835 288 725 288 l 835 288 l 1282 288 l 1282 0"},"[":{ha:783,x_min:164,x_max:689,o:"m 689 -279 l 164 -279 l 164 1581 l 689 1581 l 689 1322 l 501 1322 l 501 -20 l 689 -20 l 689 -279"},"\\":{ha:819,x_min:20,x_max:798,o:"m 798 -224 l 500 -224 l 20 1560 l 318 1560 l 798 -224"},"]":{ha:783,x_min:93,x_max:619,o:"m 619 -279 l 93 -279 l 93 -20 l 281 -20 l 281 1322 l 93 1322 l 93 1581 l 619 1581 l 619 -279"},"^":{ha:1010,x_min:64,x_max:946,o:"m 316 814 l 64 814 l 373 1460 l 637 1460 l 946 814 l 694 814 l 512 1237 l 498 1237 l 316 814"},_:{ha:992,x_min:0,x_max:992,o:"m 0 0 l 992 0 l 992 -257 l 0 -257 l 0 0"},"`":{ha:783,x_min:165,x_max:613,o:"m 613 1258 l 377 1258 l 165 1576 l 475 1576 l 613 1258"},a:{ha:1205,x_min:60,x_max:1089,o:"m 428 -20 l 428 -20 q 238 17 321 -20 q 107 127 154 53 q 60 310 60 200 l 60 310 q 93 467 60 403 q 183 571 125 531 q 316 632 241 611 q 476 660 391 653 l 476 660 q 629 678 571 668 q 714 706 687 687 q 741 759 741 725 l 741 759 l 741 763 q 723 829 741 802 q 671 870 705 856 q 589 884 637 884 l 589 884 q 504 870 541 884 q 442 830 466 856 q 408 769 418 804 l 408 769 l 92 810 q 179 979 114 906 q 348 1092 243 1051 q 592 1132 452 1132 l 592 1132 q 787 1108 696 1132 q 945 1036 877 1083 q 1051 919 1013 988 q 1089 759 1089 849 l 1089 759 l 1089 0 l 761 0 l 761 157 l 752 157 q 676 60 722 99 q 568 1 629 21 q 428 -20 506 -20 m 534 211 l 534 211 q 641 235 593 211 q 716 301 688 259 q 744 398 744 343 l 744 398 l 744 505 q 707 490 729 497 q 657 478 684 483 q 603 468 630 472 q 551 459 576 463 l 551 459 q 464 435 500 452 q 409 391 428 418 q 390 326 390 364 l 390 326 q 409 264 390 289 q 460 225 428 238 q 534 211 492 211"},b:{ha:1306,x_min:115,x_max:1234,o:"m 786 -16 l 786 -16 q 639 13 701 -16 q 535 86 576 41 q 472 181 494 131 l 472 181 l 460 181 l 460 0 l 115 0 l 115 1490 l 464 1490 l 464 926 l 472 926 q 534 1024 493 977 q 637 1102 574 1071 q 788 1132 699 1132 l 788 1132 q 1008 1071 906 1132 q 1172 882 1109 1009 q 1234 558 1234 754 l 1234 558 q 1174 241 1234 368 q 1012 49 1114 113 q 786 -16 910 -16 m 667 256 l 667 256 q 781 294 734 256 q 851 400 827 331 q 875 558 875 468 l 875 558 q 851 717 875 649 q 781 822 827 784 q 667 859 735 859 l 667 859 q 553 823 600 859 q 481 719 506 786 q 456 558 456 651 l 456 558 q 481 399 456 467 q 554 294 506 331 q 667 256 601 256"},c:{ha:1219,x_min:72,x_max:1150,o:"m 634 -21 l 634 -21 q 333 52 459 -21 q 140 254 207 124 q 72 555 72 383 l 72 555 q 140 858 72 728 q 333 1060 207 987 q 634 1132 459 1132 l 634 1132 q 830 1104 741 1132 q 986 1025 919 1076 q 1095 900 1053 973 q 1149 735 1136 826 l 1149 735 l 827 681 q 803 759 819 725 q 763 817 786 793 q 708 853 739 841 q 638 865 676 865 l 638 865 q 524 829 571 865 q 453 723 477 792 q 428 557 428 653 l 428 557 q 453 391 428 461 q 524 284 477 321 q 638 246 571 246 l 638 246 q 708 259 677 246 q 764 296 739 271 q 805 356 788 320 q 828 436 821 391 l 828 436 l 1150 384 q 1096 216 1137 290 q 987 88 1054 141 q 831 7 920 35 q 634 -21 741 -21"},d:{ha:1306,x_min:72,x_max:1190,o:"m 520 -16 l 520 -16 q 294 49 396 -16 q 132 241 192 113 q 72 558 72 368 l 72 558 q 135 882 72 754 q 299 1071 197 1009 q 517 1132 400 1132 l 517 1132 q 669 1102 606 1132 q 773 1024 732 1071 q 834 926 813 977 l 834 926 l 842 926 l 842 1490 l 1190 1490 l 1190 0 l 846 0 l 846 181 l 834 181 q 771 86 812 131 q 668 13 729 41 q 520 -16 606 -16 m 639 256 l 639 256 q 753 294 705 256 q 825 399 800 331 q 850 558 850 467 l 850 558 q 825 719 850 651 q 753 823 800 786 q 639 859 705 859 l 639 859 q 526 822 572 859 q 455 717 479 784 q 431 558 431 649 l 431 558 q 455 400 431 468 q 526 294 479 331 q 639 256 572 256"},e:{ha:1230,x_min:72,x_max:1162,o:"m 636 -21 l 636 -21 q 334 49 461 -21 q 140 247 207 118 q 72 555 72 376 l 72 555 q 140 857 72 727 q 331 1060 207 987 q 623 1132 455 1132 l 623 1132 q 840 1095 741 1132 q 1011 986 938 1058 q 1123 807 1083 913 q 1162 562 1162 701 l 1162 562 l 1162 474 l 415 474 q 444 347 418 399 l 444 347 q 523 261 472 289 q 642 232 574 232 l 642 232 q 728 245 689 232 q 794 284 766 258 q 835 347 821 310 l 835 347 l 1146 296 q 1050 129 1118 200 q 877 18 981 57 q 636 -21 772 -21 m 417 677 l 417 677 l 831 677 q 810 763 825 725 l 810 763 q 740 849 786 819 q 626 879 694 879 q 511 849 558 879 q 440 764 464 818 l 440 764 q 417 677 422 725"},f:{ha:839,x_min:20,x_max:823,o:"m 555 1118 l 779 1118 l 779 859 l 555 859 l 555 0 l 208 0 l 208 859 l 20 859 l 20 1118 l 208 1118 l 208 1178 q 256 1391 208 1306 q 390 1518 304 1476 q 588 1560 476 1560 l 588 1560 q 728 1549 662 1560 q 823 1528 793 1537 l 823 1528 l 767 1273 q 720 1283 747 1278 q 666 1287 693 1287 l 666 1287 q 580 1259 604 1287 q 555 1181 555 1230 l 555 1181 l 555 1118"},g:{ha:1309,x_min:72,x_max:1194,o:"m 630 -442 l 630 -442 q 375 -405 484 -442 q 199 -302 266 -368 q 111 -149 131 -236 l 111 -149 l 414 -87 q 451 -142 424 -117 q 522 -183 478 -168 q 628 -199 566 -199 l 628 -199 q 793 -151 735 -199 q 850 -3 850 -103 l 850 -3 l 850 195 l 823 195 q 764 104 803 145 q 664 39 724 63 q 520 15 603 15 l 520 15 q 296 73 397 15 q 133 251 194 130 q 72 559 72 371 l 72 559 q 135 882 72 755 q 300 1071 198 1009 q 519 1132 401 1132 l 519 1132 q 672 1102 608 1132 q 777 1025 735 1072 q 839 926 818 977 l 839 926 l 849 926 l 849 1118 l 1194 1118 l 1194 25 q 1123 -233 1194 -129 q 924 -389 1051 -337 q 630 -442 797 -442 m 639 271 l 639 271 q 753 305 706 271 q 825 405 800 339 q 850 560 850 470 l 850 560 q 825 719 850 652 q 754 823 800 786 q 639 859 707 859 l 639 859 q 526 822 572 859 q 455 717 479 784 q 431 560 431 650 l 431 560 q 455 405 431 470 q 526 306 479 340 q 639 271 572 271"},h:{ha:1301,x_min:115,x_max:1186,o:"m 464 638 l 464 638 l 464 0 l 115 0 l 115 1490 l 457 1490 l 457 896 q 564 1051 497 988 l 564 1051 q 799 1132 651 1132 l 799 1132 q 1003 1080 916 1132 q 1138 933 1090 1028 q 1186 712 1186 838 l 1186 712 l 1186 0 l 837 0 l 837 644 q 789 792 837 738 q 655 845 741 845 l 655 845 q 556 821 599 845 q 488 750 512 796 q 464 638 464 704"},i:{ha:580,x_min:109,x_max:470,o:"m 464 0 l 115 0 l 115 1118 l 464 1118 l 464 0 m 289 1249 l 289 1249 q 162 1299 215 1249 q 109 1417 109 1348 l 109 1417 q 162 1536 109 1487 q 289 1585 215 1585 l 289 1585 q 417 1537 364 1585 q 470 1417 470 1488 l 470 1417 q 417 1298 470 1347 q 289 1249 364 1249"},j:{ha:580,x_min:-59,x_max:471,o:"m 115 -42 l 115 1118 l 464 1118 l 464 -48 q 409 -266 464 -185 q 251 -382 353 -347 q 12 -418 149 -418 l 12 -418 l -59 -418 l -59 -153 l -17 -153 q 87 -125 58 -153 q 115 -42 115 -98 l 115 -42 m 290 1249 l 290 1249 q 163 1299 216 1249 q 110 1417 110 1348 l 110 1417 q 163 1536 110 1487 q 290 1585 216 1585 l 290 1585 q 418 1537 365 1585 q 471 1417 471 1488 l 471 1417 q 418 1298 471 1347 q 290 1249 365 1249"},k:{ha:1214,x_min:115,x_max:1213,o:"m 464 0 l 115 0 l 115 1490 l 464 1490 l 464 714 l 480 714 l 800 1118 l 1197 1118 l 798 630 l 1213 0 l 810 0 l 538 427 l 464 338 l 464 0"},l:{ha:580,x_min:115,x_max:464,o:"m 115 1490 l 464 1490 l 464 0 l 115 0 l 115 1490"},m:{ha:1899,x_min:115,x_max:1783,o:"m 464 0 l 115 0 l 115 1118 l 436 1118 l 451 894 q 510 1004 475 959 l 510 1004 q 630 1102 561 1071 q 774 1133 698 1133 l 774 1133 q 968 1056 894 1133 l 968 1056 q 1062 874 1025 995 l 1062 874 q 1127 994 1088 944 l 1127 994 q 1263 1100 1185 1067 q 1425 1133 1341 1133 l 1425 1133 q 1611 1088 1530 1133 q 1737 958 1691 1042 q 1783 754 1783 873 l 1783 754 l 1783 0 l 1435 0 l 1435 675 q 1391 804 1435 760 q 1277 848 1346 848 l 1277 848 q 1192 826 1228 848 q 1136 765 1155 804 q 1117 671 1117 725 l 1117 671 l 1117 0 l 782 0 l 782 680 q 739 803 782 757 q 626 848 696 848 l 626 848 q 542 826 578 848 q 485 764 505 804 q 464 664 464 723 l 464 664 l 464 0"},n:{ha:1301,x_min:115,x_max:1186,o:"m 464 638 l 464 638 l 464 0 l 115 0 l 115 1118 l 443 1118 l 449 876 q 564 1051 490 982 l 564 1051 q 799 1132 651 1132 l 799 1132 q 1003 1080 916 1132 q 1138 933 1090 1028 q 1186 712 1186 838 l 1186 712 l 1186 0 l 837 0 l 837 644 q 789 792 837 738 q 655 845 741 845 l 655 845 q 556 821 599 845 q 488 750 512 796 q 464 638 464 704"},o:{ha:1268,x_min:72,x_max:1195,o:"m 634 -21 l 634 -21 q 333 52 459 -21 q 140 254 207 124 q 72 555 72 383 l 72 555 q 140 858 72 728 q 333 1060 207 987 q 634 1132 459 1132 l 634 1132 q 935 1060 809 1132 q 1128 858 1061 987 q 1195 555 1195 728 l 1195 555 q 1128 254 1195 383 q 935 52 1061 124 q 634 -21 809 -21 m 634 246 l 634 246 q 747 285 701 246 q 817 394 793 324 q 840 557 840 464 l 840 557 q 817 720 840 650 q 747 827 793 789 q 634 865 701 865 l 634 865 q 521 827 567 865 q 452 720 475 789 q 428 557 428 650 l 428 557 q 452 394 428 464 q 521 285 475 324 q 634 246 567 246"},p:{ha:1306,x_min:115,x_max:1234,o:"m 464 -418 l 115 -418 l 115 1118 l 460 1118 l 460 926 l 472 926 q 534 1024 493 977 q 637 1102 574 1071 q 788 1132 699 1132 l 788 1132 q 1008 1071 906 1132 q 1172 882 1109 1009 q 1234 558 1234 754 l 1234 558 q 1174 241 1234 368 q 1012 49 1114 113 q 786 -16 910 -16 l 786 -16 q 639 13 701 -16 q 535 86 576 41 q 472 181 494 131 l 472 181 l 464 181 l 464 -418 m 667 256 l 667 256 q 781 294 734 256 q 851 400 827 331 q 875 558 875 468 l 875 558 q 851 717 875 649 q 781 822 827 784 q 667 859 735 859 l 667 859 q 553 823 600 859 q 481 719 506 786 q 456 558 456 651 l 456 558 q 481 399 456 467 q 554 294 506 331 q 667 256 601 256"},q:{ha:1306,x_min:72,x_max:1190,o:"m 1190 1118 l 1190 -418 l 842 -418 l 842 181 l 834 181 q 771 86 812 131 q 668 13 729 41 q 520 -16 606 -16 l 520 -16 q 294 49 396 -16 q 132 241 192 113 q 72 558 72 368 l 72 558 q 135 882 72 754 q 299 1071 197 1009 q 517 1132 400 1132 l 517 1132 q 669 1102 606 1132 q 773 1024 732 1071 q 834 926 813 977 l 834 926 l 846 926 l 846 1118 l 1190 1118 m 639 256 l 639 256 q 753 294 705 256 q 825 399 800 331 q 850 558 850 467 l 850 558 q 825 719 850 651 q 753 823 800 786 q 639 859 705 859 l 639 859 q 526 822 572 859 q 455 717 479 784 q 431 558 431 649 l 431 558 q 455 400 431 468 q 526 294 479 331 q 639 256 572 256"},r:{ha:860,x_min:115,x_max:826,o:"m 464 0 l 115 0 l 115 1118 l 454 1118 l 454 914 l 466 914 q 566 1079 496 1025 q 727 1132 635 1132 l 727 1132 q 778 1129 751 1132 q 826 1120 804 1126 l 826 1120 l 826 816 q 761 830 801 825 q 688 834 720 834 l 688 834 q 573 806 624 834 q 493 727 522 777 q 464 610 464 677 l 464 610 l 464 0"},s:{ha:1174,x_min:65,x_max:1110,o:"m 586 -21 l 586 -21 q 333 20 443 -21 q 154 137 223 60 q 65 320 85 213 l 65 320 l 389 371 q 460 261 410 298 q 599 224 510 224 l 599 224 q 714 250 672 224 q 756 317 756 275 l 756 317 q 723 380 756 356 q 619 417 689 403 l 619 417 l 424 455 q 176 568 258 487 q 93 777 93 648 l 93 777 q 154 968 93 889 q 325 1090 214 1047 q 585 1132 435 1132 l 585 1132 q 829 1095 725 1132 q 996 988 932 1057 q 1078 822 1059 918 l 1078 822 l 770 773 q 709 861 755 829 q 591 892 662 892 l 591 892 q 485 867 528 892 q 441 798 441 841 l 441 798 q 468 739 441 764 q 567 699 495 713 l 567 699 l 781 659 q 1029 553 947 627 q 1110 357 1110 479 l 1110 357 q 1043 157 1110 242 q 857 26 975 72 q 586 -21 739 -21"},t:{ha:782,x_min:20,x_max:748,o:"m 517 1118 l 718 1118 l 718 859 l 517 859 l 517 342 q 538 277 517 298 q 606 255 559 255 l 606 255 q 657 259 624 255 q 703 267 689 263 l 703 267 l 748 13 q 634 -10 689 -4 q 530 -16 579 -16 l 530 -16 q 260 68 352 -16 q 168 311 168 151 l 168 311 l 168 859 l 20 859 l 20 1118 l 168 1118 l 168 1384 l 517 1384 l 517 1118"},u:{ha:1301,x_min:115,x_max:1186,o:"m 503 -14 l 503 -14 q 299 38 386 -14 q 163 185 211 90 q 115 406 115 280 l 115 406 l 115 1118 l 464 1118 l 464 474 q 513 327 464 380 q 646 273 561 273 l 646 273 q 747 298 704 273 q 813 369 789 322 q 837 480 837 415 l 837 480 l 837 1118 l 1186 1118 l 1186 0 l 858 0 l 853 242 q 737 67 811 135 l 737 67 q 503 -14 649 -14"},v:{ha:1260,x_min:22,x_max:1238,o:"m 831 0 l 427 0 l 22 1118 l 390 1118 l 557 571 q 616 346 591 461 l 616 346 q 634 260 625 304 l 634 260 q 653 346 644 304 l 653 346 q 710 571 677 460 l 710 571 l 874 1118 l 1238 1118 l 831 0"},w:{ha:1767,x_min:15,x_max:1752,o:"m 697 0 l 341 0 l 15 1118 l 380 1118 l 462 735 q 513 488 485 620 l 513 488 q 546 309 531 403 l 546 309 q 583 487 563 403 l 583 487 q 640 735 614 619 l 640 735 l 729 1118 l 1039 1118 l 1125 735 q 1181 487 1150 619 l 1181 487 q 1219 306 1201 402 l 1219 306 q 1250 486 1233 401 l 1250 486 q 1300 735 1276 618 l 1300 735 l 1381 1118 l 1752 1118 l 1423 0 l 1067 0 l 951 401 q 918 538 935 460 q 885 697 901 616 l 885 697 q 882 710 884 703 l 882 710 q 880 697 881 703 l 880 697 q 847 538 863 616 q 813 401 830 459 l 813 401 l 697 0"},x:{ha:1217,x_min:33,x_max:1184,o:"m 396 0 l 33 0 l 380 574 l 54 1118 l 424 1118 l 510 958 q 594 782 556 871 l 594 782 q 611 742 602 762 l 611 742 q 628 781 619 761 l 628 781 q 715 958 667 871 l 715 958 l 805 1118 l 1169 1118 l 834 572 l 1184 0 l 816 0 l 708 194 q 620 372 660 281 l 620 372 q 603 410 611 391 l 603 410 q 587 372 595 391 l 587 372 q 502 194 548 281 l 502 194 l 396 0"},y:{ha:1266,x_min:22,x_max:1244,o:"m 112 -392 l 112 -392 l 190 -137 l 234 -149 q 345 -158 297 -165 q 418 -123 392 -151 q 440 -49 443 -95 l 440 -49 l 439 -2 l 22 1118 l 390 1118 l 557 571 q 611 346 591 459 l 611 346 q 623 277 616 312 l 623 277 q 639 347 631 313 l 639 347 q 701 571 666 461 l 701 571 l 880 1118 l 1244 1118 l 775 -118 q 686 -277 741 -208 q 546 -386 631 -347 q 334 -426 460 -426 l 334 -426 q 211 -416 270 -426 q 112 -392 151 -407"},z:{ha:1190,x_min:117,x_max:1073,o:"m 1073 0 l 117 0 l 117 201 l 638 838 l 638 845 l 134 845 l 134 1118 l 1054 1118 l 1054 897 l 571 280 l 571 273 l 1073 273 l 1073 0"},"{":{ha:996,x_min:139,x_max:903,o:"m 903 -21 l 903 -279 q 694 -267 792 -279 q 522 -216 596 -256 q 405 -93 447 -177 q 363 134 363 -10 l 363 134 l 363 286 q 314 447 363 396 q 139 497 264 497 l 139 497 l 139 805 q 314 856 264 805 q 363 1015 363 906 l 363 1015 l 363 1168 q 405 1396 363 1312 q 522 1519 447 1479 q 694 1570 596 1558 q 903 1581 792 1581 l 903 1581 l 903 1323 q 730 1276 773 1323 q 687 1128 687 1228 l 687 1128 l 687 937 q 667 829 687 883 q 589 730 646 774 l 589 730 q 440 663 536 688 l 440 663 l 440 639 q 589 572 536 613 l 589 572 q 667 474 646 528 q 687 364 687 419 l 687 364 l 687 174 q 730 27 687 75 q 903 -21 773 -21 l 903 -21"},"|":{ha:794,x_min:229,x_max:564,o:"m 229 1970 l 564 1970 l 564 -480 l 229 -480 l 229 1970"},"}":{ha:996,x_min:93,x_max:857,o:"m 93 -279 l 93 -279 l 93 -21 q 267 27 224 -21 q 309 174 309 75 l 309 174 l 309 364 q 330 474 309 419 q 408 572 350 528 l 408 572 q 556 638 460 612 l 556 638 l 556 663 q 408 730 460 689 l 408 730 q 330 829 350 774 q 309 937 309 883 l 309 937 l 309 1128 q 267 1276 309 1228 q 93 1323 224 1323 l 93 1323 l 93 1581 q 303 1570 205 1581 q 475 1519 400 1558 q 591 1396 549 1479 q 633 1168 633 1312 l 633 1168 l 633 1015 q 683 856 633 906 q 857 805 732 805 l 857 805 l 857 497 q 682 447 731 497 q 633 286 633 396 l 633 286 l 633 134 q 591 -93 633 -10 q 475 -216 549 -177 q 303 -267 400 -256 q 93 -279 205 -279"},"~":{ha:1404,x_min:152,x_max:1253,o:"m 414 391 l 153 391 q 185 636 148 534 q 296 791 222 737 q 475 844 370 844 l 475 844 q 605 817 542 844 q 746 719 667 790 l 746 719 q 814 666 786 685 q 879 646 841 646 l 879 646 q 961 685 928 646 q 990 811 993 724 l 990 811 l 1252 811 q 1218 568 1257 669 q 1106 413 1179 466 q 930 359 1032 359 l 930 359 q 794 389 857 359 q 655 483 730 418 l 655 483 q 587 540 612 522 q 525 557 562 557 l 525 557 q 444 519 476 557 q 414 391 412 480 l 414 391"},\u00c0:{ha:1576,x_min:47,x_max:1529,o:"m 439 0 l 47 0 l 544 1490 l 1017 1490 l 1529 0 l 1133 0 l 1032 317 l 536 317 l 439 0 m 619 587 l 946 587 l 926 651 q 830 998 876 814 l 830 998 q 777 1210 803 1101 l 777 1210 q 728 997 752 1101 l 728 997 q 639 651 686 813 l 639 651 l 619 587 m 905 1630 l 669 1630 l 457 1948 l 767 1948 l 905 1630"},\u00c1:{ha:1576,x_min:47,x_max:1529,o:"m 439 0 l 47 0 l 544 1490 l 1017 1490 l 1529 0 l 1133 0 l 1032 317 l 536 317 l 439 0 m 619 587 l 946 587 l 926 651 q 830 998 876 814 l 830 998 q 777 1210 803 1101 l 777 1210 q 728 997 752 1101 l 728 997 q 639 651 686 813 l 639 651 l 619 587 m 900 1630 l 665 1630 l 803 1948 l 1113 1948 l 900 1630"},\u00c2:{ha:1576,x_min:47,x_max:1529,o:"m 439 0 l 47 0 l 544 1490 l 1017 1490 l 1529 0 l 1133 0 l 1032 317 l 536 317 l 439 0 m 619 587 l 946 587 l 926 651 q 830 998 876 814 l 830 998 q 777 1210 803 1101 l 777 1210 q 728 997 752 1101 l 728 997 q 639 651 686 813 l 639 651 l 619 587 m 785 1802 l 642 1634 l 347 1634 l 347 1641 l 658 1948 l 911 1948 l 1222 1641 l 1222 1634 l 927 1634 l 785 1802"},\u00c3:{ha:1576,x_min:47,x_max:1529,o:"m 439 0 l 47 0 l 544 1490 l 1017 1490 l 1529 0 l 1133 0 l 1032 317 l 536 317 l 439 0 m 619 587 l 946 587 l 926 651 q 830 998 876 814 l 830 998 q 777 1210 803 1101 l 777 1210 q 728 997 752 1101 l 728 997 q 639 651 686 813 l 639 651 l 619 587 m 929 1642 l 929 1642 q 839 1659 877 1642 q 771 1697 800 1675 q 716 1736 741 1719 q 666 1753 691 1753 l 666 1753 q 615 1725 633 1753 q 595 1649 597 1697 l 595 1649 l 414 1649 q 481 1863 417 1790 q 642 1936 544 1936 l 642 1936 q 732 1920 694 1936 q 800 1881 770 1903 q 854 1843 829 1859 q 905 1826 879 1826 l 905 1826 q 960 1853 943 1826 q 978 1930 976 1880 l 978 1930 l 1156 1930 q 1089 1717 1154 1791 q 929 1642 1024 1642"},\u00c4:{ha:1576,x_min:47,x_max:1529,o:"m 439 0 l 47 0 l 544 1490 l 1017 1490 l 1529 0 l 1133 0 l 1032 317 l 536 317 l 439 0 m 619 587 l 946 587 l 926 651 q 830 998 876 814 l 830 998 q 777 1210 803 1101 l 777 1210 q 728 997 752 1101 l 728 997 q 639 651 686 813 l 639 651 l 619 587 m 1011 1632 l 1011 1632 q 896 1678 944 1632 q 848 1789 848 1724 l 848 1789 q 896 1900 848 1854 q 1011 1946 944 1946 l 1011 1946 q 1126 1900 1078 1946 q 1173 1789 1173 1854 l 1173 1789 q 1126 1678 1173 1724 q 1011 1632 1078 1632 m 559 1632 l 559 1632 q 444 1678 491 1632 q 396 1789 396 1724 l 396 1789 q 444 1900 396 1854 q 559 1946 491 1946 l 559 1946 q 674 1900 626 1946 q 721 1789 721 1854 l 721 1789 q 674 1678 721 1724 q 559 1632 626 1632"},\u00c5:{ha:1576,x_min:47,x_max:1529,o:"m 439 0 l 47 0 l 544 1490 l 1017 1490 l 1529 0 l 1133 0 l 1032 317 l 536 317 l 439 0 m 619 587 l 946 587 l 926 651 q 830 998 876 814 l 830 998 q 777 1210 803 1101 l 777 1210 q 728 997 752 1101 l 728 997 q 639 651 686 813 l 639 651 l 619 587 m 786 1546 l 786 1546 q 639 1579 702 1546 q 541 1666 576 1611 q 506 1789 506 1721 l 506 1789 q 541 1913 506 1858 q 639 1999 576 1967 q 786 2031 702 2031 l 786 2031 q 933 1999 870 2031 q 1030 1913 995 1967 q 1065 1789 1065 1858 l 1065 1789 q 1030 1666 1065 1721 q 933 1579 995 1611 q 786 1546 870 1546 m 786 1681 l 786 1681 q 870 1711 838 1681 q 901 1789 901 1741 l 901 1789 q 870 1867 901 1837 q 786 1897 838 1897 l 786 1897 q 702 1867 734 1897 q 670 1789 670 1837 l 670 1789 q 702 1711 670 1741 q 786 1681 734 1681"},\u00c6:{ha:2119,x_min:47,x_max:2019,o:"m 437 0 l 47 0 l 662 1490 l 2019 1490 l 2019 1202 l 1338 1202 l 1338 892 l 1966 892 l 1966 610 l 1338 610 l 1338 288 l 2019 288 l 2019 0 l 1000 0 l 1000 329 l 565 329 l 437 0 m 660 572 l 1000 572 l 1000 1267 l 931 1267 l 660 572"},\u00c7:{ha:1523,x_min:82,x_max:1446,o:"m 794 -416 l 645 -416 l 645 -291 l 776 -291 q 841 -277 821 -291 q 860 -231 860 -263 l 860 -231 q 841 -186 860 -200 q 776 -172 821 -172 l 776 -172 l 680 -172 l 708 -16 q 427 69 554 -2 l 427 69 q 175 329 267 158 q 82 744 82 500 l 82 744 q 176 1161 82 990 q 429 1421 269 1332 q 787 1510 589 1510 l 787 1510 q 1033 1474 920 1510 q 1233 1367 1146 1437 q 1375 1196 1320 1297 q 1445 964 1429 1094 l 1445 964 l 1088 964 q 1055 1063 1079 1019 q 994 1137 1031 1106 q 906 1184 956 1168 q 796 1200 856 1200 l 796 1200 q 608 1146 687 1200 q 486 991 528 1092 q 443 744 443 889 l 443 744 q 487 494 443 595 q 609 341 530 392 q 794 290 687 290 l 794 290 q 904 306 854 290 q 992 353 954 322 q 1055 428 1030 384 q 1089 526 1080 471 l 1089 526 l 1446 526 q 1389 330 1436 426 q 1259 154 1342 233 q 1057 27 1175 74 l 1057 27 q 841 -18 960 -11 l 841 -18 l 835 -87 q 982 -121 928 -79 q 1036 -241 1036 -163 l 1036 -241 q 979 -376 1036 -336 q 794 -416 921 -416 l 794 -416"},\u00c8:{ha:1249,x_min:116,x_max:1150,o:"m 1149 0 l 116 0 l 116 1490 l 1150 1490 l 1150 1202 l 469 1202 l 469 894 l 1096 894 l 1096 612 l 469 612 l 469 288 l 1149 288 l 1149 0 m 754 1630 l 518 1630 l 306 1948 l 616 1948 l 754 1630"},\u00c9:{ha:1249,x_min:116,x_max:1150,o:"m 1149 0 l 116 0 l 116 1490 l 1150 1490 l 1150 1202 l 469 1202 l 469 894 l 1096 894 l 1096 612 l 469 612 l 469 288 l 1149 288 l 1149 0 m 749 1630 l 514 1630 l 652 1948 l 962 1948 l 749 1630"},\u00ca:{ha:1249,x_min:116,x_max:1150,o:"m 1149 0 l 116 0 l 116 1490 l 1150 1490 l 1150 1202 l 469 1202 l 469 894 l 1096 894 l 1096 612 l 469 612 l 469 288 l 1149 288 l 1149 0 m 635 1802 l 492 1634 l 197 1634 l 197 1641 l 508 1948 l 761 1948 l 1072 1641 l 1072 1634 l 777 1634 l 635 1802"},\u00cb:{ha:1249,x_min:116,x_max:1150,o:"m 1149 0 l 116 0 l 116 1490 l 1150 1490 l 1150 1202 l 469 1202 l 469 894 l 1096 894 l 1096 612 l 469 612 l 469 288 l 1149 288 l 1149 0 m 861 1632 l 861 1632 q 746 1678 794 1632 q 698 1789 698 1724 l 698 1789 q 746 1900 698 1854 q 861 1946 794 1946 l 861 1946 q 976 1900 928 1946 q 1023 1789 1023 1854 l 1023 1789 q 976 1678 1023 1724 q 861 1632 928 1632 m 409 1632 l 409 1632 q 294 1678 341 1632 q 246 1789 246 1724 l 246 1789 q 294 1900 246 1854 q 409 1946 341 1946 l 409 1946 q 524 1900 476 1946 q 571 1789 571 1854 l 571 1789 q 524 1678 571 1724 q 409 1632 476 1632"},\u00cc:{ha:585,x_min:-34,x_max:469,o:"m 116 1490 l 469 1490 l 469 0 l 116 0 l 116 1490 m 414 1630 l 178 1630 l -34 1948 l 276 1948 l 414 1630"},\u00cd:{ha:585,x_min:116,x_max:622,o:"m 116 1490 l 469 1490 l 469 0 l 116 0 l 116 1490 m 409 1630 l 174 1630 l 312 1948 l 622 1948 l 409 1630"},\u00ce:{ha:585,x_min:-144,x_max:731,o:"m 116 1490 l 469 1490 l 469 0 l 116 0 l 116 1490 m 294 1802 l 151 1634 l -144 1634 l -144 1641 l 167 1948 l 420 1948 l 731 1641 l 731 1634 l 436 1634 l 294 1802"},\u00cf:{ha:585,x_min:-95,x_max:682,o:"m 116 1490 l 469 1490 l 469 0 l 116 0 l 116 1490 m 520 1632 l 520 1632 q 405 1678 453 1632 q 357 1789 357 1724 l 357 1789 q 405 1900 357 1854 q 520 1946 453 1946 l 520 1946 q 635 1900 587 1946 q 682 1789 682 1854 l 682 1789 q 635 1678 682 1724 q 520 1632 587 1632 m 68 1632 l 68 1632 q -47 1678 0 1632 q -95 1789 -95 1724 l -95 1789 q -47 1900 -95 1854 q 68 1946 0 1946 l 68 1946 q 183 1900 135 1946 q 230 1789 230 1854 l 230 1789 q 183 1678 230 1724 q 68 1632 135 1632"},\u00d1:{ha:1568,x_min:116,x_max:1452,o:"m 478 0 l 116 0 l 116 1490 l 504 1490 l 920 817 q 999 679 960 750 q 1075 520 1037 607 l 1075 520 q 1111 432 1093 479 l 1111 432 q 1107 502 1109 466 l 1107 502 q 1095 697 1100 602 q 1090 856 1090 791 l 1090 856 l 1090 1490 l 1452 1490 l 1452 0 l 1063 0 l 682 617 q 590 778 631 702 q 507 943 548 854 l 507 943 q 457 1050 484 992 l 457 1050 q 464 944 460 996 l 464 944 q 474 758 470 842 q 478 617 478 673 l 478 617 l 478 0 m 928 1642 l 928 1642 q 838 1659 876 1642 q 770 1697 799 1675 q 715 1736 740 1719 q 665 1753 690 1753 l 665 1753 q 614 1725 632 1753 q 594 1649 596 1697 l 594 1649 l 413 1649 q 480 1863 416 1790 q 641 1936 543 1936 l 641 1936 q 731 1920 693 1936 q 799 1881 769 1903 q 853 1843 828 1859 q 904 1826 878 1826 l 904 1826 q 959 1853 942 1826 q 977 1930 975 1880 l 977 1930 l 1155 1930 q 1088 1717 1153 1791 q 928 1642 1023 1642"},\u00d2:{ha:1583,x_min:82,x_max:1500,o:"m 792 -20 l 792 -20 q 431 69 591 -20 q 176 329 270 158 q 82 744 82 500 l 82 744 q 176 1161 82 990 q 431 1421 270 1332 q 792 1510 591 1510 l 792 1510 q 1153 1421 992 1510 q 1407 1161 1313 1332 q 1500 744 1500 990 l 1500 744 q 1407 328 1500 499 q 1153 69 1313 157 q 792 -20 992 -20 m 792 290 l 792 290 q 978 342 900 290 q 1098 496 1056 394 q 1140 744 1140 597 l 1140 744 q 1098 994 1140 892 q 978 1148 1056 1096 q 792 1200 900 1200 l 792 1200 q 605 1148 683 1200 q 485 994 527 1095 q 443 744 443 892 l 443 744 q 485 496 443 597 q 605 343 527 395 q 792 290 683 290 m 912 1630 l 676 1630 l 464 1948 l 774 1948 l 912 1630"},\u00d3:{ha:1583,x_min:82,x_max:1500,o:"m 792 -20 l 792 -20 q 431 69 591 -20 q 176 329 270 158 q 82 744 82 500 l 82 744 q 176 1161 82 990 q 431 1421 270 1332 q 792 1510 591 1510 l 792 1510 q 1153 1421 992 1510 q 1407 1161 1313 1332 q 1500 744 1500 990 l 1500 744 q 1407 328 1500 499 q 1153 69 1313 157 q 792 -20 992 -20 m 792 290 l 792 290 q 978 342 900 290 q 1098 496 1056 394 q 1140 744 1140 597 l 1140 744 q 1098 994 1140 892 q 978 1148 1056 1096 q 792 1200 900 1200 l 792 1200 q 605 1148 683 1200 q 485 994 527 1095 q 443 744 443 892 l 443 744 q 485 496 443 597 q 605 343 527 395 q 792 290 683 290 m 906 1630 l 671 1630 l 809 1948 l 1119 1948 l 906 1630"},\u00d4:{ha:1583,x_min:82,x_max:1500,o:"m 792 -20 l 792 -20 q 431 69 591 -20 q 176 329 270 158 q 82 744 82 500 l 82 744 q 176 1161 82 990 q 431 1421 270 1332 q 792 1510 591 1510 l 792 1510 q 1153 1421 992 1510 q 1407 1161 1313 1332 q 1500 744 1500 990 l 1500 744 q 1407 328 1500 499 q 1153 69 1313 157 q 792 -20 992 -20 m 792 290 l 792 290 q 978 342 900 290 q 1098 496 1056 394 q 1140 744 1140 597 l 1140 744 q 1098 994 1140 892 q 978 1148 1056 1096 q 792 1200 900 1200 l 792 1200 q 605 1148 683 1200 q 485 994 527 1095 q 443 744 443 892 l 443 744 q 485 496 443 597 q 605 343 527 395 q 792 290 683 290 m 792 1802 l 649 1634 l 354 1634 l 354 1641 l 665 1948 l 918 1948 l 1229 1641 l 1229 1634 l 934 1634 l 792 1802"},\u00d5:{ha:1583,x_min:82,x_max:1500,o:"m 792 -20 l 792 -20 q 431 69 591 -20 q 176 329 270 158 q 82 744 82 500 l 82 744 q 176 1161 82 990 q 431 1421 270 1332 q 792 1510 591 1510 l 792 1510 q 1153 1421 992 1510 q 1407 1161 1313 1332 q 1500 744 1500 990 l 1500 744 q 1407 328 1500 499 q 1153 69 1313 157 q 792 -20 992 -20 m 792 290 l 792 290 q 978 342 900 290 q 1098 496 1056 394 q 1140 744 1140 597 l 1140 744 q 1098 994 1140 892 q 978 1148 1056 1096 q 792 1200 900 1200 l 792 1200 q 605 1148 683 1200 q 485 994 527 1095 q 443 744 443 892 l 443 744 q 485 496 443 597 q 605 343 527 395 q 792 290 683 290 m 935 1642 l 935 1642 q 845 1659 883 1642 q 777 1697 806 1675 q 722 1736 747 1719 q 672 1753 697 1753 l 672 1753 q 621 1725 639 1753 q 601 1649 603 1697 l 601 1649 l 420 1649 q 487 1863 423 1790 q 648 1936 550 1936 l 648 1936 q 738 1920 700 1936 q 806 1881 776 1903 q 860 1843 835 1859 q 911 1826 885 1826 l 911 1826 q 966 1853 949 1826 q 984 1930 982 1880 l 984 1930 l 1162 1930 q 1095 1717 1160 1791 q 935 1642 1030 1642"},\u00d6:{ha:1583,x_min:82,x_max:1500,o:"m 792 -20 l 792 -20 q 431 69 591 -20 q 176 329 270 158 q 82 744 82 500 l 82 744 q 176 1161 82 990 q 431 1421 270 1332 q 792 1510 591 1510 l 792 1510 q 1153 1421 992 1510 q 1407 1161 1313 1332 q 1500 744 1500 990 l 1500 744 q 1407 328 1500 499 q 1153 69 1313 157 q 792 -20 992 -20 m 792 290 l 792 290 q 978 342 900 290 q 1098 496 1056 394 q 1140 744 1140 597 l 1140 744 q 1098 994 1140 892 q 978 1148 1056 1096 q 792 1200 900 1200 l 792 1200 q 605 1148 683 1200 q 485 994 527 1095 q 443 744 443 892 l 443 744 q 485 496 443 597 q 605 343 527 395 q 792 290 683 290 m 1018 1632 l 1018 1632 q 903 1678 951 1632 q 855 1789 855 1724 l 855 1789 q 903 1900 855 1854 q 1018 1946 951 1946 l 1018 1946 q 1133 1900 1085 1946 q 1180 1789 1180 1854 l 1180 1789 q 1133 1678 1180 1724 q 1018 1632 1085 1632 m 566 1632 l 566 1632 q 451 1678 498 1632 q 403 1789 403 1724 l 403 1789 q 451 1900 403 1854 q 566 1946 498 1946 l 566 1946 q 681 1900 633 1946 q 728 1789 728 1854 l 728 1789 q 681 1678 728 1724 q 566 1632 633 1632"},\u00d8:{ha:1583,x_min:82,x_max:1500,o:"m 792 -20 l 792 -20 q 431 69 591 -20 l 431 69 q 430 69 430 69 l 430 69 l 331 -70 l 177 35 l 282 183 q 176 329 221 247 l 176 329 q 82 744 82 500 l 82 744 q 176 1161 82 990 q 431 1421 270 1332 q 792 1510 591 1510 l 792 1510 q 1153 1421 992 1510 l 1153 1421 q 1155 1420 1154 1420 l 1155 1420 l 1253 1559 l 1407 1452 l 1303 1305 q 1407 1161 1362 1242 l 1407 1161 q 1500 744 1500 990 l 1500 744 q 1407 328 1500 499 q 1153 69 1313 157 q 792 -20 992 -20 m 492 481 l 492 481 l 968 1155 q 792 1200 893 1200 l 792 1200 q 605 1148 683 1200 q 485 994 527 1095 q 443 744 443 892 l 443 744 q 485 496 443 597 l 485 496 q 492 481 488 488 m 792 290 l 792 290 q 978 342 900 290 q 1098 496 1056 394 q 1140 744 1140 597 l 1140 744 q 1098 994 1140 892 l 1098 994 q 1092 1007 1095 1001 l 1092 1007 l 617 335 q 792 290 691 290"},\u00d9:{ha:1489,x_min:116,x_max:1373,o:"m 744 -19 l 744 -19 q 415 49 556 -19 q 195 240 273 116 q 116 529 116 363 l 116 529 l 116 1490 l 469 1490 l 469 558 q 504 419 469 480 q 601 324 539 358 q 744 289 662 289 l 744 289 q 889 324 826 289 q 986 419 951 358 q 1020 558 1020 480 l 1020 558 l 1020 1490 l 1373 1490 l 1373 529 q 1294 240 1373 363 q 1074 49 1215 116 q 744 -19 932 -19 m 864 1630 l 628 1630 l 416 1948 l 726 1948 l 864 1630"},\u00da:{ha:1489,x_min:116,x_max:1373,o:"m 744 -19 l 744 -19 q 415 49 556 -19 q 195 240 273 116 q 116 529 116 363 l 116 529 l 116 1490 l 469 1490 l 469 558 q 504 419 469 480 q 601 324 539 358 q 744 289 662 289 l 744 289 q 889 324 826 289 q 986 419 951 358 q 1020 558 1020 480 l 1020 558 l 1020 1490 l 1373 1490 l 1373 529 q 1294 240 1373 363 q 1074 49 1215 116 q 744 -19 932 -19 m 859 1630 l 624 1630 l 762 1948 l 1072 1948 l 859 1630"},\u00db:{ha:1489,x_min:116,x_max:1373,o:"m 744 -19 l 744 -19 q 415 49 556 -19 q 195 240 273 116 q 116 529 116 363 l 116 529 l 116 1490 l 469 1490 l 469 558 q 504 419 469 480 q 601 324 539 358 q 744 289 662 289 l 744 289 q 889 324 826 289 q 986 419 951 358 q 1020 558 1020 480 l 1020 558 l 1020 1490 l 1373 1490 l 1373 529 q 1294 240 1373 363 q 1074 49 1215 116 q 744 -19 932 -19 m 744 1802 l 601 1634 l 306 1634 l 306 1641 l 617 1948 l 870 1948 l 1181 1641 l 1181 1634 l 886 1634 l 744 1802"},\u00dc:{ha:1489,x_min:116,x_max:1373,o:"m 744 -19 l 744 -19 q 415 49 556 -19 q 195 240 273 116 q 116 529 116 363 l 116 529 l 116 1490 l 469 1490 l 469 558 q 504 419 469 480 q 601 324 539 358 q 744 289 662 289 l 744 289 q 889 324 826 289 q 986 419 951 358 q 1020 558 1020 480 l 1020 558 l 1020 1490 l 1373 1490 l 1373 529 q 1294 240 1373 363 q 1074 49 1215 116 q 744 -19 932 -19 m 970 1632 l 970 1632 q 855 1678 903 1632 q 807 1789 807 1724 l 807 1789 q 855 1900 807 1854 q 970 1946 903 1946 l 970 1946 q 1085 1900 1037 1946 q 1132 1789 1132 1854 l 1132 1789 q 1085 1678 1132 1724 q 970 1632 1037 1632 m 518 1632 l 518 1632 q 403 1678 450 1632 q 355 1789 355 1724 l 355 1789 q 403 1900 355 1854 q 518 1946 450 1946 l 518 1946 q 633 1900 585 1946 q 680 1789 680 1854 l 680 1789 q 633 1678 680 1724 q 518 1632 585 1632"},\u00dd:{ha:1540,x_min:47,x_max:1493,o:"m 952 0 l 601 0 l 601 540 l 47 1490 l 461 1490 l 695 1033 q 756 900 729 967 l 756 900 q 778 841 767 873 l 778 841 q 800 901 789 873 l 800 901 q 858 1033 825 968 l 858 1033 l 1081 1490 l 1493 1490 l 952 540 l 952 0 m 885 1630 l 650 1630 l 788 1948 l 1098 1948 l 885 1630"},\u00df:{ha:1381,x_min:116,x_max:1316,o:"m 465 0 l 116 0 l 116 1093 q 182 1317 116 1223 q 369 1460 248 1410 q 652 1510 489 1510 l 652 1510 q 931 1465 804 1510 q 1134 1329 1057 1419 q 1211 1101 1211 1238 l 1211 1101 q 1157 909 1211 990 q 1002 802 1102 828 l 1002 802 l 1002 785 q 1233 672 1149 776 q 1316 410 1316 567 l 1316 410 q 1254 185 1316 276 q 1080 47 1191 93 q 825 0 969 0 l 825 0 l 618 0 l 618 279 l 760 279 q 908 325 853 279 q 962 448 962 371 l 962 448 q 901 575 962 528 q 736 622 840 622 l 736 622 l 624 622 l 624 884 l 698 884 q 780 907 745 884 q 834 967 814 929 q 853 1051 853 1004 l 853 1051 q 803 1174 853 1126 q 664 1222 753 1222 l 664 1222 q 520 1171 574 1222 q 465 1034 465 1120 l 465 1034 l 465 0"},\u00e0:{ha:1205,x_min:60,x_max:1089,o:"m 428 -20 l 428 -20 q 238 17 321 -20 q 107 127 154 53 q 60 310 60 200 l 60 310 q 93 467 60 403 q 183 571 125 531 q 316 632 241 611 q 476 660 391 653 l 476 660 q 629 678 571 668 q 714 706 687 687 q 741 759 741 725 l 741 759 l 741 763 q 723 829 741 802 q 671 870 705 856 q 589 884 637 884 l 589 884 q 504 870 541 884 q 442 830 466 856 q 408 769 418 804 l 408 769 l 92 810 q 179 979 114 906 q 348 1092 243 1051 q 592 1132 452 1132 l 592 1132 q 787 1108 696 1132 q 945 1036 877 1083 q 1051 919 1013 988 q 1089 759 1089 849 l 1089 759 l 1089 0 l 761 0 l 761 157 l 752 157 q 676 60 722 99 q 568 1 629 21 q 428 -20 506 -20 m 534 211 l 534 211 q 641 235 593 211 q 716 301 688 259 q 744 398 744 343 l 744 398 l 744 505 q 707 490 729 497 q 657 478 684 483 q 603 468 630 472 q 551 459 576 463 l 551 459 q 464 435 500 452 q 409 391 428 418 q 390 326 390 364 l 390 326 q 409 264 390 289 q 460 225 428 238 q 534 211 492 211 m 722 1258 l 486 1258 l 274 1576 l 584 1576 l 722 1258"},\u00e1:{ha:1205,x_min:60,x_max:1089,o:"m 428 -20 l 428 -20 q 238 17 321 -20 q 107 127 154 53 q 60 310 60 200 l 60 310 q 93 467 60 403 q 183 571 125 531 q 316 632 241 611 q 476 660 391 653 l 476 660 q 629 678 571 668 q 714 706 687 687 q 741 759 741 725 l 741 759 l 741 763 q 723 829 741 802 q 671 870 705 856 q 589 884 637 884 l 589 884 q 504 870 541 884 q 442 830 466 856 q 408 769 418 804 l 408 769 l 92 810 q 179 979 114 906 q 348 1092 243 1051 q 592 1132 452 1132 l 592 1132 q 787 1108 696 1132 q 945 1036 877 1083 q 1051 919 1013 988 q 1089 759 1089 849 l 1089 759 l 1089 0 l 761 0 l 761 157 l 752 157 q 676 60 722 99 q 568 1 629 21 q 428 -20 506 -20 m 534 211 l 534 211 q 641 235 593 211 q 716 301 688 259 q 744 398 744 343 l 744 398 l 744 505 q 707 490 729 497 q 657 478 684 483 q 603 468 630 472 q 551 459 576 463 l 551 459 q 464 435 500 452 q 409 391 428 418 q 390 326 390 364 l 390 326 q 409 264 390 289 q 460 225 428 238 q 534 211 492 211 m 717 1258 l 482 1258 l 620 1576 l 930 1576 l 717 1258"},\u00e2:{ha:1205,x_min:60,x_max:1089,o:"m 428 -20 l 428 -20 q 238 17 321 -20 q 107 127 154 53 q 60 310 60 200 l 60 310 q 93 467 60 403 q 183 571 125 531 q 316 632 241 611 q 476 660 391 653 l 476 660 q 629 678 571 668 q 714 706 687 687 q 741 759 741 725 l 741 759 l 741 763 q 723 829 741 802 q 671 870 705 856 q 589 884 637 884 l 589 884 q 504 870 541 884 q 442 830 466 856 q 408 769 418 804 l 408 769 l 92 810 q 179 979 114 906 q 348 1092 243 1051 q 592 1132 452 1132 l 592 1132 q 787 1108 696 1132 q 945 1036 877 1083 q 1051 919 1013 988 q 1089 759 1089 849 l 1089 759 l 1089 0 l 761 0 l 761 157 l 752 157 q 676 60 722 99 q 568 1 629 21 q 428 -20 506 -20 m 534 211 l 534 211 q 641 235 593 211 q 716 301 688 259 q 744 398 744 343 l 744 398 l 744 505 q 707 490 729 497 q 657 478 684 483 q 603 468 630 472 q 551 459 576 463 l 551 459 q 464 435 500 452 q 409 391 428 418 q 390 326 390 364 l 390 326 q 409 264 390 289 q 460 225 428 238 q 534 211 492 211 m 602 1430 l 459 1262 l 164 1262 l 164 1269 l 475 1576 l 728 1576 l 1039 1269 l 1039 1262 l 744 1262 l 602 1430"},\u00e3:{ha:1205,x_min:60,x_max:1089,o:"m 428 -20 l 428 -20 q 238 17 321 -20 q 107 127 154 53 q 60 310 60 200 l 60 310 q 93 467 60 403 q 183 571 125 531 q 316 632 241 611 q 476 660 391 653 l 476 660 q 629 678 571 668 q 714 706 687 687 q 741 759 741 725 l 741 759 l 741 763 q 723 829 741 802 q 671 870 705 856 q 589 884 637 884 l 589 884 q 504 870 541 884 q 442 830 466 856 q 408 769 418 804 l 408 769 l 92 810 q 179 979 114 906 q 348 1092 243 1051 q 592 1132 452 1132 l 592 1132 q 787 1108 696 1132 q 945 1036 877 1083 q 1051 919 1013 988 q 1089 759 1089 849 l 1089 759 l 1089 0 l 761 0 l 761 157 l 752 157 q 676 60 722 99 q 568 1 629 21 q 428 -20 506 -20 m 534 211 l 534 211 q 641 235 593 211 q 716 301 688 259 q 744 398 744 343 l 744 398 l 744 505 q 707 490 729 497 q 657 478 684 483 q 603 468 630 472 q 551 459 576 463 l 551 459 q 464 435 500 452 q 409 391 428 418 q 390 326 390 364 l 390 326 q 409 264 390 289 q 460 225 428 238 q 534 211 492 211 m 746 1270 l 746 1270 q 656 1287 694 1270 q 588 1325 617 1303 q 533 1364 558 1347 q 483 1381 508 1381 l 483 1381 q 432 1353 450 1381 q 412 1277 414 1325 l 412 1277 l 231 1277 q 298 1491 234 1418 q 459 1564 361 1564 l 459 1564 q 549 1548 511 1564 q 617 1509 587 1531 q 671 1471 646 1487 q 722 1454 696 1454 l 722 1454 q 777 1481 760 1454 q 795 1558 793 1508 l 795 1558 l 973 1558 q 906 1345 971 1419 q 746 1270 841 1270"},\u00e4:{ha:1205,x_min:60,x_max:1089,o:"m 428 -20 l 428 -20 q 238 17 321 -20 q 107 127 154 53 q 60 310 60 200 l 60 310 q 93 467 60 403 q 183 571 125 531 q 316 632 241 611 q 476 660 391 653 l 476 660 q 629 678 571 668 q 714 706 687 687 q 741 759 741 725 l 741 759 l 741 763 q 723 829 741 802 q 671 870 705 856 q 589 884 637 884 l 589 884 q 504 870 541 884 q 442 830 466 856 q 408 769 418 804 l 408 769 l 92 810 q 179 979 114 906 q 348 1092 243 1051 q 592 1132 452 1132 l 592 1132 q 787 1108 696 1132 q 945 1036 877 1083 q 1051 919 1013 988 q 1089 759 1089 849 l 1089 759 l 1089 0 l 761 0 l 761 157 l 752 157 q 676 60 722 99 q 568 1 629 21 q 428 -20 506 -20 m 534 211 l 534 211 q 641 235 593 211 q 716 301 688 259 q 744 398 744 343 l 744 398 l 744 505 q 707 490 729 497 q 657 478 684 483 q 603 468 630 472 q 551 459 576 463 l 551 459 q 464 435 500 452 q 409 391 428 418 q 390 326 390 364 l 390 326 q 409 264 390 289 q 460 225 428 238 q 534 211 492 211 m 828 1260 l 828 1260 q 713 1306 761 1260 q 665 1417 665 1352 l 665 1417 q 713 1528 665 1482 q 828 1574 761 1574 l 828 1574 q 943 1528 895 1574 q 990 1417 990 1482 l 990 1417 q 943 1306 990 1352 q 828 1260 895 1260 m 376 1260 l 376 1260 q 261 1306 308 1260 q 213 1417 213 1352 l 213 1417 q 261 1528 213 1482 q 376 1574 308 1574 l 376 1574 q 491 1528 443 1574 q 538 1417 538 1482 l 538 1417 q 491 1306 538 1352 q 376 1260 443 1260"},\u00e5:{ha:1205,x_min:60,x_max:1089,o:"m 428 -20 l 428 -20 q 238 17 321 -20 q 107 127 154 53 q 60 310 60 200 l 60 310 q 93 467 60 403 q 183 571 125 531 q 316 632 241 611 q 476 660 391 653 l 476 660 q 629 678 571 668 q 714 706 687 687 q 741 759 741 725 l 741 759 l 741 763 q 723 829 741 802 q 671 870 705 856 q 589 884 637 884 l 589 884 q 504 870 541 884 q 442 830 466 856 q 408 769 418 804 l 408 769 l 92 810 q 179 979 114 906 q 348 1092 243 1051 q 592 1132 452 1132 l 592 1132 q 787 1108 696 1132 q 945 1036 877 1083 q 1051 919 1013 988 q 1089 759 1089 849 l 1089 759 l 1089 0 l 761 0 l 761 157 l 752 157 q 676 60 722 99 q 568 1 629 21 q 428 -20 506 -20 m 534 211 l 534 211 q 641 235 593 211 q 716 301 688 259 q 744 398 744 343 l 744 398 l 744 505 q 707 490 729 497 q 657 478 684 483 q 603 468 630 472 q 551 459 576 463 l 551 459 q 464 435 500 452 q 409 391 428 418 q 390 326 390 364 l 390 326 q 409 264 390 289 q 460 225 428 238 q 534 211 492 211 m 603 1197 l 603 1197 q 462 1232 526 1197 q 361 1326 398 1267 q 323 1457 323 1385 l 323 1457 q 361 1587 323 1528 q 462 1681 398 1645 q 602 1716 526 1716 l 602 1716 q 744 1681 680 1716 q 845 1587 807 1645 q 882 1456 882 1529 l 882 1456 q 845 1326 882 1385 q 744 1232 807 1267 q 603 1197 680 1197 m 603 1339 l 603 1339 q 686 1373 652 1339 q 720 1456 720 1407 l 720 1456 q 686 1540 720 1505 q 602 1574 652 1574 l 602 1574 q 520 1540 554 1574 q 485 1456 485 1505 l 485 1456 q 520 1373 485 1407 q 603 1339 554 1339"},\u00e6:{ha:1858,x_min:60,x_max:1790,o:"m 449 -20 l 449 -20 q 244 17 332 -20 q 108 127 156 53 q 60 310 60 200 l 60 310 q 100 475 60 406 q 210 589 140 544 q 372 656 280 634 q 568 677 463 677 l 568 677 l 743 677 l 743 763 q 725 829 743 802 q 672 870 706 856 q 589 884 637 884 q 504 870 541 884 q 442 830 466 856 q 408 769 418 804 l 408 769 l 92 810 q 179 979 114 906 q 348 1092 243 1051 q 592 1132 452 1132 l 592 1132 q 816 1091 728 1132 l 816 1091 q 911 1023 872 1064 l 911 1023 q 925 1034 918 1028 l 925 1034 q 1072 1107 990 1081 q 1252 1132 1154 1132 l 1252 1132 q 1469 1095 1370 1132 q 1639 986 1567 1058 q 1751 807 1711 913 q 1790 562 1790 701 l 1790 562 l 1790 474 l 1043 474 q 1071 344 1046 396 l 1071 344 q 1151 260 1099 287 q 1269 232 1202 232 l 1269 232 q 1355 245 1316 232 q 1421 284 1393 258 q 1463 348 1449 310 l 1463 348 l 1783 337 q 1695 148 1762 228 q 1518 23 1627 67 q 1263 -21 1409 -21 l 1263 -21 q 1070 6 1158 -21 q 916 82 982 32 l 916 82 q 850 141 879 108 l 850 141 q 815 101 835 119 l 815 101 q 713 34 771 60 q 588 -6 655 7 q 449 -20 520 -20 m 743 398 l 743 474 l 598 474 q 481 454 526 474 q 413 402 435 434 q 390 333 390 370 l 390 333 q 431 241 390 271 q 534 211 471 211 l 534 211 q 640 235 593 211 q 715 301 687 259 q 743 398 743 343 l 743 398 m 1045 677 l 1045 677 l 1459 677 q 1440 762 1455 724 l 1440 762 q 1370 849 1416 818 q 1255 879 1323 879 l 1255 879 q 1139 849 1186 879 q 1068 764 1092 818 l 1068 764 q 1045 677 1050 725"},\u00e7:{ha:1219,x_min:72,x_max:1150,o:"m 647 -418 l 498 -418 l 498 -293 l 629 -293 q 694 -279 674 -293 q 713 -233 713 -265 l 713 -233 q 694 -188 713 -202 q 629 -174 674 -174 l 629 -174 l 533 -174 l 561 -18 q 333 52 432 -5 l 333 52 q 140 254 207 124 q 72 555 72 383 l 72 555 q 140 858 72 728 q 333 1060 207 987 q 634 1132 459 1132 l 634 1132 q 830 1104 741 1132 q 986 1025 919 1076 q 1095 900 1053 973 q 1149 735 1136 826 l 1149 735 l 827 681 q 803 759 819 725 q 763 817 786 793 q 708 853 739 841 q 638 865 676 865 l 638 865 q 524 829 571 865 q 453 723 477 792 q 428 557 428 653 q 453 391 428 461 q 524 284 477 321 q 638 246 571 246 l 638 246 q 708 259 677 246 q 764 296 739 271 q 805 356 788 320 q 828 436 821 391 l 828 436 l 1150 384 q 1096 216 1137 290 q 987 88 1054 141 q 831 7 920 35 l 831 7 q 694 -19 767 -13 l 694 -19 l 688 -89 q 835 -123 781 -81 q 889 -243 889 -165 l 889 -243 q 832 -378 889 -338 q 647 -418 774 -418 l 647 -418"},\u00e8:{ha:1230,x_min:72,x_max:1162,o:"m 636 -21 l 636 -21 q 334 49 461 -21 q 140 247 207 118 q 72 555 72 376 l 72 555 q 140 857 72 727 q 331 1060 207 987 q 623 1132 455 1132 l 623 1132 q 840 1095 741 1132 q 1011 986 938 1058 q 1123 807 1083 913 q 1162 562 1162 701 l 1162 562 l 1162 474 l 415 474 q 444 347 418 399 l 444 347 q 523 261 472 289 q 642 232 574 232 l 642 232 q 728 245 689 232 q 794 284 766 258 q 835 347 821 310 l 835 347 l 1146 296 q 1050 129 1118 200 q 877 18 981 57 q 636 -21 772 -21 m 417 677 l 417 677 l 831 677 q 810 763 825 725 l 810 763 q 740 849 786 819 q 626 879 694 879 q 511 849 558 879 q 440 764 464 818 l 440 764 q 417 677 422 725 m 737 1258 l 501 1258 l 289 1576 l 599 1576 l 737 1258"},\u00e9:{ha:1230,x_min:72,x_max:1162,o:"m 636 -21 l 636 -21 q 334 49 461 -21 q 140 247 207 118 q 72 555 72 376 l 72 555 q 140 857 72 727 q 331 1060 207 987 q 623 1132 455 1132 l 623 1132 q 840 1095 741 1132 q 1011 986 938 1058 q 1123 807 1083 913 q 1162 562 1162 701 l 1162 562 l 1162 474 l 415 474 q 444 347 418 399 l 444 347 q 523 261 472 289 q 642 232 574 232 l 642 232 q 728 245 689 232 q 794 284 766 258 q 835 347 821 310 l 835 347 l 1146 296 q 1050 129 1118 200 q 877 18 981 57 q 636 -21 772 -21 m 417 677 l 417 677 l 831 677 q 810 763 825 725 l 810 763 q 740 849 786 819 q 626 879 694 879 q 511 849 558 879 q 440 764 464 818 l 440 764 q 417 677 422 725 m 732 1258 l 497 1258 l 635 1576 l 945 1576 l 732 1258"},\u00ea:{ha:1230,x_min:72,x_max:1162,o:"m 636 -21 l 636 -21 q 334 49 461 -21 q 140 247 207 118 q 72 555 72 376 l 72 555 q 140 857 72 727 q 331 1060 207 987 q 623 1132 455 1132 l 623 1132 q 840 1095 741 1132 q 1011 986 938 1058 q 1123 807 1083 913 q 1162 562 1162 701 l 1162 562 l 1162 474 l 415 474 q 444 347 418 399 l 444 347 q 523 261 472 289 q 642 232 574 232 l 642 232 q 728 245 689 232 q 794 284 766 258 q 835 347 821 310 l 835 347 l 1146 296 q 1050 129 1118 200 q 877 18 981 57 q 636 -21 772 -21 m 417 677 l 417 677 l 831 677 q 810 763 825 725 l 810 763 q 740 849 786 819 q 626 879 694 879 q 511 849 558 879 q 440 764 464 818 l 440 764 q 417 677 422 725 m 618 1430 l 475 1262 l 180 1262 l 180 1269 l 491 1576 l 744 1576 l 1055 1269 l 1055 1262 l 760 1262 l 618 1430"},\u00eb:{ha:1230,x_min:72,x_max:1162,o:"m 636 -21 l 636 -21 q 334 49 461 -21 q 140 247 207 118 q 72 555 72 376 l 72 555 q 140 857 72 727 q 331 1060 207 987 q 623 1132 455 1132 l 623 1132 q 840 1095 741 1132 q 1011 986 938 1058 q 1123 807 1083 913 q 1162 562 1162 701 l 1162 562 l 1162 474 l 415 474 q 444 347 418 399 l 444 347 q 523 261 472 289 q 642 232 574 232 l 642 232 q 728 245 689 232 q 794 284 766 258 q 835 347 821 310 l 835 347 l 1146 296 q 1050 129 1118 200 q 877 18 981 57 q 636 -21 772 -21 m 417 677 l 417 677 l 831 677 q 810 763 825 725 l 810 763 q 740 849 786 819 q 626 879 694 879 q 511 849 558 879 q 440 764 464 818 l 440 764 q 417 677 422 725 m 844 1260 l 844 1260 q 729 1306 777 1260 q 681 1417 681 1352 l 681 1417 q 729 1528 681 1482 q 844 1574 777 1574 l 844 1574 q 959 1528 911 1574 q 1006 1417 1006 1482 l 1006 1417 q 959 1306 1006 1352 q 844 1260 911 1260 m 392 1260 l 392 1260 q 277 1306 324 1260 q 229 1417 229 1352 l 229 1417 q 277 1528 229 1482 q 392 1574 324 1574 l 392 1574 q 507 1528 459 1574 q 554 1417 554 1482 l 554 1417 q 507 1306 554 1352 q 392 1260 459 1260"},\u00ec:{ha:580,x_min:-39,x_max:464,o:"m 464 0 l 115 0 l 115 1118 l 464 1118 l 464 0 m 409 1258 l 173 1258 l -39 1576 l 271 1576 l 409 1258"},\u00ed:{ha:580,x_min:115,x_max:617,o:"m 464 0 l 115 0 l 115 1118 l 464 1118 l 464 0 m 404 1258 l 169 1258 l 307 1576 l 617 1576 l 404 1258"},\u00ee:{ha:580,x_min:-148,x_max:727,o:"m 464 0 l 115 0 l 115 1118 l 464 1118 l 464 0 m 290 1430 l 147 1262 l -148 1262 l -148 1269 l 163 1576 l 416 1576 l 727 1269 l 727 1262 l 432 1262 l 290 1430"},\u00ef:{ha:580,x_min:-99,x_max:678,o:"m 464 0 l 115 0 l 115 1118 l 464 1118 l 464 0 m 516 1260 l 516 1260 q 401 1306 449 1260 q 353 1417 353 1352 l 353 1417 q 401 1528 353 1482 q 516 1574 449 1574 l 516 1574 q 631 1528 583 1574 q 678 1417 678 1482 l 678 1417 q 631 1306 678 1352 q 516 1260 583 1260 m 64 1260 l 64 1260 q -51 1306 -4 1260 q -99 1417 -99 1352 l -99 1417 q -51 1528 -99 1482 q 64 1574 -4 1574 l 64 1574 q 179 1528 131 1574 q 226 1417 226 1482 l 226 1417 q 179 1306 226 1352 q 64 1260 131 1260"},\u00f1:{ha:1301,x_min:115,x_max:1186,o:"m 464 638 l 464 638 l 464 0 l 115 0 l 115 1118 l 443 1118 l 449 876 q 564 1051 490 982 l 564 1051 q 799 1132 651 1132 l 799 1132 q 1003 1080 916 1132 q 1138 933 1090 1028 q 1186 712 1186 838 l 1186 712 l 1186 0 l 837 0 l 837 644 q 789 792 837 738 q 655 845 741 845 l 655 845 q 556 821 599 845 q 488 750 512 796 q 464 638 464 704 m 794 1270 l 794 1270 q 704 1287 742 1270 q 636 1325 665 1303 q 581 1364 606 1347 q 531 1381 556 1381 l 531 1381 q 480 1353 498 1381 q 460 1277 462 1325 l 460 1277 l 279 1277 q 346 1491 282 1418 q 507 1564 409 1564 l 507 1564 q 597 1548 559 1564 q 665 1509 635 1531 q 719 1471 694 1487 q 770 1454 744 1454 l 770 1454 q 825 1481 808 1454 q 843 1558 841 1508 l 843 1558 l 1021 1558 q 954 1345 1019 1419 q 794 1270 889 1270"},\u00f2:{ha:1268,x_min:72,x_max:1195,o:"m 634 -21 l 634 -21 q 333 52 459 -21 q 140 254 207 124 q 72 555 72 383 l 72 555 q 140 858 72 728 q 333 1060 207 987 q 634 1132 459 1132 l 634 1132 q 935 1060 809 1132 q 1128 858 1061 987 q 1195 555 1195 728 l 1195 555 q 1128 254 1195 383 q 935 52 1061 124 q 634 -21 809 -21 m 634 246 l 634 246 q 747 285 701 246 q 817 394 793 324 q 840 557 840 464 l 840 557 q 817 720 840 650 q 747 827 793 789 q 634 865 701 865 l 634 865 q 521 827 567 865 q 452 720 475 789 q 428 557 428 650 l 428 557 q 452 394 428 464 q 521 285 475 324 q 634 246 567 246 m 753 1258 l 517 1258 l 305 1576 l 615 1576 l 753 1258"},\u00f3:{ha:1268,x_min:72,x_max:1195,o:"m 634 -21 l 634 -21 q 333 52 459 -21 q 140 254 207 124 q 72 555 72 383 l 72 555 q 140 858 72 728 q 333 1060 207 987 q 634 1132 459 1132 l 634 1132 q 935 1060 809 1132 q 1128 858 1061 987 q 1195 555 1195 728 l 1195 555 q 1128 254 1195 383 q 935 52 1061 124 q 634 -21 809 -21 m 634 246 l 634 246 q 747 285 701 246 q 817 394 793 324 q 840 557 840 464 l 840 557 q 817 720 840 650 q 747 827 793 789 q 634 865 701 865 l 634 865 q 521 827 567 865 q 452 720 475 789 q 428 557 428 650 l 428 557 q 452 394 428 464 q 521 285 475 324 q 634 246 567 246 m 748 1258 l 513 1258 l 651 1576 l 961 1576 l 748 1258"},\u00f4:{ha:1268,x_min:72,x_max:1195,o:"m 634 -21 l 634 -21 q 333 52 459 -21 q 140 254 207 124 q 72 555 72 383 l 72 555 q 140 858 72 728 q 333 1060 207 987 q 634 1132 459 1132 l 634 1132 q 935 1060 809 1132 q 1128 858 1061 987 q 1195 555 1195 728 l 1195 555 q 1128 254 1195 383 q 935 52 1061 124 q 634 -21 809 -21 m 634 246 l 634 246 q 747 285 701 246 q 817 394 793 324 q 840 557 840 464 l 840 557 q 817 720 840 650 q 747 827 793 789 q 634 865 701 865 l 634 865 q 521 827 567 865 q 452 720 475 789 q 428 557 428 650 l 428 557 q 452 394 428 464 q 521 285 475 324 q 634 246 567 246 m 634 1430 l 491 1262 l 196 1262 l 196 1269 l 507 1576 l 760 1576 l 1071 1269 l 1071 1262 l 776 1262 l 634 1430"},\u00f5:{ha:1268,x_min:72,x_max:1195,o:"m 634 -21 l 634 -21 q 333 52 459 -21 q 140 254 207 124 q 72 555 72 383 l 72 555 q 140 858 72 728 q 333 1060 207 987 q 634 1132 459 1132 l 634 1132 q 935 1060 809 1132 q 1128 858 1061 987 q 1195 555 1195 728 l 1195 555 q 1128 254 1195 383 q 935 52 1061 124 q 634 -21 809 -21 m 634 246 l 634 246 q 747 285 701 246 q 817 394 793 324 q 840 557 840 464 l 840 557 q 817 720 840 650 q 747 827 793 789 q 634 865 701 865 l 634 865 q 521 827 567 865 q 452 720 475 789 q 428 557 428 650 l 428 557 q 452 394 428 464 q 521 285 475 324 q 634 246 567 246 m 777 1270 l 777 1270 q 687 1287 725 1270 q 619 1325 648 1303 q 564 1364 589 1347 q 514 1381 539 1381 l 514 1381 q 463 1353 481 1381 q 443 1277 445 1325 l 443 1277 l 262 1277 q 329 1491 265 1418 q 490 1564 392 1564 l 490 1564 q 580 1548 542 1564 q 648 1509 618 1531 q 702 1471 677 1487 q 753 1454 727 1454 l 753 1454 q 808 1481 791 1454 q 826 1558 824 1508 l 826 1558 l 1004 1558 q 937 1345 1002 1419 q 777 1270 872 1270"},\u00f6:{ha:1268,x_min:72,x_max:1195,o:"m 634 -21 l 634 -21 q 333 52 459 -21 q 140 254 207 124 q 72 555 72 383 l 72 555 q 140 858 72 728 q 333 1060 207 987 q 634 1132 459 1132 l 634 1132 q 935 1060 809 1132 q 1128 858 1061 987 q 1195 555 1195 728 l 1195 555 q 1128 254 1195 383 q 935 52 1061 124 q 634 -21 809 -21 m 634 246 l 634 246 q 747 285 701 246 q 817 394 793 324 q 840 557 840 464 l 840 557 q 817 720 840 650 q 747 827 793 789 q 634 865 701 865 l 634 865 q 521 827 567 865 q 452 720 475 789 q 428 557 428 650 l 428 557 q 452 394 428 464 q 521 285 475 324 q 634 246 567 246 m 860 1260 l 860 1260 q 745 1306 793 1260 q 697 1417 697 1352 l 697 1417 q 745 1528 697 1482 q 860 1574 793 1574 l 860 1574 q 975 1528 927 1574 q 1022 1417 1022 1482 l 1022 1417 q 975 1306 1022 1352 q 860 1260 927 1260 m 408 1260 l 408 1260 q 293 1306 340 1260 q 245 1417 245 1352 l 245 1417 q 293 1528 245 1482 q 408 1574 340 1574 l 408 1574 q 523 1528 475 1574 q 570 1417 570 1482 l 570 1417 q 523 1306 570 1352 q 408 1260 475 1260"},\u00f8:{ha:1268,x_min:72,x_max:1195,o:"m 634 -21 l 634 -21 q 333 52 459 -21 l 333 52 q 295 75 313 63 l 295 75 l 186 -47 l 81 47 l 192 172 q 140 254 163 209 l 140 254 q 72 555 72 383 l 72 555 q 140 858 72 728 q 333 1060 207 987 q 634 1132 459 1132 q 935 1060 809 1132 l 935 1060 q 968 1039 952 1050 l 968 1039 l 1081 1165 l 1186 1071 l 1072 944 q 1128 858 1104 904 l 1128 858 q 1195 555 1195 728 l 1195 555 q 1128 254 1195 383 q 935 52 1061 124 q 634 -21 809 -21 m 634 246 l 634 246 q 747 285 701 246 q 817 394 793 324 q 840 557 840 464 l 840 557 q 829 672 840 620 l 829 672 l 501 305 q 521 285 510 294 l 521 285 q 634 246 567 246 m 438 446 l 438 446 l 764 811 q 747 827 756 820 l 747 827 q 634 865 701 865 q 521 827 567 865 q 452 720 475 789 q 428 557 428 650 l 428 557 q 438 446 428 497"},\u00f9:{ha:1301,x_min:115,x_max:1186,o:"m 503 -14 l 503 -14 q 299 38 386 -14 q 163 185 211 90 q 115 406 115 280 l 115 406 l 115 1118 l 464 1118 l 464 474 q 513 327 464 380 q 646 273 561 273 l 646 273 q 747 298 704 273 q 813 369 789 322 q 837 480 837 415 l 837 480 l 837 1118 l 1186 1118 l 1186 0 l 858 0 l 853 242 q 737 67 811 135 l 737 67 q 503 -14 649 -14 m 771 1258 l 535 1258 l 323 1576 l 633 1576 l 771 1258"},\u00fa:{ha:1301,x_min:115,x_max:1186,o:"m 503 -14 l 503 -14 q 299 38 386 -14 q 163 185 211 90 q 115 406 115 280 l 115 406 l 115 1118 l 464 1118 l 464 474 q 513 327 464 380 q 646 273 561 273 l 646 273 q 747 298 704 273 q 813 369 789 322 q 837 480 837 415 l 837 480 l 837 1118 l 1186 1118 l 1186 0 l 858 0 l 853 242 q 737 67 811 135 l 737 67 q 503 -14 649 -14 m 766 1258 l 531 1258 l 669 1576 l 979 1576 l 766 1258"},\u00fb:{ha:1301,x_min:115,x_max:1186,o:"m 503 -14 l 503 -14 q 299 38 386 -14 q 163 185 211 90 q 115 406 115 280 l 115 406 l 115 1118 l 464 1118 l 464 474 q 513 327 464 380 q 646 273 561 273 l 646 273 q 747 298 704 273 q 813 369 789 322 q 837 480 837 415 l 837 480 l 837 1118 l 1186 1118 l 1186 0 l 858 0 l 853 242 q 737 67 811 135 l 737 67 q 503 -14 649 -14 m 652 1430 l 509 1262 l 214 1262 l 214 1269 l 525 1576 l 778 1576 l 1089 1269 l 1089 1262 l 794 1262 l 652 1430"},\u00fc:{ha:1301,x_min:115,x_max:1186,o:"m 503 -14 l 503 -14 q 299 38 386 -14 q 163 185 211 90 q 115 406 115 280 l 115 406 l 115 1118 l 464 1118 l 464 474 q 513 327 464 380 q 646 273 561 273 l 646 273 q 747 298 704 273 q 813 369 789 322 q 837 480 837 415 l 837 480 l 837 1118 l 1186 1118 l 1186 0 l 858 0 l 853 242 q 737 67 811 135 l 737 67 q 503 -14 649 -14 m 878 1260 l 878 1260 q 763 1306 811 1260 q 715 1417 715 1352 l 715 1417 q 763 1528 715 1482 q 878 1574 811 1574 l 878 1574 q 993 1528 945 1574 q 1040 1417 1040 1482 l 1040 1417 q 993 1306 1040 1352 q 878 1260 945 1260 m 426 1260 l 426 1260 q 311 1306 358 1260 q 263 1417 263 1352 l 263 1417 q 311 1528 263 1482 q 426 1574 358 1574 l 426 1574 q 541 1528 493 1574 q 588 1417 588 1482 l 588 1417 q 541 1306 588 1352 q 426 1260 493 1260"},\u00fd:{ha:1266,x_min:22,x_max:1244,o:"m 112 -392 l 112 -392 l 190 -137 l 234 -149 q 345 -158 297 -165 q 418 -123 392 -151 q 440 -49 443 -95 l 440 -49 l 439 -2 l 22 1118 l 390 1118 l 557 571 q 611 346 591 459 l 611 346 q 623 277 616 312 l 623 277 q 639 347 631 313 l 639 347 q 701 571 666 461 l 701 571 l 880 1118 l 1244 1118 l 775 -118 q 686 -277 741 -208 q 546 -386 631 -347 q 334 -426 460 -426 l 334 -426 q 211 -416 270 -426 q 112 -392 151 -407 m 751 1258 l 516 1258 l 654 1576 l 964 1576 l 751 1258"},\u00ff:{ha:1266,x_min:22,x_max:1244,o:"m 112 -392 l 112 -392 l 190 -137 l 234 -149 q 345 -158 297 -165 q 418 -123 392 -151 q 440 -49 443 -95 l 440 -49 l 439 -2 l 22 1118 l 390 1118 l 557 571 q 611 346 591 459 l 611 346 q 623 277 616 312 l 623 277 q 639 347 631 313 l 639 347 q 701 571 666 461 l 701 571 l 880 1118 l 1244 1118 l 775 -118 q 686 -277 741 -208 q 546 -386 631 -347 q 334 -426 460 -426 l 334 -426 q 211 -416 270 -426 q 112 -392 151 -407 m 862 1260 l 862 1260 q 747 1306 795 1260 q 699 1417 699 1352 l 699 1417 q 747 1528 699 1482 q 862 1574 795 1574 l 862 1574 q 977 1528 929 1574 q 1024 1417 1024 1482 l 1024 1417 q 977 1306 1024 1352 q 862 1260 929 1260 m 410 1260 l 410 1260 q 295 1306 342 1260 q 247 1417 247 1352 l 247 1417 q 295 1528 247 1482 q 410 1574 342 1574 l 410 1574 q 525 1528 477 1574 q 572 1417 572 1482 l 572 1417 q 525 1306 572 1352 q 410 1260 477 1260"},"\u2013":{ha:1024,x_min:0,x_max:1024,o:"m 0 738 l 1024 738 l 1024 469 l 0 469 l 0 738"},"\u2014":{ha:2048,x_min:0,x_max:2048,o:"m 0 738 l 2048 738 l 2048 469 l 0 469 l 0 738"},"\u2018":{ha:678,x_min:168,x_max:594,o:"m 506 848 l 168 848 l 363 1490 l 594 1490 l 506 848"},"\u2019":{ha:678,x_min:168,x_max:594,o:"m 398 848 l 168 848 l 256 1490 l 594 1490 l 398 848"},"\u201c":{ha:1189,x_min:168,x_max:1105,o:"m 506 848 l 168 848 l 363 1490 l 594 1490 l 506 848 m 1017 848 l 679 848 l 874 1490 l 1105 1490 l 1017 848"},"\u201d":{ha:1166,x_min:168,x_max:1082,o:"m 398 848 l 168 848 l 256 1490 l 594 1490 l 398 848 m 886 848 l 656 848 l 744 1490 l 1082 1490 l 886 848"},"\u2022":{ha:897,x_min:128,x_max:768,o:"m 448 274 l 448 274 q 287 317 360 274 q 171 433 214 360 q 128 594 128 506 l 128 594 q 171 756 128 683 q 287 871 214 828 q 448 914 360 914 l 448 914 q 610 871 537 914 q 725 756 682 828 q 768 594 768 683 l 768 594 q 725 433 768 506 q 610 317 682 360 q 448 274 537 274"},"\u2026":{ha:2167,x_min:172,x_max:1994,o:"m 361 -21 l 361 -21 q 227 33 281 -21 q 172 165 172 86 l 172 165 q 227 299 172 245 q 361 352 281 352 l 361 352 q 496 299 441 352 q 550 165 550 245 l 550 165 q 496 33 550 86 q 361 -21 441 -21 m 1083 -21 l 1083 -21 q 949 33 1003 -21 q 894 165 894 86 l 894 165 q 949 299 894 245 q 1083 352 1003 352 l 1083 352 q 1218 299 1163 352 q 1272 165 1272 245 l 1272 165 q 1218 33 1272 86 q 1083 -21 1163 -21 m 1805 -21 l 1805 -21 q 1671 33 1725 -21 q 1616 165 1616 86 l 1616 165 q 1671 299 1616 245 q 1805 352 1725 352 l 1805 352 q 1940 299 1885 352 q 1994 165 1994 245 l 1994 165 q 1940 33 1994 86 q 1805 -21 1885 -21"},"\u20ac":{ha:1417,x_min:61,x_max:1309,o:"m 635 980 l 1114 980 l 1042 818 l 609 818 q 607 742 607 782 l 607 742 q 609 672 607 705 l 609 672 l 971 672 l 890 504 l 636 504 q 644 480 639 492 l 644 480 q 748 336 680 380 q 910 291 816 291 l 910 291 q 1026 308 975 291 q 1114 348 1077 325 q 1173 384 1151 370 l 1173 384 l 1304 108 q 1124 12 1224 44 q 910 -20 1024 -20 l 910 -20 q 568 70 717 -20 q 335 330 419 159 l 335 330 q 274 504 295 409 l 274 504 l 61 504 l 122 672 l 252 672 q 250 742 250 706 l 250 742 q 252 818 250 781 l 252 818 l 61 818 l 122 980 l 274 980 q 335 1158 295 1077 l 335 1158 q 568 1420 419 1329 q 910 1510 717 1510 l 910 1510 q 1128 1477 1028 1510 q 1309 1381 1227 1444 l 1309 1381 l 1179 1104 q 1117 1140 1155 1118 q 1028 1180 1079 1162 q 910 1197 976 1197 l 910 1197 q 748 1151 816 1197 q 644 1005 680 1105 l 644 1005 q 635 980 639 993 l 635 980"},"\u00a3":{ha:1331,x_min:87,x_max:1255,o:"m 904 0 l 87 0 l 87 289 l 88 289 q 216 324 169 289 q 258 428 262 359 l 258 428 l 245 640 l 87 640 l 87 850 l 233 850 l 225 985 q 280 1272 214 1154 q 465 1451 345 1389 q 735 1513 584 1513 l 735 1513 q 974 1463 867 1513 q 1150 1321 1080 1413 q 1241 1101 1220 1229 l 1241 1101 l 916 1051 q 861 1181 903 1137 q 741 1224 818 1224 l 741 1224 q 635 1199 676 1224 q 575 1125 593 1174 q 558 1004 556 1076 l 558 1004 l 563 850 l 919 850 l 919 640 l 571 640 l 576 488 q 538 359 579 407 l 538 359 q 440 289 499 313 l 440 289 l 888 289 q 920 300 909 289 q 930 332 930 311 l 930 332 l 930 386 l 1255 386 l 1255 327 q 1165 85 1255 169 q 904 0 1075 0 l 904 0"},"\u00a5":{ha:1185,x_min:30,x_max:1157,o:"m 30 1490 l 387 1490 l 593 965 l 798 1490 l 1157 1490 l 835 776 l 1047 776 l 1047 582 l 761 582 l 761 488 l 1047 488 l 1047 294 l 761 294 l 761 0 l 414 0 l 414 294 l 98 294 l 98 488 l 414 488 l 414 582 l 98 582 l 98 776 l 349 776 l 30 1490"},"\u00a9":{ha:1872,x_min:168,x_max:1704,o:"m 538 744 l 538 744 q 592 948 538 856 q 739 1094 646 1039 q 942 1149 831 1149 l 942 1149 q 1124 1106 1041 1149 q 1261 988 1207 1062 q 1325 820 1314 914 l 1325 820 l 1098 820 q 1044 901 1088 869 q 942 932 999 932 l 942 932 q 849 907 891 932 q 780 840 806 882 q 754 745 754 797 l 754 745 q 780 652 754 694 q 849 584 806 609 q 942 558 891 558 l 942 558 q 1042 589 999 558 q 1095 669 1084 620 l 1095 669 l 1321 669 q 1258 502 1311 576 q 1123 384 1205 427 q 942 341 1041 341 l 942 341 q 739 396 831 341 q 592 542 646 450 q 538 744 538 633 m 936 -23 l 936 -23 q 638 37 777 -23 q 393 202 499 96 q 228 447 287 308 q 168 745 168 586 l 168 745 q 228 1043 168 904 q 393 1288 287 1182 q 638 1454 499 1394 q 936 1513 777 1513 l 936 1513 q 1234 1454 1095 1513 q 1479 1288 1373 1394 q 1645 1043 1585 1182 q 1704 745 1704 904 l 1704 745 q 1645 447 1704 586 q 1479 202 1585 308 q 1234 37 1373 96 q 936 -23 1095 -23 m 936 239 l 936 239 q 1133 279 1041 239 q 1294 388 1224 318 q 1403 549 1363 457 q 1442 745 1442 640 l 1442 745 q 1403 942 1442 850 q 1294 1103 1363 1033 q 1133 1212 1224 1172 q 936 1251 1041 1251 l 936 1251 q 740 1212 831 1251 q 579 1103 648 1172 q 470 942 509 1033 q 430 745 430 850 l 430 745 q 470 549 430 640 q 579 388 509 457 q 740 279 648 318 q 936 239 831 239"},"\u00ae":{ha:1353,x_min:95,x_max:1258,o:"m 676 346 l 676 346 q 451 392 556 346 q 266 517 345 437 q 141 703 186 597 q 95 928 95 808 q 141 1154 95 1048 q 266 1339 186 1259 q 451 1465 345 1419 q 676 1510 556 1510 l 676 1510 q 903 1465 797 1510 q 1088 1339 1008 1419 q 1213 1154 1168 1259 q 1258 928 1258 1048 q 1213 703 1258 808 q 1088 517 1168 597 q 903 392 1008 437 q 676 346 797 346 m 676 504 l 676 504 q 891 561 794 504 q 1044 715 987 618 q 1101 928 1101 811 q 1044 1141 1101 1045 q 890 1295 986 1237 q 676 1352 794 1352 l 676 1352 q 463 1295 559 1352 q 310 1141 367 1237 q 252 928 252 1045 q 310 715 252 811 q 464 562 367 619 q 676 504 560 504 m 932 665 l 771 665 l 691 845 l 610 845 l 610 665 l 464 665 l 464 1201 l 724 1201 q 824 1180 780 1201 q 892 1119 867 1158 q 916 1023 916 1079 l 916 1023 q 891 927 916 966 l 891 927 q 831 872 868 892 l 831 872 l 932 665 m 610 1095 l 610 938 l 691 938 q 744 958 723 938 q 764 1018 764 978 q 744 1077 764 1058 q 691 1095 723 1095 l 691 1095 l 610 1095"},"\u2122":{ha:1335,x_min:82,x_max:1241,o:"m 986 954 l 903 954 l 794 1236 l 794 954 l 648 954 l 648 1490 l 822 1490 l 944 1147 l 1067 1490 l 1241 1490 l 1241 954 l 1095 954 l 1095 1238 l 986 954 m 392 954 l 244 954 l 244 1370 l 82 1370 l 82 1490 l 554 1490 l 554 1370 l 392 1370 l 392 954"},"\u00b0":{ha:944,x_min:109,x_max:836,o:"m 473 772 l 473 772 q 290 821 372 772 q 158 953 207 870 q 109 1135 109 1035 l 109 1135 q 158 1319 109 1236 q 290 1450 207 1401 q 473 1499 372 1499 l 473 1499 q 656 1450 573 1499 q 787 1319 738 1401 q 836 1135 836 1236 l 836 1135 q 787 953 836 1035 q 656 821 738 870 q 473 772 573 772 m 473 995 l 473 995 q 543 1015 511 996 q 594 1065 575 1033 q 613 1135 613 1097 l 613 1135 q 594 1206 613 1174 q 543 1256 575 1237 q 473 1274 511 1274 l 473 1274 q 403 1256 434 1274 q 352 1206 371 1237 q 333 1135 333 1174 l 333 1135 q 352 1066 333 1097 q 403 1015 371 1034 q 473 995 434 996"},"\u00d7":{ha:1404,x_min:155,x_max:1251,o:"m 1251 264 l 1038 51 l 703 385 l 369 51 l 155 264 l 489 598 l 155 931 l 369 1148 l 703 813 l 1038 1148 l 1251 931 l 918 598 l 1251 264"},"\u00f7":{ha:1404,x_min:181,x_max:1224,o:"m 181 735 l 1224 735 l 1224 465 l 181 465 l 181 735 m 702 -1 l 702 -1 q 569 55 624 0 q 514 189 514 110 l 514 189 q 569 320 514 265 q 702 374 624 374 l 702 374 q 834 320 779 374 q 889 189 889 265 l 889 189 q 834 55 889 110 q 702 -1 779 0 m 702 825 l 702 825 q 569 881 624 825 q 514 1014 514 936 l 514 1014 q 569 1146 514 1091 q 702 1201 624 1201 l 702 1201 q 835 1146 780 1201 q 889 1014 889 1091 l 889 1014 q 835 881 889 936 q 702 825 780 825"}},familyName:"Inter",ascender:1984,descender:-494,underlinePosition:-313,underlineThickness:210,boundingBox:{yMin:-480,xMin:-400,yMax:2282,xMax:5290},resolution:2048,original_font_information:{license:"SIL Open Font License 1.1",copyright:"Copyright 2016 The Inter Project Authors (https://github.com/rsms/inter)",fontFamily:"Inter",fontSubfamily:"ExtraBold"}},Jt=Math.PI/180,Bl=22,Zn=A0;let xa=null;const R0=()=>xa!=null?xa:xa=new Bp().parse(w0);function os(s,e="#2ad38b"){var r,a;const t=new We((s==null?void 0:s.color)||e),n=(r=s==null?void 0:s.finish)!=null?r:"glossy",i={matte:{roughness:.9,metalness:0},satin:{roughness:.5,metalness:0},glossy:{roughness:.2,metalness:0,clearcoat:1,clearcoatRoughness:.08},metal:{roughness:.32,metalness:1},chrome:{roughness:.04,metalness:1}};return new Xt({color:t,...(a=i[n])!=null?a:i.glossy})}async function C0(s){const e=s.trim();if(e.startsWith("<"))return e;if(e.startsWith("data:")){const n=e.indexOf(","),i=e.slice(0,n),r=e.slice(n+1);return i.includes(";base64")?atob(r):decodeURIComponent(r)}const t=await fetch(e);if(!t.ok)throw new Error(`Could not load the SVG (${t.status}).`);return t.text()}function kl(s,e,t){const n=new Os,i=-s/2,r=-e/2;return t=Math.max(0,Math.min(t,s/2,e/2)),n.moveTo(i+t,r),n.lineTo(i+s-t,r),n.absarc(i+s-t,r+t,t,-Math.PI/2,0,!1),n.lineTo(i+s,r+e-t),n.absarc(i+s-t,r+e-t,t,0,Math.PI/2,!1),n.lineTo(i+t,r+e),n.absarc(i+t,r+e-t,t,Math.PI/2,Math.PI,!1),n.lineTo(i,r+t),n.absarc(i+t,r+t,t,Math.PI,Math.PI*1.5,!1),n}function wi(s,e,t){const n=new Wr(kl(s,e,t),24),i=n.getAttribute("position"),r=n.getAttribute("uv");for(let a=0;a<i.count;a++)r.setXY(a,(i.getX(a)+s/2)/s,(i.getY(a)+e/2)/e);return r.needsUpdate=!0,n}function Ri(s,e,t,n,i=Math.min(.02,t*.3)){const r=new Ji(kl(s-2*i,e-2*i,Math.max(.001,n-i)),{depth:Math.max(.001,t-2*i),bevelEnabled:!0,bevelThickness:i,bevelSize:i,bevelSegments:4,curveSegments:24});return r.translate(0,0,-Math.max(.001,t-2*i)/2),r.computeVertexNormals(),r}const q0=/^data:video\/|\.(mp4|webm|mov|m4v|ogv)([?#]|$)/i,P0=/^data:image\/|\.(png|jpe?g|webp|gif|avif|svg)([?#]|$)/i;function va(s,e,t,n,i,r,a,o=0){var M,A;const l=e.model,c=((M=l.screen)!=null?M:"").trim();if(!c||c.startsWith("local:"))return null;const h=(A=l.fit)!=null?A:"cover";let u=null,d=null,f=null,g=!1;const v=(_,b,T)=>{if(g){_.dispose();return}d=_,_.colorSpace=St,_.anisotropy=a.aniso;const R=b>0&&T>0?b/T:t/n,x=t/n;let w;if(h==="contain"){const I=R>x?t:n*R,O=R>x?t/R:n;w=wi(I,O,Math.min(i,Math.min(I,O)*.1))}else w=wi(t,n,i),R>x?(_.repeat.set(x/R,1),_.offset.set((1-x/R)/2,0)):(_.repeat.set(1,R/x),_.offset.set(0,(1-R/x)/2));f=new tt(w,new Wt({map:_,toneMapped:!1})),f.position.set(0,o,r),s.add(f),_.needsUpdate=!0,a.redraw()},m=()=>{const _=document.createElement("video");u=_,_.crossOrigin="anonymous",_.muted=!0,_.playsInline=!0,_.preload="auto",_.setAttribute("aria-hidden","true"),Object.assign(_.style,{position:"absolute",left:"0",top:"0",width:"2px",height:"2px",opacity:"0",pointerEvents:"none"}),a.host.appendChild(_);const b=new Jc(_);b.generateMipmaps=!1;const T=()=>{b.needsUpdate=!0,a.redraw()};_.addEventListener("loadeddata",()=>{f?T():v(b,_.videoWidth,_.videoHeight)},{once:!0}),_.addEventListener("seeked",T),_.addEventListener("error",()=>console.warn('[Unyson+ scene] 3D device "'+e.id+'": the screen video could not be loaded.')),_.src=c},p=_=>{const b=new Go;b.setCrossOrigin("anonymous"),b.load(c,T=>{var x,w,I,O;const R=T.image;v(T,(w=(x=R.naturalWidth)!=null?x:R.width)!=null?w:0,(O=(I=R.naturalHeight)!=null?I:R.height)!=null?O:0)},void 0,()=>{_?m():console.warn('[Unyson+ scene] 3D device "'+e.id+'": the screen picture could not be loaded.')})};return q0.test(c)?m():p(!P0.test(c)),{sync(_,b){var I,O,B,J;const T=u;if(!T||g)return;const R=(I=l.rate)!=null?I:1,x=Number.isFinite(T.duration)&&T.duration>0?T.duration:0;let w=((O=l.offset)!=null?O:0)+Math.max(0,_)*R;x&&(w=(B=l.loop)==null||B?w%x:Math.min(w,Math.max(0,x-.04))),b&&_>=0&&(x===0||((J=l.loop)==null||J)||w<x-.05)?(T.playbackRate!==R&&(T.playbackRate=R),Math.abs(T.currentTime-w)>.25&&(T.currentTime=w),T.paused&&T.play().catch(()=>{}),d&&(d.needsUpdate=!0)):(T.paused||T.pause(),Math.abs(T.currentTime-w)>.004&&(T.currentTime=w))},dispose(){g=!0,d==null||d.dispose(),u&&(u.pause(),u.removeAttribute("src"),u.load(),u.remove())}}}function I0(){const s=document.createElement("canvas");s.width=1024,s.height=700;const e=s.getContext("2d"),t=(a,o,l,c,h)=>{e.beginPath(),e.roundRect(a,o,l,c,h),e.fill()};e.fillStyle="rgba(12,13,16,0.92)",t(70,40,884,360,18),e.fillStyle="#2a2d33",[14,14,13,12,11].forEach((a,o)=>{const l=(860-(a-1)*8)/a;for(let c=0;c<a;c++)t(82+c*(l+8),52+o*58,l,50,7)});const i=52+5*58;[70,70,90].forEach((a,o)=>t(82+o*78,i,a,50,7)),t(330,i,360,50,7),[70,70,90].forEach((a,o)=>t(702+o*78,i,a,50,7)),e.fillStyle="rgba(0,0,0,0.18)",t(342,436,340,220,22);const r=new _o(s);return r.colorSpace=St,r}const L0={phone:"#2b2d32",tablet:"#2b2d32",laptop:"#b9bdc4",monitor:"#26282d"};function N0(s,e){var l,c,h;const t=s.model,n=(l=t.device)!=null?l:"phone",i=os({finish:"metal",...s.material,color:((c=s.material)==null?void 0:c.color)||L0[n]}),r=new Xt({color:329223,roughness:.12,metalness:0,clearcoat:1,clearcoatRoughness:.05}),a=new qt,o={screen:null,textures:[]};if(n==="phone"||n==="tablet"){const u=n==="phone",d=u?.75:1.5,f=u?1.56:2.04,g=u?.085:.065,v=u?.12:.1,m=u?.028:.07,p=d-2*m,M=f-2*m,A=Math.max(.01,v-m*.9),_=new qt;_.add(new tt(Ri(d,f,g,v),i));const b=new tt(wi(d-.012,f-.012,v-.006),r);if(b.position.z=g/2+8e-4,_.add(b),u){const x=new tt(wi(.17,.05,.025),new Wt({color:0}));x.position.set(0,M/2-.05,g/2+.0035),_.add(x);const w=new tt(Ri(.3,.3,.02,.07,.006),i);w.position.set(-d/2+.2,f/2-.2,-g/2-.008),_.add(w);for(const[I,O]of[[-.065,.065],[.065,.065],[-.065,-.065]]){const B=new tt(new Us(.048,.048,.02,40),r);B.rotation.x=Math.PI/2,B.position.set(-d/2+.2+I,f/2-.2+O,-g/2-.02),_.add(B)}for(const[I,O,B]of[[d/2,.38,.17],[-d/2,.4,.1],[-d/2,.26,.1]]){const J=new tt(new ss(.014,B,.032,2,.006),i);J.position.set(I+Math.sign(I)*.004,O,0),_.add(J)}}else{const x=new tt(new Nr(.012,24),new Wt({color:1382170}));x.position.set(0,f/2-m/2,g/2+.0015),_.add(x)}t.landscape&&(_.rotation.z=Math.PI/2),a.add(_);const[T,R]=t.landscape?[M,p]:[p,M];o.screen=va(a,s,T,R,A,g/2+.002,e)}else if(n==="monitor"){const p=new qt;p.add(new tt(Ri(2.4,1.449375,.06,.035),i));const M=new tt(wi(2.4-.01,1.449375-.01,.03),r);M.position.z=.06/2+8e-4,p.add(M),p.position.y=.55,o.screen=va(p,s,2.31,1.299375,.008,.06/2+.002,e,.03),a.add(p);const A=new tt(new ss(.22,.62,.05,4,.02),i);A.position.set(0,.55-1.449375/2-.2,-.06/2-.03),a.add(A);const _=new tt(Ri(.85,.5,.035,.12),i);_.rotation.x=-Math.PI/2,_.position.set(0,.55-1.449375/2-.5,.05),a.add(_)}else{const p=new tt(Ri(2.2,1.5,.055,.07),i);p.rotation.x=-Math.PI/2,a.add(p);const M=I0();o.textures.push(M);const A=new tt(new Zi(2.2*.9,1.5*.88),new mi({map:M,transparent:!0,roughness:.6}));A.rotation.x=-Math.PI/2,A.position.set(0,.055/2+.0012,.02),a.add(A);const _=new qt;_.position.set(0,.055/2,-1.5/2+.03);const b=new qt;b.add(new tt(Ri(2.2,1.42,.03,.07),i));const T=new tt(wi(2.2-.01,1.42-.01,.065),r);T.position.z=.03/2+8e-4,b.add(T);const R=2.2-2*.06,x=R*10/16;o.screen=va(b,s,R,x,.01,.03/2+.002,e,.025),b.position.set(0,1.42/2+.01,-.03/2),_.add(b),a.add(_);const w=Math.max(0,Math.min(135,(h=t.open)!=null?h:105));o.lid={pivot:_,angle:w},_.rotation.x=(90-w)*Jt,a.rotation.x=14*Jt}return{obj:a,parts:o}}async function D0(s,e){var d,f,g,v,m,p,M,A,_,b,T,R;const t=s.model,n=(d=t.depth)!=null?d:.3,i=(f=t.bevel)!=null?f:.4;let r,a;if(t.kind==="device"){const x=N0(s,e);r=x.obj,a=x.parts}else if(t.kind==="text"){const x=new ua(t.text||" ",{font:R0(),size:1,depth:n,curveSegments:10,bevelEnabled:i>0,bevelThickness:n*i*.4,bevelSize:.012+i*.035,bevelSegments:5});x.computeVertexNormals(),r=new tt(x,os(s.material))}else if(t.kind==="shape"){const x={box:()=>new ss(1,1,1,6,.1),sphere:()=>new Xr(.6,96,48),torus:()=>new Yr(.5,.2,64,160),knot:()=>new Kr(.45,.15,300,40),cylinder:()=>new Us(.5,.5,1,96),crystal:()=>new Hr(.6,0)},w=os(s.material);t.shape==="crystal"&&(w.flatShading=!0),r=new tt(((v=x[(g=t.shape)!=null?g:"box"])!=null?v:x.box)(),w)}else if(t.kind==="svg"){const x=new da().parse(await C0((m=t.src)!=null?m:"")),w=new qt,I=new ta;x.paths.forEach(B=>B.toShapes().forEach(J=>J.getPoints().forEach(G=>I.expandByPoint(G))));const O=Math.max(1e-6,I.max.y-I.min.y);for(const B of x.paths){const J=(M=(p=B.userData)==null?void 0:p.style)==null?void 0:M.fill;if(J==="none")continue;const G=os((A=s.material)!=null&&A.color?s.material:{...s.material,color:J&&J!=="currentColor"?J:void 0});for(const Z of B.toShapes()){const re=new Ji(Z,{depth:n*O,curveSegments:12,bevelEnabled:i>0,bevelThickness:n*O*i*.3,bevelSize:O*(.004+i*.012),bevelSegments:4});w.add(new tt(re,G))}}w.scale.y=-1,r=w}else{const x=await new Wp().loadAsync((_=t.src)!=null?_:"");if(r=x.scene,r.userData.clips=(b=x.animations)!=null?b:[],((T=s.material)==null?void 0:T.original)===!1){const w=os(s.material);r.traverse(I=>{I.isMesh&&(I.material=w)})}}const o=new qt;o.add(r);const l=new nn().setFromObject(o),c=l.getSize(new U),h=l.getCenter(new U);r.position.sub(h);const u=1/Math.max(c.x,c.y,c.z,1e-6);return o.scale.setScalar(u),o.userData.clips=(R=r.userData.clips)!=null?R:[],o.userData.device=a,o}function F0(s,e){var B,J,G,Z,re,$;const t=new Op({alpha:!0,antialias:!0,powerPreference:"high-performance"});t.setPixelRatio(Math.min(2,window.devicePixelRatio||1)),t.outputColorSpace=St,t.toneMapping=7;const n=t.domElement;Object.assign(n.style,{position:"absolute",left:`${-Zn*100}%`,top:`${-Zn*100}%`,width:`${(1+2*Zn)*100}%`,height:`${(1+2*Zn)*100}%`,display:"block",pointerEvents:"none"}),n.setAttribute("aria-hidden","true"),s.appendChild(n);const i=new Wa,r=new aa(t),a=r.fromScene(new E0,.04).texture;i.environment=a;const o=(B=e.light)!=null?B:1;i.environmentIntensity=o;const l=new Ko(16777215,1.6*o);l.position.set(2,3,4),i.add(l,new jh(16777215,2241348,.35*o));const c=new Ft(Bl,1,.01,100),h=new qt,u=new qt;h.add(u),i.add(h);const d=(J=e.pose)!=null?J:{};u.rotation.set(((G=d.rx)!=null?G:0)*Jt,((Z=d.ry)!=null?Z:0)*Jt,((re=d.rz)!=null?re:0)*Jt,"YXZ"),u.scale.setScalar(($=d.scale)!=null?$:1);let f=null,g,v=null,m=0,p=-1,M=!1,A=0,_=0,b=new U(.5,.5,.5);function T(z){const Q=Bl/2*Jt,ie=Math.atan(Math.tan(Q)*z),oe=1+2*Zn;return Math.max(b.y*oe/Math.tan(Q),b.x*oe/Math.tan(ie))*1.25+b.z}function R(){const z=Math.round(s.clientWidth*(1+2*Zn)),Q=Math.round(s.clientHeight*(1+2*Zn));!z||!Q||z===A&&Q===_||(A=z,_=Q,t.setSize(A,_,!1),c.aspect=A/_,c.updateProjectionMatrix())}function x(z){var Se;if(M||(R(),!A||!_))return;h.rotation.set(z.rx*Jt,z.ry*Jt,z.rz*Jt,"YXZ"),h.scale.setScalar(Math.max(1e-4,z.s)),h.position.set(z.px,z.py,0),g!=null&&g.lid&&(g.lid.pivot.rotation.x=(90-g.lid.angle*Math.max(0,Math.min(1,(Se=z.open)!=null?Se:1)))*Jt);const Q=T(c.aspect)*Math.max(.05,z.dolly),ie=z.orbit*Jt,oe=z.tilt*Jt;c.position.set(Math.sin(ie)*Math.cos(oe)*Q,Math.sin(oe)*Q,Math.cos(ie)*Math.cos(oe)*Q),c.lookAt(0,0,0),t.render(i,c)}const w=new ResizeObserver(()=>{f&&x(f)});w.observe(s);const I={host:s,redraw:()=>{f&&!M&&x(f)},aniso:t.capabilities.getMaxAnisotropy()};return{ready:D0(e,I).then(z=>{var be,Ye,He,Je;if(M){(Ye=(be=z.userData.device)==null?void 0:be.screen)==null||Ye.dispose();return}g=z.userData.device;const Q=new qt;Q.rotation.copy(u.rotation),Q.scale.copy(u.scale),Q.add(z),Q.updateMatrixWorld(!0),new nn().setFromObject(Q).getSize(b).multiplyScalar(.5),u.add(z);const ie=(He=z.userData.clips)!=null?He:[],oe=(Je=e.animation)==null?void 0:Je.clip,Se=oe&&oe!=="all"?ie.filter(D=>D.name===oe):ie;if(Se.length){v=new vu(z);for(const D of Se)v.clipAction(D).play();m=Math.max(...Se.map(D=>D.duration)),v.setTime(0)}f&&x(f)}).catch(z=>{console.warn('[Unyson+ scene] 3D layer "'+e.id+'" could not be built:',z)}),animationLength:()=>m,time(z,Q){var be,Ye,He,Je,D;if(M)return;if((be=g==null?void 0:g.screen)==null||be.sync(z,!!Q),!v){g!=null&&g.screen&&Q&&f&&x(f);return}const ie=(He=(Ye=e.animation)==null?void 0:Ye.loop)!=null?He:!0,oe=Math.max(0,z)*((D=(Je=e.animation)==null?void 0:Je.speed)!=null?D:1),Se=m>0?ie?oe%m:Math.min(oe,m-1e-4):0;Math.abs(Se-p)<1e-6||(p=Se,v.setTime(Se),f&&x(f))},render(z){f={...z},x(f)},dispose(){var z;M=!0,w.disconnect(),(z=g==null?void 0:g.screen)==null||z.dispose(),g==null||g.textures.forEach(Q=>Q.dispose()),i.traverse(Q=>{const ie=Q;ie.isMesh&&(ie.geometry.dispose(),(Array.isArray(ie.material)?ie.material:[ie.material]).forEach(Se=>Se.dispose()))}),a.dispose(),r.dispose(),t.dispose(),t.forceContextLoss(),n.remove()}}}const U0={create:F0};window.UnysonPlusScene3D=U0})();
