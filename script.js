document.addEventListener('DOMContentLoaded', () => {
    // --- CONSTANTS & CONFIG ---
    const GAME_CONFIG = {
        initialCatCount: 4,
        maxFoodMeter: 20,
        maxPower: 40,
        cosmicModeDuration: 20,
        quantumModeDuration: 20, // Added for Quantum Mode
        maxBeetles: 1,
        maxFeathers: 5,
        spinCostBase: 20,
        luckyLinesSpinCost: 30,
        multiplierSlotIndex: 7, // Default last slot of bottom row (0-indexed)
        gridSize: 8,
        initialCoins: 50050,
        initialLockItems: 3,
        baseSpinFoodConsumption: 1,
        catFoodConsumption: 1,
        luckyLinesBonus: 150,
        investmentDuration: 10,
        takeoutDuration: 10,
        donutBuffDuration: 10,
        sushiBuffDuration: 3,
        birdGainChance: 0.12,
        birdLossChance: 0.12,
        spamTextChance: 0.25,
        spamTextCost: 35,
        friendlyTextGain: 10,
        parrotBeetleDropChance: 0.10,
        doveBranchDropChance: 0.10,
        owlFeatherDropChance: 0.10,
        ufoAlienDropChance: 0.10, // UFO alien drop chance
        gameOverOnUnpaidBillChance: 0.05,
        powerBillBaseCost: 125, // UPDATED
        powerBillIncrement: 125, // UPDATED
        maxFoodSymbolCap: 8,
        maxTotalBirdsCap: 8,
        schrodingerCatsCount: 2, // Number of 10x cats in Quantum Mode
        schrodingerCatMultiplier: 10,
    };

    const INITIAL_SYMBOLS_CONFIG = [
        { emoji: "🍟", value: 2, count: 4, refill: 10, isFood: true },
        { emoji: "🍣", value: 1, count: 3, refill: 10, isFood: true },
        { emoji: "🍩", value: 3, count: 3, refill: 10, isFood: true },
        { emoji: "🐈‍⬛", value: 2, count: GAME_CONFIG.initialCatCount, refill: 0, isFood: false },
        { emoji: "🦜", value: 3, count: 0, refill: 0, isFood: false, hidden: false },
        { emoji: "🦉", value: 0, count: 0, refill: 0, isFood: false, hidden: false },
        { emoji: "🕊️", value: 1, count: 0, refill: 0, isFood: false, hidden: false },
        { emoji: "🐦‍🔥", value: 5, count: 0, refill: 0, isFood: false, hidden: false },
        { emoji: "🪐", value: 16, count: 0, refill: 0, isFood: false, isCosmic: true, hidden: false },
        { emoji: "🌠", value: 11, count: 0, refill: 0, isFood: false, isCosmic: true, hidden: false },
        { emoji: "🌒", value: 9, count: 0, refill: 0, isFood: false, isCosmic: true, hidden: false },
        { emoji: "🛸", value: 7, count: 0, refill: 0, isFood: false, isCosmic: true, hidden: false }
    ];

    const SHOP_ITEMS_CONFIG = [
        { name: "Mouse Toy", emoji: "🐁", cost: 200 },
        { name: "Camera", emoji: "🎥", cost: 3000 },
        { name: "Bird Nest", emoji: "🪹", cost: 1000 },
        { name: "Black Hole", emoji: "⚫", cost: 5000 },
        { name: "Cosmic Upgrade", emoji: "🔭", cost: 2000, powerCost: 2, isUpgrade: true, type: 'cosmic' },
        { name: "Quantum Upgrade", emoji: "⚛️", cost: 6000, powerCost: 5, isUpgrade: true, type: 'quantum' },
    ];

    // --- DOM ELEMENTS ---
    const DOM_ELEMENTS = {
        gameDiv: document.querySelector('.game'),
        grid: document.getElementById("slot-grid"),
        coinsDisplay: document.getElementById("coins-display"),
        luckyBtn: document.getElementById("lucky-btn"),
        totalWinDisplay: document.getElementById("total-win-display"),
        phoneMessageDisplay: document.getElementById("phone-message-display"),
        foodMeterFill: document.getElementById("food-meter-fill-display"),
        foodMeterValue: document.getElementById("food-meter-value-display"),
        symbolInventoryDisplay: document.getElementById("symbol-inventory-display"),
        playerInventoryContent: document.getElementById("player-inventory-content"),
        shopContent: document.getElementById("shop-modal-content"),
        powerMeterFill: document.getElementById("power-meter-fill"),
        powerMeterIndicatorIcon: document.getElementById("power-meter-indicator-icon"),
        nextPowerBillCostDisplay: document.getElementById("next-power-bill-cost-display"),
        donutBuffStatusEl: document.getElementById('donut-buff-status'),
        sushiBuffStatusEl: document.getElementById('sushi-buff-status'),
        catBuffStatusEl: document.getElementById('cat-buff-status'),
        phoneBuffStatusEl: document.getElementById('phone-buff-status'),
        cosmicModeStatusEl: document.getElementById('cosmic-mode-status'),
        quantumModeStatusEl: document.getElementById('quantum-mode-status'),
        permanentBuffStatusEl: document.getElementById('permanent-buff-status'), 
        spinBtn: document.getElementById('spin-btn'),
        gameMainTitle: document.getElementById("game-main-title"),
        alienMediaPayoutModal: document.getElementById("alien-media-payout-modal"),
        alienMediaPayoutContent: document.getElementById("alien-media-payout-content"),
        alienMediaPayoutCloseBtn: document.getElementById("alien-media-payout-close-btn"),
        giftChoiceModal: document.getElementById("gift-choice-modal"), 
        giftChoiceBirdBtn: document.getElementById("gift-choice-bird-btn"), 
        giftChoiceFoodBtn: document.getElementById("gift-choice-food-btn"), 
        giftChoiceLocksBtn: document.getElementById("gift-choice-locks-btn"), 
        shopTriggerBtn: document.getElementById("shop-trigger-btn"),
        guideTriggerBtn: document.getElementById("guide-trigger-btn"),
        shopModalOverlay: document.getElementById("shop-modal-overlay"),
        shopModalCloseBtn: document.getElementById("shop-modal-close-btn"),
        guideSelectionModalOverlay: document.getElementById("guide-selection-modal-overlay"),
        guideSelectionModalCloseBtn: document.getElementById("guide-selection-modal-close-btn"),
        guideSelectionModalContent: document.getElementById("guide-selection-modal-content"),
        
        // Mobile UI Elements
        windowTriggerBtn: document.getElementById('window-trigger-btn'),
        petTriggerBtn: document.getElementById('pet-trigger-btn'),
        phoneTriggerBtn: document.getElementById('phone-trigger-btn'),
        
        // REMOVED Window Modal Elements

        petModalOverlay: document.getElementById('pet-modal-overlay'),
        petModalCloseBtn: document.getElementById('pet-modal-close-btn'),
        petModalContent: document.getElementById('pet-modal-content'),
        petModalTitle: document.getElementById('pet-modal-title'),

        phoneModalOverlay: document.getElementById('phone-modal-overlay'),
        phoneModalCloseBtn: document.getElementById('phone-modal-close-btn'),
        phoneModalContent: document.getElementById('phone-modal-content'),

        // ADDED: Status effect placeholders for window items
        nestStatusEl: document.getElementById('nest-status'),
        featherStatusEl: document.getElementById('feather-status'),
        beetleStatusEl: document.getElementById('beetle-status'),
        branchStatusEl: document.getElementById('branch-status'),
    };

    // --- GAME STATE VARIABLES ---
    let symbols = [];
    const playerState = {};
    const slotMachineState = {};
    const activeEffects = {};
    const windowFeatureState = {};
    const phoneFeatureState = {};
    const uiState = {};


    function initializeGameVariables() {
        playerState.coins = GAME_CONFIG.initialCoins;
        playerState.foodMeter = GAME_CONFIG.maxFoodMeter;
        playerState.power = GAME_CONFIG.maxPower;
        playerState.inventory = { "🎥": 0, "☕": 2, "👽": 0, "📃": 0, "⚫": 0, "🎁": 0 };
        playerState.lockItems = GAME_CONFIG.initialLockItems;
        playerState.billsPaidSoFar = 0;
        playerState.spinCount = 0;
        playerState.giftAwarded = false;

        slotMachineState.luckyLines = false;
        slotMachineState.topRightLocked = false;
        slotMachineState.topRightSymbol = null;
        slotMachineState.currentWin = 0;
        slotMachineState.currentGridSymbols = Array(GAME_CONFIG.gridSize).fill(null);
        slotMachineState.currentMultiplier = getRandomMultiplier();
        slotMachineState.schrodingerCells = []; // For Quantum Mode

        activeEffects.hasPetCat = false;
        activeEffects.hasAlienVisitor = false;
        activeEffects.spinsWithCat = 0;
        activeEffects.currentCatStatus = '😺';
        activeEffects.hasMouseToy = false;
        activeEffects.donutBuffActive = false;
        activeEffects.donutBuffSpinsLeft = 0;
        activeEffects.sushiCatBuffActive = false;
        activeEffects.sushiCatBuffSpinsLeft = 0;

        activeEffects.cosmicUpgradeActive = false;
        activeEffects.cosmicUpgradeSpinsLeft = 0;
        activeEffects.quantumUpgradeActive = false;
        activeEffects.quantumUpgradeSpinsLeft = 0;
        
        activeEffects.cosmicUpgradePenaltyActive = false;
        activeEffects.quantumUpgradePenaltyActive = false;

        activeEffects.alienDroppedByUFO = false; 

        activeEffects.permanentBirdBuff = false; 
        activeEffects.permanentFoodReplenishBuff = false; 

        windowFeatureState.birdGainedThisSpin = null;
        windowFeatureState.hasBirdNest = false;
        windowFeatureState.feathers = 0;
        windowFeatureState.beetles = 0;
        windowFeatureState.hasBranch = false;

        phoneFeatureState.phoneOn = false; // Is phone active for texts?
        phoneFeatureState.investmentActive = false;
        phoneFeatureState.investmentAmount = 0;
        phoneFeatureState.investmentSpinsLeft = 0;
        phoneFeatureState.takeoutActive = false;
        phoneFeatureState.takeoutSpinsLeft = 0;
        phoneFeatureState.takeoutFoodAmount = 0;

        uiState.isGameOver = false;
        uiState.windowOpen = true; // Window is open by default
        uiState.foodWarningActive = false;

        symbols = JSON.parse(JSON.stringify(INITIAL_SYMBOLS_CONFIG)).map(s => ({ ...s, originalValue: s.value }));
        symbols.forEach(s => {
            if (s.isCosmic) s.count = 0;
        });
    }


    // --- HELPER FUNCTIONS ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function getRandomMultiplier() { return [2, 3, 5][Math.floor(Math.random() * 3)]; }

    function getSymbolsForSpin() {
        let newGridSetup = Array(GAME_CONFIG.gridSize).fill(null);
        const isLockEffectivelyActive = slotMachineState.topRightLocked;

        let effectiveSymbolsConfig = JSON.parse(JSON.stringify(symbols));
        let lockedSymbolForGrid = null;

        if (isLockEffectivelyActive && slotMachineState.topRightSymbol) {
            lockedSymbolForGrid = slotMachineState.topRightSymbol;
            const symbolInBagConfig = effectiveSymbolsConfig.find(s => s.emoji === lockedSymbolForGrid.emoji);
            if (symbolInBagConfig && symbolInBagConfig.count > 0) {
                symbolInBagConfig.count--;
            }
        }

        let bag = [];
        effectiveSymbolsConfig.forEach(symbol => {
            let shouldBeInBag = !symbol.isCosmic;

            if (symbol.isCosmic) {
                if (activeEffects.cosmicUpgradePenaltyActive || activeEffects.cosmicUpgradeActive) {
                    shouldBeInBag = true;
                } else {
                    shouldBeInBag = false;
                }
            }
            
            if (symbol.count > 0 && !symbol.hidden && shouldBeInBag) {
                for (let i = 0; i < symbol.count; i++) {
                    bag.push({ ...symbol });
                }
            }
        });
        shuffleArray(bag);

        let availableSlotIndices = [];
        for (let i = 0; i < GAME_CONFIG.gridSize; i++) {
            if (isLockEffectivelyActive && i === 3) { // Slot index 3 is top-right
                newGridSetup[i] = lockedSymbolForGrid;
            } else {
                availableSlotIndices.push(i);
            }
        }
        shuffleArray(availableSlotIndices);

        for (const slotIndex of availableSlotIndices) {
            if (bag.length > 0) {
                newGridSetup[slotIndex] = bag.pop();
            } else {
                newGridSetup[slotIndex] = null;
            }
        }
        return newGridSetup;
    }

    function getTotalBirdCount() {
        let totalBirds = 0;
        const birdEmojis = ["🦜", "🦉", "🕊️", "🐦‍🔥"];
        birdEmojis.forEach(emoji => {
            const birdSymbol = symbols.find(s => s.emoji === emoji);
            if (birdSymbol) {
                totalBirds += birdSymbol.count;
            }
        });
        return totalBirds;
    }


    // --- GAME LOGIC FUNCTIONS ---
    function gameOver(reason) {
        if (uiState.isGameOver) return;
        uiState.isGameOver = true;
        DOM_ELEMENTS.totalWinDisplay.textContent = `Game Over: ${reason}`;
        DOM_ELEMENTS.totalWinDisplay.classList.add('game-over');

        DOM_ELEMENTS.luckyBtn.disabled = true;

        document.querySelectorAll('.shop-item-btn').forEach(btn => btn.disabled = true);
        document.querySelectorAll('.slot-cell').forEach(cell => cell.onclick = null);
        document.querySelectorAll('.inventory-item.clickable').forEach(item => {
            item.onclick = null; item.style.cursor = 'not-allowed';
        });

        if (activeEffects.cosmicUpgradeActive) deactivateCosmicUpgradeBonusMode(false);
        if (activeEffects.quantumUpgradeActive) deactivateQuantumUpgradeBonusMode(false);

        // Close all modals
        closeAllWindows();
        updateDisplays();
    }

    function spin() {
        if (DOM_ELEMENTS.spinBtn.textContent === 'SPINNING...' || uiState.isGameOver || DOM_ELEMENTS.spinBtn.disabled) {
            return;
        }
        
        playerState.spinCount++; 
        if (playerState.spinCount === 60 && !playerState.giftAwarded) {
            playerState.inventory['🎁']++;
            playerState.giftAwarded = true;
        }

        DOM_ELEMENTS.phoneMessageDisplay.textContent = '';
        DOM_ELEMENTS.phoneMessageDisplay.className = 'phone-message-display';


        if (playerState.inventory['📃'] > 0 && playerState.power <= 0) {
            if (Math.random() < GAME_CONFIG.gameOverOnUnpaidBillChance) {
                gameOver("Neglected Power Bill!");
                return;
            }
        }

        if (playerState.foodMeter <= 0) {
            gameOver("Out of food!");
            return;
        }

        DOM_ELEMENTS.spinBtn.disabled = true;
        DOM_ELEMENTS.totalWinDisplay.textContent = '';
        DOM_ELEMENTS.totalWinDisplay.classList.remove('game-over');

        let currentSpinCost = slotMachineState.luckyLines ? GAME_CONFIG.luckyLinesSpinCost : GAME_CONFIG.spinCostBase;

        if (playerState.coins < currentSpinCost) {
            gameOver("Out of coins!");
            return;
        }

        if (activeEffects.hasAlienVisitor) {
            const friesSymbol = symbols.find(s => s.emoji === "🍟");
            if (friesSymbol && friesSymbol.count > 0) {
                friesSymbol.count = 0;
            }
        }

        let baseConsumption = GAME_CONFIG.baseSpinFoodConsumption;
        let foodToConsumeThisSpin = Math.max(0, baseConsumption);
        if (activeEffects.hasPetCat) foodToConsumeThisSpin += GAME_CONFIG.catFoodConsumption;
        
        if (playerState.foodMeter < foodToConsumeThisSpin) {
             gameOver("Not enough food for this spin!");
             return;
        }

        const isLockEffectivelyActive = slotMachineState.topRightLocked;

        if (isLockEffectivelyActive && !slotMachineState.currentGridSymbols[3]) {
            DOM_ELEMENTS.spinBtn.disabled = false;
            updateDisplays();
            return;
        }

        windowFeatureState.birdGainedThisSpin = null;

        playerState.coins -= currentSpinCost;
        playerState.foodMeter -= foodToConsumeThisSpin;
        playerState.foodMeter = Math.max(0, playerState.foodMeter);

        let powerConsumedThisSpin = 1;
        if (activeEffects.cosmicUpgradePenaltyActive) powerConsumedThisSpin += 2;
        if (activeEffects.quantumUpgradePenaltyActive) powerConsumedThisSpin += 5;

        if (playerState.power > 0) {
            playerState.power -= powerConsumedThisSpin;
            playerState.power = Math.max(0, playerState.power);
        }

        if (playerState.power <= 0 && playerState.inventory['📃'] === 0) {
            playerState.inventory['📃']++;
        }

        if (activeEffects.hasPetCat && !activeEffects.hasMouseToy) activeEffects.spinsWithCat++;

        if (phoneFeatureState.investmentActive) handleInvestmentSpin();
        if (phoneFeatureState.takeoutActive) handleTakeoutSpin();

        if (activeEffects.cosmicUpgradeActive) {
            activeEffects.cosmicUpgradeSpinsLeft--;
        }
        if (activeEffects.quantumUpgradeActive) {
            activeEffects.quantumUpgradeSpinsLeft--;
        }

        if (uiState.windowOpen) {
            if (Math.random() < GAME_CONFIG.birdGainChance) {
                if (getTotalBirdCount() < GAME_CONFIG.maxTotalBirdsCap) {
                    const availableBirdTypes = ["🦜", "🦉", "🕊️", "🐦‍🔥"];
                    const randomBirdEmoji = availableBirdTypes[Math.floor(Math.random() * availableBirdTypes.length)];
                    windowFeatureState.birdGainedThisSpin = randomBirdEmoji;
                }
            }

            if (windowFeatureState.hasBirdNest) {
                // Nest protects
            } else if (Math.random() < GAME_CONFIG.birdLossChance) {
                let birdsEligibleToFly = symbols.filter(s => ["🦜", "🦉", "🕊️", "🐦‍🔥"].includes(s.emoji) && s.count > 0);

                if (isLockEffectivelyActive && slotMachineState.topRightSymbol && ["🦜", "🦉", "🕊️", "🐦‍🔥"].includes(slotMachineState.topRightSymbol.emoji)) {
                    const lockedBirdType = slotMachineState.topRightSymbol.emoji;
                    const symbolEntry = symbols.find(s => s.emoji === lockedBirdType);
                    if (symbolEntry && symbolEntry.count === 1) {
                        birdsEligibleToFly = birdsEligibleToFly.filter(b => b.emoji !== lockedBirdType);
                    }
                }

                if (birdsEligibleToFly.length > 0) {
                    if (windowFeatureState.beetles > 0) {
                        windowFeatureState.beetles--;
                    } else {
                        const birdToLoseIndex = Math.floor(Math.random() * birdsEligibleToFly.length);
                        const birdToLoseEmoji = birdsEligibleToFly[birdToLoseIndex].emoji;
                        const birdSymbolInMainArray = symbols.find(s => s.emoji === birdToLoseEmoji);
                        if (birdSymbolInMainArray && birdSymbolInMainArray.count > 0) {
                            birdSymbolInMainArray.count--;
                        }
                    }
                }
            }
        }
        
        if (phoneFeatureState.phoneOn && Math.random() < GAME_CONFIG.spamTextChance) {
            if (Math.random() < 0.5) {
                playerState.coins -= GAME_CONFIG.spamTextCost; showPhoneMessage(`⚠️ Spam Text: -${GAME_CONFIG.spamTextCost} Coins!`, "loss");
            } else {
                playerState.coins += GAME_CONFIG.friendlyTextGain; showPhoneMessage(`👥 Friendly Text: +${GAME_CONFIG.friendlyTextGain} Coins!`, "friendly");
            }
            playerState.coins = Math.max(0, playerState.coins);
        }

        slotMachineState.currentMultiplier = getRandomMultiplier();
        slotMachineState.currentGridSymbols = getSymbolsForSpin();
        slotMachineState.schrodingerCells = []; 

        if (activeEffects.quantumUpgradeActive) {
            const availableIndicesForSchrodinger = [];
            for (let k = 0; k < GAME_CONFIG.gridSize; k++) {
                if (slotMachineState.currentGridSymbols[k]) {
                    availableIndicesForSchrodinger.push(k);
                }
            }
            shuffleArray(availableIndicesForSchrodinger);
            for (let k = 0; k < GAME_CONFIG.schrodingerCatsCount && availableIndicesForSchrodinger.length > 0; k++) {
                slotMachineState.schrodingerCells.push(availableIndicesForSchrodinger.pop());
            }
        }


        DOM_ELEMENTS.spinBtn.textContent = 'SPINNING...';
        updateGridDOM(slotMachineState.currentGridSymbols, slotMachineState.currentMultiplier, true);

        const animationPopInDuration = 400;
        const baseDelayPerCell = 50;
        const numAnimatedCells = isLockEffectivelyActive ? GAME_CONFIG.gridSize - 1 : GAME_CONFIG.gridSize;
        const maxSequentialDelay = (numAnimatedCells > 0 ? numAnimatedCells - 1 : 0) * baseDelayPerCell;
        const totalAnimationCompletionTime = maxSequentialDelay + animationPopInDuration;
        const spinTimeoutBuffer = 100;
        const spinCompleteTimeout = totalAnimationCompletionTime + spinTimeoutBuffer;


        setTimeout(() => {
            try {
                if (uiState.isGameOver && DOM_ELEMENTS.spinBtn.textContent === 'GAME OVER') return;

                slotMachineState.currentGridSymbols.forEach((item) => {
                    if (item) {
                        if (item.emoji === "🦜" && Math.random() < GAME_CONFIG.parrotBeetleDropChance) {
                            if (!windowFeatureState.hasBirdNest && windowFeatureState.beetles < GAME_CONFIG.maxBeetles) {
                                windowFeatureState.beetles++;
                            }
                        } else if (item.emoji === "🕊️" && Math.random() < GAME_CONFIG.doveBranchDropChance) {
                            if (!windowFeatureState.hasBranch) windowFeatureState.hasBranch = true;
                        } else if (item.emoji === "🦉" && Math.random() < GAME_CONFIG.owlFeatherDropChance) {
                            if (windowFeatureState.feathers < GAME_CONFIG.maxFeathers) windowFeatureState.feathers++;
                        }
                    }
                });

                if (activeEffects.cosmicUpgradeActive) {
                    slotMachineState.currentGridSymbols.forEach((item) => {
                        if (item && item.emoji === "🛸") {
                            if (!activeEffects.hasAlienVisitor && playerState.inventory["👽"] < 1 && Math.random() < GAME_CONFIG.ufoAlienDropChance) {
                                playerState.inventory["👽"]++;
                                activeEffects.alienDroppedByUFO = true;
                            }
                        }
                    });
                }


                calculatePayout();

                if (activeEffects.donutBuffActive) {
                    activeEffects.donutBuffSpinsLeft--;
                    if (activeEffects.donutBuffSpinsLeft <= 0) activeEffects.donutBuffActive = false;
                }
                if (activeEffects.sushiCatBuffActive) {
                    activeEffects.sushiCatBuffSpinsLeft--;
                    if (activeEffects.sushiCatBuffSpinsLeft <= 0) activeEffects.sushiCatBuffActive = false;
                }

                DOM_ELEMENTS.totalWinDisplay.textContent = slotMachineState.currentWin > 0 ? `Win: ${slotMachineState.currentWin} coins!` : 'No Win';

                if (windowFeatureState.birdGainedThisSpin) {
                    const birdToFinallyAdd = symbols.find(s => s.emoji === windowFeatureState.birdGainedThisSpin);
                    if (birdToFinallyAdd) {
                        if (getTotalBirdCount() < GAME_CONFIG.maxTotalBirdsCap) {
                            birdToFinallyAdd.count++;
                        }
                    }
                    windowFeatureState.birdGainedThisSpin = null;
                }

                if (activeEffects.cosmicUpgradeActive && activeEffects.cosmicUpgradeSpinsLeft <= 0) {
                    deactivateCosmicUpgradeBonusMode();
                }
                if (activeEffects.quantumUpgradeActive && activeEffects.quantumUpgradeSpinsLeft <= 0) {
                    deactivateQuantumUpgradeBonusMode();
                }


                if (playerState.foodMeter <= 0 && !uiState.isGameOver) {
                    gameOver("Out of food!");
                }

            } catch (error) {
                console.error("Error in spin timeout callback:", error);
            } finally {
                updateDisplays();
            }
        }, spinCompleteTimeout);
    }

    function getSingleItemPayout(item, index) {
        if (!item) return 0;
    
        let itemValue = item.originalValue;
    
        if (item.isCosmic && activeEffects.hasAlienVisitor) itemValue += 12;
        if (item.emoji === "🍩" && activeEffects.donutBuffActive) itemValue += 3;
        else if (item.emoji === "🐈‍⬛" && activeEffects.hasPetCat) {
            let catBase = item.originalValue;
            if (activeEffects.sushiCatBuffActive) itemValue = catBase + 5;
            else if (activeEffects.currentCatStatus === '😺') itemValue = catBase + 1;
            else if (activeEffects.currentCatStatus === '🙀' || activeEffects.currentCatStatus === '🙀🪲') itemValue = catBase - 1;
            itemValue = Math.max(1, itemValue);
        } else if (["🦜", "🦉", "🕊️", "🐦‍🔥"].includes(item.emoji)) {
            if(windowFeatureState.feathers > 0) itemValue += windowFeatureState.feathers;
            if(activeEffects.permanentBirdBuff) itemValue += 1;
        }
    
        if (activeEffects.quantumUpgradeActive && slotMachineState.schrodingerCells.includes(index)) {
            itemValue *= GAME_CONFIG.schrodingerCatMultiplier;
        }
    
        if (activeEffects.quantumUpgradeActive) { 
            if (index >= 4 && index <= 7) { 
                itemValue *= slotMachineState.currentMultiplier;
            }
        } else if (activeEffects.cosmicUpgradeActive) {
            if (index >= 4 && index <= 7) {
                itemValue *= slotMachineState.currentMultiplier;
            }
        } else { 
            if (index === GAME_CONFIG.multiplierSlotIndex) {
                itemValue *= slotMachineState.currentMultiplier;
            }
        }
    
        return Math.max(0, itemValue);
    }

    function calculatePayout() {
        let totalPayout = 0;
        const individualPayouts = Array(GAME_CONFIG.gridSize).fill(0);

        slotMachineState.currentGridSymbols.forEach((item, i) => {
            if (item) {
                const itemPayout = getSingleItemPayout(item, i);
                totalPayout += itemPayout;
                individualPayouts[i] = itemPayout;
            }
        });

        if (slotMachineState.luckyLines) {
            const topRow = slotMachineState.currentGridSymbols.slice(0, 4);
            const bottomRow = slotMachineState.currentGridSymbols.slice(4, 8);
            if (topRow.length === 4 && topRow.every(s => s && s.emoji === topRow[0].emoji)) {
                totalPayout += GAME_CONFIG.luckyLinesBonus;
            }
            if (bottomRow.length === 4 && bottomRow.every(s => s && s.emoji === bottomRow[0].emoji)) {
                totalPayout += GAME_CONFIG.luckyLinesBonus;
            }
        }
        slotMachineState.currentWin = totalPayout;
        playerState.coins += totalPayout;
        displayIndividualPayouts(individualPayouts);
    }

    // --- UPDATE DISPLAY FUNCTIONS ---
    function updateDisplays() {
        DOM_ELEMENTS.coinsDisplay.textContent = `Coins ${playerState.coins}`;
        DOM_ELEMENTS.foodMeterFill.style.width = `${(playerState.foodMeter / GAME_CONFIG.maxFoodMeter) * 100}%`;
        DOM_ELEMENTS.foodMeterValue.textContent = `${playerState.foodMeter}/${GAME_CONFIG.maxFoodMeter}`;

        updateSymbolInventoryDisplay();
        updatePlayerInventoryDisplay();
        updatePetModal();
        setupShop();
        updatePowerDisplay();
        updateNextPowerBillCostDisplay();
        updateStatusEffectsWindow();
        updateWindowButtonState(); // Update window button icon

        if (playerState.foodMeter <= 4 && playerState.foodMeter > 0) {
            if (DOM_ELEMENTS.gameDiv) DOM_ELEMENTS.gameDiv.classList.add('food-warning');
            uiState.foodWarningActive = true;
        } else {
            if (DOM_ELEMENTS.gameDiv) DOM_ELEMENTS.gameDiv.classList.remove('food-warning');
            uiState.foodWarningActive = false;
        }

        if (uiState.isGameOver) {
            DOM_ELEMENTS.spinBtn.textContent = 'GAME OVER';
            DOM_ELEMENTS.spinBtn.disabled = true;
            DOM_ELEMENTS.spinBtn.classList.remove('btn-spin-lucky', 'btn-spin-bill-unpaid');
        } else {
            DOM_ELEMENTS.spinBtn.disabled = false;

            let currentSpinButtonCostText = slotMachineState.luckyLines ? `${GAME_CONFIG.luckyLinesSpinCost} 🪙` : `${GAME_CONFIG.spinCostBase} 🪙`;
            DOM_ELEMENTS.luckyBtn.classList.toggle('active', slotMachineState.luckyLines);
            DOM_ELEMENTS.spinBtn.classList.toggle('btn-spin-lucky', slotMachineState.luckyLines);
            DOM_ELEMENTS.spinBtn.textContent = `Spin - ${currentSpinButtonCostText}`;

            DOM_ELEMENTS.spinBtn.classList.toggle('btn-spin-bill-unpaid', playerState.inventory['📃'] > 0 && playerState.power <= 0);
        }

        if (DOM_ELEMENTS.luckyBtn) DOM_ELEMENTS.luckyBtn.disabled = uiState.isGameOver;
    }

    function updateSymbolInventoryDisplay() {
        DOM_ELEMENTS.symbolInventoryDisplay.innerHTML = "";
        symbols.filter(s => s.count > 0 && !s.hidden).forEach(symbol => {
            const span = document.createElement("span");
            span.textContent = `${symbol.emoji} ${symbol.count}`;
            DOM_ELEMENTS.symbolInventoryDisplay.appendChild(span);
        });
    }

    function updatePlayerInventoryDisplay() {
        DOM_ELEMENTS.playerInventoryContent.innerHTML = "";
        const lockSpan = document.createElement("span");
        lockSpan.className = 'inventory-item clickable';
        lockSpan.textContent = `🔐 ${playerState.lockItems}`;
        if (!uiState.isGameOver) {
            lockSpan.onclick = toggleGridLock;
        }
        DOM_ELEMENTS.playerInventoryContent.appendChild(lockSpan);

        for (const itemEmoji in playerState.inventory) {
            if (playerState.inventory[itemEmoji] > 0) {
                const itemSpan = document.createElement("span");
                itemSpan.className = 'inventory-item';
                itemSpan.textContent = `${itemEmoji} ${playerState.inventory[itemEmoji]}`;
                if (!uiState.isGameOver) {
                    if (itemEmoji === "☕") {
                        itemSpan.classList.add("clickable");
                        itemSpan.style.opacity = activeEffects.donutBuffActive ? "0.7" : "1";
                        if (!activeEffects.donutBuffActive) itemSpan.onclick = consumeCoffee; else itemSpan.onclick = null;
                    } else if (itemEmoji === "👽") {
                        itemSpan.classList.add("clickable");
                        itemSpan.style.opacity = (!activeEffects.hasAlienVisitor) ? "1" : "0.7";
                        if (!activeEffects.hasAlienVisitor) itemSpan.onclick = activateAlienVisitor; else itemSpan.onclick = null;
                    } else if (itemEmoji === "📃") {
                        itemSpan.classList.add("clickable");
                        itemSpan.onclick = consumePowerBill;
                    } else if (itemEmoji === "🎥") {
                        itemSpan.classList.add("clickable");
                        itemSpan.style.opacity = activeEffects.hasAlienVisitor ? "1" : "0.7";
                        if (activeEffects.hasAlienVisitor) itemSpan.onclick = consumeCamera; else itemSpan.onclick = null;
                    } else if (itemEmoji === "🎁") {
                        itemSpan.classList.add("clickable", "inventory-item-gift");
                        itemSpan.onclick = showGiftChoiceModal;
                    }
                }
                DOM_ELEMENTS.playerInventoryContent.appendChild(itemSpan);
            }
        }
    }

    function updatePetModal() {
        const content = DOM_ELEMENTS.petModalContent;
        content.innerHTML = "";

        let titleEmoji = "💙";
        if (activeEffects.hasAlienVisitor) {
            titleEmoji = "👽";
            const alienText = document.createElement('div');
            alienText.className = 'alien-visitor-text';

            let alienInfo = `<span class="alien-emoji-large">👽</span><br/>Cosmic Visitor<br/>(+12 to Cosmic Symbols)`;
            const friesSymbol = symbols.find(s => s.emoji === "🍟");
            if (friesSymbol && friesSymbol.count > 0) {
                alienInfo += `<br/><span style="font-size:0.8em; color: var(--accent-yellow);">Will consume ${friesSymbol.count} 🍟</span>`;
            } else {
                 alienInfo += `<br/><span style="font-size:0.8em; color: var(--text-secondary);">No 🍟 to consume</span>`;
            }
            alienText.innerHTML = alienInfo;
            content.appendChild(alienText);
        } else if (activeEffects.hasPetCat) {
            titleEmoji = "🐈";
    
            let newStatus = '😺'; 
            if (!activeEffects.hasMouseToy && activeEffects.spinsWithCat >= 20) {
                newStatus = '😿'; 
            }
            if (getTotalBirdCount() >= 4 && !windowFeatureState.hasBirdNest) {
                newStatus = '😼'; 
            }
            if (windowFeatureState.beetles > 0 && !windowFeatureState.hasBirdNest) {
                newStatus = '🙀🪲'; 
            }
            if (activeEffects.sushiCatBuffActive) {
                newStatus = '😻🍣'; 
            }
            activeEffects.currentCatStatus = newStatus;

            const petInfoContainer = document.createElement('div');
            petInfoContainer.className = 'pet-info-container';

            const mainArea = document.createElement('div');
            mainArea.className = 'pet-main-area';

            const petDiv = document.createElement('div');
            petDiv.className = 'pet-display';
            petDiv.innerHTML = `<span class="pet-status-emoji">${activeEffects.currentCatStatus}</span>`;
            mainArea.appendChild(petDiv);

            const petDescDiv = document.createElement('div');
            petDescDiv.className = 'pet-description';
            if (activeEffects.currentCatStatus === '😻🍣') petDescDiv.textContent = `All Cats +5!`;
            else if (activeEffects.currentCatStatus === '😺') petDescDiv.textContent = '+1 All Cats';
            else if (activeEffects.currentCatStatus === '😿') petDescDiv.textContent = 'Wants toy/No buff';
            else if (activeEffects.currentCatStatus === '😼') petDescDiv.textContent = 'Too many birds/no buff.';
            else if (activeEffects.currentCatStatus === '🙀🪲') petDescDiv.textContent = '-1 All Cats (Scared by 🪲!)';
            mainArea.appendChild(petDescDiv);

            petInfoContainer.appendChild(mainArea);
            content.appendChild(petInfoContainer);

            const petBottomArea = document.createElement('div');
            petBottomArea.className = 'pet-bottom-area';

            if (activeEffects.hasMouseToy) {
                const toySpan = document.createElement('span');
                toySpan.id = 'pet-toy-display';
                toySpan.textContent = '🐁';
                petBottomArea.appendChild(toySpan);
            }

            const foodConsumptionDiv = document.createElement('div');
            foodConsumptionDiv.className = 'pet-food-consumption';
            foodConsumptionDiv.textContent = `(-${GAME_CONFIG.catFoodConsumption} 🍽️ per spin)`;
            petBottomArea.appendChild(foodConsumptionDiv);

            content.appendChild(petBottomArea);

        } else {
            content.innerHTML = '<div>No companion active. Adopt a 🐈‍⬛ from the grid or activate an 👽 from your inventory.</div>';
        }

        DOM_ELEMENTS.petModalTitle.innerHTML = `${titleEmoji} Companion`;
    }


    // REMOVED: updateWindowModal function is no longer needed

    // NEW: Function to update the window button state
    function updateWindowButtonState() {
        if (DOM_ELEMENTS.windowTriggerBtn) {
            DOM_ELEMENTS.windowTriggerBtn.textContent = uiState.windowOpen ? '🪟' : '⬜';
            DOM_ELEMENTS.windowTriggerBtn.classList.toggle('toggled-off', !uiState.windowOpen);
        }
    }

    function updateGridDOM(gridSymbols, currentMultiplier, animate = false) {
        DOM_ELEMENTS.grid.innerHTML = "";
        const baseDelayPerCell = 50;
        const isLockEffectivelyActiveForAnim = slotMachineState.topRightLocked;


        gridSymbols.forEach((item, index) => {
            const div = document.createElement("div");
            div.className = "slot-cell";
            div.classList.remove('schrodinger-cat-effect');

            if (animate) {
                div.classList.add('anim-popIn');
                if (index === 3 && isLockEffectivelyActiveForAnim) {
                    div.style.animation = 'none';
                    div.style.opacity = '1';
                } else {
                    let effectiveAnimIndex = index;
                    if (isLockEffectivelyActiveForAnim && index > 3) {
                        effectiveAnimIndex--;
                    }
                    const currentCellDelay = effectiveAnimIndex * baseDelayPerCell;
                    div.style.animationDelay = `${currentCellDelay}ms`;
                }
            }

            const emojiSpan = document.createElement("span");
            emojiSpan.textContent = item ? item.emoji : '';
            div.appendChild(emojiSpan);

            const baseValueSpan = document.createElement("span");
            baseValueSpan.className = "base-value-text";
            div.appendChild(baseValueSpan);

            let isMultiplierCellForThisSpin = false;
            if (activeEffects.quantumUpgradeActive || activeEffects.cosmicUpgradeActive) {
                if (index >= 4 && index <= 7) isMultiplierCellForThisSpin = true;
            } else {
                if (index === GAME_CONFIG.multiplierSlotIndex) isMultiplierCellForThisSpin = true;
            }

            if (item) {
                const finalPayout = getSingleItemPayout(item, index);
                baseValueSpan.textContent = finalPayout;
    
                let isVisuallyBuffed = false;
                if (
                    (item.emoji === "🍩" && activeEffects.donutBuffActive) ||
                    (item.emoji === "🐈‍⬛" && activeEffects.hasPetCat && (activeEffects.sushiCatBuffActive || activeEffects.currentCatStatus === '😺')) ||
                    (["🦜", "🦉", "🕊️", "🐦‍🔥"].includes(item.emoji) && (windowFeatureState.feathers > 0 || activeEffects.permanentBirdBuff))
                ) {
                    isVisuallyBuffed = true;
                }
                let isAlienBuffed = item.isCosmic && activeEffects.hasAlienVisitor;
    
                if (isMultiplierCellForThisSpin) {
                    baseValueSpan.classList.add(`base-value-in-multi-${currentMultiplier}x`);
                } else if (isVisuallyBuffed || isAlienBuffed) {
                    baseValueSpan.classList.add('base-value-buffed');
                } else {
                    baseValueSpan.classList.add('base-value-base');
                }
    
            } else {
                baseValueSpan.textContent = '';
            }

            const payoutSpan = document.createElement("span");
            payoutSpan.className = "payout-text";
            div.appendChild(payoutSpan);

            div.classList.remove('multi-2x', 'multi-3x', 'multi-5x');

            if (isMultiplierCellForThisSpin) {
                div.classList.add(`multi-${currentMultiplier}x`);
                const multiTextSpan = document.createElement("span");
                multiTextSpan.className = "multiplier-value-text";
                multiTextSpan.textContent = `${currentMultiplier}x`;
                div.appendChild(multiTextSpan);
            }

            if (activeEffects.quantumUpgradeActive && slotMachineState.schrodingerCells.includes(index)) {
                div.classList.add('schrodinger-cat-effect');
            }

            if (index === 3) {
                 if (slotMachineState.topRightLocked) {
                    div.classList.add("top-right-locked");
                }
                if (item) { // Always show lock icon if there is a symbol
                    const lockDiv = document.createElement("div");
                    lockDiv.className = "lock-icon";
                    // lockDiv.onclick = () => toggleGridLock(); // REMOVED: No longer clickable
                    if(slotMachineState.topRightLocked) {
                        lockDiv.textContent = '🔒';
                        lockDiv.classList.add("locked-state");
                    } else {
                        lockDiv.textContent = '🔓';
                         if (playerState.lockItems <= 0) {
                            lockDiv.classList.add("no-locks");
                        }
                    }
                    div.appendChild(lockDiv);
                }
            }


            if (item && item.isFood && !uiState.isGameOver) {
                const foodItemInBag = symbols.find(s => s.emoji === item.emoji);
                if (foodItemInBag && foodItemInBag.count > 0 && playerState.foodMeter < GAME_CONFIG.maxFoodMeter) {
                    div.classList.add('clickable-food');
                    div.onclick = () => clickFoodEmoji(item.emoji, index);
                }
            }
            if (item && item.emoji === "🐈‍⬛" && !activeEffects.hasPetCat && !activeEffects.hasAlienVisitor && !uiState.isGameOver) {
                div.classList.add('clickable-cat');
                div.onclick = () => clickCatEmoji(index);
            }

            DOM_ELEMENTS.grid.appendChild(div);
        });
    }

    function displayIndividualPayouts(payouts) {
        DOM_ELEMENTS.grid.querySelectorAll('.slot-cell').forEach((cell, index) => {
            const payoutText = cell.querySelector('.payout-text');
            if (payoutText && payouts[index] > 0) {
                payoutText.textContent = `+${payouts[index]}`;
                payoutText.classList.remove('hide');
                payoutText.classList.add('show');
                setTimeout(() => {
                    payoutText.classList.remove('show');
                    payoutText.classList.add('hide');
                }, 1500);
            }
        });
    }

    function updatePowerDisplay() {
        if (DOM_ELEMENTS.powerMeterFill) {
            DOM_ELEMENTS.powerMeterFill.style.width = `${(playerState.power / GAME_CONFIG.maxPower) * 100}%`;
        }
        if (DOM_ELEMENTS.powerMeterIndicatorIcon) {
            let powerIconHTML = "";
            if (activeEffects.quantumUpgradePenaltyActive) {
                powerIconHTML += "<span class='power-penalty-indicator quantum-indicator'>⚛️</span>";
            }
            powerIconHTML += "<span class='base-power-icon'>🔌</span>";
            if (activeEffects.cosmicUpgradePenaltyActive) {
                powerIconHTML += "<span class='power-penalty-indicator cosmic-indicator'>🔭</span>";
            }
            DOM_ELEMENTS.powerMeterIndicatorIcon.innerHTML = powerIconHTML;
        }
    }

    function updateNextPowerBillCostDisplay() {
        if (DOM_ELEMENTS.nextPowerBillCostDisplay) {
            let displayText = "";
            if (playerState.inventory['📃'] > 0 && playerState.power <= 0) {
                const currentBillCost = GAME_CONFIG.powerBillBaseCost + (playerState.billsPaidSoFar * GAME_CONFIG.powerBillIncrement);
                displayText = `Bill: ${currentBillCost}🪙`;
            } else {
                const nextBillCost = GAME_CONFIG.powerBillBaseCost + (playerState.billsPaidSoFar * GAME_CONFIG.powerBillIncrement);
                displayText = `Next: ${nextBillCost}🪙`;
            }
            DOM_ELEMENTS.nextPowerBillCostDisplay.textContent = displayText;
        }
    }

    function updateStatusEffectsWindow() {
        // Standard Buffs
        const donutActive = activeEffects.donutBuffActive && activeEffects.donutBuffSpinsLeft > 0;
        DOM_ELEMENTS.donutBuffStatusEl.innerHTML = donutActive ? `<span class="buff-emoji">🍩</span> <span class="buff-countdown">${activeEffects.donutBuffSpinsLeft}</span>` : '';
        DOM_ELEMENTS.donutBuffStatusEl.style.display = donutActive ? 'flex' : 'none';

        const sushiActive = activeEffects.sushiCatBuffActive && activeEffects.sushiCatBuffSpinsLeft > 0;
        DOM_ELEMENTS.sushiBuffStatusEl.innerHTML = sushiActive ? `<span class="buff-emoji">😻</span> <span class="buff-countdown">${activeEffects.sushiCatBuffSpinsLeft}</span>` : '';
        DOM_ELEMENTS.sushiBuffStatusEl.style.display = sushiActive ? 'flex' : 'none';

        // Cat Buff Logic
        const baseCatBuffActive = activeEffects.hasPetCat && !sushiActive && activeEffects.currentCatStatus === '😺';
        DOM_ELEMENTS.catBuffStatusEl.innerHTML = baseCatBuffActive ? `<span class="buff-emoji">😺</span> <span class="buff-value">+1</span>` : '';
        DOM_ELEMENTS.catBuffStatusEl.style.display = baseCatBuffActive ? 'flex' : 'none';

        const cosmicBonusModeActive = activeEffects.cosmicUpgradeActive && activeEffects.cosmicUpgradeSpinsLeft > 0;
        DOM_ELEMENTS.cosmicModeStatusEl.innerHTML = cosmicBonusModeActive ? `<span class="buff-emoji">🔭</span> <span class="buff-countdown">${activeEffects.cosmicUpgradeSpinsLeft}</span>` : '';
        DOM_ELEMENTS.cosmicModeStatusEl.style.display = cosmicBonusModeActive ? 'flex' : 'none';

        const quantumBonusModeActive = activeEffects.quantumUpgradeActive && activeEffects.quantumUpgradeSpinsLeft > 0;
        DOM_ELEMENTS.quantumModeStatusEl.innerHTML = quantumBonusModeActive ? `<span class="buff-emoji">⚛️</span> <span class="buff-countdown">${activeEffects.quantumUpgradeSpinsLeft}</span>` : '';
        DOM_ELEMENTS.quantumModeStatusEl.style.display = quantumBonusModeActive ? 'flex' : 'none';
        
        DOM_ELEMENTS.permanentBuffStatusEl.innerHTML = '';
        DOM_ELEMENTS.permanentBuffStatusEl.style.display = 'none';
        let permanentBuffsHTML = '';
        if (activeEffects.permanentBirdBuff) {
             permanentBuffsHTML += `<span>🐦+1</span>`;
        } 
        if (activeEffects.permanentFoodReplenishBuff) {
             permanentBuffsHTML += `<span>🍽️+1</span>`;
        }
        if (permanentBuffsHTML) {
            DOM_ELEMENTS.permanentBuffStatusEl.innerHTML = permanentBuffsHTML;
            DOM_ELEMENTS.permanentBuffStatusEl.style.display = 'flex';
        }

        // Phone Buff
        const phoneActive = phoneFeatureState.phoneOn;
        if (phoneActive) {
            const spinsLeft = Math.max(phoneFeatureState.investmentSpinsLeft, phoneFeatureState.takeoutSpinsLeft);
            DOM_ELEMENTS.phoneBuffStatusEl.innerHTML = `<span class="buff-emoji">📱</span> <span class="buff-countdown">${spinsLeft}</span>`;
            DOM_ELEMENTS.phoneBuffStatusEl.style.display = 'flex';
        } else {
            DOM_ELEMENTS.phoneBuffStatusEl.innerHTML = '';
            DOM_ELEMENTS.phoneBuffStatusEl.style.display = 'none';
        }

        // NEW: Window items status
        const nestActive = windowFeatureState.hasBirdNest;
        DOM_ELEMENTS.nestStatusEl.innerHTML = nestActive ? `<span class="buff-emoji">🪹</span>` : '';
        DOM_ELEMENTS.nestStatusEl.style.display = nestActive ? 'flex' : 'none';

        const feathers = windowFeatureState.feathers;
        DOM_ELEMENTS.featherStatusEl.innerHTML = feathers > 0 ? `<span class="buff-emoji">🪶</span> <span class="buff-countdown">${feathers}</span>` : '';
        DOM_ELEMENTS.featherStatusEl.style.display = feathers > 0 ? 'flex' : 'none';

        const beetles = windowFeatureState.beetles;
        DOM_ELEMENTS.beetleStatusEl.innerHTML = beetles > 0 ? `<span class="buff-emoji">🪲</span> <span class="buff-countdown">${beetles}</span>` : '';
        DOM_ELEMENTS.beetleStatusEl.style.display = beetles > 0 ? 'flex' : 'none';

        const branchActive = windowFeatureState.hasBranch;
        DOM_ELEMENTS.branchStatusEl.innerHTML = branchActive ? `<span class="buff-emoji">🌿</span>` : '';
        DOM_ELEMENTS.branchStatusEl.style.display = branchActive ? 'flex' : 'none';
    }


    // --- EVENT HANDLERS & UI INTERACTIONS ---
    function toggleLuckyLines() {
        if (!uiState.isGameOver) {
            slotMachineState.luckyLines = !slotMachineState.luckyLines;
            DOM_ELEMENTS.luckyBtn.classList.toggle("active", slotMachineState.luckyLines);
            updateDisplays();
        }
    }

    function toggleGridLock() {
        if (uiState.isGameOver || !slotMachineState.currentGridSymbols[3]) {
            return;
        }

        const willBeLocked = !slotMachineState.topRightLocked;

        if (willBeLocked) {
            if (playerState.lockItems <= 0) { return; }
            playerState.lockItems--;
            slotMachineState.topRightSymbol = slotMachineState.currentGridSymbols[3];
            slotMachineState.topRightLocked = true;
        } else {
            // Unlocking does not return the lock item
            slotMachineState.topRightSymbol = null;
            slotMachineState.topRightLocked = false;
        }
        updateGridDOM(slotMachineState.currentGridSymbols, slotMachineState.currentMultiplier, false);
        updateDisplays();
    }

    // UPDATED: This function is simpler now, just toggles state.
    function toggleWindow() {
        uiState.windowOpen = !uiState.windowOpen;
        updateDisplays(); // Let updateDisplays handle the visual change
    }

    function clickFoodEmoji(emoji, index) {
        if (uiState.isGameOver) return;
        if (playerState.foodMeter >= GAME_CONFIG.maxFoodMeter) return;

        const symbolOnGrid = slotMachineState.currentGridSymbols[index];
        if (symbolOnGrid && symbolOnGrid.emoji === emoji && symbolOnGrid.isFood) {
            const foodTypeInBag = symbols.find(s => s.emoji === emoji);
            if (foodTypeInBag && foodTypeInBag.count > 0) {
                foodTypeInBag.count--;
                let refillAmount = (symbolOnGrid.refill || 10) + (activeEffects.permanentFoodReplenishBuff ? 1 : 0);

                playerState.foodMeter = Math.min(GAME_CONFIG.maxFoodMeter, playerState.foodMeter + refillAmount);
                slotMachineState.currentGridSymbols[index] = null;

                if (emoji === "🍣" && activeEffects.hasPetCat && !activeEffects.sushiCatBuffActive) {
                    activeEffects.sushiCatBuffActive = true;
                    activeEffects.sushiCatBuffSpinsLeft = GAME_CONFIG.sushiBuffDuration;
                }

                if (index === 3 && slotMachineState.topRightLocked) {
                    slotMachineState.topRightLocked = false;
                    slotMachineState.topRightSymbol = null;
                }
                updateGridDOM(slotMachineState.currentGridSymbols, slotMachineState.currentMultiplier, false);
                updateDisplays();
            }
        }
    }

    function clickCatEmoji(index) {
        if (uiState.isGameOver || activeEffects.hasPetCat || activeEffects.hasAlienVisitor) {
            return;
        }
        const symbolOnGrid = slotMachineState.currentGridSymbols[index];
        const catSymbolData = symbols.find(s => s.emoji === "🐈‍⬛");

        if (symbolOnGrid && symbolOnGrid.emoji === "🐈‍⬛" && catSymbolData && catSymbolData.count > 0) {
            activeEffects.hasPetCat = true;
            activeEffects.spinsWithCat = 0;
            catSymbolData.count--;
            slotMachineState.currentGridSymbols[index] = null;

            if (index === 3 && slotMachineState.topRightLocked) {
                slotMachineState.topRightLocked = false;
                slotMachineState.topRightSymbol = null;
            }
            updateGridDOM(slotMachineState.currentGridSymbols, slotMachineState.currentMultiplier, false);
            updateDisplays();
        }
    }

    function purchaseItem(itemEmoji) {
        if (uiState.isGameOver) return;
        const itemData = SHOP_ITEMS_CONFIG.find(i => i.emoji === itemEmoji);
        if (!itemData) return;

        let cost = itemData.cost;
        if (itemEmoji === "🪹") {
            cost = windowFeatureState.hasBranch ? 250 : itemData.cost;
        }
        if (playerState.coins < cost) { return; }

        if (itemData.isUpgrade) {
            if (itemData.type === 'cosmic' && !activeEffects.cosmicUpgradePenaltyActive && !activeEffects.quantumUpgradeActive) {
                playerState.coins -= cost;
                activateCosmicUpgrade();
                closeShopModal();
            } else if (itemData.type === 'quantum' && !activeEffects.quantumUpgradePenaltyActive && !activeEffects.cosmicUpgradeActive) {
                playerState.coins -= cost;
                activateQuantumUpgrade();
                closeShopModal();
            }
        } else if (itemEmoji === "🪹") {
            if (windowFeatureState.hasBirdNest) { return; }
            playerState.coins -= cost;
            windowFeatureState.hasBirdNest = true;
            if (windowFeatureState.beetles > 0) windowFeatureState.beetles = 0;
        } else if (itemEmoji === "🐁") {
            if (!activeEffects.hasPetCat || activeEffects.hasMouseToy) { return; }
            playerState.coins -= cost;
            activeEffects.hasMouseToy = true;
            activeEffects.spinsWithCat = 0;
        } else if (itemEmoji === "🎥") {
            if (playerState.inventory[itemEmoji] >= 1) return;
            playerState.coins -= cost;
            playerState.inventory[itemEmoji]++;
        } else {
             if (playerState.inventory[itemEmoji] > 0 && itemEmoji === "⚫") return;
            playerState.coins -= cost;
            playerState.inventory[itemEmoji]++;
        }
        updateDisplays();
    }
    
    function setupShop() {
        DOM_ELEMENTS.shopContent.innerHTML = "";
        const sortedShopItems = [...SHOP_ITEMS_CONFIG].sort((a, b) => (a.isUpgrade ? 1 : 0) - (b.isUpgrade ? 1 : 0) || a.cost - b.cost);
    
        sortedShopItems.forEach(item => {
            if (item.emoji === "🪹" && windowFeatureState.hasBirdNest) return;
            if (item.emoji === "🐁" && activeEffects.hasMouseToy) return;
            if (["🎥", "⚫"].includes(item.emoji) && playerState.inventory[item.emoji] >= 1) return;
            if (item.isUpgrade) {
                if ((item.type === 'cosmic' && activeEffects.cosmicUpgradePenaltyActive) || (item.type === 'quantum' && activeEffects.quantumUpgradePenaltyActive)) {
                    return;
                }
            }
    
            const btn = document.createElement("button");
            btn.className = "shop-item-btn";
    
            let displayCost = item.cost;
            if (item.emoji === "🪹") displayCost = windowFeatureState.hasBranch ? 250 : item.cost;
    
            let canBuy = true;
            if (playerState.coins < displayCost || uiState.isGameOver) {
                canBuy = false;
            } else if (item.emoji === "🐁") {
                if (!activeEffects.hasPetCat) canBuy = false;
            } else if (item.isUpgrade) {
                if(activeEffects.cosmicUpgradeActive || activeEffects.quantumUpgradeActive) canBuy = false;
            }
    
            let buttonHTML = `${item.emoji} ${item.name}<strong class="shop-item-cost">${displayCost} 🪙`;
            if (item.powerCost) {
                buttonHTML += ` (-${item.powerCost}🔌)`;
            }
             buttonHTML += `</strong>`;
    
            btn.innerHTML = buttonHTML;
            btn.onclick = () => purchaseItem(item.emoji);
            btn.disabled = !canBuy;
            DOM_ELEMENTS.shopContent.appendChild(btn);
        });
    }


    function showPhoneMessage(message, type) {
        if (uiState.isGameOver) return;
        DOM_ELEMENTS.phoneMessageDisplay.textContent = message;
        DOM_ELEMENTS.phoneMessageDisplay.className = `phone-message-display ${type}`;
        
        setTimeout(() => {
            if(DOM_ELEMENTS.phoneMessageDisplay.textContent === message) {
                DOM_ELEMENTS.phoneMessageDisplay.textContent = '';
                DOM_ELEMENTS.phoneMessageDisplay.className = 'phone-message-display';
            }
        }, 4000);
    }
    
    function setupPhoneModal() {
        DOM_ELEMENTS.phoneModalContent.innerHTML = ''; 

        const investmentBtn = document.createElement('button');
        investmentBtn.id = 'investments-btn';
        investmentBtn.className = 'btn';
        investmentBtn.innerHTML = `🏦 Investments`;
        investmentBtn.onclick = showInvestmentUI;
        DOM_ELEMENTS.phoneModalContent.appendChild(investmentBtn);

        const takeoutBtn = document.createElement('button');
        takeoutBtn.id = 'takeout-area';
        takeoutBtn.className = 'btn';
        takeoutBtn.innerHTML = `🥡 Emoji Eats`;
        takeoutBtn.onclick = showTakeoutUI;
        DOM_ELEMENTS.phoneModalContent.appendChild(takeoutBtn);
        
        const isFeatureRunning = phoneFeatureState.investmentActive || phoneFeatureState.takeoutActive;
        investmentBtn.disabled = isFeatureRunning;
        takeoutBtn.disabled = isFeatureRunning;
    }


    function showInvestmentUI() {
        if (uiState.isGameOver || phoneFeatureState.investmentActive || phoneFeatureState.takeoutActive ) return;
        
        const maxInvest = Math.min(playerState.coins, 1000);
        DOM_ELEMENTS.phoneModalContent.innerHTML = `
            <div class="investment-ui">
                <span>Invest (Max: ${maxInvest})</span>
                <span id="invest-amount-display">0</span>
                <input type="range" id="investment-slider" min="0" max="${maxInvest}" value="0">
                <button id="invest-btn" class="btn">Invest</button>
            </div>`;
        const slider = document.getElementById('investment-slider');
        const amountDisplay = document.getElementById('invest-amount-display');
        const button = document.getElementById('invest-btn');
        slider.oninput = () => { amountDisplay.textContent = slider.value; };
        button.onclick = () => { startInvestment(parseInt(slider.value)); };
    }

    function startInvestment(amount) {
        if (uiState.isGameOver || amount <= 0 || amount > playerState.coins || amount > 1000) {
            return;
        }
        phoneFeatureState.investmentAmount = amount;
        playerState.coins -= amount;
        phoneFeatureState.investmentActive = true;
        phoneFeatureState.phoneOn = true; // Phone is now active for texts
        phoneFeatureState.investmentSpinsLeft = GAME_CONFIG.investmentDuration;
        closePhoneModal();
        updateDisplays();
    }

    function handleInvestmentSpin() {
        if (!phoneFeatureState.investmentActive || uiState.isGameOver) return;
        phoneFeatureState.investmentSpinsLeft--;
        if (phoneFeatureState.investmentSpinsLeft <= 0) resolveInvestment();
        updateDisplays();
    }

    function resolveInvestment() {
        if (!phoneFeatureState.investmentActive && !uiState.isGameOver) return;
        const profitMade = Math.random() < 0.75;
        let payoutAmount = profitMade ? Math.floor(phoneFeatureState.investmentAmount * 1.5) : Math.floor(phoneFeatureState.investmentAmount * 0.5);
        let messageText = `${profitMade ? '📈 Profit!' : '📉 Loss!'} +${payoutAmount} Coins!`;
        playerState.coins += payoutAmount;
        showPhoneMessage(messageText, profitMade ? 'profit' : 'loss');
        
        phoneFeatureState.investmentAmount = 0;
        phoneFeatureState.investmentActive = false;
        
        // Turn off phone for texts if takeout isn't also running
        if (!phoneFeatureState.takeoutActive) {
            phoneFeatureState.phoneOn = false;
        }
        updateDisplays();
    }


    function showTakeoutUI() {
        if (uiState.isGameOver || phoneFeatureState.takeoutActive || phoneFeatureState.investmentActive ) return;

        DOM_ELEMENTS.phoneModalContent.innerHTML = `
            <div class="takeout-ui">
                <span>Order Food: 15🪙 each (10 for 100🪙).</span>
                <span id="takeout-amount-display">1</span>
                <input type="range" id="takeout-slider" min="1" max="10" value="1">
                <button id="takeout-confirm-btn" class="btn">Order</button>
            </div>`;
        const slider = document.getElementById('takeout-slider');
        const amountDisplay = document.getElementById('takeout-amount-display');
        const button = document.getElementById('takeout-confirm-btn');
        slider.oninput = () => { amountDisplay.textContent = slider.value; };
        button.onclick = () => { startTakeoutOrder(parseInt(slider.value)); };
    }

    function startTakeoutOrder(amount) {
        if (uiState.isGameOver || amount < 1 || amount > 10) { return; }
        let costPerItem = 15;
        let totalCost = amount * costPerItem;
        if (amount === 10) totalCost = 100;

        if (playerState.coins < totalCost) { return; }

        playerState.coins -= totalCost;
        phoneFeatureState.takeoutFoodAmount = amount;
        phoneFeatureState.takeoutActive = true;
        phoneFeatureState.phoneOn = true; // Phone is now active for texts
        phoneFeatureState.takeoutSpinsLeft = GAME_CONFIG.takeoutDuration;
        closePhoneModal();
        updateDisplays();
    }

    function handleTakeoutSpin() {
        if (!phoneFeatureState.takeoutActive || uiState.isGameOver) return;
        phoneFeatureState.takeoutSpinsLeft--;
        if (phoneFeatureState.takeoutSpinsLeft <= 0) resolveTakeoutOrder();
        updateDisplays();
    }

    function resolveTakeoutOrder() {
        if (!phoneFeatureState.takeoutActive && !uiState.isGameOver) return;
        const foodSymbolsInGame = symbols.filter(s => s.isFood && !s.hidden);
        if (foodSymbolsInGame.length > 0) {
            for (let i = 0; i < phoneFeatureState.takeoutFoodAmount; i++) {
                const randomFoodType = foodSymbolsInGame[Math.floor(Math.random() * foodSymbolsInGame.length)];
                const symbolToIncrement = symbols.find(sy => sy.emoji === randomFoodType.emoji);
                if (symbolToIncrement) {
                    symbolToIncrement.count = Math.min(GAME_CONFIG.maxFoodSymbolCap, symbolToIncrement.count + 1);
                }
            }
        }
        showPhoneMessage(`🥡 +${phoneFeatureState.takeoutFoodAmount} food items delivered!`, "takeout-confirm");
        phoneFeatureState.takeoutActive = false;
        phoneFeatureState.takeoutFoodAmount = 0;
        
        // Turn off phone for texts if investment isn't also running
        if (!phoneFeatureState.investmentActive) {
            phoneFeatureState.phoneOn = false;
        }
        updateDisplays();
    }

    // --- CONSUMABLE ITEM FUNCTIONS ---
    function consumeCoffee() {
        if (uiState.isGameOver || playerState.inventory["☕"] <= 0 || activeEffects.donutBuffActive) {
            return;
        }
        playerState.inventory["☕"]--;
        activeEffects.donutBuffActive = true;
        activeEffects.donutBuffSpinsLeft = GAME_CONFIG.donutBuffDuration;
        updateDisplays();
    }

    function consumePowerBill() {
        if (uiState.isGameOver || playerState.inventory['📃'] <= 0) {
            return;
        }

        const billCost = GAME_CONFIG.powerBillBaseCost + (playerState.billsPaidSoFar * GAME_CONFIG.powerBillIncrement);
        if (playerState.coins < billCost) {
            return;
        }

        playerState.coins -= billCost;
        playerState.inventory['📃']--;
        playerState.billsPaidSoFar++;
        playerState.power = GAME_CONFIG.maxPower;

        updateDisplays();
    }

    function consumeCamera() {
        if (uiState.isGameOver || playerState.inventory["🎥"] <= 0 || !activeEffects.hasAlienVisitor) {
            return;
        }
        playerState.inventory["🎥"]--;
        activeEffects.hasAlienVisitor = false;
        activeEffects.alienDroppedByUFO = false; 

        const payout = Math.random() < 0.5 ? 4500 : 6000;
        playerState.coins += payout;

        const payout4500HTML = payout === 4500 ? `<span class="payout-option highlight">4500🪙</span>` : `4500🪙`;
        const payout6000HTML = payout === 6000 ? `<span class="payout-option highlight">6000🪙</span>` : `6000🪙`;
        const negotiationText = payout === 6000 ? 'You negotiated well!' : "You didn't negotiate well...";

        DOM_ELEMENTS.alienMediaPayoutContent.innerHTML = `You sold proof of alien life, scaring them away. Payouts: ${payout4500HTML} or ${payout6000HTML}.<br><br><strong>${negotiationText}</strong>`;
        DOM_ELEMENTS.alienMediaPayoutModal.classList.remove('hidden');
        
        updateDisplays();
    }


    // --- UPGRADE & GIFT FUNCTIONS ---
    function activateQuantumUpgrade() {
        if (uiState.isGameOver || activeEffects.quantumUpgradeActive || activeEffects.quantumUpgradePenaltyActive || activeEffects.cosmicUpgradeActive) return;

        activeEffects.quantumUpgradePenaltyActive = true;
        activeEffects.quantumUpgradeActive = true;
        activeEffects.quantumUpgradeSpinsLeft = GAME_CONFIG.quantumModeDuration;

        document.body.classList.add("quantum-theme");
        DOM_ELEMENTS.gameMainTitle.textContent = "QUANTUM MODE";
        DOM_ELEMENTS.gameMainTitle.classList.add('upgrade-mode-active'); 

        updateDisplays();
    }

    function activateCosmicUpgrade() {
        if (uiState.isGameOver || activeEffects.cosmicUpgradeActive || activeEffects.cosmicUpgradePenaltyActive || activeEffects.quantumUpgradeActive) return;

        activeEffects.cosmicUpgradePenaltyActive = true;
        activeEffects.cosmicUpgradeActive = true;
        activeEffects.cosmicUpgradeSpinsLeft = GAME_CONFIG.cosmicModeDuration;
        document.body.classList.add("cosmic-theme");

        DOM_ELEMENTS.gameMainTitle.textContent = "COSMIC MODE";
        DOM_ELEMENTS.gameMainTitle.classList.add('upgrade-mode-active');

        ["🪐", "🌠", "🌒", "🛸"].forEach(cosmicEmoji => {
            const symbol = symbols.find(s => s.emoji === cosmicEmoji);
            const initialCosmicSymbol = INITIAL_SYMBOLS_CONFIG.find(is => is.emoji === cosmicEmoji);
            if (symbol) {
                symbol.count = (symbol.count || 0) + 2;
                symbol.hidden = false;
            } else if (initialCosmicSymbol) {
                symbols.push({...initialCosmicSymbol, count: 2, originalValue: initialCosmicSymbol.value, hidden: false});
            }
        });
        updateDisplays();
    }


    function deactivateCosmicUpgradeBonusMode(showFeedback = true) {
        activeEffects.cosmicUpgradeActive = false;
        document.body.classList.remove("cosmic-theme");

        if (!activeEffects.quantumUpgradeActive) {
            DOM_ELEMENTS.gameMainTitle.textContent = "Keep Spinning";
            DOM_ELEMENTS.gameMainTitle.classList.remove('upgrade-mode-active');
        }

        updateDisplays();
    }

    function deactivateQuantumUpgradeBonusMode(showFeedback = true) {
        activeEffects.quantumUpgradeActive = false;
        document.body.classList.remove("quantum-theme");
        slotMachineState.schrodingerCells = [];

        if (!activeEffects.cosmicUpgradeActive) {
            DOM_ELEMENTS.gameMainTitle.textContent = "Keep Spinning";
            DOM_ELEMENTS.gameMainTitle.classList.remove('upgrade-mode-active');
        }
        
        updateDisplays();
    }


    function activateAlienVisitor() {
        if (uiState.isGameOver || playerState.inventory["👽"] <= 0 || activeEffects.hasAlienVisitor) {
            return;
        }

        if (activeEffects.hasPetCat) {
            const catSymbol = symbols.find(s => s.emoji === "🐈‍⬛");
            if (catSymbol) catSymbol.count = GAME_CONFIG.initialCatCount;
            activeEffects.hasPetCat = false;
            activeEffects.spinsWithCat = 0;
            activeEffects.sushiCatBuffActive = false;
            activeEffects.sushiCatBuffSpinsLeft = 0;
            activeEffects.currentCatStatus = '😺';
        }
        playerState.inventory["👽"]--;
        activeEffects.hasAlienVisitor = true;
        updateDisplays();
    }

    function showGiftChoiceModal() {
        if (uiState.isGameOver || playerState.inventory["🎁"] <= 0) return;
        DOM_ELEMENTS.giftChoiceModal.classList.remove('hidden');
    }

    function selectGift(choice) {
        if (playerState.inventory["🎁"] <= 0) return;
    
        playerState.inventory["🎁"]--;
    
        if (choice === 'bird') {
            activeEffects.permanentBirdBuff = true;
        } else if (choice === 'food') {
            activeEffects.permanentFoodReplenishBuff = true;
        } else if (choice === 'locks') {
            playerState.lockItems += 3;
        }
    
        DOM_ELEMENTS.giftChoiceModal.classList.add('hidden');
        updateDisplays();
    }


    // --- GUIDE FUNCTIONS (REWORKED) ---
    function showGuideTopics() {
        const content = DOM_ELEMENTS.guideSelectionModalContent;
        content.innerHTML = `
             <div id="guide-icons-container">
                <span class="guide-icon" data-topic="window">🪟</span>
                <span class="guide-icon" data-topic="food">🍽️</span>
                <span class="guide-icon" data-topic="cat">🐈‍⬛</span>
                <span class="guide-icon" data-topic="phone">📱</span>
                <span class="guide-icon" data-topic="power">🔌</span>
                <span class="guide-icon" data-topic="upgrades">🛠️</span>
            </div>
        `;
        const guideIcons = content.querySelectorAll('.guide-icon');
        guideIcons.forEach(icon => {
            icon.addEventListener('click', () => displayGuideInfo(icon.dataset.topic));
        });
    }

    function displayGuideInfo(topic) {
        let content = '';
        const foodRefillValue = INITIAL_SYMBOLS_CONFIG.find(s => s.isFood)?.refill || 10;
        const cameraShopItem = SHOP_ITEMS_CONFIG.find(i => i.emoji === "🎥");
        const cosmicUpgradeShopItem = SHOP_ITEMS_CONFIG.find(i => i.type === "cosmic");
        const quantumUpgradeShopItem = SHOP_ITEMS_CONFIG.find(i => i.type === "quantum");

        switch (topic) {
            case 'window':
                content = `
                    <h4>🪟 Window</h4>
                    <p><strong>Window Toggle:</strong> Open (🪟) or close (⬜) the window by tapping the button in the utility bar. Bird-related items (🪹, 🪶, 🪲, 🌿) are shown in the status area above the utility bar.</p>
                    <p><strong>Open:</strong> ${GAME_CONFIG.birdGainChance * 100}% chance/spin to gain a bird, ${GAME_CONFIG.birdLossChance * 100}% to lose one (if no nest/beetle). Max ${GAME_CONFIG.maxTotalBirdsCap} birds.</p>
                    <ul>
                        <li>🦉: ${GAME_CONFIG.owlFeatherDropChance * 100}% on grid -> 🪶.</li>
                        <li>🦜: ${GAME_CONFIG.parrotBeetleDropChance * 100}% on grid -> 🪲 (if no nest).</li>
                        <li>🕊️: ${GAME_CONFIG.doveBranchDropChance * 100}% on grid -> 🌿.</li>
                        <li>🐦‍🔥: No special drops.</li>
                    </ul>
                    <p>🪹 <strong>Nest:</strong> Protects birds from loss. Prevents 🦜 dropping 🪲.</p>
                    <p>🪶 <strong>Feather:</strong> +1 value to grid birds. Max ${GAME_CONFIG.maxFeathers}.</p>
                    <p>🪲 <strong>Beetle:</strong> Sacrificed to save 1 bird (if no nest). Max ${GAME_CONFIG.maxBeetles}.</p>
                    <p>🌿 <strong>Branch:</strong> Reduces 🪹 Nest cost in shop.</p>
                `;
                break;
            case 'food':
                content = `
                    <h4>🍽️ Food & Consumables</h4>
                    <p><strong>Meter:</strong> Consumed per spin. Game Over at 0.</p>
                    <p>Click 🍟, 🍣, 🍩 on grid to eat from symbol inventory. Restores ${foodRefillValue} food.</p>
                    <ul>
                        <li>🍟 <strong>Fries:</strong> Basic. Alien visitor (👽) will consume ALL 🍟 from your bag each spin!</li>
                        <li>🍣 <strong>Sushi:</strong> Eaten from grid with 🐈‍⬛ Pet Cat -> Cat +5 value (${GAME_CONFIG.sushiBuffDuration} spins).</li>
                        <li>🍩 <strong>Donut:</strong> Grid value +3 if ☕ Coffee buff active.</li>
                    </ul>
                    <p>☕ <strong>Coffee (Inventory):</strong> Activates Donut Buff (+3 to 🍩 for ${GAME_CONFIG.donutBuffDuration} spins).</p>
                `;
                break;
            case 'cat':
                content = `
                    <h4>💙 Companion (Cat / Alien)</h4>
                    <p>Open the Companion modal (💙) to view status. Click 🐈‍⬛ on grid to adopt (uses 1 symbol). Click 👽 in inventory to activate (replaces cat).</p>
                    <p>Max 1 companion (Cat or Alien).</p>
                    <p><strong>🐈‍⬛ Cat:</strong> Consumes +${GAME_CONFIG.catFoodConsumption} 🍽️ food/spin. Statuses affect 🐈‍⬛ grid value:</p>
                    <ul>
                        <li>😺 <strong>Happy:</strong> Default. +1 value.</li>
                        <li>😿 <strong>Sad:</strong> After 20 spins with no 🐁 Toy. No buff.</li>
                        <li>😼 <strong>Annoyed:</strong> If 4+ birds & no nest (🪹). No buff.</li>
                        <li>🙀🪲 <strong>Scared:</strong> If 🪲 present (no nest & bird). -1 value.</li>
                        <li>😻🍣 <strong>Buffed:</strong> Eat 🍣 with Cat. +5 value (${GAME_CONFIG.sushiBuffDuration} spins).</li>
                    </ul>
                    <p>🐁 <strong>Mouse Toy (Shop):</strong> Keeps cat 😺 happy.</p>
                    <p><strong>👽 Alien:</strong> Cosmic symbols on grid +12 value. No food meter cost. Consumes ALL 🍟 from bag per spin. 🛸 (UFO) has a ${GAME_CONFIG.ufoAlienDropChance*100}% chance to drop 👽 to inventory during Cosmic Mode if you don't have one.</p>
                    <p>🎥 <strong>Camera (Inventory):</strong> If 👽 is active, consume 🎥 to sell proof to media. Alien leaves. 50/50 chance of 4500🪙 or 6000🪙 payout. Shop cost: ${cameraShopItem.cost}🪙.</p>
                `;
                break;
            case 'phone':
                content = `
                    <h4>📱 Phone</h4>
                    <p>Open the Phone modal (📱) to access features. A countdown (e.g. 📱 10) will appear in the buff bar while an order/investment is active.</p>
                    <p><strong>Random Texts:</strong> While an order/investment is active, there is a ${GAME_CONFIG.spamTextChance * 100}% chance/spin for a text:</p>
                    <ul>
                        <li>⚠️ <strong>Spam:</strong> Lose ${GAME_CONFIG.spamTextCost} 🪙.</li>
                        <li>👥 <strong>Friendly:</strong> Gain ${GAME_CONFIG.friendlyTextGain} 🪙.</li>
                    </ul>
                    <p>🥡 <strong>Emoji Eats (Takeout):</strong></p>
                    <ul>
                        <li>Order random food symbols. Max ${GAME_CONFIG.maxFoodSymbolCap} of each type.</li>
                        <li>Cost: 15🪙/item (10 for 100🪙). Delivery takes ${GAME_CONFIG.takeoutDuration} spins.</li>
                    </ul>
                    <p>🏦 <strong>Investing:</strong></p>
                    <ul>
                        <li>Invest 🪙 for ${GAME_CONFIG.investmentDuration} spins.</li>
                        <li><strong>Outcomes:</strong> Profit (75% chance): 1.5x payout. Loss (25% chance): 0.5x payout.</li>
                    </ul>
                `;
                break;
            case 'power':
                content = `
                    <h4>🔌 Power & Bills</h4>
                    <p><strong>Meter:</strong> Base -1/spin. Additional drain from Upgrades (⚛️Quantum: -5, 🔭Cosmic: -2). At 0 -> 📃 Bill (if none).</p>
                    <p>Meter 0 + 📃 Bill: ${GAME_CONFIG.gameOverOnUnpaidBillChance * 100}% chance/spin -> Game Over.</p>
                    <p>📃 <strong>Bill (Inventory):</strong></p>
                    <ul>
                        <li>Consume to pay (cost by "Next Bill") & refill power (${GAME_CONFIG.maxPower}).</li>
                        <li>Cost: Starts ${GAME_CONFIG.powerBillBaseCost}🪙, +${GAME_CONFIG.powerBillIncrement}🪙 per paid bill.</li>
                    </ul>
                `;
                break;
            case 'upgrades':
                content = `
                    <h4>🛠️ Upgrades & Modes</h4>
                    <p>Buy Upgrades from the Shop (🏪) to unlock powerful modes. These add a permanent power drain (see ⚛️/🔭 by 🔌 icon) and activate a temporary, powerful mode. Only one mode (Cosmic/Quantum) can be active at a time.</p>
                    <h5>${cosmicUpgradeShopItem.emoji} Cosmic Upgrade</h5>
                    <p><strong>Cost:</strong> ${cosmicUpgradeShopItem.cost}🪙. <strong>Penalty:</strong> -${cosmicUpgradeShopItem.powerCost}🔌/spin.</p>
                    <p>Triggers ${GAME_CONFIG.cosmicModeDuration}-spin Cosmic Mode: Adds Cosmic symbols (🪐,🌠,🌒,🛸) to bag. Multiplier (2x,3x,5x) applies to the entire bottom row. 🛸 may drop 👽.</p>
                    <h5>${quantumUpgradeShopItem.emoji} Quantum Upgrade</h5>
                    <p><strong>Cost:</strong> ${quantumUpgradeShopItem.cost}🪙. <strong>Penalty:</strong> -${quantumUpgradeShopItem.powerCost}🔌/spin.</p>
                    <p>Triggers ${GAME_CONFIG.quantumModeDuration}-spin Quantum Mode: Multiplier (2x,3x,5x) applies to the entire bottom row.
                    <br><strong>Schrödinger's Cat:</strong> Each spin, ${GAME_CONFIG.schrodingerCatsCount} random grid symbols get a 🐈 overlay and their payout is multiplied by an additional ${GAME_CONFIG.schrodingerCatMultiplier}x (stacks with row multiplier).</p>
                `;
                break;
            default:
                content = '<p>Select an icon for gameplay information.</p>';
        }

        const backButtonHTML = `<button id="guide-back-btn" class="btn">Back to Topics</button>`;
        const fullContent = `<div class="guide-topic-content">${content}</div>`;
        
        DOM_ELEMENTS.guideSelectionModalContent.innerHTML = backButtonHTML + fullContent;
        
        document.getElementById('guide-back-btn').addEventListener('click', showGuideTopics);
    }

    // --- MODAL CONTROL FUNCTIONS ---
    function openShopModal() { if (!uiState.isGameOver) DOM_ELEMENTS.shopModalOverlay.classList.remove('hidden'); }
    function closeShopModal() { DOM_ELEMENTS.shopModalOverlay.classList.add('hidden'); }
    
    function openGuideSelectionModal() { 
        if (!uiState.isGameOver) {
            showGuideTopics();
            DOM_ELEMENTS.guideSelectionModalOverlay.classList.remove('hidden'); 
        }
    }
    function closeGuideSelectionModal() { DOM_ELEMENTS.guideSelectionModalOverlay.classList.add('hidden'); }

    // REMOVED openWindowModal and closeWindowModal

    function openPetModal() { if (!uiState.isGameOver) DOM_ELEMENTS.petModalOverlay.classList.remove('hidden'); }
    function closePetModal() { DOM_ELEMENTS.petModalOverlay.classList.add('hidden'); }

    function openPhoneModal() { if (!uiState.isGameOver) { setupPhoneModal(); DOM_ELEMENTS.phoneModalOverlay.classList.remove('hidden'); }}
    function closePhoneModal() { DOM_ELEMENTS.phoneModalOverlay.classList.add('hidden'); }
    
    function closeAllWindows() {
        DOM_ELEMENTS.alienMediaPayoutModal.classList.add('hidden');
        DOM_ELEMENTS.giftChoiceModal.classList.add('hidden'); 
        DOM_ELEMENTS.shopModalOverlay.classList.add('hidden');
        DOM_ELEMENTS.guideSelectionModalOverlay.classList.add('hidden');
        // REMOVED windowModalOverlay
        DOM_ELEMENTS.petModalOverlay.classList.add('hidden');
        DOM_ELEMENTS.phoneModalOverlay.classList.add('hidden');
    }

    // --- GAME RESET & INIT ---
    function resetGame() {
        initializeGameVariables();

        DOM_ELEMENTS.grid.innerHTML = "";
        DOM_ELEMENTS.totalWinDisplay.textContent = "";
        DOM_ELEMENTS.phoneMessageDisplay.textContent = "";
        DOM_ELEMENTS.totalWinDisplay.classList.remove('game-over');
        document.body.classList.remove("cosmic-theme", "quantum-theme");

        DOM_ELEMENTS.gameMainTitle.textContent = "Keep Spinning";
        DOM_ELEMENTS.gameMainTitle.classList.remove('upgrade-mode-active');

        closeAllWindows();

        if (DOM_ELEMENTS.gameDiv) DOM_ELEMENTS.gameDiv.classList.remove('food-warning');

        slotMachineState.topRightLocked = false;
        slotMachineState.topRightSymbol = null;

        slotMachineState.currentGridSymbols = getSymbolsForSpin();
        slotMachineState.currentMultiplier = getRandomMultiplier();

        updateGridDOM(slotMachineState.currentGridSymbols, slotMachineState.currentMultiplier, false); // No animation on reset
        updateDisplays();
    }

    function initGame() {
        initializeGameVariables();
        DOM_ELEMENTS.spinBtn.addEventListener('click', spin);
        DOM_ELEMENTS.luckyBtn.addEventListener('click', toggleLuckyLines);
        
        // Bottom Bar Triggers
        DOM_ELEMENTS.windowTriggerBtn.addEventListener('click', toggleWindow); // UPDATED
        DOM_ELEMENTS.petTriggerBtn.addEventListener('click', openPetModal);
        DOM_ELEMENTS.phoneTriggerBtn.addEventListener('click', openPhoneModal);
        DOM_ELEMENTS.shopTriggerBtn.addEventListener('click', openShopModal);
        DOM_ELEMENTS.guideTriggerBtn.addEventListener('click', openGuideSelectionModal);
        
        // Modal Close Buttons
        DOM_ELEMENTS.shopModalCloseBtn.addEventListener('click', closeShopModal);
        DOM_ELEMENTS.guideSelectionModalCloseBtn.addEventListener('click', closeGuideSelectionModal);
        // REMOVED windowModalCloseBtn
        DOM_ELEMENTS.petModalCloseBtn.addEventListener('click', closePetModal);
        DOM_ELEMENTS.phoneModalCloseBtn.addEventListener('click', closePhoneModal);
        DOM_ELEMENTS.alienMediaPayoutCloseBtn.addEventListener('click', () => DOM_ELEMENTS.alienMediaPayoutModal.classList.add('hidden'));
        
        // Modal Overlay Clicks (to close)
        [DOM_ELEMENTS.shopModalOverlay, DOM_ELEMENTS.guideSelectionModalOverlay, DOM_ELEMENTS.petModalOverlay, DOM_ELEMENTS.phoneModalOverlay, DOM_ELEMENTS.alienMediaPayoutModal].forEach(overlay => {
            overlay.addEventListener('click', (event) => {
                if(event.target === overlay) overlay.classList.add('hidden');
            });
        });

        // Specific Modal Buttons
        // REMOVED windowToggleBtn listener
        DOM_ELEMENTS.giftChoiceBirdBtn.addEventListener('click', () => selectGift('bird'));
        DOM_ELEMENTS.giftChoiceFoodBtn.addEventListener('click', () => selectGift('food'));
        DOM_ELEMENTS.giftChoiceLocksBtn.addEventListener('click', () => selectGift('locks'));
        
        DOM_ELEMENTS.luckyBtn.textContent = 'LL';
        DOM_ELEMENTS.gameMainTitle.textContent = "Keep Spinning";
        DOM_ELEMENTS.gameMainTitle.classList.remove('upgrade-mode-active');

        closeAllWindows();

        slotMachineState.currentGridSymbols = getSymbolsForSpin();
        slotMachineState.currentMultiplier = getRandomMultiplier();

        updateGridDOM(slotMachineState.currentGridSymbols, slotMachineState.currentMultiplier, false); // No animation on initial load
        updateDisplays();
    }

    initGame();
});
