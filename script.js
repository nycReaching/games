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
        initialCoins: 75,
        initialLockItems: 3,
        baseSpinFoodConsumption: 1,
        catFoodConsumption: 1,
        luckyLinesBonus: 150,
        investmentDuration: 10,
        takeoutDuration: 10,
        donutBuffDuration: 10,
        sushiBuffDuration: 3,
        birdGainChance: 0.15,
        birdLossChance: 0.15,
        spamTextChance: 0.25,
        spamTextCost: 35,
        friendlyTextGain: 10,
        parrotBeetleDropChance: 0.15,
        doveBranchDropChance: 0.15,
        owlFeatherDropChance: 0.15,
        ufoAlienDropChance: 0.15, // UFO alien drop chance
        gameOverOnUnpaidBillChance: 0.05,
        powerBillBaseCost: 125, // UPDATED
        powerBillIncrement: 125, // UPDATED
        maxFoodSymbolCap: 8,
        maxTotalBirdsCap: 8,
        schrodingerCatsCount: 2, // Number of special cells in Quantum Mode
    };

    const INITIAL_SYMBOLS_CONFIG = [
        { emoji: "🍟", value: 2, count: 4, refill: 10, isFood: true },
        { emoji: "🍣", value: 1, count: 3, refill: 10, isFood: true },
        { emoji: "🍩", value: 3, count: 3, refill: 10, isFood: true },
        { emoji: "🫐", value: 0, count: 0, refill: 5, isFood: true, hidden: false },
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
        { name: "Camera", emoji: "📹", cost: 3000 },
        { name: "Bird Nest", emoji: "🪹", cost: 1000 },
        { name: "Black Hole", emoji: "⚫", cost: 10000 },
        { name: "Cosmic Upgrade", emoji: "🔭", cost: 2000, powerCost: 2, isUpgrade: true, type: 'cosmic' },
        { name: "Quantum Upgrade", emoji: "⚛️", cost: 6000, powerCost: 4, isUpgrade: true, type: 'quantum' },
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
        catBuffStatusEl: document.getElementById('cat-buff-status'),
        alienBuffStatusEl: document.getElementById('alien-buff-status'),
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

        // ADDED: Black hole modal
        blackHoleModal: document.getElementById('black-hole-modal'),
        blackHoleContent: document.getElementById('black-hole-content'),
        blackHoleCloseBtn: document.getElementById('black-hole-close-btn'),
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
        playerState.inventory = { "📹": 0, "☕": 2, "👽": 0, "📃": 0, "⚫": 0, "🎁": 0 };
        playerState.lockItems = GAME_CONFIG.initialLockItems;
        playerState.billsPaidSoFar = 0;
        playerState.spinCount = 0;
        playerState.giftAwarded = false;
        playerState.spinsSinceLastBlueberry = 0;

        slotMachineState.luckyLines = false;
        slotMachineState.topRightLocked = false;
        slotMachineState.topRightSymbol = null;
        slotMachineState.currentWin = 0;
        slotMachineState.currentGridSymbols = Array(GAME_CONFIG.gridSize).fill(null);
        slotMachineState.currentMultiplier = getRandomMultiplier();
        slotMachineState.schrodingerCells = []; // For Quantum Mode

        activeEffects.hasPetCat = false;
        activeEffects.hasPetDove = false;
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
        activeEffects.cosmicModeCompleted = false; 
        activeEffects.quantumModeCompleted = false;

        activeEffects.alienDroppedByUFO = false; 

        activeEffects.permanentBirdBuff = false; 
        activeEffects.permanentFoodReplenishBuff = false; 

        windowFeatureState.birdGainedThisSpin = null;
        windowFeatureState.hasBirdNest = false;
        windowFeatureState.feathers = 0;
        windowFeatureState.beetles = 0;
        windowFeatureState.hasBranch = false;
        windowFeatureState.branchesDroppedThisGame = 0;

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
            let shouldBeInBag = !symbol.isCosmic && !symbol.hidden;

            if (symbol.isCosmic) {
                if (activeEffects.cosmicUpgradePenaltyActive || activeEffects.cosmicUpgradeActive) {
                    shouldBeInBag = true;
                } else {
                    shouldBeInBag = false;
                }
            }
            
            if (symbol.count > 0 && shouldBeInBag) {
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
        if (activeEffects.quantumUpgradePenaltyActive) powerConsumedThisSpin += 4;

        if (playerState.power > 0) {
            playerState.power -= powerConsumedThisSpin;
            playerState.power = Math.max(0, playerState.power);
        }

        if (playerState.power <= 0 && playerState.inventory['📃'] === 0) {
            playerState.inventory['📃']++;
        }

        if (activeEffects.hasPetCat && !activeEffects.hasMouseToy) activeEffects.spinsWithCat++;
        if (activeEffects.hasPetDove) {
            playerState.spinsSinceLastBlueberry = (playerState.spinsSinceLastBlueberry || 0) + 1;
            if (playerState.spinsSinceLastBlueberry >= 10) {
                const blueberrySymbol = symbols.find(s => s.emoji === '🫐');
                if (blueberrySymbol) {
                    blueberrySymbol.count++;
                }
                playerState.spinsSinceLastBlueberry = 0;
            }
        }

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
            let animatedBird = null;
            try {
                if (uiState.isGameOver && DOM_ELEMENTS.spinBtn.textContent === 'GAME OVER') return;

                slotMachineState.currentGridSymbols.forEach((item) => {
                    if (item) {
                        // Bird item drops
                        if (item.emoji === "🦜" && Math.random() < GAME_CONFIG.parrotBeetleDropChance) {
                            if (!windowFeatureState.hasBirdNest && windowFeatureState.beetles < GAME_CONFIG.maxBeetles) {
                                windowFeatureState.beetles++;
                            }
                        } else if (item.emoji === "🕊️" && Math.random() < GAME_CONFIG.doveBranchDropChance) {
                            if (!windowFeatureState.hasBranch && windowFeatureState.branchesDroppedThisGame < 2) {
                                windowFeatureState.hasBranch = true;
                                windowFeatureState.branchesDroppedThisGame++;
                            }
                        } else if (item.emoji === "🦉" && Math.random() < GAME_CONFIG.owlFeatherDropChance) {
                            if (windowFeatureState.feathers < GAME_CONFIG.maxFeathers) windowFeatureState.feathers++;
                        }
                        // Alien drop from UFO (permanent after upgrade)
                        else if (item.emoji === "🛸") {
                            if (activeEffects.cosmicUpgradePenaltyActive && !activeEffects.hasAlienVisitor && playerState.inventory["👽"] < 1 && Math.random() < GAME_CONFIG.ufoAlienDropChance) {
                                playerState.inventory["👽"]++;
                                activeEffects.alienDroppedByUFO = true;
                            }
                        }
                    }
                });

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
                            animatedBird = birdToFinallyAdd.emoji;
                        }
                    }
                    windowFeatureState.birdGainedThisSpin = null;
                }

                if (activeEffects.cosmicUpgradeActive && activeEffects.cosmicUpgradeSpinsLeft <= 0) {
                    deactivateCosmicUpgradeBonusMode(true);
                }
                if (activeEffects.quantumUpgradeActive && activeEffects.quantumUpgradeSpinsLeft <= 0) {
                    deactivateQuantumUpgradeBonusMode(true);
                }


                if (playerState.foodMeter <= 0 && !uiState.isGameOver) {
                    gameOver("Out of food!");
                }

            } catch (error) {
                console.error("Error in spin timeout callback:", error);
            } finally {
                updateDisplays(animatedBird);
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
            if (item.emoji === "🐈‍⬛") {
                itemValue *= 500;
            }
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
        // displayIndividualPayouts(individualPayouts); // UPDATED: Animation removed.
    }

    // --- UPDATE DISPLAY FUNCTIONS ---
    function updateDisplays(animatedSymbolEmoji = null) {
        DOM_ELEMENTS.coinsDisplay.textContent = `Coins ${playerState.coins}`;
        DOM_ELEMENTS.foodMeterFill.style.width = `${(playerState.foodMeter / GAME_CONFIG.maxFoodMeter) * 100}%`;
        DOM_ELEMENTS.foodMeterValue.textContent = `${playerState.foodMeter}/${GAME_CONFIG.maxFoodMeter}`;

        updateSymbolInventoryDisplay(animatedSymbolEmoji);
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

    function updateSymbolInventoryDisplay(animatedSymbolEmoji = null) {
        DOM_ELEMENTS.symbolInventoryDisplay.innerHTML = "";
        symbols.filter(s => s.count > 0 && !s.hidden).forEach(symbol => {
            const span = document.createElement("span");
            span.textContent = `${symbol.emoji} ${symbol.count}`;
            if (symbol.emoji === animatedSymbolEmoji) {
                span.classList.add('symbol-pulse-animation');
            }
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
                    } else if (itemEmoji === "📹") {
                        itemSpan.classList.add("clickable");
                        itemSpan.style.opacity = activeEffects.hasAlienVisitor ? "1" : "0.7";
                        if (activeEffects.hasAlienVisitor) itemSpan.onclick = consumeCamera; else itemSpan.onclick = null;
                    } else if (itemEmoji === "🎁") {
                        itemSpan.classList.add("clickable", "inventory-item-gift");
                        itemSpan.onclick = showGiftChoiceModal;
                    } else if (itemEmoji === "⚫") {
                        itemSpan.classList.add("clickable");
                        itemSpan.onclick = consumeBlackHole;
                    }
                }
                DOM_ELEMENTS.playerInventoryContent.appendChild(itemSpan);
            }
        }
    }

    function updatePetModal() {
        const content = DOM_ELEMENTS.petModalContent;
        content.innerHTML = "";
        let titleEmojis = [];
        const companionSections = [];
    
        // Alien Section
        if (activeEffects.hasAlienVisitor) {
            titleEmojis.push("👽");
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
            companionSections.push(alienText);
        }
    
        // Cat Section
        if (activeEffects.hasPetCat) {
            titleEmojis.push("🐈‍⬛");
            const catContainer = document.createElement('div');
            catContainer.className = 'pet-info-container';
    
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
    
            catContainer.appendChild(mainArea);
    
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
    
            if (petBottomArea.childElementCount > 0) {
                catContainer.appendChild(petBottomArea);
            }
    
            companionSections.push(catContainer);
        }
    
        // Dove Section
        if (activeEffects.hasPetDove) {
            titleEmojis.push("🕊️");
            const doveContainer = document.createElement('div');
            doveContainer.className = 'pet-info-container';
            doveContainer.innerHTML = `
                <div class="pet-main-area">
                    <span class="pet-status-emoji">🕊️</span>
                    <div class="pet-description">Peaceful Companion</div>
                </div>
                <div class="pet-bottom-area" style="margin-top: 10px;">
                    <div class="pet-food-consumption">+1 🫐 every 10 spins</div>
                </div>
            `;
            companionSections.push(doveContainer);
        }
    
        if (companionSections.length > 0) {
            companionSections.forEach((section, index) => {
                content.appendChild(section);
                if (index < companionSections.length - 1) {
                    const separator = document.createElement('hr');
                    content.appendChild(separator);
                }
            });
        } else {
            content.innerHTML = '<div>No companion active. Adopt a 🐈‍⬛ or 🕊️ from the grid, or activate an 👽 from your inventory.</div>';
            titleEmojis.push("💙");
        }
    
        DOM_ELEMENTS.petModalTitle.innerHTML = `${titleEmojis.join('')} Companion`;
    }

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
    
                if (isMultiplierCellForThisSpin) {
                    baseValueSpan.classList.add('multiplied-payout');
                }
    
            } else {
                baseValueSpan.textContent = '';
            }
            
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
            if (item && item.emoji === "🐈‍⬛" && !activeEffects.hasPetCat && !uiState.isGameOver) {
                div.classList.add('clickable-cat');
                div.onclick = () => clickCatEmoji(index);
            }
            if (item && item.emoji === "🕊️" && !activeEffects.hasPetDove && windowFeatureState.hasBranch && !uiState.isGameOver) {
                div.classList.add('clickable-food'); // Re-use style for pointer
                div.onclick = () => clickDoveEmoji(index);
            }

            DOM_ELEMENTS.grid.appendChild(div);
        });
    }

    function displayIndividualPayouts(payouts) {
        // This function is intentionally left empty.
    }

    function updatePowerDisplay() {
        if (DOM_ELEMENTS.powerMeterFill) {
            DOM_ELEMENTS.powerMeterFill.style.width = `${(playerState.power / GAME_CONFIG.maxPower) * 100}%`;
        }
        if (DOM_ELEMENTS.powerMeterIndicatorIcon) {
            DOM_ELEMENTS.powerMeterIndicatorIcon.innerHTML = "<span class='base-power-icon'>🔌</span>";
        }
    }

    function updateNextPowerBillCostDisplay() {
    if (DOM_ELEMENTS.nextPowerBillCostDisplay) {
        const billCost = GAME_CONFIG.powerBillBaseCost + (playerState.billsPaidSoFar * GAME_CONFIG.powerBillIncrement);
        const displayText = `📃${billCost}🪙`;
        DOM_ELEMENTS.nextPowerBillCostDisplay.textContent = displayText;
    	}
    }

    function updateStatusEffectsWindow() {
        // Standard Buffs
        const donutActive = activeEffects.donutBuffActive && activeEffects.donutBuffSpinsLeft > 0;
        DOM_ELEMENTS.donutBuffStatusEl.innerHTML = donutActive ? `<span class="buff-emoji">🍩</span> <span class="buff-countdown">${activeEffects.donutBuffSpinsLeft}</span>` : '';
        DOM_ELEMENTS.donutBuffStatusEl.style.display = donutActive ? 'flex' : 'none';

        // Consolidated Cat Buff Logic
        DOM_ELEMENTS.catBuffStatusEl.innerHTML = '';
        DOM_ELEMENTS.catBuffStatusEl.style.display = 'none';
        if (activeEffects.hasPetCat) {
            let catHTML = '';
            const currentStatus = activeEffects.currentCatStatus;
            
            if (currentStatus === '😻🍣') {
                catHTML = `<span class="buff-emoji">😻</span> <span class="buff-value">+5</span> <span class="buff-countdown">${activeEffects.sushiCatBuffSpinsLeft}</span>`;
            } else if (currentStatus === '😺') {
                catHTML = `<span class="buff-emoji">😺</span> <span class="buff-value">+1</span>`;
            } else if (currentStatus === '🙀🪲') {
                catHTML = `<span class="buff-emoji">🙀</span> <span class="buff-value" style="color: var(--accent-red);">-1</span>`;
            } else if (currentStatus === '😿' || currentStatus === '😼') {
                catHTML = `<span class="buff-emoji">${currentStatus.substring(0, 2)}</span>`;
            }

            if (catHTML) {
                DOM_ELEMENTS.catBuffStatusEl.innerHTML = catHTML;
                DOM_ELEMENTS.catBuffStatusEl.style.display = 'flex';
            }
        }
        
        // Alien Buff
        const alienActive = activeEffects.hasAlienVisitor;
        DOM_ELEMENTS.alienBuffStatusEl.innerHTML = alienActive ? `<span class="buff-emoji">👽</span> <span class="buff-value">+12</span>` : '';
        DOM_ELEMENTS.alienBuffStatusEl.style.display = alienActive ? 'flex' : 'none';


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

    function toggleWindow() {
        uiState.windowOpen = !uiState.windowOpen;
        updateDisplays();
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
        if (uiState.isGameOver || activeEffects.hasPetCat) {
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

    function clickDoveEmoji(index) {
        if (uiState.isGameOver || activeEffects.hasPetDove || !windowFeatureState.hasBranch) {
            return;
        }
        const symbolOnGrid = slotMachineState.currentGridSymbols[index];
        const doveSymbolData = symbols.find(s => s.emoji === "🕊️");

        if (symbolOnGrid && symbolOnGrid.emoji === "🕊️" && doveSymbolData && doveSymbolData.count > 0) {
            activeEffects.hasPetDove = true;
            windowFeatureState.hasBranch = false; // Consume the branch
            playerState.spinsSinceLastBlueberry = 0; // Reset counter
            doveSymbolData.count--;
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
    
        if (itemData.isUpgrade) {
            if (itemData.type === 'cosmic' && !activeEffects.cosmicUpgradePenaltyActive && !activeEffects.quantumUpgradeActive) {
                if (playerState.coins < itemData.cost) return;
                playerState.coins -= itemData.cost;
                activateCosmicUpgrade();
                closeShopModal();
            } else if (itemData.type === 'quantum' && !activeEffects.quantumUpgradePenaltyActive && !activeEffects.cosmicUpgradeActive) {
                if (!activeEffects.cosmicModeCompleted) return;
                if (playerState.coins < itemData.cost) return;
                playerState.coins -= itemData.cost;
                activateQuantumUpgrade();
                closeShopModal();
            }
        } else if (itemEmoji === "🪹") {
            if (windowFeatureState.hasBirdNest) { return; }
            const hasDiscount = windowFeatureState.hasBranch;
            const finalCost = hasDiscount ? 250 : itemData.cost;
            if (playerState.coins < finalCost) { return; }
    
            playerState.coins -= finalCost;
            windowFeatureState.hasBirdNest = true;
            if (hasDiscount) {
                windowFeatureState.hasBranch = false;
            }
            if (windowFeatureState.beetles > 0) windowFeatureState.beetles = 0;
        } else if (itemEmoji === "🐁") {
            if (!activeEffects.hasPetCat || activeEffects.hasMouseToy) { return; }
            if (playerState.coins < itemData.cost) { return; }
            playerState.coins -= itemData.cost;
            activeEffects.hasMouseToy = true;
            activeEffects.spinsWithCat = 0;
        } else if (itemEmoji === "📹") {
            if (!activeEffects.hasAlienVisitor || playerState.inventory[itemEmoji] >= 1) return;
            if (playerState.coins < itemData.cost) return;
            playerState.coins -= itemData.cost;
            playerState.inventory[itemEmoji]++;
        } else { // Handles Black Hole and other generic items
            if (playerState.inventory[itemEmoji] > 0 && itemEmoji === "⚫") return;
            if (playerState.coins < itemData.cost) return;
            playerState.coins -= itemData.cost;
            playerState.inventory[itemEmoji]++;
        }
        updateDisplays();
    }
    
    function setupShop() {
        DOM_ELEMENTS.shopContent.innerHTML = "";
        const sortedShopItems = [...SHOP_ITEMS_CONFIG].sort((a, b) => a.cost - b.cost);
    
        sortedShopItems.forEach(item => {
            if (item.emoji === "🪹" && windowFeatureState.hasBirdNest) return;
            if (item.emoji === "🐁" && activeEffects.hasMouseToy) return;
            if (item.emoji === "📹" && playerState.inventory[item.emoji] >= 1) return;
            
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
            } else if (item.emoji === "📹") {
                if (!activeEffects.hasAlienVisitor) canBuy = false;
            } else if (item.emoji === "⚫") {
                if (!activeEffects.quantumModeCompleted || playerState.inventory[item.emoji] >= 1) {
                    canBuy = false;
                }
            } else if (item.isUpgrade) {
                if(activeEffects.cosmicUpgradeActive || activeEffects.quantumUpgradeActive) canBuy = false;
                if(item.type === 'quantum' && !activeEffects.cosmicModeCompleted) {
                    canBuy = false;
                }
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
        // UPDATED: Filter out blueberries from takeout orders.
        const foodSymbolsInGame = symbols.filter(s => s.isFood && !s.hidden && s.emoji !== '🫐');
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
        if (uiState.isGameOver || playerState.inventory["📹"] <= 0 || !activeEffects.hasAlienVisitor) {
            return;
        }
        playerState.inventory["📹"]--;
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

    function consumeBlackHole() {
        if (uiState.isGameOver || playerState.inventory["⚫"] <= 0) {
            return;
        }
        playerState.inventory["⚫"]--;
        DOM_ELEMENTS.blackHoleContent.innerHTML = `
            <p>The quantum upgrade resulted in the creation of a miniature black hole, swallowing the slot machine game into its singularity before collapsing just in time to avoid destroying the entire universe.</p>
            <p style="font-size: 24px;">🏆</p>
            <p><strong>Congratulations on your legendary run!</strong></p>
        `;
        gameOver("Achieved Singularity!");
        DOM_ELEMENTS.blackHoleModal.classList.remove('hidden');
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
        if (showFeedback) { // This means the mode completed normally
            activeEffects.cosmicModeCompleted = true;
        }
        activeEffects.cosmicUpgradeActive = false;
        document.body.classList.remove("cosmic-theme");

        if (!activeEffects.quantumUpgradeActive) {
            DOM_ELEMENTS.gameMainTitle.textContent = "KEEP SPINNING!";
            DOM_ELEMENTS.gameMainTitle.classList.remove('upgrade-mode-active');
        }

        updateDisplays();
    }

    function deactivateQuantumUpgradeBonusMode(showFeedback = true) {
        if (showFeedback) {
            activeEffects.quantumModeCompleted = true;
        }
        activeEffects.quantumUpgradeActive = false;
        document.body.classList.remove("quantum-theme");
        slotMachineState.schrodingerCells = [];

        if (!activeEffects.cosmicUpgradeActive) {
            DOM_ELEMENTS.gameMainTitle.textContent = "KEEP SPINNING!";
            DOM_ELEMENTS.gameMainTitle.classList.remove('upgrade-mode-active');
        }
        
        updateDisplays();
    }


    function activateAlienVisitor() {
        if (uiState.isGameOver || playerState.inventory["👽"] <= 0 || activeEffects.hasAlienVisitor) {
            return;
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
            <button id="guide-how-to-play-btn" class="btn btn-how-to-play">How to Play</button>
             <div id="guide-icons-container">
                <span class="guide-icon" data-topic="window">🪟</span>
                <span class="guide-icon" data-topic="food">🍽️</span>
                <span class="guide-icon" data-topic="companion">💙</span>
                <span class="guide-icon" data-topic="phone">📱</span>
                <span class="guide-icon" data-topic="power">🔌</span>
                <span class="guide-icon" data-topic="upgrades">🛠️</span>
            </div>
            <div class="guide-topic-content" id="guide-info-display">
                <p>Select an icon for gameplay information.</p>
            </div>
        `;
        document.getElementById('guide-how-to-play-btn').addEventListener('click', () => displayGuideInfo('how-to-play'));
        const guideIcons = content.querySelectorAll('.guide-icon');
        guideIcons.forEach(icon => {
            icon.addEventListener('click', () => displayGuideInfo(icon.dataset.topic));
        });
    }

    function displayGuideInfo(topic) {
        let content = '';

        switch (topic) {
            case 'how-to-play':
                content = `
                    <h4>How to Play</h4>
                    <p>Your slot machine seems to be connected with the <strong>world itself.</strong> <p>Birds fly through your window and enter the game. You order food on your phone, but it shows up as game symbols. It's all connected. The game ends if you run out of food, coins, or fail to pay your power bill in a timely manner.</p>
                    <ul>
                        <li><strong>Focus:</strong> Pay attention to food, hitting 0 means game over.</li>
                        <li><strong>Budget:</strong> Keep an eye on the next power bill and time your investments and purchases accordingly.</li>
                        <li><strong>Strategy:</strong> Use items, buffs and new companions to win bigger payouts.</li>
			<li><strong>Goal:</strong> Upgrade your slot machine to peer into the cosmos, probe the quantum realm, and be there for its ultimate end.</li>
                    </ul>
                    
                `;
                break;
            case 'window':
                content = `
                    <h4>🪟 The Window & Birds</h4>
                    <ul>
                        <li><strong>Window Open (🪟):</strong> 15% chance to gain a bird, 15% chance to lose one per spin.</li>
                        <li><strong>Window Closed (⬜):</strong> Birds are safe; no gains or losses.</li>
                        <li><strong>Bird Drops (15% chance per bird):</strong></li>
                        <li>&nbsp;&nbsp;<strong>🦜</strong> drops <strong>🪲 Beetle</strong></li>
                        <li>&nbsp;&nbsp;<strong>🦉</strong> drops <strong>🪶 Feather</strong></li>
                        <li>&nbsp;&nbsp;<strong>🕊️</strong> drops <strong>🌿 Branch</strong></li>
                        <li><strong>Items & Maximums:</strong></li>
                        <li>&nbsp;&nbsp;<strong>Total Birds:</strong> Max 8.</li>
                        <li>&nbsp;&nbsp;<strong>🪶 Feathers:</strong> +1 value to all birds. Max 5.</li>
                        <li>&nbsp;&nbsp;<strong>🪲 Beetles:</strong> Consumes in place of a bird escape. Scares cats. Max 1.</li>
                        <li>&nbsp;&nbsp;<strong>🌿 Branches:</strong> Consumes to keep a 🕊️ (from grid) or to discount 🪹 Nest in shop. Max 2 per game.</li>
                        <li>&nbsp;&nbsp;<strong>🪹 Nest (Shop):</strong> Permanently protects all birds from leaving, prevents 🪲 and calms cat (removes 😼).</li>
                    </ul>
                `;
                break;
            case 'food':
                content = `
                    <h4>🍽️ Food & Consumables</h4>
                    <ul>
                        <li><strong>Food Meter:</strong> Game ends at 0. Max food is 20.</li>
                        <li><strong>Replenish:</strong> Click food on grid (🍟, 🍣, 🍩) to use one from your inventory.</li>
                        <li>&nbsp;&nbsp;Food gives +10 🍽️.</li>
                        <li>&nbsp;&nbsp;Blueberries (🫐) only give +5 🍽️.</li>
                        <li><strong>Max Food Items:</strong> You can hold a maximum of 8 of any single food type.</li>
                        <li><strong>Special Effects:</strong></li>
                        <li>&nbsp;&nbsp;<strong>☕ Coffee:</strong> Use from inventory. For 10 spins, 🍩 are worth +3 more value.</li>
                        <li>&nbsp;&nbsp;<strong>🍣 Sushi:</strong> Shares with cat. 😻 cat buff. +5 value for 3 spins.</li>
                    </ul>
                `;
                break;
            case 'companion':
                content = `
                    <h4>💙 Companions</h4>
                    <p>Adopt companions from the grid to gain buffs. You can have a Cat, a Dove, and an Alien all at once.</p>
                    <ul>
                        <li><strong>🐈‍⬛ Cat:</strong> Costs 1 🍽️ per spin. Its value changes with its mood.</li>
                        <li>&nbsp;&nbsp;<strong>😺 Happy:</strong> +1 value.</li>
                        <li>&nbsp;&nbsp;<strong>😻 Sushi:</strong> +5 value for 3 spins.</li>
                        <li>&nbsp;&nbsp;<strong>😿 Sad:</strong> No buff. Needs a 🐁 Toy.</li>
                        <li>&nbsp;&nbsp;<strong>😼 Annoyed:</strong> No buff. Too many birds (4+).</li>
                        <li>&nbsp;&nbsp;<strong>🙀 Scared:</strong> -1 value. Scared by 🪲.</li>
                        <li><strong>🕊️ Dove:</strong> Tame with a 🌿 Branch. Provides +1 🫐 every 10 spins.</li>
                        <li><strong>👽 Alien:</strong> 🛸 has 15% chance to drop 👽. Activate from inventory. Adds +12 value to Cosmic symbols but eats all 🍟 each spin.</li>
                    </ul>
                `;
                break;
            case 'phone':
                content = `
                    <h4>📱 Phone</h4>
                    <p>Phone actions take 10 spins to complete. While active, you have a 25% chance each spin to get a text: +10🪙 or -35🪙.</p>
                    <ul>
                        <li><strong>🥡 Emoji Eats:</strong> Order a delivery of random food items.</li>
                        <li><strong>🏦 Investments:</strong> Invest coins:</li>
                        <li>&nbsp;&nbsp;<strong>75% chance</strong> of 1.5x profit.</li>
                        <li>&nbsp;&nbsp;<strong>25% chance</strong> of 0.5x loss.</li>
                    </ul>
                `;
                break;
            case 'power':
                content = `
                    <h4>🔌 Power & Bills</h4>
                     <ul>
                        <li>Power decreases every spin (-1 base, more with upgrades).</li>
                        <li>If power reaches 0, you get a 📃 Bill in your inventory.</li>
                        <li>You must pay the bill by clicking it. The cost increases each time.</li>
                        <li><strong>Warning:</strong> Spinning with an unpaid bill has a <strong>5% chance of instant Game Over</strong>.</li>
                    </ul>
                `;
                break;
            case 'upgrades':
                content = `
                    <h4>🛠️ Upgrades & Endgame</h4>
                    <p><strong>LL Button (Lucky Lines):</strong> Increases spin cost, but allows four-in-a-row to give 150 coin bonus.</p>
                    <ul>
                        <li><strong>🔭 Cosmic Upgrade:</strong></li>
                        <li>&nbsp;&nbsp;Adds permanent -2 🔌 drain per spin.</li>
                        <li>&nbsp;&nbsp;Triggers 20-spin <strong>Cosmic Mode</strong> where the multiplier affects the entire bottom row. Gain special cosmic symbols, including the important 🛸.</li>
                        <li><strong>⚛️ Quantum Upgrade:</strong></li>
                        <li>&nbsp;&nbsp;Adds permanent -4 🔌 drain per spin.</li>
                        <li>&nbsp;&nbsp;Triggers 20-spin <strong>Quantum Mode</strong> where the multiplier affects the entire bottom row. Two random grid cells per spin invoke Schrödinger's Cat experiment: if a 🐈‍⬛ lands there, its value is multiplied by <strong>500x</strong>!</li>
                        <li><strong>⚫ Black Hole:</strong></li>
                        <li>&nbsp;&nbsp;Available in the shop only after completing Quantum Mode. Using it wins the game.</li>
                    </ul>
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

    function openPetModal() { if (!uiState.isGameOver) DOM_ELEMENTS.petModalOverlay.classList.remove('hidden'); }
    function closePetModal() { DOM_ELEMENTS.petModalOverlay.classList.add('hidden'); }

    function openPhoneModal() { if (!uiState.isGameOver) { setupPhoneModal(); DOM_ELEMENTS.phoneModalOverlay.classList.remove('hidden'); }}
    function closePhoneModal() { DOM_ELEMENTS.phoneModalOverlay.classList.add('hidden'); }
    
    function closeAllWindows() {
        DOM_ELEMENTS.alienMediaPayoutModal.classList.add('hidden');
        DOM_ELEMENTS.giftChoiceModal.classList.add('hidden'); 
        DOM_ELEMENTS.shopModalOverlay.classList.add('hidden');
        DOM_ELEMENTS.guideSelectionModalOverlay.classList.add('hidden');
        DOM_ELEMENTS.petModalOverlay.classList.add('hidden');
        DOM_ELEMENTS.phoneModalOverlay.classList.add('hidden');
        DOM_ELEMENTS.blackHoleModal.classList.add('hidden');
    }

    // --- GAME RESET & INIT ---
    function resetGame() {
        initializeGameVariables();

        DOM_ELEMENTS.grid.innerHTML = "";
        DOM_ELEMENTS.totalWinDisplay.textContent = "";
        DOM_ELEMENTS.phoneMessageDisplay.textContent = "";
        DOM_ELEMENTS.totalWinDisplay.classList.remove('game-over');
        document.body.classList.remove("cosmic-theme", "quantum-theme");

        DOM_ELEMENTS.gameMainTitle.textContent = "KEEP SPINNING!";
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
        
        DOM_ELEMENTS.windowTriggerBtn.addEventListener('click', toggleWindow);
        DOM_ELEMENTS.petTriggerBtn.addEventListener('click', openPetModal);
        DOM_ELEMENTS.phoneTriggerBtn.addEventListener('click', openPhoneModal);
        DOM_ELEMENTS.shopTriggerBtn.addEventListener('click', openShopModal);
        DOM_ELEMENTS.guideTriggerBtn.addEventListener('click', openGuideSelectionModal);
        
        DOM_ELEMENTS.shopModalCloseBtn.addEventListener('click', closeShopModal);
        DOM_ELEMENTS.guideSelectionModalCloseBtn.addEventListener('click', closeGuideSelectionModal);
        DOM_ELEMENTS.petModalCloseBtn.addEventListener('click', closePetModal);
        DOM_ELEMENTS.phoneModalCloseBtn.addEventListener('click', closePhoneModal);
        DOM_ELEMENTS.alienMediaPayoutCloseBtn.addEventListener('click', () => DOM_ELEMENTS.alienMediaPayoutModal.classList.add('hidden'));
        DOM_ELEMENTS.blackHoleCloseBtn.addEventListener('click', () => DOM_ELEMENTS.blackHoleModal.classList.add('hidden'));

        [DOM_ELEMENTS.shopModalOverlay, DOM_ELEMENTS.guideSelectionModalOverlay, DOM_ELEMENTS.petModalOverlay, DOM_ELEMENTS.phoneModalOverlay, DOM_ELEMENTS.alienMediaPayoutModal, DOM_ELEMENTS.blackHoleModal].forEach(overlay => {
            overlay.addEventListener('click', (event) => {
                if(event.target === overlay) overlay.classList.add('hidden');
            });
        });

        DOM_ELEMENTS.giftChoiceBirdBtn.addEventListener('click', () => selectGift('bird'));
        DOM_ELEMENTS.giftChoiceFoodBtn.addEventListener('click', () => selectGift('food'));
        DOM_ELEMENTS.giftChoiceLocksBtn.addEventListener('click', () => selectGift('locks'));
        
        DOM_ELEMENTS.luckyBtn.textContent = 'LL';
        DOM_ELEMENTS.gameMainTitle.textContent = "KEEP SPINNING!";
        DOM_ELEMENTS.gameMainTitle.classList.remove('upgrade-mode-active');

        closeAllWindows();

        slotMachineState.currentGridSymbols = getSymbolsForSpin();
        slotMachineState.currentMultiplier = getRandomMultiplier();

        updateGridDOM(slotMachineState.currentGridSymbols, slotMachineState.currentMultiplier, false); // No animation on initial load
        updateDisplays();
    }

    initGame();
});
