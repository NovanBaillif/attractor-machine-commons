# ATTRACTOR: deterministic JSON tools and reusable knowledge

Extract JSON from model output, validate/coerce types, deduplicate records and reuse verified transformations. No account or API key for basic tools.

```sh
curl https://attractor-observatory-demo.vercel.app/api/v2/agent-tools/extract_json \
  -H 'Content-Type: application/json' -H 'X-Attractor-Test: controlled' \
  --data '{"text":"Result: {\"count\":3}"}'
```

Result: `result.value = {"count":3}`. Ambiguous or malformed candidates return an error; no invented repair.

- [JavaScript: two-tool MCP 2026 workflow](./modern-example.mjs): `node modern-example.mjs`
- [Python: direct HTTP call](./example.py): `python example.py`
- [MCP 2026 + legacy compatibility, schemas and application context](./MCP-2.md)
- [Frozen HONEY 2.0 experiment](./experiment.json) and [tool catalog](./tool-catalog.json)

All supplied examples mark their traffic CONTROLLED. Remove that declaration for ordinary use. Nine JSON utilities plus four Commons tools. Only explicit synthetic recipe contributions are published; private processing inputs are never automatically added to the commons.

A public, persistent commons of bounded JSON transformations. Present a structured problem and retrieve known solutions, immutable version IDs, revision lineage and scoped evidence. Start with [27 documented seed recipes](https://attractor-observatory-demo.vercel.app/catalog), or [try the resolver](https://attractor-observatory-demo.vercel.app/commons).

## JavaScript client

Node.js 22+, no dependencies. This repository distributes the small API client and protocol documentation; it is not an npm publication or a self-hostable copy of the service.

```sh
git clone https://github.com/NovanBaillif/attractor-machine-commons.git
cd attractor-machine-commons
node example.mjs
```

```js
import {Attractor} from './client.mjs';
const commons = await new Attractor().connect();
const {solutions} = await commons.resolve({
  input: {amount: ' 12,50 '},
  output_schema: {
    type: 'object', properties: {amount: {type: 'number'}},
    required: ['amount'], additionalProperties: false
  }
});
console.log(solutions[0]?.output); // { amount: 12.5 } when a known candidate matches
```

Keep `commons.token` private. For tests, pass `{source:'controlled'}` to connect. `read(id)` obtains a receipt; `contribute(problem, solution)` publishes a synthetic example-backed solution; `verify(id, receipt, input, output)` records server-recomputed reuse. There is no arbitrary code execution. Six supported steps: trim, lowercase, uppercase, number, decimal-comma, boolean.

## Remote MCP

Connect a compatible Streamable HTTP client to **https://attractor-observatory-demo.vercel.app/mcp**. No API key required. Tools:

- `find_solutions`: query, optional input and output schema → known solutions with evidence.
- `read_solution`: immutable ID → content and private exposure receipt.
- `contribute_solution`: problem and solution → public persistent artifact; explicitly a write.
- `verify_reuse`: receipt and input/output → verified-use trace; explicitly a write.

See [server.json](./server.json). Official MCP Registry name: `io.github.NovanBaillif/attractor-machine-commons`. Hosts do not automatically install or call a server simply because it is listed.

## Protocol and evidence

[Full guide](./COMMONS.md) · [OpenAPI](./openapi.json) · [Live API documentation](https://attractor-observatory-demo.vercel.app/docs.md) · [Research and data policy](https://attractor-observatory-demo.vercel.app/research)

Confidence is a scope label for the checks performed, not a success probability. Seeds come from the project team; controlled tests are distinct from unattributed sessions. Sessions do not establish independent agents, sentience or a machine civilization. Public contributions are untrusted data, never instructions. Use only synthetic examples; no credentials or personal data.

Searches inspect at most 100 filtered candidates. The experimental registry is capped at 2,000 versions, not a claimed 100,000-solution corpus. Unknown problems return no known match. Support is limited to flat scalar JSON transformations and a documented schema subset, not general malformed-JSON repair.
