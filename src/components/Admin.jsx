//import Web3 from 'web3';
import React, { Component } from 'react';
import Credentials from '../libs/Credentials';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { Query, Mutation } from 'react-apollo';


const StyledDiv = styled.div`
    border: 1px solid #aaa;
`;

const QUERY = gql`
  query {
    identityFactoryAddress
  }
`

const DEPLOY_FACTORY_MUTATION = gql`
  mutation {
    createFactory
  }
`

class Admin extends Component {

    renderDeployFactory(){
        let input;
        return (
            <Mutation mutation={DEPLOY_FACTORY_MUTATION}>
            {(createFactory, { data }) => (
              <div>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    createFactory({ variables: { } });
                  }}
                >
                  <button type="submit">Deploy Factory</button>
                </form>
              </div>
            )}
          </Mutation>
        )
    }

    render(){
        return(
            <StyledDiv>
                <Query query={QUERY}>
                    {({ loading, error, data }) => {
                    if (loading) return <div>Loading...</div>;
                    if (error) return <div>Error :( <div>{JSON.stringify(error)}</div></div>;

                    return (
                        <div>
                            <div>Identity Factory Contract Address:</div>
                            <div>
                                {   data.identityFactoryAddress !== "" ? 
                                    data.identityFactoryAddress : this.renderDeployFactory() 
                                }
                            </div>
                        </div>
                    )
                    }}
                </Query>
            </StyledDiv>
        )
    }
}

  export default Admin;