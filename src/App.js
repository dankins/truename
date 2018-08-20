import React, { Component } from 'react';
import styled from "styled-components";

import Admin from "./components/Admin" 
import User from "./components/User";

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

// Pass your GraphQL endpoint to uri
const client = new ApolloClient({ uri: 'http://localhost:1337/graphql' });


const AppContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ddd;
  > div {
    background-color: white;
    max-width: 400px;
    width: 100%;
    margin: 25px;
    padding: 25px;
  }
`;

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <AppContainer>
          <Admin />
          <User />
        </AppContainer>
      </ApolloProvider>
    );
  }
}

export default App;
