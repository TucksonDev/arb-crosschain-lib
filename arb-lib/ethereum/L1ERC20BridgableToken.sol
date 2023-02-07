// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import { ICustomToken } from "./ICustomToken.sol";
import { IL1GatewayRouter } from "./IL1GatewayRouter.sol";
import { IL1CustomGateway } from "./IL1CustomGateway.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @dev Implementation of the {ICustomToken} interface.
 */
contract L1ERC20BridgableToken is ICustomToken, ERC20 {
    address public bridge;
    address public router;
    bool private shouldRegisterGateway;

    constructor(
        address _bridge,
        address _router,
        string memory _name,
        string memory _symbol
    )
        ERC20(_name, _symbol)
    {
        bridge = _bridge;
        router = _router;
    }

    /// @dev we only set shouldRegisterGateway to true when in `registerTokenOnL2`
    function isArbitrumEnabled() external view override returns (uint8) {
        require(shouldRegisterGateway, "NOT_EXPECTED_CALL");
        return uint8(uint(0xa4b1));
    }
    
    function registerTokenOnL2(
        address l2CustomTokenAddress,
        uint256 maxSubmissionCostForCustomBridge,
        uint256 maxSubmissionCostForRouter,
        uint256 maxGasForCustomBridge,
        uint256 maxGasForRouter,
        uint256 gasPriceBid,
        uint256 valueForGateway,
        uint256 valueForRouter,
        address creditBackAddress
    ) public payable override {
        // we temporarily set `shouldRegisterGateway` to true for the callback in registerTokenToL2 to succeed
        bool prev = shouldRegisterGateway;
        shouldRegisterGateway = true;

        IL1CustomGateway(bridge).registerTokenToL2{ value: valueForGateway }(
            l2CustomTokenAddress,
            maxGasForCustomBridge,
            gasPriceBid,
            maxSubmissionCostForCustomBridge,
            creditBackAddress
        );

        IL1GatewayRouter(router).setGateway{ value: valueForRouter }(
            bridge,
            maxGasForRouter,
            gasPriceBid,
            maxSubmissionCostForRouter,
            creditBackAddress
        );

        shouldRegisterGateway = prev;
    }
}
