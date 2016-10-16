import React from 'react';
import { Layout } from "react-mdl"

import AppHeader from "../components/Header"
import MainWrapper from "../containers/MainWrapper"

const App = () => (
  <div className="app">
    <Layout >
      <AppHeader title="create-youtube-playlist" />
      <MainWrapper />
    </Layout>        
  </div>
)
 
 
export default App;