// 달력 만들기
// mainYear : 표시하고자 하는 년
// mainMonth : 표시하고자 하는 월
// todayYear : 오늘 날자 년
// todayMonth : 오늘 날자 월
// todayDay : 오늘 날자 일
var XCalendar = function(mainYear, mainMonth, todayYear, todayMonth, todayDay) {
    // 1일 밀리초
    var oneDayMS = 86400000;
    // 오늘 날자 데이터
    var todayDate = new Date(todayYear, (todayMonth - 1), todayDay, 0, 0, 0);
    // 오늘 날자 정보
    var todayInfo = {
        // 년
        Year : todayDate.getFullYear(),
        // 월
        Month : (todayDate.getMonth() + 1),
        // 일
        Day : todayDate.getDate(),
        // 요일 번호
        DayWeek : todayDate.getDay(),
        // 월 (2자리 텍스트)
        MonthText : '',
        // 일 (2자리 텍스트)
        DayText : '',
        // 아이디
        ID : '',
        // 표시 텍스트
        DisplayText : ''
    };

    todayInfo.MonthText = ('0' + todayInfo.Month).slice(-2);
    todayInfo.DayText = ('0' + todayInfo.Day).slice(-2);
    todayInfo.ID = ('day' + todayInfo.Year + todayInfo.MonthText + todayInfo.DayText);
    todayInfo.DisplayText = (todayInfo.Year + '년 ' + todayInfo.MonthText + '월 ' + todayInfo.DayText + '일');
    
    // 지정된 월의 일 구성
    var CreateMonthDay = function(sourceDate) {
        var result = {
            // 년
            Year : sourceDate.getFullYear(),
            // 월
            Month : (sourceDate.getMonth() + 1),
            // 월 - 표시용으로 2자리
            MonthText : '',
            // 아이디
            ID : '',
            // 표시 텍스트
            DisplayText : '',
            // 날자 정보 리스트 (** 숫자배열 타입) (42 : 7일 6주)
            DayInfo : [],
            // 날자 정보 리스트 (** 문자열 배열 타입 - YYYYMMDD) (42 : 7일 6주)
            DayInfo2 : []
        };

        result.MonthText = ('0' + result.Month).slice(-2);
        result.ID = ('month' + result.Year + result.MonthText);
        result.DisplayText = (result.Year + '년 ' + result.MonthText + '월');
        
        // 작업용 변수 구성
        // ** sourceDate를 그대로 쓰면 원본도 같이 바뀌어 문제되기도 하지만
        //    sourceDate의 일자가 항상 1일이 아님둥 ㅎㅎㅎ 그래서 1일로 고정을 위함
        var workDate = new Date(sourceDate.getFullYear(), sourceDate.getMonth(), 1, 0, 0, 0);
        // 뿌리는 달의 날자 수정해서 달력이 항상 첫주 일요일 부터 시작하도록 함
        workDate.setTime((workDate.getTime() - (oneDayMS * workDate.getDay())));

        // 42 : 일 ~ 토까지 6주를 표시하기 위함 (** 참고 윈도우 달력 ㅋㅋㅋ)
        for(var i=0; i<42; i++) {
            // 리스트에 등록
            var dayItem = {
                // 년
                Year : workDate.getFullYear(),
                // 월
                Month : (workDate.getMonth() + 1),
                // 일
                Day : workDate.getDate(),
                // 요일 번호
                DayWeek : workDate.getDay(),
                // 월 (2자리 텍스트)
                MonthText : '',
                // 일 (2자리 텍스트)
                DayText : '',
                // 전체 일자 텍스트 (8자리 텍스트)
                FullDateText : '',
                // 아이디
                ID : '',
                // 표시 텍스트
                DisplayText : '',
                // 메인 월에 포함됨 여부
                IsMainMonth : ((workDate.getFullYear() == sourceDate.getFullYear()) && (workDate.getMonth() == sourceDate.getMonth())),
                // 오늘인지 여부
                IsToday : (workDate.getTime() == todayDate.getTime())
            };

            dayItem.MonthText = ('0' + dayItem.Month).slice(-2);
            dayItem.DayText = ('0' + dayItem.Day).slice(-2);
            dayItem.FullDateText = (dayItem.Year + dayItem.MonthText + dayItem.DayText);
            dayItem.ID = ('day' + dayItem.FullDateText);
            dayItem.DisplayText = (dayItem.Year + '년 ' + dayItem.MonthText + '월 ' + dayItem.DayText + '일');

            result.DayInfo[result.DayInfo.length] = dayItem;
            result.DayInfo2[dayItem.FullDateText] = dayItem;

            // +1일
            workDate.setTime((workDate.getTime() + oneDayMS));
        }

        return result;
    };

    // 월 생성 및 계산
    var CreateMonthAndDayInfo = function(year, monthWork) {
        // 보이고자 하는 월 구성
        var main = new Date(year, monthWork, 1, 0, 0, 0);

        // 이전 달 : 보이고자 하는 월, 1일에서 1일만 뺌
        var previous = new Date(year, monthWork, 1, 0, 0, 0);
        previous.setTime((previous.getTime() - oneDayMS));

        // 다음 달 : 보이고자 하는 월, 1일에서 35일 더하기
        var next = new Date(year, monthWork, 1, 0, 0, 0);
        next.setTime((next.getTime() + (oneDayMS * 35)));

        // 월의 일 데이터 만들기
        var result = {
            previous : CreateMonthDay(previous),
            main : CreateMonthDay(main),
            next : CreateMonthDay(next)
        };

        return result;
    };

    // 만들어진 월의 일 데이터들
    var monthDayInfo = CreateMonthAndDayInfo(mainYear, (mainMonth - 1));
    
    return {
        // 오늘 날자 정보
        TodayInfo : todayInfo,
        // 이전 월 정보
        PreviousMonth : function() {
            return monthDayInfo.previous;
        },
        // 메인 월 정보
        MainMonth : function() {
            return monthDayInfo.main;
        },
        // 다음 월 정보
        NextMonth : function() {
            return monthDayInfo.next;
        },
        // 메인 월을 이전월로 이동
        MovePreviousMonth : function() {
            monthDayInfo = CreateMonthAndDayInfo(monthDayInfo.previous.Year, (monthDayInfo.previous.Month - 1));
        },
        // 메인 월을 다음월로 이동
        MoveNextMonth : function() {
            monthDayInfo = CreateMonthAndDayInfo(monthDayInfo.next.Year, (monthDayInfo.next.Month - 1));
        },
        // 메인 월을 오늘이 포함된 월로 이동
        MoveTodayMonth : function() {
            monthDayInfo = CreateMonthAndDayInfo(todayDate.getFullYear(), todayDate.getMonth());
        },
        // 오늘 날자가 포함된 메인 월인지 확인
        IsTodayInMainMonth : function() {
            return ((monthDayInfo.main.Year == todayInfo.Year) && (monthDayInfo.main.Month == todayInfo.Month));
        }
    };
};