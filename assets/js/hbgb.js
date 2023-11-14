// ==UserScript==
// @name         河北干部网络学院
// @namespace    https://www.hebgb.gov.cn/
// @version      1.0.0
// @description  代码仅供交流学习，下载后请在24小时内删除，不得用于违规违法用途。
// @author       阿晨
// @match        https://www.hebgb.gov.cn/*
// @icon         https://www.hebgb.gov.cn/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==
var video;
var href1 = location.href;

if(href1.toString().includes("www.hebgb.gov.cn/student/class_detail_course.do")){
    GM_setValue("class_detail_course", href1);
    let id=document.getElementsByClassName("hover_btn")[0].onclick.toString().substr(33,9);
    creatElement();
    document.getElementById("chen_div1").onclick=function(){
        window.open("https://www.hebgb.gov.cn/portal/study_play.do?id="+id+"&beisu="+1.5);
    }
    document.getElementById("chen_div2").onclick=function(){
        window.open("https://www.hebgb.gov.cn/portal/study_play.do?id="+id+"&beisu="+3);
    }
    document.getElementById("chen_div3").onclick=function(){
        window.open("https://www.hebgb.gov.cn/portal/study_play.do?id="+id+"&beisu="+5);
    }
	document.getElementById("chen_div4").onclick=function(){
	    window.open("https://www.hebgb.gov.cn/portal/study_play.do?id="+id+"&beisu="+16);
	}
    if(GetQueryString("beisu")!=null){
        location.href="https://www.hebgb.gov.cn/portal/study_play.do?id="+id+"&beisu="+GetQueryString("beisu");
    }

}
if(href1.toString().includes("www.hebgb.gov.cn/portal/study_play.do")){
    if(GetQueryString("beisu")!=null){
        setTimeout(function(){
            document.getElementsByClassName("user_choise")[0].click();
            document.getElementsByClassName("first_title")[0].click();
            video = document.getElementById("course_player");
            video.volume = 0;
            video.play(1);
            video.playbackRate = GetQueryString("beisu")||1;
        },500)
        setInterval(function(){
            if(video.ended){
                location.href=GM_getValue("class_detail_course", href1)+"&beisu="+GetQueryString("beisu");
            }
        },3000);
    }
}

function creatElement(){
    let chen_div = document.createElement("div");
    chen_div.innerHTML ='<div style="width: 260px;height: 400px;position:fixed;background-color:#FF0000;top:50px;color: White;left: 3px;;"> <br>声明：本代码仅供交流学习，下载后请在24小时内删除，不得用于违规违法用途。 <div id="chen_div1" style="background-color: #ffcccc;color: black;position: relative;width: 215px;left: 15px;top: 20px;cursor: pointer;"> 点击自动开始学习（1.5倍速） </div> <br> <div id="chen_div2" style="background-color: #ffcccc;color: black;position: relative;width: 215px;left: 15px;top: 20px;cursor: pointer;"> 点击自动开始学习（3.0倍速） </div> <br> <div id="chen_div3" style="background-color: #ffcccc;color: black;position: relative;width: 215px;left: 15px;top: 20px;cursor: pointer;"> 点击自动开始学习（5.0倍速）</div>  <br> <div id="chen_div4" style="background-color: #ffcccc;color: black;position: relative;width: 215px;left: 15px;top: 20px;cursor: pointer;"> 点击自动开始学习（16倍速） </div> <br> <div style="position: relative;top: 20px;left: 3px;"> 使用须知：<br>&nbsp;&nbsp;1、网站自身只支持1.5倍速；<br> &nbsp;&nbsp;2、根据自身网速设置，网速太慢视频加载不出来，倍速再大也没用。<br> &nbsp;&nbsp;3、学完了自动从头继续学（不用管） </div> </div>';
    document.getElementsByTagName("body")[0].append(chen_div);
}
function closeWin() {
    try {
        window.opener = window;
        var win = window.open("","_self");
        win.close();
        top.close();
    } catch (e) {
    }
}
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return (r[2]); return null;
}
