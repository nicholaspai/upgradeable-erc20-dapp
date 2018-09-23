# UpgradeableERC20 Wallet 
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

This dApp is a front end wallet for users to interact with UpgradeableERC20 smart contracts.

# How to use
0) install dependencies `npm install`
1) Run locally `yarn start`
2) Install MetaMask (https://metamask.io/) to use dApp!

# Git submodules
The UpgradeableERC20 smart contracts are included here as a git submodule for convenience

Any changes to the smart contracts should be done in the separate UpgradeableERC20 repo,
and to pull in any changes to the smart contracts run:

`git submodule update --recursive --remote`