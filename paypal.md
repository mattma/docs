# Paypal

## [Online Demo](https://demo.paypal.com/us/demo/navigation)
## [API](https://developer.paypal.com/docs/api/#sales)

## [Sandbox site](https://www.sandbox.paypal.com/home)

It used for a mock transaction that behaves exactly like a transaction in the live environment.

Create one or more [test accounts](https://developer.paypal.com/developer/accounts), then use them to access **Sandbox > Accounts page**.

Then, Format your PayPal API requests using the details from your test accounts and run them against the Sandbox endpoint(s). Review the responses and modify your application as necessary. When your application is fully functional and free of bugs, go live by updating the API credentials and endpoint targets.

- background story

The Sandbox supports two different test account types:

Personal, represents the buyer, or sender, in a transaction.
Business, represents the merchant, or receiver, in a transaction.

## [API Test Credentials](https://developer.paypal.com/docs/classic/lifecycle/sb_credentials/)

The PayPal Sandbox and Live environments each use different sets of API credentials. Be sure to use the correct set of credentials for the endpoints you’re addressing.

- REST API apps

Create an [new app](https://developer.paypal.com/developer/applications)

ex:

```bash
Sandbox account: matt@mattmadesign.com
Client ID: AfTp5MrHxtPLM_QX-vEc-W3z9Ex6b_Kaq9g9Tnz1oAKKiW759B6yNgUAMPD7vwsJGhgzBWDvT1DZmUVV
Secret: EGBHBs5fMTZJAgvjScN-o2WV4fbsmJ760SF87lrOP1ESZai_FirCgnJHVMNTqCXNsx74XTPJdGCO20gA
```

## Pay step

[Rest API references](https://developer.paypal.com/docs/api/#sales)

**Step 1: get access token**

```bash
curl -v https://api.sandbox.paypal.com/v1/oauth2/token -H "Accept: application/json" -H "Accept-Language: en_US" -u "AfTp5MrHxtPLM_QX-vEc-W3z9Ex6b_Kaq9g9Tnz1oAKKiW759B6yNgUAMPD7vwsJGhgzBWDvT1DZmUVV:EGBHBs5fMTZJAgvjScN-o2WV4fbsmJ760SF87lrOP1ESZai_FirCgnJHVMNTqCXNsx74XTPJdGCO20gA" -d "grant_type=client_credentials"
```


**Step 2: Make payment by using Access Token**

```bash
curl -v https://api.sandbox.paypal.com/v1/payments/payment -H 'Content-Type: application/json' -H 'Authorization: Bearer A101.5XWNZPnmS4oj7YaElVb2viDgpmUj78NGEvpwfTyckm01_Y5elm33fzQHrDMYsjqA.6KwJsUpmV1_0SaIMV90Rn2JAUVy' -d '{ "intent":"sale", "redirect_urls":{ "return_url": "http://naohai.kuberc.io", "cancel_url":"http://google.com" }, "payer":{ "payment_method":"paypal" }, "transactions":[ { "amount":{ "total":"100", "currency":"USD" } } ] }'
```

If the call is successful, PayPal returns a confirmation of the transaction with the `state` set to `created`.

**Step 3: User log on paypal to approve the payment**

Be aware that you must complete two additional steps to finalize and capture the PayPal payment.

[Accept a PayPal payment](https://developer.paypal.com/docs/integration/web/accept-paypal-payment/) contains all the details needed to complete the PayPal payment flow.

- Get payment approval

Step2 should generate a URL, Direct the user to the `approval_url` on the PayPal site, so that the user can approve the payment. The user must approve the payment before you can execute and complete the sale.

**Step 4: Execute the payment**

When the user approves the payment, PayPal redirects the user to the return_url that was specified when the payment was created. A payer Id and payment Id are appended to the return URL, as PayerID and paymentId:

```bash
http://<return_url>?paymentId=PAY-17909937BC8157622K3H6ELY&token=EC-46S041091U285223S&PayerID=VJFB925GW3VX6
```

To execute the payment after the user’s approval, make a `/payment/execute/` call. In the body of the request, use the `payer_id` value that was appended to the return URL. In the header, use the access token that you used when you created the payment.

The `token` value appended to the return URL is not needed when you execute the payment.

```bash
curl -v https://api.sandbox.paypal.com/v1/payments/payment/<paymentId>/execute/ -H 'Content-Type: application/json' -H 'Authorization: Bearer <accessToken>' -d '{ "payer_id" : "<PayerID>" }'
```

```bash
# Payment example
curl -v https://api.sandbox.paypal.com/v1/payments/payment/PAY-2H11619340618514CK3H6SDY/execute  -H 'Content-Type: application/json' -H 'Authorization: Bearer A101.5XWNZPnmS4oj7YaElVb2viDgpmUj78NGEvpwfTyckm01_Y5elm33fzQHrDMYsjqA.6KwJsUpmV1_0SaIMV90Rn2JAUVy' -d '{ "payer_id" : "VJFB925GW3VX6" }'
```

If the call is successful, PayPal returns a confirmation of the transaction with the `state` set to `approved`.

Note: Once a payment is complete, it is referred to as a sale. You can then look up the sale and refund it.

- What is next?

https://developer.paypal.com/docs/integration/web/accept-paypal-payment/
