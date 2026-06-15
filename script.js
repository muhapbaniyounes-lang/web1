// =============================================
// Attendance Management System - JavaScript
// =============================================

// Set today's date on the attendance page
window.addEventListener('DOMContentLoaded', function () {
    var dateInput = document.getElementById('attendanceDate');
    if (dateInput) {
        var today = new Date();
        var yyyy = today.getFullYear();
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = yyyy + '-' + mm + '-' + dd;
    }

    // Update summary on load
    updateSummary();
});


// =============================================
// ATTENDANCE PAGE
// =============================================

// Search student in attendance table
function searchStudent() {
    var input = document.getElementById('searchInput');
    var searchText = input.value.trim().toLowerCase();
    var table = document.getElementById('attendanceTable');
    var rows = table.getElementsByTagName('tr');
    var found = false;
    var resultMsg = document.getElementById('searchResult');

    if (searchText === '') {
        clearSearch();
        return;
    }

    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        if (cells.length > 0) {
            var id = cells[0].textContent.toLowerCase();
            var name = cells[1].textContent.toLowerCase();

            if (id.indexOf(searchText) !== -1 || name.indexOf(searchText) !== -1) {
                rows[i].style.display = '';
                found = true;
            } else {
                rows[i].style.display = 'none';
            }
        }
    }

    if (!found) {
        resultMsg.textContent = 'No student found matching "' + searchText + '"';
        resultMsg.style.display = 'block';
    } else {
        resultMsg.style.display = 'none';
    }
}

// Clear search and show all rows
function clearSearch() {
    var table = document.getElementById('attendanceTable');
    if (!table) return;
    var rows = table.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
        rows[i].style.display = '';
    }
    var input = document.getElementById('searchInput');
    if (input) input.value = '';
    var resultMsg = document.getElementById('searchResult');
    if (resultMsg) resultMsg.style.display = 'none';
}

// Save attendance
function saveAttendance() {
    updateSummary();
    var alert = document.getElementById('saveAlert');
    alert.style.display = 'block';
    setTimeout(function () {
        alert.style.display = 'none';
    }, 3000);
}

// Mark all Present
function markAllPresent() {
    var table = document.getElementById('attendanceTable');
    var radios = table.querySelectorAll('input[type="radio"][value="Present"]');
    for (var i = 0; i < radios.length; i++) {
        radios[i].checked = true;
    }
    updateSummary();
}

// Mark all Absent
function markAllAbsent() {
    var table = document.getElementById('attendanceTable');
    var radios = table.querySelectorAll('input[type="radio"][value="Absent"]');
    for (var i = 0; i < radios.length; i++) {
        radios[i].checked = true;
    }
    updateSummary();
}

// Update summary counts
function updateSummary() {
    var table = document.getElementById('attendanceTable');
    if (!table) return;

    var rows = table.getElementsByTagName('tr');
    var total = 0;
    var present = 0;
    var absent = 0;
    var late = 0;

    for (var i = 0; i < rows.length; i++) {
        var radios = rows[i].querySelectorAll('input[type="radio"]');
        if (radios.length > 0) {
            total++;
            for (var j = 0; j < radios.length; j++) {
                if (radios[j].checked) {
                    if (radios[j].value === 'Present') present++;
                    else if (radios[j].value === 'Absent') absent++;
                    else if (radios[j].value === 'Late') late++;
                }
            }
        }
    }

    var totalEl = document.getElementById('summaryTotal');
    var presentEl = document.getElementById('summaryPresent');
    var absentEl = document.getElementById('summaryAbsent');
    var lateEl = document.getElementById('summaryLate');

    if (totalEl) totalEl.textContent = total;
    if (presentEl) presentEl.textContent = present;
    if (absentEl) absentEl.textContent = absent;
    if (lateEl) lateEl.textContent = late;
}

// Listen for radio changes to update summary live
document.addEventListener('change', function (e) {
    if (e.target && e.target.type === 'radio') {
        var table = document.getElementById('attendanceTable');
        if (table && table.contains(e.target)) {
            updateSummary();
        }
    }
});


// =============================================
// STUDENTS PAGE
// =============================================

