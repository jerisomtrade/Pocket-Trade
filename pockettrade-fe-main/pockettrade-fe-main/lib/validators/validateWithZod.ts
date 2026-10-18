import {
  KycProps,
  UpdateProfileProps,
  type ForgotPasswordProps,
  type LoginProps,
  type ResetPasswordProps,
  type SignUpProps,
  type UpdatePasswordsProps,
  type WishlistProps,
  type AddFundsProps,
  type WithdrawFundsProps,
} from "@/interfaces";
import { zxcvbn, zxcvbnAsync, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";
import { z, ZodType } from "zod";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg", // JPEG
  "image/png", // PNG
  "image/webp", // WebP
  "image/bmp", // BMP
  "image/tiff", // TIFF
  "image/svg+xml", // SVG
  "image/heic", // HEIC (Apple’s format, if supported)
  "image/svg",
];

const ACCEPTED_PAYMENT_TYPES = [
  "image/jpeg", // JPEG
  "image/png", // PNG
  "image/webp", // WebP
  "image/bmp", // BMP
  "image/tiff", // TIFF
  "image/svg+xml", // SVG
  "image/heic", // HEIC (Apple’s format, if supported)
  "image/svg",
  "application/pdf",
];

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB in bytes
const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  translations: {
    ...zxcvbnEnPackage.translations,
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  // useLevenshteinDistance: true
};
zxcvbnOptions.setOptions(options);

export const checkPasswordStrength = (password: string) =>
  zxcvbnAsync(password).then((response) => response.score);

type FormType =
  | "login"
  | "signup"
  | "resetPassword"
  | "forgotPassword"
  | "updatePasswords"
  | "updateProfile"
  | "kyc"
  | "wishlist"
  | "addFunds"
  | "withdrawFunds";

export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First Name is required" })
      .max(50, { message: "First Name must be less than 50 characters" })
      .transform((value) => {
        return (
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        ).trim();
      }),
    lastName: z
      .string()
      .min(2, { message: "Last Name is required" })
      .max(50, { message: "Last Name must be less than 50 characters" })
      .transform((value) => {
        return (
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        ).trim();
      }),
    email: z
      .string()
      .min(2, { message: "Email is required" })
      .email({ message: "Invalid email address" })
      .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
        message: "Enter a valid email",
      })
      .transform((value) => {
        return value.toLowerCase().trim();
      }),
    country: z.string().min(2, { message: "Country is required" }),
    phone: z.string().min(2, { message: "Phone number is required" }),
    isTerms: z.boolean({
      message:
        "Please ensure you have read and agreed to the terms and conditions.",
    }),
    referrerCode: z
      .string()
      .transform((val) => (val === "" ? undefined : val))
      .optional(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,!@#$%^&*\-\]\?])[A-Za-z\d.,!@#$%^&*\-\]\?]{6,}$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        }
      )
      .max(50)
      .transform((value, ctx) => {
        const options = {
          dictionary: {
            ...zxcvbnCommonPackage.dictionary,
            ...zxcvbnEnPackage.dictionary,
          },
          translations: {
            ...zxcvbnEnPackage.translations,
          },
          graphs: zxcvbnCommonPackage.adjacencyGraphs,
          // useLevenshteinDistance: true
        };
        zxcvbnOptions.setOptions(options);
        const testedResult = zxcvbn(value);

        if (testedResult.score < 3) {
          testedResult.feedback.suggestions.map((issue) => {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: issue,
            });
          });
        }

        return value.trim();
      }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be more than 6 characters" })
      .transform((value) => {
        return value.trim();
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z
    .string()

    .min(2, { message: "Email is required" })
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Enter a valid email",
    })
    .email({ message: "Invalid email address" })
    .transform((value) => {
      return value.toLowerCase().trim();
    }),
  password: z.string().transform((value) => {
    return value.trim();
  }),
});

