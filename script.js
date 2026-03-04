document.addEventListener('DOMContentLoaded', () => {
    const START_YEAR = 2025;
    const END_YEAR = 2030;

    const redDays = buildRedDays(START_YEAR, END_YEAR);
    let currentRedDayIndex = 0;
    let locale = 'en-NO';

    const dayNumberElement = document.getElementById('day-number');
    const weekdayElement = document.getElementById('weekday');
    const monthElement = document.getElementById('month');
    const redDayNameElement = document.getElementById('red-day-name');
    const calendarYearElement = document.getElementById('calendar-year');
    const daysUntilElement = document.getElementById('days-until');
    const flagButtons = document.querySelectorAll('.flag-button');
    const calendarWeekdaysElement = document.getElementById('calendar-weekdays');

    const labels = {
        'en-NO': {
            title: 'When is the next red day?',
            daysUntil: (days) => (days === 0 ? 'Today' : `In ${days} day${days === 1 ? '' : 's'}`),
            weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        'nb-NO': {
            title: 'Når er neste røde dag?',
            daysUntil: (days) => (days === 0 ? 'I dag' : `Om ${days} dag${days === 1 ? '' : 'er'}`),
            weekdays: ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'],
        },
    };

    function buildRedDays(startYear, endYear) {
        const allDays = [];

        for (let year = startYear; year <= endYear; year++) {
            const easterSunday = getEasterSunday(year);

            const holidays = [
                { date: formatDate(year, 1, 1), nameEn: "New Year's Day", nameNb: 'Første nyttårsdag' },
                { date: formatDate(year, 5, 1), nameEn: 'Labour Day', nameNb: 'Arbeidernes dag' },
                { date: formatDate(year, 5, 17), nameEn: 'Constitution Day', nameNb: 'Grunnlovsdag' },
                { date: formatDate(year, 12, 25), nameEn: 'Christmas Day', nameNb: 'Første juledag' },
                { date: formatDate(year, 12, 26), nameEn: 'Boxing Day', nameNb: 'Andre juledag' },
                {
                    date: formatDateFromDate(addDays(easterSunday, -3)),
                    nameEn: 'Maundy Thursday',
                    nameNb: 'Skjærtorsdag',
                },
                {
                    date: formatDateFromDate(addDays(easterSunday, -2)),
                    nameEn: 'Good Friday',
                    nameNb: 'Langfredag',
                },
                {
                    date: formatDateFromDate(easterSunday),
                    nameEn: 'Easter Sunday',
                    nameNb: 'Første påskedag',
                },
                {
                    date: formatDateFromDate(addDays(easterSunday, 1)),
                    nameEn: 'Easter Monday',
                    nameNb: 'Andre påskedag',
                },
                {
                    date: formatDateFromDate(addDays(easterSunday, 39)),
                    nameEn: 'Ascension Day',
                    nameNb: 'Kristi himmelfartsdag',
                },
                {
                    date: formatDateFromDate(addDays(easterSunday, 49)),
                    nameEn: 'Pentecost Sunday',
                    nameNb: 'Første pinsedag',
                },
                {
                    date: formatDateFromDate(addDays(easterSunday, 50)),
                    nameEn: 'Pentecost Monday',
                    nameNb: 'Andre pinsedag',
                },
            ];

            allDays.push(...holidays);
        }

        return allDays.sort((a, b) => a.date.localeCompare(b.date));
    }

    function getEasterSunday(year) {
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day = ((h + l - 7 * m + 114) % 31) + 1;

        return new Date(year, month - 1, day);
    }

    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function formatDate(year, month, day) {
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    function formatDateFromDate(date) {
        return formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    }

    function findNextRedDayIndex() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const index = redDays.findIndex((day) => new Date(day.date) >= today);
        return index === -1 ? 0 : index;
    }

    function formatHolidayName(holiday) {
        return locale === 'nb-NO' ? holiday.nameNb : holiday.nameEn;
    }

    function renderWeekdayHeaders() {
        calendarWeekdaysElement.innerHTML = '';

        labels[locale].weekdays.forEach((label) => {
            const weekdayElement = document.createElement('div');
            weekdayElement.textContent = label;
            calendarWeekdaysElement.appendChild(weekdayElement);
        });
    }

    function displayRedDay() {
        const currentRedDay = redDays[currentRedDayIndex];
        const date = new Date(currentRedDay.date);

        dayNumberElement.textContent = date.getDate();
        weekdayElement.textContent = date.toLocaleDateString(locale, { weekday: 'long' });
        monthElement.textContent = date.toLocaleDateString(locale, { month: 'long' });
        redDayNameElement.textContent = formatHolidayName(currentRedDay);
        calendarYearElement.textContent = date.getFullYear();

        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const msPerDay = 24 * 60 * 60 * 1000;
        const diffDays = Math.round((date - now) / msPerDay);
        daysUntilElement.textContent = labels[locale].daysUntil(diffDays);

        renderWeekdayHeaders();
        displayCalendar(date.getMonth(), date.getFullYear(), currentRedDay.date);
    }

    function showNextRedDay() {
        currentRedDayIndex = currentRedDayIndex < redDays.length - 1 ? currentRedDayIndex + 1 : 0;
        displayRedDay();
    }

    function showPreviousRedDay() {
        currentRedDayIndex = currentRedDayIndex > 0 ? currentRedDayIndex - 1 : redDays.length - 1;
        displayRedDay();
    }

    function displayCalendar(month, year, selectedDateString) {
        const calendarElement = document.getElementById('calendar');
        calendarElement.innerHTML = '';

        const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = formatDateFromDate(new Date());

        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('day', 'empty');
            calendarElement.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');
            dayElement.textContent = day;

            const formattedDate = formatDate(year, month + 1, day);
            if (redDays.some((redDay) => redDay.date === formattedDate)) {
                dayElement.classList.add('red-day');
            }
            if (formattedDate === selectedDateString) {
                dayElement.classList.add('selected-day');
            }
            if (formattedDate === today) {
                dayElement.classList.add('current-day');
            }

            calendarElement.appendChild(dayElement);
        }
    }

    function setLocale(nextLocale) {
        locale = nextLocale;
        document.querySelector('.container h2').textContent = labels[locale].title;

        flagButtons.forEach((button) => {
            const isActive = button.dataset.locale === locale;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });

        displayRedDay();
    }

    document.querySelector('.left').addEventListener('click', showPreviousRedDay);
    document.querySelector('.right').addEventListener('click', showNextRedDay);
    flagButtons.forEach((button) => {
        button.addEventListener('click', () => setLocale(button.dataset.locale));
    });

    currentRedDayIndex = findNextRedDayIndex();
    setLocale(locale);
});
