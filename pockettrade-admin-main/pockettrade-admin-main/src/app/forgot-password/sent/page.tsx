import ForgotPasswordSent from '@/components/auth/ForgotPasswordSent';
import { generatePageMetadata } from '@/components/common/PageMetaData';
import { Metadata } from 'next';

export const generateMetadata = (): Metadata => {
	return generatePageMetadata({
		title: 'Password Reset - JerisomTrade',
		content: "We've sent a password reset link to your email",
		url: 'https://admin.jerisomtrade.com/forgot-password/sent',
	});
};

export default function ForgotPassword() {
	return (
		<div className="flex h-screen items-center justify-center">
			<ForgotPasswordSent />
		</div>
	);
}
