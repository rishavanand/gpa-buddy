if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => {
            reg.addEventListener('updatefound', () => {
                const installingWorker = reg.installing;
                installingWorker.onstatechange = () => {
                    switch (installingWorker.state) {
                        case 'installed':
                            if (navigator.serviceWorker.controller) {
                                showUpdate();
                            }
                            break;
                    }
                };
            });
        })
}

var openNav = () => {
    document.getElementById("mySidenav").style.width = "100%";
}

var closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
}

var gotoPage = (page) => {
    window.location = page;
}

var showUpdate = () => {
    // Alert user
    alert('GPA Buddy has been updated. Kindly restart/refresh app to experience the newer version.')
    // Get the snackbar DIV
    var x = document.getElementById("update-message");
    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
}