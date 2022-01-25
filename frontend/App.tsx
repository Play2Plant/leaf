/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import React from "react";
import {
  Button,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Homepage from "./Homepage";

export default function App(): JSX.Element {
  const connector = useWalletConnect();
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
      {connector.connected && <Homepage parentToChild={connector} />}

      {!connector.connected && (
        <View>
          <ImageBackground
            style={{
              alignItems: "center",
              height: "100%",
              justifyContent: "center",
              width: "100%",
            }}
            source={require("./imgs/forest-background-4.jpeg")}
          >
            <Text style={styles.greenTextTitle}>Play 2 Plant</Text>
            <Text style={styles.textFormat}>Marche, plante des arbres et</Text>
            <Text style={styles.textFormat}>gagne des LEAFs</Text>
            <Image
              style={{ height: 250, marginBottom: 20, width: 250 }}
              source={require("./imgs/Play_to_Plan_1.gif")}
            />
            <Button
              title="Se connecter à wallet"
              onPress={() => connectWallet()}
            />
          </ImageBackground>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  greenTextTitle: {
    color: "#096A09",
    fontSize: 30,
    fontWeight: "bold",
    margin: 2,
  },

  textFormat: {
    color: "#0D3833",
    fontSize: 20,
    fontWeight: "bold",
    margin: 2,
  },
});
