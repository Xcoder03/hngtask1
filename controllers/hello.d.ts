// controllers/hello.d.ts
declare module '../controllers/hello' {
    import { Request, Response } from 'express';
  
    export const helloController: (req: Request, res: Response) => Promise<void>;
  }
  