import type { Metadata } from 'next';

interface MetaDataProps {
	title: string;
	content: string;
	image?: string;
	url?: string;
}

export function generatePageMetadata({ title, content, image, url }: MetaDataProps): Metadata {
	const defaultImage = '/jerisom.png';

	return {
		title: `${title}`,
		description: content,
		openGraph: {
			type: 'website',
			siteName: 'JerisomTrade dashboard',
			locale: 'en_US',
			title: `${title}`,
			description: content,
			url: url || 'https://admin.jerisomtrade.com',
			images: [
				{
					url: 'https://www.admin.jerisomtrade.com/opengraph-image.png',
					width: 1200,
					height: 630,
					alt: 'JerisomTrade Open Graph Image',
				},
			],
		},
		twitter: {
			card: image || defaultImage ? 'summary_large_image' : 'summary',
			title: `${title}`,
			description: content,
			images: ['jerisom.png'],
		},
		other: {
			'og:locale': 'en_US',
		},
		metadataBase: new URL('https://www.admin.jerisomtrade.com'),
	};
}
