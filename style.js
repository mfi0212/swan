         document.addEventListener("DOMContentLoaded", () => {
            const loadingOverlay = document.getElementById("loadingOverlay");
            setTimeout(() => {
                loadingOverlay.classList.add("hidden");
            }, 5000);
        });

        let currentOption = '';
        let selectedPlan = 'fixed'; // Default plan
        let selectedAmount = 0;
        let currentInterest = 0;
        let days = 0;
        let lendCount = { fixed: 0, share: 0 }; // Track lending frequency per plan

        let givers = [
            { name: "Bhargav Akula", phone: "MFI member only", amount: 0, interest: 2000, availability: false },
        ];

        let userDetails = {
            name: "Jainu kalyan",
            phone: "Private",
            status: "Giver",
            amount: 0,
            interest: 0,
            lendlinkShare: "650/month",
            ActiveFor: "0 months",
            SharePaidtill: "Paid for 0 months"
        }; 

        const correctPin = 'TAK#12'; 
        const correctGiverPin = 'GIV#12'; 
        const correctUserPin = 'ACC#12';

        const FIXED_INTEREST_RATE = 1.4; // 14% annual
        const SHARE_INTEREST_RATE = 2.5; // 25% annual
        const MAX_FIXED_AMOUNT = 15000;
        const FIXED_LEND_LIMIT = 1; // Once per month
        const SHARE_LEND_LIMIT = 3; // Up to 3 times per month

        function selectPlan(plan) {
            selectedPlan = plan;
            document.querySelectorAll('.plan-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector(`.plan-btn[onclick="selectPlan('${plan}')"]`).classList.add('active');
            updateAmountButtons();
            updateUserDetails();
            if (selectedAmount !== 0) {
                selectAmount(selectedAmount); // Update interest for selected amount
            }
        }

        function updateAmountButtons() {
            document.querySelectorAll('.amount-btn').forEach(btn => {
                const amount = parseInt(btn.textContent.replace('₹', '').replace(',', ''));
                if (selectedPlan === 'fixed' && amount > MAX_FIXED_AMOUNT) {
                    btn.classList.add('disabled');
                    btn.disabled = true;
                } else {
                    btn.classList.remove('disabled');
                    btn.disabled = false;
                }
            });
        }

        function updateUserDetails() {
            userDetails.lendlinkShare = selectedPlan === 'fixed' ? '650/month' : '50% interest share';
            if (document.getElementById('account-section').classList.contains('active')) {
                displayUserDetails();
            }
        }

        function showPinModal(type) {
            currentOption = type;
            const modal = type === 'giver' ? document.getElementById('giver-pin-modal') : 
                         type === 'account' ? document.getElementById('user-pin-modal') : 
                         document.getElementById('pin-modal');
            modal.style.display = 'flex';
            const input = document.getElementById(type === 'giver' ? 'giver-pin-input' : 
                                                 type === 'account' ? 'user-pin-input' : 'pin-input');
            input.value = '';
            document.getElementById(type === 'giver' ? 'giver-pin-error' : 
                                    type === 'account' ? 'user-pin-error' : 'pin-error').style.display = 'none';
            input.focus();
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.style.display = 'none';
            const error = document.getElementById(modalId === 'pin-modal' ? 'pin-error' : 
                                                 modalId === 'giver-pin-modal' ? 'giver-pin-error' : 'user-pin-error');
            error.style.display = 'none';
        }

        function validatePin(type) {
            const pinInput = document.getElementById(type === 'giver' ? 'giver-pin-input' : 'pin-input');
            const pinError = document.getElementById(type === 'giver' ? 'giver-pin-error' : 'pin-error');
            const modal = document.getElementById(type === 'giver' ? 'giver-pin-modal' : 'pin-modal');
            const pin = pinInput.value;

            if (type === 'giver' && pin === correctGiverPin) {
                modal.style.display = 'none';
                pinInput.value = '';
                pinError.style.display = 'none';
                showSection('giver');
            } else if (type === 'taker' && pin === correctPin) {
                modal.style.display = 'none';
                pinInput.value = '';
                pinError.style.display = 'none';
                showSection('taker');
            } else {
                pinError.style.display = 'block';
                pinInput.value = '';
                pinInput.focus();
            }
        }

        function validateUserPin() {
            const pin = document.getElementById('user-pin-input').value;
            if (pin === correctUserPin) {
                document.getElementById('user-pin-modal').style.display = 'none';
                showSection('account');
                displayUserDetails();
            } else {
                document.getElementById('user-pin-error').style.display = 'block';
                document.getElementById('user-pin-input').value = '';
                document.getElementById('user-pin-input').focus();
            }
        }

        function showSection(type) {
            document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
            document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('active'));
            
            const section = document.getElementById(`${type}-section`);
            section.classList.add('active');
            document.querySelector(`.option-btn[onclick="showPinModal('${type}')"]`).classList.add('active');
            
            document.getElementById('welcome-text').classList.add('hidden');

            if (type === 'taker') {
                document.getElementById('search-section').style.display = 'block';
                document.getElementById('search-results').style.display = 'none';
                document.getElementById('user-details').style.display = 'none';
            } else if (type === 'account') {
                document.getElementById('search-section').style.display = 'none';
                document.getElementById('search-results').style.display = 'none';
            } else if (type === 'giver') {
                selectedAmount = 0;
                currentInterest = 0;
                days = 0;
                document.getElementById('days-input').value = '';
                updateAmountButtons();
                updateInterestDisplay();
            }
        }

        function displayUserDetails() {
            const userDetailsDiv = document.getElementById('user-details');
            userDetailsDiv.innerHTML = '<h2>User Details</h2>';
            userDetailsDiv.innerHTML += `
                <div class="user-entry">
                    <h5>Giver Info</h5>
                    <p><strong>Name:</strong> ${userDetails.name}</p>
                    <p><strong>Status:</strong> ${userDetails.status}</p>
                    <p><strong>Phone:</strong> ${userDetails.phone}
                        <button class="copy-btn" onclick="copyToClipboard('${userDetails.phone}', this)" aria-label="Copy phone number">Copy</button>
                    </p>
                    <p><strong>Amount:</strong> ₹${userDetails.amount.toFixed(2)}</p>
                    <p><strong>Interest:</strong> ₹${userDetails.interest.toFixed(2)}</p>
                    <hr>
                    <h5>Premium Info</h5>
                    <p><strong>Share Type:</strong> ${userDetails.lendlinkShare}</p>
                    <p><strong>Active For:</strong> ${userDetails.ActiveFor}</p>
                    <p><strong>Paid For:</strong> ${userDetails.SharePaidtill}</p>
                    <p><strong>Lend Count (₹650/month):</strong> ${lendCount.fixed}/1 this month</p>
                    <p><strong>Lend Count (50-50 share):</strong> ${lendCount.share}/3 this month</p>
                </div>
            `;
            userDetailsDiv.style.display = 'block';
        }

        function copyToClipboard(phone, button) {
            navigator.clipboard.writeText(phone).then(() => {
                button.textContent = 'Copied!';
                button.classList.add('copied');
                setTimeout(() => {
                    button.textContent = 'Copy';
                    button.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy phone number.');
            });
        }

        function searchGivers() {
            const searchAmount = parseFloat(document.getElementById('search-amount').value);
            const searchResults = document.getElementById('search-results');

            if (isNaN(searchAmount) || searchAmount < 0) {
                alert('Please enter a valid positive amount.');
                return;
            }

            const matchedGivers = givers.filter(giver => giver.amount === searchAmount);
            searchResults.innerHTML = '<h2>Giver who have money</h2>';
            if (matchedGivers.length === 0) {
                searchResults.innerHTML += `<p>No Givers found for ₹${searchAmount.toFixed(2)}.</p>`;
            } else {
                matchedGivers.forEach(giver => {
                    const status = giver.availability ? 'I will give amount right now' : 'I can`t give amount right now';
                    const statusClass = giver.availability ? 'availability' : 'not-available';
                    searchResults.innerHTML += `
                        <div class="giver-entry">
                            <p><strong>Name:</strong> ${giver.name}</p>
                            <p><strong>Phone:</strong> ${giver.phone}
                                <button class="copy-btn" onclick="copyToClipboard('${giver.phone}', this)" aria-label="Copy phone number">Copy</button>
                            </p>
                            <p><strong>Amount:</strong> ₹${giver.amount.toFixed(2)}</p>
                            <p><strong>Interest:</strong> ₹${giver.interest.toFixed(2)}</p>
                            <p><strong>Status:</strong> <span class="${statusClass}">${status}</span></p>
                        </div>
                    `;
                });
            }
            searchResults.style.display = 'block';
            document.getElementById('user-details').style.display = 'none';
        }

        function selectAmount(amount) {
            if (selectedPlan === 'fixed' && amount > MAX_FIXED_AMOUNT) {
                selectedPlan = 'share';
                document.querySelectorAll('.plan-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelector(`.plan-btn[onclick="selectPlan('share')"]`).classList.add('active');
                document.getElementById('plan-warning').textContent = 'Amounts above ₹15,000 use the 50-50 share plan.';
                updateUserDetails();
            } else {
                document.getElementById('plan-warning').textContent = '';
            }
            selectedAmount = amount;
            updateAmountButtons();
            updateInterestDisplay();
            document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector(`.amount-btn[onclick="selectAmount(${amount})"]`).classList.add('active');
        }

        function calculateInterest(amount, days, plan) {
            const rate = plan === 'fixed' ? FIXED_INTEREST_RATE : SHARE_INTEREST_RATE;
            // Simple interest: Interest = Principal * Rate * Time (in years)
            const timeInYears = days / 365;
            let interest = amount * rate * timeInYears;
            return plan === 'share' ? interest / 2 : interest; // 50-50 share splits interest
        }

        function updateInterestDisplay() {
            const interestDisplay = document.getElementById('interest-display');
            const lendlinkShare = document.getElementById('lendlink-share');
            const interestComparison = document.getElementById('interest-comparison');
            const fixedInterestSpan = document.getElementById('fixed-interest');
            const shareInterestSpan = document.getElementById('share-interest');
            const totalInterest = document.getElementById('total-interest');
            const yourProfit = document.getElementById('your-profit');
            const lendlinkShareAmount = document.getElementById('lendlink-share-amount');
            const daysInput = document.getElementById('days-input');
            days = parseInt(daysInput.value) || 0;

            if (selectedAmount === 0 || days === 0) {
                interestDisplay.textContent = 'Select an amount and days to see interest';
                lendlinkShare.style.display = 'none';
                interestComparison.style.display = 'none';
                document.getElementById('share-chart').style.display = 'none';
                document.getElementById('plan-warning').textContent = '';
                totalInterest.style.display = 'none';
                yourProfit.style.display = 'none';
                lendlinkShareAmount.style.display = 'none';
                return;
            }

            // Calculate standard interest for the selected plan
            currentInterest = calculateInterest(selectedAmount, days, selectedPlan);
            if (selectedPlan === 'share') {
                const totalInterestAmount = currentInterest * 2; // Total interest before split
                interestDisplay.textContent = '';
                totalInterest.style.display = 'block';
                yourProfit.style.display = 'block';
                lendlinkShareAmount.style.display = 'block';
                document.getElementById('total-interest-amount').textContent = totalInterestAmount.toFixed(2);
                document.getElementById('your-profit-amount').textContent = currentInterest.toFixed(2);
                document.getElementById('lendlink-share-value').textContent = currentInterest.toFixed(2);
            } else {
                interestDisplay.textContent = `Interest: ₹${currentInterest.toFixed(2)}`;
                totalInterest.style.display = 'none';
                yourProfit.style.display = 'none';
                lendlinkShareAmount.style.display = 'none';
            }

            // Update comparison interest values
            const fixedInterest = selectedAmount <= MAX_FIXED_AMOUNT ? calculateInterest(selectedAmount, days, 'fixed') : 0;
            const shareInterest = calculateInterest(selectedAmount, days, 'share');
            fixedInterestSpan.textContent = fixedInterest.toFixed(2);
            shareInterestSpan.textContent = shareInterest.toFixed(2);
            interestComparison.style.display = 'block';

            // Check if interest is above standard limit
            const standardRate = selectedPlan === 'fixed' ? FIXED_INTEREST_RATE : SHARE_INTEREST_RATE;
            const standardInterestForPlan = selectedAmount * standardRate * (days / 365);
            const isExtraInterest = currentInterest > (selectedPlan === 'share' ? standardInterestForPlan / 2 : standardInterestForPlan);

            if (isExtraInterest) {
                const extraInterest = currentInterest - (selectedPlan === 'share' ? standardInterestForPlan / 2 : standardInterestForPlan);
                const shareAmount = Math.floor(extraInterest / 100) * 20;
                lendlinkShare.style.display = 'block';
                lendlinkShare.childNodes[0].textContent = `LendLink Share: ₹${shareAmount.toFixed(2)} (₹20 for every ₹100 above standard interest)`;
                updateShareChart(extraInterest);
                document.getElementById('share-chart').style.display = 'block';
            } else {
                lendlinkShare.style.display = 'none';
                document.getElementById('share-chart').style.display = 'none';
            }
        }

        function updateShareChart(extraInterest) {
            const increments = [100, 200, 300, 400, 500];
            const shares = increments.map(inc => Math.floor(inc / 100) * 20);
            const chartData = {
                type: 'bar',
                data: {
                    labels: increments.map(inc => `₹${inc}`),
                    datasets: [{
                        label: 'LendLink Share (₹)',
                        data: shares,
                        backgroundColor: '#4FA8F5',
                        borderColor: '#3E8ED0',
                        borderWidth: 1
                    }, {
                        label: 'Current Share (₹)',
                        data: increments.map(inc => inc === Math.ceil(extraInterest / 100) * 100 ? Math.floor(extraInterest / 100) * 20 : 0),
                        backgroundColor: '#FF0000',
                        borderColor: '#CC0000',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'LendLink Share (₹)',
                                color: '#FFFFFF'
                            },
                            ticks: {
                                color: '#FFFFFF'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Extra Interest Amount (₹)',
                                color: '#FFFFFF'
                            },
                            ticks: {
                                color: '#FFFFFF'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: '#FFFFFF'
                            }
                        },
                        title: {
                            display: true,
                            text: 'LendLink Share Analysis (Above Standard Interest)',
                            color: '#FFFFFF'
                        }
                    }
                }
            };

            document.getElementById('share-chart').innerHTML = `<canvas id="shareChartCanvas"></canvas>`;
            new Chart(document.getElementById('shareChartCanvas'), chartData);
        }

        function lendMoney() {
            if (selectedAmount === 0 || days === 0) {
                alert('Please select an amount and enter the number of days.');
                return;
            }

            if (selectedPlan === 'fixed' && lendCount.fixed >= FIXED_LEND_LIMIT) {
                alert('You have reached the lending limit for the ₹650/month plan (1 time per month).');
                return;
            }

            if (selectedPlan === 'share' && lendCount.share >= SHARE_LEND_LIMIT) {
                alert('You have reached the lending limit for the 50-50 share plan (3 times per month).');
                return;
            }

            // Update lend count
            lendCount[selectedPlan]++;
            userDetails.amount = selectedAmount;
            userDetails.interest = currentInterest;

            // For demo purposes, redirect to form
            window.location.href = 'https://forms.gle/EBCovJmKfWdTVjRF6';
        }

        document.getElementById('pin-input').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                validatePin('taker');
            }
        });

        document.getElementById('giver-pin-input').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                validatePin('giver');
            }
        });

        document.getElementById('user-pin-input').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                validateUserPin();
            }
        });

        // Set default plan to fixed
        selectPlan('fixed');
