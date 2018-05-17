(function(w){
    var gdate = function(){
        function gdateFun(){
            this.getY = (new Date).getFullYear(), 
            this.setY = this.getY,
            this.getM = (new Date).getMonth() + 1,
            this.getD = (new Date).getDate(),
            this.comD = new Date;
            this.cnMonthStr = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
            this.cnDateStr = ["日", "一", "二", "三", "四", "五", "六"];
            return gdateFun.pro.init(this);
        };
                
        gdateFun.pro = gdateFun.prototype = {
            gdateVersion:"这是一个万年历",
            init:function(that){
                // 初始化头
                this.initTem(that,that.getY);
                // 初始化月份
                this.initYear(that,that.getY);
                // 事件集合
                this.addevent(that);
            },
            addevent:function(that){
                DOMgain(".gdate_content").addEventListener('click',function(e){
                    e = e || w.event;
                    let target = e.srcElement || e.target;
                    let datatype = target.getAttribute("data-type");
                    if(datatype){
                        if( datatype === "yeartopre"){
                            // 向前
                            addeventYearPre(that);
                        }else if(datatype === "yeartonext"){
                            // 向后
                            addeventYearNext(that);
                        }else if(datatype === "year") {
                            // 年份
                            let year = target.getAttribute("data");
                            that.getY = that.setY = parseInt(year);
                            DOMgain(".gdate_top").innerHTML = '<div id="gdate_top_btn" data-type="year">' + that.getY + '年</div>';
                            that.comD.setFullYear(that.getY);
                            that.initMonth(that);
                        }else if (datatype == 'month') {
                            let mouth = target.getAttribute("data");
                            that.getM = parseInt(mouth);
                            DOMgain(".gdate_top").innerHTML = '<div id="gdate_top_btn" data-type="month">' + that.getY + '年' + that.getM + '月</div>';
                            that.comD.setMonth(that.getM);
                            that.comD.setDate(1);
                            that.initDay(that);
                        }else if (datatype == 'day') {
                            that.getY = that.setY = parseInt(target.getAttribute("data-year"));
                            that.getM = parseInt(target.getAttribute("data-month"));
                            that.getD = parseInt(target.getAttribute("data-day"));
                            that.comD.setFullYear(that.getY);
                            that.comD.setMonth(that.getM);
                            that.comD.setDate(that.getD);
                            DOMgain(".info").innerHTML = `${that.getY}-${that.getM}-${that.getD}`; 
                            DOMgain(".wrapper").style.display = "none";
                        }
                    }
                });
                DOMgain(".gdate_top").addEventListener('click',function(e){
                    e = e || window.event;
                    let target = e.srcElement || e.target;
                    let datatype = target.getAttribute("data-type");
                    if (datatype) {
                        if (datatype == 'year') {
                            that.initYear(that,that.getY);
                        } else if (datatype == 'month') {
                            DOMgain(".gdate_top").innerHTML = '<div id="gdate_top_btn" data-type="year">' + that.getY + '年</div>';
                            that.initMonth(that);
                        }
                    }
                });
                DOMgain(".info").addEventListener('click',function(){
                    gdate.pro.init(that);
                    DOMgain(".wrapper").style.display = "block";                        
                })
            },
            initTem:function initTem(that){
                DOMgain(".info").innerHTML =  `${that.getY}-${that.getM}-${that.getD}`;
                DOMgain(".wrapper").innerHTML = '<div class="gdate_top">' + that.gdateVersion +'</div><div class="gdate_content"></div>';                    
            },
            initYear:function initYear(that,tyear){
                DOMgain(".gdate_top").innerHTML = this.gdateVersion;
                let temYearPosi = (tyear - 1) % 4;
                let startYear = tyear - temYearPosi - 4;
                let endYear = tyear + 7 - temYearPosi;
                let ht = '<div id="gdate_btn_year_pre" data-type="yeartopre">向前</div>';
                for (var i = startYear; i <= endYear; i++) {
                    if (that.setY == i) {
                        ht += '<div class="gdate_btn_year gdate_btn_year_now" data-type="year" data="' + i + '">' + i + '</div>';
                    } else {
                        ht += '<div class="gdate_btn_year" data-type="year" data="' + i + '">' + i + '</div>';
                    }
                }
                ht += '<div id="gdate_btn_year_la"  data-type="yeartonext">向下</div>';
                
                DOMgain(".gdate_content").innerHTML = ht;
            },
            initMonth:function initMonth(that){
                let ht = '';
                for (let i = 1; i <= 12; i++) {
                    if (that.getM == i) {
                        ht += '<div class="gdate_btn_month gdate_btn_month_now" data-type="month" data="' + i + '">' + that.cnMonthStr[i - 1] + '月</div>';
                    } else {
                        ht += '<div class="gdate_btn_month" data-type="month" data="' + i + '">' + that.cnMonthStr[i - 1] + '月</div>';
                    }
                }
                DOMgain(".gdate_content").innerHTML = ht;
            },
            initDay:function initDay(that){
                let ht = '';
                for (let i = 0; i < 7; i++) {
                    ht += '<div class="gdate_day_top">' + that.cnDateStr[i] + '</div>';
                }
                let xq = (that.comD.getDay() == 7) ? 0 : that.comD.getDay();
                if (xq > 0) {
                    var temYear = that.getY;
                    var temMonth = that.getM;
                    if (that.getM == 1) {
                        temYear--;
                        temMonth = 12;
                    } else {
                        temMonth--;
                    }
                    var daynum = geMonthNum(temYear, temMonth);
                    var temHt = '';
                    for (var temj = 0; temj < xq; temj++) {
                        temHt = '<div class="gdate_day_btn gdate_day_btn_pre" data-type="day" data-year="' + temYear + '" data-month="' + temMonth + '" data-day="' + daynum + '">' + daynum + '</div>' + temHt;
                        daynum--;
                    }
                    ht += temHt;
                }
                    var thisMonthDayNum = geMonthNum(that.getY, that.getM);
                    for (var i = 1; i <= thisMonthDayNum; i++) {
                        if (i == that.getD) {
                            ht += '<div class="gdate_day_btn gdate_day_btn_now" data-type="day" data-year="' + that.getY + '" data-month="' + that.getM + '" data-day="' + i + '">' + i + '</div>';
                        } else {
                            ht += '<div class="gdate_day_btn" data-type="day" data-year="' + that.getY + '" data-month="' + that.getM + '" data-day="' + i + '">' + i + '</div>';
                        }

                    }
                    var nextDay = (xq + thisMonthDayNum) % 7;
                    if (nextDay != 0) {
                        nextDay = 7 - nextDay;

                        temYear = that.getY;
                        temMonth = that.getM;
                        if (that.getM == 12) {
                            temYear++;
                            temMonth = 1;
                        } else {
                            temMonth++;
                        }
                        daynum = 1;
                        temHt = '';
                        for (var temj = 0; temj < nextDay; temj++) {
                            temHt += '<div class="gdate_day_btn gdate_day_btn_next" data-type="day" data-year="' + temYear + '" data-month="' + temMonth + '" data-day="' + daynum + '">' + daynum + '</div>';
                            daynum++;
                        }
                        ht += temHt;
                    }
                    DOMgain(".gdate_content").innerHTML = ht;
            }
            
        }
        
        function geMonthNum(Year, Month) {
            var d = new Date(Year, Month, 0);
            return d.getDate();
        }
        
        function addeventYearPre(that){
            console.log(that.getY);
            // 向前
            that.getY-=8;
            that.initYear(that,that.getY);
        }
        function addeventYearNext(that){
            // 向后
            that.getY+=8;
            that.initYear(that,that.getY);
        }

        function DOMgain(obj){
            // 获取元素
            return document.querySelector(obj);
        }
        return new gdateFun();
    }
    window.gdate = gdate;
    })(window);

