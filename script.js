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
        initialCoins: 50000,
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
        { emoji: "🐁", cost: 200 }, // UPDATED
        { emoji: "🎥", cost: 3000 },
        { emoji: "🪹", cost: 1000 },
        { emoji: "🛠️🔭", cost: 2000 },
        { emoji: "🛠️⚛️", cost: 6000 },
        { emoji: "⚫", cost: 5000 },
    ];

    // --- DOM ELEMENTS ---
    const DOM_ELEMENTS = {
        gameDiv: document.querySelector('.game'),
        grid: document.getElementById("slot-grid"),
        coinsDisplay: document.getElementById("coins-display"),
        luckyBtn: document.getElementById("lucky-btn"),
        totalWinDisplay: document.getElementById("total-win-display"),
        foodMeterFill: document.getElementById("food-meter-fill-display"),
        foodMeterValue: document.getElementById("food-meter-value-display"),
        symbolInventoryDisplay: document.getElementById("symbol-inventory-display"),
        playerInventoryContent: document.getElementById("player-inventory-content"),
        lockBtnEl: document.getElementById("lock-btn-el"),
        windowToggleButton: document.getElementById("window-toggle"),
        phoneToggleButton: document.getElementById("phone-toggle"),
        phoneContentDisplay: document.getElementById("phone-content"),
        parrotWindowDisplay: document.getElementById("parrot-window-display"),
        owlWindowDisplay: document.getElementById("owl-window-display"),
        doveWindowDisplay: document.getElementById("dove-window-display"),
        phoenixWindowDisplay: document.getElementById("phoenix-window-display"),
        shopContent: document.getElementById("shop-modal-content"), // UPDATED: Points to modal content
        petContent: document.getElementById("pet-content"),
        nestDisplay: document.getElementById("nest-display"),
        nestDesc: document.getElementById("nest-desc"),
        featherDisplay: document.getElementById("feather-display"),
        featherDesc: document.getElementById("feather-desc"),
        beetleDisplay: document.getElementById("beetle-display"),
        beetleDesc: document.getElementById("beetle-desc"),
        branchDisplay: document.getElementById("branch-display"),
        branchDesc: document.getElementById("branch-desc"),
        investmentsBtn: document.getElementById("investments-btn"),
        takeoutBtn: document.getElementById("takeout-area"),
        investmentCountdownSpan: document.getElementById("investment-countdown"),
        takeoutCountdownSpan: document.getElementById("takeout-countdown"),
        quantumUpgradeBtn: document.getElementById("quantum-upgrade-btn"),
        cosmicUpgradeBtn: document.getElementById("cosmic-upgrade-btn"),
        powerMeterFill: document.getElementById("power-meter-fill"),
        powerMeterIndicatorIcon: document.getElementById("power-meter-indicator-icon"),
        nextPowerBillCostDisplay: document.getElementById("next-power-bill-cost-display"),
        donutBuffStatusEl: document.getElementById('donut-buff-status'),
        sushiBuffStatusEl: document.getElementById('sushi-buff-status'),
        cosmicModeStatusEl: document.getElementById('cosmic-mode-status'),
        quantumModeStatusEl: document.getElementById('quantum-mode-status'),
        permanentBuffStatusEl: document.getElementById('permanent-buff-status'), // NEW
        resetGameBtn: document.getElementById('reset-game-btn'),
        spinBtn: document.getElementById('spin-btn'),
        guideIconsContainer: document.getElementById("guide-icons-container"),
        guideIconWindow: document.getElementById("guide-icon-window"),
        guideIconFood: document.getElementById("guide-icon-food"),
        guideIconCat: document.getElementById("guide-icon-cat"),
        guideIconPhone: document.getElementById("guide-icon-phone"),
        guideIconPower: document.getElementById("guide-icon-power"),
        guideIconUpgrades: document.getElementById("guide-icon-upgrades"),
        guidePopupOverlay: document.getElementById("guide-popup-overlay"),
        guidePopupWindow: document.getElementById("guide-popup-window"),
        guidePopupCloseBtn: document.getElementById("guide-popup-close-btn"),
        guidePopupContent: document.getElementById("guide-popup-content"),
        headerCatEmoji: document.getElementById("header-cat-emoji"),
        gameMainTitle: document.getElementById("game-main-title"),
        alienMediaPayoutModal: document.getElementById("alien-media-payout-modal"),
        alienMediaPayoutContent: document.getElementById("alien-media-payout-content"),
        alienMediaPayoutCloseBtn: document.getElementById("alien-media-payout-close-btn"),
        giftChoiceModal: document.getElementById("gift-choice-modal"), // NEW
        giftChoiceBirdBtn: document.getElementById("gift-choice-bird-btn"), // NEW
        giftChoiceFoodBtn: document.getElementById("gift-choice-food-btn"), // NEW
        giftChoiceLocksBtn: document.getElementById("gift-choice-locks-btn"), // NEW
        // NEW Elements for modal triggers
        shopTriggerBtn: document.getElementById("shop-trigger-btn"),
        guideTriggerBtn: document.getElementById("guide-trigger-btn"),
        shopModalOverlay: document.getElementById("shop-modal-overlay"),
        shopModalCloseBtn: document.getElementById("shop-modal-close-btn"),
        guideSelectionModalOverlay: document.getElementById("guide-selection-modal-overlay"),
        guideSelectionModalCloseBtn: document.getElementById("guide-selection-modal-close-btn"),
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
        playerState.inventory = { "🎥": 0, "☕": 2, "👽": 0, "📃": 0, "⚫": 0, "🛠️🔭": 0, "🛠️⚛️": 0, "🎁": 0 }; // Added Gift
        playerState.lockItems = GAME_CONFIG.initialLockItems;
        playerState.billsPaidSoFar = 0;
        playerState.spinCount = 0; // NEW
        playerState.giftAwarded = false; // NEW

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

        activeEffects.alienDroppedByUFO = false; 

        activeEffects.cosmicToolConsumed = false;
        activeEffects.quantumToolConsumed = false;
        activeEffects.cosmicUpgradePenaltyActive = false;
        activeEffects.quantumUpgradePenaltyActive = false;

        activeEffects.permanentBirdBuff = false; // NEW
        activeEffects.permanentFoodReplenishBuff = false; // NEW

        windowFeatureState.birdGainedThisSpin = null;
        windowFeatureState.newlyGainedBirdDetails = null;
        windowFeatureState.hasBirdNest = false;
        windowFeatureState.feathers = 0;
        windowFeatureState.beetles = 0;
        windowFeatureState.hasBranch = false;

        phoneFeatureState.investmentActive = false;
        phoneFeatureState.investmentAmount = 0;
        phoneFeatureState.investmentSpinsLeft = 0;
        phoneFeatureState.investmentResultShowing = false;
        phoneFeatureState.textMessageActive = false;
        phoneFeatureState.takeoutActive = false;
        phoneFeatureState.takeoutSpinsLeft = 0;
        phoneFeatureState.takeoutFoodAmount = 0;

        uiState.isGameOver = false;
        uiState.windowOpen = true;
        uiState.phoneOn = false; // UPDATED - phone starts off
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
        const lockButtonPresent = !!DOM_ELEMENTS.lockBtnEl;
        const isLockEffectivelyActive = slotMachineState.topRightLocked && lockButtonPresent;

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
        if (DOM_ELEMENTS.lockBtnEl) DOM_ELEMENTS.lockBtnEl.disabled = true;

        document.querySelectorAll('.shop-item-btn').forEach(btn => btn.disabled = true);
        document.querySelectorAll('.slot-cell').forEach(cell => cell.onclick = null);
        document.querySelectorAll('.inventory-item.clickable').forEach(item => {
            item.onclick = null; item.style.cursor = 'not-allowed';
        });

        if (activeEffects.cosmicUpgradeActive) deactivateCosmicUpgradeBonusMode(false);
        if (activeEffects.quantumUpgradeActive) deactivateQuantumUpgradeBonusMode(false);

        DOM_ELEMENTS.guidePopupOverlay.classList.add('hidden');
        DOM_ELEMENTS.alienMediaPayoutModal.classList.add('hidden');
        DOM_ELEMENTS.giftChoiceModal.classList.add('hidden'); // NEW
        DOM_ELEMENTS.shopModalOverlay.classList.add('hidden');
        DOM_ELEMENTS.guideSelectionModalOverlay.classList.add('hidden');
        updateDisplays();
    }

    function spin() {
        if (DOM_ELEMENTS.spinBtn.textContent === 'SPINNING...' || uiState.isGameOver || DOM_ELEMENTS.spinBtn.disabled) {
            return;
        }
        
        playerState.spinCount++; // NEW
        if (playerState.spinCount === 60 && !playerState.giftAwarded) {
            playerState.inventory['🎁']++;
            playerState.giftAwarded = true;
            // Optionally, add a notification that a gift has been received.
        }

        if (uiState.phoneOn && (phoneFeatureState.textMessageActive || phoneFeatureState.investmentResultShowing)) {
            DOM_ELEMENTS.phoneContentDisplay.innerHTML = '';
            phoneFeatureState.textMessageActive = false;
            phoneFeatureState.investmentResultShowing = false;
        }

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

        // UPDATED food consumption logic with permanent buff
        let baseConsumption = GAME_CONFIG.baseSpinFoodConsumption;
        let foodToConsumeThisSpin = Math.max(0, baseConsumption);
        if (activeEffects.hasPetCat) foodToConsumeThisSpin += GAME_CONFIG.catFoodConsumption;
        
        if (playerState.foodMeter < foodToConsumeThisSpin) {
             gameOver("Not enough food for this spin!");
             return;
        }

        const lockButtonPresent = !!DOM_ELEMENTS.lockBtnEl;
        const isLockEffectivelyActive = slotMachineState.topRightLocked && lockButtonPresent;

        if (isLockEffectivelyActive && !slotMachineState.currentGridSymbols[3]) {
            DOM_ELEMENTS.spinBtn.disabled = false;
            updateDisplays();
            return;
        }

        windowFeatureState.birdGainedThisSpin = null;
        windowFeatureState.newlyGainedBirdDetails = null;
        [DOM_ELEMENTS.parrotWindowDisplay, DOM_ELEMENTS.owlWindowDisplay, DOM_ELEMENTS.doveWindowDisplay, DOM_ELEMENTS.phoenixWindowDisplay].forEach(d => {
            if (d) { d.textContent = ''; d.style.animation = 'none'; d.style.opacity = '0'; }
        });

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
                    const birdSymbolTemplate = symbols.find(s => s.emoji === randomBirdEmoji);
                    if (birdSymbolTemplate) {
                        windowFeatureState.newlyGainedBirdDetails = { emoji: randomBirdEmoji, objectForAnimation: { ...birdSymbolTemplate } };
                    }
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

        const isPhoneScreenClearForText = !document.getElementById('investment-slider') &&
            !document.getElementById('takeout-slider') &&
            !phoneFeatureState.investmentResultShowing &&
            !phoneFeatureState.textMessageActive;

        if (uiState.phoneOn && isPhoneScreenClearForText &&
            !(phoneFeatureState.investmentActive && phoneFeatureState.investmentSpinsLeft <= 1) &&
            !(phoneFeatureState.takeoutActive && phoneFeatureState.takeoutSpinsLeft <= 1) &&
            Math.random() < GAME_CONFIG.spamTextChance) {

            if (Math.random() < 0.5) {
                playerState.coins -= GAME_CONFIG.spamTextCost; displayTextMessage(`⚠️ Spam Text: -${GAME_CONFIG.spamTextCost} Coins!`, "loss");
            } else {
                playerState.coins += GAME_CONFIG.friendlyTextGain; displayTextMessage(`👥 Friendly Text: +${GAME_CONFIG.friendlyTextGain} Coins!`, "friendly");
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

                if (windowFeatureState.newlyGainedBirdDetails) {
                    windowFeatureState.birdGainedThisSpin = windowFeatureState.newlyGainedBirdDetails.objectForAnimation;
                    if (windowFeatureState.birdGainedThisSpin) {
                        displayBirdInWindow(windowFeatureState.birdGainedThisSpin);
                    }
                    const birdToFinallyAdd = symbols.find(s => s.emoji === windowFeatureState.newlyGainedBirdDetails.emoji);
                    if (birdToFinallyAdd) {
                        if (getTotalBirdCount() < GAME_CONFIG.maxTotalBirdsCap) {
                            birdToFinallyAdd.count++;
                        }
                    }
                    windowFeatureState.newlyGainedBirdDetails = null;
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

    // NEW helper function to centralize payout logic for a single item
    function getSingleItemPayout(item, index) {
        if (!item) return 0;
    
        let itemValue = item.originalValue;
    
        // Apply buffs
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
            if(activeEffects.permanentBirdBuff) itemValue += 1; // NEW permanent bird buff
        }
    
        // Apply Schrödinger Cat 10x multiplier (Quantum Mode)
        if (activeEffects.quantumUpgradeActive && slotMachineState.schrodingerCells.includes(index)) {
            itemValue *= GAME_CONFIG.schrodingerCatMultiplier;
        }
    
        // Apply row/slot multipliers
        if (activeEffects.quantumUpgradeActive) { // Quantum Mode: Bottom row multiplier
            if (index >= 4 && index <= 7) { 
                itemValue *= slotMachineState.currentMultiplier;
            }
        } else if (activeEffects.cosmicUpgradeActive) { // Cosmic Mode: Wider multiplier (bottom row)
            if (index >= 4 && index <= 7) {
                itemValue *= slotMachineState.currentMultiplier;
            }
        } else { // Default multiplier
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
        updatePetWindow();
        updateWindowContentDOM();
        setupShop();
        updateUpgradeButtonsState();
        updatePowerDisplay();
        updateNextPowerBillCostDisplay();
        updateStatusEffectsWindow();

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
            DOM_ELEMENTS.spinBtn.classList.toggle('btn-spin-lucky', slotMachineState.luckyLines);
            DOM_ELEMENTS.spinBtn.textContent = `Spin - ${currentSpinButtonCostText}`;

            DOM_ELEMENTS.spinBtn.classList.toggle('btn-spin-bill-unpaid', playerState.inventory['📃'] > 0 && playerState.power <= 0);
        }

        DOM_ELEMENTS.investmentCountdownSpan.style.display = (phoneFeatureState.investmentActive && phoneFeatureState.investmentSpinsLeft > 0) ? 'inline' : 'none';
        if (phoneFeatureState.investmentActive && phoneFeatureState.investmentSpinsLeft > 0) {
            DOM_ELEMENTS.investmentCountdownSpan.textContent = phoneFeatureState.investmentSpinsLeft;
        }
        DOM_ELEMENTS.takeoutCountdownSpan.style.display = (phoneFeatureState.takeoutActive && phoneFeatureState.takeoutSpinsLeft > 0) ? 'inline' : 'none';
        if (phoneFeatureState.takeoutActive && phoneFeatureState.takeoutSpinsLeft > 0) {
            DOM_ELEMENTS.takeoutCountdownSpan.textContent = phoneFeatureState.takeoutSpinsLeft;
        }

        const isPhoneFeatureRunning = phoneFeatureState.investmentActive || phoneFeatureState.takeoutActive;
        const isPhoneUIShown = document.getElementById('investment-slider') || document.getElementById('takeout-slider');
        const disablePhoneButtons = uiState.isGameOver || !uiState.phoneOn || isPhoneFeatureRunning || isPhoneUIShown;

        DOM_ELEMENTS.investmentsBtn.classList.toggle('disabled', disablePhoneButtons);
        DOM_ELEMENTS.takeoutBtn.classList.toggle('disabled', disablePhoneButtons);


        if (DOM_ELEMENTS.luckyBtn) DOM_ELEMENTS.luckyBtn.disabled = uiState.isGameOver;
        if (DOM_ELEMENTS.lockBtnEl) DOM_ELEMENTS.lockBtnEl.disabled = uiState.isGameOver;
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
        lockSpan.className = 'inventory-item';
        lockSpan.textContent = `🔐 ${playerState.lockItems}`;
        DOM_ELEMENTS.playerInventoryContent.appendChild(lockSpan);

        for (const itemEmoji in playerState.inventory) {
            if (playerState.inventory[itemEmoji] > 0) {
                const itemSpan = document.createElement("span");
                itemSpan.className = 'inventory-item';
                itemSpan.textContent = `${itemEmoji} ${playerState.inventory[itemEmoji]}`;
                if (!uiState.isGameOver) {
                    if (itemEmoji === "☕") {
                        itemSpan.classList.add("clickable"); itemSpan.style.cursor = "pointer";
                        itemSpan.style.opacity = activeEffects.donutBuffActive ? "0.7" : "1";
                        if (!activeEffects.donutBuffActive) itemSpan.onclick = consumeCoffee; else itemSpan.onclick = null;
                    } else if (itemEmoji === "🛠️🔭") {
                        itemSpan.classList.add("clickable"); itemSpan.style.cursor = "pointer";
                        itemSpan.style.opacity = activeEffects.cosmicToolConsumed ? "0.7" : "1";
                        if (!activeEffects.cosmicToolConsumed) itemSpan.onclick = consumeCosmicTool; else itemSpan.onclick = null;
                    } else if (itemEmoji === "🛠️⚛️") {
                        itemSpan.classList.add("clickable"); itemSpan.style.cursor = "pointer";
                        itemSpan.style.opacity = activeEffects.quantumToolConsumed ? "0.7" : "1";
                        if (!activeEffects.quantumToolConsumed) itemSpan.onclick = consumeQuantumTool; else itemSpan.onclick = null;
                    } else if (itemEmoji === "👽") {
                        itemSpan.classList.add("clickable"); itemSpan.style.cursor = "pointer";
                        itemSpan.style.opacity = (!activeEffects.hasAlienVisitor) ? "1" : "0.7";
                        if (!activeEffects.hasAlienVisitor) itemSpan.onclick = activateAlienVisitor; else itemSpan.onclick = null;
                    } else if (itemEmoji === "📃") {
                        itemSpan.classList.add("clickable"); itemSpan.style.cursor = "pointer";
                        itemSpan.onclick = consumePowerBill;
                    } else if (itemEmoji === "🎥") {
                        itemSpan.classList.add("clickable"); itemSpan.style.cursor = "pointer";
                        itemSpan.style.opacity = activeEffects.hasAlienVisitor ? "1" : "0.7";
                        if (activeEffects.hasAlienVisitor) itemSpan.onclick = consumeCamera; else itemSpan.onclick = null;
                    } else if (itemEmoji === "🎁") { // NEW Gift logic
                        itemSpan.classList.add("clickable", "inventory-item-gift");
                        itemSpan.style.cursor = "pointer";
                        itemSpan.onclick = showGiftChoiceModal;
                    }
                }
                DOM_ELEMENTS.playerInventoryContent.appendChild(itemSpan);
            }
        }
    }

    function updatePetWindow() {
        DOM_ELEMENTS.petContent.innerHTML = "";
        if (DOM_ELEMENTS.headerCatEmoji) DOM_ELEMENTS.headerCatEmoji.textContent = "";

        if (activeEffects.hasAlienVisitor) {
            if (DOM_ELEMENTS.headerCatEmoji) DOM_ELEMENTS.headerCatEmoji.textContent = "👽";
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
            DOM_ELEMENTS.petContent.appendChild(alienText);
        } else if (activeEffects.hasPetCat) {
            if (DOM_ELEMENTS.headerCatEmoji) DOM_ELEMENTS.headerCatEmoji.textContent = "🐈";
    
            // New cat status logic with priority
            let newStatus = '😺'; // Default: Happy
            if (!activeEffects.hasMouseToy && activeEffects.spinsWithCat >= 20) {
                newStatus = '😿'; // Sad: Overrides happy
            }
            if (getTotalBirdCount() >= 4 && !windowFeatureState.hasBirdNest) {
                newStatus = '😼'; // Too many birds: Overrides sad and happy
            }
            if (windowFeatureState.beetles > 0 && !windowFeatureState.hasBirdNest) {
                newStatus = '🙀🪲'; // Scared of beetle: Overrides bird, sad, happy
            }
            if (activeEffects.sushiCatBuffActive) {
                newStatus = '😻🍣'; // Sushi buff: Overrides all others
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
            DOM_ELEMENTS.petContent.appendChild(petInfoContainer);

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

            DOM_ELEMENTS.petContent.appendChild(petBottomArea);

        } else {
            DOM_ELEMENTS.petContent.innerHTML = '<div>No pet active.</div>';
             if (DOM_ELEMENTS.headerCatEmoji) DOM_ELEMENTS.headerCatEmoji.textContent = "";
        }
    }


    function updateWindowContentDOM() {
        DOM_ELEMENTS.nestDisplay.style.opacity = windowFeatureState.hasBirdNest ? '1' : '0';
        DOM_ELEMENTS.nestDisplay.textContent = windowFeatureState.hasBirdNest ? '🪹' : '';
        DOM_ELEMENTS.nestDesc.textContent = '';

        DOM_ELEMENTS.featherDisplay.style.opacity = windowFeatureState.feathers > 0 ? '1' : '0';
        DOM_ELEMENTS.featherDisplay.textContent = windowFeatureState.feathers > 0 ? `🪶 ${windowFeatureState.feathers}` : '';
        DOM_ELEMENTS.featherDesc.textContent = '';
        DOM_ELEMENTS.featherDisplay.classList.toggle('max-feathers', windowFeatureState.feathers === GAME_CONFIG.maxFeathers);

        DOM_ELEMENTS.beetleDisplay.style.opacity = windowFeatureState.beetles > 0 ? '1' : '0';
        DOM_ELEMENTS.beetleDisplay.textContent = windowFeatureState.beetles > 0 ? '🪲' : '';
        DOM_ELEMENTS.beetleDesc.textContent = '';


        DOM_ELEMENTS.branchDisplay.style.opacity = windowFeatureState.hasBranch ? '1' : '0';
        DOM_ELEMENTS.branchDisplay.textContent = windowFeatureState.hasBranch ? '🌿' : '';
        DOM_ELEMENTS.branchDesc.textContent = '';
    }

    function updateGridDOM(gridSymbols, currentMultiplier, animate = false) {
        DOM_ELEMENTS.grid.innerHTML = "";
        const baseDelayPerCell = 50;
        const lockButtonPresent = !!DOM_ELEMENTS.lockBtnEl;
        const isLockEffectivelyActiveForAnim = slotMachineState.topRightLocked && lockButtonPresent;


        gridSymbols.forEach((item, index) => {
            const div = document.createElement("div");
            div.className = "slot-cell";
            div.classList.remove('schrodinger-cat-effect');

            const emojiSpan = document.createElement("span");
            emojiSpan.textContent = item ? item.emoji : '';
            div.appendChild(emojiSpan);

            const baseValueSpan = document.createElement("span");
            baseValueSpan.className = "base-value-text";
            div.appendChild(baseValueSpan);

            // Determine if the cell is a multiplier cell for this spin
            let isMultiplierCellForThisSpin = false;
            if (activeEffects.quantumUpgradeActive || activeEffects.cosmicUpgradeActive) {
                if (index >= 4 && index <= 7) isMultiplierCellForThisSpin = true;
            } else {
                if (index === GAME_CONFIG.multiplierSlotIndex) isMultiplierCellForThisSpin = true;
            }

            // UPDATED payout display logic
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
    
                // Set class for color based on priority: Multiplier > Buffed > Base
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


            if (index === 3 && slotMachineState.topRightLocked && lockButtonPresent) {
                div.classList.add("top-right-locked");
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

            if (animate) {
                if (index === 3 && isLockEffectivelyActiveForAnim) {
                    div.style.animation = 'none'; div.style.opacity = '1';
                } else {
                    let effectiveAnimIndex = index;
                    if (isLockEffectivelyActiveForAnim && index > 3) {
                        effectiveAnimIndex--;
                    }
                    const currentCellDelay = effectiveAnimIndex * baseDelayPerCell;
                    div.style.animationDelay = `${currentCellDelay}ms`;
                }
            } else {
                div.style.animation = 'none'; div.style.opacity = '1';
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
            DOM_ELEMENTS.powerMeterFill.style.height = `${(playerState.power / GAME_CONFIG.maxPower) * 100}%`;
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
                displayText = `Bill Due: ${currentBillCost} 🪙`;
            } else {
                const nextBillCost = GAME_CONFIG.powerBillBaseCost + (playerState.billsPaidSoFar * GAME_CONFIG.powerBillIncrement);
                displayText = `Next Bill: ${nextBillCost} 🪙`;
            }
            DOM_ELEMENTS.nextPowerBillCostDisplay.textContent = displayText;
        }
    }

    function updateStatusEffectsWindow() {
        if (!DOM_ELEMENTS.donutBuffStatusEl || !DOM_ELEMENTS.sushiBuffStatusEl || !DOM_ELEMENTS.cosmicModeStatusEl || !DOM_ELEMENTS.quantumModeStatusEl) return;

        const donutActive = activeEffects.donutBuffActive && activeEffects.donutBuffSpinsLeft > 0;
        DOM_ELEMENTS.donutBuffStatusEl.innerHTML = donutActive ? `<span class="buff-emoji">🍩</span> <span class="buff-countdown">${activeEffects.donutBuffSpinsLeft}</span>` : '';
        DOM_ELEMENTS.donutBuffStatusEl.style.display = donutActive ? 'flex' : 'none';

        const sushiActive = activeEffects.sushiCatBuffActive && activeEffects.sushiCatBuffSpinsLeft > 0;
        DOM_ELEMENTS.sushiBuffStatusEl.innerHTML = sushiActive ? `<span class="buff-emoji">😻</span> <span class="buff-countdown">${activeEffects.sushiCatBuffSpinsLeft}</span>` : '';
        DOM_ELEMENTS.sushiBuffStatusEl.style.display = sushiActive ? 'flex' : 'none';

        const cosmicBonusModeActive = activeEffects.cosmicUpgradeActive && activeEffects.cosmicUpgradeSpinsLeft > 0;
        DOM_ELEMENTS.cosmicModeStatusEl.innerHTML = cosmicBonusModeActive ? `<span class="buff-emoji">🔭</span> <span class="buff-countdown">${activeEffects.cosmicUpgradeSpinsLeft}</span>` : '';
        DOM_ELEMENTS.cosmicModeStatusEl.style.display = cosmicBonusModeActive ? 'flex' : 'none';

        const quantumBonusModeActive = activeEffects.quantumUpgradeActive && activeEffects.quantumUpgradeSpinsLeft > 0;
        DOM_ELEMENTS.quantumModeStatusEl.innerHTML = quantumBonusModeActive ? `<span class="buff-emoji">⚛️</span> <span class="buff-countdown">${activeEffects.quantumUpgradeSpinsLeft}</span>` : '';
        DOM_ELEMENTS.quantumModeStatusEl.style.display = quantumBonusModeActive ? 'flex' : 'none';
        
        // NEW Permanent buff display
        DOM_ELEMENTS.permanentBuffStatusEl.innerHTML = '';
        if (activeEffects.permanentBirdBuff) {
             DOM_ELEMENTS.permanentBuffStatusEl.innerHTML += `<span>🐦+1</span>`;
        } 
        if (activeEffects.permanentFoodReplenishBuff) {
             DOM_ELEMENTS.permanentBuffStatusEl.innerHTML += `<span>🍽️+1 Refill</span>`;
        }
    }

    function updateUpgradeButtonsState() {
        if (DOM_ELEMENTS.quantumUpgradeBtn) {
            if (activeEffects.quantumUpgradePenaltyActive || activeEffects.quantumUpgradeActive) {
                DOM_ELEMENTS.quantumUpgradeBtn.style.display = 'none';
            } else {
                DOM_ELEMENTS.quantumUpgradeBtn.style.display = 'inline-block';
                const canActivateQuantum = activeEffects.quantumToolConsumed && !activeEffects.cosmicUpgradeActive;
                DOM_ELEMENTS.quantumUpgradeBtn.disabled = uiState.isGameOver || !canActivateQuantum;
                DOM_ELEMENTS.quantumUpgradeBtn.classList.toggle('active-glow', canActivateQuantum && !uiState.isGameOver);
                DOM_ELEMENTS.quantumUpgradeBtn.innerHTML = "Quantum Upgrade<br><span class='upgrade-cost-text'>-5🔌</span>";
            }
        }

        if (DOM_ELEMENTS.cosmicUpgradeBtn) {
            if (activeEffects.cosmicUpgradePenaltyActive || activeEffects.cosmicUpgradeActive) {
                DOM_ELEMENTS.cosmicUpgradeBtn.style.display = 'none';
            } else {
                DOM_ELEMENTS.cosmicUpgradeBtn.style.display = 'inline-block';
                const canActivateCosmic = activeEffects.cosmicToolConsumed && !activeEffects.quantumUpgradeActive;
                DOM_ELEMENTS.cosmicUpgradeBtn.disabled = uiState.isGameOver || !canActivateCosmic;
                DOM_ELEMENTS.cosmicUpgradeBtn.classList.toggle('active-glow', canActivateCosmic && !uiState.isGameOver);
                DOM_ELEMENTS.cosmicUpgradeBtn.innerHTML = "Cosmic Upgrade<br><span class='upgrade-cost-text'>-2🔌</span>";
            }
        }
    }

    // --- EVENT HANDLERS & UI INTERACTIONS ---
    function toggleLuckyLines() {
        if (!uiState.isGameOver) {
            slotMachineState.luckyLines = !slotMachineState.luckyLines;
            DOM_ELEMENTS.luckyBtn.classList.toggle("active", slotMachineState.luckyLines);
            updateDisplays();
        }
    }

    function toggleLock() {
        const lockButtonPresent = !!DOM_ELEMENTS.lockBtnEl;
        if (uiState.isGameOver || !lockButtonPresent || (DOM_ELEMENTS.lockBtnEl && DOM_ELEMENTS.lockBtnEl.disabled === true)) {
            return;
        }

        const willBeLocked = !slotMachineState.topRightLocked;
        const cell = DOM_ELEMENTS.grid.children[3];

        if (willBeLocked) {
            if (!slotMachineState.currentGridSymbols[3]) { return; }
            if (playerState.lockItems <= 0) { return; }

            playerState.lockItems--;
            slotMachineState.topRightSymbol = slotMachineState.currentGridSymbols[3];
            if (cell) cell.classList.add("top-right-locked");
            DOM_ELEMENTS.lockBtnEl.textContent = "🔒";
            slotMachineState.topRightLocked = true;
        } else {
            slotMachineState.topRightSymbol = null;
            if (cell) cell.classList.remove("top-right-locked");
            DOM_ELEMENTS.lockBtnEl.textContent = "🔓";
            slotMachineState.topRightLocked = false;
        }
        updateDisplays();
    }

    function toggleWindow() {
        uiState.windowOpen = !uiState.windowOpen;
        DOM_ELEMENTS.windowToggleButton.querySelector('.large-emoji').textContent = uiState.windowOpen ? '🪟' : '⬜';
        if (!uiState.windowOpen) {
            [DOM_ELEMENTS.parrotWindowDisplay, DOM_ELEMENTS.owlWindowDisplay, DOM_ELEMENTS.doveWindowDisplay, DOM_ELEMENTS.phoenixWindowDisplay].forEach(d => {
                if (d) { d.textContent = ''; d.style.animation = 'none'; d.style.opacity = '0'; }
            });
        }
    }

    function togglePhone() {
        uiState.phoneOn = !uiState.phoneOn;
        DOM_ELEMENTS.phoneToggleButton.querySelector('.large-emoji').textContent = uiState.phoneOn ? '📱' : '📴';
        if (!uiState.phoneOn) {
            if (phoneFeatureState.investmentActive) handleInvestmentLoss("Phone turned off!");
            if (phoneFeatureState.takeoutActive) cancelTakeoutOrder("Phone turned off!");
            DOM_ELEMENTS.phoneContentDisplay.innerHTML = '';
            phoneFeatureState.investmentResultShowing = false;
            phoneFeatureState.textMessageActive = false;

        } else {
            const uiActive = document.getElementById('investment-slider') || document.getElementById('takeout-slider');
            if (!uiActive && !phoneFeatureState.investmentResultShowing && !phoneFeatureState.textMessageActive) {
                DOM_ELEMENTS.phoneContentDisplay.innerHTML = '';
            }
        }
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

                const lockButtonPresent = !!DOM_ELEMENTS.lockBtnEl;
                if (index === 3 && slotMachineState.topRightLocked && lockButtonPresent) {
                    slotMachineState.topRightLocked = false;
                    slotMachineState.topRightSymbol = null;
                    DOM_ELEMENTS.lockBtnEl.textContent = "🔓";
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

            const lockButtonPresent = !!DOM_ELEMENTS.lockBtnEl;
            if (index === 3 && slotMachineState.topRightLocked && lockButtonPresent) {
                slotMachineState.topRightLocked = false;
                slotMachineState.topRightSymbol = null;
                DOM_ELEMENTS.lockBtnEl.textContent = "🔓";
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

        if (itemEmoji === "🪹") {
            if (windowFeatureState.hasBirdNest) { return; }
            windowFeatureState.hasBirdNest = true;
            if (windowFeatureState.beetles > 0) windowFeatureState.beetles = 0;
        } else if (itemEmoji === "🐁") {
            if (!activeEffects.hasPetCat || activeEffects.hasMouseToy) { return; }
            activeEffects.hasMouseToy = true;
            activeEffects.spinsWithCat = 0;
        } else if (itemEmoji === "🛠️🔭") {
            if (playerState.inventory[itemEmoji] > 0 || activeEffects.cosmicToolConsumed) return;
            playerState.inventory[itemEmoji]++;
        } else if (itemEmoji === "🛠️⚛️") {
            if (playerState.inventory[itemEmoji] > 0 || activeEffects.quantumToolConsumed) return;
            playerState.inventory[itemEmoji]++;
        } else if (itemEmoji === "🎥") {
            if (playerState.inventory[itemEmoji] >= 1) return; // Can only buy one
            playerState.inventory[itemEmoji]++;
        } else {
            playerState.inventory[itemEmoji]++;
        }
        playerState.coins -= cost;
        updateDisplays();
    }

    function setupShop() {
        DOM_ELEMENTS.shopContent.innerHTML = "";
        const sortedShopItems = [...SHOP_ITEMS_CONFIG].sort((a, b) => a.cost - b.cost);
    
        sortedShopItems.forEach(item => {
            // NEW: Hide one-time-purchase items after they are bought
            if (item.emoji === "🪹" && windowFeatureState.hasBirdNest) return;
            if (item.emoji === "🐁" && activeEffects.hasMouseToy) return;
            if (["🛠️🔭", "🛠️⚛️", "🎥", "⚫"].includes(item.emoji)) {
                if (playerState.inventory[item.emoji] >= 1) return;
            }
             if (item.emoji === "🛠️🔭" && activeEffects.cosmicToolConsumed) return;
             if (item.emoji === "🛠️⚛️" && activeEffects.quantumToolConsumed) return;

            const btn = document.createElement("button");
            btn.className = "shop-item-btn";
    
            let displayCost = item.cost;
            if (item.emoji === "🪹") displayCost = windowFeatureState.hasBranch ? 250 : item.cost;
    
            let canBuy = true;
            // Simplified `canBuy` check, since we are hiding items instead of just disabling them.
            // Still need to check for non-permanent conditions (like needing a cat to buy a toy).
            if (playerState.coins < displayCost || uiState.isGameOver) {
                canBuy = false;
            } else if (item.emoji === "🐁") {
                if (!activeEffects.hasPetCat) canBuy = false;
            }
    
            btn.innerHTML = `${item.emoji} <strong class="shop-item-cost">${displayCost}</strong>`;
            btn.onclick = () => purchaseItem(item.emoji);
            btn.disabled = !canBuy;
            DOM_ELEMENTS.shopContent.appendChild(btn);
        });
    }


    function displayTextMessage(message, type) {
        const isPhoneScreenBusyWithUI = document.getElementById('investment-slider') ||
            document.getElementById('takeout-slider');

        if (uiState.isGameOver || !uiState.phoneOn || isPhoneScreenBusyWithUI ||
            (phoneFeatureState.investmentActive && phoneFeatureState.investmentSpinsLeft <= 1) ||
            (phoneFeatureState.takeoutActive && phoneFeatureState.takeoutSpinsLeft <= 1)) {
            return;
        }

        DOM_ELEMENTS.phoneContentDisplay.innerHTML = `<div class="text-message ${type}">${message}</div>`;
        phoneFeatureState.textMessageActive = true;
        phoneFeatureState.investmentResultShowing = false;
    }

    function clearTextMessage() {
        if (DOM_ELEMENTS.phoneContentDisplay.querySelector('.text-message') &&
            phoneFeatureState.textMessageActive &&
            !phoneFeatureState.investmentResultShowing &&
            !document.getElementById('investment-slider') &&
            !document.getElementById('takeout-slider')) {
            DOM_ELEMENTS.phoneContentDisplay.innerHTML = '';
            phoneFeatureState.textMessageActive = false;
        }
    }

    function updatePhoneContent(message = "", type = "") {
        if (!uiState.phoneOn) {
            DOM_ELEMENTS.phoneContentDisplay.innerHTML = '';
            phoneFeatureState.investmentResultShowing = false;
            phoneFeatureState.textMessageActive = false;
            return;
        }
        if (message) {
            DOM_ELEMENTS.phoneContentDisplay.innerHTML = `<div class="investment-result ${type}">${message}</div>`;
            phoneFeatureState.investmentResultShowing = true;
            phoneFeatureState.textMessageActive = false;
        } else {
            const uiActive = document.getElementById('investment-slider') || document.getElementById('takeout-slider');
            if (!phoneFeatureState.investmentResultShowing && !phoneFeatureState.textMessageActive && !uiActive) {
                DOM_ELEMENTS.phoneContentDisplay.innerHTML = '';
            }
        }
    }

    function showInvestmentUI() {
        if (uiState.isGameOver || !uiState.phoneOn || phoneFeatureState.investmentActive || phoneFeatureState.takeoutActive ) return;

        DOM_ELEMENTS.phoneContentDisplay.innerHTML = '';
        phoneFeatureState.investmentResultShowing = false;
        phoneFeatureState.textMessageActive = false;
        
        // UPDATED Investment max
        const maxInvest = Math.min(playerState.coins, 1000);

        DOM_ELEMENTS.phoneContentDisplay.innerHTML = `
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
        updateDisplays();
    }

    function startInvestment(amount) {
        if (uiState.isGameOver || amount <= 0 || amount > playerState.coins || amount > 1000) {
            return;
        }
        phoneFeatureState.investmentAmount = amount;
        playerState.coins -= amount;
        phoneFeatureState.investmentActive = true;
        phoneFeatureState.investmentSpinsLeft = GAME_CONFIG.investmentDuration;
        DOM_ELEMENTS.phoneContentDisplay.innerHTML = '';
        phoneFeatureState.investmentResultShowing = false;
        phoneFeatureState.textMessageActive = false;
        updateDisplays();
    }

    function handleInvestmentSpin() {
        if (!phoneFeatureState.investmentActive || uiState.isGameOver) return;
        if (!uiState.phoneOn) { handleInvestmentLoss("Phone turned off!"); return; }
        phoneFeatureState.investmentSpinsLeft--;
        if (phoneFeatureState.investmentSpinsLeft <= 0) resolveInvestment();
        updateDisplays();
    }

    function handleInvestmentLoss(reason = "Investment Lost!") {
        if (!phoneFeatureState.investmentActive && !uiState.isGameOver && !phoneFeatureState.investmentResultShowing) return;
        updatePhoneContent(reason, "loss");
        phoneFeatureState.investmentAmount = 0;
        phoneFeatureState.investmentActive = false;
        phoneFeatureState.investmentSpinsLeft = 0;
        updateDisplays();
    }

    function resolveInvestment() {
        if (!phoneFeatureState.investmentActive && !uiState.isGameOver && !phoneFeatureState.investmentResultShowing) return;
        const profitMade = Math.random() < 0.75;
        let payoutAmount = profitMade ? Math.floor(phoneFeatureState.investmentAmount * 1.5) : Math.floor(phoneFeatureState.investmentAmount * 0.5);
        let messageText = `${profitMade ? '📈 Profit!' : '📉 Loss!'} +${payoutAmount} Coins!`;
        playerState.coins += payoutAmount;
        updatePhoneContent(messageText, profitMade ? 'profit' : 'loss');
        phoneFeatureState.investmentAmount = 0;
        phoneFeatureState.investmentActive = false;
        phoneFeatureState.investmentSpinsLeft = 0;
        updateDisplays();
    }


    function showTakeoutUI() {
        if (uiState.isGameOver || !uiState.phoneOn || phoneFeatureState.takeoutActive || phoneFeatureState.investmentActive ) return;

        DOM_ELEMENTS.phoneContentDisplay.innerHTML = '';
        phoneFeatureState.investmentResultShowing = false;
        phoneFeatureState.textMessageActive = false;
        DOM_ELEMENTS.phoneContentDisplay.innerHTML = `
            <div class="takeout-ui">
                <span>Emoji Eats: Order food symbols for 15🪙 each, or 10 for 100🪙.</span>
                <span id="takeout-amount-display">1</span>
                <input type="range" id="takeout-slider" min="1" max="10" value="1">
                <button id="takeout-confirm-btn" class="btn">Order</button>
            </div>`;
        const slider = document.getElementById('takeout-slider');
        const amountDisplay = document.getElementById('takeout-amount-display');
        const button = document.getElementById('takeout-confirm-btn');
        slider.oninput = () => { amountDisplay.textContent = slider.value; };
        button.onclick = () => { startTakeoutOrder(parseInt(slider.value)); };
        updateDisplays();
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
        phoneFeatureState.takeoutSpinsLeft = GAME_CONFIG.takeoutDuration;
        DOM_ELEMENTS.phoneContentDisplay.innerHTML = '';
        phoneFeatureState.investmentResultShowing = false;
        phoneFeatureState.textMessageActive = false;
        updateDisplays();
    }

    function handleTakeoutSpin() {
        if (!phoneFeatureState.takeoutActive || uiState.isGameOver) return;
        if (!uiState.phoneOn) { cancelTakeoutOrder("Phone turned off!"); return; }
        phoneFeatureState.takeoutSpinsLeft--;
        if (phoneFeatureState.takeoutSpinsLeft <= 0) resolveTakeoutOrder();
        updateDisplays();
    }

    function resolveTakeoutOrder() {
        if (!phoneFeatureState.takeoutActive && !uiState.isGameOver && !phoneFeatureState.investmentResultShowing) return;
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
        updatePhoneContent(`🥡 +${phoneFeatureState.takeoutFoodAmount} food items delivered!`, "takeout-confirm");
        phoneFeatureState.takeoutActive = false;
        phoneFeatureState.takeoutSpinsLeft = 0;
        phoneFeatureState.takeoutFoodAmount = 0;
        updateDisplays();
    }

    function cancelTakeoutOrder(reason) {
        if (!phoneFeatureState.takeoutActive && !uiState.isGameOver && !phoneFeatureState.investmentResultShowing) return;
        updatePhoneContent(`🥡 Order Canceled: ${reason}`, "loss");
        phoneFeatureState.takeoutActive = false;
        phoneFeatureState.takeoutSpinsLeft = 0;
        phoneFeatureState.takeoutFoodAmount = 0;
        updateDisplays();
    }

    function displayBirdInWindow(birdObject) {
        if (!birdObject || !birdObject.emoji || !uiState.windowOpen) return;
        let displayElement;
        switch (birdObject.emoji) {
            case '🦜': displayElement = DOM_ELEMENTS.parrotWindowDisplay; break;
            case '🦉': displayElement = DOM_ELEMENTS.owlWindowDisplay; break;
            case '🕊️': displayElement = DOM_ELEMENTS.doveWindowDisplay; break;
            case '🐦‍🔥': displayElement = DOM_ELEMENTS.phoenixWindowDisplay; break;
            default: return;
        }
        if (displayElement) {
            displayElement.textContent = birdObject.emoji;
            displayElement.style.animation = 'none';
            displayElement.style.opacity = '1';

            setTimeout(() => {
                if (displayElement) {
                    displayElement.textContent = '';
                    displayElement.style.opacity = '0';
                }
            }, 2000);
        }
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

    function consumeCosmicTool() {
        if (uiState.isGameOver || playerState.inventory["🛠️🔭"] <= 0 || activeEffects.cosmicToolConsumed) {
            return;
        }
        playerState.inventory["🛠️🔭"]--;
        activeEffects.cosmicToolConsumed = true;
        updateDisplays();
    }

    function consumeQuantumTool() {
        if (uiState.isGameOver || playerState.inventory["🛠️⚛️"] <= 0 || activeEffects.quantumToolConsumed) {
            return;
        }
        playerState.inventory["🛠️⚛️"]--;
        activeEffects.quantumToolConsumed = true;
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

        // UPDATED payout message
        const payout4500HTML = payout === 4500 ? `<span class="payout-option highlight">4500🪙</span>` : `4500🪙`;
        const payout6000HTML = payout === 6000 ? `<span class="payout-option highlight">6000🪙</span>` : `6000🪙`;
        const negotiationText = payout === 6000 ? 'You negotiated well!' : "You didn't negotiate well...";

        DOM_ELEMENTS.alienMediaPayoutContent.innerHTML = `You sold proof of alien life, scaring them away. Payouts: ${payout4500HTML} or ${payout6000HTML}.<br><br><strong>${negotiationText}</strong>`;
        DOM_ELEMENTS.alienMediaPayoutModal.classList.remove('hidden');
        
        updateDisplays();
    }


    // --- UPGRADE & GIFT FUNCTIONS ---
    function activateQuantumUpgrade() {
        if (uiState.isGameOver || DOM_ELEMENTS.quantumUpgradeBtn.disabled || activeEffects.quantumUpgradeActive || activeEffects.quantumUpgradePenaltyActive || activeEffects.cosmicUpgradeActive) return;

        if (activeEffects.quantumToolConsumed) {
            activeEffects.quantumUpgradePenaltyActive = true;
            activeEffects.quantumUpgradeActive = true;
            activeEffects.quantumUpgradeSpinsLeft = GAME_CONFIG.quantumModeDuration;

            document.body.classList.add("quantum-theme");
            DOM_ELEMENTS.gameMainTitle.textContent = "QUANTUM MODE";
            DOM_ELEMENTS.gameMainTitle.classList.add('upgrade-mode-active'); 

            if(DOM_ELEMENTS.cosmicUpgradeBtn) DOM_ELEMENTS.cosmicUpgradeBtn.disabled = true;
        }
        updateDisplays();
    }


    function handleCosmicUpgradeButtonClick() {
        if (uiState.isGameOver || DOM_ELEMENTS.cosmicUpgradeBtn.disabled || activeEffects.cosmicUpgradeActive || activeEffects.cosmicUpgradePenaltyActive || activeEffects.quantumUpgradeActive) return;

        if (activeEffects.cosmicToolConsumed) {
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
            if(DOM_ELEMENTS.quantumUpgradeBtn) DOM_ELEMENTS.quantumUpgradeBtn.disabled = true;
        }
        updateDisplays();
    }


    function deactivateCosmicUpgradeBonusMode(showFeedback = true) {
        activeEffects.cosmicUpgradeActive = false;
        document.body.classList.remove("cosmic-theme");

        if (!activeEffects.quantumUpgradeActive) {
            DOM_ELEMENTS.gameMainTitle.textContent = "Keep Spinning";
            DOM_ELEMENTS.gameMainTitle.classList.remove('upgrade-mode-active');
        }

        if (DOM_ELEMENTS.quantumUpgradeBtn && !activeEffects.quantumUpgradePenaltyActive && activeEffects.quantumToolConsumed) {
            DOM_ELEMENTS.quantumUpgradeBtn.disabled = uiState.isGameOver;
        } else if (DOM_ELEMENTS.quantumUpgradeBtn && (activeEffects.quantumUpgradePenaltyActive || activeEffects.quantumUpgradeActive)) {
             DOM_ELEMENTS.quantumUpgradeBtn.disabled = true;
        }

        if (DOM_ELEMENTS.lockBtnEl) DOM_ELEMENTS.lockBtnEl.disabled = uiState.isGameOver;

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

        if (DOM_ELEMENTS.cosmicUpgradeBtn && !activeEffects.cosmicUpgradePenaltyActive && activeEffects.cosmicToolConsumed) {
            DOM_ELEMENTS.cosmicUpgradeBtn.disabled = uiState.isGameOver;
        } else if (DOM_ELEMENTS.cosmicUpgradeBtn && (activeEffects.cosmicUpgradePenaltyActive || activeEffects.cosmicUpgradeActive)) {
            DOM_ELEMENTS.cosmicUpgradeBtn.disabled = true;
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
            // activeEffects.hasMouseToy = false; // REMOVED: Mouse toy is now persistent
        }
        playerState.inventory["👽"]--;
        activeEffects.hasAlienVisitor = true;
        updateDisplays();
    }

    // NEW Gift functions
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


    // --- GUIDE FUNCTION ---
    function displayGuideInfo(topic) {
        let content = '';
        const foodRefillValue = INITIAL_SYMBOLS_CONFIG.find(s => s.isFood)?.refill || 10;
        const cameraShopItem = SHOP_ITEMS_CONFIG.find(i => i.emoji === "🎥");

        switch (topic) {
            case 'window':
                content = `
                    <h4>🪟 Window</h4>
                    <p><strong>🪟/⬜:</strong> Toggle open/closed.</p>
                    <p><strong>Open:</strong> ${GAME_CONFIG.birdGainChance * 100}% chance/spin to gain bird, ${GAME_CONFIG.birdLossChance * 100}% to lose (if no nest/beetle). Max ${GAME_CONFIG.maxTotalBirdsCap} birds.</p>
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
                    <h4>🐈‍⬛ Pet Cat / 👽 Alien</h4>
                    <p>Click 🐈‍⬛ on grid to adopt (uses 1 symbol). Click 👽 in inventory to activate (replaces cat).</p>
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
                    <p><strong>📱/📴:</strong> Toggle on/off.</p>
                    <p><strong>ON (no UI active):</strong> ${GAME_CONFIG.spamTextChance * 100}% chance/spin for text:</p>
                    <ul>
                        <li>⚠️ <strong>Spam:</strong> Lose ${GAME_CONFIG.spamTextCost} 🪙.</li>
                        <li>👥 <strong>Friendly:</strong> Gain ${GAME_CONFIG.friendlyTextGain} 🪙.</li>
                    </ul>
                    <p>🥡 <strong>Emoji Eats (Takeout):</strong></p>
                    <ul>
                        <li>Order random food symbols. Max ${GAME_CONFIG.maxFoodSymbolCap} of each type.</li>
                        <li>Cost: 15🪙/item (10 for 100🪙). Delivery: ${GAME_CONFIG.takeoutDuration} spins.</li>
                        <li>📴 cancels order (lose 🪙).</li>
                    </ul>
                    <p>🏦 <strong>Investing:</strong></p>
                    <ul>
                        <li>Invest 🪙 for ${GAME_CONFIG.investmentDuration} spins. 📴 cancels (lose 🪙).</li>
                        <li><strong>Outcomes:</strong> Profit (75%): 1.5x payout. Loss (25%): 0.5x payout.</li>
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
                 const cosmicToolShopItem = SHOP_ITEMS_CONFIG.find(i => i.emoji === "🛠️🔭");
                 const quantumToolShopItem = SHOP_ITEMS_CONFIG.find(i => i.emoji === "🛠️⚛️");
                content = `
                    <h4>🛠️ Upgrades & Modes</h4>
                    <p>Buy Tools: ${cosmicToolShopItem.emoji} (${cosmicToolShopItem.cost}🪙) or ${quantumToolShopItem.emoji} (${quantumToolShopItem.cost}🪙) from Shop.</p> <p>Consume tools from Inventory to enable Upgrade buttons.</p> <p>Upgrades add permanent power drain (see ⚛️/🔭 by 🔌 icon) and activate a temporary mode. Only one mode (Cosmic/Quantum) can be active at a time.</p>
                    <h5>${cosmicToolShopItem.emoji} Cosmic Upgrade</h5>
                    <p>Penalty: -2🔌. Triggers ${GAME_CONFIG.cosmicModeDuration}-spin Cosmic Mode.</p>
                    <p>Mode: Adds Cosmic symbols (🪐,🌠,🌒,🛸) to bag. Multiplier (2x,3x,5x) applies to bottom row (cells 5-8). 🛸 may drop 👽.</p>
                    <h5>${quantumToolShopItem.emoji} Quantum Upgrade</h5>
                    <p>Penalty: -5🔌. Triggers ${GAME_CONFIG.quantumModeDuration}-spin Quantum Mode.</p>
                    <p>Mode: No new symbols. Multiplier (2x,3x,5x) applies to bottom row (cells 5-8).
                    <br><strong>Schrödinger's Cat:</strong> Each spin, ${GAME_CONFIG.schrodingerCatsCount} random grid symbols get a 🐈 overlay and their payout is multiplied by an additional ${GAME_CONFIG.schrodingerCatMultiplier}x (stacks with row multiplier).</p>
                `;
                break;
            default:
                content = '<p>Select an icon for gameplay information.</p>';
        }
        DOM_ELEMENTS.guidePopupContent.innerHTML = content;
        DOM_ELEMENTS.guideSelectionModalOverlay.classList.add('hidden'); // Close selection modal
        DOM_ELEMENTS.guidePopupOverlay.classList.remove('hidden');
    }

    // --- MODAL CONTROL FUNCTIONS ---
    function openShopModal() {
        if (uiState.isGameOver) return;
        DOM_ELEMENTS.shopModalOverlay.classList.remove('hidden');
    }
    function closeShopModal() {
        DOM_ELEMENTS.shopModalOverlay.classList.add('hidden');
    }
    function openGuideSelectionModal() {
        if (uiState.isGameOver) return;
        DOM_ELEMENTS.guideSelectionModalOverlay.classList.remove('hidden');
    }
    function closeGuideSelectionModal() {
        DOM_ELEMENTS.guideSelectionModalOverlay.classList.add('hidden');
    }


    // --- GAME RESET ---
    function resetGame() {
        initializeGameVariables();

        DOM_ELEMENTS.grid.innerHTML = "";
        DOM_ELEMENTS.phoneContentDisplay.innerHTML = "";
        DOM_ELEMENTS.totalWinDisplay.textContent = "";
        DOM_ELEMENTS.totalWinDisplay.classList.remove('game-over');
        document.body.classList.remove("cosmic-theme", "quantum-theme");

        DOM_ELEMENTS.gameMainTitle.textContent = "Keep Spinning";
        DOM_ELEMENTS.gameMainTitle.classList.remove('upgrade-mode-active');

        DOM_ELEMENTS.guidePopupOverlay.classList.add('hidden');
        DOM_ELEMENTS.alienMediaPayoutModal.classList.add('hidden');
        DOM_ELEMENTS.giftChoiceModal.classList.add('hidden'); // NEW
        DOM_ELEMENTS.shopModalOverlay.classList.add('hidden');
        DOM_ELEMENTS.guideSelectionModalOverlay.classList.add('hidden');

        if (DOM_ELEMENTS.gameDiv) DOM_ELEMENTS.gameDiv.classList.remove('food-warning');

        if (DOM_ELEMENTS.quantumUpgradeBtn) {
            DOM_ELEMENTS.quantumUpgradeBtn.style.display = 'inline-block';
        }
        if (DOM_ELEMENTS.cosmicUpgradeBtn) {
            DOM_ELEMENTS.cosmicUpgradeBtn.style.display = 'inline-block';
        }

        if (DOM_ELEMENTS.lockBtnEl) {
            DOM_ELEMENTS.lockBtnEl.disabled = false;
            DOM_ELEMENTS.lockBtnEl.textContent = "🔓";
        }
        slotMachineState.topRightLocked = false;
        slotMachineState.topRightSymbol = null;


        slotMachineState.currentGridSymbols = getSymbolsForSpin();
        slotMachineState.currentMultiplier = getRandomMultiplier();

        updateGridDOM(slotMachineState.currentGridSymbols, slotMachineState.currentMultiplier, true);
        updateDisplays();
    }

    // --- INITIALIZATION ---
    function initGame() {
        initializeGameVariables();
	DOM_ELEMENTS.phoneToggleButton.querySelector('.large-emoji').textContent = uiState.phoneOn ? '📱' : '📴';
        DOM_ELEMENTS.spinBtn.addEventListener('click', spin);
        DOM_ELEMENTS.luckyBtn.addEventListener('click', toggleLuckyLines);
        if (DOM_ELEMENTS.lockBtnEl) DOM_ELEMENTS.lockBtnEl.addEventListener('click', toggleLock);
        DOM_ELEMENTS.windowToggleButton.addEventListener('click', toggleWindow);
        DOM_ELEMENTS.phoneToggleButton.addEventListener('click', togglePhone);
        DOM_ELEMENTS.investmentsBtn.addEventListener('click', showInvestmentUI);
        DOM_ELEMENTS.takeoutBtn.addEventListener('click', showTakeoutUI);

        DOM_ELEMENTS.quantumUpgradeBtn.addEventListener('click', activateQuantumUpgrade);
        DOM_ELEMENTS.cosmicUpgradeBtn.addEventListener('click', handleCosmicUpgradeButtonClick);

        DOM_ELEMENTS.resetGameBtn.addEventListener('click', resetGame);

        // NEW Gift Button Listeners
        DOM_ELEMENTS.giftChoiceBirdBtn.addEventListener('click', () => selectGift('bird'));
        DOM_ELEMENTS.giftChoiceFoodBtn.addEventListener('click', () => selectGift('food'));
        DOM_ELEMENTS.giftChoiceLocksBtn.addEventListener('click', () => selectGift('locks'));
        
        // Modal Trigger Listeners
        DOM_ELEMENTS.shopTriggerBtn.addEventListener('click', openShopModal);
        DOM_ELEMENTS.guideTriggerBtn.addEventListener('click', openGuideSelectionModal);

        DOM_ELEMENTS.shopModalCloseBtn.addEventListener('click', closeShopModal);
        DOM_ELEMENTS.shopModalOverlay.addEventListener('click', (event) => {
            if(event.target === DOM_ELEMENTS.shopModalOverlay) closeShopModal();
        });
        
        DOM_ELEMENTS.guideSelectionModalCloseBtn.addEventListener('click', closeGuideSelectionModal);
        DOM_ELEMENTS.guideSelectionModalOverlay.addEventListener('click', (event) => {
            if(event.target === DOM_ELEMENTS.guideSelectionModalOverlay) closeGuideSelectionModal();
        });


        DOM_ELEMENTS.guideIconWindow.addEventListener('click', () => displayGuideInfo('window'));
        DOM_ELEMENTS.guideIconFood.addEventListener('click', () => displayGuideInfo('food'));
        DOM_ELEMENTS.guideIconCat.addEventListener('click', () => displayGuideInfo('cat'));
        DOM_ELEMENTS.guideIconPhone.addEventListener('click', () => displayGuideInfo('phone'));
        DOM_ELEMENTS.guideIconPower.addEventListener('click', () => displayGuideInfo('power'));
        DOM_ELEMENTS.guideIconUpgrades.addEventListener('click', () => displayGuideInfo('upgrades'));

        DOM_ELEMENTS.guidePopupCloseBtn.addEventListener('click', () => {
            DOM_ELEMENTS.guidePopupOverlay.classList.add('hidden');
        });
        DOM_ELEMENTS.guidePopupOverlay.addEventListener('click', (event) => {
            if (event.target === DOM_ELEMENTS.guidePopupOverlay) {
                DOM_ELEMENTS.guidePopupOverlay.classList.add('hidden');
            }
        });

        DOM_ELEMENTS.alienMediaPayoutCloseBtn.addEventListener('click', () => {
            DOM_ELEMENTS.alienMediaPayoutModal.classList.add('hidden');
        });
        DOM_ELEMENTS.alienMediaPayoutModal.addEventListener('click', (event) => {
            if (event.target === DOM_ELEMENTS.alienMediaPayoutModal) {
                DOM_ELEMENTS.alienMediaPayoutModal.classList.add('hidden');
            }
        });


        DOM_ELEMENTS.luckyBtn.innerHTML = 'Lucky<br>Lines';

        DOM_ELEMENTS.gameMainTitle.textContent = "Keep Spinning";
        DOM_ELEMENTS.gameMainTitle.classList.remove('upgrade-mode-active');

        DOM_ELEMENTS.guidePopupOverlay.classList.add('hidden');


        slotMachineState.currentGridSymbols = getSymbolsForSpin();
        slotMachineState.currentMultiplier = getRandomMultiplier();

        updateGridDOM(slotMachineState.currentGridSymbols, slotMachineState.currentMultiplier, true);
        updateDisplays();
    }

    initGame();
});