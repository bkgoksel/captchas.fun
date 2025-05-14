import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

interface KVNamespace {
  get(key: string, options?: any): Promise<any>;
  put(key: string, value: any, options?: any): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: any): Promise<any>;
}

interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

export interface Env {
  __STATIC_CONTENT: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      // Get the static asset from KV
      return await getAssetFromKV({
        request,
        waitUntil: ctx.waitUntil.bind(ctx),
      }, {
        ASSET_NAMESPACE: env.__STATIC_CONTENT,
        ASSET_MANIFEST: {},
      });
    } catch (e) {
      return new Response('Not Found', { status: 404 });
    }
  },
};