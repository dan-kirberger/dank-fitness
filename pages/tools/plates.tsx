import Container from '@material-ui/core/Container'
import {useState} from 'react'
import Switch from '@material-ui/core/Switch';

type PlateCalculatorProps = {
    people: Person[]
    plates: PlateType[]
}

type Person = {
    name: string
    weight: number
}

interface PlateType {
    unit: string
    weight: number
}

interface KgPlate extends PlateType  {
    unit: "KG"
    weight: 1.25 | 2.5 | 5 | 10 | 15 | 20 | 25
}

interface PoundPlate extends PlateType {
    unit: "LB"
    weight: 2.5 | 5 | 10 | 25 | 45
}

export const PlateCalculator = () => {
    const [poundsMode, setPoundsMode] = useState(true)
    return (
        <Container>
        <div>
            Have to swap weights a lot for multiple people? Lets make that easier.
        </div>
        <div>Current Mode: {poundsMode ? "LB" : "KG"}: <Switch checked={poundsMode} onChange={() => setPoundsMode(!poundsMode)}/></div>
        </Container>
    )
}

export default PlateCalculator