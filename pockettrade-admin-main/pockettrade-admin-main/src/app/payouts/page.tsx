import { PayoutsManager } from '@/components/dashboard/Payouts';
import DashboardLayout from '../dashboard/layout';
import { generatePageMetadata } from '@/components/common/PageMetaData';
import { Metadata } from 'next';

export const generateMetadata = (): Metadata => {
	return generatePageMetadata({
		title: 'Payouts - JerisomTrade',
		content: 'Monitor and manage automated payouts in JerisomTrade Dashboard',
		url: 'https://admin.jerisomtrade.com/payouts',
	});
};

export default function PayoutsPage() {
	return (
		<DashboardLayout heading="Payouts">
			<div className="mb-5">
				<PayoutsManager />
			</div>
		</DashboardLayout>
	);
}
