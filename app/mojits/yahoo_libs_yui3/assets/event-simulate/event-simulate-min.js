YUI.add("event-simulate",function(a){(function(){var m=a.Lang,g=m.isFunction,d=m.isString,h=m.isBoolean,q=m.isObject,p=m.isNumber,r={click:1,dblclick:1,mouseover:1,mouseout:1,mousedown:1,mouseup:1,mousemove:1,contextmenu:1},n={keydown:1,keyup:1,keypress:1},c={submit:1,blur:1,change:1,focus:1,resize:1,scroll:1,select:1},f={scroll:1,resize:1,reset:1,submit:1,change:1,select:1,error:1,abort:1},j={touchstart:1,touchmove:1,touchend:1,touchcancel:1},i={gesturestart:1,gesturechange:1,gestureend:1};a.mix(f,r);a.mix(f,n);a.mix(f,j);function l(x,B,w,u,D,t,s,C,z,F,E){if(!x){a.error("simulateKeyEvent(): Invalid target.");}if(d(B)){B=B.toLowerCase();switch(B){case"textevent":B="keypress";break;case"keyup":case"keydown":case"keypress":break;default:a.error("simulateKeyEvent(): Event type '"+B+"' not supported.");}}else{a.error("simulateKeyEvent(): Event type must be a string.");}if(!h(w)){w=true;}if(!h(u)){u=true;}if(!q(D)){D=a.config.win;}if(!h(t)){t=false;}if(!h(s)){s=false;}if(!h(C)){C=false;}if(!h(z)){z=false;}if(!p(F)){F=0;}if(!p(E)){E=0;}var A=null;if(g(a.config.doc.createEvent)){try{A=a.config.doc.createEvent("KeyEvents");A.initKeyEvent(B,w,u,D,t,s,C,z,F,E);}catch(y){try{A=a.config.doc.createEvent("Events");}catch(v){A=a.config.doc.createEvent("UIEvents");}finally{A.initEvent(B,w,u);A.view=D;A.altKey=s;A.ctrlKey=t;A.shiftKey=C;A.metaKey=z;A.keyCode=F;A.charCode=E;}}x.dispatchEvent(A);}else{if(q(a.config.doc.createEventObject)){A=a.config.doc.createEventObject();A.bubbles=w;A.cancelable=u;A.view=D;A.ctrlKey=t;A.altKey=s;A.shiftKey=C;A.metaKey=z;A.keyCode=(E>0)?E:F;x.fireEvent("on"+B,A);}else{a.error("simulateKeyEvent(): No event simulation framework present.");}}}function b(C,H,z,w,I,B,y,x,v,t,u,s,G,E,A,D){if(!C){a.error("simulateMouseEvent(): Invalid target.");}if(d(H)){H=H.toLowerCase();if(!r[H]){a.error("simulateMouseEvent(): Event type '"+H+"' not supported.");}}else{a.error("simulateMouseEvent(): Event type must be a string.");}if(!h(z)){z=true;}if(!h(w)){w=(H!="mousemove");}if(!q(I)){I=a.config.win;}if(!p(B)){B=1;}if(!p(y)){y=0;}if(!p(x)){x=0;}if(!p(v)){v=0;}if(!p(t)){t=0;}if(!h(u)){u=false;}if(!h(s)){s=false;}if(!h(G)){G=false;}if(!h(E)){E=false;}if(!p(A)){A=0;}D=D||null;var F=null;if(g(a.config.doc.createEvent)){F=a.config.doc.createEvent("MouseEvents");if(F.initMouseEvent){F.initMouseEvent(H,z,w,I,B,y,x,v,t,u,s,G,E,A,D);}else{F=a.config.doc.createEvent("UIEvents");F.initEvent(H,z,w);F.view=I;F.detail=B;F.screenX=y;F.screenY=x;F.clientX=v;F.clientY=t;F.ctrlKey=u;F.altKey=s;F.metaKey=E;F.shiftKey=G;F.button=A;F.relatedTarget=D;}if(D&&!F.relatedTarget){if(H=="mouseout"){F.toElement=D;}else{if(H=="mouseover"){F.fromElement=D;}}}C.dispatchEvent(F);}else{if(q(a.config.doc.createEventObject)){F=a.config.doc.createEventObject();F.bubbles=z;F.cancelable=w;F.view=I;F.detail=B;F.screenX=y;F.screenY=x;F.clientX=v;F.clientY=t;F.ctrlKey=u;F.altKey=s;F.metaKey=E;F.shiftKey=G;switch(A){case 0:F.button=1;break;case 1:F.button=4;break;case 2:break;default:F.button=0;}F.relatedTarget=D;C.fireEvent("on"+H,F);}else{a.error("simulateMouseEvent(): No event simulation framework present.");}}}function k(y,x,u,t,s,w){if(!y){a.error("simulateUIEvent(): Invalid target.");}if(d(x)){x=x.toLowerCase();if(!c[x]){a.error("simulateUIEvent(): Event type '"+x+"' not supported.");}}else{a.error("simulateUIEvent(): Event type must be a string.");}var v=null;if(!h(u)){u=(x in f);}if(!h(t)){t=(x=="submit");}if(!q(s)){s=a.config.win;}if(!p(w)){w=1;}if(g(a.config.doc.createEvent)){v=a.config.doc.createEvent("UIEvents");v.initUIEvent(x,u,t,s,w);y.dispatchEvent(v);}else{if(q(a.config.doc.createEventObject)){v=a.config.doc.createEventObject();v.bubbles=u;v.cancelable=t;v.view=s;v.detail=w;y.fireEvent("on"+x,v);}else{a.error("simulateUIEvent(): No event simulation framework present.");}}}function e(C,G,A,w,H,B,y,x,v,t,u,s,F,D,z,I){var E;if(!a.UA.ios||a.UA.ios<2){a.error("simulateGestureEvent(): Native gesture DOM eventframe is not available in this platform.");}if(!C){a.error("simulateGestureEvent(): Invalid target.");}if(a.Lang.isString(G)){G=G.toLowerCase();if(!i[G]){a.error("simulateTouchEvent(): Event type '"+G+"' not supported.");}}else{a.error("simulateGestureEvent(): Event type must be a string.");}if(!a.Lang.isBoolean(A)){A=true;}if(!a.Lang.isBoolean(w)){w=true;}if(!a.Lang.isObject(H)){H=a.config.win;}if(!a.Lang.isNumber(B)){B=2;}if(!a.Lang.isNumber(y)){y=0;}if(!a.Lang.isNumber(x)){x=0;}if(!a.Lang.isNumber(v)){v=0;}if(!a.Lang.isNumber(t)){t=0;}if(!a.Lang.isBoolean(u)){u=false;}if(!a.Lang.isBoolean(s)){s=false;}if(!a.Lang.isBoolean(F)){F=false;}if(!a.Lang.isBoolean(D)){D=false;}if(!a.Lang.isNumber(z)){z=1;}if(!a.Lang.isNumber(I)){I=0;}E=a.config.doc.createEvent("GestureEvent");E.initGestureEvent(G,A,w,H,B,y,x,v,t,u,s,F,D,C,z,I);C.dispatchEvent(E);}function o(J,x,y,K,A,H,s,L,E,D,u,t,C,v,B,G,w,I,F){var z;if(!J){a.error("simulateTouchEvent(): Invalid target.");}if(a.Lang.isString(x)){x=x.toLowerCase();if(!j[x]){a.error("simulateTouchEvent(): Event type '"+x+"' not supported.");}}else{a.error("simulateTouchEvent(): Event type must be a string.");}if(x==="touchstart"||x==="touchmove"){if(B.length===0){a.error("simulateTouchEvent(): No touch object in touches");}}else{if(x==="touchend"){if(w.length===0){a.error("simulateTouchEvent(): No touch object in changedTouches");}}}if(!a.Lang.isBoolean(y)){y=true;}if(!a.Lang.isBoolean(K)){K=(x!="touchcancel");}if(!a.Lang.isObject(A)){A=a.config.win;}if(!a.Lang.isNumber(H)){H=1;}if(!a.Lang.isNumber(s)){s=0;}if(!a.Lang.isNumber(L)){L=0;}if(!a.Lang.isNumber(E)){E=0;}if(!a.Lang.isNumber(D)){D=0;}if(!a.Lang.isBoolean(u)){u=false;}if(!a.Lang.isBoolean(t)){t=false;}if(!a.Lang.isBoolean(C)){C=false;}if(!a.Lang.isBoolean(v)){v=false;}if(!a.Lang.isNumber(I)){I=1;}if(!a.Lang.isNumber(F)){F=0;}if(a.Lang.isFunction(a.config.doc.createEvent)){if(a.UA.android){if(a.UA.android<4){z=a.config.doc.createEvent("MouseEvents");z.initMouseEvent(x,y,K,A,H,s,L,E,D,u,t,C,v,0,J);z.touches=B;z.targetTouches=G;z.changedTouches=w;
}else{z=a.config.doc.createEvent("TouchEvent");z.initTouchEvent(B,G,w,x,A,s,L,E,D,u,t,C,v);}}else{if(a.UA.ios){if(a.UA.ios>=2){z=a.config.doc.createEvent("TouchEvent");z.initTouchEvent(x,y,K,A,H,s,L,E,D,u,t,C,v,B,G,w,I,F);}else{a.error("simulateTouchEvent(): No touch event simulation framework present for iOS, "+a.UA.ios+".");}}else{a.error("simulateTouchEvent(): Not supported agent yet, "+a.UA.userAgent);}}J.dispatchEvent(z);}else{a.error("simulateTouchEvent(): No event simulation framework present.");}}a.Event.simulate=function(u,t,s){s=s||{};if(r[t]){b(u,t,s.bubbles,s.cancelable,s.view,s.detail,s.screenX,s.screenY,s.clientX,s.clientY,s.ctrlKey,s.altKey,s.shiftKey,s.metaKey,s.button,s.relatedTarget);}else{if(n[t]){l(u,t,s.bubbles,s.cancelable,s.view,s.ctrlKey,s.altKey,s.shiftKey,s.metaKey,s.keyCode,s.charCode);}else{if(c[t]){k(u,t,s.bubbles,s.cancelable,s.view,s.detail);}else{if(j[t]){if((a.config.win&&("ontouchstart" in a.config.win))&&!(a.UA.chrome&&a.UA.chrome<6)){o(u,t,s.bubbles,s.cancelable,s.view,s.detail,s.screenX,s.screenY,s.clientX,s.clientY,s.ctrlKey,s.altKey,s.shiftKey,s.metaKey,s.touches,s.targetTouches,s.changedTouches,s.scale,s.rotation);}else{a.error("simulate(): Event '"+t+"' can't be simulated. Use gesture-simulate module instead.");}}else{if(a.UA.ios&&a.UA.ios>=2&&i[t]){e(u,t,s.bubbles,s.cancelable,s.view,s.detail,s.screenX,s.screenY,s.clientX,s.clientY,s.ctrlKey,s.altKey,s.shiftKey,s.metaKey,s.scale,s.rotation);}else{a.error("simulate(): Event '"+t+"' can't be simulated.");}}}}}};})();},"@VERSION@",{requires:["event-base"]});
