function generateRandomString() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Function to generate the QR code
function generateQRCode() {
    const randomString = generateRandomString();
    const qrCodeContainer = document.getElementById('qrcode');
    qrCodeContainer.innerHTML = ''; // Clear any existing QR code

    QRCode.toCanvas(qrCodeContainer, randomString, function (error) {
        if (error) console.error(error);
        console.log('QR code generated with string:', randomString);
    });

    // Save the string to localStorage to preserve it across page reloads
    localStorage.setItem('currentQRCodeString', randomString);
    localStorage.setItem('lastGeneratedTime', new Date().getTime());
}

// Check if 24 hours have passed since the last QR code generation
function checkAndUpdateQRCode() {
    const lastGeneratedTime = localStorage.getItem('lastGeneratedTime');
    const currentTime = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    if (!lastGeneratedTime || currentTime - lastGeneratedTime >= oneDay) {
        generateQRCode();
    } else {
        const savedString = localStorage.getItem('currentQRCodeString');
        const qrCodeContainer = document.getElementById('qrcode');
        QRCode.toCanvas(qrCodeContainer, savedString, function (error) {
            if (error) console.error(error);
            console.log('QR code generated with saved string:', savedString);
        });
    }
}