import * as crypto from 'crypto';

export const hashPwd = (p: string): string => {
  const hmac = crypto.createHmac('sha512', 'A-[}w6-_LWUt+C^oH}QNh>,r#aRfPN:6E-HRCJ=UeX+TJkwC!w');
  hmac.update(p);
  return hmac.digest('hex');
};
