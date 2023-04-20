// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type {
	ConfirmForgotPasswordCommandInput,
	ConfirmForgotPasswordCommandOutput,
	ForgotPasswordCommandInput,
	ForgotPasswordCommandOutput,
	ResendConfirmationCodeCommandInput,
	ResendConfirmationCodeCommandOutput,
	SignUpCommandInput,
	SignUpCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { AuthError } from '../../../../errors/AuthError';
import { assertServiceError } from '../../../../errors/utils/assertServiceError';

const USER_AGENT = 'amplify test';

export type ClientInputs =
	| SignUpCommandInput
	| ForgotPasswordCommandInput
	| ConfirmForgotPasswordCommandInput
	| ResendConfirmationCodeCommandInput;
export type ClientOutputs =
	| SignUpCommandOutput
	| ForgotPasswordCommandOutput
	| ConfirmForgotPasswordCommandOutput
	| ResendConfirmationCodeCommandOutput;
export type ClientOperations =
	| 'SignUp'
	| 'ConfirmSignUp'
	| 'ForgotPassword'
	| 'ConfirmForgotPassword'
	| 'ResendSignUpConfirmationCode';

export class UserPoolHttpClient {
	private _endpoint: string;
	private _headers = {
		'Content-Type': 'application/x-amz-json-1.1',
		'X-Amz-User-Agent': USER_AGENT,
		'Cache-Control': 'no-store',
	};

	constructor(region: string) {
		this._endpoint = `https://cognito-idp.${region}.amazonaws.com/`;
	}

	async send<T extends ClientOutputs>(
		operation: ClientOperations,
		input: ClientInputs
	): Promise<T> {
		const headers = {
			...this._headers,
			'X-Amz-Target': `AWSCognitoIdentityProviderService.${operation}`,
		};
		const options: RequestInit = {
			headers,
			method: 'POST',
			mode: 'cors',
			body: JSON.stringify(input),
		};
		try {
			return (await (await fetch(this._endpoint, options)).json()) as T;
		} catch (error) {
			assertServiceError(error);
			throw new AuthError({ name: error.name, message: error.message });
		}
	}
}