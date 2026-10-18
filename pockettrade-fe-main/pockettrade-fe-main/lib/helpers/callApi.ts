import { useInitSession } from '@/store/useSession';
import { useDemoMode } from '@/store/useDemoMode';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
// import Router from "next/router";
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import { isObject } from '../type-helpers/typeOf';
import { assertENV } from '../type-helpers/assert';

const BACKEND_API =
	process.env.NEXT_PUBLIC_BACKEND_URL ||
	'https://api.jerisomtrade.com';

const normalizedBaseURL = BACKEND_API.endsWith('/api/v1')
	? BACKEND_API
	: `${BACKEND_API.replace(/\/+$/, '')}/api/v1`;

const api: AxiosInstance = axios.create({
	baseURL: normalizedBaseURL,
	timeout: 60000, // Set timeout to 60 seconds
	withCredentials: true, // enable cookies to be sent with the request for authentication automatically
});

interface ApiError {
	message: string;
	status: string | number;
	error?: unknown;
	headers?: Record<string, unknown>;
}

export const callApi = async <T>(
	endpoint: `/${string}`,
	data?: Record<string, unknown> | FormData | null,
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
): Promise<{ data?: T; error?: ApiError }> => {
	const source = axios.CancelToken.source();
	const resolvedMethod = method ?? (data ? 'POST' : 'GET');

	try {
		const response: AxiosResponse<T> = await api.request<T>({
			url: endpoint,
			method: resolvedMethod,
			...(data && { data }),
			headers: {
				...(isObject(data)
					? {
							'Content-Type': 'application/json',
							Accept: 'application/json',
						}
					: { 'Content-Type': 'multipart/form-data' }),
				'x-referer': process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000',
				'x-demo-mode': useDemoMode.getState().isDemoMode ? 'true' : 'false',
			},
			cancelToken: source.token,
		});

		return { data: response.data };
	} catch (error) {
		let apiError: ApiError | undefined;

		if (axios.isCancel(error)) {
			console.info('Request canceled', error.message);
		}

		if (axios.isAxiosError(error) && error.response) {
			apiError = error.response.data as ApiError;
			// avoid handling errors on the signin and signup pages

			if (error.response.status === 401) {
				useInitSession.getState().actions.clearSession();
			}
			if (error.response.status === 429) {
				toast.error('Too many requests!', {
					description: error.message,
				});
			}
			if (error.response.status === 403) {
				if (endpoint !== "/auth/sign-in") {
					useInitSession.getState().actions.clearSession();
					toast.error(error.message, {
						description: error.message,
					});
					//push to login page
					redirect(`/logout`);
				}
			}
			if (error.response.status === 500) {
				toast.error('Internal server Error!', {
					description: error.message,
				});
				throw new Error(apiError.message || 'Internal Server Error');
			}
		} else {
			if (error instanceof Error) {
				apiError = {
					message: error.message,
					status: 'Error',
				};
			}
		}
		return { error: apiError };
	}
};
