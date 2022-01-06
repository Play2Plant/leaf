/* eslint-disable react-native/no-inline-styles */
import { INFURA_KEY, HARDHAT_PORT, HARDHAT_PRIVATE_KEY } from "@env";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import React from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import Web3 from "web3";

import Homepage from "./Homepage";

// import LeafDapp from "../artifacts/contracts/LeafDapp.sol/LeafDapp.json";


const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center" },
  // eslint-disable-next-line react-native/no-color-literals
  white: { backgroundColor: "white" },
});

const shouldDeployContract = async (web3, abi, data, from: string) => {
  const deployment = new web3.eth.Contract(abi).deploy({ data });
  const gas = await deployment.estimateGas();
  const {
    options: { address: contractAddress },
  } = await deployment.send({ from, gas });
  return new web3.eth.Contract(abi, contractAddress);
};

export default function App(): JSX.Element {
  const connector = useWalletConnect();
  const web3 = React.useMemo(
    () =>
      new Web3(
        new Web3.providers.HttpProvider(
          `https://ropsten.infura.io/v3/${INFURA_KEY}`
        )
      ),
    [INFURA_KEY]
  );
  const [account, setAccount] = React.useState("");
 

  const connectWallet = React.useCallback(() => {   
    const connect = connector.connect();
    setAccount(connector.accounts[0]);
    return connect;
  }, [connector, account]);

  React.useEffect(() => {
    void (async () => {
      if (connector.connected) {
        setAccount(connector.accounts[0]);
      }
    })();
  }, [account]);

  return (

    <View>
      {connector.connected && <Homepage parentToChild = { connector }/>}

      {!connector.connected &&
        <View style={[styles.center, styles.white]}>
          <Text></Text>
          <Text></Text>
          <Text></Text>
          <Text style={{ fontSize: 24 }}>Play 2 Plant</Text>
          <Text>Fais du sport, plante des arbres,</Text>
          <Text>et gagne de la crypto.</Text>
          <Image source={require('./imgs/tree333-1.png')} />
          <Button
            title="Connect"
            onPress={() => connectWallet()}
          />
        </View>
      }
    </View>
  );
}
