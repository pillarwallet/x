export type UnavailableResponse = {
    state: 'unknown';
  };
  
export type FailedResponse<T> = {
    state: 'failed';
    status: number;
    message?: T;
};

export type ThrowableError<T> = UnavailableResponse | FailedResponse<T>;

export type ErrorResponse<T> = ThrowableError<T> & { data: null };

export type ThrowableResponse<T> = {
    status: number;
    data: T;
    headers: Headers;
};

export type SuccessResponse<T> = ThrowableResponse<T> & {
state: 'success';
};
  
export type Response<D, E> = SuccessResponse<D> | ErrorResponse<E>;

export type RequestResponse<
  T extends boolean,
  D = unknown,
  E = string,
> = T extends true ? ThrowableResponse<D> : Response<D, E>;