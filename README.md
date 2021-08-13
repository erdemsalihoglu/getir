## Table of Contents

- [Provided End Points](#provided-end-points)
  - [Get Key Totals](#get-key-totals)
- [Getting Started](#getting-started)
- [Development](#development)

## Provided End Points

### Get Key Totals

To get key totals, send a post request with JSON body including the following parameters. Please see challenge description for details of the fields.
- "startDate”
- “endDate”
- "minCount"
- "maxCount"

Sample request:

```bash
curl -X POST \
  http://localhost:3000/api/v1/keys/totals \
  -H 'content-type: application/json' \
  -d '{"startDate": "2016-01-26",  "endDate": "2018-02-02",  "minCount": 2700,  "maxCount": 3000  }'
```

A sample successful response will be as follows:

```json
{
    "code": 0,
    "msg": "Success",
    "records": [
        {
            "key": "bxoQiSKL",
            "createdAt": "2016-01-29T01:59:53.494Z",
            "totalCounts": 2991
        },
        {
            "key": "NOdGNUDn",
            "createdAt": "2016-01-28T07:10:33.558Z",
            "totalCounts": 2813
        }
    ]
}
```

If an error happens, the code parameter will be an integer other than 0. Please see a sample response as follows:

```json
{
    "code": 400,
    "msg": "startDate must in YYYY-MM-DD format."
}
```

List of currently supported response codes with explanations
400: Bad request. E.g., request parameters are invalid. See msg for error details.
404: An unsupported resource is queried.
500: Internal error. E.g., unexpected error from database.

## Getting Started

Clone the repo

```bash
git clone https://github.com/erdemsalihoglu/getir.git
```
Install node modules

```bash
npm install
```

Start the server. 

```bash
npm start
```

## Development

Using linter

```bash
npm run start
```

Testing unit/integration tests

```bash
npm run test
```
