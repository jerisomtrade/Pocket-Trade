import type { SignUpProps } from '@/interfaces';
import { memo } from 'react';
import type { FieldErrors } from 'react-hook-form';

type FormErrorMessageProps = {
	error?: FieldErrors<SignUpProps>;
	errorMsg?: string;
	isForPasswordStrength?: boolean;
	result?: number;
};
const FormErrorMessage = memo(({ error, errorMsg, isForPasswordStrength, result }: FormErrorMessageProps) => {
	if (isForPasswordStrength && result) {
		return (
			<div>
				<div className="h-2 w-full bg-slate-900/50 rounded-full overflow-hidden mt-1">
					<div
						className={`h-full transition-all duration-300 ${
							result < 2
								? 'bg-red-500'
								: result >= 2 && result <= 3
									? 'bg-yellow-500'
									: 'bg-emerald-500'
						}`}
						style={{ width: `${result * 25}%` }}
					/>
				</div>
				<p
					className={`${
						result <= 2 ? 'text-red-500' : result >= 2 && result <= 3 ? 'text-yellow-500' : 'text-emerald-500'
					} text-xs mt-1 font-medium`}
				>
					<span className="text-slate-400">Password strength:</span> 
					{result < 2 ? 'Weak' : result >= 2 && result <= 3 ? 'Medium' : 'Strong'}
				</p>
			</div>
		);
	} else return error && <p className="text-red-500 text-xs mt-2">{errorMsg}</p>;
});

FormErrorMessage.displayName = 'FormErrorMessage';
export default FormErrorMessage;
