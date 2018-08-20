//import Web3 from 'web3';
import React, { Component } from 'react';
import { GenerateCredentials, LoadCredentials } from '../libs/Credentials';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { Query, Mutation } from 'react-apollo';

import EIP1077Payload from '../libs/EIP1077Payload';
import PrivateKeySign from '../libs/PrivateKeySign';

const DEPLOY_IDENTITY = gql`
mutation CreateIdentity($input: CreateIdentityInput!) {
    createIdentity(input: $input)
  }
`

const RELAY_TRANSACTION = gql`
mutation RelayTransaction($input: RelayTransactionInput!) {
    relayTransaction(input: $input)
  }
`

const GET_IDENTITY_CONTRACT_FOR_ACCOUNT = gql`
  query GetIdentityForAccount($account: String!) {
    getIdentityForAccount(account: $account)
    getIdentityABI
  }
`

const StyledDiv = styled.div`
    border: 1px solid #aaa;
`;

class User extends Component {

    constructor(props){
        super(props);

        this.storedUser = LoadCredentials()
    }

    renderNewUser(){
        return (
            <div>
                <div> Create your identity smart contract: </div>

                <div> 
                    {this.renderDeployIdentity()}
                </div>
            </div>   
        )
    }

    renderDeployIdentity(){
        
        const credentials = GenerateCredentials();

        return (
            <Mutation mutation={DEPLOY_IDENTITY}>
            {(createIdentity, { data }) => (
              <div>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    createIdentity({ variables: { 
                        input: {
                            account: credentials.account
                        }
                    } })
                    .then(x => {
                        console.log("deployed identity smart contract", x, credentials)
                        localStorage.setItem('storedUser', JSON.stringify(credentials));
                    });
                  }}
                >
                    <div>Initial authorized account: {credentials.account}</div>
                  <button type="submit">Deploy Identity</button>
                </form>
              </div>
            )}
          </Mutation>
        )
    }

    sendAction(mutation, creds, identityContractAddress, action) {
        // actions: 1=read,2=write,3=ping
        var payload = EIP1077Payload(creds.account, identityContractAddress, action);

        // Gets transaction and signed transaction hashes
        var hashes = PrivateKeySign(payload, creds.account, creds.privateKey);
        
        const input = {
            identityContractAddress: identityContractAddress, 
            authorizedAccount: creds.account, 
            action: action, 
            gas: "10000000000000", 
            messageHash: hashes.transactionHash.toString("hex"), 
            signedHash: hashes.signedTransactionHash.r.toString('hex') + 
                hashes.signedTransactionHash.s.toString('hex') + 
                hashes.signedTransactionHash.v.toString(16)
        }

        console.log("RelayTransaction", input, hashes);

        mutation({ variables: {  input } })
            .then( response => console.log(response));
    
    }
    toByteArray(hexString) {
        var result = [];
        while (hexString.length >= 2) {
          result.push(parseInt(hexString.substring(0, 2), 16));
          hexString = hexString.substring(2, hexString.length);
        }
        return result;
      }


    renderExistingUser(){
        const account = this.storedUser.account;
        return (
        <Query query={GET_IDENTITY_CONTRACT_FOR_ACCOUNT} variables={{ account }}>
            {({ loading, error, data }) => {
            if (loading) return <div>Loading...</div>;
            if (error) return <div>Error :( <div>{JSON.stringify(error)}</div></div>;

            return (
                <div>
                    <div>Loaded account from localStorage: {this.storedUser.account}</div>
                    <div>Your identity smart contract: {data.getIdentityForAccount}</div>
                    <div>
                        <h3>Do something</h3>
                        <Mutation mutation={RELAY_TRANSACTION}>
                            {(relayTransaction, { mutationData }) => (
                                <button onClick={(e) => {this.sendAction(
                                    relayTransaction, 
                                    this.storedUser, 
                                    data.getIdentityForAccount, 
                                    11111
                                )}} 
                                >Do Something</button>
                            )}
                        </Mutation>
                        
                    </div>
                </div>
            )
            }}
        </Query>
        )
    }
    render(){
        return(
            <StyledDiv>
                {
                    this.storedUser == null ? this.renderNewUser() : this.renderExistingUser()
                }
            </StyledDiv>
        )
    }
}

  export default User;