// Add a new student
function addStudent(event) {
    event.preventDefault();

    var id = document.getElementById('newStudentId').value.trim();
    var name = document.getElementById('newStudentName').value.trim();
    var email = document.getElementById('newStudentEmail').value.trim();
    var major = document.getElementById('newStudentMajor').value;

    var alertSuccess = document.getElementById('addStudentAlert');
    var alertError = document.getElementById('addStudentError');

    if (id === '' || name === '') {
        alertError.style.display = 'block';
        alertSuccess.style.display = 'none';
        setTimeout(function () { alertError.style.display = 'none'; }, 3000);
        return;
    }

    var table = document.getElementById('studentTable');
    var rowCount = table.getElementsByTagName('tr').length + 1;

    var newRow = document.createElement('tr');
    newRow.setAttribute('data-id', id);
    newRow.innerHTML =
        '<td>' + rowCount + '</td>' +
        '<td>' + id + '</td>' +
        '<td>' + name + '</td>' +
        '<td>' + (email || '-') + '</td>' +
        '<td>' + major + '</td>' +
        '<td><button class="btn-red btn-small" onclick="deleteStudent(this)">Delete</button></td>';

    table.appendChild(newRow);

    updateStudentCount();

    alertSuccess.style.display = 'block';
    alertError.style.display = 'none';
    setTimeout(function () { alertSuccess.style.display = 'none'; }, 3000);

    document.getElementById('addStudentForm').reset();
}

// Delete a student
function deleteStudent(button) {
    var confirmed = confirm('Are you sure you want to delete this student?');
    if (confirmed) {
        var row = button.parentElement.parentElement;
        row.remove();
        updateStudentCount();
        renumberStudents();
    }
}

// Update student count
function updateStudentCount() {
    var table = document.getElementById('studentTable');
    if (table) {
        var count = table.getElementsByTagName('tr').length;
        var countEl = document.getElementById('studentCount');
        if (countEl) countEl.textContent = count;
    }
}

// Renumber students after deletion
function renumberStudents() {
    var table = document.getElementById('studentTable');
    if (table) {
        var rows = table.getElementsByTagName('tr');
        for (var i = 0; i < rows.length; i++) {
            rows[i].getElementsByTagName('td')[0].textContent = i + 1;
        }
    }
}

// Filter students by search
function filterStudents() {
    var input = document.getElementById('studentSearchInput');
    var searchText = input.value.trim().toLowerCase();
    var table = document.getElementById('studentTable');
    var rows = table.getElementsByTagName('tr');

    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        if (cells.length > 1) {
            var id = cells[1].textContent.toLowerCase();
            var name = cells[2].textContent.toLowerCase();

            if (id.indexOf(searchText) !== -1 || name.indexOf(searchText) !== -1) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    }
}


// =============================================
// REPORTS PAGE
// =============================================

// Filter report by status
function filterReport() {
    var statusFilter = document.getElementById('reportStatus');
    if (!statusFilter) return;

    var filter = statusFilter.value;
    var table = document.getElementById('reportTable');
    var rows = table.getElementsByTagName('tr');

    for (var i = 0; i < rows.length; i++) {
        var percentage = parseInt(rows[i].getAttribute('data-percentage'));
        var show = false;

        if (filter === 'all') {
            show = true;
        } else if (filter === 'good' && percentage >= 75) {
            show = true;
        } else if (filter === 'warning' && percentage >= 50 && percentage < 75) {
            show = true;
        } else if (filter === 'danger' && percentage < 50) {
            show = true;
        }

        rows[i].style.display = show ? '' : 'none';
    }
}

// Reset report filter
function resetFilter() {
    var statusFilter = document.getElementById('reportStatus');
    if (statusFilter) statusFilter.value = 'all';
    filterReport();
}


// =============================================
// CONTACT PAGE
// =============================================

// Submit contact form
function submitContact(event) {
    event.preventDefault();

    var name = document.getElementById('contactName').value.trim();
    var email = document.getElementById('contactEmail').value.trim();
    var message = document.getElementById('contactMessage').value.trim();

    var alertSuccess = document.getElementById('contactAlert');
    var alertError = document.getElementById('contactError');

    if (name === '' || email === '' || message === '') {
        alertError.style.display = 'block';
        alertSuccess.style.display = 'none';
        setTimeout(function () { alertError.style.display = 'none'; }, 3000);
        return;
    }

    alertSuccess.style.display = 'block';
    alertError.style.display = 'none';
    setTimeout(function () { alertSuccess.style.display = 'none'; }, 3000);

    document.getElementById('contactForm').reset();
}

// Reset contact form
function resetContactForm() {
    document.getElementById('contactForm').reset();
}