export const wishlistSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name is required" })
    .max(20, { message: "Name must be less than 20 characters" })
    .transform((value) => {
      return (
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
      ).trim();
    }),
  symbol: z.string(),
  brand: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(2, { message: "Email is required" })
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Enter a valid email",
    })
    .email({ message: "Invalid email address" })
    .transform((value) => {
      return value.toLocaleLowerCase().trim();
    }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,!@#$%^&*])[A-Za-z\d.,!@#$%^&*]{6,}$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        }
      )
      .max(50)
      .transform((value, ctx) => {
        const options = {
          dictionary: {
            ...zxcvbnCommonPackage.dictionary,
            ...zxcvbnEnPackage.dictionary,
          },
          translations: {
            ...zxcvbnEnPackage.translations,
          },
          graphs: zxcvbnCommonPackage.adjacencyGraphs,
          // useLevenshteinDistance: true
        };
        zxcvbnOptions.setOptions(options);
        const testedResult = zxcvbn(value);

        if (testedResult.score < 3) {
          testedResult.feedback.suggestions.map((issue) => {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: issue,
            });
          });
        }

        return value.trim();
      }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,!@#$%^&*])[A-Za-z\d.,!@#$%^&*]{6,}$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        }
      )
      .max(50)
      .transform((value) => {
        return value.trim();
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updatePassWordsSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,!@#$%^&*])[A-Za-z\d.,!@#$%^&*]{6,}$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        }
      )
      .max(50)
      .transform((value, ctx) => {
        const options = {
          dictionary: {
            ...zxcvbnCommonPackage.dictionary,
            ...zxcvbnEnPackage.dictionary,
          },
          translations: {
            ...zxcvbnEnPackage.translations,
          },
          graphs: zxcvbnCommonPackage.adjacencyGraphs,
        };
        zxcvbnOptions.setOptions(options);
        const testedResult = zxcvbn(value);

        if (testedResult.score < 3) {
          testedResult.feedback.suggestions.map((issue) => {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: issue,
            });
          });
        }

        return value.trim();
      }),
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,!@#$%^&*])[A-Za-z\d.,!@#$%^&*]{6,}$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        }
      )
      .max(50)
      .transform((value, ctx) => {
        const options = {
          dictionary: {
            ...zxcvbnCommonPackage.dictionary,
            ...zxcvbnEnPackage.dictionary,
          },
          translations: {
            ...zxcvbnEnPackage.translations,
          },
          graphs: zxcvbnCommonPackage.adjacencyGraphs,
        };
        zxcvbnOptions.setOptions(options);
        const testedResult = zxcvbn(value);

        if (testedResult.score < 3) {
          testedResult.feedback.suggestions.map((issue) => {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: issue,
            });
          });
        }

        return value.trim();
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must have at least 8 characters!" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,!@#$%^&*])[A-Za-z\d.,!@#$%^&*]{6,}$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        }
      )
      .max(50)
      .transform((value) => {
        return value.trim();
      }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export const kycSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name is required" })
    .max(50, { message: "Name must be less than 50 characters" })
    .transform((value) => {
      return (
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
      ).trim();
    }),
  dob: z
    .string()
    .min(3, { message: "DOB is required" })
    .max(50, { message: "DOB must be less than 50 characters" })
    .transform((value) => {
      return (
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
      ).trim();
    }),
  nationality: z
    .string()
    .min(3, { message: "Nationality is required" })
    .max(50, { message: "Nationality must be less than 50 characters" })
    .transform((value) => {
      return (
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
      ).trim();
    }),
  address: z
    .string()
    .min(3, { message: "Address is required" })
    .max(50, { message: "Address must be less than 50 characters" })
    .transform((value) => {
      return (
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
      ).trim();
    }),
  city: z
    .string()
    .min(2, { message: "City is required" })
    .max(50, { message: "City must be less than 50 characters" })
    .transform((value) => {
      return (
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
      ).trim();
    }),
  postalCode: z
    .string()
    .min(3, { message: "Name is required" })
    .max(50, { message: "Name must be less than 50 characters" })
    .transform((value) => {
      return (
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
      ).trim();
    }),
  documentType: z
    .string()
    .min(3, { message: "Document Type is required" })
    .max(50, { message: "Document Type must be less than 50 characters" })
    .transform((value) => {
      return (
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
      ).trim();
    }),
  selfie: z
    .instanceof(File, { message: "A valid file is required" })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "File size must not exceed 10MB",
    }),
  document: z
    .instanceof(File, { message: "A valid file is required" })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "File size must not exceed 10MB",
    }),
  proofOfAddress: z
    .instanceof(File, { message: "A valid file is required" })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "File size must not exceed 10MB",
    }),
});

export const updateProfileSchema = z
  .object({
    email: z
      .string()
      // .email({ message: 'Invalid email address' })
      // .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      // 	message: 'Enter a valid email',
      // })
      .transform((value) => {
        return value.toLowerCase().trim();
      })
      .optional()
      .nullable(),
    firstName: z
      .string()
      .min(0, { message: "First Name is required" })
      .max(50, { message: "First Name must be less than 50 characters" })
      .transform((value) => {
        return (
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        ).trim();
      })
      .optional(),
    lastName: z
      .string()
      .min(0, { message: "Last Name is required" })
      .max(50, { message: "Last Name must be less than 50 characters" })
      .transform((value) => {
        return (
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        ).trim();
      })
      .optional(),
    photo: z
      .any() // Allow File or FileList
      .optional()
      .nullable()
      .refine(
        (file) => {
          // If no file is provided (undefined or null), it's valid (optional)
          if (!file) return true;

          // If file is a FileList (from input), check the first file
          if (file instanceof FileList && file.length === 0) return true; // Empty FileList is valid

          // If file is a single File or the first item in FileList
          const targetFile = file instanceof FileList ? file[0] : file;

          // Check if it's a File (not FileList or other type)
          if (!(targetFile instanceof File)) {
            return false;
          }

          // Validate file type
          const isValidType = ACCEPTED_IMAGE_TYPES.includes(targetFile.type);
          if (!isValidType) {
            return false;
          }

          // Validate file size
          const isValidSize = targetFile.size <= MAX_FILE_SIZE;
          if (!isValidSize) {
            return false;
          }

          return true;
        },
        {
          message:
            "Invalid file. Choose an image (JPEG, PNG, GIF, WebP, BMP, TIFF, or SVG) with a maximum size of 8MB.",
        }
      ),
  })
  .partial();

