// Set today's date as default for target date
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('targetDate').value = today;
});

function calculateAge() {
    const birthDateInput = document.getElementById('birthDate').value;
    const targetDateInput = document.getElementById('targetDate').value;

    // Validation
    if (!birthDateInput) {
        alert('Please enter your date of birth');
        return;
    }

    if (!targetDateInput) {
        alert('Please enter the target date');
        return;
    }

    const birthDate = new Date(birthDateInput);
    const targetDate = new Date(targetDateInput);

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

// Allow Enter key to calculate
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('birthDate').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculateAge();
    });
    document.getElementById('targetDate').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculateAge();
    });
});
