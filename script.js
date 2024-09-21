document.addEventListener("DOMContentLoaded", function() {
    const redDays = [
        { date: '2024-01-01', name: 'New Year\'s Day' },
        { date: '2024-04-01', name: 'Easter Monday' },
        { date: '2024-05-01', name: 'Labour Day' },
        { date: '2024-05-17', name: 'Constitution Day' },
        { date: '2024-12-25', name: 'Christmas Day' },
        { date: '2025-01-01', name: 'New Year\'s Day' }, // Added red days for next year
        { date: '2025-04-01', name: 'Easter Monday' },
        { date: '2025-05-01', name: 'Labour Day' },
        { date: '2025-05-17', name: 'Constitution Day' },
        { date: '2025-12-25', name: 'Christmas Day' },
    ];

    let currentRedDayIndex = 0;

    function findNextRedDay() {
        const today = new Date();
        const futureRedDays = redDays.filter(day => new Date(day.date) >= today);
        futureRedDays.sort((a, b) => new Date(a.date) - new Date(b.date));
        currentRedDayIndex = redDays.indexOf(futureRedDays[0]);
        displayRedDay();
    }

    function displayRedDay() {
        const currentRedDay = redDays[currentRedDayIndex];
        const date = new Date(currentRedDay.date);

        const dayNumberElement = document.getElementById('day-number');
        const weekdayElement = document.getElementById('weekday');
        const monthElement = document.getElementById('month');
        const redDayNameElement = document.getElementById('red-day-name');
        const calendarYearElement = document.getElementById('calendar-year');

        dayNumberElement.textContent = date.getDate();
        weekdayElement.textContent = date.toLocaleDateString('en-NO', { weekday: 'long' });
        monthElement.textContent = date.toLocaleDateString('en-NO', { month: 'long' });
        redDayNameElement.textContent = currentRedDay.name;
        calendarYearElement.textContent = date.getFullYear(); // Display the current year above the calendar

        displayCalendar(date.getMonth(), date.getFullYear());
    }

    function showNextRedDay() {
        if (currentRedDayIndex < redDays.length - 1) {
            currentRedDayIndex++;
        } else {
            currentRedDayIndex = 0; // Loop back to the start
        }
        displayRedDay();
    }

    function showPreviousRedDay() {
        if (currentRedDayIndex > 0) {
            currentRedDayIndex--;
        } else {
            currentRedDayIndex = redDays.length - 1; // Loop back to the last red day
        }
        displayRedDay();
    }

    function displayCalendar(month, year) {
        const calendarElement = document.getElementById('calendar');
        calendarElement.innerHTML = '';

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('day', 'empty');
            calendarElement.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');
            dayElement.textContent = day;

            const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            if (redDays.some(redDay => redDay.date === formattedDate)) {
                dayElement.classList.add('red-day');
            }

            calendarElement.appendChild(dayElement);
        }
    }

    document.querySelector('.left').addEventListener('click', showPreviousRedDay);
    document.querySelector('.right').addEventListener('click', showNextRedDay);

    findNextRedDay();
});
