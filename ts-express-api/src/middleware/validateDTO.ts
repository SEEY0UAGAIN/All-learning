import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export const validateDTO = (DTOClass: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoObject = plainToInstance(DTOClass, req.body);
        const errors = await validate(dtoObject);
        if (errors.length > 0) {
            return res.status(400).json({
                status: 400,
                message: "Validation failed",
                error: errors.map(e => e.constraints)
            });
        }
        next();
    }
}