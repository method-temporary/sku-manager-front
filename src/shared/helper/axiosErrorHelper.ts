export function apiErrorHelper(response: any) {
  if (response) {
    const res = { ...response };
    return res.isAxiosError
      ? {
          ...res.response.data,
          url: res.config.url,
          status: res.response.status,
        }
      : response;
  } else {
    return {
      error: true,
      empty: true,
    };
  }
}
