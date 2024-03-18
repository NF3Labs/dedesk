# This is the NF3 Partner P2P Front End using NF3 SDK

## Getting started

Update the environment variables with your API key and other keys in `.env.development` following the example in `.env.sample`

```
NEXT_PUBLIC_ALCHEMY_KEY=''
NEXT_PUBLIC_PROVIDER_URL='https://eth-goerli.g.alchemy.com/v2/'
NEXT_PUBLIC_APIBASE='https://goerli-api.nf3.exchange/'
NEXT_PUBLIC_API_KEY=''
NEXT_PUBLIC_NETWORK='ETH_GOERLI'
NEXT_PUBLIC_CONTRACTS='[{ "name": "VAULT", "address": "0xc514b0FDDbdab39fdD9996Ad11f37f2D76cACC2d" }, { "name": "NF3Market", "address": "0xBC881ba2A7D6aFbcd05a4EBA3e646E30E81cAa07" }, { "name": "ETH", "address": "0x0000000000000000000000000000000000000000" }, { "name": "SigningUtils", "address": "0x0C52fE9787e0EEBDC15928Da84b5e3500B7d2035" }];'
```

To run the development server:
```bash
npm run dev
# or
yarn dev
```


