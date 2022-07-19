export type DuskProgram = {
  "version": "0.1.0",
  "name": "dusk_program",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    },
    {
      "name": "sendDonate",
      "accounts": [
        {
          "name": "donate",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "feeAddress",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "streamerAddress",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "message",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "donate",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "streamerAddress",
            "type": "publicKey"
          },
          {
            "name": "message",
            "type": "string"
          },
          {
            "name": "splToken",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "timestamps",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "MessageTooLong",
      "msg": "The message should be 360 characters long maximum."
    },
    {
      "code": 6001,
      "name": "InvalidFeeAddressProvided",
      "msg": "Invalid fee address provided."
    }
  ]
};

export const IDL: DuskProgram = {
  "version": "0.1.0",
  "name": "dusk_program",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    },
    {
      "name": "sendDonate",
      "accounts": [
        {
          "name": "donate",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "feeAddress",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "streamerAddress",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "message",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "donate",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "streamerAddress",
            "type": "publicKey"
          },
          {
            "name": "message",
            "type": "string"
          },
          {
            "name": "splToken",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "timestamps",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "MessageTooLong",
      "msg": "The message should be 360 characters long maximum."
    },
    {
      "code": 6001,
      "name": "InvalidFeeAddressProvided",
      "msg": "Invalid fee address provided."
    }
  ]
};
