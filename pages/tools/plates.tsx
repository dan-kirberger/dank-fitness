import { useEffect, useState } from 'react'
import Switch from '@material-ui/core/Switch'
import { Button, Container, Grid, TextField } from '@material-ui/core'
import _ from 'lodash'
import Head from 'next/head'
import InputAdornment from '@material-ui/core/InputAdornment';

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
    weight: 1.25 | 2.5 | 5 | 10 | 25 | 35 | 45
}

interface Settings {
    serializationVersion: number
    poundsMode: boolean
    plates: PlateType[]
    barbellWeight: number
    desiredWeight: number
}

const SERIALIZATION_VERSION = 1
const LOCAL_STORAGE_KEY = 'plateCalculatorSettings'

const getSettings = (): Settings => {
    const settings = localStorage?.getItem(LOCAL_STORAGE_KEY)
    if (settings && JSON.parse(settings)?.serializationVersion === SERIALIZATION_VERSION) {
        return JSON.parse(settings)
    }
    if (settings && JSON.parse(settings)?.serializationVersion !== SERIALIZATION_VERSION) {
        console.log("Nuking your old settings!")
        localStorage.removeItem(LOCAL_STORAGE_KEY)
    }
    return null
}

export const PlateCalculator = () => {
    const [poundsMode, setPoundsMode] = useState(true)
    const [people, setPeople] = useState([])
    const [plates, setPlates] = useState(generatePlates(poundsMode))
    const [barbellWeight, setBarbellWeight] = useState(poundsMode ? 45 : 20)
    const [desiredWeight, setDesiredWeight] = useState(poundsMode ? 135 : 75)
    const [settingsLoaded, setSettingsLoaded] = useState(false)

    useEffect(() => {
        if (!settingsLoaded) {
            const settings = getSettings()
            if (settings) {
                console.log("Loading your saved settings!")
                setPoundsMode(settings.poundsMode)
                setBarbellWeight(settings.barbellWeight)
                setDesiredWeight(settings.desiredWeight)
                setPlates(settings.plates)
            }
            setSettingsLoaded(true)
        }
    }, [settingsLoaded])


    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
            serializationVersion: SERIALIZATION_VERSION,
            plates: plates,
            poundsMode: poundsMode,
            barbellWeight: barbellWeight,
            desiredWeight: desiredWeight
        }))
    }, [plates, barbellWeight, desiredWeight, poundsMode])

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
    const availablePlates = plates.filter(plateType => plateType.count).sort((l, r) => r.weight - l.weight)
    let requiredPlates: PlateType[] = []
    availablePlates.forEach(plateType => {
        if (remainingWeightPerSide >= plateType.weight) {
            let numberOfPairsNeeded = 1
            for (let numberOfPairs = 1; numberOfPairs <= plateType.count && (remainingWeightPerSide >= numberOfPairs * plateType.weight); numberOfPairs++) {
                numberOfPairsNeeded = numberOfPairs // lets make this slicker
            }
            remainingWeightPerSide = remainingWeightPerSide - (plateType.weight * numberOfPairsNeeded)
            requiredPlates.push({ ...plateType, count: numberOfPairsNeeded })
        }
    })

    const weightUnit = poundsMode ? "LB" : "KG"

    return (
        <Container>
            <Head>
                <title>Plate Calculator</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1>
                What plates do I need?
            </h1>
            <div>My plates are in: <Switch checked={poundsMode} onChange={() => {
                setPoundsMode(!poundsMode);
                setPlates(generatePlates(!poundsMode))
                setBarbellWeight(!poundsMode ? 45 : 20)
            }} />{weightUnit}</div>

            <p></p>
            <h3>Available Plates (pairs):</h3>
            <Grid container>
                <Grid item spacing={2} xs={12} md={3}>
                    {plates.map(plate => {
                        return <Grid container key={plate.weight}>
                            <Grid item xs={12} >
                                <Button onClick={() => updatePlate(plate.weight, plate.count - 1)}>-</Button>
                                <TextField value={plate.count} type="number" onChange={(e) => updatePlate(plate.weight, e.target.value)} style={{ width: 100 }}
                                    inputProps={{
                                        style: { textAlign: 'right' }
                                    }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">{`${plate.weight} ${weightUnit} x`}</InputAdornment>
                                    }} />
                                <Button onClick={() => updatePlate(plate.weight, plate.count + 1)}>+</Button>
                            </Grid>
                        </Grid>
                    })}
                </Grid>
                <Grid item xs={12} md={3}>
                    <Grid container>
                        <Grid item xs={12}>
                            <TextField value={barbellWeight} type="number" label="Barbell Weight" onChange={(e) => setBarbellWeight(parseInt(e.target.value))} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField value={desiredWeight} type="number" label="Desired Weight" onChange={(e) => setDesiredWeight(parseInt(e.target.value))} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
You need:
            <ul>
                <li>barbell ({barbellWeight})</li>
                {requiredPlates.map(requiredPlate => <li key={requiredPlate.weight}>{`${requiredPlate.count} x ${requiredPlate.weight}`}</li>)}
            </ul>
            {remainingWeightPerSide > 0 && <>
                You don&apos;t have enough plates! {remainingWeightPerSide} {poundsMode ? 'LB' : 'KG'} still needs to be added to each side.
            </>}
        </Container>
    )
}

const generatePlates = (poundsMode: boolean): PlateType[] => {
    // This is all pretty janky
    const values = poundsMode ? [1.25, 2.5, 5, 10, 25, 35, 45] : [1.25, 2.5, 5, 10, 15, 20, 25]

    return values.map(weight => {
        return {
            unit: poundsMode ? "LB" : "KG",
            weight: weight,
            count: 0
        }
    })
}

export default PlateCalculator
