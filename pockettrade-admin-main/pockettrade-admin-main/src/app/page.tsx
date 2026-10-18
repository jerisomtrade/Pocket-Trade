import LoginForm from '@/components/auth/LoginForm';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/components/common/PageMetaData';

export const generateMetadata = (): Metadata => {
	return generatePageMetadata({
		title: 'Sign in - Pocket Trade Admin',
		content: 'Sign in to access Pocket Trade admin dashboard',
		url: 'http://localhost:5000',
	});
};

export default function Home() {
	return (
		<div className="flex h-screen items-center justify-center">
			<LoginForm />
		</div>
	);
}
