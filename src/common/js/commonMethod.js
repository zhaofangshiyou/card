import { Message } from 'element-ui';

export const messageWarn = (text) => { Message(text) }

export const isPoneAvailable = (phone) => {
  let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(phone)) {
   return false;
  } else {
   return true;
  }
}
