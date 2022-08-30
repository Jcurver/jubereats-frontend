import React from 'react';
import { ApolloError, gql, useMutation } from '@apollo/client';
import { useForm, useFormState } from 'react-hook-form';
import { FormError } from '../components/form-error';
import ubereatslogo from '../images/ubereatslogo.svg';
import { UserRole } from '../__generated__/globalTypes';
import {
	loginMutation,
	loginMutationVariables,
} from '../__generated__/loginMutation';
import { Button } from '../components/button';
import { Link, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
	createAccountMutation,
	createAccountMutationVariables,
} from '../__generated__/createAccountMutation';

const CREATE_ACCOUNT_MUTATION = gql`
	mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
		createAccount(input: $createAccountInput) {
			ok
			error
		}
	}
`;

interface ICreateAccountForm {
	email: string;
	password: string;
	role: any;
}

export const CreateAccount = () => {
	const {
		register,
		getValues,
		formState: { errors, isValid },
		handleSubmit,
	} = useForm<ICreateAccountForm>({
		mode: 'onChange',
		defaultValues: {
			role: UserRole.Client,
			email: '',
		},
	});

	const history = useHistory();
	const onCompleted = (data: createAccountMutation) => {
		const {
			createAccount: { ok, error },
		} = data;
		if (ok) {
			history.push('/');
		}
	};
	const [
		createAccountMutation,
		{ loading, data: createAccountMutationResult },
	] = useMutation<createAccountMutation, createAccountMutationVariables>(
		CREATE_ACCOUNT_MUTATION,
		{ onCompleted }
	);
	const onSubmit = () => {
		if (loading) return;
		const { email, password, role } = getValues();
		createAccountMutation({
			variables: {
				createAccountInput: { email, password, role },
			},
		});
	};
	return (
		<div className="h-screen flex items-center flex-col mt-10 lg:mt-28 ">
			<Helmet>
				<title>Create Account | JuberEats</title>
			</Helmet>
			<div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
				<img src={ubereatslogo} className="w-60 mb-10" />
				<h4 className="w-full font-medium text-left text-3xl mb-5">
					Let's get started
				</h4>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="grid gap-3 mt-5 w-full mb-3"
				>
					<input
						{...register('email', {
							required: 'Email is required',
							pattern:
								/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
						})}
						name="email"
						type="email"
						placeholder="Email"
						className="input"
					/>
					{errors.email && errors.email.message && (
						<FormError errorMessage={errors.email.message} />
					)}
					{errors.email && errors.email.type === 'pattern' && (
						<FormError errorMessage="email pattern is wrong" />
					)}
					<input
						{...register('password', { required: 'Password is required' })}
						name="password"
						type="password"
						placeholder="Password"
						className="input"
					/>
					{errors.password && errors.password.message && (
						<FormError errorMessage={errors.password.message} />
					)}
					<select className="input" {...register('role', { required: true })}>
						{Object.keys(UserRole).map((role) => (
							<option>{role}</option>
						))}
					</select>
					<Button
						canClick={isValid}
						loading={loading}
						actionText={'Create Account'}
					/>
					{createAccountMutationResult &&
						createAccountMutationResult.createAccount.error && (
							<FormError
								errorMessage={createAccountMutationResult.createAccount.error}
							/>
						)}
				</form>
				<div>
					Already have an account?{' '}
					<Link to="/" className="text-lime-600 hover:underline">
						Log in now
					</Link>
				</div>
			</div>
		</div>
	);
};
