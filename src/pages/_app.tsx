import '../styles/global.css'

import { useState } from 'react'
import { ChallengesProvider } from '../contexts/ChallengesContext'

import '../styles/global.css'

function MyApp({ Component, pageProps }) {
  return (
   <ChallengesProvider>
      <Component {...pageProps} />
    </ChallengesProvider>
)}

export default MyApp


// Provider - Todos os elementos dentro do Provider vão ter acesso aos dados do Contexto