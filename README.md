# push-tester

Node CLI for testing push messages

## Run

Running the script without any parameters will prompt the user for all the required data. At the end the script will ask the user if he wishes to create a configuration file from the entered data.

```
npx push-tester
```

If a configuration file is provided the script will skip asking the user for all the provided values, very useful to save time when testing subsequent push messages.

```
npx push-tester -c config.push.json
```

Show help

```
npx push-tester -h
```

## Configuration

An example of the configuration file

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
