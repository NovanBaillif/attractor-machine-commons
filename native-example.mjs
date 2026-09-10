// Controlled synthetic test. Publishes two small PUBLIC artifacts.
import assert from 'node:assert/strict';
const base=process.env.ATTRACTOR_URL||'https://attractor-observatory-demo.vercel.app';
const request=async(path,body,headers={})=>{
  const r=await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json','X-Attractor-Test':'controlled',...headers},body:JSON.stringify(body),signal:AbortSignal.timeout(20000)});
  const data=await r.json();assert.equal(r.status,200,JSON.stringify(data));return {data,context:r.headers.get('X-Attractor-Context')};
};
const http=(tool,args,context)=>request('/api/v3/'+tool,args,context?{Authorization:'Bearer '+context}:{});
const mcp=async(tool,args,context)=>{
  const r=await request('/mcp',{jsonrpc:'2.0',id:1,method:'tools/call',params:{name:tool,arguments:args,_meta:{'io.modelcontextprotocol/protocolVersion':'2026-07-28','io.modelcontextprotocol/clientCapabilities':{},'io.modelcontextprotocol/clientInfo':{name:'attractor-native-controlled',version:'3.0.0'},'attractor/source':'controlled',...(context?{'io.attractor/context':context}:{})}}},{Accept:'application/json, text/event-stream','MCP-Protocol-Version':'2026-07-28','Mcp-Method':'tools/call','Mcp-Name':tool});
  assert.ok(r.data.result&&!r.data.result.isError,JSON.stringify(r.data));return {data:r.data.result.structuredContent,context:r.data.result._meta['io.attractor/context']};
};
const a2a=async(tool,args,context)=>{
  const r=await request('/a2a',{jsonrpc:'2.0',id:1,method:'SendMessage',params:{message:{messageId:crypto.randomUUID(),role:'ROLE_USER',parts:[{data:{capability:tool,arguments:args}}],...(context?{metadata:{'io.attractor/context':context}}:{})}}},{'A2A-Version':'1.0'});
  assert.ok(r.data.result,JSON.stringify(r.data));const msg=r.data.result.message;return {data:msg.parts[0].data,context:msg.metadata['io.attractor/context']};
};
const card=await fetch(base+'/.well-known/agent-card.json');assert.equal(card.status,200);assert.equal((await card.json()).skills.length,4);
const capability=await mcp('find_capability',{query:'verify_artifact'});assert.equal(capability.data.capabilities[0].name,'verify_artifact');
const publicState={artifact:{count:1},visibility:'public',title:'Native controlled handoff '+new Date().toISOString(),kind:'json',tags:['native-controlled']};
const a=await mcp('share_state',publicState,capability.context);
const b=await http('retrieve_state',{id:a.data.state.id});assert.notEqual(a.context,b.context);
const derived=await http('share_state',{...publicState,artifact:{count:2},parent_id:a.data.state.id,read_receipt:b.data.read_receipt},b.context);assert.equal(derived.data.state.parent_id,a.data.state.id);
const c=await a2a('retrieve_state',{id:derived.data.state.id});assert.notEqual(c.context,b.context);
const verified=await a2a('verify_artifact',{artifact:c.data.state.artifact,constraints:{type:'object',required:['count'],properties:{count:{type:'integer',minimum:2}},additionalProperties:false},state_id:c.data.state.id,read_receipt:c.data.read_receipt},c.context);
assert.equal(verified.data.valid,true);assert.equal(verified.data.state_use.verified,true);assert.equal(verified.data.verification.code_executed,false);
console.log(JSON.stringify({checked_at:new Date().toISOString(),controlled:true,version:'3.0.0',transports:['MCP 2026-07-28','HTTP JSON','A2A 1.0'],parent:a.data.state.id,derived:derived.data.state.id,verified:true,meaning:'Controlled functional test, not independent-agent traffic.'},null,2));
