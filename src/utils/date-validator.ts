export function parseDate(dateStr: string): Date | false {
    var timestamp = Date.parse(dateStr);

    if (isNaN(timestamp) == false) {
        return new Date(timestamp);
    } else {
        return false;
    }
}

export function parseTimestampToDate(timestamp: string | number) {
    if (!isNaN(+timestamp) && +timestamp > 0) {
        return new Date(+timestamp);
    } else {
        return false;
    }
}
