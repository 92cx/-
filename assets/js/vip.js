// ==UserScript==
// @name              全网VIP视频【免登录去除广告】
// @namespace         http://tampermonkey.net/
// @version           1.0.7
// @description       全网VIP视频解析【免登录去除广告】，支持：爱优腾芒、B站等其它网站；
// @description       更新日期：2023.8.10 21：50
// @description       代码仅供交流学习，下载后请在24小时内删除，不得用于违规违法用途。
// @icon              https://ichen.ink/-/assets/img/logo/VIP.ico
// @include           *://*.iqiyi.com/v_*
// @include           *://*.iqiyi.com/w_*
// @include           *://*.iqiyi.com/a_*
// @include           *://m.iqiyi.com/*
// @include           *://m.iqiyi.com/kszt/*
// @include           *://*.youku.com/v_*
// @include           *://m.youku.com/alipay_video/*
// @include           *://v.qq.com/x/cover/*
// @include           *://v.qq.com/x/page/*
// @include           *://v.qq.com/tv/*
// @include           *://m.v.qq.com/x/cover/*
// @include           *://m.v.qq.com/x/page/*
// @include           *://m.v.qq.com/*
// @include           *://*.mgtv.com/b/*
// @include           *://m.mgtv.com/b/*
// @include           *://*.bilibili.com/video/*
// @include           *://*.bilibili.com/bangumi/play/*
// @include           *://m.bilibili.com/video/*
// @include           *://m.bilibili.com/anime/*
// @include           *://m.bilibili.com/bangumi/play/*
// @match             *://v.qq.com/x/page/*
// @match             *://v.qq.com/x/cover/*
// @match             *://v.youku.com/v*
// @match             *://v.youku.com/v*
// @require           https://cdn.bootcdn.net/ajax/libs/jquery/3.2.1/jquery.min.js
// @connect           api.bilibili.com
// @grant             unsafeWindow
// @grant             GM_addStyle
// @grant             GM_openInTab
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @grant             GM_log
// @charset		      UTF-8
// @license           GPL License
// ==/UserScript==

const util = (function() {

	function findTargetElement(targetContainer) {
		const body = window.document;
		let tabContainer;
		let tryTime = 0;
		const maxTryTime = 120;
		let startTimestamp;
		return new Promise((resolve, reject) => {
			function tryFindElement(timestamp) {
				if (!startTimestamp) {
					startTimestamp = timestamp;
				}
				const elapsedTime = timestamp - startTimestamp;

				if (elapsedTime >= 500) {
					GM_log("查找元素：" + targetContainer + "，第" + tryTime + "次");
					tabContainer = body.querySelector(targetContainer);
					if (tabContainer) {
						resolve(tabContainer);
					} else if (++tryTime === maxTryTime) {
						reject();
					} else {
						startTimestamp = timestamp;
					}
				}
				if (!tabContainer && tryTime < maxTryTime) {
					requestAnimationFrame(tryFindElement);
				}
			}

			requestAnimationFrame(tryFindElement);
		});
	}

	function urlChangeReload() {
		const oldHref = window.location.href;
		let interval = setInterval(() => {
			let newHref = window.location.href;
			if (oldHref !== newHref) {
				clearInterval(interval);
				window.location.reload();
			}
		}, 500);
	}

	function reomveVideo() {
		setInterval(() => {
			for (let video of document.getElementsByTagName("video")) {
				if (video.src) {
					video.removeAttribute("src");
					video.muted = true;
					video.load();
					video.pause();
				}
			}
		}, 500);
	}

	function syncRequest(option) {
		return new Promise((resolve, reject) => {
			option.onload = (res) => {
				resolve(res);
			};
			option.onerror = (err) => {
				reject(err);
			};
			GM_xmlhttpRequest(option);
		});
	}

	return {
		req: (option) => syncRequest(option),
		findTargetEle: (targetEle) => findTargetElement(targetEle),
		urlChangeReload: () => urlChangeReload(),
		reomveVideo: () => reomveVideo()
	}
})();


