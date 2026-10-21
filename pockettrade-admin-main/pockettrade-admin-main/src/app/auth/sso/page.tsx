'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from '@/store';
import { callApi } from '@/lib';
import type { ApiResponse } from '@/interfaces';
import type { SessionData } from '@/interfaces/ApiResponses';
import { toast } from 'sonner';
import { Loader } from '@/components/common';

function SsoHandler() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { actions: { updateUser } } = useSession((state) => state);
	const [statusMessage, setStatusMessage] = useState('Verifying Command Center authorization...');

	useEffect(() => {
		const token = searchParams.get('token');
		if (!token) {
			toast.error('Invalid link', { description: 'Missing SSO authorization token.' });
			router.replace('/');
			return;
		}

		let isMounted = true;

		const performSsoLogin = async () => {
			try {
				setStatusMessage('Authenticating admin session...');
				const { data: responseData, error } = await callApi<ApiResponse<SessionData>>(
					'/auth/admin/sso-login',
					{ token }
				);

				if (error) {
					throw new Error(error.message || 'SSO authorization failed');
				}

				if (responseData?.data) {
					const adminUser = responseData.data[0];
					if (!adminUser) {
						throw new Error('Admin profile data missing');
					}

					if (isMounted) {
						updateUser({ user: adminUser });
						toast.success('Access Granted', { description: 'Welcome to Jerisom Trade Command Center' });
						router.replace('/dashboard');
					}
				} else {
					throw new Error('Failed to retrieve session data');
				}
			} catch (err) {
				if (isMounted) {
					toast.error('Command Center Access Failed', {
						description: err instanceof Error ? err.message : 'Invalid or expired session token',
					});
					router.replace('/');
				}
			}
		};

		void performSsoLogin();

		return () => {
			isMounted = false;
		};
	}, [searchParams, router, updateUser]);

	return (
		<div className="flex h-screen w-full items-center justify-center bg-slate-950">
			<Loader message={statusMessage} />
		</div>
	);
}

export default function SsoPage() {
	return (
		<Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-slate-950"><Loader message="Loading..." /></div>}>
			<SsoHandler />
		</Suspense>
	);
}
