import type { Metadata } from "next";
import { generatePageMetadata } from "@/components/common/PageMetaData";
import { callApi } from "@/lib/helpers";
import { ApiResponse } from "@/interfaces";
import InvestmentDetailClient from "@/components/InvestmentDetail";
import { UserInvestment } from "@/interfaces/ApiResponse";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const { data: responseData, error } = await callApi<
      ApiResponse<UserInvestment[]>
    >(`/investment/find?investmentId=${id}`);

    if (error || !responseData?.data?.[0]) {
      return generatePageMetadata({
        title: "Investment Details | Jerisom Trade",
        content:
          "View detailed information about your investment and track its performance.",
        url: `https://jerisomtrade.com/dashboard/investments/${id}`,
      });
    }

    const investment = responseData.data[0];

    return generatePageMetadata({
      title: `${investment.name} (${investment.symbol}) | Jerisom Trade`,
      content: `Track the performance of your ${investment.name} investment. Monitor real-time price updates, total value, and profit/loss metrics.`,
      url: `https://jerisomtrade.com/dashboard/investments/${id}`,
    });
  } catch (error) {
    return generatePageMetadata({
      title: "Investment Details | Jerisom Trade",
      content:
        "View detailed information about your investment and track its performance.",
      url: `https://jerisomtrade.com/dashboard/investments/${id}`,
    });
  }
}

export default async function InvestmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InvestmentDetailClient investmentId={id} />;
}
