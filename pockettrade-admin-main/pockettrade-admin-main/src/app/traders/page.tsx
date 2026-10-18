import { TradersTable } from '@/components/dashboard/Traders';
import DashboardLayout from '../dashboard/layout';
import { generatePageMetadata } from '@/components/common/PageMetaData';
import { Metadata } from 'next';

export const generateMetadata = (): Metadata => {
	return generatePageMetadata({
		title: 'Traders - JerisomTrade',
		content: 'View and manage trader accounts in JerisomTrade Dashboard',
		url: 'https://admin.jerisomtrade.com/traders',
	});
};

export default function TradersPage() {
	return (
		<DashboardLayout heading="Traders">
			<div className="mb-5">
				<div className="flex items-center justify-center">
					<TradersTable />
				</div>
			</div>
		</DashboardLayout>
	);
}
