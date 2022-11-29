import { RpcException } from '@nestjs/microservices';
import { ResMessage, ResStatusCode } from '../../constants/index';
import { CustomRpcException } from '../custom-rpc.exception';

export class ChatRoomNotFoundException extends CustomRpcException {
  constructor(
    message = ResMessage.CHAT_ROOM_NOT_FOUND,
    status = ResStatusCode.NOT_FOUND,
  ) {
    super({ message, status });
  }
}
