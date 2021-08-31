var JsonApiModels=function(t){"use strict";class e{constructor(t,e){this.store=e,this.attributes={},this.relationships={},this.meta={},this.links={},this.casts={},this.merge(t)}getAttribute(t){const e=this.attributes[t],i=this.casts[t];return i&&null!=e?new i(e):e}getRelationship(t){return this.store.find(this.relationships[t].data)}identifier(){return{id:this.id,type:this.type}}merge(t){if("type"in t&&(this.type=t.type),"id"in t&&(this.id=t.id),"attributes"in t&&(Object.assign(this.attributes,t.attributes),Object.keys(t.attributes).forEach((t=>{Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this),t)||Object.defineProperty(this,t,{configurable:!0,get:()=>this.getAttribute(t)})}))),"relationships"in t)for(const[e,i]of Object.entries(t.relationships))this.relationships[e]=this.relationships[e]||{},Object.assign(this.relationships[e],i),Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this),e)||Object.defineProperty(this,e,{configurable:!0,get:()=>this.getRelationship(e)});"links"in t&&(this.links=t.links),"meta"in t&&(this.meta=t.meta)}}function i(t){return encodeURIComponent(t).replace(/[!'()*]/g,(function(t){return"%"+t.charCodeAt(0).toString(16).toUpperCase()}))}return t.Model=e,t.Query=class{constructor(t={}){this.query=Object.assign({},t)}append(t,e){return"object"==typeof t?Object.entries(t).map((t=>this.append.apply(this,t))):this.query[t]=(this.query[t]?this.query[t]+",":"")+e,this}set(t,e){return"object"==typeof t?Object.entries(t).map((t=>this.set.apply(this,t))):this.query[t]=e,this}delete(t){return Array.isArray(t)?t.forEach((t=>this.delete(t))):delete this.query[t],this}toString(){return Object.entries(this.query).sort(((t,e)=>t[0].localeCompare(e[0]))).map((([t,e])=>i(t)+"="+i(e))).join("&")}},t.Store=class{constructor(t={}){this.models=t,this.graph={}}model(t,e){this.models[t]=e}find(t,e){return null===t?null:Array.isArray(t)?t.map((t=>this.find(t))):"object"==typeof t?this.find(t.type,t.id):this.graph[t]&&this.graph[t][e]||null}findAll(t){return this.graph[t]?Object.keys(this.graph[t]).map((e=>this.graph[t][e])):[]}sync(t){const e=this.syncResource.bind(this);return"included"in t&&t.included.map(e),Array.isArray(t.data)?t.data.map(e):e(t.data)}syncResource(t){const{type:e,id:i}=t;return this.graph[e]=this.graph[e]||{},this.graph[e][i]?this.graph[e][i].merge(t):this.graph[e][i]=this.createModel(t),this.graph[e][i]}createModel(t){return new(this.models[t.type]||this.models["*"]||e)(t,this)}forget(t){delete this.graph[t.type][t.id]}reset(){this.graph={}}},Object.defineProperty(t,"__esModule",{value:!0}),t}({});
