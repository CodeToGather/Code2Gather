// https://dev.to/goenning/how-to-retry-when-react-lazy-fails-mb5
export const retryPromise = (
  promise: {
    (): Promise<typeof import('../app/AuthenticatedApp')>;
    (): Promise<unknown>;
  },
  retriesLeft = 5,
  interval = 1000,
): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    promise()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            reject(error);
            return;
          }

          retryPromise(promise, retriesLeft - 1, interval).then(
            resolve,
            reject,
          );
        }, interval);
      });
  });
};
