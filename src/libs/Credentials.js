
import bitcore  from "bitcore-lib";
import ethutils from "ethereumjs-util";
/**
 * @EIP1077Credentials 
 * Generates a random Ethereum account and stores the public and the private key to the localStorage
 *
 * Returns the new Account, the Private Key and the Public Key.
 */

export const GenerateCredentials = () => {
    const KeyStore = new bitcore.HDPrivateKey();
    const privateKey = KeyStore.privateKey.toBuffer();
    
    // do not use Keystore.account since this that is a Bitcoin address
    const account = ethutils.bufferToHex(ethutils.pubToAddress(KeyStore.publicKey.toBuffer(), true));
    const publicKey = KeyStore.privateKey.toPublicKey({compressed:false}).toBuffer();
    var item = {account, privateKey, publicKey};
    //window.localStorage.setItem("", JSON.stringify(item));
    return item;
}

function toHexString(byteArray) {
    return Array.prototype.map.call(byteArray, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}

export const LoadCredentials = (  ) => {
  const result = JSON.parse(window.localStorage.getItem("storedUser"));

  if(result){
    console.log("Local storage user:", result)
    result.privateKey = Buffer.from(result.privateKey.data);
    result.publicKey = Buffer.from(result.publicKey.data);
    console.log("publicKey:", result.publicKey)
    return result;
  }

}
