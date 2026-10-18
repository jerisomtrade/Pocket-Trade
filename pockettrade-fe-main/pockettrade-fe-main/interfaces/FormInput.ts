export type SignUpProps = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phone: string;
  password: string;
  confirmPassword: string;
  isTerms: boolean;
  referrerCode?: string;
};

export type LoginProps = {
  email: string;
  password: string;
};

export type ResetPasswordProps = {
  password: string;
  confirmPassword: string;
};

export type ForgotPasswordProps = {
  email: string;
};

export type UpdatePasswordsProps = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type UpdateProfileProps = {
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  photo?: File | null;
};

export type OtpVerificationProps = {
  otp: string;
};

export type KycProps = {
  name: string;
  dob: string;
  nationality: string;
  address: string;
  city: string;
  postalCode: string;
  documentType: string;
  selfie: File;
  document: File;
  proofOfAddress: File;
};

export type WishlistProps = {
  name: string;
  symbol: string;
  brand: string;
};

export type AddFundsProps = {
  //amount: number;
  crypto: string;
  //address: string;
  paymentProof?: File | null;
};

export type WithdrawFundsProps = {
  //amount: number;
  crypto: string;
  //address: string;
};
