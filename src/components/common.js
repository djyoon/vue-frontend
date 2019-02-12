/**
 * Created by jampick01 on 2019-01-14.
 */

//todo null check
const isEmpty = function(value) {
    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
        return true
    } else {
        return false
    }
}

const isNumeric = function (obj) {
    return !isNaN(parseFloat(obj)) && isFinite(obj) && Object.prototype.toString.call(obj).toLowerCase() !== "[object array]";
}

const marketDeptMenu = [
    {key:'*', name: 'ALL'},
    {key:'ETH_BTC', name: 'ETH_BTC'},
    {key:'ESR_BTC', name: 'ESR_BTC'},
    {key:'XMR_BTC', name: 'XMR_BTC'},
    {key:'XRP_BTC', name: 'XRP_BTC'},
    {key:'ESR_ETH', name: 'ESR_ETH'},
    {key:'XMR_ETH', name: 'XMR_ETH'}
]

const typeDeptMenu = [
    {key:'*', name: 'ALL'},
    {key:'buy', name: 'BUY'},
    {key:'sell', name: 'SELL'}
]

export default {
    isEmpty,
    marketDeptMenu,
    typeDeptMenu,
    isNumeric
}
