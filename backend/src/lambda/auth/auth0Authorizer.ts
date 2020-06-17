
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify } from 'jsonwebtoken';
import { JwtToken } from '../../auth/JwtToken';

const cert = `-----BEGIN CERTIFICATE-----
MIIC/zCCAeegAwIBAgIJZM5unLqDP8WIMA0GCSqGSIb3DQEBCwUAMB0xGzAZBgNV
BAMTEnZkaHVnLnVzLmF1dGgwLmNvbTAeFw0yMDA2MTQxNjU3MDVaFw0zNDAyMjEx
NjU3MDVaMB0xGzAZBgNVBAMTEnZkaHVnLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZI
hvcNAQEBBQADggEPADCCAQoCggEBAJyS00zxh17TGyC2hWLJOwIrMTBIcrHFa4/+
wM1LTnPc+HxUuMWKr+tN6DME1vAnnEHDr6aAM++fJpwdpS+lUHRlWmddOTbC214O
5d4Mz3rju+WaJKmmaqmkPmUfPbSfHEgRQNSwPeI9DJDGKfDgRXkBm9m+X2Rtvsmj
8abfWm5EIavnAw4Lt+Wxe38WYoE0FYfN+rS+ULmNrabOi95PJ1Jh+VOZlVwSyWSk
266G5FwZb7KPtPi1SBLLAzD3WkVXtPOaLPtoSLL/NaYBI6mdQactq+UcZjfpcHEF
KD3u3YI4zOXYdmkAAM67lzM8Mp1trfMPFgA/8g48e3N5gBa1jcECAwEAAaNCMEAw
DwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUdOudlx13xEuT61ZMROWj4uDF3WAw
DgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQCK6RalQACWAs8GdQTe
yAK4Us7m5WQa5KMhBomrSSp7Q5wXFon8Z108T0Gatyi9q/j1vRUjRAdWobNDCMnl
Cxn8LkEzpXeMVrsIm/yCYfBdmPASe/JOUaciOtzzqy2bOG3IxPBC8TyyN8SI5Ys1
XJwMNarfrc7mobB/SZSynnr9xl+lvGJj0JACOweMSuLtLlLwMqSVexyWdt/htkFl
sqoX+rjUXwfQ16XDC68YPIYEwnC47TiqsBa+wQMok9H1PTuIPu0F4j7fcapH9PTq
SdTQnXhmxuWVaYosogjYRwLpvkfFcNCY3I9kloV7zt8y4fPpaMjamdNw66TXAU5T
/7Ty
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  console.log("On authorizer")
    try {
        const decodedToken = verifyToken(event.authorizationToken)

        return {
            principalId: decodedToken.sub,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*'
                    }
                ]
            }
        }
    } catch (e) {
        console.log("User was not authorized", e.message);
        
        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        }
    }
}

function verifyToken (authHeader: string): JwtToken {
  if (!authHeader)
      throw new Error("No authorization header");

  if (!authHeader.toLocaleLowerCase().startsWith('bearer '))
      throw new Error("Invalid authorization header");

  const split = authHeader.split(' ');
  const token = split[1];

  return verify(
              token,           // Token from an HTTP header to validate
              cert,            // A certificate copied from Auth0 website
              { algorithms: ['RS256'] } // We need to specify that we use the RS256 algorithm
            ) as JwtToken
}