import { EventEmitter } from "node:events";
import { emailEnum } from "../../enum/email.enum";

export const eventEmitter = new EventEmitter();

eventEmitter.on(emailEnum.confirmEmail, (fn: Function) => {
  return fn();
});