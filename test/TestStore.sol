pragma solidity ^0.5.0;

import 'truffle/Assert.sol';
import 'truffle/DeployedAddresses.sol';
import '../contracts/Store.sol';

contract TestStore {
    Store store = Store(DeployedAddresses.Store());

    uint expectedProductId = 8;

    address expectedBuyer = address(this);

    function testUserCanBuyProduct() public {
        uint returnedId = store.buy(expectedProductId);

        Assert.equal(returnedId, expectedProductId, "Purchase of the expected product should match what's returned.");
    }

    function testGetBuyerAddressByProductId() public {
        address buyer = store.buyers(expectedProductId);

        Assert.equal(buyer, expectedBuyer, 'Owner of the expected product should be this contract.');
    }

    function testGetBuyerAddressByProductIdInArray() public {
        address[16] memory buyers = store.getBuyers();

        Assert.equal(buyers[expectedProductId], expectedBuyer, 'Owner of the expected product should be this contract');
    }
}