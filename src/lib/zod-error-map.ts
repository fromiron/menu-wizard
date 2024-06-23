import { z, type ZodErrorMap, ZodIssueCode } from 'zod';

export const customErrorMap: ZodErrorMap = (issue) => {
  if (issue.code === ZodIssueCode.invalid_type) {
    return { message: '入力タイプに誤りがあります。' };
  }
  if (issue.code === z.ZodIssueCode.too_small) {
    return { message: '入力値が短いです。' };
  }
  if (issue.code === z.ZodIssueCode.too_big) {
    return { message: '入力値が長すぎます。' };
  }

  return { message: 'エラーが発生しました。' };
};
