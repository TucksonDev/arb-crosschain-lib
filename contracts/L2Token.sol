// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import { L2ERC20BridgableToken } from "../arb-lib/arbitrum/L2ERC20BridgableToken.sol";

contract L2Token is L2ERC20BridgableToken {
    constructor(
        address _bridge,
        address _router,
        string memory _name,
        string memory _symbol
    )
        L2ERC20BridgableToken(_bridge, _router, _name, _symbol)
    {}
}
