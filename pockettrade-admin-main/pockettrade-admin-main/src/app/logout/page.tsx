import LogoutPage from '@/components/auth/Logout';
import { generatePageMetadata } from '@/components/common/PageMetaData';
import { Metadata } from 'next';

export const generateMetadata = (): Metadata => {
	return generatePageMetadata({
		title: 'Logging Out - JerisomTrade',
		content: 'You are being logged out...',
		url: 'https://admin.jerisomtrade.com/logout',
	});
};

export default function Logout() {
	return (
		<div className="flex h-screen items-center justify-center">
			<LogoutPage />
		</div>
	);
}
