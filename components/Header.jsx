import React from 'react'
import { ConnectButton } from '@web3uikit/web3'

const Header = () => {
  return (
    <div style={{
        backgroundColor: "goldenrod",
        color: "#fff",
    }}>
        <div style={{
            display: "flex",
            justifyContent: "center",
        }}>
            <h1>Decentralized Lottery</h1>
        </div>
        <div style={{
            position: "absolute",
            right: "0",
            top: "0",
            paddingTop: "1.5em",
        }}>
            <ConnectButton moralisAuth={false}/>
        </div>
    </div>
  )
}

export default Header