let currentOption = '';
        let givers = [
            { name: "Kiran Burri", phone: "9666785217", amount: 10000, interest: 2500, availability: true },
            { name: "Bhargav Akula", phone: "9747265868", amount: 10000, interest: 2000, availability: false },
            { name: "Siva yerramsetti", phone: "9394522389", amount: 20000, interest: 4000, availability: false },
            { name: "Kiran tummu", phone: "9394522389", amount: 5000, interest: 1200, availability: false },
            { name: "Gangadhar", phone: "9966934212", amount: 15000, interest: 2500, availability: false },
        ];
        let userDetails = {
            name: "John Doe",
            phone: "9876543210",
            amountTaken: 10000,
            interest: 2500,
            takenfor: 25
        };

        function showUserPinModal() {
            document.getElementById('user-pin-modal').style.display = 'flex';
            document.getElementById('user-pin-input').value = '';
            document.getElementById('user-pin-error').style.display = 'none';
            document.getElementById('user-pin-input').focus();
        }

        function validateUserPin() {
            const pin = document.getElementById('user-pin-input').value;
            if (pin === correctUserPin) {
                document.getElementById('user-pin-modal').style.display = 'none';
                displayUserDetails();
            } else {
                document.getElementById('user-pin-error').style.display = 'block';
                document.getElementById('user-pin-input').value = '';
            }
        }

        function displayUserDetails() {
            const userDetailsDiv = document.getElementById('user-details');
            userDetailsDiv.innerHTML = '<h2>User Details</h2>';
            userDetailsDiv.innerHTML += `
                <div class="user-entry">
                    <p><strong>Name:</strong> ${userDetails.name}</p>
                    <p><strong>Phone:</strong> ${userDetails.phone}
                        <button class="copy-btn" onclick="copyToClipboard('${userDetails.phone}', this)" aria-label="Copy phone number">Copy</button>
                    </p>
                    <p><strong>Amount Taken:</strong> ₹${userDetails.amountTaken.toFixed(2)}</p>
                    <p><strong>Interest:</strong> ₹${userDetails.interest.toFixed(2)}</p>
                    <p><strong>Taken For:</strong> ${userDetails.takenfor} days</p>
                </div>
            `;
            userDetailsDiv.style.display = 'block';
            document.getElementById('search-section').style.display = 'none';
            document.getElementById('search-results').style.display = 'none';
        }
        const correctPin = '0212';
        const correctUserPin = '1202';
        function selectOption(option) {
            currentOption = option;
            document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector(`button[onclick="selectOption('${option}')"]`).classList.add('active');

            if (option === 'giver') {
                window.location.href = 'https://forms.gle/EBCovJmKfWdTVjRF6';
            } else {
                document.getElementById('pin-modal').style.display = 'flex';
                document.getElementById('pin-input').value = '';
                document.getElementById('pin-error').style.display = 'none';
                document.getElementById('pin-input').focus();
            }
        }

        function validatePin() {
            const pin = document.getElementById('pin-input').value;
            if (pin === correctPin) {
                document.getElementById('pin-modal').style.display = 'none';
                document.getElementById('search-section').style.display = 'block';
                document.getElementById('search-results').style.display = 'none';
                document.getElementById('user-details').style.display = 'none';
            } else {
                document.getElementById('pin-error').style.display = 'block';
                document.getElementById('pin-input').value = '';
            }
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
            searchResults.innerHTML = '<h2>Giver who have money</h2> ';
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

        // Handle Enter key for PIN submission
        document.getElementById('pin-input').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                validatePin();
            }
        });

        document.getElementById('user-pin-input').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                validateUserPin();
            }
        });

        document.addEventListener("DOMContentLoaded", () => {
            const customMenu = document.querySelector(".custom-menu");

            document.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                if (customMenu) {
                    customMenu.style.display = "block";
                    customMenu.style.top = `${event.pageY}px`;
                    customMenu.style.left = `${event.pageX}px`;
                }
            });

            document.addEventListener("click", () => {
                if (customMenu) {
                    customMenu.style.display = "none";
                }
            });
        });
