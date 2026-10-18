import { PerformanceDashboard } from '@/components/dashboard/Performance';
import DashboardLayout from '../dashboard/layout';
import { generatePageMetadata } from '@/components/common/PageMetaData';
import { Metadata } from 'next';

export const generateMetadata = (): Metadata => {
	return generatePageMetadata({
		title: 'Performance - JerisomTrade',
		content: 'Real-time platform performance monitoring in JerisomTrade Dashboard',
		url: 'https://admin.jerisomtrade.com/performance',
	});
};

export default function PerformancePage() {
	return (
		<DashboardLayout heading="Performance">
			<div className="mb-5">
				<PerformanceDashboard />
			</div>
		</DashboardLayout>
	);
}
