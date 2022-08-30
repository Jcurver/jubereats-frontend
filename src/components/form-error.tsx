import React from 'react';

interface IFormErrorProps {
	errorMessage: string | null | undefined;
}

export const FormError: React.FC<IFormErrorProps> = ({ errorMessage }) => {
	return <span className="font-medium text-red-500">{errorMessage}</span>;
};
