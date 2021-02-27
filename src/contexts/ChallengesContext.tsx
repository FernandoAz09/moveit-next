import { createContext, ReactNode, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import challenges from '../../challenges.json'
import { LevelUpModal } from '../components/LevelUpModal'

interface Challenge {
    type: 'body' | 'eye'
    description: string
    amount: number
}

interface ChallengesContextData {
    level: number
    currentExperience: number  
    challengesCompleted: number
    experienceToNextLevel: number
    activeChallenge: Challenge 
    levelUp: () => void 
    startNewChallenge: () => void
    resetChallenge: () => void
    completeChallenge: () => void
    closeLevelUpModal: () => void
}

interface ChallengesProviderProps {
    children: ReactNode
    level: number
    currentExperience: number
    challengesCompleted: number
}

export const ChallengesContext = createContext({} as ChallengesContextData)

export function ChallengesProvider({ 
    children,
    ...rest
} : ChallengesProviderProps) {
    const [level, setLevel] = useState(rest.level ?? 1)
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0)
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0)
// ?? - Se o anterior não existir use isso - 0
    const [activeChallenge, setActiveChallenge] = useState(null)
    const [isLevelModalOpen, setIsLevelModalOpen] = useState(false)

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2) // potenciação -- calculo de RPG pra levelUP

    // Array vazio no segundo parametro o UseEffect a função executa uma unica vez assim que o componente for exibido em tela

    useEffect(() => {
        Notification.requestPermission()
    }, []) 

    // Usando Cookies para persistir os dados da sessão

    useEffect(() => {
        Cookies.set('level', String(level))
        Cookies.set('currentExperience', String(currentExperience))
        Cookies.set('challengesCompleted', String(challengesCompleted))
    }, [level, currentExperience, challengesCompleted])

    function levelUp() {
      setLevel(level + 1)
      setIsLevelModalOpen(true)
    }

    function closeLevelUpModal() {
        setIsLevelModalOpen(false)
    }

    function startNewChallenge() {
        const randonChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randonChallengeIndex]

        setActiveChallenge(challenge)

        new Audio('./public/notification.mp3').play()

        if (Notification.permission === 'granted') {
            new Notification('Novo desafio🎉', {
                body: `Valendo ${challenge.amount} xp!`
            })
        }
    }

    function resetChallenge() {
        setActiveChallenge(null)
    }

    function completeChallenge() {
        if (!activeChallenge) {
            return
        }

        const { amount } = activeChallenge

        let finalExperience = currentExperience + amount

        if (finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel
            levelUp()
        }

        setCurrentExperience(finalExperience)
        setActiveChallenge(null)
        setChallengesCompleted(challengesCompleted + 1)
    }

    return (
        <ChallengesContext.Provider 
            value={{
                level, 
                currentExperience, 
                challengesCompleted, 
                levelUp, 
                startNewChallenge,
                resetChallenge,
                activeChallenge,
                experienceToNextLevel,
                completeChallenge,
                closeLevelUpModal,
            }}
        >
            { children }

            { isLevelModalOpen && <LevelUpModal />}
        </ChallengesContext.Provider>
    )
}
