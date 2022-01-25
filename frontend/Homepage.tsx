/* eslint-disable import/order */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { INFURA_KEY } from "@env";
import React from "react";
import { useState } from "react";
import {
  Button,
  Image,
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Web3 from "web3";
import LeafDapp from "../artifacts/contracts/LeafDapp.sol/LeafDapp.json";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export default function App({ parentToChild }): JSX.Element {
  const connector = parentToChild;
  const account = connector.accounts[0];
  const provider = new Web3.providers.HttpProvider(
    `https://ropsten.infura.io/v3/${INFURA_KEY}`
  );
  const web3 = new Web3(provider);

  const [contract, setContract] = React.useState(null);
  const [contractAddress, setContractAddress] = React.useState("");

  const [isPlayer, setIsPlayer] = React.useState(false);
  const [balance, setBalance] = useState("0");
  const [nftSupply, setNftSupply] = useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const accountText =
    account.substring(0, 5) +
    "..." +
    account.substring(account.length - 4, account.length);

  const [player, setPlayer] = React.useState({
    lastUpdateDate: 0,
    level: 0,
    nbDaySuccess: 0,
    oldNbStep: 0,
    totalNbStep: 0,
    uriIpfs: [],
  });
  const [nftJson, setNftJson] = useState({
    description: "",
    edition: 1,
    image: "",
    name: "",
  });

  React.useEffect(() => {
    void (async () => {
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = LeafDapp.networks[networkId];
      setContractAddress(deployedNetwork.address);

      const instance = new web3.eth.Contract(
        LeafDapp.abi,
        deployedNetwork && deployedNetwork.address
      );

      setContract(instance);

      await instance.methods
        .getPlayer()
        .call({ from: account })
        .then((result) => {
          setIsPlayer(true);
          setPlayer(result);
          uploadNftJson(result);

          // console.log(result);
        })
        .catch((error) => {
          setIsPlayer(false);
          console.error("Error in useEffect : " + error);
        });
    })();
  }, [refreshing]);

  React.useEffect(() => {
    void (async () => {
      const myBalance = await contract.methods
        .balance()
        .call({ from: account });
      const supply = await contract.methods
        .balanceNft()
        .call({ from: account });
      
      setNftSupply(10000 - supply);
      setBalance(web3.utils.fromWei(myBalance, "ether").toString());
    })();
  }, [isPlayer, player, refreshing]);

  const uploadNftJson = async (playerReceived) => {   
    const baseUri = playerReceived.uriIpfs[playerReceived.uriIpfs.length - 1].substring(7);
    const json = await (
      await fetch(`https://ipfs.io/ipfs/${baseUri}`)
      ).json();
      setNftJson({
        description: json.description,
        edition: json.edition,
        image: `https://ipfs.io/ipfs/${json.image.substring(7)}`,
        name: json.name,
      });
  };

  const simuleSteps = async () => {
    const getData = contract.methods
      .stepToLeafWithoutTimestamp(10000)
      .encodeABI();
    await connector
      .sendTransaction({
        data: getData,
        from: account,
        to: contractAddress,
      })
      .then((result) => {
        setIsPlayer(true);
      })
      .catch((error) => {
        console.error("Error in simuleSteps : " + error);
      });
  };

  const buyNft = async () => {
    const lnftValue = web3.utils.toWei("0.01", "ether");
    const getData = contract.methods.buyNft().encodeABI();
    await connector
      .sendTransaction({
        data: getData,
        from: account,
        to: contractAddress,
        value: lnftValue,
      })
      .then((result) => {
        setIsPlayer(true);
      })
      .catch((error) => {
        console.error("Error in buyNft->connector.sendTransaction : " + error);
      });

    await contract.methods
      .getPlayer()
      .call({ from: account })
      .then((result) => {
        setIsPlayer(true);
        setPlayer(result);
      })
      .catch((error) => {
        console.error("Error in buyNft->connector.getPlayer : " + error);
      });
  };

  const killSession = React.useCallback(() => {
    return connector.killSession();
  }, [connector]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView>
      <ImageBackground
        style={{ height: "100%", justifyContent: "center", width: "100%" }}
        source={require("./imgs/forest-background-4.jpeg")}
      >
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={{ marginTop: 25 }}>
            {isPlayer ? (
              <View>
                <Text
                  style={{ color: "#00FF00", fontWeight: "bold", margin: 22 }}
                >
                  Account : {accountText}
                </Text>

                {player && (
                  <View>
                    <View
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Image
                        style={{ height: 250, width: 250 }}
                        source={{ uri: nftJson.image }}
                      />

                      <Text
                        style={{ backgroundColor: "white", fontWeight: "bold" }}
                      >
                        {nftJson.name}
                      </Text>
                      <Text style={styles.textFormat}>
                        LNFT supply : {nftSupply}/10000
                      </Text>
                    </View>

                    <View style={styles.marg}>
                      <Text style={styles.textFormat}>
                        Pas : {player.oldNbStep}
                      </Text>
                      <Text style={styles.textFormat}>
                        Total pas : {player.totalNbStep}
                      </Text>
                      <Text style={styles.textFormat}>
                      Nb. succès : {player.nbDaySuccess}
                      </Text>
                      <Text style={styles.textFormat}>
                      Dernière date succès : {new Date(
                          player.lastUpdateDate * 1000
                        ).toLocaleString()}
                      </Text>
                      <Text style={styles.textFormat}>
                        Niveau : {player.level}
                      </Text>
                      <Text style={styles.textFormat}>Balance : {balance}</Text>
                    </View>
                  </View>
                )}

                <View style={styles.marg}>
                  <View style={styles.margLittle}>
                    <Button
                      title="Simuler 10000 pas"
                      onPress={() => simuleSteps()}
                    />
                  </View>

                  <View style={styles.margLittle}>
                    <Button title="Déconnecter" onPress={() => killSession()} />
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.marg}>
                <Text style={styles.textFormat}>
                  Cher {accountText} pour entrer dans le jeu il faut acheter un LNFT.
                </Text>

                <View style={styles.margLittle}>
                  <Button title="Acheter" onPress={() => buyNft()} />
                </View>

                <View style={styles.margLittle}>
                  <Button title="Déconnecter" onPress={() => killSession()} />
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  marg: {
    margin: 16,
  },

  margLittle: {
    margin: 4,
  },

  textFormat: {
    color: "#0D3833",
    fontSize: 20,
    fontWeight: "bold",
    margin: 2,
  },

});
