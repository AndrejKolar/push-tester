# push-tester

`npx` script for testing push messages, no installation required, supports iOS & Android

Supported push message types:

- iOS `.p8` Provider Authentication Tokens
- iOS `.pem` certificate/key pairs
- iOS/Android Firebase Cloud Messages `FCM` (also supports `GCM`)

## Requirements

The only requirement is having [Node.js](https://nodejs.org/) installed with the `npm` version that supports `npx`

## Use

```
npx push-tester
```

Running the script without any parameters will show the wizard that will guide the user to select the push message type and to enter all the required data. At the end of the wizard it will prompt the user if he wants to save the inputed data into a configuration file.

```
npx push-tester -c config.push.json
```

Use the `-c` flag to provide a configuration file when running the script. It will skip the wizard and immediately send a push message.

```
npx push-tester -h
```

To show help run the script with the `-h` flag

## Configuration

Example configuration file for iOS Provider Authentication Tokens (`.p8`)

```
{
  "keyId": "KEY_ID",
  "teamId": "TEAM_ID",
  "key": "./apns.p8",
  "bundleId": "com.example.app",
  "production": false,
  "pushToken": "PUSH_TOKEN",
  "title": "test title",
  "body": "test body",
  "badge": 3,
  "sound": "default",
  "type": "p8"
}
```

Example configuration file for iOS cert/key pairs (`.pem`)

```
{
  "cert": "./cert.pem",
  "key": "./key.pem",
  "bundleId": "com.example.app"
  "pushToken": "PUSH_TOKEN",
  "title": "title",
  "body": "body",
  "badge": 1,
  "sound": "default",
  "type": "pem",
}
```

Example configuration file for iOS/Android Firebase Cloud Messaging (`FCM`/`GCM`)

```
{
  "key": "KEY",
  "pushToken": "PUSH_TOKEN",
  "title": "title",
  "body": "body",
  "type": "firebase"
}
```

### iOS .pem cert/key pairs

For iOS push messages it's recommended to use Provider Authentication Tokens (`.p8`), but if you are still using cert/key pairs convert the `cert.cer` certificate and the `key.p12` private key to `.pem` files.

Download the `.cer` file from [Apple Developer](https://developer.apple.com) and import it to the keychain (needs to be the same keychain where the certificate signing request for the push cert was created).
Export the `.p12` private key from the certificate

In the directory with both the `cert.cer` and `key.p12` run the following commands to create `.pem` files

```
openssl x509 -in cert.cer -inform DER -outform PEM -out cert.pem
openssl pkcs12 -in key.p12 -out key.pem -nodes

```

To test the certificates run

```
openssl s_client -connect gateway.push.apple.com:2195 -cert cert.pem -key key.pem
```
