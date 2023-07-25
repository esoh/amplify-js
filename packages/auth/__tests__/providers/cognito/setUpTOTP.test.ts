// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AssociateSoftwareTokenCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { AuthError } from '../../../src/errors/AuthError';
import { AssociateSoftwareTokenException } from '../../../src/providers/cognito/types/errors';
import * as associateSoftwareTokenClient from '../../../src/providers/cognito/utils/clients/AssociateSoftwareTokenClient';
import { setUpTOTP } from '../../../src/providers/cognito';

describe('setUpTOTP API happy path cases', () => {
	let associateSoftwareTokenClientSpy;
	const secretCode = 'asfdasdfwefasdfasf';
	beforeEach(() => {
		associateSoftwareTokenClientSpy = jest
			.spyOn(associateSoftwareTokenClient, 'associateSoftwareTokenClient')
			.mockImplementationOnce(
				async (): Promise<AssociateSoftwareTokenCommandOutput> => {
					return {
						SecretCode: secretCode,
						$metadata: {},
					};
				}
			);
	});

	afterEach(() => {
		associateSoftwareTokenClientSpy.mockClear();
	});

	test('setUpTOTP API should call the UserPoolClient and should return a TOTPSetupDetails', async () => {
		const result = await setUpTOTP();
		expect(result.sharedSecret).toEqual(secretCode);
		expect(result.getSetupUri('appName', 'amplify')).toBeInstanceOf(URL);
	});
});

describe('setUpTOTP API error path cases:', () => {
	const globalMock = global as any;

	test('setUpTOTP  API should raise service error', async () => {
		expect.assertions(3);
		const serviceError = new Error('service error');
		serviceError.name =
			AssociateSoftwareTokenException.InvalidParameterException;
		globalMock.fetch = jest.fn(() => Promise.reject(serviceError));
		try {
			await setUpTOTP();
		} catch (error) {
			expect(fetch).toBeCalled();
			expect(error).toBeInstanceOf(AuthError);
			expect(error.name).toBe(
				AssociateSoftwareTokenException.InvalidParameterException
			);
		}
	});
});