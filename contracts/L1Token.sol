// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import { L1ERC20BridgableToken } from "../arb-lib/ethereum/L1ERC20BridgableToken.sol";

contract L1Token is L1ERC20BridgableToken {
    constructor(
        address _bridge,
        address _router,
        string memory _name,
        string memory _symbol
    )
        L1ERC20BridgableToken(_bridge, _router, _name, _symbol)
    {}
    
    function mint(address to, uint256 amount) public virtual {
        _mint(to, amount);
    }
}
