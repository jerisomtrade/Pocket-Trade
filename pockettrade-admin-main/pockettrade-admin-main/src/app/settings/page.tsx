import DashboardLayout from '../dashboard/layout';
import { generatePageMetadata } from '@/components/common/PageMetaData';
import Settings from '@/components/dashboard/Settings';
import { Metadata } from 'next';

export const generateMetadata = (): Metadata => {
	return generatePageMetadata({
		title: 'Settings - JerisomTrade',
		content: 'Customize your preferences and account settings in JerisomTrade Dashboard',
		url: 'https://admin.jerisomtrade.com/settings',
	});
};

export default function Setting() {
	return (
		<DashboardLayout heading="Settings">
			<div className="mb-5">
				<div className="flex items-center justify-center">
					<Settings />
				</div>
			</div>
		</DashboardLayout>
	);
}
