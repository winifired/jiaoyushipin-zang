import {
    post
} from "../utils/request";
import {
    Apis
} from "../utils/apis";
import store from "../store";
import {
    Toast
} from 'vant';
export function getConfig(data = {}) {
    console.log(data);
    return new Promise((resolve, reject) => {
        wx.ready(function() {
            wx.checkJsApi({
                jsApiList: ['chooseWXPay'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                success: function() {
                    wx.chooseWXPay({
                        appId: data.appId,
                        timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                        package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                        signType: data.signType, // 微信支付V3的传入RSA,微信支付V2的传入格式与V2统一下单的签名格式保持一致
                        paySign: data.paySign, // 支付签名
                        success: function(res) {
                            // 支付成功后的回调函数
                            console.log(res)
                            resolve('true')
                        },
                        fail(err) {
                            console.log(err)
                            reject('false')
                        }
                    });
                },
                fail(err) {
                    console.log(err);
                    Toast.fail('མིག་སྔར་འཛད་སྤྱོད་པའི་པར་གཞི་ཡིས་སྐད་འཕྲིན་རིན་སྤྲོད་ལ་རྒྱབ་སྐྱོར་མི་བྱེད།')
                }
            });
        });
    })
}

function share(img, name) {
    console.log(img, name)
    wx.ready(function() {
        wx.checkJsApi({
            jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'],
            success: function(res) {
                // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
                wx.updateAppMessageShareData({
                    title: name, // 分享标题
                    desc: 'བྱིས་སྒྲུང་། རྣམ་ཐར། ཁེད། གབ་ཚིག རྒྱུན་ཤེས་སོགས་འགུལ་རིས་ཀྱི་རྣམ་པར་བཟོས་ཡོད་ཅིང་། མཉེན་ཆས་སྐོར་གྱི་སློབ་ཁྲིད་ཀྱང་ཡོད།', // 分享描述
                    link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: img, // 分享图标
                    success: function() {
                        // console.log('分享成功')
                    },
                    fail(err) {
                        console.log(err);
                    }
                });
                // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
                wx.updateTimelineShareData({
                    title: name, // 分享标题
                    link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: img, // 分享图标
                    success: function() {
                        // 设置成功
                    }
                });
            },
            fail(err) {
                console.log(err);
                Toast.fail('མིག་སྔར་འཛད་སྤྱོད་པའི་པར་གཞི་ཡིས་སྐད་འཕྲིན་རིན་སྤྲོད་ལ་རྒྱབ་སྐྱོར་མི་བྱེད།')
            }
        });
    });
}
export function getwxConfig(coverImg = 'http://jiaoyushipin.winderinfo.com/jysp/profile/upload/2021/11/18/9f48cc3c-dddb-4215-a7eb-532213961105.jpg', title = 'ཏི་སེའི་དྲ་མིག་སློབ་གསོ།') {
    post(Apis.getWxConfigInfo, {
        currentPageUrl: window.location.href,
    }).then(res => {
        if (res.code == 0) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: res.data.appId, // 必填，公众号的唯一标识
                timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                nonceStr: res.data.noncestr, // 必填，生成签名的随机串
                signature: res.data.signature, // 必填，签名
                jsApiList: ['chooseWXPay', 'updateTimelineShareData', 'updateAppMessageShareData']
            });
            share(coverImg, title);
        }
    })
}
export function getCode() {
    let uri = window.location.href;
    if (uri.indexOf("code") != -1) {
        let str = uri.split("=")[1].split("&")[0];
        console.log(str);
        let user = localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')) : null;
        if (!user) return;
        post(Apis.bindWeChat, {
            userId: user.userid,
            code: str
        }).then(res => {
            if (res.code == 0) {
                Toast('སྐད་འཕྲིན་སྦྲེལ་གནས་་ལེགས་འགྲུབ་བྱུང་བ།');
                post(Apis.selectJyspUserById, {
                    userId: user.userid,
                }).then(res => {
                    if (res.code == 0) {
                        store.state.userinfo = res.data;
                        store.commit('setUserinfo', res.data);
                    }
                });
            }
        })
    }
}
export function bindwx() {
    let uri = window.location.href;
    console.log(uri);
    if (uri.indexOf("code") == -1) {
        let uri = encodeURIComponent(window.location.href);
        window.location.href =
            "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx20d06ef62b9792ad&redirect_uri=" +
            uri +
            "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
    }
}