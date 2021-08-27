import { useState } from 'react'
import Switch from '@material-ui/core/Switch'
import { Button, Container, Grid, TextField } from '@material-ui/core'
import _ from 'lodash'

type PlateCalculatorProps = {
    people: Person[]
    plates: PlateType[]
}

type Person = {
    name: string
    weight: number
}

interface PlateType {
    unit: "KG" | "LB"
    weight: number
    count: number
}

interface KgPlate extends PlateType {
    unit: "KG"
    weight: 1.25 | 2.5 | 5 | 10 | 15 | 20 | 25
}

interface PoundPlate extends PlateType {
    unit: "LB"
    weight: 2.5 | 5 | 10 | 25 | 45
}

export const PlateCalculator = () => {
    const [poundsMode, setPoundsMode] = useState(true)
    const [people, setPeople] = useState([])
    const [plates, setPlates] = useState(generatePlates(poundsMode))
    const [barbellWeight, setBarbellWeight] = useState(poundsMode ? 45 : 20)
    const [desiredWeight, setDesiredWeight] = useState(poundsMode ? 135 : 75)

    const updatePlate = (weight, newCount) => {
        const updatedPlates = plates.map(existingPlate => {
            if (existingPlate.weight === weight) {
                existingPlate.count = newCount && Number.parseInt(newCount) || 0
            }
            return existingPlate
        })
        setPlates(updatedPlates)
    }

    // TODO: assume/require even number of plates?

    let remainingWeight = desiredWeight - barbellWeight
    let remainingWeightPerSide = remainingWeight / 2
    const availablePlates = plates.filter(plateType => plateType.count).sort((l,r) => r.weight - l.weight)
    let requiredPlates : PlateType[] = []
    availablePlates.forEach(plateType => {
        if(remainingWeightPerSide >= plateType.weight) {
            let numberOfPairsNeeded = 1
            for(let numberOfPairs = 1; numberOfPairs <= plateType.count && (remainingWeightPerSide >= numberOfPairs * plateType.count); numberOfPairs++) {
                numberOfPairsNeeded = numberOfPairs // lets make this slicker
            }
            remainingWeightPerSide = remainingWeightPerSide - (plateType.weight * numberOfPairsNeeded)
            requiredPlates.push({...plateType, count: numberOfPairsNeeded})
        }
    })
   

    return (
        <Container>
            <div>
                Have to swap weights a lot for multiple people? Lets make that easier.
            </div>
            <div>Current Mode: {poundsMode ? "LB" : "KG"}: <Switch checked={poundsMode} onChange={() => { 
                setPoundsMode(!poundsMode); 
                setPlates(generatePlates(!poundsMode))
                setBarbellWeight(!poundsMode ? 45 : 20 )
                }} /></div>

            <p></p>
            These plates are available:
            <div>
                <Grid container spacing={1}>
                    {plates.map(plate => {
                        return <Grid container key={plate.weight}>
                            <Grid item xs={2}>{plate.weight}</Grid>
                            <Grid item xs={2}><TextField value={plate.count} type="number" label="Pairs" onChange={(e) => updatePlate(plate.weight, e.target.value)} /></Grid>
                        </Grid>
                    })}
                </Grid>
            </div>

            <p/>
            My bar weighs:<TextField value={barbellWeight} type="number" label="Barbell Weight" onChange={(e) => setBarbellWeight(e.target.value)} />

<hr/>
I need:<TextField value={desiredWeight} type="number" label="Desired Weight" onChange={(e) => setDesiredWeight(e.target.value)} />
<hr/>
You need:
<ul>
    <li>barbell ({barbellWeight})</li>
    {requiredPlates.map(requiredPlate => <li key={requiredPlate.weight}>{`${requiredPlate.count} x ${requiredPlate.weight}`}</li>)}
</ul>
{remainingWeightPerSide > 0 && <>
You don't have enough plates! {remainingWeightPerSide} still needs to be added to each side.
</>}

            {/* {people.length == 0 && "Nobody added yet"}

            {people.map(person => {
                return <div key={person.name}>{person.name} - {person.weight}</div>
            })}

            <NewUserForm setPeople={setPeople} /> */}

        </Container>
    )
}

type NewUserFormProps = {
    setPeople: Function
}

const NewUserForm: React.FC<NewUserFormProps> = ({ setPeople }) => {
    const [name, setName] = useState('')
    const [weight, setWeight] = useState('')

    const addUser = (name, weight) => {
        setPeople(previousPeople => [...previousPeople, { name: name, weight: weight }])
        setName('')
        setWeight('')
    }

    return <form noValidate>
        <TextField id="newPersonName" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField id="newPersonWeight" label="Desired Weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
        <Button onClick={() => { addUser(name, weight) }}>Add person</Button>
    </form>
}

const generatePlates = (poundsMode: boolean): PlateType[] => {
    // This is all pretty janky
    const values = poundsMode ? [2.5, 5, 10, 25, 45] : [1.25, 2.5, 5, 10, 15, 20, 25]

    return values.map(weight => {
        return {
            unit: poundsMode ? "LB" : "KG",
            weight: weight,
            count: 0
        }
    })
}

export default PlateCalculator