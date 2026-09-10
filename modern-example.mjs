// Node 22+. A controlled two-tool workflow, no dependencies or API key.
const endpoint='https://attractor-observatory-demo.vercel.app/mcp';
let context;
async function call(name,args){
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json, text/event-stream','MCP-Protocol-Version':'2026-07-28','Mcp-Method':'tools/call','Mcp-Name':name},body:JSON.stringify({jsonrpc:'2.0',id:crypto.randomUUID(),method:'tools/call',params:{name,arguments:args,_meta:{'io.modelcontextprotocol/protocolVersion':'2026-07-28','io.modelcontextprotocol/clientCapabilities':{},'io.modelcontextprotocol/clientInfo':{name:'attractor-example',version:'2.0.0'},'attractor/source':'controlled',...(context?{'io.attractor/context':context}:{})}}}),signal:AbortSignal.timeout(15000)});
  const message=await response.json();if(!response.ok||message.error||message.result.isError)throw Error(JSON.stringify(message.error||message.result.structuredContent));
  context=message.result._meta['io.attractor/context'];return message.result.structuredContent;
}
const extracted=await call('extract_json_from_llm_output',{text:'Result: {"count":3}'});
const checked=await call('validate_json_schema',{value:extracted.result.value,schema:{type:'object',properties:{count:{type:'integer'}},required:['count']},attractor_trace_id:extracted.attractor_trace_id,attractor_knowledge_id:extracted.knowledge_id});
console.log(JSON.stringify({value:extracted.result.value,valid:checked.result.valid,knowledge_id:extracted.knowledge_id},null,2));
