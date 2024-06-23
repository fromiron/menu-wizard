type ErrorWithMessage = {
  message: string;
};

type ParsedErrorMessage = {
  message: string;
};

export const parseError = (err: ErrorWithMessage): string => {
  const defaultError = 'エラーが発生しました。';
  try {
    const parsed = JSON.parse(err.message) as ParsedErrorMessage[];
    return parsed?.[0]?.message ?? defaultError;
  } catch {
    return defaultError;
  }
};