const superVip = (function() {

	const _CONFIG_ = {
		isMobile: navigator.userAgent.match(
			/(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)/i),
		currentPlayerNode: null,
		vipBoxId: 'vip_jx_box' + Math.ceil(Math.random() * 100000000),
		flag: "flag_vip",
		autoPlayerKey: "auto_player_key" + window.location.host,
		autoPlayerVal: "auto_player_value_" + window.location.host,
		videoParseList: [{
				"name": "综合",
				"type": "1,3",
				"url": "https://jx.jsonplayer.com/player/?url="
			},
			{
				"name": "Ckplayer",
				"type": "1,3",
				"url": "https://www.ckplayer.vip/jiexi/?url="
			},
			{
				"name": "解析la",
				"type": "1,3",
				"url": "https://api.jiexi.la/?url="
			},
            {
				"name": "蛋蛋解析",
				"type": "1,3",
				"url": "https://ddjx.cc/?url="
			},
            {
				"name": "夜幕",
				"type": "1,3",
				"url": "https://www.yemu.xyz/?url="
			},
            {
				"name": "ivito",
				"type": "1,3",
				"url": "https://jx.ivito.cn/?url="
			},
            {
				"name": "777解析",
				"type": "1,3",
				"url": "https://jx.777jiexi.com/player/?url="
			},
            {
				"name": "8090g",
				"type": "1,3",
				"url": "https://www.8090g.cn/?url="
			},
            {
				"name": "playm3u8",
				"type": "1,3",
				"url": "https://www.playm3u8.cn/jiexi.php?url="
			},
            {
				"name": "云析",
				"type": "1,3",
				"url": "https://jx.yparse.com/index.php?url="
			},
            {
				"name": "bl解析",
				"type": "1,3",
				"url": "https://vip.bljiex.com/?v="
			},
            {
				"name": "8090接口②",
				"type": "1,3",
				"url": "https://www.8090.la/8090/?url="
			},
            {
				"name": "eptept",
				"type": "1,3",
				"url": "https://dmjx.m3u8.tv/?url="
			},
		],
		playerContainers: [
			{
				host: "www.iqiyi.com",
				container: "#flashbox",
				name: "Default",
				displayNodes: ["#playerPopup", "div[class^=qy-header-login-pop]"]
			},
			{
				host: "m.iqiyi.com",
				container: ".m-video-player-wrap",
				name: "Default",
				displayNodes: ["div.m-iqyGuide-layer", "a[down-app-android-url]", "[name=m-extendBar]",
					"[class*=ChannelHomeBanner]", "section.m-hotWords-bottom"
				]
			},
			{
				host: "www.iq.com",
				container: ".intl-video-wrap",
				name: "Default",
				displayNodes: []
			},
			{
				host: "v.youku.com",
				container: "#player",
				name: "Default",
				displayNodes: ["#iframaWrapper"]
			},
			{
				host: "m.youku.com",
				container: "#player,.h5-detail-player",
				name: "Default",
				displayNodes: []
			},{
				host: "v.qq.com",
				container: "#mod_player,#player-container,.container-player",
				name: "Default",
				displayNodes: ["#mask_layer", ".mod_vip_popup", "#mask_layer", ".panel-tip-pay"]
			},
			{
				host: "m.v.qq.com",
				container: ".mod_player,#player",
				name: "Default",
				displayNodes: [".mod_vip_popup",
					"[class^=app_],[class^=app-],[class*=_app_],[class*=-app-],[class$=_app],[class$=-app]",
					"div[dt-eid=open_app_bottom]", "div.video_function.video_function_new",
					"a[open-app]", "section.mod_source",
					"section.mod_box.mod_sideslip_h.mod_multi_figures_h,section.mod_sideslip_privileges,section.mod_game_rec",
					".at-app-banner"
				]
			},
            {host: "w.mgtv.com", container: "#mgtv-player-wrap", name: "Default", displayNodes: []},
            {host: "www.mgtv.com", container: "#mgtv-player-wrap", name: "Default", displayNodes: []},
            {
                host: "m.mgtv.com",
                container: ".video-area",
                name: "Default",
                displayNodes: ["div[class^=mg-app]",".video-area-bar"]
            },
			{
				host: "www.bilibili.com",
				container: "#player_module,#bilibiliPlayer,#bilibili-player",
				name: "Default",
				displayNodes: []
			},
			{
				host: "m.bilibili.com",
				container: ".player-wrapper,.player-container,.mplayer",
				name: "Default",
				displayNodes: []
			},

		]
	};
	class BaseConsumer {
		constructor() {
			this.parse = () => {
				util.findTargetEle('body')
					.then((container) => this.preHandle(container))
					.then((container) => this.generateElement(container))
					.then((container) => this.bindEvent(container))
					.then((container) => this.autoPlay(container))
					.then((container) => this.postHandle(container));
			}
		}

		preHandle(container) {
			_CONFIG_.currentPlayerNode.displayNodes.forEach((item, index) => {
				util.findTargetEle(item)
					.then((obj) => obj.style.display = 'none')
					.catch(e => console.warn("不存在元素", e));
			});
			return new Promise((resolve, reject) => resolve(container));
		}

		generateElement(container) {
			GM_addStyle(`
                        #${_CONFIG_.vipBoxId} {cursor:pointer; position:fixed; top:120px; left:0px; z-index:9999999; text-align:left;}
                        #${_CONFIG_.vipBoxId} .img_box{width:32px; height:32px;line-height:32px;text-align:center;background-color:#ff7f50;margin:10px 0px;}
                        #${_CONFIG_.vipBoxId} .vip_list {display:none; position:absolute; border-radius:5px; left:32px; top:0; text-align:center; background-color: #3f4149; border:1px solid white;padding:10px 0px; width:380px; max-height:400px; overflow-y:auto;}
                        #${_CONFIG_.vipBoxId} .vip_list li{border-radius:2px; font-size:12px; color:#DCDCDC; text-align:center; width:calc(25% - 14px); line-height:21px; float:left; border:1px solid gray; padding:0 4px; margin:4px 2px;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;}
                        #${_CONFIG_.vipBoxId} .vip_list li:hover{color:#1c84c6; border:1px solid #1c84c6;}
                        #${_CONFIG_.vipBoxId} .vip_list ul{padding-left: 10px;}
                        #${_CONFIG_.vipBoxId} .vip_list::-webkit-scrollbar{width:5px; height:1px;}
                        #${_CONFIG_.vipBoxId} .vip_list::-webkit-scrollbar-thumb{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#A8A8A8;}
                        #${_CONFIG_.vipBoxId} .vip_list::-webkit-scrollbar-track{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#ff7f50;}
                        #${_CONFIG_.vipBoxId} li.selected{color:#ff7f50; border:1px solid #ff7f50;}
						`);

			if (_CONFIG_.isMobile) {
				GM_addStyle(`
                    #${_CONFIG_.vipBoxId} {top:300px;}
                    #${_CONFIG_.vipBoxId} .vip_list {width:300px;}
                    `);
			}

			let type_1_str = "";
			let type_2_str = "";
			let type_3_str = "";
			_CONFIG_.videoParseList.forEach((item, index) => {
				if (item.type.includes("1")) {
					type_1_str +=
						`<li class="nq-li" title="${item.name}1" data-index="${index}">${item.name}</li>`;
				}
				if (item.type.includes("2")) {
					type_2_str +=
						`<li class="tc-li" title="${item.name}" data-index="${index}">${item.name}</li>`;
				}
				if (item.type.includes("3")) {
					type_3_str +=
						`<li class="tc-li" title="${item.name}" data-index="${index}">${item.name}</li>`;
				}
			});

			let autoPlay = !!GM_getValue(_CONFIG_.autoPlayerKey, null) ? "开" : "关";

			$(container).append(`
                <div id="${_CONFIG_.vipBoxId}">
                    <div class="vip_icon">
                        <div class="img_box" title="选择解析源" style="color:red;font-size:16px;font-weight:bold;border-radius:5px;"><span style="color: red;">V</span><span style="color: red;">I</span><span style="color: red;">P</span></div>
                        <div class="vip_list">
                            <div>
                                <h3 style="color:#ff7f50; font-weight: bold; font-size: 16px; padding:5px 0px;">[内嵌播放]</h3>
                                <ul>
                                    ${type_1_str}
                                    <div style="clear:both;"></div>
                                </ul>
                            </div>

						<div>
						    <h3 style="color:#ff7f50; font-weight: bold; font-size: 16px; padding:5px 0px;">[弹窗播放]</h3>
						    <ul>
						        ${type_3_str}
						        <div style="clear:both;"></div>
						    </ul>
						</div>
						<div style="text-align:left;color:#FFF;font-size:10px;padding:0px 10px;margin-top:10px;">
						<br>&nbsp;&nbsp;1、自动解析功能默认关闭（自动解析只支持内嵌播放源）
						<br>&nbsp;&nbsp;2、开启自动解析，网页打开后脚本将根据当前选中的解析源自动解析视频。如解析失败，请手动选择不同的解析源尝试
						<br>&nbsp;&nbsp;3、没有选中解析源将随机选取一个
						<br>&nbsp;&nbsp;4、如某些网站有会员可以关闭自动解析功能
                        <br>&nbsp;&nbsp;5、返回首页<a href="https://ichen.ink/" style="color: red; font-size: 16px;">Paper Airplane</a>
						</div>
                        </div>
                    </div>
                    <div class="img_box" id="vip_auto" style="color:white;font-size:16px;font-weight:bold;border-radius:5px;" title="是否打开自动解析。若自动解析失败，请手动选择其它接口尝试！！">${autoPlay}</div>
                </div>`);
			return new Promise((resolve, reject) => resolve(container));
		}

		bindEvent(container) {
			const vipBox = $(`#${_CONFIG_.vipBoxId}`);
			if (_CONFIG_.isMobile) {
				vipBox.find(".vip_icon").on("click", () => vipBox.find(".vip_list").toggle());
			} else {
				vipBox.find(".vip_icon").on("mouseover", () => vipBox.find(".vip_list").show());
				vipBox.find(".vip_icon").on("mouseout", () => vipBox.find(".vip_list").hide());
			}

			let _this = this;
			vipBox.find(".vip_list .nq-li").each((liIndex, item) => {
				item.addEventListener("click", () => {
					const index = parseInt($(item).attr("data-index"));
					GM_setValue(_CONFIG_.autoPlayerVal, index);
					GM_setValue(_CONFIG_.flag, "true");
					_this.showPlayerWindow(_CONFIG_.videoParseList[index]);
					vipBox.find(".vip_list li").removeClass("selected");
					$(item).addClass("selected");
				});
			});
			vipBox.find(".vip_list .tc-li").each((liIndex, item) => {
				item.addEventListener("click", () => {
					const index = parseInt($(item).attr("data-index"));
					const videoObj = _CONFIG_.videoParseList[index];
					let url = videoObj.url + window.location.href;
					GM_openInTab(url, {
						active: true,
						insert: true,
						setParent: true
					});
				});
			});

			//右键移动位置
			vipBox.mousedown(function(e) {
				if (e.which !== 3) {
					return;
				}
				e.preventDefault()
				vipBox.css("cursor", "move");
				const positionDiv = $(this).offset();
				let distenceX = e.pageX - positionDiv.left;
				let distenceY = e.pageY - positionDiv.top;

				$(document).mousemove(function(e) {
					let x = e.pageX - distenceX;
					let y = e.pageY - distenceY;
					const windowWidth = $(window).width();
					const windowHeight = $(window).height();

					if (x < 0) {
						x = 0;
					} else if (x > windowWidth - vipBox.outerWidth(true) - 100) {
						x = windowWidth - vipBox.outerWidth(true) - 100;
					}

					if (y < 0) {
						y = 0;
					} else if (y > windowHeight - vipBox.outerHeight(true)) {
						y = windowHeight - vipBox.outerHeight(true);
					}
					vipBox.css("left", x);
					vipBox.css("top", y);
				});
				$(document).mouseup(function() {
					$(document).off('mousemove');
					vipBox.css("cursor", "pointer");
				});
				$(document).contextmenu(function(e) {
					e.preventDefault();
				})
			});
			return new Promise((resolve, reject) => resolve(container));
		}

		autoPlay(container) {
			const vipBox = $(`#${_CONFIG_.vipBoxId}`);
			vipBox.find("#vip_auto").on("click", function() {
				if (!!GM_getValue(_CONFIG_.autoPlayerKey, null)) {
					GM_setValue(_CONFIG_.autoPlayerKey, null);
					$(this).html("关");
					$(this).attr("title", "是否打开自动解析。若自动解析失败，请手动选择其它接口尝试！！");
				} else {
					GM_setValue(_CONFIG_.autoPlayerKey, "true");
					$(this).html("开");
				}
				setTimeout(function() {
					window.location.reload();
				}, 200);
			});

			if (!!GM_getValue(_CONFIG_.autoPlayerKey, null)) {
				this.selectPlayer(container);
			}
			return new Promise((resolve, reject) => resolve(container));
		}

		selectPlayer(container) {
			let index = GM_getValue(_CONFIG_.autoPlayerVal, 2);
			let autoObj = _CONFIG_.videoParseList[index];
			let _th = this;
			if (autoObj.type.includes("1")) {
				setTimeout(function() {
					_th.showPlayerWindow(autoObj);
					const vipBox = $(`#${_CONFIG_.vipBoxId}`);
					vipBox.find(`.vip_list [title="${autoObj.name}1"]`).addClass("selected");
					$(container).find("#vip_auto").attr("title", `自动解析源：${autoObj.name}`);
				}, 2500);
			}
		}

		showPlayerWindow(videoObj) {
			util.findTargetEle(_CONFIG_.currentPlayerNode.container)
				.then((container) => {
					const type = videoObj.type;
					let url = videoObj.url + window.location.href;
					if (type.includes("1")) {
						util.reomveVideo();
						$(container).empty();
						$(container).empty();
						let iframeDivCss = "width:100%;height:100%;z-index:999999;";
						if (_CONFIG_.isMobile) {
							iframeDivCss = "width:100%;height:220px;z-index:999999;";
						}
						if (_CONFIG_.isMobile && window.location.href.indexOf("iqiyi.com") !== -1) {
							iframeDivCss = "width:100%;height:220px;z-index:999999;margin-top:-56.25%;";
						}
						$(container).append(
							`<div style="${iframeDivCss}"><iframe id="iframe-player-4a5b6c" src="${url}" style="border:none;" allowfullscreen="true" width="100%" height="100%"></iframe></div>`
						);
					}
				});
		}

		postHandle(container) {
			if (!!GM_getValue(_CONFIG_.autoPlayerKey, null)) {
				util.urlChangeReload();
			} else {
				let oldHref = window.location.href;
				let interval = setInterval(() => {
					let newHref = window.location.href;
					if (oldHref !== newHref) {
						oldHref = newHref;
						if (!!GM_getValue(_CONFIG_.flag, null)) {
							clearInterval(interval);
							window.location.reload();
						}
					}
				}, 1000);
			}
		}

	}

	class DefaultConsumer extends BaseConsumer {}

	return {
		start: () => {
			GM_setValue(_CONFIG_.flag, null);
			let mallCase = 'Default';
			let playerNode = _CONFIG_.playerContainers.filter(value => value.host === window.location.host);
			if (playerNode === null || playerNode.length <= 0) {
				console.warn(window.location.host + "该网站暂不支持");
				return;
			}
			_CONFIG_.currentPlayerNode = playerNode[0];
			mallCase = _CONFIG_.currentPlayerNode.name;
			const targetConsumer = eval(`new ${mallCase}Consumer`);
			targetConsumer.parse();
		}
	}

})();

(function() {
	superVip.start();
})();