import { Response } from "express";
import HTTP_STATUS from "@/utils/httpStatusCodes";

class ResponseHandler {

  static success(
    res: Response,
    message : string = 'Success',
    status_code : number = HTTP_STATUS.OK,
    data: any = null
  ) {
    return res.status(status_code).json({
      success: true,
      message,
      data,
    });
  }

  static error(
    res: Response,
    message : string = 'Something went wrong',
    status_code : number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    error: any = null
  ) {
    return res.status(status_code).json({
      success: false,
      message,
      error: error?.message || error,
    });
  }
}

export default ResponseHandler;