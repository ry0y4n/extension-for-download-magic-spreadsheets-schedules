function waitLoad() {
    console.log("waitLoad")
    const jsInitCheckTimer = setInterval(jsLoaded, 1000);

    function jsLoaded() {
        console.log("jsLoaded");
        let dom1 = document.querySelectorAll("div.notion-collection_view_page-block")[2];
    
        // 読み込まれた後の処理
        if (dom1 != undefined) {
            clearInterval(jsInitCheckTimer);

            console.log("clearInterval");

            let topbarLast = document.querySelector("div[style='user-select: none; transition: background 20ms ease-in 0s; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 32px; height: 28px; border-radius: 3px;']");
            let downloadButton = document.createElement("div");
            downloadButton.innerHTML = "ダウンロード";
            downloadButton.style.cssText = "user-select: none; transition: background 20ms ease-in 0s; cursor: pointer; display: inline-flex; align-items: center; flex-shrink: 0; white-space: nowrap; height: 28px; border-radius: 4px; font-size: 14px; line-height: 1.2; min-width: 0px; padding-left: 8px; padding-right: 8px; color: rgba(255, 255, 255, 0.81);";
            downloadButton.addEventListener("mouseover", () => downloadButton.style.background = "rgba(255, 255, 255, 0.055)");
            downloadButton.addEventListener("mouseleave", () => downloadButton.style.background = "#191919");
            downloadButton.addEventListener("click", () => {
                download(dom1);
            })
            topbarLast.parentNode.insertBefore(downloadButton, topbarLast);

            // Subject=イベント，Start Time=3日前の0時，End Time=締め切り（時間がなければその日の23:59），Description=リンク等
        }
    }
}

function download(dom1) {
    let csvData = "Subject, Start date, Start time, End Date, End Time, Description\n";
    let headers = []
    let headersDiv = dom1.querySelector("div[style='display: inline-flex; margin: 0px;']").children;
    Array.prototype.forEach.call(headersDiv, (headerDiv) => {
        headers.push(headerDiv.querySelector("div[style='white-space: nowrap; overflow: hidden; text-overflow: ellipsis;']").textContent);
    })
    console.log(headers);
    let dom2 = dom1.children[2];
    let rows = dom2.children;

    Array.prototype.forEach.call(rows, (row, index) => {
        if (index === 0) return;

        let deadlineDiv = row.children[headers.indexOf("締め切り")].querySelector("div[style^='line-height: 1.5; white-space: pre-wrap; word-break: break-word; pointer-events: none;']")
        if (deadlineDiv == undefined) {
            // No Deadline
            return;
        } else {
            // イベント名
            let subject = row.children[headers.indexOf("イベント")].querySelector("span").textContent;
            subject = subject.replace(",", "，");
            console.log(row.children[headers.indexOf("イベント")].querySelector("span").textContent);

            // 締め切り
            console.log(deadlineDiv.textContent);
            let [prevWeekFormattedDate, prevWeekFormattedTime, formattedDate, formattedTime] = timeFormat(deadlineDiv.textContent);
            console.log(prevWeekFormattedDate, prevWeekFormattedTime, formattedDate, formattedTime);
            
            // リンク
            let description = row.children[headers.indexOf("リンク")].querySelector("a").textContent;
            console.log(row.children[headers.indexOf("リンク")].querySelector("a").textContent);

            csvData += `${subject}, ${prevWeekFormattedDate}, ${prevWeekFormattedTime}, ${formattedDate}, ${formattedTime}, ${description}\n`;
        }
    });
    console.log();

    const filename = "download.csv";
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, csvData], { type: "text/csv" });

    //BlobからオブジェクトURLを作成する
    const url = (window.URL || window.webkitURL).createObjectURL(blob);
    //ダウンロード用にリンクを作成する
    const download = document.createElement("a");
    //リンク先に上記で生成したURLを指定する
    download.href = url;
    //download属性にファイル名を指定する
    download.download = filename;
    //作成したリンクをクリックしてダウンロードを実行する
    download.click();
    //createObjectURLで作成したオブジェクトURLを開放する
    (window.URL || window.webkitURL).revokeObjectURL(url);
}

function timeFormat(dateString) {
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

window.addEventListener("load", waitLoad, false);