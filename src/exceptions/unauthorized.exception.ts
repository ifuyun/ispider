import { HttpStatus } from '@nestjs/common';
import { Message } from '../common/message.enum';
import { ResponseCode } from '../common/response-code.enum';
import { CustomException } from './custom.exception';
import { CustomExceptionResponse } from './exception.interface';

export class UnauthorizedException extends CustomException {
  constructor(
    message: Message | CustomExceptionResponse = Message.UNAUTHORIZED,
    resCode: ResponseCode = ResponseCode.UNAUTHORIZED,
    httpStatus: HttpStatus = HttpStatus.UNAUTHORIZED
  ) {
    super(message, httpStatus, resCode);
  }
}
