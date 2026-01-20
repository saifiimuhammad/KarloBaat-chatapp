import type { Request, Response, NextFunction } from "express";
interface CustomError extends Error {
    statusCode?: number;
    code?: number;
    keyPattern?: Record<string, number>;
    path?: string;
}
declare const errorMiddleware: (err: CustomError, _req: Request, res: Response, _next: NextFunction) => Response;
type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;
declare const TryCatch: (passedFunc: AsyncController) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export { errorMiddleware, TryCatch };
//# sourceMappingURL=error.d.ts.map