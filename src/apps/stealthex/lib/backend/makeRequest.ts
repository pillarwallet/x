import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

export type Error = {
    name?: string;
    message: string;
    status: number;
};

export async function makeRequest<T>(props: AxiosRequestConfig): Promise<{ data?: T, error?: Error }> {
    try {
        const response = await axios<T>(props);
        return {
            data: response.data,
        };
    } catch (error) {
        const errorObject: Error = {
            status: 0,
            message: '',
        };

        if (axios.isAxiosError(error)) {
            if (error.response) {
                const {
                    response: { data, status },
                } = error;
                errorObject.message = data.message || data.error;
                errorObject.status = status;
            } else if (error.request) {
                errorObject.message = 'I am a teapot';
                errorObject.status = 418;
            }
        } else {
            errorObject.message = 'Client error';
            errorObject.status = 400;
        }

        return {
            error: errorObject,
        };
    }
}
