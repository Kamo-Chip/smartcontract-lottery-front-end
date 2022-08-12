import React, { useEffect, useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants/index";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { useNotification } from "@web3uikit/core";

const LotteryEntrance = () => {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayers, setNumPlayers] = useState("0");
  const [winner, setWinner] = useState("0");

  const dispatch = useNotification();

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    msgValue: entranceFee,
    params: {},
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  async function updateUI() {
    const entranceFeeFromCall = (
      await getEntranceFee({ onError: (error) => console.log(error) })
    ).toString();
    setEntranceFee(entranceFeeFromCall);

    const numPlayersFromCall = (
      await getNumPlayers({ onError: (error) => console.log(error) })
    ).toString();
    setNumPlayers(numPlayersFromCall);

    const recentWinnerFromCall = (
      await getRecentWinner({ onError: (error) => console.log(error) })
    ).toString();
    setWinner(recentWinnerFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI();
  };

  const handleNewNotification = function () {
    dispatch({
      type: "info",
      message: "Transaction complete!",
      title: "Tx notification",
      position: "topR",
    });
  };
  return (
    <div>
      {raffleAddress ? (
        <div>
          <button
            onClick={async function () {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
          >
            Enter Raffle
          </button>
          <p>Entrance fee: {ethers.utils.formatUnits(entranceFee)} ETH</p>
          <p>Number of players: {numPlayers}</p>
          <p>Recent winner: {winner}</p>
        </div>
      ) : (
        <div>No Raffle Address detected</div>
      )}
    </div>
  );
};

export default LotteryEntrance;
