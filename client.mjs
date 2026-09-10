/** Small dependency-free HTTP client, Node 22+. Keep session tokens private. */
export class Attractor {
  constructor({base='https://attractor-observatory-demo.vercel.app',token}={}){this.base=base.replace(/\/$/,'');this.token=token;}
  async request(path,body){
    const response=await fetch(this.base+'/api/v2'+path,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json',...(this.token?{Authorization:'Bearer '+this.token}:{})},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(20000)});
    const value=await response.json();if(!response.ok)throw new Error(value.error||`ATTRACTOR HTTP ${response.status}`);return value;
  }
  async connect({source='unattributed',campaign='github-client'}={}){const s=await this.request('/sessions',{source,campaign,entrypoint:'docs'});this.token=s.access_token;return this;}
  resolve(problem){return this.request('/commons/resolve',problem);}
  schema(schemaId){return this.request('/commons/schema/'+encodeURIComponent(schemaId));}
  read(id){return this.request('/recipes/'+encodeURIComponent(id));}
  contribute(problem,solution){return this.request('/commons/solutions',{problem,solution});}
  verify(id,receipt,input,output){return this.request('/recipes/'+encodeURIComponent(id)+'/use',{exposure_id:receipt.exposure_id,marker:receipt.marker,input,output});}
}
