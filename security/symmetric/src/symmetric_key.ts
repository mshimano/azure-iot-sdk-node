// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';
import { Callback, callbackToPromise, SharedAccessSignature, anHourFromNow } from 'azure-iot-common';
import { ArgumentError } from 'azure-iot-common/lib/errors';

/**
 * @private
 */
export class SymmetricKeySecurityClient  {

  private _registrationId: string;
  private _symmetricKey: string;
  private _sas: SharedAccessSignature;

  constructor(symmetricKey: string, registrationId: string) {
    this._symmetricKey = symmetricKey;
    this._registrationId = registrationId;
  }


  /**
   * @method           module:azure-iot-security-symmetric-key.SymmetricKeySecurityClient#getRegistrationId
   * @description      Returns the registrationId originally provided to the client.
   * @param {function}          callback        Invoked upon completion of the operation.
   *                                            If the err argument is non-null then the registrationId
   *                                            parameter will be undefined.
   */
  getRegistrationId(callback?: Callback<string>): Promise<string> | void {
    return callbackToPromise((_callback) => {
      _callback(null, this._registrationId);
    }, callback);
  }

  /**
   * @method           module:azure-iot-security-symmetric-key.SymmetricKeySecurityClient#createAuthenticationToken
   * @description      Returns a SAS token constructed from an id scope and the symmetric key
   *
   * @param {string}            idScope         Used to provide scope into the dps instance.
   * @param {function}          callback        Invoked upon completion of the operation.
   *                                            If the err argument is non-null then the sas token
   *                                            parameter will be undefined.
   */
  createAuthenticationToken(idScope: string, callback?: Callback<SharedAccessSignature>): Promise<SharedAccessSignature> | void {
    return callbackToPromise((_callback) => {
      /*Codes_SRS_NODE_SYMMETRIC_KEY_SECURITY_CLIENT_06_005: [Will throw `ReferenceError` if `idScope` parameter is falsy. ] */
      if (!idScope) {
        throw new ReferenceError('idScope is ' + idScope);
      }
      /*Codes_SRS_NODE_SYMMETRIC_KEY_SECURITY_CLIENT_06_006: [The `idScope` parameter must be of type string.] */
      if (typeof idScope !== 'string') {
        throw new ArgumentError('idScope must be of type string');
      }
      this._sas = SharedAccessSignature.create(idScope + '/registrations/' + this._registrationId, 'registration', this._symmetricKey, anHourFromNow());
      _callback(null, this._sas);
    }, callback);
  }
}
