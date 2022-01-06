/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("dotenv/config");
require('ethereumjs-tx');

const { HARDHAT_PORT, HARDHAT_PRIVATE_KEY, INFURA_KEY } = process.env;

module.exports = {
  solidity: "0.8.10",
  networks: {
    // localhost: { url: `http://127.0.0.1:${HARDHAT_PORT}` },
    // hardhat: {
    //   // accounts: [{"privateKey":"0xcc05a60e6649d65b003f0d0275d7d128d9196b91bb1e1b818d526343533180d8","balance":"1000000000000000000000"},{"privateKey":"0xe082daa0683dcb5c57f6fb9fc6a6dfd145c97d8b01bc944aea123b954643ba88","balance":"1000000000000000000000"},{"privateKey":"0x8cf34abc136793e63cb8825cea0696a7919af10302d8745ef2cd6348d219e865","balance":"1000000000000000000000"},{"privateKey":"0x9b2dd5bd510de656735b27288d6576a6d628975a048ed884585331e30eafaea7","balance":"1000000000000000000000"},{"privateKey":"0x6f59315df4cda489d77c0d7757feaecfcd1e3aa3249e57feae576c9baaa9d745","balance":"1000000000000000000000"},{"privateKey":"0xdf3a245e984712f40820b0a493c21cdf373d10fb9b6e1ac7281d2c6b20b91e88","balance":"1000000000000000000000"},{"privateKey":"0x6b565da6864716784c6639a9994c67e88947e8cfaf66e28fbcf64bdf4f79ceec","balance":"1000000000000000000000"},{"privateKey":"0x74279ba84744edd947f345dad7737ba396bc9252cab0c36e2bbedd91ca5af1b2","balance":"1000000000000000000000"},{"privateKey":"0xde7a088ad43ed0204b46a28a93beeda52876d1837cdecacd47c4b33c32481893","balance":"1000000000000000000000"},{"privateKey":"0x563366b4673b0e4643fe3c54db37ec79c3da570985ca53cb360965f0bed426d5","balance":"1000000000000000000000"}]
    //   accounts: [`${HARDHAT_PRIVATE_KEY}`]
    // },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
      accounts: [`${HARDHAT_PRIVATE_KEY}`]
    }
  },
  paths: {
    sources: './contracts',
    tests: './__tests__/contracts',
    cache: './cache',
    artifacts: './artifacts',
  },
};