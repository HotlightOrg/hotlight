var T=Object.defineProperty;var j=e=>T(e,"__esModule",{value:!0});var M=(e,t)=>{j(e);for(var n in t)T(e,n,{get:t[n],enumerable:!0})};var w=class{constructor(){this.events={}}subscribe(t,n){let i=this;return i.events.hasOwnProperty(t)||(i.events[t]=[]),i.events[t].push(n)}publish(t,n={}){let i=this;return i.events.hasOwnProperty(t)?i.events[t].map(s=>s(n)):[]}};var U=typeof window!="undefined"?window:void 0,k=e=>{U&&location.hostname==="localhost"&&console.log(e)};var A=e=>{if(e[0]==="/")return!0;try{if(new URL(e,location.href))return!0}catch(t){return console.warn("URL not valid.",t),!1}return!1};var y=class{constructor(t){this.actions={};this.mutations={};this.state={};this.status="resting";this.events=new w;let n=this;t.hasOwnProperty("actions")&&(n.actions=t.actions),t.hasOwnProperty("mutations")&&(n.mutations=t.mutations),n.state=new Proxy(t.state||{},{set:function(i,o,s){return i[o]!==s&&(i[o]=s,k(`stateChange: ${o}: ${s}`),n.events.publish("stateChange",n.state),n.status!=="mutation"&&console.warn(`You should use a mutation to set ${o}`),n.status="resting"),!0}})}dispatch(t,n){let i=this;return typeof i.actions[t]!="function"?(console.error(`Action "${t} doesn't exist.`),!1):(i.status="action",i.actions[t](i,n),!0)}commit(t,n){let i=this;if(typeof i.mutations[t]!="function")return k(`Mutation "${t}" doesn't exist`),!1;i.status="mutation";let o=i.mutations[t](i.state,n);return i.state=Object.assign(i.state,o),!0}};var b=class extends HTMLElement{render(){}constructor(t={}){super();this.root=this.attachShadow({mode:"open"}),this.root.appendChild(t.template.content.cloneNode(!0));let n=this;t.store instanceof y&&t.store.events.subscribe("stateChange",()=>n.render()),t.hasOwnProperty("element")&&(this.element=t.element)}};var E=(e,t,n=[])=>{let i,o,s,a,l,f;if(t){if(s=t.indexOf("."),s===-1?i=t:(i=t.slice(0,s),o=t.slice(s+1)),l=e[i],l!==null&&typeof l!="undefined")if(!o&&(typeof l=="string"||typeof l=="number"))n.push(l);else if(Object.prototype.toString.call(l)==="[object Array]")for(a=0,f=l.length;a<f;a++)E(l[a],o,n);else o&&E(l,o,n)}else n.push(e);return n},$=(e,t)=>{let n=t[0];return e.split("").map((i,o)=>i!==n?-1:o).filter(i=>i!==-1)},Q=(e,t)=>{let n=t.split(""),i=[];return $(e,t).forEach((s,a)=>{let l=s+1;i[a]=[s];for(let f=1;f<n.length;f++){let m=n[f];if(l=e.indexOf(m,l),l===-1){i[a]=!1;break}i[a].push(l),l++}}),i=i.filter(s=>s!==!1),i.length?i.sort((s,a)=>s.length===1?s[0]-a[0]:(s=s[s.length-1]-s[0],a=a[a.length-1]-a[0],s-a))[0]:!1},Y=(e,t)=>{e=String(e),t=String(t),e=e.toLocaleLowerCase(),t=t.toLocaleLowerCase();let n=Q(e,t);return n?e===t?1:n.length>1?2+(n[n.length-1]-n[0]):2+n[0]:!1},P=(e,t)=>({search:(i="")=>{if(i==="")return e;let o=[];for(let s=0;s<e.length;s++){let a=e[s];for(let l=0;l<t.length;l++){let f=E(a,t[l]),m=!1;for(let d=0;d<f.length;d++){let r=Y(f[d],i);if(r){m=!0,o.push({item:a,score:r});break}}if(m)break}}return o.sort((s,a)=>s.score-a.score).map(s=>s.item)}});var p={},L=(e,t,n)=>{p[e]={...p[e],[t]:n}},C=(e,t)=>p[e]&&p[e][t]?p[e][t]:null,H=e=>Object.keys(p).map(t=>p[t]&&p[t][e]?p[t][e]:[]).flat();var I={};M(I,{activateIndex:()=>W,constants:()=>v,loading:()=>V,receiveActions:()=>B,search:()=>F});var v={loading:"loading",activateIndex:"activateIndex",search:"search",receiveActions:"receiveActions"},F=(e,t)=>{e.commit(v.search,t)},B=(e,t)=>{e.commit(v.receiveActions,t)},V=(e,t)=>{e.commit(v.loading,t)},W=(e,t)=>{e.commit(v.activateIndex,t)};var O={};M(O,{activateIndex:()=>G,loading:()=>J,receiveActions:()=>X,search:()=>K});var J=(e,t)=>(e.loading=t,e),K=(e,t)=>(e.query=t,e),G=(e,t)=>(t<e.actions.length&&t>-1&&(e.activeActionIndex=t),e),X=(e,t)=>(e.activeActionIndex>t.length||t.length===0?e.activeActionIndex=t.length-1:e.activeActionIndex<0&&t.length>0&&(e.activeActionIndex=0),e.actions=t,e);var Z={level:0,parents:[],actions:[],query:"",activeActionIndex:-1,loading:!1,config:{initialQuery:"",maxHits:20,placeholder:"What are you looking to do?",sources:{},debug:!1}},D=Z;var h=new y({actions:I,mutations:O,state:D});var N={level:0,parents:[],actions:[],query:"",activeActionIndex:0,loading:!1},q=(e=null)=>{let t={...N},n="",i=async(r,c)=>{let u=h.state.config.sources[c],x=C(c,r);if(x)return x;let g;return typeof u=="function"?g=u(r):typeof u.request=="function"?g=await u.request(r):typeof u.request=="string"?g=await fetch(u.request+"?q="+r):g=await fetch(u.request),r!==n?null:(L(c,r,g),g)},o=0,s=r=>{Object.keys(e.sources).forEach(async c=>{o++;let u=C(c,r);if(u)a(c,r,u);else{let x=await e.sources[c](r);a(c,r,x)}})},a=(r,c,u)=>{if(o--,d(o>0),L(r,c,u),h.state.query!==c)return;let x=H(c),_=P(x,["title","alias","description"]).search(c).slice(0,e.maxHits??20);h.dispatch("receiveActions",_)},l=r=>{h.dispatch("search",r),d(!0),s(r)},f=async()=>{d(!0);let r=[],c=h.state.actions[h.state.activeActionIndex];if(r.length===0&&c.trigger){if(typeof c.trigger=="string"&&A(c.trigger))window.location.href=c.trigger;else if(typeof c.trigger=="function"){let u=await c.trigger(h.state.query,null,h.state);typeof u=="string"&&A(u)&&(window.location.href=u)}}d(!1)},m=()=>(t.parents=t.parents.filter((r,c)=>c!==t.parents.length-1),t.level=t.level-1,{context:t}),d=r=>{h.dispatch("loading",r)};return{search:l,pick:f,back:m,context:t}},R=q;var tt={isOpen:!1,initialQuery:"",maxHits:20,placeholder:"What do you need?",debug:!1,sources:{}},S=(e={})=>({...tt,...e});var et=class extends b{constructor(){super({store:h,template:z});this.config=S(),this.isOpen=this._config.isOpen,this.hotlight=this.shadowRoot.querySelector(".hotlight"),this.container=this.shadowRoot.querySelector(".container"),this.container.addEventListener("click",t=>{t.target===this.container&&this.close()}),this.debugElement=this.shadowRoot.querySelector(".debug"),this.input=this.shadowRoot.querySelector("hotlight-input"),this.input.setAttribute("placeholder",this._config.placeholder),this.input.addEventListener("keyup",this.search.bind(this)),this.input.addEventListener("keydown",this.skip.bind(this)),this.results=this.shadowRoot.querySelector("hotlight-results"),this.results.addEventListener("click",()=>{this.engine.pick()}),window.addEventListener("keydown",t=>{t.key==="k"&&t.metaKey&&(this.toggle(),t.preventDefault())}),window.addEventListener("hotlight:open",()=>{this.launch()}),window.addEventListener("hotlight:close",()=>{this.close()})}renderContext(){this._config.debug&&(this.debugElement.innerHTML="<div>"+JSON.stringify(h.state)+"</div>")}toggle(){this.isOpen?this.close():this.launch()}set config(t){this._config=S(t),this.engine=R(this._config)}get config(){return this._config}get open(){return this.isOpen}close(){this.isOpen&&(this.hotlight.classList.add("hidden"),setTimeout(()=>{document.body.style.overflowY="auto"},300),this.isOpen=!1)}launch(){this.isOpen||(this.hotlight.classList.remove("hidden"),document.body.style.overflowY="hidden",this.isOpen=!0,this.input.focus(),h.state.query&&(this.input.value=h.state.query))}debug(){this._config.debug=!0}skip(t){let{activeActionIndex:n}=h.state;if(!["Meta","Tab","Shift","ArrowLeft","ArrowRight","Escape"].includes(t.key)){if(t.key==="Enter"){this.doTrigger(),t.preventDefault();return}if(t.key==="Backspace"&&this.input.value===""&&h.state.parents.length>0,t.key==="ArrowUp"){h.dispatch("activateIndex",n-1),t.preventDefault();return}else if(t.key==="ArrowDown"){h.dispatch("activateIndex",n+1),t.preventDefault();return}this.renderContext()}}search(t){if(["ArrowRight","ArrowLeft"].includes(t.key))return;if(t.key==="Escape")if(t.preventDefault(),h.state.query===""&&h.state.parents.length===0){this.close();return}else this.engine.search(""),this.setInputValue("");if(["ArrowUp","ArrowDown","Enter","Meta"].includes(t.key))t.preventDefault();else{let o=this.input.value.trim();this.engine.search(o)}}setInputValue(t){this.input.value=t}doTrigger(){this.engine.pick(),this.input.parents=h.state.parents}},z=document.createElement("template");z.innerHTML=`
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
`;export{et as Modal};
