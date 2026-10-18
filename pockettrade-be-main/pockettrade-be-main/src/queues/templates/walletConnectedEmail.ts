import { baseTemplate } from './baseTemplate';

export const WalletConnectedEmail = (data: { name: string; walletType: string }) => {
	return baseTemplate(
		`
        <div style="color: #51545E; font-size: 16px; line-height: 1.6;">
          <h2 style="color: #1D4ED8; font-size: 24px; font-weight: 600; margin: 0 0 15px;">Hello, ${data.name}!</h2>
          <p style="margin: 0 0 20px;">
            We've received your <strong style="color: #1D4ED8;">${data.walletType}</strong> wallet connection request. Our security team is reviewing it and your wallet will be linked to your account once verification is complete.
          </p>

          <div style="background-color: #F9FAFB; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #6B7280;">Wallet Provider: <strong>${data.walletType}</strong></p>
            <p style="margin: 10px 0 0; font-size: 14px; color: #6B7280;">Status: <strong style="color: #D97706;">Pending Verification</strong></p>
          </div>

          <p style="margin: 0 0 20px;">
            This process typically takes <strong>a few days</strong>. You'll receive a follow-up notification once your wallet has been successfully verified and connected.
          </p>

          <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
            <tr>
              <td align="center">
                <a href="https://www.jerisomtrade.com/dashboard" class="button" style="background-color: #1D4ED8; border-radius: 20px; color: #ffffff; display: inline-block; text-decoration: none; padding: 14px 40px; font-weight: bold; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  Go to Dashboard
                </a>
              </td>
            </tr>
          </table>

          <p style="margin: 0 0 20px;">
            If you did not initiate this request, please contact our <a href="https://www.jerisomtrade.com/support" style="color: #3B82F6; text-decoration: none; font-weight: 500;">Support Team</a> immediately.
          </p>

          <p style="margin: 0; font-weight: 500;">
            Best regards,<br />
            The JerisomTrade Team
          </p>
        </div>
        `
	);
};
