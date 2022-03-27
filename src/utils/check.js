import {
    Toast
} from 'vant';
var dayjs = require('dayjs');
dayjs.locale('zh-cn');
import i18n from "../lang/index";
export function phone(number) {
    var reg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;
    if (number == '' || !reg.test(number)) {
        Toast(i18n.global.t('phoneerror'));
        return false;
    } else {
        return true;
    }
}

export function timeago(dateTimeStamp) {
    // dateTimeStamp 时间戳
    var minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
    var hour = minute * 60;
    var day = hour * 24;
    var week = day * 7;
    // var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime(); //获取当前时间毫秒
    var diffValue = now - dateTimeStamp; //时间差

    if (diffValue < 0) {
        return;
    }
    var minC = diffValue / minute; //计算时间差的分，时，天，周，月
    var hourC = diffValue / hour;
    var dayC = diffValue / day;
    var weekC = diffValue / week;
    var monthC = diffValue / month;
    var result = "";
    if (monthC >= 1 && monthC <= 3) {
        result = parseInt(monthC) + "月前"
    } else if (weekC >= 1 && weekC <= 3) {
        result = parseInt(weekC) + "周前"
    } else if (dayC >= 1 && dayC <= 6) {
        result = parseInt(dayC) + "天前"
    } else if (hourC >= 1 && hourC <= 23) {
        result = parseInt(hourC) + "小时前"
    } else if (minC >= 1 && minC <= 59) {
        result = parseInt(minC) + "分钟前"
    } else if (diffValue >= 0 && diffValue <= minute) {
        result = "刚刚"
    } else {
        var datetime = new Date();
        datetime.setTime(dateTimeStamp);
        console.log(datetime)
        var Nyear = datetime.getFullYear();
        var Nmonth = addZeroPrefix(datetime.getMonth() + 1);
        var Ndate = addZeroPrefix(datetime.getDate());
        // var Nhour = addZeroPrefix(datetime.getHours());
        // var Nminute = addZeroPrefix(datetime.getMinutes());
        // var Nsecond = addZeroPrefix(datetime.getSeconds());
        result = Nyear + "-" + Nmonth + "-" + Ndate
    }
    return result;
}

export function humandate(time1, time2) {
    time1 = time1 / 1000;
    time2 = time2 / 1000;
    var s = time1 - time2;
    if (s < 0) {
        s = Math.abs(s);
    }
    if (s > 2592000) {
        return (s / 2592000).toFixed(2) + '月';
    } else if (s > 86400) {
        return (s / 86400).toFixed(2) + '天';
    } else if (s > 3600) {
        return (s / 3600).toFixed(2) + '小时';
    } else if (s > 60) {
        return (s / 60).toFixed(2) + '分钟';
    } else {
        return (s) + '秒';
    }
}
//时间戳转换方法    date:时间戳数字
export function formatDate(date) {
    var dates = new Date(date);
    var YY = dates.getFullYear() + '-';
    var MM = addZeroPrefix(dates.getMonth() + 1) + '-';
    var DD = addZeroPrefix(dates.getDate());
    var hh = addZeroPrefix(dates.getHours()) + ':';
    var mm = addZeroPrefix(dates.getMinutes()) + ':';
    var ss = addZeroPrefix(dates.getSeconds());
    return YY + MM + DD + " " + hh + mm + ss;
}

export function getDay(day) {
    // 获取未来day天的每一天
    var betweentDay = [];
    for (let i = 1; i <= day; i++) {
        let dd = new Date();
        dd.setDate(dd.getDate() + i);
        let y = dd.getFullYear();
        let m = addZeroPrefix(dd.getMonth() + 1);
        let d = addZeroPrefix(dd.getDate());
        betweentDay.push({
            value: y + '-' + m + '-' + d,
            label: y + '-' + m + '-' + d
        })
    }
    return betweentDay;
}
// 格式化时间
export function formatTime(date_time) {
    // 标准时间转毫秒时间戳
    let time = date_time ? date_time.replace(/-/g, '/') : '',
        date = '';
    if (!time) {
        return;
    }
    date = new Date(time).getTime(); //获取毫秒时间戳
    if (isToday(date)) {
        return dayjs(date).format('A HH:mm').replace('PM', '').replace('AM', '')
    }
    return getDates(date)
}

function isToday(date) {
    return new Date(date).toDateString() === new Date().toDateString()
}

function getDates(date, splitor = '-') {
    let time = new Date(date);
    const year = time.getFullYear()
    const month = time.getMonth() + 1
    const day = time.getDate()
    return `${year}${splitor}${addZeroPrefix(month)}${splitor}${addZeroPrefix(day)}`
}
/**
 * 个位数，加0前缀
 * @param {*} number
 * @returns
 */
function addZeroPrefix(number) {
    return number < 10 ? `0${number}` : number
}