const LB_TO_KG = 0.453592

export const lbToKg = (lbs: number):number => {
    return lbs * LB_TO_KG
}

export const kgToLb = (kgs: number):number => {
    return kgs / LB_TO_KG
}