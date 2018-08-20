/**
 * @PrivateKeySign
 * Takes a private key and a data payload, signs the data with private key
 *
 * Returns a signed and unsigned data payload
 */
import ethUtils from 'ethereumjs-util';
import Web3 from "web3"

let web3;
let accounts;
window.addEventListener('load', function() {
  
  web3 = new Web3(window.web3.currentProvider);

  web3.eth.getAccounts().then(accts => accounts = accts);
  
})
const PrivateKeySign = ( _data, _account, _privateKey) => {

  const transactionHash = ethUtils.keccak256("bananas");
  const signedTransactionHash = ethUtils.ecsign(transactionHash, _privateKey);

  // check
  const pub = ethUtils.ecrecover(transactionHash, signedTransactionHash.v, signedTransactionHash.r, signedTransactionHash.s)

  console.log("ecrecover result", ethUtils.bufferToHex(ethUtils.pubToAddress(pub)) )

  const pub2 = ethUtils.ecrecover(transactionHash, signedTransactionHash.v, signedTransactionHash.r, signedTransactionHash.s)

  console.log("ecrecover w/o prefix", ethUtils.bufferToHex(ethUtils.pubToAddress(pub2)) )


  // const msg = new Buffer('hello!');
  // console.log("accounts", accounts)
  // web3.eth.personal.sign('0x' + msg.toString('hex'), accounts[0])
  //   .then(sig => {
  //     console.log("sig is", sig)
  //     const res = ethUtils.fromRpcSig(sig);
  //     console.log("res is", res)

  //     const prefix = new Buffer("\x19Ethereum Signed Message:\n");
  //     const prefixedMsg = ethUtils.sha3(
  //       Buffer.concat([prefix, new Buffer(String(msg.length)), msg])
  //     );
    
  //     const pubKey  = ethUtils.ecrecover(prefixedMsg, res.v, res.r, res.s);
  //     const addrBuf = ethUtils.pubToAddress(pubKey);
  //     const addr    = ethUtils.bufferToHex(addrBuf);
  //     console.log("crickeys",  addr);
  //   })


  return {transactionHash, signedTransactionHash};
}

export default PrivateKeySign;