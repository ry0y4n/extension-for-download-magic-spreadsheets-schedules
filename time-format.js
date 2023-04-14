export function timeFormat(dateString) {

    console.log(dateString)

    let timeString = "";
    let hasCustomTime = false;

    if (!dateString.includes(" ") || dateString.split(" ")[1] === "23:59") hasCustomTime = true;

    if (hasCustomTime) {
        if (dateString.includes(" ")) {
            [dateString, timeString] = dateString.split(" ");
        } else {
            timeString = "00:00";
            dateString += ` ${timeString}`;
        }
    }

    const dateObj = new Date(dateString);

    // 一週間前の日時をフォーマット
    const prevWeekDateObj = new Date(dateObj.getTime() - 7 * 24 * 60 * 60 * 1000);
    if (hasCustomTime) prevWeekDateObj.setHours(0, 0, 0, 0);
    const prevWeekFormattedDate = prevWeekDateObj.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const prevWeekFormattedTime = prevWeekDateObj.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    
    // 当日の日時をフォーマット
    const todayDateObj = new Date(dateObj.getTime());
    if (hasCustomTime) todayDateObj.setHours(23, 59, 0, 0);
    const formattedDate = todayDateObj.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const formattedTime = todayDateObj.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    return [prevWeekFormattedDate, prevWeekFormattedTime, formattedDate, formattedTime]
}