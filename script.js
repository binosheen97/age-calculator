// Populate dropdowns on page load
document.addEventListener('DOMContentLoaded', function() {
    populateDropdowns();
    setTodayAsDefault();
});

function populateDropdowns() {
    const months = [
        { value: '1', name: 'January' },
        { value: '2', name: 'February' },
        { value: '3', name: 'March' },
        { value: '4', name: 'April' },
        { value: '5', name: 'May' },
        { value: '6', name: 'June' },
        { value: '7', name: 'July' },
        { value: '8', name: 'August' },
        { value: '9', name: 'September' },
        { value: '10', name: 'October' },
        { value: '11', name: 'November' },
        { value: '12', name: 'December' }
    ];

    // Populate month dropdowns
    const birthMonth = document.getElementById('birthMonth');
    const targetMonth = document.getElementById('targetMonth');
    
    months.forEach(month => {
        birthMonth.add(new Option(month.name, month.value));
        targetMonth.add(new Option(month.name, month.value));
    });

    // Populate day dropdowns
    const birthDay = document.getElementById('birthDay');
    const targetDay = document.getElementById('targetDay');
    
    for (let i = 1; i <= 31; i++) {
        birthDay.add(new Option(i, i));
        targetDay.add(new Option(i, i));
    }

    // Populate year dropdowns
    const birthYear = document.getElementById('birthYear');
    const targetYear = document.getElementById('targetYear');
    const currentYear = new Date().getFullYear();
    
    for (let i = currentYear; i >= 1900; i--) {
        birthYear.add(new Option(i, i));
    }
    
    for (let i = currentYear + 10; i >= 1900; i--) {
        targetYear.add(new Option(i, i));
    }
}

function setTodayAsDefault() {
    const today = new Date();
    document.getElementById('targetMonth').value = today.getMonth() + 1;
    document.getElementById('targetDay').value = today.getDate();
    document.getElementById('targetYear').value = today.getFullYear();
}

function calculateAge() {
    const birthMonth = document.getElementById('birthMonth').value;
    const birthDay = document.getElementById('birthDay').value;
    const birthYear = document.getElementById('birthYear').value;
    
    const targetMonth = document.getElementById('targetMonth').value;
    const targetDay = document.getElementById('targetDay').value;
    const targetYear = document.getElementById('targetYear').value;

    // Validation
    if (!birthMonth || !birthDay || !birthYear) {
        alert('Please select your complete date of birth');
        return;
    }

    if (!targetMonth || !targetDay || !targetYear) {
        alert('Please select the complete target date');
        return;
    }

    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    const targetDate = new Date(targetYear, targetMonth - 1, targetDay);

    // Validate that target date is not before birth date
    if (targetDate < birthDate) {
        alert('Target date cannot be before birth date');
        return;
    }

    // Calculate age
    const ageData = calculateDetailedAge(birthDate, targetDate);

    // Display results
    displayResults(ageData, birthDate, targetDate);
}

function calculateDetailedAge(birthDate, targetDate) {
    // Calculate years, months, and days
    let years = targetDate.getFullYear() - birthDate.getFullYear();
    let months = targetDate.getMonth() - birthDate.getMonth();
    let days = targetDate.getDate() - birthDate.getDate();

    // Adjust for negative days
    if (days < 0) {
        months--;
        const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
        days += prevMonth.getDate();
    }

    // Adjust for negative months
    if (months < 0) {
        years--;
        months += 12;
    }

    // Calculate total values
    const totalMilliseconds = targetDate - birthDate;
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    return {
        years: years,
        months: months,
        days: days,
        totalMonths: totalMonths,
        totalWeeks: totalWeeks,
        totalDays: totalDays,
        totalHours: totalHours,
        totalMinutes: totalMinutes,
        totalSeconds: totalSeconds
    };
}

function displayResults(ageData, birthDate, targetDate) {
    // Show result section
    document.getElementById('result').style.display = 'block';

    // Display main age
    document.getElementById('ageYears').textContent = ageData.years;
    document.getElementById('ageMonths').textContent = ageData.months;
    document.getElementById('ageDays').textContent = ageData.days;

    // Display detailed breakdown with formatting
    document.getElementById('totalMonths').textContent = ageData.totalMonths.toLocaleString();
    document.getElementById('totalWeeks').textContent = ageData.totalWeeks.toLocaleString();
    document.getElementById('totalDays').textContent = ageData.totalDays.toLocaleString();
    document.getElementById('totalHours').textContent = ageData.totalHours.toLocaleString();
    document.getElementById('totalMinutes').textContent = ageData.totalMinutes.toLocaleString();
    document.getElementById('totalSeconds').textContent = ageData.totalSeconds.toLocaleString();

    // Calculate and display next birthday (only if target date is today or future)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);

    if (target >= today) {
        displayNextBirthday(birthDate, targetDate);
    } else {
        document.getElementById('nextBirthday').style.display = 'none';
    }

    // Smooth scroll to results
    document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function displayNextBirthday(birthDate, currentDate) {
    const today = new Date(currentDate);
    const nextBirthday = new Date(
        today.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate()
    );

    // If birthday has passed this year, set to next year
    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    // Check if birthday is today
    const isToday = 
        today.getDate() === nextBirthday.getDate() &&
        today.getMonth() === nextBirthday.getMonth() &&
        today.getFullYear() === nextBirthday.getFullYear();

    if (isToday) {
        document.getElementById('birthdayInfo').innerHTML = 
            `<strong>🎉 Happy Birthday! Your birthday is TODAY!</strong>`;
        document.getElementById('nextBirthday').style.display = 'block';
        return;
    }

    // Calculate days until birthday
    const daysUntil = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
    const monthsUntil = Math.floor(daysUntil / 30);
    const remainingDays = daysUntil % 30;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const birthdayString = nextBirthday.toLocaleDateString('en-US', options);

    let timeString = '';
    if (monthsUntil > 0) {
        timeString = `${monthsUntil} month${monthsUntil > 1 ? 's' : ''} and ${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
    } else {
        timeString = `${daysUntil} day${daysUntil !== 1 ? 's' : ''}`;
    }

    document.getElementById('birthdayInfo').innerHTML = 
        `Your next birthday is on <strong>${birthdayString}</strong><br>
        That's in <strong>${timeString}</strong>!`;
    document.getElementById('nextBirthday').style.display = 'block';
}
