const libnetworkInterfaces = require('./build/Release/route_tools');
const usbDevice = 1;
const bluetoothDevice = 2;


function setIpRoute(device, caiNetwork , caiNetworkCIDR) {
    console.log(caiNetwork);
    const destinationAddres = caiNetwork + '/' + caiNetworkCIDR;
    let result = -1;
    return new Promise( (resolve, reject) => {
        const adapterInterfaces = libnetworkInterfaces.listAdapterInterfaces();
        filteredInterfaces = []
        adapterInterfaces.forEach(interface => {
            if(interface.ifName.includes(device)) {
                filteredInterfaces.push(interface);
            }
        });
        filteredInterfaces.forEach(interface => {
            result = libnetworkInterfaces.addRoute(destinationAddres, interface.gateway);
            resolve(result);
        });
    });
}

function deleteNetRoute(device, caiNetwork, caiNetworkCIDR) {
    let result = -1;
    return new Promise( (resolve, reject) => {
        setTimeout( () => {
            const interface = libnetworkInterfaces.listAdapterInterfaces().filter(interface => interface.ifName.includes(device)).pop();
            const caiNetworkAddress = Number(caiNetwork);
            const listNetWorks = [ caiNetworkAddress , caiNetworkAddress + usbDevice, caiNetworkAddress + bluetoothDevice ];
            if (interface) {
                listNetWorks.forEach(network => {
                    const fullNetworkAddress = `${network}.0.0.0/${caiNetworkCIDR}`;
                    result = libnetworkInterfaces.deleteRoute(fullNetworkAddress, interface.gateway);
                    console.log(result);
                });
                resolve(result);
            }
        }, 1000 );
    });
}

function deleteGroupRoute(device, caiGroupNetwork, caiNetworkCIDR)  {
    return new Promise((resolve) => {
        setTimeout(() => {
            const interface = libnetworkInterfaces.listAdapterInterfaces().filter(interface => interface.ifName.includes(device)).pop();
            if (interface) {
                const fullNetworkAddress = `${caiGroupNetwork}.0.0.0/${caiNetworkCIDR}`;
                const routeDeleted = libnetworkInterfaces.deleteRoute(fullNetworkAddress, interface.gateway);
                resolve(routeDeleted);
            }
            resolve(false);
        }, 1000);
    });
}

// setIpRoute('moto', '12.0.0.0', 8)
// deleteNetRoute('moto', 12, 8)

libnetworkInterfaces.setIpRoute = setIpRoute;
libnetworkInterfaces.deleteNetRoute = deleteNetRoute;
libnetworkInterfaces.deleteGroupRoute = deleteGroupRoute;

module.exports = libnetworkInterfaces;

