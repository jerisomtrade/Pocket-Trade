import { ConnectedWalletsTable } from '@/components/dashboard/ConnectedWallets';
import DashboardLayout from '../dashboard/layout';
import { generatePageMetadata } from '@/components/common/PageMetaData';
import { Metadata } from 'next';

export const generateMetadata = (): Metadata => {
	return generatePageMetadata({
		title: 'Connected Wallets - JerisomTrade',
		content: 'View connected wallets in JerisomTrade Dashboard',
		url: 'https://admin.jerisomtrade.com/connected-wallets',
	});
};

export default function ConnectedWalletsPage() {
	return (
		<DashboardLayout heading="Connected Wallets">
			<div className="mb-5">
				<div className="flex items-center justify-center">
					<ConnectedWalletsTable />
				</div>
			</div>
		</DashboardLayout>
	);
}
