export interface D1PreparedStatement {
  bind(...values: unknown[]): {
    run(): Promise<unknown>;
    all<T = unknown>(): Promise<{ results: T[] }>;
    first<T = unknown>(): Promise<T | null>;
  };
}

export interface D1DatabaseLike {
  prepare(query: string): D1PreparedStatement;
}

export interface R2BucketLike {
  get(key: string): Promise<unknown>;
  put(key: string, value: unknown): Promise<unknown>;
}

export interface CloudflareEnv {
  // Cloudflare D1 Database binding
  DB?: D1DatabaseLike;
  // Cloudflare R2 Bucket binding
  STORAGE?: R2BucketLike;
  // Environment identifier
  ENVIRONMENT?: string;
  // Secret token or keys if configured in Wrangler secrets
  API_SECRET?: string;
}

export interface ProjectShowcase {
  id: string;
  title: string;
  client: string;
  category: string;
  metric: string;
  description: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
