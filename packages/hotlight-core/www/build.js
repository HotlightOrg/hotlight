var D=Object.defineProperty;var W=e=>D(e,"__esModule",{value:!0});var z=(e,t)=>{W(e);for(var n in t)D(e,n,{get:t[n],enumerable:!0})};var R=typeof window!="undefined"?window:void 0,b=e=>{R&&R.HOTLIGHT_DEBUG&&console.log(e)};var _=(e,t)=>{let n=e.toLowerCase().split(""),i=t.toLowerCase().split(""),o=0,s=n.reduce((a,l)=>{let h=i.findIndex((g,u)=>{if(g===l&&u>=o)return o=u,!0});return h>-1?{...a,[h]:!0}:a},{});return t.split("").map((a,l)=>s[l]?`<span class="u">${a}</span>`:a).join("")};var E=e=>{if(e[0]==="/")return!0;try{if(new URL(e,location.href))return!0}catch(t){return console.warn("URL not valid.",t),!1}return!1};var A=class extends HTMLElement{constructor(){super();this.component=this.attachShadow({mode:"open"}),this.component.appendChild(B.content.cloneNode(!0)),this.parentsContainer=this.component.getElementById("parents-container"),this.input=this.component.getElementById("input")}renderParents(){this.lastParentCount<this._parents.length&&this.parentsContainer.classList.remove("show"),this.lastParentCount=this._parents.length;let t=document.createDocumentFragment();this._parents.forEach(n=>{let i=j.content.cloneNode(!0);i.querySelector(".parent-inner").innerHTML=n.title,t.appendChild(i)}),this.parentsContainer.innerHTML="",this.parentsContainer.appendChild(t),setTimeout(()=>{this.parentsContainer.classList.add("show")},0)}clear(){this.input.value=""}set placeholder(t){this.setAttribute("placeholder",t),this.input.setAttribute("value",t)}get value(){return this.input.value}set value(t){this.input.value=t}set parents(t){b(t),this._parents=t,this.renderParents()}get parents(){return this.parents}focus(){this.input.focus()}},B=document.createElement("template");B.innerHTML=`
  <form
    role="search"
    novalidate
    autocomplete="off"
  >
    <div id="parents-container"></div>
    <input
      id="input"
      type="text"
      class="text-input"
      autocomplete="off"
      spellcheck="false"
    />
  </div>

  <style>
    form {
      display: flex;
      margin: 0;
    }
    input {
      flex-grow: 1;
      font-size: 18px;
      color: var(--hl-text-color, rgba(255, 255, 255, 80%));
      padding: 10px;
      border: none;
      background: transparent;
    }
    input:placeholder {
      color: white;
    }
    input:focus {
      outline: none;
    }

    #parents-container {
      display: flex;
    }
    #parents-container.show div.parent:last-of-type {
      max-width: 100px;
      overflow: hidden;
    }
    .parent:last-of-type {
      max-width: 0;

      transition: max-width 0.2s;
    }
    .parent-inner {
      display: block;
      background: red;
      color: white;
      padding: 2px;
    }
  </style>
`;var j=document.createElement("template");j.innerHTML=`
  <div class="parent" style="padding: 10px; ">
    <span class="parent-inner"></span>
  </div>
`;var L=class{constructor(){this.events={}}subscribe(t,n){let i=this;return i.events.hasOwnProperty(t)||(i.events[t]=[]),i.events[t].push(n)}publish(t,n={}){let i=this;return i.events.hasOwnProperty(t)?i.events[t].map(s=>s(n)):[]}};var y=class{constructor(t){this.actions={};this.mutations={};this.state={};this.status="resting";this.events=new L;let n=this;t.hasOwnProperty("actions")&&(n.actions=t.actions),t.hasOwnProperty("mutations")&&(n.mutations=t.mutations),n.state=new Proxy(t.state||{},{set:function(i,o,s){return i[o]!==s&&(i[o]=s,b(`stateChange: ${o}: ${s}`),n.events.publish("stateChange",n.state),n.status!=="mutation"&&console.warn(`You should use a mutation to set ${o}`),n.status="resting"),!0}})}dispatch(t,n){let i=this;return typeof i.actions[t]!="function"?(console.error(`Action "${t} doesn't exist.`),!1):(i.status="action",i.actions[t](i,n),!0)}commit(t,n){let i=this;if(typeof i.mutations[t]!="function")return b(`Mutation "${t}" doesn't exist`),!1;i.status="mutation";let o=i.mutations[t](i.state,n);return i.state=Object.assign(i.state,o),!0}};var m=class extends HTMLElement{render(){}constructor(t={}){super();this.root=this.attachShadow({mode:"open"}),this.root.appendChild(t.template.content.cloneNode(!0));let n=this;t.store instanceof y&&t.store.events.subscribe("stateChange",()=>n.render()),t.hasOwnProperty("element")&&(this.element=t.element)}};var T={};z(T,{activateIndex:()=>Z,constants:()=>w,loading:()=>X,receiveActions:()=>K,search:()=>J});var w={loading:"loading",activateIndex:"activateIndex",search:"search",receiveActions:"receiveActions"},J=(e,t)=>{e.commit(w.search,t)},K=(e,t)=>{e.commit(w.receiveActions,t)},X=(e,t)=>{e.commit(w.loading,t)},Z=(e,t)=>{e.commit(w.activateIndex,t)};var k={};z(k,{activateIndex:()=>nt,loading:()=>tt,receiveActions:()=>it,search:()=>et});var tt=(e,t)=>(e.loading=t,e),et=(e,t)=>(e.query=t,e),nt=(e,t)=>(t<e.actions.length&&t>-1&&(e.activeActionIndex=t),e),it=(e,t)=>(e.activeActionIndex>t.length||t.length===0?e.activeActionIndex=t.length-1:e.activeActionIndex<0&&t.length>0&&(e.activeActionIndex=0),e.actions=t,e);var st={level:0,parents:[],actions:[],query:"",activeActionIndex:-1,loading:!1,config:{initialQuery:"",maxHits:20,placeholder:"What are you looking to do?",sources:{},debug:!1}},U=st;var r=new y({actions:T,mutations:k,state:U});var H=class extends m{constructor(){super({template:F,store:r});this.results=this.root.getElementById("results"),this.activeHit=this.root.getElementById("active-hit"),this.actionTemplate=$,this.results.addEventListener("mouseover",t=>{if(t.target.classList.contains("hit")){let n=Array.from(t.target.parentNode.children).indexOf(t.target);r.dispatch("activateIndex",n)}}),this.moveActiveHit(-1)}moveActiveHit(t){if(t===-1?this.activeHit.classList.add("hidden"):this.activeHit.classList.remove("hidden"),!r.state.actions)return;let{top:n,height:i}=this.results.getBoundingClientRect(),o=this.results.children[t];if(o){let s=this.results.querySelector(".active");s&&s.classList.remove("active"),o.classList.add("active");let{top:a}=o.getBoundingClientRect(),l=32,h=n-a;a>n+i?this.results.scrollTo({top:l*t,behavior:"auto"}):h>0&&this.results.scrollTo({top:l*t,behavior:"auto"}),this.activeHit&&(this.activeHit.classList.remove("hidden"),this.activeHit.style.transform=`translateY(${l*t}px)`,this.activeHit.style.height=`${l}px`)}}renderItem(t,n){let i=this.actionTemplate.content.cloneNode(!0),o=i.querySelector(".title");return n===r.state.activeActionIndex&&o.classList.add("active"),o.innerHTML=_(r.state.query,t.title),i}renderItems(t){let n=document.createDocumentFragment();t.forEach((i,o)=>{n.appendChild(this.renderItem(i,o))}),this.results.children.length>0?(this.results.innerHTML="",this.results.appendChild(n)):this.results.appendChild(n),this.results.classList.remove("enter-active")}render(){this.moveActiveHit(r.state.activeActionIndex),this.renderItems(r.state.actions)}},$=document.createElement("template");$.innerHTML=`
  <div
    tabindex="0"
    class="hit"
  >
    <div class="title">
      Title       
    </div>
    <span class="category"></span>
  </div>
`;var F=document.createElement("template");F.innerHTML=`
  <div id="list" class="enter-active">
    <div id="results"></div>
    <div id="active-hit"></div>
  </div>

  <style>
    #list {
      position: relative;
    }

    .results {
      position: relative;
      max-height: 200px;
      overflow-y: auto;
    }

    .hit {
      display: flex;
      align-items: center;
      position: relative;
      font-size: 16px;
      padding: 0 20px;
      cursor: pointer;
      color: grey;
      height: 32px;

      transition: color 0.2s ease;
    }
    .hit-inner {
      position: absolute;
      z-index: 10;
    }
    .enter-active .active {
      transition: none;
    }

    .active {
      color: white;
    }
    #active-hit {
      display: flex;
      position: absolute;
      top: 0;
      z-index: 1;
      cursor: pointer;
      pointer-events: none;

      transition: transform 0.05s ease, color 0.1s ease;

      background: rgba(255, 255, 255, 10%);
      border-radius: 3px;
      height: 32px;
      width: calc(100% - 20px);
      margin: 0 10px;
    }
    #active-hit.hidden {
      background: rgba(255, 255, 255, 0);
    }

    .category {
      color: #999;
    }

    /* underscoring matches */
    .u {
      text-decoration: underline;
      font-weight: bold;
    }
  </style>
`;var C=(e,t,n=[])=>{let i,o,s,a,l,h;if(t){if(s=t.indexOf("."),s===-1?i=t:(i=t.slice(0,s),o=t.slice(s+1)),l=e[i],l!==null&&typeof l!="undefined")if(!o&&(typeof l=="string"||typeof l=="number"))n.push(l);else if(Object.prototype.toString.call(l)==="[object Array]")for(a=0,h=l.length;a<h;a++)C(l[a],o,n);else o&&C(l,o,n)}else n.push(e);return n},ot=(e,t)=>{let n=t[0];return e.split("").map((i,o)=>i!==n?-1:o).filter(i=>i!==-1)},rt=(e,t)=>{let n=t.split(""),i=[];return ot(e,t).forEach((s,a)=>{let l=s+1;i[a]=[s];for(let h=1;h<n.length;h++){let g=n[h];if(l=e.indexOf(g,l),l===-1){i[a]=!1;break}i[a].push(l),l++}}),i=i.filter(s=>s!==!1),i.length?i.sort((s,a)=>s.length===1?s[0]-a[0]:(s=s[s.length-1]-s[0],a=a[a.length-1]-a[0],s-a))[0]:!1},at=(e,t)=>{e=String(e),t=String(t),e=e.toLocaleLowerCase(),t=t.toLocaleLowerCase();let n=rt(e,t);return n?e===t?1:n.length>1?2+(n[n.length-1]-n[0]):2+n[0]:!1},Y=(e,t)=>({search:(i="")=>{if(i==="")return e;let o=[];for(let s=0;s<e.length;s++){let a=e[s];for(let l=0;l<t.length;l++){let h=C(a,t[l]),g=!1;for(let u=0;u<h.length;u++){let c=at(h[u],i);if(c){g=!0,o.push({item:a,score:c});break}}if(g)break}}return o.sort((s,a)=>s.score-a.score).map(s=>s.item)}});var f={},I=(e,t,n)=>{f[e]={...f[e],[t]:n}},M=(e,t)=>f[e]&&f[e][t]?f[e][t]:null,Q=e=>Object.keys(f).map(t=>f[t]&&f[t][e]?f[t][e]:[]).flat();var lt={level:0,parents:[],actions:[],query:"",activeActionIndex:0,loading:!1},ct=(e=null)=>{let t={...lt},n="",i=async(c,p)=>{let d=r.state.config.sources[p],x=M(p,c);if(x)return x;let v;return typeof d=="function"?v=d(c):typeof d.request=="function"?v=await d.request(c):typeof d.request=="string"?v=await fetch(d.request+"?q="+c):v=await fetch(d.request),c!==n?null:(I(p,c,v),v)},o=0,s=c=>{Object.keys(e.sources).forEach(async p=>{o++;let d=M(p,c);if(d)a(p,c,d);else{let x=await e.sources[p](c);a(p,c,x)}})},a=(c,p,d)=>{if(o--,u(o>0),I(c,p,d),r.state.query!==p)return;let x=Q(p),G=Y(x,["title","alias","description"]).search(p).slice(0,e.maxHits??20);r.dispatch("receiveActions",G)},l=c=>{r.dispatch("search",c),u(!0),s(c)},h=async()=>{u(!0);let c=[],p=r.state.actions[r.state.activeActionIndex];if(c.length===0&&p.trigger){if(typeof p.trigger=="string"&&E(p.trigger))window.location.href=p.trigger;else if(typeof p.trigger=="function"){let d=await p.trigger(r.state.query,null,r.state);typeof d=="string"&&E(d)&&(window.location.href=d)}}u(!1)},g=()=>(t.parents=t.parents.filter((c,p)=>p!==t.parents.length-1),t.level=t.level-1,{context:t}),u=c=>{r.dispatch("loading",c)};return{search:l,pick:h,back:g,context:t}},q=ct;var pt={isOpen:!1,initialQuery:"",maxHits:20,placeholder:"What do you need?",debug:!1,sources:{}},S=(e={})=>({...pt,...e});var O=class extends m{constructor(){super({store:r,template:N});this.config=S(),this.isOpen=this._config.isOpen,this.hotlight=this.shadowRoot.querySelector(".hotlight"),this.container=this.shadowRoot.querySelector(".container"),this.container.addEventListener("click",t=>{t.target===this.container&&this.close()}),this.debugElement=this.shadowRoot.querySelector(".debug"),this.input=this.shadowRoot.querySelector("hotlight-input"),this.input.setAttribute("placeholder",this._config.placeholder),this.input.addEventListener("keyup",this.search.bind(this)),this.input.addEventListener("keydown",this.skip.bind(this)),this.results=this.shadowRoot.querySelector("hotlight-results"),this.results.addEventListener("click",()=>{this.engine.pick()}),window.addEventListener("keydown",t=>{t.key==="k"&&t.metaKey&&(this.toggle(),t.preventDefault())}),window.addEventListener("hotlight:open",()=>{this.launch()}),window.addEventListener("hotlight:close",()=>{this.close()})}renderContext(){this._config.debug&&(this.debugElement.innerHTML="<div>"+JSON.stringify(r.state)+"</div>")}toggle(){this.isOpen?this.close():this.launch()}set config(t){this._config=S(t),this.engine=q(this._config)}get config(){return this._config}get open(){return this.isOpen}close(){this.isOpen&&(this.hotlight.classList.add("hidden"),setTimeout(()=>{document.body.style.overflowY="auto"},300),this.isOpen=!1)}launch(){this.isOpen||(this.hotlight.classList.remove("hidden"),document.body.style.overflowY="hidden",this.isOpen=!0,this.input.focus(),r.state.query&&(this.input.value=r.state.query))}debug(){this._config.debug=!0}skip(t){let{activeActionIndex:n}=r.state;if(!["Meta","Tab","Shift","ArrowLeft","ArrowRight","Escape"].includes(t.key)){if(t.key==="Enter"){this.doTrigger(),t.preventDefault();return}if(t.key==="Backspace"&&this.input.value===""&&r.state.parents.length>0,t.key==="ArrowUp"){r.dispatch("activateIndex",n-1),t.preventDefault();return}else if(t.key==="ArrowDown"){r.dispatch("activateIndex",n+1),t.preventDefault();return}this.renderContext()}}search(t){if(["ArrowRight","ArrowLeft"].includes(t.key))return;if(t.key==="Escape")if(t.preventDefault(),r.state.query===""&&r.state.parents.length===0){this.close();return}else this.engine.search(""),this.setInputValue("");if(["ArrowUp","ArrowDown","Enter","Meta"].includes(t.key))t.preventDefault();else{let o=this.input.value.trim();this.engine.search(o)}}setInputValue(t){this.input.value=t}doTrigger(){this.engine.pick(),this.input.parents=r.state.parents}},N=document.createElement("template");N.innerHTML=`
  <div class="hotlight hidden">
    <div class="container">
      <div class="modal">
        <hotlight-input></hotlight-input>
        <hotlight-results></hotlight-results>
        <div class="bottom-bar">
          <hotlight-loading></hotlight-loading>
          <a
            class="hotlight-logo"
            href="https://hotlight.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hotlight
          </a>
        </div>
      </div>
    </div>

    <div class="debug"></div>

    <div class="backdrop" />
  </div>

  <style>
    .hotlight.hidden {
      display: none;
    }

    .backdrop {
      opacity: 0.8;
      background: black;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 50;

      -webkit-transition: opacity 0.2s ease;
      -moz-transition: opacity 0.2s ease;
      -ms-transition: opacity 0.2s ease;
      -o-transition: opacity 0.2s ease;
      transition: opacity 0.2s ease;
    }

    .container {
      font-family: Helvetica, Arial, sans-serif;

      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 100;
    }
    .container.hidden {
      pointer-events: none;
    }

    .modal {
      display: flex;
      flex-direction: column;
      margin: 10% auto;
      width: 100%;
      max-width: 576px;
      /*border: 1px solid rgba(255,255,255,10%);*/
      border-radius: 5px;
      background: black;
      color: white;
      min-height: 66px; /* because input field is not rendered at all times */

      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.11), 0 2px 2px rgba(0, 0, 0, 0.11), 0 4px 4px rgba(0, 0, 0, 0.11), 0 8px 8px rgba(0, 0, 0, 0.11), 0 16px 16px rgba(0, 0, 0, 0.11),
        0 32px 32px rgba(0, 0, 0, 0.11);

      transition: opacity 0.2s ease-out, transform 0.2s ease-out;

      opacity: 1;
      transform: scale(1); /* translateY(100px);*/
    }
    .modal.hidden {
      opacity: 0;
      transform: scale(0.98); /* translateY(0);*/
      pointer-events: none;
    }

    .bottom-bar {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      line-height: 24px;
      font-size: 14px;
      margin: 5px 10px;
    }
    .hotlight-logo {
      font-size: 12px;
      /*display: flex;*/
      text-decoration: none;
      color: white;
    }
  </style>
`;var P=class extends m{constructor(){super({store:r,template:V});this.indicator=this.root.querySelector(".loading-indicator")}render(){let{loading:t}=r.state;t?this.indicator.classList.remove("hidden"):this.indicator.classList.add("hidden")}},V=document.createElement("template");V.innerHTML=`
  <div class="loading-indicator hidden"><span>.</span></div>
  <style>
    .loading-indicator {
      flex-grow: 1;
      font-size: 24px;
      transition: opacity 1s;
      opacity: 1;
      color: #777;
    }
    .loading-indicator.hidden {
      opacity: 0;
    }
    .loading-indicator span {
      animation: flickerAnimation 1s infinite;
    }

    @keyframes flickerAnimation {
      0%   { opacity:1; }
      50%  { opacity:0; }
      100% { opacity:1; }
    }
  </style>
`;customElements.define("hotlight-input",A);customElements.define("hotlight-results",H);customElements.define("hotlight-modal",O);customElements.define("hotlight-loading",P);var Zt=()=>{let e=document.querySelector("hotlight-modal");if(e)return e;throw new Error("No <hotlight-modal> detected on the page. Please add a <hotlight-modal></hotlight-modal> in the body of the page.")};export{Zt as hotlight};
