export default function logNullValue(caller: string, names: string[], values: (string | number)[]) {
    let err = -1

    for (let i = 0; i < values.length; i++) {
        if (!values[i]) {
            console.log(`${caller}: ${names[i]} is null (${values[i]}).`)
            err = i
        }
    }

    if (err !== -1) {
        throw new Error(`${caller}: Skipped due to nullish values`)
    }
}