export const addFundsSchema = z.object({
  // amount: z
  //   .number()
  //   .min(2, { message: "Amount is required and must be a positive number" })
  //   .positive(),
  crypto: z
    .string()
    .min(3, { message: "Crypto currency is required" })
    .max(50, { message: "Crypto currency must be less than 50 characters" }),
  // address: z
  //   .string()
  //   .min(3, { message: "Crypto Address is required" })
  //   .max(50, { message: "Crypto Address  must be less than 50 characters" }),
  paymentProof: z
    .any() // Allow File or FileList
    .optional()
    .nullable()
    .refine(
      (file) => {
        // If no file is provided (undefined or null), it's valid (optional)
        if (!file) return true;

        // If file is a FileList (from input), check the first file
        if (file instanceof FileList && file.length === 0) return true; // Empty FileList is valid

        // If file is a single File or the first item in FileList
        const targetFile = file instanceof FileList ? file[0] : file;

        // Check if it's a File (not FileList or other type)
        if (!(targetFile instanceof File)) {
          return false;
        }

        // Validate file type
        const isValidType = ACCEPTED_PAYMENT_TYPES.includes(targetFile.type);
        if (!isValidType) {
          return false;
        }

        // Validate file size
        const isValidSize = targetFile.size <= MAX_FILE_SIZE;
        if (!isValidSize) {
          return false;
        }

        return true;
      },
      {
        message:
          "Invalid file. Choose a file (PDF, JPEG, PNG, WebP, BMP, TIFF, or SVG) with a maximum size of 8MB.",
      }
    ),
});

export const withdrawFundsSchema = z.object({
  // amount: z
  //   .number()
  //   .min(2, { message: "Amount is required and must be a positive number" }),
  crypto: z
    .string()
    .min(3, { message: "Crypto currency is required" })
    .max(50, { message: "Crypto currency must be less than 50 characters" }),
  // address: z
  //   .string()
  //   .min(3, { message: "Crypto Address is required" })
  //   .max(50, { message: "Crypto Address  must be less than 50 characters" }),
});

// export const zodValidator = (formType: FormType) => {
// 	switch (formType) {
// 		case 'signup':
// 			return signUpSchema;
// 		case 'login':
// 			return loginSchema;
// 		case 'forgotPassword':
// 			return forgotPasswordSchema;
// 		case 'resetPassword':
// 			return resetPasswordSchema;
// 		case 'updateProfile':
// 			return updateProfileSchema;
// 		case 'updatePasswords':
// 			return updatePassWordsSchema;
// 		default:
// 			return;
// 	}
// };

export const zodValidator = <T extends FormType>(
  type: T
): ZodType<
  T extends "login"
    ? LoginProps
    : T extends "signup"
    ? SignUpProps
    : T extends "resetPassword"
    ? ResetPasswordProps
    : T extends "forgotPassword"
    ? ForgotPasswordProps
    : T extends "updateProfile"
    ? UpdateProfileProps
    : T extends "kyc"
    ? KycProps
    : T extends "wishlist"
    ? WishlistProps
    : T extends "addFunds"
    ? AddFundsProps
    : T extends "withdrawFunds"
    ? WithdrawFundsProps
    : UpdatePasswordsProps
> => {
  const schemaMap = {
    login: loginSchema,
    signup: signUpSchema,
    resetPassword: resetPasswordSchema,
    forgotPassword: forgotPasswordSchema,
    updatePasswords: updatePassWordsSchema,
    updateProfile: updateProfileSchema,
    kyc: kycSchema,
    wishlist: wishlistSchema,
    addFunds: addFundsSchema,
    withdrawFunds: withdrawFundsSchema,
  };

  return schemaMap[type] as unknown as ZodType<
    T extends "login"
      ? LoginProps
      : T extends "signup"
      ? SignUpProps
      : T extends "resetPassword"
      ? ResetPasswordProps
      : T extends "forgotPassword"
      ? ForgotPasswordProps
      : T extends "updateProfile"
      ? UpdateProfileProps
      : T extends "kyc"
      ? KycProps
      : T extends "wishlist"
      ? WishlistProps
      : T extends "addFunds"
      ? AddFundsProps
      : T extends "withdrawFunds"
      ? WithdrawFundsProps
      : UpdatePasswordsProps
  >; // TypeScript needs this assertion to match the conditional type
};

export type SignUpType = z.infer<typeof signUpSchema>;
export type LoginType = z.infer<typeof loginSchema>;
export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordsType = z.infer<typeof updatePassWordsSchema>;
export type UpdateProfileType = z.infer<typeof updateProfileSchema>;
export type KycType = z.infer<typeof kycSchema>;
export type wishlistType = z.infer<typeof wishlistSchema>;
export type AddFundsType = z.infer<typeof addFundsSchema>;
export type WithdrawFundsType = z.infer<typeof withdrawFundsSchema>;
