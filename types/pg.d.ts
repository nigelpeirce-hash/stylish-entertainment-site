declare module "pg" {
  export interface PoolConfig {
    connectionString?: string;
    [key: string]: any;
  }

  export class Pool {
    constructor(config?: PoolConfig);
    query: (...args: any[]) => Promise<any>;
    end: () => Promise<void>;
    // Add any other members you need as 'any' to satisfy TypeScript
    [key: string]: any;
  }
}

