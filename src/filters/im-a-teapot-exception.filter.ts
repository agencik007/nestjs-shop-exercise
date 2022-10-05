// import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
// import { Request, Response } from "express";

// @Catch(TypBłęduException)
// export class TypBłęduExceptionFilter implements ExceptionFilter {
//     catch(exception: TypBłęduException, host: ArgumentsHost) {
//         const ctx = host.switchToHttp();
//         const response = ctx.getResponse<Response>()
//         const request = ctx.getRequest<Request>()
//         const status = exception.getStats();

//         response // to jest obiekt response np. z Express.js - wywołaj np. .json() aby wysłać odpowiedź
//     }
// }