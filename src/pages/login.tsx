import React from 'react';
import { ApolloError, gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { FormError } from '../components/form-error';
import ubereatslogo from '../images/ubereatslogo.svg';
import {
	loginMutation,
	loginMutationVariables,
} from '../__generated__/loginMutation';
import { Button } from '../components/button';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { authTokenVar, isLoggedInVar } from '../apollo';
import { LOCALSTORAGE_TOKEN } from '../constants';

const LOGIN_MUTATION = gql`
	mutation loginMutation($loginInput: LoginInput!) {
		login(input: $loginInput) {
			ok
			token
			error
		}
	}
`;

interface ILoginForm {
	email: string;
	password: string;
}

export const Login = () => {
	const {
		register,
		getValues,
		formState: { errors, isValid },
		handleSubmit,
	} = useForm<ILoginForm>({ mode: 'onChange' });

	const onCompleted = (data: loginMutation) => {
		const {
			login: { error, ok, token },
		} = data;
		if (ok && token) {
			localStorage.setItem(LOCALSTORAGE_TOKEN, token);
			authTokenVar(token);
			isLoggedInVar(true);
		}
	};

	const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
		loginMutation,
		loginMutationVariables
	>(LOGIN_MUTATION, {
		onCompleted,
	});

	const onSubmit = () => {
		if (loading) return;
		const { email, password } = getValues();
		loginMutation({
			variables: {
				loginInput: {
					email,
					password,
				},
			},
		});
	};
	
	console.log('isValid:: ', isValid);
	return (
		<div className="h-screen flex items-center flex-col mt-10 lg:mt-28 ">
			<Helmet>
				<title>Login | JuberEats</title>
			</Helmet>
			<div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
				<img src={ubereatslogo} className="w-60 mb-10" />
				<h4 className="w-full font-medium text-left text-3xl mb-5">
					Welcome back
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
						className="input "
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
					<Button canClick={isValid} loading={loading} actionText={'Log In'} />
					{loginMutationResult && (
						<FormError errorMessage={loginMutationResult.login.error} />
					)}
				</form>
				<div>
					New to JuberEats?{' '}
					<Link to="/create-account" className="text-lime-600 hover:underline">
						Create an Account
					</Link>
				</div>
			</div>
		</div>
	);
};
