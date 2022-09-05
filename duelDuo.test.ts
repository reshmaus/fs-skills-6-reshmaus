// Lines 2 through 6 are our boilerplate lines of code, we need them for our tests to work
const {Builder, Capabilities} = require('selenium-webdriver')
const { By } = require("selenium-webdriver");

require('chromedriver')
jest.setTimeout(100000);

const driver = new Builder().withCapabilities(Capabilities.chrome()).build()

beforeEach(async () => {
    driver.get('http://localhost:3000/')
})

afterAll(async () => {
    driver.quit()
})

test('Title shows up when page loads', async () => {
    const title = await driver.findElement(By.id('title'))
    const displayed = await title.isDisplayed()
    expect(displayed).toBe(true)
})

test('Should show choice div when clicked on Draw button', async () => {
    const drawBtn = await driver.findElement(By.id('draw'))
    await drawBtn.click()
    await driver.sleep(2000)
    const Choices = await driver.findElement(By.id('choices'))
    const displayed = await Choices.isDisplayed()
    expect(displayed).toBe(true)
})

test('Should show player-duo div when clicked on one of Bot card "Add to Duo" button', async () => {
    const drawBtn = await driver.findElement(By.id('draw'))
    await drawBtn.click()
    await driver.sleep(2000)
    const choices = await driver.findElement(By.id('choices'))
    const choicesDisplayed = await choices.isDisplayed()
    expect(choicesDisplayed).toBe(true)

    const bot1Btn = await driver.findElement(By.xpath('//*[text()="Add to Duo"]'))   
    await bot1Btn.click();
    await driver.sleep(2000)
    
    const playerDuo = await driver.findElement(By.id('player-duo'))
    const playerDuoDisplayed = await playerDuo.isDisplayed()
    expect(playerDuoDisplayed).toBe(true)
})


   
test('On click of palyer duo bot card one of “Removed from Duo”, it should show back in choice div', async () => {
    const drawBtn = await driver.findElement(By.id('draw'))
    await drawBtn.click()
    await driver.sleep(2000)
    const choices = await driver.findElement(By.id('choices'))
    const choicesDisplayed = await choices.isDisplayed()
    expect(choicesDisplayed).toBe(true) 
    
    const botsFirstChoices = await driver.findElements(By.xpath('//*[text()="Add to Duo"]'))  
    const botAddToDuoBtn1 = await driver.findElement(By.xpath('//*[text()="Add to Duo"]'))   
    await botAddToDuoBtn1.click(); 
 
    await driver.sleep(2000)

    const botsChoicesAfterClickOneBot = await driver.findElements(By.xpath('//*[text()="Add to Duo"]'))  
    // The length has to drop to -1
    expect(botsChoicesAfterClickOneBot.length).toBe(botsFirstChoices.length - 1)
    
    const playerDuo = await driver.findElement(By.id('player-duo'))
    const playerDuoDisplayed = await playerDuo.isDisplayed()
    expect(playerDuoDisplayed).toBe(true)

    await driver.sleep(2000)
    
    const botRemFromDuoBtns = await driver.findElement(By.xpath('//*[text()="Remove from Duo"]')) 
    await botRemFromDuoBtns.click();

    await driver.sleep(2000) 

    const botsChoicesAfterClickRemoveBot = await driver.findElements(By.xpath('//*[text()="Add to Duo"]'))  
    // The length has to back to initial length
    expect(botsFirstChoices.length).toBe(botsChoicesAfterClickRemoveBot.length)
})

