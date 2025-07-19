let currentOption = '';
        let givers = [
            { name: "Bhargav Akula", phone: "MFI member only", amount: 10000, interest: 2000, availability: false },
            { name: "Bharat", phone: "Private", amount: 10000, interest: 2000, availability: false },
            { name: "venkata siva", phone: "MFI member only", amount: 10000, interest: 2000, availability: false },
            { name: "Siva yerramsetti", phone: "9394522389", amount: 20000, interest: 4000, availability: false },
            { name: "Kiran tummu", phone: "MFI member only", amount: 5000, interest: 1200, availability: false },
            { name: "Gangadhar", phone: "Private", amount: 15000, interest: 2500, availability: false },
        ];
        // account 
        let userDetails = {
            name: "Jainu kalyan",
            phone: "Private",
            status: "Giver",
            amount: 15000,
            interest: 2500,
            lendlinkShare: 500,
            lendedTill: "2025-08-15"
        };

        const correctPin = '0112'; 
        const correctGiverPin = 'TAK#12'; 
        const correctUserPin = '0101';

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
            
            // Hide welcome text when any section is active
            document.getElementById('welcome-text').classList.add('hidden');

            if (type === 'taker') {
                document.getElementById('search-section').style.display = 'block';
                document.getElementById('search-results').style.display = 'none';
                document.getElementById('user-details').style.display = 'none';
            } else if (type === 'account') {
                document.getElementById('search-section').style.display = 'none';
                document.getElementById('search-results').style.display = 'none';
            }
        }

        function displayUserDetails() {
            const userDetailsDiv = document.getElementById('user-details');
            userDetailsDiv.innerHTML = '<h2>User Details</h2>';
            userDetailsDiv.innerHTML += `
                <div class="user-entry">
                    <p><strong>Name:</strong> ${userDetails.name}</p>
                    <p><strong>Status:</strong> ${userDetails.status}</p>
                    <p><strong>Phone:</strong> ${userDetails.phone}
                        <button class="copy-btn" onclick="copyToClipboard('${userDetails.phone}', this)" aria-label="Copy phone number">Copy</button>
                    </p>
                    <p><strong>Amount:</strong> ₹${userDetails.amount.toFixed(2)}</p>
                    <p><strong>Interest:</strong> ₹${userDetails.interest.toFixed(2)}</p>
                    <p><strong>LendLink Share:</strong> ₹${userDetails.lendlinkShare.toFixed(2)}</p>
                    <p><strong>Lended Till:</strong> ${userDetails.lendedTill}</p>
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
