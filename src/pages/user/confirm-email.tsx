import { gql, useApolloClient, useMutation } from '@apollo/client';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useMe } from '../../hooks/useMe';
import { useQueryParams } from '../../hooks/useQueryParam';
import {
	verifyEmail,
	verifyEmailVariables,
} from '../../__generated__/verifyEmail';

const VERIFY_EMAIL_MUTAITON = gql`
	mutation verifyEmail($input: VerifyEmailInput!) {
		verifyEmail(input: $input) {
			ok
			error
		}
	}
`;

export const ConfirmEmail = () => {
	const { data: userData } = useMe();
	const client = useApolloClient();
	const onCompleted = (data: verifyEmail) => {
		const {
			verifyEmail: { ok },
		} = data;
		if (ok && userData && userData.me.id) {
			client.writeFragment({
				id: `User:${userData.me.id}`,
				fragment: gql`
					fragment VerifiedUser on User {
						verified
					}
				`,
				data: {
					verified: true,
				},
			});
		}
	};
	const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(
		VERIFY_EMAIL_MUTAITON,
		{ onCompleted }
	);

	const code = useQueryParams('code');

	useEffect(() => {
		verifyEmail({
			variables: {
				input: {
					code,
				},
			},
		});
	}, []);

	return (
		<div className="h-screen flex flex-col items-center justify-center">
			<h2 className="text-lg mb-2 font-medium">Confirm email...</h2>
			<h4 className="text-gray-700 text-sm">
				Please wail, don't close this page...
			</h4>
		</div>
	);
};
