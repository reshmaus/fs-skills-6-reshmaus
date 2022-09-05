const {shuffleArray} = require('./utils')

const testArray = [1,2,3,4,5];

describe('shuffleArray should', () => {
    test("Check for return array has the same length as the argument array", () => {
        expect(shuffleArray(testArray)).toHaveLength(testArray.length)
    }) 
    test("Check returns an array", () => {
        expect(shuffleArray(testArray)).toBeInstanceOf(Array)
    })
    test("Check returns array has one of value of the argument array", () => {
        const returnArray = shuffleArray(testArray);
        expect(returnArray).toContain(testArray[1])
        expect(returnArray).toContain(testArray[4])
    })
    test("Check returns array is shuffled", () => {
        const returnArray1 = shuffleArray(testArray);
        expect(returnArray1[1]).not.toBe(testArray[1])
        expect(returnArray1[3]).not.toBe(testArray[3])
    })
})