async function fetchLocationDetails(pincode) {
    if (pincode.length !== 6) return;

    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();

        if (data[0].Status === "Success") {
            const details = data[0].PostOffice[0];
            document.getElementById('city').value = details.District;
            document.getElementById('state').value = details.State;
            document.getElementById('country').value = "India";
        } else {
            console.error("Invalid Pincode");
        }
    } catch (error) {
        console.error("Error fetching location details:", error);
    }
}

document.getElementById('pincode').addEventListener('input', function (e) {
    fetchLocationDetails(e.target.value);
});
