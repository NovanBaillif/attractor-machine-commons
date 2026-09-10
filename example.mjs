import {Attractor} from './client.mjs';
const client=await new Attractor().connect({source:'controlled',campaign:'github-example'});
const result=await client.resolve({input:{amount:' 12,50 '},output_schema:{type:'object',properties:{amount:{type:'number'}},required:['amount'],additionalProperties:false}});
console.log(JSON.stringify(result,null,2));
// This example declares itself controlled and does not fabricate visitor contributions.
