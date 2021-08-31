const LB_TO_KG = 0.453592

const lbToKg = (lbs: number):number => {
    return lbs * LB_TO_KG
}

const kgToLb = (kgs: number):number => {
    return kgs / LB_TO_KG
}