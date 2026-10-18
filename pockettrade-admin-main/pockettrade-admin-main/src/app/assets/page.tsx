import { AssetsTable } from '@/components/dashboard/Assets';
import DashboardLayout from '../dashboard/layout';
import { generatePageMetadata } from '@/components/common/PageMetaData';
import { Metadata } from 'next';

export const generateMetadata = (): Metadata => {
	return generatePageMetadata({
		title: 'Assets - JerisomTrade',
		content: 'Manage tradable assets and market data in JerisomTrade Dashboard',
		url: 'https://admin.jerisomtrade.com/assets',
	});
};

export default function AssetsPage() {
	return (
		<DashboardLayout heading="Assets">
			<div className="mb-5">
				<div className="flex items-center justify-center">
					<AssetsTable />
				</div>
			</div>
		</DashboardLayout>
	);
}
