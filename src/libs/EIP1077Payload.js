/**
 * @EIP1077Payload
 * Accepts an account and an operation and composes a EIP1077 payload
 *
 * Returns the JSON and keccak256 hash of the payload
 */
var web3 = require('web3');

const EIP1077Payload = (from, to, dataHash) => {
    //Validate input

    //address(this).call(bytes4(keccak256("moreThanFive(uint256)")), _value);
    const functionSignature = "verifySignature(bytes32,uint8,bytes32,bytes32)";
    var callPrefix = web3.utils.soliditySha3(functionSignature);
    var extraHash = "";
    
    //Temporarily leaving these as default
    const gasPrice = 0;
    const gasLimit = 0;
    const gasToken = 0;
    const nonce = 0;

    //Generate payload hash
    var value = dataHash;
    var operationType = dataHash;
    // solidity equivalent: keccak256(byte(0x19), byte(0), from, to, value, dataHash, nonce, gasPrice, gasLimit, gasToken, callPrefix, extraHash)
    return web3.utils.soliditySha3(0x19, 0, from, to, value, dataHash, nonce, gasPrice, gasLimit, gasToken, callPrefix, operationType, extraHash);
};

export default EIP1077Payload