// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import { IArbToken } from "./IArbToken.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract L2ERC20BridgableToken is IArbToken, ERC20 {
    address public l2Gateway;
    address public override l1Address;

    constructor(
        address _l2Gateway,
        address _l1TokenAddress,
        string memory _name,
        string memory _symbol
    )
        ERC20(_name, _symbol)
    {
        l2Gateway = _l2Gateway;
        l1Address = _l1TokenAddress;
    }

    modifier onlyL2Gateway() {
        require(msg.sender == l2Gateway, "NOT_GATEWAY");
        _;
    }
    
    function bridgeMint(address account, uint256 amount) external override onlyL2Gateway {
        _mint(account, amount);
    }
    
    function bridgeBurn(address account, uint256 amount) external override onlyL2Gateway {
        _burn(account, amount);
    }
}
