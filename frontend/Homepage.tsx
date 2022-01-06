/* eslint-disable functional/no-let */
/* eslint-disable react-native/no-inline-styles */
import { HARDHAT_PORT, HARDHAT_PRIVATE_KEY, INFURA_KEY } from "@env";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import React from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import Web3 from "web3";

import LeafDapp from "../artifacts/contracts/LeafDapp.sol/LeafDapp.json";


const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center" },
  // eslint-disable-next-line react-native/no-color-literals
  white: { backgroundColor: "white" },
});

export default function App({ parentToChild }): JSX.Element {
  const connector = parentToChild;
  const account = connector.accounts[0];
  // const web3 = React.useMemo(
  //   () =>
  //     new Web3(
  //       new Web3.providers.HttpProvider(
  //         `https://ropsten.infura.io/v3/${INFURA_KEY}`
  //       )
  //     ),
  //   [INFURA_KEY]
  // );
  const provider = new Web3.providers.HttpProvider(`https://ropsten.infura.io/v3/${INFURA_KEY}`);
  const web3 = new Web3(provider);
  // const web3 = new Web3(connector);

  const [player, setPlayer] = React.useState({
    addressNFT: 0,
    lastSync: 0,
    nbDaySuccess: 0,
    oldNbStep: 0,
  });

  React.useEffect(() => {
    void (async () => {
      // const networkId = await web3.eth.net.getId();
      // const deployedNetwork = LeafDapp.networks[networkId];
      const contract = new web3.eth.Contract(
        LeafDapp.abi,
        // deployedNetwork && deployedNetwork.address
        "0xfDA842C477D3b6E34BCFBea393Ddc210C0102128"
      );      


      let bal = await contract.methods.balance().call({ from: account });
      console.log("BALANCE 1 : " + bal);

      await contract.methods.stepToLeafByAddress(account, 14837).send({ from: account });
      // await connector.signTransaction({
      //   data: '0x',
      //   from: account,
      //   gas: '0x9c40',
      //   gasPrice: '0x02540be400',
      //   nonce: '0x0114',
      //   to: '0xfDA842C477D3b6E34BCFBea393Ddc210C0102128',
      //   value: '0x00',
      // });
      console.log("BALANCE 2 : " + bal);
      bal = await contract.methods.balance().call({ from: account });
    })();
  }, [connector, web3, account]);

  const killSession = React.useCallback(() => {
    return connector.killSession();
  }, [connector]);

  return (
    <View style={[styles.center, styles.white]}>
      <Text></Text>
      <Text></Text>
      <Text></Text>

      <Text style={[styles.center, styles.white]}>Account : </Text>
      <Text>{account}</Text>
      <Button
        title="Disconnect"
        onPress={() => killSession()}
      />

    </View>
  );
}
